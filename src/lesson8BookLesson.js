// Authored Menschen A1.1 Lektion 8 companion exercises: days, times and invitations.
// These prompts are original and do not reproduce the publisher's exercises or recordings.
export const lesson8BookLesson = {
  title:'Kein Problem. Ich habe Zeit!',
  pages:'۴۵ تا ۴۸',
  focus:'روزهای هفته، ساعت، زمان‌های روز، قرار گذاشتن و جایگاه فعل',
  supplemental:true,
  goals:[
    'روزهای هفته و بخش‌های روز را بشناس و درست تلفظ کن',
    'ساعت رسمی و گفتاری را بخوان و قرار مشخص کن',
    'حروف اضافه am / um و استثنای in der Nacht را به کار ببر',
    'فعل صرف‌شده را در جایگاه دوم جمله خبری نگه دار',
    'پیشنهاد قرار بده، بپذیر یا مؤدبانه رد کن'
  ],
  sections:[
    {
      id:'vocabulary-practice',
      title:'۱. Wochentage und Tageszeiten · روزها و زمان‌ها',
      caption:'روزهای هفته را با معنی و تلفظ یاد بگیر؛ ماه‌ها فقط مرور اضافه‌اند، نه سرفصل اصلی این درس.',
      cards:[
        ['🗓️','Montag','دوشنبه'],['🗓️','Dienstag','سه‌شنبه'],['🗓️','Mittwoch','چهارشنبه'],
        ['🗓️','Donnerstag','پنج‌شنبه'],['🗓️','Freitag','جمعه'],['🗓️','Samstag','شنبه'],
        ['🗓️','Sonntag','یکشنبه'],['🌅','der Morgen','صبح'],['🌤️','der Nachmittag','بعدازظهر'],
        ['🌙','der Abend','عصر / شب'],['✨','in der Nacht','در طول شب'],
        ['📅','Januar','ژانویه (مرور تکمیلی)'],['📅','Februar','فوریه (مرور تکمیلی)'],['📅','März','مارس (مرور تکمیلی)']
      ],
      tasks:[
        {id:'l8-day01',type:'choice',prompt:'«دوشنبه» به آلمانی چیست؟',choices:['Montag','Mittwoch','Freitag','Sonntag'],answer:'Montag',audio:'Montag',why:'Montag یعنی دوشنبه.'},
        {id:'l8-day02',type:'choice',prompt:'«سه‌شنبه» کدام است؟',choices:['Donnerstag','Dienstag','Samstag','Mittwoch'],answer:'Dienstag',audio:'Dienstag',why:'Dienstag یعنی سه‌شنبه.'},
        {id:'l8-day03',type:'choice',prompt:'«چهارشنبه» کدام است؟',choices:['Montag','Mittwoch','Sonntag','Freitag'],answer:'Mittwoch',audio:'Mittwoch'},
        {id:'l8-day04',type:'choice',prompt:'«پنج‌شنبه» کدام است؟',choices:['Dienstag','Freitag','Donnerstag','Samstag'],answer:'Donnerstag',audio:'Donnerstag'},
        {id:'l8-day05',type:'choice',prompt:'«شنبه» کدام است؟',choices:['Montag','Samstag','Sonntag','Dienstag'],answer:'Samstag',audio:'Samstag'},
        {id:'l8-day06',type:'choice',prompt:'برای «شب / در طول شب» کدام عبارت زمانی درست است؟',choices:['am Nacht','um Nacht','in der Nacht','an Nacht'],answer:'in der Nacht',audio:'in der Nacht',why:'برای Nacht می‌گوییم in der Nacht، نه am Nacht.'},
        {id:'l8-day07',type:'choice',prompt:'مرور اضافه: فوریه به آلمانی چیست؟',choices:['Januar','Februar','März','April'],answer:'Februar',audio:'Februar'},
        {id:'l8-day08',type:'choice',prompt:'مرور اضافه: ژانویه به آلمانی چیست؟',choices:['Januar','Juni','März','November'],answer:'Januar',audio:'Januar'}
      ]
    },
    {
      id:'grammar-practice',
      title:'۲. Am, um und Satzbau · دستور زمان',
      caption:'am برای روزها و بیشتر بخش‌های روز، um برای ساعت؛ با قید زمان در اول جمله، فعل همچنان در جایگاه دوم است.',
      cards:[
        ['📆','am Montag','روز دوشنبه'],['🕗','um acht Uhr','ساعت هشت'],
        ['🌆','am Abend','عصر / شب'],['🌃','in der Nacht','در شب'],
        ['🚫','keine Zeit haben','وقت نداشتن'],['🗣️','Am Freitag habe ich Zeit.','جمعه وقت دارم']
      ],
      tasks:[
        {id:'l8-gram01',type:'choice',prompt:'جمله را کامل کن: Ich habe ___ Dienstag Zeit.',choices:['um','am','in','im'],answer:'am',why:'قبل از روزهای هفته am می‌آید.'},
        {id:'l8-gram02',type:'choice',prompt:'جمله را کامل کن: Wir treffen uns ___ acht Uhr.',choices:['am','an','um','im'],answer:'um',why:'قبل از ساعت مشخص um می‌آید.'},
        {id:'l8-gram03',type:'choice',prompt:'برای «بعدازظهر» کدام عبارت صحیح است؟',choices:['um Nachmittag','im Nachmittag','am Nachmittag','in Nachmittag'],answer:'am Nachmittag'},
        {id:'l8-gram04',type:'choice',prompt:'کدام عبارت درست است؟',choices:['am Nacht','in der Nacht','um Nacht','im die Nacht'],answer:'in der Nacht'},
        {id:'l8-gram05',type:'build',prompt:'جمله را بساز: دوشنبه ساعت هشت وقت ندارم.',answer:'Am Montag um acht Uhr habe ich keine Zeit.',hint:'قید زمان در ابتدا؛ سپس habe و فاعل ich.',why:'Am Montag um acht Uhr یک بخش زمانی در جایگاه نخست است؛ habe فعل صرف‌شده جمله است.'},
        {id:'l8-gram06',type:'choice',prompt:'وقتی جمله با Am Samstag آغاز می‌شود، کدام ترتیب درست است؟',choices:['Am Samstag ich gehe ins Kino.','Am Samstag gehe ich ins Kino.','Am Samstag ins Kino ich gehe.','Am Samstag gehen ich ins Kino.'],answer:'Am Samstag gehe ich ins Kino.',why:'بعد از قید آغازین، فعل صرف‌شده بلافاصله می‌آید.'},
        {id:'l8-gram07',type:'choice',prompt:'«من وقت ندارم» را درست انتخاب کن.',choices:['Ich habe nicht Zeit.','Ich bin keine Zeit.','Ich habe keinen Zeit.','Ich habe keine Zeit.'],answer:'Ich habe keine Zeit.',why:'die Zeit مؤنث است و برای نفی اسم از keine استفاده می‌کنیم.'},
        {id:'l8-gram08',type:'choice',prompt:'۱۵:۳۰ را در مکالمه معمولاً چطور می‌گوییم؟',choices:['halb drei','halb vier','Viertel vor drei','drei Uhr'],answer:'halb vier',audio:'halb vier',why:'halb vier یعنی نیم ساعت مانده به چهار، ۱۵:۳۰ یا ۳:۳۰.'}
      ]
    },
    {
      id:'sentence-practice',
      title:'۳. Verabredungen · قرار و جمله‌سازی',
      caption:'جمله‌ها را خودت بساز یا بدون گزینه بنویس؛ تا ترتیب فعل و am / um تثبیت شود.',
      cards:[
        ['🎬','ins Kino gehen','به سینما رفتن'],['🏛️','ins Museum gehen','به موزه رفتن'],
        ['🤝','Hast du Zeit?','وقت داری؟'],['✅','Gute Idee!','فکر خوبی است!'],
        ['🙁','Ich habe leider keine Zeit.','متأسفانه وقت ندارم'],
        ['⏰','Wann treffen wir uns?','کی همدیگر را می‌بینیم؟']
      ],
      reading:'Mina: Hast du am Freitag Zeit? Reza: Ja, am Freitag habe ich Zeit. Mina: Gehen wir um fünf Uhr ins Kino? Reza: Gute Idee! Bis Freitag!',
      tasks:[
        {id:'l8-talk01',type:'build',prompt:'با کلمات پراکنده بساز: جمعه ساعت پنج وقت دارم.',answer:'Am Freitag um fünf Uhr habe ich Zeit.'},
        {id:'l8-talk02',type:'type',prompt:'بدون گزینه ترجمه کن: دوشنبه ساعت هشت وقت ندارم.',answer:'Am Montag um acht Uhr habe ich keine Zeit.',hint:'Am ... um ... habe ich ...'},
        {id:'l8-talk03',type:'build',prompt:'بپرس: سه‌شنبه وقت داری؟',answer:'Hast du am Dienstag Zeit?'},
        {id:'l8-talk04',type:'type',prompt:'ترجمه کن: ما شنبه به سینما می‌رویم.',answer:'Wir gehen am Samstag ins Kino.'},
        {id:'l8-talk05',type:'build',prompt:'بساز: امروز بعدازظهر سارا را می‌بینم.',answer:'Heute Nachmittag treffe ich Sara.'},
        {id:'l8-talk06',type:'type',prompt:'به آلمانی پیشنهاد بده: یکشنبه به موزه برویم؟',answer:'Gehen wir am Sonntag ins Museum?'},
        {id:'l8-talk07',type:'build',prompt:'مؤدبانه رد کن: متأسفانه پنج‌شنبه نمی‌توانم بیایم.',answer:'Leider kann ich am Donnerstag nicht kommen.'},
        {id:'l8-talk08',type:'type',prompt:'بنویس: چهارشنبه ساعت نه آلمانی می‌خوانم.',answer:'Am Mittwoch um neun Uhr lerne ich Deutsch.'}
      ]
    },
    {
      id:'listening-practice',
      title:'۴. Hören und Uhrzeiten · شنیدن روز و ساعت',
      caption:'فقط صدا را پخش کن و جمله یا ساعت را با املای آلمانی بنویس؛ برای هر سؤال صدای جداگانه داریم.',
      cards:[
        ['🕗','acht Uhr','۸:۰۰'],['🕣','halb neun','۸:۳۰'],
        ['🕘','Viertel nach neun','۹:۱۵'],['🕤','Viertel vor zehn','۹:۴۵'],
        ['🕔','fünf Uhr','۵:۰۰'],['📆','am Sonntag','روز یکشنبه']
      ],
      tasks:[
        {id:'l8-listen01',type:'listen',prompt:'نام روز هفته را بشنو و به آلمانی تایپ کن.',audio:'Freitag',answer:'Freitag',why:'جمعه'},
        {id:'l8-listen02',type:'listen',prompt:'نام روز هفته را بشنو و به آلمانی تایپ کن.',audio:'Sonntag',answer:'Sonntag',why:'یکشنبه'},
        {id:'l8-listen03',type:'listen',prompt:'ساعت را بشنو و با حروف آلمانی بنویس.',audio:'acht Uhr',answer:'acht Uhr',why:'هشت'},
        {id:'l8-listen04',type:'listen',prompt:'ساعت را بشنو و بنویس.',audio:'halb neun',answer:'halb neun',why:'هشت و نیم؛ halb neun = ۸:۳۰'},
        {id:'l8-listen05',type:'listen',prompt:'ساعت گفتاری را بشنو و بنویس.',audio:'Viertel nach vier',answer:'Viertel nach vier',why:'چهار و ربع'},
        {id:'l8-listen06',type:'listen',prompt:'ساعت گفتاری را بشنو و بنویس.',audio:'Viertel vor zehn',answer:'Viertel vor zehn',why:'یک ربع مانده به ده'},
        {id:'l8-listen07',type:'listen',prompt:'جمله درباره زمان را بشنو و بنویس.',audio:'Am Dienstag um neun Uhr habe ich Zeit.',answer:'Am Dienstag um neun Uhr habe ich Zeit.'},
        {id:'l8-listen08',type:'listen',prompt:'جمله قرار گذاشتن را بشنو و بنویس.',audio:'Wir treffen uns am Samstag um sechs Uhr.',answer:'Wir treffen uns am Samstag um sechs Uhr.'}
      ]
    }
  ]
};
