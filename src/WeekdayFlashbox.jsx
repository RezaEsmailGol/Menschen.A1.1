import React,{useEffect,useState} from 'react';
import {ArrowLeft,BookOpenCheck,CheckCircle2,ChevronLeft,ChevronRight,Gamepad2,GraduationCap,Lightbulb,RotateCcw,Volume2} from 'lucide-react';
import {WEEKDAYS,WEEKDAY_FLASH_KEY,weekdayOptions,gradeWeekday,saveWeekdayProgress,markWeekdayLearned,weekdayWeakWords} from './weekdayFlashEngine.js';
import './weekdayFlashbox.css';
function readProgress(){
 try{const d=JSON.parse(localStorage.getItem(WEEKDAY_FLASH_KEY)||'{}');return d&&typeof d==='object'&&!Array.isArray(d)?d:{}}catch{return {}}
}
export default function WeekdayFlashbox({speak=()=>{},onPracticeEvent}){
 const [mode,setMode]=useState('learn');
 const [index,setIndex]=useState(0);
 const [flipped,setFlipped]=useState(false);
 const [answer,setAnswer]=useState(null);
 const [progress,setProgress]=useState(readProgress);
 const [runs,setRuns]=useState({game:{right:0,total:0},test:{right:0,total:0}});
 const current=WEEKDAYS[index]||null;
 const finished=index>=WEEKDAYS.length;
 const stats=runs[mode]||runs.game;
 const learned=WEEKDAYS.filter(w=>progress[w.de]?.seen).length;
 const weak=weekdayWeakWords(progress).length;
 useEffect(()=>{try{localStorage.setItem(WEEKDAY_FLASH_KEY,JSON.stringify(progress))}catch{}},[progress]);
 function switchMode(next){
  setMode(next);setIndex(0);setFlipped(false);setAnswer(null);
  if(next!=='learn')setRuns(r=>({...r,[next]:{right:0,total:0}}));
 }
 function next(){
  setIndex(i=>Math.min(WEEKDAYS.length,i+1));setFlipped(false);setAnswer(null);
 }
 function prev(){
  setIndex(i=>Math.max(0,i-1));setFlipped(false);setAnswer(null);
 }
 function select(value){
  if(answer!==null||finished)return;
  const correct=gradeWeekday(index,mode,value);
  speak?.(mode==='test'?current.de:value);
  setAnswer({value,correct});
  setProgress(old=>saveWeekdayProgress(old,current.de,correct));
  setRuns(old=>({...old,[mode]:{right:old[mode].right+Number(correct),total:old[mode].total+1}}));
  onPracticeEvent?.({id:'weekday-'+mode+'-'+current.de,lesson:8,kind:'vocab',label:current.de,correct});
 }
 function learnedCurrent(){
  if(!current)return;
  setProgress(old=>markWeekdayLearned(old,current.de));
  next();
 }
 function restart(){
  setIndex(0);setFlipped(false);setAnswer(null);
  if(mode!=='learn')setRuns(old=>({...old,[mode]:{right:0,total:0}}));
 }
 return <section className="wdBox" id="lesson8-weekday-flashbox" aria-label="فلش‌باکس روزهای هفته درس هشت" dir="rtl">
  <div className="wdHeader">
   <div><span className="wdEyebrow">LEKTION 8 · WOCHENTAGE</span><h3>فلش‌باکس روزهای هفته</h3><small>۷ کارت کوتاه · آموزش، بازی و آزمون</small></div>
   <span className="wdStats">{mode==='learn'?learned+' / 7 یادگرفته':weak+' واژه نیازمند مرور'}</span>
  </div>
  <div className="wdModes" role="group" aria-label="حالت فلش‌باکس">
   <button type="button" aria-pressed={mode==='learn'} className={mode==='learn'?'selected':''} onClick={()=>switchMode('learn')}><BookOpenCheck size={17}/> یادگیری</button>
   <button type="button" aria-pressed={mode==='game'} className={mode==='game'?'selected':''} onClick={()=>switchMode('game')}><Gamepad2 size={17}/> بازی</button>
   <button type="button" aria-pressed={mode==='test'} className={mode==='test'?'selected':''} onClick={()=>switchMode('test')}><GraduationCap size={17}/> آزمون</button>
  </div>
  <div className="wdProgress"><span style={{width:(Math.min(index,WEEKDAYS.length)/WEEKDAYS.length*100)+'%'}}/></div>
  {finished?<div className="wdFinished" role="status">
   <CheckCircle2 size={34}/><b>{mode==='learn'?'هر هفت روز مرور شدند!':'این دور تمام شد!'}</b>
   <p>{mode==='learn'?'برای تثبیت از بازی و آزمون استفاده کن.':stats.right+' پاسخ درست از '+stats.total+' سؤال. اشتباه‌ها برای مرور ذخیره شده‌اند.'}</p>
   <button type="button" onClick={restart}><RotateCcw size={17}/> تکرار همین حالت</button>
  </div>:<>
   <div className="wdCounter"><span>{index+1} / 7</span><span>{mode==='learn'?'کارت را لمس کن تا معنی آشکار شود':mode==='game'?'معادل آلمانی را انتخاب کن':'معنی فارسی را انتخاب کن'}</span></div>
   {mode==='learn'?<div className="wdStudy">
    <button type="button" className={'wdFlash '+(flipped?'flipped':'')} onClick={()=>{speak?.(current.de);setFlipped(v=>!v)}} aria-label={flipped?'نمایش آلمانی کارت':'نمایش معنی فارسی کارت'}>
     <span className="wdFlashHint">{flipped?'معنی فارسی':'روز هفته به آلمانی'}</span>
     <strong lang={flipped?'fa':'de'} dir={flipped?'rtl':'ltr'}>{flipped?current.fa:current.de}</strong>
     <small>{flipped?current.exampleFa:'برای برگرداندن کارت لمس کن'}</small>
    </button>
    <div className="wdExample">
     <span><Lightbulb size={15}/> <b lang="de" dir="ltr">{current.example}</b></span>
     <button type="button" onClick={()=>speak(current.de)}><Volume2 size={17}/> تلفظ</button>
    </div>
    <div className="wdActions">
     <button type="button" onClick={prev} disabled={index===0}><ChevronRight size={16}/> قبلی</button>
     <button type="button" className="primary" onClick={learnedCurrent}>یاد گرفتم، بعدی <ArrowLeft size={16}/></button>
    </div>
   </div>:<div className="wdPlay">
    <strong className="wdPlayPrompt" lang={mode==='test'?'de':'fa'} dir={mode==='test'?'ltr':'rtl'}>{mode==='test'?current.de:current.fa}</strong>
    <div className="wdOptions" role="group" aria-label="پاسخ‌های روز هفته">
     {weekdayOptions(index,mode).map(value=><button key={value} type="button" lang={mode==='test'?'fa':'de'} dir={mode==='test'?'rtl':'ltr'}
       disabled={answer!==null} onClick={()=>select(value)}
       className={answer===null?'':value===(mode==='test'?current.fa:current.de)?'correct':answer.value===value?'wrong':''}>{value}</button>)}
    </div>
    {answer!==null&&<div className={'wdAnswer '+(answer.correct?'correct':'wrong')} role="status">
      <span>{answer.correct?'درست گفتی!':'پاسخ درست:'} <b lang="de" dir="ltr">{current.de}</b> — {current.fa}</span>
      <button type="button" onClick={()=>speak(current.de)}><Volume2 size={16}/> شنیدن پاسخ</button>
    </div>}
    <nav className="wdQuizNav" aria-label="جابجایی بین کارت‌های بازی و آزمون">
     <button type="button" disabled={index===0} onClick={prev}><ChevronRight size={18}/> قبلی</button>
     <button type="button" onClick={next}>{index===WEEKDAYS.length-1?'نمایش نتیجه':'بعدی'} <ChevronLeft size={18}/></button>
    </nav>
   </div>}
  </>}
  <div className="wdNote">قبل از روزها <b lang="de" dir="ltr">am</b> می‌آید: <b lang="de" dir="ltr">am Montag</b> یعنی «روز دوشنبه».</div>
 </section>;
}
