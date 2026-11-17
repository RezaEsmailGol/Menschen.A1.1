import React,{useMemo,useState} from 'react';
import {BookOpen,CheckCircle2,RotateCcw,Volume2,Shuffle,Trophy,ArrowLeft} from 'lucide-react';
import {activityItemKey} from './learningMemory.js';
import {getVerbForms,pronouns,verbGroups,verbInfo} from './verbTrainerData.js';
import './verbTrainer.css';

function normalize(value){return String(value??'').normalize('NFC').toLocaleLowerCase('de').replace(/[.!?]/g,'').replace(/\s+/g,' ').trim();}

export default function VerbTrainer({speak=()=>{},onPracticeEvent=()=>{},memory={}}){
 const [group,setGroup]=useState('lesson56');
 const groupData=verbGroups.find(item=>item.id===group)||verbGroups[0];
 const [verb,setVerb]=useState('sehen');
 const [question,setQuestion]=useState(null);
 const [answer,setAnswer]=useState('');
 const [judged,setJudged]=useState(null);
 const [score,setScore]=useState({correct:0,total:0});
 const [mix,setMix]=useState(false);
 const verbs=useMemo(()=>groupData.verbs.filter(v=>verbInfo[v]&&getVerbForms(v)),[groupData]);
 const currentVerb=verbs.includes(verb)?verb:verbs[0];
 const info=verbInfo[currentVerb];
 const forms=getVerbForms(currentVerb)||{};
 const currentForms=question?getVerbForms(question.verb):forms;
 const currentInfo=question?verbInfo[question.verb]:info;
 const progress=Object.keys(memory.items||{}).filter(key=>key.includes(':grammar:')).length;

 function chooseGroup(id){
  setGroup(id);
  const next=verbGroups.find(x=>x.id===id)?.verbs?.[0]||'sehen';
  setVerb(next);
  setQuestion(null);setAnswer('');setJudged(null);setMix(false);
 }
 function startQuiz(mixed=false){
  const pool=mixed?verbs:[currentVerb];
  const selected=pool[Math.floor(Math.random()*pool.length)]||currentVerb;
  const person=pronouns[Math.floor(Math.random()*pronouns.length)];
  setQuestion({verb:selected,person});
  setAnswer('');setJudged(null);setMix(mixed);
 }
 function check(){
  if(!question||judged||!answer.trim())return;
  const expected=getVerbForms(question.verb)?.[question.person];
  const correct=normalize(answer)===normalize(expected);
  setJudged({correct,expected});
  setScore(prev=>({correct:prev.correct+(correct?1:0),total:prev.total+1}));
  const lesson=verbInfo[question.verb]?.lesson||6;
  onPracticeEvent({id:activityItemKey('grammar',question.verb,question.person),kind:'grammar',lesson,label:question.verb+' / '+question.person,correct});
 }
 function next(){startQuiz(mix);}

 return <main className="verbTrainer" dir="rtl">
  <header className="vtHero">
   <small>MENSCHEN A1.1 · VERB TRAINER</small>
   <h1>باشگاه صرف افعال</h1>
   <p>فعل را انتخاب کن، صرف هر شش ضمیر را ببین و بعد بدون نگاه کردن جواب بده.</p>
   <div className="vtHeroStats"><span><Trophy size={16}/> {score.correct} پاسخ درست</span><span><BookOpen size={16}/> {verbs.length} فعل در این مسیر</span></div>
  </header>

  <section className="vtPanel">
   <div className="vtGroupTabs">{verbGroups.map(item=><button key={item.id} className={group===item.id?'active':''} aria-pressed={group===item.id} onClick={()=>chooseGroup(item.id)}>{item.label}</button>)}</div>
   <label className="vtSelectLabel">فعل مورد تمرین
    <select value={currentVerb} onChange={e=>{setVerb(e.target.value);setQuestion(null);setAnswer('');setJudged(null)}}>{verbs.map(v=><option key={v} value={v}>{v} — {verbInfo[v].fa}</option>)}</select>
   </label>
   <div className="vtVerbTitle">
    <div><small>{info.source}</small><h2 dir="ltr">{currentVerb}</h2><p>{info.fa}</p></div>
    <button type="button" aria-label={'تلفظ '+currentVerb} onClick={()=>speak(currentVerb)}><Volume2/></button>
   </div>
   <div className="vtConjugation" aria-label={'صرف فعل '+currentVerb}>
    {pronouns.map(person=><div className="vtConjRow" key={person}>
     <span dir="ltr">{person}</span><b dir="ltr">{forms[person]}</b>
     <button type="button" aria-label={'تلفظ '+person+' '+forms[person]} onClick={()=>speak(person+' '+forms[person])}><Volume2 size={16}/></button>
    </div>)}
   </div>
   <div className="vtExample"><div><small>Beispiel · مثال</small><b dir="ltr">{info.example}</b><span>{info.exampleFa}</span></div><button type="button" aria-label="پخش مثال" onClick={()=>speak(info.example)}><Volume2/></button></div>
   {info.modal&&<div className="vtModalTip"><b>نکته فعل مُدال</b><span>{info.note}</span><strong dir="ltr">{info.example}</strong></div>}
   <div className="vtActions">
    <button type="button" onClick={()=>startQuiz(false)}><BookOpen size={17}/> تمرین همین فعل</button>
    <button type="button" className="secondary" onClick={()=>startQuiz(true)}><Shuffle size={17}/> آزمون ترکیبی این بخش</button>
   </div>
  </section>

  {question&&<section className="vtPanel vtQuiz" key={question.verb+'-'+question.person}>
   <div className="vtQuizTop"><span>{mix?'آزمون ترکیبی':'تمرین یک فعل'}</span><span>{score.correct} / {score.total} درست</span></div>
   <small>صرف کن</small>
   <h2 dir="ltr">{question.person} + {question.verb}</h2>
   <p>شکل درست فعل برای این ضمیر چیست؟</p>
   <form onSubmit={e=>{e.preventDefault();check()}}>
    <input autoComplete="off" autoCapitalize="off" spellCheck={false} lang="de" dir="ltr" value={answer} disabled={Boolean(judged)} onChange={e=>setAnswer(e.target.value)} placeholder="صرف فعل را بنویس..." />
    <button type="submit" disabled={Boolean(judged)||!answer.trim()}>بررسی پاسخ</button>
   </form>
   {judged&&<div className={'vtFeedback '+(judged.correct?'right':'wrong')} role="status">
    <b>{judged.correct?'درست گفتی!':'هنوز جا نیفتاده؛ دوباره مرورش کن.'}</b>
    <strong dir="ltr">{question.person} {judged.expected}</strong>
    <span dir="ltr">{verbInfo[question.verb].example}</span>
    <button type="button" onClick={next}>سؤال بعدی <ArrowLeft size={16}/></button>
   </div>}
  </section>}

  <section className="vtPanel">
   <h2>ضمیرهای فاعلی و مفعولی</h2>
   <p className="vtMuted">این جدول را کنار Akkusativ نگه دار؛ mich و dich از مهم‌ترین شکل‌هایی هستند که باید حفظ کنی.</p>
   <div className="vtPronounTable"><table dir="ltr"><thead><tr><th>Nominativ</th><th>Akkusativ</th><th>معنی</th></tr></thead><tbody>
    {[
     ['ich','mich','من را'],['du','dich','تو را'],['er','ihn','او را (مذکر)'],['sie','sie','او را (مؤنث)'],['es','es','آن را'],['wir','uns','ما را'],['ihr','euch','شما را (جمع دوستانه)'],['sie','sie','آن‌ها را'],['Sie','Sie','شما را (رسمی)']
    ].map(([n,a,fa],i)=><tr key={i}><td>{n}</td><td><b>{a}</b></td><td>{fa}</td></tr>)}
   </tbody></table></div>
  </section>
 </main>;
}
