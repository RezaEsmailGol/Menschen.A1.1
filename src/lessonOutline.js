import {lessons} from './courseData.js';
import {bookLessonPlans} from './bookLessonData.js';
import {pictureModes} from './lessonPictureGameData.js';
import {grammarRuleCount} from './persianGrammarGuides.js';

// One authoritative, testable tree for the course index and its nested sections.
export function lessonOutline(lessonId){
 const id=Number(lessonId);
 const lesson=lessons.find(x=>x.id===id);
 if(!lesson)return null;
 const plan=bookLessonPlans[id];
 const picture=pictureModes[id]||[];
 const tasks=plan?.sections.reduce((n,section)=>n+section.tasks.length,0)||0;
 const sections=plan?.sections.map(section=>({
   id:section.id,title:section.title.replace(/^\d+\.\s*/,''),description:section.caption||'',
   count:section.tasks.length,kind:'practice',available:true,
   exercises:section.tasks.map((task,index)=>({id:task.id,number:index+1,
     title:task.prompt,type:task.type}))
 }))||[];
 const modules=[
   {id:'audio',title:'تمرین شنیداری و تلفظ',description:'پخش صوت با یک دکمه کنار هر تمرین شنیداری؛ همراه با قطعه‌های درس در صورت دسترسی',kind:'audio',available:true,count:plan?.sections.flatMap(x=>x.tasks).filter(x=>x.type==='listen').length||0},
   {id:'vocabulary',title:'واژگان درس',description:lesson.words.length+' کلمه با معنی فارسی و تلفظ',count:lesson.words.length,kind:'vocabulary',available:true},
   {id:'grammar',title:'آموزش فارسی دستور زبان',description:lesson.grammar+' · مثال صوتی و آزمون کوتاه',count:grammarRuleCount(id),kind:'grammar',available:true},
   {id:'sentences',title:'جمله‌های کاربردی',description:lesson.sentences.length+' جمله همراه صدا و ترجمه',count:lesson.sentences.length,kind:'sentence',available:true},
   ...(picture.length?[{id:'picture',title:'بازی تصویری SVG',description:picture.map(m=>m.label).join(' · '),count:picture.length,kind:'picture',available:true}]:[]),
   {id:'review',title:'مرور هوشمند و فلش‌کارت',description:'ثبت حافظه و تمرین مجدد واژه‌های سخت',kind:'review',available:true},
   {id:'builder',title:'جمله‌سازی تعاملی',description:'ساختن جمله با واژه‌های این درس',kind:'builder',available:true},
   {id:'exam',title:'آزمون پایان درس',description:'۱۰ سؤال و ثبت امتیاز',kind:'exam',available:true}
 ];
 return {
   id,title:lesson.label,german:lesson.german,goal:lesson.goal,
   bookAligned:Boolean(plan&&!plan.supplemental),hasExercises:Boolean(plan),supplemental:Boolean(plan?.supplemental),tasks,pages:plan?.pages||null,
   sections,modules,pictureCount:picture.length,
   wordCount:lesson.words.length,sentenceCount:lesson.sentences.length
 };
}
export const courseLessonOutlines=lessons.map(lesson=>lessonOutline(lesson.id));
