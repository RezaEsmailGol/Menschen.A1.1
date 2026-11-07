import {bookLessonPlans} from './bookLessonData.js';

// Shareable exercise links validated against the actual authored book-lesson data.
// question is 1-based in the URL; the UI internally uses 0-based indices.
export function lessonExerciseHref(lessonId,sectionId,question=1){
  const plan=bookLessonPlans[Number(lessonId)];
  const section=plan?.sections.find(x=>x.id===sectionId);
  const index=Number(question);
  if(!section||!Number.isInteger(index)||index<1||index>section.tasks.length)throw new Error('Unknown book exercise');
  return '/lessons/'+Number(lessonId)+'?section='+encodeURIComponent(sectionId)+'&question='+index+'#book-practice';
}
export function lessonModuleHref(lessonId,kind){
  const n=Number(lessonId);
  if(!Number.isInteger(n)||n<1||n>12)throw new Error('Unknown lesson');
  const ids={
    vocabulary:'lesson-vocabulary',grammar:'lesson-grammar',sentence:'lesson-sentences',
    picture:'lesson-picture',review:'lesson-actions',builder:'lesson-actions',exam:'lesson-actions'
  };
  return '/lessons/'+n+'#'+(ids[kind]||'lesson-vocabulary');
}
export function readExerciseTarget(lessonId,search=''){
  const plan=bookLessonPlans[Number(lessonId)];
  if(!plan)return null;
  const params=new URLSearchParams(String(search).replace(/^\?/,''));
  const sectionId=params.get('section');
  const sectionIndex=plan.sections.findIndex(x=>x.id===sectionId);
  if(sectionIndex<0)return null;
  const raw=params.get('question');
  const question=raw===null?1:Number(raw);
  if(!/^[1-9]\d*$/.test(String(raw??'1'))||!Number.isSafeInteger(question)||question>plan.sections[sectionIndex].tasks.length)return null;
  return {sectionIndex,taskIndex:question-1,sectionId,question};
}
