// Class whiteboard, 22 Nov 2026: frequency, time expressions, leisure and gender.
// Original exercises; months are additional classroom revision, not a claim about the book.
export const class8Frequency=[
 ['immer','همیشه'],['fast immer','تقریباً همیشه'],['sehr oft','خیلی زیاد / به دفعات زیاد'],
 ['oft','اغلب'],['manchmal','گاهی'],['fast nie','تقریباً هرگز'],['nie','هرگز']
];
export const class8Intervals=[
 ['jeden Tag','هر روز','täglich'],['jeden Monat','هر ماه','monatlich'],
 ['jede Woche','هر هفته','wöchentlich'],['jede Stunde','هر ساعت','stündlich'],
 ['jedes Wochenende','هر آخر هفته',''],['jedes Jahr','هر سال','jährlich']
];
export const class8Hobbies=[
 ['⚽','Fußball spielen','فوتبال بازی کردن'],['🏊','schwimmen','شنا کردن'],
 ['🚲','Rad fahren','دوچرخه‌سواری'],['🍳','kochen','آشپزی کردن'],
 ['📷','Fotos machen','عکس گرفتن'],['🚶','spazieren gehen','قدم زدن'],
 ['🎤','singen','آواز خواندن'],['🎨','malen','نقاشی کردن'],['🏄','surfen','موج‌سواری / وب‌گردی']
];
export const class8People=[
 ['der Koch','die Köchin','آشپز'],['der Sänger','die Sängerin','خواننده'],
 ['der Surfer','die Surferin','موج‌سوار'],['der Schwimmer','die Schwimmerin','شناگر'],
 ['der Fotograf','die Fotografin','عکاس'],['der Spieler','die Spielerin','بازیکن'],
 ['der Maler','die Malerin','نقاش'],['der Bäcker','die Bäckerin','نانوا'],
 ['der Fahrer','die Fahrerin','راننده']
];
export const class8Months=[
 ['Januar','ژانویه'],['Februar','فوریه'],['März','مارس'],['April','آوریل'],
 ['Mai','مه'],['Juni','ژوئن'],['Juli','ژوئیه'],['August','اوت'],
 ['September','سپتامبر'],['Oktober','اکتبر'],['November','نوامبر'],['Dezember','دسامبر']
];
export const class8Words=[
 ...class8Months.slice(3).map(([de,fa])=>[de,fa+' (مرور تکمیلی)']),
 ...class8Frequency,
 ['stets','همواره'],['ständig','دائماً'],['stetig','پیوسته / یکنواخت'],
 ['dauerhaft','به‌طور مداوم / پایدار'],['häufig','مکرراً'],['meistens','بیشتر اوقات'],
 ['ab und zu','گهگاه'],['ab und dann','هر از گاهی'],['von Zeit zu Zeit','گاه‌به‌گاه'],['niemals','هرگز'],
 ...class8Intervals.flatMap(([de,fa,alt])=>alt?[[de,fa],[alt,fa]]:[[de,fa]]),
 ...class8Hobbies.map(([,de,fa])=>[de,fa]),
 ...class8People.flatMap(([m,f,fa])=>[[m,fa+' (مرد)'],[f,fa+' (زن)']]),
 ['die Entspannung','آرامش / تمدد اعصاب'],['die Fotografie','عکاسی'],['das Foto','عکس'],
 ['der Fotoapparat','دوربین عکاسی'],['die Kamera','دوربین'],['ein Foto schießen','عکس گرفتن'],
 ['die Malerei','نقاشی'],['die Bäckerei','نانوایی'],['der Spaziergang','پیاده‌روی'],
 ['das Rad','چرخ / دوچرخه'],['das Fahrrad','دوچرخه'],['das Velo','دوچرخه (به‌ویژه سوئیس)'],
 ['die Lieblingsfarbe','رنگ موردعلاقه'],['der Lieblingsroman','رمان موردعلاقه'],['hellblau','آبی روشن'],
 ['Wie oft?','هر چند وقت؟'],['Wie gut?','چقدر خوب؟'],['ein bisschen','کمی'],
 ['der Termin','قرار / وقت ملاقات'],['die Verabredung','قرار ملاقات']
];

const choice=(id,prompt,answer,choices,why,audio=answer)=>({id:'l8-'+id,type:'choice',prompt,answer,choices,why,audio});
const build=(id,prompt,answer,why)=>({id:'l8-'+id,type:'build',prompt,answer,why});
const type=(id,prompt,answer,why,alternatives=[])=>({id:'l8-'+id,type:'type',prompt,answer,why,alternatives});
const listen=(id,prompt,answer,why)=>({id:'l8-'+id,type:'listen',prompt,answer,audio:answer,why});

export const class8ExtraSections=[
 {cards:[
   ['📅','März','مارس'],['📅','Juni','ژوئن'],['📅','Juli','ژوئیه'],
   ['🔁','immer','همیشه'],['🔁','manchmal','گاهی'],['🔁','nie','هرگز'],
   ['⚽','Fußball spielen','فوتبال بازی کردن'],['📷','Fotos machen','عکس گرفتن']
 ],tasks:[
   choice('class-v01','«هرگز» به آلمانی کدام است؟','nie',['oft','manchmal','nie','immer'],'nie یعنی هرگز. niemals نیز به معنی هرگز است.'),
   choice('class-v02','معادل manchmal کدام است؟','ab und zu',['ab und zu','immer','fast immer','jeden Tag'],'هر دو یعنی گهگاه.'),
   choice('class-v03','«عکاس زن» کدام است؟','die Fotografin',['der Fotograf','die Fotografie','die Fotografin','die Kamera'],'Fotografin شخص است؛ Fotografie نام فعالیت.'),
   choice('class-v04','مؤنث der Koch چیست؟','die Köchin',['die Kochin','die Küche','die Köchin','die Köche'],'Koch به Köchin تبدیل می‌شود.'),
   choice('class-v05','بعد از Mai کدام ماه می‌آید؟','Juni',['Juli','Januar','Juni','März'],'Mai, Juni, Juli.'),
   choice('class-v06','قبل از Oktober چه ماهی است؟','September',['August','November','Dezember','September'],'September ماه نهم است.'),
   choice('class-v07','کدام عبارت یعنی «قدم زدن»؟','spazieren gehen',['Rad fahren','spazieren gehen','Fotos machen','Fußball spielen'],'der Spaziergang یعنی پیاده‌روی.'),
   type('class-v08','نام آلمانی ماه دوازدهم (دسامبر) را بنویس.','Dezember','Dezember ماه دوازدهم است.')
 ]},
 {cards:[
  ['🔁','Wie oft?','هر چند وقت یک‌بار؟'],['✅','Wie gut?','چقدر خوب؟'],
  ['📆','jeden Tag','هر روز (مذکر)'],['📆','jede Woche','هر هفته (مؤنث)'],
  ['📆','jedes Wochenende','هر آخر هفته (خنثی)'],['🌷','im März','در ماه مارس']
 ],tasks:[
   choice('class-g01','Ich lerne ___ Tag Deutsch.','jeden',['jeder','jedes','jede','jeden'],'der Tag در عبارت زمانی Akkusativ: jeden Tag.'),
   choice('class-g02','Ich schwimme ___ Woche.','jede',['jeden','jede','jedes','jeder'],'die Woche → jede Woche.'),
   choice('class-g03','Wir gehen ___ Wochenende spazieren.','jedes',['jede','jeden','jedes','jeder'],'das Wochenende → jedes Wochenende.'),
   choice('class-g04','Ich habe ___ März Urlaub.','im',['um','am','in der','im'],'برای ماه‌ها im: im März.'),
   choice('class-g05','برای پرسیدن دفعات شنا کدام سؤال درست است؟','Wie oft schwimmst du?',['Wie gut schwimmst du?','Wie oft schwimmst du?','Wie alt schwimmst du?','Wie lange schwimmst du?'],'Wie oft برای بسامد است؛ Wie gut برای میزان مهارت.'),
   choice('class-g06','___ du sehr oft Fußball?','Spielst',['Spielen','Spielst','Spielt','Spiele'],'در سؤال بله/خیر فعل صرف‌شده اول می‌آید؛ du spielst.'),
   choice('class-g07','___ Lieblingsfarbe ist hellblau. (رنگ موردعلاقه من)','Meine',['Mein','Meinen','Meine','Meinem'],'die Lieblingsfarbe فاعل مؤنث Nominativ است.'),
   choice('class-g08','Liest du heute ___ Lieblingsroman? (رمان موردعلاقه‌ات)','deinen',['dein','deine','deinem','deinen'],'der Lieblingsroman مفعول مذکر Akkusativ است.')
 ]},
 {cards:[
  ['🗓️','Wann hast du Zeit?','کی وقت داری؟'],
  ['⏱️','Um wie viel Uhr?','ساعت چند؟'],
  ['📅','Ich habe am Freitag Zeit.','جمعه وقت دارم.'],
  ['✅','Ja, das passt.','بله، مناسب است.'],
  ['↪️','Geht es am Samstag?','شنبه می‌شود؟'],
  ['🔁','Ich schwimme jede Woche.','هر هفته شنا می‌کنم.']
 ],tasks:[
   build('class-s01','بساز: آیا خیلی زیاد فوتبال بازی می‌کنی؟','Spielst du sehr oft Fußball?','در سؤال بله/خیر Spielst ابتدا می‌آید.'),
   type('class-s02','بپرس: هر چند وقت یک‌بار شنا می‌کنی؟','Wie oft schwimmst du?','Wie oft + فعل صرف‌شده + فاعل.'),
   type('class-s03','بنویس: من هر روز آلمانی می‌خوانم.','Ich lerne jeden Tag Deutsch.','jeden Tag یا täglich؛ فعل خبری جایگاه دوم.', ['Jeden Tag lerne ich Deutsch.','Ich lerne täglich Deutsch.','Täglich lerne ich Deutsch.']),
   build('class-s04','بساز: من گاهی عکس می‌گیرم.','Ich mache manchmal Fotos.','manchmal یعنی گاهی.'),
   type('class-s05','با Wann بپرس: کی وقت داری؟','Wann hast du Zeit?','Wann + hast + du + Zeit.'),
   type('class-s06','از دوستت بپرس: چهارشنبه ساعت چهار وقت داری؟','Hast du am Mittwoch um vier Uhr Zeit?','am Mittwoch، um vier Uhr.',['Hast du am Mittwoch um 4 Uhr Zeit?']),
   build('class-s07','بساز: متأسفانه سه‌شنبه وقت ندارم. شنبه می‌شود؟','Leider habe ich am Dienstag keine Zeit. Geht es am Samstag?','پیشنهاد زمان جایگزین پس از رد مودبانه.'),
   type('class-s08','با Wir بنویس: ما جمعه ساعت هفت و نیم همدیگر را می‌بینیم.','Wir treffen uns am Freitag um halb acht.','halb acht = ۷:۳۰.',['Wir treffen uns am Freitag um sieben Uhr dreißig.','Wir treffen uns am Freitag um 7:30 Uhr.'])
 ]},
 {cards:[
  ['🕧','halb eins','۱۲:۳۰'],['🕕','sechs Uhr','۶:۰۰'],
  ['📅','im November','در ماه نوامبر'],['🔁','jeden Monat','هر ماه'],
  ['💬','Wie oft schwimmst du?','هر چند وقت یک‌بار شنا می‌کنی؟']
 ],tasks:[
   listen('class-h01','نام ماه را بشنو و بنویس.','März','مارس'),
   listen('class-h02','نام ماه را بشنو و بنویس.','Januar','ژانویه'),
   listen('class-h03','نام ماه را بشنو و بنویس.','Februar','فوریه'),
   listen('class-h04','ساعت رسمی را بشنو و با حروف بنویس.','vierzehn Uhr fünfzehn','۱۴:۱۵'),
   listen('class-h05','ساعت محاوره‌ای را بشنو و تایپ کن.','halb eins','۱۲:۳۰ یا ۰۰:۳۰، بسته به موقعیت'),
   listen('class-h06','عبارت تکرار زمانی را بشنو و بنویس.','jedes Wochenende','هر آخر هفته'),
   listen('class-h07','سؤال درباره سرگرمی را بشنو و بنویس.','Wie oft schwimmst du?','هر چند وقت یک‌بار شنا می‌کنی؟'),
   listen('class-h08','پیشنهاد قرار را بشنو و کامل بنویس.','Hast du am Sonntag um zehn Uhr Zeit?','یکشنبه ساعت ده وقت داری؟')
 ]}
];

// Dedicated mini-game banks, each prompt has exactly one correct answer.
export const class8Games={
 frequency:[
  {fa:'همیشه',de:'immer',choices:['oft','immer','nie','manchmal']},
  {fa:'تقریباً همیشه',de:'fast immer',choices:['fast nie','oft','fast immer','nie']},
  {fa:'خیلی زیاد (به دفعات)',de:'sehr oft',choices:['manchmal','sehr oft','fast nie','nie']},
  {fa:'اغلب',de:'oft',choices:['nie','oft','fast nie','manchmal']},
  {fa:'گاهی',de:'manchmal',choices:['immer','nie','manchmal','fast immer']},
  {fa:'تقریباً هرگز',de:'fast nie',choices:['fast immer','manchmal','fast nie','immer']},
  {fa:'هرگز',de:'nie',choices:['manchmal','immer','oft','nie']}
 ],
 intervals:class8Intervals.map(([de,fa],i)=>{
  const noun=de.slice(de.indexOf(' ')+1);
  const choices=['jeden','jede','jedes','jeder'].map(x=>x+' '+noun);
  const shift=i%choices.length;
  return {de,fa,choices:choices.slice(shift).concat(choices.slice(0,shift))};
 }),
 appointments:[
  {fa:'جمعه ساعت پنج وقت داری؟',de:'Hast du am Freitag um fünf Uhr Zeit?',choices:['Hast du am Freitag um fünf Uhr Zeit?','Hast du um Freitag am fünf Uhr Zeit?','Hast du am Freitag um vier Uhr Zeit?','Du hast am Freitag um fünf Uhr Zeit.']},
  {fa:'دوشنبه ساعت هشت وقت ندارم.',de:'Am Montag um acht Uhr habe ich keine Zeit.',choices:['Am Montag um acht Uhr ich habe keine Zeit.','Am Montag um acht Uhr habe ich keine Zeit.','Am Montag um neun Uhr habe ich keine Zeit.','Am Montag um acht Uhr habe ich Zeit.']},
  {fa:'کی همدیگر را می‌بینیم؟',de:'Wann treffen wir uns?',choices:['Wie oft treffen wir uns?','Wo treffen wir uns?','Wann treffen wir uns?','Wann hast du Zeit?']},
  {fa:'شنبه ساعت هشت و نیم به سینما برویم؟',de:'Gehen wir am Samstag um halb neun ins Kino?',choices:['Gehen wir am Samstag um halb acht ins Kino?','Gehen wir am Sonntag um halb neun ins Kino?','Wir gehen am Samstag um halb neun ins Kino.','Gehen wir am Samstag um halb neun ins Kino?']},
  {fa:'بله، زمان مناسب است.',de:'Ja, das passt.',choices:['Ja, das passt.','Leider nicht.','Ich habe keine Zeit.','Wann denn?']},
  {fa:'متأسفانه نمی‌توانم. یکشنبه می‌شود؟',de:'Leider kann ich nicht. Geht es am Sonntag?',choices:['Leider kann ich nicht. Geht es am Samstag?','Leider kann ich nicht. Geht es am Sonntag?','Ja, am Sonntag passt es.','Ich habe am Sonntag Zeit.']}
 ]
};
