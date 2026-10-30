import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/courseData.js';
import {bookLessonPlans,allBookTasks,germanNumber,normalizeBookAnswer,isBookAnswerCorrect} from '../src/bookLessonData.js';

test('the first two lessons follow the official Kursbuch syllabus',()=>{
  assert.match(lessons[0].german,/Hallo! Ich bin Nicole/);
  assert.match(lessons[1].german,/Ich bin Journalistin/);
  assert.match(lessons[0].grammar,/heißen/);
  assert.match(lessons[1].grammar,/nicht/);
  assert.ok(lessons[0].words.some(x=>x[0]==='Österreich'));
  assert.ok(lessons[1].words.some(x=>x[0]==='die Journalistin'));
  assert.ok(lessons[1].words.some(x=>x[0]==='der Familienstand'));
});
test('every book exercise has an answer and unique stable id',()=>{
  const all=[...allBookTasks(1),...allBookTasks(2)];
  assert.equal(allBookTasks(1).length,18);
  assert.equal(allBookTasks(2).length,20);
  assert.equal(new Set(all.map(q=>q.id)).size,all.length);
  assert.deepEqual(Object.keys(bookLessonPlans),['1','2']);
  for(const q of all){
    assert.ok(q.id && q.type && q.prompt && q.answer);
    assert.ok(['choice','type','listen','build'].includes(q.type));
    if(q.type==='choice'){
      assert.equal(q.choices.length,4);
      assert.equal(new Set(q.choices).size,4);
      assert.equal(q.choices.filter(c=>c===q.answer).length,1);
    }
    if(q.type==='listen')assert.ok(q.audio);
    assert.equal(isBookAnswerCorrect(q,q.answer),true);
    assert.equal(isBookAnswerCorrect(q,'different response'),false);
  }
});
test('all book sections are nonempty, ordered and contain learning cards',()=>{
  for(const id of [1,2]){
    const data=bookLessonPlans[id];
    assert.equal(data.sections.length,4);
    assert.ok(data.goals.length>=4);
    for(const section of data.sections){
      assert.ok(section.cards.length>=4);
      assert.ok(section.tasks.length>=4);
      for(const card of section.cards){
        assert.equal(card.length,3);
        assert.ok(card.every(Boolean));
      }
    }
  }
});
test('numbers 1–100 handle teen forms, connecting und, and irregular tens',()=>{
  const examples={1:'eins',2:'zwei',12:'zwölf',16:'sechzehn',17:'siebzehn',
    20:'zwanzig',21:'einundzwanzig',27:'siebenundzwanzig',30:'dreißig',
    41:'einundvierzig',47:'siebenundvierzig',60:'sechzig',70:'siebzig',
    80:'achtzig',90:'neunzig',99:'neunundneunzig',100:'hundert'};
  for(const [number,text] of Object.entries(examples))assert.equal(germanNumber(Number(number)),text);
  for(let n=1;n<=100;n++)assert.ok(germanNumber(n));
  assert.throws(()=>germanNumber(0),RangeError);
  assert.throws(()=>germanNumber(101),RangeError);
  assert.throws(()=>germanNumber(1.5),RangeError);
  assert.equal(normalizeBookAnswer('  Ich   HEISSE Sara! '),'ich heisse sara');
  assert.notEqual(normalizeBookAnswer('zwolf'),normalizeBookAnswer('zwölf'));
});
