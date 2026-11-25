import {germanNumber} from './learningData.js';
import {correctNumberSpelling,shuffleNumberItems} from './numberSections.js';
import {BOOK_TIMES,PRECISION_TIMES,parseClock,toFormal,toColloquial} from './lesson8MinuteEngine.js';

export const INTENSIVE_KEY='dt_intensive_spelling_v1';

export const NUMBER_LEVELS=Object.freeze([
 {id:'basics',label:'۰ تا ۲۰',hint:'eins, zwölf, sechzehn',values:Array.from({length:21},(_,n)=>n)},
 {id:'tens',label:'دهگان‌ها',hint:'zehn، zwanzig، vierzig، neunzig',values:[10,20,30,40,50,60,70,80,90,100]},
 {id:'mixed',label:'۲۱ تا ۹۹',hint:'einundzwanzig، zweiundvierzig',values:[21,22,23,24,25,29,31,32,34,37,39,41,42,46,48,49,51,52,56,59,61,62,67,69,71,72,76,79,81,82,84,87,91,92,96,99]},
 {id:'hundreds',label:'صدگان تا ۱۰۰۰',hint:'hundert، zweihundert، dreihundert',values:[100,101,110,111,115,120,121,125,150,199,200,201,210,215,220,230,234,250,275,299,300,301,310,320,340,360,399,400,450,500,600,700,800,900,999,1000]},
 {id:'all',label:'آزمون سخت ترکیبی',hint:'۰ تا ۱۰۰۰ · همه الگوها',values:[0,1,2,7,10,11,12,13,15,16,17,19,20,21,22,25,30,31,32,37,40,42,50,56,60,61,67,70,71,75,80,84,90,99,100,101,110,111,115,121,199,200,201,230,234,250,300,301,340,399,400,500,999,1000]}
]);
const EXTRA_CLOCKS=Object.freeze([
 '00:00','01:00','02:05','03:10','04:15','05:20','06:25','07:30','08:35','09:40',
 '10:45','11:50','12:00','12:05','13:00','13:15','14:00','14:25','15:30','16:45',
 '17:55','18:10','19:20','20:30','21:35','22:45','23:15'
]);
export const CLOCK_TIMES=Object.freeze([...new Set([...BOOK_TIMES,...PRECISION_TIMES,...EXTRA_CLOCKS])]);
export const CLOCK_LEVELS=Object.freeze([
 {id:'book',label:'ساعت‌های کتاب',hint:'۹ ساعت از تمرین درس ۸',values:BOOK_TIMES},
 {id:'quarter',label:'ربع و نیم',hint:'Viertel، halb، vor و nach',values:CLOCK_TIMES.filter(t=>[0,15,25,30,35,45].includes(Number(t.slice(3))))},
 {id:'minute',label:'دقیق تا دقیقه',hint:'دقیقه‌های ۰۱ تا ۵۹',values:CLOCK_TIMES.filter(t=>![0,15,30,45].includes(Number(t.slice(3))))},
 {id:'all',label:'همه ساعت‌ها',hint:'رسمی و محاوره‌ای · ترکیبی',values:CLOCK_TIMES}
]);

export function drillKey(kind,value,clockStyle='formal'){
 if(kind==='number')return 'number:'+String(value);
 if(kind==='clock'&&['formal','colloquial'].includes(clockStyle)&&parseClock(String(value)))return 'clock:'+clockStyle+':'+value;
 throw new Error('Invalid drill key');
}
export function loadIntensiveProgress(storage){
 try{
  const raw=JSON.parse(storage?.getItem(INTENSIVE_KEY)||'{}');
  return raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 }catch{return {};}
}
export function saveIntensiveProgress(storage,records){
 try{storage?.setItem(INTENSIVE_KEY,JSON.stringify(records));return true}catch{return false}
}
export function recordIntensiveAnswer(previous={},key,correct,now=Date.now()){
 if(typeof key!=='string'||!key||typeof correct!=='boolean')throw new Error('Invalid attempt');
 const old=previous[key]||{};
 return {...previous,[key]:{
  attempts:(old.attempts||0)+1,correct:(old.correct||0)+Number(correct),
  mistakes:(old.mistakes||0)+Number(!correct),lastCorrect:correct,
  lastAt:now,streak:correct?(old.streak||0)+1:0
 }};
}
export function weakDrillItems(kind,level,records={},clockStyle='formal'){
 const choices=(kind==='number'?NUMBER_LEVELS:CLOCK_LEVELS).find(v=>v.id===level)?.values||[];
 return choices.filter(value=>records[drillKey(kind,value,clockStyle)]?.lastCorrect===false);
}
export function makeIntensiveRound(kind,level,records={},clockStyle='formal',onlyWeak=false,size=16,random=Math.random){
 const stages=kind==='number'?NUMBER_LEVELS:CLOCK_LEVELS;
 const stage=stages.find(x=>x.id===level);
 if(!stage)throw new Error('Unknown level');
 const weak=weakDrillItems(kind,level,records,clockStyle);
 const pool=onlyWeak?weak:stage.values;
 const selected=onlyWeak?shuffleNumberItems(pool,random):
  [...shuffleNumberItems(weak,random),...shuffleNumberItems(pool.filter(v=>!weak.includes(v)),random)];
 return selected.slice(0,Math.max(1,Math.min(24,Math.floor(size)))).map(value=>({value,retry:false}));
}
export function clockAnswer(time,style='formal'){
 const parsed=parseClock(String(time));
 if(!parsed||!['formal','colloquial'].includes(style))throw new Error('Invalid time');
 return style==='formal'?toFormal(parsed.hour,parsed.minute):toColloquial(parsed.hour,parsed.minute);
}
export function normalizeGermanInput(input){
 return String(input??'').normalize('NFC').toLocaleLowerCase('de-DE')
  .trim().replace(/\s+/g,' ').replace(/[.!?]+$/,'').trim();
}
export function toLatinDigits(text){
 return String(text??'').replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c)))
  .replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)));
}
export function checkIntensiveAnswer({kind,value,clockStyle='formal',method='write',input}){
 if(kind==='number'){
  if(method==='reverse'){
   const normalized=toLatinDigits(input).trim().replace(/[٬,\s]/g,'');
   return /^\d+$/.test(normalized)&&Number(normalized)===Number(value);
  }
  return correctNumberSpelling(input,Number(value));
 }
 if(kind==='clock'){
  return normalizeGermanInput(input)===normalizeGermanInput(clockAnswer(value,clockStyle));
 }
 return false;
}
