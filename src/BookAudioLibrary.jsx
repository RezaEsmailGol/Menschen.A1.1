import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {BookOpen,Check,ExternalLink,FileAudio,HardDrive,Headphones,Link2,LoaderCircle,Pause,Play,RotateCcw,Trash2,Upload,Volume2} from 'lucide-react';
import {BOOK_AUDIO_REFERENCES,AUDIO_BOOKS,MAX_ARCHIVE_BYTES} from './bookAudioSources.js';
import {
  listBookAudio,getBookAudio,importBookAudioFiles,setBookAudioLesson,
  removeBookAudio,readAudioTaskMap,saveAudioTaskMap
} from './bookAudioStorage.js';
import './bookAudioLibrary.css';
import CloudAudioLibrary from './CloudAudioLibrary.jsx';

function sizeLabel(bytes=0){
 return (bytes/1024/1024).toLocaleString('fa-IR',{maximumFractionDigits:1})+' مگابایت';
}
export default function BookAudioLibrary({lessonId,currentTaskId=null,onTaskAudioChange,onCloudTaskAudioChange}){
 const [book,setBook]=useState('kursbuch');
 const [tracks,setTracks]=useState([]);
 const [selectedId,setSelectedId]=useState(null);
 const [audioUrl,setAudioUrl]=useState(null);
 const [loading,setLoading]=useState(false);
 const [progress,setProgress]=useState('');
 const [message,setMessage]=useState('');
 const [search,setSearch]=useState('');
 const [showAll,setShowAll]=useState(false);
 const [expanded,setExpanded]=useState(true);
 const [speed,setSpeed]=useState(1);
 const [loop,setLoop]=useState(false);
 const [taskMap,setTaskMap]=useState(readAudioTaskMap);
 const inputRef=useRef(null);
 const playerRef=useRef(null);
 const open=useRef(true);
 const storedId=currentTaskId?taskMap[currentTaskId]:null;
 const selected=tracks.find(t=>t.id===selectedId)||null;
 const visible=useMemo(()=>{
  const phrase=search.trim().toLowerCase();
  return tracks.filter(t=>t.book===book)
    .filter(t=>showAll||t.lesson===null||t.lesson===lessonId)
    .filter(t=>!phrase||t.filename.toLowerCase().includes(phrase))
    .sort((a,b)=>(a.lesson===lessonId?-1:0)-(b.lesson===lessonId?-1:0)||a.filename.localeCompare(b.filename,'de',{numeric:true}));
 },[tracks,book,lessonId,search,showAll]);
 const stats=useMemo(()=>({
   lesson:tracks.filter(t=>t.lesson===lessonId).length,
   unassigned:tracks.filter(t=>t.lesson===null).length,
   total:tracks.length
 }),[tracks,lessonId]);
 const refresh=useCallback(async()=>{
  const all=await listBookAudio();
  if(!open.current)return;
  setTracks(all);
  setSelectedId(previous=>all.some(t=>t.id===previous)?previous:null);
 },[]);
 useEffect(()=>{
  open.current=true;
  refresh().catch(e=>setMessage(e.message||'کتابخانه صوتی در دسترس نیست.'));
  return()=>{open.current=false;};
 },[refresh]);
 useEffect(()=>{
  if(!currentTaskId)return;
  const id=taskMap[currentTaskId];
  if(!id)return;
  const track=tracks.find(t=>t.id===id);
  if(track){setSelectedId(id);setBook(track.book);}
 },[currentTaskId,taskMap,tracks]);
 useEffect(()=>{
  if(!selectedId){setAudioUrl(null);return;}
  setAudioUrl(null);
  let live=true,url=null;
  getBookAudio(selectedId).then(record=>{
   if(!live)return;
   if(!record?.blob){setMessage('فایل ذخیره‌شده در حافظه یافت نشد.');return;}
   const playable=new Blob([record.blob],{type:record.mime||'audio/mpeg'});
   url=URL.createObjectURL(playable);
   setAudioUrl(url);
  }).catch(err=>{if(live)setMessage(err.message||'بارگذاری صوت ممکن نشد.');});
  return()=>{live=false;if(url)URL.revokeObjectURL(url);};
 },[selectedId]);
 useEffect(()=>{if(playerRef.current)playerRef.current.playbackRate=speed;},[speed,audioUrl]);
 async function importFiles(event){
  const files=Array.from(event.target.files||[]);
  if(!files.length)return;
  setLoading(true);setMessage('');setProgress('آماده‌سازی فایل‌های صوتی...');
  try{
   const count=await importBookAudioFiles(files,{
    book,
    lesson:files.some(f=>/\.zip$/i.test(f.name))?null:lessonId,
    onProgress:(current,total)=>setProgress('ذخیره در مرورگر: '+current.toLocaleString('fa-IR')+' / '+total.toLocaleString('fa-IR'))
   });
   await refresh();
   setMessage(count.toLocaleString('fa-IR')+' قطعه صوتی فقط در همین مرورگر ذخیره شد. برای قطعه‌هایی که درسشان مشخص نیست، از فهرست زیر درس مناسب را انتخاب کن.');
  }catch(err){setMessage('خطا: '+(err?.message||'واردکردن فایل انجام نشد.'));}
  finally{setLoading(false);setProgress('');if(inputRef.current)inputRef.current.value='';}
 }
 async function assignLesson(next){
  if(!selected)return;
  try{
   await setBookAudioLesson(selected.id,next);
   await refresh();
   setMessage(next===null?'قطعه به کتابخانه عمومی منتقل شد.':'این قطعه به درس '+next+' متصل شد.');
  }catch(err){setMessage(err.message);}
 }
 async function erase(){
  if(!selected)return;
  if(!window.confirm('این قطعه فقط از حافظه مرورگر حذف شود؟'))return;
  try{
   await removeBookAudio(selected.id);
   const next={...taskMap};
   for(const [id,track] of Object.entries(next))if(track===selected.id)delete next[id];
   setTaskMap(next);saveAudioTaskMap(next);onTaskAudioChange?.(next);
   setSelectedId(null);await refresh();
   setMessage('فایل صوتی از حافظه همین مرورگر حذف شد.');
  }catch(err){setMessage(err.message);}
 }
 function attachTask(){
  if(!selected||!currentTaskId)return;
  const next={...taskMap,[currentTaskId]:selected.id};
  if(!saveAudioTaskMap(next)){setMessage('اتصال به تمرین در حافظه مرورگر ذخیره نشد.');return;}
  setTaskMap(next);onTaskAudioChange?.(next);
  setMessage('فایل '+selected.filename.split('/').pop()+' به تمرین شنیداری فعلی متصل شد.');
 }
 function clearTask(){
  if(!currentTaskId)return;
  const next={...taskMap};delete next[currentTaskId];
  setTaskMap(next);saveAudioTaskMap(next);onTaskAudioChange?.(next);
 }
 return <section id="lesson-audio" className="baRoot" aria-label={'کتابخانه فایل صوتی Menschen A1.1 درس '+lessonId}>
   <header className="baHeader">
     <span className="baHeaderIcon"><Headphones size={23}/></span>
     <div><span className="baEyebrow">MENSCHEN A1.1 · HÖREN</span>
       <h3>فایل‌های صوتی کتاب، درس {lessonId}</h3>
       <p>صدای واقعی Kursbuch و Arbeitsbuch را از فایل‌های خودت پخش کن و به تمرین شنیداری متصل کن.</p></div>
     <button type="button" className="baExpand" onClick={()=>setExpanded(x=>!x)}
       aria-expanded={expanded} aria-controls={'ba-library-'+lessonId}>{expanded?'بستن':'باز کردن'}</button>
   </header>
   <div className="baStats"><span><b>{stats.lesson.toLocaleString('fa-IR')}</b> قطعه این درس</span>
    <span><b>{stats.unassigned.toLocaleString('fa-IR')}</b> قطعه دسته‌بندی‌نشده</span>
    <span><b>{stats.total.toLocaleString('fa-IR')}</b> کل کتابخانه</span></div>
   {expanded&&<div id={'ba-library-'+lessonId} className="baContent">
     <CloudAudioLibrary lessonId={lessonId} currentTaskId={currentTaskId} onCloudTaskAudioChange={onCloudTaskAudioChange}/>
     <div className="baResources">
       <p><BookOpen size={16}/> برای دریافت فایل صوتی از منابع قانونی کتاب استفاده کن. فایل‌های ناشر روی سرور این اپ ذخیره نمی‌شوند.</p>
       <div>{BOOK_AUDIO_REFERENCES.map(source=><a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">
         {source.name} <ExternalLink size={14}/></a>)}</div>
     </div>
     <div className="baImporter">
       <label className="baBookSelect">مجموعه صوتی
         <select value={book} onChange={event=>{setBook(event.target.value);setSelectedId(null);}}>
           {AUDIO_BOOKS.map(b=><option key={b.id} value={b.id}>{b.name} · {b.fa}</option>)}
         </select></label>
       <label className="baUpload">
         <Upload size={19}/>
         {loading?'در حال واردکردن...':'افزودن ZIP یا فایل MP3 / WAV'}
         <input ref={inputRef} type="file" multiple disabled={loading}
           accept=".zip,.mp3,.m4a,.aac,.ogg,.wav,.opus,audio/*" onChange={importFiles} aria-label="انتخاب فایل‌های صوتی از دستگاه"/>
       </label>
     </div>
     <p className="baPrivacy"><HardDrive size={15}/> فایل‌های انتخابی فقط در IndexedDB همین مرورگر می‌مانند؛ به GitHub یا Vercel فرستاده نمی‌شوند. حجم هر ZIP حداکثر {Math.floor(MAX_ARCHIVE_BYTES/1024/1024)} مگابایت است.</p>
     {progress&&<p className="baProgress" role="status"><LoaderCircle size={16}/>{progress}</p>}
     {message&&<p className="baMessage" role="status">{message}</p>}
     <div className="baSearchRow">
       <label>فایل‌های قابل پخش
         <input type="search" placeholder="نام قطعه، شماره Track..." value={search} onChange={event=>setSearch(event.target.value)}/></label>
       <label className="baCheck"><input type="checkbox" checked={showAll} onChange={event=>setShowAll(event.target.checked)}/> نمایش قطعه‌های درس‌های دیگر</label>
     </div>
     {!visible.length?<p className="baEmpty">هنوز قطعه‌ای برای این مجموعه اضافه نشده است. فایل ZIP کتاب را وارد کن؛ قطعه‌ها در این بخش نمایان می‌شوند.</p>:
       <div className="baTrackList" role="list" aria-label="فهرست قطعه‌های صوتی">
         {visible.slice(0,80).map(track=><button key={track.id} role="listitem" type="button" className={'baTrack '+(selectedId===track.id?'selected':'')}
           aria-pressed={selectedId===track.id} onClick={()=>setSelectedId(track.id)}>
           {selectedId===track.id?<Play size={17}/>:<FileAudio size={17}/>}
           <span className="baTrackName" dir="auto">{track.filename.split('/').pop()}</span>
           <small>{track.lesson===null?'تعیین نشده':'درس '+track.lesson}</small>
         </button>)}
         {visible.length>80&&<small className="baLimit">۸۰ قطعه نمایش داده شده است؛ برای یافتن بقیه از جست‌وجوی نام استفاده کن.</small>}
       </div>}
     {selected&&<div className="baPlayer">
       <div className="baSelected"><FileAudio size={19}/><b dir="auto">{selected.filename.split('/').pop()}</b><small>{sizeLabel(selected.bytes)}</small></div>
       {audioUrl?<audio id={'lesson-audio-player-'+lessonId} ref={playerRef} controls preload="metadata" loop={loop} src={audioUrl} aria-label="پخش صدای اصلی انتخابی"/>:
         <p className="baLoading">آماده‌سازی پخش...</p>}
       <div className="baPlayerSettings">
         <label>سرعت
           <select value={speed} onChange={event=>setSpeed(Number(event.target.value))}>
             {[0.75,1,1.25,1.5].map(n=><option key={n} value={n}>{n}×</option>)}
           </select>
         </label>
         <label className="baCheck"><input type="checkbox" checked={loop} onChange={event=>setLoop(event.target.checked)}/> تکرار خودکار</label>
         <label>اختصاص قطعه به درس
           <select value={selected.lesson??''} onChange={event=>assignLesson(event.target.value?Number(event.target.value):null)}>
             <option value="">دسته‌بندی نشده</option>
             {Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>درس {i+1}</option>)}
           </select>
         </label>
         <button className="baDelete" type="button" onClick={erase}><Trash2 size={15}/> حذف محلی</button>
       </div>
       {currentTaskId&&<div className="baTaskAttach">
         {storedId===selected.id?<><Check size={16}/> این قطعه به سؤال شنیداری فعلی متصل است.
           <button type="button" onClick={clearTask}>لغو اتصال</button></>:
           <button type="button" onClick={attachTask}><Link2 size={16}/> اتصال این قطعه به سؤال شنیداری فعلی</button>}
       </div>}
     </div>}
     {currentTaskId&&storedId&&!selected&&<p className="baTaskHint">
       <Link2 size={15}/> برای سؤال فعلی قطعه صوتی مشخص شده است؛ آن را از فهرست انتخاب کن تا پخش شود.
     </p>}
   </div>}
 </section>;
}
