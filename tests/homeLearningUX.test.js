import test from 'node:test';
import assert from 'node:assert/strict';
import {bookLessonPlans,allBookTasks} from '../src/bookLessonData.js';
import {currentHomeLessonId,bookLessonOverview,nextBookExerciseHref,practiceFilters,matchesPracticeFilter} from '../src/homeLearningUX.js';

test('home continues the selected lesson and falls back to latest started lesson',()=>{
 assert.equal(currentHomeLessonId('5',{1:{started:true}}),5);
 assert.equal(currentHomeLessonId('12',{}),12);
 assert.equal(currentHomeLessonId('0',{1:{started:true},4:{started:true}}),4);
 assert.equal(currentHomeLessonId('bad',{1:{started:true},3:{passed:true}}),3);
 assert.equal(currentHomeLessonId(null,{}),1);
 assert.equal(currentHomeLessonId('13',{}),1);
 assert.equal(currentHomeLessonId('5.5',{}),1);
});

test('home book counts use live authored lesson data (including lesson 5 = 40)',()=>{
 const overview=bookLessonOverview({},{});
 assert.deepEqual(overview.map(x=>x.total),[18,20,28,30,40,...Array(7).fill(32)]);
 for(const entry of overview){
  assert.equal(entry.total,allBookTasks(entry.id).length);
  assert.equal(entry.correct,0);
  assert.equal(entry.percent,0);
 }
 const task=bookLessonPlans[5].sections[0].tasks[0];
 const actual=bookLessonOverview({5:{answers:{[task.id]:{correct:true}}}},{5:{passed:true}});
 assert.equal(actual[4].correct,1);
 assert.equal(actual[4].passed,true);
 assert.equal(actual[4].percent,3);
});

test('continue practice links to first unfinished exercise, not the first repeated one',()=>{
 const plan=bookLessonPlans[5];
 const firstSection=plan.sections[0],first=firstSection.tasks[0],second=firstSection.tasks[1];
 const start=nextBookExerciseHref(5,{});
 assert.match(start,/^\/lessons\/5\?section=.+&question=1#book-practice$/);
 assert.match(start,new RegExp('section='+firstSection.id));
 const incomplete=nextBookExerciseHref(5,{5:{answers:{[first.id]:{correct:true},[second.id]:{correct:false}}}});
 assert.match(incomplete,/question=2#book-practice$/);
 const completed={};
 for(const section of plan.sections)for(const item of section.tasks)completed[item.id]={correct:true};
 assert.equal(nextBookExerciseHref(5,{5:{answers:completed}}),start);
 assert.match(nextBookExerciseHref(6,{}),/^\/lessons\/6\?section=vocabulary-practice&question=1#book-practice$/);
 assert.throws(()=>nextBookExerciseHref(13,{}),RangeError);
});

test('practice filters are substantive and preserve all activities through all tab',()=>{
 assert.deepEqual(practiceFilters.map(x=>x.id),['all','daily','speaking','words','challenge']);
 for(const id of ['coach','speaking','night','visualMemory','classNotes','pictureGame','visual','dialogues','workbook','srs','builder','numbers','pronunciation','listen','exam','verbs','alphabet','words','flash']){
  assert.equal(matchesPracticeFilter(id,'all'),true);
  assert.ok(practiceFilters.some(x=>x.id!=='all'&&matchesPracticeFilter(id,x.id)),id+' is unfindable via groups');
 }
 assert.equal(matchesPracticeFilter('numbers','challenge'),true);
 assert.equal(matchesPracticeFilter('numbers','speaking'),false);
 assert.equal(matchesPracticeFilter('speaking','speaking'),true);
});
