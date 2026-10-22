import {workbookAlphabet,workbookSounds,workbookPronouns,workbookDialog,
 workbookFillSentences,workbookNumbers,shuffleWorkbook} from './teacherLessonData.js';
import {activityItemKey} from './learningMemory.js';
import {createNumberMemoryRound} from './numberRecallLogic.js';

export const WB_CHALLENGE_MODES=Object.freeze([
 {id:'mixed',title:'ترکیبی'}, {id:'listen',title:'فقط شنیداری'}, {id:'read',title:'فقط خواندنی'}
]);
export const WB_CHALLENGE_SECTIONS=Object.freeze(['alphabet','sounds','verbs','dialog','checkpoint']);
export const WB_VERBS=Object.freeze(['kommen','sammeln']);

const soundConcepts=[
 {id:'s',prompt:'کدام کلمه با صدای /z/ آغاز می‌شود؟',answer:'Sonne',wrong:['Haus','Sport','Schule']},
 {id:'sp',prompt:'کدام کلمه با صدای /ʃp/ (شپ) آغاز می‌شود؟',answer:'Sport',wrong:['Wespe','Schule','Zeit']},
 {id:'st',prompt:'کدام کلمه با صدای /ʃt/ (شت) آغاز می‌شود؟',answer:'Stadt',wrong:['Westen','Sport','Sonne']},
 {id:'v',prompt:'در کدام واژه V مانند /f/ تلفظ می‌شود؟',answer:'Vater',wrong:['Verb','Video','Vase']},
 {id:'j',prompt:'کدام کلمه با صدای /j/ (ی) آغاز می‌شود؟',answer:'Jahr',wrong:['Job','Deutsch','Schule']},
 {id:'z',prompt:'کدام کلمه با صدای /ts/ شروع می‌شود؟',answer:'Zeit',wrong:['Sonne','Wasser','Vater']},
 {id:'ch',prompt:'کدام واژه صدای نرم ch مانند /ç/ دارد؟',answer:'ich',wrong:['Bach','Dach','Buch']},
 {id:'chs',prompt:'در کدام واژه chs مثل /ks/ شنیده می‌شود؟',answer:'sechs',wrong:['Bach','ich','Buch']},
 {id:'sch',prompt:'کدام واژه ترکیب sch با صدای /ʃ/ دارد؟',answer:'Schule',wrong:['Deutsch','Zeit','Bach']},
 {id:'tsch',prompt:'در کدام کلمه tsch صدای «چ» می‌سازد؟',answer:'Deutsch',wrong:['Schule','Sonne','Haus']},
 {id:'ph',prompt:'در کدام واژه ph با صدای /f/ تلفظ می‌شود؟',answer:'Physik',wrong:['Vater','Foto','Wasser']},
 {id:'ei',prompt:'کدام واژه دارای ei با صدای /aɪ/ است؟',answer:'mein',wrong:['Liebe','sieben','Milch']},
 {id:'ie',prompt:'کدام واژه دارای ie با واکه کشیده /iː/ است؟',answer:'Liebe',wrong:['mein','Zeit','Haus']},
 {id:'eu',prompt:'در کدام کلمه eu مانند /ɔɪ/ شنیده می‌شود؟',answer:'heute',wrong:['Haus','Liebe','mein']},
 {id:'w',prompt:'کدام واژه با W به صدای /v/ آغاز می‌شود؟',answer:'Wasser',wrong:['Vater','Sport','Sonne']}
];
const findSoundRule=id=>workbookSounds.find(x=>x.id===id||x.cluster===id);
const modeOf=(requested,index,random)=>requested==='mixed'?
 shuffleWorkbook(['listen','read'],random)[index%2]:requested;
function masteryRecord(memory,key){
 const record=memory?.items?.[key];
 return record&&Number(record.attempts)>0?record:null;
}
export function prioritizeWorkbookItems(questions,memory={},limit=10,random=Math.random,now=Date.now()){
 if(!Array.isArray(questions))return [];
 const visited=new Set();
 const pool=questions.filter(q=>{
  if(!q?.id||visited.has(q.id))return false;
  visited.add(q.id);
  return true;
 });
 const due=pool.filter(q=>{
  const x=masteryRecord(memory,q.id);
  return x&&(x.lastCorrect===false||Number(x.mastery)<55||Number(x.nextAt||0)<=now);
 });
 const dueOrder=shuffleWorkbook(due,random);
 const dueMax=Math.min(dueOrder.length,Math.ceil(Math.min(limit,pool.length)*0.6));
 const reserved=dueOrder.slice(0,dueMax);
 const remainder=shuffleWorkbook(pool.filter(q=>!reserved.includes(q)),random);
 return [...reserved,...remainder].slice(0,Math.min(limit,pool.length));
}
function withOptions(q,answer,wrong,random){
 const distinct=[answer,...wrong].filter((value,i,arr)=>arr.indexOf(value)===i);
 if(distinct.length<4)throw new Error('Insufficient unique alternatives: '+q.id);
 return {...q,answer,choices:shuffleWorkbook(distinct.slice(0,4),random)};
}
function alphabetQuestions(mode,random){
 const pool=workbookAlphabet;
 return pool.map((letter,index)=>{
  const presentation=mode==='mixed'?index%2===0?'listen':'read':mode;
  const choices=shuffleWorkbook(pool.filter(x=>x.letter!==letter.letter),random)
   .slice(0,3).map(x=>x.letter);
  const audio=letter.letter==='ß'?'Eszett':letter.letter;
  return withOptions({
   id:activityItemKey('pronunciation','letter',letter.letter),
   kind:'pronunciation',label:'حرف '+letter.letter,section:'alphabet',
   mode:presentation,audio,
   prompt:presentation==='listen'?'صدای نام کدام حرف را می‌شنوی؟':
    'کدام حرف در ابتدای واژه زیر است؟',
   display:presentation==='read'?letter.word:null,
   explanation:letter.letter+' — '+letter.word+' ('+letter.translation+')'
  },letter.letter,choices,random);
 });
}
function soundQuestions(mode,random){
 const concepts=soundConcepts.map((c,index)=>{
  const presentation=mode==='mixed'?(index%2===0?'listen':'read'):mode;
  const rule=findSoundRule(c.id);
  const q={
   id:activityItemKey('pronunciation',c.id),
   kind:'pronunciation',label:'تلفظ '+c.id,section:'sounds',
   mode:presentation,audio:c.answer,
   prompt:presentation==='listen'?'کدام کلمه را می‌شنوی؟':c.prompt,
   explanation:rule?.note||'عبارت درست را دوباره بشنو و به تفاوت صداها توجه کن.'
  };
  return withOptions(q,c.answer,c.wrong,random);
 });
 return concepts;
}
function conjugationQuestions(mode,random,verb='mixed'){
 const verbs=verb==='mixed'?WB_VERBS:[verb];
 return verbs.flatMap(v=>workbookPronouns.map((pronoun,index)=>{
  const displayPronoun=pronoun.person;
  const spokenPronoun=displayPronoun.split(' / ')[0];
  const correct=pronoun[v];
  const forms=[...new Set(workbookPronouns.map(p=>p[v]))];
  const presentation=mode==='mixed'?(index%2===0?'read':'listen'):mode;
  const audio=spokenPronoun+' '+correct;
  return withOptions({
   id:activityItemKey('grammar',v,
    displayPronoun==='er / sie / es'?'er/sie/es':displayPronoun==='sie / Sie'?'sie/Sie':displayPronoun),
   kind:'grammar',label:v+' / '+displayPronoun,section:'verbs',
   mode:presentation,audio,
   display:presentation==='read'?displayPronoun+' + '+v:null,
   prompt:presentation==='read'?'شکل درست فعل را برای این ضمیر انتخاب کن.':
    'کدام شکل صرف‌شده فعل را می‌شنوی؟',
   explanation:spokenPronoun+' '+correct+' — '+pronoun.fa
  },correct,shuffleWorkbook(forms.filter(x=>x!==correct),random),random);
 }));
}
function sentenceQuestions(mode,random){
 const pool=[
 ...workbookDialog.map(line=>({id:'dialog-'+line.id,de:line.de,fa:line.fa})),
 ...workbookFillSentences.map(line=>({id:'sentence-'+line.id,de:line.sentence,fa:line.fa}))
 ];
 const unique=[...new Map(pool.map(x=>[x.de,x])).values()];
 if(unique.length<4)throw new Error('More dialogue expressions are needed');
 return unique.map((item,index)=>{
  const presentation=mode==='mixed'?index%2?'listen':'read':mode;
  const wrong=shuffleWorkbook(unique.filter(x=>x.de!==item.de),random).slice(0,3).map(x=>x.de);
  return withOptions({
   id:activityItemKey('sentence',item.id),
   kind:'sentence',label:item.de,section:'dialog',
   mode:presentation,audio:item.de,
   display:presentation==='read'?item.fa:null,
   prompt:presentation==='listen'?'کدام جمله آلمانی را می‌شنوی؟':
    'جمله آلمانی درست برای این معنی چیست؟',
   explanation:item.de+' — '+item.fa
  },item.de,wrong,random);
 });
}
function numberQuestions(random,memory){
 return createNumberMemoryRound({maximum:12,mode:'mixed',memory,size:10,random}).map(q=>({
  id:activityItemKey('number',q.number),kind:'number',label:String(q.number),
  section:'numbers',mode:q.mode==='listenWord'?'listen':'read',
  audio:q.word,display:q.mode==='listenWord'?null:q.mode==='wordDigit'?q.word:String(q.number),
  prompt:q.mode==='listenWord'?'کدام عدد را می‌شنوی؟':
   q.mode==='wordDigit'?'این واژه به کدام عدد اشاره دارد؟':'نوشتار درست این عدد کدام است؟',
  answer:q.mode==='wordDigit'?String(q.number):q.word,
  choices:q.options.map(opt=>opt.label),
  explanation:q.number+' — '+q.word
 }));
}
export function createWorkbookChallenge({
 section,mode='mixed',verb='mixed',memory={},count=10,random=Math.random,now=Date.now()
}={}){
 if(!WB_CHALLENGE_SECTIONS.includes(section))throw new Error('Unsupported workbook section');
 if(!WB_CHALLENGE_MODES.some(x=>x.id===mode))throw new Error('Unsupported quiz mode');
 if(section==='verbs'&&verb!=='mixed'&&!WB_VERBS.includes(verb))throw new Error('Unsupported verb');
 const source=section==='alphabet'?alphabetQuestions(mode,random):
  section==='sounds'?soundQuestions(mode,random):
  section==='verbs'?conjugationQuestions(mode,random,verb):
  section==='dialog'?sentenceQuestions(mode,random):[];
 if(section==='checkpoint'){
  const parts=[
   prioritizeWorkbookItems(alphabetQuestions('mixed',random),memory,3,random,now),
   prioritizeWorkbookItems(soundQuestions('mixed',random),memory,3,random,now),
   prioritizeWorkbookItems(conjugationQuestions('mixed',random),memory,3,random,now),
   prioritizeWorkbookItems(sentenceQuestions('mixed',random),memory,3,random,now),
   prioritizeWorkbookItems(numberQuestions(random,memory),memory,3,random,now)
  ];
  // Keep the whole cross-skill mix while shuffling order for every round.
  return shuffleWorkbook(parts.flat(),random);
 }
 return prioritizeWorkbookItems(source,memory,count,random,now);
}
