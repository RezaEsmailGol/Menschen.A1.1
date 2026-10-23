import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classSets,classNotes,classNotesBySet,numberNotes,verbTables,verbNotes,originNotes,greetingNotes,classroomNotes,
  chooseNotes,isNoteCorrect,noteTask
} from '../src/classNotesData.js';

test('the five new class-note sets have unique, stable practice items',()=>{
 assert.deepEqual(classSets.map(s=>s.id),['numbers','verbs','origin','greetings','classroom']);
 assert.equal(numberNotes.length,8);
 assert.equal(verbNotes.length,36);
 assert.ok(originNotes.length>=16);
 assert.ok(greetingNotes.length>=14);
 assert.ok(classroomNotes.length>=30);
 assert.equal(new Set(classNotes.map(c=>c.key)).size,classNotes.length);
 for (const group of classSets){
   assert.ok(classNotesBySet[group.id].length>=8);
   assert.ok(classNotesBySet[group.id].every(c=>c.de&&c.key&&c.fa));
 }
});

test('German spelling of 13-20 preserves six and seven exceptions',()=>{
 const values=numberNotes.map(n=>n.de);
 assert.deepEqual(values,['dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn','zwanzig']);
 assert.equal(isNoteCorrect(numberNotes[3],'sechszehn'),false);
 assert.equal(isNoteCorrect(numberNotes[4],'siebenzehn'),false);
 assert.equal(isNoteCorrect(numberNotes[3],'SECHZEHN'),true);
});

test('conjugations for six pronouns match all six classroom verbs',()=>{
 const forms=Object.fromEntries(verbTables.map(v=>[v.verb,v.forms]));
 assert.deepEqual(forms.heißen,['heiße','heißt','heißt','heißen','heißt','heißen']);
 assert.deepEqual(forms.arbeiten,['arbeite','arbeitest','arbeitet','arbeiten','arbeitet','arbeiten']);
 assert.deepEqual(forms.haben,['habe','hast','hat','haben','habt','haben']);
 assert.deepEqual(forms.sein,['bin','bist','ist','sind','seid','sind']);
 assert.deepEqual(forms.machen,['mache','machst','macht','machen','macht','machen']);
 assert.deepEqual(forms.wohnen,['wohne','wohnst','wohnt','wohnen','wohnt','wohnen']);
});

test('countries preserve correct German articles with aus',()=>{
 for(const phrase of ['aus dem Iran','aus der Türkei','aus der Schweiz','aus den USA']){
   assert.ok(originNotes.some(c=>c.de.includes(phrase)),phrase);
 }
 assert.ok(originNotes.some(c=>c.de==='Wie heißen Sie?'));
 assert.ok(originNotes.some(c=>c.de==='Wie heißt du?'));
 assert.ok(greetingNotes.some(c=>c.de==='Wie geht es Ihnen?'));
 assert.ok(greetingNotes.some(c=>c.de==='Wie geht es dir?'));
});

test('multiple-choice tasks contain exactly one valid choice',()=>{
 for(const group of ['origin','greetings','classroom']){
  for(const item of classNotesBySet[group]){
   const q=noteTask(item);
   assert.equal(q.choices.length,4,item.de);
   assert.equal(new Set(q.choices).size,4,item.de);
   assert.equal(q.choices.filter(x=>x===q.de).length,1,item.de);
  }
 }
});

test('adaptive selector prioritizes weak memory items without repeating questions',()=>{
 const items=classNotesBySet.greetings;
 const weak=items[2],learned=items[0];
 const memory={items:{
   [weak.key]:{mastery:20,lastCorrect:false,nextAt:Date.now()+86400000},
   [learned.key]:{mastery:95,lastCorrect:true,nextAt:Date.now()+86400000},
 }};
 const picked=chooseNotes(items,memory,7,()=>0.2);
 assert.equal(picked.length,7);
 assert.equal(new Set(picked.map(x=>x.id)).size,7);
 assert.equal(picked[0].id,weak.id);
 assert.ok(!picked.some(x=>x.id===learned.id));
});

test('exact answer checks allow punctuation but not wrong accents',()=>{
 const n=originNotes.find(c=>c.de==='Ich komme aus der Türkei.');
 assert.equal(isNoteCorrect(n,'  ICH komme aus der Türkei!  '),true);
 assert.equal(isNoteCorrect(n,'Ich komme aus der Turkei.'),false);
 const v=verbNotes.find(x=>x.verb==='heißen'&&x.pronoun==='du');
 assert.equal(isNoteCorrect(v,'heißt'),true);
 assert.equal(isNoteCorrect(v,'heisst'),false);
});
