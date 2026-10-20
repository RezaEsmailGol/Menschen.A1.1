import test from 'node:test';
import assert from 'node:assert/strict';
import {recordActivity,localDay} from '../src/learningMemory.js';
import {DAILY_GOAL_KEY,GOAL_OPTIONS,safeDailyGoal,dailyCoachReport} from '../src/dailyCoach.js';
import {pathForRoute,routeFromPath} from '../src/appRoutes.js';

const now=new Date(2026,9,21,15,15).getTime();
const empty=()=>({version:1,items:{},days:{},history:[],totalXP:0});
const dayBefore=(days)=>{
 const d=new Date(now);d.setHours(12,0,0,0);d.setDate(d.getDate()-days);return d.getTime();
};
test('daily goal options are bounded and persisted under one stable backup key',()=>{
 assert.equal(DAILY_GOAL_KEY,'dt_daily_goal_v1');
 assert.deepEqual(GOAL_OPTIONS,[6,10,15,20]);
 assert.equal(safeDailyGoal(6),6);assert.equal(safeDailyGoal('15'),15);
 assert.equal(safeDailyGoal(0),10);assert.equal(safeDailyGoal(500000),10);
 assert.equal(safeDailyGoal('invalid'),10);
});
test('fresh learner has no fabricated prior activity, accuracy or mastery',()=>{
 const summary=dailyCoachReport(empty(),0,10,now);
 assert.equal(summary.today.attempts,0);
 assert.equal(summary.today.correct,0);
 assert.equal(summary.dayProgress,0);
 assert.equal(summary.weekAccuracy,null);
 assert.equal(summary.priorWeekAccuracy,null);
 assert.equal(summary.activeDays,0);
 assert.equal(summary.weekXP,0);
 assert.equal(summary.dueCount,0);
 assert.equal(summary.tasks.length,3);
 assert.ok(summary.tasks.every(x=>x.done===0&&!x.complete));
 assert.equal(summary.insights.mastered,0);
 assert.equal(summary.days.length,14);
 assert.equal(summary.days[13].day,localDay(now));
 assert.equal(summary.days[0].day,localDay(dayBefore(13)));
});
test('daily 3-step mission counts true learning events, not page visits or repeated labels',()=>{
 let memory=empty();
 const events=[
  {id:'visual:l1-01:choice',kind:'visual',correct:true},
  {id:'visual:l1-02:choice',kind:'visual',correct:true},
  {id:'number:1',kind:'number',correct:true},
  {id:'visual:l1-03:choice',kind:'visual',correct:false},
  {id:'visual:l1-04:type',kind:'visual',correct:true},
  {id:'visual:l1-05:build',kind:'visual',correct:true},
  {id:'grammar:kommen',kind:'grammar',correct:true},
  {id:'sentence:1',kind:'sentence',correct:false},
  {id:'dialogue:hello',kind:'dialogue',correct:true},
  {id:'dialogue:office',kind:'dialogue',correct:true}
 ];
 events.forEach((e,i)=>{memory=recordActivity(memory,{...e,label:e.id,lesson:1},now+i*1000)});
 const summary=dailyCoachReport(memory,0,10,now+20000);
 assert.equal(summary.today.attempts,10);
 assert.equal(summary.today.correct,8);
 assert.equal(summary.today.xp,84);
 assert.equal(summary.dayProgress,100);
 assert.equal(summary.goalAchieved,true);
 assert.equal(summary.weekAccuracy,80);
 assert.deepEqual(summary.tasks.map(x=>x.done),[4,4,2]);
 assert.equal(summary.tasks.filter(x=>x.complete).length,3);
 assert.equal(summary.weekAttempts,10);
 assert.equal(summary.activeDays,1);
});
test('old completed answers count toward trend but not todays daily goal',()=>{
 let memory=empty();
 memory=recordActivity(memory,{id:'visual:x',kind:'visual',correct:true,label:'A'},dayBefore(1));
 memory=recordActivity(memory,{id:'visual:y',kind:'visual',correct:false,label:'B'},dayBefore(1)+1000);
 const summary=dailyCoachReport(memory,0,10,now);
 assert.equal(summary.today.attempts,0);
 assert.equal(summary.activeDays,1);
 assert.equal(summary.weekAttempts,2);
 assert.equal(summary.weekAccuracy,50);
 assert.equal(summary.days.at(-2).attempts,2);
 assert.equal(summary.days.at(-1).attempts,0);
});
test('weekly trends compare only after enough real attempts exist in both weeks',()=>{
 const memory=empty();
 for(let i=0;i<14;i++){
  const day=dayBefore(13-i),key=localDay(day);
  memory.days[key]={attempts:2,correct:i<7?1:2,xp:12};
 }
 let summary=dailyCoachReport(memory,0,10,now);
 assert.equal(summary.weekAttempts,14);
 assert.equal(summary.weekAccuracy,100);
 assert.equal(summary.priorWeekAccuracy,50);
 assert.equal(summary.accuracyChange,50);
 assert.equal(summary.activeDays,7);
 assert.equal(summary.weekXP,84);
 memory.days[localDay(dayBefore(13))]={attempts:1,correct:0,xp:2};
 summary=dailyCoachReport(memory,0,10,now);
 assert.equal(summary.priorWeekAccuracy,Math.round(600/13));
});
test('scheduled reviews outrank new content; weak items direct to matching exercises',()=>{
 let memory=empty();
 let report=dailyCoachReport(memory,3,10,now);
 assert.equal(report.suggested.route,'srs');
 assert.ok(report.dueCount>=3);
 assert.equal(report.tasks[0].route,'srs');
 memory=recordActivity(memory,{id:'grammar:sein',kind:'grammar',label:'sein',lesson:1,correct:false},now-100000);
 report=dailyCoachReport(memory,0,10,now);
 assert.equal(report.insights.weak,1);
 assert.equal(report.suggested.route,'verbs');
 assert.ok(report.suggested.reason.includes('sein'));
});
test('direct coach route works from home and through browser reload',()=>{
 assert.equal(pathForRoute('coach'),'/coach');
 assert.equal(routeFromPath('/coach'),'coach');
 assert.equal(routeFromPath('/coach/'),'coach');
});

test('overdue visual typing is routed to the picture game rather than unrelated deck',()=>{
 let memory=empty();
 memory=recordActivity(memory,{
  id:'visual:l1-04:type',kind:'visual',label:'Ich lerne Deutsch.',correct:false,lesson:1
 },now-16*60*1000);
 const report=dailyCoachReport(memory,0,10,now);
 assert.equal(report.insights.due,1);
 assert.equal(report.suggested.route,'pictureGame');
 assert.equal(report.tasks[0].route,'pictureGame');
});
