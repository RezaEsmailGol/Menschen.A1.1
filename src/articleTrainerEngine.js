import {articleNouns,coreArticleNouns,CASE_FORMS} from './articleNouns.js';
import {activityItemKey} from './learningMemory.js';

export const articleModes=[
 {id:'gender',title:'der / die / das',detail:'جنسیت اسم؛ سه گزینه بدون راهنما'},
 {id:'write',title:'حرف تعریف + املا',detail:'اسم کامل را از روی معنی و تصویر تایپ کن'},
 {id:'nom',title:'ein / eine',detail:'حرف تعریف نامعین در Nominativ'},
 {id:'pronoun',title:'er / sie / es',detail:'ضمیر اشیا'},
 {id:'acc',title:'Akkusativ',detail:'den / die / das و einen / eine / ein'},
 {id:'neg',title:'kein / keinen / keine',detail:'نفی اسم در جمله مفعولی'},
 {id:'plural',title:'جمع اسم‌ها',detail:'die + شکل جمع'}
];
export function articleKey(noun,mode='gender'){return activityItemKey('article',noun.noun||noun,mode);}
export function articleStatus(noun,memory={},mode='gender',now=Date.now()){
 const r=memory.items?.[articleKey(noun,mode)];
 if(!r?.attempts)return 'new';
 if(!r.lastCorrect||r.mastery<55||r.nextAt<=now)return 'weak';
 if(r.mastery>=80&&r.correct>=3&&r.reviewedDays>=2&&r.streak>=2)return 'mastered';
 return 'learning';
}
export function nounPool(scope='core'){
 if(scope==='all')return articleNouns;
 if(scope==='core')return coreArticleNouns;
 return articleNouns.filter(n=>n.lesson===Number(scope));
}
export function articleStats(pool,memory={},mode='gender',now=Date.now()){
 const counts={new:0,weak:0,learning:0,mastered:0,attempts:0,correct:0};
 for(const noun of pool){counts[articleStatus(noun,memory,mode,now)]++;const r=memory.items?.[articleKey(noun,mode)];counts.attempts+=r?.attempts||0;counts.correct+=r?.correct||0;}
 return {...counts,total:pool.length};
}
function shuffle(items,random=Math.random){
 const list=[...items];
 for(let i=list.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));[list[i],list[j]]=[list[j],list[i]];}
 return list;
}
export function articleQuestion(noun,mode='gender',random=Math.random){
 const forms=CASE_FORMS[noun.article];let prompt,answer,options=null,example,audio;
 switch(mode){
 case 'gender':prompt='حرف تعریف درست این اسم چیست؟';answer=noun.article;options=['der','die','das'];example=noun.word;break;
 case 'write':prompt='اسم آلمانی را با حرف تعریف و املای درست بنویس.';answer=noun.word;example=noun.word;break;
 case 'nom':prompt='Das ist ___ '+noun.noun+'.';answer=forms.nomInd;options=['ein','eine'];example='Das ist '+answer+' '+noun.noun+'.';break;
 case 'pronoun':prompt='ضمیر مناسب برای این اسم چیست؟';answer=forms.pronoun;options=['er','sie','es'];example=noun.word+'. '+answer[0].toUpperCase()+answer.slice(1)+' ist hier.';break;
 case 'acc':{const definite=random()<.5;prompt=(definite?'Ich suche ___ ':'Ich brauche ___ ')+noun.noun+'.';answer=definite?forms.def:forms.ind;options=definite?['den','die','das','der']:['einen','eine','ein'];example=prompt.replace('___',answer);break;}
 case 'neg':prompt='Ich habe ___ '+noun.noun+'.';answer=forms.neg;options=['kein','keine','keinen'];example=prompt.replace('___',answer);break;
 case 'plural':prompt='جمع این اسم را با die بنویس.';answer='die '+noun.plural;example=answer;break;
 default:throw new Error('Unknown article mode');
 }
 audio=example;
 return {id:articleKey(noun,mode),noun,mode,prompt,answer,options:options?shuffle(options,random):null,example,audio};
}
export function articleRound({scope='core',mode='gender',filter='all',memory={},count=12,random=Math.random,now=Date.now()}={}){
 const pool=nounPool(scope).filter(n=>filter==='all'||articleStatus(n,memory,mode,now)===filter);
 const rank=n=>({weak:0,new:1,learning:2,mastered:3})[articleStatus(n,memory,mode,now)];
 return shuffle(pool,random).sort((a,b)=>rank(a)-rank(b)).slice(0,Math.min(Math.max(1,count),pool.length)).map(n=>articleQuestion(n,mode,random));
}
// In typing modes German noun capitalization and umlauts are assessed, not silently erased.
export function articleAnswerCorrect(q,answer){
 const normalize=s=>String(s??'').normalize('NFC').trim().replace(/\s+/g,' ');
 return normalize(q.answer)===normalize(answer);
}
export function articleEvent(q,correct){return {id:q.id,kind:'article',label:q.noun.word+' · '+articleModes.find(m=>m.id===q.mode).title,lesson:q.noun.lesson,correct};}
