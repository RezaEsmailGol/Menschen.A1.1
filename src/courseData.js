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
  kosten: ['koste','kostest','kostet','kosten','kostet','kosten'],
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
    id:1, label:'سلام، احوال‌پرسی و معرفی', german:'Hallo! Ich bin Nicole ...',
    goal:'سلام کن، نام و کشور خودت و دیگران را بگو، احوال‌پرسی کن و خداحافظی کن. (کتاب: صفحه ۹–۱۲)',
    grammar:'صرف مفرد heißen / kommen / sein و پرسش‌های Wer? Wie? Woher?؛ خطاب du و Sie',
    tip:'Ich heiße Reza. · Woher kommst du? · Ich komme aus dem Iran. در خطاب رسمی بگو: Wie heißen Sie?',
    verbs:['heißen','kommen','sein'],
    words:[
      ['Hallo','سلام'],['Guten Morgen','صبح بخیر'],['Guten Tag','روز بخیر'],['Guten Abend','عصر بخیر'],
      ['Auf Wiedersehen','خداحافظ رسمی'],['Tschüs','خداحافظ دوستانه'],['der Name','نام'],
      ['Deutschland','آلمان'],['Österreich','اتریش'],['die Schweiz','سوئیس'],
      ['Spanien','اسپانیا'],['Mexiko','مکزیک'],['das Alphabet','الفبا'],['gut','خوب']
    ],
    sentences:[
      ['Hallo! Ich heiße Reza.','سلام! اسم من رضا است.'],
      ['Wie heißt du?','اسم تو چیست؟'],
      ['Woher kommst du?','اهل کجا هستی؟'],
      ['Ich komme aus dem Iran.','من اهل ایران هستم.'],
      ['Wie geht es Ihnen?','حال شما چطور است؟ (رسمی)'],
      ['Gut, danke. Und dir?','خوبم، ممنون. تو چطوری؟']
    ],
  },
  {
    id:2, label:'شغل و اطلاعات شخصی', german:'Ich bin Journalistin.',
    goal:'درباره شغل و وضعیت تأهل بگو، مشخصات کوتاه بخوان و بنویس و اعداد ۱ تا ۱۰۰ را تمرین کن. (کتاب: صفحه ۱۳–۱۶)',
    grammar:'صرف مفرد و جمع arbeiten / sein / haben، منفی‌سازی nicht و مؤنث شغل‌ها با -in',
    tip:'Ich arbeite als Softwareentwickler. · Sie ist Journalistin. · Ich bin nicht verheiratet. · Wir arbeiten.',
    verbs:['arbeiten','sein','haben'],
    words:[
      ['der Beruf','شغل'],['der Journalist','روزنامه‌نگار مرد'],['die Journalistin','روزنامه‌نگار زن'],
      ['der Lehrer','معلم مرد'],['die Lehrerin','معلم زن'],['der Arzt','پزشک مرد'],
      ['die Ärztin','پزشک زن'],['der Softwareentwickler','توسعه‌دهنده نرم‌افزار مرد'],
      ['die Softwareentwicklerin','توسعه‌دهنده نرم‌افزار زن'],['arbeiten','کار کردن'],
      ['ledig','مجرد'],['verheiratet','متأهل'],['geschieden','طلاق‌گرفته'],
      ['der Familienstand','وضعیت تأهل'],['die Visitenkarte','کارت ویزیت'],
      ['die Telefonnummer','شماره تلفن'],['hundert','صد']
    ],
    sentences:[
      ['Was sind Sie von Beruf?','شغل شما چیست؟ (رسمی)'],
      ['Ich bin Softwareentwickler.','من توسعه‌دهنده نرم‌افزار هستم.'],
      ['Sie ist Journalistin.','او روزنامه‌نگار است.'],
      ['Wir arbeiten in einer Firma.','ما در یک شرکت کار می‌کنیم.'],
      ['Ich bin verheiratet.','من متأهل هستم.'],
      ['Ich bin nicht ledig.','من مجرد نیستم.']
    ],
  },
  {
    id:3,label:'خانواده، صفات ملکی و زبان‌ها',german:'Das ist meine Mutter.',
    goal:'خانواده را معرفی کن، در مورد اعضا سؤال بپرس، mein/dein و پاسخ Ja/Nein/Doch را تمرین کن. (کتاب: صفحه ۱۷–۲۰)',
    grammar:'صفات ملکی mein/meine و dein/deine؛ سؤال بله/خیر با فعل در آغاز؛ Ja/Nein/Doch؛ sprechen و تغییر واکه',
    tip:'Das ist mein Vater. اما Das ist meine Mutter. / Ist das nicht deine Mutter? – Doch!',
    verbs:['sein','haben','sprechen'],
    words:[
      ['die Familie','خانواده'],['die Mutter','مادر'],['der Vater','پدر'],
      ['die Eltern','پدر و مادر'],['die Schwester','خواهر'],['der Bruder','برادر'],
      ['der Sohn','پسر'],['die Tochter','دختر'],['das Kind','فرزند'],['die Kinder','فرزندان'],
      ['die Oma','مادربزرگ'],['der Opa','پدربزرگ'],['meine','مال من (مؤنث/جمع)'],
      ['mein','مال من (مذکر/خنثی)'],['dein','مال تو (مذکر/خنثی)'],
      ['deine','مال تو (مؤنث/جمع)'],['Deutsch','آلمانی'],['Persisch','فارسی'],
      ['Englisch','انگلیسی'],['sprechen','صحبت کردن']
    ],
    sentences:[
      ['Das ist meine Mutter.','این مادر من است.'],
      ['Das ist mein Vater.','این پدر من است.'],
      ['Das sind meine Eltern.','این‌ها پدر و مادر من هستند.'],
      ['Ist das deine Schwester?','آیا این خواهر تو است؟'],
      ['Nein, das ist mein Bruder.','نه، این برادر من است.'],
      ['Welche Sprachen sprichst du?','چه زبان‌هایی صحبت می‌کنی؟'],
      ['Ich spreche Persisch und ein bisschen Deutsch.','من فارسی و کمی آلمانی صحبت می‌کنم.']
    ]
  },
  {
    id:4,label:'مبلمان و وسایل خانه، قیمت و توصیف',german:'Der Tisch ist schön!',
    goal:'میز، صندلی، تخت، کمد و سایر مبلمان را بشناس، جنسیت اسم را تشخیص بده، قیمت بپرس و وسایل را توصیف کن. (کتاب: صفحه ۲۵–۲۸)',
    grammar:'حرف تعریف معین der/die/das؛ ضمایر er/sie/es برای اشیا؛ صفت در جمله خبری؛ فعل kosten',
    tip:'der Tisch → er؛ die Lampe → sie؛ das Sofa → es. مثال: Die Lampe ist schön. Sie kostet 30 Euro.',
    verbs:['sein','kaufen','kosten'],
    words:[
      ['der Tisch','میز'],['der Stuhl','صندلی'],['die Lampe','چراغ'],['das Sofa','مبل'],
      ['das Bett','تخت'],['der Schrank','کمد'],['das Regal','قفسه'],
      ['der Teppich','فرش'],['die Couch','کاناپه'],['der Sessel','مبل تک‌نفره'],
      ['der Spiegel','آینه'],['das Bild','تابلو'],['die Möbel','مبلمان'],
      ['schön','زیبا'],['hässlich','زشت'],['klein','کوچک'],['groß','بزرگ'],
      ['neu','جدید'],['alt','قدیمی'],['teuer','گران'],['günstig','مناسب قیمت'],
      ['der Preis','قیمت'],['der Euro','یورو'],['kosten','قیمت داشتن']
    ],
    sentences:[
      ['Der Tisch ist schön.','میز زیبا است.'],
      ['Die Lampe ist neu.','چراغ جدید است.'],
      ['Das Sofa ist groß.','مبل بزرگ است.'],
      ['Das ist ein Tisch.','این یک میز است.'],
      ['Das ist eine Lampe.','این یک چراغ است.'],
      ['Was kostet der Stuhl?','صندلی چند قیمت دارد؟'],
      ['Der Stuhl kostet 50 Euro.','صندلی ۵۰ یورو است.'],
      ['Sie ist günstig.','آن مؤنث (مثلاً چراغ) ارزان است.']
    ]
  },
  {
    id:5,label:'معرفی اشیا، جنسیت و نفی اسم‌ها',german:'Was ist das? – Das ist ein F.',
    goal:'نام اشیای روزمره را بگو، ein/eine/kein/keine را درست انتخاب کن و جنس محصول را توصیف کن. (کتاب: صفحه ۲۹–۳۲)',
    grammar:'حرف تعریف نامعین ein/eine و منفی kein/keine در حالت Nominativ؛ اسم‌های der/die/das؛ جنس aus + Material',
    tip:'Das ist ein Schlüssel (der). Das ist eine Brille (die). Das ist ein Buch (das). Das ist keine Tasche.',
    verbs:['sein','heißen','haben'],
    words:[
      ['der Schlüssel','کلید'],['der Kugelschreiber','خودکار'],
      ['der Bleistift','مداد'],['der Fotoapparat','دوربین'],
      ['das Buch','کتاب'],['die Flasche','بطری'],['die Brille','عینک'],
      ['die Tasche','کیف'],['die Kette','گردنبند'],['das Feuerzeug','فندک'],
      ['die Uhr','ساعت'],['die Farbe','رنگ'],['das Material','جنس / ماده'],
      ['das Holz','چوب'],['das Glas','شیشه'],['das Papier','کاغذ'],
      ['das Metall','فلز'],['ein','یک (مذکر/خنثی)'],['eine','یک (مؤنث)'],
      ['kein','هیچ / نیست (مذکر/خنثی)'],['keine','هیچ / نیست (مؤنث/جمع)']
    ],
    sentences:[
      ['Was ist das?','این چیست؟'],
      ['Das ist ein Schlüssel.','این یک کلید است.'],
      ['Das ist eine Flasche.','این یک بطری است.'],
      ['Das ist ein Buch.','این یک کتاب است.'],
      ['Das ist keine Tasche.','این کیف نیست.'],
      ['Das ist kein Tisch.','این میز نیست.'],
      ['Der Schlüssel ist aus Metall.','کلید از فلز است.'],
      ['Wie heißt das auf Deutsch?','این به آلمانی چه نام دارد؟'],
      ['Noch einmal, bitte!','یک بار دیگر، لطفاً!']
    ]
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
  return lessonId>=3&&lessonId<=5 ? `a11:book-${lessonId}:${index}` : `a11:${lessonId}:${index}`;
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
