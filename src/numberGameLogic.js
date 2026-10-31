import {germanNumber} from './learningData.js';
import {resolveNumberSection,adaptiveNumberSelection,numbersInSection,shuffleNumberItems,correctNumberSpelling} from './numberSections.js';

// Legacy callers passing 12, 20 or 100 continue working.
export const shuffled=shuffleNumberItems;

export function createNumberRound(range='0-12',memory={},random=Math.random){
 const {min,max}=resolveNumberSection(range);
 const numbers=adaptiveNumberSelection(range,memory,10,random);
 return numbers.map(number=>({
  number,options:makeNumberOptions(number,range,random),
  rangeId:typeof range==='string'?range:null
 }));
}
export function makeNumberOptions(number,range='0-12',random=Math.random){
 const {min,max}=resolveNumberSection(range);
 if(!Number.isInteger(number)||number<min||number>max||max-min<3)
   throw new Error('Invalid range');
 const all=numbersInSection(range).filter(n=>n!==number);
 const confusable={
   2:[12,20,22],12:[2,20,22],20:[2,12,22],22:[2,12,20,32],
   16:[17,60,70],17:[16,70,60],30:[13,20,40],
   60:[16,70,66],70:[17,60,72],100:[90,99,10]
 };
 const priority=(confusable[number]||[]).filter(n=>all.includes(n));
 const nearby=shuffled(all.filter(n=>Math.abs(n-number)<=5&&!priority.includes(n)),random);
 const remaining=shuffled(all.filter(n=>!priority.includes(n)&&!nearby.includes(n)),random);
 return shuffled([number,...priority,...nearby,...remaining].slice(0,4),random);
}
export function optionLabel(number,mode){
 return mode==='hear'||mode==='recognize'?String(number):germanNumber(number);
}

export const NUMBER_GAME_MODES=Object.freeze(['read','hear','recognize','type','mixed']);

export function createNumberGameRound({rangeId='0-100',mode='mixed',memory={},random=Math.random}={}){
 if(!NUMBER_GAME_MODES.includes(mode))throw new Error('Unsupported number mode');
 const numbers=createNumberRound(rangeId,memory,random);
 const sequence=mode==='mixed'
   ? shuffled(Array.from({length:numbers.length},(_,i)=>['read','hear','recognize','type'][i%4]),random)
   : Array(numbers.length).fill(mode);
 return numbers.map((question,i)=>({...question,questionMode:sequence[i],retry:false}));
}

export function correctNumberGameAnswer(value,question){
 if(!question)return false;
 return question.questionMode==='type'
   ?correctNumberSpelling(value,question.number)
   :Number.isInteger(value) && value===question.number;
}
