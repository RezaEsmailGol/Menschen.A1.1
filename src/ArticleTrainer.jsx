import React,{useMemo,useRef,useState} from 'react';
import {BookOpen,Brain,Check,RotateCcw,Volume2,ArrowLeft} from 'lucide-react';
import {articleModes,articleStats,articleRound,articleStatus,articleEvent,articleAnswerCorrect,nounPool} from './articleTrainerEngine.js';
import {CASE_FORMS} from './articleNouns.js';
import LessonSceneArt,{hasLessonScene} from './LessonSceneArt.jsx';
import './articleTrainer.css';

const names={new:'جدید',weak:'نیاز به مرور',learning:'در حال یادگیری',mastered:'مسلط'};
const scopes=[['core','فهرست اصلی (۳۵ اسم)'],['4','درس ۴ · مبلمان'],['5','درس ۵ · اشیا'],['6','درس ۶ · دفتر کار'],['all','همه ۴۵ اسم']];
const colors={der:'masculine',die:'feminine',das:'neuter'};
function Art({noun,revealed=false}){
 return <div className="atArt">{hasLessonScene(noun.word)?<LessonSceneArt word={revealed?noun.word:noun.noun} showArticle={revealed} size={240}/>:<span role="img" aria-label={noun.fa}>{noun.icon}</span>}</div>;
}
export default function ArticleTrainer({memory={},speak,onPracticeEvent=()=>{}}){
 const [scope,setScope]=useState('core'),[mode,setMode]=useState('gender'),[filter,setFilter]=useState('all');
 const [view,setView]=useState('learn'),[queue,setQueue]=useState([]),[at,setAt]=useState(0);
 const [input,setInput]=useState(''),[judged,setJudged]=useState(null),[results,setResults]=useState([]);
 const [search,setSearch]=useState(''),[showColor,setShowColor]=useState(true);
 const submitted=useRef(false);
 const pool=useMemo(()=>nounPool(scope),[scope]);
 const stats=articleStats(pool,memory,mode);
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
  <header className="atHero"><small>ARTIKEL-TRAINER · LEKTION 4–6</small><h1>باشگاه جنسیت کلمات</h1><p>اسم را همیشه همراه حرف تعریف یاد بگیر. هدف: تشخیص بدون حدس و کاربرد درست در جمله.</p><div className="atLegend"><span className="masculine">der · مذکر</span><span className="feminine">die · مؤنث</span><span className="neuter">das · خنثی</span></div></header>
  <section className="atPanel">
   <div className="atStats">{['new','weak','learning','mastered'].map(k=><div key={k}><strong>{stats[k]}</strong><small>{names[k]}</small></div>)}</div>
   <div className="atTrack"><i style={{width:(stats.total?100*stats.mastered/stats.total:0)+'%'}}/></div>
   <p className="atNote">تسلط هر مهارت جداگانه ثبت می‌شود؛ پاسخ فوری یا مرور تصویری به‌تنهایی معیار تسلط نیست. تمرین موفق در روزهای مختلف لازم است.</p>
   <div className="atSelectors"><label>محدوده درس<select value={scope} onChange={e=>{reset();setScope(e.target.value);setFilter('all')}}>{scopes.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><label>نوع تمرین<select value={mode} onChange={e=>{reset();setMode(e.target.value);setFilter('all')}}>{articleModes.map(m=><option key={m.id} value={m.id}>{m.title}</option>)}</select></label></div>
   <p className="atNote">{articleModes.find(m=>m.id===mode).detail}</p>
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
    <p>{q.noun.fa}</p><h2 dir={['nom','acc','neg'].includes(q.mode)?'ltr':'rtl'}>{q.prompt}</h2>
    {!['write','nom','acc','neg'].includes(q.mode)&&<strong className="atNoun" dir="ltr">{q.noun.noun}</strong>}
    {q.options?<div className="atOptions">{q.options.map(a=><button dir="ltr" key={a} disabled={Boolean(judged)} className={judged?(a===q.answer?'right':a===judged.value?'wrong':''):''} onClick={()=>judge(a)}>{a}</button>)}</div>:
     <form className="atTyping" onSubmit={e=>{e.preventDefault();judge(input)}}><input dir="ltr" lang="de" autoCorrect="off" autoCapitalize="off" spellCheck={false} placeholder="Artikel + Nomen" value={input} disabled={Boolean(judged)} onChange={e=>setInput(e.target.value)}/><div>{['ä','ö','ü','ß','Ä','Ö','Ü'].map(c=><button key={c} type="button" disabled={Boolean(judged)} onClick={()=>setInput(s=>s+c)}>{c}</button>)}</div><button type="submit" disabled={Boolean(judged)||!input.trim()}>بررسی پاسخ</button></form>}
    {judged&&<div className={'atFeedback '+(judged.correct?'right':'wrong')} role="status">
     <b>{judged.correct?'درست!':'اشتباه؛ این مورد به مرور برمی‌گردد.'}</b><strong dir="ltr">{q.example}</strong><span dir="ltr">{q.noun.word} → {CASE_FORMS[q.noun.article].ind} {q.noun.noun}</span>
     <button type="button" onClick={()=>speak(q.audio)}><Volume2 size={18}/> تلفظ پاسخ</button><button type="button" onClick={next}>سؤال بعد <ArrowLeft size={17}/></button>
    </div>}
  </section>}
  {finished&&<section className="atPanel atDone"><h2>نتیجه دور تمرین</h2><strong>{wins} / {queue.length}</strong><p>دقت دور: {Math.round(100*wins/queue.length)}٪ · {misses.length} مورد اشتباه</p>{misses.length>0&&<><p dir="ltr">{misses.map(x=>x.noun.word).join(' · ')}</p><button onClick={()=>begin(misses)}><RotateCcw size={18}/> فقط اشتباه‌ها را دوباره تمرین کن</button></>}<button className="atSecondary" onClick={reset}>بازگشت به واژه‌نامه</button></section>}
  {(view==='learn'||finished)&&<section className="atPanel"><h2>الگوی مهم Nominativ و Akkusativ</h2><div className="atTable"><table dir="ltr"><thead><tr><th>Gender</th><th>Nominativ</th><th>Akkusativ</th><th>Negation (Akk.)</th></tr></thead><tbody>{Object.entries(CASE_FORMS).map(([a,f])=><tr key={a} className={colors[a]}><th>{a}</th><td>{a} / {f.nomInd}</td><td>{f.def} / {f.ind}</td><td>{f.neg}</td></tr>)}</tbody></table></div><p className="atNote">در مفرد Akkusativ فقط مذکر تغییر می‌کند: der → den، ein → einen، kein → keinen. جمع: die / keine.</p></section>}
 </main>;
}
