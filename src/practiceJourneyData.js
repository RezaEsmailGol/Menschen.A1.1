import {lessons} from './courseData.js';
import {bookLessonPlans} from './bookLessonData.js';
import {lessonExerciseHref} from './lessonExerciseLinks.js';
import {bookLessonOverview,nextBookExerciseHref} from './homeLearningUX.js';
import {audioLearningSummary,parseAudioLearningStats} from './audioLearningData.js';

export const LESSON_PRACTICE_MODES=Object.freeze([
 {id:'all',label:'همه بخش‌ها',icon:'layers'},
 {id:'vocabulary',label:'واژگان',icon:'book-open'},
 {id:'grammar',label:'دستور زبان',icon:'brain'},
 {id:'sentences',label:'جمله‌سازی',icon:'pencil'},
 {id:'listening',label:'شنیداری',icon:'headphones'}
]);
const MODES=['vocabulary','grammar','sentences','listening'];
const labels={vocabulary:'واژگان',grammar:'گرامر و صرف فعل',sentences:'جمله‌سازی و نوشتن',listening:'گوش‌دادن و دیکته'};
export const normalizePracticeSearch=s=>String(s??'').normalize('NFC').toLocaleLowerCase('fa')
 .replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)))
 .replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/\u200c/g,' ').replace(/\s+/g,' ').trim();
const natural=normalizePracticeSearch;
export function activePracticeLesson(journey,storedLesson){
 const raw=String(storedLesson??'').trim();
 const id=/^\d+$/.test(raw)?Number(raw):0;
 return journey.lessons.find(lesson=>lesson.id===id)||journey.next||journey.lessons[0];
}
export const LESSON8_QUICK_LINKS=Object.freeze([
 {id:'days',label:'روزهای هفته',hint:'۷ روز',icon:'calendar'},
 {id:'months',label:'ماه‌های سال',hint:'۱۲ ماه',icon:'calendar'},
 {id:'clocks',label:'ساعت‌ها',hint:'ساعت عقربه‌ای',icon:'clock'},
 {id:'appointments',label:'قرار ملاقات',hint:'مکالمه و زمان',icon:'message'},
 {id:'frequency',label:'قیدهای تکرار',hint:'Wie oft?',icon:'repeat'},
 {id:'intervals',label:'jeden / jede / jedes',hint:'هر روز، هر هفته',icon:'brain'}
].map(item=>({...item,href:'/lessons/8?lab='+item.id+'#lesson8-time-lab'})));
const countAnswers=(tasks,answers)=>tasks.filter(t=>answers[t.id]?.correct===true).length;
export function practiceJourney(bookSaved={},audioSaved={}){
 const audio=parseAudioLearningStats(audioSaved);
 const overview=bookLessonOverview(bookSaved);
 const lessonItems=lessons.map((lesson,index)=>{
  const plan=bookLessonPlans[lesson.id];
  const entry=overview[index];
  const answers=bookSaved?.[lesson.id]?.answers||{};
  const sections=plan.sections.map((section,n)=>{
   const completed=countAnswers(section.tasks,answers);
   const taskIndex=section.tasks.findIndex(t=>answers[t.id]?.correct!==true);
   const first=taskIndex>=0?taskIndex+1:1;
   return {
    id:section.id,kind:MODES[n],label:labels[MODES[n]],
    name:section.title.replace(/^\s*[۰-۹\d]+\.\s*/,''),caption:section.caption,
    total:section.tasks.length,completed,
    percent:Math.round(completed/Math.max(section.tasks.length,1)*100),
    href:lessonExerciseHref(lesson.id,section.id,first)
   };
  });
  const audioSummary=audioLearningSummary(audio,lesson.id);
  return {
   ...entry,description:lesson.goal,searchTerms:[lesson.grammar,...lesson.words.flat()],
   sections,audioCompleted:audioSummary.completed,
   audioPlays:audioSummary.plays,
   audioHref:'/lessons/'+lesson.id+'#lesson-audio',
   href:nextBookExerciseHref(lesson.id,bookSaved),
   isComplete:entry.total>0&&entry.correct===entry.total,
   started:entry.correct>0||Object.values(answers).some(value=>Number(value?.attempts)>0),
   supplemental:Boolean(plan.supplemental)
  };
 });
 const totals=Object.fromEntries(MODES.map(mode=>[mode,{
  id:mode,label:labels[mode],
  total:lessonItems.reduce((sum,lesson)=>sum+(lesson.sections.find(s=>s.kind===mode)?.total||0),0),
  completed:lessonItems.reduce((sum,lesson)=>sum+(lesson.sections.find(s=>s.kind===mode)?.completed||0),0)
 }]));
 const correct=lessonItems.reduce((s,l)=>s+l.correct,0);
 const total=lessonItems.reduce((s,l)=>s+l.total,0);
 const completedAudio=lessonItems.reduce((s,l)=>s+l.audioCompleted,0);
 const firstUnfinished=lessonItems.find(lesson=>lesson.started&&!lesson.isComplete)
  ||lessonItems.find(lesson=>!lesson.isComplete)
  ||lessonItems[0];
 return {
  lessons:lessonItems,totals,
  correct,total,percent:Math.round(correct/Math.max(total,1)*100),
  completedLessons:lessonItems.filter(l=>l.isComplete).length,
  startedLessons:lessonItems.filter(l=>l.started).length,
  audioCompleted:completedAudio,
  next:firstUnfinished
 };
}
export function filterPracticeLessons(lessons,search='',mode='all',status='all'){
 const query=natural(search);
 return lessons.filter(lesson=>{
  if(status==='ongoing'&&(!lesson.started||lesson.isComplete))return false;
  if(status==='new'&&lesson.started)return false;
  if(status==='done'&&!lesson.isComplete)return false;
  if(mode!=='all'&&!lesson.sections.some(s=>s.kind===mode))return false;
  if(!query)return true;
  const numeric=query.match(/^(?:درس\s*)?(\d{1,2})$/);
  if(numeric)return lesson.id===Number(numeric[1]);
  const fields=[lesson.id,lesson.title,lesson.subtitle,lesson.description,...(lesson.searchTerms||[]),...lesson.sections.flatMap(s=>[s.name,s.label,s.caption])];
  return fields.some(x=>natural(x).includes(query));
 });
}
export function nextPracticeSection(lesson,mode='all'){
 if(!lesson)return null;
 const sections=mode==='all'?lesson.sections:lesson.sections.filter(s=>s.kind===mode);
 return sections.find(s=>s.completed<s.total)||sections[0]||null;
}
