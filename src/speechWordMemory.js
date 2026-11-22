// Text alignment, not phoneme-level assessment.
export function alignSpeechWords(expected,heard){
 const a=String(expected||'').split(' ').filter(Boolean),b=String(heard||'').split(' ').filter(Boolean);
 const d=Array.from({length:a.length+1},(_,i)=>Array.from({length:b.length+1},(_,j)=>i===0?j:j===0?i:0));
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+Number(a[i-1]!==b[j-1]));
 let i=a.length,j=b.length;const rows=[];
 while(i||j){
  if(i&&j&&d[i][j]===d[i-1][j-1]+Number(a[i-1]!==b[j-1])){rows.push({word:a[i-1],heard:b[j-1],correct:a[i-1]===b[j-1]});i--;j--;}
  else if(i&&d[i][j]===d[i-1][j]+1){rows.push({word:a[--i],heard:'',correct:false});}
  else j--;
 }
 return rows.reverse();
}
export function recognitionTranscript(event){
 return Array.from(event?.results||[]).filter(r=>r.isFinal!==false).map(r=>String(r[0]?.transcript||'').trim()).filter(Boolean).join(' ');
}
export function recordSpeechWords(previous={},rows=[],lesson=1,now=Date.now()){
 const words={...(previous.words||{})};
 for(const {word,display,heard,correct} of rows){
  if(!word||typeof correct!=='boolean')continue;
  const old=words[word]||{},attempts=(old.attempts||0)+1,misses=(old.misses||0)+Number(!correct),streak=correct?(old.streak||0)+1:0;
  words[word]={word,display:display||old.display||word,lesson:Number(lesson)||old.lesson||1,attempts,misses,streak,lastCorrect:correct,lastHeard:heard,lastAt:now,dueAt:now+(correct?Math.min(72,6*Math.max(1,streak))*3600000:15*60000)};
 }
 return {...previous,words};
}
export function weakSpeechWords(state={},now=Date.now()){
 return Object.values(state.words||{}).filter(x=>!x.lastCorrect||(x.misses>0&&x.streak<3)||x.dueAt<=now)
 .sort((a,b)=>Number(a.lastCorrect)-Number(b.lastCorrect)||b.misses-a.misses||a.dueAt-b.dueAt);
}
