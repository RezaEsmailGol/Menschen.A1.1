// A curated bilingual selection taken from the Lernwortschatz sections of
// the user-supplied Menschen A1.1 Arbeitsbuch OCR PDF, *not* Kursbuch pp.97–102.
// The supplied PDFs' pages 97–102 are advertisements, not vocabulary lists.
export const ESSENTIAL_KEY='dt_essential_vocab_20261123_v1';
const groups=[
 [1,7,'معرفی و احوال‌پرسی',[
  ['Hallo!','سلام'],['Auf Wiedersehen!','خداحافظ'],['danke','ممنون'],['Woher?','از کجا؟'],
  ['der Name','نام'],['der Vorname','نام کوچک'],['buchstabieren','هجی کردن'],['Österreich','اتریش'],['die Schweiz','سوئیس'],['Guten Tag!','روز بخیر']
 ]],
 [2,13,'شغل و تحصیل',[
  ['der Beruf','شغل'],['der Arbeitgeber','کارفرما'],['die Ausbildung','آموزش حرفه‌ای'],['die Schule','مدرسه'],
  ['die Stelle','موقعیت شغلی'],['das Praktikum','کارآموزی'],['arbeiten als','به عنوان ... کار کردن'],['studieren','تحصیل دانشگاهی کردن'],['arbeitslos','بیکار'],['der Arzt','پزشک']
 ]],
 [3,19,'خانواده و زبان‌ها',[
  ['die Familie','خانواده'],['der Vater','پدر'],['die Mutter','مادر'],['die Eltern','پدر و مادر'],
  ['der Bruder','برادر'],['die Schwester','خواهر'],['der Sohn','پسر'],['die Tochter','دختر'],['die Sprache','زبان'],['sprechen','صحبت کردن']
 ]],
 [4,31,'خانه و مبلمان',[
  ['das Bett','تخت'],['das Bild','تصویر'],['die Lampe','چراغ'],['der Schrank','کمد'],
  ['das Sofa','مبل راحتی'],['der Stuhl','صندلی'],['der Teppich','فرش'],['der Tisch','میز'],['günstig','ارزان و به‌صرفه'],['teuer','گران']
 ]],
 [5,37,'وسایل و مواد',[
  ['der Bleistift','مداد'],['die Brille','عینک'],['das Buch','کتاب'],['das Feuerzeug','فندک'],
  ['die Flasche','بطری'],['der Regenschirm','چتر'],['der Schlüssel','کلید'],['der Ring','انگشتر'],['das Holz','چوب'],['das Plastik','پلاستیک']
 ]],
 [6,43,'وسایل دفتر کار',[
  ['der Arbeitsplatz','محل کار'],['der Bildschirm','مانیتور'],['der Computer','رایانه'],['der Drucker','چاپگر'],
  ['das Handy','گوشی موبایل'],['der Kalender','تقویم'],['der Laptop','لپ‌تاپ'],['die Maus','ماوس'],['der Termin','قرار ملاقات'],['die Rechnung','فاکتور']
 ]],
 [7,54,'تفریح و سرگرمی',[
  ['der Ausflug','گردش'],['der Film','فیلم'],['das Hobby','سرگرمی'],['das Kino','سینما'],
  ['fotografieren','عکس گرفتن'],['kochen','آشپزی کردن'],['schwimmen','شنا کردن'],['spazieren gehen','قدم زدن'],['Gitarre spielen','گیتار زدن'],['Wie oft?','هر چند وقت یک بار؟']
 ]],
 [8,60,'روزها، زمان‌ها و شهر',[
  ['das Café','کافه'],['das Konzert','کنسرت'],['das Museum','موزه'],['das Schwimmbad','استخر'],
  ['die Uhr','ساعت'],['der Vormittag','پیش از ظهر'],['der Nachmittag','بعدازظهر'],['Montag','دوشنبه'],['Dienstag','سه‌شنبه'],['Mittwoch','چهارشنبه']
 ]],
 [9,66,'خوراکی و نوشیدنی',[
  ['der Apfel','سیب'],['das Brot','نان'],['das Brötchen','نان کوچک'],['die Milch','شیر'],
  ['der Käse','پنیر'],['die Kartoffel','سیب‌زمینی'],['die Suppe','سوپ'],['die Schokolade','شکلات'],['der Tee','چای'],['die Tomate','گوجه‌فرنگی']
 ]],
 [10,78,'حمل‌ونقل',[
  ['der Bahnhof','ایستگاه قطار'],['der Bahnsteig','سکوی قطار'],['der Bus','اتوبوس'],['die Haltestelle','ایستگاه'],
  ['das Gleis','خط یا سکوی راه‌آهن'],['der Koffer','چمدان'],['die S-Bahn','قطار شهری'],['die Straßenbahn','تراموا'],['anrufen','تلفن زدن'],['einkaufen','خرید کردن']
 ]],
 [11,83,'کارهای روزانه',[
  ['die Arbeit','کار'],['die Hausaufgabe','تکلیف'],['die Pause','استراحت'],['die Zeitung','روزنامه'],
  ['aufräumen','مرتب کردن'],['einladen','دعوت کردن'],['das Geschenk','هدیه'],['die Party','مهمانی'],['die Reise','سفر'],['langweilig','خسته‌کننده']
 ]],
 [12,89,'فصل‌ها، ماه‌ها و جشن‌ها',[
  ['der Frühling','بهار'],['der Sommer','تابستان'],['der Herbst','پاییز'],['der Winter','زمستان'],
  ['der Januar','ژانویه'],['der Februar','فوریه'],['der März','مارس'],['die Hochzeit','عروسی'],['das Fest','جشن'],['Silvester','شب سال نو']
 ]]
];
export const essentialGroups=Object.freeze(groups.map(([lesson,pdfPage,topic,items])=>({
 lesson,pdfPage,topic,
 words:items.map(([de,fa],index)=>({id:'essential-'+lesson+'-'+(index+1),lesson,de,fa,pdfPage}))
})));
export const essentialWords=Object.freeze(essentialGroups.flatMap(g=>g.words));
export const essentialForLesson=id=>essentialGroups.find(g=>g.lesson===Number(id));
export function essentialOptions(group,index,mode='game'){
 if(!group||!group.words?.[index])throw new Error('Invalid vocabulary card');
 const list=group.words;
 const set=[index,(index+2)%list.length,(index+4)%list.length,(index+7)%list.length];
 return set.map(i=>mode==='test'?list[i].fa:list[i].de);
}
export function essentialGrade(word,mode,selected){
 if(!word||!['game','test'].includes(mode))return false;
 return selected===(mode==='game'?word.de:word.fa);
}
export function essentialRecord(old={},word,correct,now=Date.now()){
 if(!essentialWords.some(x=>x.id===word?.id)||typeof correct!=='boolean')throw new Error('Invalid word or result');
 const before=old[word.id]||{};
 return {...old,[word.id]:{
  ...before,attempts:(before.attempts||0)+1,
  misses:(before.misses||0)+Number(!correct),lastCorrect:correct,lastAt:now,seen:true
 }};
}
export function essentialMarkSeen(old={},word){
 if(!essentialWords.some(x=>x.id===word?.id))throw new Error('Invalid word');
 return {...old,[word.id]:{...old[word.id],seen:true}};
}
export function essentialWeak(old={},lesson=null){
 return essentialWords.filter(w=>(lesson===null||w.lesson===Number(lesson))&&old[w.id]?.lastCorrect===false);
}
