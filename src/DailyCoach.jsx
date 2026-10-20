import React,{useState} from 'react';
import {Activity,ArrowLeft,BarChart3,BookOpen,Brain,CalendarDays,Check,CheckCircle2,
 ClipboardCopy,Clock3,Flame,Headphones,MessageCircle,RefreshCw,Settings2,Target,
 TrendingUp,Trophy,Zap} from 'lucide-react';
import RouteLink from './RouteLink.jsx';
import {dueCards} from './studyEngine.js';
import {allStudyCards,lessons} from './courseData.js';
import {dailyCoachReport,GOAL_OPTIONS} from './dailyCoach.js';
import './dailyCoach.css';

const friendlySkill={
 vocab:'واژگان',grammar:'گرامر و صرف',sentence:'ساخت جمله',reading:'درک مطلب',
 number:'اعداد',dictation:'دیکته',pronunciation:'تلفظ',dialogue:'گفت‌وگو',visual:'تصویر و واژه'
};
const taskIcons={recognition:Brain,production:BookOpen,conversation:MessageCircle};
const weekDayLabel=key=>{
 const d=new Date(key+'T12:00:00');
 return new Intl.DateTimeFormat('fa-IR',{weekday:'short'}).format(d);
};
function barHeight(n,max){return n?Math.max(10,Math.round(n/max*100)):0;}
function ProgressGraph({data}){
 const max=Math.max(1,...data.map(x=>x.attempts));
 return <div className="dcGraph" role="img" aria-label={'تعداد پاسخ‌ها در چهارده روز: '+data.map(x=>x.day+' '+x.attempts).join('، ')}>
  {data.map(x=><div className="dcGraphDay" key={x.day} title={x.day+' — '+x.attempts+' پاسخ، '+x.correct+' درست'}>
   <span className={'dcGraphBar '+(x.attempts?'isActive':'')} style={{height:barHeight(x.attempts,max)+'%'}}/>
   <small>{weekDayLabel(x.day)}</small>
  </div>)}
 </div>;
}
export function WeeklyReportText(report){
 const weak=report.insights.weakItems.slice(0,5).map(w=>w.label||friendlySkill[w.kind]||w.kind);
 const correct=report.weekAccuracy===null?'بدون داده':report.weekAccuracy+'٪';
 return [
  'گزارش هفتگی Deutsch Trainer — '+report.today.day,
  'تمرین‌های ۷ روز: '+report.weekAttempts,
  'دقت پاسخ‌ها: '+correct,
  'روزهای فعال: '+report.activeDays+' از ۷',
  'امتیاز هفتگی: '+report.weekXP+' XP',
  'تمرین امروز: '+report.today.attempts+' از هدف '+report.goal,
  'کارت‌های موعددار: '+report.dueCount,
  'موارد نیازمند مرور: '+(weak.length?weak.join('، '):'هنوز موردی ثبت نشده'),
  'درخواست: بر اساس این گزارش، یک برنامه کوتاه تمرین آلمانی A1.1 برای فردا پیشنهاد بده.'
 ].join('\n');
}
export default function DailyCoach({memory={},schedule={},progress={},goal=10,setGoal=()=>{},setTab}){
 const [copyStatus,setCopyStatus]=useState('');
 const [showFallback,setShowFallback]=useState(false);
 const enabled=lessons.filter(l=>l.id===1||progress[l.id]?.started).map(l=>l.id);
 const scheduleDue=dueCards(allStudyCards,schedule,enabled).length;
 const report=dailyCoachReport(memory,scheduleDue,goal);
 const summary=WeeklyReportText(report);
 async function copyReport(){
  try{
   if(!navigator.clipboard?.writeText)throw Error('unsupported');
   await navigator.clipboard.writeText(summary);
   setCopyStatus('گزارش کپی شد؛ حالا می‌توانی آن را در گفت‌وگو برای من بفرستی.');
   setShowFallback(false);
  }catch{
   setShowFallback(true);
   setCopyStatus('کپی خودکار در این مرورگر مجاز نیست. متن زیر را دستی کپی کن.');
  }
 }
 return <div className="dcPage">
  <header className="dcHero">
   <div><span className="dcKicker"><Brain size={18}/> DAILY LEARNING COACH</span>
    <h1>مربی روزانه آلمانی تو</h1>
    <p>حتی روزهایی که کلاس تعطیل است، تمرین تو ادامه دارد. از روی پاسخ‌های واقعی‌ات مسیر بعدی را می‌چینیم.</p>
    <div className="dcHeroChips"><span><Zap size={15}/> {report.insights.totalXP} XP کل</span>
     <span><Flame size={15}/> {report.insights.streak} روز پیوسته</span>
     <span><Clock3 size={15}/> {report.dueCount} مرور موعددار</span></div>
   </div><span className="dcHeroArt" aria-hidden="true">🇩🇪 📚</span>
  </header>

  <section className="dcCard dcToday">
   <div className="dcCardHeader"><div><span className="dcKicker">TODAY'S SMALL GOAL</span><h2>تمرین امروز</h2></div>
    <label className="dcGoalControl"><Settings2 size={17}/> هدف روزانه
     <select aria-label="تعداد پاسخ هدف روزانه" value={report.goal} onChange={e=>setGoal(Number(e.target.value))}>
      {GOAL_OPTIONS.map(n=><option key={n} value={n}>{n} پاسخ</option>)}
     </select>
    </label>
   </div>
   <div className="dcDailyCount"><strong>{report.today.attempts}</strong><span>از {report.goal} پاسخ</span>
    <b>{report.goalAchieved?'هدف امروز انجام شد! 🎉':'روزهای کوچک، نتیجه‌های بزرگ'}</b></div>
   <div className="dcTrack"><span style={{width:report.dayProgress+'%'}}/></div>
   <div className="dcTodayMeta"><span><CheckCircle2 size={16}/> {report.today.correct} پاسخ درست امروز</span>
    <span><Zap size={16}/> {report.today.xp} XP امروز</span></div>
   <p className="dcFootnote">این عدد از پاسخ‌های ثبت‌شده محاسبه می‌شود، نه زمان بازبودن سایت.</p>
  </section>

  <section className="dcCard">
   <div className="dcCardHeader"><div><span className="dcKicker">YOUR 3-STEP MISSION</span><h2>برنامه شخصی امروز</h2></div>
    <span className="dcHeadNote">{report.tasks.filter(x=>x.complete).length} از ۳ مرحله</span></div>
   <div className="dcTasks">{report.tasks.map((task,index)=>{
    const Icon=taskIcons[task.id];
    return <div className={'dcTask '+(task.complete?'complete':'')} key={task.id}>
     <div className="dcTaskIcon">{task.complete?<Check size={23}/>:<Icon size={23}/>}</div>
     <div className="dcTaskInfo"><span>مرحله {index+1}</span><h3>{task.title}</h3>
      <p>{task.details}</p>
      <div className="dcTaskBottom"><div className="dcSmallTrack"><span style={{width:task.progress+'%'}}/></div>
       <small>{Math.min(task.done,task.target)} / {task.target} تمرین</small></div>
     </div>
     <RouteLink className="dcTaskGo" to={task.route} navigate={setTab}>
      {task.complete?'ادامه':'تمرین'} <ArrowLeft size={17}/></RouteLink>
    </div>;
   })}</div>
   <p className="dcFootnote">تکمیل مرحله فقط بر اساس پاسخ‌های ثبت‌شده در همین مرورگر است. برای مرحله دوم در بازی تصویر، گزینه «تایپ» یا «جمله‌سازی» را انتخاب کن.</p>
  </section>

  <div className="dcColumns">
   <section className="dcCard">
    <div className="dcCardHeader"><div><span className="dcKicker">LAST 14 DAYS</span><h2>نمودار تمرین روزانه</h2></div><BarChart3 size={22}/></div>
    <ProgressGraph data={report.days}/>
    <div className="dcStatsGrid">
     <div><strong>{report.activeDays}<small> / ۷</small></strong><span>روز تمرین این هفته</span></div>
     <div><strong>{report.weekAttempts}</strong><span>پاسخ در ۷ روز</span></div>
     <div><strong>{report.weekAccuracy===null?'—':report.weekAccuracy+'٪'}</strong><span>دقت پاسخ‌ها</span></div>
     <div><strong>{report.weekXP}</strong><span>XP هفتگی</span></div>
    </div>
    <p className="dcFootnote">{report.accuracyChange===null?
     'برای مقایسه دقیق دو هفته، حداقل ۱۰ پاسخ در هر هفته لازم است.':
     'تغییر دقت نسبت به ۷ روز قبل: '+(report.accuracyChange>0?'+':'')+report.accuracyChange+' واحد درصد'}</p>
   </section>
   <section className="dcCard">
    <div className="dcCardHeader"><div><span className="dcKicker">NEXT ACTION</span><h2>تمرین پیشنهادی بعدی</h2></div><Target size={23}/></div>
    <div className="dcRecommendation"><span className="dcRecommendationIcon"><TrendingUp size={25}/></span>
     <h3>{report.suggested.label}</h3><p>{report.suggested.reason}</p>
     <RouteLink to={report.suggested.route} navigate={setTab}>همین الان شروع کن <ArrowLeft size={17}/></RouteLink>
    </div>
    <div className="dcWeakList"><h3><Activity size={18}/> نقاط نیازمند مرور</h3>
     {report.insights.weakItems.length?report.insights.weakItems.slice(0,5).map(item=>
      <div key={item.id}><span dir="auto">{item.label||friendlySkill[item.kind]||item.kind}</span>
       <small>{friendlySkill[item.kind]||item.kind} · {item.wrong} پاسخ نادرست</small></div>):
      <p>فعلاً مورد دشواری ثبت نشده. با تمرین چند کارت، پیشنهادها دقیق‌تر می‌شوند.</p>}
    </div>
   </section>
  </div>

  <section className="dcCard dcReportCard">
   <div><span className="dcKicker">WEEKLY REVIEW</span><h2>گزارش هفتگی برای مربی</h2>
    <p>این خلاصه را کپی کن و در همین گفت‌وگو بفرست تا برنامه هفته بعد را با داده‌های واقعی تنظیم کنم.</p></div>
   <button className="dcCopy" type="button" onClick={copyReport}><ClipboardCopy size={18}/> کپی گزارش هفتگی</button>
   {copyStatus&&<p className="dcCopyStatus" role="status">{copyStatus}</p>}
   {showFallback&&<textarea readOnly rows={9} dir="auto" value={summary} aria-label="متن گزارش قابل کپی"/>}
  </section>
  <p className="dcPrivacy">حافظه تمرین فقط روی همین دستگاه است؛ گزارش خودکار برای هیچ‌کس ارسال نمی‌شود. برای حفظ پیشرفت در صورت تعویض گوشی، از صفحه «پیشرفت» بکاپ بگیر.</p>
 </div>;
}
