import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpenCheck, Brain, Check, CheckCircle2, ChevronLeft, Headphones, Keyboard, Play, RotateCcw, Sparkles, Target, Trophy, Volume2, X } from 'lucide-react';
import {classSets,classNotesBySet,numberNotes,verbTables,personalPronouns,chooseNotes,isNoteCorrect} from './classNotesData.js';
import {germanNumber} from './learningData.js';
import './classNotes.css';

function detail(item){
 if(item.set==='numbers')return {prompt:'عدد «'+item.n+'» را به آلمانی بنویس.',hint:'املای عدد را دقیق وارد کن؛ به ۱۶ و ۱۷ توجه کن.'};
 if(item.set==='verbs')return {prompt:'فعل «'+item.verb+'» را برای «'+item.pronoun+'» صرف کن.',hint:item.fa+' — فقط شکل فعل را بنویس.'};
 return {prompt:'معادل آلمانی «'+item.fa+'» کدام است؟',hint:'به عبارت کامل و تفاوت خطاب رسمی/دوستانه دقت کن.'};
}
function relativeStatus(item,memory){
 const m=memory?.items?.[item.key];
 if(!m)return {label:'جدید',cls:'new'};
 if(m.mastery>=80&&m.correct>=3&&m.reviewedDays>=2)return {label:'مسلط',cls:'mastered'};
 if(m.lastCorrect===false||m.mastery<55)return {label:'نیاز به تمرین',cls:'weak'};
 if(m.nextAt<=Date.now())return {label:'موعد مرور',cls:'due'};
 return {label:'در حال یادگیری',cls:'learning'};
}
function TaskChoices({question,disabled,onAnswer}){
 return <div className="cnChoices">{question.choices.map((word,i)=><button key={word}
    disabled={disabled} className={disabled?(word===question.de?'rightOption':''):''}
    onClick={()=>onAnswer(word)}><span className="cnOptionIndex">{String.fromCharCode(65+i)}</span><span dir="ltr">{word}</span></button>)}</div>;
}

export default function ClassNotes({speak,memory={},onPracticeEvent=()=>{},setTab}) {
 const [group,setGroup]=useState('numbers');
 const [view,setView]=useState('study');
 const [round,setRound]=useState(null);
 const [at,setAt]=useState(0);
 const [answer,setAnswer]=useState('');
 const [result,setResult]=useState(null);
 const [score,setScore]=useState(0);
 const [audioMode,setAudioMode]=useState(false);
 const [expanded,setExpanded]=useState(null);
 const groupInfo=classSets.find(g=>g.id===group);
 const items=classNotesBySet[group];
 const stats=useMemo(()=>{
   const known=items.filter(i=>relativeStatus(i,memory).cls==='mastered').length;
   const weak=items.filter(i=>['weak','due'].includes(relativeStatus(i,memory).cls)).length;
   return {known,weak};
 },[items,memory]);
 const question=round?.[at];
 const completed=round && at>=round.length;
 function switchGroup(id){setGroup(id);setView('study');setRound(null);setAt(0);setResult(null);setAnswer('');setExpanded(null);}
 function begin(){
   setRound(chooseNotes(items,memory,Math.min(10,items.length)));
   setAt(0);setScore(0);setResult(null);setAnswer('');setView('quiz');
 }
 function judge(choice=answer){
   if(result!==null||!question)return;
   if(!String(choice).trim())return;
   const correct=isNoteCorrect(question,choice);
   setResult(correct);
   if(correct)setScore(s=>s+1);
   onPracticeEvent({id:question.key,kind:question.kind,label:question.set==='verbs'?question.verb+' / '+question.pronoun:question.de,lesson:1,correct});
 }
 function next(){
   setAt(i=>i+1);setAnswer('');setResult(null);
 }
 useEffect(()=>{
   if(view==='quiz' && question && audioMode && question.set==='numbers'){
     // The initial sound is initiated from the quiz start control. Replay button remains available.
     // Other modes do not reveal the answer before a typing challenge.
   }
 },[view,at,question,audioMode]);
 const list=items;
 return <main className="cnRoot">
   <section className="cnHero">
    <div><span className="cnEyebrow"><BookOpenCheck size={16}/> DEUTSCH TRAINER · CLASS NOTES</span>
      <h1>جزوه جدید استاد،<br/><span>این بار به شکل بازی!</span></h1>
      <p>اعداد ۱۳ تا ۲۰، شش فعل مهم، معرفی و ملیت، احوال‌پرسی و واژه‌های واقعی کلاس.</p>
      <div className="cnHeroBadges"><span>۵ موضوع آموزشی</span><span>آزمون‌های تطبیقی</span><span>حافظه پیشرفت</span></div>
    </div>
    <div className="cnHeroArt" aria-hidden="true"><span>Wie geht’s?</span><span>17</span><span>ich bin</span></div>
   </section>

   <div className="cnSectionHead"><div><small>یادگیری جلسه‌های جدید</small><h2>موضوع موردنظرت را انتخاب کن</h2></div>
     <button onClick={()=>setTab('workbook')} className="cnOldLesson">دفتر جلسه اول <ChevronLeft size={15}/></button></div>
   <div className="cnGroups">{classSets.map(c=>{
     const count=classNotesBySet[c.id].length;
     const mastered=classNotesBySet[c.id].filter(t=>relativeStatus(t,memory).cls==='mastered').length;
     return <button key={c.id} onClick={()=>switchGroup(c.id)} className={'cnGroup '+c.accent+(group===c.id?' selected':'')}>
        <span className="cnGroupEmoji">{c.icon}</span><span className="cnGroupCopy"><b>{c.title}</b><small>{count} مورد · {mastered} مسلط</small></span>
        <span className="cnGroupBar"><i style={{width:(mastered/count*100)+'%'}}/></span>
      </button>})}</div>

   <section className="cnPanel">
    <header className="cnPanelHeader">
     <div><span className="cnKicker">{groupInfo.subtitle}</span><h2>{groupInfo.title}</h2><p>{groupInfo.goal}</p></div>
     <div className="cnPanelCounts"><span><b>{stats.known}</b>مسلط</span><span><b>{stats.weak}</b>نیاز به تمرین</span></div>
    </header>
    <div className="cnModeBar">
      <button className={view==='study'?'active':''} onClick={()=>{setView('study');setRound(null)}}><BookOpenCheck size={16}/> یادگیری</button>
      <button className={view==='quiz'?'active':''} onClick={begin}><Target size={16}/> {view==='quiz'?'آزمون تازه':'تمرین تصادفی'}</button>
    </div>

    {view==='study'&&<>
      {group==='numbers' && <div className="cnCallout"><b>دو املای مهم</b><span dir="ltr">16 = <strong>sechzehn</strong> · 17 = <strong>siebzehn</strong></span><small>از sechs حرف s پایانی و از sieben بخش en حذف می‌شود.</small></div>}
      {group==='verbs' && <div className="cnVerbTables">{verbTables.map(v=><article key={v.verb} className="cnVerbTable">
        <div className="cnVerbHead"><div><b dir="ltr">{v.verb}</b><small>{v.fa}</small></div><button onClick={()=>speak(v.verb)} aria-label={'پخش '+v.verb}><Volume2 size={18}/></button></div>
        <div className="cnVerbForms">{personalPronouns.map((p,i)=><button onClick={()=>speak((p==='er/sie/es'?'er':p==='sie/Sie'?'Sie':p)+' '+v.forms[i])} key={p}><span dir="ltr">{p}</span><b dir="ltr">{v.forms[i]}</b><Volume2 size={14}/></button>)}</div>
        <p>{v.tip}</p></article>)}</div>}
      {group==='origin'&&<div className="cnCallout"><b>از کدام کشور؟</b><span dir="ltr">aus dem Iran · aus der Türkei · aus der Schweiz · aus den USA</span><small>حرف تعریف کشورها یکسان نیست. این چهار نمونه را با همان حرف تعریف حفظ کن.</small></div>}
      {group==='greetings'&&<div className="cnCallout"><b>رسمی و دوستانه</b><span dir="ltr">Wie geht es Ihnen? ↔ Wie geht es dir?</span><small>برای جواب می‌توانی بگویی: Mir geht’s gut. Und dir?</small></div>}
      {group==='classroom'&&<div className="cnCallout"><b>دستورهای رایج مدرس</b><span dir="ltr">Hören Sie. · Sprechen Sie. · Kreuzen Sie an.</span><small>کلمه را با تلفظ آلمانی بشنو؛ ترجمه و مثال را با کلیک روی کارت ببین.</small></div>}
      <div className="cnItems">{(group==='verbs'?[]:list).map(item=>{
        const state=relativeStatus(item,memory);
        return <article className={'cnItem '+state.cls} key={item.id}>
         <button className="cnItemMain" onClick={()=>setExpanded(expanded===item.id?null:item.id)}>
           <span><b dir="ltr">{item.de}</b><small>{item.fa}</small></span><span className="cnState">{state.label}</span>
         </button>
         <button className="cnSound" onClick={()=>speak(item.de)} aria-label={'پخش '+item.de}><Volume2 size={19}/></button>
         {expanded===item.id&&<p className="cnTip">{item.tip||'واژه را گوش بده، بلند تکرار کن و سپس آزمون بده.'}</p>}
        </article>})}</div>
      <div className="cnStart"><span><Sparkles size={20}/> {items.length} تمرین در این بخش آماده است</span><button onClick={begin}>آزمون تطبیقی <ArrowLeft size={17}/></button></div>
    </>}

    {view==='quiz'&&round&&(!completed?<div className="cnQuiz" key={question.id}>
      <div className="cnQuizTop"><span>سؤال {at+1} از {round.length}</span><b>{score} امتیاز</b></div>
      <div className="cnProgress"><i style={{width:(at/round.length*100)+'%'}}/></div>
      <div className="cnPrompt">
        <span className="cnQuestionType">{question.set==='numbers'?'ZAHLEN':question.set==='verbs'?'VERBEN':'WORTSCHATZ'}</span>
        {audioMode&&question.set==='numbers'?<>
            <div className="cnAudioIcon"><Headphones size={32}/></div>
            <h3>چه عددی شنیدی؟</h3>
            <button className="cnReplay" onClick={()=>speak(question.de)}><Volume2 size={18}/> پخش عدد</button>
          </>:<>
           <h3>{detail(question).prompt}</h3>
           {question.set==='numbers' && <strong className="cnHugeNumber">{question.n}</strong>}
          </>}
      </div>
      {question.type==='choice'
        ? <TaskChoices question={question} disabled={result!==null} onAnswer={choice=>{setAnswer(choice);judge(choice)}}/>
        : <div className="cnTyping"><input aria-label="پاسخ آلمانی" dir="ltr" autoComplete="off" spellCheck={false}
            value={answer} disabled={result!==null} placeholder="جواب را اینجا بنویس..."
            onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();result!==null?next():judge()}}}/>
           {result===null&&<button disabled={!answer.trim()} onClick={()=>judge()}>بررسی <Check size={17}/></button>}
          </div>}
      {result!==null&&<div className={'cnResult '+(result?'correct':'incorrect')} role="status">
         {result?<CheckCircle2 size={22}/>:<RotateCcw size={22}/>}
         <div><b>{result?'درست بود! +۱۰ XP':'این یکی باید مرور شود.'}</b><span dir="ltr">{question.de}</span><small>{question.tip||'کلمه را دوباره گوش بده و با صدای بلند تکرار کن.'}</small></div>
         <button onClick={()=>speak(question.set==='verbs'?question.pronoun.split('/')[0]+' '+question.de:question.de)} aria-label="تلفظ پاسخ"><Volume2 size={18}/></button>
       </div>}
      <div className="cnQuizActions"><button className="cnQuizExit" onClick={()=>{setView('study');setRound(null)}}>بازگشت به درس</button>
        {result!==null&&<button className="cnNext" onClick={next}>{at===round.length-1?'دیدن نتیجه':'سؤال بعد'} <ArrowLeft size={17}/></button>}</div>
      {question.set==='numbers'&&<label className="cnListenSwitch"><input type="checkbox" checked={audioMode} onChange={e=>setAudioMode(e.target.checked)}/> <Headphones size={16}/> حالت شنیدن و نوشتن</label>}
    </div>:<div className="cnFinished">
       <span>🏆</span><h3>تمرین این بخش تمام شد!</h3><strong dir="ltr">{score} / {round.length}</strong>
       <p>{score>=round.length*.8?'عالی! حالا این آموخته‌ها را در مکالمه استفاده کن.':'اشتباه‌ها در حافظه آموزشی ذخیره شدند و در آزمون‌های بعدی اولویت می‌گیرند.'}</p>
       <div><button onClick={begin}><RotateCcw size={16}/> آزمون تازه</button><button className="cnSoft" onClick={()=>setView('study')}>مرور درس</button></div>
     </div>)}
   </section>
   <div className="cnBottomNote"><Brain size={18}/><p>حافظه واقعی تمرین: پاسخ‌های درست و غلط به تفکیک عدد، فعل یا عبارت ثبت می‌شوند. یک پاسخ درست به‌تنهایی به معنی تسلط کامل نیست؛ با تمرین در روزهای مختلف پیشرفت واقعی ثبت می‌شود.</p></div>
 </main>;
}
