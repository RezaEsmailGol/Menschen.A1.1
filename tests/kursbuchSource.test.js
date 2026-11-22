import test from 'node:test';
import assert from 'node:assert/strict';
import {KURSBUCH_SOURCE,kursbuchChapters,kursbuchActions,kursbuchChapter,kursbuchActionByLesson,bookBingoWon,normalizeBookFill,kursbuchExerciseCount} from '../src/kursbuchSourceExercises.js';
import {pathForRoute,routeFromPath,ROUTES} from '../src/appRoutes.js';

test('all 12 lessons have two indexed exercises sourced to correct Kursbuch chapter pages',()=>{
 assert.equal(kursbuchChapters.length,12);
 assert.equal(kursbuchExerciseCount,38);
 const starts=[9,13,17,25,29,33,41,45,49,57,61,65];
 for(let lesson=1;lesson<=12;lesson++){
  const source=kursbuchChapter(lesson);
  assert.equal(source.lesson,lesson);
  assert.equal(source.from,starts[lesson-1]);
  assert.equal(source.to,source.from+3);
  assert.equal(source.exercises.length,2);
  for(const e of source.exercises){
   assert.ok(e.page>=source.from&&e.page<=source.to);
   for(const k of ['id','topic','prompt','answer','fa','tip'])assert.ok(String(e[k]).trim(),k);
   assert.ok(e.prompt.includes('___'));
  }
 }
 assert.equal(kursbuchChapter(7).title,'Du kannst wirklich toll ...');
 assert.equal(kursbuchChapter(9).title,'Ich möchte was essen, Onkel Harry.');
 assert.equal(kursbuchChapter(10).title,'Ich steige jetzt in die U-Bahn ein.');
 assert.equal(kursbuchChapter(11).title,'Was hast du heute gemacht?');
 assert.equal(kursbuchChapter(12).title,'Was ist denn hier passiert?');
});
test('all eleven action pages are covered and mapped to source lessons',()=>{
 assert.equal(kursbuchActions.length,14);
 assert.equal(new Set(kursbuchActions.map(e=>e.id)).size,14);
 assert.deepEqual([...new Set(kursbuchActions.map(e=>e.page))].sort((a,b)=>a-b),[80,81,82,83,84,85,86,87,88,89,90]);
 assert.equal(kursbuchActions.find(e=>e.id==='A81-bingo').lesson,7);
 assert.deepEqual(kursbuchActionByLesson(8).map(e=>e.page),[80,87,89]);
 assert.equal(kursbuchActions.find(e=>e.id==='A87-chat').ref.includes('L8'),true);
 for(const exercise of kursbuchActions){
  assert.ok(exercise.lesson>=1&&exercise.lesson<=12);
  assert.ok(exercise.ref&&exercise.title&&exercise.goal);
  if(exercise.kind==='dialogue'){
   assert.ok(exercise.turns.length>=2);
   for(const t of exercise.turns)for(const field of ['de','fa','reply','replyFa'])assert.ok(String(t[field]).trim());
  }
  if(exercise.kind==='truefalse'||exercise.kind==='clock')assert.ok(exercise.items.length>1);
  if(exercise.kind==='bingo')assert.equal(exercise.items.length,25);
 }
});
test('action bingo only accepts five marked in same line and normalizes typed answers safely',()=>{
 assert.equal(bookBingoWon(Array(25).fill(false)),false);
 const cells=Array(25).fill(false);for(let n=0;n<4;n++)cells[n]=true;
 assert.equal(bookBingoWon(cells),false);
 cells[4]=true;assert.equal(bookBingoWon(cells),true);
 const diag=Array(25).fill(false);for(let n=0;n<5;n++)diag[n*6]=true;
 assert.equal(bookBingoWon(diag),true);
 assert.equal(bookBingoWon([]),false);
 assert.equal(normalizeBookFill(' Im  '),'im');
 assert.equal(normalizeBookFill('Kommt!'),'kommt');
});
test('new book route stays separate from original author-made practice and partner mode',()=>{
 assert.equal(KURSBUCH_SOURCE,'Menschen A1.1 · Kursbuch');
 assert.equal(ROUTES.bookSource,'/book-exercises');
 assert.equal(pathForRoute('bookSource'),'/book-exercises');
 assert.equal(routeFromPath('/book-exercises'),'bookSource');
 assert.equal(ROUTES.partner,'/partner-practice');
 assert.equal(ROUTES.course,'/lessons');
});
