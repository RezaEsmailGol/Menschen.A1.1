import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Volume2, RotateCcw, CheckCircle2, XCircle, BookOpen, Keyboard, Hash, Languages, Play, Shuffle, Trophy, Upload, Download, Plus, Trash2 } from 'lucide-react';
import './styles.css';

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

const verbs = {
  kommen: {
    fa: 'آمدن',
    forms: { ich: 'komme', du: 'kommst', 'er/sie/es': 'kommt', wir: 'kommen', ihr: 'kommt', 'sie/Sie': 'kommen' }
  },
  lernen: {
    fa: 'یاد گرفتن',
    forms: { ich: 'lerne', du: 'lernst', 'er/sie/es': 'lernt', wir: 'lernen', ihr: 'lernt', 'sie/Sie': 'lernen' }
  },
  arbeiten: {
    fa: 'کار کردن',
    forms: { ich: 'arbeite', du: 'arbeitest', 'er/sie/es': 'arbeitet', wir: 'arbeiten', ihr: 'arbeitet', 'sie/Sie': 'arbeiten' }
  }
};

const defaultCards = [
  { front: 'من اهل ایران هستم.', back: 'Ich komme aus dem Iran.' },
  { front: 'من آلمانی یاد می‌گیرم.', back: 'Ich lerne Deutsch.' },
  { front: 'من توسعه‌دهنده نرم‌افزار هستم.', back: 'Ich bin Softwareentwickler.' },
  { front: 'می‌خواهم در اتریش کار کنم.', back: 'Ich möchte in Österreich arbeiten.' },
  { front: 'درخواست استخدام', back: 'die Bewerbung' },
  { front: 'سابقه کاری', back: 'die Berufserfahrung' }
];

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'de-DE';
  u.rate = 0.82;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
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

const tabs = [
  ['home','خانه'],['flash','فلش‌کارت'],['listen','شنیدن و تایپ'],['words','خواندن کلمات'],['numbers','اعداد'],['alphabet','الفبا'],['verbs','صرف افعال']
];

function App() {
  const [tab, setTab] = useState('home');
  const [cards, setCards] = useLocalStorage('dt_cards', defaultCards);
  const [stats, setStats] = useLocalStorage('dt_stats', { known: 0, missed: 0, typed: 0, correct: 0, streak: 0, lastDay: '' });

  const bumpStreak = () => {
    const today = new Date().toISOString().slice(0,10);
    if (stats.lastDay === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
    setStats(s => ({ ...s, streak: s.lastDay === yesterday ? s.streak + 1 : 1, lastDay: today }));
  };

  useEffect(() => bumpStreak(), []);

  return <div className="app">
    <header className="topbar">
      <div>
        <h1>Deutsch Trainer</h1>
        <p>همراه تمرین Menschen A1.1 — بر اساس درس‌های کلاس خودت</p>
      </div>
      <div className="streak"><Trophy size={18}/> {stats.streak} روز</div>
    </header>

    <nav className="tabs">
      {tabs.map(([id,label]) => <button key={id} onClick={() => setTab(id)} className={tab===id?'active':''}>{label}</button>)}
    </nav>

    <main>
      {tab==='home' && <Home stats={stats} setTab={setTab} />}
      {tab==='flash' && <Flashcards cards={cards} setCards={setCards} stats={stats} setStats={setStats} />}
      {tab==='listen' && <ListenType stats={stats} setStats={setStats} />}
      {tab==='words' && <Words />}
      {tab==='numbers' && <Numbers />}
      {tab==='alphabet' && <Alphabet />}
      {tab==='verbs' && <Verbs />}
    </main>

    <footer>این اپ محتوای کامل کتاب را بازنشر نمی‌کند؛ برای تمرین درس‌های کلاس و محتوای شخصی طراحی شده است.</footer>
  </div>
}

function Home({stats,setTab}) {
  const items = [
    ['فلش‌کارت', 'مرور جمله‌ها و لغت‌های کلاس', 'flash', BookOpen],
    ['شنیدن و تایپ', 'کلمه را گوش بده و درست تایپ کن', 'listen', Keyboard],
    ['تلفظ و خواندن', 'کلمات جلسه اول را با صدا تمرین کن', 'words', Volume2],
    ['اعداد', 'از ۰ تا ۲۰ با تلفظ', 'numbers', Hash],
    ['الفبا', 'حروف آلمانی با تلفظ', 'alphabet', Languages],
    ['صرف افعال', 'kommen، lernen، arbeiten', 'verbs', Shuffle],
  ];
  return <>
    <section className="hero">
      <div>
        <span className="pill">Lektion 1</span>
        <h2>امروز ۲۰ دقیقه آلمانی واقعی تمرین کن</h2>
        <p>هدف: تلفظ بهتر، تایپ دقیق، و ساختن جمله‌های کوتاه بدون حفظ طوطی‌وار.</p>
      </div>
      <div className="progressCard">
        <div><b>{stats.correct}</b><span>پاسخ درست</span></div>
        <div><b>{stats.known}</b><span>کارت بلد بودم</span></div>
        <div><b>{stats.missed}</b><span>نیاز به مرور</span></div>
      </div>
    </section>
    <section className="grid">
      {items.map(([title,desc,id,Icon]) => <button className="feature" key={id} onClick={()=>setTab(id)}>
        <Icon size={28}/><h3>{title}</h3><p>{desc}</p>
      </button>)}
    </section>
  </>;
}

function Flashcards({cards,setCards,stats,setStats}) {
  const [i,setI] = useState(0); const [flip,setFlip]=useState(false);
  const card = cards[i % cards.length];
  const mark = good => {
    setStats(s => ({...s, known:s.known+(good?1:0), missed:s.missed+(good?0:1)}));
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

function ListenType({stats,setStats}) {
  const pool = useMemo(() => [...lessonOneWords.map(w=>w.de), ...numbers.slice(0,13).map(x=>x.de), 'Ich komme aus dem Iran.', 'Ich lerne Deutsch.', 'Ich bin Softwareentwickler.'], []);
  const [target,setTarget] = useState(pool[Math.floor(Math.random()*pool.length)]);
  const [answer,setAnswer]=useState(''); const [status,setStatus]=useState(null);
  const next=()=>{setTarget(pool[Math.floor(Math.random()*pool.length)]);setAnswer('');setStatus(null)};
  const check=()=>{const ok=normalize(answer)===normalize(target);setStatus(ok?'ok':'bad');setStats(s=>({...s,typed:s.typed+1,correct:s.correct+(ok?1:0)}));};
  return <section className="panel narrow"><h2>شنیدن و تایپ</h2><p>روی پخش بزن، گوش بده و چیزی که شنیدی تایپ کن.</p>
    <button className="bigPlay" onClick={()=>speak(target)}><Play fill="currentColor"/> پخش آلمانی</button>
    <input className="typeInput" value={answer} onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>e.key==='Enter'&&check()} placeholder="اینجا تایپ کن…" dir="ltr"/>
    <div className="row"><button onClick={check}>بررسی</button><button className="secondary" onClick={next}>بعدی</button></div>
    {status==='ok' && <div className="result ok">آفرین! درست بود.</div>}
    {status==='bad' && <div className="result bad">پاسخ درست: <b dir="ltr">{target}</b><button onClick={()=>speak(target)}><Volume2 size={16}/></button></div>}
  </section>
}

function Words(){return <section className="panel"><h2>خواندن و تلفظ کلمات جلسه اول</h2><div className="wordGrid">{lessonOneWords.map(w=><div className="wordCard" key={w.de}><div><b dir="ltr">{w.de}</b><span>{w.fa}</span></div><button onClick={()=>speak(#w.de)}><Volume2/></button><small>{w.hint}</small></div>)}</div></section>}

function Numbers(){const [quiz,setQuiz]=useState(null);const newQ=()=>setQuiz(numbers[Math.floor(Math.random()*numbers.length)]);return <section className="panel"><div className="panelHead"><div><h2>اعداد ۰ ةا ۲۰</h2><p>عدد را ببین، آلمانی را بخوان و تلفظ را گوش کن.</p></div><button onClick={newQ}>آزمون سرٌع</button></div>{quiz&&<NumberQuiz item={quiz} next={newQ}/>}<div className="numberGrid">{numbers.map(x=><button key={x.n} onClick={()=>speak(x.de)}><strong>{x.n}</strong><span dir="ltr">{x.de}</span><Volume2 size={16}/></button>)}</div></section>}
function NumberQuiz({item,next}){const [a,setA]=useState('');const [s,setS]=useState(null);useEffect(()=>{setA('');setS(null)},[item]);return <div className="miniQuiz"><b>بـثب مطثوبب {item.n} را به آلمانی بنویست:</b><input dir="ltr" value={a} onChange={e=>setA(e.target.value)}/><button onClick={()=>setS(normalize(a)===normalize(item.de))}>بررسی</button>{s===true&&<span className="green">درست ✓</span>}{s===false&&<span className="red">{item.de}</span>}<button className="secondary" onClick={next}>سؤال بعد</button></div>}

function Alphabet(){return <section className="panel"><h2>الفبای آلمانی</h2><p>روی هر حرف بزن تا نام حرف را بشنوی. چهار حرف ویژه آلمانی هم پایین هستند.</p><div className="alphaGrid">{alphabet.map(x=><button key={x.letter} onClick={()=>speak(x.letter)}>{x.letter}</button>)}</div><div className="specials">{['Ä','Ö','Ü','ß'].map(x=><button key={x} onClick={()=>speak(x)}>{x}</button>)}</div></section>}

function Verbs(){const [verb,setVerb]=useState('kommen');const [practice,setPractice]=useState(false);const data=verbs[verb];return <section className="panel"><div className="panelHead"><div><h2>صرف افعال</h2><p>الگوی صرف را ببین، گوش بده، بعد خودت تایپ کن.</p></div><select value={verb} onChange={e=>setVerb(e.target.value)}>{Object.keys(verbs).map(v=><option key={v}>{v}</option>)}</select></div><div className="verbTitle"><b dir="ltr">{verb}</b><span>{data.fa}</span><button onClick={()=>speak(verb)}><Volume2/></button></div><div className="conj">{Object.entries(data.forms).map(([p,f])=><div key={p}><span dir="ltr">{p}</span><b dir="ltr">{f}</b><button onClick={()=>speak(`${p} ${f}`)}><Volume2 size={16}/></button></div>)}</div><button onClick={()=>setPractice(!practice)}>{practice?'بستن تمرین':'شروع تمرین تایپی'}</button>{practice&&<VerbPractice verb={verb} forms={data.forms}/>}</section>}
function VerbPractice({verb,forms}){const pronouns=Object.keys(forms);const [p,setP]=useState(pronouns[0]);const [a,setA]=useState('');const [s,setS]=useState(null);const next=()=>{setP(pronouns[Math.floor(Math.random()*pronouns.length)]);setA('');setS(null)};return <div className="miniQuiz"><b>صرف <span dir="ltr">{verb}</span> برای <span dir="ltr">{p}</span> چیست؟</b><input dir="ltr" value={a} onChange={e=>setA(e.target.value)}/><button onClick={()=>setS(normalize(a)===normalize(forms[p]))}>بررسی</button>{s===true&&<span className="green">درست ✓</span>}{s===false&&<span className="red">{forms[p]}</span>}<button className="secondary" onClick={next}>بعدی</button></div>}

createRoot(document.getElementById('root')).render(<App/>);
