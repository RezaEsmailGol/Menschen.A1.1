// Menschen A1.1 Arbeitsbuch Lektion 8, p. 61 (PDF page 56), task 4.
// The nine clock readings below follow the printed page's time labels.
// Interactive question text and additional minute-precision drills are original.
export const MINUTE_KEY='dt_l8_minute_accuracy_v1';
export const BOOK_TIMES=Object.freeze([
  '09:55','14:30','17:10','20:15','11:45','07:05','15:50','16:35','09:25'
]);
export const PRECISION_TIMES=Object.freeze([
  '14:37','09:01','23:59','00:02','12:04','17:23','18:42','06:58',
  '20:39','11:11','10:50','19:25','07:45','15:15','23:30','08:26',
  '21:53','13:17','04:49','22:06','05:32','19:14','16:47','01:08'
]);
const small=['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn'];
const tens={20:'zwanzig',30:'dreißig',40:'vierzig',50:'fünfzig'};
export function germanNumber(number){
 const n=Number(number);
 if(!Number.isInteger(n)||n<0||n>=60)throw new Error('Invalid minute or hour');
 if(n<20)return small[n];
 if(n%10===0)return tens[n];
 return (n%10===1?'ein':small[n%10])+'und'+tens[Math.floor(n/10)*10];
}
export function parseClock(value){
 if(typeof value!=='string')return null;
 const latin=value.replace(/[۰-۹]/g,x=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(x))).replace(/[٠-٩]/g,x=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(x))).trim();
 const m=latin.match(/^(\d{1,2})\s*[:.]\s*(\d{1,2})$/);
 if(!m)return null;
 const hour=Number(m[1]),minute=Number(m[2]);
 return hour>=0&&hour<=23&&minute>=0&&minute<=59?{hour,minute}:null;
}
export function formatClock(hour,minute){
 if(!Number.isInteger(hour)||!Number.isInteger(minute)||hour<0||hour>23||minute<0||minute>59)throw new Error('Clock out of range');
 return String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0');
}
export function toFormal(hour,minute){
 formatClock(hour,minute);
 const hourText=hour===1?'ein':germanNumber(hour);
 return hourText+' Uhr'+(minute?' '+germanNumber(minute):'');
}
function hour12(h){return h%12||12}
function colloquialHour(h){const n=hour12(h);return n===1?'eins':germanNumber(n)}
export function toColloquial(hour,minute){
 formatClock(hour,minute);
 const current=colloquialHour(hour),next=colloquialHour(hour+1);
 if(minute===0)return (hour12(hour)===1?'ein':current)+' Uhr';
 if(minute===15)return 'Viertel nach '+current;
 if(minute===25)return 'fünf vor halb '+next;
 if(minute===30)return 'halb '+next;
 if(minute===35)return 'fünf nach halb '+next;
 if(minute===45)return 'Viertel vor '+next;
 if(minute%5===0&&minute<30)return germanNumber(minute)+' nach '+current;
 if(minute%5===0&&minute>30)return germanNumber(60-minute)+' vor '+next;
 // For odd minutes, an exact, natural 12-hour "Uhr" reading avoids
 // forcing an artificial '23 nach' phrasing in conversations.
 return (hour12(hour)===1?'ein':current)+' Uhr '+germanNumber(minute);
}
export function isExactMinute(value,expected){
 const one=parseClock(value),two=parseClock(expected);
 return Boolean(one&&two&&one.hour===two.hour&&one.minute===two.minute);
}
export const makeMinuteBank=times=>times.map((time,index)=>{
 const {hour,minute}=parseClock(time);
 return {id:'l8-time-'+time,time,hour,minute,source:index<BOOK_TIMES.length?'Arbeitsbuch 61 · Übung 4':'Zusatzübung',
  formal:toFormal(hour,minute),colloquial:toColloquial(hour,minute)};
});
export const minuteBookBank=Object.freeze(makeMinuteBank(BOOK_TIMES));
export const minutePrecisionBank=Object.freeze(makeMinuteBank(PRECISION_TIMES).map(x=>({...x,source:'Zusatzübung · Minutengenauigkeit'})));
export function clockChoiceOptions(item,mode='formal'){
 if(!item||!['formal','colloquial'].includes(mode))throw new Error('Invalid options');
 const origin=item.hour*60+item.minute;
 const shift=[0,1,5,-5,10,-1,30];
 const answers=[];
 for(const delta of shift){
  const t=(origin+delta+1440)%1440;
  const text=mode==='formal'?toFormal(Math.floor(t/60),t%60):toColloquial(Math.floor(t/60),t%60);
  if(!answers.includes(text))answers.push(text);
  if(answers.length===4)break;
 }
 const rot=(item.hour+item.minute)%4;
 return answers.slice(rot).concat(answers.slice(0,rot));
}
export function recordMinuteAttempt(previous={},item,mode,correct,now=Date.now()){
 if(!item?.id||!['formal','colloquial','dictation'].includes(mode)||typeof correct!=='boolean')throw new Error('Invalid clock attempt');
 const old=previous[item.id]||{};
 return {...previous,[item.id]:{
  ...old,attempts:(old.attempts||0)+1,misses:(old.misses||0)+Number(!correct),
  lastCorrect:correct,lastMode:mode,lastAt:now,completed:Boolean(old.completed)||correct
 }};
}
export function minuteWeak(previous={},bank=[...minuteBookBank,...minutePrecisionBank]){
 return bank.filter(item=>previous[item.id]?.lastCorrect===false);
}
export const dayRows=Object.freeze([
 ['Monday','Montag','دوشنبه'],['Tuesday','Dienstag','سه‌شنبه'],['Wednesday','Mittwoch','چهارشنبه'],
 ['Thursday','Donnerstag','پنج‌شنبه'],['Friday','Freitag','جمعه'],['Saturday','Samstag','شنبه'],['Sunday','Sonntag','یکشنبه']
]);
export const appointmentChoices=Object.freeze([
 {ask:'Hast du am Freitag Zeit?',fa:'جمعه وقت داری؟',answer:'Leider kann ich am Freitag nicht.',choices:['Leider kann ich am Freitag nicht.','Ich bin sechzehn Jahre alt.','Das ist meine Schwester.']},
 {ask:'Und am Samstag?',fa:'شنبه چطور؟',answer:'Am Samstag habe ich Zeit.',choices:['Ich lerne montags Deutsch.','Am Samstag habe ich Zeit.','Das kostet fünf Euro.']},
 {ask:'Wann treffen wir uns?',fa:'کی قرار بگذاریم؟',answer:'Um vier Uhr.',choices:['Im Sommer.','Um vier Uhr.','In der Schule.']},
 {ask:'Vier Uhr ist zu spät. Geht es um zwei?',fa:'ساعت چهار دیر است؛ ساعت دو می‌شود؟',answer:'Zwei Uhr ist okay.',choices:['Zwei Uhr ist okay.','Ich wohne in Wien.','Das ist teuer.']},
 {ask:'Dann bis Samstag!',fa:'پس تا شنبه!',answer:'Ja, bis dann!',choices:['Nie.','Ja, bis dann!','Um neunzehn Uhr.']}
]);
