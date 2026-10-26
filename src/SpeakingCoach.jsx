import React,{useEffect,useMemo,useRef,useState} from 'react';
import {AlertCircle,ArrowLeft,BarChart3,BookOpen,CheckCircle2,ChevronRight,Clock3,Ear,Headphones,
  Mic,MicOff,RotateCcw,ShieldCheck,Shuffle,Sparkles,Volume2,VolumeX} from 'lucide-react';
import {SPEAKING_CATEGORIES,speakingCards,speakingReview,scoreSpeechMatch,
  addSpeechReview,speakingStatus,speakingStats} from './speakingEngine.js';
import {NUMBER_SECTIONS} from './numberSections.js';
import MnemonicArt from './MnemonicArt.jsx';
import './speakingCoach.css';

const statuses={new:'جدید',weak:'نیاز به تمرین',learning:'در حال یادگیری',mastered:'مسلط'};
const fmt=n=>Number(n||0).toLocaleString('fa-IR');
const getRecognition=()=>{
 if(typeof window==='undefined')return null;
 return window.SpeechRecognition||window.webkitSpeechRecognition||null;
};
export default function SpeakingCoach({speak=()=>{},state={},setState=()=>{},progress={},onPracticeEvent=()=>{}}){
 const [category,setCategory]=useState('numbers');
 const [range,setRange]=useState('0-12');
 const [filter,setFilter]=useState('all');
 const [locale,setLocale]=useState('de-DE');
 const [queue,setQueue]=useState([]);
 const [index,setIndex]=useState(0);
 const [result,setResult]=useState(null);
 const [listening,setListening]=useState(false);
 const [error,setError]=useState('');
 const [interim,setInterim]=useState('');
 const recognitionRef=useRef(null);
 const sessionRef=useRef(0);
 const browserSupported=Boolean(getRecognition());
 const cards=useMemo(()=>speakingCards(category,{range,progress}),[category,range,progress]);
 const stats=speakingStats(state);
 const current=queue[index];
 const done=queue.length>0 && index>=queue.length;
 const currentMemory=current ? state?.items?.[current.id] : null;
 const totalCategory=useMemo(()=>speakingStats(state,category),[state,category]);
 const available=cards.filter(c=>filter==='all'||speakingStatus(state?.items?.[c.id])===filter);
 const [ready,setReady]=useState(false);

 function stopListening(invalidate=true){
   if(invalidate)sessionRef.current++;
   const active=recognitionRef.current;
   recognitionRef.current=null;
   if(active){try{active.abort()}catch{}}
   setListening(false);
   setInterim('');
 }
 useEffect(()=>()=>{
   sessionRef.current++;
   try{recognitionRef.current?.abort()}catch{}
   recognitionRef.current=null;
 },[]);
 function resetSession(){
   stopListening();
   setQueue([]);setIndex(0);setResult(null);setError('');setReady(false);
 }
 function chooseCategory(next){
   resetSession();setCategory(next);setFilter('all');
 }
 function startRound(){
   stopListening();
   setError('');
   const chosen=available;
   if(!chosen.length){setError('در این فیلتر هنوز موردی برای تمرین وجود ندارد؛ گزینه «همه» را انتخاب کن.');return;}
   setQueue(speakingReview(chosen,state,Math.min(8,chosen.length)));setIndex(0);
   setResult(null);setReady(true);
 }
 function moveNext(){
   stopListening();setResult(null);setError('');
   setIndex(i=>i+1);
 }
 function hearExample(){
   if(!current)return;
   stopListening();
   speak(current.text);
 }
 function startListening(){
   const Ctor=getRecognition();
   if(!Ctor){setError('این مرورگر تشخیص گفتار آلمانی ندارد. با Chrome اندروید و اتصال اینترنت امتحان کن. می‌توانی نمونه را گوش بدهی و تکرار کنی، اما نمره ساختگی داده نمی‌شود.');return;}
   if(!current)return;
   stopListening();
   setResult(null);setError('');setInterim('');
   // Microphone activation must come directly from this explicit click.
   try{window.speechSynthesis?.cancel()}catch{}
   const identifier=++sessionRef.current;
   let instance;
   try{instance=new Ctor();instance.lang=locale;instance.continuous=false;
    instance.interimResults=true;instance.maxAlternatives=3;}
   catch(e){setError('راه‌اندازی میکروفون ممکن نشد. مجوز میکروفون مرورگر را بررسی کن.');return;}
   recognitionRef.current=instance;
   let captured=false,err=false;
   instance.onresult=e=>{
     if(sessionRef.current!==identifier)return;
     const results=[];
     let live='';
     for(let i=e.resultIndex;i<e.results.length;i++){
       const result=e.results[i];
       if(result.isFinal){
         for(let j=0;j<result.length;j++)if(result[j]?.transcript)results.push(result[j].transcript);
       }else live+=result[0]?.transcript||'';
     }
     if(live)setInterim(live);
     if(!results.length || captured)return;
     captured=true;
     const ranked=results.map(text=>({text,match:scoreSpeechMatch(current.text,text,category)}))
       .sort((a,b)=>b.match.score-a.match.score);
     const best=ranked[0];
     setResult({...best.match,transcript:best.text});
     setListening(false);setInterim('');
     setState(previous=>addSpeechReview(previous,current,best.match,best.text));
     onPracticeEvent({id:'speaking:'+current.id,kind:'speaking',label:current.text,lesson:current.lesson||1,
       correct:best.match.score>=85,quiet:true});
   };
   instance.onerror=e=>{
     if(sessionRef.current!==identifier)return;
     err=true;setListening(false);
     const errors={
      'not-allowed':'مجوز میکروفون بسته است. از تنظیمات Chrome دسترسی Microphone را فعال کن.',
      'service-not-allowed':'سرویس تشخیص گفتار این مرورگر مجاز نیست.',
      'audio-capture':'میکروفون پیدا نشد یا در برنامه دیگری استفاده می‌شود.',
      'network':'سرویس تشخیص گفتار به اینترنت دسترسی ندارد؛ اتصال را بررسی کن.',
      'no-speech':'صدایی شنیده نشد. نزدیک میکروفون واضح‌تر صحبت کن و دوباره تلاش کن.',
      'language-not-supported':'تشخیص آلمانی این مرورگر پشتیبانی نمی‌شود؛ de-DE را امتحان کن.',
      'aborted':'',
     };
     setError(errors[e.error]||'دریافت صدای میکروفون ممکن نشد. دوباره تلاش کن.');
   };
   instance.onend=()=>{
     if(sessionRef.current!==identifier)return;
     recognitionRef.current=null;setListening(false);setInterim('');
     if(!captured&&!err)setError('صدای قابل‌تشخیصی دریافت نشد؛ دوباره امتحان کن.');
   };
   try{instance.start();setListening(true)}
   catch(e){recognitionRef.current=null;setListening(false);setError('شروع ضبط ممکن نشد. از اتصال امن HTTPS و مجوز میکروفون مطمئن شو.');}
 }
 const recent=Object.values(state?.items||{}).filter(x=>x.category===category &&
    (speakingStatus(x)==='weak'||x.avgScore<85))
  .sort((a,b)=>(speakingStatus(a)==='weak'?0:1)-(speakingStatus(b)==='weak'?0:1)||
    (a.avgScore||0)-(b.avgScore||0)).slice(0,5);
 return <div className="scPage">
  <header className="scHero">
   <div><span className="scEyebrow"><Mic size={17}/> SPRECHEN · A1.1</span>
    <h1>مربی تلفظ آلمانی</h1>
    <p>گوش کن، بلند تکرار کن و ببین تشخیص گفتار چقدر از کلماتت را درست متوجه شده است. اشتباه‌ها برای مرور بعدی نگه داشته می‌شوند.</p>
    <div className="scHighlights"><span><Ear size={16}/> گوش دادن</span><span><Mic size={16}/> صحبت کردن</span><span><BarChart3 size={16}/> پیشرفت شخصی</span></div>
   </div><div className="scHeroArt" aria-hidden="true"><Mic size={58}/><span>Hallo!</span></div>
  </header>

  <div className="scStats">
   <div><span>میانگین همخوانی گفتار</span><b>{stats.average===null?'—':fmt(stats.average)+'٪'}</b></div>
   <div><span>تلاش‌های ثبت‌شده</span><b>{fmt(stats.attempts)}</b></div>
   <div><span>نیازمند مرور</span><b>{fmt(stats.weak)}</b></div>
   <div><span>عبارت‌های مسلط</span><b>{fmt(stats.mastered)}</b></div>
  </div>

  <section className="scSection">
   <h2>چه چیزی را تلفظ کنیم؟</h2>
   <div className="scCategories">
    {SPEAKING_CATEGORIES.map(c=><button type="button" key={c.id} className={category===c.id?'selected':''}
       aria-pressed={category===c.id} onClick={()=>chooseCategory(c.id)}>
      <span className="scCategoryIcon">{c.icon}</span><b>{c.title}</b><small>{c.detail}</small></button>)}
   </div>
   {category==='numbers'&&<div className="scNumberRanges" role="group" aria-label="محدوده اعداد">
     {NUMBER_SECTIONS.map(section=><button type="button" key={section.id} className={range===section.id?'selected':''}
       aria-pressed={range===section.id} onClick={()=>{resetSession();setRange(section.id);setFilter('all')}}>{section.label}</button>)}
   </div>}
   {category==='letters'&&<p className="scHint">برای ارزیابی قابل‌اتکاتر، نام هر حرف را همراه نمونه بگو؛ مثلاً <b dir="ltr">A wie Apfel</b>. گفتن تک‌صدای یک حرف معمولاً برای تشخیص خودکار قابل‌اعتماد نیست.</p>}
   <div className="scSectionRow"><div><strong>{fmt(cards.length)} تمرین</strong><span> · {fmt(totalCategory.items)} مورد قبلاً تمرین‌شده</span></div>
      <div className="scFilters" role="group" aria-label="فیلتر مرور">
       {[['all','همه'],['weak','ضعیف'],['new','جدید']].map(([id,title])=><button key={id} type="button"
         className={filter===id?'active':''} aria-pressed={filter===id}
         onClick={()=>{resetSession();setFilter(id)}}>{title}</button>)}
      </div>
   </div>
  </section>

  {!ready&&<section className="scWelcome">
    <div className="scRecordIcon"><Mic size={35}/></div>
    <h2>آماده‌ای تلفظت را تمرین کنی؟</h2>
    <p>در هر دور حداکثر ۸ سؤال داریم. مرور هوشمند، مواردی را که ضعیف‌تر یا موعددار هستند در اولویت قرار می‌دهد.</p>
    <button type="button" onClick={startRound} className="scPrimary"><Shuffle size={19}/> شروع تمرین تصادفی <ArrowLeft size={17}/></button>
    {!browserSupported&&<p className="scWarning"><AlertCircle size={17}/> تشخیص صدا در این مرورگر موجود نیست؛ همچنان می‌توانی نمونه‌ها را گوش کنی، ولی نمره‌ای ثبت نمی‌شود.</p>}
  </section>}

  {ready&&!done&&current&&<section className="scPractice">
    <div className="scPracticeTop"><span>{SPEAKING_CATEGORIES.find(x=>x.id===category)?.title}</span>
      <span>{fmt(index+1)} از {fmt(queue.length)}</span></div>
    <div className="scTrack"><i style={{width:(100*index/queue.length)+'%'}}/></div>
    <div className="scPrompt">
      {category==='numbers'?<div className="scVisual"><MnemonicArt number={current.number}/></div>:
       category==='letters'?<div className="scVisual"><MnemonicArt word={current.text} letter={current.letter}/></div>:null}
      <div className="scPromptLabel">{category==='numbers'?'این عدد را آلمانی بگو':category==='letters'?'نام حرف و واژه نمونه را بگو':'به آلمانی بلند بخوان'}</div>
      <h2 dir="ltr" lang="de">{category==='numbers'?current.label:current.text}</h2>
      <p>{current.meaning}</p>
      {currentMemory&&<span className={'scMemoryState '+speakingStatus(currentMemory)}>وضعیت قبلی: {statuses[speakingStatus(currentMemory)]} · آخرین همخوانی {fmt(currentMemory.lastScore)}٪</span>}
    </div>
    <div className="scActions">
      <button className="scListen" type="button" onClick={hearExample}><Volume2 size={20}/> شنیدن تلفظ نمونه</button>
      <button className={'scMic '+(listening?'recording':'')} type="button"
        disabled={!browserSupported || Boolean(result)} onClick={listening?()=>stopListening():startListening}>
        {listening?<MicOff size={20}/>:<Mic size={20}/>}
        {listening?'توقف میکروفون':'شروع گفتن با میکروفون'}
      </button>
    </div>
    {listening&&<div className="scListening" role="status"><span className="scDot"/> در حال گوش دادن… {interim&&<span dir="ltr">{interim}</span>}</div>}
    {error&&<div className="scError" role="alert"><AlertCircle size={18}/>{error}</div>}
    {result&&<div className="scResult" aria-live="polite">
       <div className="scResultHeading">
         <div><span>میزان همخوانی متن تشخیص‌داده‌شده</span><strong className={result.score>=85?'good':result.score>=65?'mid':'low'}>{fmt(result.score)}٪</strong></div>
         <span className="scResultStatus">{result.score>=85?'خیلی خوب!':result.score>=65?'بد نیست، تمرین کن':'این عبارت را دوباره بگو'}</span>
       </div>
       <div className="scCompare"><div><small>متن درست</small><b dir="ltr" lang="de">{current.text}</b></div>
         <div><small>چیزی که مرورگر شنید</small><b dir="ltr" lang="de">{result.transcript}</b></div></div>
       {result.missing.length>0&&<div className="scMissing"><b>بخش‌هایی که شناسایی نشد:</b> <span dir="ltr">{result.missing.join(' · ')}</span></div>}
       {result.score<85&&<p>نمونه را دوباره گوش کن، آرام و واضح تکرار کن. تشخیص گفتار ممکن است حتی با تلفظ درست هم اشتباه کند.</p>}
    </div>}
    <div className="scNavigation">
     <button type="button" className="scRetry" onClick={()=>{stopListening();setResult(null);setError('')}} disabled={listening}>
       <RotateCcw size={17}/> تکرار همین مورد</button>
     <button type="button" className="scNext" onClick={moveNext} disabled={listening}>
       {result?'مرحله بعد':'رد کردن'} <ArrowLeft size={17}/></button>
    </div>
   </section>}

  {ready&&done&&<section className="scDone">
    <CheckCircle2 size={47}/><h2>تمرین تمام شد!</h2>
    <p>امتیازهای قابل‌سنجش در حافظه ذخیره شدند. تمرین بعدی روی موارد دشوار تمرکز می‌کند.</p>
    <div className="scDoneActions"><button onClick={startRound} className="scPrimary"><RotateCcw size={18}/> دور بعدی</button>
      <button onClick={resetSession} className="scRetry">تغییر دسته تمرین</button></div>
   </section>}

  {recent.length>0&&<section className="scHistory">
    <div className="scHistoryTitle"><BarChart3 size={21}/><div><h2>مواردی که بیشتر باید تمرین کنی</h2><p>بر اساس آخرین نتیجه و سابقه همین دستگاه</p></div></div>
    {recent.map(item=><div className="scHistoryItem" key={item.id}>
      <div><b dir="ltr" lang="de">{item.text}</b><small>{fmt(item.attempts)} بار تمرین</small></div>
      <div className="scHistoryBar"><i style={{width:item.avgScore+'%'}}/></div>
      <strong>{fmt(item.avgScore)}٪</strong>
    </div>)}
   </section>}
  <aside className="scPrivacy"><ShieldCheck size={20}/><p><b>نکته درباره دقت و حریم خصوصی:</b> درصد بالا، میزان شباهت متن بازشناسی‌شده با عبارت درست است، نه اندازه‌گیری مستقیم لهجه، آواها یا نمره رسمی گفتار. این اپ فایل صوتی را ذخیره نمی‌کند؛ متن تشخیص‌داده‌شده و پیشرفت روی همین مرورگر نگه داشته می‌شوند. سرویس تشخیص گفتار Chrome ممکن است برای پردازش صدا از سرورهای ارائه‌دهنده مرورگر استفاده کند؛ تنها با موافقت خودت میکروفون را روشن کن.</p></aside>
 </div>;
}
