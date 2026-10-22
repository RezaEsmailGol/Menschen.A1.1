import {chooseAdaptiveNumbers} from './learningMemory.js';
import {germanNumber} from './learningData.js';
import {makeNumberOptions,shuffled} from './numberGameLogic.js';

export const NUMBER_RECALL_MODES=Object.freeze([
 {id:'mixed',title:'ترکیبی'},
 {id:'digitWord',title:'عدد ← کلمه'},
 {id:'listenWord',title:'صدا ← کلمه'},
 {id:'wordDigit',title:'کلمه ← عدد'}
]);
export const NUMBER_RECALL_RANGES=Object.freeze([12,20,100]);
const three=['digitWord','listenWord','wordDigit'];

export function createNumberMemoryRound({maximum=12,mode='mixed',memory={},size=10,random=Math.random}={}){
 if(!NUMBER_RECALL_RANGES.includes(maximum))throw new Error('Unsupported number range');
 if(!NUMBER_RECALL_MODES.some(m=>m.id===mode))throw new Error('Unsupported number mode');
 const count=Math.min(Math.max(1,Math.trunc(size)),maximum+1);
 const numbers=chooseAdaptiveNumbers(maximum,memory,count,random);
 const modeSequence=mode==='mixed'?shuffled(Array.from({length:count},(_,i)=>three[i%three.length]),random)
  :Array(count).fill(mode);
 return numbers.map((number,index)=>{
  const questionMode=modeSequence[index],word=germanNumber(number);
  const values=makeNumberOptions(number,maximum,random);
  return {id:'number:'+number,number,word,mode:questionMode,options:values.map(value=>({
   value,label:questionMode==='wordDigit'?String(value):germanNumber(value)
  }))};
 });
}
export function getNumberMemoryPrompt(question){
 if(!question)return '';
 return question.mode==='listenWord'?'listen':question.mode==='wordDigit'?question.word:String(question.number);
}
export function numberMemoryCorrect(question,selected){
 return Boolean(question)&&Number(selected)===question.number&&selected!==''&&selected!==null&&selected!==undefined;
}
