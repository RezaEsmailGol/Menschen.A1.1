import React,{useEffect,useMemo} from 'react';
import {ArrowLeft,BookOpen,BookOpenCheck,CalendarDays,CheckCircle2,ChevronLeft,Headphones,Layers,MessageCircle,RotateCcw,Target} from 'lucide-react';
import {lessons} from './courseData.js';
import {arbeitsbuchLesson,ARBEITSBUCH_KEY} from './arbeitsbuchSourceData.js';
import {kursbuchChapter,kursbuchActionByLesson} from './kursbuchSourceExercises.js';
import {arbeitsbuchMediaForLesson,AB_MEDIA_KEY} from './arbeitsbuchMediaData.js';
const KURSBUCH_PROGRESS_KEY='dt_kursbuch_exercises_v1';
import {PracticeLessonDetail} from './PracticeJourney.jsx';
import {scopedLessonLinks,validLessonId,writeLessonFocus} from './lessonFocus.js';
import RouteLink from './RouteLink.jsx';
import './lessonFocusWorkspace.css';

const fa=v=>Number(v||0).toLocaleString('fa-IR');
function stored(key){
 try{
  const data=JSON.parse(window.localStorage.getItem(key)||'{}');
  return data&&typeof data==='object'&&!Array.isArray(data)?data:{};
 }catch{return {};}
}
export function lessonSourceProgress(id){
 const ab=arbeitsbuchLesson(id);
 const kb=kursbuchChapter(id);
 const media=arbeitsbuchMediaForLesson(id);
 const abDone=stored(ARBEITSBUCH_KEY),kbDone=stored(KURSBUCH_PROGRESS_KEY),mediaDone=stored(AB_MEDIA_KEY);
 return {
  ab:{done:ab?.tasks.filter(x=>abDone[x.id]?.completed||abDone[x.id]?.submitted).length||0,
   total:ab?.tasks.length||0,weak:ab?.tasks.filter(x=>abDone[x.id]?.lastCorrect===false).length||0},
  kb:{done:kb?.exercises.filter(x=>kbDone[x.id]?.completed).length||0,
   total:kb?.exercises.length||0},
  media:{done:media.filter(x=>mediaDone[x.id]?.completed).length,total:media.length,
   weak:media.filter(x=>mediaDone[x.id]?.lastCorrect===false||mediaDone[x.id]?.needsReview).length},
  actions:kursbuchActionByLesson(id).length
 };
}
export default function LessonFocusWorkspace({lessonId,journey,setTab,onExit}){
 const id=validLessonId(lessonId)||1;
 const lesson=journey.lessons.find(x=>x.id===id);
 const links=useMemo(()=>scopedLessonLinks(id),[id]);
 const metrics=lessonSourceProgress(id);
 useEffect(()=>{if(typeof window!=='undefined')writeLessonFocus(window.localStorage,id,true)},[id]);
 function choose(idString){
  const next=validLessonId(idString);
  if(!next)return;
  writeLessonFocus(window.localStorage,next,true);
  setTab('practiceLesson/'+next);
 }
 function exit(){
  writeLessonFocus(window.localStorage,id,false);
  if(onExit)onExit();else setTab('practice');
 }
 return <div className="lfWorkspace" dir="rtl">
  <section className="lfRibbon" aria-label="تمرکز روی درس انتخاب‌شده">
   <div className="lfRibbonTitle">
    <span><Target size={17}/> حالت تمرکز فعال است</span>
    <h2>فقط تمرین‌های درس {fa(id)}</h2>
    <p>{lesson?.title||lessons[id-1]?.label} <b lang="de" dir="ltr">{lesson?.subtitle}</b></p>
   </div>
   <div className="lfRibbonActions">
    <label htmlFor="lfChooseLesson">تغییر درس
     <select id="lfChooseLesson" aria-label="انتخاب درس برای تمرکز" value={id} onChange={event=>choose(event.target.value)}>
      {lessons.map(item=><option key={item.id} value={item.id}>درس {fa(item.id)} · {item.label}</option>)}
     </select>
    </label>
    <button type="button" onClick={exit}><Layers size={16}/> نمایش همه درس‌ها</button>
   </div>
  </section>
  <section className="lfBookArea" aria-label="کتاب‌ها و تمرین‌های متمرکز روی درس">
   <header className="lfBookHead"><div><h3><BookOpenCheck size={21}/> تمرین‌های کتاب همین درس</h3>
    <p>با انتخاب هر کتاب فقط محتوای همین درس باز می‌شود؛ انتخاب درس در بخش‌های دیگر هم باقی می‌ماند.</p></div>
    <span>{fa(id)} / ۱۲</span></header>
   <div className="lfBookGrid">
    <a href={links.kursbuch} className="lfBookCard">
     <span className="lfBookIcon kursbuch"><BookOpen size={23}/></span>
     <span className="lfBookContent"><b>Kursbuch · تمرین‌های کتاب اصلی</b><small>صفحات همین درس، سؤال‌ها و گفتگوهای مرتبط</small>
      <span>{fa(metrics.kb.done)} از {fa(metrics.kb.total)} فعالیت انجام شده</span></span>
     <ChevronLeft size={20}/>
    </a>
    <a href={links.arbeitsbuch} className="lfBookCard">
     <span className="lfBookIcon arbeitsbuch"><BookOpenCheck size={23}/></span>
     <span className="lfBookContent"><b>Arbeitsbuch · کتاب کار</b><small>سؤال به سؤال، نوشتاری و مرور پاسخ‌های اشتباه</small>
      <span>{fa(metrics.ab.done)} از {fa(metrics.ab.total)} انجام‌شده{metrics.ab.weak?' · '+fa(metrics.ab.weak)+' نیازمند مرور':''}</span></span>
     <ChevronLeft size={20}/>
    </a>
    <a href={links.media} className="lfBookCard">
     <span className="lfBookIcon media"><Headphones size={23}/></span>
     <span className="lfBookContent"><b>Arbeitsbuch · تصویر و شنیداری</b><small>تمرین‌های تصویری و صوتی متناسب با درس</small>
      <span>{fa(metrics.media.done)} از {fa(metrics.media.total)} انجام‌شده{metrics.media.weak?' · '+fa(metrics.media.weak)+' نیازمند مرور':''}</span></span>
     <ChevronLeft size={20}/>
    </a>
    <RouteLink to={'course/'+id} navigate={setTab} className="lfBookCard">
     <span className="lfBookIcon lesson"><CalendarDays size={23}/></span>
     <span className="lfBookContent"><b>آموزش و تمرین‌های درس</b><small>گرامر فارسی، واژگان و جمله‌سازی</small>
      <span>فقط درس {fa(id)}</span></span>
     <ChevronLeft size={20}/>
    </RouteLink>
   </div>
   <details className="lfExtraBooks"><summary>تمرین‌های مکمل این درس <ChevronLeft size={16}/></summary>
    <div><a href={links.partner}><MessageCircle size={16}/> تمرین دونفره و گفتگو</a>
     <a href={links.action}><BookOpen size={16}/> Aktionsseiten مربوط به درس</a>
     <a href={links.vocabulary}><RotateCcw size={16}/> واژگان و فلش‌کارت</a></div>
   </details>
  </section>
  <PracticeLessonDetail journey={journey} lessonId={id} setTab={setTab}/>
 </div>;
}
