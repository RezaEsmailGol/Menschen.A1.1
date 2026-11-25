import React,{useEffect,useMemo,useRef,useState} from 'react';
import {ArrowLeft,BookOpenCheck,CheckCircle2,ChevronDown,FileAudio,Headphones,Image as ImageIcon,Library,RotateCcw,Volume2,AlertCircle} from 'lucide-react';
import ArbeitsbuchMediaArt from './ArbeitsbuchMediaArt.jsx';
import BookAudioLibrary from './BookAudioLibrary.jsx';
import {CloudExercisePlayer} from './CloudAudioLibrary.jsx';
import {readCloudTaskMap} from './cloudAudioCatalog.js';
import {readAudioTaskMap,getBookAudio} from './bookAudioStorage.js';
import {arbeitsbuchLessons,arbeitsbuchLesson} from './arbeitsbuchSourceData.js';
import {
 AB_MEDIA_KEY,AB_PAGE_PROGRESS_KEY,AB_MEDIA_NOTE,
 arbeitsbuchMediaTasks,arbeitsbuchMediaForLesson,arbeitsbuchPageIndex,
 mediaCorrect,saveMediaResult,saveOriginalAudioPractice,mediaNeedsReview,savePageProgress
} from './arbeitsbuchMediaData.js';
import './arbeitsbuchMediaStudio.css';
import {lessonFromSearch,writeLessonFocus,scopedLessonLinks} from './lessonFocus.js';

function saved(key){try{const x=JSON.parse(localStorage.getItem(key)||'{}');return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}catch{return {}}}
const digits=n=>Number(n||0).toLocaleString('fa-IR');
function currentLesson(){return lessonFromSearch(window.location.search,window.localStorage,8)}
const tabs=[
 {id:'visual',title:'تصویری',Icon:ImageIcon},
 {id:'listeningPractice',title:'شنیداری تمرینی',Icon:Headphones},
 {id:'originalAudio',title:'صوت اصلی کتاب',Icon:FileAudio},
 {id:'pages',title:'فهرست صفحات',Icon:Library}
];
export default function ArbeitsbuchMediaStudio({speak=()=>{},onPracticeEvent}){
 const [lessonId,setLessonId]=useState(currentLesson);
 const [mode,setMode]=useState('visual');
 const [activeId,setActiveId]=useState('');
 const [attempt,setAttempt]=useState(null);
 const [progress,setProgress]=useState(()=>saved(AB_MEDIA_KEY));
 const [pageProgress,setPageProgress]=useState(()=>saved(AB_PAGE_PROGRESS_KEY));
 const [pageScope,setPageScope]=useState('lesson');
 const [pageNo,setPageNo]=useState(null);
 const [verifiedPage,setVerifiedPage]=useState(false);
 const [cloudMap,setCloudMap]=useState(readCloudTaskMap);
 const [localMap,setLocalMap]=useState(readAudioTaskMap);
 const [localUrl,setLocalUrl]=useState('');
 const [localError,setLocalError]=useState('');
 const [heard,setHeard]=useState(false);
 const [playedDemo,setPlayedDemo]=useState(false);
 const [revealDemo,setRevealDemo]=useState(false);
 const playerUrl=useRef(null);
 const chapter=arbeitsbuchLesson(lessonId);
 const list=useMemo(()=>arbeitsbuchMediaForLesson(lessonId).filter(t=>t.kind===mode),[lessonId,mode]);
 const task=list.find(t=>t.id===activeId)||list[0]||null;
 const currentPage=arbeitsbuchPageIndex.find(p=>p.page===pageNo)||null;
 const pageList=arbeitsbuchPageIndex.filter(p=>pageScope==='all'?true:pageScope==='review'?p.lesson===null:p.lesson===lessonId);
 const cloudTrack=task?.kind==='originalAudio'&&cloudMap[task.id]?.book==='arbeitsbuch'?cloudMap[task.id]:null;
 const localId=task?.kind==='originalAudio'?localMap[task.id]:null;
 const hasAudio=Boolean(cloudTrack||localUrl);
 const totalDone=arbeitsbuchMediaForLesson(lessonId).filter(t=>progress[t.id]?.completed).length;
 const lessonReview=mediaNeedsReview(progress,arbeitsbuchMediaForLesson(lessonId)).length;
 useEffect(()=>{try{localStorage.setItem(AB_MEDIA_KEY,JSON.stringify(progress))}catch{}},[progress]);
 useEffect(()=>{writeLessonFocus(window.localStorage,lessonId,true)},[lessonId]);
 useEffect(()=>{try{localStorage.setItem(AB_PAGE_PROGRESS_KEY,JSON.stringify(pageProgress))}catch{}},[pageProgress]);
 useEffect(()=>{
  let alive=true,blobUrl=null;
  if(playerUrl.current){URL.revokeObjectURL(playerUrl.current);playerUrl.current=null;}
  setLocalUrl('');setLocalError('');
  if(localId)getBookAudio(localId).then(track=>{
   if(!alive)return;
   if(!track?.blob||track.book!=='arbeitsbuch')throw new Error('این قطعه صوتی در کتابخانه Arbeitsbuch موجود نیست.');
   blobUrl=URL.createObjectURL(track.blob);
   playerUrl.current=blobUrl;
   setLocalUrl(blobUrl);
  }).catch(err=>{if(alive)setLocalError(err.message)});
  return()=>{alive=false;if(blobUrl)URL.revokeObjectURL(blobUrl);if(playerUrl.current===blobUrl)playerUrl.current=null};
 },[localId,task?.id]);
 useEffect(()=>{
  if(task?.id!==activeId){
   setActiveId(task?.id||'');
   setAttempt(null);setHeard(false);setPlayedDemo(false);setRevealDemo(false);
  }
 },[task?.id,activeId]);
 function choose(item){setActiveId(item.id);setAttempt(null);setHeard(false);setPlayedDemo(false);setRevealDemo(false)}
 function newLesson(next){writeLessonFocus(window.localStorage,next,true);setLessonId(Number(next));setActiveId('');setAttempt(null);setPageNo(null);setVerifiedPage(false)}
 function newMode(next){setMode(next);setActiveId('');setAttempt(null);setHeard(false)}
 function grade(value){
  if(!task||task.kind==='originalAudio'||attempt)return;
  const correct=mediaCorrect(task,value);
  setAttempt({value,correct});
  setProgress(old=>saveMediaResult(old,task,correct));
  onPracticeEvent?.({id:'arbeitsbuch-media:'+task.id,kind:task.kind==='visual'?'vocabulary':'listening',lesson:lessonId,label:task.title,correct});
 }
 function nextTask(){const i=list.findIndex(t=>t.id===task?.id);if(i>=0&&i+1<list.length)choose(list[i+1])}
 function playDemo(){
  if(!task?.script)return;
  setPlayedDemo(true);
  speak(task.script);
 }
 function reportOriginal(needsReview){
  if(!task||!hasAudio||!heard)return;
  setProgress(old=>saveOriginalAudioPractice(old,task,true,needsReview));
  setAttempt({original:true,needsReview});
 }
 function pickPage(page){setPageNo(page);setVerifiedPage(false)}
 function commitPage(needsReview){
  if(!currentPage?.available||!verifiedPage)return;
  setPageProgress(old=>savePageProgress(old,currentPage,needsReview));
 }
 return <div className="abmPage" dir="rtl">
  <header className="abmHero">
   <span className="abmEyebrow"><BookOpenCheck size={18}/> Menschen A1.1 · Arbeitsbuch</span>
   <h1>تمرین‌های شنیداری و تصویری کتاب کار</h1>
   <p>{AB_MEDIA_NOTE}</p>
   <div className="abmHeroStats"><span>{digits(totalDone)} فعالیت تکمیل‌شده این درس</span><span>{digits(lessonReview)} نیازمند مرور در این درس</span></div>
  </header>
  <nav className="bookFocusBack" aria-label="بخش‌های متمرکز درس"><a href={scopedLessonLinks(lessonId).focus}><ArrowLeft size={17}/> صفحه تمرین متمرکز درس {lessonId}</a><a href={scopedLessonLinks(lessonId).arbeitsbuch}><BookOpenCheck size={17}/> سؤال‌های نوشتاری این درس</a></nav>
  <section className="abmControls" aria-label="انتخاب تمرین">
   <label htmlFor="abmLessonSelect">درس
    <select id="abmLessonSelect" value={lessonId} onChange={e=>newLesson(e.target.value)}>
     {arbeitsbuchLessons.map(l=><option key={l.id} value={l.id}>{l.id} · {l.title}</option>)}
    </select>
   </label>
   <div className="abmModes" role="group" aria-label="نوع فعالیت">
    {tabs.map(({id,title,Icon})=><button key={id} type="button" aria-pressed={mode===id} className={mode===id?'active':''} onClick={()=>newMode(id)}><Icon size={17}/>{title}</button>)}
   </div>
  </section>
  {mode!=='pages'&&<section className="abmCards" aria-label="فعالیت‌های این درس">
   {list.map(t=><button type="button" key={t.id} onClick={()=>choose(t)} aria-current={task?.id===t.id?'true':undefined} className={task?.id===t.id?'active':''}>
    <span className="abmPageNo">{t.page}</span><span><b>{t.title}</b><small>Arbeitsbuch S. {t.page}</small></span>
    {progress[t.id]?.completed?<CheckCircle2 size={18} color="#2b9f78"/>:progress[t.id]?.lastCorrect===false||progress[t.id]?.needsReview?<RotateCcw size={17} color="#ce8d42"/>:<ArrowLeft size={17}/>}
   </button>)}
   {list.length===0&&<p>برای این درس تمرین صوت اصلیِ قابل‌ارجاع در PDF شناسایی نشده است؛ تمرین‌های صوتی تألیفی را می‌توانی انجام بدهی.</p>}
  </section>}
  {mode!=='pages'&&task&&<section className="abmExercise" key={task.id}>
   <div className="abmExerciseMeta"><span>Arbeitsbuch · Seite {task.page}{task.pdfPage?' · PDF '+task.pdfPage:''}</span><b>{task.title}</b></div>
   {task.kind==='visual'&&<>
    <ArbeitsbuchMediaArt name={task.art}/>
    <div className="abmQuestion"><b>{task.question}</b><span>به تصویر نگاه کن و گزینه درست را بزن.</span></div>
   </>}
   {task.kind==='listeningPractice'&&<>
    <div className="abmAudioPrompt">
     <p><Headphones size={19}/> تمرین تألیفی با صدای دستگاه (نه فایل اصلی ناشر)</p>
     <button type="button" onClick={playDemo}><Volume2 size={18}/> {playedDemo?'دوباره گوش کن':'شنیدن جمله آلمانی'}</button>
     <small>جمله آلمانی را قبل از پاسخ نمی‌بینی؛ ابتدا گوش کن.</small>
    </div>
    <div className="abmQuestion"><b>{task.question}</b><span>پس از شنیدن، گزینه صحیح را مشخص کن.</span></div>
   </>}
   {(task.kind==='visual'||task.kind==='listeningPractice')&&<>
    <div className="abmOptions">
     {task.options.map(opt=><button type="button" key={opt} disabled={Boolean(attempt)||(task.kind==='listeningPractice'&&!playedDemo)}
      className={attempt?.value===opt?'chosen':''} onClick={()=>grade(opt)}>{opt}</button>)}
    </div>
    {attempt&&<div className={'abmFeedback '+(attempt.correct?'correct':'wrong')} role="status">
     <b>{attempt.correct?'آفرین، درست بود!':'این پاسخ درست نبود.'}</b>
     <strong dir="auto">{task.answer}</strong><p>{task.tip}</p>
     {task.kind==='listeningPractice'&&<details><summary>متن جمله پخش‌شده</summary><span dir="ltr" lang="de">{task.script}</span></details>}
    </div>}
    <div className="abmActions">
     <button type="button" onClick={()=>choose(task)}><RotateCcw size={16}/> تکرار تمرین</button>
     <button type="button" className="primary" disabled={list.indexOf(task)>=list.length-1} onClick={nextTask}>بعدی <ArrowLeft size={17}/></button>
    </div>
   </>}
   {task.kind==='originalAudio'&&<>
    <div className="abmOriginalNotice">
     <FileAudio size={24}/><b>{task.title}</b>
     <p>{task.goal}</p>
     <small>پاسخ این بخش بدون فایل اصلی قابل سنجش خودکار نیست؛ پس از شنیدن، نتیجه را خودت مشخص کن.</small>
    </div>
    {cloudTrack&&<CloudExercisePlayer track={cloudTrack} taskId={task.id} onPlayed={()=>setHeard(true)}/>}
    {localUrl&&<div className="abmLocalAudio"><b>فایل اصلی ذخیره‌شده در همین دستگاه</b><audio controls preload="metadata" src={localUrl} onPlay={()=>setHeard(true)} aria-label="صدای محلی اصل کتاب کار"/></div>}
    {!hasAudio&&<div className="abmNoTrack" role="status"><AlertCircle size={20}/>
      <p>هنوز قطعه اصلی این تمرین متصل نیست. برای جلوگیری از نمره ساختگی، تکمیل این تمرین فعلاً غیرفعال است.</p>{localError&&<small>{localError}</small>}
     </div>}
    <details className="abmAudioManager">
      <summary><Library size={18}/> انتخاب یا واردکردن فایل اصلی <ChevronDown size={17}/></summary>
      <BookAudioLibrary lessonId={lessonId} currentTaskId={task.id} initialBook="arbeitsbuch"
       onTaskAudioChange={setLocalMap} onCloudTaskAudioChange={setCloudMap}/>
    </details>
    <div className="abmOriginalActions">
      <button type="button" disabled={!hasAudio||!heard} onClick={()=>reportOriginal(true)}>شنیدم، نیاز به مرور دارم</button>
      <button type="button" disabled={!hasAudio||!heard} onClick={()=>reportOriginal(false)}>شنیدم، انجام شد</button>
    </div>
    {attempt?.original&&<p className="abmSelfStatus" role="status">نتیجه خودارزیابی ذخیره شد. این بخش امتیاز دقت تلفظ ایجاد نکرده است.</p>}
   </>}
  </section>}
  {mode==='pages'&&<section className="abmPages">
    <div className="abmPageFilter"><b>فهرست صفحات چاپی ۶ تا ۹۹</b>
      <select aria-label="محدوده صفحات کتاب کار" value={pageScope} onChange={e=>{setPageScope(e.target.value);setPageNo(null);setVerifiedPage(false)}}>
       <option value="lesson">فقط صفحات این درس</option><option value="review">بخش‌های مرور و جمع‌بندی</option><option value="all">تمام صفحات</option>
      </select>
    </div>
    <div className="abmPageList" aria-label="فهرست صفحات">
     {pageList.map(p=><button type="button" key={p.id} disabled={!p.available} aria-current={pageNo===p.page?'true':undefined}
      onClick={()=>pickPage(p.page)} className={pageNo===p.page?'active':''}>
       <strong>{digits(p.page)}</strong><span>{p.section}</span>
       {pageProgress[p.id]?.completed&&<CheckCircle2 size={15} color="#29986f"/>}
       {!p.available&&<small>در فایل نیست</small>}
      </button>)}
    </div>
    {currentPage?.available&&<div className="abmPageDetail">
     <h3>Arbeitsbuch · Seite {currentPage.page} <small>(صفحه {currentPage.pdfPage} فایل PDF)</small></h3>
     <p>{currentPage.section} · {currentPage.lesson?'درس '+currentPage.lesson:'مرور بین‌درس‌ها'}</p>
     <p>از روی نسخه PDF خودت فعالیت‌های این صفحه را انجام بده. این فهرست، جایگزین متن و تصویر کامل صفحه ناشر نیست.</p>
     {currentPage.mediaIds.length>0&&<p>برای این صفحه {digits(currentPage.mediaIds.length)} تمرین تصویری یا شنیداری تعاملی هم در اپ آماده شده است.</p>}
     <label><input type="checkbox" checked={verifiedPage} onChange={e=>setVerifiedPage(e.target.checked)}/> تمرین‌های این صفحه را در PDF خودم انجام داده‌ام.</label>
     <div><button disabled={!verifiedPage} onClick={()=>commitPage(true)}>نیاز به مرور</button><button disabled={!verifiedPage} onClick={()=>commitPage(false)}>ثبت انجام صفحه</button></div>
     {pageProgress[currentPage.id]&&<small role="status">{pageProgress[currentPage.id].completed?'انجام صفحه ثبت شده است.':'این صفحه برای مرور علامت خورده است.'}</small>}
    </div>}
  </section>}
  <nav className="abmBottomNav"><a href={'/arbeitsbuch?lesson='+lessonId}><BookOpenCheck size={18}/> تمرین‌های نوشتاری کتاب کار</a><a href={'/book-exercises?lesson='+lessonId}><ArrowLeft size={17}/> Kursbuch</a></nav>
 </div>;
}
