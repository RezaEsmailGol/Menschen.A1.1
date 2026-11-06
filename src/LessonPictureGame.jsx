import React,{useState} from 'react';
import {ArrowLeft,CheckCircle2,Eye,Image as ImageIcon,RotateCcw,Volume2,XCircle,GraduationCap,Lightbulb} from 'lucide-react';
import LessonSceneArt from './LessonSceneArt.jsx';
import {pictureCollections,pictureModes,createPictureRound} from './lessonPictureGameData.js';
import './lessonPictureGame.css';

export default function LessonPictureGame({lessonId,speak,onPracticeEvent,memory}){
 const modes=pictureModes[lessonId]||[];
 const gallery=pictureCollections[lessonId]||[];
 const [mode,setMode]=useState(modes[0]?.id||'jobs');
 const [showAll,setShowAll]=useState(false);
 const [active,setActive]=useState(false);
 const [questions,setQuestions]=useState([]);
 const [index,setIndex]=useState(0);
 const [selected,setSelected]=useState(null);
 const [firstCorrect,setFirstCorrect]=useState(0);
 const [attempts,setAttempts]=useState(0);
 const [wrong,setWrong]=useState(0);
 const [reviewWins,setReviewWins]=useState(0);
 const question=questions[index];
 const done=active&&index>=questions.length;
 const right=selected!==null&&selected===question?.answer;
 const total=Math.min(10,gallery.length);
 if(!gallery.length)return null;
 function start(){
   setQuestions(createPictureRound({lesson:lessonId,mode,memory}));
   setIndex(0);setSelected(null);setFirstCorrect(0);setAttempts(0);
   setWrong(0);setReviewWins(0);setActive(true);
 }
 function answer(value){
   if(!question||selected!==null)return;
   const correct=value===question.answer;
   setSelected(value);
   setAttempts(n=>n+1);
   if(correct){
     if(question.retry)setReviewWins(n=>n+1);
     else setFirstCorrect(n=>n+1);
   }else{
     setWrong(n=>n+1);
     if(!question.retry)setQuestions(previous=>[...previous,{...question,retry:true}]);
   }
   onPracticeEvent?.({id:question.id,lesson:lessonId,kind:'visual',label:question.word,correct,grade:correct?'good':'again'});
   try{if(typeof navigator!=='undefined'&&navigator.vibrate)navigator.vibrate(correct?25:[25,35,25]);}catch{}
 }
 function next(){if(selected===null)return;setSelected(null);setIndex(i=>i+1);}
 const displayGallery=showAll?gallery:gallery.slice(0,8);
 return <section className="lpGame" aria-label={'تمرین تصویری درس '+lessonId}>
   <header className="lpHero">
     <div><span className="lpEyebrow"><ImageIcon size={17}/> SVG MEMORY · LEKTION {lessonId}</span>
       <h3>{lessonId===2?'مشاغل با تصویر و معرفی آدم‌ها':lessonId===4?'مبلمان، جنسیت اسم و ضمایر':'اشیا؛ ein/eine و kein/keine'}</h3>
       <p>تصویر را بشناس، صدای آلمانی را گوش بده و جمله درست را انتخاب کن. پاسخ‌های اشتباه دوباره برمی‌گردند.</p></div>
     <span className="lpCount"><b>{gallery.length}</b> تصویر مستقل</span>
   </header>
   {!active&&<>
     <div className="lpModeRow" role="group" aria-label="انتخاب نوع تمرین">
       {modes.map(m=><button type="button" key={m.id} aria-pressed={mode===m.id}
         onClick={()=>setMode(m.id)} className={mode===m.id?'active':''}>{m.label}</button>)}
     </div>
     <div className="lpGallery">
       {displayGallery.map(entry=><button type="button" key={entry.word} className="lpGalleryCard" onClick={()=>speak(entry.word)}>
         <LessonSceneArt word={entry.word} size={160}/>
         <strong lang="de" dir="ltr">{entry.word}</strong><small>{entry.fa}</small><span><Volume2 size={15}/> شنیدن</span>
       </button>)}
     </div>
     {gallery.length>8&&<button type="button" className="lpMore" onClick={()=>setShowAll(v=>!v)}>
       <Eye size={17}/> {showAll?'نمایش کمتر':'نمایش همه '+gallery.length+' تصویر'}</button>}
     <button className="lpStart" type="button" onClick={start}><GraduationCap size={20}/> شروع آزمون تصویری {total} سؤالی <ArrowLeft size={17}/></button>
   </>}
   {active&&!done&&question&&<div className="lpPlay" key={question.id+'-'+index}>
      <div className="lpQuestionHead"><b>{index+1} / {questions.length}</b>
       <span>{firstCorrect} پاسخ صحیح اولیه</span>{question.retry&&<em>مرور اشتباه</em>}</div>
      <div className="lpTrack"><span style={{width:Math.min(100,100*(index+1)/questions.length)+'%'}}/></div>
      <div className="lpQuestionView">
        <div className="lpArt"><LessonSceneArt word={question.word} size={270} showArticle={false}/></div>
        <div className="lpPrompt"><small>تصویر آموزشی</small><h4>{question.prompt}</h4>
          <p>{question.fa}</p><button type="button" onClick={()=>speak(question.word)}><Volume2 size={19}/> شنیدن واژه</button></div>
      </div>
      <div className="lpChoices" role="group" aria-label="گزینه‌های پاسخ">
        {question.options.map((option,i)=><button key={option} type="button" onClick={()=>answer(option)} disabled={selected!==null}
          className={selected!==null&&option===question.answer?'right':selected===option?'wrong':''}>
          <span className="lpLetter">{'ABCD'[i]}</span><b dir="ltr" lang="de">{option}</b>
          {selected!==null&&option===question.answer&&<CheckCircle2 size={18}/>}
          {selected===option&&!right&&<XCircle size={18}/>}
        </button>)}
      </div>
      {selected!==null&&<div role="status" className={'lpFeedback '+(right?'correct':'incorrect')}>
        {right?<CheckCircle2 size={20}/>:<XCircle size={20}/>}
        <div><strong>{right?'آفرین، درست بود!':'این بار درست نبود؛ دوباره مرور می‌شود.'}</strong>
          <b lang="de" dir="ltr">{question.answer}</b><p><Lightbulb size={14}/> {question.why}</p></div>
        <button type="button" onClick={()=>speak(question.audio)} aria-label="شنیدن پاسخ درست"><Volume2 size={19}/></button>
      </div>}
      <button type="button" className="lpNext" disabled={selected===null} onClick={next}>
        {index===questions.length-1?'دیدن نتیجه':'سؤال بعدی'} <ArrowLeft size={17}/></button>
   </div>}
   {done&&<div className="lpFinish" role="status"><CheckCircle2 size={43}/>
       <h4>مرحله تصویری تمام شد</h4><strong>{firstCorrect} / {total}</strong>
       <p>{attempts} پاسخ ثبت شد؛ {wrong} اشتباه و {reviewWins} مرور صحیح. تسلط با تمرین در چند روز تثبیت می‌شود.</p>
       <div><button type="button" onClick={start}><RotateCcw size={17}/> دور جدید</button>
         <button type="button" onClick={()=>setActive(false)}>انتخاب حالت / دیدن تصاویر</button></div>
   </div>}
 </section>;
}
