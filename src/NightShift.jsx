import React,{useEffect,useMemo,useState} from 'react';
import {ArrowLeft,BookOpen,Brain,Check,CheckCircle2,Clock3,Moon,Pause,Play,RotateCcw,Sparkles,Sunrise,Volume2,Wind} from 'lucide-react';
import {buildNightReview,createNightState,nightSessionStart,nightSessionAdvance,saveNightSession,nightSummary} from './nightShiftEngine.js';
import {nextReview} from './studyEngine.js';
import {localDay} from './learningMemory.js';
import MnemonicArt from './MnemonicArt.jsx';
import './nightShift.css';

function prettyGroup(group){
 return ({verbs:'صرف فعل',numbers:'اعداد',greetings:'حال و احوال',origin:'معرفی و کشورها',classroom:'واژه‌های کلاس',vocabulary:'فلش‌کارت درس'})[group]||'مرور آلمانی';
}

export default function NightShift({memory,schedule,progress,personalCards,nightState,setNightState,setSchedule,onPracticeEvent,speak}){
 const [revealed,setRevealed]=useState(false);
 const [message,setMessage]=useState('');
 const [studyMode,setStudyMode]=useState('recall');
 const [slides,setSlides]=useState(null);
 const [slideIndex,setSlideIndex]=useState(0);
 const [playing,setPlaying]=useState(false);
 const [automaticSound,setAutomaticSound]=useState(false);
 const [slideSeconds,setSlideSeconds]=useState(9);
  const summary=nightSummary(nightState);
 const active=nightState?.active?.day===localDay() ? nightState.active : null;
 const card=active?.items?.[active.index];
 const isFinished=Boolean(active && active.completedAt);
 const [count,setCount]=useState(()=>nightState?.preferredCount||6);
 const display=active?active.items.length:count;
 const last=summary.today||summary.last;
 const slideCard=slides?.[slideIndex];
 const slideshowDone=Boolean(slides && slideIndex>=slides.length);
 const getArtNumber=c=>c?.group==='numbers'?Number(c.prompt.match(/\d+/)?.[0]):null;

 useEffect(()=>{setRevealed(false);setMessage('');},[active?.index,active?.id]);
 useEffect(()=>()=>{try{window.speechSynthesis?.cancel()}catch{}},[]);
 useEffect(()=>{
   if(!playing||!slides||slideIndex>=slides.length)return;
   const timer=setTimeout(()=>setSlideIndex(i=>i+1),slideSeconds*1000);
   return ()=>clearTimeout(timer);
 },[playing,slides,slideIndex,slideSeconds]);
 useEffect(()=>{
   if(playing && automaticSound && slideCard){speak(slideCard.audio||slideCard.answer)}
 },[slideIndex,playing,automaticSound]);
 function beginSlides(){
   const items=buildNightReview({memory,schedule,progress,personalCards},count);
   if(!items.length){setMessage('فعلاً کارتی برای نمایش وجود ندارد.');return;}
   setSlides(items);setSlideIndex(0);setPlaying(true);setMessage('');
 }
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

     {!active && !slides && <div className="nightInner">
       <div className="nightOverview">
         <div><span>مرورهای انجام‌شده</span><strong>{summary.nights.toLocaleString('fa-IR')} <small>شب</small></strong></div>
         <div><span>آخرین مرور</span><strong>{last?last.correct+' / '+last.total:'هنوز شروع نکردی'}</strong></div>
       </div>
       {summary.doneToday&&<div className="nightFinishedToday"><CheckCircle2 size={22}/>
         <div><b>مرور امشب انجام شد.</b><p>اگر خسته‌ای همین‌جا تمامش کن. فردا هم فرصت مرور هست.</p></div></div>}
       <div className="nightPrepare">
         <span className="nightSubheading"><BookOpen size={17}/> مرور شخصی با حافظه قبلی</span>
         <div className="nightModes">
           <button className={studyMode==='recall'?'selected':''} onClick={()=>{setStudyMode('recall');setSlides(null);setPlaying(false)}}><Brain size={16}/> یادآوری فعال</button>
           <button className={studyMode==='slideshow'?'selected':''} onClick={()=>{setStudyMode('slideshow');setSlides(null);setPlaying(false)}}><Play size={16}/> نمایش پی‌درپی تصویری</button>
         </div>
         <p>{studyMode==='recall'?'سؤال‌های اشتباه، موارد موعددار و چند عبارت از کلاس استاد انتخاب می‌شوند. اول جواب را حدس بزن؛ بعد کارت را برگردان.':'تصویرها، کلمات آلمانی و معنی‌ها هر چند ثانیه به‌آرامی پشت سر هم می‌آیند. نمایش خودکار به‌تنهایی تسلط ثبت نمی‌کند.'}</p>
         <div className="nightCount" role="group" aria-label="تعداد سؤال مرور">
           {[4,6,8].map(n=><button key={n} aria-pressed={count===n} onClick={()=>{setCount(n);setNightState(s=>({...createNightState(),...s,preferredCount:n}))}}
             className={count===n?'selected':''}>{n.toLocaleString('fa-IR')} سؤال</button>)}
         </div>
         {studyMode==='slideshow'&&<div className="nightSlideshowControls">
           {[7,9,12].map(t=><button key={t} className={slideSeconds===t?'active':''} onClick={()=>setSlideSeconds(t)}>{t} ثانیه برای هر کارت</button>)}
         </div>}
         {studyMode==='slideshow'&&<label className="nightGentle"><input type="checkbox" checked={automaticSound} onChange={e=>setAutomaticSound(e.target.checked)}/> پخش خودکار آلمانی (در مرورگرهای مجاز)</label>}
         <button className="nightStart" onClick={studyMode==='slideshow'?beginSlides:begin}><Moon size={19}/> {studyMode==='slideshow'?'شروع نمایش تصویری':summary.doneToday?'مرور اختیاری دوباره':'شروع شیفت شب'} <ArrowLeft size={18}/></button>
         {message&&<p role="alert">{message}</p>}
         <small>صدا به‌صورت پیش‌فرض خاموش است و این بخش تایمر اجباری برای یادآوری فعال ندارد.</small>
       </div>
     </div>}

     {!active && slides && <section className="nightSlideshow nightExercise">
       {slideshowDone?<><span className="nightCompleteIcon"><Sunrise size={34}/></span>
         <h2>نمایش تصویری تمام شد 🌙</h2>
         <p>دیدن تصاویر به‌تنهایی به معنی یادگیری نیست. اگر انرژی داری، با یادآوری فعال خودت را بسنج.</p>
         <div className="nightSlideshowControls">
           <button onClick={()=>{setSlideIndex(0);setPlaying(true)}}><RotateCcw size={16}/> نمایش دوباره</button>
           <button onClick={()=>{setSlides(null);setStudyMode('recall');setPlaying(false)}}>مرور فعال</button>
           <button onClick={()=>{setSlides(null);setPlaying(false)}}>پایان</button>
         </div></>:slideCard&&<>
           <div className="nightExerciseTop"><span>تصویر و تلفظ · {prettyGroup(slideCard.group)}</span>
             <span>{(slideIndex+1).toLocaleString('fa-IR')} از {slides.length.toLocaleString('fa-IR')}</span></div>
           <div className="nightTrack"><i style={{width:((slideIndex+1)/slides.length*100)+'%'}}/></div>
           <div className="nightVisual"><MnemonicArt word={slideCard.answer} number={getArtNumber(slideCard)} showLabel/></div>
           <h2 dir="ltr">{slideCard.answer}</h2>
           <p>{slideCard.prompt}</p>
           <div className="nightSlideshowControls">
             <button onClick={()=>speak(slideCard.audio||slideCard.answer)}><Volume2 size={18}/> پخش تلفظ</button>
             <button onClick={()=>setPlaying(p=>!p)}>{playing?<Pause size={18}/>:<Play size={18}/>} {playing?'توقف':'ادامه'}</button>
             <button onClick={()=>setSlideIndex(i=>i+1)}>بعدی <ArrowLeft size={15}/></button>
           </div>
           <p className="nightGentle">این حالت فقط نمایش است؛ برای ثبت «بلدم» باید در حالت یادآوری فعال پاسخ بدهی.</p>
         </>}
       </section>}
     {active && !isFinished && card && <section className="nightExercise" aria-live="polite">
       <div className="nightExerciseTop"><span>{prettyGroup(card.group)}</span><span>{(active.index+1).toLocaleString('fa-IR')} از {display.toLocaleString('fa-IR')}</span></div>
       <button className="nightSwitchMode" type="button" onClick={()=>{setNightState(state=>({...state,active:null}));setRevealed(false);}}>
         تغییر به نمایش تصویری یا انتخاب تمرین دیگر
       </button>
       <div className="nightTrack"><i style={{width:(100*active.index/display)+'%'}}/></div>
       <div className="nightQuestion">
         <small>{revealed?'پاسخ آلمانی':'ابتدا در ذهن خودت پاسخ بده'}</small>
         <div className="nightVisual"><MnemonicArt word={card.answer} number={getArtNumber(card)} showLabel={revealed}/></div>
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
