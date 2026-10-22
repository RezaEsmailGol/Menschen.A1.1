import {useEffect,useRef} from 'react';
import {germanNumber} from './learningData.js';

const latin=/[A-Za-zÄÖÜäöüß]/;
export function germanChoiceAudio(value){
 const text=String(value??'').trim();
 if(!text)return null;
 if(text==='ß')return 'Eszett';
 if(/^\d{1,3}$/.test(text)){
  const num=Number(text);
  return num>=0&&num<=100?germanNumber(num):null;
 }
 return latin.test(text)?text:null;
}
/**
 * Play listening questions once (not on every render). Play the NEXT question
 * synchronously from the user's Next button for iOS/Safari gesture policies.
 * Speech still depends on browser voice availability and playback permissions.
 * Explicit replay is always allowed, even when automatic sounds are muted.
 */
export function useQuizQuestionAudio({questionKey,mode,audio,sound=true,speak=()=>{}}){
 const spokenRef=useRef(null);
 const speakRef=useRef(speak);
 speakRef.current=speak;
 const enabled=Boolean(sound&&mode==='listen'&&audio&&questionKey!=null);
 useEffect(()=>{
  if(!enabled||spokenRef.current===questionKey)return;
  spokenRef.current=questionKey;
  try{speakRef.current(audio);}catch{}
 },[enabled,questionKey,audio]);
 function playUpcoming(key,text,nextMode){
  if(nextMode!=='listen'||!text||!sound||key==null)return false;
  spokenRef.current=key;
  try{speakRef.current(text);return true;}catch{return false;}
 }
 function replay(text=audio){
  if(!text)return false;
  try{speakRef.current(text);return true;}catch{return false;}
 }
 function playChoice(choice){
  const spoken=germanChoiceAudio(choice);
  return spoken?replay(spoken):false;
 }
 return {playUpcoming,replay,playChoice};
}
