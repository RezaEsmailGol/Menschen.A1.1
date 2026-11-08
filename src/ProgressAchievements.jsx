import React,{useState} from 'react';
import {ArrowLeft,AudioLines,BookOpenCheck,CalendarCheck2,Check,CheckCircle2,ChevronLeft,Compass,Flame,Footprints,GraduationCap,Headphones,LockKeyhole,Medal,Mic,Radio,Shield,Star,Target,Trophy,Zap} from 'lucide-react';
import RouteLink from './RouteLink.jsx';
import './progressAchievements.css';

const ICONS={
 footprints:Footprints,zap:Zap,compass:Compass,'book-open-check':BookOpenCheck,
 headphones:Headphones,'audio-lines':AudioLines,mic:Mic,radio:Radio,
 flame:Flame,trophy:Trophy,'graduation-cap':GraduationCap,star:Star
};
const persian=n=>Number(n||0).toLocaleString('fa-IR');
function ProgressArc({value=0,total=100,children}){
 const percent=total?Math.min(100,Math.round(value/total*100)):0;
 return <div className="pgArc" style={{'--pg-turn':percent+'%'}} role="progressbar"
  aria-label="پیشرفت سطح" aria-valuemin={0} aria-valuemax={total} aria-valuenow={value}>
  <div className="pgArcInner">{children}</div>
 </div>;
}
function BadgeToken({badge,small=false}){
 const Icon=ICONS[badge.icon]||Medal;
 return <span className={'pgMedalArt '+badge.tone+' '+(!badge.earned?'locked':'')+(small?' compact':'')} aria-hidden="true">
  <span className="pgMedalShine"/><Icon size={small?24:33} strokeWidth={1.9}/>
  {badge.earned&&<span className="pgMedalCheck"><Check size={10} strokeWidth={3}/></span>}
  {!badge.earned&&<span className="pgMedalLock"><LockKeyhole size={14}/></span>}
 </span>;
}
export default function ProgressAchievements({report,setTab}){
 const [selectedId,setSelectedId]=useState(null);
 const selected=report.badges.find(x=>x.id===selectedId)||report.nextBadge||report.earned.at(-1)||report.badges[0];
 const maxWeek=Math.max(1,...report.week.map(x=>x.attempts));
 const todayDone=report.missions.filter(x=>x.done).length;
 const lessonCompleted=report.lessons.filter(x=>x.correct===x.total&&x.total>0).length;
 return <div className="pgDashboard" aria-label="داشبورد پیشرفت، مدال‌ها و مأموریت‌ها">
  <section className="pgHero">
   <div className="pgHeroContent">
    <span className="pgEyebrow"><Star size={15}/> مسیر یادگیری من · MEIN FORTSCHRITT</span>
    <h2>هر تمرین، یک قدم تا تسلط!</h2>
    <p>مدال‌ها از تمرین‌هایی که واقعاً انجام داده‌ای باز می‌شوند. مسیرت را ببین و برای جایزه بعدی آماده شو.</p>
    <div className="pgHeroStats">
     <span><Flame size={17}/><b>{persian(report.streak)}</b> روز پیوسته</span>
     <span><Trophy size={17}/><b>{persian(report.earnedCount)}</b> مدال کسب‌شده</span>
     <span><BookOpenCheck size={17}/><b>{persian(lessonCompleted)}</b> درس تکمیل‌شده</span>
    </div>
    <RouteLink to="practice" navigate={setTab} className="pgHeroCTA">تمرین بعدی را شروع کن <ArrowLeft size={17}/></RouteLink>
   </div>
   <div className="pgHeroLevel">
    <ProgressArc value={report.xpIntoLevel} total={200}>
     <Medal size={31}/>
     <small>سطح</small><strong>{persian(report.level)}</strong>
    </ProgressArc>
    <b>{persian(report.totalXP)} XP</b>
    <span>{persian(report.toNextLevel)} XP تا سطح بعد</span>
   </div>
  </section>
  <div className="pgMetrics">
   <div><span className="pgMetricIcon book"><BookOpenCheck size={21}/></span><b>{persian(report.metrics.bookCorrect)}<small> / {persian(report.allBookTotal)}</small></b><span>تمرین درست کتاب</span></div>
   <div><span className="pgMetricIcon audio"><Headphones size={21}/></span><b>{persian(report.audioTotal)}</b><span>تمرین صوتی موفق</span></div>
   <div><span className="pgMetricIcon speak"><Mic size={21}/></span><b>{report.speechAverage===null?'—':persian(report.speechAverage)+'٪'}</b><span>میانگین تطبیق گفتار</span></div>
   <div><span className="pgMetricIcon trophy"><Medal size={21}/></span><b>{persian(report.earnedCount)}<small> / {persian(report.badges.length)}</small></b><span>مدال‌های افتخار</span></div>
  </div>
  <div className="pgTwocol">
   <section className="pgPanel pgMissions">
    <div className="pgSectionHead">
     <div><span className="pgEyebrow">DAILY QUESTS</span><h3><Target size={21}/> مأموریت‌های امروز</h3>
      <p>با چند قدم کوتاه، امروز را پربار کن.</p></div>
     <strong className="pgCount">{persian(todayDone)} از {persian(report.missions.length)}</strong>
    </div>
    <div className="pgMissionList">
     {report.missions.map(item=><div className={'pgMission '+(item.done?'done':'')} key={item.id}>
      <span className="pgMissionCheck">{item.done?<Check size={18}/>:<Target size={17}/>}</span>
      <div className="pgMissionBody">
       <b>{item.label}</b><small>{item.detail}</small>
       <div className="pgMiniBar" role="progressbar" aria-label={item.label}
        aria-valuenow={Math.min(item.current,item.target)} aria-valuemax={item.target} aria-valuemin={0}>
        <span style={{width:item.percent+'%'}}/></div>
      </div>
      <div className="pgMissionEnd"><strong>{persian(Math.min(item.current,item.target))}/{persian(item.target)}</strong>
       {!item.done&&<RouteLink to={item.route} navigate={setTab} aria-label={'انجام مأموریت '+item.label}><ArrowLeft size={17}/></RouteLink>}
       {item.done&&<CheckCircle2 size={19}/>}</div>
     </div>)}
    </div>
    <small className="pgTruth">این هدف‌ها با پاسخ‌های ثبت‌شده امروز محاسبه می‌شوند؛ XP اضافه یا جایزه ساختگی ندارند.</small>
   </section>
   <section className="pgPanel pgWeekly">
    <div className="pgSectionHead"><div><span className="pgEyebrow">YOUR ACTIVITY</span>
     <h3><CalendarCheck2 size={21}/> فعالیت هفت روز اخیر</h3>
     <p>تعداد پاسخ‌های ثبت‌شده در هر روز</p></div>
     <strong className="pgCount">{persian(report.week.reduce((s,x)=>s+x.attempts,0))} پاسخ</strong>
    </div>
    <div className="pgBars" aria-label="نمودار فعالیت هفتگی">
     {report.week.map((day,i)=><div className={'pgBarColumn '+(i===6?'today':'')} key={day.day}
       title={day.day+': '+day.attempts+' پاسخ'}>
       <b>{day.attempts?persian(day.attempts):'–'}</b>
       <div className="pgBarTrack"><span style={{height:day.attempts?Math.round(day.attempts/maxWeek*100)+'%':'0%'}}/></div>
       <small>{day.dayName}</small>
      </div>)}
    </div>
    <div className="pgWeekFooter"><span><Flame size={18}/> {persian(report.streak)} روز زنجیره یادگیری</span>
     <RouteLink to="coach" navigate={setTab}>گزارش مربی <ChevronLeft size={16}/></RouteLink></div>
   </section>
  </div>
  <section className="pgPanel pgAwards" id="medals">
   <div className="pgSectionHead"><div><span className="pgEyebrow">ACHIEVEMENTS</span>
    <h3><Trophy size={22}/> گنجینه مدال‌های من</h3>
    <p>هر مدال یک دستاورد واقعی است؛ مدال‌های قفل‌شده مسیر بعدی را نشان می‌دهند.</p></div>
    <strong className="pgCount">{persian(report.earnedCount)} / {persian(report.badges.length)}</strong>
   </div>
   {report.nextBadge&&<div className="pgNextBadge">
    <BadgeToken badge={report.nextBadge} small/>
    <div><small>مدال بعدی در راه است</small><strong>{report.nextBadge.title}</strong>
      <span>{report.nextBadge.detail}</span>
      <div className="pgMiniBar" role="progressbar" aria-label={'مدال بعدی '+report.nextBadge.title}
       aria-valuemin={0} aria-valuemax={report.nextBadge.target} aria-valuenow={report.nextBadge.value}>
       <span style={{width:report.nextBadge.percent+'%'}}/></div>
     </div>
     <b>{persian(Math.min(report.nextBadge.value,report.nextBadge.target))} / {persian(report.nextBadge.target)}</b>
   </div>}
   <div className="pgBadgeGrid">
    {[...report.badges].sort((a,b)=>Number(b.earned)-Number(a.earned)).map(badge=>
     <button type="button" className={'pgBadge '+(badge.earned?'earned':'unearned')+(selected?.id===badge.id?' selected':'')}
      key={badge.id} onClick={()=>setSelectedId(badge.id)}
      aria-pressed={selected?.id===badge.id}
      aria-label={'مدال '+badge.title+'، '+(badge.earned?'کسب‌شده':'قفل؛ '+badge.value+' از '+badge.target)}>
      <BadgeToken badge={badge}/>
      <strong>{badge.title}</strong><small>{badge.earned?'کسب شد · آفرین!':persian(Math.min(badge.value,badge.target))+' از '+persian(badge.target)}</small>
     </button>)}
   </div>
   {selected&&<div className="pgBadgeDetail" role="status">
    <BadgeToken badge={selected} small/>
    <div><strong>{selected.title}</strong><p>{selected.detail}</p>
     <small>{selected.earned?'مدال با فعالیت ثبت‌شده به دست آمده است.':
       'پیشرفت: '+persian(Math.min(selected.value,selected.target))+' از '+persian(selected.target)+' · '+persian(selected.remaining)+' تا باز شدن مدال'}</small></div>
    {!selected.earned&&<RouteLink to={selected.route} navigate={setTab}>ادامه مسیر <ArrowLeft size={16}/></RouteLink>}
   </div>}
  </section>
  <section className="pgPanel pgLessons">
   <div className="pgSectionHead"><div><span className="pgEyebrow">LEARNING JOURNEY</span>
    <h3><BookOpenCheck size={21}/> نقشه راه ۱۲ درس</h3>
    <p>تمرین‌های تألیفی هر درس و یادگیری شنیداری آن را یک‌جا دنبال کن.</p></div>
    <strong className="pgCount">{persian(report.metrics.bookCorrect)} / {persian(report.allBookTotal)}</strong>
   </div>
   <div className="pgLessonGrid">
    {report.lessons.map(lesson=><a className={'pgLesson '+(lesson.correct===lesson.total&&lesson.total>0?'done':'')}
     href={lesson.href} key={lesson.id} aria-label={'رفتن به تمرین‌های درس '+lesson.id}>
      <div className="pgLessonTop"><span className="pgLessonNumber">{persian(lesson.id)}</span>
       {lesson.correct===lesson.total&&lesson.total>0?<CheckCircle2 size={19}/>:<ChevronLeft size={17}/>}</div>
      <strong>{lesson.title}</strong><small>{persian(lesson.correct)} از {persian(lesson.total)} تمرین درست</small>
      <div className="pgMiniBar" role="progressbar" aria-label={'پیشرفت درس '+lesson.id}
       aria-valuemin={0} aria-valuemax={lesson.total} aria-valuenow={lesson.correct}>
        <span style={{width:lesson.percent+'%'}}/></div>
      <div className="pgLessonBottom"><span><Headphones size={13}/> {persian(lesson.audio)} تمرین صوتی</span>
       <b>{persian(lesson.percent)}٪</b></div>
     </a>)}
   </div>
  </section>
 </div>;
}
