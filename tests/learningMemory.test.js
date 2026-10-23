import test from 'node:test';
import assert from 'node:assert/strict';
import { activityItemKey, chooseAdaptiveNumbers, learningInsights, localDay, recordActivity, recommendedRoute } from '../src/learningMemory.js';

test('records per-item success and failure independently without modifying previous state',()=>{
 const initial={version:1,items:{},days:{},totalXP:0,history:[]};
 const a=recordActivity(initial,{id:'vocab:a',kind:'vocab',label:'die Arbeit',lesson:1,correct:false},Date.UTC(2026,9,20,12));
 assert.equal(initial.totalXP,0);
 assert.equal(a.items['vocab:a'].wrong,1);
 assert.equal(a.items['vocab:a'].mastery,0);
 assert.equal(a.items['vocab:a'].nextAt,Date.UTC(2026,9,20,12)+600000);
 const b=recordActivity(a,{id:'vocab:a',kind:'vocab',label:'die Arbeit',lesson:1,correct:true},Date.UTC(2026,9,20,12,12));
 assert.equal(b.items['vocab:a'].correct,1);
 assert.equal(b.items['vocab:a'].wrong,1);
 assert.equal(b.totalXP,12);
 assert.equal(b.items['vocab:a'].streak,1);
});

test('sustained correct answers produce mastery, wrong answers lower mastery',()=>{
 let state;
 const now=Date.UTC(2026,9,20,10);
 for(let i=0;i<4;i++) state=recordActivity(state,{id:'vocab:a',kind:'vocab',label:'Wasser',correct:true},now+i*86400000);
 assert.equal(state.items['vocab:a'].mastery,84);
 assert.equal(state.items['vocab:a'].correct,4);
 let insight=learningInsights(state,now+3*86400000);
 assert.equal(insight.mastered,1);
 state=recordActivity(state,{id:'vocab:a',kind:'vocab',correct:false},now+4*86400000);
 assert.equal(state.items['vocab:a'].mastery,60);
 assert.equal(state.items['vocab:a'].streak,0);
});

test('daily challenge counts only practice attempts and streak is calendar-based',()=>{
 const date=Date.UTC(2026,9,20,13);
 const one=recordActivity({}, {id:'number:7',kind:'number',label:'7',correct:true}, date-86400000);
 const two=recordActivity(one, {id:'number:9',kind:'number',label:'9',correct:true}, date);
 const summary=learningInsights(two,date);
 assert.equal(summary.streak,2);
 assert.equal(summary.today.attempts,1);
 assert.equal(summary.today.xp,10);
 assert.equal(summary.level,1);
 assert.equal(learningInsights({},date).streak,0);
 assert.match(localDay(date),/^\d{4}-\d{2}-\d{2}$/);
});

test('adaptive number quiz prioritizes weak questions without repeats',()=>{
 const clock=Date.now();
 let state=recordActivity({}, {id:activityItemKey('number',7),kind:'number',label:'7',correct:false},clock);
 state=recordActivity(state, {id:activityItemKey('number',12),kind:'number',label:'12',correct:false},clock);
 const questions=chooseAdaptiveNumbers(20,state,10,()=>0.4);
 assert.equal(questions.length,10);
 assert.equal(new Set(questions).size,10);
 assert.ok(questions.includes(7));
 assert.ok(questions.includes(12));
 assert.ok(questions.every(n=>n>=0&&n<=20));
});

test('route recommendations favor overdue reviews and leave room for next lesson',()=>{
 const empty=learningInsights({});
 assert.equal(recommendedRoute(empty,4).page,'srs');
 assert.equal(recommendedRoute(empty,0).page,'course');
 assert.equal(activityItemKey('sentence',2,'Ich habe Zeit.'),'sentence:2:Ich%20habe%20Zeit.');
});


test('replaying a single card immediately cannot fake long-term mastery',()=>{
 const t=Date.UTC(2026,9,20,9);
 let state={};
 for(let i=0;i<8;i++)state=recordActivity(state,{id:'vocab:repeat',kind:'vocab',label:'Buch',correct:true},t+i*10000);
 assert.equal(state.items['vocab:repeat'].reviewedDays,1);
 assert.ok(state.items['vocab:repeat'].mastery<85);
 assert.equal(learningInsights(state,t+7200000).mastered,0);
 state=recordActivity(state,{id:'vocab:repeat',kind:'vocab',label:'Buch',correct:true},t+86400000);
 assert.equal(state.items['vocab:repeat'].reviewedDays,2);
});

test('due grammar routes to verbs instead of unrelated SRS and class-note errors route to class notes',()=>{
 const base={today:{attempts:7},due:1,weak:1};
 const grammar={id:activityItemKey('grammar','haben','du'),kind:'grammar',label:'haben / du'};
 const lessonNote={id:activityItemKey('dialogue','class','origin',4),kind:'dialogue',label:'Wie heißt du?'};
 assert.equal(recommendedRoute({...base,dueItems:[grammar],weakItems:[grammar]},0).page,'verbs');
 assert.equal(recommendedRoute({...base,dueItems:[lessonNote],weakItems:[lessonNote]},0).page,'classNotes');
 assert.equal(recommendedRoute({...base,dueItems:[grammar],weakItems:[grammar]},2).page,'srs');
 assert.equal(recommendedRoute({...base,dueItems:[],weakItems:[lessonNote]},0).page,'classNotes');
 assert.equal(recommendedRoute({...base,dueItems:[],weakItems:[]},0).page,'exam');
});

test('class note verbs route to the actual class workbook without changing stable IDs',async()=>{
 const {learningItemDestination}=await import('../src/learningMemory.js');
 const teacherVerb={id:activityItemKey('grammar','heißen','du'),kind:'grammar'};
 assert.equal(learningItemDestination(teacherVerb),'classNotes');
 assert.equal(learningItemDestination({id:activityItemKey('grammar','arbeiten','ihr'),kind:'grammar'}),'classNotes');
 assert.equal(learningItemDestination({id:activityItemKey('dialogue','class','greetings',1),kind:'dialogue'}),'classNotes');
 assert.equal(learningItemDestination({id:activityItemKey('number',17),kind:'number'}),'numbers');
 assert.equal(learningItemDestination({id:'vocab:abc',kind:'vocab'}),'srs');
});
