import { allStudyCards, lessons, pronouns, verbForms } from './courseData.js';

export const REVIEW_KEY = 'dt_srs_v1';
export const COURSE_KEY = 'dt_course_v1';
export const DAY_MS = 86400000;
export const MINUTE_MS = 60000;

export function todayKey(date = new Date()) {
  const y=date.getFullYear();
  const m=String(date.getMonth()+1).padStart(2,'0');
  const d=String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

export function nextReview(previous, grade, now = Date.now()) {
  const old = previous || { repetitions:0, interval:0, ease:2.5, lapses:0 };
  const ease = Number.isFinite(old.ease) ? old.ease : 2.5;
  const previousInterval = old.interval || 0;
  let interval, repetitions, newEase, lapses = old.lapses || 0;
  if (grade === 'again') {
    interval = 10 / (60 * 24);
    repetitions = 0;
    newEase = Math.max(1.3, ease - 0.2);
    lapses += 1;
  } else if (grade === 'hard') {
    interval = Math.max(1, Math.round(previousInterval * 1.2) || 1);
    repetitions = (old.repetitions || 0) + 1;
    newEase = Math.max(1.3, ease - 0.15);
  } else if (grade === 'good') {
    repetitions = (old.repetitions || 0) + 1;
    interval = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.max(4, Math.round(previousInterval * ease));
    newEase = ease;
  } else if (grade === 'easy') {
    repetitions = (old.repetitions || 0) + 1;
    interval = repetitions === 1 ? 4 : Math.max(5, Math.round(previousInterval * (ease + 0.3)));
    newEase = Math.min(3, ease + 0.15);
  } else {
    throw new Error('Unknown review grade');
  }
  return { repetitions, interval, ease:newEase, lapses, lastReviewed:now, dueAt:now + interval * DAY_MS, grade };
}

export function dueCards(cards = allStudyCards, schedule = {}, activeLessonIds = [1], now = Date.now()) {
  const allowed = new Set(activeLessonIds.map(Number));
  return cards.filter(card => allowed.has(card.lesson) && (!schedule[card.id] || schedule[card.id].dueAt <= now))
    .sort((a,b) => {
      const ra = schedule[a.id], rb = schedule[b.id];
      if (Boolean(ra) !== Boolean(rb)) return ra ? -1 : 1;
      return (ra?.dueAt || 0) - (rb?.dueAt || 0);
    });
}

export function shuffleArray(items, random = Math.random) {
  const a = [...items];
  for(let i=a.length-1;i>0;i--) {
    const j=Math.floor(random() * (i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

export function normalizeAnswer(text) {
  return String(text).toLocaleLowerCase('de').normalize('NFC').replace(/[.!?,؛،]/g,'').replace(/\s+/g,' ').trim();
}

export function buildExam(lesson, random = Math.random) {
  const fullVocabulary = lessons.flatMap(x => x.words.map(([de]) => de));
  const allSentences = lessons.flatMap(x => x.sentences);
  const vocab = shuffleArray(lesson.words, random).slice(0,5).map(([de,fa],i) => {
    const distractors = shuffleArray([...new Set(fullVocabulary.filter(w => w !== de))],random).slice(0,3);
    return { id:`v${i}`,kind:'vocab',label:`«${fa}» به آلمانی چه می‌شود؟`,answer:de,
      choices:shuffleArray([de,...distractors],random),audio:de };
  });
  const grammar = shuffleArray(lesson.verbs,random).slice(0,2).map((verb,i) => {
    const position = Math.floor(random()*pronouns.length);
    const correct = verbForms[verb][position];
    const different = [...new Set([
      ...verbForms[verb], ...verbForms[lesson.verbs[0]], ...Object.values(verbForms).flat()
    ])].filter(x => x !== correct);
    return { id:`g${i}`,kind:'grammar',label:`صرف فعل ${verb} برای «${pronouns[position]}» چیست؟`,
      answer:correct,choices:shuffleArray([correct,...shuffleArray(different,random).slice(0,3)],random),audio:`${pronouns[position]} ${correct}` };
  });
  const meaning = shuffleArray(lesson.sentences,random).slice(0,3).map(([de,fa],i) => {
    const pool = [...new Set(allSentences.map(x=>x[1]).filter(x=>x!==fa))];
    return { id:`s${i}`,kind:'reading',label:`معنی جمله «${de}» چیست؟`,answer:fa,
      choices:shuffleArray([fa,...shuffleArray(pool,random).slice(0,3)],random),audio:de };
  });
  return shuffleArray([...vocab,...grammar,...meaning],random);
}

export function lessonComplete(progress, lessonId) {
  return Boolean(progress?.[lessonId]?.passed);
}

export function safeParse(value, fallback) {
  try { const parsed = JSON.parse(value); return parsed && typeof parsed === 'object' ? parsed : fallback; }
  catch { return fallback; }
}
