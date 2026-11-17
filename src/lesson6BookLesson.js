import {articleNouns} from './articleNouns.js';

// Independently authored practice aligned with Menschen A1.1, Lektion 6 (Kursbuch pp. 33–36).
// The lesson scope follows the published topics: office/technology vocabulary, singular/plural,
// accusative, phone strategies, email/SMS reading and the vowel ü. No textbook exercises are copied.
const officeCards = articleNouns
  .filter(noun => noun.lesson === 6)
  .map(noun => [noun.icon, noun.word, noun.fa]);

export const lesson6BookLesson = {
  title: 'Ich brauche kein Büro.',
  pages: '۳۳ تا ۳۶',
  focus: 'دفتر کار و فناوری، جمع اسم‌ها، Akkusativ، تماس تلفنی، ایمیل و پیامک',
  supplemental: false,
  goals: [
    'نام وسایل دفتر کار و فناوری را همراه der / die / das یاد بگیر',
    'شکل جمع اسم‌ها و الگوهای رایج جمع را تشخیص بده',
    'مفعول مستقیم را در Akkusativ با حرف تعریف معین، نامعین و منفی بساز',
    'تماس تلفنی را با Hier ist ... آغاز کن و با Auf Wiederhören پایان بده',
    'ساختار یک ایمیل کوتاه و پیامک را بخوان و اطلاعات اصلی را پیدا کن',
    'صدای ü را در واژه‌هایی مانند Büro و Grüße تشخیص بده'
  ],
  sections: [
    {
      id: 'office-vocabulary',
      title: '۱. Büro und Computer · دفتر کار و فناوری',
      caption: 'تصویر هر وسیله را ببین، نام آلمانی و معنی فارسی را یاد بگیر و تلفظش را بشنو.',
      cards: officeCards,
      tasks: [
        {id:'l6-office-v01',type:'choice',prompt:'کدام واژه به معنی «لپ‌تاپ» است؟',choices:['der Laptop','das Handy','der Drucker','die Maus'],answer:'der Laptop',why:'der Laptop یعنی لپ‌تاپ.'},
        {id:'l6-office-v02',type:'choice',prompt:'«ایمیل» در آلمانی کدام است؟',choices:['die E-Mail','das Formular','die Rechnung','die SMS'],answer:'die E-Mail',why:'می‌گوییم die E-Mail؛ جمع آن die E-Mails است.'},
        {id:'l6-office-v03',type:'choice',prompt:'حرف تعریف درست Handy چیست؟',choices:['das Handy','der Handy','die Handy','den Handy'],answer:'das Handy',why:'Handy خنثی است: das Handy.'},
        {id:'l6-office-v04',type:'choice',prompt:'کدام واژه به معنی «ماوس رایانه» است؟',choices:['die Maus','der Bildschirm','der Kalender','das Telefon'],answer:'die Maus',why:'die Maus؛ شکل جمع آن die Mäuse است.'},
        {id:'l6-office-v05',type:'choice',prompt:'«نمایشگر» را با حرف تعریف درست انتخاب کن.',choices:['der Bildschirm','das Bildschirm','die Bildschirm','den Bildschirm'],answer:'der Bildschirm',why:'der Bildschirm؛ جمع آن die Bildschirme است.'},
        {id:'l6-office-v06',type:'choice',prompt:'Briefmarke چه معنایی دارد؟',choices:['تمبر','صورتحساب','قرار ملاقات','دفترچه یادداشت'],answer:'تمبر'},
        {id:'l6-office-v07',type:'choice',prompt:'Rechnung به چه معناست؟',choices:['صورتحساب','تلفن','تقویم','چاپگر'],answer:'صورتحساب'},
        {id:'l6-office-v08',type:'choice',prompt:'der Termin یعنی چه؟',choices:['قرار ملاقات','صفحه‌نمایش','کیف پول','دفتر کار'],answer:'قرار ملاقات'},
        {id:'l6-office-v09',type:'choice',prompt:'«دفترچه یادداشت» کدام است؟',choices:['das Notizbuch','der Kalender','die Rechnung','das Formular'],answer:'das Notizbuch'},
        {id:'l6-office-v10',type:'choice',prompt:'برای گفتن «محل کار زیباست، اما کاربردی نیست» کدام جمله درست است؟',choices:['Der Arbeitsplatz ist schön, aber nicht praktisch.','Der Arbeitsplatz ist sehr teuer.','Das Büro ist sehr klein.','Ich brauche keinen Arbeitsplatz.'],answer:'Der Arbeitsplatz ist schön, aber nicht praktisch.'}
      ]
    },
    {
      id: 'singular-plural-accusative',
      title: '۲. Singular, Plural und Akkusativ · مفرد، جمع و مفعول',
      caption: 'هم شکل جمع اسم‌ها را تمرین کن و هم تغییر حرف تعریف در Akkusativ را.',
      cards: [
        ['📱','ein Handy – drei Handys','یک موبایل – سه موبایل'],
        ['📧','eine E-Mail – drei E-Mails','یک ایمیل – سه ایمیل'],
        ['🖥️','ein Bildschirm – zwei Bildschirme','یک نمایشگر – دو نمایشگر'],
        ['📓','ein Notizbuch – zwei Notizbücher','یک دفترچه – دو دفترچه'],
        ['🖨️','ein Drucker – zwei Drucker','یک چاپگر – دو چاپگر'],
        ['✉️','eine Briefmarke – drei Briefmarken','یک تمبر – سه تمبر'],
        ['🧾','eine Rechnung – zwei Rechnungen','یک صورتحساب – دو صورتحساب'],
        ['🔵','der Laptop → den Laptop','مذکر: der به den تغییر می‌کند'],
        ['🟣','ein Laptop → einen Laptop','نامعین مذکر: ein به einen'],
        ['🚫','kein Laptop → keinen Laptop','منفی مذکر: kein به keinen'],
         ['🖱️','eine Maus → eine Maus','مؤنث در Akkusativ تغییر نمی‌کند'],
         ['🖱️','keine Maus → keine Maus','منفی مؤنث'],
         ['📱','ein Handy → ein Handy','خنثی در Akkusativ تغییر نمی‌کند'],
         ['✉️','keine Briefmarken','منفی جمع'],
      ],
      tasks: [
        {id:'l6-office-g01',type:'choice',prompt:'جمع das Handy کدام است؟',choices:['die Handys','die Handyes','die Handy','der Handys'],answer:'die Handys',why:'بسیاری از واژه‌های وام‌گرفته مانند Handy در جمع s می‌گیرند.'},
        {id:'l6-office-g02',type:'choice',prompt:'جمع die E-Mail را انتخاب کن.',choices:['die E-Mails','die E-Mailen','die E-Maile','das E-Mails'],answer:'die E-Mails',why:'E-Mail در جمع s می‌گیرد.'},
        {id:'l6-office-g03',type:'choice',prompt:'جمع der Bildschirm چیست؟',choices:['die Bildschirme','die Bildschirm','die Bildschirmen','der Bildschirme'],answer:'die Bildschirme',why:'Bildschirm در جمع e می‌گیرد.'},
        {id:'l6-office-g04',type:'choice',prompt:'جمع das Notizbuch کدام است؟',choices:['die Notizbücher','die Notizbuchs','die Notizbuche','der Notizbücher'],answer:'die Notizbücher',why:'Notizbuch در جمع -er می‌گیرد و واکه تغییر می‌کند.'},
        {id:'l6-office-g05',type:'choice',prompt:'جمع die Briefmarke چیست؟',choices:['die Briefmarken','die Briefmarke','die Briefmarkes','der Briefmarken'],answer:'die Briefmarken',why:'اسم مؤنث Briefmarke در اینجا پسوند -n می‌گیرد.'},
        {id:'l6-office-g06',type:'choice',prompt:'جای خالی را کامل کن: Ich brauche ___ Laptop.',choices:['einen','ein','eine','den'],answer:'einen',why:'Laptop مذکر است و مفعول مستقیم در Akkusativ می‌آید: einen Laptop.'},
        {id:'l6-office-g07',type:'choice',prompt:'جای خالی را کامل کن: Ich suche ___ Kalender.',choices:['den','der','die','das'],answer:'den',why:'حرف تعریف معین مذکر در Akkusativ از der به den تغییر می‌کند.'},
        {id:'l6-office-g08',type:'choice',prompt:'جای خالی را کامل کن: Ich habe ___ Drucker.',choices:['keinen','kein','keine','nicht'],answer:'keinen',why:'Drucker مذکر است و در Akkusativ منفی، kein به keinen تبدیل می‌شود.'},
        {id:'l6-office-g09',type:'choice',prompt:'جای خالی را کامل کن: Ich brauche ___ Maus.',choices:['eine','einen','ein','einer'],answer:'eine',why:'Maus مؤنث است؛ eine در Akkusativ بدون تغییر می‌ماند.'},
        {id:'l6-office-g10',type:'choice',prompt:'جای خالی را کامل کن: Ich brauche ___ Briefmarken.',choices:['keine','kein','keinen','eine'],answer:'keine',why:'در جمع، kein به keine تبدیل می‌شود؛ این شکل در Akkusativ جمع هم ثابت می‌ماند.'}
      ]
    },
    {
      id: 'phone-strategies',
      title: '۳. Telefonieren · مکالمه تلفنی',
      caption: 'تماس را شروع کن، خودت را معرفی کن، سؤال بپرس و مکالمه را مؤدبانه تمام کن.',
      cards: [
        ['☎️','Brenner IT-Consulting, guten Tag.','شرکت برنر، روز بخیر'],
        ['👋','Guten Tag, hier ist Reza.','روز بخیر، رضا هستم'],
        ['🗣️','Hier ist ...','... هستم'],
        ['❓','Wo ist denn der Kalender?','پس تقویم کجاست؟'],
        ['⏳','Einen Moment, bitte.','یک لحظه لطفاً'],
        ['🙏','Vielen Dank!','بسیار ممنون'],
        ['☎️','Auf Wiederhören!','خدانگهدار تلفنی']
      ],
      reading: 'A: Guten Tag, hier ist Reza.\\nB: Guten Tag. Was kann ich für Sie tun?\\nA: Ich suche den Kalender.\\nB: Einen Moment, bitte.\\nA: Vielen Dank. Auf Wiederhören!',
      tasks: [
        {id:'l6-office-t01',type:'choice',prompt:'برای پاسخ‌گویی رسمی به تماس شرکت، کدام عبارت مناسب است؟',choices:['Brenner IT-Consulting, guten Tag.','Gute Nacht, tschüs.','Ich bin im Park.','Was kostet das?'],answer:'Brenner IT-Consulting, guten Tag.'},
        {id:'l6-office-t02',type:'choice',prompt:'برای معرفی خودت پشت تلفن کدام عبارت را می‌گویی؟',choices:['Guten Tag, hier ist Reza.','Guten Tag, ich bin Büro.','Ich habe ein Kalender.','Woher ist der Laptop?'],answer:'Guten Tag, hier ist Reza.'},
        {id:'l6-office-t03',type:'choice',prompt:'کدام عبارت برای پایان تماس تلفنی مناسب است؟',choices:['Auf Wiederhören!','Guten Morgen!','Wie heißt du?','Ich brauche einen Laptop.'],answer:'Auf Wiederhören!',why:'Auf Wiederhören برای خداحافظی در تماس تلفنی است.'},
        {id:'l6-office-t04',type:'choice',prompt:'برای پرسیدن «تقویم کجاست؟» کدام جمله درست است؟',choices:['Wo ist denn der Kalender?','Wer ist denn der Kalender?','Wie kostet der Kalender?','Woher ist den Kalender?'],answer:'Wo ist denn der Kalender?'},
        {id:'l6-office-t05',type:'choice',prompt:'اگر طرف مقابل بگوید «Einen Moment, bitte»، منظورش چیست؟',choices:['یک لحظه لطفاً','خداحافظ تلفنی','من وقت ندارم','قرار ملاقات لغو شد'],answer:'یک لحظه لطفاً'},
        {id:'l6-office-t06',type:'build',prompt:'جمله را بساز: روز بخیر، رضا هستم.',answer:'Guten Tag, hier ist Reza.'},
        {id:'l6-office-t07',type:'listen',prompt:'عبارت معرفی خود پشت تلفن را بشنو و بنویس.',audio:'Hier ist Reza.',answer:'Hier ist Reza.'},
        {id:'l6-office-t08',type:'listen',prompt:'خداحافظی تلفنی را بشنو و بنویس.',audio:'Auf Wiederhören!',answer:'Auf Wiederhören!'},
        {id:'l6-office-t09',type:'choice',prompt:'Vielen Dank! چه معنایی دارد؟',choices:['بسیار ممنون','یک لحظه لطفاً','خدانگهدار تلفنی','من اینجا هستم'],answer:'بسیار ممنون'},
        {id:'l6-office-t10',type:'listen',prompt:'مکالمه تلفنی کوتاه را بشنو و متن آن را بنویس.',audio:'Guten Tag, hier ist Reza. Guten Tag, Herr Reza. Was kann ich für Sie tun? Ich suche den Kalender. Einen Moment, bitte. Vielen Dank. Auf Wiederhören!',answer:'Guten Tag, hier ist Reza. Guten Tag, Herr Reza. Was kann ich für Sie tun? Ich suche den Kalender. Einen Moment, bitte. Vielen Dank. Auf Wiederhören!'}
      ]
    },
    {
      id: 'email-sms-pronunciation',
      title: '۴. E-Mail, SMS und Aussprache · ایمیل، پیامک و تلفظ ü',
      caption: 'یک ایمیل و پیامک کوتاه را بخوان، اطلاعاتش را پیدا کن و صدای ü را تمرین کن.',
      cards: [
        ['📧','Betreff','موضوع ایمیل'],
        ['✉️','Guten Tag, Herr Weber.','روز بخیر آقای وبر'],
        ['🗓️','Sie haben heute zwei Termine.','امروز دو قرار دارید'],
        ['📝','Viele Grüße','با احترام / با آرزوی خوب'],
        ['💬','Ich habe keine Zeit.','من وقت ندارم'],
        ['🏢','das Büro','دفتر کار'],
        ['🔤','ü','صدای ü در Büro و Grüße']
      ],
      reading: 'E-MAIL\nBetreff: Neue Termine\nGuten Tag, Herr Weber,\nSie haben heute zwei Termine:\nFirma A um 10 Uhr\nFirma B um 14 Uhr\nViele Grüße\nReza\n\nSMS\nHallo! Ich bin noch im Büro. Ich habe keine Zeit. Bis später!',
      tasks: [
        {id:'l6-office-r01',type:'choice',prompt:'موضوع ایمیل چیست؟',choices:['Neue Termine','Urlaub','Eine Rechnung','Ein neuer Laptop'],answer:'Neue Termine'},
        {id:'l6-office-r02',type:'choice',prompt:'در ایمیل چند قرار ملاقات وجود دارد؟',choices:['zwei','eins','drei','vier'],answer:'zwei'},
        {id:'l6-office-r03',type:'choice',prompt:'قرار اول چه ساعتی است؟',choices:['10 Uhr','12 Uhr','14 Uhr','16 Uhr'],answer:'10 Uhr'},
        {id:'l6-office-r04',type:'choice',prompt:'قرار دوم چه ساعتی است؟',choices:['14 Uhr','10 Uhr','15 Uhr','18 Uhr'],answer:'14 Uhr'},
        {id:'l6-office-r05',type:'choice',prompt:'کدام عبارت برای پایان ایمیل در متن آمده است؟',choices:['Viele Grüße','Auf Wiederhören','Guten Morgen','Einen Moment'],answer:'Viele Grüße'},
        {id:'l6-office-r06',type:'choice',prompt:'فرستنده پیامک کجاست؟',choices:['im Büro','im Park','im Zug','zu Hause'],answer:'im Büro'},
        {id:'l6-office-r07',type:'choice',prompt:'چرا فرستنده پیامک نمی‌تواند صحبت کند؟',choices:['Er hat keine Zeit.','Er hat einen Termin morgen.','Er sucht einen Laptop.','Er ist im Park.'],answer:'Er hat keine Zeit.'},
        {id:'l6-office-r08',type:'type',prompt:'واژه «دفتر کار» را با حرف ü بنویس.',answer:'Büro'},
        {id:'l6-office-r09',type:'listen',prompt:'واژه را بشنو و دقیق بنویس؛ به صدای ü توجه کن.',audio:'Büro',answer:'Büro'},
        {id:'l6-office-r10',type:'listen',prompt:'عبارت پایانی ایمیل را بشنو و بنویس.',audio:'Viele Grüße',answer:'Viele Grüße'}
      ]
    }
  ]
};
