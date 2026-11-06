// Pure, testable picture-quiz engine for lessons 2, 4 and 5.
const jobs=[
 ['der Lehrer','معلم مرد','Lehrer','Lehrerin','er'],
 ['die Lehrerin','معلم زن','Lehrer','Lehrerin','sie'],
 ['der Arzt','پزشک مرد','Arzt','Ärztin','er'],
 ['die Ärztin','پزشک زن','Arzt','Ärztin','sie'],
 ['der Journalist','روزنامه‌نگار مرد','Journalist','Journalistin','er'],
 ['die Journalistin','روزنامه‌نگار زن','Journalist','Journalistin','sie'],
 ['der Softwareentwickler','توسعه‌دهنده نرم‌افزار مرد','Softwareentwickler','Softwareentwicklerin','er'],
 ['die Softwareentwicklerin','توسعه‌دهنده نرم‌افزار زن','Softwareentwickler','Softwareentwicklerin','sie'],
 ['der Ingenieur','مهندس مرد','Ingenieur','Ingenieurin','er'],
 ['die Ingenieurin','مهندس زن','Ingenieur','Ingenieurin','sie'],
 ['der Verkäufer','فروشنده مرد','Verkäufer','Verkäuferin','er'],
 ['die Verkäuferin','فروشنده زن','Verkäufer','Verkäuferin','sie']
];
const furniture=[
 ['der Tisch','میز'],['der Stuhl','صندلی'],['die Lampe','چراغ'],
 ['das Sofa','مبل'],['das Bett','تخت'],['der Schrank','کمد'],
 ['das Regal','قفسه'],['der Teppich','فرش'],['die Couch','کاناپه'],
 ['der Sessel','مبل تک‌نفره'],['der Spiegel','آینه'],['das Bild','تابلو']
];
const objects=[
 ['der Schlüssel','کلید'],['der Kugelschreiber','خودکار'],
 ['der Bleistift','مداد'],['der Fotoapparat','دوربین'],
 ['das Buch','کتاب'],['die Flasche','بطری'],['die Brille','عینک'],
 ['die Tasche','کیف'],['die Kette','گردنبند'],['das Feuerzeug','فندک'],
 ['die Uhr','ساعت'],['der Tisch','میز'],['die Lampe','چراغ'],['das Sofa','مبل']
];
export const pictureCollections=Object.freeze({
 2:jobs.map(([de,fa,male,female,person])=>({word:de,fa,male,female,person})),
 4:furniture.map(([de,fa])=>({word:de,fa})),
 5:objects.map(([de,fa])=>({word:de,fa}))
});
export const pictureModes=Object.freeze({
 2:[{id:'jobs',label:'معرفی شغل 👩‍⚕️'}],
 4:[{id:'articles',label:'der / die / das'},{id:'pronouns',label:'er / sie / es'}],
 5:[{id:'indefinite',label:'ein / eine'},{id:'negative',label:'kein / keine'}]
});
export function articleOf(word){
 const article=String(word).match(/^(der|die|das)\s/);
 if(!article)throw new Error('Picture noun must have an article');
 return article[1];
}
export function nounOf(word){return String(word).replace(/^(der|die|das)\s/,'');}
export function indefiniteArticle(word){return articleOf(word)==='die'?'eine':'ein';}
export function negativeArticle(word){return articleOf(word)==='die'?'keine':'kein';}
export function pronounFor(word){return articleOf(word)==='der'?'er':articleOf(word)==='die'?'sie':'es';}
function shuffle(items,random){
 const result=[...items];
 for(let i=result.length-1;i>0;i--){
   const r=Math.max(0,Math.min(i,Math.floor(random()*(i+1))));
   [result[i],result[r]]=[result[r],result[i]];
 }
 return result;
}
export function makePictureQuestion(item,lesson,mode,random=Math.random){
 const name=nounOf(item.word),article=articleOf(item.word);
 const id='picture-book:'+lesson+':'+mode+':'+encodeURIComponent(item.word);
 let answer,options,prompt,why,audio;
 if(mode==='jobs'){
   if(lesson!==2)throw new Error('Job questions belong to lesson 2');
   const genderWord=item.person==='er'?item.male:item.female;
   const otherWord=item.person==='er'?item.female:item.male;
   const capitalPerson=item.person==='er'?'Er':'Sie';
   const otherPerson=item.person==='er'?'Sie':'Er';
   answer=capitalPerson+' ist '+genderWord+'.';
   const other=jobs.find(j=>j[2]!==item.male);
   const unrelated=otherPerson+' ist '+(item.person==='er'?other[3]:other[2])+'.';
   options=[answer,otherPerson+' ist '+genderWord+'.',capitalPerson+' ist '+otherWord+'.',unrelated];
   prompt='این شغل را با جنسیت درست معرفی کن.';
   why='در معرفی شغل، برای مرد Er ist ... و برای زن Sie ist ... به‌کار می‌بریم؛ پسوند -in معمولاً مؤنث می‌سازد.';
   audio=answer;
 } else if(mode==='articles'){
   if(lesson!==4)throw new Error('Article mode belongs to lesson 4');
   answer=article;
   options=['der','die','das','den'];
   prompt='حرف تعریف معین این وسیله کدام است؟';
   why='اسم را همیشه با حرف تعریفش یاد بگیر: '+item.word+'.';
   audio=item.word;
 } else if(mode==='pronouns'){
   if(lesson!==4)throw new Error('Pronoun mode belongs to lesson 4');
   answer=pronounFor(item.word);
   options=['er','sie','es','wir'];
   prompt='برای اشاره دوباره به این وسیله کدام ضمیر مناسب است؟';
   why='در حالت مفرد: der → er، die → sie، das → es.';
   audio=article==='der'?'Er ist schön.':article==='die'?'Sie ist schön.':'Es ist schön.';
 } else if(mode==='indefinite'){
   if(lesson!==5)throw new Error('Indefinite mode belongs to lesson 5');
   const yes=indefiniteArticle(item.word),other=yes==='ein'?'eine':'ein';
   answer='Das ist '+yes+' '+name+'.';
   options=[answer,'Das ist '+other+' '+name+'.','Das ist einen '+name+'.','Das ist '+negativeArticle(item.word)+' '+name+'.'];
   prompt='این یک شیء است؛ جمله مثبت با ein یا eine را انتخاب کن.';
   why='der/das → ein و die → eine (حالت Nominativ).';
   audio=answer;
 } else if(mode==='negative'){
   if(lesson!==5)throw new Error('Negative mode belongs to lesson 5');
   const no=negativeArticle(item.word),other=no==='kein'?'keine':'kein';
   answer='Das ist '+no+' '+name+'.';
   options=[answer,'Das ist '+other+' '+name+'.','Das ist nicht '+name+'.','Das ist '+indefiniteArticle(item.word)+' '+name+'.'];
   prompt='تمرین گرامر: جمله فرضی «این '+item.fa+' نیست» را با kein یا keine بساز.';
   why='der/das → kein و die → keine. برای نفی نام یک شیء از kein/keine استفاده کن.';
   audio=answer;
 } else throw new Error('Unsupported image game mode');
 if(new Set(options).size!==4 || !options.includes(answer))throw new Error('Ambiguous picture question');
 return {id,lesson,mode,word:item.word,fa:item.fa,prompt,answer,options:shuffle(options,random),why,audio};
}
export function createPictureRound({lesson=4,mode=null,count=10,random=Math.random}={}){
 const items=pictureCollections[lesson],modes=pictureModes[lesson];
 if(!items||!modes)throw new Error('Unsupported picture lesson');
 const chosenMode=mode||modes[0].id;
 if(!modes.some(m=>m.id===chosenMode))throw new Error('Unsupported picture mode');
 if(!Number.isInteger(count)||count<1)throw new Error('Invalid question count');
 return shuffle(items,random).slice(0,Math.min(count,items.length))
   .map(item=>makePictureQuestion(item,lesson,chosenMode,random));
}
