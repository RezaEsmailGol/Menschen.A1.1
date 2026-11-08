import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildProgressReport,progressWeek,PROGRESS_BADGE_RULES} from '../src/progressAchievements.js';
import {recordActivity,localDay} from '../src/learningMemory.js';
import {allBookTasks} from '../src/bookLessonData.js';

const dayAt=(now,daysAgo)=>{
 const d=new Date(now);d.setHours(13,0,0,0);d.setDate(d.getDate()-daysAgo);
 return d.getTime();
};
const badge=(report,id)=>report.badges.find(x=>x.id===id);

test('new learner has no fake medals, no fake speech score, and 12 real exercise routes',()=>{
 const now=dayAt(Date.now(),0);
 const report=buildProgressReport({now});
 assert.equal(report.earnedCount,0);
 assert.equal(report.totalXP,0);
 assert.equal(report.level,1);
 assert.equal(report.toNextLevel,200);
 assert.equal(report.speechAverage,null);
 assert.equal(report.audioTotal,0);
 assert.equal(report.bookPercent,0);
 assert.equal(report.allBookTotal,360);
 assert.equal(report.lessons.length,12);
 assert.equal(report.lessons[0].correct,0);
 assert.match(report.lessons[0].href,/^\/lessons\/1\?section=/);
 assert.equal(report.missions.length,3);
 assert.equal(report.missions.filter(x=>x.done).length,0);
 assert.equal(report.week.length,7);
 assert.equal(report.week.at(-1).day,localDay(now));
 assert.equal(PROGRESS_BADGE_RULES.length,12);
 assert.equal(new Set(PROGRESS_BADGE_RULES.map(x=>x.id)).size,12);
});

test('earned medals depend on actual recorded answers, speech and book progress',()=>{
 const now=dayAt(Date.now(),0);
 let memory={};
 for(let d=2;d>=0;d--){
  memory=recordActivity(memory,{id:'vocab-'+d,kind:'vocab',lesson:d+1,label:'Hallo',correct:true},dayAt(now,d));
 }
 for(let i=0;i<8;i++)
  memory=recordActivity(memory,{id:'dictation-'+i,kind:'dictation',lesson:1,label:'Guten Morgen',correct:true},now+i);
 const tasks=allBookTasks(1);
 const bookSaved={1:{answers:Object.fromEntries(tasks.map(t=>[t.id,{attempts:1,correct:true}]))}};
 const audioSaved={
  completed:{'1:a1-1:dictation':true,'1:a1-2:meaning':true},
  speech:{'1:a1-1:repeat':{lesson:1,score:88,at:now}},
  plays:{'1:a1-1:listen':3}
 };
 const speakingState={items:{'sentence:1:0':{lastScore:93,bestScore:93,attempts:3,avgScore:90}},
  history:[],total:3};
 const report=buildProgressReport({now,memory,bookSaved,audioSaved,speakingState,dailyGoal:5});
 assert.equal(report.streak,3);
 assert.equal(report.metrics.activeLessons,3);
 assert.equal(report.metrics.bookCorrect,18);
 assert.equal(report.metrics.fullChapters,1);
 assert.equal(report.audioTotal,2);
 assert.equal(report.speechAttempts,2);
 assert.equal(report.speechGood,2);
 assert.equal(report.speechAverage!==null,true);
 assert.equal(report.audioPlays,3);
 for(const id of ['first','ten','explorer','book10','audio1','speech1','streak3','chapter'])
  assert.equal(badge(report,id).earned,true,id);
 for(const id of ['streak7','audio12','speech3','xp500'])
  assert.equal(badge(report,id).earned,false,id);
 assert.equal(report.lessons[0].correct,18);
 assert.equal(report.lessons[0].percent,100);
 assert.equal(report.missions[0].done,true);
 assert.equal(report.missions[1].done,true);
 assert.equal(report.missions[2].done,true);
 assert.equal(report.week.at(-1).attempts,9);
 assert.equal(report.totalXP,memory.totalXP);
});

test('XP level and streak are read from mastery, not inflated by audio or book completions',()=>{
 const now=dayAt(Date.now(),0);
 const memory={days:{[localDay(now)]:{attempts:2,correct:2,xp:20}},
  items:{},history:[],totalXP:411};
 const audioSaved={completed:{'1:a1-1:dictation':true,'1:a1-1:meaning':true}};
 const bookSaved={1:{answers:{[allBookTasks(1)[0].id]:{correct:true}}}};
 const a=buildProgressReport({now,memory,bookSaved,audioSaved,dailyGoal:10});
 const b=buildProgressReport({now,memory,audioSaved:{},bookSaved:{},dailyGoal:10});
 assert.equal(a.totalXP,411);
 assert.equal(a.totalXP,b.totalXP);
 assert.equal(a.level,3);
 assert.equal(a.xpIntoLevel,11);
 assert.equal(a.toNextLevel,189);
 assert.equal(a.streak,1);
 assert.equal(a.audioTotal,2);
 assert.equal(a.metrics.bookCorrect,1);
 assert.equal(a.missions[1].percent,20);
 assert.ok(a.nextBadge&&!a.nextBadge.earned);
});

test('weekly chart uses real local calendar dates and never invents response counts',()=>{
 const now=dayAt(Date.now(),0);
 const yesterday=localDay(dayAt(now,1)),today=localDay(now);
 const week=progressWeek({[yesterday]:{attempts:7,correct:5},[today]:{attempts:1,correct:1}},now);
 assert.equal(week.length,7);
 assert.equal(week.at(-1).attempts,1);
 assert.equal(week.at(-2).attempts,7);
 assert.equal(week.reduce((s,x)=>s+x.attempts,0),8);
 assert.equal(week[0].attempts,0);
 assert.ok(week.every(x=>x.dayName&&x.attempts>=0));
});

test('progress UI links to existing exercises and preserves offline backup controls',()=>{
 const src=readFileSync(new URL('../src/ProgressAchievements.jsx',import.meta.url),'utf8');
 const page=readFileSync(new URL('../src/LearningScreens.jsx',import.meta.url),'utf8');
 const css=readFileSync(new URL('../src/progressAchievements.css',import.meta.url),'utf8');
 for(const key of ['pgHero','pgBadgeGrid','pgMissions','pgBars','pgLessonGrid','pgBadgeDetail'])
  assert.ok(src.includes(key));
 assert.match(src,/href=\{lesson.href\}/);
 assert.match(src,/aria-pressed=\{selected\?\.id===badge.id\}/);
 assert.match(page,/<ProgressAchievements report=\{gamified\} setTab=\{setTab\}/);
 assert.match(page,/dt_book_lessons_v1/);
 assert.match(page,/dt_audio_learning_v1/);
 assert.match(page,/download='deutsch-trainer-backup.json'/);
 assert.match(css,/@media\(max-width:500px\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
