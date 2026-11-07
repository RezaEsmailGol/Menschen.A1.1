// تمرین‌ها و توضیح‌های تألیفی فارسی؛ سرفصل‌های ۱ تا ۵ همراه Menschen A1.1
// و درس‌های ۶ تا ۱۲ بر اساس مسیر تکمیلی همین اپ هستند، نه بازنشر صفحات ناشر.
const quiz=(question,options,answer,why)=>({question,options,answer,why});
const rule=(id,title,explanation,pattern,examples,check,warning='',table=null)=>({
  id,title,explanation,pattern,examples,check,warning,table
});

export const persianGrammarGuides = {
  1: {
    summary:'اول اسم و مبدأ را می‌پرسیم؛ جای فعل در سؤال و تفاوت du و Sie را یاد می‌گیریم.',
    rules:[
      rule('w-questions','جای کلمه پرسشی و فعل','در بیشتر سؤال‌های دارای کلمه پرسشی، واژه پرسشی در آغاز می‌آید و فعل صرف‌شده بلافاصله بعد از آن قرار می‌گیرد. Wer برای شخص، Wo برای مکان و Woher برای مبدأ است.','W-Wort + فعل + فاعل + ... ?',
        [['Wie heißt du?','اسمت چیست؟'],['Woher kommst du?','اهل کجا هستی؟'],['Wo wohnst du?','کجا زندگی می‌کنی؟']],
        quiz('برای پرسیدن «اهل کجا هستی؟» کدام درست است؟',['Woher kommst du?','Wo wohnst du?','Wer ist das?','Was ist das?'],'Woher kommst du?','Woher یعنی «از کجا»؛ Wo یعنی «کجا».')),
      rule('present-intro','heißen و kommen با ich و du','فعل در زمان حال با فاعل هماهنگ می‌شود: برای ich معمولاً -e و برای du معمولاً -st می‌آید. فعل heißen استثنای املایی دارد: du heißt.','ich heiße / du heißt · ich komme / du kommst',
        [['Ich heiße Reza.','اسم من رضاست.'],['Du kommst aus Österreich.','تو اهل اتریش هستی.']],
        quiz('شکل درست جمله «اسم تو چیست؟» را انتخاب کن.',['Wie heißt du?','Wie heißen du?','Wie heiße du?','Wie heißt ich?'],'Wie heißt du?','برای du از heißt استفاده کن.')),
      rule('formal-sie','خطاب دوستانه و رسمی','برای یک دوست از du استفاده می‌کنیم، ولی در موقعیت رسمی معمولاً Sie با حرف بزرگ می‌آید. همراه Sie فعل مانند حالت جمع صرف می‌شود.','du kommst ↔ Sie kommen',
        [['Wie heißen Sie?','نام شما چیست؟ (رسمی)'],['Woher kommen Sie?','شما اهل کجا هستید؟ (رسمی)']],
        quiz('در صحبت رسمی با استاد کدام سؤال مناسب است؟',['Wie heißen Sie?','Wie heißt du?','Wer heißen du?','Wie heiße Sie?'],'Wie heißen Sie?','Sie رسمی با فعل heißen می‌آید.'))
    ]
  },
  2: {
    summary:'درباره شغل، وضعیت تأهل و فعل‌های sein / haben / arbeiten جمله می‌سازیم.',
    rules:[
      rule('sein','فعل sein: «بودن»','sein فعل بی‌قاعده است و باید شکل‌های پرکاربردش را جدا یاد بگیری. برای سن، شغل و وضعیت تأهل از آن استفاده می‌کنیم.','ich bin · du bist · er/sie ist · wir sind',
        [['Ich bin Softwareentwickler.','من توسعه‌دهنده نرم‌افزار هستم.'],['Bist du verheiratet?','آیا متأهلی؟']],
        quiz('جای خالی: Ich ___ verheiratet.',['bin','bist','ist','sind'],'bin','برای ich، شکل فعل sein برابر bin است.')),
      rule('arbeiten','صرف arbeiten و haben','برای فعل‌های منظم، پایان فعل تغییر می‌کند. در arbeiten به دلیل پایان -t، در دوم‌شخص مفرد -est می‌آید. haben هم پرکاربرد ولی کمی نامنظم است.','ich arbeite · du arbeitest · er arbeitet / ich habe · du hast · sie hat',
        [['Ich arbeite mit Python.','من با پایتون کار می‌کنم.'],['Du hast Zeit.','تو وقت داری.']],
        quiz('جای خالی: Du ___ als Entwickler.',['arbeitest','arbeiten','arbeitet','arbeite'],'arbeitest','du + arbeiten → arbeitest.')),
      rule('jobs-negation','مؤنث شغل‌ها و منفی‌کردن با nicht','نام بسیاری از شغل‌های مؤنث با پسوند -in ساخته می‌شود. برای منفی کردن صفت یا وضعیت، nicht را به کار می‌بریم.','Lehrer → Lehrerin · Ich bin nicht ledig.',
        [['Sie ist Journalistin.','او روزنامه‌نگار است.'],['Ich bin nicht geschieden.','من طلاق نگرفته‌ام.']],
        quiz('کدام جمله یعنی «او معلم زن نیست»؟',['Sie ist keine Lehrerin.','Sie bin Lehrerin.','Sie nicht Lehrer.','Sie sind Lehrerin.'],'Sie ist keine Lehrerin.','برای نفی یک اسم شغلی مؤنث می‌توانیم keine + اسم به کار ببریم؛ nicht برای منفی کردن وصف/حالت است.'))
    ]
  },
  3: {
    summary:'صفات ملکی خانواده، سؤال‌سازی با W، پاسخ‌های Ja/Nein/Doch و تغییر صرف sprechen.',
    rules:[
      rule('possessive','mein / meine و dein / deine','در حالت Nominativ، واژه ملکی با جنسیت و شمار اسم هماهنگ می‌شود. برای اسم مذکر و خنثی مفرد mein/dein و برای مؤنث و جمع meine/deine می‌آید.','mein Vater · meine Mutter · mein Kind · meine Eltern',
        [['Das ist mein Vater.','این پدر من است.'],['Das sind meine Eltern.','این‌ها پدر و مادر من هستند.'],['Ist das deine Schwester?','آیا این خواهر توست؟']],
        quiz('جای خالی: Das ist ___ Mutter.',['meine','mein','meinen','dein'],'meine','Mutter مؤنث است؛ meine Mutter.')),
      rule('question-types','سؤال W و سؤال بله/خیر','در سؤال با W مانند Wer یا Wie، اول کلمه پرسشی می‌آید؛ اما در سؤال بله/خیر، فعل صرف‌شده در ابتدای جمله است.','Wer + ist + das? / Ist + das + dein Vater?',
        [['Wer ist das?','این چه کسی است؟'],['Wie alt bist du?','چند سال داری؟'],['Hat sie Kinder?','آیا او فرزند دارد؟']],
        quiz('برای پرسیدن «آیا او بچه دارد؟» کدام درست است؟',['Hat sie Kinder?','Sie hat Kinder?','Wer hat Kinder?','Wie hat sie Kinder?'],'Hat sie Kinder?','سؤال بله/خیر با فعل Hat شروع می‌شود.')),
      rule('ja-nein-doch','سه جواب مهم: ja / nein / doch','Ja یعنی بله؛ Nein یعنی نه؛ Doch زمانی استفاده می‌شود که یک جمله یا سؤال منفی را رد می‌کنیم و می‌گوییم «چرا، اتفاقاً».','Du bist nicht verheiratet? – Doch, ich bin verheiratet.',
        [['Ist sie verheiratet? – Ja.','متأهل است؟ بله.'],['Du sprichst nicht Deutsch? – Doch!','آلمانی بلد نیستی؟ چرا، بلدم!']],
        quiz('یکی می‌گوید «Du bist nicht verheiratet.» اما تو متأهلی. چه می‌گویی؟',['Doch, ich bin verheiratet.','Ja, ich bin nicht verheiratet.','Nein, ich bin ledig.','Doch, ich bin nicht verheiratet.'],'Doch, ich bin verheiratet.','Doch جمله منفی طرف مقابل را اصلاح می‌کند.')),
      rule('sprechen','صرف sprechen و تغییر واکه','فعل sprechen در du و er/sie/es ریشه‌اش از e به i تغییر می‌کند؛ اما در ich و wir این تغییر را نداریم.','ich spreche · du sprichst · sie spricht · wir sprechen',
        [['Welche Sprachen sprichst du?','تو به چه زبان‌هایی صحبت می‌کنی؟'],['Meine Eltern sprechen Deutsch.','پدر و مادرم آلمانی صحبت می‌کنند.']],
        quiz('جای خالی: Deine Schwester ___ Persisch.',['spricht','sprechen','sprichst','spreche'],'spricht','فاعل سوم‌شخص مفرد است؛ spricht.'))
    ]
  },
  4: {
    summary:'جنسیت اسم‌ها، ضمیر er/sie/es و توصیف وسایل خانه و قیمت را یاد می‌گیریم.',
    rules:[
      rule('definite-article','der، die، das را با اسم حفظ کن','در آلمانی هر اسم جنس دستوری دارد و به جای حفظ کردن فقط Tisch، بهتر است der Tisch یاد بگیری. رنگ یا جنس واقعی شیء جنس دستوری را تعیین نمی‌کند.','مذکر der · مؤنث die · خنثی das · جمع die',
        [['Der Tisch ist schön.','میز زیباست.'],['Die Lampe ist neu.','چراغ جدید است.'],['Das Sofa ist groß.','مبل بزرگ است.']],
        quiz('حرف تعریف درست «Sofa» چیست؟',['das','der','die','den'],'das','می‌گوییم das Sofa.'),
        'این جدول مربوط به حالت Nominativ است.',
        [['جنس','معین','مثال'],['مذکر','der','der Tisch'],['مؤنث','die','die Lampe'],['خنثی','das','das Sofa'],['جمع','die','die Stühle']]),
      rule('pronouns','جایگزینی اسم‌ها با er / sie / es','برای اشاره دوباره به یک شیء، ضمیر را بر اساس جنس دستوری اسم انتخاب می‌کنیم؛ حتی وقتی درباره وسیله حرف می‌زنیم.','der → er · die → sie · das → es',
        [['Der Tisch ist teuer. Er kostet 100 Euro.','میز گران است. قیمت آن ۱۰۰ یوروست.'],['Die Tasche ist neu. Sie ist schön.','کیف جدید و زیباست.']],
        quiz('Das Buch ist neu. ___ ist schön.',['Es','Sie','Er','Ich'],'Es','das Buch خنثی است، پس es.')),
      rule('descriptions','توصیف با ist و سؤال قیمت','برای گفتن ویژگی از اسم + ist + صفت استفاده می‌کنیم. در سؤال قیمت از Was kostet ...? یا Wie viel kostet ...? استفاده می‌کنیم.','Der Stuhl ist günstig. / Was kostet der Stuhl?',
        [['Das Bett ist groß.','تخت بزرگ است.'],['Die Lampe kostet 30 Euro.','چراغ ۳۰ یورو قیمت دارد.']],
        quiz('بهترین سؤال برای «قیمت صندلی چقدر است؟» کدام است؟',['Was kostet der Stuhl?','Wer ist der Stuhl?','Woher kommt der Stuhl?','Wie alt sind der Stuhl?'],'Was kostet der Stuhl?','برای پرسیدن قیمت از kosten استفاده کن.'))
    ]
  },
  5: {
    summary:'قواعد تخته استاد: Nominativ، جدول der/die/das، ein/eine، kein/keine و ضمیرها برای اشیا.',
    rules:[
      rule('nominative-table','جدول اصلی Nominativ','Nominativ در این درس حالت اسم وقتی فاعل است یا بعد از فعل sein به عنوان نام/معرفی می‌آید. در این جدول شکل حرف تعریف معین، نامعین، منفی و ضمیر هر جنس را کنار هم ببین.','der → ein → kein → er / die → eine → keine → sie / das → ein → kein → es',
        [['Der Laptop ist hier.','این لپ‌تاپ اینجاست.'],['Ein Laptop ist dort.','یک لپ‌تاپ آنجاست.'],['Kein Laptop ist hier.','هیچ لپ‌تاپی اینجا نیست.']],
        quiz('جای خالی: ___ Buch ist hier.',['Das','Der','Die','Den'],'Das','Buch اسم خنثی است و حرف تعریف معین آن das است.'),
        'در حالت جمع، حرف تعریف نامعین ein/eine وجود ندارد؛ برای نفی جمع از keine استفاده می‌کنیم.',
        [['نوع اسم','معین','نامعین','منفی','ضمیر'],['مذکر','der','ein','kein','er'],['مؤنث','die','eine','keine','sie'],['خنثی','das','ein','kein','es'],['جمع','die','—','keine','sie']]),
      rule('ein-eine','معرفی یک شیء با ein / eine','در جمله Das ist ... وقتی می‌خواهی بگویی «این یک ... است»، برای اسم مذکر و خنثی ein و برای اسم مؤنث eine می‌آید. این شکل‌ها مخصوص Nominativ هستند.','Das ist ein Laptop. / Das ist eine Tasche. / Das ist ein Buch.',
        [['Was ist das? – Das ist ein Schlüssel.','این چیست؟ یک کلید است.'],['Das ist eine Brille.','این یک عینک است.']],
        quiz('جای خالی: Das ist ___ Tasche.',['eine','ein','einen','keinen'],'eine','Tasche مؤنث است؛ eine Tasche.')),
      rule('kein-keine','نفی اسم با kein / keine','وقتی می‌خواهی بگویی یک شیء وجود ندارد یا آن شیء موردنظر نیست، از kein/keine استفاده می‌کنی. این با nicht که معمولاً فعل، صفت یا بخش دیگر جمله را نفی می‌کند، فرق دارد.','kein Laptop · keine Tasche · kein Buch · keine Stühle',
        [['Das ist kein Buch.','این کتاب نیست.'],['Das ist keine Tasche.','این کیف نیست.'],['Hier sind keine Stühle.','اینجا صندلی‌ای نیست.']],
        quiz('جای خالی: Das ist ___ Brille.',['keine','kein','nicht','keinen'],'keine','die Brille مؤنث است، پس keine.')),
      rule('things-and-sounds','واژه‌های شبیه و توصیف اشیا','Gegenstände، Sachen و Dinge هر سه درباره اشیا/چیزها به کار می‌روند. dunkel یعنی تیره و hell یعنی روشن؛ Aktion با Auktion فرق دارد. bitten یعنی درخواست کردن، bieten یعنی پیشنهاد دادن.','dunkel ↔ hell · bitten ↔ bieten · Aktion ≠ Auktion',
        [['Die Tasche ist dunkel.','کیف تیره است.'],['Das ist eine Auktion.','این یک مزایده است.'],['Ich bitte um Hilfe.','من درخواست کمک می‌کنم.']],
        quiz('کدام واژه به معنی «مزایده» است؟',['Auktion','Aktion','Eigenschaft','Merkmal'],'Auktion','Auktion یعنی مزایده؛ Aktion یعنی اقدام یا طرح/کمپین.'))
    ]
  },
  6: {
    summary:'برای گفتن روز و ساعت قرار، am و um را از هم جدا می‌کنیم.',
    rules:[
      rule('am-um','تفاوت am و um','برای روزهای هفته از am و برای ساعت دقیق از um استفاده می‌کنیم. هر دو معمولاً قبل از زمان می‌آیند.','am Montag · um neun Uhr',
        [['Der Termin ist am Montag.','قرار روز دوشنبه است.'],['Ich komme um neun Uhr.','من ساعت ۹ می‌آیم.']],
        quiz('جای خالی: Der Termin ist ___ Freitag.',['am','um','im','aus'],'am','روز هفته با am می‌آید.')),
      rule('wann','پرسیدن زمان قرار','Wann می‌پرسد «چه زمانی؟». وقتی ساعت دقیق را می‌خواهی، Um wie viel Uhr ...? طبیعی‌تر است؛ در سؤال W فعل بعد از عبارت پرسشی می‌آید.','Wann kommst du? / Um wie viel Uhr kommst du?',
        [['Wann ist der Termin?','قرار کی است؟'],['Um wie viel Uhr beginnt der Kurs?','کلاس ساعت چند شروع می‌شود؟']],
        quiz('برای سؤال «ساعت چند می‌آیی؟» کدام درست است؟',['Um wie viel Uhr kommst du?','Woher kommst du?','Wer kommst du?','Wie alt kommst du?'],'Um wie viel Uhr kommst du?','برای ساعت دقیق از Um wie viel Uhr استفاده می‌کنیم.'))
    ]
  },
  7: {
    summary:'در خرید، نیاز را با brauchen و درخواست مؤدبانه را با möchte بیان می‌کنیم.',
    rules:[
      rule('brauchen','فعل brauchen: نیاز داشتن','brauchen معمولاً با مفعول مستقیم می‌آید. در حالت Akkusativ برای اسم مذکر ein به einen تبدیل می‌شود، ولی در مؤنث eine باقی می‌ماند.','Ich brauche einen Stift. / Wir brauchen Milch.',
        [['Ich brauche einen Schlüssel.','من یک کلید لازم دارم.'],['Wir brauchen Wasser.','ما آب لازم داریم.']],
        quiz('جای خالی: Ich brauche ___ Schlüssel.',['einen','ein','eine','einer'],'einen','der Schlüssel مذکر است؛ مفعول مستقیم einen می‌گیرد.')),
      rule('moechte','درخواست مودبانه با möchte','möchte یعنی «مایلم/می‌خواهم». برای سفارش یا خرید مؤدبانه است. در حالت مفرد ich و er/sie هر دو möchte می‌گیرند.','Ich möchte ein Brot, bitte.',
        [['Ich möchte ein Wasser, bitte.','یک آب می‌خواهم، لطفاً.'],['Was möchten Sie?','چه میل دارید؟ (رسمی)']],
        quiz('برای سفارش مؤدبانه کدام بهتر است؟',['Ich möchte ein Brot, bitte.','Ich Brot bin.','Du möchtest ich Brot.','Woher Brot?'],'Ich möchte ein Brot, bitte.','Ich möchte ... یک درخواست مودبانه می‌سازد.'))
    ]
  },
  8: {
    summary:'حرف تعریف اسم‌ها را با جمع آن‌ها یاد می‌گیریم و تعداد اتاق‌ها را می‌گوییم.',
    rules:[
      rule('plural','اسم جمع و حرف تعریف die','در آلمانی حالت جمع یک قاعده واحد ندارد. مثلاً Zimmer در جمع تغییر نمی‌کند ولی Stuhl به Stühle تبدیل می‌شود. حرف تعریف معین جمع همیشه die است.','das Zimmer → die Zimmer · der Stuhl → die Stühle',
        [['Die Wohnung hat zwei Zimmer.','آپارتمان دو اتاق دارد.'],['Die Stühle sind neu.','صندلی‌ها جدید هستند.']],
        quiz('شکل جمع درست «das Zimmer» کدام است؟',['die Zimmer','die Zimmers','das Zimmern','der Zimmer'],'die Zimmer','Zimmer در جمع شکلش تغییر نمی‌کند و حرف تعریف آن die است.')),
      rule('house-sentences','جمله درباره خانه: hat و ist','برای بیان تعداد اتاق‌ها از hat استفاده می‌کنیم؛ برای ویژگی خانه و اتاق از ist. فعل در جمله خبری معمولاً جای دوم است.','Die Wohnung hat zwei Zimmer. / Die Küche ist klein.',
        [['Das Bad ist groß.','حمام بزرگ است.'],['Meine Wohnung hat ein Zimmer.','خانه من یک اتاق دارد.']],
        quiz('جای خالی: Die Wohnung ___ zwei Zimmer.',['hat','habe','sind','haben'],'hat','فاعل die Wohnung مفرد است؛ hat.'))
    ]
  },
  9: {
    summary:'برای رفت‌وآمد فعل‌های gehen و fahren و حرف اضافه mit را تمرین می‌کنیم.',
    rules:[
      rule('gehen-fahren','تفاوت gehen و fahren','gehen معمولاً برای پیاده رفتن و fahren برای سفر با وسیله نقلیه است. شکل صرف برای ich از آن‌ها gehe و fahre است.','Ich gehe zu Fuß. / Ich fahre mit dem Bus.',
        [['Wir gehen zu Fuß.','ما پیاده می‌رویم.'],['Ich fahre nach Wien.','من به وین می‌روم (با وسیله).']],
        quiz('برای «من پیاده می‌روم» کدام درست است؟',['Ich gehe zu Fuß.','Ich fahre zu Fuß.','Ich gehen Bus.','Ich bin Bus.'],'Ich gehe zu Fuß.','برای پیاده‌روی از gehen zu Fuß استفاده کن.')),
      rule('mit-dativ','بعد از mit از Dativ استفاده کن','mit حرف اضافه‌ای است که همیشه Dativ می‌خواهد: der Bus در این ساختار به dem Bus تبدیل می‌شود. برای die U-Bahn می‌گوییم mit der U-Bahn.','mit dem Bus · mit dem Zug · mit der U-Bahn',
        [['Ich fahre mit dem Bus.','من با اتوبوس می‌روم.'],['Sie fährt mit der U-Bahn.','او با مترو می‌رود.']],
        quiz('جای خالی: Ich fahre mit ___ Zug.',['dem','der','den','das'],'dem','Zug مذکر است و بعد از mit در Dativ به dem تبدیل می‌شود.'))
    ]
  },
  10: {
    summary:'با فعل‌های کمکی müssen و können درباره نیاز پزشکی و توانایی صحبت می‌کنیم.',
    rules:[
      rule('modal-order','فعل مدال و جای مصدر','وقتی müssen یا können در جمله می‌آید، فعل مدال صرف می‌شود و فعل اصلی به شکل مصدر در آخر جمله می‌رود.','Ich muss zum Arzt gehen. / Ich kann heute kommen.',
        [['Du musst viel trinken.','تو باید زیاد آب بنوشی.'],['Ich kann morgen kommen.','من می‌توانم فردا بیایم.']],
        quiz('کدام جمله درست است؟',['Ich muss zum Arzt gehen.','Ich muss gehe zum Arzt.','Ich gehen muss Arzt.','Ich muss geht zum Arzt.'],'Ich muss zum Arzt gehen.','فعل اصلی gehen به آخر جمله می‌رود.')),
      rule('symptoms','توصیف ساده درد و درخواست وقت','برای گفتن سردرد از Ich habe Kopfschmerzen استفاده کن. برای درخواست وقت پزشک می‌توانی مودبانه با Kann ich ...? سؤال بپرسی.','Ich habe Kopfschmerzen. / Kann ich einen Termin haben?',
        [['Ich habe Kopfschmerzen.','من سردرد دارم.'],['Kann ich einen Termin haben?','می‌توانم وقت ملاقات بگیرم؟']],
        quiz('کدام سؤال برای گرفتن وقت مناسب است؟',['Kann ich einen Termin haben?','Woher ist Kopf?','Wie alt ist Termin?','Ich kann Termin?'],'Kann ich einen Termin haben?','در سؤال بله/خیر، فعل کمکی صرف‌شده در آغاز است.'))
    ]
  },
  11: {
    summary:'در ارتباط کاری با Sie رسمی سؤال می‌پرسیم و جای فعل را رعایت می‌کنیم.',
    rules:[
      rule('formal-request','Können Sie ...? برای درخواست رسمی','در سؤال مودبانه با Können Sie ...? فعل مدال اول و فعل اصلی در پایان جمله است. Sie رسمی با حرف بزرگ نوشته می‌شود.','Können Sie mir helfen?',
        [['Können Sie mir die Datei schicken?','می‌توانید فایل را برای من بفرستید؟'],['Können Sie das wiederholen?','می‌توانید آن را تکرار کنید؟']],
        quiz('کدام درخواست رسمی درست است؟',['Können Sie mir helfen?','Kann Sie helfen mir?','Können du mir helfen?','Sie können helfen mir?'],'Können Sie mir helfen?','فعل مدال اول، Sie بعد از آن، مصدر در آخر.')),
      rule('statement-question','خبر در برابر سؤال بله/خیر','در جمله خبری فعل صرف‌شده جای دوم قرار می‌گیرد. در سؤال بله/خیر همان فعل به جای اول می‌رود.','Sie schicken die Datei. ↔ Schicken Sie die Datei?',
        [['Ich schreibe eine E-Mail.','من ایمیل می‌نویسم.'],['Schreiben Sie eine E-Mail?','شما ایمیل می‌نویسید؟']],
        quiz('سؤال بله/خیر صحیح کدام است؟',['Schicken Sie die Datei?','Sie die Datei schicken?','Schicken die Datei Sie?','Sie schicken die Datei.'],'Schicken Sie die Datei?','در سؤال بله/خیر فعل صرف‌شده اول قرار می‌گیرد.'))
    ]
  },
  12: {
    summary:'برای مصاحبه و مهاجرت کاری، هدف خود را با möchte و توانایی خود را با kann بیان می‌کنیم.',
    rules:[
      rule('goals','گفتن هدف با möchte + مصدر','möchte در زمان حال یک درخواست یا خواسته را بیان می‌کند و فعل اصلی به انتهای جمله می‌رود. برای برنامه کار در اتریش ساختار ساده و کاربردی است.','Ich möchte in Österreich arbeiten.',
        [['Ich möchte in Wien arbeiten.','می‌خواهم در وین کار کنم.'],['Wir möchten Deutsch lernen.','ما می‌خواهیم آلمانی یاد بگیریم.']],
        quiz('جمله درست برای «می‌خواهم در اتریش کار کنم» چیست؟',['Ich möchte in Österreich arbeiten.','Ich möchte arbeite in Österreich.','Ich arbeiten möchte Österreich.','Ich möchte in Österreich arbeitet.'],'Ich möchte in Österreich arbeiten.','فعل اصلی arbeiten به صورت مصدر در پایان است.')),
      rule('ability','گفتن توانایی با kann','برای توضیح مهارت شغلی از kann + فعل مصدر در پایان استفاده کن. du kannst و wir können هم پرکاربرد هستند.','Ich kann Webanwendungen entwickeln.',
        [['Ich kann mit Python arbeiten.','می‌توانم با پایتون کار کنم.'],['Kannst du Deutsch sprechen?','می‌توانی آلمانی صحبت کنی؟']],
        quiz('جای خالی: Ich ___ mit Python arbeiten.',['kann','kannst','können','könnt'],'kann','برای ich، فعل können به kann تبدیل می‌شود.'))
    ]
  }
};

export function grammarGuideForLesson(id){
  const n=Number(id);
  return Number.isInteger(n) ? persianGrammarGuides[n] ?? null : null;
}
export function grammarRuleCount(id){ return grammarGuideForLesson(id)?.rules.length ?? 0; }
