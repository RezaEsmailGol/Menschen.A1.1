import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorkbookChallenge,WB_CHALLENGE_MODES,WB_CHALLENGE_SECTIONS,WB_VERBS,
 prioritizeWorkbookItems} from '../src/workbookChallengeLogic.js';
import {activityItemKey,recordActivity} from '../src/learningMemory.js';

test('five workbook sections and all 3 study modes are available',()=>{
 assert.deepEqual(WB_CHALLENGE_SECTIONS,['alphabet','sounds','verbs','dialog','checkpoint']);
 assert.deepEqual(WB_CHALLENGE_MODES.map(x=>x.id),['mixed','listen','read']);
 assert.deepEqual(WB_VERBS,['kommen','sammeln']);
});
test('all practice rounds have non-repeated valid questions with exactly four distinct choices',()=>{
 for(const section of WB_CHALLENGE_SECTIONS){
  for(const mode of WB_CHALLENGE_MODES.map(x=>x.id)){
   const q=createWorkbookChallenge({section,mode});
   assert.ok(q.length>=10,section+' '+mode);
   assert.equal(new Set(q.map(x=>x.id)).size,q.length);
   for(const item of q){
    assert.equal(item.choices.length,4,item.id);
    assert.equal(new Set(item.choices).size,4,item.id);
    assert.equal(item.choices.filter(x=>x===item.answer).length,1,item.id);
    assert.ok(item.audio&&item.kind&&item.explanation,item.id);
    assert.ok(['listen','read'].includes(item.mode),item.id);
    if(item.mode==='listen')assert.equal(item.display||null,null,item.id);
   }
  }
 }
});
test('mixed rounds contain true reading AND listening, not the same prompt repeated',()=>{
 for(const section of ['alphabet','sounds','verbs','dialog']){
  const q=createWorkbookChallenge({section,mode:'mixed',count:30});
  assert.ok(q.some(x=>x.mode==='listen'),section);
  assert.ok(q.some(x=>x.mode==='read'),section);
 }
});
test('letter ß listening uses Eszett and reading asks about character within Straße',()=>{
 const spoken=createWorkbookChallenge({section:'alphabet',mode:'listen',count:30})
  .find(q=>q.answer==='ß');
 assert.equal(spoken.audio,'Eszett');
 const reading=createWorkbookChallenge({section:'alphabet',mode:'read',count:30})
  .find(q=>q.answer==='ß');
 assert.equal(reading.display,'Straße');
 assert.match(reading.prompt,/ویژه/);
});
test('conjugations for each subject use real workbook present-tense forms',()=>{
 for(const verb of WB_VERBS){
  const rounds=createWorkbookChallenge({section:'verbs',verb,mode:'read',count:20});
  assert.equal(rounds.length,6);
  assert.ok(rounds.every(x=>x.kind==='grammar'));
  assert.ok(rounds.some(x=>x.answer===({kommen:'komme',sammeln:'sammle'})[verb]));
  assert.ok(rounds.some(x=>x.answer===({kommen:'kommst',sammeln:'sammelst'})[verb]));
  assert.ok(rounds.every(x=>x.id.startsWith('grammar:')));
 }
});
test('audio-only mode does not reveal target word anywhere before four choices',()=>{
 for(const section of ['alphabet','sounds','verbs','dialog']){
  const qs=createWorkbookChallenge({section,mode:'listen'});
  assert.ok(qs.every(x=>x.mode==='listen'&&x.display==null));
 }
});
test('checkpoint always samples three per skill including numbers, for exactly 15 questions',()=>{
 for(let i=0;i<15;i++){
  const qs=createWorkbookChallenge({section:'checkpoint'});
  assert.equal(qs.length,15);
  const counts=qs.reduce((a,q)=>(a[q.section]=(a[q.section]||0)+1,a),{});
  assert.deepEqual(Object.keys(counts).sort(),['alphabet','dialog','numbers','sounds','verbs']);
  assert.ok(Object.values(counts).every(n=>n===3));
 }
});
test('recent weak conjugation comes first in adaptive review without inventing mastery',()=>{
 const id=activityItemKey('grammar','kommen','du');
 const memory=recordActivity({items:{},days:{},totalXP:0,history:[]},
  {id,kind:'grammar',label:'kommen / du',lesson:1,correct:false},Date.now()-1000);
 const qs=createWorkbookChallenge({section:'verbs',memory,random:()=>0.42,now:Date.now()});
 assert.ok(qs.slice(0,6).some(x=>x.id===id));
 assert.equal(memory.items[id].lastCorrect,false);
});
test('randomness changes question ordering and options without duplicating correct option',()=>{
 const first=createWorkbookChallenge({section:'alphabet',random:()=>0});
 const second=createWorkbookChallenge({section:'alphabet',random:()=>.93});
 assert.notDeepEqual(first.map(x=>x.answer),second.map(x=>x.answer));
 assert.ok(first.every(x=>x.choices.includes(x.answer)));
});
test('invalid modes, sections and verbs are rejected safely',()=>{
 assert.throws(()=>createWorkbookChallenge({section:'unknown'}),/section/);
 assert.throws(()=>createWorkbookChallenge({section:'sounds',mode:'wrong'}),/mode/);
 assert.throws(()=>createWorkbookChallenge({section:'verbs',verb:'gehen'}),/verb/);
});
