import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/courseData.js';
import {extendedBookLessons} from '../src/extendedBookLessons.js';
import {bookLessonPlans,allBookTasks,isBookAnswerCorrect} from '../src/bookLessonData.js';
import {courseLessonOutlines,lessonOutline} from '../src/lessonOutline.js';
import {sceneForWord,hasLessonScene} from '../src/lessonSceneCatalog.js';
import {pictureCollections,pictureModes,createPictureRound,makePictureQuestion,
 indefiniteArticle,negativeArticle,pronounFor} from '../src/lessonPictureGameData.js';

test('official five-lesson teaching outline, with subbranches visible in the list',()=>{
 assert.equal(courseLessonOutlines.length,12);
 assert.deepEqual(lessons.slice(0,5).map(x=>x.german),[
  'Hallo! Ich bin Nicole ...','Ich bin Journalistin.','Das ist meine Mutter.',
  'Der Tisch ist schön!','Was ist das? – Das ist ein F.'
 ]);
 assert.deepEqual(courseLessonOutlines.slice(0,5).map(x=>x.tasks),[18,20,28,30,32]);
 for(const id of [1,2,3,4,5]){
  const o=lessonOutline(id);
  assert.equal(o.bookAligned,true);
  assert.equal(o.sections.length,4);
  assert.ok(o.modules.some(m=>m.kind==='vocabulary'));
  assert.ok(o.modules.some(m=>m.kind==='grammar'));
  assert.ok(o.modules.some(m=>m.kind==='sentence'));
  assert.ok(o.modules.some(m=>m.kind==='exam'));
  assert.ok(o.sections.every(s=>s.title&&s.description&&s.count>=4));
 }
 for(const id of [6,7,8,9,10,11,12]){
  const o=lessonOutline(id);
  assert.equal(o.bookAligned,false,'later lesson must not claim book-aligned exercises');
  assert.equal(o.tasks,0);
  assert.equal(o.sections.length,0);
  assert.ok(o.wordCount>=8);
 }
 assert.equal(lessonOutline(0),null);
 assert.equal(lessonOutline(13),null);
});

test('all new original exercises have unique IDs and valid answer options',()=>{
 const ids=[3,4,5].flatMap(allBookTasks).map(q=>q.id);
 assert.equal(ids.length,90);
 assert.equal(new Set(ids).size,90);
 for(const lesson of Object.values(extendedBookLessons)){
  assert.equal(lesson.sections.length,4);
  for(const section of lesson.sections){
   assert.ok(section.cards.length>=4);
   assert.ok(section.tasks.length>=7);
   for(const [emoji,de,fa] of section.cards)assert.ok(emoji&&de&&fa);
   for(const task of section.tasks){
    assert.ok(task.answer&&task.prompt);
    assert.ok(['choice','type','listen','build'].includes(task.type));
    if(task.type==='choice'){
     assert.equal(task.choices.length,4);
     assert.equal(new Set(task.choices).size,4);
     assert.equal(task.choices.filter(x=>x===task.answer).length,1);
    }
    if(task.type==='listen')assert.ok(task.audio);
    assert.equal(isBookAnswerCorrect(task,task.answer),true);
    assert.equal(isBookAnswerCorrect(task,'wrong response'),false);
   }
  }
 }
});

test('each job, chair, table and everyday object uses a concrete authored SVG scene',()=>{
 assert.equal(sceneForWord('der Tisch'),'furniture-table');
 assert.equal(sceneForWord('der Stuhl'),'furniture-chair');
 assert.equal(sceneForWord('die Lampe'),'furniture-lamp');
 assert.equal(sceneForWord('das Sofa'),'furniture-sofa');
 assert.equal(sceneForWord('die Lehrerin'),'job-teacher');
 assert.equal(sceneForWord('der Arzt'),'job-doctor');
 assert.equal(sceneForWord('die Ärztin'),'job-doctor');
 assert.equal(sceneForWord('der Softwareentwickler'),'job-developer');
 assert.equal(sceneForWord('der Schlüssel'),'object-key');
 assert.equal(sceneForWord('die Brille'),'object-glasses');
 for(const [lesson,items] of Object.entries(pictureCollections)){
  assert.ok([2,4,5].includes(Number(lesson)));
  assert.ok(items.length>=12);
  for(const item of items)assert.ok(hasLessonScene(item.word),item.word);
 }
});

test('feminine/masculine/neuter grammar is correct for both article games',()=>{
 const cases=[
  ['der Tisch','ein','kein','er'],['die Lampe','eine','keine','sie'],
  ['das Sofa','ein','kein','es'],['der Schlüssel','ein','kein','er'],
  ['die Tasche','eine','keine','sie'],['das Buch','ein','kein','es']
 ];
 for(const [word,article,negative,pronoun] of cases){
  assert.equal(indefiniteArticle(word),article);
  assert.equal(negativeArticle(word),negative);
  assert.equal(pronounFor(word),pronoun);
 }
 for(const n of [2,4,5])for(const mode of pictureModes[n]){
  for(let index=0;index<8;index++){
   const round=createPictureRound({lesson:n,mode:mode.id,count:10});
   assert.equal(round.length,10);
   assert.equal(new Set(round.map(q=>q.id)).size,10);
   for(const q of round){
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4);
    assert.ok(q.options.includes(q.answer));
    assert.ok(q.why&&q.audio&&q.prompt);
   }
  }
 }
 assert.throws(()=>createPictureRound({lesson:8}),/Unsupported/);
 assert.throws(()=>createPictureRound({lesson:4,mode:'jobs'}),/Unsupported/);
});

test('jobs produce gendered Er/Sie sentences without ungrammatical article',()=>{
 const male=pictureCollections[2].find(x=>x.word==='der Journalist');
 const female=pictureCollections[2].find(x=>x.word==='die Journalistin');
 assert.equal(makePictureQuestion(male,2,'jobs').answer,'Er ist Journalist.');
 assert.equal(makePictureQuestion(female,2,'jobs').answer,'Sie ist Journalistin.');
 const articles=createPictureRound({lesson:4,mode:'articles'});
 assert.ok(articles.every(q=>['der','die','das'].includes(q.answer)));
 const negatives=createPictureRound({lesson:5,mode:'negative'});
 assert.ok(negatives.every(q=>q.answer.includes(' kein')||q.answer.includes(' keine')));
});
