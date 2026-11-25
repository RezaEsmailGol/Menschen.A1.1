import {formatClock,toFormal,toColloquial,parseClock} from './lesson8MinuteEngine.js';

export const TEACHER_BOARD_KEY='dt_teacher_clock_board_v1';

// Based on the learner's classroom whiteboard: 16:00 -> 17:00, in five-minute steps.
export const TEACHER_CLOCK_TIMES=Object.freeze(Array.from({length:13},(_,i)=>{
 const hour=i===12?17:16;
 const minute=i===12?0:i*5;
 const time=formatClock(hour,minute);
 return Object.freeze({
  time,
  formal:toFormal(hour,minute),
  colloquial:toColloquial(hour,minute),
  kind:minute===0?'uhr':minute===30?'halb':minute===25?'vor-halb':minute===35?'nach-halb':
   minute<30?'nach':'vor'
 });
}));

export const TEACHER_WEEKDAYS=Object.freeze([
 ['Montag','دوشنبه'],['Dienstag','سه‌شنبه'],['Mittwoch','چهارشنبه'],
 ['Donnerstag','پنجشنبه'],['Freitag','جمعه'],['Samstag','شنبه'],['Sonntag','یکشنبه']
].map(([de,fa])=>Object.freeze({de,fa,phrase:'am '+de})));

export const TEACHER_DAY_PARTS=Object.freeze([
 ['Morgen','صبح','am Morgen'],['Vormittag','قبل از ظهر','am Vormittag'],
 ['Mittag','ظهر','am Mittag'],['Nachmittag','بعدازظهر','am Nachmittag'],
 ['Abend','عصر / شب','am Abend'],['Nacht','شب / نیمه‌شب','in der Nacht']
].map(([de,fa,phrase])=>Object.freeze({de,fa,phrase})));

export const TEACHER_VERBS=Object.freeze([
 {id:'sehen',meaning:'دیدن',example:'Siehst du heute Abend deinen Lieblingsfilm?',
  forms:[['ich','sehe'],['du','siehst'],['er/sie/es','sieht'],['wir','sehen'],['ihr','seht'],['sie/Sie','sehen']]},
 {id:'wissen',meaning:'دانستن',example:'Kommt er zum Kurs? Ich weiß nicht.',
  forms:[['ich','weiß'],['du','weißt'],['er/sie/es','weiß'],['wir','wissen'],['ihr','wisst'],['sie/Sie','wissen']]}
]);

export const BOARD_TOPICS=Object.freeze([
 {id:'clock',label:'ساعت تخته استاد',description:'رسمی و محاوره‌ای؛ هر ۵ دقیقه از ۱۶ تا ۱۷'},
 {id:'when',label:'Wann? · روز و زمان',description:'am، um و in der Nacht'},
 {id:'verbs',label:'sehen / wissen',description:'صرف دقیق فعل‌های کلاس'}
]);

const question=(id,topic,prompt,answer,explanation,display,say=answer)=>({
 id,topic,prompt,answer,explanation,display,say
});

export function boardQuestionBank(topic='clock',style='both'){
 if(topic==='clock'){
  if(!['formal','colloquial','both'].includes(style))throw new Error('Unsupported clock style');
  return TEACHER_CLOCK_TIMES.flatMap(row=>(
   (style==='both'?['formal','colloquial']:[style]).map(type=>question(
    'clock:'+row.time+':'+type,'clock',
    type==='formal'?'ساعت را رسمی و دقیق به آلمانی بنویس.':'ساعت را به شکل محاوره‌ای به آلمانی بنویس.',
    row[type],
    type==='formal'
      ?'در ساعت رسمی، ساعتِ ۲۴ساعته + Uhr + دقیقه را می‌خوانیم.'
      :row.kind==='vor-halb'?'۲۵ دقیقه یعنی fünf vor halb و ساعت بعد.'
      :row.kind==='nach-halb'?'۳۵ دقیقه یعنی fünf nach halb و ساعت بعد.'
      :row.kind==='halb'?'halb به ساعت بعد اشاره می‌کند؛ ۱۶:۳۰ = halb fünf.'
      :row.kind==='nach'?'nach یعنی دقیقه بعد از ساعت جاری.'
      :row.kind==='vor'?'vor یعنی دقیقه مانده به ساعت بعد.'
      :'در رأس ساعت می‌گوییم vier Uhr یا fünf Uhr.',
    row.time
   ))
  ));
 }
 if(topic==='when'){
  return [
   ...TEACHER_WEEKDAYS.map(row=>question('when:day:'+row.de,'when',
    'برای «'+row.fa+'» عبارت زمان درست با حرف اضافه را بنویس.',row.phrase,
    'برای روزهای هفته am + روز می‌آید.',row.fa)),
   ...TEACHER_DAY_PARTS.map(row=>question('when:part:'+row.de,'when',
    'برای «'+row.fa+'» عبارت زمان را با حرف اضافه بنویس.',row.phrase,
    row.de==='Nacht'?'استثنای مهم: in der Nacht؛ نه am Nacht.':'برای این بخش روز از am استفاده می‌کنیم.',row.fa)),
   question('when:weekend','when','«آخر هفته» را با حرف اضافه درست بنویس.','am Wochenende','آخر هفته = am Wochenende.','آخر هفته'),
   question('when:hour','when','«در ساعت ۱۹:۰۰» را به آلمانی بنویس.','um 19:00 Uhr','برای زمان دقیق از um استفاده می‌شود.','۱۹:۰۰'),
   question('when:evening','when','«چهارشنبه عصر» را با حرف اضافه درست بنویس.','am Mittwochabend','روز + بخش روز می‌تواند ترکیب شود: Mittwochabend.','چهارشنبه عصر'),
   question('when:appointment','when',
    'بنویس: چهارشنبه عصر ساعت ۱۹:۰۰ وقت پزشک دارم.',
    'Am Mittwochabend um 19:00 Uhr habe ich einen Arzttermin.',
    'برای روز am، برای ساعت um؛ فعل habe در جمله خبری بعد از عبارت‌های زمان قرار دارد.',
    'چهارشنبه عصر · ۱۹:۰۰')
  ];
 }
 if(topic==='verbs'){
  return [
   ...TEACHER_VERBS.flatMap(verb=>verb.forms.map(([person,form],index)=>question(
    'verbs:'+verb.id+':'+index,'verbs',
    person+' ___ ('+verb.id+') — شکل درست فعل را بنویس.',
    form,verb.id==='wissen'&&person==='ihr'
     ?'در آلمانی معیار: ihr wisst؛ نه ihr weißt.'
     :verb.id==='sehen'&&['du','er/sie/es'].includes(person)
      ?'در sehen برای du و er/sie/es ریشه e → ie تغییر می‌کند.'
      :'صرف فعل را با ضمیر مطابقت بده.',
    person+' · '+verb.meaning
   ))),
   question('verbs:film','verbs','جمله را کامل بنویس: «امشب فیلم محبوبت را می‌بینی؟»',
    'Siehst du heute Abend deinen Lieblingsfilm?',
    'پس از sehen، مفعول مذکر deinen Lieblingsfilm در Akkusativ می‌آید.','فیلم محبوب · امشب'),
   question('verbs:know','verbs','جمله «نمی‌دانم» را به آلمانی بنویس.',
    'Ich weiß nicht.','فاعل ich همراه با weiß می‌آید.','نمی‌دانم')
  ];
 }
 throw new Error('Unknown board topic');
}

export function normalizeBoardAnswer(value){
 return String(value??'').normalize('NFC').toLocaleLowerCase('de-DE')
  .trim().replace(/[.!?؟]+$/g,'').replace(/\s+/g,' ');
}
export function isBoardAnswerCorrect(value,task){
 if(!task?.answer)return false;
 const answer=normalizeBoardAnswer(task.answer);
 const actual=normalizeBoardAnswer(value);
 // The classroom model often begins time answers with "Es ist".
 return actual===answer||(task.topic==='clock'&&actual.replace(/^es ist\s+/,'')===answer);
}
export function boardRecord(previous={},task,correct,at=Date.now()){
 if(!task?.id||typeof correct!=='boolean')throw new Error('Invalid board attempt');
 const old=previous[task.id]||{};
 return {...previous,[task.id]:{
  attempts:(old.attempts||0)+1,wrong:(old.wrong||0)+Number(!correct),
  lastCorrect:correct,streak:correct?(old.streak||0)+1:0,lastAt:at
 }};
}
export function boardWeakQuestions(topic,style,records={}){
 return boardQuestionBank(topic,style).filter(task=>records[task.id]?.lastCorrect===false);
}
export function shuffledBoardQuestions(items,random=Math.random){
 const out=[...items];
 for(let i=out.length-1;i>0;i--){
  const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));
  [out[i],out[j]]=[out[j],out[i]];
 }
 return out;
}
export function boardRound(topic,style,records={},onlyWeak=false,random=Math.random){
 const all=boardQuestionBank(topic,style);
 const weak=all.filter(task=>records[task.id]?.lastCorrect===false);
 const others=onlyWeak?[]:all.filter(task=>!weak.some(w=>w.id===task.id));
 return [...shuffledBoardQuestions(weak,random),...shuffledBoardQuestions(others,random)]
  .slice(0,onlyWeak?24:12);
}
export function saveBoardRecords(storage,records){
 try{storage?.setItem(TEACHER_BOARD_KEY,JSON.stringify(records));return true;}
 catch{return false;}
}
export function loadBoardRecords(storage){
 try{
  const data=JSON.parse(storage?.getItem(TEACHER_BOARD_KEY)||'{}');
  return data&&typeof data==='object'&&!Array.isArray(data)?data:{};
 }catch{return {};}
}
export function analogClockHands(value){
 const time=parseClock(String(value));
 if(!time)throw new Error('Invalid time for dial');
 const point=(angle,radius)=>{
  const radians=angle*Math.PI/180;
  return {x:120+Math.sin(radians)*radius,y:120-Math.cos(radians)*radius};
 };
 return {hour:point((time.hour%12+time.minute/60)*30,55),
  minute:point(time.minute*6,84)};
}
