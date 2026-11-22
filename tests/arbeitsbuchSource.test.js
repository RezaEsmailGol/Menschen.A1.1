import test from 'node:test';
import assert from 'node:assert/strict';
import {
 ARBEITSBUCH_KEY,ARBEITSBUCH_SOURCE,arbeitsbuchLesson,arbeitsbuchLessons,arbeitsbuchTotal,
 arbeitsbuchTasks,gradeArbeitsbuchTask,normalizeArbeitsbuchAnswer,recordArbeitsbuchAttempt,
 recordArbeitsbuchWriting,arbeitsbuchWeakTasks
} from '../src/arbeitsbuchSourceData.js';
import {ROUTES,routeFromPath,pathForRoute} from '../src/appRoutes.js';
test('Arbeitsbuch has separate source metadata and accurate printed/PDF lesson page ranges',()=>{
 const starts=[6,12,18,30,36,42,54,60,66,78,84,90];
 assert.equal(arbeitsbuchLessons.length,12);
 assert.equal(arbeitsbuchTotal,62);
 assert.equal(arbeitsbuchTasks.length,62);
 assert.equal(new Set(arbeitsbuchTasks.map(t=>t.id)).size,62);
 assert.equal(ARBEITSBUCH_KEY,'dt_arbeitsbuch_studio_v1');
 assert.match(ARBEITSBUCH_SOURCE,/Arbeitsbuch/);
 for(let id=1;id<=12;id++){
  const lesson=arbeitsbuchLesson(id);
  assert.equal(lesson.start,starts[id-1]);
  assert.equal(lesson.end,lesson.start+5);
  assert.equal(lesson.pdfStart,starts[id-1]-4);
  assert.equal(lesson.pdfEnd,lesson.end-4);
  assert.equal(lesson.tasks.length,id===8?7:5);
  for(const task of lesson.tasks){
   assert.equal(task.lesson,id);
   assert.equal(task.pdfPage,task.page-4);
   assert.ok(task.page>=lesson.start&&task.page<=lesson.end);
   assert.ok(task.id&&task.title&&task.section&&task.fa&&task.tip);
   if(task.kind==='choice'){
    assert.equal(new Set(task.options).size,task.options.length);
    assert.ok(task.options.includes(task.answer));
   }else if(task.kind==='order'){
    assert.ok(task.words.length>=4);
    assert.equal(gradeArbeitsbuchTask(task,task.words.join(' '))===true,false);
    assert.ok(task.answer);
   }else if(task.kind==='writing'){
    assert.ok(task.prompt&&task.example);
    assert.equal(gradeArbeitsbuchTask(task,task.example),null);
   }else{
    assert.ok(task.prompt&&task.answer);
   }
  }
 }
 assert.deepEqual([...new Set(arbeitsbuchTasks.map(t=>t.kind))].sort(),['choice','fill','order','writing']);
});
test('grading supports German case/spacing and never guesses a score for writing',()=>{
 const lesson=arbeitsbuchLesson(8);
 assert.equal(gradeArbeitsbuchTask(lesson.tasks[0],' Am '),true);
 assert.equal(gradeArbeitsbuchTask(lesson.tasks[0],'an'),false);
 assert.equal(gradeArbeitsbuchTask(lesson.tasks[1],'08:30'),true);
 assert.equal(normalizeArbeitsbuchAnswer('Wie heißt du ?'),'wie heißt du');
 assert.equal(gradeArbeitsbuchTask(lesson.tasks[3],'Hast du am Freitag Zeit ?'),true);
 assert.equal(gradeArbeitsbuchTask(lesson.tasks[5],lesson.tasks[5].example),null);
});
test('first correct retry clears weak exercise but preserves past failed attempts',()=>{
 const task=arbeitsbuchLesson(8).tasks[0];
 const first=recordArbeitsbuchAttempt({},task,false,1000);
 assert.equal(first[task.id].misses,1);
 assert.equal(first[task.id].completed,false);
 assert.deepEqual(arbeitsbuchWeakTasks(first,8).map(t=>t.id),[task.id]);
 const second=recordArbeitsbuchAttempt(first,task,true,2000);
 assert.equal(second[task.id].misses,1);
 assert.equal(second[task.id].attempts,2);
 assert.equal(second[task.id].lastCorrect,true);
 assert.equal(second[task.id].completed,true);
 assert.deepEqual(arbeitsbuchWeakTasks(second,8),[]);
 assert.equal(first[task.id].attempts,1);
});
test('writing stores a draft without invented accuracy and leaves unrelated data untouched',()=>{
 const task=arbeitsbuchLesson(8).tasks.find(t=>t.kind==='writing');
 const old={other:{completed:true}};
 const next=recordArbeitsbuchWriting(old,task,'Ich habe keine Zeit.',3000);
 assert.equal(next[task.id].submitted,true);
 assert.equal(next[task.id].selfAssessment,true);
 assert.equal(next[task.id].draft,'Ich habe keine Zeit.');
 assert.equal(next[task.id].lastCorrect,undefined);
 assert.deepEqual(next.other,{completed:true});
 assert.deepEqual(old,{other:{completed:true}});
 assert.throws(()=>recordArbeitsbuchAttempt({},task,null));
});
test('Arbeitsbuch has its own route distinct from existing Kursbuch and teacher workbook',()=>{
 assert.equal(ROUTES.arbeitsbuch,'/arbeitsbuch');
 assert.equal(pathForRoute('arbeitsbuch'),'/arbeitsbuch');
 assert.equal(routeFromPath('/arbeitsbuch'),'arbeitsbuch');
 assert.equal(ROUTES.bookSource,'/book-exercises');
 assert.equal(ROUTES.workbook,'/workbook');
});
