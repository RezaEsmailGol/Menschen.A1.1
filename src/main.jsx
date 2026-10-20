import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Volume2, RotateCcw, CheckCircle2, XCircle, BookOpen, Keyboard, Hash, Languages, Play, Shuffle, Trophy, Upload, Download, Plus, Trash2 } from 'lucide-react';
import PronunciationLab from './PronunciationLab';
import NumberLab from './NumberLab';
import PhaseOne from './PhaseOne';
import TeacherWorkbook from './TeacherWorkbook';
import RouteLink from './RouteLink';
import {usePageRoute} from './usePageRoute';
import { pronouns, verbForms } from './courseData';
import { Home as HomeIcon, BookOpenCheck, LayoutGrid, ChartNoAxesCombined, ChevronRight } from 'lucide-react';
import { TodayDashboard, PracticeHub, ProgressPage } from './LearningScreens';
import { MEMORY_KEY, recordActivity, learningInsights, activityItemKey } from './learningMemory';
import { COURSE_KEY, REVIEW_KEY } from './studyEngine';
import './mobileGame.css';
import './styles.css';
import './upgrade.css';
import './routeLinks.css';

const lessonOneWords = [
  { de: 'Sonne', fa: 'خورشید', hint: 'S در ابتدای واژه معمولاً /z/ شنیده می‌شود.' },
  { de: 'Sport', fa: 'ورزش', hint: 'sp در ابتدای واژه شبیه «شپ» تلفظ می‌شود.' },
  { de: 'Straße', fa: 'خیابان', hint: 'st در ابتدای واژه شبیه «شت» است.' },
  { de: 'heißen', fa: 'نام داشتن', hint: 'ß مثل ss تلفظ می‌شود.' },
  { de: 'Vater', fa: 'پدر', hint: 'V در این واژه صدای /f/ دارد.' },
  { de: 'Verb', fa: 'فعل', hint: 'V در این واژه صدای /v/ دارد.' },
  { de: 'Physik', fa: 'فیزیک', hint: 'ph → f' },
  { de: 'Zeit', fa: 'زمان', hint: 'z → «تس»' },
  { de: 'Dach', fa: 'سقف', hint: 'ch بعد از a صدای خشن‌تر دارد.' },
  { de: 'ich', fa: 'من', hint: 'ch در ich نرم‌تر است.' },
  { de: 'sechs', fa: 'شش', hint: 'chs در این واژه خاص شبیه «کس» شنیده می‌شود.' },
  { de: 'Deutsch', fa: 'آلمانی', hint: 'eu → «اُی» و tsch → «چ»' }
];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({ letter }));
const numbers = [
  ['0','null'],['1','eins'],['2','zwei'],['3','drei'],['4','vier'],['5','fünf'],['6','sechs'],['7','sieben'],['8','acht'],['9','neun'],['10','zehn'],['11','elf'],['12','zwölf'],['13','dreizehn'],['14','vierzehn'],['15','fünfzehn'],['16','sechzehn'],['17','siebzehn'],['18','achtzehn'],['19','neunzehn'],['20','zwanzig']
].map(([n,de]) => ({ n, de }));

const verbMeanings = {
  kommen:'آمدن', heißen:'نام داشتن', sein:'بودن', wohnen:'ساکن بودن', sprechen:'صحبت کردن',
  haben:'داشتن', arbeiten:'کار کردن', machen:'انجام دادن', spielen:'بازی کردن', lesen:'خواندن',
  brauchen:'نیاز داشتن', kaufen:'خریدن', suchen:'جست‌وجو کردن', fahren:'رفتن با وسیله',
  gehen:'رفتن پیاده', müssen:'مجبور بودن / باید', schreiben:'نوشتن', schicken:'فرستادن',
  möchten:'مایل بودن / خواستن', können:'توانستن'
};
const verbs = Object.fromEntries(Object.entries(verbForms).map(([infinitive,forms]) => [
  infinitive,
  { fa:verbMeanings[infinitive] || '', forms:Object.fromEntries(pronouns.map((person,index)=>[person,forms[index]])) }
]));

const defaultCards = [
  { front: 'من اهل ایران هستم.', back: 'Ich komme aus dem Iran.' },
  { front: 'من آلمانی یاد می‌گیرم.', back: 'Ich lerne Deutsch.' },
  { front: 'من توسعه‌دهنده نرم‌افزار هستم.', back: 'Ich bin Softwareentwickler.' },
  { front: 'می‌خواهم در اتریش کار کنم.', back: 'Ich möchte in Österreich arbeiten.' },
  { front: 'درخواست استخدام', back: 'die Bewerbung' },
  { front: 'سابقه کاری', back: 'die Berufserfahrung' }
];

function speak(text) {
  if (!('speechSynthesis' in window)) {
    window.alert('مرورگر شما پخش صدای گفتاری را پشتیبانی نمی‌کند.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(String(text));
  const available = window.speechSynthesis.getVoices();
  const germanVoice = available.find(v => v.lang.toLowerCase() === 'de-at')
    || available.find(v => v.lang.toLowerCase() === 'de-de')
    || available.find(v => v.lang.toLowerCase().startsWith('de'));
  if (germanVoice) utterance.voice = germanVoice;
  utterance.lang = germanVoice?.lang || 'de-DE';
  utterance.rate = Number(localStorage.getItem('dt_audio_speed') || 0.82);
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function normalize(text) {
  return text.trim().toLowerCase().replace(/[.!?]/g, '').replace(/\s+/g, ' ');
}

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

const routes = [
  {id:'home',title:'خانه',Icon:HomeIcon},
  {id:'course',title:'درس‌ها',Icon:BookOpenCheck},
  {id:'practice',title:'تمرین',Icon:LayoutGrid},
  {id:'progress',title:'پیشرفت',Icon:ChartNoAxesCombined}
];
const secondaryTitles = {
  workbook:'دفتر جلسه اول استاد',srs:'مرور هوشمند',builder:'جمله‌سازی',exam:'آزمون درس',
  numbers:'بازی اعداد',pronunciation:'تلفظ و استثناها',
  flash:'فلش‌کارت شخصی',listen:'دیکته شنیداری',
  words:'کلمات جلسه اول',alphabet:'الفبا',verbs:'صرف افعال'
};
function BottomNav({tab,setTab}) {
  const selected=['home','course','practice','progress'].includes(tab)?tab:(tab==='workbook'?'course':'practice');
  return <nav className="bottomNav" aria-label="منوی اصلی">
    {routes.map(({id,title,Icon})=><RouteLink key={id} to={id} navigate={setTab} aria-current={selected===id?'page':undefined}
      className={selected===id?'selected':''}>
      <span className="bottomNavIcon"><Icon size={22} strokeWidth={selected===id?2.65:2.05}/></span>
      <span>{title}</span>
    </RouteLink>)}
  </nav>;
}

function App() {
  const [route, setTab] = usePageRoute();
  const tab=route.startsWith('workbook/')?'workbook':route.startsWith('course/')?'course':route;
  const [audioSpeed, setAudioSpeed] = useLocalStorage('dt_audio_speed', 0.82);
  const [cards, setCards] = useLocalStorage('dt_cards', defaultCards);
  const [progress, setProgress] = useLocalStorage(COURSE_KEY, {1:{started:true}});
  const [schedule, setSchedule] = useLocalStorage(REVIEW_KEY, {});
  const [memory, setMemory] = useLocalStorage(MEMORY_KEY, {version:1,items:{},days:{},totalXP:0,history:[]});
  const [feedback,setFeedback]=useState(null);
  const onPracticeEvent = event => {
    setMemory(previous => recordActivity(previous,event));
    setFeedback({xp:event.correct?10:2,correct:event.correct,key:Date.now()+Math.random()});
    try { if(event.correct && navigator.vibrate) navigator.vibrate(18); } catch {}
  };
  const [stats, setStats] = useLocalStorage('dt_stats', { known: 0, missed: 0, typed: 0, correct: 0, streak: 0, lastDay: '' });

  const insights=learningInsights(memory);
  useEffect(() => { window.scrollTo({top:0,behavior:'auto'}); }, [route]);
  useEffect(() => {
    if(!feedback)return;
    const timer=setTimeout(()=>setFeedback(null),1800);
    return ()=>clearTimeout(timer);
  },[feedback]);

  return <div className="app">
    <header className="topbar">
      <div>
        <h1>Deutsch Trainer</h1>
        <p>همراه تمرین Menschen A1.1 — بر اساس درس‌های کلاس خودت</p>
      </div>
      <div className="headerTools"><label className="voiceControl" title="سرعت تلفظ"><Volume2 size={17}/><select aria-label="سرعت پخش تلفظ" value={audioSpeed} onChange={e => setAudioSpeed(Number(e.target.value))}><option value={0.65}>آرام</option><option value={0.82}>معمولی</option><option value={1}>سریع</option></select></label><div className="streak"><Trophy size={18}/> {insights.streak} روز</div></div>
    </header>

    {secondaryTitles[tab] && <div className="subpageReturn">
      <RouteLink to="practice" navigate={setTab}><ChevronRight size={17}/> تمرین‌ها</RouteLink>
      <span>{secondaryTitles[tab]}</span>
    </div>}

    <main>
      {tab==='home' && <TodayDashboard setTab={setTab} memory={memory} progress={progress} schedule={schedule} legacyStats={stats} />}
      {tab==='practice' && <PracticeHub setTab={setTab} memory={memory} />}
      {tab==='workbook' && <TeacherWorkbook speak={speak} onPracticeEvent={onPracticeEvent}
        routePage={route.startsWith('workbook/')?route.slice('workbook/'.length):null}
        onPageNavigate={id=>setTab('workbook/'+id)} goBack={()=>setTab('course')} navigate={setTab} />}
      {tab==='progress' && <ProgressPage setTab={setTab} memory={memory} progress={progress} schedule={schedule} />}
      {['course','srs','builder','exam'].includes(tab) && <PhaseOne mode={tab} routeLesson={route.startsWith('course/')?Number(route.slice(7)):null}
        setTab={setTab} speak={speak} progress={progress} setProgress={setProgress} schedule={schedule} setSchedule={setSchedule} onPracticeEvent={onPracticeEvent} />}
      {tab==='pronunciation' && <PronunciationLab speak={speak} memory={memory} onPracticeEvent={onPracticeEvent} />}
      {tab==='flash' && <Flashcards cards={cards} setCards={setCards} stats={stats} setStats={setStats} onPracticeEvent={onPracticeEvent} />}
      {tab==='listen' && <ListenType stats={stats} setStats={setStats} onPracticeEvent={onPracticeEvent} />}
      {tab==='words' && <Words />}
      {tab==='numbers' && <NumberLab speak={speak} memory={memory} onAttempt={(ok,number) => {
        setStats(s => ({...s, typed:s.typed+1, correct:s.correct+(ok?1:0)}));
        onPracticeEvent({id:activityItemKey('number',number),kind:'number',label:String(number),lesson:1,correct:ok});
      }} />}
      {tab==='alphabet' && <Alphabet />}
      {tab==='verbs' && <Verbs onPracticeEvent={onPracticeEvent}/>}
    </main>

    <footer>تمرین مستقل و مکمل کتاب Menschen A1.1 · اطلاعات شما فقط روی همین دستگاه ذخیره می‌شود.</footer>
    {feedback && <div key={feedback.key} className={'gameFeedbackToast '+(feedback.correct?'win':'retry')} role="status">
      {feedback.correct?<CheckCircle2 size={20}/>:<RotateCcw size={20}/>}
      <span>{feedback.correct?'آفرین!':'ادامه بده!'} +{feedback.xp} XP</span>
    </div>}
    <BottomNav tab={tab} setTab={setTab}/>
  </div>
}

function Home({stats,setTab}) {
  const total = stats.known + stats.missed;
  const accuracy = total ? Math.round(100 * stats.known / total) : 0;
  const items = [
    ['مسیر ۱۲ درس A1.1', 'واژگان، دستور زبان، مثال و آزمون هر درس', 'course', BookOpen, 'teal'],
    ['مرور هوشمند', 'کلمات فراموش‌شده را در موعد مناسب ببین', 'srs', RotateCcw, 'violet'],
    ['جمله‌سازی تعاملی', 'با لمس کلمات، جمله درست بساز', 'builder', Shuffle, 'orange'],
    ['آزمون پایان درس', 'امتیاز از ۱۰۰ و ثبت وضعیت قبولی', 'exam', Trophy, 'blue'],
    ['تلفظ و استثناها', 'از «ich» تا «Bach»؛ قوانین همراه با صدا', 'pronunciation', Volume2, 'teal'],
    ['بازی اعداد', '۱۰ سؤال رندوم؛ شنیدن و تایپ تا ۱۰۰', 'numbers', Hash, 'orange'],
    ['فلش‌کارت', 'مرور روزانه، پاسخ صحیح و غلط', 'flash', BookOpen, 'violet'],
    ['دیکته شنیداری', 'گوش بده، کلمه را با دقت بنویس', 'listen', Keyboard, 'blue'],
    ['کلمات جلسه اول', 'کلمات مهم جزوه با معنی و صدا', 'words', Languages, 'rose'],
    ['الفبای آلمانی', 'حروف ویژه و شنیدن نام حروف', 'alphabet', Languages, 'green'],
    ['صرف افعال', '۲۰ فعل پرکاربرد و آزمون صرف', 'verbs', Shuffle, 'indigo'],
  ];
  return <>
    <section className="hero upgradedHero">
      <div className="heroIntro">
        <span className="pill">A1.1 · 12 LEARNING UNITS</span>
        <h2>هر روز یک قدم،<br/><span>نزدیک‌تر به آلمانی روان.</span></h2>
        <p>۱۲ واحد تمرینی از سطح A1.1، به‌علاوه تلفظ، استثناها، اعداد، مرور هوشمند، جمله‌سازی و تمرین‌های کلاس.</p>
        <div className="heroButtons">
          <button onClick={() => setTab('course')}><BookOpen size={18}/> شروع درس‌های A1.1 <span>←</span></button>
          <button className="outlineBtn" onClick={() => setTab('srs')}><RotateCcw size={18}/> مرور امروز</button>
        </div>
      </div>
      <div className="heroDashboard">
        <div className="dailyBadge">برنامه امروز <span>۲۰ دقیقه</span></div>
        <div className="progressDial" style={{'--value': accuracy}}><div><strong>{accuracy}%</strong><span>کارت‌های درست</span></div></div>
        <div className="miniStats"><div><strong>{stats.correct}</strong><span>تایپ درست</span></div><div><strong>{stats.missed}</strong><span>مرور مجدد</span></div></div>
      </div>
    </section>
    <div className="homeSectionTitle"><div><span className="eyebrow">YOUR LEARNING SPACE</span><h2>امروز چه چیزی تمرین کنیم؟</h2><p>یکی از بخش‌ها را انتخاب کن و پیشرفتت را بساز.</p></div><span className="courseTag">سطح A1.1</span></div>
    <section className="grid upgradedGrid">
      {items.map(([title,desc,id,Icon,tone],index) => <button className={'feature updatedFeature tone-'+tone} key={id} onClick={()=>setTab(id)}>
        <div className="featureUpper"><span className="featureIcon"><Icon size={25}/></span><span className="featureArrow">↗</span></div>
        <h3>{title}</h3><p>{desc}</p><div className="featureFoot"><span>{index < 2 ? 'پیشنهاد امروز' : 'درس اول'}</span><span>شروع ←</span></div>
      </button>)}
    </section>
    <div className="homePracticeStrip"><div className="practiceIcon">🎧</div><div><b>نکته امروز: صدای «ch» دو نوع اصلی دارد</b><p>تفاوت ich و Bach را بشنو؛ بعد در مسیر درس‌ها جمله‌سازی کن.</p></div><button onClick={()=>setTab('pronunciation')}>بشنو و تمرین کن ←</button></div>
  </>;
}

function Flashcards({cards,setCards,stats,setStats,onPracticeEvent}) {
  const [i,setI] = useState(0); const [flip,setFlip]=useState(false);
  const card = cards[i % cards.length];
  const mark = good => {
    setStats(s => ({...s, known:s.known+(good?1:0), missed:s.missed+(good?0:1)}));
    if(card) onPracticeEvent?.({id:'personal:'+ (i%cards.length) + ':'+card.front+'|'+card.back,kind:'vocab',label:card.back,lesson:0,correct:good});
    setFlip(false); setI(v => (v+1)%cards.length);
  };
  const exportCards = () => {
    const blob = new Blob([JSON.stringify(cards,null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='deutsch-flashcards.json'; a.click(); URL.revokeObjectURL(a.href);
  };
  const importCards = e => {
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader(); r.onload=()=>{ try { const d=JSON.parse(r.result); if(Array.isArray(d)) setCards(d); } catch{} }; r.readAsText(f);
  };
  const addCard = () => {
    const front = prompt('روی کارت (فارسی یا سؤال):'); if(!front) return;
    const back = prompt('پشت کارت (آلمانی یا پاسخ):'); if(!back) return;
    setCards([...cards,{front,back}]);
  };
  return <section className="panel">
    <div className="panelHead"><div><h2>فلش‌کارت</h2><p>{i+1} از {cards.length}</p></div><div className="actions"><button onClick={addCard}><Plus size={17}/> افزودن</button><label className="btn"><Upload size={17}/> ورود<input type="file" hidden accept="application/json" onChange={importCards}/></label><button onClick={exportCards}><Download size={17}/> خروجی</button></div></div>
    <button className={'flashcard '+(flip?'flipped':'')} onClick={()=>setFlip(!flip)}>
      <span>{flip ? card.back : card.front}</span>
      <small>برای دیدن پاسخ لمس کن</small>
    </button>
    <div className="flashActions"><button className="bad" onClick={()=>mark(false)}><XCircle/> بلد نبودم</button><button className="good" onClick={()=>mark(true)}><CheckCircle2/> بلد بودم</button></div>
    {flip && /[A-Za-zÄÖÜäöüß]/.test(card.back) && <button className="listenBtn" onClick={()=>speak(card.back)}><Volume2/> تلفظ پاسخ</button>}
    <button className="resetLink" onClick={()=>{ if(confirm('فلش‌کارت‌ها به حالت اولیه برگردند؟')) setCards(defaultCards); }}><RotateCcw size={15}/> بازنشانی مجموعه</button>
  </section>
}

function ListenType({stats,setStats,onPracticeEvent}) {
  const pool = useMemo(() => [...lessonOneWords.map(w=>w.de), ...numbers.slice(0,13).map(x=>x.de), 'Ich komme aus dem Iran.', 'Ich lerne Deutsch.', 'Ich bin Softwareentwickler.'], []);
  const [target,setTarget] = useState(pool[Math.floor(Math.random()*pool.length)]);
  const [answer,setAnswer]=useState(''); const [status,setStatus]=useState(null);
  const next=()=>{setTarget(pool[Math.floor(Math.random()*pool.length)]);setAnswer('');setStatus(null)};
  const check=()=>{
    if(status!==null || !answer.trim()) return;
    const ok=normalize(answer)===normalize(target);
    setStatus(ok?'ok':'bad');
    setStats(s=>({...s,typed:s.typed+1,correct:s.correct+(ok?1:0)}));
    onPracticeEvent?.({id:activityItemKey('dictation',target),kind:'dictation',label:target,lesson:1,correct:ok});
  };
  return <section className="panel narrow"><h2>شنیدن و تایپ</h2><p>روی پخش بزن، گوش بده و چیزی که شنیدی تایپ کن.</p>
    <button className="bigPlay" onClick={()=>speak(target)}><Play fill="currentColor"/> پخش آلمانی</button>
    <input className="typeInput" value={answer} onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>e.key==='Enter'&&check()} placeholder="اینجا تایپ کن…" dir="ltr"/>
    <div className="row"><button onClick={check}>بررسی</button><button className="secondary" onClick={next}>بعدی</button></div>
    {status==='ok' && <div className="result ok">آفرین! درست بود.</div>}
    {status==='bad' && <div className="result bad">پاسخ درست: <b dir="ltr">{target}</b><button onClick={()=>speak(target)}><Volume2 size={16}/></button></div>}
  </section>
}

function Words(){return <section className="panel"><h2>خواندن و تلفظ کلمات جلسه اول</h2><div className="wordGrid">{lessonOneWords.map(w=><div className="wordCard" key={w.de}><div><b dir="ltr">{w.de}</b><span>{w.fa}</span></div><button onClick={()=>speak(w.de)}><Volume2/></button><small>{w.hint}</small></div>)}</div></section>}

function Numbers(){const [quiz,setQuiz]=useState(null);const newQ=()=>setQuiz(numbers[Math.floor(Math.random()*numbers.length)]);return <section className="panel"><div className="panelHead"><div><h2>اعداد ۰ تا ۲۰</h2><p>عدد را ببین، آلمانی را بخوان و تلفظ را گوش کن.</p></div><button onClick={newQ}>آزمون سریع</button></div>{quiz&&<NumberQuiz item={quiz} next={newQ}/>}<div className="numberGrid">{numbers.map(x=><button key={x.n} onClick={()=>speak(x.de)}><strong>{x.n}</strong><span dir="ltr">{x.de}</span><Volume2 size={16}/></button>)}</div></section>}
function NumberQuiz({item,next}){const [a,setA]=useState('');const [s,setS]=useState(null);useEffect(()=>{setA('');setS(null)},[item]);return <div className="miniQuiz"><b>عدد {item.n} را به آلمانی بنویس:</b><input dir="ltr" value={a} onChange={e=>setA(e.target.value)}/><button onClick={()=>setS(normalize(a)===normalize(item.de))}>بررسی</button>{s===true&&<span className="green">درست ✓</span>}{s===false&&<span className="red">{item.de}</span>}<button className="secondary" onClick={next}>سؤال بعد</button></div>}

function Alphabet(){return <section className="panel"><h2>الفبای آلمانی</h2><p>روی هر حرف بزن تا نام حرف را بشنوی. چهار حرف ویژه آلمانی هم پایین هستند.</p><div className="alphaGrid">{alphabet.map(x=><button key={x.letter} onClick={()=>speak(x.letter)}>{x.letter}</button>)}</div><div className="specials">{['Ä','Ö','Ü','ß'].map(x=><button key={x} onClick={()=>speak(x)}>{x}</button>)}</div></section>}

function Verbs({onPracticeEvent}){const [verb,setVerb]=useState('kommen');const [practice,setPractice]=useState(false);const data=verbs[verb];return <section className="panel"><div className="panelHead"><div><h2>صرف افعال</h2><p>الگوی صرف را ببین، گوش بده، بعد خودت تایپ کن.</p></div><select value={verb} onChange={e=>setVerb(e.target.value)}>{Object.keys(verbs).map(v=><option key={v}>{v}</option>)}</select></div><div className="verbTitle"><b dir="ltr">{verb}</b><span>{data.fa}</span><button onClick={()=>speak(verb)}><Volume2/></button></div><div className="conj">{Object.entries(data.forms).map(([p,f])=><div key={p}><span dir="ltr">{p}</span><b dir="ltr">{f}</b><button onClick={()=>speak(`${p} ${f}`)}><Volume2 size={16}/></button></div>)}</div><button onClick={()=>setPractice(!practice)}>{practice?'بستن تمرین':'شروع تمرین تایپی'}</button>{practice&&<VerbPractice verb={verb} forms={data.forms} onPracticeEvent={onPracticeEvent}/>}</section>}
function VerbPractice({verb,forms,onPracticeEvent}){const pronouns=Object.keys(forms);const [p,setP]=useState(pronouns[0]);const [a,setA]=useState('');const [s,setS]=useState(null);const next=()=>{setP(pronouns[Math.floor(Math.random()*pronouns.length)]);setA('');setS(null)};return <div className="miniQuiz"><b>صرف <span dir="ltr">{verb}</span> برای <span dir="ltr">{p}</span> چیست؟</b><input dir="ltr" value={a} onChange={e=>setA(e.target.value)}/><button onClick={()=>{
  if(s!==null || !a.trim())return;
  const correct=normalize(a)===normalize(forms[p]);
  setS(correct);
  onPracticeEvent?.({id:activityItemKey('grammar',verb,p),kind:'grammar',label:verb+' / '+p,lesson:1,correct});
}}>بررسی</button>{s===true&&<span className="green">درست ✓</span>}{s===false&&<span className="red">{forms[p]}</span>}<button className="secondary" onClick={next}>بعدی</button></div>}

createRoot(document.getElementById('root')).render(<App/>);
