// Source reference: user's Menschen A1.1 Arbeitsbuch OCR.pdf (102 PDF pages).
// Printed pages are PDF page + 4 for lesson exercises. This is NOT Kursbuch.
// The tasks are short, original interactive adaptations of the printed topics,
// not verbatim reproductions of copyrighted exercises or audio.
export const ARBEITSBUCH_KEY='dt_arbeitsbuch_studio_v1';
export const ARBEITSBUCH_SOURCE='Menschen A1.1 · Arbeitsbuch';
export const ARBEITSBUCH_NOTE='تمرین‌های دیجیتال تألیفی، مطابق موضوع و شماره صفحه کتاب کار؛ متن، تصویر و صوت چاپی عیناً بازنشر نشده‌اند.';

const f=(page,title,prompt,answer,fa,tip,section='Basistraining')=>({page,title,kind:'fill',prompt,answer,fa,tip,section});
const c=(page,title,prompt,options,answer,fa,tip,section='Basistraining')=>({page,title,kind:'choice',prompt,options,answer,fa,tip,section});
const o=(page,title,words,answer,fa,tip,section='Basistraining')=>({page,title,kind:'order',words,answer,fa,tip,section});
const w=(page,title,prompt,example,fa,tip,section='Training: Schreiben')=>({page,title,kind:'writing',prompt,example,fa,tip,section});
const lessons=[
 {id:1,title:'Hallo! Ich bin Nicole ...',start:6,end:11,topic:'سلام، کشور، نام و صرف فعل',tasks:[
  f(6,'اسم من ... است','Ich ___ Sara.','heiße','من سارا نام دارم.','heißen → ich heiße'),
  c(7,'اهل کجایی؟','Woher kommst du?',['Ich komme aus dem Iran.','Ich bin 30 Jahre alt.','Mir geht es gut.'],'Ich komme aus dem Iran.','اهل ایران هستم.','Woher → مکان / کشور'),
  f(8,'صرف فعل kommen','Du ___ aus Österreich.','kommst','تو اهل اتریش هستی.','برای du پایان -st می‌آید.'),
  o(9,'پرسیدن نام',['heißt','Wie','du','?'],'Wie heißt du?','اسمت چیست؟','فعل صرف‌شده بعد از کلمه پرسشی می‌آید.'),
  w(10,'معرفی در سه جمله','Schreibe deinen Namen, deine Herkunft und dein Befinden.','Ich heiße Reza. Ich komme aus dem Iran. Mir geht es gut.','نام، کشور و حالت را در سه جمله معرفی کن.','به ترتیب ich heiße / ich komme / mir geht es', 'Test')
 ]},
 {id:2,title:'Ich bin Journalistin.',start:12,end:17,topic:'شغل، سن، محل کار، اعداد',tasks:[
  f(12,'شغل و arbeiten als','Ich arbeite ___ Programmierer.','als','من به‌عنوان برنامه‌نویس کار می‌کنم.','معرفی شغل بعد از arbeiten با als است.'),
  c(13,'وضعیت تأهل','Was bedeutet verheiratet?',['متأهل','مجرد','بیکار'],'متأهل','معنی verheiratet چیست؟','verheiratet = متأهل'),
  f(14,'اعداد','Sie ist ___ Jahre alt.','dreißig','او ۳۰ سال دارد.','۳۰ = dreißig'),
  o(15,'پرسیدن شغل',['arbeitest','Wo','du','?'],'Wo arbeitest du?','کجا کار می‌کنی؟','Wo + فعل + فاعل'),
  w(16,'Steckbrief · کارت معرفی','Schreibe einen kurzen Steckbrief: Beruf, Wohnort, Alter.','Ich bin Softwareentwickler. Ich wohne in Qom. Ich bin 30 Jahre alt.','شغل، شهر و سنت را معرفی کن.','جملات شخصی باید با اطلاعات واقعی تو تنظیم شوند.','Test')
 ]},
 {id:3,title:'Das ist meine Mutter.',start:18,end:23,topic:'اعضای خانواده، mein/meine، doch',tasks:[
  c(18,'mein یا meine؟','Das ist ... Mutter.',['mein','meine','meinen'],'meine','این مادر من است.','Mutter مؤنث است؛ meine'),
  f(19,'خانواده','Das ist ___ Vater.','mein','این پدر من است.','Vater مذکر؛ mein'),
  c(20,'Nein یا Doch؟','Das ist nicht deine Schwester! — ...',['Ja','Nein','Doch'],'Doch','چرا، این خواهر من است!','در پاسخ مثبت به جمله منفی از Doch استفاده کن.'),
  o(21,'سؤال درباره خانواده',['deine','heißt','Wie','Schwester','?'],'Wie heißt deine Schwester?','اسم خواهرت چیست؟','Wie + فعل + فاعل'),
  w(22,'معرفی خانواده','Schreibe drei Sätze über deine Familie.','Das ist mein Vater. Meine Mutter heißt Mina. Ich habe einen Bruder.','سه جمله درباره خانواده بنویس.','درستی mein/meine را با جنس اسم بررسی کن.','Test')
 ]},
 {id:4,title:'Der Tisch ist schön!',start:30,end:35,topic:'مبلمان، قیمت، اعداد بزرگ',tasks:[
  f(30,'قیمت کالا','Wie viel ___ der Stuhl?','kostet','صندلی چقدر قیمت دارد؟','kosten → er/es kostet'),
  c(31,'خواندن عدد','Wie heißt 350?',['dreihundertfünfzig','dreißigfünfzig','dreitausendfünf'],'dreihundertfünfzig','سیصد و پنجاه را بخوان.','100 = hundert'),
  f(32,'توصیف قیمت','Das Sofa ist sehr ___.','günstig','مبل بسیار ارزان است.','günstig = به‌صرفه / ارزان'),
  o(33,'سؤال درباره صندلی',['kostet','der','Was','Stuhl','?'],'Was kostet der Stuhl?','صندلی چند است؟','Was kostet ...?'),
  w(34,'پیامک درباره خرید','Schreibe eine kurze Nachricht über ein Möbelstück und seinen Preis.','Hallo! Der Tisch kostet 80 Euro. Er ist sehr schön.','درباره قیمت و زیبایی یک وسیله پیام بده.','از kost(et)، teuer، günstig استفاده کن.','Test')
 ]},
 {id:5,title:'Was ist das? – Das ist ein F.',start:36,end:41,topic:'وسایل، آرتیکل‌ها، رنگ و جنس',tasks:[
  c(36,'آرتیکل وسایل','Das ist ... Bleistift.',['ein','eine','einen'],'ein','این یک مداد است.','der Bleistift → ein Bleistift'),
  f(37,'منفی‌سازی اسم','Das ist ___ Buch.','kein','این کتاب نیست.','das Buch → kein Buch'),
  c(38,'رنگ‌ها','Welche Farbe ist blau?',['آبی','قرمز','سبز'],'آبی','blau چه رنگی است؟','blau = آبی'),
  o(39,'ساخته شده از ...',['aus','ist','Die Tasche','Plastik','.'],'Die Tasche ist aus Plastik.','کیف از پلاستیک است.','aus + جنس ماده'),
  w(40,'توصیف یک شیء','Beschreibe einen Gegenstand: Name, Farbe, Material.','Das ist eine Tasche. Sie ist rot und aus Plastik.','یک وسیله را با آرتیکل و رنگ و جنس توصیف کن.','برای اسم مؤنث: eine، sie','Test')
 ]},
 {id:6,title:'Ich brauche kein Büro.',start:42,end:47,topic:'وسایل دفتر، جمع اسم، Akkusativ',tasks:[
  f(42,'واژگان دفتر','Ich brauche einen ___.','Drucker','یک چاپگر لازم دارم.','der Drucker → einen Drucker'),
  c(43,'جمع اسم','Plural von der Stuhl?',['die Stühle','die Stuhls','die Stuhlen'],'die Stühle','جمع Stuhl چیست؟','Stuhl → Stühle'),
  f(44,'Akkusativ منفی','Ich habe ___ Laptop.','keinen','من لپ‌تاپ ندارم.','der Laptop → keinen Laptop'),
  o(46,'جمله با brauchen',['brauche','Ich','einen','Computer','.'],'Ich brauche einen Computer.','من به یک کامپیوتر احتیاج دارم.','مفعول مذکر در Akkusativ: einen', 'Test'),
  w(47,'وسایل میز کار','Schreibe drei Dinge, die du im Büro brauchst.','Ich brauche einen Laptop, eine Maus und einen Stift.','سه وسیله لازم برای دفترت را بنویس.','به einen / eine / ein توجه کن.','Lernwortschatz')
 ]},
 {id:7,title:'Du kannst wirklich toll ...',start:54,end:59,topic:'سرگرمی، توانایی و können',tasks:[
  f(54,'نام سرگرمی','Am Wochenende gehe ich ___.','schwimmen','آخر هفته شنا می‌کنم.','schwimmen gehen'),
  c(55,'können برای du','Du ... gut tanzen.',['kannst','kann','können'],'kannst','تو خوب می‌رقصی.','du kannst'),
  f(56,'تعریف از توانایی','Du kannst wirklich ___ kochen.','toll','واقعاً عالی آشپزی می‌کنی.','toll = عالی'),
  o(57,'ناتوانی',['nicht','Ich','singen','kann','gut','.'],'Ich kann nicht gut singen.','من خوب آواز نمی‌خوانم.','فعل اصلی در پایان جمله','Test'),
  w(58,'نامه درباره سرگرمی‌ها','Schreibe zwei Hobbys und eine Fähigkeit.','Ich spiele gern Fußball. Ich kann gut kochen.','دو سرگرمی و یک مهارتت را بنویس.','gern و können را تمرین کن.','Lernwortschatz')
 ]},
 {id:8,title:'Kein Problem. Ich habe Zeit!',start:60,end:65,topic:'ساعت، روزها، قرار ملاقات و رد دعوت',tasks:[
  f(60,'قرار در یک روز','Hast du ___ Montag Zeit?','am','دوشنبه وقت داری؟','am Montag؛ نه in Montag'),
  c(61,'ساعت محاوره','Es ist halb neun. Wie spät ist es?',['08:30','09:30','08:15'],'08:30','halb neun یعنی چند؟','نیم ساعت مانده به نه = ۸:۳۰'),
  f(62,'زمان ملاقات','Wir treffen uns ___ fünf Uhr.','um','ساعت پنج یکدیگر را می‌بینیم.','um + Uhrzeit'),
  o(63,'پرسش درباره وقت',['du','am','Zeit','Freitag','Hast','?'],'Hast du am Freitag Zeit?','جمعه وقت داری؟','Hast du + am + روز + Zeit?','Training: Lesen'),
  c(64,'رد مؤدبانه','Wie sagst du höflich ab?',['Leider habe ich keine Zeit.','Ja, natürlich!','Super, bis dann!'],'Leider habe ich keine Zeit.','چطور مؤدبانه قرار را رد می‌کنی؟','leider = متأسفانه','Test'),
  w(64,'پیام برای تغییر قرار','Schreibe eine kurze Absage und einen neuen Vorschlag.','Tut mir leid, am Freitag habe ich keine Zeit. Geht es am Samstag um vier Uhr?','قرار جمعه را رد و ساعت دیگری پیشنهاد کن.','Tut mir leid / Geht es ...?','Test'),
  c(65,'ساعت روزانه','Was heißt am Vormittag?',['قبل از ظهر','شب','بعد از ظهر'],'قبل از ظهر','Vormittag یعنی چه زمانی؟','Vormittag = قبل از ظهر','Lernwortschatz')
 ]},
 {id:9,title:'Ich möchte was essen, Onkel Harry.',start:66,end:71,topic:'غذا، خوردن، دوست‌داشتن، سفارش',tasks:[
  f(66,'غذاهای روزانه','Zum Frühstück esse ich ___.','Brot','صبحانه نان می‌خورم.','zum Frühstück'),
  c(67,'mögen','Ich ... Kaffee.',['mag','möchtest','mögen'],'mag','من قهوه دوست دارم.','ich mag'),
  f(68,'صرف essen','Was ___ du gern?','isst','دوست داری چه بخوری؟','du isst'),
  o(69,'سفارش مؤدبانه',['möchte','Ich','einen','Tee','bitte','.'],'Ich möchte einen Tee, bitte.','یک چای لطفاً.','möchte و Akkusativ','Training: Sprechen'),
  w(70,'سفارش صبحانه','Schreibe, was du zum Frühstück isst und trinkst.','Ich esse Brot und Käse. Ich trinke Tee.','صبحانه چه می‌خوری و می‌نوشی؟','essen و trinken را با ich صرف کن.','Test')
 ]},
 {id:10,title:'Ich steige jetzt in die U-Bahn ein.',start:78,end:83,topic:'حمل‌ونقل، فعل جداشدنی و حرکت',tasks:[
  f(78,'وسیله رفت‌وآمد','Ich fahre mit der ___.','U-Bahn','با مترو می‌روم.','die U-Bahn؛ mit der U-Bahn'),
  c(79,'فعل جداشدنی','Ich steige am Bahnhof ...',['ein','an','aus'],'ein','در ایستگاه سوار می‌شوم.','einsteigen → ich steige ... ein'),
  f(80,'تماس گرفتن','Ich ___ meine Freundin heute an.','rufe','امروز به دوستم تلفن می‌کنم.','anrufen → ich rufe ... an'),
  o(82,'پرسش از زمان ورود',['du','Wann','an','kommst','?'],'Wann kommst du an?','کی می‌رسی؟','ankommen: قسمت جداشدنی در پایان','Test'),
  w(83,'پیام رسیدن','Schreibe, wann und wie du ankommst.','Ich komme am Freitag um elf Uhr an. Ich fahre mit dem Zug.','زمان و وسیله رسیدن را توضیح بده.','ankommen / mit dem Zug','Lernwortschatz')
 ]},
 {id:11,title:'Was hast du heute gemacht?',start:84,end:89,topic:'روزمره و گذشته Perfekt با haben',tasks:[
  f(84,'کارهای روزمره','Ich ___ um sieben Uhr.','frühstücke','ساعت هفت صبحانه می‌خورم.','frühstücken = صبحانه خوردن'),
  c(85,'Perfekt با haben','Ich ... Deutsch gelernt.',['habe','bin','hat'],'habe','من آلمانی یاد گرفته‌ام.','haben + Partizip II'),
  f(86,'Partizip II','Wir haben gestern ___.','gearbeitet','ما دیروز کار کردیم.','arbeiten → gearbeitet'),
  o(87,'گذشته‌ی یک کار',['habe','Ich','die Zeitung','gelesen','.'],'Ich habe die Zeitung gelesen.','روزنامه خواندم.','فاعل + haben + ... + Partizip II','Test'),
  w(88,'امروز چه کردی؟','Schreibe zwei Sätze im Perfekt über deinen Tag.','Ich habe heute gearbeitet. Ich habe Deutsch gelernt.','دو جمله درباره کارهای امروز با Perfekt بنویس.','haben و Partizip II را کنترل کن.','Lernwortschatz')
 ]},
 {id:12,title:'Was ist denn hier passiert?',start:90,end:95,topic:'ماه‌ها، فصل‌ها، Perfekt با sein، war/hatte',tasks:[
  f(90,'ماه‌های سال','Nach September kommt ___.','Oktober','بعد از سپتامبر اکتبر می‌آید.','September → Oktober'),
  c(91,'Perfekt با sein','Er ... nach Berlin gefahren.',['ist','hat','habe'],'ist','او به برلین رفته است.','fahren با جابه‌جایی معمولاً sein می‌گیرد.'),
  f(92,'گذشته sein','Gestern ___ ich müde.','war','دیروز خسته بودم.','sein در Präteritum: ich war'),
  o(94,'مسافرت در گذشته',['sind','Wir','nach München','gefahren','.'],'Wir sind nach München gefahren.','ما به مونیخ رفتیم.','sind ... gefahren','Test'),
  w(95,'آخر هفته گذشته','Schreibe, wohin du gefahren bist und was du gemacht hast.','Ich bin am Samstag nach Berlin gefahren. Ich habe meine Freunde besucht.','سفر و فعالیتی در گذشته را بنویس.','sein برای حرکت، haben برای بسیاری از فعالیت‌ها.','Lernwortschatz')
 ]}
];
// The supplied OCR PDF omits two printed pages (56, 87). Its page offsets
// shift at those gaps, so a constant printed-to-PDF offset is incorrect.
export function printedArbeitsbuchToPdfPage(page){
 const p=Number(page);
 if(!Number.isInteger(p)||p<6||p>99||p===56||p===87)return null;
 return p<=55?p-4:p<=86?p-5:p-6;
}
export const arbeitsbuchLessons=Object.freeze(lessons.map(lesson=>({
 ...lesson,
 pdfStart:printedArbeitsbuchToPdfPage(lesson.start),
 pdfEnd:printedArbeitsbuchToPdfPage(lesson.end),
 tasks:lesson.tasks.map((task,index)=>({
  ...task,lesson:lesson.id,id:'ab-'+lesson.id+'-'+(index+1),
  pdfPage:printedArbeitsbuchToPdfPage(task.page),
  sourcePageAvailable:printedArbeitsbuchToPdfPage(task.page)!==null
 }))
})));
export const arbeitsbuchLesson=id=>arbeitsbuchLessons.find(x=>x.id===Number(id));
export const arbeitsbuchTasks=Object.freeze(arbeitsbuchLessons.flatMap(x=>x.tasks));
export const arbeitsbuchTotal=arbeitsbuchTasks.length;
export function normalizeArbeitsbuchAnswer(value){
 return String(value??'').normalize('NFC').toLocaleLowerCase('de-DE')
 .replace(/[.!?,،؟]/g,'').replace(/\s+/g,' ').trim();
}
export function gradeArbeitsbuchTask(task,value){
 if(!task||task.kind==='writing')return null;
 return normalizeArbeitsbuchAnswer(value)===normalizeArbeitsbuchAnswer(task.answer);
}
export function recordArbeitsbuchAttempt(state={},task,correct,now=Date.now()){
 if(!task?.id||typeof correct!=='boolean')throw new Error('Invalid exercise result');
 const old=state[task.id]||{};
 return {...state,[task.id]:{
  attempts:(old.attempts||0)+1,misses:(old.misses||0)+Number(!correct),
  lastCorrect:correct,completed:Boolean(old.completed)||correct,lastAt:now,
  lastScore:correct?100:0,reviewDue:!correct
 }};
}
export function recordArbeitsbuchWriting(state={},task,text,now=Date.now()){
 if(!task?.id||task.kind!=='writing')throw new Error('Invalid writing');
 return {...state,[task.id]:{
  ...(state[task.id]||{}),draft:String(text||''),submitted:true,
  lastAt:now, selfAssessment:true
 }};
}
export function arbeitsbuchWeakTasks(state={},lesson=null){
 const set=lesson?arbeitsbuchLesson(lesson)?.tasks||[]:arbeitsbuchTasks;
 return set.filter(task=>state[task.id]?.lastCorrect===false);
}
