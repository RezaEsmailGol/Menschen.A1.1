import React, { useRef } from 'react';
import { ArrowLeft, BookOpen, BookOpenCheck, Brain, CalendarDays, CheckCircle2, ChevronLeft, CircleHelp, Clock3, Download, Flame, Gamepad2, GraduationCap, Hash, Headphones, Keyboard, Languages, Layers, Medal, MessageCircle, Mic2, RotateCcw, ShieldCheck, Sparkles, Target, Trophy, Upload, Volume2, WandSparkles, Zap, Moon, ImageIcon, Search } from 'lucide-react';
import { lessons } from './courseData.js';
import { dueCards } from './studyEngine.js';
import { allStudyCards } from './courseData.js';
import {classSets,classNotesBySet,dueClassSummary} from './classNotesData.js';
import { learningInsights, recommendedRoute } from './learningMemory.js';
import {speakingStats} from './speakingEngine.js';
import RouteLink from './RouteLink';
import {currentHomeLessonId,bookLessonOverview,nextBookExerciseHref,practiceFilters,matchesPracticeFilter} from './homeLearningUX.js';
import './mobileGame.css';
import './homeExperience.css';

const practiceCategories=[
  {id:'coach',label:'مربی روزانه تو',hint:'برنامه ۳ مرحله‌ای بر اساس عملکرد و نقاط نیازمند مرور',Icon:Brain,theme:'green'},
 {id:'speaking',label:'مربی تلفظ من',hint:'با میکروفون آلمانی بگو؛ همخوانی گفتار و پیشرفت را بسنج',Icon:Mic2,theme:'purple'},
  {id:'night',label:'شیفت شب',hint:'مرور کوتاه و نمایش آرام تصویری پیش از خواب',Icon:Moon,theme:'purple'},
  {id:'visualMemory',label:'یادسپاری با تصویر SVG',hint:'کلمات و اعداد با تصویر، تلفظ و فیلترِ جدید/مسلط/ضعیف',Icon:ImageIcon,theme:'green'},
  {id:'classNotes',label:'تمرین‌های جدید کلاس',hint:'اعداد ۱۳–۲۰، فعل‌ها، معرفی، احوال‌پرسی و لغات استاد',Icon:BookOpenCheck,theme:'green'},
    {id:'pictureGame',label:'تصویر را ببین، آلمانی بگو',hint:'۳ سطح: چهارگزینه‌ای، تایپ و جمله‌سازی تصویری',Icon:Gamepad2,theme:'green'},
  {id:'visual',label:'جملات و فلش‌کارت تصویری',hint:'۵۰ عبارت مصور، بازی انتخاب جمله و ۱۰ مکالمه',Icon:BookOpen,theme:'sky'},
  {id:'dialogues',label:'گفت‌وگوی تعاملی هوشمند',hint:'۵ داستان مصور، پاسخ انتخابی و مربی AI اختیاری',Icon:MessageCircle,theme:'purple'},
  {id:'workbook',label:'دفتر جلسه اول استاد',hint:'الفبا، استثناها، اعداد، صرف فعل و آزمون',Icon:BookOpen,theme:'green'},
  {id:'srs',label:'مرور هوشمند',hint:'کلمه‌هایی که زمان مرورشان رسیده',Icon:Layers,theme:'purple'},
  {id:'builder',label:'بازی جمله‌سازی',hint:'کلمات را به جمله صحیح تبدیل کن',Icon:Gamepad2,theme:'green'},
  {id:'numbers',label:'بازی اعداد تا ۱۰۰ میلیون',hint:'شنیدن، نوشتن، تشخیص کلمه و مرور اعداد سخت',Icon:Hash,theme:'amber'},
  {id:'pronunciation',label:'تلفظ و استثناها',hint:'از Ich-Laut تا Ach-Laut',Icon:Volume2,theme:'sky'},
  {id:'listen',label:'دیکته شنیداری',hint:'گوش بده و کلمه درست را تایپ کن',Icon:Headphones,theme:'pink'},
  {id:'exam',label:'آزمون پایان درس',hint:'۱۰ سؤال و ثبت نتیجه',Icon:GraduationCap,theme:'purple'},
  {id:'verbs',label:'صرف ۲۰ فعل',hint:'از kommen تا möchten',Icon:Languages,theme:'green'},
  {id:'alphabet',label:'الفبای آلمانی',hint:'حروف و ترکیب‌های ویژه',Icon:BookOpen,theme:'sky'},
  {id:'words',label:'کلمات جلسه اول',hint:'نمونه‌ها و پخش صوت',Icon:Keyboard,theme:'amber'},
  {id:'flash',label:'فلش‌کارت شخصی',hint:'افزودن و ورود و خروجی کارت',Icon:RotateCcw,theme:'pink'}
];
const skillLabels={
  vocab:'واژگان',grammar:'صرف و گرامر',sentence:'جمله‌سازی',speaking:'تمرین گفتار',reading:'درک جمله',
  number:'اعداد',dictation:'دیکته',pronunciation:'تلفظ',dialogue:'گفت‌وگو',visual:'تمرین تصویری'
};
const backupKeys=['dt_daily_goal_v1','dt_dialogues_v1','dt_cards','dt_stats','dt_course_v1','dt_srs_v1','dt_mastery_v1','dt_teacher_workbook_v1','dt_teacher_workbook_page_v1','dt_book_lessons_v1','dt_night_shift_v1','dt_speaking_v1','dt_current_lesson','dt_audio_speed'];


function savedBookAnswers(){
  try{
    const value=JSON.parse(window.localStorage.getItem('dt_book_lessons_v1')||'{}');
    return value&&typeof value==='object'&&!Array.isArray(value)?value:{};
  }catch{return {};}
}

export function TodayDashboard({setTab,memory,progress,schedule,legacyStats,dailyGoal=10}){
  const report=learningInsights(memory);
  let storedLesson=null;
  try{storedLesson=window.localStorage.getItem('dt_current_lesson');}catch{}
  const currentId=currentHomeLessonId(storedLesson,progress);
  const lesson=lessons.find(x=>x.id===currentId)||lessons[0];
  const bookSaved=savedBookAnswers();
  const overview=bookLessonOverview(bookSaved,progress);
  const currentBook=overview.find(x=>x.id===currentId);
  const done=lessons.filter(x=>progress[x.id]?.passed).length;
  const enabled=lessons.filter(x=>x.id===1||progress[x.id]?.started).map(x=>x.id);
  const scheduled=dueCards(allStudyCards,schedule,enabled).length;
  const recommendation=recommendedRoute(report,scheduled);
  const dailyDone=Math.min(100,Math.round(report.today.attempts/Math.max(1,dailyGoal)*100));
  const exerciseUrl=nextBookExerciseHref(currentId,bookSaved);
  return <div className="gameHome homeV2">
    <section className="homeV2Hero" aria-label="شروع سریع یادگیری آلمانی">
      <div className="homeV2HeroTop">
        <span className="homeV2Kicker"><Sparkles size={15}/> DEUTSCH TRAINER · A1.1</span>
        <span className="homeV2LessonTag">درس فعلی {String(currentId).padStart(2,'0')} / ۱۲</span>
      </div>
      <h1>آماده‌ای ادامه بدیم؟ <span>Los geht’s!</span></h1>
      <p>از <strong>درس {currentId} · {lesson.label}</strong> ادامه بده یا مستقیم سراغ تمرین برو.</p>
      <div className="homeV2HeroActions">
        <RouteLink to={'course/'+currentId} navigate={setTab} className="homeV2Primary"><BookOpenCheck size={21}/> ادامه درس {currentId}<ArrowLeft size={19}/></RouteLink>
        <a className="homeV2Secondary" href={exerciseUrl}><Gamepad2 size={21}/> {currentBook&&currentBook.correct===currentBook.total?'مرور تمرین‌های درس':'تمرین همین درس'} <ArrowLeft size={18}/></a>
      </div>
      <div className="homeV2HeroFoot">
        <span><CheckCircle2 size={16}/> {currentBook?currentBook.correct+' از '+currentBook.total+' تمرین درست':'محتوای پایه و گرامر آماده است'}</span>
        <span><Zap size={16}/> {report.today.xp||0} XP امروز</span>
      </div>
    </section>

    <nav className="homeV2Destinations" aria-label="ورود سریع به درس‌ها و تمرین‌ها">
      <RouteLink to="course" navigate={setTab} className="homeV2Destination">
        <span className="homeV2DestinationIcon teal"><BookOpenCheck size={27}/></span>
        <span><strong>درس‌ها</strong><small>۱۲ درس، گرامر فارسی و تمرین‌های کتاب</small></span><ArrowLeft size={20}/>
      </RouteLink>
      <RouteLink to="practice" navigate={setTab} className="homeV2Destination">
        <span className="homeV2DestinationIcon violet"><Gamepad2 size={27}/></span>
        <span><strong>تمرین‌ها</strong><small>تلفظ، اعداد، گفت‌وگو، آزمون و مرور</small></span><ArrowLeft size={20}/>
      </RouteLink>
    </nav>

    <section className="homeV2Daily" aria-label="پیشرفت امروز">
      <div className="homeV2SectionBar">
        <div><span className="homeV2Eyebrow">DAILY PROGRESS</span><h2>ماموریت امروز</h2></div>
        <RouteLink to="coach" navigate={setTab}>تنظیم برنامه <ChevronLeft size={16}/></RouteLink>
      </div>
      <div className="homeV2DailyStats">
        <span><strong>{Math.min(report.today.attempts,dailyGoal)} / {dailyGoal}</strong> تمرین امروز</span>
        <span><Flame size={17}/><strong>{report.streak}</strong> روز پیوسته</span>
        <span><Zap size={17}/><strong>{report.totalXP}</strong> XP کل</span>
      </div>
      <div className="homeV2Track" role="progressbar" aria-label="پیشرفت هدف تمرین روزانه" aria-valuemin={0} aria-valuemax={dailyGoal} aria-valuenow={Math.min(report.today.attempts,dailyGoal)}><span style={{width:dailyDone+'%'}}/></div>
      <p>{dailyDone===100?'هدف امروز انجام شد؛ می‌توانی برای تسلط بیشتر ادامه بدهی.':'چند تمرین کوتاه انجام بده؛ پیشرفتت خودکار ثبت می‌شود.'}</p>
    </section>

    <section className="homeV2Section" aria-label="میانبرهای آموزشی">
      <div className="homeV2SectionBar"><div><span className="homeV2Eyebrow">QUICK ACCESS</span><h2>سریع شروع کن</h2></div></div>
      <div className="homeV2QuickGrid">
        <a href={'/lessons/'+currentId+'#lesson-grammar'} className="homeV2Quick"><span className="mint"><BookOpen size={21}/></span><strong>گرامر فارسی</strong><small>قواعد درس {currentId} با مثال</small><ArrowLeft size={16}/></a>
        <RouteLink to="classNotes" navigate={setTab} className="homeV2Quick"><span className="peach"><BookOpenCheck size={21}/></span><strong>جزوه استاد</strong><small>تمرین‌های کلاس</small><ArrowLeft size={16}/></RouteLink>
        <RouteLink to="speaking" navigate={setTab} className="homeV2Quick"><span className="lavender"><Mic2 size={21}/></span><strong>مربی تلفظ</strong><small>بگو و دقت را بسنج</small><ArrowLeft size={16}/></RouteLink>
        <RouteLink to="numbers" navigate={setTab} className="homeV2Quick"><span className="sky"><Hash size={21}/></span><strong>بازی اعداد</strong><small>صدا، نوشتن و تشخیص</small><ArrowLeft size={16}/></RouteLink>
      </div>
    </section>

    <section className="homeV2Section" aria-label="مسیر پنج درس دارای تمرین اختصاصی">
      <div className="homeV2SectionBar">
        <div><span className="homeV2Eyebrow">LEARNING PATH</span><h2>پیشرفت درس‌های کتاب</h2></div>
        <RouteLink to="course" navigate={setTab}>همه ۱۲ درس <ChevronLeft size={16}/></RouteLink>
      </div>
      <div className="homeV2Lessons">
        {overview.map(item=><RouteLink to={'course/'+item.id} navigate={setTab} key={item.id}
          className={'homeV2Lesson'+(currentId===item.id?' homeV2LessonCurrent':'')}>
          <span className="homeV2LessonNumber">{String(item.id).padStart(2,'0')}</span>
          <span className="homeV2LessonCopy"><strong>درس {item.id} · {item.title}</strong><small>{item.correct} / {item.total} تمرین صحیح {item.passed?'· آزمون قبول‌شده':''}</small>
            <span className="homeV2LessonTrack"><span style={{width:item.percent+'%'}}/></span>
          </span>
          <span className="homeV2LessonPercent">{item.percent}٪</span>
          <ChevronLeft size={19}/>
        </RouteLink>)}
      </div>
    </section>

    <section className="homeV2Recommendation">
      <span className="homeV2RecommendIcon"><WandSparkles size={22}/></span>
      <div><strong>پیشنهاد هوشمند برای تمرین بعدی</strong><p>{recommendation.why}{report.weak>0?' · '+report.weak+' مورد نیازمند مرور':''}</p></div>
      <RouteLink to={recommendation.page} navigate={setTab}>شروع <ArrowLeft size={16}/></RouteLink>
    </section>
    <div className="homeV2Extras">
      <RouteLink to="visualMemory" navigate={setTab}><ImageIcon size={19}/> یادسپاری تصویری</RouteLink>
      <RouteLink to="night" navigate={setTab}><Moon size={19}/> مرور شب</RouteLink>
      <RouteLink to="progress" navigate={setTab}><Trophy size={19}/> پیشرفت من · {done} درس قبول‌شده</RouteLink>
    </div>
    {(!report.practiced&&(legacyStats?.correct||legacyStats?.known))&&<p className="migrationNote">امتیازهای قبلی حفظ شده‌اند؛ با تمرین بعدی تحلیل دقیق مهارت‌ها کامل‌تر می‌شود.</p>}
  </div>;
}

export function PracticeHub({setTab,memory}){
  const report=learningInsights(memory);
  const [filter,setFilter]=React.useState('all');
  const [search,setSearch]=React.useState('');
  const firstWeak=report.weakItems[0];
  const destination=firstWeak?({
    visual:'visual',number:'numbers',pronunciation:'pronunciation',sentence:'builder',grammar:'verbs',dialogue:'classNotes',
    reading:'exam',dictation:'listen',vocab:'srs'
  }[firstWeak.kind]||'srs'):'srs';
  const focusText=firstWeak?'برای تقویت: '+(firstWeak.label||skillLabels[firstWeak.kind]):'از یک تمرین شروع کن تا نقاط قابل مرور مشخص شوند.';
  const filtered=practiceCategories.filter(item=>
    matchesPracticeFilter(item.id,filter)&&
    (item.label+' '+item.hint).toLocaleLowerCase('fa').includes(search.trim().toLocaleLowerCase('fa')));
  const popular=[
    {id:'classNotes',title:'تمرین کلاس',subtitle:'جزوه‌های استاد',Icon:BookOpenCheck},
    {id:'numbers',title:'اعداد',subtitle:'شنیدن و نوشتن',Icon:Hash},
    {id:'speaking',title:'تلفظ من',subtitle:'تمرین با صدا',Icon:Mic2},
    {id:'builder',title:'جمله‌سازی',subtitle:'ساخت جمله صحیح',Icon:Gamepad2}
  ];
  return <div className="gamePage practiceV2">
    <header className="practiceV2Header">
      <div><span className="homeV2Eyebrow">PRACTICE STUDIO</span><h1>کدوم مهارت رو تمرین کنیم؟</h1><p>تمرین‌ها را فیلتر کن یا از چهار پیشنهاد زیر مستقیماً شروع کن.</p></div>
      <RouteLink to="course" navigate={setTab}><BookOpenCheck size={17}/> مشاهده درس‌ها <ArrowLeft size={17}/></RouteLink>
    </header>
    <nav className="practiceV2Popular" aria-label="شروع سریع تمرین">
      {popular.map(item=><RouteLink to={item.id} navigate={setTab} key={item.id} className="practiceV2PopularItem">
        <item.Icon size={23}/><strong>{item.title}</strong><small>{item.subtitle}</small>
      </RouteLink>)}
    </nav>
    <div className="practiceV2Recommended">
      <Brain size={21}/><span><strong>پیشنهاد متناسب با حافظه تو</strong><small>{focusText}</small></span>
      <RouteLink to={destination} navigate={setTab}>تمرین کن <ArrowLeft size={16}/></RouteLink>
    </div>
    <section className="practiceV2Catalog" aria-label="فهرست قابل جست‌وجوی تمرین‌ها">
      <div className="homeV2SectionBar"><div><span className="homeV2Eyebrow">ALL ACTIVITIES</span><h2>همه تمرین‌ها</h2></div><span>{filtered.length} مورد</span></div>
      <div className="practiceV2Filters" role="group" aria-label="دسته‌بندی تمرین‌ها">
        {practiceFilters.map(item=><button key={item.id} type="button" aria-pressed={filter===item.id}
          className={filter===item.id?'active':''} onClick={()=>setFilter(item.id)}>{item.label}</button>)}
      </div>
      <label className="practiceV2Search"><Search size={19}/><input type="search" value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="جست‌وجوی تمرین، تلفظ، اعداد..." aria-label="جست‌وجو در تمرین‌ها"/></label>
      <div className="practiceV2Tiles">
        {filtered.map(({id,label,hint,Icon,theme})=><RouteLink className={'practiceTile '+theme} key={id} to={id} navigate={setTab}>
          <span className="tileIcon"><Icon size={23}/></span><span className="tileCopy"><strong>{label}</strong><small>{hint}</small></span><ChevronLeft size={19}/>
        </RouteLink>)}
      </div>
      {!filtered.length&&<div className="practiceV2Empty">برای این جست‌وجو تمرینی پیدا نشد. <button type="button" onClick={()=>{setFilter('all');setSearch('');}}>نمایش همه تمرین‌ها</button></div>}
    </section>
  </div>;
}

export function ProgressPage({setTab,memory,progress,schedule,dailyGoal=10,speakingState={}}) {
  const insights=learningInsights(memory);
  const masteredCourses=lessons.filter(x=>progress[x.id]?.passed).length;
  const speechReport=speakingStats(speakingState);
  const upload=useRef(null);
  const saveBackup=()=>{
    const data={kind:'deutsch-trainer-backup',version:1,exportedAt:new Date().toISOString(),data:{}};
    for(const key of backupKeys) {
      const value=localStorage.getItem(key);
      if(value!==null) data.data[key]=value;
    }
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const anchor=document.createElement('a');
    anchor.href=url;anchor.download='deutsch-trainer-backup.json';anchor.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const restoreBackup=async event=>{
    const file=event.target.files?.[0];
    event.target.value='';
    if(!file)return;
    if(file.size>2*1024*1024){alert('فایل بکاپ خیلی بزرگ است (حداکثر ۲ مگابایت).');return;}
    try{
      const backup=JSON.parse(await file.text());
      if(backup?.kind!=='deutsch-trainer-backup'||backup.version!==1||!backup.data||typeof backup.data!=='object')throw Error('invalid');
      const entries=backupKeys.filter(key=>typeof backup.data[key]==='string').map(key=>[key,backup.data[key]]);
      if(!entries.length)throw Error('empty');
      for(const [key,value] of entries){
        if(!['dt_current_lesson','dt_audio_speed','dt_teacher_workbook_page_v1'].includes(key)) JSON.parse(value);
      }
      if(!confirm('اطلاعات موجود این مرورگر با اطلاعات بکاپ جایگزین شوند؟'))return;
      for(const [key,value] of entries)localStorage.setItem(key,value);
      window.location.reload();
    }catch{alert('فرمت فایل بکاپ معتبر نیست یا فایل آسیب دیده است.');}
  };
  return <div className="gamePage">
    <div className="hubHeading"><span className="gameEyebrow">MY LEARNING MEMORY</span><h2>پیشرفت و حافظه من</h2><p>آمار واقعی تمرین‌های تو؛ نه فقط تعداد بازدید از صفحه‌ها.</p></div>
    <div className="progressOverview">
      <div className="progressLevel"><Medal size={30}/><small>سطح کنونی</small><strong>{insights.level}</strong><div className="gameProgress"><span style={{width:insights.xpIntoLevel/2+'%'}}/></div><small>{insights.totalXP} XP مجموع</small></div>
      <div className="progressQuickstats">{[
        [insights.mastered,'کاملاً یادگرفته',CheckCircle2],
        [insights.weak,'نیازمند تمرین',Target],
        [insights.due,'موعد مرور',Clock3],
        [masteredCourses,'درس قبول شده',BookOpen]
      ].map(([value,name,Icon])=><div key={name}><Icon size={21}/><b>{value}</b><span>{name}</span></div>)}</div>
    </div>
    <div className="scProgressLink">
      <div><Mic2 size={23}/><span><b>حافظه و پیشرفت تلفظ من</b><small>امتیازها از تطبیق متن تشخیص گفتار به‌دست می‌آیند؛ نه نمره تخصصی لهجه.</small></span></div>
      <div className="scProgressNumbers"><strong>{speechReport.average===null?'—':speechReport.average+'٪'}</strong><small>میانگین گفتار</small><strong>{speechReport.weak}</strong><small>نیازمند تمرین</small></div>
      <RouteLink to="speaking" navigate={setTab}>تمرین با میکروفون <ArrowLeft size={16}/></RouteLink>
    </div>
    <div className="gameGoals"><div className="gameGoalHeader"><div><span className="gameEyebrow">TODAY</span><h2>تمرین امروز</h2></div><strong>{insights.today.attempts} پاسخ</strong></div>
      <div className="gameProgress"><span style={{width:Math.min(100,insights.today.attempts/Math.max(dailyGoal,1)*100)+'%'}}/></div>
      <p className="progressSoftNote">هر پاسخ درست ۱۰ XP و تلاش برای پاسخ اشتباه ۲ XP دارد؛ اشتباه کردن بخشی از یادگیری است.</p></div>
    <RouteLink to="coach" navigate={setTab} className="dailyCoachShortcut">
      <span className="dailyCoachShortcutIcon"><CalendarDays size={25}/></span>
      <span><b>گزارش کامل مربی روزانه</b><small>نمودار ۱۴ روز، نرخ پاسخ‌های درست، برنامه تمرین و گزارش قابل ارسال</small></span>
      <span className="dailyCoachShortcutCTA">مشاهده <ArrowLeft size={17}/></span>
    </RouteLink>
    <div className="progressColumns">
      <section className="progressPanel"><h3><Brain size={19}/> عملکرد بر اساس مهارت</h3>
        {insights.byType.map(item=><div className="skillRow" key={item.kind}><span>{skillLabels[item.kind]}</span><div className="skillMiniTrack"><span style={{width:(item.attempts ? item.mastered/Math.max(item.mastered+item.weak,1)*100:0)+'%'}}/></div><small>{item.attempts} تمرین</small></div>)}
        {!insights.practiced&&<p className="progressSoftNote">بعد از چند تمرین، عملکردت در هر مهارت اینجا ظاهر می‌شود.</p>}
      </section>
      <section className="progressPanel"><h3><Target size={19}/> چیزهایی که هنوز سخت‌اند</h3>
        {insights.weakItems.length?insights.weakItems.map(item=><div className="weakEntry" key={item.id}><div><b dir="auto">{item.label||skillLabels[item.kind]}</b><small>{skillLabels[item.kind]} · تسلط {item.mastery}٪</small></div><span>{item.wrong} خطا</span></div>):<p className="progressSoftNote">هنوز نقطه ضعف ثبت نشده. بعد از تمرین، کلمات یا موضوعات دشوار اینجا نمایش داده می‌شوند.</p>}
        <RouteLink className="progressPractice" to="practice" navigate={setTab}>رفتن به تمرین <ArrowLeft size={16}/></RouteLink>
      </section>
    </div>
    <section className="progressPanel classMasteryPanel">
      <div className="classMasteryHeading"><div><span className="gameEyebrow">CLASS NOTES</span>
        <h3><BookOpenCheck size={20}/> پیشرفت در جزوه‌های استاد</h3>
        <p>هر موضوع به‌صورت جداگانه ارزیابی می‌شود؛ تسلط یعنی پاسخ‌های صحیح در چند روز متفاوت.</p></div>
        <RouteLink to="classNotes" navigate={setTab}>تمرین جزوه <ArrowLeft size={16}/></RouteLink></div>
      <div className="classMasteryGrid">{classSets.map(set=>{
        const summary=dueClassSummary(classNotesBySet[set.id],memory);
        const pct=Math.round(summary.mastered/summary.total*100);
        return <RouteLink to="classNotes" navigate={setTab} key={set.id} className="classMasteryCard">
          <div className="classMasteryTitle"><span>{set.icon}</span><b>{set.title}</b><small>{pct}٪</small></div>
          <div className="classMasteryTrack"><span style={{width:pct+'%'}}/></div>
          <div className="classMasteryDetails"><span>{summary.practiced} تمرین‌شده</span>
            <span>{summary.weak} نیازمند مرور</span><span>{summary.mastered} مسلط</span></div>
        </RouteLink>;
      })}</div>
    </section>
    <div className="gameBackup"><div><ShieldCheck size={23}/><span><b>حافظه‌ات را حفظ کن</b><small>اطلاعات فعلاً فقط روی همین گوشی و مرورگر ذخیره می‌شود. برای انتقال به دستگاه دیگر بکاپ بگیر.</small></span></div>
      <div className="backupActions"><button onClick={saveBackup}><Download size={17}/> دریافت بکاپ</button><button onClick={()=>upload.current?.click()}><Upload size={17}/> بازیابی بکاپ</button><input ref={upload} hidden type="file" accept=".json,application/json" onChange={restoreBackup}/></div>
    </div>
  </div>;
}
