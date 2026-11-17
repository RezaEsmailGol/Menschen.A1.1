import test from 'node:test';
import assert from 'node:assert/strict';
import {articleNouns,coreArticleNouns,CASE_FORMS} from '../src/articleNouns.js';
import {articleModes,articleKey,articleQuestion,articleRound,articleAnswerCorrect,articleStats,articleEvent,articleStatus} from '../src/articleTrainerEngine.js';
import {recordActivity,learningItemDestination} from '../src/learningMemory.js';
import {sceneForWord} from '../src/lessonSceneCatalog.js';
import {lessons,getLessonCards} from '../src/courseData.js';
import {bookLessonPlans,allBookTasks} from '../src/bookLessonData.js';
import {pathForRoute,routeFromPath} from '../src/appRoutes.js';
import {nightCandidates} from '../src/nightShiftEngine.js';

test('all 35 requested words include correct articles, plural and concrete art, extra words are separate',()=>{
 assert.equal(coreArticleNouns.length,35);assert.equal(articleNouns.length,45);
 assert.equal(new Set(articleNouns.map(n=>n.noun)).size,45);
 const groups={der:'Sessel Stuhl Tisch Schrank Teppich Bleistift Fotoapparat Kugelschreiber Schlüssel Schirm Laptop Drucker Computer Stift Kalender Bildschirm',die:'Lampe Couch Brille Flasche Kette Tasche Uhr Geldbörse Seife E-Mail Maus',das:'Bett Bild Sofa Buch Feuerzeug Handy Telefon Formular'};
 for(const [gender,words] of Object.entries(groups))for(const word of words.split(' ')){
  const n=coreArticleNouns.find(x=>x.noun===word);assert.ok(n,word);assert.equal(n.article,gender,word);
 }
 for(const n of articleNouns){assert.ok(n.plural);assert.ok(sceneForWord(n.word),n.word)}
 assert.equal(coreArticleNouns.find(n=>n.noun==='Maus').plural,'Mäuse');
 assert.equal(coreArticleNouns.find(n=>n.noun==='Buch').plural,'Bücher');
});
test('every practice mode is valid, unique, and exact spelling is checked',()=>{
 for(const mode of articleModes)for(const n of articleNouns){
  const q=articleQuestion(n,mode.id,()=>.25);
  assert.equal(articleAnswerCorrect(q,q.answer),true);
  assert.equal(articleAnswerCorrect(q,'wrong answer'),false);
  if(q.options){assert.equal(new Set(q.options).size,q.options.length);assert.ok(q.options.includes(q.answer));}
  assert.equal(articleEvent(q,true).lesson,n.lesson);
 }
 const noun=coreArticleNouns.find(n=>n.noun==='Schlüssel');
 const write=articleQuestion(noun,'write');assert.equal(articleAnswerCorrect(write,'der schlüssel'),false);
 assert.equal(articleAnswerCorrect(write,'der Schlussel'),false);
 assert.equal(articleQuestion(noun,'neg').answer,'keinen');
 const sofa=coreArticleNouns.find(n=>n.noun==='Sofa');
 const couch=coreArticleNouns.find(n=>n.noun==='Couch');
 assert.equal(articleQuestion(sofa,'gender').answer,'das');assert.equal(articleQuestion(couch,'gender').answer,'die');
});
test('Akkusativ drills cover den, einen, keinen, eine and unchanged neuter/feminine forms',()=>{
 const cases=[
  ['Laptop','acc-def','den'],['Tisch','acc-ind','einen'],['Drucker','acc-neg','keinen'],
  ['Maus','acc-def','die'],['Maus','acc-ind','eine'],['Maus','acc-neg','keine'],
  ['Handy','acc-def','das'],['Handy','acc-ind','ein'],['Handy','acc-neg','kein']
 ];
 for(const [name,mode,expected] of cases){
  const noun=articleNouns.find(n=>n.noun===name);
  const q=articleQuestion(noun,mode,()=>0.2);
  assert.equal(q.answer,expected, name+' / '+mode);
  assert.ok(q.options.includes(expected));
  assert.equal(articleAnswerCorrect(q,expected),true);
  assert.match(q.example,/^(Ich suche|Ich brauche|Ich habe)/);
 }
 const round=articleRound({scope:'5-6',mode:'acc-def',count:100});
 assert.ok(round.length>0);
 assert.ok(round.every(q=>[5,6].includes(q.noun.lesson)));
});
test('Dativ conversion forms are correct for definite, indefinite and negative articles',()=>{
 const lamp=coreArticleNouns.find(n=>n.noun==='Lampe');
 assert.equal(CASE_FORMS.die.datDef,'der');
 assert.equal(CASE_FORMS.die.datInd,'einer');
 assert.equal(CASE_FORMS.die.datNeg,'keiner');
 assert.equal(articleQuestion(lamp,'dat-def').answer,'der');
 assert.equal(articleQuestion(lamp,'dat-ind').answer,'einer');
 assert.equal(articleQuestion(lamp,'dat-neg').answer,'keiner');
 const tableNouns={
  der:coreArticleNouns.find(n=>n.noun==='Tisch'),
  das:coreArticleNouns.find(n=>n.noun==='Buch')
 };
 assert.equal(articleQuestion(tableNouns.der,'dat-def').answer,'dem');
 assert.equal(articleQuestion(tableNouns.der,'dat-ind').answer,'einem');
 assert.equal(articleQuestion(tableNouns.das,'dat-def').answer,'dem');
 assert.equal(articleQuestion(tableNouns.das,'dat-ind').answer,'einem');
 for(const mode of ['dat-def','dat-ind','dat-neg']){
  const q=articleQuestion(lamp,mode);
  assert.ok(q.example.startsWith('mit '));
  assert.ok(q.options.includes(q.answer));
  assert.equal(articleAnswerCorrect(q,q.answer),true);
 }
});
test('weak questions are prioritized and each gender skill is separately recorded',()=>{
 const n=coreArticleNouns.find(n=>n.noun==='Laptop');const q=articleQuestion(n,'gender');const now=Date.now();
 let memory=recordActivity({},articleEvent(q,false),now);
 assert.equal(articleStatus(n,memory,'gender',now),'weak');
 assert.equal(articleStatus(n,memory,'write',now),'new');
 assert.ok(articleRound({memory,count:12,now,random:()=>.35}).some(q=>q.noun.noun==='Laptop'));
 assert.equal(articleRound({memory,filter:'weak',now}).length,1);
 assert.equal(articleStats(coreArticleNouns,memory,'gender',now).weak,1);
 assert.equal(learningItemDestination(memory.items[q.id]),'articles');
 assert.equal(articleRound({count:35}).length,35);
 assert.equal(new Set(articleRound({count:35}).map(q=>q.id)).size,35);
});
test('lesson six is replaced without inheriting obsolete clock lesson task or flashcard IDs',()=>{
 assert.equal(lessons[5].german,'Ich brauche kein Büro.');
 assert.ok(lessons[5].words.some(([de])=>de==='der Bildschirm'));
 assert.ok(lessons[5].words.some(([de])=>de==='die E-Mail'));
 assert.equal(allBookTasks(6).length,40);
 assert.ok(allBookTasks(6).every(x=>x.id.startsWith('l6-office-')));
 assert.ok(getLessonCards(lessons[5]).every(c=>c.id.startsWith('a11:book-6:')));
 assert.equal(routeFromPath('/articles'),'articles');
 assert.equal(pathForRoute('articles'),'/articles');
});
test('nighttime and visual recall never use scored gender mastery IDs',()=>{
 const night=nightCandidates({}).filter(c=>c.source==='article-recall');
 assert.equal(night.length,35);
 assert.ok(night.every(c=>c.id.startsWith('article-recall:')&&c.answer===c.audio));
 assert.ok(!night.some(c=>coreArticleNouns.some(n=>articleKey(n)===c.id)));
});
