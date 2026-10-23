// Local-first learner memory. No account, external tracking or server required.
// Every entry is keyed to one stable learning item and can be reviewed independently.
export const MEMORY_KEY = 'dt_mastery_v1';
const DAY = 86400000;

export function localDay(timestamp = Date.now()) {
  const d = new Date(timestamp);
  return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
}

export function activityItemKey(kind, ...parts) {
  return [kind, ...parts].map(x => encodeURIComponent(String(x))).join(':');
}

export function recordActivity(previous, event, now = Date.now()) {
  if (!event || !event.id || !event.kind || typeof event.correct !== 'boolean') throw new Error('Invalid learning event');
  const state = previous && typeof previous === 'object' ? previous : {};
  const items = state.items && typeof state.items === 'object' ? state.items : {};
  const before = items[event.id] || {};
  const correct = event.correct;
  const formerMastery = Math.max(0, Math.min(100, Number(before.mastery) || 0));
  // Repetition immediately after an answer is useful practice, but not proof of long-term retention.
  const rapidRepeat=Boolean(before.lastAt && now-before.lastAt < 15*60000);
  const gain=event.grade==='easy' ? 27 : event.grade==='hard' ? 11 : 21;
  const strength = correct
    ? Math.min(100, formerMastery + (rapidRepeat ? Math.min(8,gain) : gain))
    : Math.max(0, formerMastery - (event.grade === 'again' ? 20 : 24));
  const wins = (Number(before.correct) || 0) + (correct ? 1 : 0);
  const misses = (Number(before.wrong) || 0) + (correct ? 0 : 1);
  const consecutive = correct ? (Number(before.streak) || 0) + 1 : 0;
  const interval = !correct ? 10 * 60000 :
    strength >= 80 ? 5 * DAY : strength >= 55 ? 2 * DAY : 12 * 3600000;
  const currentDay=localDay(now);
  const reviewedDays=(Number(before.reviewedDays)||0)+(before.lastDay!==currentDay ? 1 : 0);
  const updated = {
    reviewedDays,lastDay:currentDay,
    id:event.id, kind:event.kind, label:String(event.label || before.label || ''),
    lesson:Number(event.lesson ?? before.lesson ?? 0),
    mastery:strength, correct:wins, wrong:misses, attempts:wins + misses,
    streak:consecutive, lastAt:now, nextAt:now+interval,
    lastCorrect:correct
  };
  const date = localDay(now);
  const days = state.days && typeof state.days === 'object' ? state.days : {};
  const earlierDay=days[date] || {attempts:0,correct:0,xp:0};
  const xp = correct ? 10 : 2;
  return {
    version:1,
    items:{...items,[event.id]:updated},
    days:{...days,[date]:{
      attempts:earlierDay.attempts+1,correct:earlierDay.correct+(correct?1:0),xp:earlierDay.xp+xp
    }},
    totalXP:(Number(state.totalXP)||0)+xp,
    history:[...(Array.isArray(state.history)?state.history:[]).slice(-299),
      {id:event.id,kind:event.kind,correct,at:now}],
  };
}

export function learningInsights(memory={}, now=Date.now()) {
  const items=Object.values(memory.items||{});
  const practiced=items.filter(x=>x.attempts>0);
  const mastered=practiced.filter(x=>x.mastery>=80 && x.correct>=3 && x.reviewedDays>=2);
  const weak=practiced.filter(x=>x.mastery<55 || x.wrong>x.correct);
  const due=practiced.filter(x=>x.nextAt<=now);
  const day=localDay(now), today=memory.days?.[day]||{attempts:0,correct:0,xp:0};
  const dates=new Set(Object.keys(memory.days||{}).filter(k=>memory.days[k]?.attempts>0));
  let streak=0;
  const start=new Date(now); start.setHours(12,0,0,0);
  if(!dates.has(localDay(start.getTime()))) start.setDate(start.getDate()-1);
  for(let i=0;i<365;i++){
    const dayKey=localDay(start.getTime());
    if(!dates.has(dayKey)) break;
    streak++;
    start.setDate(start.getDate()-1);
  }
  const byType=['vocab','grammar','sentence','reading','number','dictation','pronunciation','dialogue','visual'].map(kind=>{
    const list=practiced.filter(x=>x.kind===kind);
    return {kind,attempts:list.reduce((s,x)=>s+x.attempts,0),mastered:list.filter(x=>x.mastery>=80&&x.correct>=3&&x.reviewedDays>=2).length,
      weak:list.filter(x=>x.mastery<55).length};
  });
  return {
    practiced:practiced.length,mastered:mastered.length,weak:weak.length,due:due.length,
    totalXP:Number(memory.totalXP)||0,level:Math.floor((Number(memory.totalXP)||0)/200)+1,
    xpIntoLevel:(Number(memory.totalXP)||0)%200,
    today,streak,byType,
    weakItems:weak.sort((a,b)=>a.mastery-b.mastery||b.wrong-a.wrong).slice(0,8),
    dueItems:due.sort((a,b)=>a.nextAt-b.nextAt).slice(0,8)
  };
}

export function chooseAdaptiveNumbers(maximum, memory={}, size=10, random=Math.random) {
  const numbers=Array.from({length:maximum+1},(_,i)=>i);
  const keys=memory.items||{};
  const weak=numbers.filter(n=>{
    const item=keys[activityItemKey('number',n)];
    return item && (item.mastery<55 || item.lastCorrect===false || item.nextAt<=Date.now());
  });
  const shuffle=arr=>{
    const copy=[...arr];
    for(let i=copy.length-1;i>0;i--){
      const j=Math.floor(random()*(i+1));
      [copy[i],copy[j]]=[copy[j],copy[i]];
    }
    return copy;
  };
  const prioritized=shuffle(weak).slice(0,Math.min(Math.floor(size*0.6),weak.length));
  const chosen=new Set(prioritized);
  return [...prioritized,...shuffle(numbers.filter(n=>!chosen.has(n))).slice(0,Math.min(size,numbers.length)-chosen.size)];
}

export function learningItemDestination(item) {
 const id=String(item?.id||'');
 if(id.includes(':class:')||id.startsWith('notes:'))return 'classNotes';
 // Teacher's six conjugation tables use the historical stable grammar IDs.
 // Keep their old mastery entries and route mistakes to the exact class workbook.
 if(/^grammar:(hei%C3%9Fen|arbeiten|haben|sein|machen|wohnen):/.test(id))return 'classNotes';
 const routes={
   number:'numbers',grammar:'verbs',sentence:'builder',reading:'exam',
   pronunciation:'pronunciation',dialogue:'dialogues',dictation:'listen',
   visual:'visual',vocab:'srs'
 };
 return routes[item?.kind]||'practice';
}

export function recommendedRoute(insights, scheduleDue=0) {
 // Explicit spaced-repetition cards always belong to the SRS review screen.
 if(scheduleDue>0)return {page:'srs',label:'مرور فلش‌کارت‌های موعددار',why:'واژه‌های موعددار آماده مرور هستند'};
 const today=insights?.today?.attempts||0;
 const overdue=insights?.dueItems?.[0];
 if(overdue){
   const page=learningItemDestination(overdue);
   return {page,label:'مرور '+(overdue.label||'مطلب فراموش‌شده'),
     why:'زمان مرور این مهارت رسیده است'};
 }
 const weak=insights?.weakItems?.[0];
 if(weak && today>=3) {
   const page=learningItemDestination(weak);
   return {page,label:'تقویت '+(weak.label||'مهارت ضعیف'),
     why:'این مورد در پاسخ‌های قبلی نیازمند تمرین بیشتر بوده است'};
 }
 if(today<3)return {page:'course',label:'ادامه درس امروز',why:'با چند دقیقه درس جدید شروع کن'};
 return {page:'exam',label:'آزمون درس امروز',why:'وقت سنجش مطالبی است که یاد گرفته‌ای'};
}
