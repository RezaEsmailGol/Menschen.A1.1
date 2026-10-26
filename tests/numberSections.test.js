import test from 'node:test';
import assert from 'node:assert/strict';
import {NUMBER_SECTIONS,numbersInSection,numberSectionStats,adaptiveNumberSelection,
 correctNumberSpelling,numberTip} from '../src/numberSections.js';
import {createNumberRound,makeNumberOptions} from '../src/numberGameLogic.js';
import {createNumberMemoryRound} from '../src/numberRecallLogic.js';
import {recordActivity,activityItemKey} from '../src/learningMemory.js';
import {germanNumber} from '../src/learningData.js';

test('three exact classroom sections with 20 in both later sections',()=>{
 assert.deepEqual(NUMBER_SECTIONS.map(s=>[s.min,s.max]),[[0,12],[13,20],[20,30]]);
 assert.deepEqual(numbersInSection('0-12'),Array.from({length:13},(_,i)=>i));
 assert.deepEqual(numbersInSection('13-20'),Array.from({length:8},(_,i)=>i+13));
 assert.deepEqual(numbersInSection('20-30'),Array.from({length:11},(_,i)=>i+20));
 assert.ok(numbersInSection('13-20').includes(20));
 assert.ok(numbersInSection('20-30').includes(20));
});

test('random stage quizzes never leak values from another section',()=>{
 for(const section of NUMBER_SECTIONS){
   for(let n=0;n<10;n++){
    const round=createNumberRound(section.id,{},Math.random);
    const expected=Math.min(10,section.max-section.min+1);
    assert.equal(round.length,expected);
    assert.equal(new Set(round.map(x=>x.number)).size,expected);
    for(const q of round){
      assert.ok(q.number>=section.min&&q.number<=section.max);
      assert.equal(new Set(q.options).size,4);
      assert.ok(q.options.every(x=>x>=section.min&&x<=section.max));
      assert.ok(q.options.includes(q.number));
    }
   }
 }
});

test('listening and mixed stages use the same inclusive boundaries',()=>{
 for(const section of NUMBER_SECTIONS){
   for(const mode of ['mixed','digitWord','listenWord','wordDigit']){
     const round=createNumberMemoryRound({rangeId:section.id,mode});
     assert.equal(round.length,Math.min(10,section.max-section.min+1));
     assert.ok(round.every(q=>q.options.every(o=>o.value>=section.min&&o.value<=section.max)));
   }
 }
});

test('mistakes from previous sessions are prioritised with stable number IDs',()=>{
 const now=Date.now();
 let memory=recordActivity({}, {id:activityItemKey('number',20),kind:'number',label:'20',correct:false},now-1000);
 assert.equal(memory.items[activityItemKey('number',20)].lastCorrect,false);
 for(const section of ['13-20','20-30']){
  const selected=adaptiveNumberSelection(section,memory,10,()=>.39,now);
  assert.ok(selected.includes(20));
  assert.equal(numberSectionStats(section,memory,now).weak,1);
 }
 const ids=Object.keys(memory.items).filter(k=>k==='number:20');
 assert.equal(ids.length,1);
});

test('typed number spelling checks genuine German umlaut and ß',()=>{
 assert.ok(correctNumberSpelling('  SIEBZEHN ',17));
 assert.ok(correctNumberSpelling(' EINUNDZWANZIG ',21));
 assert.ok(correctNumberSpelling('dreißig',30));
 assert.ok(!correctNumberSpelling('dreissig',30));
 assert.ok(!correctNumberSpelling('siebenzehn',17));
 assert.ok(!correctNumberSpelling('sechszehn',16));
 assert.equal(germanNumber(16),'sechzehn');
 assert.equal(germanNumber(17),'siebzehn');
 assert.equal(germanNumber(30),'dreißig');
 assert.match(numberTip(16),/sechzehn/);
 assert.match(numberTip(17),/siebzehn/);
});

test('invalid or out of stage distractors are rejected',()=>{
 assert.throws(()=>makeNumberOptions(12,'13-20'),/range/);
 assert.throws(()=>makeNumberOptions(31,'20-30'),/range/);
 assert.throws(()=>createNumberRound('30-40'),/range/);
});
