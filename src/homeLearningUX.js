import {lessons} from './courseData.js';
import {allBookTasks,bookLessonPlans} from './bookLessonData.js';
import {lessonExerciseHref} from './lessonExerciseLinks.js';

// The home screen uses the same lesson/task source of truth as the exercises.
// Do not store parallel static exercise counters or mutate existing progress.
export function currentHomeLessonId(raw,progress={}){
  const id=Number(raw);
  if(raw!==null&&raw!==undefined&&raw!==''&&Number.isInteger(id)&&id>=1&&id<=12)return id;
  const last=lessons.filter(lesson=>progress?.[lesson.id]?.started||progress?.[lesson.id]?.passed).at(-1);
  return last?.id||1;
}

export function bookLessonOverview(saved={},progress={}){
  return [1,2,3,4,5].map(id=>{
    const tasks=allBookTasks(id);
    const answers=saved?.[id]?.answers||{};
    const correct=tasks.filter(t=>answers[t.id]?.correct===true).length;
    return {
      id,
      title:lessons[id-1].label,
      subtitle:lessons[id-1].german,
      total:tasks.length,
      correct,
      percent:tasks.length?Math.round(100*correct/tasks.length):0,
      passed:Boolean(progress?.[id]?.passed)
    };
  });
}

export function nextBookExerciseHref(id,saved={}){
  const n=Number(id);
  if(!Number.isInteger(n)||n<1||n>12)throw new RangeError('Invalid lesson');
  const plan=bookLessonPlans[n];
  if(!plan)return '/lessons/'+n+'#lesson-actions';
  const answers=saved?.[n]?.answers||{};
  for(const section of plan.sections){
    const index=section.tasks.findIndex(t=>answers[t.id]?.correct!==true);
    if(index>=0)return lessonExerciseHref(n,section.id,index+1);
  }
  // All complete: allow replay from the first exact authored exercise.
  return lessonExerciseHref(n,plan.sections[0].id,1);
}

export const practiceFilters=Object.freeze([
  {id:'all',label:'همه تمرین‌ها'},
  {id:'daily',label:'روزانه و کلاس'},
  {id:'speaking',label:'گفتار و شنیدن'},
  {id:'words',label:'کلمات و حافظه'},
  {id:'challenge',label:'بازی و آزمون'}
]);

const practiceFilterIds={
  daily:['coach','classNotes','night','srs','workbook'],
  speaking:['speaking','pronunciation','listen','dialogues','classNotes'],
  words:['visualMemory','visual','srs','flash','words','alphabet','verbs'],
  challenge:['pictureGame','builder','numbers','exam','workbook']
};
export function matchesPracticeFilter(id,filter){
  return filter==='all'||(practiceFilterIds[filter]?.includes(id)??false);
}
