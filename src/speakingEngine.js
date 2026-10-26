import {lessons} from './courseData.js';
import {classNotes} from './classNotesData.js';
import {ALPHABET_CARDS} from './visualDictionary.js';
import {germanNumber} from './learningData.js';
import {numbersInSection,NUMBER_SECTIONS} from './numberSections.js';

// Audio itself is never recorded or stored by this module.
// SpeechRecognition may send audio to the browser vendor's recognition service.
export const SPEAKING_KEY='dt_speaking_v1';
export const SPEAKING_CATEGORIES=[
 {id:'numbers',title:'اعداد',icon:'🔢',detail:'۰–۱۲ · ۱۳–۲۰ · ۲۰–۳۰'},
 {id:'letters',title:'حروف',icon:'🔤',detail:'نام حرف همراه با واژه نمونه'},
 {id:'words',title:'کلمات',icon:'📚',detail:'واژه‌های درس و جزوه استاد'},
 {id:'sentences',title:'جمله‌ها',icon:'💬',detail:'معرفی، مکالمه و محیط کار'}
];
const DAY=86400000;
export const makeSpeakingState=()=>({version:1,items:{},history:[],total:0});
const localDay=time=>{const d=new Date(time);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};

export function germanSpeechNormalize(text=''){
 return String(text||'').normalize('NFC').toLocaleLowerCase('de')
  .replace(/\b\d{1,3}\b/g,match=>germanNumber(Number(match)))
  .replace(/[„“”"«».,!?;:()\[\]–—]/g,' ')
  .replace(/\b(ein|eins)\s+und\s+(zwanzig|dreißig|vierzig|fünfzig|sechzig|siebzig|achtzig|neunzig)\b/g,(_,a,b)=>(a==='eins'?'ein':a)+'und'+b)
  .replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')
  .replace(/[^a-z\s-]/g,' ').replace(/-/g,' ').replace(/\s+/g,' ').trim();
}
function editDistance(a,b){
 const x=Array.from(a),y=Array.from(b);
 if(!x.length)return y.length;
 const p=Array.from({length:y.length+1},(_,i)=>i);
 for(let i=1;i<=x.length;i++){
  let diag=p[0];p[0]=i;
  for(let j=1;j<=y.length;j++){
   const old=p[j];
   p[j]=Math.min(p[j]+1,p[j-1]+1,diag+(x[i-1]===y[j-1]?0:1));
   diag=old;
  }
 }
 return p[y.length];
}
function tokenMatch(expected,heard){
 const a=expected.split(' ').filter(Boolean),b=heard.split(' ').filter(Boolean);
 if(!a.length)return 0;
 const dp=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){
  dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
 }
 return dp[a.length][b.length]/Math.max(a.length,b.length);
}
export function scoreSpeechMatch(reference,heard,category='words'){
 const ref=germanSpeechNormalize(reference),out=germanSpeechNormalize(heard);
 if(!ref||!out)return {score:0,exact:false,expected:ref,heard:out,matched:[],missing:ref.split(' ').filter(Boolean),extra:out.split(' ').filter(Boolean)};
 const a=ref.split(' '),b=out.split(' ');
 const used=new Set();
 const matched=[],missing=[];
 for(const word of a){
  const idx=b.findIndex((candidate,index)=>!used.has(index)&&candidate===word);
  if(idx>=0){used.add(idx);matched.push(word);}else missing.push(word);
 }
 const extra=b.filter((_,index)=>!used.has(index));
 const similarity=1-editDistance(ref,out)/Math.max(ref.length,out.length,1);
 const wordSimilarity=tokenMatch(ref,out);
 const exact=ref===out;
 const calculated=a.length===1?similarity:(.65*wordSimilarity+.35*similarity);
 const score=exact?100:Math.max(0,Math.min(99,Math.round(100*calculated)));
 return {score,exact,expected:ref,heard:out,matched,missing,extra};
}
function unique(items){
 const ids=new Set();return items.filter(x=>{if(ids.has(x.id))return false;ids.add(x.id);return Boolean(x.text.trim());});
}
export function speakingCards(category='numbers',{range='0-12',progress={}}={}){
 if(category==='numbers')return numbersInSection(range).map(n=>({id:'number:'+n,category,text:germanNumber(n),label:String(n),meaning:'عدد '+n,number:n}));
 if(category==='letters')return ALPHABET_CARDS.map(a=>({
  id:'letter:'+a.letter,category,text:a.letter==='ß'?'Eszett wie Straße':a.letter+' wie '+a.example,
  label:a.letter,meaning:a.fa,letter:a.letter,note:'حرف را در عبارت «... wie ...» بگو تا تشخیص گفتار مطمئن‌تر شود.'
 }));
 const enabled=lessons.filter(l=>l.id===1||progress[l.id]?.started);
 if(category==='words'){
  const words=enabled.flatMap(l=>l.words.map(([de,fa],index)=>({
   id:'word:'+l.id+':'+index,category,text:de,label:de,meaning:fa,lesson:l.id
  })));
  const notes=classNotes.filter(x=>x.set==='classroom').map(x=>({
   id:'classword:'+x.id,category,text:x.de,label:x.de,meaning:x.fa,lesson:1
  }));
  return unique([...words,...notes]);
 }
 if(category==='sentences'){
  const fromLessons=enabled.flatMap(l=>l.sentences.map(([de,fa],index)=>({
   id:'sentence:'+l.id+':'+index,category,text:de,label:de,meaning:fa,lesson:l.id
  })));
  const notes=classNotes.filter(x=>x.set==='origin'||x.set==='greetings').map(x=>({
   id:'classsentence:'+x.id,category,text:x.de,label:x.de,meaning:x.fa,lesson:1
  }));
  return unique([...fromLessons,...notes]);
 }
 throw new Error('Unknown speaking category');
}
function shuffle(items,random){
 const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.min(i,Math.floor(random()*(i+1)));[a[i],a[j]]=[a[j],a[i]];}return a;
}
export function speakingReview(cards,state={},size=8,random=Math.random,now=Date.now()){
 const items=state?.items||{};
 const scored=shuffle(cards,random).map(c=>{
  const item=items[c.id];let priority=0;
  if(!item)priority=45;
  else if(item.lastScore<65)priority=100;
  else if(item.dueAt<=now)priority=95;
  else if(item.lastScore<85)priority=85;
  else priority=12;
  return {...c,priority};
 }).sort((a,b)=>b.priority-a.priority);
 const count=Math.max(1,Math.min(Math.trunc(size)||8,scored.length));
 const weak=scored.filter(c=>c.priority>=85).slice(0,Math.ceil(count*.7));
 const picked=new Set(weak.map(c=>c.id));
 return [...weak,...scored.filter(c=>!picked.has(c.id)).slice(0,count-weak.length)].map(({priority,...rest})=>rest);
}
export function addSpeechReview(previous={},card,scoreData,recognized,now=Date.now()){
 if(!card?.id||!Number.isFinite(scoreData?.score))throw new Error('Invalid speech review');
 const src=previous?.items||{},old=src[card.id]||{};
 const score=scoreData.score,attempts=(old.attempts||0)+1;
 const avgScore=Math.round(((old.avgScore||0)*(attempts-1)+score)/attempts);
 const successful=score>=85;
 const today=localDay(now);
 const goodDays=successful ? (old.lastGoodDay===today?(old.goodDays||0):(old.goodDays||0)+1) : old.goodDays||0;
 const streak=successful?(old.streak||0)+1:0;
 const dueMs=score>=90?3*DAY:score>=85?DAY:score>=65?6*3600000:60*60000;
 const entry={id:card.id,category:card.category,text:card.text,attempts,avgScore,lastScore:score,
  bestScore:Math.max(old.bestScore||0,score),lastAt:now,dueAt:now+dueMs,goodDays,streak,
  lastGoodDay:successful?today:(old.lastGoodDay||null),
  lastHeard:String(recognized||'').slice(0,250)};
 const history=[...(previous.history||[]),{id:card.id,category:card.category,score,at:now}].slice(-120);
 return {version:1,items:{...src,[card.id]:entry},history,total:(previous.total||0)+1};
}
export function speakingStatus(entry,now=Date.now()){
 if(!entry)return 'new';
 if(entry.goodDays>=2&&entry.avgScore>=85&&entry.attempts>=3)return 'mastered';
 if(entry.lastScore<65 || entry.dueAt<=now)return 'weak';
 return 'learning';
}
export function speakingStats(state={},category,now=Date.now()){
 const all=Object.values(state?.items||{}).filter(item=>!category||item.category===category);
 const attempts=all.reduce((a,b)=>a+(b.attempts||0),0);
 const total=all.reduce((a,b)=>a+(b.avgScore||0)*(b.attempts||0),0);
 return {items:all.length,attempts,average:attempts?Math.round(total/attempts):null,
  mastered:all.filter(x=>speakingStatus(x,now)==='mastered').length,
  weak:all.filter(x=>speakingStatus(x,now)==='weak').length,
  newCount:all.filter(x=>speakingStatus(x,now)==='new').length};
}
