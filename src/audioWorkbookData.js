import {safeAudioRelativePath,safeBook} from './cloudAudioCatalog.js';

export const AUDIO_CARD_TRACK_KEY='dt_menschen_audio_card_tracks_v1';

export function cardBindingKey(lessonId,cardId){
 const lesson=Number(lessonId);
 if(!Number.isInteger(lesson)||lesson<1||lesson>12||typeof cardId!=='string'||!/^a(?:[1-9]|1[0-2])-\d{1,2}$/.test(cardId))
  throw new Error('Invalid lesson audio card');
 return lesson+':'+cardId;
}

export function normalizeAudioCardBindings(raw){
 let data=raw;
 if(typeof raw==='string'){try{data=JSON.parse(raw);}catch{return {};}}
 if(!data||typeof data!=='object'||Array.isArray(data))return {};
 const result={};
 for(const [key,track] of Object.entries(data)){
  if(!/^(?:[1-9]|1[0-2]):a(?:[1-9]|1[0-2])-\d{1,2}$/.test(key))continue;
  const [lesson,card]=key.split(':');
  if(cardBindingKey(Number(lesson),card)!==key)continue;
  if(safeBook(track?.book)&&safeAudioRelativePath(track?.path))
   result[key]={book:track.book,path:track.path};
 }
 return result;
}
export function getAudioCardBinding(bindings,lessonId,cardId){
 return normalizeAudioCardBindings(bindings)[cardBindingKey(lessonId,cardId)]||null;
}
export function withAudioCardBinding(bindings,lessonId,cardId,track){
 const key=cardBindingKey(lessonId,cardId);
 const clean=normalizeAudioCardBindings(bindings);
 if(track==null){delete clean[key];return clean;}
 if(!safeBook(track.book)||!safeAudioRelativePath(track.path))
  throw new Error('Invalid track');
 return {...clean,[key]:{book:track.book,path:track.path}};
}
export function audioCardTrackLabel(track){
 return track?.book==='arbeitsbuch'?'کتاب کار':'کتاب اصلی';
}
export function completedAudioCards(cards,stats,lessonId){
 return cards.filter(card=>['meaning','dictation','repeat'].some(mode=>
  stats?.completed?.[lessonId+':'+card.id+':'+mode]===true)).length;
}
