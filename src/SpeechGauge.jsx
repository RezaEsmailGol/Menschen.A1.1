import React from 'react';
import './speechGauge.css';
export default function SpeechGauge({score}){
 const valid=Number.isFinite(score),v=valid?Math.min(100,Math.max(0,Math.round(score))):0;
 const color=!valid?'neutral':v<=25?'red':v<=50?'orange':'green';
 const p=(n,r)=>[110-r*Math.cos(Math.PI*n/100),104-r*Math.sin(Math.PI*n/100)];
 const arc=(a,b)=>'M '+p(a,87).join(' ')+' A 87 87 0 0 1 '+p(b,87).join(' ');
 const needle=p(v,77);
 return <div className={'speechGauge '+color} role={valid?'meter':'img'} aria-label={valid?'امتیاز تطبیق گفتار':'هنوز ارزیابی نشده'} aria-valuemin={valid?0:undefined} aria-valuemax={valid?100:undefined} aria-valuenow={valid?v:undefined}>
  <svg viewBox="0 0 220 118" aria-hidden="true">
  <path d={arc(0,25)} stroke="#dc4545"/><path d={arc(25,50)} stroke="#ed9229"/><path d={arc(50,100)} stroke="#20a267"/>
  {[0,25,50,75,100].map(n=>{const t=p(n,65);return <text key={n} x={t[0]} y={t[1]+3} textAnchor="middle">{n}</text>})}
  {valid&&<><line x1="110" y1="104" x2={needle[0]} y2={needle[1]}/><circle cx="110" cy="104" r="5"/></>}
  </svg><div className="speechGaugeValue" dir="ltr">{valid?v+' / 100':'—'}</div>
  <b>{!valid?'هنوز ارزیابی نشده':v>=85?'خیلی خوب':v>50?'در حال تقویت':v>25?'نیاز به تمرین':'دوباره گوش کن و تکرار کن'}</b>
  <small>تطبیق متن گفتار؛ نه نمره دقیق لهجه</small>
 </div>;
}
