import React,{useState} from 'react';
import {ArrowLeft,Brain,CheckCircle2,ChevronLeft,Ear,Headphones,Hash,RotateCcw,
 Settings2,Shuffle,Volume2,VolumeX,XCircle} from 'lucide-react';
import {createNumberMemoryRound,NUMBER_RECALL_MODES,NUMBER_RECALL_RANGES,
 numberMemoryCorrect} from './numberRecallLogic.js';
import {activityItemKey} from './learningMemory.js';
import {numberSection} from './numberSections.js';
import {GAME_SOUND_KEY,GAME_HAPTIC_KEY,readGameFeedbackPreferences,
 saveGameFeedbackPreference,giveGameFeedback} from './gameEffects.js';
import GameCelebration from './GameCelebration.jsx';
import QuizFocusShell from './QuizFocusShell.jsx';
import {useQuizQuestionAudio} from './useQuizQuestionAudio.js';
import './numberRecallGame.css';

const NUMBER_MODE_DETAILS={
 mixed:'هر سؤال یک نوع تمرین متفاوت دارد؛ هم دیدن و هم شنیدن.',
 digitWord:'عدد را ببین و نوشتار آلمانی آن را انتخاب کن.',
 listenWord:'فقط صدای آلمانی را گوش بده؛ عدد مخفی می‌ماند تا جواب بدهی.',
 wordDigit:'کلمه آلمانی را بخوان و رقم درست را انتخاب کن.'
};
export default function NumberRecallGame({speak=()=>{},memory={},onEvent,onEnd,onClose=()=>{}}){
 const [mode,setMode]=useState('mixed'),[rangeId,setRangeId]=useState('0-12');
 const [roundVersion,setRoundVersion]=useState(0);
 const [round,setRound]=useState(()=>createNumberMemoryRound({rangeId:'0-12',mode:'mixed',memory}));
 const [position,setPosition]=useState(0),[selection,setSelection]=useState(null);
 const [correctCount,setCorrectCount]=useState(0),[finished,setFinished]=useState(false);
 const [preferences,setPreferences]=useState(readGameFeedbackPreferences);
 const current=round[position];
 const audio=useQuizQuestionAudio({questionKey:finished?null:mode+':'+rangeId+':'+roundVersion+':'+position+':'+current?.id,
  mode:finished?null:current?.mode==='listenWord'?'listen':'read',audio:current?.word,
  sound:preferences.sound,speak});
 const correct=selection!==null&&numberMemoryCorrect(current,selection);
 const wrong=selection!==null&&!correct;
 const progress=Math.round((position+Number(selection!==null))/Math.max(1,round.length)*100);
 function start(nextMode=mode,nextRange=rangeId){
  const questions=createNumberMemoryRound({rangeId:nextRange,mode:nextMode,memory});
  setMode(nextMode);setRangeId(nextRange);setRound(questions);setRoundVersion(n=>n+1);
  setPosition(0);setSelection(null);setCorrectCount(0);setFinished(false);
 }
 function toggle(key){
  const prop=key===GAME_SOUND_KEY?'sound':'haptics';
  setPreferences(prev=>{
   const newValue=!prev[prop];
   saveGameFeedbackPreference(key,newValue);
   return {...prev,[prop]:newValue};
  });
 }
 function answer(value){
  if(selection!==null||!current)return;
  const ok=numberMemoryCorrect(current,value);
  setSelection(value);
  if(ok)setCorrectCount(n=>n+1);
  onEvent?.({
   id:activityItemKey('number',current.number),kind:'number',
   label:String(current.number),lesson:1,correct:ok,feedbackHandled:true
  });
  giveGameFeedback(ok?'correct':'wrong',preferences);
  // Each choice is spoken as German, including wrong ones, once per answer.
  if(preferences.sound)audio.playChoice(current.options.find(option=>option.value===value)?.label);
 }
 function next(){
  if(selection===null)return;
  if(position===round.length-1){
   setFinished(true);
   onEnd?.(correctCount,round.length);
   giveGameFeedback('finish',preferences);
   return;
  }
  const upcoming=round[position+1];
  audio.playUpcoming(mode+':'+rangeId+':'+roundVersion+':'+(position+1)+':'+upcoming.id,upcoming.word,
   upcoming.mode==='listenWord'?'listen':'read');
  setPosition(n=>n+1);
  setSelection(null);
 }
 return <QuizFocusShell title="آزمون هوشمند اعداد" onClose={onClose}>
 <section className="nrGame">
  <div className="nrHeader">
   <div><span className="nrEyebrow">ZAHLEN · HÖREN · ERINNERN</span>
    <h3>عدد را ببین، بشنو، به یاد بیاور</h3>
    <p>عددها در هر دور به ترتیب متفاوت می‌آیند و اشتباه‌ها زودتر مرور می‌شوند.</p>
   </div>
   <div className="nrSwitches">
    <button type="button" aria-pressed={preferences.sound} aria-label="روشن یا خاموش کردن صدا" title="صدای بازخورد"
     onClick={()=>toggle(GAME_SOUND_KEY)}>{preferences.sound?<Volume2 size={18}/>:<VolumeX size={18}/>}</button>
    <button type="button" aria-pressed={preferences.haptics} aria-label="روشن یا خاموش کردن ویبره" title="ویبره در گوشی‌های پشتیبانی‌شده"
     onClick={()=>toggle(GAME_HAPTIC_KEY)}>📳 {preferences.haptics?'روشن':'خاموش'}</button>
   </div>
  </div>
  <details className="nrSettings">
   <summary><Settings2 size={17}/> نوع و محدوده آزمون
     <span>{NUMBER_RECALL_MODES.find(item=>item.id===mode)?.title} · {numberSection(rangeId).label}</span>
   </summary>
   <div className="nrSettingTitle"><Settings2 size={17}/> نوع آزمون</div>
   <div className="nrModes">{NUMBER_RECALL_MODES.map(item=><button type="button" key={item.id}
    aria-pressed={mode===item.id} className={mode===item.id?'active':''}
    onClick={()=>start(item.id,rangeId)}>{item.title}</button>)}</div>
   <div className="nrSettingTitle"><Hash size={17}/> محدوده اعداد</div>
   <div className="nrRanges">{NUMBER_RECALL_RANGES.map(value=><button type="button" key={value}
    aria-pressed={rangeId===value} className={rangeId===value?'active':''} onClick={()=>start(mode,value)}>
     {numberSection(value).label}</button>)}</div>
   <small>تغییر حالت یا محدوده، یک آزمون جدید با سؤال‌های تصادفی می‌سازد.</small>
  </details>
  {finished?<div className="nrFinished">
    <GameCelebration correct={correctCount} total={round.length} caption="آزمون اعداد پایان یافت"/>
    <p>اعدادی که اشتباه شدند، به حافظه تمرینت اضافه شده‌اند و در دورهای بعد بیشتر تکرار می‌شوند.</p>
    <button type="button" className="nrNext" onClick={()=>start()}><RotateCcw size={18}/> آزمون تصادفی جدید</button>
   </div>:current?<div className="nrBoard">
    <div className="nrRoundTop"><b>سؤال {position+1} از {round.length}</b>
     <span><CheckCircle2 size={16}/> {correctCount} پاسخ درست</span></div>
    <div className="nrTrack"><span style={{width:progress+'%'}}/></div>
    <div className="nrQuestion">
     <div className="nrQuestionBadge">{current.mode==='listenWord'?'HÖREN':
      current.mode==='digitWord'?'ZAHLEN':'LESEN'}</div>
     <p>{current.mode==='listenWord'?'گوش بده؛ چه کلمه‌ای شنیدی؟':
      current.mode==='wordDigit'?'این کلمه آلمانی چه عددی است؟':
      'نوشتار آلمانی این عدد کدام است؟'}</p>
     {current.mode==='listenWord'?<div className="nrListenOnly">
      <div className="nrEarArt" aria-hidden="true"><Headphones size={42}/><span>♪</span></div>
      <button type="button" className="nrListenButton" onClick={()=>audio.replay()}>
       <Volume2 size={21}/> شنیدن دوباره</button>
      <small>عدد و معنی تا زمان پاسخ دادن مخفی‌اند. برای تکرار صدا دوباره بزن.</small>
     </div>:<div className={'nrBigPrompt '+(current.mode==='digitWord'?'nrDigit':'nrWord')}
       dir="ltr">{current.mode==='digitWord'?current.number:current.word}</div>}
     {current.mode==='wordDigit'&&<button type="button" className="nrSmallListen" onClick={()=>audio.replay()}>
      <Volume2 size={17}/> شنیدن تلفظ کلمه</button>}
     {current.mode==='digitWord'&&<span className="nrHelp">اول کلمه را انتخاب کن؛ بعد تلفظ درست را می‌شنوی.</span>}
    </div>
    <div className={'nrAnswers '+(current.mode==='wordDigit'?'nrAnswerDigits':'')} dir="ltr">
     {current.options.map((option,index)=>{
      const right=selection!==null&&option.value===current.number;
      const wrongPick=selection!==null&&option.value===selection&&!right;
      return <button type="button" key={option.value} disabled={selection!==null}
       className={right?'right':wrongPick?'wrong':''} onClick={()=>answer(option.value)}>
       <small>{'ABCD'[index]}</small><b>{option.label}</b>
       {right?<CheckCircle2 size={20}/>:wrongPick?<XCircle size={20}/>:null}
      </button>;
     })}</div>
    {selection!==null&&<div className={'nrResponse '+(correct?'correct':'incorrect')} role="status">
     <div>{correct?<CheckCircle2 size={24}/>:<XCircle size={24}/>}</div>
     <div><b>{correct?'درست بود! +۱۰ XP':'این یکی نیاز به مرور دارد. +۲ XP'}</b>
      <strong dir="ltr">{current.number} — {current.word}</strong></div>
     <button type="button" onClick={()=>audio.replay()} aria-label={'شنیدن '+current.word}>
      <Volume2 size={19}/></button>
    </div>}
    <button type="button" className="nrNext" disabled={selection===null} onClick={next}>
      {selection===null?'یک پاسخ انتخاب کن':position===round.length-1?'مشاهده نتیجه':'سؤال بعدی'}
      <ArrowLeft size={17}/></button>
   </div>:null}
 </section></QuizFocusShell>;
}
