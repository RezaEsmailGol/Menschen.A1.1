import React,{useMemo,useState} from 'react';
import {CalendarDays,CheckCircle2,Clock3,Headphones,RotateCcw,Volume2,XCircle} from 'lucide-react';
import {activityItemKey} from './learningMemory.js';
import './lesson8TimeLab.css';
import {class8Games} from './lesson8Classroom.js';

// Original interactive mini-games complement the authored book exercises.
// Months are clearly labelled as extra review, not core Lektion 8 material.
export const lesson8Days=[
  ['Montag','دوشنبه'],['Dienstag','سه‌شنبه'],['Mittwoch','چهارشنبه'],
  ['Donnerstag','پنج‌شنبه'],['Freitag','جمعه'],['Samstag','شنبه'],['Sonntag','یکشنبه']
];
export const lesson8Months=[
  ['Januar','ژانویه'],['Februar','فوریه'],['März','مارس'],['April','آوریل'],
  ['Mai','مه'],['Juni','ژوئن'],['Juli','ژوئیه'],['August','اوت'],
  ['September','سپتامبر'],['Oktober','اکتبر'],['November','نوامبر'],['Dezember','دسامبر']
];
export const lesson8Clocks=[
  {hour:8,minute:0,de:'acht Uhr',fa:'۸:۰۰'},
  {hour:8,minute:30,de:'halb neun',fa:'۸:۳۰'},
  {hour:4,minute:15,de:'Viertel nach vier',fa:'۴:۱۵'},
  {hour:9,minute:45,de:'Viertel vor zehn',fa:'۹:۴۵'},
  {hour:15,minute:30,de:'halb vier',fa:'۱۵:۳۰'},
  {hour:17,minute:0,de:'fünf Uhr',fa:'۱۷:۰۰'},
  {hour:7,minute:30,de:'halb acht',fa:'۷:۳۰'},
  {hour:10,minute:15,de:'Viertel nach zehn',fa:'۱۰:۱۵'}
];
const modes=[
  {id:'days',title:'روزهای هفته',description:'۷ روز',Icon:CalendarDays},
  {id:'clocks',title:'ساعت‌ها',description:'۸ ساعت تصویری',Icon:Clock3},
  {id:'months',title:'ماه‌ها (مرور اضافه)',description:'۱۲ ماه',Icon:CalendarDays},
  {id:'appointments',title:'قرار ملاقات',description:'۶ موقعیت مکالمه',Icon:CalendarDays},
  {id:'frequency',title:'قیدهای تکرار',description:'۷ قید Wie oft',Icon:RotateCcw},
  {id:'intervals',title:'jeden / jede / jedes',description:'۶ عبارت زمانی',Icon:CalendarDays}
];
function itemsFor(mode){
  if(mode==='clocks')return lesson8Clocks;
  if(class8Games[mode])return class8Games[mode];
  return (mode==='months'?lesson8Months:lesson8Days).map(([de,fa])=>({de,fa}));
}
export function timeLabChoices(items,index){
  const offsets=[0,2,3,5];
  const used=new Set();
  const values=offsets.map(offset=>items[(index+offset)%items.length]?.de)
    .filter(value=>value&&!used.has(value)&&used.add(value));
  return values.slice(index%4).concat(values.slice(0,index%4));
}
function ClockFace({hour,minute}){
  const hourAngle=((hour%12)+minute/60)*Math.PI/6;
  const minuteAngle=minute*Math.PI/30;
  const pos=(angle,length)=>({x:50+Math.sin(angle)*length,y:50-Math.cos(angle)*length});
  const h=pos(hourAngle,23),m=pos(minuteAngle,33);
  return <svg className="l8-clock" viewBox="0 0 100 100" role="img" aria-label="ساعت عقربه‌ای؛ ساعت را از روی عقربه‌ها تشخیص بده">
    <circle cx="50" cy="50" r="46" className="l8-clock-face"/>
    {Array.from({length:12},(_,i)=>{
      const angle=i*Math.PI/6;
      const a=pos(angle,39),b=pos(angle,43),label=pos(angle,34);
      return <g key={i}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="l8-clock-mark"/>
        <text x={label.x} y={label.y+2.8} className="l8-clock-digit" textAnchor="middle">{i||12}</text></g>;
    })}
    <line x1="50" y1="50" x2={h.x} y2={h.y} className="l8-clock-hour"/>
    <line x1="50" y1="50" x2={m.x} y2={m.y} className="l8-clock-minute"/>
    <circle cx="50" cy="50" r="3.5" className="l8-clock-dot"/>
  </svg>;
}
export default function Lesson8TimeLab({speak,onPracticeEvent}){
  const [mode,setMode]=useState('days');
  const [indexes,setIndexes]=useState(Object.fromEntries(modes.map(m=>[m.id,0])));
  const [answered,setAnswered]=useState(null);
  const [results,setResults]=useState(Object.fromEntries(modes.map(m=>[m.id,{good:0,total:0}])));
  const items=itemsFor(mode);
  const index=indexes[mode]%items.length;
  const item=items[index];
  const choices=useMemo(()=>item.choices||timeLabChoices(items,index),[mode,index]);
  const result=results[mode];
  function select(value){
    if(answered!==null)return;
    const correct=value===item.de;
    setAnswered({value,correct});
    setResults(prev=>({...prev,[mode]:{good:prev[mode].good+Number(correct),total:prev[mode].total+1}}));
    onPracticeEvent?.({
      id:activityItemKey('lesson8-time-lab',mode,item.de),
      lesson:8,kind:mode==='clocks'?'number':mode==='appointments'?'sentence':mode==='intervals'?'grammar':'vocab',
      label:item.de,correct
    });
  }
  function next(){
    setIndexes(prev=>({...prev,[mode]:(prev[mode]+1)%items.length}));
    setAnswered(null);
  }
  function changeMode(value){setMode(value);setAnswered(null);}
  return <section className="l8-lab" id="lesson8-time-lab" aria-label="بازی تصویری روز، ساعت، ماه و قرار ملاقات درس هشت">
    <div className="l8-lab-head"><div><span className="l8-overline">LEKTION 8 · 6 MINI-GAMES</span>
      <h4>بازی روزها، ساعت، ماه‌ها و گرامر کلاس</h4>
      <p>هر بار فقط یک سؤال؛ بعد از پاسخ، کلمه درست را بشنو و تکرار کن.</p>
    </div><span className="l8-score">{result.good} / {result.total} درست</span></div>
    <div className="l8-modes" role="group" aria-label="انتخاب نوع تمرین">
      {modes.map(({id,title,description,Icon})=><button type="button" key={id} onClick={()=>changeMode(id)}
        className={id===mode?'active':''} aria-pressed={id===mode}>
        <Icon size={17}/><span>{title}<small>{description}</small></span></button>)}
    </div>
    <div className={"l8-question "+(mode==='appointments'?'l8-appointment':'')}>
      <div className="l8-question-top"><span>سؤال {index+1} از {items.length}</span><span>{mode==='clocks'?'ساعت عقربه‌ای را بخوان':mode==='appointments'?'جمله مناسب قرار را انتخاب کن':mode==='intervals'?'شکل درست jeder را انتخاب کن':'معادل آلمانی را انتخاب کن'}</span></div>
      <div className="l8-progress"><span style={{width:((index+1)/items.length*100)+'%'}}/></div>
      {mode==='clocks'?<ClockFace hour={item.hour} minute={item.minute}/>:
        <div className="l8-prompt">{item.fa}</div>}
      <div className="l8-choice-grid" role="group" aria-label="گزینه‌های پاسخ">
        {choices.map(value=><button type="button" key={value} disabled={answered!==null}
          onClick={()=>select(value)} lang="de" dir="ltr"
          className={answered!==null?(value===item.de?'correct':answered.value===value?'incorrect':''):''}>
          {value}</button>)}
      </div>
      {answered!==null&&<div className={'l8-result '+(answered.correct?'correct':'incorrect')} role="status">
        {answered.correct?<CheckCircle2 size={20}/>:<XCircle size={20}/>}
        <span>{answered.correct?'درست بود!':'جواب درست:'} <strong lang="de">{item.de}</strong>{' '}<small>{item.fa}</small></span>
        <button type="button" onClick={()=>speak(item.de)}><Volume2 size={16}/> تلفظ</button>
        <button type="button" onClick={next}>بعدی ←</button>
      </div>}
    </div>
    <div className="l8-lab-footer">
      <span><Headphones size={16}/> برای تثبیت تلفظ، بعد از دیدن جواب آن را با صدای بلند تکرار کن.</span>
      <button type="button" onClick={()=>{setIndexes(prev=>({...prev,[mode]:0}));setAnswered(null);}}>
        <RotateCcw size={15}/> شروع دوباره این بخش</button>
    </div>
  </section>;
}
