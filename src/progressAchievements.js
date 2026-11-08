import {learningInsights,localDay} from './learningMemory.js';
import {bookLessonOverview,nextBookExerciseHref} from './homeLearningUX.js';
import {parseAudioLearningStats,audioLearningSummary} from './audioLearningData.js';
import {speakingStats} from './speakingEngine.js';
import {lessons} from './courseData.js';

const limit=(value,min,max)=>Math.max(min,Math.min(max,Number.isFinite(Number(value))?Number(value):min));
const countUnique=(values)=>new Set(values).size;
const sum=(values)=>values.reduce((total,value)=>total+(Number(value)||0),0);
export const PROGRESS_BADGE_RULES=Object.freeze([
 {id:'first',title:'اولین قدم',detail:'اولین تمرین را انجام بده',icon:'footprints',tone:'lilac',field:'attempts',target:1,route:'practice'},
 {id:'ten',title:'شروع قدرتمند',detail:'۱۰ پاسخ درست ثبت کن',icon:'zap',tone:'amber',field:'correct',target:10,route:'practice'},
 {id:'explorer',title:'کاوشگر درس‌ها',detail:'در ۳ درس مختلف تمرین انجام بده',icon:'compass',tone:'aqua',field:'activeLessons',target:3,route:'course'},
 {id:'book10',title:'شاگرد کوشا',detail:'۱۰ تمرین اختصاصی را درست حل کن',icon:'book-open-check',tone:'aqua',field:'bookCorrect',target:10,route:'course'},
 {id:'audio1',title:'گوش تیز',detail:'یک تمرین صوتی را با موفقیت انجام بده',icon:'headphones',tone:'pink',field:'audioCompleted',target:1,route:'course'},
 {id:'audio12',title:'شنونده حرفه‌ای',detail:'۱۲ تمرین صوتی متفاوت را کامل کن',icon:'audio-lines',tone:'lilac',field:'audioCompleted',target:12,route:'course'},
 {id:'speech1',title:'صدای شجاع',detail:'یک تمرین تلفظ با میکروفون ثبت کن',icon:'mic',tone:'aqua',field:'speechAttempts',target:1,route:'speaking'},
 {id:'speech3',title:'گوینده روان',detail:'در ۳ عبارت مختلف تطبیق گفتار ۸۵٪ یا بالاتر بگیر',icon:'radio',tone:'amber',field:'speechGood',target:3,route:'speaking'},
 {id:'streak3',title:'سه روز پیوسته',detail:'۳ روز پیاپی تمرین کن',icon:'flame',tone:'amber',field:'streak',target:3,route:'coach'},
 {id:'streak7',title:'هفته طلایی',detail:'۷ روز پیاپی تمرین کن',icon:'trophy',tone:'amber',field:'streak',target:7,route:'coach'},
 {id:'chapter',title:'فاتح یک درس',detail:'تمام تمرین‌های یکی از درس‌ها را درست حل کن',icon:'graduation-cap',tone:'lilac',field:'fullChapters',target:1,route:'course'},
 {id:'xp500',title:'۵۰۰ ستاره تجربه',detail:'۵۰۰ XP از تمرین‌های واقعی کسب کن',icon:'star',tone:'pink',field:'xp',target:500,route:'practice'}
]);

export function progressWeek(days={},now=Date.now()){
 const center=new Date(now);
 center.setHours(12,0,0,0);
 return Array.from({length:7},(_,index)=>{
  const at=new Date(center);
  at.setDate(center.getDate()-(6-index));
  const day=localDay(at.getTime());
  const record=days?.[day]||{};
  return {day,dayName:new Intl.DateTimeFormat('fa-IR',{weekday:'short'}).format(at),
   attempts:Math.max(0,Number(record.attempts)||0),
   correct:Math.max(0,Number(record.correct)||0)};
 });
}

export function buildProgressReport({
 memory={},progress={},bookSaved={},audioSaved={},speakingState={},dailyGoal=10,now=Date.now()
}={}){
 const insights=learningInsights(memory,now);
 const audio=parseAudioLearningStats(audioSaved);
 const lessonOverview=bookLessonOverview(bookSaved,progress);
 const audioByLesson=Object.fromEntries(lessons.map(({id})=>[id,audioLearningSummary(audio,id)]));
 const completedAudio=Object.keys(audio.completed||{}).filter(key=>
  audio.completed[key]===true&&/^(?:[1-9]|1[0-2]):a(?:[1-9]|1[0-2])-\d{1,2}:(?:dictation|meaning|repeat)$/.test(key));
 const audioTotal=completedAudio.length;
 const bookCorrect=sum(lessonOverview.map(item=>item.correct));
 const totalBook=sum(lessonOverview.map(item=>item.total));
 const bookFull=lessonOverview.filter(item=>item.correct===item.total&&item.total>0).length;
 const speechRecords=Object.entries(audio.speech||{}).filter(([id,entry])=>
  /^(?:[1-9]|1[0-2]):a(?:[1-9]|1[0-2])-\d{1,2}:repeat$/.test(id)&&
  entry&&Number.isFinite(Number(entry.score))&&Number(entry.score)>=0&&Number(entry.score)<=100);
 const spokenItems=Object.values(speakingState?.items||{}).filter(x=>x&&Number.isFinite(Number(x.lastScore))&&Number(x.attempts)>0);
 const speechAttempts=speechRecords.length+spokenItems.length;
 const speechGood=speechRecords.filter(([,x])=>Number(x.score)>=85).length+
  spokenItems.filter(x=>Number(x.bestScore)>=85).length;
 const speechResult=speakingStats(speakingState);
 const audioScores=speechRecords.map(([,x])=>Number(x.score));
 const sampleCount=audioScores.length+(speechResult.attempts||0);
 const speechAverage=sampleCount
  ?Math.round((sum(audioScores)+(speechResult.average??0)*(speechResult.attempts||0))/sampleCount)
  :null;
 const attemptedLessons=new Set();
 for(const x of lessonOverview)if(Object.values(bookSaved?.[x.id]?.answers||{}).some(v=>v?.attempts>0||v?.correct===true))
  attemptedLessons.add(x.id);
 for(const item of Object.values(memory.items||{})){
  const id=Number(item.lesson);
  if(id>=1&&id<=12&&Number(item.attempts)>0)attemptedLessons.add(id);
 }
 for(const x of Object.keys(audio.completed||{})){
  if(audio.completed[x]!==true)continue;
  const id=Number(x.split(':')[0]);if(id>=1&&id<=12)attemptedLessons.add(id);
 }
 const attempts=sum(Object.values(memory.days||{}).map(x=>x?.attempts));
 const correct=sum(Object.values(memory.days||{}).map(x=>x?.correct));
 const goal=Math.round(limit(dailyGoal,1,100));
 const today=insights.today;
 const todayDate=localDay(now);
 const todayAudio=(memory.history||[]).filter(x=>x&&localDay(x.at)===todayDate&&
  ['dictation','pronunciation','listening'].includes(x.kind)).length;
 const metrics={
  attempts:Math.max(attempts,sum(Object.values(memory.items||{}).map(x=>x?.attempts))),
  correct:Math.max(correct,sum(Object.values(memory.items||{}).map(x=>x?.correct))),
  activeLessons:attemptedLessons.size,bookCorrect,audioCompleted:audioTotal,
  speechAttempts,speechGood,streak:insights.streak,
  fullChapters:bookFull,xp:insights.totalXP
 };
 const badges=PROGRESS_BADGE_RULES.map(rule=>{
  const value=metrics[rule.field]||0;
  return {...rule,value,earned:value>=rule.target,
   percent:Math.round(limit(value/rule.target*100,0,100)),remaining:Math.max(0,rule.target-value)};
 });
 const earned=badges.filter(x=>x.earned);
 const nextBadge=badges.filter(x=>!x.earned).sort((a,b)=>
  b.percent-a.percent||a.remaining-b.remaining||a.target-b.target)[0]||null;
 const missions=[
  {id:'first3',label:'۳ پاسخ امروز',detail:'آماده‌کردن ذهن برای یادگیری',current:today.attempts,target:3,route:'practice'},
  {id:'daily',label:'هدف روزانه',detail:'تمرین منظم و پیوسته',current:today.attempts,target:goal,route:'coach'},
  {id:'listen',label:'یک تمرین شنیداری امروز',detail:'دیکته، معنی یا تلفظ آلمانی',current:todayAudio,target:1,route:'course'}
 ].map(x=>({...x,done:x.current>=x.target,
  percent:Math.round(limit(x.current/x.target*100,0,100))}));
 const week=progressWeek(memory.days,now);
 const recommendedLesson=lessonOverview.find(x=>x.correct<x.total)??lessonOverview[0];
 return {
  insights,metrics,badges,earned,nextBadge,missions,week,lessons:lessonOverview.map(x=>({
   ...x,audio:audioByLesson[x.id]?.completed||0,
   href:nextBookExerciseHref(x.id,bookSaved)
  })),
  lesson:recommendedLesson,
  allBookTotal:totalBook,bookPercent:totalBook?Math.round(bookCorrect/totalBook*100):0,
  audioTotal,audioPlays:sum(Object.values(audio.plays||{})),speechAverage,
  speechAttempts,speechGood,
  level:insights.level,totalXP:insights.totalXP,xpIntoLevel:insights.xpIntoLevel,
  toNextLevel:200-insights.xpIntoLevel,earnedCount:earned.length,
  streak:insights.streak,today,goal
 };
}
