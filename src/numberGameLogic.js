import {germanNumber} from './learningData.js';
import {chooseAdaptiveNumbers} from './learningMemory.js';

// Every round samples different numbers. Distractors never duplicate the correct answer.
export function shuffled(values,random=Math.random){
 const result=[...values];
 for(let i=result.length-1;i>0;i--){
  const j=Math.floor(random()*(i+1));
  [result[i],result[j]]=[result[j],result[i]];
 }
 return result;
}
export function createNumberRound(maximum=12,memory={},random=Math.random){
 if(![12,20,100].includes(maximum))throw new Error('Unsupported number range');
 const count=Math.min(10,maximum+1);
 const numbers=chooseAdaptiveNumbers(maximum,memory,count,random);
 return numbers.map(number=>({
  number,
  options:makeNumberOptions(number,maximum,random)
 }));
}
export function makeNumberOptions(number,maximum,random=Math.random){
 if(!Number.isInteger(number)||number<0||number>maximum||maximum<3)throw new Error('Invalid range');
 const all=Array.from({length:maximum+1},(_,i)=>i).filter(n=>n!==number);
 // Nearby numbers are useful distractors; introduce variety to avoid memorizing option positions.
 const near=shuffled(all.filter(n=>Math.abs(n-number)<=5),random).slice(0,2);
 const other=shuffled(all.filter(n=>!near.includes(n)),random);
 const wrong=[...near,...other].slice(0,3);
 return shuffled([number,...wrong],random);
}
export function optionLabel(number,mode){
 return mode==='hear' ? String(number) : germanNumber(number);
}
