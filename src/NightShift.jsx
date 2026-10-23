import React,{useEffect,useMemo,useState} from 'react';
import {ArrowLeft,BookOpen,Check,CheckCircle2,Clock3,Headphones,Moon,Pause,Play,RotateCcw,Sparkles,Sunrise,Volume2,VolumeX,Wind} from 'lucide-react';
import {buildNightReview,createNightState,nightSessionStart,nightSessionAdvance,saveNightSession,nightSummary} from './nightShiftEngine.js';
import {nextReview} from './studyEngine.js';
import {localDay} from './learningMemory.js';
import './nightShift.css';

function prettyGroup(group){
 return ({verbs:'صرف فعل',numbers:'اعداد',greetings:'حال و احوال',origin:'معرفی و کشورها',classroom:'واژه‌های کلاس',vocabulary:'فلش‌کارت درس'})[group]||'مرور آلمانی';
}

export default function NightShift({memory,schedule,progress,personalCards,nightState,setNightState,setSchedule,onPracticeEvent,speak}){
 const [revealed,setRevealed]=useState(false);
 const [message,setMessage]=useState('');
  const summary=nightSummary(nightState);
 const active=nightState?.active?.day===localDay() ? nightState.active : null;
 const card=active?.items?.[active.index];
 const isFinished=Boolean(active && active.completedAt);
 const [count,setCount]=useState(()=>nightState?.preferredCount||6);
 const display=active?active.items.length:count;
 const last=summary.today||summary.last;

 useEffect(()=>{setRevealed(false);setMessage('');},[active?.index,active?.id]);
 useEffect(()=>()=>{try{window.speechSynthesis?.cancel()}catch{}},[]);
 function begin(){
   const items=buildNightReview({memory,schedule,progress,personalCards},count);
   if(!items.length){setMessage('هنوز تمرینی موجود نیست. ابتدا درس اول را باز کن.');return;}
   const session=nightSessionStart(items);
   setNightState(prev=>({...createNightState(),...prev,preferredCount:count,active:session}));
   setRevealed(false);setMessage('');
 }
 function evaluate(correct){
   if(!card||!revealed)return;
   // Deliberately avoid bright XP toasts and device vibrations before sleep.
   onPracticeEvent({id:card.id,kind:card.kind,correct,lesson:card.lesson,label:card.answer,quiet:true,
     grade:correct?'good':'again'});
   if(card.source==='srs'){
     setSchedule(prev=>({...prev,[card.id]:nextReview(prev[card.id],correct?'good':'again')}));
   }
   const advanced=nightSessionAdvance(active,correct);
   setNightState(prev=>saveNightSession(prev,advanced));
   setRevealed(false);
   try{window.speechSynthesis?.cancel()}catch{}
 }
 const finishedNow=Boolean(isFinished || (!active&&summary.doneToday));
 return <div className="nightPage">
   <section className="nightShell">
     <div className="nightStars" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/></div>
     <header className="nightTop">
       <span><Moon size={19}/> NACHTSCHICHT · شیفت شب</span>
       <span className="nightTime"><Clock3 size={15}/> حدود ۵ دقیقه</span>
     </header>
     <div className="nightHeading">
       <span className="nightMoon"><Moon size={39} strokeWidth={1.45}/></span>
       <div><h1>قبل از خواب، چند دقیقه آلمانی</h1>
         <p>آرام مرور کن. بدون محدودیت زمانی، بدون جریمه و بدون فشار برای حفظ پیوستگی.</p></div>
     </div>

     {!active && <div className="nightInner">
       <div className="nightOverview">
         <div><span>مرورهای انجام‌شده</span><strong>{summary.nights.toLocaleString('fa-IR')} <small>شب</small></strong></div>
         <div><span>آخرین مرور</span><strong>{last?last.correct+' / '+last.total:'هنوز شروع نکردی'}</strong></div>
       </div>
       {summary.doneToday&&<div className="nightFinishedToday"><CheckCircle2 size={22}/>
         <div><b>مرور امشب انجام شد.</b><p>اگر خسته‌ای همین‌جا تمامش کن. فردا هم فرصت مرور هست.</p></div></div>}
       <div className="nightPrepare">
         <span className="nightSubheading"><BookOpen size={17}/> مرور شخصی با حافظه قبلی</span>
         <p>سؤال‌های اشتباه، موارد موعددار و چند عبارت از کلاس استاد انتخاب می‌شوند. پاسخ را در ذهنت بگو؛ بعد کارت را برگردان.</p>
         <div className="nightCount" role="group" aria-label="تعداد سؤال مرور">
           {[4,6,8].map(n=><button key={n} aria-pressed={count===n} onClick={()=>{setCount(n);setNightState(s=>({...createNightState(),...s,preferredCount:n}))}}
             className={count===n?'selected':''}>{n.toLocaleString('fa-IR')} سؤال</button>)}
         </div>
         <button className="nightStart" onClick={begin}><Moon size={19}/> {summary.doneToday?'مرور اختیاری دوباره':'شروع شیفت شب'} <ArrowLeft size={18}/></button>
         {message&&<p role="alert">{message}</p>}
         <small>صدا فقط با انتخاب خودت پخش می‌شود. حالت شب برای نور کمتر طراحی شده است.</small>
       </div>
     </div>}

     {active && !isFinished && card && <section className="nightExercise" aria-live="polite">
       <div className="nightExerciseTop"><span>{prettyGroup(card.group)}</span><span>{(active.index+1).toLocaleString('fa-IR')} از {display.toLocaleString('fa-IR')}</span></div>
       <div className="nightTrack"><i style={{width:(100*active.index/display)+'%'}}/></div>
       <div className="nightQuestion">
         <small>{revealed?'پاسخ آلمانی':'ابتدا در ذهن خودت پاسخ بده'}</small>
         <h2 dir={revealed?'ltr':'auto'}>{revealed?card.answer:card.prompt}</h2>
         {revealed && <>
           <button className="nightSpeak" onClick={()=>speak(card.audio||card.answer)}><Volume2 size={20}/> شنیدن تلفظ</button>
           {card.note&&<p className="nightNote">{card.note}</p>}
         </>}
       </div>
       {!revealed?<button className="nightReveal" onClick={()=>setRevealed(true)}>دیدن پاسخ <ArrowLeft size={18}/></button>
         :<div className="nightRatings">
           <button onClick={()=>evaluate(false)}><RotateCcw size={19}/> یادم نبود</button>
           <button onClick={()=>evaluate(true)}><Check size={20}/> بلد بودم</button>
         </div>}
       <p className="nightGentle">مرور صادقانه مهم‌تر از امتیاز است. فقط چیزی را «بلد بودم» بزن که پیش از دیدن جواب یادت آمده بود.</p>
     </section>}
     {active && isFinished && <div className="nightComplete">
       <span className="nightCompleteIcon"><Sunrise size={39}/></span>
       <h2>Gute Nacht! 🌙</h2>
       <p>شیفت شب به پایان رسید؛ حالا می‌توانی با خیال راحت استراحت کنی.</p>
       <strong>{active.correct.toLocaleString('fa-IR')} از {active.items.length.toLocaleString('fa-IR')} پاسخ یادآوری‌شده</strong>
       <button onClick={()=>setNightState(s=>({...s,active:null}))}>پایان مرور امشب <CheckCircle2 size={18}/></button>
     </div>}
   </section>
   <div className="nightAfter"><span><Wind size={18}/> بی‌صدا و بدون تایمر</span><span><Sparkles size={18}/> مبتنی بر اشتباه‌ها</span><span><Moon size={18}/> مناسب قبل از خواب</span></div>
 </div>;
}
