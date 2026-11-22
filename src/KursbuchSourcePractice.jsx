import React,{useEffect,useMemo,useState} from 'react';
import {ArrowLeft,BookOpen,BookOpenCheck,CheckCircle2,ChevronDown,ChevronLeft,Clock3,Headphones,MessageCircle,RotateCcw,Target,Users,Volume2} from 'lucide-react';
import {lessons} from './courseData.js';
import {KURSBUCH_SOURCE,KURSBUCH_SOURCE_NOTE,kursbuchChapters,kursbuchActions,kursbuchChapter,kursbuchActionByLesson,bookBingoWon,normalizeBookFill} from './kursbuchSourceExercises.js';
import './kursbuchSourcePractice.css';

export const KURSBUCH_PROGRESS_KEY='dt_kursbuch_exercises_v1';
function loadSaved(){
 try{const saved=JSON.parse(localStorage.getItem(KURSBUCH_PROGRESS_KEY)||'{}');return saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{}}catch{return {}}
}
function requestedLesson(){
 const q=new URLSearchParams(window.location.search);
 const lesson=Number(q.get('lesson'));
 return Number.isInteger(lesson)&&lesson>=1&&lesson<=12?lesson:8;
}
function initialSection(){return new URLSearchParams(window.location.search).get('collection')==='actions'?'actions':'lesson'}
function tokenizedLabel(text){return String(text||'').split('___');}
export default function KursbuchSourcePractice({speak=()=>{},onPracticeEvent}){
 const [lessonId,setLessonId]=useState(requestedLesson);
 const [section,setSection]=useState(initialSection);
 const [showAllActions,setShowAllActions]=useState(false);
 const [activeId,setActiveId]=useState('');
 const [saved,setSaved]=useState(loadSaved);
 const [typed,setTyped]=useState('');
 const [checked,setChecked]=useState(null);
 const [step,setStep]=useState(0);
 const [revealed,setRevealed]=useState(false);
 const [hard,setHard]=useState(0);
 const [quizScore,setQuizScore]=useState(0);
 const [bingo,setBingo]=useState(Array(25).fill(false));
 const chapter=kursbuchChapter(lessonId);
 const items=useMemo(()=>section==='lesson'?chapter?.exercises||[]:showAllActions?kursbuchActions:kursbuchActionByLesson(lessonId),[lessonId,section,showAllActions,chapter]);
 const current=items.find(x=>x.id===activeId)||items[0];
 const currentIsAction=section==='actions';
 const currentTitle=current?.title||current?.topic;
 const finished=items.filter(x=>saved[x.id]?.completed).length;
 const totalCompleted=Object.values(saved).filter(x=>x?.completed).length;
 useEffect(()=>{try{localStorage.setItem(KURSBUCH_PROGRESS_KEY,JSON.stringify(saved))}catch{}},[saved]);
 useEffect(()=>{if(items.length&&!items.some(x=>x.id===activeId)){setActiveId(items[0].id);setStep(0);setRevealed(false);setChecked(null);setTyped('');setQuizScore(0);setHard(0);setBingo(Array(25).fill(false));}},[items,activeId]);
 function resetRound(item){
  setActiveId(item.id);setStep(0);setRevealed(false);setChecked(null);setTyped('');setQuizScore(0);setHard(0);setBingo(Array(25).fill(false));
 }
 function changeLesson(id){setLessonId(id);setShowAllActions(false);setActiveId('')}
 function markDone(item,correct=null,difficult=0){
  if(!item)return;
  setSaved(prev=>({...prev,[item.id]:{
   ...prev[item.id],completed:true,attempts:(prev[item.id]?.attempts||0)+1,
   ...(correct===null?{}:{correct,lastScore:correct?100:0}),
   difficult:(prev[item.id]?.difficult||0)+difficult,lastAt:Date.now()
  }}));
 }
 function gradeFill(){
  if(!current||checked!==null||!typed.trim())return;
  const correct=normalizeBookFill(typed)===normalizeBookFill(current.answer);
  setChecked(correct);markDone(current,correct);
  onPracticeEvent?.({id:'kursbuch:lesson:'+current.id,kind:'grammar',lesson:lessonId,label:current.prompt,correct});
 }
 function chooseQuiz(value){
  if(!current||checked!==null)return;
  const currentItem=current.items[step];
  const correct=value===currentItem.answer;
  const newHits=quizScore+Number(correct);
  setChecked(value);
  setQuizScore(newHits);
  if(step===current.items.length-1){
    markDone(current,newHits===current.items.length);
    onPracticeEvent?.({id:'kursbuch:action:'+current.id,kind:'reading',lesson:current.lesson,label:current.title,correct:newHits===current.items.length});
  }
 }
 function nextQuiz(){setStep(n=>Math.min(current.items.length-1,n+1));setChecked(null)}
 function nextDialogue(difficult=false){
  const nextHard=hard+Number(difficult);setHard(nextHard);
  if(step+1>=current.turns.length){markDone(current,null,nextHard);setRevealed(true);setStep(current.turns.length)}
  else{setStep(n=>n+1);setRevealed(false)}
 }
 function toggleBingo(i){
  const copy=[...bingo];copy[i]=!copy[i];setBingo(copy);
  if(bookBingoWon(copy)&&!bookBingoWon(bingo))markDone(current,null,0);
 }
 function speakText(value){speak(value)}
 return <div className="kbSourcePage" dir="rtl">
  <header className="kbSourceHero">
   <div><span className="kbSourceEyebrow"><BookOpen size={17}/> {KURSBUCH_SOURCE}</span>
    <h1>تمرین‌های واقعی موضوعات کتاب</h1>
    <p>تمرین‌های داخل درس‌ها و Aktionsseiten صفحات ۸۰ تا ۹۰، بازطراحی‌شده برای گوشی و مکالمه دو نفره.</p>
    <small>{KURSBUCH_SOURCE_NOTE}</small>
   </div>
   <div className="kbSourceTotal"><b>{totalCompleted.toLocaleString('fa-IR')}</b><span>فعالیت انجام‌شده</span></div>
  </header>
  <div className="kbSourcePicker">
   <label htmlFor="kb-source-lesson">انتخاب درس</label>
   <select id="kb-source-lesson" value={lessonId} onChange={e=>changeLesson(Number(e.target.value))}>
    {lessons.map(l=><option key={l.id} value={l.id}>{l.id} · {kursbuchChapter(l.id)?.title||l.label}</option>)}
   </select>
  </div>
  <div className="kbSourceSwitch" role="group" aria-label="بخش تمرین‌های کتاب">
   <button type="button" aria-pressed={section==='lesson'} className={section==='lesson'?'active':''} onClick={()=>{setSection('lesson');setActiveId('')}}><BookOpenCheck size={18}/> داخل درس</button>
   <button type="button" aria-pressed={section==='actions'} className={section==='actions'?'active':''} onClick={()=>{setSection('actions');setActiveId('')}}><Users size={18}/> گفت‌وگوهای کتاب</button>
  </div>
  <div className="kbSourceSummary"><span><b>{chapter?.title}</b><small dir="ltr">Kursbuch S. {chapter?.from}–{chapter?.to}</small></span>
   <span>{finished.toLocaleString('fa-IR')} / {items.length.toLocaleString('fa-IR')} انجام‌شده</span>
  </div>
  {currentIsAction&&<div className="kbSourceAll"><label><input type="checkbox" checked={showAllActions} onChange={e=>{setShowAllActions(e.target.checked);setActiveId('')}}/> نمایش همه فعالیت‌های صفحات ۸۰ تا ۹۰</label></div>}
  <nav className="kbSourceCards" aria-label="انتخاب تمرین">
   {items.map((item,i)=><button type="button" key={item.id} onClick={()=>resetRound(item)} aria-current={current?.id===item.id?'true':undefined} className={current?.id===item.id?'selected':''}>
    <span className="kbSourcePageNo">{item.page}</span>
    <span><strong>{item.title||item.topic}</strong><small>صفحه {item.page} · {currentIsAction?'Aktionsseiten':'Kursbuch'}</small></span>
    {saved[item.id]?.completed?<CheckCircle2 size={18} className="kbSourceDone"/>:<ChevronLeft size={15}/>}
   </button>)}
  </nav>
  {!items.length&&<section className="kbSourceEmpty">برای این درس در صفحات ۸۰ تا ۹۰ فعالیت مستقلی نیست. گزینه «نمایش همه فعالیت‌ها» را فعال کن یا سراغ تمرین‌های داخل درس برو.</section>}
  {current&&<section className="kbSourceExercise" key={current.id}>
   <div className="kbSourceExerciseHead"><span>{current.ref||'Kursbuch · Lektion '+lessonId}</span><b>{currentTitle}</b></div>
   {current.goal&&<p className="kbSourceGoal">{current.goal}</p>}
   {current.imageDependent&&<p className="kbSourceBookHint">این تمرین در کتاب تصویر یا جدول دارد؛ برای جزئیات تصویر به صفحه {current.page} همان PDF مراجعه کن. مثال‌های زیر راهنمای تمرین‌اند.</p>}
   {current.kind==='fill'&&<div className="kbSourceFill">
    <div className="kbSourceQuestion"><small>جای خالی را کامل کن</small>
     <strong lang="de" dir="ltr">{tokenizedLabel(current.prompt).map((part,i,arr)=><React.Fragment key={i}>{part}{i<arr.length-1?<span className="kbSourceBlank">_______</span>:null}</React.Fragment>)}</strong>
     <span>{current.fa}</span></div>
    <form onSubmit={e=>{e.preventDefault();gradeFill()}}>
     <input lang="de" dir="ltr" aria-label="جواب آلمانی جای خالی" value={typed} disabled={checked!==null} autoComplete="off" onChange={e=>setTyped(e.target.value)} placeholder="Antwort auf Deutsch..." />
     <button type="submit" disabled={!typed.trim()||checked!==null}>بررسی جواب</button>
    </form>
    {checked!==null&&<div role="status" className={'kbSourceFeedback '+(checked?'correct':'wrong')}>
     <b>{checked?'درست است!':'جواب نمونه'}</b><span lang="de" dir="ltr">{current.answer}</span><small>{current.tip}</small>
    </div>}
    <button type="button" className="kbSourceRepeat" onClick={()=>{setTyped('');setChecked(null)}}><RotateCcw size={16}/> دوباره تلاش کن</button>
   </div>}
   {(current.kind==='truefalse'||current.kind==='clock')&&<div className="kbSourceQuiz">
    <div className="kbSourceQuestion"><small>{step+1} از {current.items.length}</small>
     <strong lang="de" dir="ltr">{current.kind==='clock'?'Wie spät ist es? · '+current.items[step].time:current.items[step][0]}</strong></div>
    <div className="kbSourceQuizAnswers">
     {(current.kind==='clock'?current.items[step].options:['Richtig','Falsch']).map((opt,i)=>{
      const chosen=current.kind==='clock'?opt:i===0;
      return <button type="button" key={String(opt)} disabled={checked!==null} onClick={()=>chooseQuiz(chosen)} className={checked===chosen?'chosen':''}>{opt}</button>;
     })}
    </div>
    {checked!==null&&<div role="status" className={'kbSourceFeedback '+(checked===(current.kind==='clock'?current.items[step].answer:current.items[step][1])?'correct':'wrong')}>
     <b>{checked===(current.kind==='clock'?current.items[step].answer:current.items[step][1])?'آفرین، درست است.':'این پاسخ درست نبود.'}</b>
     <span>{current.kind==='clock'?current.items[step].answer:current.items[step][2]}</span>
    </div>}
    {checked!==null&&step+1<current.items.length&&<button type="button" className="kbSourceNext" onClick={nextQuiz}>سؤال بعدی <ArrowLeft size={18}/></button>}
    {checked!==null&&step+1===current.items.length&&<div className="kbSourceEnd">
      <CheckCircle2 size={20}/> این دور تمام شد · {quizScore} از {current.items.length} پاسخ درست
      <button type="button" onClick={()=>resetRound(current)}>تلاش مجدد</button>
    </div>}
   </div>}
   {current.kind==='dialogue'&&<div className="kbSourceDialogue">
    {step>=current.turns.length?<div className="kbSourceEnd"><CheckCircle2 size={32}/><b>تمرین این گفت‌وگو انجام شد</b><p>نتیجه بر اساس اعلام خودت ثبت شده، نه نمره‌گذاری هوشمند تلفظ.</p><button onClick={()=>resetRound(current)}>تمرین دوباره</button></div>:
    <><div className="kbSourceTurns">{step+1} / {current.turns.length} <span>نفر A → نفر B · نوبت بعد نقش‌ها را عوض کنید</span></div>
     <div className="kbSourceSpeech"><small>نفر A بپرسد</small><strong lang="de" dir="ltr">{current.turns[step].de}</strong><span>{current.turns[step].fa}</span>
      <button type="button" onClick={()=>speakText(current.turns[step].de)}><Volume2 size={18}/> شنیدن نمونه</button></div>
     <div className="kbSourceResponse"><b>نفر B: بدون نگاه‌کردن پاسخ بده</b>
      {!revealed?<button type="button" onClick={()=>setRevealed(true)}>نمایش پاسخ نمونه <ChevronDown size={17}/></button>:
      <div className="kbSourceSample"><strong lang="de" dir="ltr">{current.turns[step].reply}</strong><span>{current.turns[step].replyFa}</span>
       <button type="button" onClick={()=>speakText(current.turns[step].reply)}><Headphones size={16}/> شنیدن پاسخ</button></div>}</div>
     <div className="kbSourceDialogActions"><button type="button" onClick={()=>nextDialogue(true)}>سخت بود، مرور شود</button><button type="button" onClick={()=>nextDialogue(false)}>نوبت بعد <ArrowLeft size={17}/></button></div>
     </>}
   </div>}
   {current.kind==='bingo'&&<div className="kbSourceBingo">
    <p>از دوستانت سؤال کن: «Wie oft ...?»؛ با هر پاسخ، خانه مربوط را لمس کن.</p>
    <div className="kbBingoGrid" role="group" aria-label="شبکه بینگوی ۵ در ۵">
     {current.items.map((item,i)=><button type="button" key={item} aria-pressed={Boolean(bingo[i])} className={bingo[i]?'selected':''}
       onClick={()=>toggleBingo(i)}>{item}</button>)}
    </div>
    {bookBingoWon(bingo)&&<div className="kbSourceFeedback correct" role="status">BINGO! پنج خانه کامل شدند. مکالمه را با نقش‌های عوض‌شده تکرار کن.</div>}
    <button className="kbSourceRepeat" type="button" onClick={()=>setBingo(Array(25).fill(false))}><RotateCcw size={16}/> شروع دوباره</button>
   </div>}
  </section>}
  <div className="kbSourceFooter"><Target size={18}/><p>این مجموعه از PDF کتاب ارسالی تهیه شده است. تمرین‌های داخل درس به فعالیت‌های همان صفحه مرتبط‌اند؛ در صفحات تصویری/شنیداری برای انجام دقیق‌تر به کتاب و فایل صوتی مربوط مراجعه کن.</p></div>
  <div className="kbSourceNav"><a href={'/lessons/'+lessonId+'#book-practice'}><BookOpenCheck size={18}/> تمرین‌های قبلی درس {lessonId}</a><a href="/partner-practice?lesson=8"><Users size={18}/> گفت‌وگوهای آزاد</a></div>
 </div>;
}
