import React,{useEffect,useMemo,useState} from 'react';
import {ArrowLeft,BookOpen,Check,CheckCircle2,ChevronLeft,Eye,Image as ImageIcon,Layers,Plus,RotateCcw,Search,Volume2,X, XCircle} from 'lucide-react';
import {VOCABULARY_DECKS,vocabularyByLesson,vocabularyStatus,vocabularyQueue} from './lessonVocabularyData.js';
import {nextReview} from './studyEngine.js';
import MnemonicArt from './MnemonicArt.jsx';
import './LessonVocabulary.css';

export const CUSTOM_VOCAB_KEY='dt_vocab_custom_v1';

function getSavedVocabulary(){
 try {
   const data=JSON.parse(localStorage.getItem(CUSTOM_VOCAB_KEY)||'{}');
   return data&&typeof data==='object'&&!Array.isArray(data)?data:{};
 }catch{return {};}
}
function makeCustomCard(lesson,de,fa,index){
 return {id:'vocab-custom:'+lesson+':'+encodeURIComponent(de.normalize('NFC').toLocaleLowerCase('de')),
   lesson,de,fa,position:index+10000,custom:true};
}
function article(text){
 const m=String(text).match(/^(der|die|das)\s+/i);
 return m?m[1].toLowerCase():null;
}
export default function LessonVocabulary({selectedLesson,onNavigate,speak,memory,schedule,setSchedule,onPracticeEvent}){
 const [lesson,setLesson]=useState(()=>Number(selectedLesson)||1);
 const [filter,setFilter]=useState('all');
 const [query,setQuery]=useState('');
 const [showTranslation,setShowTranslation]=useState(false);
 const [queueIds,setQueueIds]=useState([]);
 const [custom,setCustom]=useState(getSavedVocabulary);
 const [editing,setEditing]=useState(false);
 const [newGerman,setNewGerman]=useState('');
 const [newPersian,setNewPersian]=useState('');
 const [sessionDone,setSessionDone]=useState(0);
 const [sessionCorrect,setSessionCorrect]=useState(0);
 const base=vocabularyByLesson(lesson)||VOCABULARY_DECKS[0];
 const added=useMemo(()=>((Array.isArray(custom[lesson])?custom[lesson]:[]).filter(c=>c&&typeof c.de==='string'&&typeof c.fa==='string'&&c.de.trim()&&c.fa.trim())
   .map((c,index)=>makeCustomCard(lesson,c.de.trim(),c.fa.trim(),index))),[custom,lesson]);
 const entries=useMemo(()=>[...base.cards,...added].filter((c,i,arr)=>arr.findIndex(x=>x.de.toLocaleLowerCase('de')===c.de.toLocaleLowerCase('de'))===i),[base,added]);
 const searched=useMemo(()=>entries.filter(c=>!query.trim()||
   [c.de,c.fa].join(' ').toLocaleLowerCase('de').includes(query.trim().toLocaleLowerCase('de'))),[entries,query]);
 const stats=useMemo(()=>{
   const values=entries.map(c=>vocabularyStatus(c,memory,schedule));
   return {all:entries.length,new:values.filter(x=>x==='new').length,weak:values.filter(x=>x==='weak').length,
     learning:values.filter(x=>x==='learning').length,mastered:values.filter(x=>x==='mastered').length,
     due:entries.filter(c=>!schedule[c.id]||schedule[c.id].dueAt<=Date.now()).length};
 },[entries,memory,schedule]);
 const lookup=useMemo(()=>new Map(entries.map(c=>[c.id,c])),[entries]);
 const selectedIds=queueIds.filter(id=>lookup.has(id));
 const current=selectedIds.length?lookup.get(selectedIds[0]):null;
 useEffect(()=>{
   const n=Number(selectedLesson);
   if(n>=1&&n<=12)setLesson(n);
 },[selectedLesson]);
 useEffect(()=>{
   setQueueIds(vocabularyQueue(searched,memory,schedule,filter).map(c=>c.id));
   setShowTranslation(false);setSessionDone(0);setSessionCorrect(0);
 // Deliberate session snapshot: rating one card must not reorder all remaining cards.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[lesson,filter,query,custom]);
 useEffect(()=>{try{localStorage.setItem(CUSTOM_VOCAB_KEY,JSON.stringify(custom));}catch{}},[custom]);
 useEffect(()=>{try{localStorage.setItem('dt_current_vocab_lesson',String(lesson));}catch{}},[lesson]);
 function selectLesson(n){
   setLesson(n);setFilter('all');setQuery('');setEditing(false);setShowTranslation(false);
   onNavigate?.('vocabulary/'+n);
 }
 function next(){
   setQueueIds(prev=>prev.slice(1));setShowTranslation(false);
 }
 function rate(grade){
   if(!current)return;
   setSchedule?.(previous=>({...previous,[current.id]:nextReview(previous[current.id],grade)}));
   const correct=grade!=='again';
   onPracticeEvent?.({id:current.id,kind:'vocab',lesson:current.lesson,label:current.de,correct,grade});
   setSessionDone(v=>v+1);
   if(correct)setSessionCorrect(v=>v+1);
   next();
 }
 function addWord(event){
   event.preventDefault();
   const de=newGerman.trim().slice(0,120),fa=newPersian.trim().slice(0,120);
   if(!de||!fa)return;
   const already=entries.some(c=>c.de.toLocaleLowerCase('de')===de.toLocaleLowerCase('de'));
   if(already)return;
   setCustom(c=>({...c,[lesson]:[...(Array.isArray(c[lesson])?c[lesson]:[]),{de,fa}]}));
   setNewGerman('');setNewPersian('');setFilter('all');setQuery('');
 }
 const pct=stats.all?Math.round(stats.mastered/stats.all*100):0;
 return <div className="lvPage" dir="rtl">
   <header className="lvHero">
     <div className="lvHeroText">
       <span className="lvEyebrow"><ImageIcon size={17}/> WORTSCHATZ · MENSCHEN A1.1</span>
       <h1>لغات هر درس؛ <em>تصویر + صدا + حافظه</em></h1>
       <p>کلمه را ببین، صدایش را گوش بده و معنی فارسی را از حافظه حدس بزن. بعد کارت را برگردان و میزان یادگیری‌ات را ثبت کن.</p>
       <div className="lvHeroMetrics"><span><strong>{VOCABULARY_DECKS.length}</strong> درس</span><span><strong>{stats.all}</strong> واژه در درس انتخابی</span><span><strong>{pct}٪</strong> تسلط پایدار</span></div>
     </div>
     <div className="lvHeroMark" aria-hidden="true"><BookOpen size={51}/><span>A1.1</span></div>
   </header>
   <div className="lvSourceNote"><BookOpen size={17}/> مجموعه فعلی واژگان آموزشیِ منتخب و هم‌موضوع کتاب است؛ کامل‌بودن تمام لغات چاپی کتاب هنوز تأیید نشده. لغات جاافتاده را می‌توانی به مجموعه هر درس اضافه کنی.</div>
   <section className="lvLessonSelect" aria-label="انتخاب درس واژگان">
      <div className="lvSectionHeader"><h2>انتخاب درس</h2><span>بر اساس فهرست رسمی ۱۲ درس Menschen A1.1</span></div>
      <div className="lvLessonGrid">
        {VOCABULARY_DECKS.map(d=><button type="button" key={d.id} className={lesson===d.id?'active':''} onClick={()=>selectLesson(d.id)} aria-pressed={lesson===d.id}>
          <span className="lvLessonNumber">{String(d.id).padStart(2,'0')}</span>
          <span><b>{d.topic}</b><small lang="de" dir="ltr">{d.title}</small><small>{(d.id===lesson?entries.length:d.cards.length)} واژه</small></span>
        </button>)}
      </div>
   </section>
   <section className="lvWorkspace">
     <div className="lvSectionHeader"><div><span className="lvEyebrow">LEKTION {String(lesson).padStart(2,'0')} · SEITEN {base.pages}</span><h2>{base.topic}</h2><p lang="de" dir="ltr">{base.title}</p></div><div className="lvProgressBadge"><strong>{stats.mastered}/{stats.all}</strong><span>کاملاً مسلط</span></div></div>
     <div className="lvProgressBar" role="progressbar" aria-label="درصد لغات مسلط" aria-valuemin="0" aria-valuemax="100" aria-valuenow={pct}><span style={{width:pct+'%'}}/></div>
     <div className="lvFilterRow" role="group" aria-label="فیلتر حافظه واژگان">
       {[['all','همه'],['due','مرور امروز'],['new','جدید'],['weak','ضعیف'],['learning','در حال یادگیری'],['mastered','مسلط']].map(([value,label])=>
         <button type="button" key={value} aria-pressed={filter===value} className={filter===value?'active':''} onClick={()=>setFilter(value)}>{label} <small>{stats[value]}</small></button>)}
     </div>
     <div className="lvToolRow">
       <label className="lvSearch"><Search size={17}/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="جست‌وجو به آلمانی یا فارسی…" aria-label="جست‌وجو"/></label>
       <button className="lvAddButton" type="button" onClick={()=>setEditing(x=>!x)} aria-expanded={editing}><Plus size={17}/> افزودن لغت</button>
     </div>
     {editing&&<form className="lvAddForm" onSubmit={addWord}>
       <label>واژه آلمانی<input lang="de" dir="ltr" value={newGerman} onChange={e=>setNewGerman(e.target.value)} required maxLength={120} placeholder="das Wort"/></label>
       <label>معنی فارسی<input dir="rtl" value={newPersian} onChange={e=>setNewPersian(e.target.value)} required maxLength={120} placeholder="واژه"/></label>
       <button type="submit">افزودن به درس {lesson}</button>
     </form>}
     {current?<div className="lvCardArea">
       <div className="lvCardHeader"><span><Layers size={16}/> {selectedIds.length} کارت در صف · {sessionDone} مرور شده</span><span className={'lvStatus lv-'+vocabularyStatus(current,memory,schedule)}>{
          {new:'جدید',weak:'نیاز به تمرین',learning:'در حال یادگیری',mastered:'مسلط'}[vocabularyStatus(current,memory,schedule)]}</span></div>
       <div className="lvFlashcard">
         <div className="lvArt"><MnemonicArt word={current.de} meaning={current.fa} size={340}/><small>تصویر مفهومی این واژه</small></div>
         <div className="lvCardText">
           <div className="lvWordType">{article(current.de)&&<span className={'lvArticle '+article(current.de)}>{article(current.de)}</span>} <span>Deutsch</span></div>
           <h3 lang="de" dir="ltr">{current.de}</h3>
           <button type="button" className="lvListen" onClick={()=>speak(current.de)}><Volume2 size={20}/> شنیدن تلفظ آلمانی</button>
           <div className="lvAnswer" aria-live="polite">
             {showTranslation?<><span>معنی فارسی</span><strong>{current.fa}</strong><small>آلمانی را دوباره با صدای بلند بگو.</small></>:
               <button type="button" onClick={()=>setShowTranslation(true)}><Eye size={19}/> نمایش معنی فارسی</button>}
           </div>
           {showTranslation?<div className="lvRateButtons">
             <button type="button" onClick={()=>rate('again')} className="lvAgain"><XCircle size={19}/> بلد نبودم</button>
             <button type="button" onClick={()=>rate('hard')}><RotateCcw size={19}/> سخت بود</button>
             <button type="button" onClick={()=>rate('good')}><Check size={19}/> بلد بودم</button>
             <button type="button" onClick={()=>rate('easy')} className="lvEasy"><CheckCircle2 size={19}/> عالی</button>
           </div>:<p className="lvMemoryHint">بعد از دیدن معنی، انتخاب کن چقدر خوب به خاطر داشتی.</p>}
         </div>
       </div>
       <div className="lvCardFooter"><span>«بلد نبودم» حدود ۱۰ دقیقه بعد برمی‌گردد. کارت‌های مسلط فاصله بیشتری می‌گیرند.</span>
         <button type="button" onClick={next}>رد کردن کارت <ArrowLeft size={16}/></button></div>
     </div>:<div className="lvFinished">
       <CheckCircle2 size={43}/>
       <h3>{query?'واژه‌ای مطابق جست‌وجو در صف نیست.':'کارت‌های این نوبت تمام شد!'}</h3>
       <p>{sessionDone} کارت پاسخ داده‌ای؛ {sessionCorrect} پاسخ مثبت ثبت شده است. تسلط واقعی با مرور در روزهای مختلف سنجیده می‌شود.</p>
       <button type="button" onClick={()=>{setQueueIds(vocabularyQueue(searched,memory,schedule,filter).map(c=>c.id));setShowTranslation(false);setSessionDone(0);setSessionCorrect(0);}}>شروع دوباره / تازه‌سازی مرور <RotateCcw size={16}/></button>
     </div>}
   </section>
   <p className="lvEndNote">تلفظ با صدای آلمانی مرورگر پخش می‌شود؛ کارت‌ها و امتیازها در حافظه همین دستگاه ذخیره می‌شوند. برای تهیه نسخه پشتیبان از صفحه پیشرفت استفاده کن.</p>
 </div>;
}
