import React,{useEffect,useState} from 'react';
import {ArrowLeft,BookOpen,BriefcaseBusiness,CheckCircle2,ChevronLeft,Headphones,Lightbulb,LockKeyhole,MessageCircle,Mic2,Play,RotateCcw,Send,ShieldCheck,Sparkles,Star,Target,Volume2,WandSparkles,XCircle} from 'lucide-react';
import {getScene,scenes,chooseDialogueAnswer} from './dialogueData.js';
import {activityItemKey} from './learningMemory.js';
import RouteLink from './RouteLink.jsx';
import './dialogues.css';

const STORE='dt_dialogues_v1';
function loadProgress(){try{const data=JSON.parse(localStorage.getItem(STORE)||'{}');return data&&typeof data==='object'?data:{}}catch{return {}}}
const colorFor={classroom:'#cde9f0',station:'#d9e6f6',cafe:'#fff0d7',office:'#e0f1e9',interview:'#e9e8fd'};
function SceneIllustration({sceneId,large=false}){
 const theme=sceneId||'greetings';
 const background=colorFor[({greetings:'classroom',origin:'station',cafe:'cafe',office:'office',interview:'interview'})[theme]]||'#e4edf0';
 const isOffice=theme==='office'||theme==='interview';
 const isCafe=theme==='cafe';
 const isStation=theme==='origin';
 const view=large?'0 0 640 295':'0 0 640 295';
 return <svg viewBox={view} className={'dialogueSceneArt '+(large?'large':'')} role="img" aria-label={'تصویرسازی اختصاصی '+(getScene(theme)?.place||'دو شخصیت آلمانی')}>
  <rect width="640" height="295" rx="23" fill={background}/>
  <circle cx="80" cy="60" r="46" fill="#ffffff66"/><circle cx="560" cy="46" r="28" fill="#ffffff88"/>
  {isStation?<><rect x="65" y="54" width="510" height="15" rx="7" fill="#6790ba"/><rect x="87" y="68" width="14" height="152" fill="#6790ba"/><rect x="548" y="68" width="14" height="152" fill="#6790ba"/><rect x="205" y="77" width="232" height="92" rx="12" fill="#a3c5e2"/><rect x="228" y="95" width="70" height="52" rx="8" fill="#e3f5ff"/><rect x="311" y="95" width="70" height="52" rx="8" fill="#e3f5ff"/><rect x="60" y="208" width="520" height="13" rx="5" fill="#738da5"/></>:
   isCafe?<><rect x="35" y="33" width="570" height="155" rx="17" fill="#fff8ef"/><path d="M70 49 H570" stroke="#edb783" strokeWidth="10"/><rect x="85" y="62" width="125" height="95" rx="9" fill="#d8e8d7"/><rect x="425" y="62" width="125" height="95" rx="9" fill="#d8e8d7"/><path d="M65 236 H575" stroke="#ab805b" strokeWidth="12" strokeLinecap="round"/><rect x="302" y="208" width="42" height="34" rx="6" fill="#f6faff" stroke="#b4b7c0"/><path d="M342 214 q29 0 0 20" stroke="#b4b7c0" strokeWidth="6" fill="none"/></>:
   isOffice?<><rect x="40" y="38" width="560" height="175" rx="18" fill="#f9fcfc"/><rect x="90" y="53" width="120" height="90" rx="7" fill="#d8e9fc"/><path d="M150 53 V143 M90 97 H210" stroke="#b2cbdb" strokeWidth="6"/><rect x="425" y="50" width="125" height="88" rx="7" fill="#e8effc"/><path d="M450 77 H525 M450 98 H507" stroke="#a3adca" strokeWidth="6"/><path d="M100 243 H535" stroke="#b9c8c5" strokeWidth="14" strokeLinecap="round"/><rect x="276" y="212" width="92" height="9" rx="4" fill="#38445d"/><rect x="302" y="166" width="62" height="46" rx="6" fill="#869ba8"/></>:
   <><rect x="50" y="46" width="540" height="155" rx="17" fill="#ffffff8f"/><rect x="93" y="68" width="150" height="111" rx="8" fill="#f6ffff"/><path d="M168 68 V179 M93 123 H243" stroke="#c3dce5" strokeWidth="7"/><rect x="427" y="60" width="109" height="88" rx="8" fill="#cce3d2"/><rect x="463" y="78" width="41" height="53" rx="5" fill="#eef6ee"/></>}
  <ellipse cx="180" cy="149" rx="36" ry="41" fill="#e6ae87"/><path d="M145 146 Q132 100 177 107 Q213 105 215 143 Q188 122 153 143Z" fill="#33384b"/><rect x="170" y="182" width="22" height="24" rx="8" fill="#dca781"/>
  <path d="M124 267 Q122 206 168 199 Q226 189 242 267" fill="#6b91c6"/>
  <circle cx="167" cy="151" r="2.6" fill="#283747"/><circle cx="192" cy="151" r="2.6" fill="#283747"/><path d="M166 166 Q182 176 194 165" stroke="#9d5e55" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  <ellipse cx="459" cy="147" rx="34" ry="41" fill="#d7a784"/><path d="M426 150 Q414 105 455 106 Q490 105 495 145 L482 130 Q462 117 431 144Z" fill="#5c4a45"/><rect x="449" y="184" width="20" height="23" rx="8" fill="#d1a17e"/>
  <path d="M400 268 Q405 204 450 198 Q497 191 520 268" fill={isOffice?'#395776':isCafe?'#a78a5a':'#72b09f'}/>
  <circle cx="447" cy="152" r="2.6" fill="#283747"/><circle cx="470" cy="152" r="2.6" fill="#283747"/><path d="M446 166 Q457 176 472 165" stroke="#995f55" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  <rect x="264" y="61" width="128" height="60" rx="17" fill="#fff" stroke="#bad3d5" strokeWidth="2"/><path d="M286 121 l-12 17 32-17" fill="#fff" stroke="#bad3d5" strokeWidth="2"/>
  <text x="326" y="87" textAnchor="middle" fontSize="23" fontWeight="bold" fill="#235a6d">{isOffice?'Guten Tag!':isStation?'Woher?':isCafe?'Kaffee?':'Hallo!'}</text>
  <text x="326" y="109" textAnchor="middle" fontSize="14" fill="#657c84">{isOffice?'Willkommen!':isStation?'Iran · Wien':isCafe?'Bitte schön!':'Wie geht’s?'}</text>
  <rect x="30" y="270" width="580" height="11" rx="6" fill="#ffffff82"/>
 </svg>;
}

export default function Dialogues({routeScene,setTab,speak,onPracticeEvent,memory}){
 const [selected,setSelected]=useState(()=>routeScene||null);
 const [nodeId,setNodeId]=useState(null);
 const [selectedChoice,setSelectedChoice]=useState(null);
 const [history,setHistory]=useState([]);
 const [progress,setProgress]=useState(loadProgress);
 const [freeText,setFreeText]=useState('');
 const [access,setAccess]=useState('');
 const [status,setStatus]=useState('checking');
 const [aiBusy,setAiBusy]=useState(false);
 const [aiError,setAiError]=useState('');
 const [aiReply,setAiReply]=useState(null);
 const [aiPrompt,setAiPrompt]=useState('');
 const [aiDepth,setAiDepth]=useState(0);
 const [aiHistory,setAiHistory]=useState([]);
 const scene=getScene(routeScene||selected);
 const node=scene?.nodes?.[nodeId||scene.first];
 const outcome=selectedChoice&&scene?chooseDialogueAnswer(scene,nodeId||scene.first,selectedChoice):null;
 const totalCompleted=Object.values(progress).filter(p=>p?.finished).length;

 useEffect(()=>{
   setSelected(routeScene||null);setNodeId(null);setSelectedChoice(null);
   setHistory([]);setAiReply(null);setAiPrompt('');setAiDepth(0);setAiHistory([]);setAiError('');
 },[routeScene]);
 useEffect(()=>{try{localStorage.setItem(STORE,JSON.stringify(progress))}catch{}},[progress]);
 useEffect(()=>{
   let live=true;
   fetch('/api/tutor').then(r=>r.ok?r.json():null)
     .then(data=>{if(live)setStatus(data?.configured?'ready':'offline');})
     .catch(()=>{if(live)setStatus('offline')});
   return()=>{live=false};
 },[]);
 const choose=(choice)=>{
   if(selectedChoice)return;
   setSelectedChoice(choice.id);
   const result=chooseDialogueAnswer(scene,nodeId||scene.first,choice.id);
   onPracticeEvent?.({id:activityItemKey('dialogue',scene.id,nodeId||scene.first),kind:'dialogue',
     lesson:scene.lesson,label:node.de,correct:result.correct});
   if(result.correct)speak(choice.de);
 };
 const continueDialogue=()=>{
   if(!outcome||!selectedChoice)return;
   setHistory(prev=>[...prev,{speaker:node.speaker,prompt:node.de,answer:outcome.userText,correct:outcome.correct}].slice(-10));
   if(outcome.finished){
     setProgress(prev=>({...prev,[scene.id]:{finished:true,at:Date.now(),
       attempts:(prev[scene.id]?.attempts||0)+1}}));
     setNodeId('!complete');
   }else if(outcome.correct){setNodeId(outcome.next)}
   setSelectedChoice(null);setFreeText('');setAiReply(null);setAiPrompt('');setAiDepth(0);setAiHistory([]);
 };
 const startScene=(id)=>setTab('dialogues/'+id);
 const resetScene=()=>{
   setNodeId(null);setSelectedChoice(null);setHistory([]);setAiReply(null);
   setAiPrompt('');setAiDepth(0);setAiHistory([]);setFreeText('');setAiError('');
 };
 const isFinished=nodeId==='!complete';
 const aiQuestion=aiPrompt || node?.de || '';
 const weakTopics=Object.values(memory?.items||{}).filter(x=>x?.mastery<55&&x?.label)
   .slice(0,3).map(x=>String(x.label).slice(0,50));
 async function askTutor(answer){
   if(!scene||!answer?.trim()||aiBusy||status!=='ready'||!access.trim())return;
   if(aiDepth>=4){setAiError('سهمیه تمرین این دور تمام شد؛ برای ادامه، مسیر اصلی مکالمه را تمرین کن.');return}
   setAiBusy(true);setAiError('');
   try{
     const res=await fetch('/api/tutor',{
       method:'POST',headers:{'Content-Type':'application/json','x-tutor-access-code':access},
       body:JSON.stringify({sceneId:scene.id,nodeId:nodeId||scene.first,answer:answer.trim().slice(0,220),
         dynamicPrompt:aiPrompt,history:aiHistory.slice(-4),weakness:weakTopics})
     });
     const data=await res.json().catch(()=>null);
     if(!res.ok||!data?.nextQuestion)throw new Error(
       res.status===401?'کد دسترسی مربی درست نیست.':
       res.status===429?'سهمیه درخواست‌ها موقتاً پر شده؛ یک دقیقه دیگر تلاش کن.':
       res.status===503?'کلید AI Gateway هنوز روی سرور تنظیم نشده است.':
       'پاسخ مربی دریافت نشد؛ از مکالمه آفلاین ادامه بده.'
     );
     onPracticeEvent?.({id:activityItemKey('dialogue',scene.id,'ai',aiQuestion),kind:'dialogue',
       label:aiQuestion,lesson:scene.lesson,correct:data.correct});
     setAiHistory(prev=>[...prev,{prompt:aiQuestion,answer}].slice(-4));
     setAiReply(data);
     setAiPrompt(data.nextQuestion);
     setAiDepth(n=>n+1);
     setFreeText('');
   }catch(error){setAiError(error.message||'خطای ارتباط با مربی.')}
   finally{setAiBusy(false);}
 }
 return <div className="dialoguesPage">
  <header className="dialogueHeader">
   <span className="dialogueEyebrow"><Sparkles size={17}/> PHASE 02 · INTERACTIVE STORIES</span>
   <h1>آلمانی را <em>در مکالمه</em> یاد بگیر!</h1>
   <p>انتخاب تو داستان را تغییر می‌دهد؛ تمرین‌های تصویری با تلفظ، ترجمه و مسیرهای دوستانه و رسمی.</p>
   <div className="dialogueHeaderStats"><span><CheckCircle2 size={16}/>{totalCompleted} سناریو تکمیل‌شده</span><span><ShieldCheck size={16}/> حالت آفلاین همیشه فعال</span></div>
  </header>
  {!scene?<section className="dialogueCatalog">
    <div className="dialogueCatalogHeading"><div><span>EXPLORE STORIES</span><h2>یک موقعیت انتخاب کن</h2></div><small>۵ ماجرای آموزشی</small></div>
    <div className="dialogueCards">{scenes.map(story=><RouteLink to={'dialogues/'+story.id} navigate={setTab} key={story.id} className="dialogueCard">
      <SceneIllustration sceneId={story.id}/>
      <div className="dialogueCardText"><span className="dialogueLevel">{story.level} · Lektion {story.lesson}</span>
       <h3>{story.title}</h3><small dir="ltr">{story.de}</small><p>{story.subtitle}</p>
       <span className="dialogueCardCTA">{progress[story.id]?.finished?'دوباره بازی کن':'شروع مکالمه'} <ArrowLeft size={17}/></span>
      </div>
    </RouteLink>)}</div>
  </section>:
  <section className="dialogueAdventure">
    <div className="dialogueBreadcrumb"><RouteLink to="dialogues" navigate={setTab}>همه سناریوها</RouteLink><ChevronLeft size={15}/><strong>{scene.title}</strong></div>
    <div className="dialogueScenarioHero"><SceneIllustration sceneId={scene.id} large/>
      <div className="dialogueStoryMeta"><span>{scene.emoji} {scene.place}</span><span>{scene.level}</span></div>
    </div>
    {isFinished?<div className="dialogueFinish">
      <div className="dialogueFinishStar"><Star size={43}/></div>
      <h2>این ماجرا را تمام کردی!</h2><p>آفرین! برای تثبیت، یک مسیر دیگر یا یک مکالمه جدید انتخاب کن.</p>
      <div className="dialogueFinishActions"><button onClick={resetScene}><RotateCcw size={18}/> دوباره از ابتدا</button><RouteLink to="dialogues" navigate={setTab}>داستان‌های دیگر <ArrowLeft size={17}/></RouteLink></div>
    </div>:
    <div className="dialogueStage">
      <div className="dialogueStageTop"><div><span className="dialogueAvatar">{scene.character.slice(0,1)}</span><div><strong>{node?.speaker}</strong><small>{scene.intro}</small></div></div>
       <button onClick={()=>speak(node.de)} title="شنیدن جمله"><Volume2 size={19}/> گوش بده</button></div>
      <div className="dialogueNPC"><span dir="ltr">{node.de}</span><small>{node.fa}</small></div>
      <div className="dialogueAnswerTitle"><Target size={17}/> تو چه جوابی می‌دهی؟</div>
      <div className="dialogueChoices">{node.choices.map((opt,i)=>{
        const marked=selectedChoice===opt.id;
        const ok=selectedChoice&&opt.correct;
        return <button disabled={Boolean(selectedChoice)} key={opt.id} onClick={()=>choose(opt)}
          className={(marked?(opt.correct?'correct':'wrong'):'')+(ok?' highlight':'')}>
          <span className="dialogueChoiceNo">{String.fromCharCode(65+i)}</span>
          <span className="dialogueChoiceText"><b dir="ltr">{opt.de}</b><small>{opt.fa}</small></span>
          {marked?(opt.correct?<CheckCircle2 size={21}/>:<XCircle size={21}/>):<ChevronLeft size={16}/>}
        </button>;
      })}</div>
      {outcome&&<div className={'dialogueChoiceFeedback '+(outcome.correct?'good':'bad')} role="status">
       <div><strong>{outcome.correct?'آفرین! این انتخاب مسیر داستان را مشخص کرد.':'این پاسخ مناسب موقعیت نیست.'}</strong><p>{outcome.explanation}</p></div>
       <button onClick={continueDialogue}>{outcome.correct?'ادامه مکالمه':'دوباره تلاش کن'} <ArrowLeft size={17}/></button>
      </div>}
      <div className="dialogueLastTurns">{history.slice(-2).map((h,i)=><div key={i}><span>{h.prompt}</span><strong>{h.answer}</strong></div>)}</div>
    </div>}
    {!isFinished&&<div className="dialogueAICoach">
      <div className="dialogueAIHeading"><div><span className="dialogueAIIcon"><WandSparkles size={24}/></span><span><b>مربی هوش مصنوعی</b><small>تصحیح جمله و ادامه مکالمه با Vercel AI Gateway</small></span></div>
       <span className={'dialogueAIState '+(status==='ready'?'on':'off')}>{status==='checking'?'در حال بررسی':status==='ready'?'قابل فعال‌سازی':'در حال حاضر آفلاین'}</span></div>
      {status==='ready'?<div className="dialogueAIForm">
        <label>کد دسترسی خصوصی مربی
         <input type="password" autoComplete="off" placeholder="کد تعریف‌شده در Vercel" value={access} onChange={e=>setAccess(e.target.value)}/>
        </label>
        <label>پاسخ آزاد خودت را به آلمانی بنویس
         <textarea dir="ltr" rows={2} maxLength={220} placeholder="Ich komme aus dem Iran..." value={freeText} onChange={e=>setFreeText(e.target.value)}/>
        </label>
        <button disabled={!freeText.trim()||!access.trim()||aiBusy||aiDepth>=4} onClick={()=>askTutor(freeText)}><Send size={17}/>{aiBusy?'در حال بررسی…':'بررسی و ادامه با AI'}</button>
      </div>:<p className="dialogueOfflineNote"><LockKeyhole size={18}/> تا تنظیم کلید و کد خصوصی AI Gateway، مکالمه شاخه‌دار بالا کاملاً کار می‌کند و هیچ درخواست پولی ارسال نمی‌شود.</p>}
      {aiError&&<p className="dialogueAIError" role="alert">{aiError}</p>}
      {aiReply&&<div className="dialogueAIResponse">
        <span className="dialogueAIResult">{aiReply.correct?'✓ پاسخ مناسب':'✎ نکته اصلاحی'}</span>
        <p>{aiReply.explanation}</p>
        <b dir="ltr">{aiReply.corrected}</b><small>{aiReply.correctionFa}</small>
        <div className="dialogueAIQuestion"><span><MessageCircle size={18}/> سؤال بعدی مربی</span><strong dir="ltr">{aiReply.nextQuestion}</strong><small>{aiReply.nextQuestionFa}</small>
          <button onClick={()=>speak(aiReply.nextQuestion)}><Volume2 size={16}/> شنیدن سؤال</button></div>
        <div className="dialogueAIOptions">{aiReply.options.map((opt,i)=><button disabled={aiBusy||aiDepth>=4} key={i} onClick={()=>askTutor(opt.de)}><span dir="ltr">{opt.de}</span><small>{opt.fa}</small><ChevronLeft size={16}/></button>)}</div>
        {aiDepth>=4&&<p>چهار نوبت تمرین تکمیل شد؛ برای مدیریت مصرف API به داستان اصلی برگرد.</p>}
      </div>}
      <div className="dialoguePrivacy"><ShieldCheck size={16}/> پاسخ‌های آزاد فقط با انتخاب خودت برای بررسی ارسال می‌شوند؛ سوابق دائمی چت روی سرور ذخیره نمی‌شود.</div>
    </div>}
  </section>}
 </div>;
}
