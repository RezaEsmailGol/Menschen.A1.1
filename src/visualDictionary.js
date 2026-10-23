import {germanNumber, pronunciationRules} from './learningData.js';
import {lessons, verbForms} from './courseData.js';
import {classNotes} from './classNotesData.js';

// Semantic source of truth for the first-year German learning companion.
// Images are drawn by MnemonicArt. Entries describe concepts, not asset URLs.
export const LETTER_PAIRS=[
 ['A','Apfel','سیب','apple'],['B','Buch','کتاب','book'],['C','Computer','کامپیوتر','computer'],
 ['D','Dach','سقف','house'],['E','Elefant','فیل','elephant'],['F','Fisch','ماهی','fish'],
 ['G','Garten','باغ','tree'],['H','Haus','خانه','house'],['I','Insel','جزیره','island'],
 ['J','Jahr','سال','calendar'],['K','Katze','گربه','cat'],['L','Lampe','چراغ','lamp'],
 ['M','Musik','موسیقی','music'],['N','Nase','بینی','face'],['O','Obst','میوه','apple'],
 ['P','Post','پست','mail'],['Q','Quelle','چشمه','water'],['R','Rose','گل رز','flower'],
 ['S','Sonne','خورشید','sun'],['T','Tisch','میز','table'],['U','Uhr','ساعت','clock'],
 ['V','Vater','پدر','person'],['W','Wasser','آب','water'],['X','Xylophon','زیلوفون','music'],
 ['Y','Yoga','یوگا','person'],['Z','Zug','قطار','train'],['Ä','Äpfel','سیب‌ها','apple'],
 ['Ö','Österreich','اتریش','mountain'],['Ü','üben','تمرین کردن','pencil'],
 ['ß','Straße','خیابان','road']
];
export const ALPHABET_CARDS=LETTER_PAIRS.map(([letter,example,fa,scene])=>({
 id:'alphabet:'+letter,letter,example,fa,scene,kind:'alphabet',
 cue:`حرف ${letter} را با تصویر «${fa}» و نمونه ${example} به یاد بسپار.`,
}));

const NUMBER_SCENES=[
 ['empty','دایره خالی؛ چیزی وجود ندارد'],['candle','یک شمع روشن'],
 ['shoes','یک جفت کفش'],['balloon','سه بادکنک رنگی'],
 ['window','چهار پنجره خانه'],['hand','پنج انگشت دست باز'],
 ['eggs','شش تخم‌مرغ در جعبه'],['star','هفت ستاره'],
 ['octopus','هشت بازو مثل اختاپوس'],['flower','نه گل رنگی'],
 ['hands','ده انگشت دو دست'],['football','تیم یازده‌نفره فوتبال'],
 ['clock','ساعت با دوازده عدد'],['calendar','سیزده روی تقویم'],
 ['calendar','چهارده روی تقویم'],['calendar','پانزده روی تقویم'],
 ['eggs','شانزده؛ sechzehn، بدون s در sechs'],['star','هفده؛ siebzehn، بدون en در sieben'],
 ['calendar','هجده روی تقویم'],['calendar','نوزده روی تقویم'],
 ['abacus','دو دسته ده‌تایی؛ بیست']
];
export const NUMBER_CARDS=Array.from({length:101},(_,number)=>{
 const special=NUMBER_SCENES[number];
 return {id:'number:'+number,number,word:germanNumber(number),kind:'number',
 scene:special?.[0]||'abacus',
 cue:special?.[1]||`${Math.floor(number/10)} دسته ده‌تایی و ${number%10} یکان؛ در آلمانی یکان قبل از دهگان می‌آید.`};
});

export function normalizeGerman(text=''){
 return String(text).normalize('NFC').toLocaleLowerCase('de')
  .replace(/[.!?؛،:()«»]/g,' ').replace(/\s+/g,' ').trim()
  .replace(/^(der|die|das|den|dem|ein|eine|einen|einem|meine|mein)\s+/,'');
}

// Each semantic cluster has its own scene or distinctive visual prop.
// Explicit entries are preferred over vague substring guessing.
const sceneClusters={
 apple:'apfel äpfel obst früchte',
 house:'haus dach fenster wohnung zimmer wohnort adresse straße straße hausnummer postleitzahl miete',
 kitchen:'küche essen brot milch kasse obst geschäft einkaufen',
 city:'stadt ort wien',bathroom:'bad dusche',camera:'foto',eye:'sehen',basket:'sammeln',insect:'wespe',compass:'westen',
 mind:'fähigkeit wissen',
 clock:'uhr zeit termin stunde wochenende montag dienstag mittwoch donnerstag freitag samstag sonntag',
 sun:'sonne tag heute morgen gut',
 moon:'nacht abend',
 book:'buch lesen schule lernen kurs ausbildung literatur',
 computer:'computer laptop webanwendung webanwendungen python entwickler softwareentwickler programmieren',
 briefcase:'arbeit arbeiten arbeite arbeitest arbeitet beruf berufserfahrung stelle firma büro projekt kollege kollegin bewerbung lebenslauf erlaubnis arbeitserlaubnis',
 person:'ich du er sie es wir ihr vater mutter frau herr freund freundin bruder schwester kind familie mama papa könig',
 name:'name vorname nachname familienname heißen heiße heißt',
 speech:'sprechen sprichst spricht sprach gespräch antwort frage fragen sagen ergänzen vergleichen kennen zuhören',
 phone:'telefon telefonnummer anruf nachricht email e-mail e-mail-adresse',
 train:'zug bahnhof bus u-bahn haltestelle ticket fahren fährt fahrst reise',
 walk:'gehen geht weg links rechts zuerst weiter',
 globe:'land herkunft kommen kommst österreich deutschland iran türkei schweiz usa spanien mexiko nation deutsch',
 music:'musik lied singen sport spiel spielen hobby freizeit film',
 water:'wasser fluss bach see quelle trinken',
 tree:'baum garten natur blume rose',
 heart:'gesund krank arzt ärztin schmerz kopf medikament apotheke hilfe',
 chair:'stuhl tisch bett sitzplan',
 money:'euro preis geld kaufen kostet kosten gehaltsvorstellung',
 pencil:'stift schreiben schicke schicken zeichnen notieren ankreuzen zuordnen üben machen',
 smile:'super prima toll schön sehr gut gut',
 sad:'schlecht schlimm nicht so gut',
 question:'wie wer woher was welche warum fragen',
 hands:'haben habe hast hat möchten möchte brauchen brauche können kann müssen muss',
 arrow:'sein bin bist ist sind seid stammen stammst zu aus mit auch und',
 calendar:'geburtsdatum datum jahr zwölf',
 mail:'post datei information bewerbung antwort',
 lamp:'lampe licht',
 coat:'kleidung jacke',
 island:'insel',
 cat:'katze',
 fish:'fisch',
 elephant:'elefant',
 flower:'rose blumen',
 face:'nase auge kopf'
};
const sceneIndex=new Map();
for(const [scene,words] of Object.entries(sceneClusters))
 for(const word of words.split(' ')) if(!sceneIndex.has(word))sceneIndex.set(word,scene);

const verbVisuals={
 arbeiten:'computer',heißen:'name',sein:'person',haben:'hands',wohnen:'house',
 kommen:'walk',stammen:'globe',machen:'pencil',sprechen:'speech',lernen:'book',
 lesen:'book',schreiben:'pencil',fahren:'train',gehen:'walk',hören:'music',
 spielen:'music',brauchen:'hands',kaufen:'money',suchen:'question',
 möchten:'heart',können:'star',müssen:'clock',kennen:'person',
 sagen:'speech',notieren:'pencil',ankreuzen:'pencil',zuordnen:'pencil',
 vergleichen:'book',zeichnen:'pencil',ergänzen:'pencil',schicken:'mail'
};
const farsiScenes=[
 [/خانه|آپارتمان|اتاق|سقف|پنجره|آدرس|خیابان|پلاک|اجاره/, 'house'],
 [/کار|شغل|شرکت|دفتر|همکار|استخدام|اجازه کار|رزومه|پروژه|تجربه/, 'briefcase'],
 [/گفت|صحبت|زبان|سؤال|پاسخ|شنید|حرف/, 'speech'],
 [/نام|اسم|خانوادگی/, 'name'],
 [/کشور|ایران|آلمان|اتریش|سوئیس|آمریکا|ترکیه|مبدأ|اصل/, 'globe'],
 [/کتاب|درس|آموزش|یاد گرفتن|مدرسه|کلاس|مطالعه/, 'book'],
 [/زمان|ساعت|قرار|روز|هفته|ماه|سال/, 'clock'],
 [/مادر|پدر|خواهر|برادر|فرزند|دوست|خانواده|آقا|خانم|زن|مرد/, 'person'],
 [/شماره تلفن|تماس|ایمیل|پیام/, 'phone'],
 [/خرید|پول|قیمت|یورو|حقوق/, 'money'],
 [/خورد|میوه|نان|شیر|آشپزخانه|فروشگاه/, 'kitchen'],
 [/قطار|اتوبوس|مسیر|ایستگاه|بلیط|مترو/, 'train'],
 [/رفتن|آمدن|پیاده|قدم|مسافرت/, 'walk'],
 [/خوب|عالی|خوش|شادی/, 'smile'],
 [/بد|ناراحت|بیمار|درد/, 'sad'],
 [/نوشت|کشیدن|نقاش|یادداشت|قلم/, 'pencil'],
 [/موسیقی|آهنگ|بازی|ورزش|فیلم/, 'music'],
 [/داشتن|نیاز|خواست|توانستن/, 'hands']
];

const allEntries=new Map();
function register(german,fa='',context='course'){
 const key=normalizeGerman(german);
 if(!key)return;
 const existed=allEntries.get(key);
 if(existed && (!fa||existed.fa))return;
 const scene=sceneIndex.get(key)||Object.entries(verbVisuals).find(([stem])=>key===stem||key.startsWith(stem.slice(0,Math.max(3,stem.length-2))))?.[1]
  ||farsiScenes.find(([re])=>re.test(fa))?.[1]||'context';
 allEntries.set(key,{key,german,fa,scene,context,cue:`تصویر «${fa||german}» را به عبارت آلمانی وصل کن.`});
}
for(const lesson of lessons) {
 for(const [de,fa] of lesson.words)register(de,fa,'lesson:'+lesson.id);
 for(const [de,fa] of lesson.sentences)register(de,fa,'sentence');
}
for(const item of classNotes)register(item.set==='verbs'?item.verb:item.de,item.fa,'class:'+item.set);
for(const [infinitive] of Object.entries(verbForms))register(infinitive,'فعل آلمانی','verb');
for(const item of pronunciationRules){register(item.word,item.meaning,'sound');register(item.contrast,'نمونه تلفظ','sound');}
for(const item of ALPHABET_CARDS)register(item.example,item.fa,'alphabet');

const supplemental=[
 ['die Staatsangehörigkeit','تابعیت','globe'],['das Geburtsdatum','تاریخ تولد','calendar'],
 ['die Gehaltsvorstellung','حقوق مورد انتظار','money'],['der Eintrittstermin','تاریخ شروع','calendar'],
 ['die Berufserfahrung','سابقه کار','briefcase'],['die Bewerbung','درخواست کار','briefcase'],
 ['die Arbeitserlaubnis','مجوز کار','briefcase'],['die Ausbildung','تحصیلات','book'],
 ['Wie geht es dir?','حالت چطور است؟','smile'],['Wie heißen Sie?','نام شما چیست؟','name'],
 ['Ich komme aus dem Iran.','من اهل ایران هستم.','globe'],['Ich arbeite mit Python.','من با پایتون کار می‌کنم.','computer']
];
for(const [de,fa,scene] of supplemental){register(de,fa,'supplement');allEntries.set(normalizeGerman(de),{...allEntries.get(normalizeGerman(de)),scene});}


// Override ambiguous function words and spelling/phonetics examples with a
// recognisable teaching metaphor rather than pretending a random letter is art.
const sceneOverrides={
 stadt:'city',nummer:'abacus',bad:'bathroom',fehler:'computer',fähigkeit:'mind',
 erst:'clock',kurz:'clock',noch:'clock',mein:'hands',mai:'sun',liebe:'heart',
 wichtig:'star',tschüss:'walk',physik:'book',verb:'speech',job:'briefcase',
 sechs:'eggs',fünf:'hand',sieben:'star',dreizehn:'calendar',vierzehn:'calendar',
 fünfzehn:'calendar',sechzehn:'eggs',siebzehn:'star',achtzehn:'calendar',
 neunzehn:'calendar',zwanzig:'abacus',yoga:'person',xylophon:'music',
 wachsen:'tree',wespe:'insect',westen:'compass',foto:'camera',sehen:'eye',
 sammeln:'basket',häuser:'house',zwei:'shoes',sammeln:'basket',
 'wer sind sie':'person','ich bin reza':'person',
 'woher kommen sie':'globe','woher stammst du':'globe',
 'wie geht es ihnen':'smile','wie geht’s ihnen':'smile',
 'und ihnen':'speech','und dir':'speech','und du':'speech'
};
const sceneHints={
 name:'کارت شناسایی و نام را به یاد بیاور.',
 computer:'برنامه‌نویسی روی نمایشگر با نماد کد.',
 briefcase:'کیف اداری و کار؛ فضای شغلی.',
 person:'یک آدمک؛ نقش یا هویت شخص در جمله.',
 house:'خانه و محل زندگی با سقف و در.',
 book:'کتاب باز و مطالعه.',
 globe:'کره زمین، کشور و مبدأ حرکت.',
 money:'اسکناس و نشانه قیمت.',
 speech:'حباب گفت‌وگو و کلمات گفته‌شده.',
 clock:'ساعت و زمان.',
 phone:'تماس و پیام.',
 heart:'قلب و احساس یا سلامتی.',
 walk:'قدم زدن و حرکت شخص.',
 pencil:'نوشتن با قلم یا انجام تکلیف.',
 calendar:'روزها و قرار روی تقویم.',
 sun:'روشنایی روز و خورشید.',
 music:'نت موسیقی و صدا.',
 smile:'چهره خندان و حال خوب.',
 sad:'چهره ناراحت یا وضعیت بد.',
 question:'علامت سؤال و پرسیدن.',
 tree:'رشد و طبیعت.',
 abacus:'دسته‌های ده‌تایی و مهره‌های شمارشی.',
 city:'آسمان‌خراش‌ها و شهر.',
 bathroom:'دوش و قطره‌های آب.',
 mind:'لامپ ایده و توانایی ذهنی.',
 eye:'چشم در حال دیدن.',
 camera:'عکس و دوربین.',
 compass:'جهت‌های جغرافیایی.',
 insect:'زنبور با بال و بدن راه‌راه.',
 basket:'سبد و جمع‌آوری وسایل.'
};
for(const [key,entry] of allEntries){
 let scene=sceneOverrides[key]||entry.scene;
 if(scene==='context'){
   const words=key.split(' ').filter(w=>!['ich','du','er','sie','es','wir','ihr','mein','meine','ist','sind','bin','das','die','der','und','aus','dem','mit','zu','den','einen','eine'].includes(w));
   scene=words.map(w=>sceneOverrides[w]||sceneIndex.get(w)||verbVisuals[w]||allEntries.get(w)?.scene)
     .find(v=>v&&v!=='context')||farsiScenes.find(([re])=>re.test(entry.fa))?.[1]||'speech';
 }
 allEntries.set(key,{...entry,scene,cue:`${sceneHints[scene]||'نماد تصویری موضوع را با کلمه مرتبط کن.'} معنی: ${entry.fa||entry.german}`});
}

export const WORD_DICTIONARY=Object.freeze(Object.fromEntries(allEntries));
export const DICTIONARY_STATS={alphabet:ALPHABET_CARDS.length,numbers:NUMBER_CARDS.length,words:allEntries.size,verbs:Object.keys(verbVisuals).length};

const pronouns=['ich','du','er/sie/es','wir','ihr','sie/Sie'];
function parseConjugation(prompt=''){
 const text=String(prompt);
 const quoted=text.match(/[«"]([^»"]+)[»"]/);
 const found=Object.keys(verbVisuals).find(v=>new RegExp('(?:فعل\\s+)?'+v+'(?:\\s|$)','i').test(text));
 const person=quoted?.[1]||'';
 return found&&pronouns.includes(person)?{verb:found,person}:null;
}
export function getVisualEntry(word='',options={}){
 const numeric=options.number!==null && options.number!==undefined && Number.isInteger(Number(options.number))
  ? Number(options.number) : (String(word).trim().match(/^\d{1,3}$/)?Number(word):null);
 if(numeric!==null && numeric>=0 && numeric<=100)return NUMBER_CARDS[numeric];
 if(options.letter) {
   const alphabet=ALPHABET_CARDS.find(x=>x.letter.toLocaleLowerCase('de')===String(options.letter).toLocaleLowerCase('de'));
   if(alphabet)return alphabet;
 }
 const conj=options.verb && options.pronoun?{verb:options.verb,person:options.pronoun}:parseConjugation(options.prompt);
 if(conj){
  const root=conj.verb;
  return {kind:'conjugation',key:'verb:'+root+':'+conj.person,scene:verbVisuals[root]||'speech',word,verb:root,
    pronoun:conj.person,fa:'صرف فعل',cue:`تصویر ${root} + ضمیر ${conj.person} را به شکل صحیح فعل وصل کن.`};
 }
 const key=normalizeGerman(word);
 const spellingNumber=NUMBER_CARDS.find(card=>card.word===key);
 if(spellingNumber)return spellingNumber;
 const direct=WORD_DICTIONARY[key];
 if(direct) return {...direct,kind:'word'};
 // Phrases: use the most specific known action or concrete noun;
 // never use a random first-letter icon as an allegedly meaningful picture.
 const pieces=key.split(' ');
 const meaningful=pieces.map(p=>sceneIndex.get(p)||verbVisuals[p]||WORD_DICTIONARY[p]?.scene)
   .filter(scene=>scene && scene!=='context');
 const scene=meaningful[0]||farsiScenes.find(([r])=>r.test(String(options.meaning||options.prompt||'')))?.[1]||'context';
 return {kind:'phrase',key,word,scene,
   fa:options.meaning||options.prompt||'',
   cue:scene==='context'?'این عبارت انتزاعی است؛ برای یادگیری آن از نمونه جمله استفاده کن.':'این تصویر، موضوع اصلی عبارت را یادآوری می‌کند.'};
}
export function visualDictionaryCoverage(words=[]) {
 const detailed=words.map(w=>getVisualEntry(w));
 const contextual=detailed.filter(e=>e.scene==='context').length;
 return {total:words.length,meaningful:words.length-contextual,contextual};
}
