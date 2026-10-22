import test from 'node:test';
import assert from 'node:assert/strict';
import {createNumberMemoryRound,getNumberMemoryPrompt,numberMemoryCorrect,
 NUMBER_RECALL_MODES,NUMBER_RECALL_RANGES} from '../src/numberRecallLogic.js';
import {activityItemKey,recordActivity} from '../src/learningMemory.js';
import {germanNumber} from '../src/learningData.js';

test('mixed workbook number game includes numeric-to-written, listening and written-to-numeric prompts',()=>{
 assert.deepEqual(NUMBER_RECALL_MODES.map(m=>m.id),['mixed','digitWord','listenWord','wordDigit']);
 assert.deepEqual(NUMBER_RECALL_RANGES,[12,20,100]);
 for(const limit of NUMBER_RECALL_RANGES){
  const rounds=createNumberMemoryRound({maximum:limit});
  assert.equal(rounds.length,10);
  assert.equal(new Set(rounds.map(q=>q.number)).size,10);
  assert.deepEqual(new Set(rounds.map(q=>q.mode)),new Set(['digitWord','listenWord','wordDigit']));
  for(const q of rounds){
   assert.equal(q.word,germanNumber(q.number));
   assert.equal(q.options.length,4);
   assert.equal(new Set(q.options.map(x=>x.value)).size,4);
   assert.equal(new Set(q.options.map(x=>x.label)).size,4);
   assert.ok(q.options.some(x=>x.value===q.number));
   assert.equal(numberMemoryCorrect(q,q.number),true);
   assert.equal(numberMemoryCorrect(q,q.options.find(x=>x.value!==q.number).value),false);
  }
 }
});
test('audio-only mode does not expose digit in its prompt or German target as instruction',()=>{
 const round=createNumberMemoryRound({mode:'listenWord',maximum:12,random:()=>0.2});
 for(const q of round){
  assert.equal(q.mode,'listenWord');
  assert.equal(getNumberMemoryPrompt(q),'listen');
  assert.ok(q.options.every(x=>typeof x.label==='string'));
  assert.ok(q.options.some(x=>x.label===q.word));
 }
});
test('digit-first prompts show numerals and spelling options; reverse prompts show spelling and numeric options',()=>{
 const numberToWord=createNumberMemoryRound({mode:'digitWord',maximum:12});
 const wordToNumber=createNumberMemoryRound({mode:'wordDigit',maximum:12});
 for(const q of numberToWord){
  assert.equal(getNumberMemoryPrompt(q),String(q.number));
  assert.equal(q.options.find(o=>o.value===q.number).label,q.word);
 }
 for(const q of wordToNumber){
  assert.equal(getNumberMemoryPrompt(q),q.word);
  assert.equal(q.options.find(o=>o.value===q.number).label,String(q.number));
 }
});
test('missed number is selected for review with its previously saved stable number ID',()=>{
 const item=11;
 const memory=recordActivity({items:{},days:{},history:[],totalXP:0},
  {id:activityItemKey('number',item),kind:'number',label:String(item),lesson:1,correct:false},
  Date.now()-15*60000);
 const round=createNumberMemoryRound({memory,maximum:12,random:()=>0.27});
 assert.ok(round.slice(0,6).some(q=>q.number===item));
 assert.equal(memory.items[activityItemKey('number',item)].lastCorrect,false);
});
test('new round randomizes number order and response positions without duplicates',()=>{
 const a=createNumberMemoryRound({mode:'mixed',maximum:12,random:()=>0});
 const b=createNumberMemoryRound({mode:'mixed',maximum:12,random:()=>0.91});
 assert.notDeepEqual(a.map(q=>q.number),b.map(q=>q.number));
 assert.ok(a.every(q=>q.options.length===4));
 assert.ok(b.every(q=>q.options.length===4));
});
test('reject unsupported game settings and invalid response identifiers',()=>{
 assert.throws(()=>createNumberMemoryRound({maximum:13}),/range/);
 assert.throws(()=>createNumberMemoryRound({mode:'audio-unknown'}),/mode/);
 assert.equal(numberMemoryCorrect({number:0},null),false);
 assert.equal(numberMemoryCorrect({number:0},0),true);
 assert.equal(numberMemoryCorrect({number:7},undefined),false);
});
