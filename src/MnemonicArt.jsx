import React, {useId} from 'react';
import {getVisualEntry, mnemonicCategory as unused} from './visualDictionary.js';

// Every artwork is a local, scalable and offline-capable SVG.
// Meanings are resolved in the dictionary, not guessed from the first letter.
const P={
 background:['#F6F0FF','#E4E9FF'],
 number:['#F2F7FF','#DDEBFF'],sun:['#FFF4D5','#FFDEA2'],
 moon:['#1C2A55','#35467A'],person:['#FFF0E8','#F6D8D6'],
 name:['#EEE7FC','#D6CCF7'],computer:['#E2F9F5','#B9E8E2'],
 briefcase:['#E5F3FA','#CBE2F0'],house:['#ECF8EA','#CBE9D3'],
 book:['#F6EEFD','#DDD4F6'],clock:['#FFF2DD','#FFE1B6'],
 globe:['#E5F6FD','#C8E8F7'],train:['#E9EFFB','#CDDBF2'],
 walk:['#EFF8EA','#D8EBC7'],hands:['#FCF1E7','#F4D9BA'],
 speech:['#FFF5DF','#F5DDAE'],smile:['#FFF7DD','#FFE4A5'],
 sad:['#FFF0EB','#FAC7BA'],music:['#F1E8FD','#D9C7F3'],
 heart:['#FCE8EF','#F6CCD8'],tree:['#E5F5E4','#BEE5CA'],
 water:['#E7F6FE','#C0E8F8'],money:['#EBF8E8','#C8E7B9'],
 kitchen:['#FDF1DE','#F8DBB5'],face:['#FFF0E9','#F9DACA'],
 calendar:['#F2ECFE','#D8CDF8'],phone:['#ECEFFD','#D4DDF7'],
 pencil:['#FFF3DE','#F7DEAF'],chair:['#F4EEE9','#E8D7CA'],
 mail:['#EBF2FE','#D3E3FD'],question:['#F1ECFF','#DBD3F4'],
 lamp:['#FFF4DD','#FFE5B8'],island:['#E3F7FA','#C1EAF2'],
 flower:['#FFF0F5','#F9D7E1'],apple:['#FFF2E9','#FAD5D1'],
 football:['#E3F7EC','#C5EAD0'],star:['#E8ECFF','#D6DBFF'],
 candle:['#FFF2DD','#FFE0A5'],shoes:['#EDF3FE','#D3DFF7'],
 balloon:['#FFF0FC','#F5D8F4'],window:['#E6F4FF','#D1E6F8'],
 hand:['#FDF0E4','#F5D8BA'],eggs:['#FFF4E3','#EAD8B8'],
 octopus:['#FDECF6','#F6CEE9'],hands10:['#FDF0DE','#F7DDBC'],
 abacus:['#E8F2FF','#D4E6FC'],cat:['#FDF1E9','#F0D4C6'],
 fish:['#E1F6FD','#BBEAF7'],elephant:['#F1E9FD','#DBCEF1'],
 table:['#F3EFE9','#E5D5C5'],road:['#E5F2FC','#CCDFF4'],
 generic:['#EFF0FD','#D9E0F5']
};
function Dot({x,y,r=5,color='#6072B4'}){return <circle cx={x} cy={y} r={r} fill={color}/>;}
function Head({x=160,y=94,r=29,color='#FFD5B0'}){return <><circle cx={x} cy={y} r={r} fill={color}/><path d={`M${x-r} ${y-1} Q${x-r-3} ${y-r-32} ${x} ${y-r-12} Q${x+r+5} ${y-r-21} ${x+r} ${y} Q${x+3} ${y-r/2} ${x-r} ${y-1}`} fill="#575371"/><Dot x={x-9} y={y+4} r={2.5}/><Dot x={x+10} y={y+4} r={2.5}/></>;}
function PersonShape({x=160,y=110,scale=1,color='#746FCD'}){return <g transform={`translate(${x} ${y}) scale(${scale})`}><circle cy="-35" r="22" fill="#FFD1AE"/><path d="M-38 48 V27 Q-38 -12 0 -12 Q38 -12 38 27 V48 Z" fill={color}/></g>;}
function Scene({scene}){
 switch(scene){
 case 'apple':return <><path d="M160 86 Q133 49 99 74 Q50 108 85 177 Q110 239 158 222 Q214 248 243 177 Q274 99 219 76 Q196 64 160 86Z" fill="#ED786B"/><path d="M160 87 Q161 51 181 36" stroke="#78644F" strokeWidth="10" fill="none" strokeLinecap="round"/><path d="M164 62 Q211 27 232 55 Q205 88 164 62Z" fill="#80B986"/></>;
 case 'candle':return <><rect x="127" y="110" width="66" height="113" rx="14" fill="#FFF2CB"/><path d="M160 102 Q121 83 158 35 Q193 78 160 102Z" fill="#F4B24E"/><path d="M157 95 Q147 79 159 61 Q168 83 157 95Z" fill="#FFE5A8"/><path d="M132 137 H187 M132 176 H187" stroke="#EBCB9B" strokeWidth="6"/></>;
 case 'shoes':return <><path d="M50 186 Q91 187 111 142 L142 143 Q145 178 165 184 L167 213 H47Z" fill="#6B86CD"/><path d="M173 182 Q211 183 225 141 L254 145 Q258 175 282 181 V214 H170Z" fill="#EC9B81"/><path d="M57 200 H154 M182 200 H273" stroke="#FFF" strokeWidth="6"/></>;
 case 'balloon':return <>{[[96,102,'#E78B95'],[157,80,'#93C6EB'],[220,106,'#9CCFAC']].map(([x,y,c],i)=><g key={i}><ellipse cx={x} cy={y} rx="38" ry="52" fill={c}/><path d={`M${x} ${y+52} Q${x+17} ${y+110} 158 244`} stroke="#ACA8BD" strokeWidth="3" fill="none"/></g>)}</>;
 case 'window':return <><rect x="62" y="48" width="196" height="181" rx="12" fill="#D79C83"/>{[0,1,2,3].map(i=><g key={i}><rect x={82+i%2*86} y={67+Math.floor(i/2)*75} width="68" height="60" rx="3" fill="#9DDBEF"/><path d={`M${116+i%2*86} ${67+Math.floor(i/2)*75} v60 M${82+i%2*86} ${97+Math.floor(i/2)*75} h68`} stroke="#FFF4E9" strokeWidth="5"/></g>)}</>;
 case 'hand':case 'hands':case 'hands10':return <><path d="M92 215 V116 Q92 97 108 97 Q125 97 125 115 V82 Q125 66 141 66 Q157 66 157 82 V57 Q157 41 173 41 Q189 41 189 57 V88 Q203 63 219 73 Q236 83 218 119 Q256 120 254 142 Q252 163 229 183 L218 223Z" fill="#EFC29E"/><path d="M100 209 H208" stroke="#D8A786" strokeWidth="6"/>{scene==='hands10'&&<path d="M77 165 Q58 137 70 110 M246 135 Q267 110 260 89" fill="none" stroke="#D69F81" strokeWidth="10" strokeLinecap="round"/>}</>;
 case 'eggs':return <><rect x="60" y="69" width="200" height="160" rx="22" fill="#B4B6CC"/>{Array.from({length:6},(_,i)=><ellipse key={i} cx={105+(i%3)*56} cy={114+Math.floor(i/3)*62} rx="20" ry="26" fill="#FFF2D5"/>)}</>;
 case 'star':return <>{Array.from({length:7},(_,i)=>{const x=72+i%4*58,y=92+Math.floor(i/4)*85;return <path key={i} d={`M${x} ${y-22} l7 16 18 2 -13 13 4 18 -16 -9 -16 9 4 -18 -13 -13 18 -2Z`} fill={i%2?'#FFD58C':'#FFE7AB'}/>})}</>;
 case 'octopus':return <><ellipse cx="160" cy="124" rx="64" ry="67" fill="#B889D3"/>{Array.from({length:8},(_,i)=>{const angle=Math.PI*2*i/8;const x=160+Math.cos(angle)*100,y=160+Math.sin(angle)*65;return <path key={i} d={`M160 152 Q${(160+x)/2} 193 ${x} ${y+28}`} stroke="#B889D3" strokeWidth="16" strokeLinecap="round" fill="none"/>})}<Dot x={141} y={125}/><Dot x={180} y={125}/></>;
 case 'flower':case 'tree':return <><path d="M160 234 V115" stroke="#739C74" strokeWidth="14" strokeLinecap="round"/>{scene==='flower'?<>{Array.from({length:8},(_,i)=><ellipse key={i} cx="160" cy="73" rx="24" ry="45" fill={i%2?'#F4A8B7':'#E6819B'} transform={`rotate(${i*45} 160 115)`}/>) }<circle cx="160" cy="115" r="23" fill="#FFD17E"/></>:<><circle cx="160" cy="103" r="74" fill="#77BE9B"/><circle cx="107" cy="126" r="40" fill="#5CAB85"/><circle cx="217" cy="125" r="42" fill="#60AB83"/></>}</>;
 case 'sun':return <><circle cx="160" cy="125" r="67" fill="#FFBD54"/>{Array.from({length:12},(_,i)=><path key={i} d="M160 24 V42" stroke="#F2B04C" strokeWidth="8" strokeLinecap="round" transform={`rotate(${i*30} 160 125)`}/>)}</>;
 case 'moon':return <><circle cx="160" cy="119" r="70" fill="#E1D8FF"/><circle cx="185" cy="93" r="65" fill="#35467A"/><Dot x={70} y={56} color="#FFE4A4"/><Dot x={247} y={179} color="#FFE4A4"/></>;
 case 'house':return <><path d="M43 133 L160 42 L277 133 L261 151 L160 83 L58 151Z" fill="#E58D7E"/><rect x="70" y="130" width="180" height="104" rx="9" fill="#FFE9CB"/><rect x="137" y="164" width="48" height="70" rx="5" fill="#7B75BC"/><rect x="92" y="155" width="31" height="37" rx="4" fill="#8FD5E2"/><rect x="197" y="155" width="31" height="37" rx="4" fill="#8FD5E2"/></>;
 case 'book':return <><path d="M50 75 Q105 62 160 94 Q218 62 271 75 V222 Q216 204 160 236 Q104 207 50 222Z" fill="#F5F0FF" stroke="#8578BF" strokeWidth="8"/><path d="M160 95 V234 M77 125 H135 M77 159 H135 M184 125 H242 M184 159 H242" stroke="#9B90CB" strokeWidth="6"/></>;
 case 'computer':return <><rect x="53" y="52" width="215" height="152" rx="13" fill="#344A6E" stroke="#93B8D4" strokeWidth="7"/><rect x="66" y="65" width="189" height="125" rx="5" fill="#9ADDD9"/><path d="M120 112 l-24 18 24 18 M199 112 l24 18 -24 18 M179 97 l-36 66" fill="none" stroke="#4B7B98" strokeWidth="9" strokeLinecap="round"/><path d="M27 215 H294 L272 239 H49Z" fill="#B6C6DC"/></>;
 case 'briefcase':return <><rect x="60" y="103" width="200" height="128" rx="17" fill="#718CC4"/><path d="M116 101 V81 Q116 63 135 63 H184 Q202 63 202 81 V101" fill="none" stroke="#4C658E" strokeWidth="13"/><path d="M60 156 Q160 197 260 156" fill="none" stroke="#C7D8ED" strokeWidth="7"/><rect x="145" y="166" width="30" height="21" rx="4" fill="#F9D78C"/></>;
 case 'person':return <><Head/><path d="M71 242 V216 Q71 168 160 154 Q250 168 250 216 V242Z" fill="#8583CE"/></>;
 case 'name':return <><rect x="53" y="66" width="214" height="169" rx="21" fill="#FFF" stroke="#AA9BE2" strokeWidth="7"/><circle cx="114" cy="139" r="34" fill="#E5BB9E"/><path d="M76 191 Q76 153 114 153 Q152 153 152 191" fill="#8F88C8"/><path d="M170 117 H240 M170 146 H239 M170 176 H222" stroke="#9B97CD" strokeWidth="9" strokeLinecap="round"/></>;
 case 'speech':return <><path d="M45 76 Q45 43 88 43 H237 Q277 43 277 85 V167 Q277 204 233 204 H135 L76 243 L89 202 Q45 194 45 162Z" fill="#F3D8A1"/>{[106,160,214].map(x=><Dot key={x} x={x} y={125} r={10} color="#9B87BD"/>)}</>;
 case 'phone':return <><rect x="103" y="35" width="114" height="212" rx="21" fill="#6679AC"/><rect x="114" y="53" width="92" height="159" rx="7" fill="#C3E8F8"/><circle cx="160" cy="230" r="8" fill="#E4F5F9"/><path d="M132 114 Q155 156 193 159" fill="none" stroke="#678DBC" strokeWidth="13" strokeLinecap="round"/></>;
 case 'calendar':return <><rect x="66" y="65" width="188" height="169" rx="18" fill="#FFF" stroke="#AFA3D9" strokeWidth="7"/><path d="M66 119 H254" stroke="#D1C7EA" strokeWidth="7"/><path d="M115 48 V86 M205 48 V86" stroke="#7165B4" strokeWidth="12" strokeLinecap="round"/>{[0,1,2,3,4,5,6,7,8].map(i=><rect key={i} x={92+i%3*50} y={137+Math.floor(i/3)*27} width="28" height="15" rx="5" fill={i===5?'#E7B170':'#D1C9ED'}/>)}</>;
 case 'clock':return <><circle cx="160" cy="139" r="92" fill="#FFF5E6" stroke="#A392C9" strokeWidth="11"/><path d="M160 73 V140 L208 168" stroke="#7665A2" strokeWidth="10" strokeLinecap="round" fill="none"/>{Array.from({length:12},(_,i)=><Dot key={i} x={160+75*Math.cos(i*Math.PI/6)} y={139+75*Math.sin(i*Math.PI/6)} r={3.7} color="#9987B8"/>)}</>;
 case 'globe':return <><circle cx="160" cy="137" r="92" fill="#7BC7DC"/><path d="M125 57 Q175 75 165 116 Q226 104 220 163 L182 222 Q150 204 124 220 Q97 183 76 151 L95 99Z" fill="#90BE99"/><ellipse cx="160" cy="137" rx="47" ry="92" stroke="#DCF5F3" strokeWidth="5" fill="none"/><path d="M71 138 H249" stroke="#DCF5F3" strokeWidth="5"/></>;
 case 'train':return <><rect x="74" y="45" width="171" height="188" rx="32" fill="#9DB9E2"/><rect x="89" y="63" width="141" height="86" rx="13" fill="#344D76"/><path d="M160 65 V149" stroke="#BED7F2" strokeWidth="5"/><rect x="110" y="168" width="99" height="27" rx="7" fill="#EFF7FF"/><Dot x={112} y={211} r={11} color="#F8E4B2"/><Dot x={208} y={211} r={11} color="#F8E4B2"/></>;
 case 'walk':return <><circle cx="169" cy="67" r="25" fill="#F0BE97"/><path d="M166 93 L142 148 L192 177 M142 148 L88 181 M164 99 L209 119 M165 150 L129 229 M192 177 L236 231" fill="none" stroke="#7E83CB" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"/></>;
 case 'money':return <><rect x="54" y="74" width="212" height="153" rx="18" fill="#86BEA4"/><rect x="70" y="92" width="180" height="118" rx="13" stroke="#D1F4D3" strokeWidth="6" fill="none"/><circle cx="160" cy="151" r="45" fill="#DDF3BA"/><path d="M181 119 Q152 109 141 127 Q125 157 162 162 M134 148 H178 M139 165 H175" stroke="#5F986D" strokeWidth="7" fill="none" strokeLinecap="round"/></>;
 case 'kitchen':return <><path d="M73 155 Q89 102 145 115 Q190 90 240 151 L225 210 H90Z" fill="#E9B57F"/><path d="M75 158 Q160 134 240 157" stroke="#C68E63" strokeWidth="6" fill="none"/><ellipse cx="160" cy="232" rx="112" ry="19" fill="#CDB4BC"/></>;
 case 'music':return <><path d="M165 62 V197 M165 62 L240 48 V181" stroke="#8070C7" strokeWidth="14" strokeLinecap="round"/><ellipse cx="141" cy="200" rx="31" ry="20" fill="#9C8CE2" transform="rotate(-23 141 200)"/><ellipse cx="217" cy="186" rx="31" ry="20" fill="#9C8CE2" transform="rotate(-23 217 186)"/></>;
 case 'water':return <><path d="M160 40 Q110 118 104 162 Q107 233 160 232 Q216 232 215 166 Q213 125 160 40Z" fill="#88CAEB"/><path d="M120 175 Q139 216 184 204" fill="none" stroke="#C6F0FF" strokeWidth="9" strokeLinecap="round"/></>;
 case 'smile':case 'sad':case 'face':return <><circle cx="160" cy="131" r="87" fill={scene==='sad'?'#E9A29A':'#FBD58F'}/><Dot x={129} y={115} r={6} color="#715A62"/><Dot x={192} y={115} r={6} color="#715A62"/><path d={scene==='sad'?'M120 184 Q160 143 200 184':'M115 161 Q160 207 205 161'} stroke="#9C666D" strokeWidth="9" fill="none" strokeLinecap="round"/></>;
 case 'heart':return <><path d="M160 238 Q61 182 57 117 Q57 65 108 65 Q137 65 160 92 Q183 65 211 65 Q266 65 263 117 Q259 190 160 238Z" fill="#E9A1AC"/><path d="M94 152 H135 L154 128 L169 176 L190 151 H235" stroke="white" strokeWidth="8" fill="none" strokeLinejoin="round"/></>;
 case 'question':return <><circle cx="160" cy="133" r="96" fill="#C2B5F0"/><path d="M127 102 Q131 62 168 65 Q210 66 201 103 Q198 126 163 140 V164" fill="none" stroke="#FFF" strokeWidth="16" strokeLinecap="round"/><Dot x={164} y={195} r={11} color="#FFF"/></>;
 case 'pencil':return <><path d="M91 208 L207 65 Q221 48 236 65 L249 78 Q264 94 250 108 L132 244 L76 253Z" fill="#F4BF7D"/><path d="M90 207 L77 252 L131 244" fill="#9F92A1"/><path d="M206 66 L249 108 M97 205 L134 237" stroke="#FDF5DD" strokeWidth="8"/><rect x="58" y="200" width="165" height="10" rx="5" fill="#D3C0A3" transform="rotate(-35 58 200)" opacity=".55"/></>;
 case 'chair':case 'table':return <><rect x="82" y="129" width="160" height="27" rx="8" fill="#B8896A"/><path d="M95 156 V239 M230 156 V239" stroke="#926F5A" strokeWidth="15" strokeLinecap="round"/>{scene==='chair'&&<rect x="95" y="55" width="112" height="80" rx="10" fill="#D2AD8E"/>}</>;
 case 'mail':return <><rect x="53" y="83" width="214" height="143" rx="16" fill="#FFF" stroke="#95AFD6" strokeWidth="7"/><path d="M57 99 L160 174 L263 99 M57 216 L133 159 M263 216 L186 159" stroke="#AEC5E3" strokeWidth="7" fill="none"/></>;
 case 'lamp':return <><path d="M116 78 H205 L240 161 H80Z" fill="#F4C06D"/><path d="M160 163 V222 M112 225 H208" stroke="#8B86A9" strokeWidth="12" strokeLinecap="round"/></>;
 case 'island':return <><path d="M46 202 Q160 165 276 203" fill="none" stroke="#83C8E0" strokeWidth="16"/><ellipse cx="159" cy="197" rx="87" ry="22" fill="#E9D5A5"/><path d="M157 201 V95" stroke="#93744A" strokeWidth="12"/><path d="M153 96 Q83 30 95 112 Q135 81 153 96 Q203 38 226 91 Q188 85 153 96Z" fill="#79BC90"/></>;
 case 'cat':return <><path d="M88 117 L106 58 L143 89 Q160 81 179 89 L214 58 L236 124 Q244 205 160 222 Q77 206 88 117Z" fill="#D5A991"/><Dot x={134} y={147} color="#484658"/><Dot x={185} y={147} color="#484658"/><path d="M152 171 L170 171 L160 182Z" fill="#A46972"/><path d="M160 182 Q143 194 131 185 M160 182 Q177 194 191 185" stroke="#816476" strokeWidth="4" fill="none"/></>;
 case 'fish':return <><ellipse cx="159" cy="139" rx="86" ry="58" fill="#83C9D7"/><path d="M92 137 L38 89 V191Z" fill="#6AB3CA"/><circle cx="200" cy="124" r="8" fill="#536F9C"/><path d="M180 168 Q193 176 214 163" stroke="#FFF" strokeWidth="5" fill="none"/></>;
 case 'elephant':return <><ellipse cx="169" cy="156" rx="90" ry="67" fill="#A9A9C5"/><ellipse cx="102" cy="140" rx="47" ry="59" fill="#BBBBD6"/><path d="M225 143 Q261 183 239 229 Q212 252 198 226" stroke="#A9A9C5" strokeWidth="31" fill="none" strokeLinecap="round"/><circle cx="126" cy="117" r="6" fill="#424762"/></>;
 case 'road':return <><path d="M110 270 L150 41 H182 L220 270Z" fill="#7584AB"/><path d="M164 51 V256" stroke="#F7E3A8" strokeWidth="8" strokeDasharray="22 22"/><path d="M39 191 H116 M213 191 H282" stroke="#9BBDB0" strokeWidth="25"/></>;
 case 'arrow':return <><path d="M58 139 H246 M210 102 L251 139 L210 178" fill="none" stroke="#8B85C9" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/></>;
 default:return <><rect x="66" y="59" width="186" height="173" rx="28" fill="#D8D6F5"/><circle cx="160" cy="135" r="53" fill="#B2AFE8"/><path d="M122 134 Q160 103 198 134 M122 152 Q160 176 198 152" stroke="#EDECFB" strokeWidth="8" fill="none" strokeLinecap="round"/></>;
 }
}
function PronounCue({pronoun}){
 const pos=String(pronoun||'').toLocaleLowerCase('de');
 const count=pos==='ich'||pos==='du'||pos==='er/sie/es'?1:pos==='wir'?3:pos==='ihr'?3:2;
 const isSelf=pos==='ich';const formal=pronoun==='sie/Sie';
 return <g transform="translate(191 12)">
 <rect width="111" height="70" rx="17" fill="#FFFFFFE8" stroke="#CBD3F4" strokeWidth="2"/>
 {Array.from({length:count},(_,i)=><g key={i} transform={`translate(${21+i*27-(count-1)*7} 28)`}>
 <circle r="9" fill={i===0?'#F7CA9F':'#E5C1B2'}/><path d="M-13 26 Q-13 3 0 3 Q13 3 13 26" fill={isSelf&&i===0?'#6A65BC':'#94A4C9'}/></g>)}
 {formal && <path d="M94 12 l5 4 -4 8 -6 -4Z" fill="#8D6CAD"/>}
 <text x="56" y="62" textAnchor="middle" fill="#4A517D" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="12">{pronoun}</text>
 </g>;
}
export function mnemonicCategory(word){return getVisualEntry(word).scene;}
export default function MnemonicArt({word='',number=null,letter=null,prompt='',meaning='',verb=null,pronoun=null,showLabel=false,size=320}){
 const id=useId().replace(/:/g,'');
 const entry=getVisualEntry(word,{number,letter,prompt,meaning,verb,pronoun});
 const scene=entry.kind==='number'?entry.scene:entry.scene||'generic';
 const palette=P[scene]||P.generic;
 const n=entry.kind==='number'?entry.number:null;
 const alphabet=entry.kind==='alphabet';
 const conjugation=entry.kind==='conjugation';
 return <svg viewBox="0 0 320 280" role="img"
 aria-label={`نشانه تصویری: ${entry.cue||entry.fa||word}`}
 style={{width:'100%',height:'auto',maxWidth:size,display:'block',marginInline:'auto'}}
 xmlns="http://www.w3.org/2000/svg">
 <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor={palette[0]}/><stop offset="1" stopColor={palette[1]}/></linearGradient></defs>
 <rect width="320" height="280" rx="28" fill={`url(#${id})`}/>
 <circle cx="288" cy="35" r="65" fill="#fff" opacity=".19"/><circle cx="10" cy="255" r="75" fill="#fff" opacity=".20"/>
 {n!==null && n>20
 ? <><g transform="translate(34 53)">
    {Array.from({length:Math.floor(n/10)},(_,i)=><g key={i} transform={`translate(${i%5*48} ${Math.floor(i/5)*93})`}>
      <rect width="33" height="80" rx="9" fill="#849DD0"/>
      {Array.from({length:5},(_,j)=><path key={j} d={`M6 ${11+j*14} H27`} stroke="#D0E2F8" strokeWidth="3"/>)}
    </g>)}
    {Array.from({length:n%10},(_,i)=><circle key={i} cx={13+i%5*48} cy={200+Math.floor(i/5)*25} r="10" fill="#EDAA69"/>)}
    {n===100 && <><rect x="6" y="17" width="240" height="183" rx="24" fill="#8E9CC8"/><path d="M38 40 H213 M38 88 H213 M38 136 H213 M38 184 H213" stroke="#DDE7FA" strokeWidth="6"/></>}
   </g><text x="160" y="254" fontFamily="Arial,sans-serif" textAnchor="middle" fontSize="36" fontWeight="900" fill="#38547D">{n}</text></>
 :<Scene scene={scene}/>}
 {n!==null && n<=20 && <g><rect x="13" y="16" width="63" height="54" rx="14" fill="#FFFFFFCF"/><text x="44" y="54" textAnchor="middle" fontSize="30" fill="#545A96" fontWeight="900" fontFamily="Arial,sans-serif">{n}</text>
    {n===16||n===17 ? <rect x="73" y="18" width="72" height="29" rx="9" fill="#D3B6EF"/> : null}</g>}
 {alphabet && <><rect x="12" y="17" width="66" height="66" rx="17" fill="#FFFFFFCC"/>
   <text x="45" y="64" textAnchor="middle" fontSize="43" fontWeight="900" fill="#5752A7" fontFamily="Arial,sans-serif">{entry.letter}</text></>}
 {conjugation && <PronounCue pronoun={entry.pronoun}/>}
 {showLabel && <><rect x="10" y="240" width="300" height="32" rx="12" fill="#FFFFFFDE"/>
   <text x="160" y="262" fontSize="17" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="800" fill="#404C79">
    {String(n!==null?entry.word:alphabet?entry.example:word||entry.word).slice(0,33)}
   </text></>}
 </svg>;
}
