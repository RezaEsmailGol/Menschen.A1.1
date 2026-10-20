import React, { useRef } from 'react';
import { ArrowLeft, BookOpen, Brain, CalendarDays, CheckCircle2, ChevronLeft, CircleHelp, Download, Flame, Gamepad2, GraduationCap, Hash, Headphones, Keyboard, Languages, Layers, Medal, Mic2, RotateCcw, ShieldCheck, Sparkles, Target, Trophy, Upload, Volume2, WandSparkles, Zap } from 'lucide-react';
import { lessons } from './courseData.js';
import { dueCards } from './studyEngine.js';
import { allStudyCards } from './courseData.js';
import { learningInsights, recommendedRoute } from './learningMemory.js';
import './mobileGame.css';

const practiceCategories=[
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
  vocab:'واژگان',grammar:'صرف و گرامر',sentence:'جمله‌سازی',reading:'درک جمله',
  number:'اعداد',dictation:'دیکته',pronunciation:'تلفظ'
};
const backupKeys=['dt_cards','dt_stats','dt_course_v1','dt_srs_v1','dt_mastery_v1','dt_current_lesson','dt_audio_speed'];

export function TodayDashboard({setTab,memory,progress,schedule,legacyStats}) {
  const report=learningInsights(memory);
  const currentId = Number(localStorage.getItem('dt_current_lesson')) || 1;
  const lesson=lessons.find(x=>x.id===currentId)||lessons[0];
  const enabled=lessons.filter(l=>l.id===1||progress[l.id]?.started).map(l=>l.id);
  const scheduleDue=dueCards(allStudyCards,schedule,enabled).length;
  const choice=recommendedRoute(report,scheduleDue);
  const done=lessons.filter(l=>progress[l.id]?.passed).length;
  const dailyDone=Math.min(100,Math.round(report.today.attempts/10*100));
  const learningStages=[
    {id:'course',title:'درس امروز',subtitle:lesson.label,Icon:BookOpen,color:'purple'},
    {id:'srs',title:'تمرین کلمات',subtitle:scheduleDue ? scheduleDue+' کارت موعددار' : 'مرور واژه‌ها',Icon:Brain,color:'green'},
    {id:'builder',title:'چالش جمله‌سازی',subtitle:'۴ جمله از درس انتخابی',Icon:Gamepad2,color:'amber'},
    {id:'exam',title:'آزمون دانش',subtitle:'نمره پایانی را ثبت کن',Icon:GraduationCap,color:'sky'}
  ];
  return <div className="gameHome">
    <div className="gameIntro">
      <div><span className="gameEyebrow"><Sparkles size={16}/> MENSCHEN A1.1 · COMPANION</span>
        <h1>آلمانی را <span>بازی کن!</span></h1>
        <p>درس‌ها را یکی‌یکی یاد بگیر. هر پاسخ، برنامه تمرین بعدی‌ات را هوشمندتر می‌کند.</p>
        <button className="gamePrimary" onClick={()=>setTab(choice.page)}>{choice.label}<ArrowLeft size={18}/></button>
      </div>
      <div className="gameOrb" aria-hidden="true"><span>Hallo!</span><div>🇩🇪</div></div>
    </div>
    <div className="gameScorebar">
      <div><span className="scoreIcon violet"><Zap size={19}/></span><strong>{report.totalXP}</strong><small>امتیاز XP</small></div>
      <div><span className="scoreIcon amber"><Flame size={19}/></span><strong>{report.streak}</strong><small>روز تمرین پیوسته</small></div>
      <div><span className="scoreIcon green"><CheckCircle2 size={19}/></span><strong>{report.mastered}</strong><small>آموخته با تسلط</small></div>
    </div>
    <div className="gameGoals">
      <div className="gameGoalHeader"><div><span className="gameEyebrow">DAILY MISSION</span><h2>ماموریت کوچک امروز</h2></div><span className="gameGoalNumber">{Math.min(report.today.attempts,10)} / ۱۰ تمرین</span></div>
      <div className="gameProgress"><span style={{width:dailyDone+'%'}} /></div>
      <div className="gameGoalDetail"><span><Target size={16}/> فقط ۱۰ پاسخ در روز؛ بدون فشار و جریمه</span><b>{report.today.xp||0} XP امروز</b></div>
    </div>
    <div className="gameNext"><span className="nextSparkle"><WandSparkles size={24}/></span><div><b>پیشنهاد شخصی برای تو</b><p>{choice.why}{report.weak>0 ? ' · '+report.weak+' مورد نیازمند تمرین' : ''}</p></div><button onClick={()=>setTab(choice.page)}>شروع <ChevronLeft size={17}/></button></div>
    <div className="gameSectionHead"><div><span className="gameEyebrow">LEARNING JOURNEY</span><h2>نقشه پیشرفت امروز</h2></div><span>{done} از ۱۲ درس تمام شده</span></div>
    <div className="learningJourney">
      {learningStages.map((x,i)=><React.Fragment key={x.id}>
        <button className={'journeyNode '+x.color} onClick={()=>setTab(x.id)}>
          <span className="journeyIcon"><x.Icon size={24}/></span>
          <span><b>{x.title}</b><small>{x.subtitle}</small></span>
          <ChevronLeft size={17}/>
        </button>
        {i<learningStages.length-1 && <div className="journeyConnector"><span/></div>}
      </React.Fragment>)}
    </div>
    <div className="homeContinue"><div><Trophy size={22}/><span><b>سطح {report.level}</b><small>{report.xpIntoLevel} از ۲۰۰ XP برای سطح بعد</small></span></div><button onClick={()=>setTab('progress')}>دیدن پیشرفت <ArrowLeft size={16}/></button></div>
    {(!report.practiced && (legacyStats?.correct||legacyStats?.known)) ? <p className="migrationNote">آمار قدیمی حفظ شده؛ با اولین تمرین جدید، تحلیل دقیق هر مهارت آغاز می‌شود.</p>:null}
  </div>;
}

export function PracticeHub({setTab,memory}) {
  const report=learningInsights(memory);
  return <div className="gamePage">
    <div className="hubHeading"><span className="gameEyebrow">PRACTICE ZONE</span><h2>زمین بازی آلمانی</h2><p>هر بار روی چیزی تمرین کن که هنوز برایت سخت است.</p></div>
    <div className="hubSuggestion"><span className="hubIcon"><Brain size={25}/></span><div><b>حافظه آموزشی تو</b><p>{report.practiced?report.weak+' مورد به تمرین بیشتری نیاز دارد.':'تمرین را شروع کن تا نقاط قوت و ضعفت را شناسایی کنیم.'}</p></div><button onClick={()=>setTab('srs')}>مرور <ChevronLeft size={16}/></button></div>
    <div className="practiceTiles">{practiceCategories.map(({id,label,hint,Icon,theme})=><button className={'practiceTile '+theme} key={id} onClick={()=>setTab(id)}>
      <span className="tileIcon"><Icon size={23}/></span>
      <span className="tileCopy"><b>{label}</b><small>{hint}</small></span>
      <ChevronLeft size={18}/>
    </button>)}</div>
  </div>;
}

export function ProgressPage({setTab,memory,progress,schedule}) {
  const insights=learningInsights(memory);
  const masteredCourses=lessons.filter(x=>progress[x.id]?.passed).length;
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
        if(key!=='dt_current_lesson' && key!=='dt_audio_speed') JSON.parse(value);
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
    <div className="gameGoals"><div className="gameGoalHeader"><div><span className="gameEyebrow">TODAY</span><h2>تمرین امروز</h2></div><strong>{insights.today.attempts} پاسخ</strong></div>
      <div className="gameProgress"><span style={{width:Math.min(100,insights.today.attempts*10)+'%'}}/></div>
      <p className="progressSoftNote">هر پاسخ درست ۱۰ XP و تلاش برای پاسخ اشتباه ۲ XP دارد؛ اشتباه کردن بخشی از یادگیری است.</p></div>
    <div className="progressColumns">
      <section className="progressPanel"><h3><Brain size={19}/> عملکرد بر اساس مهارت</h3>
        {insights.byType.map(item=><div className="skillRow" key={item.kind}><span>{skillLabels[item.kind]}</span><div className="skillMiniTrack"><span style={{width:(item.attempts ? item.mastered/Math.max(item.mastered+item.weak,1)*100:0)+'%'}}/></div><small>{item.attempts} تمرین</small></div>)}
        {!insights.practiced&&<p className="progressSoftNote">بعد از چند تمرین، عملکردت در هر مهارت اینجا ظاهر می‌شود.</p>}
      </section>
      <section className="progressPanel"><h3><Target size={19}/> چیزهایی که هنوز سخت‌اند</h3>
        {insights.weakItems.length?insights.weakItems.map(item=><div className="weakEntry" key={item.id}><div><b dir="auto">{item.label||skillLabels[item.kind]}</b><small>{skillLabels[item.kind]} · تسلط {item.mastery}٪</small></div><span>{item.wrong} خطا</span></div>):<p className="progressSoftNote">هنوز نقطه ضعف ثبت نشده. بعد از تمرین، کلمات یا موضوعات دشوار اینجا نمایش داده می‌شوند.</p>}
        <button className="progressPractice" onClick={()=>setTab('practice')}>رفتن به تمرین <ArrowLeft size={16}/></button>
      </section>
    </div>
    <div className="gameBackup"><div><ShieldCheck size={23}/><span><b>حافظه‌ات را حفظ کن</b><small>اطلاعات فعلاً فقط روی همین گوشی و مرورگر ذخیره می‌شود. برای انتقال به دستگاه دیگر بکاپ بگیر.</small></span></div>
      <div className="backupActions"><button onClick={saveBackup}><Download size={17}/> دریافت بکاپ</button><button onClick={()=>upload.current?.click()}><Upload size={17}/> بازیابی بکاپ</button><input ref={upload} hidden type="file" accept=".json,application/json" onChange={restoreBackup}/></div>
    </div>
  </div>;
}
