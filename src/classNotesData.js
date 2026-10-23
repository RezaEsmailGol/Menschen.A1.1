import { activityItemKey } from './learningMemory.js';
import { shuffleArray } from './studyEngine.js';

// Independent exercises compiled from the learner's photographed class notes.
// The sections are topical study sets, not publisher lesson numbers.
export const classSets = [
 {id:'numbers',title:'اعداد ۱۳ تا ۲۰',subtitle:'Zahlen · تشخیص و املای عدد',icon:'🔢',accent:'amber',goal:'تلفظ و املای درست sechzehn و siebzehn'},
 {id:'verbs',title:'صرف فعل‌ها',subtitle:'Verben · شش ضمیر شخصی',icon:'✍️',accent:'purple',goal:'heißen، arbeiten، haben، sein، machen، wohnen'},
 {id:'origin',title:'نام و ملیت',subtitle:'Vorstellung & Herkunft',icon:'🌍',accent:'green',goal:'تفاوت du و Sie؛ aus dem / der / den'},
 {id:'greetings',title:'حال و احوال',subtitle:'Wie geht’s? · رسمی و دوستانه',icon:'💬',accent:'sky',goal:'سؤال رسمی و دوستانه + پاسخ طبیعی'},
 {id:'classroom',title:'لغات کلاس',subtitle:'Kurswortschatz · دستورهای استاد',icon:'📚',accent:'rose',goal:'واژه‌های شنیدن، گفتن، انتخاب و صحبت در کلاس'},
];

const pairs=(set, rows)=>rows.map(([de,fa,tip],index)=>({
 id:'notes:'+set+':'+index,set,kind:set==='classroom'?'vocab':'dialogue',
 de,fa,tip:tip||'',type:'choice',key:activityItemKey(set==='classroom'?'vocab':'dialogue','class',set,index)
}));

export const numberNotes=[
 [13,'dreizehn','سه + ده'],
 [14,'vierzehn','چهار + ده'],
 [15,'fünfzehn','پنج + ده'],
 [16,'sechzehn','حرف s از sechs حذف می‌شود؛ نه sechszehn'],
 [17,'siebzehn','-en از sieben حذف می‌شود؛ نه siebenzehn'],
 [18,'achtzehn','هشت + ده'],
 [19,'neunzehn','نه + ده'],
 [20,'zwanzig','شکل ویژه دهگان بیست'],
].map(([n,de,tip])=>({
 id:'notes:number:'+n,set:'numbers',kind:'number',n,de,fa:String(n),tip,type:'type',
 key:activityItemKey('number',n)
}));

const verbData=[
 ['heißen','نام داشتن',['heiße','heißt','heißt','heißen','heißt','heißen'],'نکته: du heißt، er heißt و ihr heißt؛ بدون st مضاعف.'],
 ['arbeiten','کار کردن',['arbeite','arbeitest','arbeitet','arbeiten','arbeitet','arbeiten'],'چون ریشه به t ختم می‌شود: du arbeitest و er arbeitet.'],
 ['haben','داشتن',['habe','hast','hat','haben','habt','haben'],'در du و er/sie/es شکل فعل استثنا دارد: hast / hat.'],
 ['sein','بودن',['bin','bist','ist','sind','seid','sind'],'فعل بی‌قاعده مهم: ich bin، du bist، er ist.'],
 ['machen','انجام دادن',['mache','machst','macht','machen','macht','machen'],'فعل منظم؛ پایان‌ها -e، -st، -t، -en، -t، -en.'],
 ['wohnen','زندگی کردن',['wohne','wohnst','wohnt','wohnen','wohnt','wohnen'],'فعل منظم برای بیان محل سکونت.'],
];
export const personalPronouns=['ich','du','er/sie/es','wir','ihr','sie/Sie'];
export const verbNotes=verbData.flatMap(([verb,fa,forms,tip])=>forms.map((form,i)=>({
 id:'notes:verb:'+verb+':'+i,set:'verbs',kind:'grammar',verb,fa,pronoun:personalPronouns[i],
 de:form,tip,type:'type',key:activityItemKey('grammar',verb,personalPronouns[i])
})));
export const verbTables=verbData.map(([verb,fa,forms,tip])=>({verb,fa,forms,tip}));

export const originNotes=pairs('origin',[
 ['Wie heißen Sie?','اسم شما چیست؟ (رسمی)','Sie همیشه در خطاب محترمانه با S بزرگ نوشته می‌شود.'],
 ['Wie heißt du?','اسمت چیست؟ (دوستانه)','فعل heißen برای du به شکل heißt می‌آید.'],
 ['Wer sind Sie?','شما چه کسی هستید؟ (رسمی)','Wer سؤال «چه کسی» است؛ با Wie heißen Sie? فرق دارد.'],
 ['Wer bist du?','تو چه کسی هستی؟ (دوستانه)','sein با du به صورت bist صرف می‌شود.'],
 ['Mein Name ist Reza.','اسم من رضا است.','Name = نام؛ Vorname = نام کوچک؛ Nachname = نام خانوادگی.'],
 ['Ich heiße Reza.','نام من رضا است.','شیوه رایج معرفی خود.'],
 ['Ich bin Reza.','من رضا هستم.','برای معرفی می‌توان از sein هم استفاده کرد.'],
 ['Woher kommen Sie?','شما اهل کجا هستید؟ (رسمی)','woher = از کجا؛ خطاب رسمی: kommen Sie.'],
 ['Woher kommst du?','تو اهل کجا هستی؟ (دوستانه)','du kommst و نه du kommen.'],
 ['Woher stammen Sie?','اصل شما اهل کجاست؟ (رسمی)','stammen = اصالت داشتن / اهل جایی بودن.'],
 ['Woher stammst du?','تو اصالتاً اهل کجایی؟','du stammst و نه du stammen.'],
 ['Ich stamme aus dem Iran.','من اصالتاً اهل ایران هستم.','stammen aus + کشور برای بیان خاستگاه.'],
 ['Ich komme aus dem Iran.','من اهل ایران هستم.','در این کاربرد: aus dem Iran.'],
 ['Ich komme aus der Türkei.','من اهل ترکیه هستم.','برای Türkei از aus der استفاده می‌کنیم.'],
 ['Ich komme aus der Schweiz.','من اهل سوئیس هستم.','برای Schweiz از aus der استفاده می‌کنیم.'],
 ['Ich komme aus den USA.','من اهل آمریکا هستم.','USA در این کاربرد جمع است: aus den USA.'],
 ['der Vorname','نام کوچک','der Name / der Vorname / der Nachname'],
 ['der Nachname','نام خانوادگی','Familienname نیز یعنی نام خانوادگی.'],
 ['der Familienname','نام خانوادگی','هم‌معنی Nachname.'],
 ['die Herkunft','اصل و خاستگاه','herkommen و stammen برای بیان مبدأ کاربرد دارند.']
]);

export const greetingNotes=pairs('greetings',[
 ['Wie geht es Ihnen?','حال شما چطور است؟ (رسمی)','به شخص غریبه یا در فضای رسمی بگو.'],
 ['Wie geht’s Ihnen?','حال شما چطور است؟ (کوتاه، رسمی)','گفتاری کوتاه‌شده «Wie geht es Ihnen?».'],
 ['Wie geht es dir?','حالت چطور است؟ (دوستانه)','dir برای خطاب دوستانه است.'],
 ['Wie geht’s dir?','حالت چطور است؟ (کوتاه، دوستانه)','در گفت‌وگوی روزمره بسیار رایج است.'],
 ['Und Ihnen?','و شما چطور؟ (رسمی)','Ihnen با حرف بزرگ برای خطاب رسمی.'],
 ['Und dir?','و تو چطور؟','در مکالمه دوستانه.'],
 ['Mir geht es sehr gut.','حالم خیلی خوب است.','پاسخ طبیعی: Mir geht es ...'],
 ['Mir geht’s gut.','حالم خوب است.','«Mir geht’s» صورت کوتاه «Mir geht es» است.'],
 ['Es geht mir gut.','من حالم خوب است.','هر دو ترتیب درست‌اند.'],
 ['Super!','عالی!','پاسخ کوتاه خودمانی.'],
 ['Prima!','عالی / خیلی خوب!','پاسخ خودمانی مثبت.'],
 ['Es geht.','بد نیست / می‌گذرد.','یعنی اوضاع معمولی است.'],
 ['So lala.','معمولی / نه خوب نه بد.','در گفتار محاوره‌ای، so lala هم رایج است.'],
 ['Nicht so gut.','نه‌چندان خوب.','برای حال ناخوشایند.'],
 ['Schlecht.','بد.','صفت / پاسخ کوتاه.'],
 ['Schlimm.','خیلی بد / وخیم.','به معنی شدید یا بد بودن وضعیت است؛ همیشه جای schlecht استفاده نمی‌شود.'],
 ['Auch.','همچنین / هم.','برای گفتن «من هم» در بافت مناسب استفاده می‌شود.'],
 ['Und du?','و تو؟','در پاسخ می‌توان سؤال را برگرداند.']
]);

export const classroomNotes=pairs('classroom',[
 ['die Stunde','ساعت / جلسه درسی'],['der Kurs','دوره / کلاس'],['erst','اول / تازه / فقط (بسته به جمله)'],['zuerst','اول از همه'],
 ['kurz','کوتاه'],['sagen','گفتن'],['hören','شنیدن'],['das Lied','آهنگ / ترانه'],
 ['welche','کدام (برای اسم مؤنث یا جمع)'],['kennen','شناختن'],['noch','هنوز / دیگر'],
 ['und','و'],['ankreuzen','علامت زدن گزینه'],['die Kette','زنجیر'],
 ['das Spiel','بازی'],['das Kettenspiel','بازی زنجیره‌ای'],['sprechen','صحبت کردن'],
 ['zeichnen','نقاشی کشیدن / رسم کردن'],['der Sitzplan','نقشه جای نشستن'],
 ['notieren','یادداشت کردن'],['was','چه / چی'],['das Gespräch','گفت‌وگو'],
 ['weiter','ادامه / بیشتر'],['zuordnen','مرتبط کردن / جور کردن'],
 ['woher','از کجا'],['ergänzen','تکمیل کردن'],['vergleichen','مقایسه کردن'],
 ['mit','با'],['die Musik','موسیقی'],['das Land','کشور'],
 ['die Frau','زن / خانم'],['der Herr','آقا'],['Spanien','اسپانیا'],
 ['Mexiko','مکزیک'],['Deutschland','آلمان'],['die Schweiz','سوئیس'],
 ['Österreich','اتریش']
]);

export const classNotes=[...numberNotes,...verbNotes,...originNotes,...greetingNotes,...classroomNotes];
export const classNotesBySet=Object.fromEntries(classSets.map(s=>[s.id,classNotes.filter(item=>item.set===s.id)]));

export const classKey=(item)=>item.key;

export function noteTask(item,all=classNotes,random=Math.random){
 const seen=new Set([item.de]);
 const candidates=[...all.filter(q=>q.set===item.set),...classNotes.filter(q=>q.set===item.set),...classNotes];
 const meaningfulPool=candidates.filter(q=>{
   if(q.id===item.id||seen.has(q.de))return false;
   seen.add(q.de);return true;
 });
 const options=(item.type==='choice'||item.type==='listen')
   ? shuffleArray([item.de,...shuffleArray(meaningfulPool.map(q=>q.de),random).slice(0,3)],random)
   : null;
 return {...item,choices:options};
}
export function isNoteCorrect(item,submitted) {
 const actual=String(submitted||'').normalize('NFC').trim().toLocaleLowerCase('de').replace(/[.!?،؟]/g,'').replace(/\s+/g,' ');
 const expected=String(item.de||'').normalize('NFC').trim().toLocaleLowerCase('de').replace(/[.!?،؟]/g,'').replace(/\s+/g,' ');
 return actual===expected;
}
export function chooseNotes(items, memory={}, count=10, random=Math.random){
 const old=memory.items||{};
 const due=items.filter(item=>{
   const record=old[item.key];
   return record && (record.mastery<55 || !record.lastCorrect || record.nextAt<=Date.now());
 });
 const unseen=items.filter(item=>!old[item.key]);
 const stable=items.filter(item=>old[item.key] && !due.includes(item));
 const selected=[];
 for(const group of [due,unseen,stable]){
  for(const item of shuffleArray(group,random)){
   if(selected.length>=count)break;
   if(!selected.includes(item))selected.push(item);
  }
 }
 return selected.map(item=>noteTask(item,items,random));
}

/**
 * A round can alternate recall styles without changing a question's stable
 * memory key. Hearing before spelling is possible for numbers and vocabulary;
 * verb practice keeps a visible pronoun so the answer is never spoken aloud.
 */
export function buildClassRound(items, memory={}, mode='mixed', size=10, random=Math.random) {
 const source=chooseNotes(items,memory,size,random);
 return source.map((item,index)=>{
   const isVerb=item.set==='verbs';
   const type= mode==='write' ? 'type'
    : mode==='listen' ? (isVerb?'type':'listen')
    : isVerb||item.set==='numbers'||index%2===1 ? 'type' : 'choice';
   return {...item,type,audio:type==='listen',choices:
     type==='choice'||type==='listen' ? noteTask({...item,type:'choice'},items,random).choices : null};
 });
}

export function weakClassNotes(items=classNotes,memory={},now=Date.now()) {
 return items.filter(item=>{
  const record=memory.items?.[item.key];
  return record && (record.mastery<55 || record.lastCorrect===false || record.nextAt<=now);
 });
}

export function masteredClassNotes(items=classNotes,memory={}) {
 return items.filter(item=>{
  const m=memory.items?.[item.key];
  return m && m.mastery>=80 && m.correct>=3 && m.reviewedDays>=2;
 });
}

/** Group is shared by different question types: retaining its ID ensures
 *  answering the same concept in a different mode still trains that concept. */
export function dueClassSummary(items=classNotes,memory={},now=Date.now()) {
 const practiced=items.filter(x=>memory.items?.[x.key]);
 const weak=weakClassNotes(items,memory,now);
 return {total:items.length,practiced:practiced.length,weak:weak.length,
   mastered:masteredClassNotes(items,memory).length,unseen:items.length-practiced.length};
}
