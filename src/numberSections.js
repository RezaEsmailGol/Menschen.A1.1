import {activityItemKey} from './learningMemory.js';
import {germanNumber} from './learningData.js';

export const NUMBER_MAX=100000000;
// Older range IDs remain unchanged for saved progress and teacher workbook.
export const NUMBER_SECTIONS=Object.freeze([
  {id:'0-12',min:0,max:12,label:'۰ تا ۱۲',subtitle:'null تا zwölf',icon:'🌱'},
  {id:'13-20',min:13,max:20,label:'۱۳ تا ۲۰',subtitle:'استثناهای ۱۶ و ۱۷',icon:'⭐'},
  {id:'20-30',min:20,max:30,label:'۲۰ تا ۳۰',subtitle:'یکان + und + دهگان',icon:'🚀'},
  {id:'31-50',min:31,max:50,label:'۳۱ تا ۵۰',subtitle:'dreißig تا fünfzig',icon:'🎲'},
  {id:'51-70',min:51,max:70,label:'۵۱ تا ۷۰',subtitle:'sechzig / siebzig',icon:'🎧'},
  {id:'71-100',min:71,max:100,label:'۷۱ تا ۱۰۰',subtitle:'تا hundert',icon:'🏆'},
  {id:'0-100',min:0,max:100,label:'همه ۰ تا ۱۰۰',subtitle:'چالش تصادفی پایه',icon:'🌍'},
  {id:'confusing',min:2,max:92,label:'اعداد گیج‌کننده',subtitle:'zwei / zwölf / zwanzig',icon:'🧠',
    numbers:[2,12,20,22,32,42,52,62,72,82,92,16,17,30,60,70,13,14,15,19]},
  {id:'101-1000',min:101,max:1000,label:'۱۰۱ تا ۱٬۰۰۰',subtitle:'صدگان / hundert',icon:'🧮'},
  {id:'1001-10000',min:1001,max:10000,label:'۱٬۰۰۱ تا ۱۰ هزار',subtitle:'هزارگان / tausend',icon:'📊'},
  {id:'10001-100000',min:10001,max:100000,label:'۱۰ تا ۱۰۰ هزار',subtitle:'اعداد چندبخشی',icon:'🪜'},
  {id:'100001-1000000',min:100001,max:1000000,label:'۱۰۰ هزار تا ۱ میلیون',subtitle:'hunderttausend تا Million',icon:'💎'},
  {id:'1000001-10000000',min:1000001,max:10000000,label:'۱ تا ۱۰ میلیون',subtitle:'eine Million / Millionen',icon:'🌟'},
  {id:'10000001-100000000',min:10000001,max:NUMBER_MAX,label:'۱۰ تا ۱۰۰ میلیون',subtitle:'اعداد بزرگ چندبخشی',icon:'🚀'},
  {id:'0-100000000',min:0,max:NUMBER_MAX,label:'همه ۰ تا ۱۰۰ میلیون',subtitle:'چالش نهایی تصادفی',icon:'🌐'}
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
export function numberRangeCount(range='0-12'){
 const {min,max,numbers}=resolveNumberSection(range);
 return numbers?numbers.length:max-min+1;
}
// Full enumeration is allowed only for classroom-size sections (<= 1000 values).
// A 100-million-element array would crash or freeze mobile devices.
export function numbersInSection(range='0-12'){
 const {min,max,numbers}=resolveNumberSection(range);
 if(numbers)return [...numbers];
 if(max-min+1>1000)throw new RangeError('Large number sections must use sampled selection');
 return Array.from({length:max-min+1},(_,i)=>min+i);
}
export function numberReferenceNumbers(range='0-12'){
 const {min,max,numbers}=resolveNumberSection(range);
 if(numbers)return [...numbers];
 if(max-min+1<=101)return numbersInSection(range);
 const anchors=[min,min+1,min+2,max-1,max,
   0,1,2,12,20,21,30,42,60,70,100,101,111,200,500,999,
   1000,1001,1010,1100,1234,2000,10000,10001,100000,100001,
   1000000,1000001,2000000,10000000,10000001,12345678,99999999,100000000];
 const step=Math.max(1,Math.floor((max-min)/10));
 for(let i=1;i<10;i++)anchors.push(min+i*step);
 return [...new Set(anchors.filter(n=>Number.isInteger(n)&&n>=min&&n<=max))].sort((a,b)=>a-b).slice(0,55);
}
export function shuffleNumberItems(items,random=Math.random){
 const out=[...items];
 for(let i=out.length-1;i>0;i--){
  const j=Math.max(0,Math.min(i,Math.floor(random()*(i+1))));
  [out[i],out[j]]=[out[j],out[i]];
 }
 return out;
}
function validNumber(section,n){
 return Number.isSafeInteger(n)&&n>=section.min&&n<=section.max
   &&(!section.numbers||section.numbers.includes(n));
}
function numberFromRandom(section,random){
 if(section.numbers)return section.numbers[Math.max(0,Math.min(section.numbers.length-1,Math.floor(random()*section.numbers.length)))];
 return section.min+Math.max(0,Math.min(section.max-section.min,Math.floor(random()*(section.max-section.min+1))));
}
export function adaptiveNumberSelection(range='0-12',memory={},size=10,random=Math.random,now=Date.now()){
 const section=resolveNumberSection(range);
 const target=Math.min(Math.max(1,Math.floor(size)),numberRangeCount(range));
 const records=memory?.items||{};
 if(numberRangeCount(range)<=1000){
  const pool=numbersInSection(range);
  const weak=pool.filter(n=>{
   const r=records[activityItemKey('number',n)];
   return r&&(r.lastCorrect===false||r.mastery<55||(Number.isFinite(r.nextAt)&&r.nextAt<=now));
  });
  const due=shuffleNumberItems(weak,random).slice(0,Math.min(Math.ceil(target*.6),weak.length));
  const selected=new Set(due);
  const others=shuffleNumberItems(pool.filter(n=>!selected.has(n)),random).slice(0,target-due.length);
  return [...due,...others];
 }
 // O(reviewed items + ten questions), regardless of numeric range length.
 const weak=Object.entries(records).flatMap(([id,r])=>{
  if(!/^number:\d+$/.test(id))return [];
  const n=Number(id.slice(7));
  return validNumber(section,n)&&(r?.lastCorrect===false||r?.mastery<55||(Number.isFinite(r?.nextAt)&&r.nextAt<=now))?[n]:[];
 });
 const due=shuffleNumberItems(weak,random).slice(0,Math.min(Math.ceil(target*.6),weak.length));
 const picked=new Set(due);
 const total=section.max-section.min+1;
 for(let i=0;picked.size<target&&i<target*50;i++){
  const n=numberFromRandom(section,random);
  if(!picked.has(n))picked.add(n);
  else if(i>target*4){
   const alternative=section.min+(n-section.min+1+i)%total;
   picked.add(alternative);
  }
 }
 // Deterministic fallback even with a constant random stub in tests.
 for(let k=0;picked.size<target&&k<target*2;k++)picked.add(section.min+k);
 return [...picked].slice(0,target);
}
export function numberSectionStats(range,memory={},now=Date.now()){
 const section=resolveNumberSection(range);
 const total=numberRangeCount(range);
 let mastered=0,weak=0,learned=0;
 // Never iterate all numbers in a large interval.
 for(const [id,r] of Object.entries(memory?.items||{})){
  if(!/^number:\d+$/.test(id)||!validNumber(section,Number(id.slice(7))))continue;
  learned++;
  if(r?.mastery>=80&&r.correct>=3&&r.reviewedDays>=2)mastered++;
  else if(r?.lastCorrect===false||r?.mastery<55||(Number.isFinite(r?.nextAt)&&r.nextAt<=now))weak++;
 }
 return {total,mastered,weak,learned,new:total-learned};
}
export function correctNumberSpelling(value,number){
 const de=germanNumber(number);
 if(!de)return false;
 const normalized=String(value??'').normalize('NFC').trim().toLocaleLowerCase('de').replace(/\s+/g,'');
 const expected=de.toLocaleLowerCase('de').replace(/\s+/g,'');
 if(normalized===expected)return true;
 if(number===100&&normalized==='einhundert')return true;
 return false;
}
export function numberTip(number){
 if(number===16)return 'sechs + zehn → sechzehn؛ حرف s پایانیِ sechs حذف می‌شود.';
 if(number===17)return 'sieben + zehn → siebzehn؛ بخش en از sieben حذف می‌شود.';
 if(number===20)return 'zwanzig؛ شکل بیست را به‌صورت یک کلمه حفظ کن.';
 if(number===30)return 'dreißig؛ با ß نوشته می‌شود، نه dreizig.';
 if(number===21)return 'ein + und + zwanzig → einundzwanzig؛ eins به ein تبدیل می‌شود.';
 if(number===60)return 'sechzig؛ از sechs حرف s آخر حذف می‌شود.';
 if(number===70)return 'siebzig؛ از sieben بخش en حذف می‌شود.';
 if(number===100)return 'hundert یا einhundert؛ ۱۰۰ را به شکل مستقل به خاطر بسپار.';
 if(number===2||number===12)return 'zwei یعنی ۲، zwölf یعنی ۱۲ و zwanzig یعنی ۲۰؛ هر سه را جدا بشنو.';
 if(number>=1000000)return 'برای یک میلیون می‌گوییم eine Million و برای چند میلیون: zwei Millionen. بخش کمتر از میلیون جدا نوشته می‌شود.';
 if(number>=1000)return 'هزار با tausend نوشته می‌شود. مثل zweitausendfünfhundert = ۲۵۰۰.';
 if(number>=100)return 'صدگان به شکل einhundert، zweihundert، dreihundert ... ساخته می‌شوند.';
 if(number>=21 && number<=99 && number%10!==0)return 'در آلمانی ابتدا یکان، سپس und و بعد دهگان گفته می‌شود؛ مثل zweiundvierzig = ۴۲.';
 return '';
}
