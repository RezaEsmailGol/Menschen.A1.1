import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PICTURE_LEVELS,normalizeGermanAnswer,checkGermanAnswer,wordTokens,wordTiles,answerFromTiles,
 eligiblePicturePhrases,pictureMemoryId,generatePictureRound} from '../src/pictureGameLogic.js';
import {recordActivity} from '../src/learningMemory.js';
import {pathForRoute,routeFromPath} from '../src/appRoutes.js';
const {phrases}=JSON.parse(readFileSync(new URL('../src/visualLessonData.json',import.meta.url),'utf8'));
test('game offers exactly three distinct selectable learning levels',()=>{
 assert.deepEqual(PICTURE_LEVELS.map(x=>x.id),['choice','type','build']);
 assert.equal(new Set(PICTURE_LEVELS.map(x=>x.number)).size,3);
});
test('German typing preserves umlauts, sharp s and word order, ignores punctuation/case',()=>{
 assert.ok(checkGermanAnswer('GUTEN morgen!!!','Guten Morgen!'));
 assert.ok(checkGermanAnswer('wie geht\'s?', 'Wie geht’s?'));
 assert.ok(checkGermanAnswer('  Ich  komme aus dem Iran.','ich komme aus dem iran'));
 assert.ok(checkGermanAnswer('Schönen   Tag noch','Schönen Tag noch!'));
 assert.equal(checkGermanAnswer('schonen Tag noch','Schönen Tag noch!'),false);
 assert.equal(checkGermanAnswer('gross','groß'),false);
 assert.equal(checkGermanAnswer('Ich komme dem aus Iran','Ich komme aus dem Iran'),false);
 assert.equal(normalizeGermanAnswer('Hallo!!'),'hallo');
});
test('word tiles remain separately identifiable, never already ordered and can be reconstructed',()=>{
 for(const value of ['Ich komme aus dem Iran.','Ich arbeite mit Python.','Vielen Dank für Ihre Zeit.','Ich ich lerne Deutsch.']){
  const tokens=wordTokens(value);
  const scrambled=wordTiles(value,()=>0.99);
  assert.deepEqual([...scrambled].sort((a,b)=>a.id-b.id).map(t=>t.word),tokens);
  if(tokens.length>1)assert.notDeepEqual(scrambled.map(t=>t.id),tokens.map((_,i)=>i));
  assert.equal(checkGermanAnswer(answerFromTiles(scrambled,tokens.map((_,i)=>i)),value),true);
  assert.equal(answerFromTiles(scrambled,[0,0]),'');
 }
});
test('sentence building uses suitable three-or-more-word phrases, avoiding single-word quizzes',()=>{
 const builder=eligiblePicturePhrases(phrases,'build');
 assert.ok(builder.length>=15);
 assert.ok(builder.length<phrases.length);
 assert.ok(builder.every(x=>wordTokens(x.de).length>=3));
 assert.equal(eligiblePicturePhrases(phrases,'choice').length,50);
 assert.equal(eligiblePicturePhrases(phrases,'type').length,50);
});
test('all stages generate random rounds with valid distinct answers and usable image metadata',()=>{
 for(const stage of PICTURE_LEVELS){
  for(let turn=0;turn<9;turn++){
   const round=generatePictureRound(phrases,stage.id,{},10);
   assert.equal(round.length,10);
   assert.equal(new Set(round.map(x=>x.item.id)).size,10);
   for(const q of round){
    assert.ok(q.item.imageIdea&&q.item.emoji);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(x=>x.id)).size,4);
    assert.ok(q.options.some(p=>p.id===q.item.id));
    assert.equal(new Set(q.options.map(x=>normalizeGermanAnswer(x.de))).size,4);
    assert.ok(q.tiles.length>=1);
   }
  }
 }
});
test('category-filtered stages still create varied valid rounds',()=>{
 for(const category of new Set(phrases.map(p=>p.category))){
  const selected=phrases.filter(p=>p.category===category);
  for(const stage of PICTURE_LEVELS){
   const possible=eligiblePicturePhrases(selected,stage.id);
   const round=generatePictureRound(selected,stage.id,{},10);
   assert.equal(round.length,Math.min(10,possible.length));
   assert.ok(round.every(q=>q.item.category===category));
  }
 }
});
test('stage memory prioritizes missed answers and does not replace existing learning history',()=>{
 const weak=phrases[3];
 const id=pictureMemoryId(weak,'type');
 const old={version:1,items:{[id]:{mastery:14,lastCorrect:false,nextAt:1}},
  days:{},totalXP:100,history:[]};
 const round=generatePictureRound(phrases,'type',old,10,()=>0.54,Date.now());
 assert.ok(round.some(q=>q.item.id===weak.id));
 const after=recordActivity(old,{id,kind:'visual',label:weak.de,lesson:1,correct:true});
 assert.equal(after.totalXP,110);
 assert.equal(after.items[id].correct,1);
 assert.equal(after.items[id].attempts,1);
 assert.equal(old.totalXP,100);
 const bad=recordActivity(after,{id,kind:'visual',label:weak.de,lesson:1,correct:false});
 assert.equal(bad.totalXP,112);
 assert.equal(bad.items[id].lastCorrect,false);
 assert.equal(bad.items[id].attempts,2);
 assert.notEqual(pictureMemoryId(weak,'type'),pictureMemoryId(weak,'choice'));
});
test('picture adventure has direct shareable URL and browser route',()=>{
 assert.equal(pathForRoute('pictureGame'),'/picture-game');
 assert.equal(routeFromPath('/picture-game'),'pictureGame');
 assert.equal(routeFromPath('/picture-game/'),'pictureGame');
});
