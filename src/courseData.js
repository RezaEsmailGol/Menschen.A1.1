// Original practice content aligned to CEFR A1 topics.
// These are independent companion exercises, not a transcription of Hueber Menschen.
export const pronouns = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'];
export const verbForms = {
  kommen: ['komme','kommst','kommt','kommen','kommt','kommen'],
  heißen: ['heiße','heißt','heißt','heißen','heißt','heißen'],
  sein: ['bin','bist','ist','sind','seid','sind'],
  wohnen: ['wohne','wohnst','wohnt','wohnen','wohnt','wohnen'],
  sprechen: ['spreche','sprichst','spricht','sprechen','sprecht','sprechen'],
  haben: ['habe','hast','hat','haben','habt','haben'],
  arbeiten: ['arbeite','arbeitest','arbeitet','arbeiten','arbeitet','arbeiten'],
  machen: ['mache','machst','macht','machen','macht','machen'],
  spielen: ['spiele','spielst','spielt','spielen','spielt','spielen'],
  lesen: ['lese','liest','liest','lesen','lest','lesen'],
  brauchen: ['brauche','brauchst','braucht','brauchen','braucht','brauchen'],
  kaufen: ['kaufe','kaufst','kauft','kaufen','kauft','kaufen'],
  suchen: ['suche','suchst','sucht','suchen','sucht','suchen'],
  fahren: ['fahre','fährst','fährt','fahren','fahrt','fahren'],
  gehen: ['gehe','gehst','geht','gehen','geht','gehen'],
  müssen: ['muss','musst','muss','müssen','müsst','müssen'],
  schreiben: ['schreibe','schreibst','schreibt','schreiben','schreibt','schreiben'],
  schicken: ['schicke','schickst','schickt','schicken','schickt','schicken'],
  möchten: ['möchte','möchtest','möchte','möchten','möchtet','möchten'],
  können: ['kann','kannst','kann','können','könnt','können'],
};

export const lessons = [
  {
    id:1, label:'آشنایی و معرفی', german:'Sich vorstellen', goal:'نام، کشور، زبان و شغلت را معرفی کن.',
    grammar:'ضمیرهای شخصی و جایگاه دوم فعل در جمله خبری',
    tip:'در جمله خبری معمولاً فعل صرف‌شده جایگاه دوم قرار می‌گیرد: Ich komme aus Iran.',
    verbs:['kommen','heißen','sein'],
    words:[['der Name','نام'],['der Vorname','نام کوچک'],['der Nachname','نام خانوادگی'],['das Land','کشور'],['die Sprache','زبان'],['die Stadt','شهر'],['Deutsch','آلمانی'],['der Beruf','شغل']],
    sentences:[['Ich heiße Reza.','اسم من رضا است.'],['Ich komme aus dem Iran.','من اهل ایران هستم.'],['Ich lerne Deutsch.','من آلمانی یاد می‌گیرم.'],['Mein Beruf ist Softwareentwickler.','شغل من توسعه‌دهنده نرم‌افزار است.']],
  },
  {
    id:2, label:'شهر و اطلاعات تماس', german:'Wohnort und Kontakt',goal:'محل زندگی و اطلاعات تماس را بگو.',
    grammar:'سؤال‌سازی با Wo / Wie و صرف wohnen',
    tip:'در پرسش با کلمه سؤالی، فعل معمولاً بلافاصله بعد از کلمه پرسشی می‌آید: Wo wohnst du?',
    verbs:['wohnen','sprechen'],
    words:[['die Adresse','آدرس'],['die Straße','خیابان'],['die Hausnummer','پلاک خانه'],['die Postleitzahl','کد پستی'],['die Telefonnummer','شماره تلفن'],['die E-Mail','ایمیل'],['die Wohnung','آپارتمان'],['die Nummer','شماره']],
    sentences:[['Ich wohne in Qom.','من در قم زندگی می‌کنم.'],['Wie ist deine Telefonnummer?','شماره تلفنت چیست؟'],['Meine Adresse ist in Qom.','آدرس من در قم است.'],['Ich spreche Persisch und Englisch.','من فارسی و انگلیسی صحبت می‌کنم.']],
  },
  {
    id:3, label:'خانواده و دوستان',german:'Familie und Freunde',goal:'درباره اعضای خانواده و داشتن/نداشتن چیزی حرف بزن.',
    grammar:'حروف ملکی mein / meine و فعل haben',
    tip:'mein Bruder ولی meine Schwester؛ شکل صفت ملکی به اسم وابسته است.',
    verbs:['haben','sein'],
    words:[['die Familie','خانواده'],['der Vater','پدر'],['die Mutter','مادر'],['das Kind','فرزند'],['die Schwester','خواهر'],['der Bruder','برادر'],['der Freund','دوست مذکر'],['die Freundin','دوست مؤنث']],
    sentences:[['Das ist meine Familie.','این خانواده من است.'],['Ich habe ein Kind.','من یک فرزند دارم.'],['Mein Bruder wohnt in Wien.','برادرم در وین زندگی می‌کند.'],['Meine Mutter ist zu Hause.','مادرم در خانه است.']],
  },
  {
    id:4, label:'کار و شغل',german:'Beruf und Arbeit',goal:'شغل، شرکت و کار روزانه را توضیح بده.',
    grammar:'صرف فعل‌های منظم arbeiten و machen',
    tip:'ریشه فعل arbeiten به t ختم می‌شود، پس du arbeitest و er arbeitet می‌گوییم.',
    verbs:['arbeiten','machen'],
    words:[['die Arbeit','کار'],['die Firma','شرکت'],['das Büro','دفتر کار'],['der Kollege','همکار مذکر'],['die Kollegin','همکار مؤنث'],['der Computer','کامپیوتر'],['der Entwickler','توسعه‌دهنده مذکر'],['das Projekt','پروژه']],
    sentences:[['Ich arbeite als Entwickler.','من به‌عنوان توسعه‌دهنده کار می‌کنم.'],['Wir arbeiten im Büro.','ما در دفتر کار می‌کنیم.'],['Ich mache ein Projekt.','من روی یک پروژه کار می‌کنم.'],['Der Computer ist neu.','این کامپیوتر جدید است.']],
  },
  {
    id:5, label:'سرگرمی و اوقات آزاد',german:'Freizeit und Hobbys',goal:'بگو اوقات فراغت چه کاری دوست داری انجام بدهی.',
    grammar:'جایگاه فعل و قید gern',
    tip:'gern معمولاً پس از فعل یا مفعول در جمله می‌آید: Ich lese gern.',
    verbs:['spielen','lesen'],
    words:[['das Hobby','سرگرمی'],['die Musik','موسیقی'],['das Buch','کتاب'],['der Film','فیلم'],['der Sport','ورزش'],['das Spiel','بازی'],['die Freizeit','اوقات فراغت'],['das Wochenende','آخر هفته']],
    sentences:[['Ich lese gern Bücher.','من خواندن کتاب را دوست دارم.'],['Wir spielen am Wochenende.','ما آخر هفته بازی می‌کنیم.'],['Meine Freundin hört Musik.','دوست من موسیقی گوش می‌دهد.'],['Ich sehe einen Film.','من فیلم می‌بینم.']],
  },
  {
    id:6, label:'روزها، ساعت و قرار',german:'Uhrzeit und Termine',goal:'ساعت قرار و روز هفته را بیان کن.',
    grammar:'حروف اضافه زمانی am و um',
    tip:'برای ساعت از um استفاده کن (um neun Uhr) و برای روزهای هفته از am (am Montag).',
    verbs:['kommen','haben'],
    words:[['der Montag','دوشنبه'],['der Dienstag','سه‌شنبه'],['der Mittwoch','چهارشنبه'],['der Freitag','جمعه'],['die Uhr','ساعت'],['der Termin','قرار ملاقات'],['heute','امروز'],['morgen','فردا']],
    sentences:[['Der Termin ist am Montag.','قرار دوشنبه است.'],['Ich komme um neun Uhr.','من ساعت ۹ می‌آیم.'],['Heute habe ich Zeit.','امروز وقت دارم.'],['Morgen ist Freitag.','فردا جمعه است.']],
  },
  {
    id:7, label:'خرید و نیازهای روزانه',german:'Einkaufen',goal:'نام کالا، قیمت و درخواست ساده در خرید را تمرین کن.',
    grammar:'کاربرد ich brauche و ich möchte',
    tip:'برای درخواست مؤدبانه Ich möchte ... مناسب است؛ möchte با ich صرف شده.',
    verbs:['kaufen','brauchen','möchten'],
    words:[['das Brot','نان'],['das Wasser','آب'],['die Milch','شیر'],['das Obst','میوه'],['der Preis','قیمت'],['der Euro','یورو'],['das Geschäft','فروشگاه'],['die Kasse','صندوق']],
    sentences:[['Ich möchte ein Brot.','من یک نان می‌خواهم.'],['Das Wasser kostet zwei Euro.','این آب دو یورو قیمت دارد.'],['Ich kaufe Obst.','من میوه می‌خرم.'],['Wir brauchen Milch.','ما شیر لازم داریم.']],
  },
  {
    id:8, label:'خانه و وسایل',german:'Wohnung und Zimmer',goal:'اتاق‌ها، وسایل و خانه مدنظرت را توصیف کن.',
    grammar:'حرف تعریف der / die / das و جمع اسم‌ها',
    tip:'اسم را همیشه با حرف تعریفش یاد بگیر؛ جنس دستوری اسم قابل حدس قطعی نیست.',
    verbs:['wohnen','suchen'],
    words:[['das Zimmer','اتاق'],['die Küche','آشپزخانه'],['das Bad','حمام'],['das Bett','تخت'],['der Tisch','میز'],['der Stuhl','صندلی'],['das Fenster','پنجره'],['die Miete','اجاره']],
    sentences:[['Die Wohnung hat zwei Zimmer.','آپارتمان دو اتاق دارد.'],['Ich suche eine Wohnung.','من دنبال یک آپارتمان می‌گردم.'],['Das Fenster ist groß.','پنجره بزرگ است.'],['Die Miete ist hoch.','اجاره بالاست.']],
  },
  {
    id:9, label:'مسیر و رفت‌وآمد',german:'Unterwegs in der Stadt',goal:'درباره وسیله نقلیه و مسیر رفتن بپرس.',
    grammar:'رفتن با fahren یا gehen و عبارت mit dem Bus',
    tip:'برای وسیله نقلیه غالباً mit + Dativ استفاده می‌شود: mit dem Bus.',
    verbs:['fahren','gehen'],
    words:[['der Bus','اتوبوس'],['der Zug','قطار'],['die U-Bahn','مترو'],['die Haltestelle','ایستگاه'],['der Bahnhof','ایستگاه قطار'],['das Ticket','بلیط'],['der Weg','مسیر'],['links','چپ']],
    sentences:[['Ich fahre mit dem Bus.','من با اتوبوس می‌روم.'],['Wo ist der Bahnhof?','ایستگاه قطار کجاست؟'],['Wir gehen zu Fuß.','ما پیاده می‌رویم.'],['Der Zug kommt um acht Uhr.','قطار ساعت هشت می‌رسد.']],
  },
  {
    id:10, label:'سلامتی و قرار پزشکی',german:'Gesundheit',goal:'حالت خود را ساده توضیح بده و قرار پزشکی بگیر.',
    grammar:'افعال مُدال müssen و können',
    tip:'بعد از فعل مُدال، فعل اصلی به صورت مصدر آخر جمله می‌رود: Ich muss arbeiten.',
    verbs:['müssen','können','haben'],
    words:[['der Arzt','پزشک مرد'],['die Ärztin','پزشک زن'],['der Kopf','سر'],['der Schmerz','درد'],['das Medikament','دارو'],['die Apotheke','داروخانه'],['krank','بیمار'],['gesund','سالم']],
    sentences:[['Ich habe Kopfschmerzen.','من سردرد دارم.'],['Ich muss zum Arzt gehen.','باید پیش پزشک بروم.'],['Kann ich einen Termin haben?','می‌توانم وقت ملاقات بگیرم؟'],['Die Apotheke ist hier.','داروخانه اینجاست.']],
  },
  {
    id:11, label:'پیام و ارتباط اداری',german:'E-Mail und Büro',goal:'یک پیام کوتاه اداری بنویس و درخواست کمک کن.',
    grammar:'جمله پرسشی با Können Sie ...?',
    tip:'در سؤال بله/خیر، فعل صرف‌شده می‌تواند اول جمله بیاید: Können Sie mir helfen?',
    verbs:['schreiben','schicken','können'],
    words:[['die Nachricht','پیام'],['der Anruf','تماس تلفنی'],['die E-Mail-Adresse','آدرس ایمیل'],['die Datei','فایل'],['der Fehler','خطا'],['die Antwort','پاسخ'],['die Frage','سؤال'],['die Hilfe','کمک']],
    sentences:[['Ich schreibe eine E-Mail.','من ایمیل می‌نویسم.'],['Können Sie mir helfen?','می‌توانید به من کمک کنید؟'],['Ich schicke die Datei.','من فایل را می‌فرستم.'],['Ich habe eine Frage.','من یک سؤال دارم.']],
  },
  {
    id:12, label:'معرفی کاری برای اتریش',german:'Arbeiten in Österreich',goal:'خودت و هدف شغلی‌ات را در چند جمله معرفی کن.',
    grammar:'جمله‌سازی با möchte و kann',
    tip:'در ساختار möchte + مصدر، فعل اصلی به آخر جمله می‌رود: Ich möchte in Wien arbeiten.',
    verbs:['möchten','können','arbeiten'],
    words:[['die Bewerbung','درخواست استخدام'],['die Berufserfahrung','سابقه کاری'],['die Ausbildung','تحصیلات / آموزش'],['die Arbeitserlaubnis','مجوز کار'],['die Stelle','موقعیت شغلی'],['die Erfahrung','تجربه'],['die Fähigkeit','توانایی'],['der Lebenslauf','رزومه']],
    sentences:[['Ich möchte in Österreich arbeiten.','می‌خواهم در اتریش کار کنم.'],['Ich habe Erfahrung mit Python.','من با پایتون تجربه دارم.'],['Ich kann Webanwendungen entwickeln.','می‌توانم برنامه‌های تحت وب توسعه بدهم.'],['Ich schreibe eine Bewerbung.','من درخواست استخدام می‌نویسم.']],
  },
];

export function lessonCardId(lessonId, index) {
  return `a11:${lessonId}:${index}`;
}
export function getLessonCards(lesson) {
  return lesson.words.map(([de,fa],index) => ({
    id: lessonCardId(lesson.id,index),
    lesson: lesson.id,
    front: fa,
    back: de,
    speak: de,
  }));
}
export const allStudyCards = lessons.flatMap(getLessonCards);
