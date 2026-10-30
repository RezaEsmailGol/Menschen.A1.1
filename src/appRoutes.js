// Browser routes: distinct shareable URLs for every screen and individual lesson.
export const ROUTES=Object.freeze({
  home:'/', course:'/lessons', practice:'/practice', progress:'/progress', coach:'/coach',
  classNotes:'/class-notes', vocabulary:'/vocabulary', night:'/night-shift', visualMemory:'/visual-memory',
  workbook:'/workbook', dialogues:'/dialogues',visual:'/visual-lesson',pictureGame:'/picture-game', srs:'/review',builder:'/sentences',exam:'/lesson-test',
  numbers:'/numbers',pronunciation:'/pronunciation',speaking:'/speaking',flash:'/flashcards',
  listen:'/dictation',words:'/first-words',alphabet:'/alphabet',verbs:'/verbs'
});
export const DIALOGUE_IDS=Object.freeze(['greetings','origin','cafe','office','interview']);
export const WORKBOOK_PAGES=Object.freeze(['start','alphabet','sounds','numbers','verbs','dialog','checkpoint']);
function validLesson(value){
 const number=Number(value);
 return /^[0-9]+$/.test(value) && Number.isInteger(number) && number>=1 && number<=12 && String(number)===value;
}
export function normalizeRoute(route){
 if(typeof route!=='string')return 'home';
 const sanitized=route.trim().replace(/^\/+|\/+$/g,'');
 if(sanitized.startsWith('dialogues/')){
   const id=sanitized.slice('dialogues/'.length);
   return DIALOGUE_IDS.includes(id)?'dialogues/'+id:'dialogues';
 }
 if(sanitized.startsWith('vocabulary/')){
   const lesson=sanitized.slice('vocabulary/'.length);
   return validLesson(lesson)?'vocabulary/'+lesson:'vocabulary';
 }
 if(sanitized.startsWith('course/')){
   const lesson=sanitized.slice('course/'.length);
   return validLesson(lesson)?'course/'+lesson:'course';
 }
 if(sanitized.startsWith('workbook/')){
   const page=sanitized.slice('workbook/'.length);
   return WORKBOOK_PAGES.includes(page)?'workbook/'+page:'workbook';
 }
 return Object.hasOwn(ROUTES,sanitized)?sanitized:'home';
}
export function pathForRoute(route){
 const id=normalizeRoute(route);
 if(id.startsWith('dialogues/'))return '/dialogues/'+id.slice('dialogues/'.length);
 if(id.startsWith('workbook/'))return '/workbook/'+id.slice('workbook/'.length);
 if(id.startsWith('course/'))return '/lessons/'+id.slice('course/'.length);
 if(id.startsWith('vocabulary/'))return '/vocabulary/'+id.slice('vocabulary/'.length);
 return ROUTES[id]||'/';
}
export function routeFromPath(pathname){
 const path=String(pathname||'/').replace(/\/+$/,'')||'/';
 if(path.startsWith('/dialogues/')){
   const id=path.slice('/dialogues/'.length);
   return DIALOGUE_IDS.includes(id)?'dialogues/'+id:'home';
 }
 if(path.startsWith('/vocabulary/')){
   const lesson=path.slice('/vocabulary/'.length);
   return validLesson(lesson)?'vocabulary/'+lesson:'home';
 }
 if(path.startsWith('/lessons/')){
   const lesson=path.slice('/lessons/'.length);
   return validLesson(lesson)?'course/'+lesson:'home';
 }
 if(path.startsWith('/workbook/')){
   const page=path.slice('/workbook/'.length);
   return WORKBOOK_PAGES.includes(page)?'workbook/'+page:'home';
 }
 return Object.keys(ROUTES).find(id=>ROUTES[id]===path)||'home';
}
