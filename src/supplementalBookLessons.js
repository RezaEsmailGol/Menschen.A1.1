import {lessons,verbForms} from './courseData.js';

// Independent A1 practice for the app's supplemental lessons 6–12.
// These lessons are topical companions; they are NOT represented as official book transcriptions.
const topicChecks={
  6:[
    ['برای روزهای هفته کدام حرف اضافه درست است؟',['am','um','im','aus'],'am','am Montag'],
    ['برای گفتن ساعت قرار کدام حرف اضافه درست است؟',['um','am','aus','mit'],'um','um neun Uhr']
  ],
  7:[
    ['برای درخواست مؤدبانه در فروشگاه کدام فعل مناسب‌تر است؟',['möchte','muss','wohne','bin'],'möchte','Ich möchte ein Brot.'],
    ['در جمله «Wir brauchen Milch» فاعل کدام است؟',['wir','ich','du','er'],'wir','ما شیر لازم داریم.']
  ],
  8:[
    ['حرف تعریف درست Küche چیست؟',['die','der','das','den'],'die','die Küche'],
    ['حرف تعریف درست Zimmer چیست؟',['das','der','die','den'],'das','das Zimmer']
  ],
  9:[
    ['کدام عبارت به معنی «با اتوبوس» است؟',['mit dem Bus','im Busse','mit das Bus','zum Bus'],'mit dem Bus','برای وسیله نقلیه mit + Dativ.'],
    ['کدام فعل برای رفتن با قطار رایج است؟',['fahren','schreiben','lesen','wohnen'],'fahren','Ich fahre mit dem Zug.']
  ],
  10:[
    ['در جمله «Ich muss zum Arzt gehen» فعل اصلی کجا می‌آید؟',['آخر جمله','اول جمله','قبل از muss','حذف می‌شود'],'آخر جمله','فعل مصدر پس از müssen در پایان جمله می‌آید.'],
    ['برای درخواست وقت پزشک کدام سؤال درست است؟',['Kann ich einen Termin haben?','Ich kann Termin?','Kann eine Termin?','Wo Zeit haben?'],'Kann ich einen Termin haben?','Kann در اول سؤال بله/خیر قرار می‌گیرد.']
  ],
  11:[
    ['کدام سؤال مؤدبانه برای درخواست کمک صحیح است؟',['Können Sie mir helfen?','Sie können mir helfen?','Kann Sie helfen?','Können mir Sie helfen?'],'Können Sie mir helfen?','در پرسش رسمی، Können در ابتدا می‌آید.'],
    ['در «Ich schicke die Datei» فعل صرف‌شده چیست؟',['schicke','schicken','schickst','schickt'],'schicke','Ich schicke = من می‌فرستم.']
  ],
  12:[
    ['برای بیان خواسته شغلی کدام عبارت درست است؟',['Ich möchte arbeiten.','Ich möchte arbeite.','Ich möchten arbeiten.','Ich arbeiten möchte.'],'Ich möchte arbeiten.','مصدر پس از möchte به آخر جمله می‌رود.'],
    ['برای گفتن توانایی برنامه‌نویسی کدام فعل مناسب است؟',['kann','muss','wohne','habe'],'kann','Ich kann Webanwendungen entwickeln.']
  ]
};
const persons=['ich','du','er / sie / es','wir','ihr','sie / Sie'];
function choicesFor(correct,alternatives,seed=0){
 const options=[correct,...new Set(alternatives.filter(x=>x!==correct))].slice(0,4);
 const fallback=['bin','bist','ist','sind','habe','hat','haben','kommen','kommt','arbeiten','arbeitet'];
 for(const value of fallback)if(options.length<4&&!options.includes(value))options.push(value);
 // Stable shuffle so exercise choices are reproducible across visits.
 const rotated=options.slice(seed%4).concat(options.slice(0,seed%4));
 return rotated;
}
function makeSections(lesson){
 const words=lesson.words,sentences=lesson.sentences;
 const vocab={
  id:'vocabulary-practice',
  title:'۱. Wörter und Bedeutungen · تمرین واژگان',
  caption:'واژه را در جمله یا موقعیت روزمره تشخیص بده و معنی آن را به خاطر بسپار.',
  cards:words.slice(0,6).map(([de,fa])=>['🧠',de,fa]),
  tasks:words.slice(0,8).map(([de,fa],index)=>({
   id:'l'+lesson.id+'-v'+String(index+1).padStart(2,'0'),
   type:'choice',prompt:'کدام عبارت آلمانی به معنی «'+fa+'» است؟',
   choices:choicesFor(de,words.slice(1).concat(words.slice(0,1)).map(w=>w[0]).filter(s=>s!==de),index),
   answer:de,audio:de,why:de+' = '+fa
  }))
 };
 const grammarRules=topicChecks[lesson.id];
 const grammarTasks=grammarRules.map(([prompt,options,answer,why],index)=>({
  id:'l'+lesson.id+'-g'+String(index+1).padStart(2,'0'),
  type:'choice',prompt,choices:options,answer,why
 }));
 const grammarItems=[];
 for(let index=0;index<6;index++){
  const verb=lesson.verbs[index%lesson.verbs.length];
  const forms=verbForms[verb];
  const pronounIndex=[0,1,2,3,4,5][index];
  const answer=forms[pronounIndex];
  const alternatives=[...forms,...lesson.verbs.flatMap(v=>verbForms[v]||[])];
  grammarItems.push({
    id:'l'+lesson.id+'-g'+String(index+3).padStart(2,'0'),
    type:'choice',
    prompt:'فعل «'+verb+'» را برای «'+persons[pronounIndex]+'» درست صرف کن.',
    choices:choicesFor(answer,alternatives,index),
    answer,why:persons[pronounIndex]+' '+answer
  });
 }
 const grammar={
  id:'grammar-practice',title:'۲. Grammatik · دستور زبان در عمل',
  caption:lesson.grammar+'؛ همراه با صرف فعل‌های همین درس.',
  cards:lesson.verbs.map(verb=>['✍️',verb,'ich '+verbForms[verb][0]]).concat([
   ['📘',lesson.grammar,'قاعده این درس'],
   ['💬',lesson.tip,'نکته کاربردی']
  ]),
  tasks:[...grammarTasks,...grammarItems]
 };
 const writing={
  id:'sentence-practice',title:'۳. Sätze bilden · جمله‌سازی و نوشتن',
  caption:'از نمونه‌های همان درس جمله بساز و متن کوتاه را درست بنویس.',
  cards:sentences.map(([de,fa])=>['💬',de,fa]),
  tasks:sentences.flatMap(([de,fa],index)=>[
   {
    id:'l'+lesson.id+'-s'+String(index*2+1).padStart(2,'0'),
    type:'build',prompt:'با کلمات پراکنده جمله را بساز: '+fa,
    answer:de,audio:de,hint:lesson.tip
   },
   {
    id:'l'+lesson.id+'-s'+String(index*2+2).padStart(2,'0'),
    type:'type',prompt:'ترجمه را به آلمانی بنویس: '+fa,
    answer:de,audio:de,hint:'کلمات و فعل‌های همین درس را به یاد بیاور.'
   }
  ])
 };
 const spoken=[...sentences.map(([de,fa])=>[de,fa,'sentence']),
  ...words.slice(0,4).map(([de,fa])=>[de,fa,'word'])];
 const listening={
  id:'listening-practice',title:'۴. Hören und schreiben · شنیدن و نوشتن',
  caption:'صدای دقیق جمله یا واژه را بشنو، تکرار کن و آنچه شنیدی بنویس.',
  cards:spoken.slice(0,6).map(([de,fa])=>['🔊',de,fa]),
  tasks:spoken.map(([de,fa,type],index)=>({
   id:'l'+lesson.id+'-h'+String(index+1).padStart(2,'0'),
   type:'listen',
   prompt:type==='sentence'?'روی پخش صوت بزن و جمله را دقیق به آلمانی بنویس.':'روی پخش صوت بزن و واژه شنیده‌شده را با حرف تعریف (اگر دارد) بنویس.',
   audio:de,answer:de,why:fa
  }))
 };
 return [vocab,grammar,writing,listening];
}
export const supplementalBookLessons=Object.fromEntries(
 lessons.filter(lesson=>lesson.id>=6&&lesson.id<=12).map(lesson=>[
  lesson.id,{
   title:lesson.german,pages:null,focus:lesson.label,
   supplemental:true,
   goals:[
    lesson.goal,'تمرین فعال واژگان و معانی درس',
    'ساخت جمله و صرف فعل‌های کاربردی',
    'شنیدن، تکرار و نوشتن آلمانی'
   ],
   sections:makeSections(lesson)
  }
 ])
);
