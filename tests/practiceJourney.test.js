import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bookLessonPlans} from '../src/bookLessonData.js';
import {lessonExerciseHref,readExerciseTarget} from '../src/lessonExerciseLinks.js';
import {LESSON_PRACTICE_MODES,practiceJourney,filterPracticeLessons,nextPracticeSection} from '../src/practiceJourneyData.js';

test('practice dashboard has 12 lessons, four skill modules each, 360 real question slots and valid deep links',()=>{
 const model=practiceJourney();
 assert.equal(model.lessons.length,12);
 assert.equal(model.total,360);
 assert.equal(model.correct,0);
 assert.equal(model.percent,0);
 assert.equal(model.completedLessons,0);
 assert.equal(model.startedLessons,0);
 assert.equal(model.audioCompleted,0);
 assert.equal(model.next.id,1);
 assert.deepEqual(LESSON_PRACTICE_MODES.map(x=>x.id),['all','vocabulary','grammar','sentences','listening']);
 assert.equal(Object.values(model.totals).reduce((sum,x)=>sum+x.total,0),360);
 for(const lesson of model.lessons){
  const plan=bookLessonPlans[lesson.id];
  assert.equal(lesson.sections.length,4);
  assert.equal(lesson.total,plan.sections.reduce((n,s)=>n+s.tasks.length,0));
  assert.equal(lesson.href,lesson.sections[0].href);
  assert.equal(lesson.audioHref,'/lessons/'+lesson.id+'#lesson-audio');
  for(const [i,section] of lesson.sections.entries()){
   assert.equal(section.total,plan.sections[i].tasks.length);
   assert.ok(section.href.startsWith('/lessons/'+lesson.id+'?section='));
   const url=new URL(section.href,'https://example.invalid');
   assert.equal(readExerciseTarget(lesson.id,url.search)?.sectionId,section.id);
   assert.equal(readExerciseTarget(lesson.id,url.search)?.taskIndex,0);
  }
 }
});

test('correctly resumes first unanswered question in each skill with live persisted progress',()=>{
 const plan4=bookLessonPlans[4];
 const section0=plan4.sections[0];
 const section1=plan4.sections[1];
 const last=plan4.sections.at(-1);
 const bookSaved={4:{answers:{
  [section0.tasks[0].id]:{correct:true,attempts:1},
  [section0.tasks[1].id]:{correct:false,attempts:2},
  [section1.tasks[0].id]:{correct:true,attempts:1},
  [last.tasks[0].id]:{correct:true,attempts:1}
 }}};
 const audioSaved={completed:{
   '4:a4-1:meaning':true,'4:a4-2:dictation':true,
   '3:a3-1:meaning':true,
   '4:a4-3:meaning':false
 },plays:{'4:a4-1:listen':7}};
 const model=practiceJourney(bookSaved,audioSaved);
 const fourth=model.lessons[3];
 assert.equal(model.correct,3);
 assert.equal(model.startedLessons,1);
 assert.equal(model.next.id,4);
 assert.equal(fourth.correct,3);
 assert.equal(fourth.audioCompleted,2);
 assert.equal(fourth.audioPlays,7);
 assert.equal(model.audioCompleted,3);
 assert.equal(fourth.sections[0].href,lessonExerciseHref(4,section0.id,2));
 assert.equal(fourth.sections[1].href,lessonExerciseHref(4,section1.id,2));
 assert.equal(nextPracticeSection(fourth,'listening').href,
  lessonExerciseHref(4,last.id,2));
 assert.equal(fourth.href,lessonExerciseHref(4,section0.id,2));
});

test('completed lesson stays complete and links to replay instead of missing question',()=>{
 const first=bookLessonPlans[1];
 const answers=Object.fromEntries(first.sections.flatMap(section=>section.tasks).map(task=>[task.id,{correct:true}]));
 const report=practiceJourney({1:{answers}});
 const item=report.lessons[0];
 assert.equal(item.isComplete,true);
 assert.equal(item.percent,100);
 assert.equal(report.completedLessons,1);
 assert.equal(report.correct,item.total);
 assert.equal(item.href,lessonExerciseHref(1,first.sections[0].id,1));
 assert.equal(nextPracticeSection(item,'grammar').href,
  lessonExerciseHref(1,first.sections[1].id,1));
});

test('lesson practice filters support topic, section names, status and Persian search',()=>{
 const model=practiceJourney({2:{answers:{
  [bookLessonPlans[2].sections[0].tasks[0].id]:{correct:false,attempts:1}
 }}});
 assert.equal(filterPracticeLessons(model.lessons).length,12);
 assert.equal(filterPracticeLessons(model.lessons,'','all','ongoing').length,1);
 assert.equal(filterPracticeLessons(model.lessons,'','all','new').length,11);
 assert.equal(filterPracticeLessons(model.lessons,'','all','done').length,0);
 assert.equal(filterPracticeLessons(model.lessons,'درس آلمانی که وجود ندارد').length,0);
 assert.equal(filterPracticeLessons(model.lessons,'2')[0].id,2);
 assert.equal(filterPracticeLessons(model.lessons,'','listening').length,12);
 assert.equal(filterPracticeLessons(model.lessons,'','vocabulary').length,12);
 const fourth=filterPracticeLessons(model.lessons,'مبلمان');
 assert.ok(fourth.some(x=>x.id===4));
});

test('new practice UI integrates real progress and keeps original 19 practice tools',()=>{
 const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
 const shell=read('src/LearningScreens.jsx');
 const app=read('src/main.jsx');
 const jsx=read('src/PracticeJourney.jsx');
 const css=read('src/practiceJourney.css');
 assert.match(shell,/<PracticeJourney journey=\{journey\}/);
 assert.match(shell,/practiceJourney\(bookSaved,audioSaved\)/);
 assert.match(shell,/ابزارهای تمرینی تکمیلی/);
 assert.match(app,/PracticeHub setTab=\{setTab\} memory=\{memory\} progress=\{progress\}/);
 assert.match(jsx,/href=\{section.href\}/);
 assert.match(jsx,/href=\{lesson.audioHref\}/);
 assert.match(jsx,/nextPracticeSection\(lesson,mode\)/);
 assert.match(jsx,/aria-expanded=\{open\}/);
 assert.match(jsx,/aria-label="جست‌وجو در درس‌ها و تمرین‌ها"/);
 assert.match(css,/@media\(max-width:470px\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
