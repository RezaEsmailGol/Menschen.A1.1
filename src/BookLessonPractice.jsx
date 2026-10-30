import React, {useEffect,useMemo,useState} from 'react';
import {ArrowLeft,BookOpen,CheckCircle2,ChevronLeft,Headphones,Mic2,RotateCcw,Volume2,XCircle} from 'lucide-react';
import {activityItemKey} from './learningMemory.js';
import {bookLessonPlans,allBookTasks,germanNumber,isBookAnswerCorrect,normalizeBookAnswer} from './bookLessonData.js';
import './bookLessonPractice.css';

const STORE='dt_book_lessons_v1';
function readSaved() {
  try { const saved=JSON.parse(localStorage.getItem(STORE)||'{}'); return saved&&typeof saved==='object'?saved:{}; }
  catch { return {}; }
}
function shuffleTokens(phrase) {
  const tokens=phrase.split(/\s+/).map((word,id)=>({id,word}));
  // Stable rearrangement avoids changing the options while a user is building a sentence.
  const reordered=tokens.length>2?[...tokens.slice(1).reverse(),tokens[0]]:[...tokens].reverse();
  return reordered.every((token,i)=>token.id===i)?reordered.reverse():reordered;
}
function taskKind(task) {
  if(task.type==='listen')return 'dictation';
  if(task.type==='build')return 'sentence';
  if(task.type==='type')return 'grammar';
  return 'reading';
}
function NewNumberChallenge({speak,onPracticeEvent}) {
  const [number,setNumber]=useState(27);
  const [input,setInput]=useState('');
  const [checked,setChecked]=useState(null);
  const [done,setDone]=useState(0);
  const target=germanNumber(number);
  const next=()=>{
    let value=1+Math.floor(Math.random()*100);
    if(value===number)value=(value%100)+1;
    setNumber(value);setInput('');setChecked(null);
  };
  const check=()=>{
    if(checked!==null || !input.trim())return;
    const correct=normalizeBookAnswer(input)===normalizeBookAnswer(target);
    setChecked(correct);setDone(x=>x+1);
    onPracticeEvent?.({id:activityItemKey('book-number',number),lesson:2,kind:'number',label:target,correct});
  };
  return <div className="bookNumberChallenge">
    <div><b>بازی اعداد تصادفی ۱ تا ۱۰۰</b><small>{done} پاسخ در این نوبت</small></div>
    <div className="bookNumberPrompt"><strong dir="ltr">{number}</strong><button type="button" onClick={()=>speak(target)}><Volume2 size={18}/> تلفظ عدد</button></div>
    <form onSubmit={event=>{event.preventDefault();check();}}>
      <input lang="de" dir="ltr" aria-label="نوشتن عدد به آلمانی" placeholder="عدد را به آلمانی بنویس…" value={input} disabled={checked!==null}
        onChange={event=>setInput(event.target.value)} />
      <button disabled={!input.trim()||checked!==null} type="submit">بررسی</button>
    </form>
    {checked!==null&&<p role="status" className={checked?'bookCorrect':'bookWrong'}>{checked?'درست گفتی!':'پاسخ درست:'} <b dir="ltr">{target}</b></p>}
    {checked!==null&&<button type="button" className="bookSubtleButton" onClick={next}>عدد بعدی <ArrowLeft size={16}/></button>}
    <p className="bookHint">مثال: ۲۱ = einundzwanzig. عددهای ۱۲ (zwölf) و ۲۰ (zwanzig) را بیشتر مرور کن.</p>
  </div>;
}
export default function BookLessonPractice({lessonId,speak,onPracticeEvent,setTab}) {
  const plan=bookLessonPlans[lessonId];
  const [sectionIndex,setSectionIndex]=useState(0);
  const [taskIndex,setTaskIndex]=useState(0);
  const [answer,setAnswer]=useState('');
  const [chosen,setChosen]=useState([]);
  const [submitted,setSubmitted]=useState(null);
  const [saved,setSaved]=useState(readSaved);
  const [showSummary,setShowSummary]=useState(false);
  useEffect(()=>{try{localStorage.setItem(STORE,JSON.stringify(saved));}catch{}},[saved]);
  const stats=saved[lessonId]?.answers||{};
  const allTasks=useMemo(()=>allBookTasks(lessonId),[lessonId]);
  const correctCount=allTasks.filter(q=>stats[q.id]?.correct).length;
  const completedCount=allTasks.filter(q=>stats[q.id]).length;
  const section=plan?.sections[sectionIndex];
  const task=section?.tasks[taskIndex];
  const tokens=useMemo(()=>task?.type==='build'?shuffleTokens(task.answer):[],[task?.id]);
  const assembled=chosen.map(id=>tokens.find(t=>t.id===id)?.word).filter(Boolean).join(' ');
  if(!plan)return null;

  function resetQuestion(){setAnswer('');setSubmitted(null);setChosen([]);}
  function chooseSection(index){setSectionIndex(index);setTaskIndex(0);setShowSummary(false);resetQuestion();}
  function send(value){
    if(submitted!==null||!task||!String(value).trim())return;
    const correct=isBookAnswerCorrect(task,value);
    setAnswer(String(value));setSubmitted(correct);
    setSaved(old=>{
      const before=old[lessonId]||{};
      const answers=before.answers||{};
      const oldItem=answers[task.id]||{};
      return {...old,[lessonId]:{...before,answers:{...answers,
        [task.id]:{correct:correct||Boolean(oldItem.correct),attempts:(oldItem.attempts||0)+1}
      }}};
    });
    onPracticeEvent?.({id:activityItemKey('book-exercise',lessonId,task.id),lesson:lessonId,
      kind:taskKind(task),label:task.answer,correct});
  }
  function next(){
    resetQuestion();
    if(taskIndex<section.tasks.length-1){setTaskIndex(i=>i+1);return;}
    if(sectionIndex<plan.sections.length-1){setSectionIndex(i=>i+1);setTaskIndex(0);return;}
    setShowSummary(true);
  }
  const progress=allTasks.length?Math.round(correctCount/allTasks.length*100):0;
  return <section className="bookLessonRoot" aria-label={'تمرین‌های کتاب درس '+lessonId}>
    <div className="bookLessonTop">
      <div><span className="bookLessonEyebrow">MENSCHEN A1.1 · LEKTION {lessonId} · SEITEN {plan.pages}</span>
        <h3>تمرین‌های اختصاصی درس {lessonId}</h3><p>{plan.focus} · تمرین‌های تألیفی هم‌راستا با سرفصل کتاب</p></div>
      <div className="bookMastery"><b>{correctCount} / {allTasks.length}</b><small>تمرین تسلط‌یافته</small></div>
    </div>
    <div className="bookProgress" role="progressbar" aria-valuenow={correctCount} aria-valuemin={0} aria-valuemax={allTasks.length} aria-label="تسلط تمرین‌های کتاب"><span style={{width:progress+'%'}}/></div>
    <div className="bookLessonTabs" role="group" aria-label="انتخاب فصل تمرینی">
      {plan.sections.map((item,index)=><button key={item.id} type="button"
        className={index===sectionIndex&&!showSummary?'active':''} aria-current={index===sectionIndex&&!showSummary?'step':undefined}
        onClick={()=>chooseSection(index)}>{item.title.replace(/^\d+\.\s*/, '')} <small>{item.tasks.filter(q=>stats[q.id]?.correct).length}/{item.tasks.length}</small></button>)}
      <button type="button" className={showSummary?'active':''} onClick={()=>setShowSummary(true)}>نتیجه</button>
    </div>
    {showSummary?<div className="bookSummary" role="status">
      <CheckCircle2 size={34}/><h4>جمع‌بندی درس {lessonId}</h4>
      <p>تسلط بر {correctCount} تمرین از {allTasks.length} · {progress}٪</p>
      <p>{progress>=80?'آفرین! برای تثبیت، مرور فاصله‌دار و آزمون پایان درس را هم انجام بده.':'تمرین‌های ناتمام را از تب‌های بالا ادامه بده؛ ۸۰٪ هدف اولیه ماست.'}</p>
      <div className="bookActions"><button type="button" onClick={()=>chooseSection(0)}><RotateCcw size={16}/> مرور از ابتدا</button>
        <button type="button" onClick={()=>setTab('exam')}>آزمون پایان درس <ChevronLeft size={16}/></button></div>
    </div>:<>
      <div className="bookSectionInfo">
        <span className="bookLessonEyebrow">STUFE {sectionIndex+1} / {plan.sections.length}</span>
        <h4>{section.title}</h4><p>{section.caption}</p>
      </div>
      <div className="bookPictureGrid">
        {section.cards.map(([emoji,de,fa])=><button className="bookPictureCard" key={de} type="button" onClick={()=>speak(de.includes(' / ')?de.split(' / ')[0]:de)}>
          <span aria-hidden="true">{emoji}</span><b lang="de" dir="ltr">{de}</b><small>{fa}</small><Volume2 size={15} aria-hidden="true"/></button>)}
      </div>
      {section.reading&&<div className="bookReading"><span><BookOpen size={16}/> متن خواندنی اختصاصی</span><p dir="ltr" lang="de">{section.reading}</p><button type="button" onClick={()=>speak(section.reading)}><Volume2 size={17}/> پخش متن</button></div>}
      <div className="bookExercise" key={task.id}>
        <div className="bookExerciseHead"><span>تمرین {taskIndex+1} از {section.tasks.length}</span><small>{task.type==='listen'?'شنیداری و دیکته':task.type==='build'?'جمله‌سازی':task.type==='type'?'نوشتاری':'چهارگزینه‌ای'}</small></div>
        <h5>{task.prompt}</h5>
        {task.type==='listen'&&<button className="bookAudioPrompt" type="button" onClick={()=>speak(task.audio)}><Headphones size={20}/> شنیدن سؤال (صدای آلمانی)</button>}
        {task.type==='choice'&&<div className="bookOptions">{task.choices.map(choice=><button key={choice} type="button" disabled={submitted!==null}
            onClick={()=>send(choice)} className={submitted!==null&&choice===task.answer?'right':submitted!==null&&choice===answer&&!submitted?'wrong':''}>
            <span dir="auto">{choice}</span></button>)}</div>}
        {(task.type==='type'||task.type==='listen')&&<form className="bookAnswerForm" onSubmit={event=>{event.preventDefault();send(answer);}}>
          <input dir="ltr" lang="de" placeholder="پاسخ آلمانی…" value={answer} onChange={event=>setAnswer(event.target.value)}
            disabled={submitted!==null} aria-label="پاسخ آلمانی"/>
          <button type="submit" disabled={submitted!==null||!answer.trim()}>بررسی پاسخ</button>
        </form>}
        {task.type==='build'&&<>
          <div className="bookBuiltAnswer" dir="ltr">{assembled||'کلمات را به ترتیب انتخاب کن…'}</div>
          <div className="bookWordOptions" dir="ltr">{tokens.filter(t=>!chosen.includes(t.id)).map(t=><button type="button" key={t.id} disabled={submitted!==null}
            onClick={()=>setChosen(ids=>[...ids,t.id])}>{t.word}</button>)}</div>
          {submitted===null&&<div className="bookActions"><button type="button" className="bookSubtleButton" onClick={()=>setChosen([])}>پاک‌کردن چیدمان</button>
            <button type="button" disabled={!chosen.length} onClick={()=>send(assembled)}>بررسی جمله</button></div>}
        </>}
        {submitted===null&&task.hint&&<p className="bookHint">راهنما: {task.hint}</p>}
        {submitted!==null&&<div className={'bookFeedback '+(submitted?'bookCorrect':'bookWrong')} role="status">
          <span>{submitted?<CheckCircle2 size={18}/>:<XCircle size={18}/>} {submitted?'آفرین! پاسخ درست است.':'این پاسخ درست نبود.'}</span>
          <b dir="auto">{task.answer}</b>{task.why&&<small>{task.why}</small>}
          <div className="bookActions"><button type="button" onClick={()=>speak(task.audio||task.answer)}><Volume2 size={16}/> تلفظ پاسخ</button>
            <button type="button" onClick={next}>سؤال بعدی <ArrowLeft size={16}/></button></div>
        </div>}
      </div>
      {lessonId===2&&section.id==='numbers'&&<NewNumberChallenge speak={speak} onPracticeEvent={onPracticeEvent}/>}
    </>}
    <div className="bookLessonFooter">
      <span><Mic2 size={16}/> صدا را بشنو و با صدای بلند تکرار کن.</span>
      <button type="button" onClick={()=>setTab('speaking')}>تمرین تلفظ با میکروفون <ChevronLeft size={16}/></button>
    </div>
    <p className="bookCopyright">این مجموعه مکمل مستقل کتاب است؛ تصاویر، متن تمرین‌ها و فایل صوتی ناشر بازنشر نشده‌اند. {completedCount} تمرین حداقل یک بار انجام شده است.</p>
  </section>;
}
