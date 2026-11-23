import React,{useEffect,useMemo,useState} from 'react';
import {ArrowLeft,BookOpenCheck,CheckCircle2,ChevronLeft,ChevronRight,FileText,Headphones,Lightbulb,Mic2,RotateCcw,Save,Search,Target,Volume2,X} from 'lucide-react';
import {ARBEITSBUCH_KEY,ARBEITSBUCH_SOURCE,ARBEITSBUCH_NOTE,arbeitsbuchLessons,arbeitsbuchLesson,arbeitsbuchTasks,arbeitsbuchTotal,gradeArbeitsbuchTask,recordArbeitsbuchAttempt,recordArbeitsbuchWriting,arbeitsbuchWeakTasks} from './arbeitsbuchSourceData.js';
import './arbeitsbuchStudio.css';
import Lesson8WorkbookExtensions from './Lesson8WorkbookExtensions.jsx';

function loadState(){
 try{const data=JSON.parse(localStorage.getItem(ARBEITSBUCH_KEY)||'{}');return data&&typeof data==='object'&&!Array.isArray(data)?data:{}}catch{return {}}
}
function requestedLesson(){
 const q=new URLSearchParams(window.location.search).get('lesson');
 const n=Number(q);
 if(/^\d+$/.test(q||'')&&n>=1&&n<=12)return n;
 try{const stored=Number(localStorage.getItem('dt_current_lesson'));if(stored>=1&&stored<=12)return stored}catch{}
 return 8;
}
function isDone(state,item){return Boolean(state[item.id]?.completed||state[item.id]?.submitted)}
const display=n=>Number(n||0).toLocaleString('fa-IR');
const kindName={fill:'جای خالی',choice:'چندگزینه‌ای',order:'ترتیب کلمات',writing:'نوشتن'};
const sectionName={'Basistraining':'تمرین پایه','Test':'آزمون کتاب کار','Training: Schreiben':'مهارت نوشتن','Training: Sprechen':'مهارت گفت‌وگو','Training: Lesen':'درک مطلب','Lernwortschatz':'واژگان'};

export default function ArbeitsbuchStudio({speak=()=>{},onPracticeEvent}){
 const [lessonId,setLessonId]=useState(requestedLesson);
 const [progress,setProgress]=useState(loadState);
 const [filter,setFilter]=useState('all');
 const [activeId,setActiveId]=useState('');
 const [typed,setTyped]=useState('');
 const [selected,setSelected]=useState([]);
 const [result,setResult]=useState(null);
 const [showModel,setShowModel]=useState(false);
 const [submitted,setSubmitted]=useState(false);
 const lesson=arbeitsbuchLesson(lessonId);
 const filtered=useMemo(()=>{
  if(!lesson)return [];
  if(filter==='weak')return lesson.tasks.filter(t=>progress[t.id]?.lastCorrect===false);
  if(filter==='new')return lesson.tasks.filter(t=>!progress[t.id]?.attempts&&!progress[t.id]?.submitted);
  return lesson.tasks;
 },[lesson,progress,filter]);
 const current=filtered.find(t=>t.id===activeId)||filtered[0]||null;
 const done=lesson?.tasks.filter(t=>isDone(progress,t)).length||0;
 const mastered=lesson?.tasks.filter(t=>progress[t.id]?.lastCorrect===true).length||0;
 const weak=arbeitsbuchWeakTasks(progress,lessonId).length;
 const totalDone=arbeitsbuchTasks.filter(t=>isDone(progress,t)).length;
 const used=new Set(selected);
 useEffect(()=>{try{localStorage.setItem(ARBEITSBUCH_KEY,JSON.stringify(progress))}catch{}},[progress]);
 useEffect(()=>{
  if(current?.id!==activeId||(!current&&activeId)){
   setActiveId(current?.id||'');setSelected([]);setResult(null);setShowModel(false);
   setTyped(current?.kind==='writing'?progress[current.id]?.draft||'':'');setSubmitted(false);
  }
 },[current?.id,activeId]);
 function chooseTask(task){
  setActiveId(task.id);setTyped(task.kind==='writing'?progress[task.id]?.draft||'':'');
  setSelected([]);setResult(null);setShowModel(false);setSubmitted(false);
 }
 function changeLesson(value){
  setLessonId(value);setActiveId('');setFilter('all');setTyped('');
  setSelected([]);setResult(null);setShowModel(false);setSubmitted(false);
 }
 function resetTask(){if(!current)return;chooseTask(current)}
 function pickWord(index){if(result!==null)return;setSelected(s=>s.includes(index)?s.filter(n=>n!==index):[...s,index])}
 function grade(value){
  if(!current||current.kind==='writing'||result!==null)return;
  const correct=gradeArbeitsbuchTask(current,value);
  setResult({correct,submitted:value});
  setProgress(old=>recordArbeitsbuchAttempt(old,current,correct));
  onPracticeEvent?.({id:'arbeitsbuch:'+current.id,kind:current.kind==='choice'?'vocabulary':'grammar',lesson:lessonId,label:current.title,correct});
 }
 function next(){const i=filtered.findIndex(t=>t.id===current?.id);if(i>=0&&i+1<filtered.length)chooseTask(filtered[i+1])}
 function saveWriting(){
  if(!current||current.kind!=='writing'||!typed.trim())return;
  setProgress(old=>recordArbeitsbuchWriting(old,current,typed));
  setShowModel(true);setSubmitted(true);
 }
 return <main className="abStudio" dir="rtl">
  <header className="abStudioHero">
   <div className="abStudioIntro">
    <span className="abStudioEyebrow"><BookOpenCheck size={17}/> {ARBEITSBUCH_SOURCE}</span>
    <h1>کتاب کار آلمانی</h1>
    <p>تمارین مستقل Arbeitsbuch، با منبع درس و صفحه، راهنمای فارسی و مرور اشتباه‌ها.</p>
    <small>{ARBEITSBUCH_NOTE}</small>
   </div>
   <div className="abStudioTotal"><strong>{display(totalDone)} / {display(arbeitsbuchTotal)}</strong><span>فعالیت انجام‌شده</span></div>
  </header>
  <a className="abStudioMediaBanner" href={'/arbeitsbuch-media?lesson='+lessonId}>
    <Headphones size={20}/><span><b>تمرین‌های تصویری و شنیداری این درس</b>
    <small>تصاویر تألیفی، صوت تمرینی، اتصال صدای اصلی و فهرست صفحات کتاب کار</small></span><ArrowLeft size={19}/>
   </a>
  <section className="abStudioChoose" aria-label="انتخاب درس کتاب کار">
   <div className="abStudioChooserHead"><b>درس را انتخاب کن</b><span>{display(lessonId)} از ۱۲</span></div>
   <div className="abStudioLessonGrid">
    {arbeitsbuchLessons.map(item=><button type="button" key={item.id} aria-pressed={lessonId===item.id} onClick={()=>changeLesson(item.id)} className={lessonId===item.id?'selected':''} title={item.title}>{display(item.id)}{item.tasks.every(t=>isDone(progress,t))&&<CheckCircle2 size={12}/>}</button>)}
   </div>
   <div className="abStudioChapterInfo">
    <div><b>{lesson?.title}</b><small>{lesson?.topic}</small></div>
    <span dir="ltr">AB S. {lesson?.start}–{lesson?.end}</span>
   </div>
   <div className="abStudioProgress"><span style={{width:(done/Math.max(1,lesson?.tasks.length||1)*100)+'%'}}/></div>
   <div className="abStudioStats"><span><CheckCircle2 size={15}/> {display(done)} تمرین انجام‌شده</span><span><Target size={15}/> {display(mastered)} پاسخ صحیح</span><span><RotateCcw size={15}/> {display(weak)} نیازمند مرور</span></div>
  </section>
  {lessonId===8&&<Lesson8WorkbookExtensions speak={speak} onPracticeEvent={onPracticeEvent}/>}
  <section className="abStudioControls" aria-label="فیلتر تمرین‌ها">
   <div className="abStudioFilters">
    <button type="button" className={filter==='all'?'active':''} aria-pressed={filter==='all'} onClick={()=>{setFilter('all');setActiveId('')}}>همه</button>
    <button type="button" className={filter==='new'?'active':''} aria-pressed={filter==='new'} onClick={()=>{setFilter('new');setActiveId('')}}>جدید</button>
    <button type="button" className={filter==='weak'?'active':''} aria-pressed={filter==='weak'} onClick={()=>{setFilter('weak');setActiveId('')}}>نیازمند تکرار {weak>0?'('+display(weak)+')':''}</button>
   </div>
   <div className="abStudioTaskGrid">
    {filtered.map(t=><button type="button" key={t.id} aria-current={current?.id===t.id?'true':undefined} onClick={()=>chooseTask(t)} className={'abStudioTask '+(current?.id===t.id?'active':'')}>
     <span className="abStudioTaskNum">{t.page}</span><span><b>{t.title}</b><small>{kindName[t.kind]} · {sectionName[t.section]||t.section}</small></span>
     {progress[t.id]?.lastCorrect===true?<CheckCircle2 size={17} color="#31a66e"/>:progress[t.id]?.lastCorrect===false?<RotateCcw size={17} color="#d78838"/>:progress[t.id]?.submitted?<FileText size={17} color="#36a38a"/>:<ChevronLeft size={16}/>}
    </button>)}
   </div>
  </section>
  {filtered.length===0&&<div className="abStudioEmpty" role="status">
    <CheckCircle2 size={22}/>{filter==='weak'?'در این درس کلمه یا تمرین اشتباهِ حل‌نشده نداری.': 'فعلاً همه تمرین‌های این درس شروع شده‌اند.'}
    <button type="button" onClick={()=>{setFilter('all');setActiveId('')}}>نمایش همه تمرین‌ها</button>
   </div>}
  {current&&<section className="abStudioExercise" aria-label="تمرین فعال کتاب کار" key={current.id}>
   <div className="abStudioExerciseHead"><span><FileText size={16}/> Arbeitsbuch · Seite {current.page} <small>{current.sourcePageAvailable?'(PDF '+current.pdfPage+')':'(این صفحه در فایل PDF موجود نیست)'}</small></span><strong>{current.title}</strong></div>
   <div className="abStudioQuestion">
    <span className="abStudioTag">{sectionName[current.section]||current.section} · {kindName[current.kind]}</span>
    {current.kind==='order'?<p>کلمات را برای ساخت جمله درست انتخاب کن:</p>:current.kind==='fill'?<p>جای خالی را به آلمانی کامل کن:</p>:current.kind==='choice'?<p>گزینه درست را انتخاب کن:</p>:<p>بدون دیدن نمونه، به آلمانی بنویس:</p>}
    {current.kind!=='order'&&<strong lang="de" dir="ltr">{current.prompt}</strong>}
    <small>{current.fa}</small>
   </div>
   {current.kind==='fill'&&<form className="abStudioForm" onSubmit={e=>{e.preventDefault();grade(typed)}}>
    <input aria-label="پاسخ آلمانی" lang="de" dir="ltr" value={typed} onChange={e=>setTyped(e.target.value)} placeholder="Deine Antwort…" disabled={result!==null} autoComplete="off"/>
    <button type="submit" disabled={!typed.trim()||result!==null}>بررسی پاسخ</button>
   </form>}
   {current.kind==='choice'&&<div className="abStudioChoices">
    {current.options.map(opt=><button type="button" lang={/^[\u0600-\u06FF]/.test(opt)?'fa':'de'} dir={/^[\u0600-\u06FF]/.test(opt)?'rtl':'ltr'} key={opt} disabled={result!==null} onClick={()=>grade(opt)} className={result?.submitted===opt?'chosen':''}>{opt}</button>)}
   </div>}
   {current.kind==='order'&&<div className="abStudioOrdering">
    <div className="abStudioBuilt" dir="ltr" lang="de" aria-label="جمله ساخته‌شده">{selected.length?selected.map(i=><button type="button" key={i} onClick={()=>pickWord(i)} disabled={result!==null}>{current.words[i]} <X size={13}/></button>):<span>کلمه‌ها را به ترتیب لمس کن…</span>}</div>
    <div className="abStudioTokens" dir="ltr" lang="de">
      {current.words.map((token,i)=><button type="button" key={i} onClick={()=>pickWord(i)} disabled={result!==null||used.has(i)}>{token}</button>)}
    </div>
    <button type="button" className="abStudioCheck" disabled={!selected.length||result!==null} onClick={()=>grade(selected.map(i=>current.words[i]).join(' '))}>بررسی ترتیب جمله</button>
   </div>}
   {current.kind==='writing'&&<div className="abStudioWriting">
    <textarea aria-label="پاسخ نوشتاری آلمانی" lang="de" dir="ltr" rows={3} value={typed} onChange={e=>setTyped(e.target.value)} placeholder="Schreibe auf Deutsch …"/>
    <button type="button" disabled={!typed.trim()} onClick={saveWriting}><Save size={17}/> ذخیره متن من</button>
    {(showModel||submitted)&&<div className="abStudioModel">
      <span>نمونه راهنما (ممکن است پاسخ‌های صحیح دیگری هم باشد):</span>
      <strong lang="de" dir="ltr">{current.example}</strong><small>{current.tip}</small>
      <b>پاسخ تو ذخیره شد؛ این فعالیت نمره خودکار ندارد.</b>
    </div>}
   </div>}
   {result!==null&&<div role="status" className={'abStudioFeedback '+(result.correct?'correct':'wrong')}>
    <span>{result.correct?<CheckCircle2 size={18}/>:<Lightbulb size={18}/>} <b>{result.correct?'آفرین! پاسخ درست است.':'این پاسخ نیاز به اصلاح دارد.'}</b></span>
    <strong lang="de" dir="ltr">{current.answer}</strong>
    <p>{current.tip}</p>
    <button type="button" onClick={()=>speak(current.kind==='fill'?current.prompt.replace('___',current.answer):current.answer)}><Volume2 size={17}/> شنیدن پاسخ صحیح (صدای دستگاه)</button>
   </div>}
   <div className="abStudioActions">
    <button type="button" onClick={resetTask}><RotateCcw size={16}/> تلاش دوباره</button>
    <button type="button" className="primary" disabled={filtered.findIndex(t=>t.id===current.id)>=filtered.length-1} onClick={next}>تمرین بعدی <ArrowLeft size={17}/></button>
   </div>
  </section>}
  <div className="abStudioSourceNote"><BookOpenCheck size={17}/><span>شماره صفحات بر اساس نسخه چاپی Arbeitsbuch است؛ شماره صفحه PDF نیز کنار هر تمرین آمده. سؤال‌های شنیداری وابسته به فایل صوتی کتاب فعلاً به‌صورت آزمون ساختگی نمره‌گذاری نمی‌شوند.</span></div>
  <nav className="abStudioRelated"><a href={'/book-exercises?lesson='+lessonId}><BookOpenCheck size={17}/> تمرین‌های Kursbuch این درس</a><a href={'/partner-practice?lesson='+lessonId}><Mic2 size={17}/> تمرین با پارتنر</a><a href="/practice"><ChevronRight size={16}/> همه تمرین‌ها</a></nav>
 </main>;
}
