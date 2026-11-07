import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Cloud,FileAudio,Headphones,Link2,RefreshCw,CheckCircle2} from 'lucide-react';
import {readCloudTaskMap,writeCloudTaskMap} from './cloudAudioCatalog.js';
import './cloudAudioLibrary.css';

async function readJson(response){
 const data=await response.json().catch(()=>null);
 if(!response.ok||!data)throw new Error(data?.error||'سرویس صوت ابری پاسخ معتبری نداد.');
 return data;
}
export async function loadCloudAudioUrl({book,path},signal){
 const params=new URLSearchParams({book,path});
 const response=await fetch('/api/audio/play?'+params,{signal,cache:'no-store'});
 const data=await readJson(response);
 if(typeof data.url!=='string'||!data.url.startsWith('https://'))
  throw new Error('لینک امن پخش نامعتبر است.');
 return data.url;
}

export function CloudExercisePlayer({track,taskId}){
 const [url,setUrl]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const audio=useRef(null);
 useEffect(()=>{setUrl('');setError('');},[track?.book,track?.path,taskId]);
 if(!track)return null;
 async function play(){
  setBusy(true);setError('');
  try{
   const signed=await loadCloudAudioUrl(track);
   setUrl(signed);
   // Audio controls are a fallback if delayed autoplay is blocked.
   requestAnimationFrame(()=>audio.current?.play()?.catch(()=>{}));
  }catch(e){setError(e.message);}finally{setBusy(false);}
 }
 return <div className="caTaskPlayer">
   <button type="button" disabled={busy} onClick={play}><Headphones size={18}/>
     {busy?'دریافت لینک موقت...':'پخش صدای اصلی کتاب برای این سؤال'}</button>
   {url&&<audio ref={audio} controls src={url} preload="none" aria-label={'صدای اصلی '+taskId}/>}
   {error&&<small role="alert">{error}</small>}
 </div>;
}

export default function CloudAudioLibrary({lessonId,currentTaskId,onCloudTaskAudioChange}){
 const [data,setData]=useState(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [book,setBook]=useState('kursbuch');
 const [selected,setSelected]=useState(null);
 const [url,setUrl]=useState('');
 const [busy,setBusy]=useState(false);
 const [speed,setSpeed]=useState(1);
 const [taskMap,setTaskMap]=useState(readCloudTaskMap);
 const audio=useRef(null);
 async function load(signal){
  setLoading(true);setError('');
  try{
   const result=await readJson(await fetch('/api/audio/catalog?lesson='+lessonId,{signal}));
   if(signal?.aborted)return;
   setData(result);
  }catch(err){if(!signal?.aborted)setError(err.message||'خطا در اتصال به فضای ابری');}
  finally{if(!signal?.aborted)setLoading(false);}
 }
 useEffect(()=>{
  const c=new AbortController();
  setData(null);setSelected(null);setUrl('');load(c.signal);
  return()=>c.abort();
 },[lessonId]);
 useEffect(()=>{setSelected(null);setUrl('');},[book,lessonId]);
 useEffect(()=>{if(audio.current)audio.current.playbackRate=speed;},[speed,url]);
 const tracks=useMemo(()=>(data?.tracks||[]).filter(t=>t.book===book),[data,book]);
 async function choose(track){
  setSelected(track);setUrl('');setBusy(true);setError('');
  try{setUrl(await loadCloudAudioUrl(track));}
  catch(err){setError(err.message||'پخش این قطعه ممکن نشد.');}
  finally{setBusy(false);}
 }
 function assign(track){
  if(!currentTaskId)return;
  const next={...taskMap,[currentTaskId]:{book:track.book,path:track.path}};
  if(!writeCloudTaskMap(next)){setError('حافظه مرورگر برای ذخیره اتصال صوتی در دسترس نیست.');return;}
  setTaskMap(next);onCloudTaskAudioChange?.(next);
 }
 const mapped=taskMap[currentTaskId];
 return <section className="caRoot" aria-label={'فایل‌های صوتی ابری درس '+lessonId}>
   <div className="caHeading"><Cloud size={21}/><div>
    <h4>پخش مستقیم از فضای ابری ران‌فلر</h4>
    <p>صدای اصلی هر Lektion بدون آپلود مجدد در گوشی، با لینک موقت و امن</p>
   </div></div>
   {loading?<p className="caNotice">در حال دریافت فهرست قطعه‌های صوتی...</p>:
    !data?.configured?<p className="caNotice">اتصال امن فضای ابری هنوز در تنظیمات Vercel فعال نشده است. فایل‌های محلی و تلفظ مرورگر همچنان قابل استفاده‌اند.</p>:
    <>
     <div className="caChoices" role="group" aria-label="انتخاب کتاب صوتی">
       <button type="button" className={book==='kursbuch'?'active':''} aria-pressed={book==='kursbuch'} onClick={()=>setBook('kursbuch')}>Kursbuch · کتاب اصلی</button>
       <button type="button" className={book==='arbeitsbuch'?'active':''} aria-pressed={book==='arbeitsbuch'} onClick={()=>setBook('arbeitsbuch')}>Arbeitsbuch · کتاب کار</button>
       <button type="button" onClick={()=>load()} aria-label="به‌روزرسانی فهرست صوتی"><RefreshCw size={16}/></button>
     </div>
     <p className="caCount">{tracks.length.toLocaleString('fa-IR')} قطعه برای درس {lessonId} · مجموع فایل‌های کتاب: {(data.totals?.[book]||0).toLocaleString('fa-IR')}</p>
     {tracks.length?<div className="caList" role="list" aria-label="فایل‌های صوتی این درس">
       {tracks.map(track=><div key={track.book+':'+track.path} role="listitem" className={'caEntry '+(track===selected?'selected':'')}>
         <button type="button" title={'پخش '+track.filename} onClick={()=>choose(track)}>
           <FileAudio size={17}/><span dir="auto">{track.filename}</span>
           <span className="caPlayWord">پخش</span>
         </button>
         {currentTaskId&&<button type="button" className="caAttach"
           onClick={()=>assign(track)} aria-label={'اتصال '+track.filename+' به تمرین شنیداری فعلی'}>
           {mapped?.book===track.book&&mapped.path===track.path?<><CheckCircle2 size={15}/> متصل</>:<><Link2 size={15}/> اتصال به سؤال</>}
         </button>}
       </div>)}
      </div>:<p className="caNotice">برای درس {lessonId} فایل صوتی در پوشه انتخاب‌شده پیدا نشد. مسیر پوشه در تنظیمات سرور و نام Lektion فایل‌ها را بررسی کن.</p>}
     {selected&&<div className="caPlayer">
       <b dir="auto">{selected.filename}</b>
       {busy?<small>در حال دریافت لینک پخش...</small>:url?<audio ref={audio} controls src={url} preload="metadata" aria-label="پخش صوت ابری"/>:null}
       <label>سرعت پخش <select value={speed} onChange={e=>setSpeed(Number(e.target.value))}>
        {[.75,1,1.25,1.5].map(value=><option key={value} value={value}>{value}×</option>)}
       </select></label>
     </div>}
    </>}
   {error&&<p className="caError" role="alert">{error}</p>}
   <small className="caPrivacy">کلیدها در این صفحه یا فایل‌های اپ قرار ندارند؛ سرور فقط برای قطعه‌های همین دوره لینک موقت می‌سازد. لینک پخش تا زمان انقضا قابل استفاده است.</small>
 </section>;
}
