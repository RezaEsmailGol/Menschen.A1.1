import {playWrongBeep} from './audioFeedback.js';

export const GAME_SOUND_KEY='dt_game_feedback_sound';
export const GAME_HAPTIC_KEY='dt_game_feedback_haptics';
export const HAPTIC_PATTERNS=Object.freeze({
 correct:Object.freeze([24,35,25]),
 wrong:Object.freeze([75,45,90]),
 finish:Object.freeze([30,50,40,55,115])
});

export function readGameFeedbackPreferences(){
 const get=(key)=>{
  try{return typeof localStorage==='undefined'||localStorage.getItem(key)!=='off';}catch{return true;}
 };
 return {sound:get(GAME_SOUND_KEY),haptics:get(GAME_HAPTIC_KEY)};
}
export function saveGameFeedbackPreference(key,enabled){
 if(key!==GAME_SOUND_KEY&&key!==GAME_HAPTIC_KEY)return false;
 try{
  if(typeof localStorage==='undefined')return false;
  localStorage.setItem(key,enabled?'on':'off');
  return true;
 }catch{return false;}
}
export function vibrateGame(type='correct',enabled=true){
 if(!enabled||!Object.hasOwn(HAPTIC_PATTERNS,type))return false;
 try{
  if(typeof navigator==='undefined'||typeof navigator.vibrate!=='function')return false;
  return Boolean(navigator.vibrate([...HAPTIC_PATTERNS[type]]));
 }catch{return false;}
}

// Light, generated notes: no external requests, audio files or API keys.
// Only call from a user action to respect autoplay restrictions.
let audioContext;
function makeNotes(notes){
 if(typeof window==='undefined')return false;
 const Context=window.AudioContext||window.webkitAudioContext;
 if(!Context)return false;
 try{
  if(!audioContext||audioContext.state==='closed')audioContext=new Context();
  if(audioContext.state==='suspended')void audioContext.resume().catch(()=>{});
  const initial=audioContext.currentTime+0.006;
  for(const [tone,offset,duration] of notes){
   const start=initial+offset;
   const oscillator=audioContext.createOscillator();
   const gain=audioContext.createGain();
   oscillator.type='sine';
   oscillator.frequency.setValueAtTime(tone,start);
   gain.gain.setValueAtTime(0.0001,start);
   gain.gain.exponentialRampToValueAtTime(0.065,start+0.018);
   gain.gain.exponentialRampToValueAtTime(0.0001,start+duration);
   oscillator.connect(gain);gain.connect(audioContext.destination);
   oscillator.start(start);oscillator.stop(start+duration+0.01);
   oscillator.onended=()=>{try{oscillator.disconnect();gain.disconnect();}catch{}};
  }
  return true;
 }catch{return false;}
}
export function playGameSound(type,enabled=true){
 if(!enabled)return false;
 if(type==='wrong')return playWrongBeep();
 if(type==='correct')return makeNotes([[620,0,.11],[830,.085,.17]]);
 if(type==='finish')return makeNotes([[523,0,.16],[659,.115,.17],[784,.23,.18],[1046,.36,.31]]);
 return false;
}
export function giveGameFeedback(type,preferences=readGameFeedbackPreferences()){
 const sound=playGameSound(type,preferences.sound);
 const haptic=vibrateGame(type,preferences.haptics);
 return {sound,haptic};
}
