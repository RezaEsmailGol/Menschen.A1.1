import React,{useEffect,useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpenCheck,CheckCircle2,Clock3,Headphones,Hash,Keyboard,RotateCcw,Shuffle,Target,Volume2,XCircle} from 'lucide-react';
import RouteLink from './RouteLink.jsx';
import {germanNumber} from './learningData.js';
import {
 NUMBER_LEVELS,CLOCK_LEVELS,drillKey,loadIntensiveProgress,
 saveIntensiveProgress,recordIntensiveAnswer,weakDrillItems,makeIntensiveRound,
 clockAnswer,checkIntensiveAnswer
} from './intensivePracticeEngine.js';
import './intensivePractice.css';

const fa=n=>Number(n||0).toLocaleString('fa-IR');
const methods=[
 {id:'write',label:'نوشتن از روی عدد',Icon:Keyboard},
 {id:'listen',label:'دیکته شنیداری',Icon:Headphones},
 {id:'reverse',label:'آلمانی به عدد',Icon:Hash},
 {id:'flash',label:'فلش‌کارت سخت',Icon:BookOpenCheck}
];
export default function IntensivePractice({kind='number',speak=()=>{},onPracticeEvent,setTab}){
 const clock=kind==='clock';
 const stages=clock?CLOCK_LEVELS:NUMBER_LEVELS;
 const [level,setLevel]=useState(clock?'book':'tens');
 const [clockStyle,setClockStyle]=useState('formal');
 const [method,setMethod]=useState('write');
 const [records,setRecords]=useState(()=>loadIntensiveProgress(typeof window==='undefined'?null:window.localStorage));
 const [onlyWeak,setOnlyWeak]=useState(false);
 const [queue,setQueue]=useState([]);
 const [position,setPosition]=useState(0);
 const [answer,setAnswer]=useState(null);
 const [typed,setTyped]=useState('');
 const [flipped,setFlipped]=useState(false);
 const [running,setRunning]=useState(false);
 const [firstCorrect,setFirstCorrect]=useState(0);
 const [initialLength,setInitialLength]=useState(0);
 const [wrongTotal,setWrongTotal]=useState(0);
 const item=queue[position];
 const complete=running&&position>=queue.length;
 const weak=useMemo(()=>weakDrillItems(kind,level,records,clockStyle),[kind,level,records,clockStyle]);
 const word=item?(clock?clockAnswer(item.value,clockStyle):germanNumber(item.value)):'';
 const freshTarget=Math.max(1,initialLength);
 const accuracy=Math.round(100*firstCorrect/freshTarget);
 useEffect(()=>{if(typeof window!=='undefined')saveIntensiveProgress(window.localStorage,records)},[records]);

 function changeLevel(id){
  setLevel(id);setOnlyWeak(false);setRunning(false);
  setQueue([]);setPosition(0);setAnswer(null);setTyped('');setFlipped(false);
 }
 function changeMethod(id){setMethod(id);setRunning(false);setAnswer(null);setTyped('');setFlipped(false)}
 function changeClockStyle(style){setClockStyle(style);setRunning(false);setAnswer(null);setTyped('');setFlipped(false)}
 function start(weakOnly=onlyWeak){
  const next=makeIntensiveRound(kind,level,records,clockStyle,weakOnly,16);
  setOnlyWeak(weakOnly);setQueue(next);setPosition(0);setInitialLength(next.length);
  setRunning(true);setAnswer(null);setTyped('');setFlipped(false);setFirstCorrect(0);setWrongTotal(0);
 }
 function mark(correct){
  if(!item||answer!==null)return;
  const key=drillKey(kind,item.value,clockStyle);
  setRecords(previous=>recordIntensiveAnswer(previous,key,correct));
  if(correct){
   if(!item.retry)setFirstCorrect(n=>n+1);
  }else{
   setWrongTotal(n=>n+1);
   setQueue(previous=>[...previous,{...item,retry:true}]);
  }
  setAnswer({correct});
  onPracticeEvent?.({
   id:'intensive:'+key,kind:clock?'dictation':'number',label:String(item.value),
   lesson:clock?8:1,correct
  });
  if(typeof navigator!=='undefined'&&navigator.vibrate){
   try{navigator.vibrate(correct?25:[25,50,25])}catch{}
  }
 }
 function submit(e){e.preventDefault();if(typed.trim()&&answer===null)mark(checkIntensiveAnswer({kind,value:item.value,clockStyle,method,input:typed}))}
 function next(){
  if(answer===null)return;
  setPosition(n=>n+1);setAnswer(null);setTyped('');setFlipped(false);
 }
 const displayValue=item?(clock?item.value:fa(item.value)):'';
 const finishedWeak=onlyWeak&&initialLength===0;
 return <div className="ipPage" dir="rtl">
  <header className="ipHeader">
   <div><span className="ipEyebrow">INTENSIVE TRAINING · A1.1</span>
    <h1>{clock?'باشگاه سخت‌گیرانه ساعت':'باشگاه سخت‌گیرانه اعداد'}</h1>
    <p>{clock?'ساعت رسمی، محاوره‌ای، نیم و ربع؛ شنیدن و نوشتن با دقت یک دقیقه.':'از ده، بیست و چهل تا دویست و سیصد؛ نوشتن آلمانی، شنیدن و فلش‌کارت.'}</p></div>
   <RouteLink to="practice" navigate={setTab} className="ipReturn"><ArrowRight size={16}/> همه تمرین‌ها</RouteLink>
  </header>
  <nav className="ipSwitch" aria-label="انتخاب درس فشرده">
   <RouteLink to="numberMastery" navigate={setTab} className={!clock?'selected':''}><Hash size={18}/> اعداد</RouteLink>
   <RouteLink to="clockMastery" navigate={setTab} className={clock?'selected':''}><Clock3 size={18}/> ساعت</RouteLink>
   <RouteLink to="numbers" navigate={setTab}><Shuffle size={18}/> بازی قبلی اعداد</RouteLink>
  </nav>
  <section className="ipSetup" aria-label="تنظیم تمرین">
   <div className="ipLabel"><strong>۱ · سطح و بازه تمرین</strong><small>برای دیدن بقیه گزینه‌ها به طرفین بکش</small></div>
   <div className="ipScroll" role="group" aria-label="سطح اعداد یا ساعت">
    {stages.map(stage=><button key={stage.id} type="button" disabled={running&&!complete}
     aria-pressed={level===stage.id} className={level===stage.id?'chosen':''} onClick={()=>changeLevel(stage.id)}>
     <b>{stage.label}</b><small>{stage.hint}</small>
    </button>)}
   </div>
   {clock&&<><div className="ipLabel"><strong>۲ · نوع بیان ساعت</strong></div>
    <div className="ipToggle" role="group" aria-label="نوع بیان ساعت">
     <button type="button" aria-pressed={clockStyle==='formal'} disabled={running&&!complete}
      className={clockStyle==='formal'?'chosen':''} onClick={()=>changeClockStyle('formal')}>رسمی · 14:30 = vierzehn Uhr dreißig</button>
     <button type="button" aria-pressed={clockStyle==='colloquial'} disabled={running&&!complete}
      className={clockStyle==='colloquial'?'chosen':''} onClick={()=>changeClockStyle('colloquial')}>محاوره‌ای · 14:30 = halb drei</button>
    </div></>}
   <div className="ipLabel"><strong>{clock?'۳':'۲'} · روش یادگیری</strong></div>
   <div className="ipScroll ipMethods" role="group" aria-label="روش تمرین">
    {methods.filter(m=>!clock||m.id!=='reverse').map(({id,label,Icon})=><button type="button" key={id}
      aria-pressed={method===id} disabled={running&&!complete} className={method===id?'chosen':''} onClick={()=>changeMethod(id)}>
      <Icon size={17}/>{label}</button>)}
   </div>
   <div className="ipStartRow">
    <button type="button" className="ipPrimary" onClick={()=>start(false)} disabled={running&&!complete}>
      <Target size={18}/> {running?'شروع دور جدید':'شروع آزمون تا ۱۶ سؤال'} <ArrowLeft size={16}/>
    </button>
    <button type="button" className="ipWeak" disabled={!weak.length||running&&!complete} onClick={()=>start(true)}>
     <RotateCcw size={17}/> مرور ضعف‌ها ({fa(weak.length)})
    </button>
   </div>
   <p className="ipRule">قانون سخت‌گیرانه: هر اشتباه در همین دور دوباره تکرار می‌شود؛ پس از یک پاسخ درست، از فهرست ضعف خارج خواهد شد. معیار قبولی نوبت اول حداقل ۹۰٪ است.</p>
  </section>
  {running&&<section className="ipExam" aria-live="polite" aria-label="سؤال جاری">
   {complete?<div className="ipFinish">
     <CheckCircle2 size={38}/>
     <h2>{finishedWeak?'ضعفی برای مرور باقی نمانده است.':accuracy>=90?'قبول شدی!':'این دور هنوز نیاز به تمرین دارد.'}</h2>
     <strong>{fa(firstCorrect)} / {fa(initialLength)} · {fa(initialLength?accuracy:100)}٪ نوبت اول</strong>
     <p>اشتباه‌های این دور: {fa(wrongTotal)} · ضعف‌های باقی‌مانده این سطح: {fa(weak.length)}</p>
     <button type="button" onClick={()=>start(false)} className="ipPrimary">یک دور سخت دیگر</button>
     {weak.length>0&&<button type="button" className="ipWeak" onClick={()=>start(true)}>تمرین اشتباه‌های باقی‌مانده</button>}
    </div>:
    <div className="ipQuestion">
     <div className="ipCounter"><span>سؤال {fa(position+1)} از {fa(queue.length)} {item?.retry?'· دور اصلاح اشتباه':''}</span>
      <b>{fa(firstCorrect)} پاسخ درست نوبت اول</b></div>
     <div className="ipProgress"><span style={{width:(position/Math.max(1,queue.length)*100)+'%'}}/></div>
     <p className="ipPrompt">{method==='flash'?'کارت را از حفظ جواب بده، سپس پشت آن را ببین':method==='listen'?'گوش بده و نوشتار آلمانی را وارد کن':method==='reverse'?'عدد آلمانی را بخوان و رقم بنویس':'این عدد / ساعت را دقیق به آلمانی بنویس'}</p>
     {method==='listen'?<div className="ipListen"><Headphones size={44}/><button type="button" onClick={()=>speak(word)}><Volume2 size={20}/> شنیدن دوباره</button></div>:
      <div className="ipPromptValue" dir="ltr" lang={method==='reverse'?'de':undefined}>
       {method==='reverse'?word:displayValue}</div>}
     {method==='flash'?<>
      {!flipped?<button type="button" className="ipFlip" onClick={()=>setFlipped(true)}>نمایش پاسخ پشت فلش‌کارت</button>:
      <div className="ipReveal"><strong lang="de" dir="ltr">{word}</strong><button type="button" onClick={()=>speak(word)}><Volume2 size={18}/> تلفظ</button></div>}
      {flipped&&answer===null&&<div className="ipFlashActions">
       <button type="button" onClick={()=>mark(false)}><XCircle size={18}/> بلد نبودم</button>
       <button type="button" onClick={()=>mark(true)}><CheckCircle2 size={18}/> از حفظ بلد بودم</button>
      </div>}
     </>:<form className="ipAnswer" onSubmit={submit}>
      <label htmlFor="ip-entry">{method==='reverse'?'پاسخ عددی':'پاسخ آلمانی بدون نگاه کردن به راهنما'}</label>
      <input key={kind+'-'+method+'-'+position} id="ip-entry" value={typed} autoComplete="off" autoCapitalize="off"
       spellCheck={false} dir="ltr" lang={method==='reverse'?undefined:'de'}
       placeholder={method==='reverse'?'z. B. 240':'z. B. zweihundertvierzig'}
       inputMode={method==='reverse'?'numeric':'text'} disabled={answer!==null}
       onChange={event=>setTyped(event.target.value)}/>
      {method!=='reverse'&&<div className="ipKeys">{['ä','ö','ü','ß'].map(c=><button type="button" key={c}
       disabled={answer!==null} onClick={()=>setTyped(t=>t+c)}>{c}</button>)}</div>}
      <button className="ipPrimary" type="submit" disabled={answer!==null||!typed.trim()}>بررسی دقیق املای پاسخ</button>
     </form>}
     {answer!==null&&<div className={'ipResult '+(answer.correct?'right':'wrong')} role="status">
      {answer.correct?<CheckCircle2 size={23}/>:<XCircle size={23}/>}
      <span><b>{answer.correct?'درست بود!':'اشتباه شد؛ همین سؤال در پایان دور تکرار می‌شود.'}</b>
       <strong lang="de" dir="ltr">{word}</strong></span>
      <button type="button" onClick={()=>speak(word)} aria-label="شنیدن پاسخ صحیح"><Volume2 size={19}/></button>
     </div>}
     {answer!==null&&<button type="button" className="ipNext" onClick={next}>{position===queue.length-1?'دیدن نتیجه':'سؤال بعدی'} <ArrowLeft size={18}/></button>}
    </div>}
  </section>}
  {!running&&<section className="ipHelp">
   <h2>{clock?'قانون طلایی ساعت':'قانون طلایی اعداد'}</h2>
   {clock?<p>در ساعت رسمی: <b lang="de">vierzehn Uhr dreißig</b> یعنی ۱۴:۳۰. در محاوره: <b lang="de">halb drei</b> یعنی نیم ساعت مانده به سه؛ نه نیم ساعت بعد از دو. برای دقیقه‌های غیرگرد، شکل دقیق «Uhr» را هم تمرین می‌کنی.</p>:
    <p><b lang="de">vierzig</b> = ۴۰، <b lang="de">zweihundert</b> = ۲۰۰ و <b lang="de">dreihundert</b> = ۳۰۰. در ۴۲ اول یکان می‌آید: <b lang="de">zweiundvierzig</b>. حرف‌های ß و ü در دیکته ضروری‌اند.</p>}
  </section>}
 </div>;
}
