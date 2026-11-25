import React,{useEffect,useState} from 'react';
import {ArrowLeft,BookOpenCheck,CheckCircle2,ChevronLeft,ChevronRight,Headphones,RotateCcw,Users,Volume2} from 'lucide-react';
import {ACTION_KEY,actionStations,actionsForLesson,actionKinds,actionTrack,actionBingoWon,actionNormalize} from './actionPagesData.js';
import './actionPagesStudio.css';
import {lessonFromSearch,replaceLessonQuery,writeLessonFocus} from './lessonFocus.js';
const number=n=>Number(n).toLocaleString('fa-IR');
function load(){try{return JSON.parse(localStorage.getItem(ACTION_KEY)||'{}')||{}}catch{return {}}}
export default function ActionPagesStudio({speak=()=>{},onPracticeEvent}){
 const params=new URLSearchParams(location.search);
 const [lesson,setLesson]=useState(()=>Number(params.get('page'))?0:lessonFromSearch(window.location.search,window.localStorage,8));
 const [activeId,setActiveId]=useState('action-'+(Number(params.get('page'))||73));
 const [expanded,setExpanded]=useState(false);
 const [progress,setProgress]=useState(load);
 const [step,setStep]=useState(0);
 const [revealed,setRevealed]=useState(false);
 const [answer,setAnswer]=useState(null);
 const [hits,setHits]=useState(0);
 const [hard,setHard]=useState(0);
 const [tokens,setTokens]=useState([]);
 const [cells,setCells]=useState(Array(25).fill(false));
 const [draft,setDraft]=useState('');
 const list=lesson?actionsForLesson(lesson):actionStations;
 const active=list.find(e=>e.id===activeId)||list[0];
 const index=list.findIndex(e=>e.id===active?.id);
 const completed=actionStations.filter(e=>progress[e.id]?.completed).length;
 useEffect(()=>{try{localStorage.setItem(ACTION_KEY,JSON.stringify(progress))}catch{}},[progress]);
 useEffect(()=>{if(lesson)writeLessonFocus(window.localStorage,lesson,true)},[lesson]);
 function reset(item){if(!item)return;setActiveId(item.id);setStep(0);setRevealed(false);setAnswer(null);setHits(0);setHard(0);setTokens([]);setCells(Array(25).fill(false));setDraft(progress[item.id]?.draft||'')}
 function changeLesson(id){if(id)writeLessonFocus(window.localStorage,id,true);replaceLessonQuery(id,window.location,window.history);setLesson(id);setExpanded(false);reset((id?actionsForLesson(id):actionStations)[0])}
 function record(item,fields){setProgress(old=>actionTrack(old,item.id,fields))}
 function end(item,fields,graded=false){record(item,{completed:true,...fields});if(graded)onPracticeEvent?.({id:item.id,lesson:item.lesson,kind:'grammar',label:item.title,correct:fields.score===100})}
 function nextTalk(isHard){const count=hard+Number(isHard);setHard(count);if(step+1>=active.turns.length){end(active,{hard:count});setStep(x=>x+1)}else{setStep(x=>x+1);setRevealed(false)}}
 function chooseBoolean(value){if(answer!==null)return;const correct=value===active.items[step].correct;const score=hits+Number(correct);setAnswer({correct});setHits(score);if(step+1>=active.items.length)end(active,{score:Math.round(100*score/active.items.length)},true)}
 function selectToken(i){if(answer!==null)return;setTokens(prev=>prev.includes(i)?prev.filter(v=>v!==i):[...prev,i])}
 function gradeOrder(){if(!tokens.length||answer!==null)return;const expected=active.items[step].answer;const actual=tokens.map(i=>active.items[step].words[i]).join(' ');const correct=actionNormalize(actual)===actionNormalize(expected);const score=hits+Number(correct);setAnswer({correct});setHits(score);if(step+1>=active.items.length)end(active,{score:Math.round(100*score/active.items.length)},true)}
 function nextQuestion(){setStep(x=>x+1);setAnswer(null);setTokens([])}
 function markCell(i){const next=[...cells];next[i]=!next[i];setCells(next);if(actionBingoWon(next)&&!actionBingoWon(cells))end(active,{bingo:true})}
 function saveText(){if(!draft.trim())return;end(active,{draft,assessed:false});setRevealed(true)}
 return <main className="apPage" dir="rtl">
  <header className="apHero">
   <div><span>KURSBUCH · AKTIONSSEITEN</span><h1>بازی‌های دوره‌ای کتاب</h1>
    <p>تمرین‌های صفحات چاپی ۷۳ تا ۹۶: مکالمه، بینگو، ترتیب جمله، درک مطلب و نوشتن.</p>
    <small>بازطراحی تعاملی با ارجاع به صفحه اصلی؛ عکس‌ها و جدول‌های چاپی باید در کتاب دیده شوند.</small></div>
   <b>{number(completed)} / ۲۴ <small>انجام‌شده</small></b>
  </header>
  <div className="apSelect"><label htmlFor="ap-lesson">نمایش</label><select id="ap-lesson" value={lesson} onChange={e=>changeLesson(Number(e.target.value))}>
   <option value={0}>همه ۲۴ صفحه</option>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>درس {number(i+1)}</option>)}
  </select></div>
  <nav className="apItems" aria-label="صفحات تمرین">
   {(expanded?list:list.slice(0,8)).map(item=><button type="button" key={item.id} className={active?.id===item.id?'chosen':''} onClick={()=>reset(item)}>
    <b>{number(item.page)}</b><span><strong>{item.title}</strong><small>درس {number(item.lesson)} · {actionKinds[item.kind]}</small></span>
    {progress[item.id]?.completed?<CheckCircle2 size={17}/>:<ChevronLeft size={17}/>}
   </button>)}
  </nav>
  {list.length>8&&<button type="button" className="apExpand" aria-expanded={expanded} onClick={()=>setExpanded(v=>!v)}>{expanded?'نمایش فقط ۸ صفحه':'نمایش '+number(list.length-8)+' صفحه دیگر'}</button>}
  {active&&<section className="apStage" key={active.id}>
   <div className="apStageTop"><div><small>KURSBUCH · SEITE {active.page}</small><h2>{active.title}</h2></div><span>{actionKinds[active.kind]}</span></div>
   <p>{active.topic}</p>
   {active.sourceNote&&<div className="apHint"><BookOpenCheck size={17}/>{active.sourceNote}</div>}
   {active.kind==='dialogue'&&(step>=active.turns.length?<div className="apComplete" role="status"><CheckCircle2 size={29}/> مکالمه کامل شد.<small>ثبت خوداظهاری، نه سنجش واقعی تلفظ.</small><button onClick={()=>reset(active)}>تکرار</button></div>:
   <div className="apDialogue">
    <small>نوبت {number(step+1)} از {number(active.turns.length)} · نقش A و B</small>
    <div className="apSpeech"><b>نفر A بپرسد</b><strong dir="ltr" lang="de">{active.turns[step].ask}</strong><small>{active.turns[step].fa}</small><button onClick={()=>speak(active.turns[step].ask)}><Volume2 size={17}/> شنیدن</button></div>
    <div className="apResponse"><b>نفر B پاسخ بدهد</b>{revealed?<><strong dir="ltr" lang="de">{active.turns[step].reply}</strong><small>{active.turns[step].replyFa}</small><button onClick={()=>speak(active.turns[step].reply)}><Headphones size={17}/> شنیدن پاسخ</button></>:<button onClick={()=>setRevealed(true)}>نمایش پاسخ نمونه</button>}</div>
    <div className="apDuoBtns"><button onClick={()=>nextTalk(true)}>سخت بود</button><button onClick={()=>nextTalk(false)}>انجام شد، بعدی <ArrowLeft size={17}/></button></div>
   </div>)}
   {active.kind==='quiz'&&<div className="apQuiz">
    <small>سؤال {number(step+1)} از {number(active.items.length)}</small>
    <strong lang="de" dir="ltr">{active.items[step].text}</strong>
    <div className="apAnswers"><button disabled={answer!==null} onClick={()=>chooseBoolean(true)}>Richtig · درست</button><button disabled={answer!==null} onClick={()=>chooseBoolean(false)}>Falsch · نادرست</button></div>
    {answer!==null&&<div className={'apFeedback '+(answer.correct?'correct':'wrong')} role="status"><b>{answer.correct?'آفرین!':'جواب اشتباه بود.'}</b>{active.items[step].note}</div>}
    {answer!==null&&(step+1<active.items.length?<button className="apPrimary" onClick={nextQuestion}>سؤال بعدی <ArrowLeft size={17}/></button>:<div className="apComplete">{number(hits)} از {number(active.items.length)} درست<button onClick={()=>reset(active)}>تکرار</button></div>)}
   </div>}
   {active.kind==='order'&&<div className="apOrder">
    <small>جمله {number(step+1)} از {number(active.items.length)}</small><p>{active.items[step].fa}</p>
    <div className="apBuilt" lang="de" dir="ltr">{tokens.length?tokens.map(i=><button key={i} onClick={()=>selectToken(i)} disabled={answer!==null}>{active.items[step].words[i]}</button>):'کلمه‌ها را به ترتیب انتخاب کن'}</div>
    <div className="apTokens" dir="ltr" lang="de">{active.items[step].words.map((t,i)=><button key={i} disabled={tokens.includes(i)||answer!==null} onClick={()=>selectToken(i)}>{t}</button>)}</div>
    <button className="apPrimary" disabled={!tokens.length||answer!==null} onClick={gradeOrder}>بررسی</button>
    {answer!==null&&<div className={'apFeedback '+(answer.correct?'correct':'wrong')}><b>{answer.correct?'درست است!':'ترتیب درست:'}</b><strong dir="ltr" lang="de">{active.items[step].answer}</strong><button onClick={()=>speak(active.items[step].answer)}><Volume2 size={16}/> تلفظ</button></div>}
    {answer!==null&&(step+1<active.items.length?<button className="apPrimary" onClick={nextQuestion}>بعدی <ArrowLeft size={17}/></button>:<div className="apComplete">{number(hits)} از {number(active.items.length)} صحیح<button onClick={()=>reset(active)}>تکرار</button></div>)}
   </div>}
   {active.kind==='bingo'&&<div className="apBingo"><p>از همراهت بپرس: <b dir="ltr" lang="de">{active.starter}</b>؛ برای هر پاسخ خانه مربوط را لمس کن.</p>
    <div className="apBingoGrid">{active.items.map((s,i)=><button key={i} type="button" aria-pressed={cells[i]} className={cells[i]?'marked':''} onClick={()=>markCell(i)}>{s}</button>)}</div>
    {actionBingoWon(cells)&&<div className="apFeedback correct" role="status">BINGO! پنج خانه پشت سر هم کامل شدند.</div>}
    <button className="apReplay" onClick={()=>setCells(Array(25).fill(false))}><RotateCcw size={16}/> دوباره بازی کن</button>
   </div>}
   {active.kind==='writing'&&<div className="apWriting"><p>{active.guide}</p>
    <textarea lang="de" dir="ltr" aria-label="پاسخ نوشتاری" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Schreibe auf Deutsch ..."/>
    <button className="apPrimary" disabled={!draft.trim()} onClick={saveText}>ذخیره نوشته</button>
    {revealed&&<div className="apFeedback correct" role="status"><b>متن ذخیره شد، بدون نمره‌گذاری خودکار.</b><small>نمونه تألیفی:</small><strong dir="ltr" lang="de">{active.sample}</strong></div>}
   </div>}
   <nav className="apPaging" aria-label="صفحه قبلی و بعدی"><button disabled={index===0} onClick={()=>reset(list[index-1])}><ChevronRight size={17}/> صفحه قبل</button><button disabled={index===list.length-1} onClick={()=>reset(list[index+1])}>صفحه بعد <ChevronLeft size={17}/></button></nav>
  </section>}
  <nav className="apRelated"><a href="/essential-words"><BookOpenCheck size={17}/> واژگان مهم</a><a href="/partner-practice"><Users size={17}/> مکالمه دونفره</a><a href="/practice"><ArrowLeft size={17}/> همه تمرین‌ها</a></nav>
 </main>;
}
