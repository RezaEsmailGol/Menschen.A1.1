import React,{useState} from 'react';
import {ArrowLeft,BookOpenCheck,Brain,CalendarDays,CheckCircle2,ChevronDown,ChevronLeft,Clock3,Headphones,Layers,MessageCircle,Pencil,PlayCircle,RotateCcw,Search,Target,Trophy,Volume2,Zap} from 'lucide-react';
import RouteLink from './RouteLink';
import {activePracticeLesson,filterPracticeLessons,LESSON_PRACTICE_MODES,LESSON8_QUICK_LINKS,nextPracticeSection} from './practiceJourneyData.js';
import './practiceJourney.css';
import './fourFormNouns.css';
import {fourFormProgress} from './fourFormNouns.js';

const ICONS={all:Layers,vocabulary:BookOpenCheck,grammar:Brain,sentences:Pencil,listening:Headphones};
const display=n=>Number(n||0).toLocaleString('fa-IR');

const LAB_ICONS={calendar:CalendarDays,clock:Clock3,message:MessageCircle,repeat:RotateCcw,brain:Brain};
export default function PracticeJourney({journey,setTab,medal,memory={},storedLesson}){
 const [mode,setMode]=useState('all');
 const [search,setSearch]=useState('');
 const [status,setStatus]=useState('all');
 const current=activePracticeLesson(journey,storedLesson);
 const [expanded,setExpanded]=useState(current?.id||1);
 const filtered=filterPracticeLessons(journey.lessons,search,mode,status);
 const lesson8=journey.lessons.find(lesson=>lesson.id===8);
 return <div className="pjRoot">
  <section className="pjHero" aria-label="پیشرفت تمرین‌های ۱۲ درس">
   <div className="pjHeroText">
    <span className="pjEyebrow"><Zap size={15}/> ادامه یادگیری · درس {display(current?.id||1)}</span>
    <h2>{current?.title||'تمرین آلمانی'}</h2>
    <p lang="de" dir="ltr" className="pjCurrentGerman">{current?.subtitle}</p>
    <div className="pjHeroStats">
     <span><b>{display(journey.correct)}</b> از {display(journey.total)} تمرین درست</span>
     <span><b>{display(journey.audioCompleted)}</b> تمرین صوتی موفق</span>
     <span><b>{display(journey.completedLessons)}</b> درس تکمیل‌شده</span>
    </div>
    <div className="pjHeroActions">
      <a href={current?.href||'/lessons/1'} className="pjMainAction"><PlayCircle size={18}/> {current?.isComplete?'مرور':'ادامه'} تمرین درس {display(current?.id||1)} <ArrowLeft size={17}/></a>
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
  {lesson8&&<section className="pjSpotlight" aria-label="دسترسی سریع به تمرین‌های درس ۸">
   <div className="pjSpotlightHead"><span className="pjSpotlightNumber">۰۸</span><div><h3>تمرین‌های ویژه درس ۸</h3><p>{display(lesson8.total)} سؤال اصلی · بازی‌های زمان و گرامر کلاس</p></div><a href={lesson8.href} className="pjSpotlightAll">همه تمرین‌ها <ChevronLeft size={16}/></a></div>
   <div className="pjSpotlightGrid">{LESSON8_QUICK_LINKS.map(item=>{
    const Icon=LAB_ICONS[item.icon]||Brain;
    return <a key={item.id} href={item.href} className="pjLabLink"><span className="pjLabIcon"><Icon size={19}/></span><span><b>{item.label}</b><small>{item.hint}</small></span><ChevronLeft size={15}/></a>;
   })}</div>
  </section>}
  <section className="pjLessonPanel" id="practice-lessons" aria-label="فهرست تمرین‌های اختصاصی ۱۲ درس">
   <div className="pjSectionHead">
    <div><span className="pjEyebrow">LESSON EXERCISES</span><h3><BookOpenCheck size={22}/> تمرین‌های اختصاصی هر درس</h3>
      <p>درس دلخواه را باز کن یا مستقیم تمرین را شروع کن.</p></div>
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
      <div className="pjLessonTitle"><h4>{lesson.title}</h4><small className="pjLessonGerman" lang="de" dir="ltr">{lesson.subtitle}</small></div>
      <div className="pjLessonProgress"><div className="pjProgressNumbers"><b>{display(lesson.correct)} / {display(lesson.total)}</b><span>{display(lesson.percent)}٪</span></div>
       <div className="pjBar" role="progressbar" aria-label={'تمرین‌های درست درس '+lesson.id}
         aria-valuenow={lesson.correct} aria-valuemin={0} aria-valuemax={lesson.total}><span style={{width:lesson.percent+'%'}}/></div></div>
      <div className="pjLessonActions">
       <a href={nextPracticeSection(lesson,mode)?.href||lesson.href} className="pjLessonStart"><PlayCircle size={17}/> {lesson.isComplete?'مرور':lesson.started?'ادامه':'شروع'}</a>
       <button type="button" className="pjExpand" aria-expanded={open} aria-controls={'pj-sections-'+lesson.id}
        onClick={()=>setExpanded(open?null:lesson.id)}>{display(sections.length)} بخش <ChevronDown size={16}/></button>
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
  <div className="pjReviewExtras" id="practice-review"> 
  <a className="ffLaunch" href="/lessons/6#four-form"><Brain size={28}/><div><b>چالش چهارحالتی اسم‌ها · درس ۶</b><small>آرتیکل، جمع، Akkusativ مثبت و منفی · ۲۵ واژه / ۱۰۰ پاسخ · {display(fourFormProgress(memory).correct)} پاسخ صحیح اخیر</small></div><ChevronLeft size={20}/></a>
  {medal&&<div className="pjMedalPrompt">
    <span className="pjMedalIcon"><Trophy size={23}/></span>
    <div><b>مدال بعدی: {medal.title}</b><small>{medal.detail} · {display(Math.min(medal.value,medal.target))} از {display(medal.target)}</small>
      <div className="pjBar"><span style={{width:medal.percent+'%'}}/></div></div>
    <RouteLink to="progress" navigate={setTab}>دیدن مدال‌ها <ChevronLeft size={15}/></RouteLink>
  </div>}
  </div>
 </div>;
}
