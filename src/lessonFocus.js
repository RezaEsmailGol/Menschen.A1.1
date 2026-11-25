// A single lesson selection shared by the course, Practice, Kursbuch and Arbeitsbuch.
// Never hide exercises from other lessons permanently: focus can be switched off.
export const CURRENT_LESSON_KEY='dt_current_lesson';
export const LESSON_FOCUS_KEY='dt_lesson_focus_v1';

export function validLessonId(value){
 if(value===null||value===undefined||String(value).trim()==='')return null;
 const n=Number(value);
 return Number.isInteger(n)&&n>=1&&n<=12?n:null;
}
export function readLessonFocus(storage){
 try{
  const raw=storage?.getItem(LESSON_FOCUS_KEY);
  const legacy=validLessonId(storage?.getItem(CURRENT_LESSON_KEY));
  if(raw){
   const value=JSON.parse(raw);
   const lessonId=validLessonId(value?.lessonId)||legacy||1;
   return {lessonId,enabled:value?.enabled===true};
  }
  return {lessonId:legacy||1,enabled:legacy!==null};
 }catch{
  return {lessonId:1,enabled:false};
 }
}
export function writeLessonFocus(storage,id,enabled=true){
 const lessonId=validLessonId(id);
 if(lessonId===null)return false;
 try{
  storage?.setItem(CURRENT_LESSON_KEY,String(lessonId));
  storage?.setItem(LESSON_FOCUS_KEY,JSON.stringify({lessonId,enabled:Boolean(enabled)}));
  return true;
 }catch{return false;}
}
export function lessonFromSearch(search,storage,fallback=8){
 const url=new URLSearchParams(String(search||'').replace(/^\?/,'')); 
 return validLessonId(url.get('lesson'))||validLessonId(storage?.getItem(CURRENT_LESSON_KEY))||readLessonFocus(storage).lessonId||validLessonId(fallback)||1;
}
export function scopedLessonLinks(id){
 const lesson=validLessonId(id);
 if(!lesson)throw new Error('Invalid lesson');
 const value=String(lesson);
 return Object.freeze({
  focus:'/practice/lesson/'+value,
  course:'/lessons/'+value,
  kursbuch:'/book-exercises?lesson='+value,
  arbeitsbuch:'/arbeitsbuch?lesson='+value,
  media:'/arbeitsbuch-media?lesson='+value,
  partner:'/partner-practice?lesson='+value,
  action:'/action-pages?lesson='+value,
  vocabulary:'/essential-words?lesson='+value
 });
}

export function replaceLessonQuery(lessonId,locationObject,historyObject){
 const lesson=validLessonId(lessonId);
 if(!locationObject?.href||!historyObject?.replaceState)return false;
 try{
  const url=new URL(locationObject.href);
  if(lesson===null)url.searchParams.delete('lesson');
  else url.searchParams.set('lesson',String(lesson));
  // A specific action-page bookmark must not override the new lesson scope.
  url.searchParams.delete('page');
  historyObject.replaceState(historyObject.state||null,'',url.pathname+url.search+url.hash);
  return true;
 }catch{return false;}
}
