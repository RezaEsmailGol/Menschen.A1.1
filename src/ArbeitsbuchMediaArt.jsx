import React from 'react';
import {
 UserRound,Globe2,Monitor,Smartphone,UsersRound,Baby,Armchair,Lamp,Pencil,
 GlassWater,Printer,Laptop,Goal,Guitar,Clock3,CalendarDays, Sandwich,Coffee,
 TrainFront,BusFront,Newspaper,AlarmClock,Snowflake,Sun
} from 'lucide-react';
import './arbeitsbuchMediaArt.css';
const drawings={
 person:UserRound,globe:Globe2,computer:Monitor,phone:Smartphone,family:UsersRound,
 mother:Baby,sofa:Armchair,lamp:Lamp,pencil:Pencil,bottle:GlassWater,printer:Printer,
 laptop:Laptop,football:Goal,guitar:Guitar,calendar:CalendarDays,bread:Sandwich,
 coffee:Coffee,train:TrainFront,bus:BusFront,newspaper:Newspaper,alarm:AlarmClock,
 snow:Snowflake,sun:Sun
};
const labels={
 person:'شخص',globe:'کره زمین',computer:'کامپیوتر',phone:'تلفن',family:'خانواده',
 mother:'مادر و فرزند',sofa:'مبل',lamp:'چراغ',pencil:'مداد',bottle:'بطری',printer:'چاپگر',
 laptop:'لپ‌تاپ',football:'دروازه فوتبال',guitar:'گیتار',clock:'ساعت عقربه‌ای ۸:۳۰',
 calendar:'تقویم',bread:'نان',coffee:'قهوه',train:'قطار',bus:'اتوبوس',newspaper:'روزنامه',
 alarm:'ساعت زنگدار',snow:'دانه برف',sun:'خورشید'
};
export default function ArbeitsbuchMediaArt({name}){
 if(name==='clock')return <div className="abmArt abmArtClock" role="img" aria-label="تصویر تألیفی ساعت ۸:۳۰">
  <svg viewBox="0 0 220 170" aria-hidden="true">
   <circle cx="110" cy="84" r="68" fill="#fff" stroke="#435d9d" strokeWidth="8"/>
   {Array.from({length:12},(_,i)=>{
    const a=i*Math.PI/6-Math.PI/2,x1=110+57*Math.cos(a),y1=84+57*Math.sin(a),x2=110+64*Math.cos(a),y2=84+64*Math.sin(a);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5865a3" strokeWidth="3"/>;
   })}
   <line x1="110" y1="84" x2="76" y2="93" stroke="#2b416b" strokeWidth="8" strokeLinecap="round"/>
   <line x1="110" y1="84" x2="110" y2="137" stroke="#e8a352" strokeWidth="5" strokeLinecap="round"/>
   <circle cx="110" cy="84" r="5" fill="#2e4274"/>
  </svg>
 </div>;
 const Icon=drawings[name]||BookIcon;
 return <div className={'abmArt abmArt-'+name} role="img" aria-label={'تصویر تألیفی '+(labels[name]||'وسیله')}>
   <span className="abmArtGlow" aria-hidden="true"/>
   <Icon size={105} strokeWidth={1.45} aria-hidden="true"/>
   <span className="abmArtBase" aria-hidden="true"/>
 </div>;
}
function BookIcon({size=100}){return <svg width={size} height={size} viewBox="0 0 100 100"><rect x="18" y="24" width="64" height="52" rx="8" fill="#a7c1e0"/><path d="M50 25v50" stroke="#40567e" strokeWidth="3"/></svg>}
