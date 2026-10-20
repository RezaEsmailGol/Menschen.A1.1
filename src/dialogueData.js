// Independent A1.1 German role-play dialogues, correlated with beginner class themes.
// No copyrighted textbook scenes or text is reproduced.
export const scenes = [
 {id:'greetings',title:'سلام و احوال‌پرسی',de:'Hallo & Kennenlernen',level:'A1.1',lesson:1,
  place:'کلاس زبان',theme:'classroom',emoji:'👋',character:'Lena',subtitle:'سلام، حال‌واحوال و معرفی',
  intro:'در کلاس آلمانی با لِنا آشنا می‌شوی. پاسخ تو تعیین می‌کند مکالمه دوستانه باشد یا رسمی.',
  first:'hello',nodes:{
   hello:{speaker:'Lena',de:'Hallo! Wie geht es dir?',fa:'سلام! حالت چطوره؟',choices:[
    {id:'friendly',de:'Gut, danke! Und dir?',fa:'خوبم، ممنون! تو چطوری؟',next:'friendly_name',correct:true,tone:'دوستانه'},
    {id:'polite',de:'Guten Tag! Mir geht es gut, danke.',fa:'روز بخیر! حالم خوب است، ممنون.',next:'formal_name',correct:true,tone:'رسمی'},
    {id:'wrong',de:'Ich bin aus dem Iran.',fa:'من اهل ایران هستم.',correct:false,explain:'اینجا درباره حالت پرسیده شده، نه محل تولدت.'}
   ]},
   friendly_name:{speaker:'Lena',de:'Super! Ich heiße Lena. Wie heißt du?',fa:'عالی! من لنا هستم. تو چه اسمی داری؟',choices:[
    {id:'f_name',de:'Ich heiße Reza.',fa:'اسم من رضاست.',next:'f_origin',correct:true},
    {id:'f_surname',de:'Mein Name ist Reza.',fa:'نام من رضاست.',next:'f_origin',correct:true},
    {id:'f_wrong',de:'Ich komme morgen.',fa:'من فردا می‌آیم.',correct:false,explain:'برای معرفی نام از heiße یا mein Name ist استفاده کن.'}
   ]},
   formal_name:{speaker:'Lena',de:'Freut mich! Wie heißen Sie?',fa:'خوشوقتم! نام شما چیست؟',choices:[
    {id:'p_name',de:'Mein Name ist Reza.',fa:'نام من رضاست.',next:'p_origin',correct:true},
    {id:'p_also',de:'Ich heiße Reza.',fa:'اسم من رضاست.',next:'p_origin',correct:true},
    {id:'p_wrong',de:'Wie heißt du?',fa:'تو چه اسمی داری؟',correct:false,explain:'اینجا باید خودت را معرفی کنی؛ و سؤال رسمی از Sie استفاده می‌کند.'}
   ]},
   f_origin:{speaker:'Lena',de:'Woher kommst du?',fa:'اهل کجایی؟',choices:[
    {id:'iran',de:'Ich komme aus dem Iran.',fa:'من اهل ایران هستم.',next:'f_end',correct:true},
    {id:'austria',de:'Ich komme aus Österreich.',fa:'من اهل اتریش هستم.',next:'f_end',correct:true},
    {id:'origin_wrong',de:'Ich bin 40 Jahre alt.',fa:'من چهل ساله‌ام.',correct:false,explain:'Woher یعنی «از کجا» و پاسخ با aus می‌آید.'}
   ]},
   p_origin:{speaker:'Lena',de:'Woher kommen Sie?',fa:'اهل کجا هستید؟',choices:[
    {id:'p_iran',de:'Ich komme aus dem Iran.',fa:'من اهل ایران هستم.',next:'p_end',correct:true},
    {id:'p_austria',de:'Ich komme aus Österreich.',fa:'من اهل اتریش هستم.',next:'p_end',correct:true},
    {id:'p_wrong',de:'Gute Nacht.',fa:'شب‌بخیر.',correct:false,explain:'به پرسش درباره کشور مبدأ پاسخ بده.'}
   ]},
   f_end:{speaker:'Lena',de:'Schön, dich kennenzulernen!',fa:'از آشنایی با تو خوشحالم!',choices:[
    {id:'bye',de:'Mich auch! Bis bald!',fa:'من هم همین‌طور! به‌زودی می‌بینمت!',next:null,correct:true}
   ]},
   p_end:{speaker:'Lena',de:'Schön, Sie kennenzulernen!',fa:'از آشنایی با شما خوشحالم!',choices:[
    {id:'formal_bye',de:'Vielen Dank. Auf Wiedersehen!',fa:'بسیار ممنون. خداحافظ!',next:null,correct:true}
   ]}
  }},
 {id:'origin',title:'اهل کجا هستی؟',de:'Woher kommst du?',level:'A1.1',lesson:1,
  place:'ایستگاه وین',theme:'station',emoji:'🌍',character:'Max',subtitle:'کشور، شهر و زبان',
  intro:'در ایستگاه با مکس آشنا می‌شوی؛ درباره ایران و زبان‌هایی که بلدی حرف بزن.',
  first:'start',nodes:{
   start:{speaker:'Max',de:'Entschuldigung, woher kommst du?',fa:'ببخشید، اهل کجایی؟',choices:[
    {id:'iran',de:'Ich komme aus dem Iran.',fa:'من اهل ایران هستم.',next:'country',correct:true},
    {id:'germany',de:'Ich komme aus Deutschland.',fa:'من اهل آلمان هستم.',next:'country',correct:true},
    {id:'bad',de:'Ich komme gestern.',fa:'من دیروز می‌آیم.',correct:false,explain:'پرسش Woher مربوط به مبدأ است.'}
   ]},
   country:{speaker:'Max',de:'Interessant! In welcher Stadt wohnst du?',fa:'جالب است! در کدام شهر زندگی می‌کنی؟',choices:[
    {id:'qom',de:'Ich wohne in Qom.',fa:'من در قم زندگی می‌کنم.',next:'language',correct:true},
    {id:'wien',de:'Ich wohne in Wien.',fa:'من در وین زندگی می‌کنم.',next:'language',correct:true},
    {id:'bad',de:'Ich spreche morgen.',fa:'من فردا صحبت می‌کنم.',correct:false,explain:'برای محل زندگی از Ich wohne in … استفاده می‌کنیم.'}
   ]},
   language:{speaker:'Max',de:'Sprichst du Deutsch?',fa:'آلمانی صحبت می‌کنی؟',choices:[
    {id:'a1',de:'Ein bisschen. Ich lerne Deutsch.',fa:'کمی. دارم آلمانی یاد می‌گیرم.',next:'finish',correct:true},
    {id:'yes',de:'Ja, ich spreche Deutsch.',fa:'بله، آلمانی صحبت می‌کنم.',next:'finish',correct:true},
    {id:'bad',de:'Nein, ich bin Deutsch.',fa:'نه، من آلمانی هستم.',correct:false,explain:'Deutsch در اینجا زبان است؛ فعل مناسب spreche یا lerne است.'}
   ]},
   finish:{speaker:'Max',de:'Viel Erfolg beim Deutschlernen!',fa:'در یادگیری آلمانی موفق باشی!',choices:[{id:'bye',de:'Danke schön!',fa:'خیلی ممنون!',next:null,correct:true}]}
  }},
 {id:'cafe',title:'در کافه',de:'Im Café',level:'A1.1',lesson:7,
  place:'کافه کوچک',theme:'cafe',emoji:'☕',character:'Anna',subtitle:'دوستانه، سفارش و تشکر',
  intro:'با آنا در کافه هستی؛ می‌توانی سفارش دوستانه یا مؤدبانه داشته باشی.',
  first:'start',nodes:{
   start:{speaker:'Anna',de:'Hallo! Was möchtest du trinken?',fa:'سلام! چی دوست داری بنوشی؟',choices:[
    {id:'coffee',de:'Ich möchte einen Kaffee, bitte.',fa:'یک قهوه می‌خواهم، لطفاً.',next:'coffee',correct:true},
    {id:'tea',de:'Ich möchte einen Tee, bitte.',fa:'یک چای می‌خواهم، لطفاً.',next:'tea',correct:true},
    {id:'bad',de:'Ich bin Kaffee.',fa:'من قهوه هستم.',correct:false,explain:'برای سفارش از ich möchte استفاده کن، نه ich bin.'}
   ]},
   coffee:{speaker:'Anna',de:'Gern! Möchtest du auch Kuchen?',fa:'حتماً! کیک هم می‌خواهی؟',choices:[
    {id:'yes',de:'Ja, bitte. Ein Stück Kuchen.',fa:'بله، لطفاً. یک برش کیک.',next:'finish',correct:true},
    {id:'no',de:'Nein, danke.',fa:'نه، ممنون.',next:'finish',correct:true},
    {id:'bad',de:'Ich heiße Kuchen.',fa:'اسم من کیک است.',correct:false,explain:'Ja, bitte یا Nein, danke پاسخ مناسب است.'}
   ]},
   tea:{speaker:'Anna',de:'Natürlich. Mit Milch?',fa:'حتماً. با شیر؟',choices:[
    {id:'yes',de:'Ja, bitte, mit Milch.',fa:'بله، لطفاً، با شیر.',next:'finish',correct:true},
    {id:'no',de:'Nein, ohne Milch, danke.',fa:'نه، بدون شیر، ممنون.',next:'finish',correct:true},
    {id:'bad',de:'Woher kommst du?',fa:'اهل کجایی؟',correct:false,explain:'پرسش درباره شیر در چای است.'}
   ]},
   finish:{speaker:'Anna',de:'Das macht vier Euro.',fa:'چهار یورو می‌شود.',choices:[{id:'paid',de:'Bitte schön. Danke!',fa:'بفرمایید. ممنون!',next:null,correct:true}]}
  }},
 {id:'office',title:'اولین روز شرکت',de:'Im Büro',level:'A1.1+',lesson:4,
  place:'شرکت نرم‌افزاری',theme:'office',emoji:'💼',character:'Frau Berger',subtitle:'Sie، معرفی شغلی و هماهنگی',
  intro:'روز اول شرکت در اتریش است. با همکار بخش منابع انسانی به شکل رسمی صحبت می‌کنی.',
  first:'start',nodes:{
   start:{speaker:'Frau Berger',de:'Guten Morgen! Wie heißen Sie?',fa:'صبح بخیر! نام شما چیست؟',choices:[
    {id:'formal',de:'Guten Morgen! Mein Name ist Reza.',fa:'صبح بخیر! نام من رضاست.',next:'profession',correct:true},
    {id:'simple',de:'Ich heiße Reza.',fa:'اسم من رضاست.',next:'profession',correct:true},
    {id:'bad',de:'Du bist Reza.',fa:'تو رضا هستی.',correct:false,explain:'او نام شما را پرسیده؛ Ich heiße یا Mein Name ist مناسب است.'}
   ]},
   profession:{speaker:'Frau Berger',de:'Was sind Sie von Beruf?',fa:'شغل شما چیست؟',choices:[
    {id:'software',de:'Ich bin Softwareentwickler.',fa:'من توسعه‌دهنده نرم‌افزار هستم.',next:'skill',correct:true},
    {id:'backend',de:'Ich arbeite als Backend-Entwickler.',fa:'من به‌عنوان برنامه‌نویس بک‌اند کار می‌کنم.',next:'skill',correct:true},
    {id:'bad',de:'Ich heiße Python.',fa:'اسم من پایتون است.',correct:false,explain:'شغلت را با Ich bin یا Ich arbeite als توضیح بده.'}
   ]},
   skill:{speaker:'Frau Berger',de:'Womit arbeiten Sie?',fa:'با چه ابزارهایی کار می‌کنید؟',choices:[
    {id:'python',de:'Ich arbeite mit Python und Odoo.',fa:'من با پایتون و اودوو کار می‌کنم.',next:'finish',correct:true},
    {id:'web',de:'Ich entwickle Webanwendungen.',fa:'من برنامه‌های تحت وب توسعه می‌دهم.',next:'finish',correct:true},
    {id:'bad',de:'Ich bin ein Termin.',fa:'من یک قرار ملاقات هستم.',correct:false,explain:'درباره فناوری یا کار حرفه‌ای پاسخ بده.'}
   ]},
   finish:{speaker:'Frau Berger',de:'Vielen Dank. Willkommen im Team!',fa:'بسیار ممنون. به تیم خوش آمدید!',choices:[{id:'thanks',de:'Vielen Dank! Ich freue mich.',fa:'خیلی ممنون! خوشحالم.',next:null,correct:true}]}
  }},
 {id:'interview',title:'مصاحبه کاری',de:'Bewerbungsgespräch',level:'A2–B1',lesson:12,
  place:'اتاق مصاحبه',theme:'interview',emoji:'🎯',character:'Herr Müller',subtitle:'HR، سوابق و هدف شغلی',
  intro:'یک مصاحبه تمرینی در وین؛ این سناریو از سطح درس اول سخت‌تر است.',
  first:'start',nodes:{
   start:{speaker:'Herr Müller',de:'Guten Tag. Stellen Sie sich bitte kurz vor.',fa:'روز بخیر. لطفاً خودتان را کوتاه معرفی کنید.',choices:[
    {id:'short',de:'Guten Tag. Ich heiße Reza und bin Softwareentwickler.',fa:'روز بخیر. اسم من رضاست و توسعه‌دهنده نرم‌افزارم.',next:'experience',correct:true},
    {id:'formal',de:'Guten Tag. Mein Name ist Reza. Ich komme aus dem Iran.',fa:'روز بخیر. نام من رضاست. اهل ایران هستم.',next:'experience',correct:true},
    {id:'bad',de:'Ich bin eine Bewerbung.',fa:'من یک درخواست استخدام هستم.',correct:false,explain:'خودت را معرفی کن، نه اینکه بگویی درخواست استخدام هستی.'}
   ]},
   experience:{speaker:'Herr Müller',de:'Welche Berufserfahrung haben Sie?',fa:'چه سابقه کاری دارید؟',choices:[
    {id:'python',de:'Ich habe Erfahrung mit Python und Odoo.',fa:'من با Python و Odoo تجربه دارم.',next:'location',correct:true},
    {id:'backend',de:'Ich entwickle Webanwendungen und Backend-Systeme.',fa:'من برنامه‌های وب و سیستم‌های بک‌اند توسعه می‌دهم.',next:'location',correct:true},
    {id:'bad',de:'Ich habe einen Kaffee.',fa:'من یک قهوه دارم.',correct:false,explain:'درباره Berufserfahrung یا تخصص پاسخ بده.'}
   ]},
   location:{speaker:'Herr Müller',de:'Warum möchten Sie in Österreich arbeiten?',fa:'چرا می‌خواهید در اتریش کار کنید؟',choices:[
    {id:'career',de:'Ich möchte in Österreich arbeiten und mich weiterentwickeln.',fa:'می‌خواهم در اتریش کار کنم و پیشرفت کنم.',next:'finish',correct:true},
    {id:'team',de:'Ich möchte mit einem internationalen Team arbeiten.',fa:'می‌خواهم با تیمی بین‌المللی کار کنم.',next:'finish',correct:true},
    {id:'bad',de:'Ich wohne ein Python.',fa:'من یک پایتون زندگی می‌کنم.',correct:false,explain:'از ich möchte + مصدر برای بیان هدف استفاده کن.'}
   ]},
   finish:{speaker:'Herr Müller',de:'Vielen Dank für das Gespräch.',fa:'از مصاحبه متشکرم.',choices:[{id:'thanks',de:'Vielen Dank für Ihre Zeit. Auf Wiedersehen!',fa:'از وقتی که گذاشتید ممنونم. خداحافظ!',next:null,correct:true}]}
  }}
];

export function getScene(id) {return scenes.find(x=>x.id===id) || null;}
export function validChoice(scene,nodeId,choiceId){
 const node=scene?.nodes?.[nodeId];
 return node?.choices?.find(c=>c.id===choiceId)||null;
}
export function chooseDialogueAnswer(scene,nodeId,choiceId){
 const node=scene?.nodes?.[nodeId], choice=validChoice(scene,nodeId,choiceId);
 if(!node||!choice)return null;
 return {correct:Boolean(choice.correct),next:choice.correct?choice.next:nodeId,
  explanation:choice.correct?'پاسخ مناسب بود. ادامه بده!':choice.explain||'یک گزینه مناسب‌تر انتخاب کن.',
  userText:choice.de,translation:choice.fa,finished:Boolean(choice.correct && choice.next===null)};
}
export const dialogueStyles=['دوستانه','رسمی'];
