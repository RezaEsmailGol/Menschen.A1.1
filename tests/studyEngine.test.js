import test from 'node:test';
import assert from 'node:assert/strict';
import { allStudyCards, getLessonCards, lessons, pronouns, verbForms } from '../src/courseData.js';
import { buildExam, dueCards, nextReview, normalizeAnswer, shuffleArray } from '../src/studyEngine.js';

test('course contains twelve independent learning units with complete data', () => {
  assert.equal(lessons.length, 12);
  assert.deepEqual(lessons.map(l => l.id), Array.from({length:12},(_,i)=>i+1));
  for (const lesson of lessons) {
    assert.ok(lesson.words.length >= 8);
    assert.ok(lesson.sentences.length >= 4);
    assert.ok(lesson.verbs.length >= 2);
    for (const v of lesson.verbs) assert.ok(verbForms[v], 'missing verb: ' + v);
    assert.equal(getLessonCards(lesson).length, lesson.words.length);
  }
  assert.equal(new Set(allStudyCards.map(c=>c.id)).size, allStudyCards.length);
});

test('all conjugation tables have six German forms', () => {
  assert.equal(pronouns.length,6);
  for (const forms of Object.values(verbForms)) {
    assert.equal(forms.length,6);
    assert.ok(forms.every(x=>typeof x==='string' && x.length>0));
  }
  assert.equal(verbForms.sein[0],'bin');
  assert.equal(verbForms.sprechen[1],'sprichst');
  assert.equal(verbForms.arbeiten[1],'arbeitest');
});

test('all lesson exams are complete and unambiguous', () => {
  for (const lesson of lessons) {
    const exam=buildExam(lesson);
    assert.equal(exam.length,10);
    assert.equal(exam.filter(q=>q.kind==='vocab').length,5);
    assert.equal(exam.filter(q=>q.kind==='grammar').length,2);
    assert.equal(exam.filter(q=>q.kind==='reading').length,3);
    for (const item of exam) {
      assert.equal(item.choices.length,4);
      assert.equal(new Set(item.choices).size,4);
      assert.equal(item.choices.filter(x=>x===item.answer).length,1);
    }
  }
});

test('the order shuffling is not allowed to mutate its input', () => {
  const input=[1,2,3,4,5], copy=[...input];
  const result=shuffleArray(input,()=>0);
  assert.deepEqual(input,copy);
  assert.equal(result.length,input.length);
});

test('first review and later reviews follow interval rules', () => {
  const now=1700000000000;
  const again=nextReview(null,'again',now);
  assert.equal(again.dueAt,now+600000);
  assert.equal(again.repetitions,0);
  const good=nextReview(null,'good',now);
  assert.equal(good.interval,1);
  assert.equal(good.repetitions,1);
  const second=nextReview(good,'good',now+86400000);
  assert.equal(second.interval,3);
  const easy=nextReview(null,'easy',now);
  assert.equal(easy.interval,4);
  assert.ok(nextReview(good,'hard',now).dueAt>now);
});

test('due review respects started lessons and due time', () => {
  const cards=[{id:'a',lesson:1},{id:'b',lesson:1},{id:'c',lesson:2}];
  const t=1700000000000;
  const schedule={a:{dueAt:t-1000},b:{dueAt:t+10000}};
  assert.deepEqual(dueCards(cards,schedule,[1],t).map(x=>x.id),['a']);
  assert.deepEqual(dueCards(cards,schedule,[1,2],t).map(x=>x.id),['a','c']);
});

test('orthographic checks preserve accents and normalize casing and punctuation', () => {
  assert.equal(normalizeAnswer('  ICH   komme. '),'ich komme');
  assert.notEqual(normalizeAnswer('funf'),normalizeAnswer('fünf'));
  assert.equal(normalizeAnswer('ZWÖLF!'),normalizeAnswer('zwölf'));
});
