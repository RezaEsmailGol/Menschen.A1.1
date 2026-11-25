import test from 'node:test';
import assert from 'node:assert/strict';
import {
 TEACHER_CLOCK_TIMES,TEACHER_WEEKDAYS,TEACHER_DAY_PARTS,TEACHER_VERBS,BOARD_TOPICS,
 TEACHER_BOARD_KEY,boardQuestionBank,boardRound,boardRecord,boardWeakQuestions,
 isBoardAnswerCorrect,normalizeBoardAnswer,saveBoardRecords,loadBoardRecords,
 analogClockHands
} from '../src/teacherClockBoardData.js';

test('photographed classroom clock covers every five minutes from 16:00 to 17:00',()=>{
 const pairs=[
  ['16:00','vier Uhr'],['16:05','fünf nach vier'],['16:10','zehn nach vier'],
  ['16:15','Viertel nach vier'],['16:20','zwanzig nach vier'],
  ['16:25','fünf vor halb fünf'],['16:30','halb fünf'],['16:35','fünf nach halb fünf'],
  ['16:40','zwanzig vor fünf'],['16:45','Viertel vor fünf'],
  ['16:50','zehn vor fünf'],['16:55','fünf vor fünf'],['17:00','fünf Uhr']
 ];
 assert.deepEqual(TEACHER_CLOCK_TIMES.map(x=>[x.time,x.colloquial]),pairs);
 assert.equal(TEACHER_CLOCK_TIMES[5].formal,'sechzehn Uhr fünfundzwanzig');
 assert.equal(TEACHER_CLOCK_TIMES[6].formal,'sechzehn Uhr dreißig');
 assert.equal(TEACHER_CLOCK_TIMES[8].formal,'sechzehn Uhr vierzig');
 assert.equal(TEACHER_CLOCK_TIMES[12].formal,'siebzehn Uhr');
 assert.equal(new Set(TEACHER_CLOCK_TIMES.map(x=>x.time)).size,13);
});
test('formal, colloquial and mixed board quizzes have correct, independent answers',()=>{
 const formal=boardQuestionBank('clock','formal');
 const spoken=boardQuestionBank('clock','colloquial');
 const mixed=boardQuestionBank('clock','both');
 assert.equal(formal.length,13);
 assert.equal(spoken.length,13);
 assert.equal(mixed.length,26);
 assert.ok(formal.every(x=>x.id.endsWith(':formal')));
 assert.ok(spoken.every(x=>x.id.endsWith(':colloquial')));
 assert.equal(mixed.find(x=>x.id==='clock:16:25:colloquial').answer,'fünf vor halb fünf');
 assert.ok(isBoardAnswerCorrect('Es ist fünf vor halb fünf.',mixed.find(x=>x.id==='clock:16:25:colloquial')));
 assert.ok(!isBoardAnswerCorrect('halb vier',mixed.find(x=>x.id==='clock:16:30:colloquial')));
 assert.ok(isBoardAnswerCorrect(' SECHZEHN   UHR DREISSIG ',{answer:'sechzehn Uhr dreissig',topic:'clock'}));
 assert.ok(!isBoardAnswerCorrect('sechzehn Uhr dreissig',mixed.find(x=>x.id==='clock:16:30:formal')),
  'ß must not silently convert to ss in strict spelling');
 assert.deepEqual(BOARD_TOPICS.map(x=>x.id),['clock','when','verbs']);
});
test('Wann question bank covers every weekday, every Tageszeit, am / um and in der Nacht',()=>{
 assert.equal(TEACHER_WEEKDAYS.length,7);
 assert.equal(TEACHER_DAY_PARTS.length,6);
 const tasks=boardQuestionBank('when');
 assert.equal(tasks.find(x=>x.id==='when:part:Nacht').answer,'in der Nacht');
 assert.equal(tasks.find(x=>x.id==='when:part:Abend').answer,'am Abend');
 assert.equal(tasks.find(x=>x.id==='when:day:Mittwoch').answer,'am Mittwoch');
 assert.equal(tasks.find(x=>x.id==='when:weekend').answer,'am Wochenende');
 assert.equal(tasks.find(x=>x.id==='when:hour').answer,'um 19:00 Uhr');
 assert.equal(tasks.find(x=>x.id==='when:appointment').answer,
  'Am Mittwochabend um 19:00 Uhr habe ich einen Arzttermin.');
 assert.equal(normalizeBoardAnswer('  AM Mittwochabend   UM 19:00 Uhr. '),'am mittwochabend um 19:00 uhr');
});
test('photographed sehen and wissen conjugations include du siehst and ihr wisst',()=>{
 assert.deepEqual(TEACHER_VERBS.map(x=>x.id),['sehen','wissen']);
 const tasks=boardQuestionBank('verbs');
 assert.equal(tasks.length,14);
 assert.equal(tasks.find(x=>x.id==='verbs:sehen:1').answer,'siehst');
 assert.equal(tasks.find(x=>x.id==='verbs:sehen:2').answer,'sieht');
 assert.equal(tasks.find(x=>x.id==='verbs:wissen:0').answer,'weiß');
 assert.equal(tasks.find(x=>x.id==='verbs:wissen:4').answer,'wisst');
 assert.ok(!isBoardAnswerCorrect('weißt',tasks.find(x=>x.id==='verbs:wissen:4')));
 assert.equal(tasks.find(x=>x.id==='verbs:film').answer,'Siehst du heute Abend deinen Lieblingsfilm?');
});
test('a successful retry removes the exact item from pending weak review',()=>{
 const task=boardQuestionBank('clock','colloquial')[5];
 const first=boardRecord({},task,false,1);
 assert.deepEqual(boardWeakQuestions('clock','colloquial',first).map(x=>x.id),[task.id]);
 const second=boardRecord(first,task,true,2);
 assert.deepEqual(boardWeakQuestions('clock','colloquial',second),[]);
 assert.equal(second[task.id].wrong,1);
 assert.equal(second[task.id].streak,1);
 const round=boardRound('clock','colloquial',first,false,()=>0.5);
 assert.equal(round[0].id,task.id);
 assert.equal(new Set(round.map(x=>x.id)).size,round.length);
 assert.equal(boardRound('clock','colloquial',first,true).length,1);
});
test('teacher clock dial hands and saved progress are safe',()=>{
 const a=analogClockHands('16:30');
 assert.ok(Math.abs(a.minute.x-120)<0.001);
 assert.ok(a.minute.y>200);
 assert.throws(()=>analogClockHands('25:80'));
 const store=new Map();
 const storage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)};
 const old=boardRecord({},boardQuestionBank('when')[0],false,123);
 assert.equal(saveBoardRecords(storage,old),true);
 assert.ok(store.has(TEACHER_BOARD_KEY));
 assert.deepEqual(loadBoardRecords(storage),old);
 store.set(TEACHER_BOARD_KEY,'invalid');
 assert.deepEqual(loadBoardRecords(storage),{});
});
