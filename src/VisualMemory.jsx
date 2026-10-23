import React,{useEffect,useMemo,useState} from 'react';
import {ArrowLeft,BookOpen,Brain,Check,CheckCircle2,Eye,Hash,Headphones,Image as ImageIcon,Pause,Play,RotateCcw,Search,Volume2} from 'lucide-react';
import {nightCandidates} from './nightShiftEngine.js';
import {germanNumber} from './learningData.js';
import {activityItemKey} from './learningMemory.js';
import {shuffleArray} from './studyEngine.js';
import MnemonicArt from './MnemonicArt.jsx';
import {ALPHABET_CARDS,DICTIONARY_STATS,getVisualEntry} from './visualDictionary.js';
import './visualMemory.css';

function buildLibrary({memory,schedule,progress,personalCards}) {
 const baseline=nightCandidates({memory,schedule,progress,personalCards});
 const alphabet=ALPHABET_CARDS.map(x=>({id:'alphabet:'+x.letter,source:'alphabet',kind:'alphabet',group:'alphabet',letter:x.letter,prompt:'حرف «'+x.letter+'»؛ واژه نمونه آلمانی را به خاطر بیاور.',answer:x.example,audio:x.example,note:x.cue,scene:x.scene,lesson:1}));
 const nums=Array.from({length:101},(_,n)=>({
   id:activityItemKey('number',n),source:'numbers',kind:'number',group:'numbers',
   prompt:`عدد ${n}`,answer:germanNumber(n),audio:germanNumber(n),
   number:n,lesson:1,note:'عدد را با دهگان و یکان تصویرسازی کن.'
 }));
 const seen=new Set();
 const numberItems=[...baseline.filter(x=>x.group==='numbers'),...nums];
 const wordItems=baseline.filter(x=>x.group!=='numbers');
 const combined=[];
 const push=item=>{
   if(item && !seen.has(item.id)){combined.push(item);seen.add(item.id);}
 };
 // Two word associations followed by one number: users won't face 101
 // uninterrupted digits before ever reaching useful everyday vocabulary.
 const longest=Math.max(wordItems.length/2,numberItems.length);
 for(let i=0;i<longest+1;i++){
   push(wordItems[i*2]);push(wordItems[i*2+1]);push(numberItems[i]);
   if(i<alphabet.length)push(alphabet[i]);
 }
 return combined;
}
export function visualStatus(item,memory,now=Date.now()) {
 const record=memory?.items?.[item.id];
 if(!record)return 'new';
 if(record.mastery>=80 && record.correct>=3 && record.reviewedDays>=2)return 'mastered';
 if(record.lastCorrect===false || record.mastery<55 || (record.nextAt||Infinity)<=now)return 'weak';
 return 'learning';
}
const filters=[
 ['all','همه'],['weak','نیاز به تمرین'],['new','جدید'],['mastered','مسلط'],
 ['numbers','اعداد'],['alphabet','الفبا'],['vocab','واژه‌ها'],['verbs','صرف فعل']
];
export default function VisualMemory({speak,memory,schedule,progress,personalCards,onPracticeEvent,setTab}){
 const [filter,setFilter]=useState('all');
 const [search,setSearch]=useState('');
 const [index,setIndex]=useState(0);
 const [reveal,setReveal]=useState(false);
 const [mode,setMode]=useState('learn');
 const library=useMemo(()=>buildLibrary({memory,schedule,progress,personalCards}),[memory,schedule,progress,personalCards]);
 const filtered=useMemo(()=>{
  const text=search.trim().toLocaleLowerCase('de');
  return library.filter(x=>{
    const state=visualStatus(x,memory);
    const inGroup=filter==='all' || filter===state ||
      (filter==='numbers'&&x.group==='numbers') ||
      (filter==='alphabet'&&x.group==='alphabet') ||
      (filter==='vocab'&&x.group!=='numbers'&&x.group!=='verbs'&&x.group!=='alphabet') ||
      (filter==='verbs'&&x.group==='verbs');
    return inGroup && (!text || [x.prompt,x.answer,x.note].join(' ').toLocaleLowerCase('de').includes(text));
  });
 },[library,filter,search,memory]);
 const current=filtered[index%filtered.length];
 const entry=current?getVisualEntry(current.answer,{number:current.group==='numbers'?current.number:null,letter:current.letter,prompt:current.prompt,meaning:current.prompt}):null;
 useEffect(()=>{setIndex(0);setReveal(false);},[filter,search]);
 const stats=useMemo(()=>({
   known:library.filter(x=>visualStatus(x,memory)==='mastered').length,
   weak:library.filter(x=>visualStatus(x,memory)==='weak').length,
   unseen:library.filter(x=>visualStatus(x,memory)==='new').length
 }),[library,memory]);
 function next(){setIndex(i=>(i+1)%filtered.length);setReveal(false);}
 function rate(correct){
  if(!current)return;
  onPracticeEvent({id:current.id,kind:current.kind,correct,
    label:current.answer,lesson:current.lesson,quiet:true});
  next();
 }
 return <main className="vmPage">
   <header className="vmHero">
      <span className="vmEyebrow"><ImageIcon size={17}/> VISUAL MEMORY STUDIO</span>
      <h1>یادسپاری با <em>صدا + تصویر + واژه</em></h1>
      <p>دیکشنری تصویری معناگرا برای حروف، اعداد و کلمات؛ تصویر را ببین، پاسخ را به یاد بیاور، تلفظ را بشنو و میزان تسلطت را ثبت کن.</p>
      <div className="vmStats"><span><b>{stats.unseen}</b>جدید</span><span><b>{stats.weak}</b>نیازمند مرور</span><span><b>{stats.known}</b>مسلط</span></div>
   </header>
   <div className="vmToolbar">
     <div className="vmFilters" role="group" aria-label="دسته‌بندی کلمات">
       {filters.map(([id,title])=><button aria-pressed={filter===id} className={filter===id?'active':''}
         onClick={()=>setFilter(id)} key={id}>{title}</button>)}
     </div>
     <label className="vmSearch"><Search size={17}/><input placeholder="جست‌وجوی کلمه..." value={search}
       onChange={e=>setSearch(e.target.value)}/></label>
   </div>
   {current?<section className="vmTrainer">
     <div className="vmHeader"><span>{(index%filtered.length+1).toLocaleString('fa-IR')} از {filtered.length.toLocaleString('fa-IR')}</span><span className={'vmState '+visualStatus(current,memory)}>{({weak:'نیاز به تمرین',new:'جدید',mastered:'مسلط',learning:'در حال یادگیری'})[visualStatus(current,memory)]}</span></div>
     <div className="vmCard">
       <div className="vmIllustration"><MnemonicArt number={current.group==='numbers'?(Number.isInteger(current.number)?current.number:Number(current.prompt.match(/\d+/)?.[0])):null}
         word={current.answer} prompt={current.prompt} meaning={current.prompt} letter={current.letter} showLabel={reveal} /></div>
       <div className="vmContent">
         <span className="vmQuestionType">یادآوری فعال • Active Recall</span>
         <h2>{reveal?<span dir="ltr">{current.answer}</span>:current.prompt}</h2>
         {reveal?<><p>{current.note||entry?.cue||'معنی این تصویر را با واژه آلمانی پیوند بده.'}</p>
           <button className="vmListen" onClick={()=>speak(current.audio||current.answer)}><Volume2 size={19}/> تلفظ آلمانی</button>
           <div className="vmRatings"><button onClick={()=>rate(false)}><RotateCcw size={18}/> نیاز به تمرین</button>
             <button onClick={()=>rate(true)}><Check size={18}/> بلد بودم</button></div>
         </>:<>
           <p>{entry?.kind==='conjugation'?'تصویر فعل و نشان ضمیر را ببین و شکل صرف‌شده را حدس بزن.':'تصویر و معنی را به هم وصل کن و قبل از دیدن پاسخ، آلمانی آن را بلند بگو.'}</p>
           <button className="vmReveal" onClick={()=>setReveal(true)}><Eye size={19}/> نمایش پاسخ</button>
         </>}
       </div>
     </div>
     <div className="vmFooter"><span>هر جواب، حافظه مرور تو را بهتر تنظیم می‌کند.</span>
       <button onClick={next}>رد کردن / بعدی <ArrowLeft size={16}/></button></div>
   </section>:<div className="vmEmpty"><CheckCircle2 size={34}/><p>در این گروه هنوز کارتی وجود ندارد.</p><button onClick={()=>setFilter('all')}>نمایش همه کارت‌ها</button></div>}
   <div className="vmNightLink"><span>🌙</span><div><b>مرور تصویری پیش از خواب</b><p>شب‌ها تصاویر و تلفظ‌ها را آرام و پشت‌سرهم مرور کن.</p></div><button onClick={()=>setTab('night')}>شیفت شب <ArrowLeft size={17}/></button></div>
   <p className="vmDisclaimer">دیکشنری شامل {DICTIONARY_STATS.alphabet} حرف و نماد، {DICTIONARY_STATS.numbers} عدد و {DICTIONARY_STATS.words} مدخل واژگانی و جمله است. نشانه‌های معناییِ واژه‌های انتزاعی، بازنمایی نمادین‌اند و جایگزین فهم کاربرد جمله نمی‌شوند.</p>
 </main>;
}
