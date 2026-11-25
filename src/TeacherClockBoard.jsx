import React,{useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,BookOpenCheck,CalendarDays,CheckCircle2,ChevronLeft,Clock3,Headphones,Keyboard,Play,RotateCcw,Target,Volume2,XCircle} from 'lucide-react';
import RouteLink from './RouteLink.jsx';
import {
 TEACHER_CLOCK_TIMES,TEACHER_WEEKDAYS,TEACHER_DAY_PARTS,TEACHER_VERBS,BOARD_TOPICS,
 boardQuestionBank,boardWeakQuestions,boardRound,boardRecord,isBoardAnswerCorrect,
 loadBoardRecords,saveBoardRecords,analogClockHands
} from './teacherClockBoardData.js';
import './teacherClockBoard.css';

const fa=value=>Number(value||0).toLocaleString('fa-IR');
function AnalogTeacherClock({time}){
 const hands=analogClockHands(time);
 const markers=Array.from({length:12},(_,i)=>{
  const rad=i*Math.PI/6;
  const circle=(r)=>({x:120+Math.sin(rad)*r,y:120-Math.cos(rad)*r});
  return {start:circle(89),end:circle(i%3===0?103:98),colour:i===0?'#787da3':i<=4?'#d58c74':i>=8?'#22a38f':i===5?'#22a38f':'#c98b70'};
 });
 return <svg className="tbClockDrawing" viewBox="0 0 240 240" role="img" aria-label={'ساعت عقربه‌ای '+time}>
  <circle cx="120" cy="120" r="111" fill="#fff" stroke="#e1e6f1" strokeWidth="5"/>
  <circle cx="120" cy="120" r="106" fill="none" stroke="#f2d4c7" strokeWidth="5" strokeDasharray="160 506"
   transform="rotate(-75 120 120)" />
  <circle cx="120" cy="120" r="106" fill="none" stroke="#c1e7df" strokeWidth="5" strokeDasharray="160 506"
   transform="rotate(100 120 120)" />
  {markers.map((m,i)=><line key={i} x1={m.start.x} y1={m.start.y} x2={m.end.x} y2={m.end.y}
   stroke={m.colour} strokeWidth={i%3===0?3.5:2} strokeLinecap="round"/>)}
  <text x="120" y="44" textAnchor="middle" className="tbDialNumber">12</text>
  <text x="194" y="125" textAnchor="middle" className="tbDialNumber">3</text>
  <text x="120" y="201" textAnchor="middle" className="tbDialNumber">6</text>
  <text x="46" y="125" textAnchor="middle" className="tbDialNumber">9</text>
  <line x1="120" y1="120" x2={hands.hour.x} y2={hands.hour.y} stroke="#393969" strokeWidth="7" strokeLinecap="round"/>
  <line x1="120" y1="120" x2={hands.minute.x} y2={hands.minute.y} stroke="#109f89" strokeWidth="4" strokeLinecap="round"/>
  <circle cx="120" cy="120" r="6.5" fill="#393969"/>
  <text x="173" y="72" textAnchor="middle" className="tbDialAfter">nach</text>
  <text x="63" y="74" textAnchor="middle" className="tbDialBefore">vor</text>
 </svg>;
}

export default function TeacherClockBoard({speak=()=>{},onPracticeEvent,setTab}){
 const [topic,setTopic]=useState('clock');
 const [style,setStyle]=useState('both');
 const [sample,setSample]=useState('16:25');
 const [method,setMethod]=useState('write');
 const [records,setRecords]=useState(()=>loadBoardRecords(typeof window==='undefined'?null:window.localStorage));
 const [running,setRunning]=useState(false);
 const [queue,setQueue]=useState([]);
 const [initialTotal,setInitialTotal]=useState(0);
 const [position,setPosition]=useState(0);
 const [typed,setTyped]=useState('');
 const [status,setStatus]=useState(null);
 const [flipped,setFlipped]=useState(false);
 const [firstCorrect,setFirstCorrect]=useState(0);
 const [mistakes,setMistakes]=useState(0);
 const row=TEACHER_CLOCK_TIMES.find(x=>x.time===sample)||TEACHER_CLOCK_TIMES[0];
 const weak=useMemo(()=>boardWeakQuestions(topic,style,records),[topic,style,records]);
 const current=queue[position];
 const done=running&&position>=queue.length;
 const successPct=initialTotal?Math.round(100*firstCorrect/initialTotal):0;

 function resetTopic(next){
  setTopic(next);setRunning(false);setQueue([]);setStatus(null);setTyped('');setFlipped(false);
  if(next!=='clock'&&method==='listen')setMethod('write');
 }
 function resetStyle(next){setStyle(next);setRunning(false);setStatus(null);setTyped('');}
 function changeMethod(next){setMethod(next);setRunning(false);setStatus(null);setTyped('');setFlipped(false);}
 function start(onlyWeak=false){
  const next=boardRound(topic,style,records,onlyWeak);
  setQueue(next);setInitialTotal(next.length);setPosition(0);setTyped('');
  setStatus(null);setFlipped(false);setFirstCorrect(0);setMistakes(0);setRunning(true);
 }
 function grade(correct){
  if(!current||status!==null)return;
  const active=current;
  setRecords(previous=>{
   const next=boardRecord(previous,active,correct);
   if(typeof window!=='undefined')saveBoardRecords(window.localStorage,next);
   return next;
  });
  if(correct){
   if(!active.retry)setFirstCorrect(x=>x+1);
   // A successful retry must not leave the same word in a pending retry queue.
   setQueue(previous=>previous.filter((entry,index)=>index<=position||entry.id!==active.id));
  }else{
   setMistakes(x=>x+1);
   setQueue(previous=>previous.some((entry,index)=>index>position&&entry.id===active.id)
    ?previous:[...previous,{...active,retry:true}]);
  }
  setStatus({correct});
  onPracticeEvent?.({id:'teacher-board:'+active.id,
   kind:topic==='verbs'?'grammar':'dictation',label:active.display,lesson:8,correct});
  if(typeof navigator!=='undefined'&&navigator.vibrate){
   try{navigator.vibrate(correct?25:[25,45,25])}catch{}
  }
 }
 function submit(event){
  event.preventDefault();
  if(!typed.trim()||!current||status!==null)return;
  grade(isBoardAnswerCorrect(typed,current));
 }
 function advance(){
  if(!status)return;
  setPosition(x=>x+1);setStatus(null);setTyped('');setFlipped(false);
 }
 return <div className="tbPage" dir="rtl">
  <header className="tbHero">
   <div>
    <span className="tbKicker"><BookOpenCheck size={16}/> یادداشت‌های کلاس · Menschen A1.1 · درس ۸</span>
    <h1>گرامر ساعت، دقیقاً با روش تخته استاد</h1>
    <p>از <b lang="de">fünf nach vier</b> تا <b lang="de">fünf vor halb fünf</b>؛ با ساعت عقربه‌ای، دیکته سخت و مرور پاسخ‌های اشتباه.</p>
   </div>
   <RouteLink to="practiceLesson/8" navigate={setTab} className="tbHeroReturn"><ArrowRight size={17}/> تمرین‌های درس ۸</RouteLink>
  </header>
  <nav className="tbCategoryTabs" aria-label="موضوعات تخته کلاس">
   {BOARD_TOPICS.map(t=><button key={t.id} type="button" aria-pressed={topic===t.id}
    className={topic===t.id?'active':''} onClick={()=>resetTopic(t.id)}>
    {t.id==='clock'?<Clock3 size={18}/>:t.id==='when'?<CalendarDays size={18}/>:<BookOpen size={18}/>}
    <span><b>{t.label}</b><small>{t.description}</small></span>
   </button>)}
  </nav>
  {!running&&topic==='clock'&&<section className="tbReference" aria-label="گرامر ساعت تخته استاد">
   <div className="tbSectionHead"><div><h2>بخوان، ببین، مقایسه کن</h2>
    <p>ساعت‌های روی تخته از ۱۶:۰۰ تا ۱۷:۰۰ هستند. هر زمان را لمس کن تا عقربه‌ها و مثال‌ها تغییر کنند.</p></div>
    <span>۱۳ زمان · هر ۵ دقیقه</span></div>
   <div className="tbClockLayout">
    <div className="tbClockPanel">
     <AnalogTeacherClock time={sample}/>
     <div className="tbClockLegend"><span className="tbAfter">nach · گذشته از ساعت</span><span className="tbBefore">vor · مانده به ساعت</span></div>
    </div>
    <div className="tbClockReadings">
     <strong className="tbClockTime" dir="ltr">{sample}</strong>
     <div className="tbReading"><small>ساعت رسمی · offizielle Uhrzeit</small>
      <b dir="ltr" lang="de">Es ist {row.formal}.</b>
      <button type="button" onClick={()=>speak('Es ist '+row.formal)} aria-label="پخش ساعت رسمی"><Volume2 size={19}/></button></div>
     <div className="tbReading conversational"><small>ساعت محاوره‌ای · umgangssprachlich</small>
      <b dir="ltr" lang="de">Es ist {row.colloquial}.</b>
      <button type="button" onClick={()=>speak('Es ist '+row.colloquial)} aria-label="پخش ساعت محاوره‌ای"><Volume2 size={19}/></button></div>
     <p className="tbClockNote">نکته: <b lang="de">halb fünf</b> یعنی ۱۶:۳۰ (نیم ساعت مانده به پنج). در عبارت محاوره‌ای «vor / nach» معمولاً <b lang="de">Uhr</b> به پایان اضافه نمی‌کنیم.</p>
    </div>
   </div>
   <div className="tbTimeStrip" role="group" aria-label="انتخاب ساعت از روی تخته">
    {TEACHER_CLOCK_TIMES.map(item=><button key={item.time} type="button" aria-pressed={sample===item.time}
     className={sample===item.time?'active':''} onClick={()=>setSample(item.time)}>
     <b dir="ltr">{item.time}</b><small dir="ltr" lang="de">{item.colloquial}</small></button>)}
   </div>
   <div className="tbGrammarRules">
    <div><b lang="de">Wie spät ist es?</b><small>ساعت چند است؟</small></div>
    <div><b lang="de">Wie viel Uhr ist es?</b><small>ساعت چند است؟</small></div>
    <div><b lang="de">Es ist vier Uhr.</b><small>۱۶:۰۰ به شکل محاوره‌ای</small></div>
    <div><b lang="de">Es ist halb fünf.</b><small>۱۶:۳۰؛ ساعت بعد ملاک است</small></div>
   </div>
  </section>}
  {!running&&topic==='when'&&<section className="tbReference" aria-label="گرامر Wann از تخته استاد">
   <div className="tbSectionHead"><div><h2>Wann? · چه موقع؟</h2><p>روز، بخش روز و ساعت را با حرف اضافه درست به هم متصل کن.</p></div></div>
   <div className="tbUsageCard"><span>قانون کلاس</span>
    <strong dir="ltr" lang="de">am Mittwochabend um 19:00 Uhr</strong>
    <p dir="ltr" lang="de">Am Mittwochabend um 19:00 Uhr habe ich einen Arzttermin.</p>
    <small>چهارشنبه عصر ساعت ۱۹، وقت پزشک دارم؛ برای روز <b>am</b> و برای ساعت دقیق <b>um</b> می‌آید.</small>
    <button type="button" onClick={()=>speak('Am Mittwochabend um neunzehn Uhr habe ich einen Arzttermin.')}><Volume2 size={17}/> گوش بده</button>
   </div>
   <h3>روزهای هفته · Wochentage</h3>
   <div className="tbWords">{TEACHER_WEEKDAYS.map(item=><button type="button" key={item.de}
    onClick={()=>speak(item.phrase)}><b lang="de">{item.phrase}</b><small>{item.fa}</small><Volume2 size={14}/></button>)}</div>
   <div className="tbWeekend">Samstag + Sonntag = <b lang="de">das Wochenende</b> · <b lang="de">am Wochenende</b></div>
   <h3>اوقات روز · Tageszeiten</h3>
   <div className="tbWords">{TEACHER_DAY_PARTS.map(item=><button type="button" key={item.de}
    onClick={()=>speak(item.phrase)}><b lang="de">{item.phrase}</b><small>{item.fa}</small><Volume2 size={14}/></button>)}</div>
   <p className="tbException"><b>استثنای کلاس:</b> <span lang="de">in der Nacht</span>، نه <span lang="de">am Nacht</span>.</p>
  </section>}
  {!running&&topic==='verbs'&&<section className="tbReference" aria-label="صرف فعل‌های تخته استاد">
   <div className="tbSectionHead"><div><h2>صرف فعل sehen و wissen</h2><p>علاوه بر ساعت، این دو جدول روی تخته کلاس هم بودند.</p></div></div>
   <div className="tbVerbGrid">{TEACHER_VERBS.map(verb=><div key={verb.id} className="tbVerb">
    <h3 lang="de">{verb.id} <small>{verb.meaning}</small></h3>
    <div className="tbVerbRows">{verb.forms.map(([pronoun,form])=><button type="button" key={pronoun}
     onClick={()=>speak(pronoun.replace('er/sie/es','er').replace('sie/Sie','sie')+' '+form)}
     aria-label={'شنیدن '+pronoun+' '+form}><span lang="de">{pronoun}</span><b lang="de">{form}</b><Volume2 size={16}/></button>)}</div>
    <p lang="de" dir="ltr">{verb.example}</p>
    </div>)}</div>
   <p className="tbException">نکته املایی: در صرف <span lang="de">wissen</span> با <span lang="de">ihr</span> شکل صحیح <b lang="de">ihr wisst</b> است.</p>
  </section>}
  <section className="tbPractice" aria-label="آزمون سخت گرامر تخته استاد">
   <div className="tbSectionHead"><div><h2><Target size={21}/> آزمون تخته استاد</h2>
    <p>هر پاسخ اشتباه دوباره در پایان دور برمی‌گردد و پس از پاسخ صحیح از فهرست ضعف خارج می‌شود.</p></div>
    <span>{fa(weak.length)} مورد نیازمند مرور</span></div>
   {!running&&<>
    {topic==='clock'&&<div className="tbSetting">
     <span>نوع ساعت</span>
     <div className="tbOptions" role="group" aria-label="سبک آزمون ساعت">
      {[['both','ترکیبی'],['colloquial','محاوره‌ای'],['formal','رسمی']].map(([id,label])=>
       <button type="button" key={id} aria-pressed={style===id} className={style===id?'selected':''}
        onClick={()=>resetStyle(id)}>{label}</button>)}
     </div></div>}
    <div className="tbSetting"><span>روش تمرین</span>
     <div className="tbOptions" role="group" aria-label="نوع آزمون تخته">
      <button type="button" aria-pressed={method==='write'} className={method==='write'?'selected':''}
       onClick={()=>changeMethod('write')}><Keyboard size={16}/> نوشتن سخت‌گیرانه</button>
      <button type="button" aria-pressed={method==='flash'} className={method==='flash'?'selected':''}
       onClick={()=>changeMethod('flash')}><BookOpenCheck size={16}/> فلش‌کارت</button>
      {topic==='clock'&&<button type="button" aria-pressed={method==='listen'} className={method==='listen'?'selected':''}
       onClick={()=>changeMethod('listen')}><Headphones size={16}/> دیکته شنیداری</button>}
     </div></div>
    <div className="tbStartActions">
     <button type="button" className="tbPrimary" onClick={()=>start(false)}><Play size={19}/> شروع آزمون ۱۲ سؤالی</button>
     <button type="button" className="tbReview" disabled={!weak.length} onClick={()=>start(true)}>
      <RotateCcw size={18}/> فقط اشتباه‌ها ({fa(weak.length)})
     </button>
    </div>
   </>}
   {running&&(done?<div className="tbSummary">
    <CheckCircle2 size={42}/><h3>{initialTotal&&successPct>=90?'قبول شدی!':'دور تمرین کامل شد'}</h3>
    <strong>{fa(firstCorrect)} / {fa(initialTotal)} · {fa(successPct)}٪ پاسخ صحیح بار اول</strong>
    <p>{fa(mistakes)} اشتباه · {fa(weak.length)} ضعف باقی‌مانده</p>
    <div className="tbStartActions"><button type="button" className="tbPrimary" onClick={()=>start(false)}>دور جدید</button>
     <button type="button" className="tbReview" onClick={()=>setRunning(false)}>بازگشت به گرامر</button></div>
   </div>:<div className="tbQuestion" key={current.id+'-'+position}>
    <div className="tbQuestionBar"><span>سؤال {fa(position+1)} از {fa(queue.length)}</span>
     <span>{current.retry?'مرور اشتباه قبلی':topic==='clock'?'ساعت رسمی / محاوره‌ای':topic==='when'?'Wann?':'افعال'}</span></div>
    <div className="tbProgress"><span style={{width:(position/Math.max(queue.length,1)*100)+'%'}}/></div>
    <h3>{method==='listen'?'گوش بده، عبارت آلمانی را دقیق بنویس.':current.prompt}</h3>
    {method==='listen'?<button type="button" className="tbAudioPrompt" onClick={()=>speak(current.say)}>
     <Headphones size={35}/><span>پخش عبارت آلمانی</span><Volume2 size={20}/></button>
    :<div className="tbQuestionDisplay" dir="auto">{current.display}</div>}
    {method==='flash'?<>
     {!flipped?<button type="button" className="tbReveal" onClick={()=>setFlipped(true)}>نمایش پشت فلش‌کارت</button>:
      <div className="tbFlip"><b dir="ltr" lang="de">{current.answer}</b>
       <button type="button" onClick={()=>speak(current.say)}><Volume2 size={18}/> تلفظ</button></div>}
     {flipped&&status===null&&<div className="tbFlashChoices">
      <button type="button" onClick={()=>grade(false)}><XCircle size={18}/> یادم نبود</button>
      <button type="button" onClick={()=>grade(true)}><CheckCircle2 size={18}/> بدون نگاه درست گفتم</button>
     </div>}
    </>:<form className="tbWriteForm" onSubmit={submit}>
     <label htmlFor="tb-answer">پاسخ آلمانی را بدون نگاه به جواب تایپ کن.</label>
     <input id="tb-answer" dir="ltr" lang="de" value={typed} onChange={e=>setTyped(e.target.value)}
      autoComplete="off" autoCapitalize="off" spellCheck={false} disabled={status!==null}
      placeholder={topic==='clock'?'z. B. fünf vor halb fünf':topic==='when'?'z. B. am Mittwoch':'z. B. siehst'}/>
     <div className="tbUmlauts">{['ä','ö','ü','ß'].map(char=><button type="button" key={char} disabled={status!==null}
      onClick={()=>setTyped(value=>value+char)}>{char}</button>)}</div>
     <button type="submit" className="tbPrimary" disabled={status!==null||!typed.trim()}>بررسی دقیق پاسخ</button>
    </form>}
    {status!==null&&<div className={'tbFeedback '+(status.correct?'correct':'incorrect')} role="status">
     {status.correct?<CheckCircle2 size={24}/>:<XCircle size={24}/>}
     <div><b>{status.correct?'پاسخ صحیح است.':'اشتباه شد؛ دوباره تمرین می‌کنی.'}</b>
      <strong lang="de" dir="ltr">{current.answer}</strong><small>{current.explanation}</small></div>
     <button type="button" onClick={()=>speak(current.say)} aria-label="شنیدن پاسخ درست"><Volume2 size={19}/></button>
    </div>}
    {status!==null&&<button type="button" className="tbNext" onClick={advance}>سؤال بعدی <ArrowLeft size={18}/></button>}
   </div>)}
  </section>
  <footer className="tbFooter"><RouteLink to="clockMastery" navigate={setTab}>باشگاه کامل ساعت <ChevronLeft size={16}/></RouteLink>
   <RouteLink to="classNotes" navigate={setTab}>دیگر تمرین‌های کلاس <ChevronLeft size={16}/></RouteLink></footer>
 </div>;
}
