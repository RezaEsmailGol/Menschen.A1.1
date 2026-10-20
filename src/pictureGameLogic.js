// Pure, predictable mechanics for "See the picture, say it in German".
// An assessment is identified by card AND mode; existing visual-card history
// is read as a fallback so early weaknesses carry over.
export const PICTURE_LEVELS=Object.freeze([
 {id:'choice',name:'انتخاب پاسخ',hint:'چهار گزینه آلمانی',number:1},
 {id:'type',name:'تایپ عبارت',hint:'خودت جمله را بنویس',number:2},
 {id:'build',name:'ساخت جمله',hint:'کلمات را مرتب کن',number:3}
]);

export function normalizeGermanAnswer(value){
 return String(value??'').normalize('NFC').toLocaleLowerCase('de-DE')
   .replace(/[’‘`´]/g,"'")
   .replace(/[.,!?;:«»„“”"()[\]]/g,' ')
   .replace(/\s+/g,' ').trim();
}
export function checkGermanAnswer(input,expected){
 return normalizeGermanAnswer(input)===normalizeGermanAnswer(expected);
}
export function wordTokens(value){
 return normalizeGermanAnswer(value).split(' ').filter(Boolean);
}
export function eligiblePicturePhrases(phrases,level){
 const pool=Array.isArray(phrases)?phrases.filter(p=>p?.id&&p?.de&&p?.fa):[];
 return level==='build'?pool.filter(p=>{
  const tokens=wordTokens(p.de);
  return tokens.length>=3 && new Set(tokens).size>=2;
 }):pool;
}
export function pictureMemoryId(item,level){
 return 'visual:'+encodeURIComponent(item.id)+':'+level;
}
function shuffle(arr,random){
 const out=[...arr];
 for(let i=out.length-1;i>0;i--){
  const j=Math.floor(random()*(i+1));
  [out[i],out[j]]=[out[j],out[i]];
 }
 return out;
}
export function wordTiles(sentence,random=Math.random){
 // Display the real capitalized German words (Ich, Sie, Morgen), not a
 // lowercased normalization. Validation still tolerates user capitalization.
 const tiles=String(sentence||'').normalize('NFC')
   .replace(/[.,!?;:]/g,' ')
   .split(/\s+/).filter(Boolean).map((word,index)=>({id:index,word}));
 let scrambled=shuffle(tiles,random);
 // Never offer a pre-solved arrangement, even with a deterministic RNG.
 if(scrambled.length>1 && scrambled.every((x,i)=>x.id===i)){
  scrambled=[...scrambled.slice(1),scrambled[0]];
 }
 return scrambled;
}
export function answerFromTiles(tiles,indices){
 const lookup=new Map(tiles.map(t=>[t.id,t.word]));
 if(new Set(indices).size!==indices.length)return '';
 return indices.map(i=>lookup.get(i)||'').join(' ');
}
export function generatePictureRound(phrases,level,memory={},count=10,random=Math.random,now=Date.now()){
 const available=eligiblePicturePhrases(phrases,level);
 if(!available.length)return [];
 const previous=memory.items||{};
 const strength=p=>{
  const current=previous[pictureMemoryId(p,level)];
  const earlier=previous['visual:'+encodeURIComponent(p.id)];
  return current||earlier||null;
 };
 const needsReview=p=>{
  const record=strength(p);
  return record && (record.lastCorrect===false || Number(record.mastery||0)<55
    || (Number(record.nextAt)>0 && Number(record.nextAt)<=now));
 };
 const due=shuffle(available.filter(needsReview),random);
 const seen=new Set(),selected=[];
 // Up to 60% specifically weak material, other spots sampled across the deck.
 for(const item of [...due.slice(0,Math.max(1,Math.ceil(count*0.6))),...shuffle(available,random)]){
  if(selected.length>=Math.min(count,available.length))break;
  if(!seen.has(item.id)){seen.add(item.id);selected.push(item);}
 }
 return selected.map(item=>{
  const similar=shuffle(available.filter(p=>p.id!==item.id&&p.category===item.category
    &&normalizeGermanAnswer(p.de)!==normalizeGermanAnswer(item.de)),random);
  const distinct=shuffle(available.filter(p=>p.id!==item.id&&p.category!==item.category
    &&normalizeGermanAnswer(p.de)!==normalizeGermanAnswer(item.de)),random);
  const candidates=[item,...similar,...distinct];
  const deduped=[],spellings=new Set();
  for(const p of candidates){
   const key=normalizeGermanAnswer(p.de);
   if(!spellings.has(key)){spellings.add(key);deduped.push(p);}
   if(deduped.length>=4)break;
  }
  const choiceOptions=shuffle(deduped,random);
  return {item,options:choiceOptions,tiles:wordTiles(item.de,random)};
 });
}
