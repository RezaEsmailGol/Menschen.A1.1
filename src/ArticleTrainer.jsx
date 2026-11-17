import React,{useMemo,useRef,useState} from 'react';
import {BookOpen,Brain,Check,RotateCcw,Volume2,ArrowLeft,Trophy,Star} from 'lucide-react';
import {articleModes,articleStats,articleRound,articleStatus,articleEvent,articleAnswerCorrect,nounPool} from './articleTrainerEngine.js';
import {CASE_FORMS} from './articleNouns.js';
import LessonSceneArt,{hasLessonScene} from './LessonSceneArt.jsx';
import './articleTrainer.css';

const names={new:'جدید',weak:'نیاز به مرور',learning:'در حال یادگیری',mastered:'مسلط'};
const scopes=[['5-6','درس ۵ و ۶ · تمرکز اصلی'],['5','درس ۵ · اشیا'],['6','درس ۶ · دفتر کار'],['4','درس ۴ · مبلمان'],['core','فهرست اصلی (۳۵ اسم)'],['all','همه ۴۵ اسم']];
const colors={der:'masculine',die:'feminine',das:'neuter'};
const accusativeStages=[
 {id:'acc-def',title:'مرحله ۱',label:'der Laptop → den Laptop',hint:'حرف تعریف معین'},
 {id:'acc-ind',title:'مرحله ۲',label:'ein Laptop → einen Laptop',hint:'حرف تعریف نامعین'},
 {id:'acc-neg',title:'مرحله ۳',label:'kein Laptop → keinen Laptop',hint:'حرف تعریف منفی'}
];
function transformedPhrase(q){
 const f=CASE_FORMS[q.noun.article],name=q.noun.noun;
 if(q.mode==='acc'||q.mode==='neg')return q.example;
 if(q.mode==='acc-def')return q.noun.word+' → '+f.def+' '+name;
 if(q.mode==='acc-ind')return f.nomInd+' '+name+' → '+f.ind+' '+name;
 if(q.mode==='acc-neg')return f.nomNeg+' '+name+' → '+f.neg+' '+name;
 if(q.mode==='dat-def')return q.noun.word+' → '+f.datDef+' '+name;
 if(q.mode==='dat-ind')return f.nomInd+' '+name+' → '+f.datInd+' '+name;
 if(q.mode==='dat-neg')return f.nomNeg+' '+name+' → '+f.datNeg+' '+name;
 return q.noun.word+' → '+f.ind+' '+name;
}
function Art({noun,revealed=false}){
 return <div className="atArt">{hasLessonScene(noun.word)?<LessonSceneArt word={revealed?noun.word:noun.noun} showArticle={revealed} size={240}/>:<span role="img" aria-label={noun.fa}>{noun.icon}</span>}</div>;
}
export default function ArticleTrainer({memory={},speak,onPracticeEvent=()=>{}}){
 const [scope,setScope]=useState('5-6'),[mode,setMode]=useState('acc-def'),[filter,setFilter]=useState('all');
 const [view,setView]=useState('learn'),[queue,setQueue]=useState([]),[at,setAt]=useState(0);
 const [input,setInput]=useState(''),[judged,setJudged]=useState(null),[results,setResults]=useState([]);
 const [search,setSearch]=useState(''),[showColor,setShowColor]=useState(true);
 const submitted=useRef(false);
 const pool=useMemo(()=>nounPool(scope),[scope]);
 const stats=articleStats(pool,memory,mode);
 const accusativeProgress=accusativeStages.map(stage=>({...stage,stats:articleStats(pool,memory,stage.id)}));
 const q=queue[at],finished=view==='quiz'&&at>=queue.length;
 function reset(){setView('learn');setQueue([]);setAt(0);setInput('');setJudged(null);setResults([]);submitted.current=false;}
 function begin(retry=null,exam=false){
  const next=retry||articleRound({scope,mode,filter:exam?'all':filter,memory,count:exam?pool.length:12});
  if(!next.length)return;
  setQueue(next);setAt(0);setInput('');setResults([]);setJudged(null);submitted.current=false;setView('quiz');
 }
 function judge(value){
  if(!q||submitted.current||!String(value).trim())return;
  submitted.current=true;
  const correct=articleAnswerCorrect(q,value);
  setJudged({correct,value});setResults(prev=>[...prev,{question:q,correct}]);
  onPracticeEvent(articleEvent(q,correct));
 }
 function next(){if(!judged)return;setAt(i=>i+1);setInput('');setJudged(null);submitted.current=false;}
 const wins=results.filter(x=>x.correct).length;
 const misses=results.filter(x=>!x.correct).map(x=>x.question);
 const filtered=pool.filter(n=>(filter==='all'||articleStatus(n,memory,mode)===filter)&&(!search||[n.word,n.fa,n.plural].join(' ').toLowerCase().includes(search.toLowerCase())));
 return <main className="atRoot" dir="rtl">
  <header className="atHero"><small>AKKUSATIV QUEST · LEKTION 5–6</small><h1>بازی آرتیکل‌ها و Akkusativ</h1><p>تمرکز اصلی: den، einen، keinen، eine و ساختن جمله با مفعول مستقیم.</p><div className="atLegend"><span className="masculine">der · مذکر</span><span className="feminine">die · مؤنث</span><span className="neuter">das · خنثی</span></div></header>
  <section className="atPanel">
   <div className="atStats">{['new','weak','learning','mastered'].map(k=><div key={k}><strong>{stats[k]}</strong><small>{names[k]}</small></div>)}</div>
   <div className="atTrack"><i style={{width:(stats.total?100*stats.mastered/stats.total:0)+'%'}}/></div>
   <p className="atNote">تسلط هر مهارت جداگانه ثبت می‌شود؛ پاسخ فوری یا مرور تصویری به‌تنهایی معیار تسلط نیست. تمرین موفق در روزهای مختلف لازم است.</p>
   <div className="atSelectors"><label>محدوده درس<select value={scope} onChange={e=>{reset();setScope(e.target.value);setFilter('all')}}>{scopes.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><label>نوع تمرین<select value={mode} onChange={e=>{reset();setMode(e.target.value);setFilter('all')}}>{articleModes.filter(m=>!m.id.startsWith('dat-')).map(m=><option key={m.id} value={m.id}>{m.title}</option>)}</select></label></div>
   <p className="atNote">{articleModes.find(m=>m.id===mode).detail}</p>
   <section className="atAkkJourney" aria-label="مسیر بازی آکوزاتیو">
    <div className="atAkkHeading"><div><small>AKKUSATIV QUEST · سه مرحله</small><h2>ماموریت تبدیل آرتیکل‌ها</h2></div><span><Trophy size={18}/> پیشرفت هر مهارت جداگانه ثبت می‌شود</span></div>
    <div className="atAkkStages">{accusativeProgress.map(stage=><button type="button" key={stage.id} className={'atAkkStage'+(mode===stage.id?' active':'')} aria-pressed={mode===stage.id} onClick={()=>{reset();setMode(stage.id);setFilter('all')}}>
      <span className="atAkkStageTop"><b>{stage.title}</b><small>{stage.stats.mastered}/{stage.stats.total} مسلط</small></span>
      <strong dir="ltr">{stage.label}</strong><small>{stage.hint}</small>
      <span className="atAkkMiniTrack"><i style={{width:(stage.stats.total?100*stage.stats.mastered/stage.stats.total:0)+'%'}}/></span>
      {stage.stats.mastered===stage.stats.total&&stage.stats.total>0?<span className="atAkkDone"><Star size={14} fill="currentColor"/> کامل شد</span>:null}
    </button>)}</div>
    <p className="atNote">هر مرحله تا ۱۲ سؤال دارد. جواب اشتباه دوباره در مرور می‌آید. در درس ۵ کتاب، معرفی اشیا با Nominativ است؛ این مسیر تمرین تکمیلی کلاس برای Akkusativ است و درس ۶ آن را به‌صورت مستقیم تمرین می‌کند.</p>
   </section>
   <section className="atPronounPanel">
    <div><h2>ضمیرهای مفعولی در Akkusativ</h2><p className="atNote">این تبدیل‌ها را همراه فعل‌های دیدن و شنیدن تمرین کن.</p></div>
    <div className="atTable"><table dir="ltr"><thead><tr><th>Nominativ</th><th>Akkusativ</th><th>Beispiel</th></tr></thead><tbody>
     {[
      ['ich','mich','Sie sieht mich.'],['du','dich','Ich sehe dich.'],['er','ihn','Ich sehe ihn.'],['sie','sie','Ich höre sie.'],['es','es','Ich sehe es.'],['wir','uns','Er besucht uns.'],['ihr','euch','Ich höre euch.'],['sie','sie','Ich sehe sie.'],['Sie','Sie','Ich höre Sie.']
     ].map(([n,a,e],i)=><tr key={i}><td>{n}</td><td><b>{a}</b></td><td>{e}</td></tr>)}
    </tbody></table></div>
   </section>
   <div className="atFilters">{[['all','همه'],...Object.entries(names)].map(([id,label])=><button type="button" key={id} aria-pressed={id===filter} className={id===filter?'active':''} onClick={()=>{reset();setFilter(id)}}>{label}</button>)}</div>
   <div className="atActions"><button onClick={()=>begin()} disabled={!(filter==='all'?pool.length:stats[filter])}><Brain size={18}/> تمرین تطبیقی (تا ۱۲ سؤال)</button><button className="atSecondary" onClick={()=>begin(null,true)}>آزمون کامل {pool.length} اسم</button><button className="atSecondary" onClick={reset}><BookOpen size={18}/> واژه‌نامه</button></div>
  </section>
  {view==='learn'&&<section className="atPanel">
   <h2>واژه‌نامه تصویری</h2><p className="atNote">Sofa و Couch معنی نزدیک، اما جنسیت متفاوت دارند: das Sofa / die Couch.</p>
   <div className="atLearnControls"><input type="search" aria-label="جستجوی اسم" placeholder="جستجوی اسم یا معنی..." value={search} onChange={e=>setSearch(e.target.value)}/><label><input type="checkbox" checked={showColor} onChange={e=>setShowColor(e.target.checked)}/> رنگ جنسیت</label></div>
   <div className="atGrid">{filtered.map(n=><article className={'atCard '+(showColor?colors[n.article]:'')} key={n.noun}>
    <Art noun={n} revealed={showColor}/><div className="atCardName" dir="ltr"><b>{n.word}</b><button onClick={()=>speak(n.word)} aria-label={'تلفظ '+n.word}><Volume2 size={18}/></button></div>
    <p>{n.fa}</p><small dir="ltr">die {n.plural}</small><span className="atStatus">{names[articleStatus(n,memory,mode)]}</span>
   </article>)}</div>{!filtered.length&&<p>در این گروه کارتی وجود ندارد.</p>}
  </section>}
  {view==='quiz'&&!finished&&q&&<section className="atPanel atQuiz" key={q.id}>
    <div className="atQuizTop"><span>سؤال {at+1} از {queue.length}</span><span>{wins} پاسخ درست</span></div>
    <div className="atTrack"><i style={{width:100*at/queue.length+'%'}}/></div>
    <Art noun={q.noun} revealed={Boolean(judged)}/>
    <p>{q.noun.fa}</p><h2 dir={['nom','acc','acc-def','acc-ind','acc-neg','neg'].includes(q.mode)?'ltr':'rtl'}>{q.prompt}</h2>
    {!['write','nom','acc','neg'].includes(q.mode)&&<strong className="atNoun" dir="ltr">{q.noun.noun}</strong>}
    {q.options?<div className="atOptions">{q.options.map(a=><button dir="ltr" key={a} disabled={Boolean(judged)} className={judged?(a===q.answer?'right':a===judged.value?'wrong':''):''} onClick={()=>judge(a)}>{a}</button>)}</div>:
     <form className="atTyping" onSubmit={e=>{e.preventDefault();judge(input)}}><input dir="ltr" lang="de" autoCorrect="off" autoCapitalize="off" spellCheck={false} placeholder="Artikel + Nomen" value={input} disabled={Boolean(judged)} onChange={e=>setInput(e.target.value)}/><div>{['ä','ö','ü','ß','Ä','Ö','Ü'].map(c=><button key={c} type="button" disabled={Boolean(judged)} onClick={()=>setInput(s=>s+c)}>{c}</button>)}</div><button type="submit" disabled={Boolean(judged)||!input.trim()}>بررسی پاسخ</button></form>}
    {judged&&<div className={'atFeedback '+(judged.correct?'right':'wrong')} role="status">
     <b>{judged.correct?'درست!':'اشتباه؛ این مورد به مرور برمی‌گردد.'}</b><strong dir="ltr">{q.example}</strong><span dir="ltr">{transformedPhrase(q)}</span>
     <button type="button" onClick={()=>speak(q.audio)}><Volume2 size={18}/> تلفظ پاسخ</button><button type="button" onClick={next}>سؤال بعد <ArrowLeft size={17}/></button>
    </div>}
  </section>}
  {finished&&<section className="atPanel atDone"><h2>نتیجه دور تمرین</h2><strong>{wins} / {queue.length}</strong><p>دقت دور: {Math.round(100*wins/queue.length)}٪ · {misses.length} مورد اشتباه</p>{misses.length>0&&<><p dir="ltr">{misses.map(x=>x.noun.word).join(' · ')}</p><button onClick={()=>begin(misses)}><RotateCcw size={18}/> فقط اشتباه‌ها را دوباره تمرین کن</button></>}<button className="atSecondary" onClick={reset}>بازگشت به واژه‌نامه</button></section>}
  {(view==='learn'||finished)&&<section className="atPanel"><h2>جدول طلایی Nominativ → Akkusativ</h2><div className="atTable"><table dir="ltr"><thead><tr><th>Gender</th><th>Nominativ</th><th>Akkusativ · معین</th><th>Akkusativ · نامعین</th><th>Akkusativ · منفی</th></tr></thead><tbody>
   <tr className="masculine"><th>m</th><td>der</td><td><b>den</b></td><td><b>einen</b></td><td><b>keinen</b></td></tr>
   <tr className="feminine"><th>f</th><td>die</td><td>die</td><td>eine</td><td>keine</td></tr>
   <tr className="neuter"><th>n</th><td>das</td><td>das</td><td>ein</td><td>kein</td></tr>
   <tr><th>pl</th><td>die</td><td>die</td><td>—</td><td>keine</td></tr>
  </tbody></table></div><p className="atNote">قانون مهم: در Akkusativ مفرد فقط مذکر تغییر می‌کند: der → den، ein → einen، kein → keinen. مؤنث و خنثی شکل خودشان را حفظ می‌کنند؛ در جمع منفی از keine استفاده می‌کنیم.</p><p className="atDativeRule"><b>مثال‌های کتاب و کلاس:</b> <strong dir="ltr">Ich brauche einen Laptop. · Ich suche den Kalender. · Ich habe keine Maus. · Ich brauche ein Handy. · Ich brauche keine Briefmarken.</strong></p></section>}
 </main>;
}
