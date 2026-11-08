import React,{useState} from 'react';
import {ArrowLeft,BookOpenCheck,Brain,CheckCircle2,ChevronDown,ChevronLeft,Headphones,Layers,Mic2,Pencil,PlayCircle,Search,Target,Trophy,Volume2,Zap} from 'lucide-react';
import RouteLink from './RouteLink';
import {filterPracticeLessons,LESSON_PRACTICE_MODES,nextPracticeSection} from './practiceJourneyData.js';
import './practiceJourney.css';

const ICONS={all:Layers,vocabulary:BookOpenCheck,grammar:Brain,sentences:Pencil,listening:Headphones};
const display=n=>Number(n||0).toLocaleString('fa-IR');

export default function PracticeJourney({journey,setTab,medal}){
 const [mode,setMode]=useState('all');
 const [search,setSearch]=useState('');
 const [status,setStatus]=useState('all');
 const [expanded,setExpanded]=useState(journey.next?.id||1);
 const filtered=filterPracticeLessons(journey.lessons,search,mode,status);
 const current=journey.next;
 const nextMode=nextPracticeSection(current,mode);
 return <div className="pjRoot">
  <section className="pjHero" aria-label="پیشرفت تمرین‌های ۱۲ درس">
   <div className="pjHeroText">
    <span className="pjEyebrow"><Zap size={16}/> PRACTICE JOURNEY · MENSCHEN A1.1</span>
    <h2>تمرین کن، مهارت بساز، مدال بگیر!</h2>
    <p>تمرین‌های جدید هر ۱۲ درس، با گرامر فارسی، جمله‌سازی، شنیداری و تلفظ تصویری.</p>
    <div className="pjHeroStats">
     <span><b>{display(journey.correct)}</b> از {display(journey.total)} تمرین درست</span>
     <span><b>{display(journey.audioCompleted)}</b> تمرین صوتی موفق</span>
     <span><b>{display(journey.completedLessons)}</b> درس تکمیل‌شده</span>
    </div>
    <div className="pjHeroActions">
      <a href={current?.href||'/lessons/1'} className="pjMainAction"><PlayCircle size={18}/> ادامه تمرین درس {display(current?.id||1)} <ArrowLeft size={17}/></a>
      <RouteLink to="progress" navigate={setTab} className="pjSecondaryAction"><Trophy size={17}/> مدال‌های من</RouteLink>
    </div>
   </div>
   <div className="pjHeroDial" role="progressbar" aria-label="پیشرفت کل تمرین‌ها" aria-valuemin={0}
     aria-valuemax={journey.total} aria-valuenow={journey.correct} style={{'--pj-value':journey.percent+'%'}}>
     <div><strong>{display(journey.percent)}٪</strong><span>پیشرفت تمرین‌ها</span><small>{display(journey.startedLessons)} درس شروع‌شده</small></div>
   </div>
  </section>
  <section className="pjQuickModes" aria-label="ورود سریع به مهارت‌های درسی">
   {LESSON_PRACTICE_MODES.filter(x=>x.id!=='all').map(entry=>{
    const Icon=ICONS[entry.id],stat=journey.totals[entry.id],section=nextPracticeSection(current,entry.id);
    return <a key={entry.id} className={'pjQuickMode '+entry.id} href={section?.href||current?.href||'/lessons/1'}>
     <span><Icon size={23}/></span>
     <b>{entry.label}</b>
     <small>{display(stat.completed)} از {display(stat.total)} سؤال درست</small>
     <ChevronLeft size={17}/>
    </a>;
   })}
  </section>
  {medal&&<div className="pjMedalPrompt">
    <span className="pjMedalIcon"><Trophy size={23}/></span>
    <div><b>مدال بعدی: {medal.title}</b><small>{medal.detail} · {display(Math.min(medal.value,medal.target))} از {display(medal.target)}</small>
      <div className="pjBar"><span style={{width:medal.percent+'%'}}/></div></div>
    <RouteLink to="progress" navigate={setTab}>دیدن مدال‌ها <ChevronLeft size={15}/></RouteLink>
  </div>}
  <section className="pjLessonPanel" id="practice-lessons" aria-label="فهرست تمرین‌های اختصاصی ۱۲ درس">
   <div className="pjSectionHead">
    <div><span className="pjEyebrow">LESSON EXERCISES</span><h3><BookOpenCheck size={22}/> تمرین‌های اختصاصی هر درس</h3>
      <p>هر درس چهار بخش دارد؛ برای شروع مستقیم، روی هر بخش بزن.</p></div>
    <span className="pjCount">{display(filtered.length)} از ۱۲ درس</span>
   </div>
   <div className="pjControls">
    <label className="pjSearch"><Search size={19}/><input type="search" aria-label="جست‌وجو در درس‌ها و تمرین‌ها" value={search}
      onChange={e=>setSearch(e.target.value)} placeholder="موضوع، واژه، گرامر یا شماره درس…"/></label>
    <label className="pjStatus">وضعیت
     <select value={status} onChange={e=>setStatus(e.target.value)} aria-label="فیلتر وضعیت درس‌ها">
      <option value="all">همه درس‌ها</option><option value="ongoing">در حال تمرین</option><option value="new">شروع‌نشده</option><option value="done">تکمیل‌شده</option>
     </select>
    </label>
   </div>
   <div className="pjModeTabs" role="group" aria-label="فیلتر مهارت تمرین‌های درسی">
    {LESSON_PRACTICE_MODES.map(item=><button type="button" key={item.id}
      className={mode===item.id?'active':''} aria-pressed={mode===item.id} onClick={()=>setMode(item.id)}>
      {item.label}</button>)}
   </div>
   <div className="pjLessonGrid">
    {filtered.map(lesson=>{
     const open=expanded===lesson.id;
     const sections=mode==='all'?lesson.sections:lesson.sections.filter(s=>s.kind===mode);
     return <article key={lesson.id} className={'pjLessonCard '+(open?'open ':'')+(lesson.isComplete?'complete':'')}>
      <div className="pjLessonHeading"><span className="pjNumber">{display(lesson.id).padStart(2,'۰')}</span>
       <span className={'pjLessonStatus '+(lesson.isComplete?'done':lesson.started?'started':'new')}>
        {lesson.isComplete?'تکمیل شد':lesson.started?'در حال یادگیری':'شروع‌نشده'}
       </span></div>
      <h4>{lesson.title}</h4><small className="pjLessonGerman" lang="de">{lesson.subtitle}</small>
      <div className="pjLessonProgress"><div className="pjProgressNumbers"><b>{display(lesson.correct)} / {display(lesson.total)}</b><span>{display(lesson.percent)}٪</span></div>
       <div className="pjBar" role="progressbar" aria-label={'تمرین‌های درست درس '+lesson.id}
         aria-valuenow={lesson.correct} aria-valuemin={0} aria-valuemax={lesson.total}><span style={{width:lesson.percent+'%'}}/></div></div>
      <div className="pjLessonActions">
       <a href={nextPracticeSection(lesson,mode)?.href||lesson.href} className="pjLessonStart"><PlayCircle size={17}/> {lesson.isComplete?'مرور دوباره':'ادامه تمرین'}</a>
       <button type="button" className="pjExpand" aria-expanded={open} aria-controls={'pj-sections-'+lesson.id}
        onClick={()=>setExpanded(open?null:lesson.id)}>۴ بخش <ChevronDown size={16}/></button>
      </div>
      {open&&<div className="pjSections" id={'pj-sections-'+lesson.id}>
       {sections.map(section=>{
        const Icon=ICONS[section.kind]||Layers;
        return <a key={section.id} href={section.href} className="pjSectionLink">
         <span className={'pjSectionIcon '+section.kind}><Icon size={17}/></span>
         <span className="pjSectionCopy"><b>{section.label}</b><small>{section.name}</small></span>
         <span className="pjSectionProgress">{display(section.completed)}/{display(section.total)}</span>
         <ChevronLeft size={16}/>
        </a>;
       })}
       <a className="pjAudioLink" href={lesson.audioHref}><Volume2 size={17}/> یادگیری صوتی، تصویر و تلفظ
        <span>{display(lesson.audioCompleted)} تمرین موفق</span><ChevronLeft size={16}/></a>
      </div>}
     </article>;
    })}
   </div>
   {!filtered.length&&<div className="pjEmpty">
     <Target size={26}/><strong>درسی با این فیلتر پیدا نشد.</strong>
     <p>جست‌وجو یا فیلتر را تغییر بده تا دوباره همه درس‌ها را ببینی.</p>
     <button type="button" onClick={()=>{setSearch('');setMode('all');setStatus('all');}}>نمایش همه درس‌ها</button>
    </div>}
  </section>
 </div>;
}
