import test from 'node:test';
import assert from 'node:assert/strict';
import {actionStations,actionByPage,actionsForLesson,actionBingoWon,actionNormalize,actionKinds,actionTrack} from '../src/actionPagesData.js';
import {essentialGroups,essentialForLesson,essentialWords,essentialOptions,essentialGrade,essentialRecord,essentialMarkSeen,essentialWeak,ESSENTIAL_KEY} from '../src/essentialVocabularyData.js';
import {ROUTES,routeFromPath,pathForRoute} from '../src/appRoutes.js';

test('all 24 original Kursbuch Aktionsseiten pages 73–96 have interactive exercises',()=>{
 assert.equal(actionStations.length,24);
 assert.deepEqual(actionStations.map(item=>item.page),Array.from({length:24},(_,i)=>73+i));
 assert.equal(new Set(actionStations.map(item=>item.id)).size,24);
 assert.deepEqual(new Set(actionStations.map(item=>item.kind)),new Set(['dialogue','quiz','order','bingo','writing']));
 for(const station of actionStations){
  assert.equal(actionByPage(station.page),station);
  assert.ok(station.lesson>=1&&station.lesson<=12);
  assert.ok(actionKinds[station.kind]);
  assert.ok(station.topic&&station.title);
  if(station.kind==='dialogue'){
   assert.ok(station.turns.length>=2);
   for(const turn of station.turns)for(const key of ['ask','fa','reply','replyFa'])assert.ok(turn[key]);
  }
  if(station.kind==='bingo')assert.equal(station.items.length,25);
  if(station.kind==='quiz'||station.kind==='order')assert.ok(station.items.length>=2);
  if(station.kind==='writing')assert.ok(station.guide&&station.sample);
 }
 for(let lesson=1;lesson<=12;lesson++)assert.ok(actionsForLesson(lesson).length>0,'lesson '+lesson);
});
test('bingo requires five consecutive aligned cells and progress does not mutate previous state',()=>{
 assert.equal(actionBingoWon([]),false);
 const cells=Array(25).fill(false);
 for(let i=0;i<4;i++)cells[i]=true;
 assert.equal(actionBingoWon(cells),false);
 cells[4]=true;
 assert.equal(actionBingoWon(cells),true);
 const diagonal=Array(25).fill(false);
 for(const i of [4,8,12,16,20])diagonal[i]=true;
 assert.equal(actionBingoWon(diagonal),true);
 assert.equal(actionNormalize('  Wann   kommst  du  an ? '),'wann kommst du an?');
 const before={other:{completed:true}};
 const after=actionTrack(before,'action-81',{completed:true},100);
 assert.equal(after['action-81'].attempts,1);
 assert.deepEqual(before,{other:{completed:true}});
 assert.throws(()=>actionTrack({},'action-102',{}));
});
test('120 curated vocabulary cards are mapped to twelve actual Arbeitsbuch Lernwortschatz PDF pages',()=>{
 const sourcePages=[7,13,19,31,37,43,54,60,66,78,83,89];
 assert.equal(essentialGroups.length,12);
 assert.equal(essentialWords.length,120);
 assert.equal(new Set(essentialWords.map(x=>x.id)).size,120);
 assert.deepEqual(essentialGroups.map(x=>x.pdfPage),sourcePages);
 for(let lesson=1;lesson<=12;lesson++){
  const g=essentialForLesson(lesson);
  assert.equal(g.words.length,10);
  assert.equal(g.lesson,lesson);
  for(const [i,w] of g.words.entries()){
   assert.ok(w.de&&w.fa);
   assert.equal(w.lesson,lesson);
   for(const mode of ['game','test']){
    const options=essentialOptions(g,i,mode);
    assert.equal(options.length,4);
    assert.equal(new Set(options).size,4);
    assert.equal(options.filter(x=>essentialGrade(w,mode,x)).length,1);
   }
  }
 }
 assert.equal(ESSENTIAL_KEY,'dt_essential_vocab_20261123_v1');
});
test('failed vocabulary is immediately removed from weak cards after genuine correct retry',()=>{
 const word=essentialForLesson(8).words[0];
 const failed=essentialRecord({},word,false,100);
 assert.equal(failed[word.id].misses,1);
 assert.deepEqual(essentialWeak(failed,8).map(x=>x.id),[word.id]);
 const corrected=essentialRecord(failed,word,true,200);
 assert.equal(corrected[word.id].attempts,2);
 assert.equal(corrected[word.id].misses,1);
 assert.equal(corrected[word.id].lastCorrect,true);
 assert.equal(essentialWeak(corrected,8).length,0);
 const marked=essentialMarkSeen(corrected,word);
 assert.equal(marked[word.id].seen,true);
 assert.equal(failed[word.id].lastCorrect,false);
});
test('new routes remain separate from older book and conversation exercises',()=>{
 assert.equal(ROUTES.actionPages,'/action-pages');
 assert.equal(ROUTES.essentialWords,'/essential-words');
 assert.equal(pathForRoute('actionPages'),'/action-pages');
 assert.equal(routeFromPath('/essential-words'),'essentialWords');
 assert.equal(ROUTES.bookSource,'/book-exercises');
 assert.equal(ROUTES.arbeitsbuch,'/arbeitsbuch');
});
