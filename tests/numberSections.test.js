import test from 'node:test';
import assert from 'node:assert/strict';
import {NUMBER_SECTIONS,numbersInSection,numberSectionStats,adaptiveNumberSelection,
 correctNumberSpelling,numberTip} from '../src/numberSections.js';
import {createNumberRound,makeNumberOptions,createNumberGameRound,correctNumberGameAnswer,optionLabel,NUMBER_GAME_MODES} from '../src/numberGameLogic.js';
import {createNumberMemoryRound} from '../src/numberRecallLogic.js';
import {recordActivity,activityItemKey} from '../src/learningMemory.js';
import {germanNumber} from '../src/learningData.js';

test('classroom sections preserved; eight practice ranges cover 0–100',()=>{
 assert.deepEqual(NUMBER_SECTIONS.slice(0,3).map(s=>[s.min,s.max]),[[0,12],[13,20],[20,30]]);
 assert.equal(NUMBER_SECTIONS.length,8);
 assert.deepEqual(numbersInSection('0-12'),Array.from({length:13},(_,i)=>i));
 assert.deepEqual(numbersInSection('13-20'),Array.from({length:8},(_,i)=>i+13));
 assert.deepEqual(numbersInSection('20-30'),Array.from({length:11},(_,i)=>i+20));
 assert.ok(numbersInSection('13-20').includes(20));
 assert.ok(numbersInSection('20-30').includes(20));
 assert.deepEqual(numbersInSection('31-50'),Array.from({length:20},(_,i)=>i+31));
 assert.deepEqual(numbersInSection('51-70'),Array.from({length:20},(_,i)=>i+51));
 assert.deepEqual(numbersInSection('71-100'),Array.from({length:30},(_,i)=>i+71));
 assert.deepEqual(numbersInSection('0-100'),Array.from({length:101},(_,i)=>i));
 assert.ok(numbersInSection('confusing').includes(2));
 assert.ok(numbersInSection('confusing').includes(12));
 assert.ok(numbersInSection('confusing').includes(20));
 const allStages=new Set(NUMBER_SECTIONS.flatMap(s=>numbersInSection(s.id)));
 assert.equal(allStages.size,101);
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


test('German spellings 0–100 are all unique and preserve tricky orthography',()=>{
 const words=Array.from({length:101},(_,i)=>germanNumber(i));
 assert.equal(new Set(words).size,101);
 assert.equal(words[0],'null');
 assert.equal(words[12],'zwölf');
 assert.equal(words[20],'zwanzig');
 assert.equal(words[21],'einundzwanzig');
 assert.equal(words[42],'zweiundvierzig');
 assert.equal(words[61],'einundsechzig');
 assert.equal(words[67],'siebenundsechzig');
 assert.equal(words[71],'einundsiebzig');
 assert.equal(words[99],'neunundneunzig');
 assert.equal(words[100],'hundert');
 assert.equal(numberTip(60).includes('sechzig'),true);
 assert.equal(numberTip(70).includes('siebzig'),true);
 assert.ok(numberTip(98).includes('und'));
});

test('each of the five modes generates valid 0–100 questions and answers',()=>{
 assert.deepEqual(NUMBER_GAME_MODES,['read','hear','recognize','type','mixed']);
 for(const mode of NUMBER_GAME_MODES){
  const questions=createNumberGameRound({rangeId:'0-100',mode,random:Math.random});
  assert.equal(questions.length,10);
  assert.equal(new Set(questions.map(q=>q.number)).size,10);
  assert.ok(questions.every(q=>q.options.includes(q.number)));
  const actualModes=new Set(questions.map(q=>q.questionMode));
  if(mode==='mixed') assert.deepEqual([...actualModes].sort(),['hear','read','recognize','type'].sort());
  else assert.deepEqual([...actualModes],[mode]);
  for(const q of questions){
   assert.ok(q.number>=0&&q.number<=100);
   assert.ok(correctNumberGameAnswer(q.questionMode==='type'?germanNumber(q.number):q.number,q));
   assert.ok(!correctNumberGameAnswer(q.questionMode==='type'?'falscheantwort':-1,q));
   assert.equal(optionLabel(q.number,q.questionMode),
     q.questionMode==='hear'||q.questionMode==='recognize'?String(q.number):germanNumber(q.number));
  }
 }
 assert.throws(()=>createNumberGameRound({mode:'unknown'}),/mode/);
});

test('similar numbers receive challenging but valid distractors',()=>{
 const cases=[[2,[12,20,22]],[12,[2,20,22]],[20,[2,12,22]],[16,[17,60,70]],[70,[17,60,77]]];
 for(const [n,others] of cases){
  const choices=makeNumberOptions(n,'confusing',()=>0.3);
  assert.equal(choices.length,4);
  assert.equal(new Set(choices).size,4);
  assert.ok(choices.includes(n));
  for(const other of others)assert.ok(choices.includes(other),n+' vs '+other);
 }
 assert.ok(correctNumberSpelling('NEUNUNDNEUNZIG',99));
 assert.ok(!correctNumberSpelling('neunundneunsig',99));
 assert.equal(correctNumberSpelling('  HUNDERT  ',100),true);
});

test('mistakes from 0–100 retain one stable mastery entry for all modes',()=>{
 let memory={};
 for(const n of [2,12,20,50,70,100]){
  memory=recordActivity(memory,{id:activityItemKey('number',n),kind:'number',label:String(n),correct:false});
 }
 const attempts=createNumberGameRound({rangeId:'0-100',mode:'mixed',memory,random:()=>.15});
 assert.ok(attempts.some(q=>[2,12,20,50,70,100].includes(q.number)));
 const records=Object.keys(memory.items);
 assert.ok(records.every(id=>/^number:\d+$/.test(id)));
 assert.equal(new Set(records).size,6);
});
