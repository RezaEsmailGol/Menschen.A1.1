import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessons} from '../src/courseData.js';
import {bookLessonPlans,allBookTasks,isBookAnswerCorrect} from '../src/bookLessonData.js';
import {courseLessonOutlines} from '../src/lessonOutline.js';
import {lessonExerciseHref,readExerciseTarget} from '../src/lessonExerciseLinks.js';
import {supplementalBookLessons} from '../src/supplementalBookLessons.js';

test('all 12 lessons have graded practice with a unique task ID and deep link',()=>{
 const ids=new Set();
 let count=0;
 for(const lesson of lessons){
  const plan=bookLessonPlans[lesson.id];
  const outline=courseLessonOutlines[lesson.id-1];
  assert.ok(plan,'missing practice lesson '+lesson.id);
  assert.equal(plan.sections.length,4);
  assert.equal(outline.sections.length,4);
  assert.ok(outline.tasks>=18);
  if(lesson.id>5){
   assert.equal(plan.supplemental,true);
   assert.equal(outline.bookAligned,false,'do not imply an official book transcript');
   assert.equal(outline.tasks,32);
  }
  for(const section of plan.sections){
   assert.ok(section.cards.length>=4);
   assert.ok(section.tasks.length>=4);
   for(const [index,task] of section.tasks.entries()){
    assert.ok(task.id&&task.prompt&&task.answer);
    assert.ok(!ids.has(task.id),'duplicate '+task.id);
    ids.add(task.id);
    assert.equal(isBookAnswerCorrect(task,task.answer),true);
    assert.equal(isBookAnswerCorrect(task,'definitely incorrect response'),false);
    if(task.type==='choice'){
     assert.equal(task.choices.length,4);
     assert.equal(new Set(task.choices).size,4);
     assert.equal(task.choices.filter(value=>value===task.answer).length,1);
    }
    if(task.type==='listen'){
     assert.ok(task.audio);
     assert.ok(/[A-Za-zÄÖÜäöüß]/.test(task.audio));
    }
    const href=lessonExerciseHref(lesson.id,section.id,index+1);
    const url=new URL(href,'https://test.invalid');
    assert.deepEqual(readExerciseTarget(lesson.id,url.search),{
     sectionIndex:plan.sections.indexOf(section),taskIndex:index,
     sectionId:section.id,question:index+1
    });
    count++;
   }
  }
 }
 assert.equal(count,360);
 assert.equal(ids.size,360);
});
test('supplemental courses teach genuinely different topics rather than repeating first lessons',()=>{
 assert.deepEqual(Object.keys(supplementalBookLessons),['6','7','8','9','10','11','12']);
 for(const lesson of lessons.slice(5)){
  const plan=supplementalBookLessons[lesson.id];
  assert.ok(plan.focus.includes(lesson.label));
  assert.deepEqual(plan.sections.map(section=>section.tasks.length),[8,8,8,8]);
  assert.deepEqual(plan.sections.map(section=>section.id),
   ['vocabulary-practice','grammar-practice','sentence-practice','listening-practice']);
  assert.ok(plan.sections[0].tasks.some(q=>q.choices.includes(lesson.words[0][0])));
  assert.equal(plan.sections[3].tasks[0].audio,lesson.sentences[0][0]);
  assert.ok(plan.sections[1].tasks.some(q=>q.prompt.includes(lesson.verbs[0])));
 }
});
test('visible exercise interfaces contain audio play controls, not host names or upload prompts',()=>{
 const source=paths=>paths.map(path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')).join('\n');
 const visible=source(['src/PhaseOne.jsx','src/BookLessonPractice.jsx','src/LessonDirectory.jsx','src/LessonAudioButtons.jsx']);
 assert.doesNotMatch(visible,/رانفلر|Runflare|baUpload|BookAudioLibrary|CloudAudioLibrary/);
 assert.match(visible,/<ExerciseAudioButton/);
 assert.match(visible,/<LessonAudioButtons/);
 assert.match(visible,/className="laExercisePlay"/);
 assert.match(visible,/lesson\.id}/);
 const player=source(['src/LessonAudioButtons.jsx']);
 assert.match(player,/\/api\/audio\/catalog\?lesson=/);
 assert.match(player,/\/api\/audio\/play\?/);
 assert.match(player,/speak\(spoken\)/);
});
