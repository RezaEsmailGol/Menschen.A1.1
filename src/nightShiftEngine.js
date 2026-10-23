import { classNotes } from './classNotesData.js';
import { allStudyCards, lessons } from './courseData.js';
import { activityItemKey, localDay } from './learningMemory.js';
import { shuffleArray } from './studyEngine.js';

export const NIGHT_KEY = 'dt_night_shift_v1';

export const createNightState = () => ({ version:1, preferredCount:6, audioEnabled:false, active:null, history:{} });

function normalizeScore(record={}, dueAt=Infinity, now=Date.now()) {
  const seen = (record.attempts||0)>0 || Boolean(record.lastAt);
  if (seen && (record.lastCorrect===false || record.mastery < 55)) return 1000 + (record.wrong||0)*15;
  if (seen && Number(record.nextAt) <= now) return 860;
  if (Number.isFinite(dueAt) && dueAt <= now) return 900;
  if (seen && (record.mastery||0)<80) return 590;
  if (!seen && !Number.isFinite(dueAt)) return 260;
  if (!seen) return 270;
  return 70;
}

export function nightCandidates({memory={},schedule={},progress={},personalCards=[]}={},now=Date.now()) {
  const enabled=new Set(lessons.filter(l=>l.id===1 || progress[l.id]?.started).map(l=>l.id));
  const classItems=classNotes.map((item)=>({
    id:item.key,source:'class',kind:item.kind,group:item.set,
    prompt:item.set==='verbs' ? `«${item.pronoun}» از فعل ${item.verb}` :
      item.set==='numbers' ? `عدد ${item.n} به آلمانی` : item.fa,
    answer:item.de,audio:item.set==='verbs'
      ? `${item.pronoun==='er/sie/es'?'er':item.pronoun==='sie/Sie'?'Sie':item.pronoun} ${item.de}`:item.de,
    note:item.tip||'',lesson:1,
    priority:normalizeScore(memory.items?.[item.key],Infinity,now)
  }));
  const custom=(Array.isArray(personalCards)?personalCards:[])
    .filter(c=>typeof c?.front==='string' && typeof c?.back==='string' && c.front.trim() && c.back.trim())
    .map((card,index)=>({
      id:'personal:'+index+':'+(card.front+'|'+card.back),
      front:card.front,back:card.back,lesson:0,speak:card.back
    }));
  const vocab=[...allStudyCards,...custom].filter(c=>enabled.has(c.lesson) || c.lesson===0)
    .map(card=>({
      id:card.id,source:'srs',kind:'vocab',group:'vocabulary',
      prompt:card.front,answer:card.back,audio:card.speak||card.back,note:'',
      lesson:card.lesson,
      priority:normalizeScore(memory.items?.[card.id],schedule[card.id]?.dueAt ?? Infinity,now)
    }));
  // Only one copy of a concept with a stable original key; no new IDs
  // are created for the same existing flashcard or classroom question.
  return [...classItems,...vocab];
}

export function buildNightReview(options={},count=6,random=Math.random,now=Date.now()) {
 const target=Math.min(8,Math.max(4,Number(count)||6));
 const pool=nightCandidates(options,now);
 const shuffled=shuffleArray(pool,random);
 const ranked=shuffled.sort((a,b)=>b.priority-a.priority);
 const selection=[]; const signatures=new Set();
 const add=item=>{
   const signature=(item.prompt+'|'+item.answer).toLowerCase();
   if(signatures.has(signature)||selection.some(x=>x.id===item.id))return false;
   selection.push(item);signatures.add(signature);return true;
 };
 // Each bedtime review mixes knowledge from previous class sessions
 // and a vocabulary card without crowding out overdue material.
 // Prefer overdue/weak material even when filling diverse groups.
 for(const source of ['srs','class']){
   const due=ranked.find(q=>q.source===source&&q.priority>=590);
   if(due)add(due);
 }
 for(const group of ['verbs','numbers','greetings']){
   const item=ranked.find(q=>q.group===group&&q.priority>=590);
   if(item && selection.length<target)add(item);
 }
 for(const item of ranked){
   if(selection.length>=target)break;
   add(item);
 }
 return selection.slice(0,target).map(({priority,...item})=>item);
}

export function nightSessionStart(items,at=Date.now()) {
 return {id:at,day:localDay(at),startedAt:at,index:0,correct:0,items};
}
export function nightSessionAdvance(session,correct,at=Date.now()){
 if(!session || session.index >= session.items.length)throw Error('No active bedtime question');
 const index=session.index+1;
 return {...session,index,correct:session.correct+(correct?1:0),
   completedAt:index>=session.items.length?at:null};
}
export function saveNightSession(state,session){
 const base=state&&typeof state==='object'?state:createNightState();
 if(!session.completedAt) return {...base,active:session};
 const history={...(base.history||{}),[session.day]:{
   completedAt:session.completedAt,correct:session.correct,total:session.items.length
 }};
 const days=Object.keys(history).sort();
 for(const day of days.slice(0,Math.max(0,days.length-90))) delete history[day];
 return {...base,active:session,history};
}
export function nightSummary(state,now=Date.now()){
 const history=state?.history||{};
 const today=localDay(now);
 const days=Object.keys(history).sort().reverse();
 return {doneToday:Boolean(history[today]),last:days.length?history[days[0]]:null,
   nights:days.length,today:history[today]||null};
}
