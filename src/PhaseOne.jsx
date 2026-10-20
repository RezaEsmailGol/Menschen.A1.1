import React, { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronLeft, CircleHelp, Clock3, GraduationCap, Headphones, Layers, RotateCcw, Shuffle, Sparkles, Target, Trophy, Volume2, X, Zap } from 'lucide-react';
import { allStudyCards, getLessonCards, lessons, pronouns, verbForms } from './courseData.js';
import { buildExam, dueCards, nextReview, normalizeAnswer, REVIEW_KEY, COURSE_KEY, shuffleArray, safeParse, todayKey } from './studyEngine.js';
import './phaseOne.css';

function useSaved(key, initial) {
  const [value,setValue]=useState(()=>{
    if(typeof window==='undefined') return initial;
    return safeParse(window.localStorage.getItem(key), initial);
  });
  useEffect(()=>{try{window.localStorage.setItem(key,JSON.stringify(value));}catch{}},[key,value]);
  return [value,setValue];
}

function useLessonSelection() {
  const [selected,setValue]=useState(()=>{
    try { const raw=Number(window.localStorage.getItem('dt_current_lesson')); return raw>=1&&raw<=12?raw:1; }
    catch{return 1;}
  });
  const select = id => {
    setValue(id);
    try{window.localStorage.setItem('dt_current_lesson',String(id));}catch{}
  };
  return [selected,select];
}

const modes = [
  {id:'course',title:'مسیر درس‌ها',Icon:BookOpen},
  {id:'srs',title:'مرور هوشمند',Icon:Layers},
  {id:'builder',title:'جمله‌سازی',Icon:Shuffle},
  {id:'exam',title:'آزمون پایان درس',Icon:GraduationCap}
];

export default function PhaseOne({mode,setTab,speak}) {
  const [selected,select] = useLessonSelection();
  const [progress,setProgress] = useSaved(COURSE_KEY,{1:{started:true}});
  const [schedule,setSchedule]= useSaved(REVIEW_KEY,{});
  const [personalCards] = useSaved('dt_cards', []);
  // Keep existing manually created flashcards available for spaced review.
  const customCards = (Array.isArray(personalCards) ? personalCards : [])
    .filter(c => typeof c?.front === 'string' && typeof c?.back === 'string' && c.front && c.back)
    .map((c,index) => ({
      id: 'personal:' + index + ':' + (c.front + '|' + c.back),
      lesson: 0,
      front: c.front,
      back: c.back,
      speak: /[A-Za-zÄÖÜäöüß]/.test(c.back) ? c.back : c.front,
    }));
  const lesson=lessons[selected-1];
  const available=lessons.filter(l=>l.id===1 || progress[l.id]?.started).map(l=>l.id);
  const due = dueCards([...allStudyCards,...customCards],schedule,[...available,0]);
  const learned=Object.keys(schedule).length;
  const completed=lessons.filter(l=>progress[l.id]?.passed).length;

  function startLesson(id) {
    select(id);
    setProgress(p=>({...p,[id]:{...p[id],started:true}}));
  }
  function rate(card,grade) {
    setSchedule(previous=>({...previous,[card.id]:nextReview(previous[card.id],grade)}));
  }
  function examDone(lessonId,score,total) {
    const percent=Math.round(score/total*100);
    setProgress(p=>{
      const previous=p[lessonId]||{};
      return {...p,[lessonId]:{...previous,started:true,attempts:(previous.attempts||0)+1,best:Math.max(previous.best||0,percent),passed:previous.passed||percent>=80,lastExam:todayKey()}};
    });
  }
  return <div className="phasePage">
    <header className="phaseHero">
      <div className="phaseHeroContent">
        <span className="phaseEyebrow"><Sparkles size={16}/> Deutsch Trainer / Phase 01</span>
        <h2>از اولین واژه تا <span>مکالمه واقعی</span></h2>
        <p>۱۲ واحد تمرینی A1.1 همراه با مرور هوشمند، جمله‌سازی و آزمون؛ پیشرفتت روی همین دستگاه ذخیره می‌شود.</p>
      </div>
      <div className="phaseIndicators"><div><strong>{completed}<small> / 12</small></strong><span>درس قبول‌شده</span></div><div><strong>{due.length}</strong><span>کارت آماده مرور</span></div><div><strong>{learned}</strong><span>کارت مرورشده</span></div></div>
    </header>
    <nav className="phaseNav" aria-label="بخش‌های فاز یک">
      {modes.map(({id,title,Icon})=><button key={id} className={mode===id?'active':''} onClick={()=>setTab(id)}><Icon size={18}/>{title}</button>)}
    </nav>
    {mode==='course' && <CoursePanel lesson={lesson} selected={selected} select={select} progress={progress} startLesson={startLesson} speak={speak} setTab={setTab}/>}
    {mode==='srs' && <ReviewPanel available={available} schedule={schedule} due={due} rate={rate} speak={speak} setTab={setTab}/>}
    {mode==='builder' && <BuilderPanel lesson={lesson} selected={selected} select={select} speak={speak}/>}
    {mode==='exam' && <ExamPanel lesson={lesson} selected={selected} select={select} progress={progress} examDone={examDone} speak={speak}/>}
    <div className="phaseFoot"><CircleHelp size={17}/><span>تمرین‌ها تألیفی و همراه سطح A1.1 هستند. موضوع دقیق هر درس کتاب را مطابق برنامه استاد خودت تنظیم می‌کنیم.</span></div>
  </div>;
}

function LessonPicker({selected,select}) {
  return <label className="lessonPick">درس <select aria-label="انتخاب شماره درس" value={selected} onChange={e=>select(Number(e.target.value))}>
    {lessons.map(l=><option key={l.id} value={l.id}>{String(l.id).padStart(2,'0')} · {l.label}</option>)}
  </select></label>;
}

function CoursePanel({lesson,selected,select,progress,startLesson,speak,setTab}) {
  const status = id => progress[id]?.passed ? 'passed' : progress[id]?.started||id===1?'started':'not-started';
  return <div className="courseSplit">
    <aside className="courseSyllabus">
      <div className="courseSideHeader"><b>درس‌های من</b><small>انتخاب و شروع هر درس آزاد است</small></div>
      <div className="courseLessonList">{lessons.map(l=><button key={l.id} onClick={()=>select(l.id)} className={'courseLesson '+(selected===l.id?'chosen':'')}>
        <span className={'lessonIndex '+status(l.id)}>{progress[l.id]?.passed?<Check size={17}/>:String(l.id).padStart(2,'0')}</span>
        <span className="lessonNames"><b>{l.label}</b><small dir="ltr">{l.german}</small></span>
        <ChevronLeft size={15}/>
      </button>)}</div>
    </aside>
    <div className="courseLessonBody">
      <article className="courseIntro">
        <span className="courseTopline">LEKTION {String(lesson.id).padStart(2,'0')} · A1.1</span>
        <h3>{lesson.label}</h3>
        <p dir="ltr">{lesson.german}</p>
        <div className="courseGoal"><Target size={18}/>{lesson.goal}</div>
        <div className="courseMeta"><span><BookOpen size={15}/> {lesson.words.length} واژه</span><span><Zap size={15}/> {lesson.sentences.length} جمله</span><span><GraduationCap size={15}/> {lesson.verbs.length} فعل</span></div>
        {progress[lesson.id]?.passed ? <span className="lessonPassed"><CheckCircle2 size={17}/> این درس را با حداقل ۸۰٪ گذرانده‌ای</span>
          : <button className="courseStart" onClick={()=>startLesson(lesson.id)}>{progress[lesson.id]?.started || lesson.id===1?'ثبت این درس برای مرور روزانه':'شروع مطالعه و فعال‌سازی مرور'} <ArrowLeft size={17}/></button>}
      </article>
      <section className="courseContentBlock">
        <div className="courseTitle"><div><small>VOCABULARY</small><h3>کلمات درس</h3></div><span>{lesson.words.length} کلمه</span></div>
        <div className="vocabGrid">{lesson.words.map(([de,fa],index)=><button className="vocabTile" key={de} onClick={()=>speak(de)}><span className="vocabOrdinal">{String(index+1).padStart(2,'0')}</span><span><b dir="ltr">{de}</b><small>{fa}</small></span><Volume2 size={17}/></button>)}</div>
      </section>
      <section className="courseContentBlock">
        <div className="courseTitle"><div><small>GRAMMAR</small><h3>نکته گرامری</h3></div></div>
        <strong>{lesson.grammar}</strong><p className="grammarTip">{lesson.tip}</p>
        <div className="shortVerbList">{lesson.verbs.map(v=><span key={v} dir="ltr">{v}</span>)}</div>
      </section>
      <section className="courseContentBlock">
        <div className="courseTitle"><div><small>SAY IT OUT LOUD</small><h3>جمله‌های کاربردی</h3></div></div>
        <div className="sampleSentences">{lesson.sentences.map(([de,fa])=><div key={de}><button onClick={()=>speak(de)} aria-label={'تلفظ '+de}><Volume2 size={19}/></button><span><b dir="ltr">{de}</b><small>{fa}</small></span></div>)}</div>
      </section>
      <div className="courseCTA"><button onClick={()=>{startLesson(lesson.id);setTab('builder')}}><Shuffle size={18}/> تمرین جمله‌سازی</button><button onClick={()=>{startLesson(lesson.id);setTab('exam')}}><GraduationCap size={18}/> آزمون پایان درس</button></div>
    </div>
  </div>;
}

function ReviewPanel({available,schedule,due,rate,speak,setTab}) {
  const [revealed,setRevealed] = useState(false);
  const card=due[0];
  const reviewed=Object.keys(schedule).filter(id=>schedule[id]?.lastReviewed).length;
  const nextDate=Object.values(schedule).filter(x=>x?.dueAt>Date.now()).map(x=>x.dueAt).sort((a,b)=>a-b)[0];
  function choose(grade) {rate(card,grade);setRevealed(false);}
  return <div className="reviewLayout">
    <div className="reviewCardShell">
      <div className="studyPanelHead"><div><span className="eyebrow">SPACED REPETITION</span><h3>فلش‌کارت هوشمند</h3><p>سخت‌ها زودتر برمی‌گردند؛ کارت‌های مسلط‌شده دیرتر.</p></div><div className="srsCount">{due.length}<small>آماده امروز</small></div></div>
      {card ? <>
        <div className="srsCardMeta"><span>{card.lesson===0?'فلش‌کارت شخصی':'درس '+card.lesson}</span><span>کارت {reviewed+1}</span></div>
        <button className={'srsFlash '+(revealed?'showBack':'')} onClick={()=>{setRevealed(v=>!v);setRevealKey(card.id)}} aria-label="برگرداندن فلش کارت">
          <small>{revealed?'پاسخ آلمانی':'معنی فارسی — پاسخ را حدس بزن'}</small>
          <strong dir={revealed?'ltr':'rtl'}>{revealed?card.back:card.front}</strong>
          <span>{revealed?'برای برگشت به فارسی لمس کن':'برای نمایش پاسخ لمس کن'}</span>
        </button>
        {revealed && <><button className="srsListen" onClick={()=>speak(card.speak)}><Volume2 size={18}/> شنیدن تلفظ صحیح</button>
          <div className="rateButtons">
            <button onClick={()=>choose('again')}><span>دوباره</span><small>۱۰ دقیقه</small></button>
            <button onClick={()=>choose('hard')}><span>سخت</span><small>حداقل فردا</small></button>
            <button onClick={()=>choose('good')}><span>خوب</span><small>مرور فاصله‌دار</small></button>
            <button onClick={()=>choose('easy')}><span>آسان</span><small>فاصله بیشتر</small></button>
          </div></>}
      </> : <div className="reviewEmpty"><CheckCircle2 size={52}/><h3>کارت آماده مرور تمام شد!</h3><p>{nextDate?'نوبت بعدی مرور با رسیدن موعد کارت‌ها فعال می‌شود.':'اگر درس جدیدی را شروع کنی، کارت‌های آن به صف مرور اضافه می‌شوند.'}</p><button onClick={()=>setTab('course')}>انتخاب درس جدید <ArrowLeft size={16}/></button></div>}
    </div>
    <aside className="reviewSidebar">
      <div className="reviewStats"><Trophy size={26}/><strong>{reviewed}</strong><span>کارت مرورشده تا امروز</span></div>
      <h4>روش مرور</h4><p>قبل از برگرداندن کارت پاسخ را با صدای بلند بگو. بعد صادقانه ارزیابی کن:</p>
      <div className="reviewLegend"><span>دوباره</span><p>یادت نبود؛ به‌زودی دوباره بپرس</p><span>سخت</span><p>با مکث جواب دادی؛ فردا تکرار شود</p><span>خوب / آسان</span><p>با تسلط پاسخ دادی؛ فاصله مرور بیشتر شود</p></div>
      <small>اطلاعات تنها روی همین مرورگر ذخیره می‌شود. از کارت‌های سفارشی‌ات در بخش فلش‌کارت قبلی خروجی بگیر.</small>
    </aside>
  </div>;
}

function BuilderPanel({lesson,selected,select,speak}) {
  const [index,setIndex]=useState(0);
  const [chosen,setChosen]=useState([]);
  const [checked,setChecked]=useState(false);
  const [round,setRound]=useState(0);
  const sentences=lesson.sentences;
  const [de,fa]=sentences[index % sentences.length];
  const tokens=useMemo(()=>shuffleArray(de.split(' ').map((value,id)=>({id,value}))),[de,round]);
  const selectedWords=chosen.map(id=>tokens.find(t=>t.id===id)?.value).filter(Boolean);
  const isCorrect=normalizeAnswer(selectedWords.join(' '))===normalizeAnswer(de);
  function next(){
    setIndex(i=>(i+1)%sentences.length);setChosen([]);setChecked(false);setRound(x=>x+1);
  }
  function changeLesson(id){select(id);setIndex(0);setChosen([]);setChecked(false);setRound(x=>x+1);}
  return <section className="builderPanel">
    <div className="studyPanelHead"><div><span className="eyebrow">SENTENCE BUILDER</span><h3>بازی جمله‌سازی</h3><p>کلمات را به ترتیب درست لمس کن؛ سپس جمله‌ات را بررسی کن.</p></div><LessonPicker selected={selected} select={changeLesson}/></div>
    <div className="builderQuestion"><span>جمله {index+1} از {sentences.length} · درس {lesson.id}</span><h3>{fa}</h3><button onClick={()=>speak(de)}><Headphones size={18}/> شنیدن جمله (راهنما)</button></div>
    <div className="builderOutput" dir="ltr">
      {selectedWords.length ? selectedWords.map((word,i)=><span key={chosen[i]}>{word}</span>) : <small>جمله آلمانی را اینجا بساز ...</small>}
    </div>
    <div className="builderTokens" dir="ltr">{tokens.map(t=><button key={t.id} disabled={chosen.includes(t.id)||checked} onClick={()=>setChosen(prev=>[...prev,t.id])}>{t.value}</button>)}</div>
    <div className="builderActions"><button className="softButton" disabled={!chosen.length||checked} onClick={()=>setChosen(prev=>prev.slice(0,-1))}><RotateCcw size={16}/> بازگرداندن کلمه</button><button className="builderCheck" disabled={!chosen.length||checked} onClick={()=>setChecked(true)}>بررسی جمله <Check size={17}/></button></div>
    {checked && <div className={'builderResult '+(isCorrect?'positive':'negative')}>
      <strong>{isCorrect?'عالی، جمله‌ات درست است!':'هنوز درست نیست؛ ترتیب صحیح را ببین.'}</strong>
      <p dir="ltr">{de}</p><button onClick={()=>speak(de)}><Volume2 size={16}/> تلفظ</button>
      <button onClick={next}>جمله بعد <ArrowLeft size={16}/></button>
    </div>}
    <p className="builderHelp">اشتباه‌ها بخشی از یادگیری‌اند. بعد از هر پاسخ، ترتیب جمله و تلفظ صحیح نمایش داده می‌شود.</p>
  </section>;
}

function ExamPanel({lesson,selected,select,progress,examDone,speak}) {
  const [round,setRound]=useState(0);
  const exam=useMemo(()=>buildExam(lesson),[lesson,round]);
  const [index,setIndex]=useState(0);
  const [answer,setAnswer]=useState(null);
  const [score,setScore]=useState(0);
  const [finished,setFinished]=useState(false);
  const q=exam[index];
  function reset(){setRound(x=>x+1);setIndex(0);setAnswer(null);setScore(0);setFinished(false);}
  function changeLesson(id){select(id);reset();}
  function respond(choice){if(answer!==null)return;setAnswer(choice);if(choice===q.answer)setScore(s=>s+1);}
  function next(){if(index===exam.length-1){setFinished(true);examDone(lesson.id,score,exam.length);}else{setIndex(i=>i+1);setAnswer(null);}}
  const percent=Math.round(score/exam.length*100);
  return <section className="examPanel">
    <div className="studyPanelHead"><div><span className="eyebrow">FINAL LESSON CHECK</span><h3>آزمون پایان درس</h3><p>۱۰ سؤال ترکیبی از لغت، صرف فعل و درک جمله. حداقل نمره قبولی ۸۰٪ است.</p></div><LessonPicker selected={selected} select={changeLesson}/></div>
    {!finished ? <>
      <div className="examHeader"><span>سؤال {index+1} از {exam.length}</span><strong>امتیاز {score}</strong></div>
      <div className="examTrack"><span style={{width:(index/exam.length*100)+'%'}}/></div>
      <div className="examPrompt"><span>{q.kind==='vocab'?'واژگان':q.kind==='grammar'?'صرف فعل':'خواندن و معنی'}</span><h3>{q.label}</h3>{q.audio && <button onClick={()=>speak(q.audio)} aria-label="شنیدن آلمانی"><Volume2 size={17}/> پخش آلمانی</button>}</div>
      <div className="examOptions">{q.choices.map(choice=><button key={choice} disabled={answer!==null} onClick={()=>respond(choice)}
        className={answer===null?'':choice===q.answer?'correct':choice===answer?'incorrect':''}>
        <span dir={/[a-zäöüß]/i.test(choice)?'ltr':'rtl'}>{choice}</span>
        {answer!==null && choice===q.answer && <Check size={18}/>}
        {answer===choice && choice!==q.answer && <X size={18}/>}
      </button>)}</div>
      {answer!==null && <div className={'examExplanation '+(answer===q.answer?'success':'failure')}>
        <b>{answer===q.answer?'درست انتخاب کردی!':'پاسخ درست را مرور کن.'}</b><span>{q.answer}</span>
        <button onClick={next}>{index===exam.length-1?'مشاهده نتیجه نهایی':'سؤال بعدی'} <ArrowLeft size={16}/></button>
      </div>}
    </> : <div className="examResultCard">
      <div className={'examMedal '+(percent>=80?'pass':'tryagain')}>{percent>=80?<Trophy size={39}/>:<Target size={39}/>}</div>
      <h3>{percent>=80?'تبریک! این درس را گذراندی.':'یک بار دیگر تمرین کن.'}</h3>
      <strong dir="ltr">{score} / {exam.length}</strong>
      <p>امتیاز {percent}٪ {percent>=80?'— درس در مسیر یادگیری تکمیل شد.':'— برای قبولی به ۸۰٪ نیاز داری.'}</p>
      <button className="courseStart" onClick={reset}><RotateCcw size={18}/> آزمون تصادفی جدید</button>
      {progress[lesson.id]?.best && <small>بهترین نمره ذخیره‌شده: {progress[lesson.id].best}٪</small>}
    </div>}
  </section>;
}
