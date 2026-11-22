import React from 'react';
import './speechGauge.css';
export default function SpeechGauge({score,provisional=false,listening=false}){
 const valid=Number.isFinite(score),v=valid?Math.min(100,Math.max(0,Math.round(score))):0;
 const color=!valid?'neutral':v<=25?'red':v<=50?'orange':'green';
 const p=(n,r)=>[110-r*Math.cos(Math.PI*n/100),104-r*Math.sin(Math.PI*n/100)];
 const arc=(a,b)=>'M '+p(a,87).join(' ')+' A 87 87 0 0 1 '+p(b,87).join(' ');
 const status=listening?(valid?'نمره موقت':'در حال شنیدن…'):!valid?'هنوز ارزیابی نشده':v>=85?'خیلی خوب':v>50?'در حال تقویت':v>25?'نیاز به تمرین':'دوباره گوش کن و تکرار کن';
 return <div className={'speechGauge '+color+(listening?' listening':'')+(provisional?' provisional':'')+(listening&&!valid?' scanning':'')}
  role={valid&&!provisional?'meter':'img'} aria-label={valid?(provisional?'امتیاز موقت تشخیص گفتار':'امتیاز تطبیق گفتار'):(listening?'در حال شنیدن':'هنوز ارزیابی نشده')}
  aria-valuemin={valid&&!provisional?0:undefined} aria-valuemax={valid&&!provisional?100:undefined} aria-valuenow={valid&&!provisional?v:undefined}>
  <svg viewBox="0 0 220 118" aria-hidden="true">
  <path d={arc(0,25)} stroke="#dc4545"/><path d={arc(25,50)} stroke="#ed9229"/><path d={arc(50,100)} stroke="#20a267"/>
  {[0,25,50,75,100].map(n=>{const t=p(n,65);return <text key={n} x={t[0]} y={t[1]+3} textAnchor="middle">{n}</text>})}
  {(valid||listening)&&<g className="speechGaugeNeedle" style={{'--g-angle':(v*1.8-90)+'deg'}}>
    <line x1="110" y1="104" x2="110" y2="27"/><circle cx="110" cy="104" r="5"/>
  </g>}
  </svg>
  <div className="speechGaugeValue" dir="ltr">{valid?v+' / 100':listening?'•••':'—'}</div>
  <b>{status}</b><small>{provisional?'پیش‌نمایش؛ نمره نهایی پس از اتمام گفتار':'تطبیق متن گفتار؛ نه نمره دقیق لهجه'}</small>
 </div>;
}
