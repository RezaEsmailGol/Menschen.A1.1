import test from 'node:test';
import assert from 'node:assert/strict';
import {ALPHABET_CARDS,NUMBER_CARDS,WORD_DICTIONARY,DICTIONARY_STATS,
 getVisualEntry,normalizeGerman,visualDictionaryCoverage} from '../src/visualDictionary.js';
import {lessons,verbForms} from '../src/courseData.js';
import {classNotes} from '../src/classNotesData.js';
import {pronunciationRules,germanNumber} from '../src/learningData.js';
import {nightCandidates,buildNightReview} from '../src/nightShiftEngine.js';
import {activityItemKey} from '../src/learningMemory.js';

test('German alphabet includes 26 Latin letters plus Ä Ö Ü ß with pictorial nouns',()=>{
 assert.equal(ALPHABET_CARDS.length,30);
 const letters=ALPHABET_CARDS.map(x=>x.letter);
 assert.equal(new Set(letters).size,30);
 assert.deepEqual(letters.slice(-4),['Ä','Ö','Ü','ß']);
 assert.equal(letters.slice(0,26).join(''),'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
 for(const card of ALPHABET_CARDS){
  const found=getVisualEntry('',{letter:card.letter});
  assert.equal(found.kind,'alphabet');
  assert.equal(found.scene,card.scene);
  assert.ok(found.example.length>1 && found.cue.length>15);
 }
 assert.equal(getVisualEntry('',{letter:'Ö'}).scene,'mountain');
});

test('0 through 100 all have spelling, meaningful visual key and stable numerical ID',()=>{
 assert.equal(NUMBER_CARDS.length,101);
 for(let i=0;i<=100;i++){
  const card=NUMBER_CARDS[i];
  assert.equal(card.id,'number:'+i);
  assert.equal(card.word,germanNumber(i));
  assert.ok(card.scene && card.scene!=='generic');
  assert.ok(card.cue);
  assert.equal(getVisualEntry(i.toString()).number,i);
  assert.equal(getVisualEntry(card.word).number,i);
 }
 assert.match(getVisualEntry('16').cue,/sechzehn/);
 assert.match(getVisualEntry('17').cue,/siebzehn/);
});

test('all explicitly registered A1.1 words are covered with semantic rather than random-letter scenes',()=>{
 assert.ok(DICTIONARY_STATS.words>=285);
 assert.equal(DICTIONARY_STATS.words,Object.keys(WORD_DICTIONARY).length);
 for(const [word,info] of Object.entries(WORD_DICTIONARY)){
  assert.notEqual(info.scene,'context',word);
  assert.ok(info.cue.length>=10,word);
 }
 const important=['die Frau','das Haus','Österreich','die Bewerbung','die Arbeitserlaubnis',
  'die Berufserfahrung','der Nachname','die Ausbildung','die Miete','der Computer',
  'sammeln','wichtig','sehen','Physik'];
 const coverage=visualDictionaryCoverage(important);
 assert.equal(coverage.contextual,0);
 assert.equal(coverage.meaningful,important.length);
 for(const l of lessons)for(const [word] of l.words){
  assert.notEqual(getVisualEntry(word).scene,'context',word);
 }
 for(const word of classNotes)if(word.set!=='verbs')assert.notEqual(getVisualEntry(word.de).scene,'context',word.de);
 for(const rule of pronunciationRules)assert.notEqual(getVisualEntry(rule.word).scene,'context',rule.word);
});

test('different conjugations use verb meaning PLUS specific pronoun, never bare H cards',()=>{
 for(const verb of ['heißen','arbeiten','haben','sein','kommen','sprechen','möchten']){
  for(const [position,pronoun] of ['ich','du','er/sie/es','wir','ihr','sie/Sie'].entries()){
   const inflected=verbForms[verb][position];
   const card=getVisualEntry(inflected,{prompt:`«${pronoun}» از فعل ${verb}`});
   assert.equal(card.kind,'conjugation',verb+':'+pronoun);
   assert.equal(card.verb,verb);
   assert.equal(card.pronoun,pronoun);
   assert.ok(card.scene && card.scene!=='context');
  }
 }
 assert.equal(getVisualEntry('heiße',{prompt:'«ich» از فعل heißen'}).scene,'name');
 assert.equal(getVisualEntry('arbeitest',{prompt:'«du» از فعل arbeiten'}).scene,'computer');
 assert.notEqual(getVisualEntry('arbeitest',{prompt:'«du» از فعل arbeiten'}).key,
   getVisualEntry('arbeitet',{prompt:'«er/sie/es» از فعل arbeiten'}).key);
});

test('bedtime cards include same alphabet memory IDs as visual vocabulary',()=>{
 const letters=nightCandidates({}).filter(x=>x.group==='alphabet');
 assert.equal(letters.length,30);
 for(const c of letters){
  assert.equal(c.id,activityItemKey('alphabet',c.letter));
  assert.equal(c.audio,c.answer);
  assert.ok(c.note);
 }
 const review=buildNightReview({},8,()=>0.21);
 assert.ok(review.some(x=>x.group==='alphabet'));
 assert.ok(review.some(x=>x.group==='numbers'));
 assert.ok(review.some(x=>x.source==='srs'));
});

test('German normalization preserves diacritics and articles are not part of scene identity',()=>{
 assert.equal(normalizeGerman(' die  Äpfel! '),'äpfel');
 assert.equal(normalizeGerman('der Nachname'),'nachname');
 assert.equal(getVisualEntry('die Frau').scene,getVisualEntry('Frau').scene);
});
