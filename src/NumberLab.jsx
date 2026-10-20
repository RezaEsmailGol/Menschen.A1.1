import React, { useState } from 'react';
import { ArrowLeft, Check, Dice5, Headphones, Hash, RotateCcw, Sparkles, Trophy, Volume2, X } from 'lucide-react';
import { germanNumber } from './learningData';
import { chooseAdaptiveNumbers } from './learningMemory';

function freshQuestions(maximum,memory) {
  return chooseAdaptiveNumbers(maximum,memory,Math.min(10,maximum+1));
}
function clean(text) {
  return text.toLocaleLowerCase('de').normalize('NFC').replace(/[\s.!,?]/g, '').trim();
}

export default function NumberLab({ speak, onAttempt, memory }) {
  const [maximum, setMaximum] = useState(12);
  const [challenge, setChallenge] = useState('write');
  const [studyAll, setStudyAll] = useState(false);
  const [active, setActive] = useState(false);
  const [questions, setQuestions] = useState(() => freshQuestions(12,memory));
  const [position, setPosition] = useState(0);
  const [input, setInput] = useState('');
  const [judged, setJudged] = useState(null);
  const [score, setScore] = useState(0);
  const current = questions[position];
  const finished = active && position >= questions.length;
  const restart = (nextMaximum = maximum, nextChallenge = challenge) => {
    setQuestions(freshQuestions(nextMaximum,memory));
    setPosition(0); setInput(''); setJudged(null); setScore(0); setActive(true);
    setMaximum(nextMaximum); setChallenge(nextChallenge);
  };
  const check = () => {
    if (judged !== null || !input.trim() || finished) return;
    const ok = clean(input) === clean(germanNumber(current));
    setJudged(ok);
    if (ok) setScore(s => s + 1);
    onAttempt?.(ok,current);
  };
  const next = () => { setPosition(s => s + 1); setInput(''); setJudged(null); };
  const count = studyAll ? 101 : 21;

  return <section className="labPage">
    <div className="numbersHero">
      <div>
        <span className="sectionKicker"><Hash size={17}/> Zahlen Lab · Lektion 1</span>
        <h2>اعداد آلمانی، <em>مثل یک بازی!</em></h2>
        <p>از اعداد ۰ تا ۱۲ که استاد گفته شروع کن، بعد مرحله‌به‌مرحله تا ۱۰۰ پیش برو. هر آزمون ۱۰ سؤال متفاوت دارد؛ سؤال‌های دشوار قبلی شانس بیشتری برای مرور دارند.</p>
        <div className="numberFeatures"><span><Dice5 size={16}/> سؤال‌های تصادفی</span><span><Headphones size={16}/> شنیدن و نوشتن</span><span><Trophy size={16}/> امتیاز پایان بازی</span></div>
      </div>
      <div className="numberHeroDecoration" aria-hidden="true"><span>7</span><span>12</span><span>20</span><span>99</span></div>
    </div>

    <div className="numbersLayout">
      <div className="numberMainCard">
        <div className="panelTitleRow"><div><small className="eyebrow">Number Challenge</small><h3>آزمون تصادفی اعداد</h3></div><span className="panelIcon"><Dice5 size={23}/></span></div>
        <div className="challengeSetup">
          <div><b>محدوده تمرین</b><div className="segmentedTabs">
            {[12,20,100].map(n => <button key={n} className={maximum === n ? 'active':''} onClick={()=>{setMaximum(n);setActive(false);setJudged(null)}}>{'۰ تا '+n.toLocaleString('fa-IR')}</button>)}
          </div></div>
          <div><b>نوع آزمون</b><div className="segmentedTabs">
            <button className={challenge==='write'?'active':''} onClick={()=>{setChallenge('write');setActive(false)}}><Hash size={15}/> دیدن و نوشتن</button>
            <button className={challenge==='hear'?'active':''} onClick={()=>{setChallenge('hear');setActive(false)}}><Headphones size={15}/> شنیدن و نوشتن</button>
          </div></div>
        </div>

        {!active && <div className="numberStart">
          <span className="diceArt">🎲</span>
          <h3>آماده‌ای ببینیم چندتا را بلدی؟</h3>
          <p>هر بار ۱۰ عدد متفاوت از محدوده انتخابی نمایش داده می‌شود. ترتیب سؤال‌ها در هر دور تغییر می‌کند.</p>
          <button className="primaryCTA" onClick={()=>restart()}><Sparkles size={18}/> شروع آزمون جدید</button>
        </div>}

        {active && !finished && <div className="numberExam">
          <div className="examHeader"><span>سؤال {position+1} از {questions.length}</span><strong>{score} امتیاز</strong></div>
          <div className="examTrack"><span style={{width:`${(position / questions.length)*100}%`}}/></div>
          <div className="numberQuestion">
            {challenge === 'write'
              ? <><span className="qCaption">این عدد را به آلمانی بنویس</span><strong className="hugeNumber">{current}</strong><button className="roundSound" onClick={()=>speak(germanNumber(current))}><Volume2 size={18}/> شنیدن پاسخ</button></>
              : <><span className="qCaption">با دقت گوش بده و کلمه آلمانی را بنویس</span><span className="headphoneArt"><Headphones size={45}/></span><button className="roundSound" onClick={()=>speak(germanNumber(current))}><Volume2 size={20}/> پخش عدد</button></>}
          </div>
          <label className="answerLabel" htmlFor="number-answer">جوابت را اینجا تایپ کن</label>
          <input id="number-answer" autoComplete="off" spellCheck={false} dir="ltr" className="numberAnswer"
            value={input} onChange={e => {if(judged === null)setInput(e.target.value)}}
            onKeyDown={e => {if(e.key==='Enter'){e.preventDefault();judged !== null ? next() : check()}}}
            placeholder="z. B. zwölf" disabled={judged!==null}/>
          {judged!==null && <div className={'numberFeedback '+(judged?'right':'wrong')}>
            {judged ? <Check size={21}/> : <X size={21}/>}
            <span>{judged?'درست نوشتی!':'پاسخ درست:'} <b dir="ltr">{germanNumber(current)}</b></span>
            {!judged && <button onClick={()=>speak(germanNumber(current))}><Volume2 size={17}/></button>}
          </div>}
          <button className="primaryCTA fullCTA" onClick={judged!==null?next:check} disabled={judged===null&&!input.trim()}>
            {judged!==null ? 'سؤال بعدی' : 'بررسی جواب'} <ArrowLeft size={18}/>
          </button>
        </div>}
        {finished && <div className="examFinished">
          <span className="finishIcon"><Trophy size={36}/></span>
          <h3>آزمون تمام شد!</h3>
          <strong dir="ltr">{score} / {questions.length}</strong>
          <p>{score >= 8 ? 'آفرین! آماده محدوده سخت‌تر هستی.' : 'خوب پیش می‌روی؛ روی کلمه‌هایی که جا انداختی بیشتر کار کن.'}</p>
          <button onClick={()=>restart()}><RotateCcw size={18}/> یک دور تصادفی دیگر</button>
        </div>}
      </div>

      <aside className="numbersGuide">
        <div className="guideTitle"><span>🧠</span><div><h3>میان‌بُر ذهنی</h3><p>قانون عددهای بالای ۲۰</p></div></div>
        <div className="guideExample" dir="ltr"><span>21</span><strong>ein + und + zwanzig</strong><small>einundzwanzig</small></div>
        <p>در عددهای ۲۱ تا ۹۹ (به‌جز دهگان‌های رُند)، ابتدا یکان، سپس <b>und</b>، بعد دهگان گفته می‌شود.</p>
        <div className="guideDivider"/>
        <strong>استثناهای مهم</strong>
        {[['16','sechzehn'],['17','siebzehn'],['30','dreißig'],['60','sechzig'],['70','siebzig']].map(([n,w])=>
          <button className="guideException" key={n} onClick={()=>speak(w)}><b dir="ltr">{n}</b><span dir="ltr">{w}</span><Volume2 size={16}/></button>
        )}
      </aside>
    </div>

    <div className="numberReference">
      <div className="panelTitleRow"><div><small className="eyebrow">LEARN & LISTEN</small><h3>جدول اعداد با تلفظ</h3><p>برای شنیدن هر عدد روی آن بزن.</p></div>
        <button className="softButton" onClick={()=>setStudyAll(!studyAll)}>{studyAll?'نمایش فقط ۰ تا ۲۰':'نمایش تا ۱۰۰'}</button>
      </div>
      <div className="newNumberGrid">{Array.from({length:count},(_,n)=><button key={n} onClick={()=>speak(germanNumber(n))}>
        <strong>{n}</strong><span dir="ltr">{germanNumber(n)}</span><Volume2 size={16}/></button>)}</div>
    </div>
  </section>;
}
