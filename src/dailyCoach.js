import {learningInsights,localDay} from './learningMemory.js';

export const DAILY_GOAL_KEY='dt_daily_goal_v1';
export const GOAL_OPTIONS=Object.freeze([6,10,15,20]);

export function safeDailyGoal(value){
 const parsed=Number(value);
 return GOAL_OPTIONS.includes(parsed)?parsed:10;
}
function dayKeyOffset(now,offset){
 const d=new Date(now);
 d.setHours(12,0,0,0);
 d.setDate(d.getDate()+offset);
 return localDay(d.getTime());
}
function categoryOf(event){
 const kind=event.kind;
 if(kind==='dialogue')return 'conversation';
 if(kind==='sentence'||kind==='grammar'||kind==='dictation')return 'production';
 if(kind==='visual'&&/:type$|:build$/.test(String(event.id||'')))return 'production';
 if(['number','visual','vocab','reading','pronunciation'].includes(kind))return 'recognition';
 return null;
}
function getTaskCounts(memory,now){
 const today=localDay(now);
 const counts={recognition:0,production:0,conversation:0};
 for(const event of (Array.isArray(memory?.history)?memory.history:[])){
  if(!event||!Number.isFinite(event.at)||localDay(event.at)!==today)continue;
  const category=categoryOf(event);
  if(category)counts[category]++;
 }
 return counts;
}
function miniTrend(memory,now,days=14){
 return Array.from({length:days},(_,index)=>{
  const offset=index-days+1,key=dayKeyOffset(now,offset);
  const entry=memory?.days?.[key]||{};
  const attempts=Math.max(0,Number(entry.attempts)||0);
  const correct=Math.max(0,Math.min(attempts,Number(entry.correct)||0));
  return {day:key,attempts,correct,wrong:attempts-correct,
   accuracy:attempts?Math.round(100*correct/attempts):null,
   xp:Math.max(0,Number(entry.xp)||0)};
 });
}
function keyForWeakKind(kind,itemId=''){
 if(kind==='number')return 'numbers';
 if(kind==='grammar')return 'verbs';
 if(kind==='sentence')return 'builder';
 if(kind==='dictation')return 'listen';
 if(kind==='pronunciation')return 'pronunciation';
 if(kind==='reading')return 'exam';
 if(kind==='dialogue')return 'dialogues/greetings';
 if(kind==='visual')return /:(type|build|choice)$/.test(itemId)?'pictureGame':'visual';
 return 'srs';
}
export function dailyCoachReport(memory={},scheduleDue=0,goal=10,now=Date.now()){
 const target=safeDailyGoal(goal),insights=learningInsights(memory,now);
 const days=miniTrend(memory,now,14),week=days.slice(-7),lastWeek=days.slice(0,7);
 const sum=arr=>arr.reduce((acc,d)=>({attempts:acc.attempts+d.attempts,correct:acc.correct+d.correct,xp:acc.xp+d.xp}),{attempts:0,correct:0,xp:0});
 const recent=sum(week),earlier=sum(lastWeek);
 const today=days[13],counts=getTaskCounts(memory,now);
 const recognitionGoal=Math.max(1,Math.round(target*.4));
 const productionGoal=Math.max(1,Math.round(target*.4));
 const conversationGoal=Math.max(1,target-recognitionGoal-productionGoal);
 const dueCount=Math.max(0,insights.due+Math.max(0,Number(scheduleDue)||0));
 const weak=insights.weakItems;
 const firstWeak=weak[0]||null;
 const firstRoute=firstWeak?keyForWeakKind(firstWeak.kind,firstWeak.id):null;
 const tasks=[
  {id:'recognition',title:'مرور و یادآوری',details:dueCount?'ابتدا کارت‌های موعددار یا دشوار را مرور کن':'کلمات و تصویرها را بدون عجله مرور کن',
   route:dueCount?'srs':'pictureGame',target:recognitionGoal,done:counts.recognition},
  {id:'production',title:'تولید جمله از حافظه',details:'تایپ آلمانی، صرف فعل یا ساختن جمله؛ نه فقط حدس گزینه',
   route:firstWeak&&['grammar','sentence','dictation'].includes(firstWeak.kind)?firstRoute:'pictureGame',
   target:productionGoal,done:counts.production},
  {id:'conversation',title:'تمرین پاسخ در گفت‌وگو',details:'یک پاسخ واقعی در داستان یا مربی مکالمه ثبت کن',
   route:'dialogues/greetings',target:conversationGoal,done:counts.conversation}
 ];
 const suggested=dueCount?{route:'srs',label:'مرورهای عقب‌افتاده',reason:dueCount+' کارت یا مورد موعددار داری'}
   :firstWeak?{route:firstRoute,label:'تقویت نقطه‌ضعف',reason:'تمرین دوباره: '+(firstWeak.label||firstWeak.kind)}
   :counts.production<productionGoal?{route:'pictureGame',label:'تایپ یا جمله‌سازی',reason:'دانستن گزینه کافی نیست؛ جمله بساز'}
   :{route:'dialogues/greetings',label:'گفت‌وگوی کوتاه',reason:'پاسخ دادن در موقعیت واقعی را تمرین کن'};
 const currentAccuracy=recent.attempts?Math.round(100*recent.correct/recent.attempts):null;
 const previousAccuracy=earlier.attempts?Math.round(100*earlier.correct/earlier.attempts):null;
 return {
  goal:target,today,dayProgress:Math.min(100,Math.round(today.attempts/target*100)),
  goalAchieved:today.attempts>=target,insights,days,week,
  activeDays:week.filter(x=>x.attempts>0).length,weekAttempts:recent.attempts,weekCorrect:recent.correct,
  weekXP:recent.xp,weekAccuracy:currentAccuracy,priorWeekAccuracy:previousAccuracy,
  accuracyChange:recent.attempts>=10&&earlier.attempts>=10?currentAccuracy-previousAccuracy:null,
  lastPracticeDay:[...days].reverse().find(x=>x.attempts>0)?.day||null,
  tasks:tasks.map(t=>({...t,complete:t.done>=t.target,progress:Math.min(100,Math.round(t.done/t.target*100))})),
  scheduleDue:Math.max(0,Number(scheduleDue)||0),dueCount,
  suggested
 };
}
