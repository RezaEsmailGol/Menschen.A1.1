import test from 'node:test';
import assert from 'node:assert/strict';
import {WEEKDAYS,WEEKDAY_FLASH_KEY,weekdayOptions,gradeWeekday,saveWeekdayProgress,markWeekdayLearned,weekdayWeakWords} from '../src/weekdayFlashEngine.js';
test('seven weekdays have unique German and Persian names and am examples',()=>{
 assert.equal(WEEKDAYS.length,7);
 assert.deepEqual(WEEKDAYS.map(x=>x.de),['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag']);
 assert.deepEqual(WEEKDAYS.map(x=>x.fa),['دوشنبه','سه‌شنبه','چهارشنبه','پنج‌شنبه','جمعه','شنبه','یکشنبه']);
 assert.ok(WEEKDAYS.every(x=>x.example.startsWith('Am ')));
 assert.equal(WEEKDAY_FLASH_KEY,'dt_weekdays_flash_v1');
});
test('game and test have four distinct answers with exactly one correct option for all seven days',()=>{
 for(let i=0;i<7;i++)for(const mode of ['game','test']){
  const opts=weekdayOptions(i,mode);
  assert.equal(opts.length,4);
  assert.equal(new Set(opts).size,4);
  assert.equal(opts.filter(x=>gradeWeekday(i,mode,x)).length,1);
 }
 assert.equal(gradeWeekday(0,'game','Mittwoch'),false);
 assert.equal(gradeWeekday(3,'test','پنج‌شنبه'),true);
 assert.throws(()=>weekdayOptions(7));
});
test('recovered correct answer immediately removes a previously failed weekday from weak memory',()=>{
 const failed=saveWeekdayProgress({},'Freitag',false,100);
 assert.equal(failed.Freitag.misses,1);
 assert.deepEqual(weekdayWeakWords(failed).map(x=>x.de),['Freitag']);
 const recovered=saveWeekdayProgress(failed,'Freitag',true,200);
 assert.equal(recovered.Freitag.attempts,2);
 assert.equal(recovered.Freitag.misses,1);
 assert.equal(recovered.Freitag.lastCorrect,true);
 assert.deepEqual(weekdayWeakWords(recovered),[]);
 const studied=markWeekdayLearned(recovered,'Freitag');
 assert.equal(studied.Freitag.seen,true);
 assert.equal(failed.Freitag.seen,undefined);
 const again=saveWeekdayProgress(studied,'Freitag',false,300);
 assert.deepEqual(weekdayWeakWords(again).map(x=>x.de),['Freitag']);
});
