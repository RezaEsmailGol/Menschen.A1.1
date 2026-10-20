// Instructor-notes companion for the first private A1 lesson.
// All wording, challenges and illustrations are original to this application.
export const workbookSections = [
  {id:'start',title:'شروع کنیم',subtitle:'معرفی و گرم‌کردن',label:'Start'},
  {id:'alphabet',title:'الفبا',subtitle:'حروف و صداها',label:'Alphabet'},
  {id:'sounds',title:'تلفظ و استثناها',subtitle:'بشنو و مقایسه کن',label:'Aussprache'},
  {id:'numbers',title:'اعداد ۰ تا ۱۲',subtitle:'گوش کن و بنویس',label:'Zahlen'},
  {id:'verbs',title:'ضمیرها و فعل‌ها',subtitle:'kommen / sammeln',label:'Grammatik'},
  {id:'dialog',title:'جمله و مکالمه',subtitle:'خودت را معرفی کن',label:'Sprechen'},
  {id:'checkpoint',title:'آزمون جلسه',subtitle:'آمادگی برای کلاس بعدی',label:'Test'},
];

export const workbookAlphabet = [
 ['A','Apfel','سیب'],['B','Buch','کتاب'],['C','Café','کافه'],['D','Deutsch','آلمانی'],
 ['E','Elefant','فیل'],['F','Fisch','ماهی'],['G','gut','خوب'],['H','Haus','خانه'],
 ['I','ich','من'],['J','Jahr','سال'],['K','Kind','بچه'],['L','lernen','یادگرفتن'],
 ['M','Mutter','مادر'],['N','neun','نه'],['O','Oma','مادربزرگ'],['P','Park','پارک'],
 ['Q','Quelle','چشمه'],['R','rot','قرمز'],['S','Sonne','خورشید'],['T','Tag','روز'],
 ['U','Uhr','ساعت'],['V','Vater','پدر'],['W','Wasser','آب'],['X','Xylofon','زیلوفون'],
 ['Y','Yoga','یوگا'],['Z','Zeit','زمان'],
 ['Ä','Äpfel','سیب‌ها'],['Ö','Österreich','اتریش'],['Ü','über','روی / بالای'],['ß','Straße','خیابان']
].map(([letter,word,translation])=>({letter,word,translation}));

export const workbookSounds = [
 {id:'s',cluster:'S',word:'Sonne',contrast:'Haus',fa:'خورشید',phonetic:'/z/ آغاز واژه',note:'S پیش از واکه در آغاز واژه اغلب مثل «ز» است، ولی آخر Haus صدای «س» دارد.',rule:'صامت‌ها'},
 {id:'sp',cluster:'sp',word:'Sport',contrast:'Wespe',fa:'ورزش',phonetic:'/ʃp/ در آغاز',note:'sp ابتدای Sport معمولاً «شپ» است؛ در وسط Wespe معمولاً «سپ» است.',rule:'صامت‌ها'},
 {id:'st',cluster:'st',word:'Stadt',contrast:'Westen',fa:'شهر',phonetic:'/ʃt/ در آغاز',note:'st در ابتدای Stadt به شکل «شت» شنیده می‌شود؛ در Westen «ست» است.',rule:'صامت‌ها'},
 {id:'v',cluster:'v',word:'Vater',contrast:'Verb',fa:'پدر',phonetic:'/f/ یا /v/',note:'V در Vater مانند «ف» و در Verb مثل /v/ است؛ تلفظ را با مثال یاد بگیر.',rule:'استثنا'},
 {id:'j',cluster:'j',word:'Jahr',contrast:'Job',fa:'سال',phonetic:'/j/ یا /dʒ/',note:'Jahr با صدای «ی» آغاز می‌شود؛ Job وام‌واژه است و با «ج» انگلیسی شنیده می‌شود.',rule:'استثنا'},
 {id:'h',cluster:'h',word:'Haus',contrast:'sehen',fa:'خانه',phonetic:'گاهی تلفظ نمی‌شود',note:'در Haus صدای «ه» داریم؛ در sehen حرف h بیشتر نشان‌دهنده کشیدگی واکه است.',rule:'استثنا'},
 {id:'z',cluster:'z',word:'Zeit',contrast:'zwei',fa:'زمان',phonetic:'/ts/',note:'حرف Z را مثل «تس» تلفظ کن، نه ز انگلیسی.',rule:'صامت‌ها'},
 {id:'ch',cluster:'ch',word:'ich',contrast:'Bach',fa:'من',phonetic:'/ç/ در برابر /x/',note:'ch در ich نرم و در Bach / Dach شبیه «خ» است. این تفاوت را چندبار بشنو.',rule:'استثنا'},
 {id:'chs',cluster:'chs',word:'sechs',contrast:'Bach',fa:'شش',phonetic:'/ks/',note:'sechs مانند «زِکس» است و ترکیب chs در این کلمه صدای «کس» می‌دهد.',rule:'استثنا'},
 {id:'sch',cluster:'sch',word:'Schule',contrast:'Deutsch',fa:'مدرسه',phonetic:'/ʃ/ در برابر /tʃ/',note:'sch = «ش» ولی tsch در Deutsch شامل «چ» است.',rule:'صامت‌ها'},
 {id:'ph',cluster:'ph',word:'Physik',contrast:'Foto',fa:'فیزیک',phonetic:'/f/',note:'ph در Physik صدای «ف» می‌دهد.',rule:'صامت‌ها'},
 {id:'tion',cluster:'-tion',word:'Nation',contrast:'Information',fa:'ملت',phonetic:'/tsioːn/',note:'-tion در Nation به شکل «تسیون» شنیده می‌شود، نه شِن انگلیسی.',rule:'صامت‌ها'},
 {id:'ei',cluster:'ei / ai',word:'mein',contrast:'Liebe',fa:'مال من',phonetic:'/aɪ̯/ در برابر /iː/',note:'ei و ai تقریباً «آی» هستند؛ ie در Liebe صدای «ای» کشیده دارد.',rule:'واکه‌ها'},
 {id:'au',cluster:'au',word:'Haus',contrast:'Häuser',fa:'خانه',phonetic:'/aʊ̯/ در برابر /ɔɪ̯/',note:'au در Haus مانند «آو» است؛ äu در Häuser «اُی» دارد.',rule:'واکه‌ها'},
 {id:'eu',cluster:'eu / äu',word:'heute',contrast:'Häuser',fa:'امروز',phonetic:'/ɔɪ̯/',note:'eu و äu معمولاً صدای مرکب شبیه «اُی» دارند.',rule:'واکه‌ها'},
 {id:'ig',cluster:'-ig',word:'wichtig',contrast:'Tag',fa:'مهم',phonetic:'تفاوت تلفظ منطقه‌ای',note:'پایان -ig در بعضی تلفظ‌های معیار /ɪç/ است؛ در اتریش اغلب /ɪk/ می‌شنوی.',rule:'استثنا'},
 {id:'en',cluster:'-en / -n',word:'kommen',contrast:'sammeln',fa:'آمدن',phonetic:'پایان مصدر',note:'بسیاری از فعل‌ها با -en تمام می‌شوند؛ مانند kommen. برخی با -n: sammeln.',rule:'گرامر'},
];

export const workbookNumbers = [
  'null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf'
].map((word,number)=>({number,word}));

export const workbookPronouns = [
  {person:'ich',fa:'من',kommen:'komme',sammeln:'sammle',ending:'-e'},
  {person:'du',fa:'تو',kommen:'kommst',sammeln:'sammelst',ending:'-st'},
  {person:'er / sie / es',fa:'او / آن',kommen:'kommt',sammeln:'sammelt',ending:'-t'},
  {person:'wir',fa:'ما',kommen:'kommen',sammeln:'sammeln',ending:'-en / -n'},
  {person:'ihr',fa:'شما (جمع دوستانه)',kommen:'kommt',sammeln:'sammelt',ending:'-t'},
  {person:'sie / Sie',fa:'آن‌ها / شما محترمانه',kommen:'kommen',sammeln:'sammeln',ending:'-en / -n'},
];

export const workbookDialog = [
  {id:'hello',speaker:'A',de:'Hallo! Wie heißt du?',fa:'سلام! اسمت چیست؟'},
  {id:'name',speaker:'B',de:'Ich heiße Reza.',fa:'اسم من رضا است.'},
  {id:'origin',speaker:'A',de:'Woher kommst du?',fa:'اهل کجایی؟'},
  {id:'iran',speaker:'B',de:'Ich komme aus dem Iran.',fa:'من اهل ایران هستم.'},
  {id:'german',speaker:'B',de:'Ich lerne Deutsch.',fa:'من آلمانی یاد می‌گیرم.'},
];

export const workbookFillSentences = [
  {id:'iran',fa:'من اهل ایران هستم.',sentence:'Ich komme aus dem Iran.'},
  {id:'name',fa:'اسم من رضا است.',sentence:'Ich heiße Reza.'},
  {id:'german',fa:'من آلمانی یاد می‌گیرم.',sentence:'Ich lerne Deutsch.'},
];

export function cleanWorkbookAnswer(value) {
  return String(value).normalize('NFC').trim().toLocaleLowerCase('de')
    .replace(/[.,!?؟،؛]/g,'').replace(/\s+/g,' ');
}

export function shuffleWorkbook(items,random=Math.random) {
  const copy=[...items];
  for(let i=copy.length-1;i>0;i--){
    const j=Math.floor(random()*(i+1));
    [copy[i],copy[j]]=[copy[j],copy[i]];
  }
  return copy;
}

export function makeWorkbookExam(random=Math.random) {
  const selectedNumbers=shuffleWorkbook(workbookNumbers,random).slice(0,4);
  const selectedPronouns=shuffleWorkbook(workbookPronouns,random).slice(0,3);
  const sounds=shuffleWorkbook([
    {id:'ch',question:'کدام واژه صدای نرم ch دارد؟',answer:'ich',choices:['ich','Bach','Dach','Buch'],audio:'ich'},
    {id:'v',question:'در کدام کلمه V مانند «ف» تلفظ می‌شود؟',answer:'Vater',choices:['Vater','Verb','Vase','Video'],audio:'Vater'},
    {id:'sp',question:'کدام واژه در آغاز «شپ» دارد؟',answer:'Sport',choices:['Sport','Wespe','Wasser','Zeit'],audio:'Sport'},
    {id:'ei',question:'کدام کلمه ei با صدای «آی» دارد؟',answer:'mein',choices:['mein','Liebe','sieben','ich'],audio:'mein'},
    {id:'z',question:'کدام واژه با صدای «تس» آغاز می‌شود؟',answer:'Zeit',choices:['Zeit','Sonne','Vater','Haus'],audio:'Zeit'},
  ],random).slice(0,3);
  const sentences=shuffleWorkbook(workbookFillSentences,random).slice(0,2);
  const questions=[
    ...selectedNumbers.map(n=>({id:'number:'+n.number,type:'type',kind:'number',
      question:'عدد '+n.number+' را به آلمانی بنویس.',answer:n.word,audio:n.word,label:String(n.number)})),
    ...selectedPronouns.map(p=>({id:'verb:'+p.person,type:'type',kind:'grammar',
      question:'فعل kommen را برای «'+p.person+'» صرف کن.',answer:p.kommen,
      audio:p.person.replace(' / ',' ')+' '+p.kommen,label:'kommen / '+p.person})),
    ...sounds.map(item=>({id:'sound:'+item.id,type:'choice',kind:'pronunciation',
      question:item.question,answer:item.answer,choices:shuffleWorkbook(item.choices,random),audio:item.audio,label:item.question})),
    ...sentences.map(item=>({id:'sentence:'+item.id,type:'arrange',kind:'sentence',
      question:item.fa,answer:item.sentence,audio:item.sentence,label:item.sentence}))
  ];
  return shuffleWorkbook(questions,random);
}
