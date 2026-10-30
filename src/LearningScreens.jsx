import React, { useRef } from 'react';
import { ArrowLeft, BookOpen, BookOpenCheck, Brain, CalendarDays, CheckCircle2, ChevronLeft, CircleHelp, Clock3, Download, Flame, Gamepad2, GraduationCap, Hash, Headphones, Keyboard, Languages, Layers, Medal, MessageCircle, Mic2, RotateCcw, ShieldCheck, Sparkles, Target, Trophy, Upload, Volume2, WandSparkles, Zap, Moon, ImageIcon } from 'lucide-react';
import { lessons } from './courseData.js';
import { dueCards } from './studyEngine.js';
import { allStudyCards } from './courseData.js';
import {classSets,classNotesBySet,dueClassSummary} from './classNotesData.js';
import { learningInsights, recommendedRoute } from './learningMemory.js';
import {speakingStats} from './speakingEngine.js';
import RouteLink from './RouteLink';
import './mobileGame.css';

const practiceCategories=[
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
  {id:'numbers',label:'بازی اعداد',hint:'رندوم، دیکته و اعداد دشوار',Icon:Hash,theme:'amber'},
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

export function TodayDashboard({setTab,memory,progress,schedule,legacyStats,dailyGoal=10}) {
  const report=learningInsights(memory);
  const currentId = Number(localStorage.getItem('dt_current_lesson')) || 1;
  const lesson=lessons.find(x=>x.id===currentId)||lessons[0];
  const enabled=lessons.filter(l=>l.id===1||progress[l.id]?.started).map(l=>l.id);
  const scheduleDue=dueCards(allStudyCards,schedule,enabled).length;
  const choice=recommendedRoute(report,scheduleDue);
  const done=lessons.filter(l=>progress[l.id]?.passed).length;
  const dailyDone=Math.min(100,Math.round(report.today.attempts/dailyGoal*100));
  const learningStages=[
    {id:'course/1',title:'درس ۱ کتاب · سلام و معرفی',subtitle:'۱۸ تمرین · نام، کشور، الفبا و احوال‌پرسی',Icon:BookOpenCheck,color:'green'},
    {id:'course/2',title:'درس ۲ کتاب · شغل و مشخصات',subtitle:'۲۰ تمرین + بازی اعداد ۱ تا ۱۰۰',Icon:BookOpenCheck,color:'amber'},
    {id:'speaking',title:'مربی تلفظ شخصی',subtitle:'اعداد، حروف، واژه و جمله با میکروفون و حافظه',Icon:Mic2,color:'purple'},
    {id:'night',title:'شیفت شب · مرور پیش از خواب',subtitle:'مرور فعال یا نمایش پشت‌سرهم SVG و صدا',Icon:Moon,color:'purple'},
    {id:'visualMemory',title:'یادسپاری تصویری',subtitle:'اعداد و واژه‌ها با نشانه‌های SVG، تلفظ و حافظه',Icon:ImageIcon,color:'green'},
    {id:'pictureGame',title:'بازی تصویر به آلمانی',subtitle:'۳ مرحله، XP و مرور هوشمند',Icon:Gamepad2,color:'green'},
    {id:'visual',title:'کلمات تصویری جلسه اول',subtitle:'۵۰ عبارت + ۱۰ مکالمه',Icon:BookOpen,color:'green'},
    {id:'dialogues',title:'مکالمه‌های تصویری',subtitle:'پنج داستان شاخه‌دار و روزمره',Icon:MessageCircle,color:'purple'},
    {id:'workbook',title:'جلسه اول استاد',subtitle:'دفتر مصور + تمرین و آزمون',Icon:BookOpen,color:'purple'},
    {id:'classNotes',title:'جزوه‌های جدید استاد',subtitle:'اعداد ۱۳–۲۰ و فعل‌ها و احوال‌پرسی',Icon:BookOpenCheck,color:'green'},
    {id:'srs',title:'تمرین کلمات',subtitle:scheduleDue ? scheduleDue+' کارت موعددار' : 'مرور واژه‌ها',Icon:Brain,color:'green'},
    {id:'builder',title:'چالش جمله‌سازی',subtitle:'۴ جمله از درس انتخابی',Icon:Gamepad2,color:'amber'},
    {id:'exam',title:'آزمون دانش',subtitle:'نمره پایانی را ثبت کن',Icon:GraduationCap,color:'sky'}
  ];
  return <div className="gameHome">
    <div className="gameIntro">
      <div><span className="gameEyebrow"><Sparkles size={16}/> MENSCHEN A1.1 · COMPANION</span>
        <h1>آلمانی را <span>بازی کن!</span></h1>
        <p>درس‌ها را یکی‌یکی یاد بگیر. هر پاسخ، برنامه تمرین بعدی‌ات را هوشمندتر می‌کند.</p>
        <div className="gameHeroActions">
          <RouteLink className="gamePrimary" to="course/1" navigate={setTab}><BookOpenCheck size={17}/> درس ۱ مطابق کتاب <ArrowLeft size={18}/></RouteLink>
          <RouteLink className="gameHeroSecondary" to="course/2" navigate={setTab}>درس ۲ و اعداد ۱ تا ۱۰۰</RouteLink>
          <RouteLink className="gamePrimary" to="classNotes" navigate={setTab}><BookOpenCheck size={17}/> تمرین جزوه‌های جدید استاد <ArrowLeft size={18}/></RouteLink>
          <RouteLink className="gameHeroSecondary" to="dialogues" navigate={setTab}>گفت‌وگوهای جدید</RouteLink>
        </div>
      </div>
      <div className="gameOrb" aria-hidden="true"><span>Hallo!</span><div>🇩🇪</div></div>
    </div>
    <div className="gameScorebar">
      <div><span className="scoreIcon violet"><Zap size={19}/></span><strong>{report.totalXP}</strong><small>امتیاز XP</small></div>
      <div><span className="scoreIcon amber"><Flame size={19}/></span><strong>{report.streak}</strong><small>روز تمرین پیوسته</small></div>
      <div><span className="scoreIcon green"><CheckCircle2 size={19}/></span><strong>{report.mastered}</strong><small>آموخته با تسلط</small></div>
    </div>
    <div className="gameGoals">
      <div className="gameGoalHeader"><div><span className="gameEyebrow">DAILY MISSION</span><h2>ماموریت کوچک امروز</h2></div><span className="gameGoalNumber">{Math.min(report.today.attempts,dailyGoal)} / {dailyGoal} تمرین</span></div>
      <div className="gameProgress"><span style={{width:dailyDone+'%'}} /></div>
      <div className="gameGoalDetail"><span><Target size={16}/> هدف قابل‌تنظیم در مربی روزانه؛ بدون جریمه</span><b>{report.today.xp||0} XP امروز</b></div>
    </div>
    <div className="nightHomeShortcut">
      <RouteLink to="speaking" navigate={setTab}><Mic2 size={21}/><span><b>مربی تلفظ من</b><small>بگو، صدایت را بسنج و پیشرفتت را دنبال کن</small></span><ArrowLeft size={18}/></RouteLink>
       <RouteLink to="night" navigate={setTab}><Moon size={21}/><span><b>🌙 شیفت شب</b><small>قبل از خواب، ۴ تا ۸ کارت با تصویر و صدا</small></span><ArrowLeft size={18}/></RouteLink>
       <RouteLink to="visualMemory" navigate={setTab}><ImageIcon size={21}/><span><b>یادسپاری تصویری</b><small>عددها، واژه‌های جدید و کارت‌های ضعیف</small></span><ArrowLeft size={18}/></RouteLink>
    </div>
    <RouteLink to="coach" navigate={setTab} className="dailyCoachShortcut">
      <span className="dailyCoachShortcutIcon"><Brain size={25}/></span>
      <span><b>مربی روزانه تو</b><small>برنامه ۳ مرحله‌ای، گزارش هفتگی، نمودار تمرین و شناسایی نقاط ضعف</small></span>
      <span className="dailyCoachShortcutCTA">دیدن برنامه <ArrowLeft size={17}/></span>
    </RouteLink>
    <div className="gameNext"><span className="nextSparkle"><WandSparkles size={24}/></span><div><b>پیشنهاد شخصی برای تو</b><p>{choice.why}{report.weak>0 ? ' · '+report.weak+' مورد نیازمند تمرین' : ''}</p></div><RouteLink to={choice.page} navigate={setTab}>شروع <ChevronLeft size={17}/></RouteLink></div>
    <div className="gameSectionHead"><div><span className="gameEyebrow">LEARNING JOURNEY</span><h2>نقشه پیشرفت امروز</h2></div><span>{done} از ۱۲ درس تمام شده</span></div>
    <div className="learningJourney">
      {learningStages.map((x,i)=><React.Fragment key={x.id}>
        <RouteLink className={'journeyNode '+x.color} to={x.id} navigate={setTab}>
          <span className="journeyIcon"><x.Icon size={24}/></span>
          <span><b>{x.title}</b><small>{x.subtitle}</small></span>
          <ChevronLeft size={17}/>
        </RouteLink>
        {i<learningStages.length-1 && <div className="journeyConnector"><span/></div>}
      </React.Fragment>)}
    </div>
    <div className="homeContinue"><div><Trophy size={22}/><span><b>سطح {report.level}</b><small>{report.xpIntoLevel} از ۲۰۰ XP برای سطح بعد</small></span></div><RouteLink to="progress" navigate={setTab}>دیدن پیشرفت <ArrowLeft size={16}/></RouteLink></div>
    {(!report.practiced && (legacyStats?.correct||legacyStats?.known)) ? <p className="migrationNote">آمار قدیمی حفظ شده؛ با اولین تمرین جدید، تحلیل دقیق هر مهارت آغاز می‌شود.</p>:null}
  </div>;
}

export function PracticeHub({setTab,memory}) {
  const report=learningInsights(memory);
  const firstWeak=report.weakItems[0];
  const destination=firstWeak ? ({
    visual:'visual',number:'numbers',pronunciation:'pronunciation',sentence:'builder',grammar:'verbs',dialogue:'classNotes',
    reading:'exam',dictation:'listen',vocab:'srs'
  }[firstWeak.kind] || 'srs') : 'srs';
  const focusText=firstWeak ? 'اول این مورد را تقویت کن: '+(firstWeak.label||skillLabels[firstWeak.kind]) : 'چند تمرین انجام بده تا پیشنهاد دقیق دریافت کنی.';
  return <div className="gamePage">
    <div className="hubHeading"><span className="gameEyebrow">PRACTICE ZONE</span><h2>زمین بازی آلمانی</h2><p>هر بار روی چیزی تمرین کن که هنوز برایت سخت است.</p></div>
    <div className="hubSuggestion"><span className="hubIcon"><Brain size={25}/></span><div><b>حافظه آموزشی تو</b><p>{report.practiced?focusText:'تمرین را شروع کن تا نقاط قوت و ضعفت را شناسایی کنیم.'}</p></div><RouteLink to={destination} navigate={setTab}>تمرین <ChevronLeft size={16}/></RouteLink></div>
    <div className="practiceTiles">{practiceCategories.map(({id,label,hint,Icon,theme})=><RouteLink className={'practiceTile '+theme} key={id} to={id} navigate={setTab}>
      <span className="tileIcon"><Icon size={23}/></span>
      <span className="tileCopy"><b>{label}</b><small>{hint}</small></span>
      <ChevronLeft size={18}/>
    </RouteLink>)}</div>
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
