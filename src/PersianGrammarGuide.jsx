import React,{useEffect,useMemo,useState} from 'react';
import {BookOpenCheck,CheckCircle2,ChevronLeft,ChevronRight,Lightbulb,RotateCcw,Volume2} from 'lucide-react';
import {grammarGuideForLesson} from './persianGrammarGuides.js';
import './PersianGrammarGuide.css';

const STORAGE_KEY='dt_persian_grammar_v1';
function loadResults(){
  try{
    const data=JSON.parse(window.localStorage.getItem(STORAGE_KEY)||'{}');
    return data && typeof data==='object' && !Array.isArray(data) ? data:{};
  } catch {return {};}
}
function Example({line,speak}){
  const [de,fa]=line;
  return <div className="pgExample">
    <div className="pgExampleWords"><b dir="ltr" lang="de">{de}</b><span>{fa}</span></div>
    <button type="button" className="pgSpeak" aria-label={'پخش تلفظ '+de} onClick={()=>speak?.(de)}><Volume2 size={18}/></button>
  </div>;
}
export default function PersianGrammarGuide({lessonId,speak,onPracticeEvent}){
  const guide=grammarGuideForLesson(lessonId);
  const [active,setActive]=useState(0);
  const [results,setResults]=useState(loadResults);
  useEffect(()=>setActive(0),[lessonId]);
  const rules=guide?.rules??[];
  const complete=useMemo(()=>rules.filter(rule=>results[lessonId+':'+rule.id]?.correct).length,[rules,results,lessonId]);
  if(!guide)return null;
  const index=Math.max(0,Math.min(active,rules.length-1));
  const current=rules[index];
  const key=lessonId+':'+current.id;
  const last=results[key];
  const isCorrect=Boolean(last?.correct);

  function choose(value){
    if(isCorrect)return;
    const correct=value===current.check.answer;
    setResults(previous=>{
      const next={...previous,[key]:{selected:value,correct,updatedAt:new Date().toISOString()}};
      try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(next));}catch{}
      return next;
    });
    onPracticeEvent?.({
      id:'grammar-guide:'+key,kind:'grammar',lesson:lessonId,
      label:current.check.question,correct
    });
  }
  return <section id="lesson-grammar" className="courseContentBlock pgRoot" aria-label={'آموزش فارسی گرامر درس '+lessonId}>
    <div className="courseTitle"><div><small>PERSIAN GRAMMAR GUIDE</small><h3>دستور زبان درس {lessonId} — آموزش فارسی</h3></div><span>{complete} از {rules.length} نکته یادگرفته‌شده</span></div>
    <p className="pgSummary">{guide.summary}</p>
    <div className="pgProgress" role="progressbar" aria-label="پیشرفت گرامر این درس" aria-valuemin={0} aria-valuemax={rules.length} aria-valuenow={complete}>
      <span style={{width:(complete/rules.length*100)+'%'}}/>
    </div>
    <div className="pgTopics" role="group" aria-label="انتخاب موضوع دستور زبان">
      {rules.map((rule,position)=><button type="button" key={rule.id}
        className={'pgTopic'+(index===position?' pgTopicActive':'')}
        aria-pressed={index===position}
        onClick={()=>setActive(position)}>
        <span className="pgTopicNum">{position+1}</span>
        <span className="pgTopicLabel">{rule.title}</span>
        {results[lessonId+':'+rule.id]?.correct&&<CheckCircle2 size={17} className="pgDoneIcon"/>}
      </button>)}
    </div>
    <article className="pgLesson" key={current.id}>
      <div className="pgHeader"><span>قاعده {index+1} از {rules.length}</span><h4>{current.title}</h4></div>
      <p className="pgExplanation">{current.explanation}</p>
      <div className="pgPattern"><div><Lightbulb size={18}/> الگوی یادگیری</div><b lang="de" dir="ltr">{current.pattern}</b></div>
      {current.table&&<div className="pgTableScroll" tabIndex={0} role="region" aria-label={'جدول '+current.title}>
        <table className="pgTable">
          <thead><tr>{current.table[0].map((name,i)=><th key={i}>{name}</th>)}</tr></thead>
          <tbody>{current.table.slice(1).map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j} dir={j===0?'rtl':'ltr'} lang={j===0?undefined:'de'}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>}
      <div className="pgExamplesHead"><BookOpenCheck size={18}/><h5>مثال با معنی فارسی و تلفظ</h5></div>
      <div className="pgExamples">{current.examples.map((line,i)=><Example key={i} line={line} speak={speak}/>)}</div>
      {current.warning&&<p className="pgWarning"><Lightbulb size={17}/>{current.warning}</p>}
      <div className="pgQuiz">
        <div className="pgQuizTitle"><span>تمرین کوتاه</span><span>فقط یک پاسخ صحیح</span></div>
        <h5>{current.check.question}</h5>
        <div className="pgChoices">
          {current.check.options.map(option=>{
            const selected=last?.selected===option;
            const className='pgChoice'+(isCorrect&&option===current.check.answer?' pgChoiceCorrect':'')+(selected&&!isCorrect?' pgChoiceWrong':'');
            return <button type="button" key={option} className={className} disabled={isCorrect}
              aria-pressed={selected} onClick={()=>choose(option)}>
              <span dir="auto">{option}</span>
              {isCorrect&&option===current.check.answer&&<CheckCircle2 size={18}/>}
            </button>;
          })}
        </div>
        {last&&<p role="status" className={'pgFeedback '+(isCorrect?'pgFeedbackCorrect':'pgFeedbackWrong')}>
          <strong>{isCorrect?'آفرین، درست گفتی!':'این گزینه درست نیست؛ دوباره تلاش کن.'}</strong>
          {isCorrect&&<span>{current.check.why}</span>}
        </p>}
      </div>
      <div className="pgControls">
        <button type="button" disabled={index===0} onClick={()=>setActive(i=>Math.max(i-1,0))}><ChevronRight size={17}/> نکته قبلی</button>
        <span>{index+1} / {rules.length}</span>
        {index<rules.length-1
          ?<button type="button" onClick={()=>setActive(i=>Math.min(i+1,rules.length-1))}>نکته بعدی <ChevronLeft size={17}/></button>
          :<button type="button" onClick={()=>setActive(0)}><RotateCcw size={17}/> مرور از ابتدا</button>}
      </div>
    </article>
    <p className="pgFootnote">پیشرفت گرامر روی همین مرورگر ذخیره می‌شود. هر مثال را می‌توانی با دکمه بلندگو گوش بدهی و تکرار کنی.</p>
  </section>;
}
