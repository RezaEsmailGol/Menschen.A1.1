import React from 'react';

// Reusable, locally rendered scene artwork: no third-party image tracking,
// no copyrighted textbook illustrations and no network dependency.
const themes={
 morning:['#f9e7bc','#faaf74'],day:['#c4e9f8','#95c8f4'],evening:['#ffdac4','#d6b1db'],night:['#25275b','#6665ac'],
 office:['#e4f0f6','#aac9df'],classroom:['#e1eef4','#b8e1d5'],laptop:['#dbe8f9','#b3c1e9'],
 house:['#fce8d2','#efc39f'],iran:['#d9f4e8','#a2dbc5'],austria:['#e4edf7','#bfd8ef'],
 map:['#d9eff7','#acdadd'],languages:['#eae5ff','#bab5f8'],
 happy:['#fff0bd','#ffd18b'],sad:['#e1e5f2','#afbdcf'],neutral:['#e6edf2','#c7d5d7'],
 gift:['#ffe3ea','#e7bad5'],friends:['#dff7ed','#a2d9bb'],wave:['#dff4ec','#a0ded0'],
 clock:['#f1e4fb','#d3bce9'],calendar:['#f9e6e4','#e4bbbc'],
 door:['#e7f0d8','#c4ddae'],attention:['#ffead9','#f3ba98'],book:['#e8e4fb','#cbc3ed']
};
const isPeople=new Set(['wave','friends','office','classroom','happy','sad','neutral','attention','languages','austria']);
export function VisualArt({item,large=false}){
 const theme=themes[item.scene]||themes.classroom;
 const night=item.scene==='night',backgroundId='visual-bg-'+item.id;
 const scenic=night||['morning','day','evening','house','iran','map'].includes(item.scene);
 return <svg className={'visualArt '+(large?'visualArtLarge':'')} viewBox="0 0 480 270"
  role="img" aria-label={item.imageIdea} preserveAspectRatio="xMidYMid meet">
  <defs><linearGradient id={backgroundId} x1="0" y1="0" x2="1" y2="1">
   <stop stopColor={theme[0]}/><stop offset="1" stopColor={theme[1]}/></linearGradient></defs>
  <rect width="480" height="270" rx="25" fill={'url(#'+backgroundId+')'}/>
  <circle cx="70" cy="55" r="51" fill="#ffffff4f"/><circle cx="410" cy="225" r="67" fill="#ffffff20"/>
  {scenic?<>
   <circle cx="362" cy="72" r={night?24:31} fill={night?'#ffefbd':'#ffcf82'}/>
   {night?<>{[[67,38],[126,62],[295,37],[434,79],[232,56]].map(([x,y],i)=>
    <path key={i} d={'M'+(x-6)+' '+y+'h12 M'+x+' '+(y-6)+'v12'} stroke="#f8e4aa" strokeWidth="2" strokeLinecap="round"/>)}</>:null}
   <path d="M0 206 Q95 159 178 194 Q290 125 480 202 V270 H0Z" fill={night?'#4c517a':'#ffffff50'}/>
   <path d="M0 227 Q118 186 237 222 Q370 185 480 224 V270 H0Z" fill={night?'#343b63':'#629a8c50'}/>
  </>:<><rect x="35" y="55" width="410" height="165" rx="19" fill="#ffffff7f"/>
   <rect x="80" y="75" width="117" height="105" rx="9" fill="#ffffff91"/>
   <path d="M138 75V180 M80 128H197" stroke="#aac5d454" strokeWidth="7"/>
   <rect x="320" y="73" width="86" height="89" rx="11" fill="#ffffff8c"/>
   <path d="M337 98H391 M337 115H380" stroke="#abc6d7" strokeWidth="7" strokeLinecap="round"/>
  </>}
  {isPeople.has(item.scene)?<>
   <path d="M65 250Q64 177 122 183Q180 181 183 250Z" fill="#7097c7"/>
   <ellipse cx="124" cy="151" rx="34" ry="40" fill="#e9b18b"/>
   <path d="M91 143Q84 97 124 103Q160 103 161 142Q127 121 91 143Z" fill="#494652"/>
   <circle cx="112" cy="154" r="2.6" fill="#3a4653"/><circle cx="137" cy="154" r="2.6" fill="#3a4653"/>
   <path d="M113 170Q124 177 138 167" stroke="#b77970" strokeWidth="2" fill="none" strokeLinecap="round"/>
   <path d="M304 253Q312 185 370 180Q425 180 430 253Z" fill="#a98cbc"/>
   <ellipse cx="369" cy="151" rx="34" ry="40" fill="#d39e79"/>
   <path d="M334 146Q330 101 365 102Q405 103 406 146Q378 124 334 146Z" fill="#4d4a53"/>
   <circle cx="357" cy="155" r="2.5" fill="#3a4653"/><circle cx="381" cy="155" r="2.5" fill="#3a4653"/>
   <path d="M357 169Q370 175 381 168" stroke="#995f54" strokeWidth="2" fill="none"/>
  </>:null}
  <rect x={isPeople.has(item.scene)?185:142} y={isPeople.has(item.scene)?26:45}
    width={isPeople.has(item.scene)?118:196} height={isPeople.has(item.scene)?100:142}
    rx="26" fill="#ffffffec" stroke="#ffffff" strokeWidth="3"/>
  <path d={isPeople.has(item.scene)?'M218 125l-9 21 35-20':'M183 187l-12 19 31-20'} fill="#ffffffec"/>
  <text x="244" y={isPeople.has(item.scene)?"98":"145"} fontSize={isPeople.has(item.scene)?"54":"83"}
    textAnchor="middle" fontFamily="Segoe UI Emoji, Apple Color Emoji, sans-serif">{item.emoji}</text>
  <rect x="18" y="235" rx="9" width="75" height="25" fill="#ffffffd2"/>
  <text x="55" y="252" fill="#466277" fontSize="11" fontWeight="bold" textAnchor="middle">LEKTION 01</text>
 </svg>;
}
export default VisualArt;
