import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, AudioLines, BookOpen, BookOpenCheck, Check, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, Ear, GraduationCap, Headphones, Keyboard, Lightbulb, PencilLine, Play, RotateCcw, Sparkles, Star, Trophy, Volume2, X } from 'lucide-react';
import { activityItemKey, chooseAdaptiveNumbers } from './learningMemory.js';
import {
  workbookSections,workbookAlphabet,workbookSounds,workbookNumbers,workbookPronouns,
  workbookDialog,workbookFillSentences,cleanWorkbookAnswer,shuffleWorkbook,makeWorkbookExam
} from './teacherLessonData.js';
import RouteLink from './RouteLink';
import './teacherWorkbook.css';

const STORE_KEY='dt_teacher_workbook_v1';
const PAGE_KEY='dt_teacher_workbook_page_v1';
function loadState(){
  try {
    const data=JSON.parse(localStorage.getItem(STORE_KEY)||'null');
    return data?.version===1&&data.pages&&typeof data.pages==='object' ? data : {version:1,pages:{},best:0,attempts:0};
  }catch{return {version:1,pages:{},best:0,attempts:0};}
}
function progressPercent(state){
  return Math.round(Object.keys(state.pages||{}).filter(id=>state.pages[id]?.passed).length/workbookSections.length*100);
}

function BookScene({speak}){
  return <div className="wbScene">
    <svg className="wbIllustration" role="img" aria-label="تصویرسازی اختصاصی دو زبان‌آموز که یکدیگر را به آلمانی معرفی می‌کنند" viewBox="0 0 540 205">
      <defs><linearGradient id="wbDesk" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c8e5da"/><stop offset="1" stopColor="#a6d9c7"/></linearGradient></defs>
      <rect x="12" y="15" rx="18" width="516" height="177" fill="#f1f8f4"/>
      <circle cx="70" cy="46" r="18" fill="#e2edfa"/><circle cx="464" cy="160" r="21" fill="#fbe5d8"/>
      <rect x="43" y="170" rx="9" width="450" height="15" fill="url(#wbDesk)"/>
      <path d="M108 167 Q94 116 144 105 Q191 97 208 165Z" fill="#6d8dc0"/>
      <path d="M343 167 Q341 115 385 106 Q423 106 447 165Z" fill="#deac73"/>
      <rect x="139" y="93" width="21" height="28" rx="8" fill="#dcae8a"/>
      <rect x="383" y="92" width="21" height="28" rx="8" fill="#cb9771"/>
      <ellipse cx="148" cy="69" rx="35" ry="41" fill="#efc19a"/>
      <path d="M113 69 Q104 22 151 27 Q179 27 184 62 L173 57 Q158 47 139 52 L120 71Z" fill="#302e40"/>
      <path d="M375 47 Q396 21 424 52 Q429 65 417 91 L407 56Z" fill="#4e4540"/>
      <ellipse cx="392" cy="71" rx="33" ry="40" fill="#ddb18b"/>
      <path d="M360 70 Q350 20 393 29 Q414 29 426 52 L416 71 Q404 42 387 47 Q372 49 360 70Z" fill="#454044"/>
      <circle cx="137" cy="69" r="2.4" fill="#283448"/><circle cx="160" cy="69" r="2.4" fill="#283448"/>
      <path d="M138 84 Q147 92 158 82" stroke="#935b50" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="381" cy="69" r="2.4" fill="#283448"/><circle cx="402" cy="69" r="2.4" fill="#283448"/>
      <path d="M379 83 Q391 92 403 82" stroke="#935b50" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <rect x="200" y="25" width="140" height="61" rx="15" fill="white" stroke="#cbdde0" strokeWidth="2"/>
      <path d="M250 86 L244 100 L270 86" fill="white" stroke="#cbdde0" strokeWidth="2"/>
      <text x="270" y="50" textAnchor="middle" fontSize="18" fill="#2b5e70" fontWeight="bold">Hallo!</text>
      <text x="270" y="69" textAnchor="middle" fontSize="12" fill="#697789">Wie heißt du?</text>
      <path d="M210 136 q57 -29 117 0" fill="none" stroke="#c6dad6" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 7"/>
    </svg>
    <div className="wbSceneCaption"><span>Hören · Sprechen</span><button onClick={()=>speak('Hallo! Wie heißt du? Ich heiße Reza.')}><Volume2 size={18}/> شنیدن گفت‌وگو</button></div>
  </div>;
}

function ExamRunner({questions,onEvent,onEnd,speak,label='چالش این بخش',className='',passThreshold=.7}) {
  const [position,setPosition]=useState(0);
  const [answer,setAnswer]=useState(null);
  const [score,setScore]=useState(0);
  const [showFinished,setShowFinished]=useState(false);
  const [text,setText]=useState('');
  const [selected,setSelected]=useState([]);
  const [round,setRound]=useState(0);
  const [currentQuestions,setCurrentQuestions]=useState(questions);
  const current=currentQuestions[position];
  const tiles=useMemo(()=>current?.type==='arrange'
    ?shuffleWorkbook(current.answer.split(' ').map((word,id)=>({word,id})))
    : [],[current,round]);
  const composed=selected.map(id=>tiles.find(x=>x.id===id)?.word).filter(Boolean).join(' ');
  const finished=showFinished;
  function judge(value){
    if(answer!==null||!current)return;
    const correct=cleanWorkbookAnswer(value)===cleanWorkbookAnswer(current.answer);
    setAnswer(correct);
    if(correct)setScore(n=>n+1);
    const key=current.kind==='number' ? activityItemKey('number',current.label)
      : current.kind==='grammar' ? activityItemKey('grammar',current.verb||'kommen',current.pronoun||current.label)
      : current.kind==='pronunciation' ? activityItemKey('pronunciation',current.rule||current.id.replace('sound:',''))
      : activityItemKey(current.kind||'sentence',current.id);
    onEvent?.({id:key,kind:current.kind||'sentence',label:current.label||current.answer,lesson:1,correct});
  }
  function next(){
    if(position===currentQuestions.length-1){setShowFinished(true);onEnd?.(score,currentQuestions.length);}
    else {setPosition(n=>n+1);setAnswer(null);setText('');setSelected([]);setRound(n=>n+1);}
  }
  function restart(){
    setCurrentQuestions(shuffleWorkbook(questions));setPosition(0);setAnswer(null);setScore(0);setText('');setSelected([]);setShowFinished(false);setRound(n=>n+1);
  }
  if(!currentQuestions.length)return <p>برای این بخش هنوز سؤالی تعریف نشده است.</p>;
  return <div className={'wbExamRunner '+className}>
    {finished?<div className="wbResult">
      <div className="wbResultIcon"><Trophy size={35}/></div>
      <h3>{score/currentQuestions.length>=passThreshold?'آفرین، تمرین این بخش را انجام دادی!':'دوباره تمرین کن؛ هر بار بهتر می‌شوی.'}</h3>
      <strong dir="ltr">{score} / {currentQuestions.length}</strong>
      <p>هدف این تمرین: {Math.round(passThreshold*100)}٪ پاسخ درست یا بیشتر. سؤال‌های اشتباه وارد حافظه یادگیری می‌شوند.</p>
      <button className="wbPrimary" onClick={restart}><RotateCcw size={17}/> یک دور دیگر</button>
    </div>:<>
      <div className="wbQuizTop"><span>{label}</span><b>{position+1} / {currentQuestions.length}</b></div>
      <div className="wbQuizProgress"><span style={{width:((position+Number(answer!==null))/currentQuestions.length*100)+'%'}}/></div>
      <div className="wbPrompt">
        <span className="wbTaskType">{current.kind==='number'?'ZAHLEN':current.kind==='grammar'?'GRAMMATIK':current.kind==='pronunciation'?'HÖREN':'SCHREIBEN'}</span>
        <h3>{current.question}</h3>
        {current.audio && <button className="wbSoundButton" onClick={()=>speak(current.audio)}><Volume2 size={18}/> گوش بده</button>}
      </div>
      {current.type==='choice'
        ?<div className="wbChoices">{current.choices.map(choice=><button key={choice} disabled={answer!==null}
          className={answer===null?'':choice===current.answer?'right':choice===text?'wrong':''}
          onClick={()=>{setText(choice);judge(choice)}} dir="auto">{choice}</button>)}</div>
        :current.type==='arrange'
          ?<><div className="wbSentenceOutput" dir="ltr">{composed||'… جمله را اینجا بساز'}</div>
            <div className="wbWordTiles" dir="ltr">{tiles.map(tile=><button key={tile.id} disabled={selected.includes(tile.id)||answer!==null}
              onClick={()=>setSelected(ids=>[...ids,tile.id])}>{tile.word}</button>)}</div>
            <div className="wbQuizActions"><button className="wbGhost" disabled={answer!==null||selected.length===0} onClick={()=>setSelected(ids=>ids.slice(0,-1))}>حذف آخرین کلمه</button>
              <button className="wbPrimary" disabled={answer!==null||selected.length===0} onClick={()=>judge(composed)}>بررسی جمله</button></div></>
          :<div className="wbInputRow"><input value={text} dir="ltr" autoComplete="off" spellCheck={false} disabled={answer!==null}
              onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&text.trim()&&answer===null)judge(text)}}
              placeholder="Antwort hier schreiben…"/><button className="wbPrimary" disabled={answer!==null||!text.trim()} onClick={()=>judge(text)}>بررسی</button></div>}
      {answer!==null && <div className={'wbResponse '+(answer?'ok':'bad')}>
        {answer?<CheckCircle2 size={21}/>:<X size={21}/>}
        <div><b>{answer?'درست بود!':'یک بار دیگر این کلمه را مرور کن.'}</b><span dir="ltr">{current.answer}</span></div>
        <button onClick={()=>speak(current.audio||current.answer)} title="شنیدن پاسخ"><Volume2 size={17}/></button>
      </div>}
      {answer!==null&&<button className="wbNextQuestion" onClick={next}>{position===currentQuestions.length-1?'دیدن نتیجه':'سؤال بعدی'} <ArrowLeft size={18}/></button>}
    </>}
  </div>;
}

function IntroPage({speak,goNext,onComplete}) {
  return <div className="wbContent">
    <div className="wbChapterTitle"><span>01 · EINSTIEG</span><h2>Hallo! سلام!</h2><p>با یک گفت‌وگوی کوچک، تمرین امروز را شروع کنیم.</p></div>
    <BookScene speak={speak}/>
    <div className="wbExerciseHead"><span className="wbExerciseNum">1</span><div><b>Hör zu und sprich nach.</b><p>گوش کن و با صدای بلند تکرار کن.</p></div><Headphones size={22}/></div>
    <div className="wbDialogCards">
      {workbookDialog.slice(0,4).map(line=><button onClick={()=>speak(line.de)} key={line.id}>
        <span className="wbSpeaker">{line.speaker}</span>
        <span><b dir="ltr">{line.de}</b><small>{line.fa}</small></span><Volume2 size={18}/>
      </button>)}
    </div>
    <div className="wbTip"><Lightbulb size={20}/><span>این‌ها تمرین اختصاصی بر اساس مباحث کلاس هستند. لازم نیست همه کلمات را همین امروز حفظ کنی.</span></div>
    <button className="wbPrimary wbWide" onClick={()=>{onComplete('start',true);goNext()}}>آماده‌ام؛ برو سراغ الفبا <ArrowLeft size={18}/></button>
  </div>;
}

function AlphabetPage({speak,memory,onEvent,onComplete}) {
  const [letter,setLetter]=useState(null);
  const [showQuiz,setShowQuiz]=useState(false);
  const selected=workbookAlphabet.find(x=>x.letter===letter);
  const quiz=useMemo(()=>{
    const alphabet=workbookAlphabet.filter(x=>x.letter!=='ß');
    return shuffleWorkbook(alphabet).slice(0,5).map(x=>({
      id:'letter:'+x.letter,type:'choice',kind:'pronunciation',
      question:'کدام حرف را می‌شنوی؟',answer:x.letter,audio:x.letter,label:'حرف '+x.letter,
      choices:shuffleWorkbook([x.letter,...shuffleWorkbook(alphabet.filter(y=>y.letter!==x.letter)).slice(0,3).map(y=>y.letter)])
    }));
  },[]);
  return <div className="wbContent">
    <div className="wbChapterTitle"><span>02 · ALPHABET</span><h2>Das Alphabet</h2><p>۲۶ حرف اصلی، به‌علاوه Ä Ö Ü و ß؛ هر حرف را لمس کن.</p></div>
    <div className="wbExerciseHead"><span className="wbExerciseNum">2</span><div><b>Hör zu: A, B, C …</b><p>حرف را انتخاب کن، اسم آلمانی‌اش را بشنو و نمونه‌اش را یاد بگیر.</p></div><Ear size={22}/></div>
    <div className="wbLetterGrid" dir="ltr">
      {workbookAlphabet.map(item=><button key={item.letter} className={item.letter===letter?'active':''}
        onClick={()=>{setLetter(item.letter);speak(item.letter)}}>{item.letter}</button>)}
    </div>
    <div className="wbLetterDetail" aria-live="polite">
      {selected ? <><div className="wbBigLetter" dir="ltr">{selected.letter}</div><div><strong dir="ltr">{selected.word}</strong><span>{selected.translation}</span><button onClick={()=>speak(selected.word)}><Volume2 size={17}/> نمونه را بشنو</button></div></>
        :<><div className="wbBigLetter">A</div><div><b>روی یکی از حروف بزن</b><span>تلفظ حرف و کلمه نمونه نمایش داده می‌شود.</span></div></>}
    </div>
    <div className="wbTip"><Lightbulb size={18}/> نکته: ß نامش <b dir="ltr">Eszett</b> است و در نوشتار کاربرد خاص دارد؛ Ä، Ö و Ü صدای واژه را تغییر می‌دهند.</div>
    <button className="wbSecondary wbWide" onClick={()=>setShowQuiz(v=>!v)}><PencilLine size={17}/>{showQuiz?'بستن تمرین':'تمرین تشخیص حروف'}</button>
    {showQuiz&&<ExamRunner questions={quiz} speak={speak} onEvent={onEvent} label="تمرین الفبا" onEnd={(score,total)=>onComplete('alphabet',score/total>=.7)}/>}
  </div>;
}

function SoundsPage({speak,onEvent,onComplete}) {
  const [filter,setFilter]=useState('همه');
  const [expanded,setExpanded]=useState('ch');
  const [showQuiz,setShowQuiz]=useState(false);
  const groups=['همه','صامت‌ها','واکه‌ها','استثنا','گرامر'];
  const quiz=useMemo(()=>shuffleWorkbook([
    {id:'ch',type:'choice',kind:'pronunciation',rule:'ch',label:'ch (ich)',question:'کلمه‌ای که شنیدی کدام است؟',answer:'ich',audio:'ich',choices:['ich','Dach','Bach','Buch']},
    {id:'v',type:'choice',kind:'pronunciation',rule:'v',label:'v (Vater)',question:'کلمه‌ای که شنیدی کدام است؟',answer:'Vater',audio:'Vater',choices:['Vater','Verb','Video','Vase']},
    {id:'ei',type:'choice',kind:'pronunciation',rule:'ei',label:'ei (mein)',question:'کلمه‌ای که شنیدی کدام است؟',answer:'mein',audio:'mein',choices:['mein','Liebe','sieben','Milch']},
    {id:'st',type:'choice',kind:'pronunciation',rule:'st',label:'st (Stadt)',question:'کلمه‌ای که شنیدی کدام است؟',answer:'Stadt',audio:'Stadt',choices:['Stadt','Sport','Sonne','Zeit']},
    {id:'z',type:'choice',kind:'pronunciation',rule:'z',label:'z (Zeit)',question:'کلمه‌ای که شنیدی کدام است؟',answer:'Zeit',audio:'Zeit',choices:['Zeit','Sonne','Vater','sehen']},
  ]).map(q=>({...q,choices:shuffleWorkbook(q.choices)})),[]);
  return <div className="wbContent">
    <div className="wbChapterTitle"><span>03 · AUSSPRACHE</span><h2>بشنو، مقایسه کن</h2><p>قوانین تلفظ و استثناهایی که استاد در جزوه یاد داده است.</p></div>
    <div className="wbExerciseHead"><span className="wbExerciseNum">3</span><div><b>Hör den Unterschied!</b><p>روی واژه‌ها بزن و تفاوت صدای آن‌ها را گوش بده.</p></div><AudioLines size={22}/></div>
    <div className="wbFilter">{groups.map(group=><button key={group} className={filter===group?'active':''} onClick={()=>setFilter(group)}>{group}</button>)}</div>
    <div className="wbSoundGrid">
      {workbookSounds.filter(x=>filter==='همه'||x.rule===filter).map(rule=><article key={rule.id} className={'wbSoundCard '+(expanded===rule.id?'open':'')}>
        <div className="wbSoundTop"><span className="wbSoundSymbol" dir="ltr">{rule.cluster}</span><div><small>{rule.rule}</small><b>{rule.phonetic}</b></div></div>
        <div className="wbWordCompare"><button onClick={()=>speak(rule.word)}><Volume2 size={17}/><span dir="ltr">{rule.word}</span></button><span>↔</span><button onClick={()=>speak(rule.contrast)}><Volume2 size={17}/><span dir="ltr">{rule.contrast}</span></button></div>
        <button className="wbShowRule" onClick={()=>setExpanded(expanded===rule.id?null:rule.id)}>{expanded===rule.id?'بستن توضیح':'دیدن قانون'} <ChevronLeft size={14}/></button>
        {expanded===rule.id &&<p>{rule.note}</p>}
      </article>)}
    </div>
    <button className="wbSecondary wbWide" onClick={()=>setShowQuiz(v=>!v)}><Headphones size={17}/>{showQuiz?'بستن آزمون':'آزمون تشخیص صدا'}</button>
    {showQuiz&&<ExamRunner questions={quiz} speak={speak} onEvent={onEvent} label="تشخیص تلفظ" onEnd={(score,total)=>onComplete('sounds',score/total>=.7)}/>}
  </div>;
}

function NumbersPage({speak,memory,onEvent,onComplete}) {
  const [showQuiz,setShowQuiz]=useState(false);
  const questions=useMemo(()=>chooseAdaptiveNumbers(12,memory,8).map((n,i)=>({
    id:'number:'+n,type:'type',kind:'number',label:String(n),
    question:i%2===0?'عدد '+n+' را به آلمانی بنویس.':'گوش بده و واژه آلمانی عدد را بنویس.',
    answer:workbookNumbers[n].word,audio:workbookNumbers[n].word
  })),[]);
  return <div className="wbContent">
    <div className="wbChapterTitle"><span>04 · ZAHLEN</span><h2>Null bis zwölf</h2><p>اعداد ۰ تا ۱۲ را یاد بگیر؛ هر عدد را لمس کن و تکرار کن.</p></div>
    <div className="wbExerciseHead"><span className="wbExerciseNum">4</span><div><b>Hör zu und zähl!</b><p>بشنو، بشمار و عدد را به آلمانی بنویس.</p></div><Headphones size={22}/></div>
    <div className="wbNumberGrid" dir="ltr">
      {workbookNumbers.map(n=><button key={n.number} onClick={()=>speak(n.word)}>
        <strong>{n.number}</strong><span>{n.word}</span><Volume2 size={16}/></button>)}
    </div>
    <div className="wbTip"><Lightbulb size={19}/> یادآوری: <b dir="ltr">eins</b> برای عدد ۱ است؛ <b dir="ltr">sechs</b> مثل «زِکس» و <b dir="ltr">zwölf</b> دارای حرف ö است.</div>
    <button className="wbSecondary wbWide" onClick={()=>setShowQuiz(v=>!v)}><PencilLine size={17}/>{showQuiz?'بستن آزمون اعداد':'شروع دیکته تصادفی ۸ عدد'}</button>
    {showQuiz&&<ExamRunner questions={questions} onEvent={onEvent} onEnd={(score,total)=>onComplete('numbers',score/total>=.7)} speak={speak} label="دیکته عدد"/>}
  </div>;
}

function VerbsPage({speak,onEvent,onComplete}) {
  const [target,setTarget]=useState('kommen');
  const [showQuiz,setShowQuiz]=useState(false);
  const conjugation=useMemo(()=>shuffleWorkbook(workbookPronouns).map(p=>({
    id:'verb:'+target+':'+p.person,type:'type',kind:'grammar',verb:target,
    pronoun:p.person==='er / sie / es'?'er/sie/es':p.person==='sie / Sie'?'sie/Sie':p.person,
    question:'فعل '+target+' را برای «'+p.person+'» صرف کن.',
    answer:p[target],audio:p.person.split(' / ')[0]+' '+p[target],label:target+' / '+p.person
  })),[target]);
  return <div className="wbContent">
    <div className="wbChapterTitle"><span>05 · GRAMMATIK</span><h2>Ich komme. Du kommst.</h2><p>با ضمایر شخصی آشنا شو و فعل را در زمان حال صرف کن.</p></div>
    <div className="wbExerciseHead"><span className="wbExerciseNum">5</span><div><b>Wer? Ich, du, er …</b><p>ضمیرها را ببین، سپس فعل‌ها را با آن‌ها بخوان.</p></div><BookOpen size={22}/></div>
    <div className="wbPronounGrid">{workbookPronouns.map(p=><div key={p.person}><b dir="ltr">{p.person}</b><span>{p.fa}</span></div>)}</div>
    <div className="wbVerbTabs">{['kommen','sammeln'].map(verb=><button className={target===verb?'active':''} key={verb} onClick={()=>{setTarget(verb);setShowQuiz(false)}}>{verb}</button>)}</div>
    <div className="wbVerbTable">
      <div className="wbTableHead"><span>ضمیر</span><span>صرف فعل</span><span>پایان فعل</span><span>صدا</span></div>
      {workbookPronouns.map(p=><div key={p.person} className="wbVerbRow">
        <span dir="ltr">{p.person}</span><b dir="ltr">{p[target]}</b><strong dir="ltr">{p.ending}</strong>
        <button onClick={()=>speak(p.person.split(' / ')[0]+' '+p[target])}><Volume2 size={17}/></button></div>)}
    </div>
    <div className="wbTip"><Lightbulb size={19}/><div><b>نکته مهم مصدر</b><p><span dir="ltr">kommen</span> با <b dir="ltr">-en</b> و <span dir="ltr">sammeln</span> با <b dir="ltr">-n</b> تمام می‌شوند. در «ich sammle» شکل خاص کوتاه‌شده را می‌بینی.</p></div></div>
    <button className="wbSecondary wbWide" onClick={()=>setShowQuiz(v=>!v)}><Keyboard size={17}/>{showQuiz?'بستن تمرین':'تمرین تایپی صرف '+target}</button>
    {showQuiz&&<ExamRunner key={target} questions={conjugation} onEvent={onEvent} onEnd={(score,total)=>onComplete('verbs',score/total>=.7)} speak={speak} label="صرف فعل"/>}
  </div>;
}

function DialogPage({speak,onEvent,onComplete}) {
  const [showQuiz,setShowQuiz]=useState(false);
  const questions=useMemo(()=>shuffleWorkbook(workbookFillSentences).map(item=>({
    id:'sentence:'+item.id,type:'arrange',kind:'sentence',label:item.sentence,
    question:item.fa,answer:item.sentence,audio:item.sentence
  })),[]);
  return <div className="wbContent">
    <div className="wbChapterTitle"><span>06 · SPRECHEN</span><h2>Das bin ich!</h2><p>با جمله‌های کوتاه خودت را معرفی کن.</p></div>
    <BookScene speak={speak}/>
    <div className="wbExerciseHead"><span className="wbExerciseNum">6</span><div><b>Sprich über dich!</b><p>هر جمله را گوش کن و بعد با صدای خودت تکرار کن.</p></div><Volume2 size={22}/></div>
    <div className="wbDialogCards">{workbookDialog.map(line=><button key={line.id} onClick={()=>speak(line.de)}>
      <span className="wbSpeaker">{line.speaker}</span><span><b dir="ltr">{line.de}</b><small>{line.fa}</small></span><Volume2 size={18}/></button>)}</div>
    <div className="wbTip"><Lightbulb size={19}/> قانون ساده: در جمله خبری، فعل صرف‌شده اغلب دوم است: <b dir="ltr">Ich komme aus dem Iran.</b></div>
    <button className="wbSecondary wbWide" onClick={()=>setShowQuiz(v=>!v)}><PencilLine size={17}/>{showQuiz?'بستن جمله‌سازی':'جمله‌ها را خودت بساز'}</button>
    {showQuiz&&<ExamRunner questions={questions} speak={speak} onEvent={onEvent} label="ساختن جمله" onEnd={(score,total)=>onComplete('dialog',score/total>=.7)}/>}
  </div>;
}

function CheckpointPage({speak,onEvent,onComplete,onExam}) {
  const [seed,setSeed]=useState(0);
  const quiz=useMemo(()=>makeWorkbookExam(),[seed]);
  const [result,setResult]=useState(null);
  const done=(score,total)=>{setResult({score,total});onExam(score,total);onComplete('checkpoint',score/total>=.8)};
  return <div className="wbContent">
    <div className="wbChapterTitle"><span>07 · LERNKONTROLLE</span><h2>آماده کلاس بعدی هستی؟</h2><p>۱۲ سؤال از اعداد، صرف فعل، شنیدن صداها و جمله‌سازی.</p></div>
    <div className="wbCheckpointIntro"><Trophy size={32}/><div><b>آزمون پایان جلسه اول</b><p>سؤال‌ها هر بار جابه‌جا می‌شوند. نمره قبولی ۸۰٪ است؛ اشتباه‌ها برای مرورهای بعدی ثبت می‌شوند.</p></div></div>
    <ExamRunner key={seed} questions={quiz} onEvent={onEvent} onEnd={done} speak={speak} label="آزمون جامع جلسه" passThreshold={.8}/>
    {result&&<button className="wbSecondary wbWide" onClick={()=>{setResult(null);setSeed(n=>n+1)}}><RotateCcw size={17}/> آزمون تازه با سؤال‌های تصادفی</button>}
  </div>;
}

export default function TeacherWorkbook({speak,onPracticeEvent,goBack,navigate,routePage,onPageNavigate}) {
  const [page,setPage]=useState(()=>{
    try {const value=localStorage.getItem(PAGE_KEY);return workbookSections.some(p=>p.id===value)?value:'start';}
    catch{return 'start';}
  });
  const [saved,setSaved]=useState(loadState);
  const selectedPage=workbookSections.some(section=>section.id===routePage)?routePage:page;
  useEffect(()=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(saved));}catch{}},[saved]);
  useEffect(()=>{try{localStorage.setItem(PAGE_KEY,selectedPage);}catch{}},[selectedPage]);
  const idx=workbookSections.findIndex(p=>p.id===selectedPage);
  const section=workbookSections[idx];
  const percent=progressPercent(saved);
  const markPage=(name,passed)=>{
    if(!passed)return;
    setSaved(prev=>({...prev,pages:{...prev.pages,[name]:{passed:true,at:Date.now()}}}));
  };
  const markExam=(score,total)=>{
    setSaved(prev=>({...prev,best:Math.max(prev.best||0,Math.round(score/total*100)),attempts:(prev.attempts||0)+1}));
  };
  function openPage(id) {
    setPage(id);
    onPageNavigate?.(id);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  const props={speak,onEvent:onPracticeEvent,onComplete:markPage};
  return <div className="wbRoot">
    <div className="wbTopline">
      <RouteLink to="course" navigate={navigate}><ChevronRight size={17}/> برگشت به درس‌ها</RouteLink>
      <div><span className="wbTopBadge">مکمل کلاس خصوصی</span><span>Deutsch · A1.1</span></div>
    </div>
    <header className="wbCover">
      <div className="wbCoverCopy">
        <span className="wbCoverNumber">ARBEITSHEFT · 01</span>
        <h1>Mein erstes Deutsch</h1>
        <p>دفتر تمرین تعاملی — جلسه اول استاد</p>
        <div><span>الفبا</span><span>تلفظ</span><span>اعداد</span><span>صرف فعل</span></div>
      </div>
      <div className="wbCoverArt" aria-hidden="true"><div>Hallo<span>!</span></div><span>Ä</span><i>12</i></div>
    </header>
    <div className="wbCompletion">
      <div><b>پیشرفت دفتر تمرین</b><span>{Object.keys(saved.pages).filter(id=>saved.pages[id]?.passed).length} از ۷ بخش</span></div>
      <div className="wbCompletionTrack"><span style={{width:percent+'%'}}/></div>
    </div>
    <div className="wbSectionPicker" aria-label="فهرست صفحه‌های دفتر تمرین">
      {workbookSections.map((item,i)=><RouteLink key={item.id} to={'workbook/'+item.id} navigate={()=>openPage(item.id)}
        className={(selectedPage===item.id?'current ':'')+(saved.pages[item.id]?.passed?'finished':'')}
        aria-current={selectedPage===item.id?'step':undefined}>
        <span className="wbSectionIndex">{saved.pages[item.id]?.passed?<Check size={17}/>:String(i+1).padStart(2,'0')}</span>
        <span><b>{item.title}</b><small dir="ltr">{item.label}</small></span>
      </RouteLink>)}
    </div>
    <article className="wbPaper">
      <div className="wbPaperMargin" aria-hidden="true"/>
      <div className="wbPageHeader"><span>DEUTSCH TRAINER / LEKTION 01</span><span>صفحه {idx+1} از {workbookSections.length}</span></div>
      {selectedPage==='start'&&<IntroPage speak={speak} goNext={()=>openPage('alphabet')} onComplete={markPage}/>}
      {selectedPage==='alphabet'&&<AlphabetPage {...props}/>}
      {selectedPage==='sounds'&&<SoundsPage {...props}/>}
      {selectedPage==='numbers'&&<NumbersPage {...props}/>}
      {selectedPage==='verbs'&&<VerbsPage {...props}/>}
      {selectedPage==='dialog'&&<DialogPage {...props}/>}
      {selectedPage==='checkpoint'&&<CheckpointPage {...props} onExam={markExam}/>}
      <div className="wbPageFooter">
        <span>{String(idx+1).padStart(2,'0')} / {String(workbookSections.length).padStart(2,'0')}</span>
        <b>{section.label} · A1.1</b>
      </div>
    </article>
    <div className="wbFooterNav">
      {idx===0?<span className="wbDisabledNav"><ChevronRight size={18}/> صفحه قبل</span>:
      <RouteLink to={'workbook/'+workbookSections[idx-1].id} navigate={()=>openPage(workbookSections[idx-1].id)}><ChevronRight size={18}/> صفحه قبل</RouteLink>}
      {idx<workbookSections.length-1?<RouteLink className="wbPrimary" to={'workbook/'+workbookSections[idx+1].id} navigate={()=>openPage(workbookSections[idx+1].id)}>صفحه بعد <ChevronLeft size={18}/></RouteLink>:
      <RouteLink className="wbPrimary" to="workbook/start" navigate={()=>openPage('start')}><BookOpen size={17}/> بازگشت به شروع</RouteLink>}
    </div>
    <p className="wbCopyrightNote">این دفتر، محتوای تمرینی تألیفی مطابق جزوه کلاس توست و بازتولید صفحات، متن کامل یا تصاویر ناشر نیست. تلفظ خودکار به صدای آلمانی دستگاه بستگی دارد.</p>
  </div>;
}
