import React,{useEffect,useMemo,useRef,useState} from 'react';
import {AudioLines,ArrowLeft,BookOpen,Check,CheckCircle2,ChevronLeft,Headphones,Mic,MicOff,Pause,Play,RotateCcw,Volume2,Target,X} from 'lucide-react';
import AudioLessonArt from './AudioLessonArt.jsx';
import {lessonAudioCards,soundMeaningOptions,verifyAudioDictation,AUDIO_LEARNING_MODES,audioLearningItemKey,parseAudioLearningStats,audioLearningSummary} from './audioLearningData.js';
import {scoreSpeechMatch} from './speakingEngine.js';
import './lessonAudioButtons.css';

const STATS_KEY='dt_audio_learning_v1';
function savedStats(){
 try{return parseAudioLearningStats(localStorage.getItem(STATS_KEY));}
 catch{return parseAudioLearningStats({});}
}
function getRecognizer(){
 if(typeof window==='undefined')return null;
 return window.SpeechRecognition||window.webkitSpeechRecognition||null;
}
function Waveform({active=false}){
 const heights=[7,14,10,22,14,30,17,12,27,18,10,22,13,7];
 return <span className={'alWave '+(active?'playing':'')} aria-hidden="true">
  {heights.map((n,i)=><span key={i} style={{height:n+'px'}}/>)}
 </span>;
}
async function requestPlayback(track){
 const params=new URLSearchParams({book:track.book,path:track.path});
 const response=await fetch('/api/audio/play?'+params.toString(),{cache:'no-store'});
 const json=await response.json().catch(()=>({}));
 if(!response.ok||!json.url?.startsWith('/api/audio/stream?'))
  throw new Error('پخش این قطعه فعلاً ممکن نیست.');
 return json.url;
}

export default function LessonAudioButtons({lessonId,speak=()=>{},onPracticeEvent}){
 const cards=useMemo(()=>lessonAudioCards(lessonId),[lessonId]);
 const [showAll,setShowAll]=useState(false);
 const [stats,setStats]=useState(savedStats);
 const [selected,setSelected]=useState(0);
 const [tracks,setTracks]=useState([]);
 const [trackId,setTrackId]=useState('');
 const [trackPlaying,setTrackPlaying]=useState(false);
 const [trackError,setTrackError]=useState('');
 const player=useRef(null);
 const [quizMode,setQuizMode]=useState('dictation');
 const [quizIndex,setQuizIndex]=useState(0);
 const [quizInput,setQuizInput]=useState('');
 const [quizAnswer,setQuizAnswer]=useState(null);
 const [recording,setRecording]=useState(false);
 const [speech,setSpeech]=useState(null);
 const [micError,setMicError]=useState('');
 const recognizer=useRef(null);
 const recogSequence=useRef(0);
 const supported=Boolean(getRecognizer());
 const summary=audioLearningSummary(stats,lessonId);
 const current=cards[selected]||cards[0];
 const quizCard=cards[quizIndex%Math.max(cards.length,1)];
 const mode=AUDIO_LEARNING_MODES.find(x=>x.id===quizMode);
 const meaningChoices=useMemo(()=>soundMeaningOptions(cards,quizIndex%Math.max(cards.length,1)),[cards,quizIndex]);
 useEffect(()=>{try{localStorage.setItem(STATS_KEY,JSON.stringify(stats));}catch{}},[stats]);
 useEffect(()=>{
  const controller=new AbortController();
  setTracks([]);setTrackId('');setTrackError('');setTrackPlaying(false);
  fetch('/api/audio/catalog?lesson='+lessonId,{signal:controller.signal,cache:'no-store'})
   .then(response=>response.ok?response.json():null)
   .then(data=>{
    if(!controller.signal.aborted&&data?.configured&&Array.isArray(data.tracks))
      setTracks(data.tracks.filter(t=>t?.book&&t?.path&&t?.filename));
   }).catch(()=>{});
  return ()=>{controller.abort();player.current?.pause();};
 },[lessonId]);
 useEffect(()=>{
  // Abort a microphone session on lesson change or unmount; no audio is stored.
  return ()=>{recogSequence.current++;try{recognizer.current?.abort();}catch{}recognizer.current=null;};
 },[lessonId]);
 useEffect(()=>{
  if(player.current)player.current.pause();
  setSelected(0);setQuizIndex(0);setQuizMode('dictation');setQuizInput('');setQuizAnswer(null);
  setSpeech(null);setMicError('');setRecording(false);setShowAll(false);
 },[lessonId]);
 function registerPlay(card){
  try{speak(card.text);}catch{}
  const key=audioLearningItemKey(lessonId,card.id,'listen');
  setStats(old=>({...old,plays:{...old.plays,[key]:(old.plays[key]||0)+1}}));
 }
 function stopRecording(){
  recogSequence.current++;
  try{recognizer.current?.abort();}catch{}
  recognizer.current=null;
  setRecording(false);
 }
 function startRecording(card){
  const Ctor=getRecognizer();
  if(!Ctor){
   setMicError('تشخیص گفتار آلمانی در این مرورگر پشتیبانی نمی‌شود. در Chrome با مجوز میکروفون امتحان کن.');
   setSpeech(null);return;
  }
  stopRecording();
  setSpeech(null);setMicError('');
  let instance;
  try{
   instance=new Ctor();instance.lang='de-DE';instance.continuous=false;
   instance.interimResults=false;instance.maxAlternatives=3;
  }catch{setMicError('راه‌اندازی میکروفون ممکن نشد.');return;}
  const seq=++recogSequence.current;
  recognizer.current=instance;
  instance.onresult=event=>{
   if(seq!==recogSequence.current)return;
   const result=event.results?.[0];
   const candidates=Array.from(result||[]).map(x=>x.transcript).filter(Boolean);
   if(!candidates.length){setMicError('صدای مشخصی تشخیص داده نشد. دوباره امتحان کن.');return;}
   const comparison=candidates.map(heard=>({heard,...scoreSpeechMatch(card.text,heard,'sentences')}))
      .sort((a,b)=>b.score-a.score)[0];
   setSpeech({cardId:card.id,...comparison});
   const key=audioLearningItemKey(lessonId,card.id,'repeat');
   setStats(old=>({...old,
    completed:{...old.completed,...(comparison.score>=80?{[key]:true}:{})},
    speech:{...old.speech,[key]:{lesson:Number(lessonId),score:comparison.score,heard:comparison.heard,at:Date.now()}}
   }));
   if(quizMode==='repeat')setQuizAnswer({correct:comparison.score>=80,text:card.text,score:comparison.score});
   onPracticeEvent?.({id:'audio-speech-'+key,lesson:lessonId,kind:'pronunciation',label:card.text,correct:comparison.score>=80});
  };
  instance.onerror=event=>{
   if(seq!==recogSequence.current)return;
   setMicError(event.error==='not-allowed'?'دسترسی میکروفون مسدود شده؛ مجوز مرورگر را فعال کن.':
    event.error==='no-speech'?'صدایی تشخیص داده نشد؛ دوباره تلاش کن.':'تشخیص گفتار انجام نشد؛ اتصال و میکروفون را بررسی کن.');
  };
  instance.onend=()=>{if(seq===recogSequence.current){setRecording(false);recognizer.current=null;}};
  try{instance.start();setRecording(true);}
  catch{setRecording(false);setMicError('میکروفون باز نشد؛ مجوز مرورگر را بررسی کن.');}
 }
 function setMode(next){
  stopRecording();setQuizMode(next);setQuizIndex(0);setQuizAnswer(null);setQuizInput('');setSpeech(null);setMicError('');
 }
 function submitQuiz(value){
  if(!quizCard||quizAnswer!==null)return;
  const correct=quizMode==='dictation'?verifyAudioDictation(quizCard.text,value):value===quizCard.meaning;
  setQuizAnswer({correct,text:quizCard.text,meaning:quizCard.meaning});
  const key=audioLearningItemKey(lessonId,quizCard.id,quizMode);
  if(correct)setStats(old=>({...old,completed:{...old.completed,[key]:true}}));
  onPracticeEvent?.({id:'audio-learning-'+key,lesson:lessonId,kind:quizMode==='dictation'?'dictation':'listening',label:quizCard.text,correct});
 }
 function nextQuiz(){
  stopRecording();setQuizIndex(index=>(index+1)%cards.length);setQuizInput('');setQuizAnswer(null);setSpeech(null);setMicError('');
 }
 async function toggleTrack(track){
  const id=track.book+':'+track.path,el=player.current;
  if(!el)return;
  setTrackError('');
  if(trackId===id){
   if(!el.paused){el.pause();setTrackPlaying(false);}
   else try{await el.play();setTrackPlaying(true);}catch{setTrackError('مرورگر نتوانست این صوت را پخش کند.');}
   return;
  }
  try{
   el.pause();
   el.src=await requestPlayback(track);
   setTrackId(id);
   await el.play();
   setTrackPlaying(true);
  }catch{setTrackPlaying(false);setTrackError('پخش این قطعه ممکن نشد؛ فایل درس را بررسی کن.');}
 }
 if(!cards.length)return null;
 const visibleCards=showAll?cards:cards.slice(0,4);
 return <section id="lesson-audio" className="laExperience" aria-label={'یادگیری صوتی و تلفظ درس '+lessonId}>
  <div className="laExperienceHeading">
   <span className="laLargeIcon"><Headphones size={27}/></span>
   <div><span className="laEyebrow">LISTEN · SPEAK · LEARN</span>
    <h3>فایل‌های صوتی و تمرین تلفظ</h3><p>گوش بده، تکرار کن و یاد بگیر.</p></div>
  </div>
  <div className="laStats">
   <span><Headphones size={17}/><b>{tracks.length?tracks.length:cards.length}</b> {tracks.length?'قطعه کتاب':'عبارت برای شنیدن'}</span>
   <span><Mic size={17}/><b>{summary.attempts}</b> تمرین تلفظ</span>
   <span><BookOpen size={17}/><b>{summary.completed}</b> تمرین موفق</span>
  </div>
  <div className="laSectionHeading"><h4>گوش بده و تصویر را به خاطر بسپار</h4><span>{cards.length} عبارت متناسب با درس {lessonId}</span></div>
  <div className="laCardList">
   {visibleCards.map((card,index)=><article className={'laAudioCard '+(selected===index?'active':'')} key={card.id}>
     <AudioLessonArt scene={card.scene} word={card.text}/>
     <div className="laAudioCopy"><strong dir="ltr" lang="de">{card.text}</strong><span>{card.meaning}</span></div>
     <Waveform active={selected===index&&recording}/>
     <button type="button" className="laCirclePlay" aria-label={'پخش '+card.text}
      onClick={()=>{setSelected(index);registerPlay(card);setSpeech(null);}}><Play size={19} fill="currentColor"/></button>
    </article>)}
  </div>
  {cards.length>4&&<button type="button" className="laShowAll" onClick={()=>setShowAll(v=>!v)}>
   {showAll?'نمایش چهار عبارت اول':'نمایش همه عبارت‌ها'} <ChevronLeft size={16}/>
  </button>}
  {tracks.length>0&&<div className="laStrip" aria-label={'قطعه‌های اصلی صوتی درس '+lessonId}>
   <div className="laHeading"><AudioLines size={18}/><b>قطعه‌های صوتی همین درس</b><small>{tracks.length} فایل آماده پخش</small></div>
   <div className="laTracks">
    {tracks.map(track=>{
     const id=track.book+':'+track.path;
     return <button type="button" className={'laPlay '+(trackId===id?'active':'')} key={id}
      onClick={()=>toggleTrack(track)} aria-pressed={trackId===id&&trackPlaying}
      aria-label={'پخش '+track.filename+' از '+(track.book==='kursbuch'?'کتاب اصلی':'کتاب کار')}>
      {trackId===id&&trackPlaying?<Pause size={16}/>:<Play size={16}/>}
      <span dir="auto">{track.filename}</span><small>{track.book==='kursbuch'?'کتاب اصلی':'کتاب کار'}</small>
     </button>;
    })}
   </div>
   <audio ref={player} preload="none" aria-label={'صدای کتاب درس '+lessonId}
    onEnded={()=>setTrackPlaying(false)} onPause={()=>setTrackPlaying(false)} onPlay={()=>setTrackPlaying(true)}/>
   {trackError&&<small className="laError" role="alert">{trackError}</small>}
  </div>}
  {!tracks.length&&<audio ref={player} preload="none" hidden aria-label={'صدای کتاب درس '+lessonId}/>}
  <div className="laSpeakPanel">
   <div className="laPanelHeading"><span><Mic size={24}/></span><div><h4>تمرین تلفظ</h4>
     <p>تلفظ خودت را با متن تشخیص‌داده‌شده در مرورگر مقایسه کن.</p></div></div>
   <div className="laSpeakBody">
    <div className="laSteps">
     <span><Headphones size={18}/> بشنو</span><ChevronLeft size={16}/><span><Mic size={18}/> تکرار کن</span>
     <ChevronLeft size={16}/><span><AudioLines size={18}/> مقایسه کن</span>
    </div>
    <div className="laSpeakTarget"><small>عبارت منتخب</small><b dir="ltr">{current.text}</b><span>{current.meaning}</span></div>
    <div className="laSpeakControls">
      <button type="button" className="laHear" onClick={()=>registerPlay(current)}><Volume2 size={17}/> شنیدن نمونه</button>
      <button type="button" className="laMicButton" aria-label={recording?'توقف تشخیص گفتار':'شروع تمرین تلفظ'}
       onClick={()=>recording?stopRecording():startRecording(current)}>
       {recording?<MicOff size={19}/>:<Mic size={19}/>}
       {recording?'توقف میکروفون':'شروع تمرین تلفظ'}
      </button>
    </div>
    {!supported&&<p className="laMicNotice">در این مرورگر سنجش گفتار پشتیبانی نمی‌شود؛ هنوز می‌توانی نمونه را گوش بدهی و تکرار کنی.</p>}
    {recording&&<p className="laRecording" role="status">میکروفون فعال است؛ حالا عبارت آلمانی را بگو…</p>}
    {micError&&<p className="laError" role="alert">{micError}</p>}
    {speech?.cardId===current.id&&<div className="laSpeechResult" role="status">
      <div className="laScoreRing" style={{'--la-score':speech.score+'%'}}><strong>{speech.score}%</strong></div>
      <div><b>امتیاز تطبیق گفتار</b><span dir="ltr">{speech.heard}</span>
       <small>{speech.score>=85?'بسیار خوب؛ یک بار دیگر تکرار کن.':'دوباره گوش بده و آهسته‌تر تکرار کن.'}</small></div>
    </div>}
    <p className="laSpeechPrivacy">این امتیاز از تطبیق متن تشخیص‌داده‌شده محاسبه می‌شود، نه تحلیل دقیق لهجه. بسته به مرورگر، پردازش گفتار ممکن است در سرویس تشخیص صدای مرورگر انجام شود.</p>
   </div>
  </div>
  <div className="laLearningPanel">
    <div className="laPanelHeading"><span><Target size={23}/></span><div><h4>یادگیری با صدا</h4>
      <p>با شنیدن و پاسخ‌دادن، حافظه شنیداری‌ات را تقویت کن.</p></div></div>
    <div className="laModeTabs" role="group" aria-label="انتخاب نوع تمرین صوتی">
     {AUDIO_LEARNING_MODES.map(item=><button type="button" key={item.id} className={quizMode===item.id?'chosen':''}
       onClick={()=>setMode(item.id)} aria-pressed={quizMode===item.id}>
       {item.id==='dictation'?<Headphones size={17}/>:item.id==='repeat'?<Mic size={17}/>:<BookOpen size={17}/>}
       {item.title}</button>)}
    </div>
    <div className="laQuiz" key={quizMode+':'+quizIndex}>
      <div className="laQuizMeta"><span>{mode.description}</span><small>{quizIndex+1} / {cards.length}</small></div>
      <p>{quizMode==='dictation'?'صدا را گوش بده و عبارت آلمانی را بنویس.':
          quizMode==='meaning'?'ابتدا گوش بده؛ سپس معنی درست را انتخاب کن.':'نمونه را بشنو و همان عبارت را با میکروفون تکرار کن.'}</p>
      <button type="button" className="laQuizListen" onClick={()=>registerPlay(quizCard)}>
       <Play size={18} fill="currentColor"/><Waveform/><span>پخش نمونه صوتی</span>
      </button>
      {quizMode==='dictation'&&<form className="laDictation" onSubmit={event=>{event.preventDefault();submitQuiz(quizInput);}}>
        <input type="text" lang="de" dir="ltr" value={quizInput} disabled={quizAnswer!==null}
         aria-label="دیکته آلمانی" placeholder="آنچه شنیدی به آلمانی بنویس…" onChange={event=>setQuizInput(event.target.value)}/>
        <button type="submit" disabled={!quizInput.trim()||quizAnswer!==null}>بررسی</button>
      </form>}
      {quizMode==='meaning'&&<div className="laMeanings">
       {meaningChoices.map(choice=><button key={choice} type="button" disabled={quizAnswer!==null}
          className={quizAnswer!==null&&choice===quizCard.meaning?'right':''} onClick={()=>submitQuiz(choice)}>{choice}</button>)}
      </div>}
      {quizMode==='repeat'&&<div className="laRepeat">
       <b dir="ltr" lang="de">{quizCard.text}</b><button type="button" disabled={recording}
         onClick={()=>startRecording(quizCard)}><Mic size={17}/> {recording?'در حال گوش‌دادن…':'تکرار با میکروفون'}</button>
       {!supported&&<small>برای این تمرین، مرورگری با پشتیبانی از تشخیص گفتار آلمانی لازم است.</small>}
       {micError&&<small role="alert">{micError}</small>}
      </div>}
      {quizAnswer!==null&&<div className={'laQuizFeedback '+(quizAnswer.correct?'correct':'wrong')} role="status">
       {quizAnswer.correct?<CheckCircle2 size={18}/>:<X size={18}/>}
       <div><strong>{quizAnswer.correct?'آفرین، درست انجام شد!':'دوباره مرور کن.'}</strong>
        <span dir="ltr" lang="de">{quizAnswer.text}</span><small>{quizCard.meaning}</small></div>
       <button type="button" onClick={nextQuiz}>تمرین بعدی <ArrowLeft size={15}/></button>
      </div>}
    </div>
  </div>
 </section>;
}

export function ExerciseAudioButton({task,speak,linkedTrack,fallbackAudio}){
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const player=useRef(null);
 const spoken=task?.audio||(typeof task?.answer==='string'&&/[A-Za-zÄÖÜäöüß]/.test(task.answer)?task.answer:null)||fallbackAudio;
 useEffect(()=>{player.current?.pause();setError('');},[task?.id]);
 if(!spoken&&!linkedTrack)return null;
 async function play(){
  setError('');
  if(!linkedTrack){
   try{speak(spoken);}catch{setError('تلفظ در این مرورگر در دسترس نیست.');}
   return;
  }
  setBusy(true);
  try{
   const url=await requestPlayback(linkedTrack);
   if(!player.current)return;
   player.current.src=url;
   await player.current.play();
  }catch{
   if(spoken)speak(spoken);
   else setError('صوت این تمرین در دسترس نیست.');
  }finally{setBusy(false);}
 }
 return <div className="laExerciseAudio">
   <button type="button" className="laExercisePlay" onClick={play} disabled={busy}
    aria-label={'پخش صوت '+(task.type==='listen'?'سؤال':'مثال')+' '+task.id}>
    <Volume2 size={17}/>{busy?'در حال آماده‌سازی صوت…':task.type==='listen'?'پخش صوت سؤال':'پخش صوت مثال'}
   </button>
   <audio ref={player} preload="none" aria-label={'صوت تمرین '+task.id}/>
   {error&&<small role="alert">{error}</small>}
 </div>;
}
