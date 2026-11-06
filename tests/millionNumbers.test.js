import test from 'node:test';
import assert from 'node:assert/strict';
import {germanNumber} from '../src/learningData.js';
import {NUMBER_MAX,NUMBER_SECTIONS,numbersInSection,numberRangeCount,numberReferenceNumbers,
  numberSectionStats,adaptiveNumberSelection,correctNumberSpelling} from '../src/numberSections.js';
import {createNumberGameRound,makeNumberOptions,correctNumberGameAnswer} from '../src/numberGameLogic.js';

test('complete spelling from zero through one hundred million',()=>{
 const examples={
  0:'null',1:'eins',12:'zwölf',20:'zwanzig',99:'neunundneunzig',100:'hundert',
  101:'einhunderteins',125:'einhundertfünfundzwanzig',1000:'eintausend',
  1234:'eintausendzweihundertvierunddreißig',
  2500:'zweitausendfünfhundert',
  10000:'zehntausend',
  250000:'zweihundertfünfzigtausend',
  1000000:'eine Million',2000000:'zwei Millionen',
  21000000:'einundzwanzig Millionen',
  100000000:'hundert Millionen'
 };
 for(const [number,word] of Object.entries(examples)){
  assert.equal(germanNumber(Number(number)),word,'spelling '+number);
  assert.equal(correctNumberSpelling(word,Number(number)),true);
 }
 assert.equal(germanNumber(1234567),'eine Million zweihundertvierunddreißigtausendfünfhundertsiebenundsechzig');
 assert.ok(correctNumberSpelling('  EINE  MILLION  ZWEIHUNDERTVIERUNDDREISSIG ',1000000)===false);
 assert.ok(correctNumberSpelling('EINE  MILLION',1000000));
 assert.ok(correctNumberSpelling('einHUNDERT',100));
 for(const n of [-1,100000001,1.2,NaN,Infinity])assert.equal(germanNumber(n),'');
});

test('large sections are sampled rather than fully enumerated',()=>{
 assert.equal(NUMBER_MAX,100000000);
 assert.equal(NUMBER_SECTIONS.length,15);
 assert.equal(numberRangeCount('0-100000000'),100000001);
 assert.equal(numberRangeCount('10000001-100000000'),90000000);
 assert.throws(()=>numbersInSection('0-100000000'),RangeError);
 assert.throws(()=>numbersInSection('100001-1000000'),RangeError);
 for(const stage of NUMBER_SECTIONS.slice(8)){
  const sample=numberReferenceNumbers(stage.id);
  assert.ok(sample.length<=55);
  assert.ok(sample.every(n=>n>=stage.min&&n<=stage.max));
  assert.equal(new Set(sample).size,sample.length);
 }
});

test('all large ranges generate ten unique bounded questions in five modes',()=>{
 for(const stage of NUMBER_SECTIONS.slice(8)){
  for(const mode of ['mixed','hear','read','recognize','type']){
   const questions=createNumberGameRound({rangeId:stage.id,mode,random:Math.random});
   assert.equal(questions.length,10,'number of questions in '+stage.id);
   assert.equal(new Set(questions.map(q=>q.number)).size,10);
   for(const q of questions){
    assert.ok(q.number>=stage.min&&q.number<=stage.max);
    assert.ok(q.options.every(n=>n>=stage.min&&n<=stage.max));
    assert.equal(new Set(q.options).size,4);
    assert.ok(q.options.includes(q.number));
    assert.ok(correctNumberGameAnswer(q.questionMode==='type'?germanNumber(q.number):q.number,q));
   }
  }
 }
});

test('large-number statistics read only previously saved entries',()=>{
 const memory={items:{
  'number:12':{mastery:99,correct:6,reviewedDays:3,lastCorrect:true},
  'number:12345678':{mastery:20,correct:0,reviewedDays:1,lastCorrect:false},
  'number:100000000':{mastery:86,correct:4,reviewedDays:3,lastCorrect:true},
  'word:99':{mastery:0,lastCorrect:false}
 }};
 const all=numberSectionStats('0-100000000',memory);
 assert.equal(all.total,100000001);
 assert.equal(all.learned,3);
 assert.equal(all.mastered,2);
 assert.equal(all.weak,1);
 assert.equal(numberSectionStats('10000001-100000000',memory).learned,2);
 const selected=adaptiveNumberSelection('0-100000000',memory,10,()=>0.25);
 assert.equal(new Set(selected).size,10);
 assert.ok(selected.includes(12345678));
 const choices=makeNumberOptions(100000000,'0-100000000',()=>0);
 assert.equal(new Set(choices).size,4);
 assert.ok(choices.every(x=>x>=0&&x<=100000000));
});
