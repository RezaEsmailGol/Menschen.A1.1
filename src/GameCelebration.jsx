import React from 'react';
import {Sparkles,Star,Trophy} from 'lucide-react';
import './gameCelebration.css';

export default function GameCelebration({correct=0,total=0,caption='پایان تمرین',showScore=true}){
 const ratio=total?correct/total:0;
 const grade=ratio>=.9?{emoji:'🏆',title:'Wunderbar!',fa:'فوق‌العاده بود!'}
  :ratio>=.6?{emoji:'🌟',title:'Sehr gut!',fa:'خیلی خوب پیش رفتی!'}
  :{emoji:'🌱',title:'Gut gemacht!',fa:'آفرین که تمرین را تمام کردی!'};
 return <div className="gcCelebration" role="status" aria-label={caption+'؛ '+grade.fa}>
  <div className="gcConfetti" aria-hidden="true">{Array.from({length:19},(_,i)=>
   <span className={'gcParticle gcParticle'+i%5} style={{'--i':i,'--spread':(i-9)*15+'px','--delay':(i%6)*0.08+'s'}} key={i}/>)}</div>
  <div className="gcMedal"><span aria-hidden="true">{grade.emoji}</span><Sparkles size={19} aria-hidden="true"/></div>
  <div className="gcCaption"><Trophy size={16}/>{caption}<Star size={16}/></div>
  <h2 dir="ltr">{grade.title}</h2>
  <p>{grade.fa}</p>
  {showScore&&<strong className="gcScore" dir="ltr">{correct} / {total}</strong>}
 </div>;
}
