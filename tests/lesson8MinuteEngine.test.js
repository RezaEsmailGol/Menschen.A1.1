import test from 'node:test';
import assert from 'node:assert/strict';
import {
 MINUTE_KEY,BOOK_TIMES,PRECISION_TIMES,germanNumber,parseClock,formatClock,toFormal,toColloquial,
 isExactMinute,minuteBookBank,minutePrecisionBank,clockChoiceOptions,
 recordMinuteAttempt,minuteWeak,dayRows,appointmentChoices
} from '../src/lesson8MinuteEngine.js';

test('Arbeitsbuch 61 exercise 4 has all nine clock readings exactly, including 1-minute opportunities',()=>{
 assert.equal(MINUTE_KEY,'dt_l8_minute_accuracy_v1');
 assert.deepEqual(BOOK_TIMES,['09:55','14:30','17:10','20:15','11:45','07:05','15:50','16:35','09:25']);
 assert.equal(minuteBookBank.length,9);
 assert.ok(minuteBookBank.every(x=>x.source==='Arbeitsbuch 61 · Übung 4'));
 assert.equal(PRECISION_TIMES.length,24);
 assert.equal(minutePrecisionBank.length,24);
 assert.ok(minutePrecisionBank.some(x=>x.time==='14:37'));
 assert.ok(minutePrecisionBank.some(x=>x.time==='23:59'));
 assert.equal(new Set([...minuteBookBank,...minutePrecisionBank].map(x=>x.id)).size,33);
});

test('minute-accurate German 24h broadcast and 12h conversational time',()=>{
 const cases=[
  [9,55,'neun Uhr fünfundfünfzig','fünf vor zehn'],
  [14,30,'vierzehn Uhr dreißig','halb drei'],
  [17,10,'siebzehn Uhr zehn','zehn nach fünf'],
  [20,15,'zwanzig Uhr fünfzehn','Viertel nach acht'],
  [11,45,'elf Uhr fünfundvierzig','Viertel vor zwölf'],
  [7,5,'sieben Uhr fünf','fünf nach sieben'],
  [15,50,'fünfzehn Uhr fünfzig','zehn vor vier'],
  [16,35,'sechzehn Uhr fünfunddreißig','fünf nach halb fünf'],
  [9,25,'neun Uhr fünfundzwanzig','fünf vor halb zehn'],
  [14,37,'vierzehn Uhr siebenunddreißig','zwei Uhr siebenunddreißig'],
  [0,2,'null Uhr zwei','zwölf Uhr zwei'],
  [23,59,'dreiundzwanzig Uhr neunundfünfzig','elf Uhr neunundfünfzig'],
  [1,0,'ein Uhr','ein Uhr'],
  [13,0,'dreizehn Uhr','ein Uhr']
 ];
 for(const [h,m,formal,colloquial] of cases){
  assert.equal(toFormal(h,m),formal,h+':'+m);
  assert.equal(toColloquial(h,m),colloquial,h+':'+m);
 }
 assert.equal(germanNumber(21),'einundzwanzig');
 assert.equal(germanNumber(37),'siebenunddreißig');
 assert.equal(germanNumber(59),'neunundfünfzig');
 assert.equal(germanNumber(17),'siebzehn');
});

test('digit grading is exact to the minute, works with Persian digits and rejects invalid clocks',()=>{
 assert.deepEqual(parseClock('۱۴:۳۷'),{hour:14,minute:37});
 assert.deepEqual(parseClock('١٤:٣٧'),{hour:14,minute:37});
 assert.deepEqual(parseClock('14.37'),{hour:14,minute:37});
 assert.equal(isExactMinute('14:37','14:37'),true);
 assert.equal(isExactMinute('۱۴:۳۷','14:37'),true);
 assert.equal(isExactMinute('14:36','14:37'),false);
 assert.equal(isExactMinute('02:37','14:37'),false);
 assert.equal(isExactMinute('14:60','14:37'),false);
 assert.equal(isExactMinute('abc','14:37'),false);
 assert.equal(parseClock('24:00'),null);
 assert.equal(parseClock('-1:20'),null);
 assert.equal(formatClock(9,5),'09:05');
 assert.throws(()=>formatClock(25,0));
 assert.throws(()=>germanNumber(60));
});

test('formal and conversational multiple choice have four distinct options and exactly one correct answer',()=>{
 for(const item of [...minuteBookBank,...minutePrecisionBank]){
  for(const mode of ['formal','colloquial']){
   const opts=clockChoiceOptions(item,mode);
   assert.equal(opts.length,4,item.id+' '+mode);
   assert.equal(new Set(opts).size,4);
   const answer=mode==='formal'?item.formal:item.colloquial;
   assert.equal(opts.filter(x=>x===answer).length,1);
  }
 }
});

test('after one bad minute and corrected answer the weak queue clears immediately',()=>{
 const item=minutePrecisionBank[0];
 const first=recordMinuteAttempt({},item,'dictation',false,1);
 assert.deepEqual(minuteWeak(first,minutePrecisionBank).map(x=>x.time),['14:37']);
 const second=recordMinuteAttempt(first,item,'dictation',true,2);
 assert.deepEqual(minuteWeak(second,minutePrecisionBank),[]);
 assert.equal(second[item.id].attempts,2);
 assert.equal(second[item.id].misses,1);
 assert.equal(second[item.id].lastCorrect,true);
 assert.equal(first[item.id].lastCorrect,false);
 assert.throws(()=>recordMinuteAttempt({},item,'wrong',true));
});

test('Arbeitsbuch 61 weekday comparison and meeting tasks cover all day names',()=>{
 assert.deepEqual(dayRows.map(x=>x[0]),['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']);
 assert.deepEqual(dayRows.map(x=>x[1]),['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag']);
 assert.ok(appointmentChoices.length>=5);
 for(const x of appointmentChoices){
  assert.ok(x.ask&&x.fa&&x.answer);
  assert.equal(x.choices.filter(y=>y===x.answer).length,1);
 }
});
