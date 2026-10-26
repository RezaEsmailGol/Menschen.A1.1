import {germanNumber} from './learningData.js';
import {resolveNumberSection,adaptiveNumberSelection,numbersInSection,shuffleNumberItems} from './numberSections.js';

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
 const near=shuffled(all.filter(n=>Math.abs(n-number)<=5),random).slice(0,2);
 const remaining=shuffled(all.filter(n=>!near.includes(n)),random);
 return shuffled([number,...near,...remaining].slice(0,4),random);
}
export function optionLabel(number,mode){
 return mode==='hear'?String(number):germanNumber(number);
}
