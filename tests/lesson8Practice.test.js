import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessons} from '../src/courseData.js';
import {bookLessonPlans,allBookTasks,isBookAnswerCorrect} from '../src/bookLessonData.js';
import {grammarGuideForLesson} from '../src/persianGrammarGuides.js';
import {lessonOutline} from '../src/lessonOutline.js';
import {lessonExerciseHref,readExerciseTarget} from '../src/lessonExerciseLinks.js';

test('lesson 8 matches the Menschen weekday and appointment topic, not rooms',()=>{
  const lesson=lessons.find(item=>item.id===8);
  assert.equal(lesson.german,'Kein Problem. Ich habe Zeit!');
  assert.match(lesson.grammar,/am.*um/);
  assert.ok(lesson.words.some(([de])=>de==='Montag'));
  assert.ok(lesson.words.some(([de])=>de==='Sonntag'));
  assert.ok(lesson.words.some(([de])=>de==='halb neun'));
  assert.ok(lesson.words.some(([de])=>de==='Januar'));
  assert.ok(!lesson.words.some(([de])=>de==='die Küche'));
});

test('32 authored lesson 8 exercises cover weekday meaning, am/um, word order and spoken times',()=>{
  const plan=bookLessonPlans[8];
  assert.equal(plan.title,'Kein Problem. Ich habe Zeit!');
  assert.equal(plan.sections.length,4);
  assert.deepEqual(plan.sections.map(s=>s.id),[
    'vocabulary-practice','grammar-practice','sentence-practice','listening-practice'
  ]);
  assert.deepEqual(plan.sections.map(s=>s.tasks.length),[8,8,8,8]);
  const tasks=allBookTasks(8);
  assert.equal(tasks.length,32);
  assert.equal(new Set(tasks.map(q=>q.id)).size,32);
  assert.ok(tasks.some(q=>q.answer==='am'));
  assert.ok(tasks.some(q=>q.answer==='um'));
  assert.ok(tasks.some(q=>q.answer==='in der Nacht'));
  assert.ok(tasks.some(q=>q.answer==='Am Montag um acht Uhr habe ich keine Zeit.'));
  assert.ok(tasks.some(q=>q.answer==='halb vier'));
  assert.ok(tasks.some(q=>q.audio==='Viertel vor zehn'));
  for(const task of tasks){
    assert.ok(isBookAnswerCorrect(task,task.answer));
    assert.ok(!isBookAnswerCorrect(task,'a deliberately wrong response'));
    if(task.type==='choice'){
      assert.equal(task.choices.length,4);
      assert.equal(new Set(task.choices).size,4);
      assert.ok(task.choices.includes(task.answer));
    }
    if(task.type==='listen')assert.ok(task.audio);
  }
  const href=lessonExerciseHref(8,'listening-practice',4);
  assert.equal(readExerciseTarget(8,new URL(href,'https://example.invalid').search)?.taskIndex,3);
  assert.equal(lessonOutline(8).tasks,32);
});

test('lesson 8 Persian grammar and visual practice are integrated',()=>{
  const guide=grammarGuideForLesson(8);
  assert.deepEqual(guide.rules.map(r=>r.id),['am-um','position-2','clock-reading','appointments']);
  assert.ok(guide.rules.some(r=>r.pattern.includes('halb neun')));
  const visual=readFileSync(new URL('../src/Lesson8TimeLab.jsx',import.meta.url),'utf8');
  const page=readFileSync(new URL('../src/BookLessonPractice.jsx',import.meta.url),'utf8');
  assert.match(visual,/lesson8Days/);
  assert.match(visual,/lesson8Months/);
  assert.match(visual,/lesson8Clocks/);
  assert.match(visual,/onPracticeEvent/);
  assert.match(page,/lessonId===8&&<Lesson8TimeLab/);
  assert.match(page,/<ExerciseAudioButton/);
});
