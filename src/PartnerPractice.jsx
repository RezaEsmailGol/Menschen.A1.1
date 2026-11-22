import React,{useEffect,useMemo,useState} from 'react';
import {ArrowLeft,BookOpenCheck,CheckCircle2,ChevronLeft,Headphones,MessageCircle,RefreshCcw,Repeat2,Users,UserRound,Volume2} from 'lucide-react';
import {lessons} from './courseData.js';
import {PARTNER_STORE,partnerScenarios,partnerForLesson,partnerProgress,advancePartnerProgress} from './partnerPracticeData.js';
import './partnerPractice.css';

const readState=()=>{try{const saved=JSON.parse(localStorage.getItem(PARTNER_STORE)||'{}');return saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{}}catch{return {}}};
const initialLesson=()=>{
 const id=Number(new URLSearchParams(window.location.search).get('lesson'));
 return Number.isInteger(id)&&id>=1&&id<=12?id:8;
};
export default function PartnerPractice({speak=()=>{}}){
 const [lessonId,setLessonId]=useState(initialLesson);
 const [state,setState]=useState(readState);
 const [activeId,setActiveId]=useState('');
 const [turnIndex,setTurnIndex]=useState(0);
 const [revealed,setRevealed]=useState(false);
 const [finished,setFinished]=useState(false);
 const [mode,setMode]=useState('duo');
 const scenarios=useMemo(()=>partnerForLesson(lessonId),[lessonId]);
 const active=partnerScenarios.find(s=>s.id===activeId);
 const turn=active?.turns[turnIndex];
 const responder=turn?.asker==='A'?'B':'A';
 const completed=partnerScenarios.filter(s=>state[s.id]?.completed).length;
 useEffect(()=>{try{localStorage.setItem(PARTNER_STORE,JSON.stringify(state));}catch{}},[state]);
 function changeLesson(id){setLessonId(id);setActiveId('');setRevealed(false);setFinished(false);setTurnIndex(0)}
 function start(scenario,reset=false){
  setActiveId(scenario.id);
  const before=partnerProgress(state,scenario.id);
  setTurnIndex(reset?0:before.next||0);
  setFinished(false);setRevealed(false);
 }
 function advance(hard){
  if(!active||!turn)return;
  setState(previous=>advancePartnerProgress(previous,active,turnIndex,hard));
  if(turnIndex===active.turns.length-1){setFinished(true);}
  else{setTurnIndex(n=>n+1);setRevealed(false)}
 }
 return <div className="partnerPage" dir="rtl">
  <header className="partnerIntro">
   <div><span className="partnerKicker"><Users size={17}/> Partnerarbeit · A1.1</span>
    <h1>تمرین مکالمه دونفره</h1>
    <p>نوبتی سؤال بپرسید و پاسخ بدهید. وقتی پارتنر در دسترس نیست، هر دو نقش را خودت تمرین کن.</p>
    <small>تمرین‌های تألیفی مکمل درس‌ها هستند؛ متن اصلی صفحات ۸۰ تا ۹۰ کتاب هنوز در اختیار اپ نیست.</small>
   </div>
   <span className="partnerCompleted">{completed.toLocaleString('fa-IR')} / {partnerScenarios.length.toLocaleString('fa-IR')} گفت‌وگو کامل</span>
  </header>
  <section className="partnerSelect" aria-label="انتخاب درس و حالت تمرین">
   <label htmlFor="partner-lesson">درس موردنظر</label>
   <select id="partner-lesson" value={lessonId} onChange={e=>changeLesson(Number(e.target.value))}>
    {lessons.map(lesson=><option key={lesson.id} value={lesson.id}>{lesson.id} · {lesson.label}</option>)}
   </select>
   <div className="partnerModes" role="group" aria-label="نوع مکالمه">
    <button type="button" aria-pressed={mode==='duo'} className={mode==='duo'?'selected':''} onClick={()=>setMode('duo')}><Users size={17}/> دو نفره</button>
    <button type="button" aria-pressed={mode==='solo'} className={mode==='solo'?'selected':''} onClick={()=>setMode('solo')}><UserRound size={17}/> تک‌نفره</button>
   </div>
  </section>
  <section className="partnerScenes" aria-label="گفت‌وگوهای تمرینی این درس">
   {scenarios.map(scene=><button type="button" key={scene.id} className={'partnerScene '+(activeId===scene.id?'current':'')} onClick={()=>start(scene)}>
    <span><MessageCircle size={18}/> <b>{scene.title}</b></span>
    <small>{scene.goal}</small>
    <span className="partnerSceneFoot">{scene.turns.length.toLocaleString('fa-IR')} نوبت · {state[scene.id]?.completed?'تکمیل شده':state[scene.id]?.done?'ادامه تمرین':'شروع'} <ChevronLeft size={16}/></span>
   </button>)}
  </section>
  {active&&<section className="partnerStage" aria-label="تمرین گفت‌وگوی انتخاب‌شده">
   <div className="partnerStageHeader"><b>{active.title}</b><span>{finished?'پایان تمرین':(turnIndex+1).toLocaleString('fa-IR')+' از '+active.turns.length.toLocaleString('fa-IR')}</span></div>
   <div className="partnerTrack"><span style={{width:((finished?active.turns.length:turnIndex)/active.turns.length*100)+'%'}}/></div>
   {finished?<div className="partnerFinish" role="status">
    <CheckCircle2 size={38}/><h2>گفت‌وگو را انجام دادید!</h2>
    <p>این پیشرفت از تأیید خودتان ثبت شد؛ سنجش خودکار کیفیت گفتار انجام نشده است.</p>
    <button type="button" onClick={()=>start(active,true)}><RefreshCcw size={17}/> دوباره تمرین کنیم</button>
   </div>:<div className="partnerTurn">
    <div className="partnerRoles"><span className="partnerAsk">نقش {turn.asker} · سؤال</span><Repeat2 size={18}/><span className="partnerReply">نقش {responder} · پاسخ</span></div>
    <div className="partnerQuestion"><small>{mode==='duo'?('نفر '+turn.asker+' بلند بپرسد'):'سؤال را بشنو و با صدای بلند تکرار کن'}</small>
     <strong lang="de" dir="ltr">{turn.ask}</strong><span>{turn.askFa}</span>
     <button type="button" onClick={()=>speak(turn.ask)}><Volume2 size={18}/> شنیدن سؤال</button>
    </div>
    <div className="partnerResponse"><b>{mode==='duo'?('نفر '+responder+' به آلمانی جواب بدهد'):'حالا خودت جواب بده'}</b>
     {!revealed?<button type="button" className="partnerReveal" onClick={()=>setRevealed(true)}>نمایش راهنمای پاسخ <ChevronLeft size={18}/></button>:
      <div className="partnerSample"><small>یک پاسخ نمونه (پاسخ‌های درست دیگر هم ممکن‌اند)</small>
       <strong lang="de" dir="ltr">{turn.answer}</strong><span>{turn.answerFa}</span><p>{turn.tip}</p>
       <button type="button" onClick={()=>speak(turn.answer)}><Headphones size={17}/> تلفظ پاسخ</button>
      </div>}
    </div>
    <div className="partnerActions"><button type="button" className="partnerHard" onClick={()=>advance(true)}>نیاز به تمرین بیشتر</button>
     <button type="button" className="partnerNext" onClick={()=>advance(false)}>گفتیم، بعدی <ArrowLeft size={17}/></button></div>
    <p className="partnerNote">پاسخ‌ها خودارزیابی هستند؛ برای نمره تلفظ از مربی میکروفون استفاده کن.</p>
   </div>}
  </section>}
  <nav className="partnerBottomLinks" aria-label="مسیرهای دیگر تمرین">
   <a href={'/lessons/'+lessonId+'#book-practice'}><BookOpenCheck size={18}/> تمرین‌های انفرادی همین درس</a>
   <a href="/practice"><ArrowLeft size={17}/> همه تمرین‌ها</a>
  </nav>
 </div>;
}
