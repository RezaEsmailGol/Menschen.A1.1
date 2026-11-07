import React from 'react';
import LessonSceneArt,{hasLessonScene} from './LessonSceneArt.jsx';

const skin='#efbea0',ink='#536182',purple='#8069d5',teal='#57bcb8';
function Face({x,y,shirt='#7e8ed2'}){
 return <g>
  <path d={'M'+(x-20)+' '+(y+34)+' Q'+x+' '+(y+12)+' '+(x+20)+' '+(y+34)+' V'+(y+51)+' H'+(x-20)+'Z'} fill={shirt}/>
  <circle cx={x} cy={y} r="18" fill={skin}/>
  <path d={'M'+(x-18)+' '+(y-3)+' Q'+(x-12)+' '+(y-27)+' '+(x+9)+' '+(y-19)+' Q'+(x+23)+' '+(y-13)+' '+(x+17)+' '+(y+3)+' L'+(x+9)+' '+(y-11)+' Q'+x+' '+(y-4)+' '+(x-14)+' '+(y-8)+'Z'} fill={ink}/>
  <circle cx={x-6} cy={y+3} r="1.7" fill="#54445b"/><circle cx={x+6} cy={y+3} r="1.7" fill="#54445b"/>
  <path d={'M'+(x-5)+' '+(y+9)+' Q'+x+' '+(y+14)+' '+(x+5)+' '+(y+9)} fill="none" stroke="#b16c70" strokeWidth="1.8" strokeLinecap="round"/>
 </g>;
}

export default function AudioLessonArt({scene='conversation',word='',label=''}) {
 if(hasLessonScene(word))return <span className="alArt alExistingArt" aria-hidden="true"><LessonSceneArt word={word} size={130}/></span>;
 const kind=scene||'conversation';
 const people=['greeting','goodbye','conversation','jobs','family','doctor'].includes(kind);
 return <span className={'alArt alArt-'+kind} aria-hidden="true">
  <svg viewBox="0 0 168 108" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false">
   <rect width="168" height="108" rx="18" fill="#f1edff"/>
   <ellipse cx="84" cy="103" rx="72" ry="13" fill="#d7e6f4"/>
   {kind==='sunrise'&&<g>
      <circle cx="84" cy="58" r="28" fill="#ffca71"/>
      <g stroke="#f7b758" strokeWidth="4" strokeLinecap="round"><path d="M84 13V21 M84 96V89 M36 58H44 M124 58H132 M50 25L56 32 M116 25L111 32"/></g>
      <path d="M0 82 Q40 50 86 85 Q133 53 168 84 V108H0Z" fill="#8acbc1"/>
      <path d="M0 96 Q61 64 110 91 Q135 77 168 93 V108H0Z" fill="#6db2a8"/>
      <ellipse cx="34" cy="32" rx="21" ry="8" fill="#fff"/><ellipse cx="132" cy="29" rx="22" ry="8" fill="#fff"/>
     </g>}
   {kind==='greeting'&&<g>
      <Face x={50} y={48} shirt="#6da9cd"/><Face x={111} y={48} shirt="#b493dd"/>
      <path d="M71 52 L77 28 M77 28 L84 17" stroke={skin} strokeWidth="10" strokeLinecap="round"/>
      <path d="M86 48 L88 28 M88 28 L80 13" stroke={skin} strokeWidth="10" strokeLinecap="round"/>
      <path d="M71 10 L64 4 M96 9 L103 3 M85 7 V1" stroke={teal} strokeWidth="3" strokeLinecap="round"/>
     </g>}
   {kind==='goodbye'&&<g>
      <path d="M59 101 Q53 85 58 72 L60 43 Q62 33 69 40 L71 59 L77 29 Q83 20 89 27 L86 61 L97 35 Q103 28 108 34 L100 65 L113 48 Q119 43 123 49 L112 76 Q118 68 125 72 Q131 77 121 89 L110 101Z" fill={skin} stroke="#d59486" strokeWidth="2"/>
      <path d="M42 48 Q34 35 45 24 M126 38 Q135 27 126 18 M47 28 L39 14" fill="none" stroke={teal} strokeWidth="4" strokeLinecap="round"/>
      <path d="M66 101 L103 101" stroke={purple} strokeWidth="13"/>
     </g>}
   {kind==='question'&&<g>
      <rect x="14" y="18" width="113" height="64" rx="22" fill="#fff" stroke={purple} strokeWidth="4"/>
      <path d="M55 80 L43 96 L68 80" fill="#fff" stroke={purple} strokeWidth="4" strokeLinejoin="round"/>
      <text x="70" y="55" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="24" fill="#62549c">?</text>
      <circle cx="135" cy="72" r="22" fill="#d6f3ef" stroke={teal} strokeWidth="3"/><path d="M125 72 H145" stroke={teal} strokeWidth="3" strokeDasharray="2 5"/>
     </g>}
   {kind==='family'&&<g>
      <Face x={51} y={49} shirt="#6cb8ac"/><Face x={112} y={45} shirt="#b88bd2"/>
      <circle cx="82" cy="80" r="15" fill={skin}/><path d="M63 108 Q68 93 82 93 Q96 93 103 108" fill="#efb968"/>
      <path d="M73 75 Q82 64 93 75" fill="none" stroke={ink} strokeWidth="6"/>
     </g>}
   {kind==='furniture'&&<g>
      <rect x="37" y="46" width="94" height="17" rx="7" fill="#c6936d"/><path d="M48 65 V99 M120 65 V99" stroke="#a8785e" strokeWidth="9" strokeLinecap="round"/>
      <rect x="19" y="56" width="24" height="24" rx="5" fill="#80abc8"/><path d="M24 80 V98 M38 80 V98" stroke="#729dbd" strokeWidth="6"/>
      <path d="M141 86 V45 L128 45 Q140 10 156 45 L141 45" fill="#ffdc9f" stroke="#a695b8" strokeWidth="3"/>
     </g>}
   {kind==='objects'&&<g>
      <rect x="43" y="19" width="83" height="79" rx="10" fill="#a9d1d2" stroke="#83afb5" strokeWidth="4"/>
      <rect x="55" y="33" width="59" height="53" rx="5" fill="#fff"/>
      <path d="M66 47H102 M66 58H99 M66 69H91" stroke="#beb8df" strokeWidth="4" strokeLinecap="round"/>
      <path d="M129 19 L147 40 L105 84 L91 87 L94 73 Z" fill="#f2c479" stroke="#cd9c61" strokeWidth="3"/>
     </g>}
   {kind==='clock'&&<g>
      <circle cx="86" cy="54" r="41" fill="#fff" stroke={purple} strokeWidth="6"/>
      <circle cx="86" cy="54" r="4" fill={purple}/><path d="M86 28 V54 L105 65" fill="none" stroke="#6054a6" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="86" cy="22" r="3" fill={teal}/><circle cx="118" cy="54" r="3" fill={teal}/><circle cx="86" cy="86" r="3" fill={teal}/>
     </g>}
   {kind==='house'&&<g>
      <path d="M24 58 L84 12 L144 58 V100 H24Z" fill="#a7c9d9" stroke="#7da7c3" strokeWidth="4" strokeLinejoin="round"/>
      <path d="M24 57 L84 10 L144 57" fill="none" stroke="#8066bd" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="71" y="59" width="28" height="41" rx="3" fill="#d9ac86"/><rect x="110" y="64" width="24" height="21" rx="3" fill="#fff5cb"/>
     </g>}
   {kind==='shopping'&&<g>
      <rect x="32" y="31" width="105" height="65" rx="9" fill="#b6cfe7"/>
      <path d="M23 37H146" stroke="#fff" strokeWidth="6"/>
      <rect x="49" y="54" width="72" height="31" rx="6" fill="#fff"/>
      <path d="M63 51 Q62 25 82 25 Q104 25 103 51" fill="none" stroke="#cf9b90" strokeWidth="7" strokeLinecap="round"/>
      <path d="M59 64L70 77 L92 58" fill="none" stroke={teal} strokeWidth="5"/>
     </g>}
   {kind==='travel'&&<g>
      <rect x="20" y="29" width="127" height="60" rx="15" fill="#8cb6d4"/>
      <rect x="34" y="40" width="39" height="27" rx="5" fill="#dbf4f2"/><rect x="82" y="40" width="45" height="27" rx="5" fill="#dbf4f2"/>
      <path d="M44 89L36 101 M118 89L126 101" stroke={ink} strokeWidth="7" strokeLinecap="round"/>
      <circle cx="47" cy="84" r="5" fill="#f9e4b2"/><circle cx="116" cy="84" r="5" fill="#f9e4b2"/>
     </g>}
   {kind==='doctor'&&<g>
      <rect x="46" y="33" width="78" height="64" rx="10" fill="#fff" stroke="#9fbcd4" strokeWidth="5"/>
      <path d="M85 46 V83 M67 65 H103" stroke="#e37f93" strokeWidth="11" strokeLinecap="round"/>
      <path d="M43 23 L51 18 M118 23 L128 17" stroke={teal} strokeWidth="4" strokeLinecap="round"/>
     </g>}
   {kind==='jobs'&&<g>
      <Face x={49} y={44} shirt="#7fc3bc"/>
      <rect x="80" y="32" width="68" height="47" rx="8" fill="#536b91"/><rect x="88" y="40" width="52" height="31" rx="4" fill="#d6efe9"/>
      <path d="M94 51L101 56L94 61 M111 61L119 49" fill="none" stroke="#6aa5a2" strokeWidth="3" strokeLinecap="round"/>
      <path d="M100 86H128" stroke={ink} strokeWidth="5" strokeLinecap="round"/>
     </g>}
   {!people&&!['sunrise','question','furniture','objects','clock','house','shopping','travel'].includes(kind)&&<g><circle cx="85" cy="55" r="37" fill="#d8d0ff"/><path d="M66 54 H105 M85 35 V76" stroke={purple} strokeWidth="8" strokeLinecap="round"/></g>}
  </svg>
 </span>;
}
