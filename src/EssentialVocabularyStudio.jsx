import React,{useEffect,useState} from 'react';
import {ArrowLeft,BookOpenCheck,CheckCircle2,ChevronLeft,ChevronRight,Gamepad2,GraduationCap,RotateCcw,Volume2} from 'lucide-react';
import {ESSENTIAL_KEY,essentialGroups,essentialForLesson,essentialWords,essentialOptions,essentialGrade,essentialRecord,essentialMarkSeen,essentialWeak} from './essentialVocabularyData.js';
import './essentialVocabularyStudio.css';
import {lessonFromSearch,replaceLessonQuery,writeLessonFocus} from './lessonFocus.js';
const number=n=>Number(n).toLocaleString('fa-IR');
function restore(){try{return JSON.parse(localStorage.getItem(ESSENTIAL_KEY)||'{}')||{}}catch{return {}}}
export default function EssentialVocabularyStudio({speak=()=>{},onPracticeEvent}){
 const [lesson,setLesson]=useState(()=>lessonFromSearch(window.location.search,window.localStorage,8));
 const [mode,setMode]=useState('learn');
 const [index,setIndex]=useState(0);
 const [flipped,setFlipped]=useState(false);
 const [answer,setAnswer]=useState(null);
 const [progress,setProgress]=useState(restore);
 const [reviewIds,setReviewIds]=useState(null);
 const [session,setSession]=useState({right:0,total:0});
 const group=essentialForLesson(lesson);
 const words=reviewIds===null?group.words:group.words.filter(w=>reviewIds.includes(w.id));
 const word=words[index];
 const finished=index>=words.length||words.length===0;
 const completed=essentialWords.filter(w=>progress[w.id]?.seen).length;
 const weak=essentialWeak(progress,lesson);
 useEffect(()=>{try{localStorage.setItem(ESSENTIAL_KEY,JSON.stringify(progress))}catch{}},[progress]);
 useEffect(()=>{writeLessonFocus(window.localStorage,lesson,true)},[lesson]);
 function chooseLesson(value){writeLessonFocus(window.localStorage,value,true);replaceLessonQuery(value,window.location,window.history);setLesson(value);setIndex(0);setMode('learn');setFlipped(false);setAnswer(null);setSession({right:0,total:0});setReviewIds(null)}
 function switchMode(next){setMode(next);setIndex(0);setFlipped(false);setAnswer(null);setSession({right:0,total:0});setReviewIds(null)}
 function startWeak(){if(!weak.length)return;setMode('game');setIndex(0);setFlipped(false);setAnswer(null);setSession({right:0,total:0});setReviewIds(weak.map(w=>w.id))}
 function next(){setIndex(i=>Math.min(words.length,i+1));setAnswer(null);setFlipped(false)}
 function previous(){setIndex(i=>Math.max(0,i-1));setAnswer(null);setFlipped(false)}
 function reveal(){if(!word)return;speak(word.de);setFlipped(v=>!v)}
 function learned(){if(!word)return;setProgress(old=>essentialMarkSeen(old,word));next()}
 function select(selected){if(!word||answer!==null)return;
  const correct=essentialGrade(word,mode,selected);
  speak(mode==='test'?word.de:selected);
  setAnswer({selected,correct});
  setProgress(old=>essentialRecord(old,word,correct));
  setSession(old=>({right:old.right+Number(correct),total:old.total+1}));
  onPracticeEvent?.({id:'essential:'+word.id,lesson,kind:'vocab',label:word.de,correct});
 }
 return <main className="evPage" dir="rtl">
  <header className="evHero">
   <div><span>LERNWORTSCHATZ · MENSCHEN A1.1</span><h1>واژگان مهم کتاب</h1>
    <p>۱۲۰ واژه گزیده در ۱۲ درس با آرتیکل، معنی، تلفظ و آزمون.</p>
    <small>منبع: بخش‌های واژگان Lernwortschatz در Arbeitsbuch. صفحات ۹۷ تا ۱۰۲ فایل فعلی، تبلیغ کتاب‌های دیگرند و منبع این واژگان نیستند.</small>
   </div><b>{number(completed)} / {number(essentialWords.length)} <small>دیده‌شده</small></b>
  </header>
  <section className="evLessonChoose"><div><b>انتخاب درس</b><span>درس {number(lesson)} · {group.topic}</span></div>
   <div className="evLessonGrid">
    {essentialGroups.map(g=><button key={g.lesson} type="button" aria-pressed={lesson===g.lesson} className={lesson===g.lesson?'active':''} onClick={()=>chooseLesson(g.lesson)}>{number(g.lesson)}</button>)}
   </div>
   <small>Arbeitsbuch · صفحه {number(group.pdfPage)} فایل PDF · {number(group.words.length)} واژه</small>
  </section>
  <div className="evModes" role="group" aria-label="حالت یادگیری واژگان">
   <button aria-pressed={mode==='learn'} className={mode==='learn'?'active':''} onClick={()=>switchMode('learn')}><BookOpenCheck size={18}/> یادگیری</button>
   <button aria-pressed={mode==='game'} className={mode==='game'?'active':''} onClick={()=>switchMode('game')}><Gamepad2 size={18}/> بازی</button>
   <button aria-pressed={mode==='test'} className={mode==='test'?'active':''} onClick={()=>switchMode('test')}><GraduationCap size={18}/> آزمون</button>
  </div>
  <div className="evCounts"><span>کارت {number(Math.min(index+1,words.length))} از {number(words.length)}</span><span>{number(weak.length)} واژه نیازمند مرور</span></div>
  <div className="evProgress"><span style={{width:(words.length?Math.min(index,words.length)/words.length*100:0)+'%'}}/></div>
  {weak.length>0&&reviewIds===null&&<button type="button" className="evWeakButton" onClick={startWeak}>تمرین فقط {number(weak.length)} واژه ضعیف <RotateCcw size={16}/></button>}
  {finished?<section className="evFinished" role="status"><CheckCircle2 size={38}/><h2>{words.length?'این دور تمام شد!':'واژه ضعیفِ حل‌نشده‌ای نداری.'}</h2>
   {mode!=='learn'&&<p>{number(session.right)} پاسخ صحیح از {number(session.total)} تلاش</p>}
   <button type="button" onClick={()=>{setIndex(0);setAnswer(null);setFlipped(false);setSession({right:0,total:0})}}>تمرین مجدد همین مجموعه</button>
   {reviewIds!==null&&<button onClick={()=>switchMode('learn')}>همه واژگان درس</button>}
  </section>:<section className="evCard">
   {mode==='learn'?<div className="evLearning">
    <button type="button" className={'evFlip '+(flipped?'flipped':'')} aria-label={flipped?'نمایش واژه آلمانی':'نمایش معنی فارسی'} onClick={reveal}>
     <small>{flipped?'معنی فارسی':'کلمه آلمانی · برای تلفظ و برگرداندن لمس کن'}</small>
     <strong lang={flipped?'fa':'de'} dir={flipped?'rtl':'ltr'}>{flipped?word.fa:word.de}</strong>
     <span>{flipped?word.de:'کارت را لمس کن'}</span>
    </button>
    <button type="button" className="evAudio" onClick={()=>speak(word.de)}><Volume2 size={18}/> شنیدن تلفظ آلمانی</button>
    <button className="evMark" type="button" onClick={learned}><CheckCircle2 size={17}/> یاد گرفتم، بعدی</button>
   </div>:<div className="evGame">
    <span>{mode==='game'?'معادل آلمانی را پیدا کن':'معنی فارسی را انتخاب کن'}</span>
    <strong className="evPrompt" lang={mode==='test'?'de':'fa'} dir={mode==='test'?'ltr':'rtl'}>{mode==='test'?word.de:word.fa}</strong>
    <div className="evOptions" role="group" aria-label="گزینه‌های پاسخ">
     {essentialOptions(group,group.words.findIndex(w=>w.id===word.id),mode).map(option=><button type="button" key={option}
       disabled={answer!==null} className={answer===null?'':option===(mode==='test'?word.fa:word.de)?'correct':answer.selected===option?'wrong':''}
       lang={mode==='test'?'fa':'de'} dir={mode==='test'?'rtl':'ltr'} onClick={()=>select(option)}>{option}</button>)}
    </div>
    {answer!==null&&<div className={'evAnswer '+(answer.correct?'correct':'wrong')} role="status">
     <span>{answer.correct?'درست بود!':'جواب درست:'} <b lang="de" dir="ltr">{word.de}</b> — {word.fa}</span>
     <button onClick={()=>speak(word.de)}><Volume2 size={17}/> دوباره بشنو</button>
    </div>}
   </div>}
   <nav className="evNavigation" aria-label="کارت قبل و بعد">
    <button type="button" disabled={index===0} onClick={previous}><ChevronRight size={17}/> قبلی</button>
    <button type="button" onClick={next}>{index===words.length-1?'نتیجه':'بعدی'} <ChevronLeft size={17}/></button>
   </nav>
  </section>}
  <div className="evNote">در بازی، با لمس گزینه آلمانی صدای همان گزینه پخش می‌شود. پاسخ اشتباه ثبت می‌شود و پس از پاسخ درست دوباره از فهرست واژه‌های ضعیف خارج خواهد شد.</div>
  <nav className="evRelated"><a href="/action-pages"><Gamepad2 size={17}/> تمرین‌های صفحات ۷۳ تا ۹۶</a><a href="/practice"><ArrowLeft size={17}/> همه تمرین‌ها</a></nav>
 </main>;
}
