// Original mobile practice inspired by user-supplied Arbeitsbuch's themes and page headings.
// Neither publisher illustrations nor audio are included or rehosted here.
import {printedArbeitsbuchToPdfPage} from './arbeitsbuchSourceData.js';
export const AB_MEDIA_KEY='dt_arbeitsbuch_media_v1';
export const AB_PAGE_PROGRESS_KEY='dt_arbeitsbuch_page_index_v1';
export const AB_MEDIA_NOTE='تصویرها و صدای تمرینی، بازآفرینی تألیفی‌اند؛ پخش صوت اصلی فقط پس از اتصال قطعه واقعی کتاب امکان‌پذیر است.';
const visuals=[
 [1,6,'سلام و معرفی','person','کدام عبارت برای سلام کردن مناسب است؟',['Guten Tag!','Gute Nacht!','Auf Wiedersehen!'],'Guten Tag!','Guten Tag برای سلام رسمی در روز است.'],
 [1,7,'کشور و محل تولد','globe','برای پرسیدن کشور از چه کلمه‌ای استفاده می‌کنیم؟',['Woher','Wie alt','Wann'],'Woher','Woher kommst du?'],
 [2,12,'شغل من','computer','این تصویر با کدام شغل هماهنگ است؟',['IT-Spezialist','Koch','Sänger'],'IT-Spezialist','برنامه‌نویس/متخصص IT با کامپیوتر کار می‌کند.'],
 [2,14,'تلفن','phone','اسم آلمانی وسیله تصویر چیست؟',['das Telefon','der Tisch','die Brille'],'das Telefon','das Telefon؛ تلفن'],
 [3,18,'خانواده','family','این تصویر کدام گروه را نشان می‌دهد؟',['die Familie','das Büro','der Bahnhof'],'die Familie','die Familie = خانواده'],
 [3,19,'مادر','mother','آرتیکل صحیح کدام است؟',['die Mutter','der Mutter','das Mutter'],'die Mutter','Mutter مؤنث است.'],
 [4,30,'مبلمان','sofa','این تصویر کدام وسیله را نشان می‌دهد؟',['das Sofa','die Lampe','der Stuhl'],'das Sofa','Sofa = مبل راحتی'],
 [4,31,'چراغ','lamp','این وسیله در آلمانی چیست؟',['die Lampe','der Tisch','das Bett'],'die Lampe','die Lampe مؤنث است.'],
 [5,36,'لوازم شخصی','pencil','کدام کلمه درست است؟',['der Bleistift','die Flasche','das Buch'],'der Bleistift','مداد = der Bleistift'],
 [5,38,'اشیا و جنس','bottle','کدام اسم مناسب است؟',['die Flasche','das Feuerzeug','der Ring'],'die Flasche','بطری = die Flasche'],
 [6,42,'لوازم دفتر','printer','کدام گزینه برای این وسیله درست است؟',['der Drucker','der Laptop','die Rechnung'],'der Drucker','چاپگر = der Drucker'],
 [6,44,'محیط کار','laptop','مفعول درست را انتخاب کن: Ich brauche ...',['einen Laptop','eine Laptop','ein Laptop'],'einen Laptop','مفعول مذکر در Akkusativ با einen می‌آید.'],
 [7,54,'فوتبال','football','کدام فعل مناسب است؟',['Fußball spielen','Klavier spielen','Rad fahren'],'Fußball spielen','فعل spielen با فوتبال می‌آید.'],
 [7,55,'موسیقی','guitar','کدام سرگرمی در تصویر است؟',['Gitarre spielen','schwimmen','kochen'],'Gitarre spielen','Gitarre spielen = گیتار نواختن'],
 [8,61,'خواندن ساعت','clock','این ساعت چه زمانی را نشان می‌دهد؟',['Es ist halb neun.','Es ist neun Uhr.','Es ist halb acht.'],'Es ist halb neun.','halb neun = ۸:۳۰'],
 [8,62,'روزهای هفته','calendar','برای جمعه کدام عبارت درست است؟',['am Freitag','in Freitag','um Freitag'],'am Freitag','am + روز هفته'],
 [9,66,'غذا','bread','اسم این خوراکی چیست؟',['das Brot','der Fisch','der Käse'],'das Brot','Brot = نان'],
 [9,68,'نوشیدنی','coffee','کدام عبارت درخواست مؤدبانه است؟',['Ich möchte einen Kaffee.','Ich brauche ein Stuhl.','Du bist Kaffee.'],'Ich möchte einen Kaffee.','Ich möchte + Akkusativ'],
 [10,78,'رفت‌وآمد','train','کدام وسیله حمل‌ونقل است؟',['der Zug','das Flugzeug','das Fahrrad'],'der Zug','قطار = der Zug'],
 [10,80,'اتوبوس','bus','کدام اسم مناسب است؟',['der Bus','die U-Bahn','das Taxi'],'der Bus','der Bus؛ اتوبوس'],
 [11,84,'روزنامه','newspaper','این تصویر چه چیزی را نشان می‌دهد؟',['die Zeitung','das Museum','der Kuchen'],'die Zeitung','روزنامه = die Zeitung'],
 [11,85,'ساعت روزانه','alarm','کدام جمله درباره صبح مناسب است؟',['Ich stehe um sieben Uhr auf.','Ich fliege nach Rom.','Ich kaufe ein Sofa.'],'Ich stehe um sieben Uhr auf.','aufstehen فعل جداشدنی است.'],
 [12,90,'زمستان','snow','کدام فصل با تصویر هماهنگ است؟',['der Winter','der Sommer','der Frühling'],'der Winter','Winter = زمستان'],
 [12,91,'تابستان','sun','این تصویر نماینده کدام فصل است؟',['der Sommer','der Winter','der Herbst'],'der Sommer','Sommer = تابستان']
];
const heard=[
 [1,9,'معرفی','Hallo! Ich heiße Lea und komme aus Österreich.','Lea از کجا می‌آید؟',['aus Österreich','aus Deutschland','aus der Schweiz'],'aus Österreich','kommen aus + کشور'],
 [1,9,'نام','Guten Tag! Mein Name ist Jonas.','نام گوینده چیست؟',['Jonas','Lukas','Simon'],'Jonas','Mein Name ist ...'],
 [2,14,'شغل','Ich arbeite als Journalistin in Berlin.','گوینده چه شغلی دارد؟',['Journalistin','Ärztin','Lehrerin'],'Journalistin','arbeiten als'],
 [2,14,'عددها','Meine Telefonnummer ist drei, fünf, acht, zwei.','چهار عدد شنیده‌شده کدام است؟',['3–5–8–2','3–6–8–2','5–3–8–2'],'3–5–8–2','عددها را یکی‌یکی تشخیص بده.'],
 [3,21,'خانواده','Das ist meine Schwester. Sie heißt Lara.','نام خواهر چیست؟',['Lara','Mira','Anna'],'Lara','meine Schwester'],
 [3,21,'اعضای خانواده','Mein Vater ist Arzt und meine Mutter ist Lehrerin.','شغل مادر چیست؟',['Lehrerin','Ärztin','Journalistin'],'Lehrerin','meine Mutter'],
 [4,31,'قیمت','Der Tisch kostet fünfzig Euro.','قیمت میز چند یورو است؟',['50','15','500'],'50','fünfzig'],
 [4,31,'مبلمان','Das Sofa ist günstig, aber der Schrank ist teuer.','کدام وسیله گران است؟',['der Schrank','das Sofa','der Tisch'],'der Schrank','teuer = گران'],
 [5,39,'رنگ و اشیا','Die Flasche ist rot und aus Plastik.','بطری چه رنگی است؟',['rot','blau','grün'],'rot','rot = قرمز'],
 [5,39,'اشیای شخصی','Mein Feuerzeug ist schwarz.','فندک چه رنگی است؟',['schwarz','weiß','gelb'],'schwarz','schwarz = مشکی'],
 [6,45,'وسایل کار','Ich brauche einen Drucker, aber keinen Laptop.','گوینده به چه وسیله‌ای احتیاج دارد؟',['einen Drucker','einen Laptop','eine Maus'],'einen Drucker','keinen Laptop یعنی لپ‌تاپ نمی‌خواهم/ندارم.'],
 [6,45,'وسیله گم‌شده','Wo ist die Rechnung? Sie liegt auf dem Tisch.','فاکتور کجاست؟',['auf dem Tisch','im Schrank','unter dem Stuhl'],'auf dem Tisch','Wo? → محل ثابت'],
 [7,57,'توانایی','Ich kann gut Gitarre spielen.','گوینده چه کاری بلد است؟',['Gitarre spielen','schwimmen','Schach spielen'],'Gitarre spielen','kann + مصدر پایان جمله'],
 [7,57,'سرگرمی','Ich spiele oft Fußball, aber ich tanze nie.','کدام کار را هرگز انجام نمی‌دهد؟',['tanzen','Fußball spielen','kochen'],'tanzen','nie = هرگز'],
 [8,62,'وقت ملاقات','Treffen wir uns am Freitag um fünf Uhr?','قرار چه زمانی است؟',['Freitag, 17:00','Montag, 17:00','Freitag, 15:00'],'Freitag, 17:00','am Freitag / um fünf Uhr'],
 [8,63,'رد دعوت','Tut mir leid, am Montag habe ich keine Zeit.','چه روزی وقت ندارد؟',['Montag','Mittwoch','Sonntag'],'Montag','keine Zeit haben'],
 [9,69,'سفارش','Ich möchte ein Brot und einen Kaffee, bitte.','کدام نوشیدنی سفارش داده شد؟',['Kaffee','Tee','Wasser'],'Kaffee','einen Kaffee'],
 [9,69,'غذا','Ich esse gern Käse, aber ich mag keinen Fisch.','گوینده چه غذایی را دوست ندارد؟',['Fisch','Käse','Brot'],'Fisch','keinen Fisch'],
 [10,81,'قطار','Der Zug nach Hamburg fährt um acht Uhr ab.','قطار چه ساعتی حرکت می‌کند؟',['08:00','18:00','09:00'],'08:00','abfahren فعل جداشدنی است.'],
 [10,81,'سکو','Der Zug fährt von Gleis vier ab.','شماره سکو چیست؟',['4','3','14'],'4','Gleis = سکو'],
 [11,85,'روز گذشته','Ich habe gestern Deutsch gelernt.','گوینده دیروز چه کاری کرده؟',['Deutsch gelernt','Musik gehört','Fußball gespielt'],'Deutsch gelernt','haben + gelernt'],
 [11,86,'کارهای روزمره','Am Morgen habe ich gefrühstückt.','چه فعالیتی انجام داده؟',['gefrühstückt','gearbeitet','geschlafen'],'gefrühstückt','frühstücken → gefrühstückt'],
 [12,93,'سفر گذشته','Ich bin nach München gefahren.','به کدام شهر رفته است؟',['München','Berlin','Wien'],'München','Perfekt با sein'],
 [12,93,'فصل‌ها','Im Winter ist es oft kalt.','از کدام فصل صحبت می‌کند؟',['Winter','Sommer','Frühling'],'Winter','Winter = زمستان']
];
const originals=[
 [1,9,'Training: Hören','Woher / wie / wer؛ پاسخ‌ها و احوال‌پرسی'],
 [2,14,'Telefonnummern hören','تشخیص شماره تلفن‌ها و اعداد شنیده‌شده'],
 [3,21,'Training: Sprechen / Hören','معرفی اعضای خانواده و گوش‌دادن به نمونه'],
 [4,31,'Welche Zahlen hören Sie?','تشخیص اعداد و قیمت‌ها'],
 [5,39,'Training: Schreiben / Hören','تکیه جمله و جمله‌های نمونه'],
 [6,45,'Training: Hören','سه مکالمه کوتاه و تطبیق آن‌ها با تصویر'],
 [7,57,'Training: Aussprache','تکیه جمله و تکرار پس از گوینده'],
 [8,62,'Hören Sie das Gespräch','درک گفت‌وگو درباره ساعت و دعوت'],
 [9,69,'Training: Sprechen / Hören','تلفظ عبارت‌های سفارش غذا و نوشیدنی'],
 [10,81,'Training: Hören','اعلان ایستگاه و قطار، تشخیص عکس‌ها و زمان‌ها'],
 [12,93,'Training: Sprechen / Hören','گزارش کوتاه از یک رویداد گذشته']
];
export const arbeitsbuchVisualTasks=Object.freeze(visuals.map(([lesson,page,title,art,question,options,answer,tip],i)=>({
 id:'ab-visual-'+lesson+'-'+(i%2+1),kind:'visual',lesson,page,pdfPage:printedArbeitsbuchToPdfPage(page),title,art,question,options,answer,tip,source:'Arbeitsbuch'
})));
export const arbeitsbuchListeningTasks=Object.freeze(heard.map(([lesson,page,title,script,question,options,answer,tip],i)=>({
 id:'ab-listen-practice-'+lesson+'-'+(i%2+1),kind:'listeningPractice',lesson,page,pdfPage:printedArbeitsbuchToPdfPage(page),title,script,question,options,answer,tip,source:'تمرین شنیداری تألیفی (TTS)',originalAudio:false
})));
export const arbeitsbuchOriginalTasks=Object.freeze(originals.map(([lesson,page,title,goal])=>({
 id:'ab-original-'+lesson,kind:'originalAudio',lesson,page,pdfPage:printedArbeitsbuchToPdfPage(page),
 title,goal,source:'تمرین شنیداری وابسته به صدای اصلی',requiresTrack:true
})));
export const arbeitsbuchMediaTasks=Object.freeze([...arbeitsbuchVisualTasks,...arbeitsbuchListeningTasks,...arbeitsbuchOriginalTasks]);
export const arbeitsbuchMediaForLesson=lesson=>arbeitsbuchMediaTasks.filter(t=>t.lesson===Number(lesson));
export const arbeitsbuchMediaById=id=>arbeitsbuchMediaTasks.find(t=>t.id===id)||null;
export const arbeitsbuchMediaCounts=Object.freeze({visual:arbeitsbuchVisualTasks.length,practice:arbeitsbuchListeningTasks.length,original:arbeitsbuchOriginalTasks.length,total:arbeitsbuchMediaTasks.length});
export function mediaCorrect(task,value){
 if(!task||task.kind==='originalAudio')return null;
 return String(value).trim()===task.answer;
}
export function saveMediaResult(old={},task,correct,now=Date.now()){
 if(!task?.id||typeof correct!=='boolean'||task.kind==='originalAudio')throw new Error('Invalid graded media attempt');
 const previous=old[task.id]||{};
 return {...old,[task.id]:{
  attempts:(previous.attempts||0)+1,misses:(previous.misses||0)+Number(!correct),
  completed:Boolean(previous.completed)||correct,lastCorrect:correct,lastAt:now
 }};
}
export function saveOriginalAudioPractice(old={},task,heardTrack,needsReview,now=Date.now()){
 if(task?.kind!=='originalAudio'||!heardTrack)throw new Error('Original audio must be playable before completion');
 const previous=old[task.id]||{};
 return {...old,[task.id]:{...previous,attempts:(previous.attempts||0)+1,
  selfAssessed:true,completed:!needsReview,needsReview:Boolean(needsReview),lastAt:now}};
}
export function mediaNeedsReview(state={},tasks=arbeitsbuchMediaTasks){
 return tasks.filter(t=>state[t.id]?.lastCorrect===false||state[t.id]?.needsReview===true);
}
// Index every printed page in this source, even when a page has no auto-gradable activity.
// Cross-module review pages are separate from individual lesson tasks.
const chapterSegments=[
 [1,6,11],[2,12,17],[3,18,23],[4,30,35],[5,36,41],[6,42,47],
 [7,54,59],[8,60,65],[9,66,71],[10,78,83],[11,84,89],[12,90,95]
];
export const arbeitsbuchPageIndex=Object.freeze(Array.from({length:94},(_,i)=>{
 const page=i+6;
 const chapter=chapterSegments.find(([,start,end])=>page>=start&&page<=end);
 const lesson=chapter?.[0]||null;
 const pos=chapter?page-chapter[1]:null;
 const section=lesson?
   (pos===0?'Einstieg':pos===1||pos===2?'Basistraining':pos===3?'Training':pos===4?'Test':'Lernwortschatz')
   :page<=29?'Modul 1 · Wiederholung':page<=53?'Modul 2 · Wiederholung':
    page<=77?'Modul 3 · Wiederholung':'Modul 4 · Wiederholung';
 return {page,pdfPage:printedArbeitsbuchToPdfPage(page),
  available:printedArbeitsbuchToPdfPage(page)!==null,lesson,section,
  id:'ab-page-'+page,
  mediaIds:arbeitsbuchMediaTasks.filter(t=>t.page===page).map(t=>t.id)};
}));
export function savePageProgress(old={},page,needsReview=false,now=Date.now()){
 if(!page?.id||!page.available)throw new Error('Source page unavailable');
 return {...old,[page.id]:{completed:!needsReview,needsReview:Boolean(needsReview),lastAt:now}};
}
