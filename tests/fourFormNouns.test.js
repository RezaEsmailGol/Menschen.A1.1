import test from 'node:test';
import assert from 'node:assert/strict';
import {FOUR_FORM_NOUNS,FOUR_FORM_MODES,fourFormAnswers,gradeFourForms,fourFormEvents,fourFormProgress} from '../src/fourFormNouns.js';
import {recordActivity} from '../src/learningMemory.js';
import {hasLessonScene} from '../src/lessonSceneCatalog.js';
test('25 unique illustrated nouns, 15 office and 10 review, each has four forms',()=>{
 assert.equal(FOUR_FORM_NOUNS.length,25);
 assert.equal(FOUR_FORM_NOUNS.filter(n=>n.group==='office').length,15);
 assert.equal(new Set(FOUR_FORM_NOUNS.map(n=>n.word)).size,25);
 for(const n of FOUR_FORM_NOUNS){
  assert.ok(hasLessonScene(n.word),n.word);
  assert.equal(gradeFourForms(n,fourFormAnswers(n)).filter(r=>r.correct).length,4);
 }
});
test('masculine changes, feminine and neuter unchanged in accusative',()=>{
 const get=w=>fourFormAnswers(FOUR_FORM_NOUNS.find(n=>n.word===w));
 assert.deepEqual(get('Laptop'),{article:'der',plural:'Laptops',positive:'einen Laptop',negative:'keinen Laptop'});
 assert.deepEqual(get('Maus'),{article:'die',plural:'Mäuse',positive:'eine Maus',negative:'keine Maus'});
 assert.deepEqual(get('Handy'),{article:'das',plural:'Handys',positive:'ein Handy',negative:'kein Handy'});
 assert.equal(get('Computer').plural,'Computer');
 assert.equal(get('Notizbuch').plural,'Notizbücher');
});
test('independent corrections and strict noun spelling with canonical Unicode and whitespace',()=>{
 const n=FOUR_FORM_NOUNS[1];
 assert.deepEqual(gradeFourForms(n,{article:'die',plural:'Ma\u0308use',positive:'  eine   Maus ',negative:'kein Maus'}).map(r=>r.correct),[true,true,true,false]);
 assert.equal(gradeFourForms(n,{plural:'mäuse'})[1].correct,false);
 assert.equal(gradeFourForms(n,{plural:'Mause'})[1].correct,false);
 assert.equal(gradeFourForms(n,{}).some(r=>r.correct),false);
});
test('four independent real learning events update the existing memory and XP',()=>{
 const n=FOUR_FORM_NOUNS[0];
 const events=fourFormEvents(n,{...fourFormAnswers(n),negative:'kein Laptop'});
 assert.equal(new Set(events.map(e=>e.id)).size,4);
 assert.ok(events.every(e=>e.lesson===6&&e.quiet));
 let memory=events.reduce((state,event)=>recordActivity(state,event),{});
 assert.equal(memory.totalXP,32);
 assert.deepEqual(fourFormProgress(memory).counts,{article:1,plural:1,positive:1,negative:0});
 assert.equal(fourFormProgress(memory).allCorrect,0);
 memory=recordActivity(memory,fourFormEvents(n,fourFormAnswers(n))[3]);
 assert.equal(fourFormProgress(memory).allCorrect,1);
 assert.equal(fourFormProgress(memory).correct,4);
 assert.equal(fourFormProgress({}).total,100);
 assert.equal(FOUR_FORM_MODES.length,4);
});
