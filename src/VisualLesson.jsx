import React,{useMemo,useState} from 'react';
import {ArrowLeft,BookOpen,Check,CheckCircle2,ChevronLeft,Download,Headphones,Image as ImageIcon,Layers,MessageCircle,RotateCcw,Sparkles,Target,Volume2,XCircle} from 'lucide-react';
import data from './visualLessonData.json';
import VisualArt from './VisualArt.jsx';
import {makeVisualQuestions,shuffleItems,visualAnswerId} from './visualLessonUtils.js';
import {playWrongBeep} from './audioFeedback.js';
import RouteLink from './RouteLink.jsx';
import './visualLesson.css';

const categories=data.categories;
const all=data.phrases;
const scripts=data.dialogues;
const labels={study:'تصویری',flash:'فلش‌کارت',quiz:'بازی تصویر',dialog:'گفت‌وگو'};
const icons={study:ImageIcon,flash:Layers,quiz:Target,dialog:MessageCircle};

function DownloadDataset(){
 const save=()=>{
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='deutsch-lesson1-visual.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 return <button className="vDownload" type="button" onClick={save}><Download size={17}/> فایل JSON</button>;
}
function SpeakButton({de,speak,small=false}){
 return <button type="button" className={'vSpeak '+(small?'small':'')}
    aria-label={'شنیدن تلفظ '+de} onClick={()=>speak(de)}><Volume2 size={small?16:20}/><span>تلفظ</span></button>;
}
function Vocabulary({phrases,speak,memory,setMode}){
 const [showAll,setShowAll]=useState(false);
 const items=showAll?phrases:phrases.slice(0,12);
 return <section className="vVocabulary">
  <div className="vSectionHeading"><div><span className="vEyebrow">LOOK · LISTEN · LEARN</span><h2>با تصویر یاد بگیر</h2><p>روی تلفظ بزن؛ کاربرد دوستانه و رسمی جمله را هم ببین.</p></div><span>{phrases.length} عبارت</span></div>
  <div className="vPhraseGrid">{items.map(item=>{
   const mastery=memory.items?.[visualAnswerId(item)];
   return <article className="vPhraseCard" key={item.id}>
    <VisualArt item={item}/>
    <div className="vPhraseInfo">
     <div className="vPhraseMeta"><span>{item.register==='formal'?'رسمی':item.register==='casual'?'دوستانه':'عمومی'}</span>{mastery?.mastery>=80?<b>آموخته‌شده</b>:null}</div>
     <h3 dir="ltr">{item.de}</h3><p>{item.fa}</p>
     <div className="vPhraseBottom"><SpeakButton de={item.de} speak={speak} small/><small>{item.imageIdea}</small></div>
    </div>
   </article>;
  })}</div>
  {phrases.length>12&&<button className="vShowMore" onClick={()=>setShowAll(v=>!v)}>{showAll?'نمایش کمتر':'نمایش همه عبارت‌ها'} <ChevronLeft size={16}/></button>}
  <button className="vSolid wide" onClick={()=>setMode('flash')}><Layers size={17}/> مرور تصویری کلمات <ArrowLeft size={17}/></button>
 </section>;
}
function PictureFlashcards({phrases,memory,speak,onEvent}){
 const priority=useMemo(()=>{
  const due=phrases.filter(p=>{
   const m=memory.items?.[visualAnswerId(p)];
   return m && (m.mastery<55||m.nextAt<=Date.now()||m.lastCorrect===false);
  });
  return [...due,...phrases.filter(p=>!due.some(q=>q.id===p.id))];
 },[phrases,memory]);
 const [idx,setIdx]=useState(0),[reveal,setReveal]=useState(false);
 const current=priority[idx%priority.length];
 if(!current)return null;
 const answer=correct=>{
  onEvent?.({id:visualAnswerId(current),kind:'visual',label:current.de,lesson:1,correct});
  if(correct)speak(current.de);else playWrongBeep();
  setReveal(false);setIdx(n=>n+1);
 };
 return <section className="vFlashView">
  <div className="vSectionHeading"><div><span className="vEyebrow">PICTURE FLASHCARDS</span><h2>تصویر را ببین، جمله را به یاد بیاور</h2></div><span>{idx%priority.length+1} / {priority.length}</span></div>
  <div className="vFlashCard">
   <VisualArt item={current} large/>
   <div className="vFlashMeaning"><span className="vEyebrow">موقعیت: {current.imageIdea}</span><h2>{current.fa}</h2></div>
   {reveal?<div className="vFlashReveal"><h3 dir="ltr">{current.de}</h3><SpeakButton speak={speak} de={current.de}/></div>:
    <button className="vSolid" onClick={()=>setReveal(true)}>نمایش عبارت آلمانی <ChevronLeft size={17}/></button>}
  </div>
  {reveal&&<div className="vRatings">
   <button className="again" onClick={()=>answer(false)}><RotateCcw size={17}/> دوباره تمرین کنم</button>
   <button className="known" onClick={()=>answer(true)}><CheckCircle2 size={17}/> بلدم</button>
  </div>}
  <p className="vLearningNote">هر کارت به حافظه بلندمدت متصل است؛ کارت‌های دشوار زودتر مرور می‌شوند.</p>
 </section>;
}
function PictureQuiz({phrases,memory,speak,onEvent}){
 const [round,setRound]=useState(0);
 const questions=useMemo(()=>makeVisualQuestions(phrases,memory,Math.min(10,phrases.length)),[phrases,round]);
 const [pos,setPos]=useState(0),[picked,setPicked]=useState(null),[score,setScore]=useState(0);
 const current=questions[pos],finished=pos>=questions.length;
 const choose=choice=>{
  if(picked!==null||!current)return;
  const correct=choice.id===current.item.id;
  setPicked(choice.id);
  if(correct){setScore(v=>v+1);speak(current.item.de)}
  else playWrongBeep();
  onEvent?.({id:visualAnswerId(current.item),kind:'visual',label:current.item.de,lesson:1,correct});
 };
 const restart=()=>{setRound(x=>x+1);setPos(0);setPicked(null);setScore(0)};
 if(!questions.length)return <p>در این گروه فعلاً کارت موجود نیست.</p>;
 return <section className="vQuiz">
  {finished?<div className="vQuizFinished">
   <span>🏆</span><h2>دور تصویری تمام شد!</h2><strong>{score} / {questions.length}</strong>
   <p>اشتباه‌ها ذخیره شدند تا در نوبت بعدی دوباره تمرین کنی.</p>
   <button className="vSolid" onClick={restart}><RotateCcw size={18}/> دور تصادفی جدید</button>
  </div>:<>
   <div className="vQuizTop"><b>تصویر و معنی را ببین؛ پاسخ آلمانی را انتخاب کن</b><span>{pos+1} / {questions.length}</span></div>
   <div className="vQuizTrack"><span style={{width:((pos+Number(picked!==null))/questions.length*100)+'%'}}/></div>
   <VisualArt item={current.item} large/>
   <div className="vQuestion"><span>این تصویر کدام عبارت آلمانی را نشان می‌دهد؟</span><h3>{current.item.fa}</h3></div>
   <div className="vQuizChoices" dir="ltr">{current.options.map((opt,i)=>{
    const correct=picked!==null&&opt.id===current.item.id;
    const wrong=picked!==null&&opt.id===picked&&opt.id!==current.item.id;
    return <button type="button" key={opt.id} disabled={picked!==null} onClick={()=>choose(opt)}
      className={correct?'correct':wrong?'wrong':''}>
       <span>{'ABCD'[i]}</span><b>{opt.de}</b>
       {correct?<CheckCircle2 size={18}/>:wrong?<XCircle size={18}/>:null}
      </button>;
   })}</div>
   {picked!==null&&<div className={'vQuizFeedback '+(picked===current.item.id?'correct':'wrong')}>
    <div><b>{picked===current.item.id?'درست گفتی!':'این‌بار اشتباه شد؛ دوباره مرور می‌کنیم.'}</b><span dir="ltr">{current.item.de}</span></div>
    <SpeakButton speak={speak} de={current.item.de} small/>
   </div>}
   <button className="vSolid wide" disabled={picked===null} onClick={()=>{setPos(n=>n+1);setPicked(null)}}>
    {pos+1===questions.length?'مشاهده نتیجه':'سؤال بعدی'} <ArrowLeft size={17}/>
   </button>
  </>}
 </section>;
}
function Dialogues({speak,onEvent,setTab}){
 const [scriptId,setScriptId]=useState(scripts[0].id),[position,setPosition]=useState(0),[selected,setSelected]=useState(null);
 const script=scripts.find(s=>s.id===scriptId)||scripts[0],line=script.turns[position],done=position>=script.turns.length;
 const isLearner=line?.speaker==='Reza';
 const options=useMemo(()=>{
  if(!line||!isLearner)return [];
  const distractors=shuffleItems(all.filter(p=>p.de!==line.de&&p.de.length<85).map(p=>p.de)).slice(0,2);
  return shuffleItems([line.de,...distractors]);
 },[scriptId,position]);
 function pick(option){
  if(selected!==null)return;
  setSelected(option);
  const ok=option===line.de;
  onEvent?.({id:'visual-dialogue:'+script.id+':'+position,kind:'dialogue',lesson:1,label:line.de,correct:ok});
  if(ok)speak(line.de);else playWrongBeep();
 }
 const reset=id=>{setScriptId(id);setPosition(0);setSelected(null)};
 return <section className="vDialogueView">
  <div className="vSectionHeading"><div><span className="vEyebrow">MINI-DIALOGE</span><h2>۱۰ گفت‌وگوی کوتاه مصور</h2><p>به جمله طرف مقابل گوش بده و پاسخ مناسب را انتخاب کن.</p></div></div>
  <div className="vDialogChips">{scripts.map(s=><button className={script.id===scriptId?'active':''} onClick={()=>reset(s.id)} key={s.id}>{s.title}</button>)}</div>
  <div className="vMiniStory">
   <VisualArt item={{id:'story-'+script.id,scene:script.scene,emoji:'💬',imageIdea:script.title}} large/>
   <div className="vStoryHead"><b>{script.title}</b><small>{Math.min(position+1,script.turns.length)} / {script.turns.length}</small></div>
   {done?<div className="vStoryDone"><b>آفرین! این مکالمه را تمام کردی.</b>
    <button onClick={()=>reset(script.id)}><RotateCcw size={17}/> تکرار</button></div>:<>
    <div className={'vBubble '+(isLearner?'self':'other')}>
     <span>{line.speaker}</span>
     {isLearner?<strong>حالا نوبت توست؛ پاسخ درست را انتخاب کن.</strong>:<strong dir="ltr">{line.de}</strong>}
     {!isLearner?<small>{line.fa}</small>:null}
     {!isLearner?<SpeakButton speak={speak} de={line.de} small/>:null}
    </div>
    {isLearner?<div className="vStoryChoices" dir="ltr">{options.map(o=><button key={o} disabled={selected!==null} onClick={()=>pick(o)}
     className={selected!==null?(o===line.de?'correct':selected===o?'wrong':''):''}>{o}</button>)}</div>:null}
    {selected!==null?<div className="vStoryResponse"><b>{selected===line.de?'آفرین!':'پاسخ مناسب این است:'}</b><span dir="ltr">{line.de}</span></div>:null}
    <button className="vSolid wide" disabled={isLearner&&selected===null} onClick={()=>{if(isLearner&&selected!==line.de){setSelected(null);return}setPosition(v=>v+1);setSelected(null)}}>
     {isLearner&&selected!==null&&selected!==line.de?'تلاش دوباره':'ادامه گفتگو'} <ArrowLeft size={17}/>
    </button>
   </>}
  </div>
  <div className="vBranchCTA"><MessageCircle size={22}/><div><b>ماجراجویی چندمسیره می‌خواهی؟</b><p>در ماژول گفت‌وگوها، انتخابت مسیر داستان را تغییر می‌دهد.</p></div>
   <RouteLink to="dialogues" navigate={setTab}>رفتن به داستان‌ها <ChevronLeft size={17}/></RouteLink>
  </div>
 </section>;
}
export default function VisualLesson({speak,memory,onPracticeEvent,setTab}){
 const [mode,setMode]=useState('study'),[category,setCategory]=useState('all');
 const phrases=useMemo(()=>category==='all'?all:all.filter(p=>p.category===category),[category]);
 const switchCategory=id=>setCategory(id);
 const memorized=all.filter(p=>{const s=memory.items?.[visualAnswerId(p)];return s?.mastery>=80&&s?.reviewedDays>=2}).length;
 return <div className="visualLesson">
  <div className="vHero"><span className="vEyebrow">DEUTSCH · LEKTION 01 · BILDER</span>
   <h1>آلمانی را <em>با تصویر</em> به خاطر بسپار</h1>
   <p>۵۰ جمله کاربردی، تصویرهای اختصاصی، تلفظ و ۱۰ گفت‌وگوی کوتاه؛ از سلام تا خداحافظی.</p>
   <div className="vHeroStats"><span>🖼️ ۵۰ تصویر و عبارت</span><span>💬 ۱۰ دیالوگ</span><span>⭐ {memorized} عبارت مسلط</span></div>
  </div>
  <div className="vToolbar"><nav className="vModes" aria-label="شیوه تمرین">{Object.entries(labels).map(([id,text])=>{
   const Icon=icons[id];
   return <button type="button" className={id===mode?'active':''} aria-pressed={mode===id} key={id} onClick={()=>setMode(id)}><Icon size={18}/>{text}</button>;
  })}</nav><DownloadDataset/></div>
  {mode!=='dialog'&&<div className="vCategories"><button className={category==='all'?'active':''} onClick={()=>switchCategory('all')}>همه</button>
   {categories.map(c=><button key={c.id} className={category===c.id?'active':''} onClick={()=>switchCategory(c.id)}>{c.title} <span>{all.filter(p=>p.category===c.id).length}</span></button>)}
  </div>}
  {mode==='study'&&<Vocabulary phrases={phrases} speak={speak} memory={memory} setMode={setMode}/>}
  {mode==='flash'&&<PictureFlashcards key={category} phrases={phrases} speak={speak} memory={memory} onEvent={onPracticeEvent}/>}
  {mode==='quiz'&&<PictureQuiz key={category} phrases={phrases} speak={speak} memory={memory} onEvent={onPracticeEvent}/>}
  {mode==='dialog'&&<Dialogues speak={speak} onEvent={onPracticeEvent} setTab={setTab}/>}
  <p className="vDisclaimer">محتوا و تصویرسازی این بخش تألیفی و مکمل کلاس A1.1 است؛ ترتیب آن معادل صفحات رسمی کتاب ناشر نیست.</p>
 </div>;
}
