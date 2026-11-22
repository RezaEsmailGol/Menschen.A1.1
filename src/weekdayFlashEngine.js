// Seven-day vocabulary for Menschen A1.1 Lektion 8.
// Original practice content, independent of the publisher's printed exercises.
export const WEEKDAY_FLASH_KEY='dt_weekdays_flash_v1';
export const WEEKDAYS=Object.freeze([
 {de:'Montag',fa:'دوشنبه',abbr:'Mo',example:'Am Montag habe ich Zeit.',exampleFa:'دوشنبه وقت دارم.'},
 {de:'Dienstag',fa:'سه‌شنبه',abbr:'Di',example:'Am Dienstag arbeite ich.',exampleFa:'سه‌شنبه کار می‌کنم.'},
 {de:'Mittwoch',fa:'چهارشنبه',abbr:'Mi',example:'Am Mittwoch lerne ich Deutsch.',exampleFa:'چهارشنبه آلمانی یاد می‌گیرم.'},
 {de:'Donnerstag',fa:'پنج‌شنبه',abbr:'Do',example:'Am Donnerstag gehe ich ins Büro.',exampleFa:'پنج‌شنبه به دفتر می‌روم.'},
 {de:'Freitag',fa:'جمعه',abbr:'Fr',example:'Am Freitag habe ich frei.',exampleFa:'جمعه تعطیلم.'},
 {de:'Samstag',fa:'شنبه',abbr:'Sa',example:'Am Samstag gehe ich ins Kino.',exampleFa:'شنبه به سینما می‌روم.'},
 {de:'Sonntag',fa:'یکشنبه',abbr:'So',example:'Am Sonntag besuche ich Freunde.',exampleFa:'یکشنبه به دوستانم سر می‌زنم.'}
]);
export function weekdayOptions(index,mode='game'){
 if(!Number.isInteger(index)||index<0||index>=WEEKDAYS.length)throw new Error('Invalid weekday index');
 const indices=[index,(index+2)%7,(index+4)%7,(index+5)%7];
 const values=indices.map(i=>mode==='test'?WEEKDAYS[i].fa:WEEKDAYS[i].de);
 const offset=(index*3+1)%4;
 return values.slice(offset).concat(values.slice(0,offset));
}
export function gradeWeekday(index,mode,value){
 if(!['game','test'].includes(mode)||!WEEKDAYS[index])return false;
 return value===(mode==='test'?WEEKDAYS[index].fa:WEEKDAYS[index].de);
}
export function saveWeekdayProgress(previous={},word,correct,now=Date.now()){
 if(!WEEKDAYS.some(w=>w.de===word)||typeof correct!=='boolean')throw new Error('Invalid result');
 const old=previous[word]||{};
 return {...previous,[word]:{
  ...old,attempts:(old.attempts||0)+1,misses:(old.misses||0)+Number(!correct),
  streak:correct?(old.streak||0)+1:0,lastCorrect:correct,
  lastAt:now
 }};
}
export function markWeekdayLearned(previous={},word){
 if(!WEEKDAYS.some(w=>w.de===word))throw new Error('Invalid word');
 return {...previous,[word]:{...(previous[word]||{}),seen:true}};
}
export function weekdayWeakWords(state={}){
 return WEEKDAYS.filter(w=>state[w.de]?.lastCorrect===false);
}
