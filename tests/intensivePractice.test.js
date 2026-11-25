import test from 'node:test';
import assert from 'node:assert/strict';
import {germanNumber} from '../src/learningData.js';
import {
 INTENSIVE_KEY,NUMBER_LEVELS,CLOCK_LEVELS,CLOCK_TIMES,drillKey,recordIntensiveAnswer,
 weakDrillItems,makeIntensiveRound,clockAnswer,checkIntensiveAnswer,
 normalizeGermanInput,toLatinDigits,loadIntensiveProgress,saveIntensiveProgress
} from '../src/intensivePracticeEngine.js';

test('numbers bootcamp covers ten, twenty, forty, two hundred and three hundred',()=>{
 const numbers=new Set(NUMBER_LEVELS.flatMap(x=>x.values));
 for(const n of [10,20,40,100,200,300,301,340,999,1000])assert.ok(numbers.has(n),'missing '+n);
 assert.equal(germanNumber(10),'zehn');
 assert.equal(germanNumber(20),'zwanzig');
 assert.equal(germanNumber(40),'vierzig');
 assert.equal(germanNumber(200),'zweihundert');
 assert.equal(germanNumber(300),'dreihundert');
 assert.equal(germanNumber(42),'zweiundvierzig');
});
test('spelling checks are strict, while input digits support Persian and Arabic',()=>{
 assert.equal(checkIntensiveAnswer({kind:'number',value:40,input:' vierzig '}),true);
 assert.equal(checkIntensiveAnswer({kind:'number',value:40,input:'viertsig'}),false);
 assert.equal(checkIntensiveAnswer({kind:'number',value:200,input:'zweihundert'}),true);
 assert.equal(checkIntensiveAnswer({kind:'number',value:300,input:'dreihundert'}),true);
 assert.equal(checkIntensiveAnswer({kind:'number',value:30,input:'dreissig'}),false);
 assert.equal(checkIntensiveAnswer({kind:'number',value:42,method:'reverse',input:'۴۲'}),true);
 assert.equal(checkIntensiveAnswer({kind:'number',value:42,method:'reverse',input:'٤٣'}),false);
 assert.equal(toLatinDigits('۲۳ ٣٤'),'23 34');
});
test('formal and colloquial clock answers differ and spell exactly',()=>{
 assert.equal(clockAnswer('14:30','formal'),'vierzehn Uhr dreißig');
 assert.equal(clockAnswer('14:30','colloquial'),'halb drei');
 assert.equal(clockAnswer('11:45','colloquial'),'Viertel vor zwölf');
 assert.equal(checkIntensiveAnswer({kind:'clock',clockStyle:'formal',value:'14:30',input:'vierzehn Uhr dreißig'}),true);
 assert.equal(checkIntensiveAnswer({kind:'clock',clockStyle:'colloquial',value:'14:30',input:'HALB DREI'}),true);
 assert.equal(checkIntensiveAnswer({kind:'clock',clockStyle:'colloquial',value:'14:30',input:'halb zwei'}),false);
 assert.equal(normalizeGermanInput('   Halb   Drei.  '),'halb drei');
 assert.ok(CLOCK_TIMES.length>40);
 assert.equal(CLOCK_LEVELS.find(x=>x.id==='book').values.length,9);
});
test('weak entries disappear immediately after a correct retry, without clearing other modes',()=>{
 const key=drillKey('number',300);
 const first=recordIntensiveAnswer({},key,false,10);
 assert.deepEqual(weakDrillItems('number','hundreds',first),[300]);
 const recovered=recordIntensiveAnswer(first,key,true,11);
 assert.deepEqual(weakDrillItems('number','hundreds',recovered),[]);
 assert.equal(recovered[key].mistakes,1);
 assert.equal(recovered[key].lastCorrect,true);
 const formal=drillKey('clock','14:30','formal');
 const colloquial=drillKey('clock','14:30','colloquial');
 const blocked=recordIntensiveAnswer({},colloquial,false,12);
 const fixed=recordIntensiveAnswer(blocked,formal,true,13);
 assert.ok(weakDrillItems('clock','book',fixed,'colloquial').includes('14:30'));
 assert.equal(weakDrillItems('clock','book',fixed,'formal').includes('14:30'),false);
});
test('rounds prioritize weak items and never duplicate initial prompts',()=>{
 const records=recordIntensiveAnswer({},drillKey('number',200),false);
 const round=makeIntensiveRound('number','hundreds',records,'formal',false,16,()=>0.5);
 assert.ok(round.some(x=>x.value===200));
 assert.equal(new Set(round.map(x=>x.value)).size,round.length);
 assert.ok(round.length<=16);
 const weak=makeIntensiveRound('number','hundreds',records,'formal',true,16);
 assert.deepEqual(weak.map(x=>x.value),[200]);
 assert.deepEqual(makeIntensiveRound('number','hundreds',{},'formal',true,16),[]);
 assert.throws(()=>makeIntensiveRound('number','unknown',{}));
});
test('progress storage is versioned and recovers gracefully from invalid JSON',()=>{
 const store=new Map();
 const storage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)};
 assert.deepEqual(loadIntensiveProgress(storage),{});
 const value=recordIntensiveAnswer({},drillKey('number',12),false,100);
 assert.equal(saveIntensiveProgress(storage,value),true);
 assert.deepEqual(loadIntensiveProgress(storage),value);
 assert.ok(store.has(INTENSIVE_KEY));
 storage.setItem(INTENSIVE_KEY,'{broken');
 assert.deepEqual(loadIntensiveProgress(storage),{});
});
