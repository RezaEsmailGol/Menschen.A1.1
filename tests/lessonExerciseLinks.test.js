import test from 'node:test';
import assert from 'node:assert/strict';
import {bookLessonPlans} from '../src/bookLessonData.js';
import {courseLessonOutlines} from '../src/lessonOutline.js';
import {lessonExerciseHref,lessonModuleHref,readExerciseTarget} from '../src/lessonExerciseLinks.js';

test('every exercise in all five book lessons is exposed through a working target URL',()=>{
 let count=0;
 for(const id of [1,2,3,4,5]){
  const outline=courseLessonOutlines.find(x=>x.id===id);
  const plan=bookLessonPlans[id];
  assert.equal(outline.sections.length,plan.sections.length);
  for(let i=0;i<plan.sections.length;i++){
   const section=plan.sections[i],listed=outline.sections[i];
   assert.equal(listed.id,section.id);
   assert.equal(listed.exercises.length,section.tasks.length);
   for(let j=0;j<section.tasks.length;j++){
    const task=section.tasks[j],exercise=listed.exercises[j];
    assert.equal(task.id,exercise.id);
    assert.equal(exercise.number,j+1);
    assert.equal(exercise.title,task.prompt);
    const url=lessonExerciseHref(id,section.id,j+1);
    assert.equal(url, '/lessons/'+id+'?section='+section.id+'&question='+(j+1)+'#book-practice');
    assert.deepEqual(readExerciseTarget(id,new URL(url,'https://unit.local').search),
      {sectionIndex:i,taskIndex:j,sectionId:section.id,question:j+1});
    count++;
   }
  }
 }
 assert.equal(count,136);
});

test('exercise navigation rejects unrecognized and out-of-range targets',()=>{
 for(const bad of [
  '?section=not-found&question=1','?section=articles&question=0',
  '?section=articles&question=-2','?section=articles&question=1.5',
  '?section=articles&question=99999','?section=articles&question=nope']){
  assert.equal(readExerciseTarget(4,bad),null);
 }
 assert.equal(readExerciseTarget(4,''),null);
 assert.equal(readExerciseTarget(12,'?section=anything&question=1'),null);
 assert.throws(()=>lessonExerciseHref(4,'missing',1),/Unknown/);
 assert.throws(()=>lessonExerciseHref(4,bookLessonPlans[4].sections[0].id,999),/Unknown/);
});

test('every lesson module has an explicit reachable anchor on its lesson page',()=>{
 for(const id of Array.from({length:12},(_,i)=>i+1)){
  const outline=courseLessonOutlines.find(x=>x.id===id);
  for(const module of outline.modules){
   const href=lessonModuleHref(id,module.kind);
   assert.match(href,new RegExp('^/lessons/'+id+'#lesson-'));
   assert.ok(['audio','vocabulary','grammar','sentence','picture','review','builder','exam'].includes(module.kind));
  }
 }
 assert.equal(lessonModuleHref(4,'picture'),'/lessons/4#lesson-picture');
 assert.equal(lessonModuleHref(4,'exam'),'/lessons/4#lesson-actions');
 assert.throws(()=>lessonModuleHref(13,'exam'),/Unknown/);
});
