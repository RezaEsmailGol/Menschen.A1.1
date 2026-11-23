import React,{useEffect,useMemo,useState} from 'react';
import {ArrowLeft,CheckCircle2,ChevronLeft,ChevronRight,Clock3,Headphones,RotateCcw,Volume2} from 'lucide-react';
import {MINUTE_KEY,minuteBookBank,minutePrecisionBank,clockChoiceOptions,toFormal,toColloquial,isExactMinute,recordMinuteAttempt,minuteWeak} from './lesson8MinuteEngine.js';
import './lesson8MinuteTrainer.css';
const fa=x=>Number(x).toLocaleString('fa-IR');
function loadProgress(){try{const data=JSON.parse(localStorage.getItem(MINUTE_KEY)||'{}');return data&&typeof data==='object'&&!Array.isArray(data)?data:{}}catch{return {}}}
const modes=[
 {id:'formal',label:'ساعت رسمی',sub:'Im Radio / Fernsehen'},
 {id:'colloquial',label:'ساعت محاوره‌ای',sub:'Im Gespräch'},
 {id:'dictation',label:'دیکته دقیقه‌ای',sub:'Hören & Schreiben'}
];
function MinuteClockFace({hour,minute}){
 const h=((hour%12)+minute/60)*30;
 const m=minute*6;
 return <svg className="mcAnalog" viewBox="0 0 160 160" role="img" aria-label="نمای ساعت عقربه‌ای">
  <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="2" opacity=".18"/>
  {Array.from({length:60},(_,i)=>{
   const a=(i*6-90)*Math.PI/180;
   const inner=i%5===0?61:67;
   return <line key={i} x1={80+inner*Math.cos(a)} y1={80+inner*Math.sin(a)}
    x2={80+71*Math.cos(a)} y2={80+71*Math.sin(a)}
    stroke="currentColor" strokeWidth={i%5===0?2.6:1} opacity={i%5===0?.85:.25}/>;
  })}
  {Array.from({length:12},(_,i)=>{
   const n=i+1,a=(n*30-90)*Math.PI/180;
   return <text key={n} x={80+51*Math.cos(a)} y={80+51*Math.sin(a)+4} textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="700">{n}</text>;
  })}
  <line x1="80" y1="80" x2={80+35*Math.sin(h*Math.PI/180)} y2={80-35*Math.cos(h*Math.PI/180)} stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
  <line x1="80" y1="80" x2={80+58*Math.sin(m*Math.PI/180)} y2={80-58*Math.cos(m*Math.PI/180)} stroke="#6b56d4" strokeWidth="3" strokeLinecap="round"/>
  <circle cx="80" cy="80" r="5" fill="#6b56d4"/>
 </svg>;
}
export default function Lesson8MinuteTrainer({speak=()=>{},onPracticeEvent,initialSet='precision'}){
 const [setId,setSetId]=useState(initialSet==='book'?'book':'precision');
 const [mode,setMode]=useState('formal');
 const [idx,setIdx]=useState(0);
 const [answer,setAnswer]=useState(null);
 const [typed,setTyped]=useState('');
 const [progress,setProgress]=useState(loadProgress);
 const [attempts,setAttempts]=useState({correct:0,total:0});
 const [weakOnly,setWeakOnly]=useState(false);
 const [weakIds,setWeakIds]=useState([]);
 const source=setId==='book'?minuteBookBank:minutePrecisionBank;
 const items=useMemo(()=>weakOnly?source.filter(item=>weakIds.includes(item.id)):source,[weakOnly,weakIds,source]);
 const item=items[idx]||null;
 const finished=idx>=items.length||items.length===0;
 const correctText=item?(mode==='formal'?item.formal:item.colloquial):'';
 const options=useMemo(()=>item&&mode!=='dictation'?clockChoiceOptions(item,mode):[],[item,mode]);
 const weakCount=minuteWeak(progress,source).length;
 useEffect(()=>{try{localStorage.setItem(MINUTE_KEY,JSON.stringify(progress))}catch{}},[progress]);
 function changeMode(m){setMode(m);setIdx(0);setAnswer(null);setTyped('');setWeakOnly(false);setAttempts({correct:0,total:0})}
 function changeBank(b){setSetId(b);setIdx(0);setAnswer(null);setTyped('');setWeakOnly(false);setAttempts({correct:0,total:0})}
 function choose(value){
  if(!item||answer!==null)return;
  const correct=mode==='dictation'?isExactMinute(value,item.time):value===correctText;
  setAnswer({correct,value});
  setProgress(old=>recordMinuteAttempt(old,item,mode,correct));
  setAttempts(old=>({correct:old.correct+Number(correct),total:old.total+1}));
  onPracticeEvent?.({id:'lesson8-minute:'+item.time+':'+mode,lesson:8,kind:mode==='dictation'?'dictation':'number',label:item.time,correct});
  if(mode!=='dictation')speak?.(value);
 }
 function next(){setIdx(i=>Math.min(i+1,items.length));setAnswer(null);setTyped('')}
 function previous(){setIdx(i=>Math.max(i-1,0));setAnswer(null);setTyped('')}
 function retry(){setAnswer(null);setTyped('')}
 function startWeak(){setWeakIds(minuteWeak(progress,source).map(item=>item.id));setWeakOnly(true);setIdx(0);setAnswer(null);setTyped('');setAttempts({correct:0,total:0})}
 function resetSet(){setWeakOnly(false);setIdx(0);setAnswer(null);setTyped('');setAttempts({correct:0,total:0})}
 return <section className="mcLab" id="lesson8-minute-trainer" dir="rtl" aria-label="تمرین دقیقه‌ای ساعت درس هشت">
  <header className="mcHeader">
   <div><span>LEKTION 8 · UHRZEITEN</span><h3>مربی ساعت تا دقت یک دقیقه</h3>
   <p>خواندن ساعت به دو شیوه آلمانی، شناخت عقربه‌ها و دیکته شنیداری.</p></div>
   <div className="mcStats"><b>{fa(attempts.correct)} / {fa(attempts.total)}</b><small>پاسخ صحیح</small></div>
  </header>
  <div className="mcBank" role="group" aria-label="انتخاب بانک ساعت">
   <button type="button" className={setId==='book'?'active':''} aria-pressed={setId==='book'} onClick={()=>changeBank('book')}>تمرین ۴ کتاب کار · ۹ ساعت</button>
   <button type="button" className={setId==='precision'?'active':''} aria-pressed={setId==='precision'} onClick={()=>changeBank('precision')}>چالش دقیقه‌ای · ۲۴ ساعت</button>
  </div>
  <div className="mcModes" role="group" aria-label="روش تمرین ساعت">
   {modes.map(m=><button key={m.id} type="button" aria-pressed={mode===m.id} className={mode===m.id?'active':''} onClick={()=>changeMode(m.id)}>
    <b>{m.label}</b><small lang="de">{m.sub}</small></button>)}
  </div>
  <div className="mcStatus"><span>{fa(Math.min(idx+1,items.length))} از {fa(items.length)} سؤال</span><span>{fa(weakCount)} ساعت نیازمند مرور</span></div>
  <div className="mcProgress"><span style={{width:((Math.min(idx,items.length)/Math.max(1,items.length))*100)+'%'}}/></div>
  {weakCount>0&&!weakOnly&&<button className="mcWeak" onClick={startWeak}><RotateCcw size={16}/> تمرین فقط {fa(weakCount)} ساعت اشتباه</button>}
  {finished?<div className="mcFinish" role="status"><CheckCircle2 size={34}/><b>{items.length?'این مجموعه تمام شد!':'ساعت حل‌نشده‌ای برای مرور نداری.'}</b><p>از هر اشتباه می‌توانی دوباره تمرین بگیری؛ پاسخ صحیح جدید از فهرست ضعف حذف می‌شود.</p><button type="button" onClick={resetSet}>شروع دور جدید</button></div>:<div className="mcQuestion">
   <div className="mcQuestionTop"><span>{mode==='dictation'?'گوش بده و دقیقاً HH:MM بنویس':mode==='formal'?'ساعت رسمی را انتخاب کن':'ساعت محاوره‌ای را انتخاب کن'}</span><small>Arbeitsbuch · {setId==='book'?'S. 61 / PDF 56':'تمرین تکمیلی دقیقه‌ای'}</small></div>
   {mode==='dictation'?<div className="mcListen">
    <Headphones size={29}/><p>ساعت را بشنو. هر دقیقه اهمیت دارد.</p>
    <button type="button" onClick={()=>speak(item.formal)}><Volume2 size={20}/> پخش ساعت به آلمانی</button>
   </div>:<div className="mcFace">
    <MinuteClockFace hour={item.hour} minute={item.minute}/>
    <strong className="mcDigital" dir="ltr">{item.time}</strong>
   </div>}
   {mode==='dictation'?<form className="mcForm" onSubmit={e=>{e.preventDefault();choose(typed)}}>
    <input value={typed} onChange={e=>setTyped(e.target.value)} disabled={answer!==null} placeholder="HH:MM" dir="ltr" inputMode="text" autoComplete="off" aria-label="ساعت شنیده‌شده به شکل HH:MM"/>
    <button type="submit" disabled={answer!==null||!typed.trim()}>بررسی دقیقه</button>
   </form>:<div className="mcOptions">
    {options.map(option=><button key={option} type="button" lang="de" dir="ltr" disabled={answer!==null} onClick={()=>choose(option)}
      className={answer===null?'':option===correctText?'correct':option===answer.value?'wrong':''}>{option}</button>)}
   </div>}
   {answer!==null&&<div className={'mcFeedback '+(answer.correct?'correct':'wrong')} role="status">
    <b>{answer.correct?'دقیق و درست!':'دوباره تمرین کن؛ حتی یک دقیقه خطا مهم است.'}</b>
    <div><span>رسمی:</span><strong lang="de" dir="ltr">{item.formal}</strong><button type="button" onClick={()=>speak(item.formal)} aria-label="تلفظ رسمی"><Volume2 size={18}/></button></div>
    <div><span>محاوره‌ای:</span><strong lang="de" dir="ltr">{item.colloquial}</strong><button type="button" onClick={()=>speak(item.colloquial)} aria-label="تلفظ محاوره‌ای"><Volume2 size={18}/></button></div>
    <button type="button" className="mcRetry" onClick={retry}><RotateCcw size={17}/> دوباره همین ساعت را بپرس</button>
   </div>}
   <nav className="mcNav" aria-label="سؤال قبلی و بعدی">
    <button type="button" disabled={idx===0} onClick={previous}><ChevronRight size={18}/> قبلی</button>
    <button type="button" onClick={next}>{idx===items.length-1?'دیدن نتیجه':'بعدی'} <ChevronLeft size={18}/></button>
   </nav>
  </div>}
  <p className="mcFootnote">در ساعت دقیق: «14:37» را می‌توان <b lang="de">vierzehn Uhr siebenunddreißig</b> گفت. در محاوره: «14:30» می‌شود <b lang="de">halb drei</b>، نه halb zwei. تمرین‌های دقیقه‌ای فراتر از مثال‌های کتاب‌اند.</p>
 </section>;
}
