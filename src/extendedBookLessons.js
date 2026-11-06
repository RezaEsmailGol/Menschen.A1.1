// Original course-companion tasks inspired by the published A1.1 topic outline.
// The reading passages, questions, diagrams and SVGs are independently authored.
// No original Hueber textbook exercises or audio are reproduced.
export const extendedBookLessons = {
  3:{
    title:'Das ist meine Mutter.',pages:'۱۷ تا ۲۰',focus:'خانواده، پرسش‌های بله/خیر، mein/dein و زبان‌ها',
    goals:['معرفی اعضای خانواده و نسب آن‌ها','انتخاب mein / meine / dein / deine',
      'ساختن سؤال با Ist das ...? و Hast du ...?','پاسخ Ja / Nein / Doch',
      'پرسیدن درباره زبان‌ها با sprechen و خواندن یک متن خانوادگی'],
    sections:[
      {id:'family',title:'۱. Familie · اعضای خانواده',caption:'اسم، تصویر و نسبت خانوادگی را به هم وصل کن.',
        cards:[['👩','die Mutter','مادر'],['👨','der Vater','پدر'],['👧','die Schwester','خواهر'],
          ['👦','der Bruder','برادر'],['👵','die Oma','مادربزرگ'],['👴','der Opa','پدربزرگ'],
          ['👨‍👩‍👧','die Eltern','پدر و مادر']],
        tasks:[
          {id:'l3-f01',type:'choice',prompt:'در آلمانی «مادر» کدام است؟',choices:['die Mutter','der Vater','die Oma','der Bruder'],answer:'die Mutter'},
          {id:'l3-f02',type:'choice',prompt:'«پدر و مادر» کدام واژه است؟',choices:['die Eltern','die Kinder','die Schwester','die Großeltern'],answer:'die Eltern'},
          {id:'l3-f03',type:'choice',prompt:'«برادر» با حرف تعریف درست چیست؟',choices:['der Bruder','die Bruder','das Bruder','der Schwester'],answer:'der Bruder'},
          {id:'l3-f04',type:'type',prompt:'بنویس: این مادر من است.',answer:'Das ist meine Mutter.',hint:'Das ist ... Mutter.'},
          {id:'l3-f05',type:'build',prompt:'جمله را بساز: این‌ها والدین من هستند.',answer:'Das sind meine Eltern.'},
          {id:'l3-f06',type:'listen',prompt:'جمله معرفی خانواده را بشنو و بنویس.',audio:'Das ist mein Vater.',answer:'Das ist mein Vater.'},
          {id:'l3-f07',type:'choice',prompt:'«دخترم» را با جمله درست معرفی کن.',choices:['Das ist meine Tochter.','Das ist mein Tochter.','Das sind meine Tochter.','Das ist meine Sohn.'],answer:'Das ist meine Tochter.',why:'die Tochter مؤنث است و meine می‌گیرد.'}
        ]},
      {id:'possessive',title:'۲. Mein und dein · صفات ملکی',caption:'جنسیت اسم تعیین می‌کند mein یا meine به‌کار ببری.',
        cards:[['👨','mein Vater','پدر من'],['👩','meine Mutter','مادر من'],
          ['👦','dein Bruder','برادر تو'],['👧','deine Schwester','خواهر تو'],
          ['🧒','mein Kind','فرزند من']],
        tasks:[
          {id:'l3-m01',type:'choice',prompt:'کدام ترکیب به معنی «مادر من» درست است؟',choices:['meine Mutter','mein Mutter','meinen Mutter','meiner Mutter'],answer:'meine Mutter'},
          {id:'l3-m02',type:'choice',prompt:'کدام ترکیب به معنی «پدر تو» درست است؟',choices:['dein Vater','deine Vater','deiner Vater','einen Vater'],answer:'dein Vater'},
          {id:'l3-m03',type:'choice',prompt:'برای das Kind کدام صفت ملکی به معنی «فرزند من» درست است؟',choices:['mein','meine','meinen','deine'],answer:'mein',why:'das Kind خنثی است: mein Kind.'},
          {id:'l3-m04',type:'type',prompt:'آلمانی بنویس: این خواهر تو است.',answer:'Das ist deine Schwester.'},
          {id:'l3-m05',type:'build',prompt:'بساز: این برادر من است.',answer:'Das ist mein Bruder.'},
          {id:'l3-m06',type:'listen',prompt:'عبارت مربوط به والدین را بشنو و بنویس.',audio:'Das sind meine Eltern.',answer:'Das sind meine Eltern.'},
          {id:'l3-m07',type:'choice',prompt:'کدام جمله درست است؟',choices:['Meine Eltern sind hier.','Mein Eltern sind hier.','Meine Vater ist hier.','Mein Mutter ist hier.'],answer:'Meine Eltern sind hier.',why:'اسم جمع die Eltern با meine می‌آید.'}
        ]},
      {id:'questions',title:'۳. Fragen und Antworten · سؤال و پاسخ',caption:'ساخت سؤال بله/خیر و تفاوت Ja، Nein و Doch را تمرین کن.',
        cards:[['❓','Wer ist das?','این کیست؟'],['🤔','Ist das deine Schwester?','آیا این خواهر توست؟'],
          ['✅','Ja, das ist meine Schwester.','بله، این خواهر من است'],
          ['🙅','Nein, das ist mein Bruder.','نه، این برادر من است'],['↩️','Doch!','چرا، هست! (جواب به سؤال منفی)']],
        tasks:[
          {id:'l3-q01',type:'choice',prompt:'در سؤال بله/خیر، کدام ساختار صحیح است؟',choices:['Ist das deine Mutter?','Das ist deine Mutter?','Deine Mutter ist das?','Ist deine das Mutter?'],answer:'Ist das deine Mutter?'},
          {id:'l3-q02',type:'choice',prompt:'در پاسخ به «Ist das nicht dein Vater?» اگر پدرت باشد، چه می‌گویی؟',choices:['Doch!','Nein!','Nicht!','Auch!'],answer:'Doch!',why:'Doch برای تأیید مثبت در برابر سؤال یا جمله منفی است.'},
          {id:'l3-q03',type:'choice',prompt:'برای سؤال «Hast du Kinder?» پاسخ مثبت کدام است؟',choices:['Ja, ich habe ein Kind.','Ja, ich hat ein Kind.','Ja, ich bin ein Kind.','Ja, ich habe Kind eine.'],answer:'Ja, ich habe ein Kind.'},
          {id:'l3-q04',type:'build',prompt:'بساز: آیا این خواهر توست؟',answer:'Ist das deine Schwester?'},
          {id:'l3-q05',type:'listen',prompt:'سؤال را بشنو و بنویس.',audio:'Hast du Kinder?',answer:'Hast du Kinder?'},
          {id:'l3-q06',type:'type',prompt:'بنویس: نه، این مادر من نیست.',answer:'Nein, das ist nicht meine Mutter.'},
          {id:'l3-q07',type:'choice',prompt:'برای پرسیدن «او کیست؟» کدام جمله مناسب است؟',choices:['Wer ist das?','Woher ist das?','Was ist Beruf?','Wie ist das Land?'],answer:'Wer ist das?'}
        ]},
      {id:'languages',title:'۴. Sprachen · زبان‌ها و خواندن',caption:'فعل sprechen، نام زبان‌ها و درک متن کوتاه خانواده.',
        cards:[['🇩🇪','Deutsch','آلمانی'],['🇬🇧','Englisch','انگلیسی'],['🇮🇷','Persisch','فارسی'],
          ['🗣️','Ich spreche Deutsch.','من آلمانی صحبت می‌کنم'],
          ['💬','Welche Sprachen sprichst du?','چه زبان‌هایی صحبت می‌کنی؟']],
        reading:'Hallo! Ich heiße Sara. Das ist meine Mutter. Sie heißt Mina. Mein Bruder heißt Arman. Meine Mutter spricht Persisch. Mein Bruder spricht Deutsch und Englisch.',
        tasks:[
          {id:'l3-l01',type:'choice',prompt:'در متن، مادر سارا چه نام دارد؟',choices:['Mina','Sara','Arman','Maria'],answer:'Mina'},
          {id:'l3-l02',type:'choice',prompt:'برادر سارا چه زبان‌هایی صحبت می‌کند؟',choices:['Deutsch und Englisch','nur Persisch','Spanisch und Englisch','Deutsch und Französisch'],answer:'Deutsch und Englisch'},
          {id:'l3-l03',type:'choice',prompt:'فعل sprechen برای du چیست؟',choices:['sprichst','spreche','spricht','sprecht'],answer:'sprichst'},
          {id:'l3-l04',type:'type',prompt:'بنویس: من فارسی صحبت می‌کنم.',answer:'Ich spreche Persisch.'},
          {id:'l3-l05',type:'build',prompt:'بساز: تو چه زبان‌هایی صحبت می‌کنی؟',answer:'Welche Sprachen sprichst du?'},
          {id:'l3-l06',type:'listen',prompt:'زبان‌ها را بشنو و جمله را بنویس.',audio:'Meine Mutter spricht Deutsch.',answer:'Meine Mutter spricht Deutsch.'},
          {id:'l3-l07',type:'choice',prompt:'فعل sprechen برای er/sie چیست؟',choices:['spricht','spreche','sprichst','sprechen'],answer:'spricht'}
        ]}
    ]
  },
  4:{
    title:'Der Tisch ist schön!',pages:'۲۵ تا ۲۸',focus:'مبلمان، der/die/das، er/sie/es، توصیف و قیمت',
    goals:['شناسایی مبلمان و وسایل خانه با تصویر','یادگیری حرف تعریف der / die / das برای اسم‌ها',
      'جایگزینی صحیح با er / sie / es','توصیف اشیا با صفت‌های klein/groß/schön/teuer',
      'پرسیدن و گفتن قیمت و تشکر در فروشگاه'],
    sections:[
      {id:'furniture',title:'۱. Möbel · وسایل خانه',caption:'میز، صندلی، چراغ، تخت و وسایل دیگر را ببین و تلفظ کن.',
        cards:[['🪑','der Stuhl','صندلی'],['🛋️','das Sofa','مبل'],
          ['🪵','der Tisch','میز'],['💡','die Lampe','چراغ'],['🛏️','das Bett','تخت'],
          ['🚪','der Schrank','کمد'],['📚','das Regal','قفسه'],['🧶','der Teppich','فرش']],
        tasks:[
          {id:'l4-f01',type:'choice',prompt:'اسم «میز» با حرف تعریف درست کدام است؟',choices:['der Tisch','die Tisch','das Tisch','der Stuhl'],answer:'der Tisch'},
          {id:'l4-f02',type:'choice',prompt:'اسم «صندلی» چیست؟',choices:['der Stuhl','das Sofa','die Lampe','das Bett'],answer:'der Stuhl'},
          {id:'l4-f03',type:'choice',prompt:'کدام اسم مؤنث است؟',choices:['die Lampe','der Tisch','der Schrank','das Sofa'],answer:'die Lampe'},
          {id:'l4-f04',type:'type',prompt:'به آلمانی بنویس: مبل (با حرف تعریف).',answer:'das Sofa'},
          {id:'l4-f05',type:'listen',prompt:'نام وسیله خانه را بشنو و بنویس.',audio:'der Teppich',answer:'der Teppich'},
          {id:'l4-f06',type:'build',prompt:'بساز: میز زیبا است.',answer:'Der Tisch ist schön.'},
          {id:'l4-f07',type:'choice',prompt:'کدام ترکیب برای «تخت» درست است؟',choices:['das Bett','die Bett','der Bett','das Stuhl'],answer:'das Bett'},
          {id:'l4-f08',type:'choice',prompt:'چه کلمه‌ای به معنی «کمد» است؟',choices:['der Schrank','der Teppich','das Regal','die Couch'],answer:'der Schrank'}
        ]},
      {id:'articles',title:'۲. Artikel · جنسیت و ضمیر',caption:'اسم مذکر der → er، مؤنث die → sie، خنثی das → es.',
        cards:[['🔵','der Tisch → er','میز: مذکر → او (برای شیء)'],
          ['🩷','die Lampe → sie','چراغ: مؤنث → او (برای شیء)'],
          ['🟢','das Sofa → es','مبل: خنثی → آن'],
          ['🪑','Der Stuhl ist neu.','صندلی جدید است']],
        tasks:[
          {id:'l4-a01',type:'choice',prompt:'برای die Lampe کدام ضمیر مناسب است؟',choices:['sie','er','es','wir'],answer:'sie'},
          {id:'l4-a02',type:'choice',prompt:'برای der Tisch کدام ضمیر مناسب است؟',choices:['er','sie','es','ich'],answer:'er'},
          {id:'l4-a03',type:'choice',prompt:'برای das Sofa کدام ضمیر مناسب است؟',choices:['es','er','sie','du'],answer:'es'},
          {id:'l4-a04',type:'choice',prompt:'کدام عبارت معرفی یک شیء مؤنث است؟',choices:['Das ist eine Lampe.','Das ist ein Lampe.','Das ist einen Lampe.','Das ist der Lampe.'],answer:'Das ist eine Lampe.'},
          {id:'l4-a05',type:'type',prompt:'بنویس: این یک میز است.',answer:'Das ist ein Tisch.'},
          {id:'l4-a06',type:'build',prompt:'بساز: این یک مبل است.',answer:'Das ist ein Sofa.'},
          {id:'l4-a07',type:'listen',prompt:'جمله حاوی ضمیر را بشنو و بنویس.',audio:'Die Lampe ist neu. Sie ist schön.',answer:'Die Lampe ist neu. Sie ist schön.'},
          {id:'l4-a08',type:'choice',prompt:'کدام جمله از نظر حرف تعریف درست است؟',choices:['Das ist ein Stuhl.','Das ist eine Stuhl.','Das ist einen Stuhl.','Das ist ein Lampe.'],answer:'Das ist ein Stuhl.'}
        ]},
      {id:'descriptions',title:'۳. Beschreiben · توصیف وسایل',caption:'تفاوت زیبا/زشت، نو/قدیمی، کوچک/بزرگ را در جمله تشخیص بده.',
        cards:[['✨','schön','زیبا'],['🌱','neu','جدید'],['🧸','klein','کوچک'],
          ['🏠','groß','بزرگ'],['💶','teuer','گران'],['💸','günstig','مناسب‌قیمت']],
        tasks:[
          {id:'l4-d01',type:'choice',prompt:'متضاد schön چیست؟',choices:['hässlich','neu','groß','billig'],answer:'hässlich'},
          {id:'l4-d02',type:'choice',prompt:'متضاد groß چیست؟',choices:['klein','teuer','schön','alt'],answer:'klein'},
          {id:'l4-d03',type:'choice',prompt:'اگر وسیله ارزان باشد، کدام واژه مناسب است؟',choices:['günstig','teuer','schwer','alt'],answer:'günstig'},
          {id:'l4-d04',type:'build',prompt:'بساز: چراغ جدید است.',answer:'Die Lampe ist neu.'},
          {id:'l4-d05',type:'type',prompt:'ترجمه کن: صندلی بزرگ است.',answer:'Der Stuhl ist groß.'},
          {id:'l4-d06',type:'listen',prompt:'توصیف را گوش بده و بنویس.',audio:'Das Sofa ist sehr schön.',answer:'Das Sofa ist sehr schön.'},
          {id:'l4-d07',type:'choice',prompt:'کدام جمله درست است؟',choices:['Der Tisch ist klein.','Die Tisch ist klein.','Das Tisch sind klein.','Der Tisch sind klein.'],answer:'Der Tisch ist klein.'}
        ]},
      {id:'shopping',title:'۴. Einkaufen · خرید و قیمت',caption:'در فروشگاه بپرس قیمت چقدر است؛ پاسخ کوتاه بده.',
        cards:[['🛒','Was kostet der Tisch?','میز چند قیمت دارد؟'],['💰','Er kostet 40 Euro.','۴۰ یورو است'],
          ['🛍️','Wie viel kostet die Lampe?','چراغ چقدر قیمت دارد؟'],
          ['🤝','Vielen Dank!','بسیار ممنون'],['🔢','89 Euro','۸۹ یورو']],
        reading:'Kunde: Guten Tag! Wie viel kostet die Lampe? Verkäuferin: Sie kostet 40 Euro. Kunde: Und das Sofa? Verkäuferin: Das Sofa kostet 200 Euro. Kunde: Vielen Dank!',
        tasks:[
          {id:'l4-s01',type:'choice',prompt:'در گفت‌وگو چراغ چند یورو است؟',choices:['40 Euro','20 Euro','89 Euro','200 Euro'],answer:'40 Euro'},
          {id:'l4-s02',type:'choice',prompt:'مبل در گفت‌وگو چند یورو است؟',choices:['200 Euro','40 Euro','20 Euro','90 Euro'],answer:'200 Euro'},
          {id:'l4-s03',type:'choice',prompt:'برای پرسیدن قیمت میز کدام سؤال درست است؟',choices:['Was kostet der Tisch?','Wer kostet der Tisch?','Wo kostet der Tisch?','Wie heißt der Preis?'],answer:'Was kostet der Tisch?'},
          {id:'l4-s04',type:'build',prompt:'بساز: چراغ ۳۰ یورو قیمت دارد.',answer:'Die Lampe kostet 30 Euro.'},
          {id:'l4-s05',type:'type',prompt:'جواب بده: میز ۵۰ یورو است.',answer:'Der Tisch kostet 50 Euro.'},
          {id:'l4-s06',type:'listen',prompt:'قیمت را بشنو و جمله را بنویس.',audio:'Das Bett kostet 90 Euro.',answer:'Das Bett kostet 90 Euro.'},
          {id:'l4-s07',type:'choice',prompt:'برای پاسخ مؤدبانه بعد از شنیدن قیمت کدام عبارت است؟',choices:['Vielen Dank!','Ich heiße Reza.','Woher kommst du?','Ist das deine Mutter?'],answer:'Vielen Dank!'}
        ]}
    ]
  },
  5:{
    title:'Was ist das? – Das ist ein F.',pages:'۲۹ تا ۳۲',focus:'وسایل روزمره، ein/eine/kein/keine، مواد سازنده و معرفی اشیا',
    goals:['نام‌گذاری اشیای روزمره با تصاویر معنادار',
      'انتخاب درست ein/eine با توجه به der/die/das',
      'منفی‌کردن معرفی شیء با kein/keine',
      'پرسیدن نام یک وسیله و درخواست تکرار',
      'توصیف جنس وسایل با aus و خواندن اطلاعات کوتاه محصول'],
    sections:[
      {id:'objects',title:'۱. Gegenstände · شناسایی اشیا',caption:'شیء را ببین، معنی را بگو و حرف تعریف درست را یاد بگیر.',
        cards:[['🔑','der Schlüssel','کلید'],['🖊️','der Kugelschreiber','خودکار'],
          ['✏️','der Bleistift','مداد'],['📕','das Buch','کتاب'],['🍼','die Flasche','بطری'],
          ['🕶️','die Brille','عینک'],['👜','die Tasche','کیف'],['📷','der Fotoapparat','دوربین']],
        tasks:[
          {id:'l5-o01',type:'choice',prompt:'«کلید» با حرف تعریف درست چیست؟',choices:['der Schlüssel','die Schlüssel','das Schlüssel','der Schrank'],answer:'der Schlüssel'},
          {id:'l5-o02',type:'choice',prompt:'کدام وسیله مؤنث است؟',choices:['die Flasche','der Bleistift','das Buch','der Schlüssel'],answer:'die Flasche'},
          {id:'l5-o03',type:'choice',prompt:'«عینک» کدام است؟',choices:['die Brille','die Tasche','das Buch','die Flasche'],answer:'die Brille'},
          {id:'l5-o04',type:'type',prompt:'به آلمانی بنویس: مداد (با حرف تعریف).',answer:'der Bleistift'},
          {id:'l5-o05',type:'listen',prompt:'نام یک شیء را بشنو و بنویس.',audio:'die Tasche',answer:'die Tasche'},
          {id:'l5-o06',type:'build',prompt:'بساز: این یک کتاب است.',answer:'Das ist ein Buch.'},
          {id:'l5-o07',type:'choice',prompt:'کدام وسیله برای نوشتن با جوهر است؟',choices:['der Kugelschreiber','der Schlüssel','die Brille','die Kette'],answer:'der Kugelschreiber'},
          {id:'l5-o08',type:'choice',prompt:'کدام واژه به معنی دوربین عکس‌برداری است؟',choices:['der Fotoapparat','das Buch','die Tasche','der Schrank'],answer:'der Fotoapparat'}
        ]},
      {id:'indefinite',title:'۲. Ein oder eine? · معرفی اشیا',caption:'«این یک ... است» را برای اسم مذکر، مؤنث و خنثی بساز.',
        cards:[['🔵','der Tisch → ein Tisch','اسم مذکر'],['🩷','die Lampe → eine Lampe','اسم مؤنث'],
          ['🟢','das Buch → ein Buch','اسم خنثی'],['❓','Was ist das?','این چیست؟'],
          ['🗣️','Das ist eine Tasche.','این یک کیف است']],
        tasks:[
          {id:'l5-i01',type:'choice',prompt:'جای خالی: Das ist ___ Lampe.',choices:['eine','ein','kein','einen'],answer:'eine',why:'die Lampe مؤنث است و eine می‌گیرد.'},
          {id:'l5-i02',type:'choice',prompt:'جای خالی: Das ist ___ Schlüssel.',choices:['ein','eine','einen','keine'],answer:'ein',why:'بعد از Das ist، اسم مذکر در حالت فاعلی با ein می‌آید.'},
          {id:'l5-i03',type:'choice',prompt:'جای خالی: Das ist ___ Buch.',choices:['ein','eine','einen','keine'],answer:'ein',why:'das Buch خنثی است.'},
          {id:'l5-i04',type:'choice',prompt:'برای اسم مؤنث «کیف» کدام جمله درست است؟',choices:['Das ist eine Tasche.','Das ist ein Tasche.','Das ist einen Tasche.','Das ist der Tasche.'],answer:'Das ist eine Tasche.'},
          {id:'l5-i05',type:'type',prompt:'ترجمه کن: این یک عینک است.',answer:'Das ist eine Brille.'},
          {id:'l5-i06',type:'build',prompt:'بساز: این یک خودکار است.',answer:'Das ist ein Kugelschreiber.'},
          {id:'l5-i07',type:'listen',prompt:'جمله معرفی یک شیء را بشنو و بنویس.',audio:'Das ist eine Flasche.',answer:'Das ist eine Flasche.'},
          {id:'l5-i08',type:'choice',prompt:'کدام یک برای «این چیست؟» درست است؟',choices:['Was ist das?','Wer ist das?','Wie alt ist das?','Woher kommt das?'],answer:'Was ist das?'}
        ]},
      {id:'negation',title:'۳. Kein oder keine? · تصحیح و نفی',caption:'«نه، این ... نیست» را با جنسیت درست بساز.',
        cards:[['🚫','kein Tisch','نه یک میز'],['🚫','keine Lampe','نه یک چراغ'],
          ['❌','kein Buch','نه یک کتاب'],['🪑','Nein, das ist ein Stuhl.','نه، این صندلی است']],
        tasks:[
          {id:'l5-n01',type:'choice',prompt:'برای نفی das Buch کدام شکل درست است؟',choices:['kein Buch','keine Buch','nicht Buch','keinen Buch'],answer:'kein Buch'},
          {id:'l5-n02',type:'choice',prompt:'کدام عبارت مؤنث را نفی می‌کند؟',choices:['keine Flasche','kein Flasche','nicht eine Flasche','keinen Flasche'],answer:'keine Flasche'},
          {id:'l5-n03',type:'choice',prompt:'جمله صحیح برای «این کلید نیست» چیست؟',choices:['Das ist kein Schlüssel.','Das ist keine Schlüssel.','Das sind kein Schlüssel.','Das ist nicht Schlüssel.'],answer:'Das ist kein Schlüssel.'},
          {id:'l5-n04',type:'type',prompt:'بنویس: این یک کیف نیست.',answer:'Das ist keine Tasche.'},
          {id:'l5-n05',type:'build',prompt:'بساز: این عینک نیست.',answer:'Das ist keine Brille.'},
          {id:'l5-n06',type:'listen',prompt:'جمله نفی را بشنو و بنویس.',audio:'Das ist kein Bleistift.',answer:'Das ist kein Bleistift.'},
          {id:'l5-n07',type:'choice',prompt:'سؤال: Ist das ein Tisch? (تصحیح: نه، این یک صندلی است.) کدام پاسخ صحیح است؟',choices:['Nein, das ist ein Stuhl.','Ja, das ist ein Tisch.','Nein, das ist eine Stuhl.','Doch, Tisch ist ein.'],answer:'Nein, das ist ein Stuhl.'},
          {id:'l5-n08',type:'choice',prompt:'برای die Kette کدام ساختار منفی درست است؟',choices:['Das ist keine Kette.','Das ist kein Kette.','Das ist nicht Kette.','Das sind kein Kette.'],answer:'Das ist keine Kette.'}
        ]},
      {id:'materials',title:'۴. Material und Nachfragen · جنس و مکالمه',caption:'جنس وسایل را بگو، نام واژه را بپرس و توضیحات محصول را بخوان.',
        cards:[['🪵','aus Holz','از چوب'],['🥃','aus Glas','از شیشه'],
          ['📄','aus Papier','از کاغذ'],['🔩','aus Metall','از فلز'],
          ['❔','Wie heißt das auf Deutsch?','این به آلمانی چه نام دارد؟'],
          ['🔁','Noch einmal, bitte!','یک بار دیگر، لطفاً']],
        reading:'Produkt: eine Flasche. Material: Glas. Farbe: blau. Preis: 8 Euro. Das ist eine schöne Flasche. Der Schlüssel ist aus Metall. Das Buch ist aus Papier.',
        tasks:[
          {id:'l5-m01',type:'choice',prompt:'بطری در معرفی محصول از چه جنسی است؟',choices:['Glas','Holz','Papier','Metall'],answer:'Glas'},
          {id:'l5-m02',type:'choice',prompt:'قیمت بطری در متن چند یورو است؟',choices:['8 Euro','18 Euro','80 Euro','3 Euro'],answer:'8 Euro'},
          {id:'l5-m03',type:'choice',prompt:'برای «از چوب» کدام عبارت درست است؟',choices:['aus Holz','in Holz','mit Holz','aus Haus'],answer:'aus Holz'},
          {id:'l5-m04',type:'choice',prompt:'وقتی اسم آلمانی چیزی را نمی‌دانی، چه می‌پرسی؟',choices:['Wie heißt das auf Deutsch?','Wie alt bist du?','Woher kommst du?','Wann ist der Termin?'],answer:'Wie heißt das auf Deutsch?'},
          {id:'l5-m05',type:'type',prompt:'ترجمه کن: کلید از فلز است.',answer:'Der Schlüssel ist aus Metall.'},
          {id:'l5-m06',type:'build',prompt:'بساز: کتاب از کاغذ است.',answer:'Das Buch ist aus Papier.'},
          {id:'l5-m07',type:'listen',prompt:'درخواست تکرار را بشنو و بنویس.',audio:'Noch einmal, bitte!',answer:'Noch einmal, bitte!'},
          {id:'l5-m08',type:'choice',prompt:'کدام جمله درباره جنس بطری درست است؟',choices:['Die Flasche ist aus Glas.','Der Flasche ist aus Holz.','Das Flasche sind Glas.','Eine Flasche ist aus dem Brille.'],answer:'Die Flasche ist aus Glas.'}
        ]}
    ]
  }
};
