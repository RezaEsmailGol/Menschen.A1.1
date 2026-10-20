import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeVisualQuestions,visualAnswerId} from '../src/visualLessonUtils.js';
import {pathForRoute,routeFromPath} from '../src/appRoutes.js';
const data=JSON.parse(readFileSync(new URL('../src/visualLessonData.json',import.meta.url),'utf8'));

test('lesson one has exactly 50 original picture phrases with unique and complete metadata',()=>{
 assert.equal(data.phrases.length,50);
 assert.equal(new Set(data.phrases.map(p=>p.id)).size,50);
 assert.equal(data.categories.length,6);
 for(const p of data.phrases){
  assert.ok(p.de&&p.fa&&p.imageIdea&&p.scene&&p.emoji,p.id);
  assert.ok(['formal','casual','neutral'].includes(p.register));
  assert.ok(data.categories.some(c=>c.id===p.category),p.id);
  assert.equal(p.lesson,1);
  assert.ok(p.de.length<=120,p.id);
 }
});
test('ten picture mini-dialogues contain usable German-Persian turn scripts',()=>{
 assert.equal(data.dialogues.length,10);
 assert.equal(new Set(data.dialogues.map(d=>d.id)).size,10);
 for(const s of data.dialogues){
  assert.ok(s.title&&s.scene);
  assert.ok(s.turns.length>=2);
  assert.ok(s.turns.some(t=>t.speaker==='Reza'),s.id);
  assert.ok(s.turns.some(t=>t.speaker!=='Reza'),s.id);
  for(const turn of s.turns)assert.ok(turn.speaker&&turn.de&&turn.fa);
 }
});
test('picture quiz always gives 4 unique choices including exactly one correct answer',()=>{
 for(const category of data.categories){
  const deck=data.phrases.filter(p=>p.category===category.id);
  const qs=makeVisualQuestions(deck,{},8);
  assert.equal(qs.length,8);
  assert.equal(new Set(qs.map(q=>q.item.id)).size,8);
  for(const q of qs){
   assert.equal(q.options.length,4);
   assert.equal(new Set(q.options.map(p=>p.id)).size,4);
   assert.ok(q.options.some(p=>p.id===q.item.id));
   assert.ok(q.options.every(p=>p.category===category.id));
  }
 }
});
test('weak picture cards take priority without duplicating questions',()=>{
 const one=data.phrases[0],two=data.phrases[1];
 const memory={items:{[visualAnswerId(one)]:{mastery:12,lastCorrect:false},[visualAnswerId(two)]:{mastery:8,lastCorrect:false}}};
 const questions=makeVisualQuestions(data.phrases,memory,10);
 assert.ok(questions.some(q=>q.item.id===one.id));
 assert.ok(questions.some(q=>q.item.id===two.id));
 assert.equal(new Set(questions.map(q=>q.item.id)).size,10);
});
test('visual lesson has a real direct URL with consistent reverse routing',()=>{
 assert.equal(pathForRoute('visual'),'/visual-lesson');
 assert.equal(routeFromPath('/visual-lesson'),'visual');
 assert.equal(routeFromPath('/visual-lesson/'),'visual');
});
