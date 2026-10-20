import React,{useState} from 'react';
import {ArrowLeft,CheckCircle2,Gamepad2,Headphones,Hash,Heart,RotateCcw,Sparkles,Star,Trophy,Volume2,XCircle} from 'lucide-react';
import {germanNumber} from './learningData.js';
import {createNumberRound,optionLabel} from './numberGameLogic.js';
import './numberGame.css';

const format=n=>n.toLocaleString('fa-IR');
export default function NumberLab({speak,onAttempt,memory}){
 const [maximum,setMaximum]=useState(12);
 const [mode,setMode]=useState('read');
 const [active,setActive]=useState(false);
 const [queue,setQueue]=useState([]);
 const [position,setPosition]=useState(0);
 const [choice,setChoice]=useState(null);
 const [firstPassScore,setFirstPassScore]=useState(0);
 const [attempts,setAttempts]=useState(0);
 const [wrongCount,setWrongCount]=useState(0);
 const [reviewCorrect,setReviewCorrect]=useState(0);
 const [studyAll,setStudyAll]=useState(false);
 const item=queue[position];
 const finished=active&&position>=queue.length;
 const correct=choice!==null && choice===item?.number;
 const start=()=>{
   setQueue(createNumberRound(maximum,memory).map(q=>({...q,retry:false})));
   setPosition(0);setChoice(null);setFirstPassScore(0);setAttempts(0);setWrongCount(0);setReviewCorrect(0);setActive(true);
 };
 const pick=value=>{
   if(choice!==null || finished)return;
   const ok=value===item.number;
   setChoice(value);
   setAttempts(x=>x+1);
   if(ok){
     if(item.retry)setReviewCorrect(n=>n+1);
     else setFirstPassScore(n=>n+1);
   } else {
     setWrongCount(n=>n+1);
     if(!item.retry)setQueue(previous=>[...previous,{...item,retry:true}]);
   }
   onAttempt?.(ok,item.number);
   if(ok && typeof navigator!=='undefined'&&navigator.vibrate) {
     try{navigator.vibrate(25);}catch{}
   }
 };
 const next=()=>{if(choice===null)return;setPosition(n=>n+1);setChoice(null);};
 const initialTotal=Math.min(10,maximum+1);
 const count=studyAll?101:21;
 return <section className="labPage">
  <div className="numbersHero numberDuoHero">
    <div>
      <span className="sectionKicker"><Gamepad2 size={17}/> Zahlen Challenge · A1.1</span>
      <h2>اعداد آلمانی، <em>با بازی یاد بگیر!</em></h2>
      <p>چهار گزینه، یک پاسخ درست! سؤال‌ها هر دور تصادفی‌اند و عددهایی که اشتباه کرده‌ای برای مرور دوباره برمی‌گردند.</p>
      <div className="numberFeatures"><span><Star size={16}/> ده چالش در هر دور</span><span><Headphones size={16}/> شنیدن و انتخاب</span><span><Trophy size={16}/> ثبت پیشرفت</span></div>
    </div>
    <div className="numberHeroDecoration" aria-hidden="true"><span>7</span><span>12</span><span>20</span><span>99</span></div>
  </div>
  <div className="numbersLayout">
    <div className="numberMainCard gameNumberCard">
      <div className="panelTitleRow">
        <div><small className="eyebrow">NUMBER ADVENTURE</small><h3>آزمون تصادفی اعداد</h3></div>
        <span className="panelIcon"><Gamepad2 size={23}/></span>
      </div>
      {!active && <div className="numberChallengeSetup">
        <div><b>از چه اعدادی سؤال بپرسم؟</b><div className="segmentedTabs">
          {[12,20,100].map(n=><button key={n} type="button" className={maximum===n?'active':''} onClick={()=>setMaximum(n)}>۰ تا {format(n)}</button>)}
        </div></div>
        <div><b>نوع بازی</b><div className="segmentedTabs">
          <button type="button" className={mode==='read'?'active':''} onClick={()=>setMode('read')}><Hash size={15}/> ببین و انتخاب کن</button>
          <button type="button" className={mode==='hear'?'active':''} onClick={()=>setMode('hear')}><Headphones size={15}/> بشنو و انتخاب کن</button>
        </div></div>
      </div>}
      {!active && <div className="numberStart numberGameStart">
        <div className="numberMascot" aria-hidden="true">🎯</div>
        <h3>آمادهٔ چالش هستی؟</h3>
        <p>در هر سؤال چهار کارت داری. پاسخ را انتخاب کن، بازخورد فوری بگیر و برای سؤال بعدی برو. عددهای اشتباه یک‌بار دیگر تمرین می‌شوند.</p>
        <button className="primaryCTA" onClick={start}><Sparkles size={18}/> شروع بازی <ArrowLeft size={18}/></button>
      </div>}
      {active&&!finished&&item&&<div className="duoPlay">
        <div className="duoStatus"><span><Trophy size={16}/> {format(firstPassScore)} از {format(initialTotal)} امتیاز</span><span><Heart size={17}/> بدون محدودیت تلاش</span></div>
        <div className="examTrack duoTrack"><span style={{width:((position+1)/queue.length*100)+'%'}}/></div>
        <div className="duoQuestionHead"><b>سؤال {format(position+1)} از {format(queue.length)}</b>{item.retry&&<span className="reviewBadge">مرور اشتباه قبلی</span>}</div>
        <div className="duoQuestion">
          {mode==='read'
            ?<><span>کدام گزینه نوشتار درست این عدد است؟</span><strong className="duoHugeNumber">{item.number}</strong></>
            :<><span>گوش بده؛ کدام عدد را شنیدی؟</span><span className="duoHeadphones"><Headphones size={49}/></span><button className="duoHear" onClick={()=>speak(germanNumber(item.number))}><Volume2 size={19}/> پخش عدد آلمانی</button></>}
        </div>
        <div className="duoChoices" dir="ltr" role="group" aria-label="چهار گزینه آزمون">
          {item.options.map((number,i)=>{
            const right=choice!==null && number===item.number;
            const wrong=choice!==null && number===choice && choice!==item.number;
            return <button key={number} type="button" disabled={choice!==null}
              className={(right?'isCorrect':wrong?'isWrong':'')+(choice!==null?' locked':'')}
              onClick={()=>pick(number)}>
              <span className="duoLetter">{'ABCD'[i]}</span><span className="duoAnswer" dir="ltr">{optionLabel(number,mode)}</span>
              {right&&<CheckCircle2 size={22}/>}
              {wrong&&<XCircle size={22}/>}
            </button>;
          })}
        </div>
        {choice!==null&&<div className={'duoFeedback '+(correct?'success':'failure')} role="status">
          {correct?<CheckCircle2 size={25}/>:<XCircle size={25}/>}
          <div><b>{correct?'آفرین! درست انتخاب کردی!':'این دفعه اشتباه شد؛ دوباره می‌بینیمش.'}</b>
            <span dir="ltr">{item.number} = {germanNumber(item.number)}</span></div>
          <button onClick={()=>speak(germanNumber(item.number))} aria-label="شنیدن جواب درست"><Volume2 size={19}/></button>
        </div>}
        <button className="primaryCTA fullCTA duoNext" disabled={choice===null} onClick={next}>{position===queue.length-1?'مشاهده نتیجه':'ادامه بازی'} <ArrowLeft size={18}/></button>
      </div>}
      {finished&&<div className="examFinished duoFinished">
        <span className="finishIcon"><Trophy size={38}/></span><h3>چالش تمام شد!</h3>
        <strong dir="ltr">{firstPassScore} / {initialTotal}</strong>
        <p>{firstPassScore>=8?'عالی بود! مرحله بعدی هم منتظرت است.':'دفعه بعد بهتر می‌شود؛ هر اشتباه فرصتی برای یادگرفتن است.'}</p>
        <div className="duoFinalStats"><div><b>{format(attempts)}</b><span>کل پاسخ‌ها</span></div><div><b>{format(wrongCount)}</b><span>پاسخ اشتباه</span></div><div><b>{format(reviewCorrect)}</b><span>مرور درست</span></div></div>
        <button className="primaryCTA" onClick={start}><RotateCcw size={18}/> دور تصادفی جدید</button>
      </div>}
    </div>
    <aside className="numbersGuide">
      <div className="guideTitle"><span>🧠</span><div><h3>میان‌بُر ذهنی</h3><p>قانون عددهای بالای ۲۰</p></div></div>
      <div className="guideExample" dir="ltr"><span>21</span><strong>ein + und + zwanzig</strong><small>einundzwanzig</small></div>
      <p>از ۲۱ تا ۹۹، ابتدا یکان، سپس <b>und</b> و بعد دهگان گفته می‌شود.</p>
      <div className="guideDivider"/><strong>استثناهای مهم</strong>
      {[['16','sechzehn'],['17','siebzehn'],['30','dreißig'],['60','sechzig'],['70','siebzig']].map(([n,w])=><button className="guideException" key={n} onClick={()=>speak(w)}><b dir="ltr">{n}</b><span dir="ltr">{w}</span><Volume2 size={16}/></button>)}
    </aside>
  </div>
  <div className="numberReference">
    <div className="panelTitleRow"><div><small className="eyebrow">LEARN & LISTEN</small><h3>جدول اعداد با تلفظ</h3><p>برای شنیدن هر عدد روی آن بزن.</p></div><button className="softButton" onClick={()=>setStudyAll(v=>!v)}>{studyAll?'نمایش فقط ۰ تا ۲۰':'نمایش تا ۱۰۰'}</button></div>
    <div className="newNumberGrid">{Array.from({length:count},(_,n)=><button key={n} onClick={()=>speak(germanNumber(n))}><strong>{n}</strong><span dir="ltr">{germanNumber(n)}</span><Volume2 size={16}/></button>)}</div>
  </div>
 </section>;
}
