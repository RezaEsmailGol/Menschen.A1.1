import test from 'node:test';
import assert from 'node:assert/strict';
import {persianGrammarGuides,grammarGuideForLesson,grammarRuleCount} from '../src/persianGrammarGuides.js';
import {courseLessonOutlines} from '../src/lessonOutline.js';
import {lessonModuleHref} from '../src/lessonExerciseLinks.js';

test('every course lesson has a Persian grammar guide and independent mini quizzes',()=>{
 const allIds=[];
 assert.deepEqual(Object.keys(persianGrammarGuides).map(Number),Array.from({length:12},(_,i)=>i+1));
 for(let id=1;id<=12;id++){
  const guide=grammarGuideForLesson(id);
  assert.ok(guide,'missing lesson '+id);
  assert.match(guide.summary,/[\u0600-\u06FF]/);
  assert.ok(guide.rules.length >= (id<=5?3:2));
  assert.equal(grammarRuleCount(id),guide.rules.length);
  const module=courseLessonOutlines[id-1].modules.find(x=>x.kind==='grammar');
  assert.ok(module&&module.title.includes('فارسی'));
  assert.equal(module.count,guide.rules.length);
  assert.equal(lessonModuleHref(id,'grammar'),'/lessons/'+id+'#lesson-grammar');
  for(const rule of guide.rules){
   assert.ok(rule.id&&rule.title&&rule.pattern);
   assert.match(rule.explanation,/[\u0600-\u06FF]/);
   assert.ok(rule.examples.length>=2);
   for(const ex of rule.examples){
    assert.equal(ex.length,2);
    assert.match(ex[0],/[A-Za-zÄÖÜäöüß]/);
    assert.match(ex[1],/[\u0600-\u06FF]/);
   }
   assert.ok(rule.check.question&&rule.check.why);
   assert.equal(rule.check.options.length,4);
   assert.equal(new Set(rule.check.options).size,4);
   assert.equal(rule.check.options.filter(x=>x===rule.check.answer).length,1);
   allIds.push(id+':'+rule.id);
  }
 }
 assert.equal(new Set(allIds).size,allIds.length);
 assert.equal(grammarGuideForLesson(0),null);
 assert.equal(grammarGuideForLesson(13),null);
 assert.equal(grammarGuideForLesson('not-a-lesson'),null);
});

test('lesson five teaches the handwritten Nominativ table',()=>{
 const rules=grammarGuideForLesson(5).rules;
 assert.deepEqual(rules.map(x=>x.id),['nominative-table','ein-eine','kein-keine','things-and-sounds']);
 const table=rules[0].table;
 assert.deepEqual(table[0],['نوع اسم','معین','نامعین','منفی','ضمیر']);
 assert.deepEqual(table[1],['مذکر','der','ein','kein','er']);
 assert.deepEqual(table[2],['مؤنث','die','eine','keine','sie']);
 assert.deepEqual(table[3],['خنثی','das','ein','kein','es']);
 assert.deepEqual(table[4],['جمع','die','—','keine','sie']);
 assert.ok(rules[1].examples.some(x=>x[0].includes('eine Brille')));
 assert.ok(rules[2].examples.some(x=>x[0].includes('keine Tasche')));
});

test('classroom topics include W-questions, family and doch',()=>{
 assert.ok(grammarGuideForLesson(1).rules.some(x=>x.examples.some(([de])=>de.startsWith('Woher'))));
 assert.ok(grammarGuideForLesson(3).rules.some(x=>x.examples.some(([de])=>de.includes('mein Vater'))));
 assert.ok(grammarGuideForLesson(3).rules.some(x=>x.examples.some(([de])=>de.includes('Doch'))));
});
