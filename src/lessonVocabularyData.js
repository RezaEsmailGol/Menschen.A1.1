// Independently curated A1.1 vocabulary by Hueber Menschen Kursbuch lesson topics.
// These are not a verified complete reproduction of the publisher's Lernwortschatz.
// Keep ids derived from immutable German spelling for persistent review progress.
const raw = [
  {
    title:'Hallo! Ich bin Nicole ...',topic:'سلام، معرفی و کشورها',pages:'۹–۱۲',
    words: [
      ['Hallo','سلام'],['Guten Morgen','صبح بخیر'],['Guten Tag','روز بخیر'],['Guten Abend','عصر بخیر'],
      ['Gute Nacht','شب بخیر'],['Tschüs','خداحافظ دوستانه'],['Auf Wiedersehen','خداحافظ رسمی'],
      ['Wie geht es dir?','حالت چطور است؟'],['Wie geht es Ihnen?','حال شما چطور است؟'],
      ['gut','خوب'],['sehr gut','خیلی خوب'],['nicht so gut','نه‌چندان خوب'],['Es geht.','بد نیست'],['danke','ممنون'],
      ['bitte','خواهش می‌کنم'],['heißen','نام داشتن'],['kommen','آمدن'],['sein','بودن'],['ich','من'],
      ['du','تو'],['Sie','شما (رسمی)'],['er','او (مذکر)'],['sie','او (مؤنث)'],['wer','چه کسی'],
      ['wie','چگونه / چطور'],['woher','اهل کجا'],['aus','از'],['und','و'],['auch','همچنین'],
      ['der Name','نام'],['der Vorname','نام کوچک'],['der Familienname','نام خانوادگی'],
      ['das Land','کشور'],['die Herkunft','زادگاه / اصل‌ونسب'],['das Alphabet','الفبا'],
      ['buchstabieren','هجی کردن'],['Deutsch','آلمانی'],['Deutschland','آلمان'],['Österreich','اتریش'],
      ['die Schweiz','سوئیس'],['der Iran','ایران'],['Spanien','اسپانیا'],['Mexiko','مکزیک'],
      ['Grüezi','سلام سوئیسی'],['Grüß Gott','سلام رایج در اتریش']
    ]
  },
  {
    title:'Ich bin Journalistin.',topic:'شغل، وضعیت تأهل و اعداد',pages:'۱۳–۱۶',
    words: [
      ['der Beruf','شغل'],['arbeiten','کار کردن'],['die Arbeit','کار'],['die Firma','شرکت'],
      ['der Journalist','روزنامه‌نگار مرد'],['die Journalistin','روزنامه‌نگار زن'],
      ['der Lehrer','معلم مرد'],['die Lehrerin','معلم زن'],['der Arzt','پزشک مرد'],['die Ärztin','پزشک زن'],
      ['der Ingenieur','مهندس مرد'],['die Ingenieurin','مهندس زن'],['der Musiker','موسیقی‌دان مرد'],
      ['die Musikerin','موسیقی‌دان زن'],['der Verkäufer','فروشنده مرد'],['die Verkäuferin','فروشنده زن'],
      ['der Student','دانشجو مرد'],['die Studentin','دانشجو زن'],
      ['der Softwareentwickler','برنامه‌نویس / توسعه‌دهنده مرد'],
      ['die Softwareentwicklerin','توسعه‌دهنده زن'],
      ['der Familienstand','وضعیت تأهل'],['ledig','مجرد'],['verheiratet','متأهل'],
      ['geschieden','طلاق‌گرفته'],['nicht','نه / نیست'],['haben','داشتن'],
      ['die Visitenkarte','کارت ویزیت'],['die Telefonnummer','شماره تلفن'],['das Handy','تلفن همراه'],
      ['das Internet','اینترنت'],['das Profil','پروفایل'],['der Steckbrief','معرفی کوتاه شخصی'],
      ['die Information','اطلاعات'],['wohnen','زندگی کردن'],['leben','زندگی کردن'],
      ['die Zahl','عدد'],['eins','یک'],['zwei','دو'],['drei','سه'],['vier','چهار'],
      ['fünf','پنج'],['sechs','شش'],['sieben','هفت'],['acht','هشت'],['neun','نه'],
      ['zehn','ده'],['elf','یازده'],['zwölf','دوازده'],['dreizehn','سیزده'],
      ['vierzehn','چهارده'],['fünfzehn','پانزده'],['sechzehn','شانزده'],['siebzehn','هفده'],
      ['achtzehn','هجده'],['neunzehn','نوزده'],['zwanzig','بیست'],['dreißig','سی'],
      ['vierzig','چهل'],['fünfzig','پنجاه'],['sechzig','شصت'],['siebzig','هفتاد'],
      ['achtzig','هشتاد'],['neunzig','نود'],['hundert','صد']
    ]
  },
  {
    title:'Das ist meine Mutter.',topic:'خانواده و زبان‌ها',pages:'۱۷–۲۰',
    words:[
      ['die Familie','خانواده'],['die Mutter','مادر'],['der Vater','پدر'],['die Eltern','والدین'],
      ['die Schwester','خواهر'],['der Bruder','برادر'],['das Kind','فرزند / کودک'],
      ['die Kinder','فرزندان'],['der Sohn','پسر'],['die Tochter','دختر'],
      ['die Großmutter','مادربزرگ'],['der Großvater','پدربزرگ'],['die Großeltern','پدربزرگ و مادربزرگ'],
      ['der Mann','مرد / شوهر'],['die Frau','زن / همسر'],['der Freund','دوست مذکر'],
      ['die Freundin','دوست مؤنث'],['mein','مال من (مذکر/خنثی)'],['meine','مال من (مؤنث/جمع)'],
      ['dein','مال تو'],['deine','مال تو (مؤنث/جمع)'],['sprechen','صحبت کردن'],
      ['die Sprache','زبان'],['die Sprachen','زبان‌ها'],['Englisch','انگلیسی'],
      ['Persisch','فارسی'],['Französisch','فرانسوی'],['Spanisch','اسپانیایی'],['Türkisch','ترکی'],
      ['gut','خوب'],['ein bisschen','کمی'],['sehr','خیلی']
    ]
  },
  {
    title:'Der Tisch ist schön!',topic:'مبلمان، رنگ و قیمت‌ها',pages:'۲۵–۲۸',
    words:[
      ['der Tisch','میز'],['der Stuhl','صندلی'],['die Lampe','چراغ'],['das Sofa','مبل'],
      ['das Bett','تخت'],['der Schrank','کمد'],['das Regal','قفسه'],['der Teppich','فرش'],
      ['das Möbelstück','وسیله مبلمان'],['die Möbel','لوازم منزل'],
      ['schön','زیبا'],['hässlich','زشت'],['neu','جدید'],['alt','قدیمی'],
      ['groß','بزرگ'],['klein','کوچک'],['modern','مدرن'],['praktisch','کاربردی'],
      ['teuer','گران'],['günstig','مقرون‌به‌صرفه'],['billig','ارزان'],
      ['rot','قرمز'],['blau','آبی'],['grün','سبز'],['gelb','زرد'],['weiß','سفید'],
      ['schwarz','سیاه'],['braun','قهوه‌ای'],['der Preis','قیمت'],['der Euro','یورو'],
      ['kosten','قیمت داشتن'],['kaufen','خریدن'],['hundert','صد'],['tausend','هزار']
    ]
  },
  {
    title:'Was ist das? – Das ist ein F.',topic:'وسایل و محصولات روزمره',pages:'۲۹–۳۲',
    words:[
      ['das Buch','کتاب'],['der Kugelschreiber','خودکار'],['der Bleistift','مداد'],
      ['das Heft','دفتر'],['das Papier','کاغذ'],['die Tasche','کیف'],['die Brille','عینک'],
      ['die Uhr','ساعت'],['die Flasche','بطری'],['das Handy','موبایل'],['der Schlüssel','کلید'],
      ['das Foto','عکس'],['das Wörterbuch','فرهنگ لغت'],['der Computer','کامپیوتر'],
      ['das Geschenk','هدیه'],['die Farbe','رنگ'],['das Material','جنس / ماده'],
      ['aus Holz','چوبی'],['aus Metall','فلزی'],['aus Kunststoff','پلاستیکی'],
      ['rund','گرد'],['eckig','گوشه‌دار'],['schwer','سنگین'],['leicht','سبک'],
      ['fragen','پرسیدن'],['antworten','پاسخ دادن'],['wiederholen','تکرار کردن'],
      ['verstehen','فهمیدن'],['Vielen Dank','خیلی ممنون']
    ]
  },
  {
    title:'Ich brauche kein Büro.',topic:'دفتر، فناوری و تماس تلفنی',pages:'۳۳–۳۶',
    words:[
      ['das Büro','دفتر کار'],['der Computer','رایانه'],['der Laptop','لپ‌تاپ'],
      ['der Drucker','چاپگر'],['der Bildschirm','نمایشگر'],['die Maus','ماوس'],
      ['die Tastatur','صفحه‌کلید'],['das Telefon','تلفن'],['das Handy','موبایل'],
      ['die E-Mail','ایمیل'],['die SMS','پیامک'],['die Nachricht','پیام'],
      ['der Anruf','تماس'],['anrufen','تلفن زدن'],['brauchen','نیاز داشتن'],
      ['kein','هیچ / نه (مذکر و خنثی)'],['keine','هیچ / نه (مؤنث و جمع)'],
      ['die Adresse','نشانی'],['die Hausnummer','پلاک'],['die Telefonnummer','شماره تلفن'],
      ['die Datei','فایل'],['die Hilfe','کمک'],['der Termin','قرار ملاقات'],
      ['der Kollege','همکار مرد'],['die Kollegin','همکار زن'],
      ['die Besprechung','جلسه کاری'],['schreiben','نوشتن'],['lesen','خواندن'],
      ['schicken','فرستادن']
    ]
  },
  {
    title:'Du kannst wirklich toll ...!',topic:'تفریح، مهارت و تعریف کردن',pages:'۴۱–۴۴',
    words:[
      ['die Freizeit','اوقات فراغت'],['das Hobby','سرگرمی'],['der Sport','ورزش'],
      ['spielen','بازی کردن'],['singen','آواز خواندن'],['tanzen','رقصیدن'],
      ['schwimmen','شنا کردن'],['kochen','آشپزی کردن'],['fotografieren','عکاسی کردن'],
      ['malen','نقاشی کردن'],['lesen','خواندن'],['laufen','دویدن'],
      ['Fahrrad fahren','دوچرخه‌سواری کردن'],['das Klavier','پیانو'],
      ['die Gitarre','گیتار'],['die Musik','موسیقی'],['der Film','فیلم'],
      ['können','توانستن'],['gut','خوب'],['schlecht','بد'],['wirklich','واقعاً'],
      ['toll','عالی'],['super','فوق‌العاده'],['gern','با میل / دوست‌داشتنی'],
      ['das Kompliment','تعریف و تمجید'],['Danke schön','بسیار ممنون']
    ]
  },
  {
    title:'Kein Problem. Ich habe Zeit!',topic:'قرار، روزهای هفته و ساعت',pages:'۴۵–۴۸',
    words:[
      ['der Montag','دوشنبه'],['der Dienstag','سه‌شنبه'],['der Mittwoch','چهارشنبه'],
      ['der Donnerstag','پنجشنبه'],['der Freitag','جمعه'],['der Samstag','شنبه'],
      ['der Sonntag','یکشنبه'],['die Woche','هفته'],['das Wochenende','آخر هفته'],
      ['die Uhrzeit','ساعت'],['die Uhr','ساعت'],['die Minute','دقیقه'],
      ['heute','امروز'],['morgen','فردا'],['übermorgen','پس‌فردا'],['am Abend','عصر'],
      ['am Morgen','صبح'],['der Termin','قرار'],['die Einladung','دعوت'],
      ['die Zeit','زمان'],['Zeit haben','وقت داشتن'],['das Problem','مشکل'],
      ['der Vorschlag','پیشنهاد'],['sich treffen','همدیگر را دیدن'],['später','بعداً'],
      ['um acht Uhr','ساعت هشت'],['halb neun','هشت و نیم'],['leider','متأسفانه'],
      ['vielleicht','شاید'],['kein Problem','مشکلی نیست']
    ]
  },
  {
    title:'Ich möchte was essen, Onkel Harry.',topic:'خوراکی و سفارش غذا',pages:'۴۹–۵۲',
    words:[
      ['das Essen','غذا'],['das Frühstück','صبحانه'],['das Mittagessen','ناهار'],
      ['das Abendessen','شام'],['das Brot','نان'],['die Butter','کره'],
      ['der Käse','پنیر'],['das Ei','تخم‌مرغ'],['die Milch','شیر'],['das Wasser','آب'],
      ['der Kaffee','قهوه'],['der Tee','چای'],['der Saft','آبمیوه'],
      ['das Obst','میوه'],['das Gemüse','سبزیجات'],['der Apfel','سیب'],
      ['die Banane','موز'],['der Salat','سالاد'],['die Suppe','سوپ'],
      ['das Fleisch','گوشت'],['der Fisch','ماهی'],['der Reis','برنج'],
      ['die Kartoffel','سیب‌زمینی'],['mögen','دوست داشتن'],
      ['möchte','مایل هستم'],['essen','خوردن'],['trinken','نوشیدن'],
      ['lecker','خوشمزه'],['hungrig','گرسنه'],['durstig','تشنه'],['die Einladung','دعوت']
    ]
  },
  {
    title:'Ich steige jetzt in die U-Bahn ein.',topic:'سفر و وسایل حمل‌ونقل',pages:'۵۷–۶۰',
    words:[
      ['die U-Bahn','مترو'],['die S-Bahn','قطار شهری'],['der Bus','اتوبوس'],
      ['die Straßenbahn','تراموا'],['der Zug','قطار'],['das Taxi','تاکسی'],
      ['das Auto','خودرو'],['das Fahrrad','دوچرخه'],['der Bahnhof','ایستگاه قطار'],
      ['der Hauptbahnhof','ایستگاه مرکزی قطار'],['die Haltestelle','ایستگاه'],
      ['die Fahrkarte','بلیط'],['der Fahrplan','برنامه حرکت'],['das Gleis','سکوی قطار'],
      ['abfahren','حرکت کردن (وسیله)'],['ankommen','رسیدن'],['einsteigen','سوار شدن'],
      ['aussteigen','پیاده شدن'],['umsteigen','عوض کردن وسیله'],['fahren','رفتن با وسیله'],
      ['die Reise','سفر'],['der Urlaub','تعطیلات'],['jetzt','اکنون'],
      ['später','بعداً'],['wohin','به کجا'],['von','از'],['bis','تا'],
      ['links','چپ'],['rechts','راست']
    ]
  },
  {
    title:'Was hast du heute gemacht?',topic:'برنامه روزانه و گذشته',pages:'۶۱–۶۴',
    words:[
      ['der Alltag','زندگی روزمره'],['aufstehen','بلند شدن'],['frühstücken','صبحانه خوردن'],
      ['arbeiten','کار کردن'],['lernen','یاد گرفتن'],['einkaufen','خرید کردن'],
      ['fernsehen','تلویزیون دیدن'],['kochen','آشپزی کردن'],['schlafen','خوابیدن'],
      ['zu Hause','در خانه'],['die Hausaufgabe','تکلیف خانه'],['der Tagesablauf','برنامه روزانه'],
      ['der Morgen','صبح'],['der Mittag','ظهر'],['der Abend','شب / عصر'],
      ['gestern','دیروز'],['heute','امروز'],['früher','قبلاً'],['spät','دیر'],
      ['das Perfekt','زمان گذشته نقلی'],['gemacht','انجام داده'],['gearbeitet','کار کرده'],
      ['gelernt','یاد گرفته'],['gekauft','خریده'],['besucht','ملاقات کرده'],
      ['gehört','شنیده'],['der Kalender','تقویم'],['die E-Mail','ایمیل']
    ]
  },
  {
    title:'Was ist denn hier passiert?',topic:'جشن‌ها، خاطرات و سفر',pages:'۶۵–۶۸',
    words:[
      ['das Fest','جشن'],['der Geburtstag','تولد'],['die Party','مهمانی'],
      ['die Hochzeit','عروسی'],['das Geschenk','هدیه'],['die Einladung','دعوت'],
      ['feiern','جشن گرفتن'],['einladen','دعوت کردن'],['besuchen','دیدن / ملاقات'],
      ['die Reise','سفر'],['der Urlaub','تعطیلات'],['die Ferien','تعطیلات'],
      ['der Sommer','تابستان'],['der Winter','زمستان'],['der Frühling','بهار'],
      ['der Herbst','پاییز'],['der Januar','ژانویه'],['der Februar','فوریه'],
      ['der März','مارس'],['der April','آوریل'],['der Mai','مه'],['der Juni','ژوئن'],
      ['der Juli','ژوئیه'],['der August','اوت'],['der September','سپتامبر'],
      ['der Oktober','اکتبر'],['der November','نوامبر'],['der Dezember','دسامبر'],
      ['passieren','اتفاق افتادن'],['gefahren','رفته با وسیله'],['gekommen','آمده'],
      ['gegangen','رفته پیاده'],['gewesen','بوده']
    ]
  }
];

export const VOCABULARY_DECKS=raw.map((lesson,index)=>{
 const seen=new Set();
 const cards=lesson.words.filter(([de])=>{
   const key=de.normalize('NFC').toLocaleLowerCase('de').trim();
   if(seen.has(key))return false;
   seen.add(key);return true;
 }).map(([de,fa,example],i)=>({
   id:'vocab:'+String(index+1)+':'+encodeURIComponent(de.normalize('NFC').toLocaleLowerCase('de')),
   lesson:index+1, de,fa,example:example||'',position:i+1
 }));
 return {id:index+1,title:lesson.title,topic:lesson.topic,pages:lesson.pages,
   verifiedComplete:false, cards};
});
export function vocabularyByLesson(id){
 return VOCABULARY_DECKS.find(deck=>deck.id===Number(id))||null;
}
export function vocabularyStatus(card,memory={},schedule={},now=Date.now()){
 const item=memory?.items?.[card.id];
 const s=schedule?.[card.id];
 if(item?.mastery>=80&&item.correct>=3&&item.reviewedDays>=2)return 'mastered';
 if(item?.lastCorrect===false || (item && item.mastery<55) || (s && s.dueAt<=now))return 'weak';
 if(item)return 'learning';
 return 'new';
}
export function vocabularyQueue(cards,memory={},schedule={},filter='all',now=Date.now()){
 return cards.filter(card=>{
   const status=vocabularyStatus(card,memory,schedule,now);
   if(filter==='all')return true;
   if(filter==='due')return !schedule?.[card.id]||schedule[card.id].dueAt<=now;
   return status===filter;
 }).sort((a,b)=>{
   const aDue=schedule?.[a.id]?.dueAt ?? 0;
   const bDue=schedule?.[b.id]?.dueAt ?? 0;
   const aWrong=memory?.items?.[a.id]?.lastCorrect===false?0:1;
   const bWrong=memory?.items?.[b.id]?.lastCorrect===false?0:1;
   return aWrong-bWrong||aDue-bDue||a.position-b.position;
 });
}
