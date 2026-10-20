import React, { useMemo, useState } from 'react';
import { AudioLines, BookOpen, Check, ChevronLeft, Ear, Headphones, Lightbulb, RotateCcw, Search, Sparkles, Volume2, X } from 'lucide-react';
import { pronunciationGroups, pronunciationRules, shuffle } from './learningData';

function makeQuiz() {
  return shuffle(pronunciationRules).slice(0, 8).map(rule => ({
    ...rule,
    choices: shuffle([rule.word, ...shuffle(pronunciationRules.filter(r => r.id !== rule.id).map(r => r.word)).slice(0, 3)]),
  }));
}

export default function PronunciationLab({ speak }) {
  const [mode, setMode] = useState('rules');
  const [group, setGroup] = useState('all');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState('v');
  const [quiz, setQuiz] = useState(() => makeQuiz());
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const filtered = useMemo(() => pronunciationRules.filter(r =>
    (group === 'all' || r.group === group) &&
    [r.symbol, r.word, r.contrast, r.title, r.note, r.meaning].join(' ').toLowerCase().includes(search.toLowerCase())
  ), [group, search]);

  const current = quiz[index];
  const choose = choice => {
    if (answer !== null) return;
    setAnswer(choice);
    if (choice === current.word) setScore(x => x + 1);
  };
  const next = () => { setIndex(x => x + 1); setAnswer(null); };
  const reset = () => { setQuiz(makeQuiz()); setIndex(0); setAnswer(null); setScore(0); setMode('quiz'); };

  return <section className="labPage">
    <div className="soundHero">
      <div className="soundHeroCopy">
        <span className="sectionKicker"><AudioLines size={17}/> Pronunciation Studio · Lektion 1</span>
        <h2>صداها را <em>درست بشنو،</em> درست بگو.</h2>
        <p>قواعد تلفظ و استثناهای جلسه اول استاد، همراه با مثال واقعی، صدای آلمانی و تمرین شنیداری.</p>
        <div className="soundHeroBadges"><span>۲۴ نکته آموزشی</span><span>تفاوت‌های مهم اتریشی</span><span>تمرین شنیداری</span></div>
      </div>
      <div className="soundHeroArt" aria-hidden="true">
        <div className="soundPulse"><AudioLines size={58} strokeWidth={1.7}/></div>
        <div className="soundBubble bubbleOne">ei <small>/aɪ̯/</small></div>
        <div className="soundBubble bubbleTwo">ch <small>/ç/</small></div>
        <div className="soundBubble bubbleThree">ß <small>/s/</small></div>
      </div>
    </div>

    <div className="lessonModeTabs">
      <button className={mode === 'rules' ? 'chosen' : ''} onClick={() => setMode('rules')}><BookOpen size={17}/> قوانین و استثناها</button>
      <button className={mode === 'quiz' ? 'chosen' : ''} onClick={() => setMode('quiz')}><Headphones size={17}/> آزمون شنیداری</button>
    </div>

    {mode === 'rules' ? <>
      <div className="ruleTools">
        <div className="chipFilters">{pronunciationGroups.map(x =>
          <button key={x.id} className={group === x.id ? 'active' : ''} onClick={() => setGroup(x.id)}>{x.label}</button>
        )}</div>
        <label className="ruleSearch"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="مثلاً ch یا Vater..." /></label>
      </div>
      <div className="ruleGrid">
        {filtered.map((rule, idx) => <article className={'ruleCard ' + (open === rule.id ? 'expanded' : '')} key={rule.id}>
          <div className="ruleCardTop">
            <div className="ruleSymbol" dir="ltr">{rule.symbol}</div>
            <div className="ruleHeading"><small>{rule.group === 'exceptions' ? 'استثنا / نکته مهم' : rule.group === 'vowels' ? 'صدای مصوت' : 'قاعده تلفظ'}</small><h3>{rule.title}</h3></div>
            <span className="ipaTag" dir="ltr">{rule.sound}</span>
          </div>
          <button className="ruleExample" onClick={() => speak(rule.word)} aria-label={'پخش '+rule.word}>
            <div><b dir="ltr">{rule.word}</b><span>{rule.meaning}</span><small dir="ltr">{rule.ipa}</small></div>
            <span className="rulePlay"><Volume2 size={20}/></span>
          </button>
          <p className="ruleNote">{rule.note}</p>
          {open === rule.id && <div className="ruleException">
            <span className="warningTitle"><Lightbulb size={16}/> مقایسه و نکته</span>
            <p>{rule.exception}</p>
            <button onClick={() => speak(rule.contrast)}><Volume2 size={15}/> <span dir="ltr">{rule.contrast}</span><small dir="ltr">{rule.contrastIpa}</small></button>
          </div>}
          <button className="ruleExpand" onClick={() => setOpen(open === rule.id ? null : rule.id)}>
            {open === rule.id ? 'بستن نکته' : 'نمایش استثنا و مقایسه'} <ChevronLeft size={16}/>
          </button>
        </article>)}
      </div>
      {!filtered.length && <div className="emptyState">موردی پیدا نشد؛ عبارت دیگری را جست‌وجو کن.</div>}
      <div className="lessonTip"><Sparkles size={19}/><div><b>روش مطالعه پیشنهادی</b><p>هر کلمه را دو بار گوش بده؛ بار اول فقط گوش کن و بار دوم هم‌زمان تکرار کن. بعد تفاوت آن با مثال استثنا را مقایسه کن.</p></div></div>
    </> : <div className="earTraining">
      {index < quiz.length ? <>
        <div className="examHeader"><span>شنیدن و تشخیص واژه</span><strong dir="ltr">{index + 1} / {quiz.length}</strong></div>
        <div className="examTrack"><span style={{width:`${100 * index / quiz.length}%`}}/></div>
        <div className="earIcon"><Ear size={36}/></div>
        <h3>کدام واژه را می‌شنوی؟</h3>
        <p>صدا را پخش کن و گزینه درست را انتخاب کن.</p>
        <button className="largeAudio" onClick={() => speak(current.word)}><Volume2 size={23}/> گوش دادن دوباره</button>
        <div className="audioChoices">{current.choices.map(choice =>
          <button key={choice} disabled={answer !== null}
            className={answer === null ? '' : choice === current.word ? 'correct' : choice === answer ? 'incorrect' : ''}
            onClick={() => choose(choice)} dir="ltr">
            {choice}{answer !== null && choice === current.word && <Check size={18}/>}
            {answer === choice && choice !== current.word && <X size={18}/>}
          </button>)}
        </div>
        {answer !== null && <div className={'answerFeedback ' + (answer === current.word ? 'success' : 'failure')}>
          <b>{answer === current.word ? 'آفرین! درست شنیدی.' : 'این بار نه؛ دوباره گوش بده.'}</b>
          <span dir="ltr">{current.word} · {current.ipa}</span>
          <p>{current.note}</p>
          <button onClick={next}>سؤال بعدی <ChevronLeft size={16}/></button>
        </div>}
        <div className="examFooter"><span>پاسخ درست: {score}</span><button className="ghostButton" onClick={reset}><RotateCcw size={14}/> شروع مجدد</button></div>
      </> : <div className="examFinished">
        <span className="finishIcon"><Sparkles size={36}/></span>
        <h3>آزمون تلفظ تمام شد!</h3>
        <strong dir="ltr">{score} / {quiz.length}</strong>
        <p>{score >= 7 ? 'عالی! تفاوت صداها را خوب تشخیص می‌دهی.' : 'برای قوی‌تر شدن، کارت‌های قوانین را یک بار دیگر مرور کن.'}</p>
        <button onClick={reset}><RotateCcw size={17}/> آزمون تازه و تصادفی</button>
        <button className="softButton" onClick={() => setMode('rules')}>مرور قانون‌ها</button>
      </div>}
    </div>}
  </section>;
}
