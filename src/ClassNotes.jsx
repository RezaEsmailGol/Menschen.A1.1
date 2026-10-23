import React,{useEffect,useMemo,useState} from 'react';
import {ArrowLeft,BookOpenCheck,Brain,Check,CheckCircle2,ChevronLeft,Headphones,Keyboard,RotateCcw,Sparkles,Target,Trophy,Volume2,X} from 'lucide-react';
import {
  classSets,classNotes,classNotesBySet,verbTables,personalPronouns,
  buildClassRound,weakClassNotes,dueClassSummary
} from './classNotesData.js';
import {isNoteCorrect} from './classNotesData.js';
import QuizFocusShell from './QuizFocusShell.jsx';
import './classNotes.css';

const reviewSet={id:'review',title:'مرور نقاط ضعف من',subtitle:'SMART REVIEW · فقط موارد نیازمند مرور',
 icon:'🧠',accent:'purple',goal:'آموخته‌هایی که اشتباه داشتی یا موعد تمرین‌شان رسیده است.'};
const practiceModes=[
 {id:'mixed',label:'ترکیبی',Icon:Target,detail:'سؤال‌های چهارگزینه‌ای و تایپی در کنار هم'},
 {id:'write',label:'فقط تایپ',Icon:Keyboard,detail:'برای تثبیت املا و یادآوری فعال'},
 {id:'listen',label:'شنیداری',Icon:Headphones,detail:'گوش بده و گزینه درست را تشخیص بده؛ فعل‌ها را صرف کن'}
];
function status(item,memory,now){
 const state=memory.items?.[item.key];
 if(!state)return {label:'جدید',cls:'new'};
 if(state.mastery>=80&&state.correct>=3&&state.reviewedDays>=2)return {label:'مسلط',cls:'mastered'};
 if(state.mastery<55||state.lastCorrect===false)return {label:'نیاز به تمرین',cls:'weak'};
 if(state.nextAt<=now)return {label:'موعد مرور',cls:'due'};
 return {label:'در حال یادگیری',cls:'learning'};
}
function questionLabel(item){
 if(item.type==='listen')return 'کدام عبارت یا عدد را می‌شنوی؟';
 if(item.set==='numbers')return 'عدد «'+item.n+'» را به آلمانی بنویس.';
 if(item.set==='verbs')return 'فعل «'+item.verb+'» را برای ضمیر «'+item.pronoun+'» صرف کن.';
 return 'معادل آلمانی «'+item.fa+'» چیست؟';
}
function speakAnswer(item,speak){
 speak(item.set==='verbs'
   ? (item.pronoun==='er/sie/es'?'er':item.pronoun==='sie/Sie'?'Sie':item.pronoun)+' '+item.de
   : item.de);
}
function AnswerChoices({question,answer,judged,onChoose,speak}){
 return <div className="cnChoices">{question.choices.map((word,i)=>
   <button type="button" key={word} disabled={judged!==null}
     className={judged===null?'':word===question.de?'rightOption':word===answer?'wrongOption':''}
     onClick={()=>{speak(word);onChoose(word);}}>
     <span className="cnOptionIndex">{String.fromCharCode(65+i)}</span><span dir="ltr">{word}</span>
     {judged!==null&&word===question.de?<Check size={17}/>:judged!==null&&word===answer?<X size={17}/>:null}
   </button>)}</div>;
}
function LessonCards({group,items,memory,speak,expanded,setExpanded}){
 if(group==='verbs')return <div className="cnVerbTables">{verbTables.map(v=><article key={v.verb} className="cnVerbTable">
   <div className="cnVerbHead"><div><b dir="ltr">{v.verb}</b><small>{v.fa}</small></div>
     <button type="button" onClick={()=>speak(v.verb)} aria-label={'تلفظ '+v.verb}><Volume2 size={18}/></button></div>
   <div className="cnVerbForms">{personalPronouns.map((p,i)=><button type="button" key={p}
     onClick={()=>speak((p==='er/sie/es'?'er':p==='sie/Sie'?'Sie':p)+' '+v.forms[i])}>
       <span dir="ltr">{p}</span><b dir="ltr">{v.forms[i]}</b><Volume2 size={14}/></button>)}</div>
   <p>{v.tip}</p>
 </article>)}</div>;
 return <div className="cnItems">{items.map(item=>{
   const state=status(item,memory,Date.now());
   return <article className={'cnItem '+state.cls} key={item.id}>
     <button type="button" className="cnItemMain" onClick={()=>setExpanded(expanded===item.id?null:item.id)}
       aria-expanded={expanded===item.id}>
       <span><b dir="ltr">{item.de}</b><small>{item.fa}</small></span>
       <span className="cnState">{state.label}</span>
     </button>
     <button type="button" className="cnSound" onClick={()=>speakAnswer(item,speak)} aria-label={'تلفظ '+item.de}><Volume2 size={19}/></button>
     {expanded===item.id&&<p className="cnTip">{item.tip||'با صدای بلند تکرار کن و بعد آزمون بده.'}</p>}
   </article>})}</div>;
}

export default function ClassNotes({speak,memory={},onPracticeEvent=()=>{},setTab}){
 const [group,setGroup]=useState(()=>weakClassNotes(classNotes,memory).length?'review':'numbers');
 const [mode,setMode]=useState('mixed');
 const [view,setView]=useState('study');
 const [round,setRound]=useState(null);
 const [position,setPosition]=useState(0);
 const [input,setInput]=useState('');
 const [judged,setJudged]=useState(null);
 const [score,setScore]=useState(0);
 const [errors,setErrors]=useState([]);
 const [expanded,setExpanded]=useState(null);
 const now=Date.now();
 const weak=useMemo(()=>weakClassNotes(classNotes,memory,now),[memory,now]);
 const items=group==='review'?weak:classNotesBySet[group];
 const groupInfo=group==='review'?reviewSet:classSets.find(x=>x.id===group);
 const summary=dueClassSummary(items,memory,now);
 const globalSummary=dueClassSummary(classNotes,memory,now);
 const question=round?.[position];
 const finished=Boolean(round&&position>=round.length);

 function switchGroup(id){
   setGroup(id);setView('study');setRound(null);setPosition(0);
   setJudged(null);setInput('');setErrors([]);setExpanded(null);
 }
 function start(selectedItems=items){
   if(!selectedItems.length)return;
   setRound(buildClassRound(selectedItems,memory,mode,Math.min(10,selectedItems.length)));
   setPosition(0);setScore(0);setJudged(null);setInput('');setErrors([]);setView('quiz');
 }
 function check(value=input){
   if(judged!==null||!question||!String(value).trim())return;
   const correct=isNoteCorrect(question,value);
   setJudged(correct);
   if(correct)setScore(x=>x+1);
   else setErrors(list=>list.some(x=>x.key===question.key)?list:[...list,question]);
   onPracticeEvent({id:question.key,kind:question.kind,
    label:question.set==='verbs'?question.verb+' / '+question.pronoun:question.de,
    lesson:1,correct});
 }
 function next(){
   setPosition(x=>x+1);setInput('');setJudged(null);
 }
 function close(){
   setView('study');setRound(null);setInput('');setJudged(null);
 }
 function repeatMistakes(){
   if(!errors.length)return;
   start(errors);
 }
 useEffect(()=>{
   if(view!=='quiz'||!question||question.type!=='listen')return;
   speak(question.de);
 },[view,position,question?.id,question?.type,speak]);

 return <main className="cnRoot">
   <section className="cnHero">
    <div><span className="cnEyebrow"><BookOpenCheck size={16}/> DEUTSCH TRAINER · CLASS NOTES</span>
      <h1>جزوه استاد،<br/><span>تمرین هوشمند هر روز</span></h1>
      <p>اعداد ۱۳ تا ۲۰، صرف فعل‌ها، معرفی، احوال‌پرسی و واژه‌های کلاسی؛ همراه با مرور اشتباه‌ها.</p>
      <div className="cnHeroBadges"><span>{classSets.length} موضوع</span>
        <span>{globalSummary.total} نکته و سؤال</span><span>{globalSummary.mastered} مورد مسلط‌شده</span></div>
    </div>
    <div className="cnHeroArt" aria-hidden="true"><span>Wie geht’s?</span><span>17</span><span>ich bin</span></div>
   </section>

   <div className="cnSectionHead"><div><small>برنامه کلاس‌های اخیر</small><h2>از کجا شروع کنیم؟</h2></div>
     <button type="button" onClick={()=>setTab('workbook')} className="cnOldLesson">دفتر جلسه اول <ChevronLeft size={15}/></button></div>
   <div className="cnReviewStrip">
     <span className="cnReviewStripIcon"><Brain size={22}/></span>
     <span><b>حافظه آموزشی تو</b><small>{globalSummary.weak
       ? globalSummary.weak+' مورد موعددار یا نیازمند تمرین دوباره'
       : globalSummary.practiced?'فعلاً سؤال عقب‌مانده‌ای نداری؛ یک درس تازه تمرین کن.':'هنوز تمرین کافی ثبت نشده؛ از یک موضوع شروع کن.'}</small></span>
     <button type="button" onClick={()=>switchGroup('review')} disabled={!globalSummary.weak}>مرور من <ArrowLeft size={15}/></button>
   </div>
   <div className="cnGroups">{classSets.map(c=>{
     const summary=dueClassSummary(classNotesBySet[c.id],memory,now);
     return <button type="button" key={c.id} onClick={()=>switchGroup(c.id)}
       aria-pressed={group===c.id} className={'cnGroup '+c.accent+(group===c.id?' selected':'')}>
        <span className="cnGroupEmoji">{c.icon}</span>
        <span className="cnGroupCopy"><b>{c.title}</b><small>{summary.total} نکته · {summary.mastered} مسلط</small></span>
        <span className="cnGroupBar"><i style={{width:(summary.mastered/summary.total*100)+'%'}}/></span>
      </button>})}</div>

   <section className="cnPanel">
    <header className="cnPanelHeader">
     <div><span className="cnKicker">{groupInfo.subtitle}</span><h2>{groupInfo.title}</h2><p>{groupInfo.goal}</p></div>
     <div className="cnPanelCounts"><span><b>{summary.mastered}</b>مسلط</span>
       <span><b>{summary.weak}</b>نیازمند مرور</span></div>
    </header>
    <div className="cnModeBar">
      <button type="button" className={view==='study'?'active':''} onClick={close}><BookOpenCheck size={16}/> یادگیری</button>
      <button type="button" className={view==='quiz'?'active':''} disabled={!items.length}
        onClick={()=>start()}><Target size={16}/> شروع آزمون</button>
    </div>
    {view==='study'&&<>
      <div className="cnModesTitle">نوع تمرین را انتخاب کن</div>
      <div className="cnPracticeModes">{practiceModes.map(m=><button type="button" key={m.id}
        aria-pressed={mode===m.id} className={mode===m.id?'active':''} onClick={()=>setMode(m.id)}>
         <m.Icon size={18}/><b>{m.label}</b><small>{m.detail}</small></button>)}</div>
      {group==='numbers'&&<div className="cnCallout"><b>املای دو عدد مهم</b>
        <span dir="ltr">16 = <strong>sechzehn</strong> · 17 = <strong>siebzehn</strong></span>
        <small>در sechzehn بخش s و در siebzehn بخش en حذف شده است.</small></div>}
      {group==='origin'&&<div className="cnCallout"><b>کشورها و تفاوت خطاب</b>
        <span dir="ltr">aus dem Iran · aus der Türkei · aus der Schweiz · aus den USA</span>
        <small>Sie برای خطاب رسمی و du برای دوستانه است؛ شکل فعل همراه آن عوض می‌شود.</small></div>}
      {group==='greetings'&&<div className="cnCallout"><b>چطور حال کسی را بپرسی؟</b>
        <span dir="ltr">Wie geht es Ihnen? ↔ Wie geht es dir?</span>
        <small>مثلاً: Mir geht’s gut. Und dir?</small></div>}
      {group==='classroom'&&<div className="cnCallout"><b>دستورهای متداول مدرس</b>
        <span dir="ltr">Hören Sie. · Sprechen Sie. · Kreuzen Sie an.</span>
        <small>روی کارت بزن تا نکته و کاربرد آن را ببینی؛ روی آیکون صدا برای تلفظ بزن.</small></div>}
      {!items.length&&<div className="cnNothing"><CheckCircle2 size={34}/>
         <b>فعلاً مرور عقب‌مانده نداری!</b><p>برای ایجاد سؤال‌های بیشتر از یک درس تمرین کن.</p>
         <button onClick={()=>switchGroup('numbers')}>برو به اعداد</button></div>}
      <LessonCards group={group} items={items} memory={memory} speak={speak} expanded={expanded} setExpanded={setExpanded}/>
      {!!items.length&&<div className="cnStart"><span><Sparkles size={20}/> {items.length} مورد در این مجموعه</span>
         <button type="button" onClick={()=>start()}>آزمون {mode==='write'?'تایپی':mode==='listen'?'شنیداری':'ترکیبی'} <ArrowLeft size={17}/></button></div>}
    </>}
   </section>

   {view==='quiz'&&round&&<QuizFocusShell title={'تمرین '+groupInfo.title} onClose={close} variant="choice">
     {!finished&&question?<section key={question.id} className="cnQuiz cnQuizFocus">
       <div className="cnQuizTop"><span>سؤال {position+1} از {round.length}</span><b>{score} پاسخ درست</b></div>
       <div className="cnProgress"><i style={{width:(position/round.length*100)+'%'}}/></div>
       <div className="cnPrompt">
         <span className="cnQuestionType">{question.set==='numbers'?'ZAHLEN':question.set==='verbs'?'VERBEN':'WORTSCHATZ'}</span>
         <h3>{questionLabel(question)}</h3>
         {question.type==='listen'
           ? <><div className="cnAudioIcon"><Headphones size={32}/></div>
              <button type="button" className="cnReplay" onClick={()=>speak(question.de)}>
                <Volume2 size={18}/> پخش دوباره</button></>
           : question.set==='numbers'?<strong className="cnHugeNumber">{question.n}</strong>:null}
       </div>
       {question.type==='choice'||question.type==='listen'
         ? <AnswerChoices question={question} answer={input} judged={judged} speak={speak}
              onChoose={choice=>{setInput(choice);check(choice)}}/>
         : <div className="cnTyping"><input aria-label="پاسخ آلمانی" dir="ltr" autoComplete="off"
              spellCheck={false} value={input} disabled={judged!==null} placeholder="به آلمانی بنویس..."
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();judged!==null?next():check()}}}/>
             {judged===null&&<button type="button" disabled={!input.trim()} onClick={()=>check()}>
                 بررسی <Check size={17}/></button>}
            </div>}
       {judged!==null&&<div className={'cnResult '+(judged?'correct':'incorrect')} role="status">
          {judged?<CheckCircle2 size={22}/>:<RotateCcw size={22}/>}
          <div><b>{judged?'درست پاسخ دادی!':'نیاز به یک مرور دیگر دارد.'}</b>
            <span dir="ltr">{question.de}</span><small>{question.tip||'پاسخ را بلند تکرار کن تا بهتر در حافظه بماند.'}</small></div>
          <button type="button" onClick={()=>speakAnswer(question,speak)} aria-label="تلفظ پاسخ"><Volume2 size={18}/></button>
        </div>}
       <div className="cnQuizActions">
         <span className="cnExamMode">{mode==='listen'?'شنیداری':mode==='write'?'تایپی':'ترکیبی'}</span>
         {judged!==null&&<button type="button" className="cnNext" onClick={next}>
           {position===round.length-1?'نتیجه آزمون':'سؤال بعد'} <ArrowLeft size={17}/></button>}
       </div>
     </section>
     :<section className="cnFinished cnQuizFocus">
       <span aria-hidden="true">🏆</span><h3>آزمون تمام شد!</h3>
       <strong dir="ltr">{score} / {round.length}</strong>
       <p>{errors.length?errors.length+' مورد نیازمند تمرین شناسایی شد. بهتر است همین‌ها را یک دور دیگر پاسخ بدهی.':'همه پاسخ‌ها درست بودند! فردا دوباره مرور کن تا تسلطت تثبیت شود.'}</p>
       <div><button type="button" onClick={()=>start()}><RotateCcw size={16}/> دور جدید</button>
        {errors.length>0&&<button type="button" onClick={repeatMistakes}><Brain size={16}/> فقط {errors.length} اشتباه</button>}
        <button type="button" className="cnSoft" onClick={close}>برگشت</button></div>
     </section>}
   </QuizFocusShell>}

   <div className="cnBottomNote"><Brain size={18}/>
      <p>حافظه تمرین، وضعیت هر عدد، فعل و عبارت را مستقل ذخیره می‌کند. برای تسلط واقعی باید در روزهای مختلف جواب درست بدهی؛ صرفاً تکرار فوری XP بیشتر به معنای تسلط نیست.</p></div>
 </main>;
}
