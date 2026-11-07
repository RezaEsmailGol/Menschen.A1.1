import {lessons} from './courseData.js';
import {normalizeBookAnswer} from './bookLessonData.js';

// Original, learner-facing captions. These are not claimed to be transcripts of an MP3.
const GREETINGS=[
 {text:'Hallo!',meaning:'سلام!',scene:'greeting'},
 {text:'Guten Morgen',meaning:'صبح بخیر',scene:'sunrise'},
 {text:'Tschüs',meaning:'خداحافظ!',scene:'goodbye'},
 {text:'Wie heißt du?',meaning:'اسم تو چیست؟',scene:'question'},
 {text:'Guten Tag',meaning:'روز بخیر',scene:'sunrise'},
 {text:'Auf Wiedersehen',meaning:'خداحافظ رسمی',scene:'goodbye'}
];
const SUBJECT_SCENES={
 2:['jobs','jobs','greeting','question','jobs','question'],
 3:['family','family','greeting','family','question','family'],
 4:['furniture','furniture','house','furniture','house','furniture'],
 5:['objects','objects','objects','house','objects','objects'],
 6:['sunrise','clock','sunrise','clock','question','clock'],
 7:['shopping','shopping','objects','shopping','question','shopping'],
 8:['house','house','furniture','house','furniture','house'],
 9:['travel','travel','question','travel','sunrise','travel'],
 10:['doctor','doctor','question','doctor','objects','doctor'],
 11:['question','greeting','objects','question','greeting','question'],
 12:['jobs','jobs','question','jobs','question','jobs']
};

export function lessonAudioCards(lessonId){
 const lesson=lessons.find(x=>x.id===Number(lessonId));
 if(!lesson)return [];
 const samples=lesson.id===1?GREETINGS:[
   ...lesson.words.slice(0,4).map(([text,meaning])=>({text,meaning})),
   ...lesson.sentences.slice(0,2).map(([text,meaning])=>({text,meaning}))
 ];
 const scenes=SUBJECT_SCENES[lesson.id]||[];
 return samples.map((x,index)=>({
  id:'a'+lesson.id+'-'+(index+1),
  text:x.text,
  meaning:x.meaning,
  scene:x.scene||scenes[index]||'conversation',
  lesson:lesson.id
 }));
}
export function soundMeaningOptions(cards,index){
 if(!cards.length||index<0||index>=cards.length)return [];
 const current=cards[index];
 const others=cards.filter((item,i)=>i!==index&&item.meaning!==current.meaning);
 const unique=[];
 for(const entry of others)if(!unique.some(x=>x===entry.meaning))unique.push(entry.meaning);
 const choices=[current.meaning,...unique.slice(0,3)];
 // Deterministic shift; keep correct choice from always being first.
 const shift=index%choices.length;
 return [...choices.slice(shift),...choices.slice(0,shift)];
}
export function verifyAudioDictation(expected,answer){
 if(!String(answer??'').trim())return false;
 return normalizeBookAnswer(expected)===normalizeBookAnswer(answer);
}
export const AUDIO_LEARNING_MODES=Object.freeze([
 {id:'dictation',title:'دیکته شنیداری',description:'بشنو و بنویس'},
 {id:'repeat',title:'تکرار جمله',description:'با میکروفون بگو'},
 {id:'meaning',title:'تشخیص معنی',description:'معنی درست را انتخاب کن'}
]);
export function audioLearningItemKey(lessonId,cardId,mode){
 return String(lessonId)+':'+String(cardId)+':'+String(mode);
}
export function parseAudioLearningStats(raw){
 let parsed={};
 try{parsed=typeof raw==='string'?JSON.parse(raw):raw||{};}catch{return {completed:{},speech:{},plays:{}};}
 if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return {completed:{},speech:{},plays:{}};
 const clean=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 return {completed:clean(parsed.completed),speech:clean(parsed.speech),plays:clean(parsed.plays)};
}
export function audioLearningSummary(stats,lessonId){
 const prefix=String(lessonId)+':';
 const complete=Object.entries(stats?.completed||{}).filter(([key,value])=>key.startsWith(prefix)&&value===true).length;
 const spoken=Object.values(stats?.speech||{}).filter(x=>x?.lesson===Number(lessonId)&&Number.isFinite(x?.score));
 const best=spoken.length?Math.max(...spoken.map(x=>x.score)):null;
 const plays=Object.entries(stats?.plays||{}).filter(([key])=>key.startsWith(prefix)).reduce((n,[,value])=>n+(Number(value)||0),0);
 return {completed:complete,attempts:spoken.length,bestScore:best,plays};
}
