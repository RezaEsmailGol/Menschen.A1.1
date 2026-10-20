// Pure helpers for picture vocabulary selection and review.
export function shuffleItems(items,random=Math.random){
 const copy=[...items];
 for(let i=copy.length-1;i>0;i--){
  const j=Math.floor(random()*(i+1));
  [copy[i],copy[j]]=[copy[j],copy[i]];
 }
 return copy;
}
export function makeVisualQuestions(phrases,memory={},count=10,random=Math.random){
 const candidates=phrases.filter(item=>item&&item.id&&item.de&&item.fa);
 const weak=shuffleItems(candidates.filter(p=>{
  const m=memory.items?.['visual:'+encodeURIComponent(p.id)];
  return m&&(m.mastery<55||m.lastCorrect===false||m.nextAt<=Date.now());
 }),random);
 const used=new Set(),selected=[];
 for(const item of [...weak.slice(0,Math.floor(count*.6)),...shuffleItems(candidates,random)]){
  if(selected.length>=count)break;
  if(!used.has(item.id)){used.add(item.id);selected.push(item);}
 }
 return selected.map(item=>{
  const same=shuffleItems(candidates.filter(p=>p.id!==item.id&&p.category===item.category&&p.de!==item.de),random);
  const extra=shuffleItems(candidates.filter(p=>p.id!==item.id&&!same.some(q=>q.id===p.id)&&p.de!==item.de),random);
  const options=shuffleItems([item,...same,...extra].filter((p,i,arr)=>arr.findIndex(x=>x.id===p.id)===i).slice(0,4),random);
  return {item,options};
 });
}
export function visualAnswerId(phrase){return 'visual:'+encodeURIComponent(phrase.id);}
