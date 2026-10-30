// Independent exercises mapped to the published Menschen A1.1 Kursbuch syllabus.
// Neither text nor visual assets are copied from Hueber's copyrighted pages.
export const bookLessonPlans = {
  1: {
    title:'Hallo! Ich bin Nicole ...', pages:'۹ تا ۱۲', focus:'سلام، معرفی، مبدأ، احوال‌پرسی',
    goals:['سلام و خداحافظی رسمی و دوستانه','معرفی نام و کشور','پرسیدن نام و مبدأ','الفبا و هجی کردن','پرسیدن حال و پاسخ دادن'],
    sections:[
      {id:'greetings',title:'۱. Begrüßung · سلام و خداحافظی',caption:'زمان و موقعیت مناسب را انتخاب کن.',
       cards:[['🌅','Guten Morgen!','صبح بخیر'],['☀️','Guten Tag!','روز بخیر'],['🌙','Guten Abend!','عصر بخیر'],['👋','Tschüs!','خداحافظ دوستانه'],['🤝','Auf Wiedersehen!','خداحافظ رسمی']],
       tasks:[
         {id:'l1-g1',type:'choice',prompt:'وقتی صبح به کلاس می‌رسی چه می‌گویی؟',choices:['Guten Morgen!','Gute Nacht!','Auf Wiedersehen!','Tschüs!'],answer:'Guten Morgen!',why:'Guten Morgen برای سلام‌کردن در صبح است.'},
         {id:'l1-g2',type:'choice',prompt:'برای خداحافظی رسمی با استاد کدام عبارت مناسب‌تر است؟',choices:['Tschüs!','Auf Wiedersehen!','Hallo!','Guten Morgen!'],answer:'Auf Wiedersehen!'},
         {id:'l1-g3',type:'listen',prompt:'گوش بده و عبارت را دقیق تایپ کن.',audio:'Guten Abend',answer:'Guten Abend'},
         {id:'l1-g4',type:'choice',prompt:'دوستت می‌رود؛ دوستانه خداحافظی کن.',choices:['Tschüs!','Wie heißen Sie?','Guten Morgen!','Ich komme aus Mexiko.'],answer:'Tschüs!'}
       ]},
      {id:'names',title:'۲. Kennenlernen · نام و مبدأ',caption:'جمله را بشنو، بگو و کامل کن.',
       cards:[['🧑','Ich heiße Reza.','اسم من رضاست'],['❓','Wie heißt du?','نام تو چیست؟'],['🌍','Woher kommst du?','اهل کجا هستی؟'],['🇦🇹','Ich komme aus Österreich.','من اهل اتریش هستم'],['🇮🇷','Ich komme aus dem Iran.','من اهل ایران هستم']],
       tasks:[
         {id:'l1-n1',type:'choice',prompt:'برای پرسیدن نام دوستت چه می‌گویی؟',choices:['Wie heißt du?','Woher kommst du?','Wie geht es dir?','Was sind Sie von Beruf?'],answer:'Wie heißt du?'},
         {id:'l1-n2',type:'type',prompt:'ترجمه کن: من اهل ایران هستم.',answer:'Ich komme aus dem Iran.',hint:'Ich ... aus dem Iran.'},
         {id:'l1-n3',type:'build',prompt:'جمله را مرتب کن: اهل کجا هستی؟',answer:'Woher kommst du?'},
         {id:'l1-n4',type:'choice',prompt:'پاسخ درست به Woher kommst du? کدام است؟',choices:['Ich komme aus Österreich.','Ich heiße Sara.','Gut, danke.','Auf Wiedersehen!'],answer:'Ich komme aus Österreich.'},
         {id:'l1-n5',type:'listen',prompt:'کشور را از روی صدای جمله تشخیص بده و کل جمله را بنویس.',audio:'Ich komme aus der Schweiz.',answer:'Ich komme aus der Schweiz.'}
       ]},
      {id:'alphabet',title:'۳. Alphabet · الفبا و هجی',caption:'حروف را با صدای آلمانی تمرین کن؛ حروف ویژه را بشناس.',
       cards:[['🔤','A · B · C · D','حروف آغاز الفبا'],['🅰️','Ä · Ö · Ü · ß','حروف ویژه'],['✍️','Ich buchstabiere.','من هجی می‌کنم'],['👤','Mein Name ist Reza.','نام من رضا است']],
       tasks:[
         {id:'l1-a1',type:'choice',prompt:'در آلمانی حرف ß در نوشتار معمولاً معادل کدام ترکیب است؟',choices:['ss','sch','ch','tz'],answer:'ss'},
         {id:'l1-a2',type:'choice',prompt:'کدام مجموعه حروف ویژه آلمانی را کامل نشان می‌دهد؟',choices:['Ä Ö Ü ß','A E I O','C G J Q','S T U V'],answer:'Ä Ö Ü ß'},
         {id:'l1-a3',type:'listen',prompt:'جمله کوتاه را بشنو و بنویس.',audio:'Mein Name ist Reza.',answer:'Mein Name ist Reza.'},
         {id:'l1-a4',type:'type',prompt:'بنویس: اسم من سارا است.',answer:'Ich heiße Sara.',hint:'Ich ... Sara.'}
       ]},
      {id:'wellbeing',title:'۴. Befinden · احوال‌پرسی و خطاب رسمی',caption:'تفاوت du و Sie و پاسخ‌های طبیعی را یاد بگیر.',
       cards:[['😊','Wie geht es dir?','حالت چطور است؟ (دوستانه)'],['🤝','Wie geht es Ihnen?','حال شما چطور است؟ (رسمی)'],['✨','Sehr gut, danke.','خیلی خوبم، ممنون'],['🙂','Es geht.','بد نیستم'],['🙁','Nicht so gut.','چندان خوب نیستم']],
       tasks:[
         {id:'l1-w1',type:'choice',prompt:'از حال استاد به‌صورت رسمی سؤال کن.',choices:['Wie geht es Ihnen?','Wie geht es dir?','Woher kommst du?','Wie heißt du?'],answer:'Wie geht es Ihnen?'},
         {id:'l1-w2',type:'choice',prompt:'Es geht. چه معنایی دارد؟',choices:['بد نیستم / می‌گذرد','صبح بخیر','من معلم هستم','خداحافظ'],answer:'بد نیستم / می‌گذرد'},
         {id:'l1-w3',type:'build',prompt:'«خیلی خوبم، ممنون» را بساز.',answer:'Sehr gut, danke.'},
         {id:'l1-w4',type:'listen',prompt:'گوش بده و احوال‌پرسی را بنویس.',audio:'Wie geht es dir?',answer:'Wie geht es dir?'},
         {id:'l1-w5',type:'choice',prompt:'کدام شکل صرف برای «du» از فعل kommen درست است؟',choices:['kommst','komme','kommt','kommen'],answer:'kommst'}
       ]}
    ]
  },
  2: {
    title:'Ich bin Journalistin.', pages:'۱۳ تا ۱۶',focus:'شغل، وضعیت تأهل، اعداد ۱–۱۰۰ و اطلاعات شخصی',
    goals:['معرفی شغل و سؤال‌کردن درباره آن','شکل مؤنث شغل با -in','گفتن وضعیت تأهل و استفاده از nicht','صرف فعل در مفرد و جمع','شمردن و شنیدن اعداد ۱ تا ۱۰۰','خواندن و نوشتن یک پروفایل کوتاه'],
    sections:[
      {id:'jobs',title:'۱. Berufe · شغل‌ها',caption:'شغل را با تصویر ذهنی، صدا و جنسیت کلمه به خاطر بسپار.',
       cards:[['📰','der Journalist / die Journalistin','روزنامه‌نگار'],['👩‍🏫','der Lehrer / die Lehrerin','معلم'],['🩺','der Arzt / die Ärztin','پزشک'],['💻','der Softwareentwickler / die Softwareentwicklerin','توسعه‌دهنده نرم‌افزار'],['💬','Was sind Sie von Beruf?','شغل شما چیست؟']],
       tasks:[
         {id:'l2-j1',type:'choice',prompt:'شکل مؤنث Journalist چیست؟',choices:['Journalistin','Journalister','Journalistinnen','Journaliste'],answer:'Journalistin'},
         {id:'l2-j2',type:'choice',prompt:'چطور رسمی می‌پرسی شغل شما چیست؟',choices:['Was sind Sie von Beruf?','Woher kommen Sie?','Wie geht es Ihnen?','Wie heißt du?'],answer:'Was sind Sie von Beruf?'},
         {id:'l2-j3',type:'type',prompt:'بنویس: من توسعه‌دهنده نرم‌افزار هستم.',answer:'Ich bin Softwareentwickler.',hint:'Ich bin ...'},
         {id:'l2-j4',type:'listen',prompt:'شغل را بشنو و جمله را بنویس.',audio:'Sie ist Lehrerin.',answer:'Sie ist Lehrerin.'},
         {id:'l2-j5',type:'choice',prompt:'شکل مؤنث Arzt کدام است؟',choices:['Ärztin','Arztin','Arzter','Ärztinnen'],answer:'Ärztin'}
       ]},
      {id:'grammar',title:'۲. Grammatik · فعل و منفی‌سازی',caption:'صرف مفرد و جمع، حرف -in و nicht در جمله.',
       cards:[['👤','Ich arbeite.','من کار می‌کنم'],['👥','Wir arbeiten.','ما کار می‌کنیم'],['🚫','Ich bin nicht ledig.','من مجرد نیستم'],['👩','Sie ist Journalistin.','او روزنامه‌نگار است']],
       tasks:[
         {id:'l2-r1',type:'choice',prompt:'فعل arbeiten برای wir چیست؟',choices:['arbeiten','arbeite','arbeitest','arbeitet'],answer:'arbeiten'},
         {id:'l2-r2',type:'choice',prompt:'فعل sein برای Sie (شما رسمی) چیست؟',choices:['sind','ist','bist','bin'],answer:'sind'},
         {id:'l2-r3',type:'build',prompt:'بساز: من مجرد نیستم.',answer:'Ich bin nicht ledig.'},
         {id:'l2-r4',type:'type',prompt:'ترجمه کن: ما کار می‌کنیم.',answer:'Wir arbeiten.',hint:'Wir ...'},
         {id:'l2-r5',type:'choice',prompt:'کدام جمله از نظر دستوری درست است؟',choices:['Du arbeitest.','Du arbeiten.','Du arbeitet.','Du arbeite.'],answer:'Du arbeitest.'}
       ]},
      {id:'personal',title:'۳. Persönliche Angaben · وضعیت شخصی',caption:'اطلاعات کارت ویزیت و پروفایل کوتاه را بخوان.',
       cards:[['💍','verheiratet','متأهل'],['🌱','ledig','مجرد'],['📋','der Familienstand','وضعیت تأهل'],['📇','die Visitenkarte','کارت ویزیت'],['📝','Mein Beruf ist Softwareentwickler.','شغل من توسعه‌دهنده نرم‌افزار است']],
       reading:'Hallo! Ich heiße Amir. Ich komme aus Österreich. Ich bin Lehrer. Ich bin verheiratet.',
       tasks:[
         {id:'l2-p1',type:'choice',prompt:'در متن بالا Amir چه شغلی دارد؟',choices:['Lehrer','Arzt','Journalist','Softwareentwickler'],answer:'Lehrer'},
         {id:'l2-p2',type:'choice',prompt:'در متن بالا وضعیت تأهل Amir چیست؟',choices:['verheiratet','ledig','geschieden','nicht bekannt'],answer:'verheiratet'},
         {id:'l2-p3',type:'choice',prompt:'کدام واژه به معنی مجرد است؟',choices:['ledig','verheiratet','arbeiten','hundert'],answer:'ledig'},
         {id:'l2-p4',type:'listen',prompt:'وضعیت شخصی را بشنو و دقیق تایپ کن.',audio:'Ich bin verheiratet.',answer:'Ich bin verheiratet.'},
         {id:'l2-p5',type:'build',prompt:'بساز: او روزنامه‌نگار است.',answer:'Sie ist Journalistin.'}
       ]},
      {id:'numbers',title:'۴. Zahlen 1–100 · اعداد',caption:'از یک تا صد؛ تفاوت zwölf/zwanzig و منطق یکان + und + دهگان.',
       cards:[['🔟','zehn','۱۰'],['2️⃣','zwölf','۱۲'],['🔢','zwanzig','۲۰'],['🧮','einundzwanzig','۲۱'],['💯','hundert','۱۰۰']],
       tasks:[
         {id:'l2-z1',type:'choice',prompt:'عدد ۲۰ کدام است؟',choices:['zwanzig','zwölf','zwei','zehn'],answer:'zwanzig'},
         {id:'l2-z2',type:'choice',prompt:'عدد ۱۲ کدام است؟',choices:['zwölf','zwanzig','zwei','zehn'],answer:'zwölf'},
         {id:'l2-z3',type:'type',prompt:'عدد ۲۷ را به آلمانی بنویس.',answer:'siebenundzwanzig',hint:'sieben + und + zwanzig'},
         {id:'l2-z4',type:'listen',prompt:'این عدد را بشنو و به آلمانی تایپ کن.',audio:'einundvierzig',answer:'einundvierzig'},
         {id:'l2-z5',type:'choice',prompt:'عدد ۸۰ کدام است؟',choices:['achtzig','achtzehn','acht','achtundzwanzig'],answer:'achtzig'}
       ]}
    ]
  }
};
export function allBookTasks(lessonId) {
  return (bookLessonPlans[lessonId]?.sections || []).flatMap(section=>section.tasks);
}
export function germanNumber(n) {
  if(!Number.isInteger(n)||n<1||n>100)throw new RangeError('Only integers 1..100 are supported');
  const simple=['','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn'];
  if(n<20)return simple[n];
  if(n===100)return 'hundert';
  const tens=['','','zwanzig','dreißig','vierzig','fünfzig','sechzig','siebzig','achtzig','neunzig'];
  const t=Math.floor(n/10), u=n%10;
  if(u===0)return tens[t];
  return (u===1?'ein':simple[u])+'und'+tens[t];
}
export function normalizeBookAnswer(value) {
  return String(value||'').normalize('NFC').toLocaleLowerCase('de')
    .replace(/[.!?,؛،]/g,'').replace(/\s+/g,' ').trim();
}
export function isBookAnswerCorrect(question,response) {
  return normalizeBookAnswer(question.answer)===normalizeBookAnswer(response);
}
