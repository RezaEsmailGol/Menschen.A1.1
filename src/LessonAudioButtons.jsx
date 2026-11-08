import React,{useEffect,useMemo,useRef,useState} from 'react';
import {AudioLines,ArrowLeft,BookOpen,CheckCircle2,ChevronLeft,ChevronRight,Headphones,Mic,MicOff,Pause,Play,Volume2,X} from 'lucide-react';
import AudioLessonArt from './AudioLessonArt.jsx';
import {lessonAudioCards,soundMeaningOptions,verifyAudioDictation,AUDIO_LEARNING_MODES,audioLearningItemKey,parseAudioLearningStats} from './audioLearningData.js';
import {scoreSpeechMatch} from './speakingEngine.js';
import {AUDIO_CARD_TRACK_KEY,normalizeAudioCardBindings,getAudioCardBinding,withAudioCardBinding,audioCardTrackLabel,completedAudioCards} from './audioWorkbookData.js';
import './lessonAudioButtons.css';
import './illustratedAudioWorkbook.css';

const STATS_KEY='dt_audio_learning_v1';
function savedStats(){
 try{return parseAudioLearningStats(localStorage.getItem(STATS_KEY));}
 catch{return parseAudioLearningStats({});}
}
function savedBindings(){
 try{return normalizeAudioCardBindings(localStorage.getItem(AUDIO_CARD_TRACK_KEY));}
 catch{return {};}
}
function getRecognizer(){
 if(typeof window==='undefined')return null;
 return window.SpeechRecognition||window.webkitSpeechRecognition||null;
}
async function requestPlayback(track){
 const params=new URLSearchParams({book:track.book,path:track.path});
 const response=await fetch('/api/audio/play?'+params.toString(),{cache:'no-store'});
 const json=await response.json().catch(()=>({}));
 if(!response.ok||!json.url?.startsWith('/api/audio/stream?'))
  throw new Error('پخش قطعه اصلی کتاب فعلاً در دسترس نیست.');
 return json.url;
}

const LEARNING_TABS=[
 {id:'study',title:'یادگیری'},
 {id:'meaning',title:'معنی'},
 {id:'dictation',title:'دیکته'},
 {id:'repeat',title:'تلفظ'}
];

export default function LessonAudioButtons({lessonId,speak=()=>{},onPracticeEvent}){
 const cards=useMemo(()=>lessonAudioCards(lessonId),[lessonId]);
 const [index,setIndex]=useState(0);
 const [mode,setMode]=useState('study');
 const [stats,setStats]=useState(savedStats);
 const [bindings,setBindings]=useState(savedBindings);
 const [tracks,setTracks]=useState([]);
 const [catalogReady,setCatalogReady]=useState(false);
 const [quizInput,setQuizInput]=useState('');
 const [quizAnswer,setQuizAnswer]=useState(null);
 const [recording,setRecording]=useState(false);
 const [speech,setSpeech]=useState(null);
 const [micError,setMicError]=useState('');
 const [originalUrl,setOriginalUrl]=useState('');
 const [originalBusy,setOriginalBusy]=useState(false);
 const [originalPlaying,setOriginalPlaying]=useState(false);
 const [originalError,setOriginalError]=useState('');
 const [rate,setRate]=useState(1);
 const audioRef=useRef(null);
 const recognizer=useRef(null);
 const sequence=useRef(0);
 const playbackSequence=useRef(0);
 const current=cards[index]||cards[0];
 const recognizerSupported=Boolean(getRecognizer());
 const linked=current?getAudioCardBinding(bindings,lessonId,current.id):null;
 const chosenTrack=linked?tracks.find(track=>track.book===linked.book&&track.path===linked.path):null;
 const completed=completedAudioCards(cards,stats,lessonId);
 const meaningChoices=useMemo(()=>soundMeaningOptions(cards,index),[cards,index]);

 useEffect(()=>{try{localStorage.setItem(STATS_KEY,JSON.stringify(stats));}catch{}},[stats]);
 useEffect(()=>{try{localStorage.setItem(AUDIO_CARD_TRACK_KEY,JSON.stringify(bindings));}catch{}},[bindings]);
 useEffect(()=>{
  const controller=new AbortController();
  setCatalogReady(false);setTracks([]);
  fetch('/api/audio/catalog?lesson='+lessonId,{signal:controller.signal,cache:'no-store'})
   .then(response=>response.ok?response.json():null)
   .then(data=>{
    if(controller.signal.aborted)return;
    if(data?.configured&&Array.isArray(data.tracks))
     setTracks(data.tracks.filter(t=>t&&['kursbuch','arbeitsbuch'].includes(t.book)&&typeof t.path==='string'&&typeof t.filename==='string'&&t.lesson===Number(lessonId)));
   }).catch(()=>{}).finally(()=>{if(!controller.signal.aborted)setCatalogReady(true);});
  return ()=>controller.abort();
 },[lessonId]);
 function stopRecording(){
  sequence.current++;
  try{recognizer.current?.abort();}catch{}
  recognizer.current=null;setRecording(false);
 }
 function stopOriginal(){
  playbackSequence.current++;
  audioRef.current?.pause();
  if(audioRef.current)audioRef.current.removeAttribute('src');
  setOriginalUrl('');setOriginalBusy(false);setOriginalPlaying(false);setOriginalError('');
 }
 useEffect(()=>{
  // The old learner stats and existing lesson selections remain intact.
  setIndex(0);setMode('study');setQuizInput('');setQuizAnswer(null);
  setSpeech(null);setMicError('');
  return ()=>{sequence.current++;playbackSequence.current++;try{recognizer.current?.abort();}catch{}audioRef.current?.pause();};
 },[lessonId]);
 useEffect(()=>{if(audioRef.current)audioRef.current.playbackRate=rate;},[rate,originalUrl]);
 if(!cards.length)return null;
 function choose(next){
  const position=Math.max(0,Math.min(cards.length-1,next));
  if(position===index)return;
  stopRecording();stopOriginal();setIndex(position);
  setQuizInput('');setQuizAnswer(null);setSpeech(null);setMicError('');
 }
 function changeMode(next){
  if(!LEARNING_TABS.some(t=>t.id===next))return;
  stopRecording();setMode(next);setQuizInput('');setQuizAnswer(null);setSpeech(null);setMicError('');
 }
 function registerSample(card){
  try{speak(card.text);}catch{}
  const key=audioLearningItemKey(lessonId,card.id,'listen');
  setStats(old=>({...old,plays:{...old.plays,[key]:(old.plays[key]||0)+1}}));
 }
 function setTrack(value){
  stopOriginal();
  const track=tracks.find(t=>t.book+':'+t.path===value)||null;
  try{setBindings(prev=>withAudioCardBinding(prev,lessonId,current.id,track));}
  catch{setOriginalError('این قطعه صوتی قابل انتخاب نیست.');}
 }
 async function playOriginal(){
  if(!linked)return;
  const el=audioRef.current;
  if(!el)return;
  if(originalUrl){
   if(!el.paused){el.pause();return;}
   try{await el.play();}catch{setOriginalError('برای پخش، از کنترل روی فایل صوتی استفاده کن.');}
   return;
  }
  const serial=++playbackSequence.current;
  setOriginalBusy(true);setOriginalError('');
  try{
   const url=await requestPlayback(linked);
   if(serial!==playbackSequence.current||!audioRef.current)return;
   audioRef.current.src=url;setOriginalUrl(url);
   audioRef.current.playbackRate=rate;
   try{await audioRef.current.play();}
   catch{setOriginalError('اگر پخش خودکار شروع نشد، روی نوار صوتی دکمه پخش را بزن.');}
  }catch(error){
   if(serial===playbackSequence.current)setOriginalError(error.message||'فایل اصلی در دسترس نیست.');
  }finally{if(serial===playbackSequence.current)setOriginalBusy(false);}
 }
 function startRecording(card){
  const Ctor=getRecognizer();
  if(!Ctor){setMicError('تشخیص گفتار در این مرورگر فعال نیست؛ Chrome با مجوز میکروفون را امتحان کن.');return;}
  stopRecording();setMicError('');setSpeech(null);
  let instance;
  try{instance=new Ctor();instance.lang='de-DE';instance.continuous=false;instance.interimResults=false;instance.maxAlternatives=3;}
  catch{setMicError('امکان راه‌اندازی میکروفون وجود ندارد.');return;}
  const call=++sequence.current;recognizer.current=instance;
  instance.onresult=event=>{
   if(call!==sequence.current)return;
   const choices=Array.from(event.results?.[0]||[]).map(x=>x.transcript).filter(Boolean);
   if(!choices.length){setMicError('صدایی شناسایی نشد.');return;}
   const best=choices.map(heard=>({heard,...scoreSpeechMatch(card.text,heard,'sentences')})).sort((a,b)=>b.score-a.score)[0];
   setSpeech({cardId:card.id,...best});
   const key=audioLearningItemKey(lessonId,card.id,'repeat');
   const correct=best.score>=80;
   setStats(old=>({...old,
    completed:{...old.completed,...(correct?{[key]:true}:{})},
    speech:{...old.speech,[key]:{lesson:Number(lessonId),score:best.score,heard:best.heard,at:Date.now()}}
   }));
   if(mode==='repeat')setQuizAnswer({correct,text:card.text,meaning:card.meaning});
   onPracticeEvent?.({id:'audio-speech-'+key,lesson:lessonId,kind:'pronunciation',label:card.text,correct});
  };
  instance.onerror=event=>{
   if(call!==sequence.current)return;
   setMicError(event.error==='not-allowed'?'اجازه میکروفون داده نشده است.':event.error==='no-speech'?'صدایی تشخیص داده نشد.':'خطا در تشخیص گفتار؛ دوباره امتحان کن.');
  };
  instance.onend=()=>{if(call===sequence.current){setRecording(false);recognizer.current=null;}};
  try{instance.start();setRecording(true);}catch{setRecording(false);setMicError('میکروفون باز نشد.');}
 }
 function submitQuiz(value){
  if(!current||quizAnswer!==null||mode==='study'||mode==='repeat')return;
  const correct=mode==='dictation'?verifyAudioDictation(current.text,value):value===current.meaning;
  setQuizAnswer({correct,text:current.text,meaning:current.meaning});
  const key=audioLearningItemKey(lessonId,current.id,mode);
  if(correct)setStats(old=>({...old,completed:{...old.completed,[key]:true}}));
  onPracticeEvent?.({id:'audio-learning-'+key,lesson:lessonId,
   kind:mode==='dictation'?'dictation':'listening',label:current.text,correct});
 }
 const visibleText=mode!=='dictation'||quizAnswer!==null;
 const visibleMeaning=mode!=='meaning'||quizAnswer!==null;
 const trackValue=linked?linked.book+':'+linked.path:'';
 const currentMode=AUDIO_LEARNING_MODES.find(item=>item.id===mode);
 return <section id="lesson-audio" className="laExperience laWorkbook" aria-label={'کتاب صوتی تصویری درس '+lessonId}>
  <header className="laWorkbookHeader">
   <div><span className="laEyebrow">HÖREN · SEHEN · ÜBEN</span>
    <h3><BookOpen size={24}/> کتاب تصویری و تمرین صوتی درس {lessonId}</h3>
    <p>تصویر را ببین، صدا را بشنو، جمله را بخوان و همان‌جا تمرین کن.</p>
   </div>
   <span className="laWorkbookCount">{completed} / {cards.length} کارت تمرین‌شده</span>
  </header>
  <div className="laWorkbookProgress" role="progressbar" aria-label="پیشرفت کارت‌های صوتی" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={cards.length}><span style={{width:Math.round(completed/cards.length*100)+'%'}}/></div>
  <nav className="laWorkbookIndex" aria-label="انتخاب صفحه تصویری درس">
   {cards.map((card,position)=><button type="button" key={card.id}
    aria-current={index===position?'step':undefined}
    className={(index===position?'active ':'')+(completedAudioCards([card],stats,lessonId)?'completed':'')}
    onClick={()=>choose(position)}><span>{String(position+1).padStart(2,'0')}</span>
    <strong dir="auto">{card.meaning}</strong>
    {completedAudioCards([card],stats,lessonId)>0&&<CheckCircle2 size={15}/>}
   </button>)}
  </nav>
  <article className="laWorkbookPage">
   <div className="laWorkbookPageTop"><span>SEITE {index+1} / {cards.length}</span><span>درس {lessonId} · تمرین تصویری</span></div>
   <div className="laWorkbookScene">
    <div className="laWorkbookArt"><AudioLessonArt key={current.id} scene={current.scene} word={current.text}/></div>
    <div className="laWorkbookText">
     <span className="laWorkbookLabel">{visibleText?'بخوان و تکرار کن':'اول گوش بده و بنویس'}</span>
     {visibleText?<h4 dir="ltr" lang="de">{current.text}</h4>:<h4 className="laWorkbookMasked" aria-label="متن تمرین تا بررسی پاسخ مخفی است">● ● ●</h4>}
     {visibleMeaning?<p>{current.meaning}</p>:<p>اول پاسخ بده؛ سپس معنی را ببین.</p>}
     <button type="button" className="laWorkbookSample" onClick={()=>registerSample(current)}>
      <Volume2 size={20}/> شنیدن تلفظ نمونه
     </button>
    </div>
   </div>
   <div className="laWorkbookOriginal">
    <div className="laWorkbookOriginalHeading"><Headphones size={18}/><b>صدای اصلی کتاب</b><small>قطعه مرتبط را انتخاب کن؛ متن بالا، رونویسی فایل نیست.</small></div>
    <div className="laWorkbookTrackRow">
     <label className="laWorkbookSelect">انتخاب قطعه برای این تصویر
      <select aria-label="انتخاب فایل صوتی برای کارت فعلی" value={trackValue} onChange={event=>setTrack(event.target.value)}>
       <option value="">{catalogReady?(tracks.length?'انتخاب قطعه صوتی…':'فایل اصلی برای این درس موجود نیست'):'در حال بررسی فایل‌های درس…'}</option>
       {tracks.map(track=><option key={track.book+':'+track.path} value={track.book+':'+track.path}>
        {audioCardTrackLabel(track)} · {track.filename}
       </option>)}
       {linked&&!chosenTrack&&<option value={trackValue}>قطعه قبلی (در فهرست فعلی یافت نشد)</option>}
      </select>
     </label>
     <button type="button" className="laWorkbookOriginalPlay" disabled={!linked||originalBusy} onClick={playOriginal}>
      {originalBusy?'آماده‌سازی…':originalPlaying?<Pause size={18}/>:<Play size={18}/>}
      {originalPlaying?'توقف':'پخش فایل اصلی'}
     </button>
    </div>
    <audio ref={audioRef} controls={Boolean(originalUrl)} hidden={!originalUrl} preload="none"
      aria-label={'فایل اصلی کتاب برای کارت '+(index+1)}
      onEnded={()=>setOriginalPlaying(false)} onPause={()=>setOriginalPlaying(false)} onPlay={()=>setOriginalPlaying(true)}/>
    {originalUrl&&<label className="laWorkbookSpeed">سرعت پخش
      <select aria-label="سرعت قطعه اصلی" value={rate} onChange={event=>setRate(Number(event.target.value))}>
       <option value={0.75}>۰٫۷۵×</option><option value={1}>۱×</option><option value={1.25}>۱٫۲۵×</option>
      </select></label>}
    {originalError&&<p className="laError" role="alert">{originalError}</p>}
   </div>
   <div className="laWorkbookTasks">
    <div className="laWorkbookTabs" role="group" aria-label="روش یادگیری با این تصویر">
     {LEARNING_TABS.map(item=><button type="button" key={item.id} className={mode===item.id?'chosen':''}
      aria-pressed={mode===item.id} onClick={()=>changeMode(item.id)}>{item.title}</button>)}
    </div>
    {mode==='study'?<div className="laWorkbookInstruction"><BookOpen size={20}/><div>
      <strong>گام اول: تصویر، متن و معنی را با هم یاد بگیر.</strong>
      <p>نمونه را پخش کن، با صدای بلند تکرار کن و سپس یکی از تمرین‌های «معنی»، «دیکته» یا «تلفظ» را انتخاب کن.</p>
     </div></div>:<div className="laWorkbookExercise" key={mode+':'+current.id}>
      <div className="laWorkbookExerciseHeading"><strong>{currentMode?.title}</strong><small>{currentMode?.description}</small></div>
      {mode==='meaning'&&<div className="laWorkbookMeaningChoices">
       {meaningChoices.map(choice=><button type="button" key={choice} disabled={quizAnswer!==null}
        className={quizAnswer!==null&&choice===current.meaning?'right':''} onClick={()=>submitQuiz(choice)}>{choice}</button>)}
      </div>}
      {mode==='dictation'&&<form className="laDictation" onSubmit={event=>{event.preventDefault();submitQuiz(quizInput);}}>
       <input lang="de" dir="ltr" aria-label="متن شنیده‌شده به آلمانی" placeholder="آنچه شنیدی را به آلمانی بنویس…"
        value={quizInput} disabled={quizAnswer!==null} onChange={event=>setQuizInput(event.target.value)}/>
       <button type="submit" disabled={!quizInput.trim()||quizAnswer!==null}>بررسی</button>
      </form>}
      {mode==='repeat'&&<div className="laWorkbookRepeat">
       <button type="button" className="laMicButton" disabled={!recognizerSupported}
        aria-label={recording?'توقف تمرین گفتار':'شروع سنجش تلفظ'} onClick={()=>recording?stopRecording():startRecording(current)}>
        {recording?<MicOff size={18}/>:<Mic size={18}/>}
        {recording?'توقف':'با میکروفون تکرار کن'}</button>
       {!recognizerSupported&&<small>این مرورگر تشخیص گفتار را پشتیبانی نمی‌کند؛ همچنان می‌توانی با نمونه تکرار کنی.</small>}
       <small>امتیاز بر اساس تطبیق متن گفتار است، نه اندازه‌گیری دقیق لهجه. ممکن است تشخیص گفتار توسط سرویس مرورگر انجام شود.</small>
      </div>}
      {recording&&<p role="status" className="laRecording">گوش می‌دهم؛ عبارت را با صدای بلند بگو…</p>}
      {micError&&<p className="laError" role="alert">{micError}</p>}
      {speech?.cardId===current.id&&<p role="status" className="laWorkbookSpeechScore">متن تشخیص‌داده‌شده: <b dir="ltr">{speech.heard}</b> · امتیاز تطبیق {speech.score}٪</p>}
      {quizAnswer!==null&&<div className={'laWorkbookFeedback '+(quizAnswer.correct?'correct':'wrong')} role="status">
       {quizAnswer.correct?<CheckCircle2 size={20}/>:<X size={20}/>}
       <span><strong>{quizAnswer.correct?'آفرین! درست انجام شد.':'این بار درست نبود؛ نمونه را دوباره گوش بده.'}</strong>
       <b dir="ltr" lang="de">{quizAnswer.text}</b><small>{quizAnswer.meaning}</small></span>
      </div>}
     </div>}
   </div>
   <div className="laWorkbookPaging">
    <button type="button" disabled={index===0} onClick={()=>choose(index-1)}><ChevronRight size={17}/> صفحه قبل</button>
    <span>صفحه {index+1} از {cards.length}</span>
    <button type="button" onClick={()=>choose((index+1)%cards.length)}>{index===cards.length-1?'از اول':'تصویر بعدی'} <ArrowLeft size={17}/></button>
   </div>
  </article>
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
