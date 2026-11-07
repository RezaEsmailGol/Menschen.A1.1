import React,{useEffect,useRef,useState} from 'react';
import {Headphones,Pause,Play,Volume2} from 'lucide-react';
import './lessonAudioButtons.css';

async function requestPlayback(track){
 const params=new URLSearchParams({book:track.book,path:track.path});
 const response=await fetch('/api/audio/play?'+params.toString(),{cache:'no-store'});
 const json=await response.json().catch(()=>({}));
 if(!response.ok||!json.url?.startsWith('/api/audio/stream?'))
  throw new Error('فایل صوتی فعلاً قابل پخش نیست.');
 return json.url;
}

/** Minimal book-audio playback. Audio stays separate from exercise answers
 * unless a verified task-to-track mapping was explicitly saved by the learner. */
export default function LessonAudioButtons({lessonId}){
 const [tracks,setTracks]=useState([]);
 const [active,setActive]=useState('');
 const [playing,setPlaying]=useState(false);
 const [error,setError]=useState('');
 const player=useRef(null);
 useEffect(()=>{
  const controller=new AbortController();
  setTracks([]);setError('');setActive('');setPlaying(false);
  fetch('/api/audio/catalog?lesson='+lessonId,{signal:controller.signal,cache:'no-store'})
    .then(r=>r.ok?r.json():null)
    .then(data=>{
      if(!controller.signal.aborted&&data?.configured&&Array.isArray(data.tracks))
       setTracks(data.tracks.filter(t=>t?.book&&t?.path&&t?.filename));
    }).catch(()=>{});
  return()=>{controller.abort();player.current?.pause();};
 },[lessonId]);
 async function toggle(track){
  const id=track.book+':'+track.path;
  const audio=player.current;
  if(!audio)return;
  setError('');
  if(active===id){
   if(!audio.paused){audio.pause();setPlaying(false);}
   else{try{await audio.play();setPlaying(true);}catch{setError('پخش صوت در مرورگر ممکن نشد.');}}
   return;
  }
  try{
   audio.pause();
   const url=await requestPlayback(track);
   audio.src=url;
   setActive(id);
   await audio.play();
   setPlaying(true);
  }catch(e){setPlaying(false);setError(e.message||'پخش فایل ممکن نشد.');}
 }
 // Hide empty server catalog; exercise TTS remains available with one button per question.
 if(!tracks.length)return null;
 return <section id="lesson-audio" className="laStrip" aria-label={'فایل‌های صوتی درس '+lessonId}>
  <div className="laHeading"><Headphones size={18}/><b>شنیدن فایل‌های درس {lessonId}</b>
   <small>{tracks.length.toLocaleString('fa-IR')} قطعه · انتخاب کن و پخش کن</small></div>
  <div className="laTracks">
   {tracks.map(track=>{
    const id=track.book+':'+track.path;
    return <button type="button" key={id} className={'laPlay '+(active===id?'active':'')}
     aria-label={'پخش '+track.filename+' از '+(track.book==='kursbuch'?'کتاب اصلی':'کتاب کار')}
     aria-pressed={active===id&&playing} onClick={()=>toggle(track)}>
      {active===id&&playing?<Pause size={16}/>:<Play size={16}/>}
      <span dir="auto">{track.filename}</span>
      <small>{track.book==='kursbuch'?'کتاب اصلی':'کتاب کار'}</small>
     </button>;
   })}
  </div>
  <audio ref={player} preload="none" aria-label={'پخش فایل صوتی درس '+lessonId}
   onEnded={()=>setPlaying(false)} onPause={()=>setPlaying(false)} onPlay={()=>setPlaying(true)}/>
  {error&&<small className="laError" role="alert">{error}</small>}
 </section>;
}

export function ExerciseAudioButton({task,speak,linkedTrack,fallbackAudio}){
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const player=useRef(null);
 const spoken=task?.audio||(typeof task?.answer==='string'&&/[A-Za-zÄÖÜäöüß]/.test(task.answer)?task.answer:null)||fallbackAudio;
 useEffect(()=>{player.current?.pause();setError('');},[task?.id]);
 if(!spoken&&!linkedTrack)return null;
 async function play(){
  setError('');
  if(!linkedTrack){
   try{speak(spoken);}catch{setError('تلفظ در این مرورگر در دسترس نیست.');}
   return;
  }
  setBusy(true);
  try{
   const url=await requestPlayback(linkedTrack);
   if(!player.current)return;
   player.current.src=url;
   await player.current.play();
  }catch{
   // Only fall back to the matching task text, never to an unrelated book track.
   if(spoken)speak(spoken);
   else setError('صوت این تمرین در دسترس نیست.');
  }finally{setBusy(false);}
 }
 return <div className="laExerciseAudio">
   <button type="button" className="laExercisePlay" onClick={play} disabled={busy}
    aria-label={'پخش صوت '+(task.type==='listen'?'سؤال':'مثال')+' '+task.id}>
    <Volume2 size={17}/>{busy?'در حال آماده‌سازی صوت…':task.type==='listen'?'پخش صوت سؤال':'پخش صوت مثال'}
   </button>
   <audio ref={player} preload="none" aria-label={'صوت تمرین '+task.id}/>
   {error&&<small role="alert">{error}</small>}
 </div>;
}
