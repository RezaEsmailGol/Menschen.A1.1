import React,{useState} from 'react';
import {ArrowLeft,CheckCircle2,Gamepad2,Headphones,Hash,Heart,RotateCcw,Sparkles,Star,Trophy,Volume2,VolumeX,XCircle} from 'lucide-react';
import {germanNumber} from './learningData.js';
import {createNumberGameRound,correctNumberGameAnswer,optionLabel} from './numberGameLogic.js';
import {NUMBER_SECTIONS,numbersInSection,numberSection,numberSectionStats,numberTip} from './numberSections.js';
import MnemonicArt from './MnemonicArt.jsx';
import {playWrongBeep} from './audioFeedback.js';
import './numberGame.css';

const format=n=>n.toLocaleString('fa-IR');
const NUMBER_GUIDES={
 '0-12':{number:12,expression:'zwölf',tip:'فرق zwei (۲) و zwölf (۱۲) را با پخش صوت چندبار گوش بده.',notable:[2,11,12]},
 '13-20':{number:17,expression:'sieb + zehn = siebzehn',tip:'در sechzehn حرف s و در siebzehn حروف en حذف می‌شوند.',notable:[16,17,20]},
 '20-30':{number:21,expression:'ein + und + zwanzig',tip:'در اعداد ۲۱ تا ۲۹، یکان پیش از دهگان است؛ eins به ein تبدیل می‌شود.',notable:[20,21,30]},
 '31-50':{number:42,expression:'zwei + und + vierzig',tip:'عدد ۴۲ به آلمانی zweiundvierzig است: اول ۲، بعد «und»، بعد ۴۰.',notable:[30,40,42,50]},
 '51-70':{number:67,expression:'sieben + und + sechzig',tip:'۶۰ sechzig و ۷۰ siebzig هستند. به کوتاه‌شدن sechs و sieben دقت کن.',notable:[60,61,67,70]},
 '71-100':{number:98,expression:'acht + und + neunzig',tip:'عدد ۹۸ به آلمانی achtundneunzig است. صد را hundert می‌گوییم.',notable:[70,80,90,100]},
 '0-100':{number:84,expression:'vier + und + achtzig',tip:'هر عدد از ۰ تا ۱۰۰ ممکن است بیاید. بعد از اشتباه، در همان دور دوباره مرور می‌کنی.',notable:[12,20,30,60,70,100]},
 'confusing':{number:12,expression:'zwei ≠ zwölf ≠ zwanzig',tip:'۲ = zwei، ۱۲ = zwölf، ۲۰ = zwanzig. همچنین ۱۶ و ۱۷، ۶۰ و ۷۰ را مقایسه کن.',notable:[2,12,20,16,17,60,70]}
};
export default function NumberLab({speak,onAttempt,memory}){
 const [rangeId,setRangeId]=useState('0-12');
 const [mode,setMode]=useState('mixed');
 const [active,setActive]=useState(false);
 const [queue,setQueue]=useState([]);
 const [position,setPosition]=useState(0);
 const [choice,setChoice]=useState(null);
 const [typed,setTyped]=useState('');
 const [firstPassScore,setFirstPassScore]=useState(0);
 const [attempts,setAttempts]=useState(0);
 const [wrongCount,setWrongCount]=useState(0);
 const [reviewCorrect,setReviewCorrect]=useState(0);
 const [studyAll,setStudyAll]=useState(false);
 const [feedbackSound,setFeedbackSound]=useState(()=>{
   try{return localStorage.getItem('dt_game_feedback_sound')!=='off';}
   catch{return true;}
 });
 const toggleFeedbackSound=()=>{
   setFeedbackSound(previous=>{
     const next=!previous;
     try{localStorage.setItem('dt_game_feedback_sound',next?'on':'off');}catch{}
     return next;
   });
 };
 const item=queue[position];
 const finished=active&&position>=queue.length;
 const correct=choice!==null && correctNumberGameAnswer(choice,item);
 const questionMode=item?.questionMode||mode;
 const guide=NUMBER_GUIDES[rangeId]||NUMBER_GUIDES['0-100'];
 const start=()=>{
   setQueue(createNumberGameRound({rangeId,mode,memory}));
   setPosition(0);setChoice(null);setTyped('');setFirstPassScore(0);setAttempts(0);setWrongCount(0);setReviewCorrect(0);setActive(true);
 };
 const pick=value=>{
   if(choice!==null || finished)return;
   const ok=correctNumberGameAnswer(value,item);
   // Run feedback inside the actual click handler so mobile browsers allow sound.
   if(feedbackSound){
     if(ok){
       // Use the same German voice and adjustable speed as other lesson exercises.
       speak(germanNumber(item.number));
     } else {
       try{window.speechSynthesis?.cancel();}catch{}
       playWrongBeep();
     }
   }
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
   if(typeof navigator!=='undefined'&&navigator.vibrate) {
     try{navigator.vibrate(ok ? 25 : [25,45,25]);}catch{}
   }
 };
 const next=()=>{if(choice===null)return;setPosition(n=>n+1);setChoice(null);setTyped('');};
 const initialTotal=Math.min(10,numbersInSection(rangeId).length);
 const referenceNumbers=studyAll?Array.from({length:101},(_,n)=>n):numbersInSection(rangeId);
 const range=numberSection(rangeId);
 return <section className="labPage">
  <div className="numbersHero numberDuoHero">
    <div>
      <span className="sectionKicker"><Gamepad2 size={17}/> Zahlen Challenge · A1.1</span>
      <h2>اعداد آلمانی، <em>با بازی یاد بگیر!</em></h2>
      <p>از صفر تا صد، مرحله‌ای و ترکیبی بازی کن: عدد را ببین، تلفظ را بشنو، نوشته را به رقم تبدیل کن یا املای آلمانی آن را بنویس. اشتباه‌ها دوباره برمی‌گردند.</p>
      <div className="numberFeatures"><span><Star size={16}/> ۰ تا ۱۰۰ · ده سؤال در هر دور</span><span><Headphones size={16}/> شنیدن و انتخاب</span><span><Trophy size={16}/> ثبت پیشرفت</span></div>
    </div>
    <div className="numberHeroDecoration" aria-hidden="true"><span>7</span><span>12</span><span>20</span><span>99</span></div>
  </div>
  <div className="numbersLayout">
    <div className="numberMainCard gameNumberCard">
      <div className="panelTitleRow">
        <div><small className="eyebrow">NUMBER ADVENTURE</small><h3>آزمون تصادفی اعداد</h3></div>
        <div className="duoSoundControls">
          <button type="button" className={'duoSoundToggle '+(feedbackSound?'enabled':'muted')}
            onClick={toggleFeedbackSound} aria-pressed={feedbackSound}
            aria-label={feedbackSound?'بی‌صدا کردن بازخورد آزمون':'فعال کردن صدای بازخورد آزمون'}
            title={feedbackSound?'خاموش کردن افکت صوتی':'روشن کردن افکت صوتی'}>
            {feedbackSound?<Volume2 size={18}/>:<VolumeX size={18}/>}
            <span>{feedbackSound?'صدا روشن':'بی‌صدا'}</span>
          </button>
          <span className="panelIcon"><Gamepad2 size={23}/></span>
        </div>
      </div>
      {!active && <div className="numberChallengeSetup">
        <div><b>مرحله تمرین اعداد</b><div className="numberStageGrid">
          {NUMBER_SECTIONS.map(stage=>{
            const stats=numberSectionStats(stage.id,memory);
            return <button key={stage.id} type="button" aria-pressed={rangeId===stage.id}
              className={'numberStageCard '+(rangeId===stage.id?'active':'')} onClick={()=>setRangeId(stage.id)}>
                <span className="numberStageIcon">{stage.icon}</span>
                <strong>{stage.label}</strong><small>{stage.subtitle}</small>
                <span className="numberStageProgress"><i style={{width:(100*stats.mastered/stats.total)+'%'}}/></span>
                <span className="numberStageMeta">{format(stats.mastered)} مسلط از {format(stats.total)}</span>
            </button>})}
        </div></div>
        <div><b>نوع بازی</b><div className="segmentedTabs">
          <button type="button" className={mode==='read'?'active':''} onClick={()=>setMode('read')}><Hash size={15}/> ببین و انتخاب کن</button>
          <button type="button" className={mode==='hear'?'active':''} onClick={()=>setMode('hear')}><Headphones size={15}/> بشنو و انتخاب کن</button>
          <button type="button" className={mode==='recognize'?'active':''} onClick={()=>setMode('recognize')}><Gamepad2 size={15}/> کلمه ← عدد</button>
          <button type="button" className={questionMode==='type'?'active':''} onClick={()=>setMode('type')}><Hash size={15}/> دیکته تایپی</button>
          <button type="button" className={mode==='mixed'?'active':''} onClick={()=>setMode('mixed')}><Sparkles size={15}/> ترکیبی (۴ بازی)</button>
        </div></div>
      </div>}
      {!active && <div className="numberStart numberGameStart">
        <div className="numberMascot" aria-hidden="true">🎯</div>
        <h3>آمادهٔ چالش هستی؟</h3>
        <p>در مرحله «{range.label}» هر دور {format(initialTotal)} سؤال تصادفی داری. گزینه‌ها یا پاسخ تایپی را انتخاب کن؛ اشتباه‌ها دوباره تمرین می‌شوند.</p>
        <button className="primaryCTA" onClick={start}><Sparkles size={18}/> شروع بازی <ArrowLeft size={18}/></button>
      </div>}
      {active&&!finished&&item&&<div className="duoPlay">
        <div className="duoStatus"><span><Trophy size={16}/> {format(firstPassScore)} از {format(initialTotal)} امتیاز</span><span><Heart size={17}/> بدون محدودیت تلاش</span></div>
        <div className="examTrack duoTrack"><span style={{width:((position+1)/queue.length*100)+'%'}}/></div>
        <div className="duoQuestionHead"><b>{range.label} · سؤال {format(position+1)} از {format(queue.length)}</b>{item.retry&&<span className="reviewBadge">مرور اشتباه قبلی</span>}</div>
        <div className="duoQuestion">
          {questionMode==='hear'
            ?<><span>گوش بده؛ کدام عدد را شنیدی؟</span><span className="duoHeadphones"><Headphones size={49}/></span>
                <button type="button" className="duoHear" onClick={()=>speak(germanNumber(item.number))}>
                  <Volume2 size={19}/> پخش عدد آلمانی</button></>
            :questionMode==='recognize'
              ?<><span>این کلمه آلمانی کدام عدد است؟</span>
                <strong className="duoHugeWord" dir="ltr" lang="de">{germanNumber(item.number)}</strong>
                <button type="button" className="duoHear" onClick={()=>speak(germanNumber(item.number))}><Volume2 size={19}/> تلفظ کلمه</button></>
              :<><span>{questionMode==='type'?'این عدد را به آلمانی تایپ کن.':'کدام گزینه نوشتار درست این عدد است؟'}</span>
                <strong className="duoHugeNumber">{item.number}</strong>
                <div className="duoNumberScene"><MnemonicArt number={item.number}/></div></>}
        </div>
        {mode==='type'?
          <form className="duoTypeAnswer" onSubmit={e=>{e.preventDefault();if(choice===null&&typed.trim())pick(typed)}}>
            <label htmlFor="number-spelling">املای آلمانی عدد</label>
            <input id="number-spelling" dir="ltr" lang="de" autoComplete="off" autoCapitalize="off" spellCheck={false}
              placeholder="z. B. siebzehn" value={typed} disabled={choice!==null}
              onChange={e=>setTyped(e.target.value)}/>
            <div className="duoUmlautKeys">{['ä','ö','ü','ß'].map(ch=><button type="button" key={ch}
              disabled={choice!==null} onClick={()=>setTyped(x=>x+ch)}>{ch}</button>)}</div>
            <button type="submit" className="primaryCTA" disabled={choice!==null||!typed.trim()}>بررسی پاسخ</button>
          </form>:
          <div className="duoChoices" dir="ltr" role="group" aria-label="چهار گزینه آزمون">
          {item.options.map((number,i)=>{
            const right=choice!==null && number===item.number;
            const wrong=choice!==null && number===choice && choice!==item.number;
            return <button key={number} type="button" disabled={choice!==null}
              className={(right?'isCorrect duoCorrectPop':wrong?'isWrong duoWrongShake':'')+(choice!==null?' locked':'')}
              onClick={()=>pick(number)}>
              <span className="duoLetter">{'ABCD'[i]}</span><span className="duoAnswer" dir="ltr">{optionLabel(number,questionMode)}</span>
              {right&&<CheckCircle2 size={22}/>}
              {wrong&&<XCircle size={22}/>}
            </button>;
          })}
        </div>}
        {choice!==null&&<div className={'duoFeedback '+(correct?'success':'failure')} role="status">
          {correct?<CheckCircle2 size={25}/>:<XCircle size={25}/>}
          <div><b>{correct?'آفرین! پاسخ درست است.':'اشتباه شد! این عدد دوباره مرور می‌شود.'}</b>
            <span dir="ltr">{item.number} = {germanNumber(item.number)}</span>
            {numberTip(item.number)&&<small>{numberTip(item.number)}</small>}</div>
          <button onClick={()=>speak(germanNumber(item.number))} aria-label="شنیدن جواب درست"><Volume2 size={19}/></button>
        </div>}
        <button className="primaryCTA fullCTA duoNext" disabled={choice===null} onClick={next}>{position===queue.length-1?'مشاهده نتیجه':'ادامه بازی'} <ArrowLeft size={18}/></button>
      </div>}
      {finished&&<div className="examFinished duoFinished">
        <span className="finishIcon"><Trophy size={38}/></span><h3>چالش تمام شد!</h3>
        <strong dir="ltr">{firstPassScore} / {initialTotal}</strong>
        <p>{firstPassScore>=8?'عالی بود! مرحله بعدی هم منتظرت است.':'دفعه بعد بهتر می‌شود؛ هر اشتباه فرصتی برای یادگرفتن است.'}</p>
        <div className="duoFinalStats"><div><b>{format(attempts)}</b><span>کل پاسخ‌ها</span></div><div><b>{format(wrongCount)}</b><span>پاسخ اشتباه</span></div><div><b>{format(reviewCorrect)}</b><span>مرور درست</span></div></div>
        <div className="numberFinishActions"><button className="primaryCTA" onClick={start}><RotateCcw size={18}/> دور تصادفی جدید</button><button className="softButton" onClick={()=>setActive(false)}>انتخاب مرحله دیگر</button></div>
      </div>}
    </div>
    <aside className="numbersGuide">
      <div className="guideTitle"><span>🧠</span><div><h3>میان‌بُر ذهنی</h3><p>{range.subtitle}</p></div></div>
      <div className="guideExample" dir="ltr"><span>{guide.number}</span><strong>{guide.expression}</strong><small>{germanNumber(guide.number)}</small></div>
      <p>{guide.tip}</p>
      <div className="guideDivider"/><strong>اعداد مهم و پرتکرار</strong>
      {guide.notable.map(n=><button className="guideException" key={n} type="button" onClick={()=>speak(germanNumber(n))}><b dir="ltr">{n}</b><span dir="ltr">{germanNumber(n)}</span><Volume2 size={16}/></button>)}
    </aside>
  </div>
  <div className="numberReference">
    <div className="panelTitleRow"><div><small className="eyebrow">LEARN & LISTEN</small><h3>واژه‌نامه اعداد {range.label}</h3><p>برای شنیدن هر عدد روی آن بزن.</p></div><button className="softButton" onClick={()=>setStudyAll(v=>!v)}>{studyAll?'نمایش فقط مرحله':'نمایش همه تا ۱۰۰'}</button></div>
    <div className="newNumberGrid">{referenceNumbers.map(n=><button key={n} onClick={()=>speak(germanNumber(n))}><strong>{n}</strong><span dir="ltr">{germanNumber(n)}</span><Volume2 size={16}/></button>)}</div>
  </div>
 </section>;
}
