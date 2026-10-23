import test from 'node:test';
import assert from 'node:assert/strict';
import {nightCandidates,buildNightReview,createNightState,nightSessionStart,nightSessionAdvance,saveNightSession,nightSummary} from '../src/nightShiftEngine.js';
import {recordActivity,activityItemKey} from '../src/learningMemory.js';
import {germanNumber} from '../src/learningData.js';
import {lessons} from '../src/courseData.js';

test('bedtime review selects existing class and enabled-lesson keys without duplicates',()=>{
 const cards=nightCandidates({progress:{1:{started:true}},memory:{}});
 assert.ok(cards.length>30);
 assert.ok(cards.some(x=>x.group==='numbers'));
 assert.ok(cards.some(x=>x.group==='verbs'));
 assert.ok(cards.some(x=>x.source==='srs'));
 assert.equal(new Set(cards.map(x=>x.id)).size,cards.length);
 const review=buildNightReview({progress:{1:{started:true}}},6,()=>0.33);
 assert.equal(review.length,6);
 assert.ok(review.some(x=>x.group==='numbers'));
 assert.ok(review.some(x=>x.source==='srs'));
 assert.ok(review.every(x=>x.prompt&&x.answer&&x.audio&&x.id));
});

test('failed questions are preferred over unknown words for nighttime review',()=>{
 const id=activityItemKey('number',17);
 const now=Date.UTC(2026,9,23,19,0);
 const state=recordActivity({}, {id,kind:'number',label:'17',correct:false}, now);
 const review=buildNightReview({memory:state,progress:{1:{started:true}}},6,()=>0.47,now+1000);
 assert.ok(review.some(x=>x.id===id));
});

test('a completed session stores one day without losing earlier history',()=>{
 const at=new Date(2026,9,23,22,10).getTime();
 const items=buildNightReview({},4,()=>0.5,at);
 const session=nightSessionStart(items,at);
 assert.equal(session.items.length,4);
 let current=session;
 current=nightSessionAdvance(current,true,at+1000);
 current=nightSessionAdvance(current,false,at+2000);
 current=nightSessionAdvance(current,true,at+3000);
 current=nightSessionAdvance(current,true,at+4000);
 assert.equal(current.correct,3);
 assert.ok(current.completedAt);
 const old=createNightState();
 old.history['2026-10-22']={completedAt:at-86400000,correct:2,total:4};
 const next=saveNightSession(old,current);
 assert.equal(next.history['2026-10-22'].correct,2);
 assert.equal(next.history['2026-10-23'].correct,3);
 assert.equal(nightSummary(next,at+5000).doneToday,true);
 assert.equal(nightSummary(next,at+5000).nights,2);
});

test('incomplete bedtime session must not appear as completed',()=>{
 const now=new Date(2026,9,23,22).getTime();
 const start=nightSessionStart(buildNightReview({},4,()=>0.5),now);
 const state=saveNightSession(createNightState(),start);
 assert.equal(nightSummary(state,now).doneToday,false);
 assert.ok(state.active);
});

test('nighttime selection only unlocks course cards for started lessons',()=>{
 const cards=nightCandidates({progress:{1:{started:true}}});
 const course=cards.filter(x=>x.source==='srs');
 assert.ok(course.length>0);
 assert.ok(course.every(x=>x.lesson===1 || x.lesson===0));
 const all=nightCandidates({progress:Object.fromEntries(lessons.map(x=>[x.id,{started:true}]))});
 assert.ok(all.filter(x=>x.source==='srs').length>course.length);
});

test('number spelling and visual scenes can represent 0 through 100',()=>{
 assert.equal(germanNumber(0),'null');
 assert.equal(germanNumber(17),'siebzehn');
 assert.equal(germanNumber(21),'einundzwanzig');
 assert.equal(germanNumber(100),'hundert');
});
