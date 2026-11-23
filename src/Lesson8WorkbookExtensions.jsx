import React,{useEffect,useState} from 'react';
import {ArrowLeft,BookOpenCheck,CalendarDays,CheckCircle2,ChevronLeft,ChevronRight,Clock3,Headphones,RotateCcw,Volume2} from 'lucide-react';
import Lesson8MinuteTrainer from './Lesson8MinuteTrainer.jsx';
import WeekdayFlashbox from './WeekdayFlashbox.jsx';
import {dayRows,appointmentChoices} from './lesson8MinuteEngine.js';
import './lesson8WorkbookExtensions.css';
const PROGRESS_KEY='dt_ab8_days_appointments_v1';
const tabs=[{id:'clock',label:'ساعت دقیق',Icon:Clock3},{id:'days',label:'روزهای هفته',Icon:CalendarDays},{id:'meeting',label:'قرار ملاقات',Icon:Headphones}];
function restore(){try{return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}')||{}}catch{return {}}}
function optionsForDay(i){
 const indexes=[i,(i+2)%7,(i+4)%7,(i+5)%7];
 const list=indexes.map(n=>dayRows[n][1]),rot=(i+2)%4;
 return list.slice(rot).concat(list.slice(0,rot));
}
const fa=n=>Number(n).toLocaleString('fa-IR');
export default function Lesson8WorkbookExtensions({speak=()=>{},onPracticeEvent}){
 const [tab,setTab]=useState('clock');
 const [index,setIndex]=useState(0);
 const [answer,setAnswer]=useState(null);
 const [progress,setProgress]=useState(restore);
 const [right,setRight]=useState(0);
 const items=tab==='days'?dayRows:appointmentChoices;
 const current=items[index];
 useEffect(()=>{try{localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress))}catch{}},[progress]);
 function selectTab(id){setTab(id);setIndex(0);setAnswer(null);setRight(0)}
 function select(value){
  if(answer!==null)return;
  const expected=tab==='days'?current[1]:current.answer;
  const correct=value===expected;
  setAnswer({correct,value});
  setRight(n=>n+Number(correct));
  if(tab==='days')speak?.(value);
  else speak?.(expected);
  const id='ab8-'+tab+'-'+index;
  setProgress(old=>({...old,[id]:{
   attempts:(old[id]?.attempts||0)+1,misses:(old[id]?.misses||0)+Number(!correct),
   lastCorrect:correct,completed:correct||Boolean(old[id]?.completed),lastAt:Date.now()
  }}));
  onPracticeEvent?.({id,lesson:8,kind:tab==='days'?'vocab':'sentence',label:expected,correct});
 }
 function previous(){setIndex(i=>Math.max(0,i-1));setAnswer(null)}
 function next(){setIndex(i=>Math.min(items.length,i+1));setAnswer(null)}
 return <section className="ab8Extra" aria-label="تمرین‌های مخصوص کتاب کار درس هشت">
  <header className="ab8Header">
   <span><BookOpenCheck size={18}/> ARBEITSBUCH · LEKTION 8 · SEITE 61</span>
   <h2>ساعت، روزهای هفته و قرار ملاقات</h2>
   <p>بر اساس تمرین‌های ۴، ۵ و ۶ کتاب کار؛ هر بار فقط یک بخش نمایش داده می‌شود.</p>
  </header>
  <nav className="ab8Tabs" role="group" aria-label="انتخاب تمرین صفحه شصت و یک">
   {tabs.map(({id,label,Icon})=><button key={id} type="button" className={tab===id?'active':''} aria-pressed={tab===id} onClick={()=>selectTab(id)}><Icon size={17}/>{label}</button>)}
  </nav>
  {tab==='clock'?<Lesson8MinuteTrainer initialSet="book" speak={speak} onPracticeEvent={onPracticeEvent}/>:
   <div className="ab8Quiz">
    <div className="ab8Counter"><b>تمرین {tab==='days'?'۶ · Wochentage':'۵ · Verabredung'}</b><span>{fa(Math.min(index+1,items.length))} از {fa(items.length)}</span></div>
    {index>=items.length?<div className="ab8Finished" role="status"><CheckCircle2 size={30}/><b>این مرحله تمام شد.</b><span>{fa(right)} پاسخ صحیح از {fa(items.length)} سؤال</span><button onClick={()=>{setIndex(0);setAnswer(null);setRight(0)}}><RotateCcw size={16}/> تکرار مرحله</button></div>:
    <>
     {tab==='days'?<div className="ab8Prompt">
      <small>روز انگلیسی را به آلمانی تبدیل کن</small>
      <strong lang="en" dir="ltr">{current[0]}</strong>
      <span>{current[2]}</span>
     </div>:<div className="ab8Prompt"><small>پاسخ مناسب مکالمه را انتخاب کن</small><strong lang="de" dir="ltr">{current.ask}</strong><span>{current.fa}</span></div>}
     <div className="ab8Answers">
      {(tab==='days'?optionsForDay(index):current.choices).map(opt=><button key={opt} type="button" lang="de" dir="ltr" disabled={answer!==null}
       className={answer===null?'':opt===(tab==='days'?current[1]:current.answer)?'correct':answer.value===opt?'wrong':''}
       onClick={()=>select(opt)}>{opt}</button>)}
     </div>
     {answer!==null&&<div className={'ab8Result '+(answer.correct?'correct':'wrong')} role="status">
      <b>{answer.correct?'درست است!':'پاسخ درست:'}</b>
      <span lang="de" dir="ltr">{tab==='days'?current[1]:current.answer}</span>
      <button onClick={()=>speak(tab==='days'?current[1]:current.answer)}><Volume2 size={16}/> تلفظ</button>
     </div>}
     <nav className="ab8Navigation" aria-label="سؤال قبلی و بعدی">
      <button disabled={index===0} onClick={previous}><ChevronRight size={17}/> قبلی</button>
      <button onClick={next}>بعدی <ChevronLeft size={17}/></button>
     </nav>
    </>}
    {tab==='days'&&<details className="ab8More"><summary>فلش‌کارت کامل هفت روز با تلفظ و بازی</summary><WeekdayFlashbox speak={speak} onPracticeEvent={onPracticeEvent}/></details>}
    {tab==='meeting'&&<p className="ab8Note">برای پیشنهاد قرار: <b lang="de" dir="ltr">am Freitag</b> (روز جمعه) و <b lang="de" dir="ltr">um vier Uhr</b> (ساعت چهار). برای رد مؤدبانه از <b lang="de" dir="ltr">Leider kann ich nicht.</b> استفاده کن.</p>}
   </div>}
 </section>;
}
