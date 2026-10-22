import React,{useMemo,useRef,useState} from 'react';
import {ArrowLeft,BookOpen,Brain,Check,CheckCircle2,ChevronLeft,Delete,Headphones,Image as ImageIcon,
 Keyboard,Lightbulb,RotateCcw,Shuffle,Smartphone,Sparkles,Trophy,Volume2,VolumeX,XCircle} from 'lucide-react';
import visualData from './visualLessonData.json';
import VisualArt from './VisualArt.jsx';
import {GAME_SOUND_KEY,GAME_HAPTIC_KEY,readGameFeedbackPreferences,saveGameFeedbackPreference,giveGameFeedback} from './gameEffects.js';
import GameCelebration from './GameCelebration.jsx';
import {PICTURE_LEVELS,eligiblePicturePhrases,generatePictureRound,checkGermanAnswer,
 pictureMemoryId,answerFromTiles} from './pictureGameLogic.js';
import RouteLink from './RouteLink.jsx';
import QuizFocusShell from './QuizFocusShell.jsx';
import './pictureGame.css';

const LABELS={choice:'۴ گزینه',type:'تایپ',build:'جمله‌سازی'};
const LEVEL_ICONS={choice:CheckCircle2,type:Keyboard,build:Shuffle};
const germanKeys=['ä','ö','ü','ß'];
const all=visualData.phrases;

function statsFor(memory,level){
 const items=Object.entries(memory?.items||{}).filter(([key,x])=>key.startsWith('visual:')
  &&key.endsWith(':'+level) && Number(x?.attempts)>0).map(([,x])=>x);
 return {played:items.reduce((sum,x)=>sum+x.attempts,0),
  weak:items.filter(x=>x.mastery<55||x.lastCorrect===false).length};
}
export default function PictureGame({speak,onPracticeEvent,memory,setTab}){
 const [level,setLevel]=useState('choice');
 const [category,setCategory]=useState('all');
 const [playing,setPlaying]=useState(false);
 const [round,setRound]=useState([]);
 const [position,setPosition]=useState(0);
 const [response,setResponse]=useState(null);
 const [typed,setTyped]=useState('');
 const [placed,setPlaced]=useState([]);
 const [correctCount,setCorrectCount]=useState(0);
 const [mistakes,setMistakes]=useState(0);
 const [streak,setStreak]=useState(0);
 const [preferences,setPreferences]=useState(readGameFeedbackPreferences);
 const {sound,haptics}=preferences;
 const typedRef=useRef(null);
 const pool=useMemo(()=>all.filter(p=>category==='all'||p.category===category),[category]);
 const available=eligiblePicturePhrases(pool,level);
 const current=round[position];
 const finished=playing&&position>=round.length;
 const step=PICTURE_LEVELS.find(x=>x.id===level);
 const progress=statsFor(memory,level);
 const selection=placed.length&&current?answerFromTiles(current.tiles,placed):'';

 const togglePreference=key=>{
  setPreferences(old=>{
   const field=key===GAME_SOUND_KEY?'sound':'haptics';
   const next={...old,[field]:!old[field]};
   saveGameFeedbackPreference(key,next[field]);
   return next;
  });
 };
 function start(){
  const questions=generatePictureRound(pool,level,memory,10);
  setRound(questions);
  setPosition(0);setResponse(null);setTyped('');setPlaced([]);
  setCorrectCount(0);setMistakes(0);setStreak(0);setPlaying(Boolean(questions.length));
 }
 function submit(text){
  if(!current||response!==null)return;
  const correct=checkGermanAnswer(text,current.item.de);
  setResponse({correct,input:text});
  if(correct){setCorrectCount(n=>n+1);setStreak(n=>n+1);}
  else {setMistakes(n=>n+1);setStreak(0);}
  // The existing global callback awards exactly one XP event per completed question.
  onPracticeEvent?.({
    id:pictureMemoryId(current.item,level),kind:'visual',
    label:current.item.de,lesson:1,correct,feedbackHandled:true
  });
  giveGameFeedback(correct?'correct':'wrong',preferences);
  if(sound&&correct)speak(current.item.de);
 }
 function next(){
  if(response===null)return;
  if(position===round.length-1)giveGameFeedback('finish',preferences);
  setPosition(n=>n+1);setResponse(null);setTyped('');setPlaced([]);
 }
 function changeLevel(nextLevel){
  setLevel(nextLevel);
  setPlaying(false);setRound([]);setResponse(null);setPosition(0);
 }
 function changeCategory(nextCategory){
  setCategory(nextCategory);setPlaying(false);setRound([]);setResponse(null);setPosition(0);
 }
 return <div className="pgPage" dir="rtl">
  <header className="pgHero">
   <div className="pgHeroCopy">
    <span className="pgKicker"><Sparkles size={17}/> BILD · SPRECHEN · SPIELEN</span>
    <h1>تصویر را ببین، <em>آلمانی بگو!</em></h1>
    <p>از تصویر به کلمه برس؛ اول انتخاب کن، بعد تایپ کن، و در مرحله سوم خودت جمله بساز.</p>
    <div className="pgPills"><span><ImageIcon size={15}/> ۵۰ عبارت تصویری</span><span><Brain size={15}/> مرور هوشمند</span><span><Trophy size={15}/> XP واقعی</span></div>
   </div>
   <span className="pgHeroDecor" aria-hidden="true">🧠 🇩🇪</span>
  </header>

  <div className="pgModes" aria-label="سه سطح بازی">
   {PICTURE_LEVELS.map(x=>{
    const Icon=LEVEL_ICONS[x.id],details=statsFor(memory,x.id);
    return <button type="button" key={x.id} className={'pgMode '+(level===x.id?'active':'')}
     aria-pressed={level===x.id} onClick={()=>changeLevel(x.id)}>
     <span className="pgModeIndex">{x.number}</span>
     <Icon size={23}/>
     <b>{x.name}</b><small>{x.hint}</small>
     <span className="pgModePlayed">{details.played?details.played+' پاسخ ثبت‌شده':'شروع از صفر'}</span>
    </button>;
   })}
  </div>

  {!playing && <>
   <section className="pgSetup">
    <div className="pgSectionHead"><div><span className="pgEyebrow">CHOOSE YOUR WORDS</span><h2>موضوع تمرین</h2></div><span>{available.length} عبارت مناسب</span></div>
    <div className="pgCategories">
     <button className={category==='all'?'active':''} onClick={()=>changeCategory('all')}>همه</button>
     {visualData.categories.map(x=><button key={x.id} className={category===x.id?'active':''}
       onClick={()=>changeCategory(x.id)}>{x.title}</button>)}
    </div>
    <div className="pgIntro">
     <div className="pgIllustrationPreview">
      <VisualArt item={pool[0]||all[0]}/>
     </div>
     <div><span className="pgEyebrow">STUFE {step.number}</span>
      <h2>{step.name}</h2>
      <p>{level==='choice'?'تصویر و معنی را ببین و از چهار پاسخ آلمانی انتخاب کن.':
      level==='type'?'این بار گزینه‌ای نداری؛ جمله را به آلمانی تایپ کن و غلط‌های املایی‌ات را پیدا کن.':
      'کلمات آلمانی به‌هم ریخته‌اند؛ با لمس هر کلمه جمله درست بساز.'}</p>
      <div className="pgTip"><Lightbulb size={18}/> {progress.weak?
       progress.weak+' کارت دشوار از همین سطح در اولویت مرورند.':
       'ابتدا واژه‌های پایه را تمرین کن؛ اشتباه‌ها به حافظه مرور منتقل می‌شوند.'}</div>
      <button className="pgPrimary" disabled={!available.length} onClick={start}>
       شروع بازی ۱۰ سؤالی <ArrowLeft size={19}/>
      </button>
     </div>
    </div>
   </section>
  </>}

  {playing&&!finished&&current&&<QuizFocusShell title={'مرحله '+step.number+' · '+step.name}
    onClose={()=>setPlaying(false)} variant={level==='choice'?'choice':'writing'}>
   <section className="pgBoard" aria-live="off">
    <div className="pgBoardTop">
     <div><b>مرحله {step.number} · {step.name}</b><small>سؤال {position+1} از {round.length}</small></div>
     <div className="pgBoardTopRight">
      <span className="pgScore"><Trophy size={16}/>{correctCount} درست</span>
      {streak>=2&&<span className="pgCombo" aria-label={streak+' پاسخ درست پی‌درپی'}>🔥 {streak} پشت‌سرهم</span>}
      <button className="pgSound" type="button" aria-label={sound?'خاموش‌کردن صدا':'روشن‌کردن صدا'}
        title={sound?'خاموش‌کردن صدا':'روشن‌کردن صدا'}
        aria-pressed={sound} onClick={()=>togglePreference(GAME_SOUND_KEY)}>
        {sound?<Volume2 size={18}/>:<VolumeX size={18}/>}</button>
      <button className={'pgSound '+(haptics?'pgHapticOn':'')} type="button"
        aria-label={haptics?'خاموش‌کردن ویبره':'روشن‌کردن ویبره'}
        title={haptics?'ویبره روشن':'ویبره خاموش'} aria-pressed={haptics}
        onClick={()=>togglePreference(GAME_HAPTIC_KEY)}>
        <Smartphone size={18}/>{!haptics&&<span className="pgHapticOffMark">×</span>}
      </button>
     </div>
    </div>
    <div className="pgTrack"><span style={{width:((position+Number(response!==null))/round.length*100)+'%'}}/></div>
    <div className="pgImageBox">
     <VisualArt item={current.item} large/>
     <span className="pgImageBadge"><ImageIcon size={15}/> {current.item.imageIdea}</span>
    </div>
    <div className="pgPrompt">
     <span>{level==='choice'?'کدام جمله آلمانی به این تصویر می‌خورد؟':
       level==='type'?'این جمله را به آلمانی تایپ کن:':'با کلمات زیر این جمله را بساز:'}</span>
     <h2>{current.item.fa}</h2>
     <small>{current.item.register==='formal'?'موقعیت رسمی':current.item.register==='casual'?'موقعیت دوستانه':'عبارت عمومی'}</small>
    </div>

    {level==='choice'&&<div className="pgOptions" dir="ltr" role="group" aria-label="گزینه‌های آلمانی">
     {current.options.map((option,i)=>{
      const isCorrect=response!==null&&checkGermanAnswer(option.de,current.item.de);
      const isWrong=response!==null&&response.input===option.de&&!isCorrect;
      return <button type="button" key={option.id} disabled={response!==null}
       className={isCorrect?'correct':isWrong?'wrong':''} onClick={()=>submit(option.de)}>
       <span className="pgLetter">{'ABCD'[i]}</span><b>{option.de}</b>
       {isCorrect?<CheckCircle2 size={19}/>:isWrong?<XCircle size={19}/>:null}
      </button>;
     })}
    </div>}
    {level==='type'&&<form className="pgTypeForm" onSubmit={e=>{e.preventDefault();submit(typed)}}>
     <label htmlFor="pgGermanType">پاسخ خودت را بنویس</label>
     <input ref={typedRef} id="pgGermanType" dir="ltr" lang="de" spellCheck="false"
       autoComplete="off" autoCapitalize="none" autoCorrect="off"
       value={typed} onChange={e=>setTyped(e.target.value)} disabled={response!==null}
       placeholder="Auf Deutsch schreiben …" maxLength={200}/>
     <div className="pgGermanKeys" dir="ltr">{germanKeys.map(key=><button type="button" key={key}
       disabled={response!==null} onClick={()=>{setTyped(old=>old+key);typedRef.current?.focus()}}>{key}</button>)}
       <span>به حروف ä ö ü ß دقت کن</span></div>
     <button className="pgPrimary" type="submit" disabled={response!==null||!typed.trim()}>
      بررسی پاسخ <Check size={18}/>
     </button>
    </form>}
    {level==='build'&&<div className="pgSentenceBuilder">
     <div className="pgDropZone" dir="ltr" aria-label="جمله در حال ساخت">
      {placed.length?placed.map((tileId,i)=><button type="button" key={tileId} disabled={response!==null}
       onClick={()=>setPlaced(old=>old.filter(id=>id!==tileId))}
       aria-label={'برداشتن '+current.tiles.find(t=>t.id===tileId)?.word}>
       {current.tiles.find(t=>t.id===tileId)?.word}</button>):
       <span>برای ساخت جمله، کلمه‌ها را از پایین انتخاب کن…</span>}
     </div>
     <div className="pgTileTray" dir="ltr" aria-label="کلمات به‌هم‌ریخته">
      {current.tiles.filter(t=>!placed.includes(t.id)).map(tile=><button type="button" key={tile.id}
       disabled={response!==null} onClick={()=>setPlaced(old=>[...old,tile.id])}>{tile.word}</button>)}
     </div>
     <div className="pgBuilderActions">
      <button type="button" disabled={response!==null||!placed.length}
       onClick={()=>setPlaced(old=>old.slice(0,-1))}><Delete size={16}/> حذف آخرین</button>
      <button type="button" disabled={response!==null||!placed.length}
       onClick={()=>setPlaced([])}><RotateCcw size={16}/> پاک‌کردن</button>
      <button className="pgPrimary" type="button" disabled={response!==null||placed.length!==current.tiles.length}
       onClick={()=>submit(selection)}>بررسی جمله <Check size={18}/></button>
     </div>
    </div>}

    {response!==null&&<div key={position} className={'pgFeedback '+(response.correct?'good':'bad')} role="status">
     <div className="pgFeedbackSymbol">{response.correct?<CheckCircle2 size={27}/>:<XCircle size={27}/>}</div>
     <div className={'pgXPFlight '+(response.correct?'positive':'retry')}>
       {response.correct?'✨ +۱۰ XP':'+۲ XP'}
     </div>
     <div className="pgFeedbackText">
      <b>{response.correct?'آفرین! درست گفتی!':'این بار اشتباه شد؛ جمله درست را به خاطر بسپار.'}</b>
      <strong dir="ltr">{current.item.de}</strong>
      {level==='type'&&!response.correct&&<small>املای آلمانی، مخصوصاً حروف ویژه، مهم است. نقطه و علامت سؤال اختیاری‌اند.</small>}
     </div>
     <button type="button" onClick={()=>speak(current.item.de)} title="شنیدن تلفظ آلمانی"><Volume2 size={20}/></button>
    </div>}
    <button type="button" className="pgPrimary pgNext" disabled={response===null}
      onClick={next}>{response===null?'پاسخ را بررسی کن':position===round.length-1?'مشاهده نتیجه':'سؤال بعدی'}
      <ArrowLeft size={18}/></button>
   </section>
   </QuizFocusShell>}

  {finished&&<QuizFocusShell title="نتیجه بازی تصویری" onClose={()=>setPlaying(false)}>
    <section className="pgFinish">
   <GameCelebration correct={correctCount} total={round.length}
      caption={'اتمام مرحله '+step.number+' · '+step.name}/>
   <p>هر پاسخ در XP و حافظه مرور ذخیره شد. عبارت‌هایی که اشتباه کردی در دورهای بعدی اولویت خواهند داشت.</p>
   <div className="pgFinishStats"><div><b>{correctCount}</b><small>پاسخ درست</small></div>
    <div><b>{mistakes}</b><small>نیازمند مرور</small></div>
    <div><b>{correctCount*10+mistakes*2}</b><small>XP این دور</small></div></div>
   <div className="pgFinishActions">
    <button type="button" className="pgPrimary" onClick={start}><RotateCcw size={17}/> دور جدید</button>
    {level!=='build'&&<button type="button" className="pgSecondary" onClick={()=>changeLevel(level==='choice'?'type':'build')}>
     سطح بعدی <ArrowLeft size={17}/></button>}
    <button type="button" className="pgSecondary" onClick={()=>setPlaying(false)}>انتخاب موضوع</button>
   </div>
  </section></QuizFocusShell>}

  <div className="pgFooterCTA"><BookOpen size={19}/><span>می‌خواهی جمله‌های بیشتری ببینی؟</span>
   <RouteLink to="visual" navigate={setTab}>کتابخانه تصویری درس اول <ChevronLeft size={16}/></RouteLink></div>
 </div>;
}
