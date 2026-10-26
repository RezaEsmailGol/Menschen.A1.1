import {activityItemKey} from './learningMemory.js';
import {germanNumber} from './learningData.js';

// The shared number syllabus. 20 deliberately bridges the last two lessons.
// Never change number mastery IDs when moving between sections.
export const NUMBER_SECTIONS=Object.freeze([
  {id:'0-12',min:0,max:12,label:'۰ تا ۱۲',subtitle:'پایه · null تا zwölf',icon:'🌱'},
  {id:'13-20',min:13,max:20,label:'۱۳ تا ۲۰',subtitle:'اعداد نوجوان · استثناهای ۱۶ و ۱۷',icon:'⭐'},
  {id:'20-30',min:20,max:30,label:'۲۰ تا ۳۰',subtitle:'ساخت عدد · einundzwanzig تا dreißig',icon:'🚀'}
]);
export function numberSection(id='0-12'){
 const section=NUMBER_SECTIONS.find(s=>s.id===id);
 if(!section)throw new Error('Unsupported number range');
 return section;
}
export function resolveNumberSection(range='0-12'){
 if(typeof range==='string')return numberSection(range);
 if([12,20,100].includes(range))
   return {id:'legacy-'+range,min:0,max:range,label:'۰ تا '+range,subtitle:'',icon:''};
 throw new Error('Unsupported number range');
}
export function numbersInSection(range='0-12'){
 const {min,max}=resolveNumberSection(range);
 return Array.from({length:max-min+1},(_,i)=>min+i);
}
export function shuffleNumberItems(items,random=Math.random){
 const out=[...items];
 for(let i=out.length-1;i>0;i--){
  const j=Math.max(0,Math.min(i,Math.floor(random()*(i+1))));
  [out[i],out[j]]=[out[j],out[i]];
 }
 return out;
}
export function adaptiveNumberSelection(range='0-12',memory={},size=10,random=Math.random,now=Date.now()){
 const pool=numbersInSection(range);
 const records=memory?.items||{};
 const weak=pool.filter(n=>{
  const r=records[activityItemKey('number',n)];
  return r&&(r.lastCorrect===false||r.mastery<55||(Number.isFinite(r.nextAt)&&r.nextAt<=now));
 });
 const target=Math.min(Math.max(1,Math.floor(size)),pool.length);
 const due=shuffleNumberItems(weak,random).slice(0,Math.min(Math.ceil(target*.6),weak.length));
 const selected=new Set(due);
 const others=shuffleNumberItems(pool.filter(n=>!selected.has(n)),random).slice(0,target-due.length);
 return [...due,...others];
}
export function numberSectionStats(range,memory={},now=Date.now()){
 const pool=numbersInSection(range);
 let mastered=0,weak=0,learned=0;
 for(const n of pool){
  const r=memory?.items?.[activityItemKey('number',n)];
  if(!r)continue;
  learned++;
  if(r.mastery>=80 && r.correct>=3 && r.reviewedDays>=2)mastered++;
  else if(r.lastCorrect===false||r.mastery<55||(r.nextAt&&r.nextAt<=now))weak++;
 }
 return {total:pool.length,mastered,weak,learned,new:pool.length-learned};
}
export function correctNumberSpelling(value,number){
 return String(value).normalize('NFC').trim().toLocaleLowerCase('de')
  .replace(/\s+/g,'')===germanNumber(number);
}
export function numberTip(number){
 if(number===16)return 'sechs + zehn → sechzehn؛ حرف s پایانیِ sechs حذف می‌شود.';
 if(number===17)return 'sieben + zehn → siebzehn؛ بخش en از sieben حذف می‌شود.';
 if(number===20)return 'zwanzig؛ شکل بیست را به‌صورت یک کلمه حفظ کن.';
 if(number===30)return 'dreißig؛ با ß نوشته می‌شود، نه dreizig.';
 if(number===21)return 'ein + und + zwanzig → einundzwanzig؛ eins به ein تبدیل می‌شود.';
 if(number>=22 && number<=29)return 'در آلمانی یکان + und + دهگان گفته می‌شود.';
 return '';
}
