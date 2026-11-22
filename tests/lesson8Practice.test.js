import {class8Games,class8Frequency,class8Months,class8Intervals,class8People} from '../src/lesson8Classroom.js';
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

test('64 authored lesson 8 exercises cover weekday meaning, am/um, word order and spoken times',()=>{
  const plan=bookLessonPlans[8];
  assert.equal(plan.title,'Kein Problem. Ich habe Zeit!');
  assert.equal(plan.sections.length,4);
  assert.deepEqual(plan.sections.map(s=>s.id),[
    'vocabulary-practice','grammar-practice','sentence-practice','listening-practice'
  ]);
  assert.deepEqual(plan.sections.map(s=>s.tasks.length),[16,16,16,16]);
  const tasks=allBookTasks(8);
  assert.equal(tasks.length,64);
  assert.equal(new Set(tasks.map(q=>q.id)).size,64);
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
  assert.equal(lessonOutline(8).tasks,64);
});

test('lesson 8 Persian grammar and visual practice are integrated',()=>{
  const guide=grammarGuideForLesson(8);
  assert.deepEqual(guide.rules.map(r=>r.id),['am-um','position-2','clock-reading','appointments','frequency','intervals','frequency-questions','possessive-class','months']);
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

test('classroom notes include twelve months, seven frequency levels, gender pairs and six time expressions',()=>{
  assert.equal(class8Months.length,12);
  assert.equal(class8Frequency.length,7);
  assert.equal(class8Intervals.length,6);
  assert.equal(class8People.length,9);
  for(const [,items] of Object.entries(class8Games)){
    for(const item of items){
      assert.equal(item.choices.length,4);
      assert.equal(new Set(item.choices).size,4);
      assert.ok(item.choices.includes(item.de));
    }
  }
  const tasks=allBookTasks(8);
  assert.equal(tasks.filter(q=>q.id.startsWith('l8-class-')).length,32);
  for(const id of ['l8-day01','l8-gram01','l8-talk01','l8-listen01'])assert.ok(tasks.some(q=>q.id===id));
  const drill=tasks.find(q=>q.id==='l8-class-s03');
  assert.ok(isBookAnswerCorrect(drill,'Jeden Tag lerne ich Deutsch.'));
  assert.ok(isBookAnswerCorrect(drill,'Ich lerne täglich Deutsch.'));
  assert.ok(!isBookAnswerCorrect(drill,'Ich lernen jeden Tag Deutsch.'));
  const lesson=lessons.find(x=>x.id===8);
  assert.ok(class8Months.every(([month])=>lesson.words.some(([de])=>de===month)));
  assert.ok(class8People.every(([male,female])=>lesson.words.some(([de])=>de===male)&&lesson.words.some(([de])=>de===female)));
});
