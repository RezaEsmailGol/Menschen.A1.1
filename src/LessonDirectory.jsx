import React,{useMemo,useState} from 'react';
import {ArrowLeft,BookOpen,BookOpenCheck,CheckCircle2,ChevronDown,ChevronLeft,GraduationCap,Headphones,Image as ImageIcon,Layers,Search,Sparkles,Volume2} from 'lucide-react';
import {courseLessonOutlines} from './lessonOutline.js';
import {lessonExerciseHref,lessonModuleHref} from './lessonExerciseLinks.js';
import RouteLink from './RouteLink';
import './lessonDirectory.css';

export default function LessonDirectory({navigate,progress={}}){
 const [expanded,setExpanded]=useState(()=>new Set([1]));
 const [search,setSearch]=useState('');
 const matching=useMemo(()=>courseLessonOutlines.filter(entry=>{
   const value=search.trim().toLocaleLowerCase('de');
   if(!value)return true;
   const haystack=[entry.title,entry.german,entry.goal,...entry.sections.map(s=>s.title),...entry.modules.map(s=>s.title+' '+s.description)].join(' ').toLocaleLowerCase('de');
   return haystack.includes(value);
 }),[search]);
 const allExpanded=matching.length>0&&matching.every(entry=>expanded.has(entry.id));
 function toggle(id){
   setExpanded(previous=>{const next=new Set(previous);if(next.has(id))next.delete(id);else next.add(id);return next;});
 }
 function toggleAll(){
   setExpanded(previous=>{const next=new Set(previous);if(allExpanded)matching.forEach(item=>next.delete(item.id));else matching.forEach(item=>next.add(item.id));return next;});
 }
 const completed=courseLessonOutlines.filter(x=>progress[x.id]?.passed).length;
 return <section className="ldRoot" aria-label="فهرست جامع درس‌های Menschen A1.1">
   <header className="ldHero">
     <div><span className="ldEyebrow"><BookOpenCheck size={16}/> MEN﻿SCHEN A1.1 · COURSE MAP</span>
       <h2>فهرست درس‌ها و زیرشاخه‌های آموزشی</h2>
       <p>روی هر درس بزن، سپس هر زیرشاخه را باز کن و تمرین دلخواه را مستقیم اجرا کن؛ واژگان، گرامر و سایر بخش‌ها نیز لینک ورود دارند.</p>
       <div className="ldPills"><span><b>۱۲</b> درس</span><span><b>۵</b> درس با تمرین اختصاصی کتاب</span><span><b>{completed}</b> درس قبول‌شده</span></div>
     </div>
     <span className="ldHeroBook" aria-hidden="true"><BookOpen size={45}/> A1.1</span>
   </header>
   <div className="ldToolbar">
     <label className="ldSearch"><Search size={18}/><input type="search" value={search} onChange={e=>setSearch(e.target.value)}
       placeholder="جست‌وجو در نام درس، گرامر و زیرشاخه‌ها…" aria-label="جست‌وجو در درس‌ها"/></label>
     <button type="button" onClick={toggleAll} disabled={!matching.length}>
       <Layers size={17}/>{allExpanded?'بستن همه':'باز کردن همه'}
     </button>
   </div>
   <div className="ldList">
     {matching.map(entry=>{
       const isOpen=expanded.has(entry.id),done=Boolean(progress[entry.id]?.passed);
       return <article className={'ldLesson '+(isOpen?'expanded':'')} key={entry.id}>
         <button type="button" className="ldLessonHeader" onClick={()=>toggle(entry.id)} aria-expanded={isOpen}
           aria-controls={'ld-sections-'+entry.id}>
           <span className={'ldNumber '+(done?'done':'')}>{done?<CheckCircle2 size={22}/>:String(entry.id).padStart(2,'0')}</span>
           <span className="ldLessonHeading"><strong>درس {entry.id} · {entry.title}</strong>
             <span lang="de" dir="ltr">{entry.german}</span>
             <small>{entry.bookAligned?entry.tasks+' تمرین کتاب · '+entry.sections.length+' زیرشاخه':'محتوای پایه: واژگان، گرامر و جمله‌سازی'}</small>
           </span>
           <span className={'ldAvailability '+(entry.bookAligned?'complete':'basic')}>{entry.bookAligned?'تمرین‌های اختصاصی آماده':'محتوای پایه'}</span>
           <ChevronDown size={20} className="ldToggleArrow"/>
         </button>
         {isOpen&&<div className="ldExpandedBody" id={'ld-sections-'+entry.id}>
           <p className="ldGoal">{entry.goal}</p>
           {entry.bookAligned?<div className="ldSectionGroup">
             <h3><BookOpenCheck size={18}/> سرفصل‌ها و تمرین‌های کتاب <span>{entry.pages&&'صفحات '+entry.pages}</span></h3>
             <ol className="ldTopics">
               {entry.sections.map((topic,i)=><li key={topic.id}>
                 <details className="ldTopicDisclosure">
                   <summary className="ldTopicSummary" aria-label={'نمایش '+topic.count+' تمرین '+topic.title}>
                     <span className="ldTopicNumber">{String(i+1).padStart(2,'0')}</span>
                     <span className="ldTopicText"><b>{topic.title}</b><span className="ldTopicDescription">{topic.description}</span></span>
                     <span className="ldTopicCount">{topic.count} تمرین</span>
                     <ChevronDown className="ldTopicChevron" size={18}/>
                   </summary>
                   <div className="ldExerciseList">
                     {topic.exercises.map(exercise=><a className="ldExerciseLink"
                       key={exercise.id}
                       href={lessonExerciseHref(entry.id,topic.id,exercise.number)}
                       aria-label={'شروع تمرین '+exercise.number+' از '+topic.count+': '+exercise.title}>
                       <span className="ldExerciseNumber">{exercise.number}</span>
                       <span className="ldExerciseTitle">{exercise.title}</span>
                       <span className="ldExerciseType">{exercise.type==='choice'?'چهارگزینه‌ای':exercise.type==='listen'?'شنیداری':exercise.type==='build'?'جمله‌سازی':'نوشتاری'}</span>
                       <ArrowLeft size={16} className="ldExerciseArrow"/>
                     </a>)}
                   </div>
                 </details>
               </li>)}
             </ol>
           </div>:<div className="ldBasicNotice"><BookOpen size={17}/> این درس در اپ دارای واژگان، توضیح گرامر، جمله‌سازی و آزمون پایه است؛ تمرین‌های اختصاصی منطبق با کتاب هنوز برای آن تکمیل نشده‌اند.</div>}
           <div className="ldSectionGroup">
             <h3><Sparkles size={18}/> سایر بخش‌های این درس</h3>
             <div className="ldModules">{entry.modules.map(module=><a className="ldModule" key={module.id} href={lessonModuleHref(entry.id,module.kind)}> 
               <span className="ldModuleIcon">{module.kind==='picture'?<ImageIcon size={18}/>:module.kind==='vocabulary'?<BookOpen size={18}/>:module.kind==='exam'?<GraduationCap size={18}/>:module.kind==='sentence'?<Volume2 size={18}/>:module.kind==='review'?<Layers size={18}/>:<Headphones size={18}/>}</span>
               <div><b>{module.title}</b><small>{module.description}</small></div>
               {typeof module.count==='number'&&<span>{module.count}</span>}
               <ChevronLeft size={16} className="ldModuleArrow"/>
             </a>)}</div>
           </div>
           <div className="ldActions">
             <RouteLink className="ldEnter" to={'course/'+entry.id} navigate={navigate}>ورود به درس {entry.id} و انجام تمرین‌ها <ArrowLeft size={17}/></RouteLink>
             <RouteLink className="ldSecondary" to="numbers" navigate={navigate}><Headphones size={17}/> بازی اعداد</RouteLink>
           </div>
         </div>}
       </article>;
     })}
     {!matching.length&&<div className="ldEmpty">درسی مطابق جست‌وجوی شما پیدا نشد.</div>}
   </div>
   <p className="ldFooter">تمرین‌های مستقل، تألیفی و هم‌موضوع کتاب Menschen A1.1 هستند؛ متن و تصاویر ناشر در این اپ بازنشر نشده‌اند.</p>
 </section>;
}
