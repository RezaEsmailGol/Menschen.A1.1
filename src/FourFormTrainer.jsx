import React,{useRef,useState} from 'react';
import {ArrowLeft,CheckCircle2,XCircle,Trophy,Volume2,RotateCcw,BookOpen} from 'lucide-react';
import LessonSceneArt from './LessonSceneArt.jsx';
import {FOUR_FORM_NOUNS,FOUR_FORM_MODES,FOUR_FORM_LABELS,fourFormAnswers,gradeFourForms,fourFormEvents,fourFormProgress} from './fourFormNouns.js';
import './fourFormNouns.css';

const blank=()=>({article:'',plural:'',positive:'',negative:''});
const pack=group=>FOUR_FORM_NOUNS.filter(n=>group==='all'||n.group===group);
const fa=n=>Number(n).toLocaleString('fa-IR');
export default function FourFormTrainer({speak,onPracticeEvent,memory={}}){
 const [group,setGroup]=useState('office'),[queue,setQueue]=useState(()=>pack('office'));
 const [index,setIndex]=useState(0),[answers,setAnswers]=useState(blank);
 const [result,setResult]=useState(null),[round,setRound]=useState([]),[summary,setSummary]=useState(false);
 const guard=useRef(false);
 const noun=queue[index],progress=fourFormProgress(memory),points=round.reduce((n,r)=>n+r.score,0);
 const mistakes=round.filter(x=>x.score<4).map(x=>x.noun);
 function reset(list){setQueue(list);setIndex(0);setAnswers(blank());setResult(null);setRound([]);setSummary(false);guard.current=false;}
 function changeGroup(value){setGroup(value);reset(pack(value));}
 function check(e){e.preventDefault();if(guard.current||FOUR_FORM_MODES.some(k=>!answers[k].trim()))return;
  guard.current=true;
  const graded=gradeFourForms(noun,answers);setResult(graded);
  setRound(old=>[...old,{noun,score:graded.filter(x=>x.correct).length}]);
  fourFormEvents(noun,answers).forEach(event=>onPracticeEvent?.(event));
 }
 function next(){if(index+1===queue.length){setSummary(true);return;}
  setIndex(i=>i+1);setAnswers(blank());setResult(null);guard.current=false;
 }
 function field(mode,prefix,placeholder){return <label className="ffField">
  <span>{FOUR_FORM_LABELS[mode]}</span>
  <span className="ffInputRow" dir="ltr"><b>{prefix}</b><input lang="de" dir="ltr" value={answers[mode]} disabled={!!result}
   aria-label={FOUR_FORM_LABELS[mode]} autoComplete="off" autoCapitalize="off" spellCheck={false}
   placeholder={placeholder} onChange={e=>setAnswers(a=>({...a,[mode]:e.target.value}))}/></span>
  </label>;}
 return <section id="four-form" className="ffRoot" dir="rtl" aria-label="تمرین چهارحالتی اسم‌ها">
  <header className="ffHeading"><BookOpen size={26}/><div><small>LEKTION 6 · ARTIKEL &amp; PLURAL</small><h3>چالش چهارحالتی اسم‌ها</h3>
    <p>مفرد، جمع، Akkusativ مثبت و منفی را با هم یاد بگیر.</p></div></header>
  <div className="ffStats"><span><b>{fa(progress.allCorrect)} / ۲۵</b> اسم با چهار پاسخ صحیح اخیر</span><span><b>{fa(progress.correct)} / {fa(progress.total)}</b> پاسخ صحیح اخیر</span></div>
  <div className="ffSkills">{FOUR_FORM_MODES.map(mode=><span key={mode}>{FOUR_FORM_LABELS[mode]} <b>{fa(progress.counts[mode])}/۲۵</b></span>)}</div>
  <label className="ffPack">مجموعه تمرین <select value={group} onChange={e=>changeGroup(e.target.value)}><option value="office">درس ۶ · ۱۵ واژه</option><option value="review">مرور درس‌های ۱ تا ۵ · ۱۰ واژه</option><option value="all">همه ۲۵ واژه</option></select></label>
  {summary?<div className="ffSummary">
   <Trophy size={38}/><h4>نتیجه این دور: {fa(points)} از {fa(queue.length*4)}</h4>
   <p>{fa(queue.length-mistakes.length)} اسم را در هر چهار حالت درست پاسخ دادی.</p>
   {mistakes.length>0&&<><p>واژه‌های نیازمند مرور: <span dir="ltr">{mistakes.map(n=>n.word).join(' · ')}</span></p><button type="button" onClick={()=>reset(mistakes)}>مرور فقط اشتباهات <RotateCcw size={17}/></button></>}
   <button type="button" onClick={()=>reset(pack(group))}>شروع دوباره مجموعه</button>
  </div>:<>
   <div className="ffRound"><span>واژه {fa(index+1)} از {fa(queue.length)}</span><span>{fa(points)} امتیاز از {fa(round.length*4)}</span></div>
   <div className="ffTrack" role="progressbar" aria-label="پیشرفت دور تمرین" aria-valuemax={queue.length} aria-valuemin={0} aria-valuenow={round.length}><i style={{width:round.length/queue.length*100+'%'}}/></div>
   <div className="ffWord"><LessonSceneArt word={noun.word} showArticle={false} size={145}/><div><b lang="de" dir="ltr">{noun.word}</b><span>{noun.fa}</span><button type="button" onClick={()=>speak?.(noun.word)}><Volume2 size={17}/> تلفظ واژه</button></div></div>
   <form onSubmit={check} className="ffForm">
    <fieldset disabled={!!result}><legend>۱. آرتیکل درست را انتخاب کن</legend><div className="ffChoices" dir="ltr">{['der','die','das'].map(article=><button key={article} type="button" aria-pressed={answers.article===article} onClick={()=>setAnswers(a=>({...a,article}))}>{article}</button>)}</div></fieldset>
    {field('plural','die','Plural …')}
    {field('positive','Ich brauche','…')}
    {field('negative','Ich habe','…')}
    <small>در دو جمله آخر عبارت کامل شامل آرتیکل و اسم را بنویس. حروف بزرگ اسم‌ها و Umlaut را رعایت کن.</small>
    {!result&&<button className="ffPrimary" type="submit" disabled={FOUR_FORM_MODES.some(k=>!answers[k].trim())}>بررسی هر چهار پاسخ</button>}
   </form>
   {result&&<div className="ffResults" role="status"><h4>{fa(result.filter(x=>x.correct).length)} از ۴ صحیح · {fa(result.reduce((n,x)=>n+(x.correct?10:2),0))} XP</h4>
    {result.map(r=><div className={'ffResult '+(r.correct?'ok':'bad')} key={r.mode}>
     {r.correct?<CheckCircle2 size={18}/>:<XCircle size={18}/>}<span>{FOUR_FORM_LABELS[r.mode]}</span>
     <b dir="ltr">{r.mode==='article'?r.expected+' '+noun.word:r.mode==='plural'?'die '+r.expected:r.expected}</b></div>)}
    <p>{noun.article==='der'?'مذکر: ein → einen و kein → keinen در Akkusativ.':noun.article==='die'?'مؤنث: eine و keine در Akkusativ تغییر نمی‌کنند.':'خنثی: ein و kein در Akkusativ تغییر نمی‌کنند.'}</p>
    <div className="ffActions"><button type="button" onClick={()=>{const a=fourFormAnswers(noun);speak?.(a.article+' '+noun.word+'. die '+a.plural+'. Ich brauche '+a.positive+'. Ich habe '+a.negative+'.');}}><Volume2 size={17}/> شنیدن چهار شکل</button><button className="ffPrimary" type="button" onClick={next}>{index+1===queue.length?'نتیجه دور':'واژه بعدی'} <ArrowLeft size={17}/></button></div></div>}
  </>}
 </section>;
}
