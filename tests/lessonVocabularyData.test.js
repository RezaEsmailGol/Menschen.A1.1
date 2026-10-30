import test from 'node:test';
import assert from 'node:assert/strict';
import {VOCABULARY_DECKS,vocabularyByLesson,vocabularyStatus,vocabularyQueue} from '../src/lessonVocabularyData.js';
import {normalizeRoute,pathForRoute,routeFromPath} from '../src/appRoutes.js';
import {nextReview} from '../src/studyEngine.js';

test('all 12 Menschen A1.1 units have populated, meaningful chapter decks',()=>{
 assert.equal(VOCABULARY_DECKS.length,12);
 assert.deepEqual(VOCABULARY_DECKS.map(x=>x.id),Array.from({length:12},(_,i)=>i+1));
 const titles=['Hallo! Ich bin Nicole ...','Ich bin Journalistin.','Das ist meine Mutter.',
   'Der Tisch ist schön!','Was ist das? – Das ist ein F.','Ich brauche kein Büro.',
   'Du kannst wirklich toll ...!','Kein Problem. Ich habe Zeit!',
   'Ich möchte was essen, Onkel Harry.','Ich steige jetzt in die U-Bahn ein.',
   'Was hast du heute gemacht?','Was ist denn hier passiert?'];
 for(const [i,deck] of VOCABULARY_DECKS.entries()){
   assert.equal(deck.title,titles[i]);assert.ok(deck.cards.length>=20,'lesson '+deck.id+' not populated');
   assert.equal(deck.verifiedComplete,false);
   assert.equal(new Set(deck.cards.map(c=>c.id)).size,deck.cards.length);
   assert.ok(deck.cards.every(c=>c.de&&c.fa&&c.lesson===deck.id&&c.id.startsWith('vocab:'+deck.id+':')));
 }
 assert.ok(VOCABULARY_DECKS.reduce((total,deck)=>total+deck.cards.length,0)>=300);
 assert.equal(vocabularyByLesson(99),null);
 assert.equal(vocabularyByLesson('1'),VOCABULARY_DECKS[0]);
});
test('lesson 1 and 2 contain important words with accurate Farsi',()=>{
 const one=vocabularyByLesson(1).cards,two=vocabularyByLesson(2).cards;
 assert.ok(one.length>=40&&two.length>=60);
 assert.equal(one.find(c=>c.de==='Österreich').fa,'اتریش');
 assert.ok(one.some(c=>c.de==='Wie geht es Ihnen?'));
 assert.ok(one.some(c=>c.de==='Sie'));
 assert.ok(one.some(c=>c.de==='sie'));
 assert.equal(two.find(c=>c.de==='die Journalistin').fa,'روزنامه‌نگار زن');
 assert.equal(two.find(c=>c.de==='zwölf').fa,'دوازده');
 assert.equal(two.find(c=>c.de==='zwanzig').fa,'بیست');
});
test('SRS reflects recall history, overdue status and review priorities',()=>{
 const cards=vocabularyByLesson(1).cards.slice(0,4),now=1700000000000;
 const memo={items:{
   [cards[0].id]:{mastery:90,correct:4,reviewedDays:3,lastCorrect:true},
   [cards[1].id]:{mastery:25,correct:1,reviewedDays:1,lastCorrect:false},
   [cards[2].id]:{mastery:61,correct:2,reviewedDays:1,lastCorrect:true}
 }};
 const schedule={
   [cards[0].id]:nextReview(null,'easy',now),
   [cards[1].id]:nextReview(null,'again',now),
   [cards[2].id]:nextReview(null,'good',now)
 };
 assert.equal(vocabularyStatus(cards[0],memo,schedule,now),'mastered');
 assert.equal(vocabularyStatus(cards[1],memo,schedule,now),'weak');
 assert.equal(vocabularyStatus(cards[2],memo,schedule,now),'learning');
 assert.equal(vocabularyStatus(cards[3],memo,schedule,now),'new');
 assert.deepEqual(vocabularyQueue(cards,memo,schedule,'weak',now).map(c=>c.id),[cards[1].id]);
 assert.deepEqual(vocabularyQueue(cards,memo,schedule,'due',now).map(c=>c.id),[cards[3].id]);
 assert.equal(vocabularyQueue(cards,memo,schedule,'all',now)[0].id,cards[1].id);
});
test('vocabulary deep links are shareable, validated and backward-compatible',()=>{
 assert.equal(pathForRoute('vocabulary'),'/vocabulary');
 for(let n=1;n<=12;n++){
   assert.equal(pathForRoute('vocabulary/'+n),'/vocabulary/'+n);
   assert.equal(routeFromPath('/vocabulary/'+n),'vocabulary/'+n);
   assert.equal(normalizeRoute('vocabulary/'+n),'vocabulary/'+n);
 }
 assert.equal(routeFromPath('/vocabulary/13'),'home');
 assert.equal(routeFromPath('/lessons/1'),'course/1');
});
