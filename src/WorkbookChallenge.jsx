import React,{useState} from 'react';
import {AudioLines,Brain,CheckCircle2,Headphones,MessageCircle,RotateCcw,Shuffle,
 Sparkles,Trophy,Volume2,VolumeX, XCircle} from 'lucide-react';
import {createWorkbookChallenge,WB_CHALLENGE_MODES,WB_VERBS} from './workbookChallengeLogic.js';
import {GAME_SOUND_KEY,GAME_HAPTIC_KEY,readGameFeedbackPreferences,
 saveGameFeedbackPreference,giveGameFeedback} from './gameEffects.js';
import GameCelebration from './GameCelebration.jsx';
import QuizFocusShell from './QuizFocusShell.jsx';
import {useQuizQuestionAudio} from './useQuizQuestionAudio.js';
import './workbookChallenge.css';

const TITLES={alphabet:'بازی تشخیص حروف',sounds:'بازی تلفظ و استثناها',
 verbs:'چالش صرف افعال',dialog:'بازی جمله و مکالمه',checkpoint:'آزمون جامع هوشمند'};
const ICONS={alphabet:'🔤',sounds:'🎧',verbs:'🧩',dialog:'💬',checkpoint:'🏆'};
const INFO={
 alphabet:'به نام حرف گوش بده یا حرف آغاز کلمه را انتخاب کن.',
 sounds:'بین واژه‌های نزدیک گوش کن؛ سپس قوانین تلفظ را تشخیص بده.',
 verbs:'شکل درست فعل را بر اساس ضمیر یا جمله شنیده‌شده پیدا کن.',
 dialog:'معنی جمله را به آلمانی بگو یا جمله شنیده‌شده را تشخیص بده.',
 checkpoint:'ترکیبی از اعداد، حروف، تلفظ، صرف فعل و مکالمه؛ هر بار تازه.'
};
export default function WorkbookChallenge({section,speak=()=>{},memory={},onEvent,onEnd,onClose=()=>{}}){
 const [mode,setMode]=useState('mixed'),[verb,setVerb]=useState('mixed');
 const [questions,setQuestions]=useState(()=>createWorkbookChallenge({section,memory}));
 const [position,setPosition]=useState(0),[chosen,setChosen]=useState(null);
 const [correctCount,setCorrectCount]=useState(0),[done,setDone]=useState(false);
 const [feedback,setFeedback]=useState(readGameFeedbackPreferences);
 const current=questions[position];
 const audio=useQuizQuestionAudio({questionKey:done?null:section+':'+mode+':'+verb+':'+position+':'+current?.id,
   mode:done?null:current?.mode,audio:current?.audio,sound:feedback.sound,speak});
 const isRight=chosen!==null&&chosen===current?.answer;
 const actualCount=Math.min(questions.length,position+Number(chosen!==null));
 const total=questions.length;
 function begin(nextMode=mode,nextVerb=verb){
  setMode(nextMode);setVerb(nextVerb);
  setQuestions(createWorkbookChallenge({section,mode:nextMode,verb:nextVerb,memory}));
  setPosition(0);setChosen(null);setCorrectCount(0);setDone(false);
 }
 function toggle(key){
  const prop=key===GAME_SOUND_KEY?'sound':'haptics';
  setFeedback(prev=>{
   const next=!prev[prop];saveGameFeedbackPreference(key,next);
   return {...prev,[prop]:next};
  });
 }
 function select(value){
  if(chosen!==null||!current)return;
  const correct=value===current.answer;
  setChosen(value);
  if(correct)setCorrectCount(n=>n+1);
  onEvent?.({id:current.id,kind:current.kind,label:current.label,lesson:1,
   correct,feedbackHandled:true});
  giveGameFeedback(correct?'correct':'wrong',feedback);
  // Speak the selected German option, not just the correct answer.
  // This preserves the beep/haptic result without repeating the target twice.
  if(feedback.sound)audio.playChoice(value);
 }
 function advance(){
  if(chosen===null)return;
  if(position===total-1){
   setDone(true);
   onEnd?.(correctCount,total);
   giveGameFeedback('finish',feedback);
  }else{
   const upcoming=questions[position+1];
   audio.playUpcoming(section+':'+mode+':'+verb+':'+(position+1)+':'+upcoming.id,upcoming.audio,upcoming.mode);
   setPosition(p=>p+1);setChosen(null);
  }
 }
 return <QuizFocusShell title={TITLES[section]} onClose={onClose}>
 <div className="wcGame">
  <header className="wcHead">
   <span className="wcMascot" aria-hidden="true">{ICONS[section]||'🧠'}</span>
   <div className="wcHeadText"><span className="wcEyebrow">DEUTSCH · QUIZ · A1.1</span>
    <h3>{TITLES[section]||'تمرین چهارگزینه‌ای'}</h3>
    <p>{INFO[section]}</p>
   </div>
   <div className="wcSoundControls">
    <button type="button" onClick={()=>toggle(GAME_SOUND_KEY)} aria-pressed={feedback.sound}
      aria-label={feedback.sound?'خاموش‌کردن صدا':'روشن‌کردن صدا'}>
     {feedback.sound?<Volume2 size={18}/>:<VolumeX size={18}/>}</button>
    <button type="button" onClick={()=>toggle(GAME_HAPTIC_KEY)}
      aria-label={feedback.haptics?'خاموش‌کردن ویبره':'روشن‌کردن ویبره'}
      aria-pressed={feedback.haptics}>📳</button>
   </div>
  </header>
  {section!=='checkpoint'&&<details className="wcSettings">
   <summary><Shuffle size={15}/> تنظیمات آزمون
    <span>{WB_CHALLENGE_MODES.find(x=>x.id===mode)?.title}{section==='verbs'?' · '+(verb==='mixed'?'هر دو فعل':verb):''}</span></summary>
   <span className="wcSettingLabel">روش تمرین</span>
   <div className="wcModeChoices">
    {WB_CHALLENGE_MODES.map(entry=><button type="button" key={entry.id}
     className={mode===entry.id?'active':''} aria-pressed={mode===entry.id}
     onClick={()=>begin(entry.id,verb)}>{entry.title}</button>)}
   </div>
   {section==='verbs'&&<><span>فعل</span><div className="wcModeChoices">
     {[{id:'mixed',title:'هر دو فعل'},...WB_VERBS.map(v=>({id:v,title:v}))].map(entry=>
      <button type="button" key={entry.id} className={verb===entry.id?'active':''}
       aria-pressed={verb===entry.id} onClick={()=>begin(mode,entry.id)}>{entry.title}</button>)}
   </div></>}
  </details>}
  {done?<div className="wcFinish">
   <GameCelebration correct={correctCount} total={total} caption={TITLES[section]}/>
   <p>{correctCount/total>=.8?'خیلی خوب! در دور بعد سؤال‌ها عوض می‌شوند.':
    'عددها و واژه‌هایی که اشتباه شدند در حافظه ثبت شده‌اند؛ با تکرار بهتر می‌شوند.'}</p>
   <button type="button" className="wcNext" onClick={()=>begin()}>
    <RotateCcw size={18}/> آزمون تازه و تصادفی</button>
  </div>:current?<div className="wcBoard">
   <div className="wcProgressLine"><span>{position+1} / {total} سؤال</span>
    <span><Trophy size={16}/> {correctCount} پاسخ درست</span></div>
   <div className="wcTrack"><span style={{width:(actualCount/total*100)+'%'}}/></div>
   <div className="wcPrompt">
    <span className="wcTag">{current.mode==='listen'?'HÖREN · گوش کن':'LESEN · بخوان'}</span>
    <h4>{current.prompt}</h4>
    {current.mode==='listen'?<div className="wcListenArea">
       <div className="wcListenVisual" aria-hidden="true"><Headphones size={39}/><span>♪</span></div>
       <button className="wcPlay" type="button" onClick={()=>audio.replay()}>
        <Volume2 size={19}/> شنیدن سؤال</button>
       <small>پاسخ را فقط از روی صدا تشخیص بده؛ برای تکرار دوباره بزن.</small>
     </div>:
     current.display?<div className="wcDisplay" lang="de" dir={/^[A-Za-zÄÖÜßäöü]/.test(current.display)?'ltr':'auto'}>
       {current.display}
     </div>:null}
   </div>
   <div className="wcOptions" dir="ltr" role="group" aria-label="پاسخ‌های چهارگزینه‌ای">
    {current.choices.map((option,i)=>{
      const isCorrect=chosen!==null&&option===current.answer;
      const isWrong=chosen!==null&&option===chosen&&option!==current.answer;
      return <button type="button" key={option} disabled={chosen!==null}
       className={isCorrect?'right':isWrong?'wrong':''}
       onClick={()=>select(option)}><small>{'ABCD'[i]}</small>
       <b lang="de">{option}</b>
       {isCorrect?<CheckCircle2 size={19}/>:isWrong?<XCircle size={19}/>:null}</button>;
    })}
   </div>
   {chosen!==null&&<div className={'wcFeedback '+(isRight?'correct':'incorrect')} role="status">
     {isRight?<CheckCircle2 size={23}/>:<XCircle size={23}/>}
     <div><b>{isRight?'Richtig! درست جواب دادی · +۱۰ XP':'Noch einmal! این مورد را مرور کن · +۲ XP'}</b>
      <strong dir="ltr">{current.answer}</strong>
      <small>{current.explanation}</small></div>
     <button type="button" onClick={()=>audio.replay(current.audio||current.answer)}
       aria-label="شنیدن پاسخ درست"><Volume2 size={19}/></button>
    </div>}
   <button type="button" className="wcNext" disabled={chosen===null} onClick={advance}>
     {chosen===null?'یک پاسخ انتخاب کن':position===total-1?'دیدن نتیجه':'سؤال بعدی'}
     <RotateCcw size={16}/></button>
  </div>:<p>سؤالی برای این درس پیدا نشد.</p>}
 </div></QuizFocusShell>;
}
