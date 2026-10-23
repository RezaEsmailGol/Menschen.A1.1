import React from 'react';
import {germanNumber} from './learningData.js';

// All art is authored as scalable inline SVG, no remote image APIs or copyrighted images.
// A word gets a concrete object when available, otherwise a letter-marked scene.
const grouped={
 sun:['sonne','tag','heute','morgen','licht'],moon:['nacht','abend'],house:['haus','wohnung','zimmer','fenster','küche','bad','miete','adresse','straße'],
 book:['buch','lesen','schule','lernen','kurs','stunde','lesen','name','vorname','nachname','familienname','nachricht','datei','e-mail','bewerbung','lebenslauf','information'],
 person:['ich','du','er','sie','person','frau','herr','freund','freundin','kollege','kollegin','mutter','vater','bruder','schwester','familie','kind','arzt','ärztin','entwickler'],
 laptop:['computer','firma','büro','projekt','arbeit','arbeiten','softwareentwickler','verb','beruf','fehler','web','python','entwickeln'],
 train:['zug','bahnhof','ticket','bus','u-bahn','haltestelle','weg','fahren','gehen','reisen','unterwegs'],
 clock:['zeit','uhr','termin','montag','dienstag','mittwoch','donnerstag','freitag','samstag','sonntag','wochenende'],
 speech:['sprechen','sagen','hören','gespräch','frage','antwort','deutsch','sprache','wie','wer','woher','kommen','heißen','wohnen','sein','haben','können'],
 nature:['baum','blume','obst','garten','natur','wasser','land','schweiz','österreich','deutschland','iran','türkei','usa'],
 food:['brot','milch','kaffee','kuchen','essen','trinken','preis','euro','kaufen','kasse','geschäft'],
 music:['musik','lied','sport','spiel','spielen','film','freizeit','hobby'],
 health:['kopf','schmerz','gesund','krank','medizin','medikament','apotheke','hilfe']
};
const categories=Object.fromEntries(Object.entries(grouped).flatMap(([id,words])=>words.map(w=>[w,id])));
export function mnemonicCategory(word){
 const normalized=String(word||'').toLocaleLowerCase('de').replace(/^(der|die|das|ein|eine|mein|meine)\s+/,'').replace(/[.!?]/g,'').trim();
 if(/^(\d+)$/.test(normalized)||/^(null|eins|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|dreizehn|vierzehn|fünfzehn|sechzehn|siebzehn|achtzehn|neunzehn|zwanzig)$/.test(normalized))return 'number';
 if(categories[normalized])return categories[normalized];
 const fragments=Object.entries(grouped);
 for(const [category,names] of fragments)if(names.some(n=>normalized.includes(n)))return category;
 return 'letter';
}
function IconScene({category}) {
 switch(category){
 case 'sun':return <><circle cx="160" cy="92" r="41" fill="#FDBB4B"/>{Array.from({length:8},(_,i)=><path key={i} d="M160 24 V36" transform={'rotate('+(i*45)+' 160 92)'} stroke="#F9B445" strokeWidth="7" strokeLinecap="round"/>)}<path d="M28 210 Q95 137 160 194 Q224 145 292 210 V254 H28Z" fill="#71B599"/><path d="M25 250 Q95 185 160 220 Q222 187 295 243 V260 H25Z" fill="#48A38B"/></>;
 case 'moon':return <><circle cx="164" cy="128" r="67" fill="#DACDFF"/><circle cx="188" cy="105" r="61" fill="#283A70"/>{[[70,71],[239,73],[243,185],[91,196]].map(([x,y],i)=><path key={i} d={`M${x} ${y-10} L${x+3} ${y-2} L${x+11} ${y} L${x+3} ${y+3} L${x} ${y+11} L${x-3} ${y+3} L${x-11} ${y} L${x-3} ${y-2}Z`} fill="#FFE8A8"/></>;
 case 'house':return <><path d="M45 124 L160 38 L275 124 L259 147 L160 78 L61 147Z" fill="#F18872"/><rect x="65" y="123" width="190" height="118" rx="10" fill="#FFF1D7"/><rect x="134" y="165" width="53" height="76" rx="6" fill="#7965AE"/><rect x="85" y="146" width="35" height="37" rx="4" fill="#7ECFDF"/><rect x="200" y="146" width="35" height="37" rx="4" fill="#7ECFDF"/><path d="M102 146 V183 M85 164 H120 M218 146 V183 M200 164 H235" stroke="#F6FAFF" strokeWidth="4"/></>;
 case 'book':return <><path d="M55 73 Q110 61 160 94 Q212 61 265 73 V217 Q208 205 160 233 Q105 205 55 217Z" fill="#EDE3FF" stroke="#6A66A9" strokeWidth="8"/><path d="M160 94 V233" stroke="#6A66A9" strokeWidth="7"/><path d="M80 108 Q116 101 141 121 M80 141 Q116 135 141 153 M180 119 Q210 98 244 105 M180 152 Q210 134 244 139" stroke="#ADA4DA" strokeWidth="6" strokeLinecap="round" fill="none"/></>;
 case 'laptop':return <><rect x="54" y="61" width="212" height="142" rx="14" fill="#29395F" stroke="#879AC8" strokeWidth="8"/><rect x="66" y="73" width="188" height="118" rx="5" fill="#A5E8DF"/><path d="M121 111 L98 130 L121 149 M201 111 L224 130 L201 149 M179 102 L146 157" stroke="#51779A" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M32 211 H288 L269 236 H51Z" fill="#B7C1DE"/><rect x="139" y="216" width="42" height="5" rx="3" fill="#7185A5"/></>;
 case 'person':return <><circle cx="160" cy="101" r="48" fill="#F5C5A2"/><path d="M112 99 Q108 40 155 45 Q212 37 211 96 Q194 66 155 75 Q130 85 112 99Z" fill="#474A70"/><path d="M65 248 V219 Q66 168 160 161 Q254 168 255 219 V248Z" fill="#8F91D5"/><path d="M133 171 L160 199 L187 171" fill="#E9E5FC"/><circle cx="144" cy="107" r="4" fill="#443C5D"/><circle cx="177" cy="107" r="4" fill="#443C5D"/><path d="M145 129 Q160 139 175 129" fill="none" stroke="#B97374" strokeWidth="4" strokeLinecap="round"/></>;
 case 'train':return <><rect x="72" y="47" width="176" height="193" rx="34" fill="#A6C5EB"/><rect x="90" y="69" width="140" height="79" rx="13" fill="#314E79"/><path d="M160 69 V148" stroke="#A6C5EB" strokeWidth="5"/><rect x="104" y="169" width="112" height="29" rx="9" fill="#E6EEFC"/><circle cx="112" cy="211" r="12" fill="#FFF1BF"/><circle cx="208" cy="211" r="12" fill="#FFF1BF"/><path d="M104 243 L79 260 M216 243 L241 260" stroke="#647F9D" strokeWidth="11" strokeLinecap="round"/></>;
 case 'clock':return <><circle cx="160" cy="142" r="94" fill="#FFF1D8" stroke="#9988C9" strokeWidth="12"/><path d="M160 73 V142 L208 168" stroke="#7364A7" strokeWidth="11" strokeLinecap="round" fill="none"/>{Array.from({length:12},(_,i)=><circle key={i} cx={160+78*Math.cos(i*Math.PI/6)} cy={142+78*Math.sin(i*Math.PI/6)} r="3.4" fill="#8D79B8"/>)}</>;
 case 'speech':return <><path d="M48 75 Q48 40 88 40 H234 Q275 40 275 82 V167 Q275 207 229 207 H137 L77 243 L91 204 Q48 201 48 167Z" fill="#F9E3B0"/><circle cx="111" cy="125" r="10" fill="#977AC2"/><circle cx="161" cy="125" r="10" fill="#977AC2"/><circle cx="211" cy="125" r="10" fill="#977AC2"/></>;
 case 'nature':return <><path d="M20 229 Q90 176 161 223 Q224 174 300 220 V265 H20Z" fill="#8CCEA6"/><path d="M160 238 V123" stroke="#815E60" strokeWidth="16" strokeLinecap="round"/><circle cx="115" cy="126" r="50" fill="#5AAB85"/><circle cx="199" cy="129" r="52" fill="#4A9C79"/><circle cx="160" cy="81" r="61" fill="#69C393"/><path d="M46 220 Q89 208 116 223" fill="none" stroke="#3B886B" strokeWidth="6"/></>;
 case 'food':return <><ellipse cx="161" cy="218" rx="116" ry="31" fill="#CDB6DC"/><path d="M76 164 Q77 102 124 113 Q153 95 187 114 Q239 100 247 158 L231 208 H92Z" fill="#F5C17C"/><path d="M76 164 Q157 142 247 158" fill="none" stroke="#D9955D" strokeWidth="7"/><ellipse cx="141" cy="135" rx="14" ry="6" fill="#ECA967" transform="rotate(-20 141 135)"/><ellipse cx="187" cy="133" rx="14" ry="6" fill="#ECA967" transform="rotate(18 187 133)"/></>;
 case 'music':return <><path d="M167 66 V193 M167 66 L241 48 V178" stroke="#7760B9" strokeWidth="14" strokeLinecap="round"/><ellipse cx="142" cy="198" rx="31" ry="21" transform="rotate(-23 142 198)" fill="#9B8BE4"/><ellipse cx="216" cy="181" rx="31" ry="21" transform="rotate(-23 216 181)" fill="#9B8BE4"/><path d="M167 104 L241 86" stroke="#7760B9" strokeWidth="12"/></>;
 case 'health':return <><path d="M160 242 Q70 188 65 115 Q65 65 110 65 Q142 65 160 94 Q180 62 211 65 Q256 65 256 113 Q256 182 160 242Z" fill="#F2A2AA"/><path d="M92 151 H135 L152 128 L170 176 L188 151 H230" fill="none" stroke="#FFF7F6" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round"/></>;
 default:return <><rect x="75" y="59" width="170" height="173" rx="27" fill="#DDD5FB"/><path d="M103 103 H215 M103 142 H189 M103 180 H201" stroke="#9889CB" strokeWidth="12" strokeLinecap="round"/><circle cx="230" cy="219" r="26" fill="#9DDACA"/></>;
 }
}
export default function MnemonicArt({word='',number=null,showLabel=false,size=320}) {
 const numeric=number!==null&&Number.isFinite(Number(number));
 const category=numeric?'number':mnemonicCategory(word);
 const palette={sun:['#FFF3CE','#FFE2A0'],moon:['#1B2C56','#314576'],house:['#E4F4ED','#C0E5D7'],book:['#EEEAFE','#DCD5FA'],laptop:['#E0F5F2','#BCE8E7'],person:['#FDF0E8','#FAE0D8'],train:['#E8EFFC','#D0DBF3'],clock:['#FFF0DA','#FADEBF'],speech:['#F9F0DD','#E8D1AD'],nature:['#E6F3DC','#BDE5C6'],food:['#FCEEDD','#F6D8B3'],music:['#EEE5FA','#D7C7F5'],health:['#FFE9EC','#F7C9D6'],letter:['#EEE9FC','#D2DAF8'],number:['#E6F0FE','#D7EBFC']}[category];
 const n=Number(number);
 const tens=Math.floor(n/10),units=n%10;
 return <svg viewBox="0 0 320 280" role="img" aria-label={numeric?`تصویر عدد ${n}`:`نشانه تصویری ${word}`} style={{width:'100%',maxWidth:size,height:'auto'}} xmlns="http://www.w3.org/2000/svg">
 <defs><linearGradient id="mn-grad" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor={palette[0]}/><stop offset="100%" stopColor={palette[1]}/></linearGradient></defs>
 <rect width="320" height="280" rx="29" fill="url(#mn-grad)"/>
 <circle cx="275" cy="50" r="50" fill="#fff" opacity=".26"/><circle cx="42" cy="228" r="69" fill="#fff" opacity=".23"/>
 {numeric?<>
   <text x="160" y="110" textAnchor="middle" fontFamily="Tahoma,Arial,sans-serif" fontWeight="900" fontSize={n===100?87:93} fill="#334A79">{n}</text>
   <g transform="translate(34 145)">
   {n===100?<><rect x="55" y="2" width="146" height="93" rx="18" fill="#8A9ACB"/><text x="128" y="65" fontSize="44" fontWeight="900" fill="white" textAnchor="middle">100</text></>:
   tens<=9 && <>{Array.from({length:tens},(_,i)=><g key={'t'+i} transform={`translate(${i*25} 0)`}><rect width="18" height="72" rx="7" fill="#8B9BCC"/>{Array.from({length:5},(_,j)=><path key={j} d={`M3 ${11+j*13} h12`} stroke="#DBE8FF" strokeWidth="2.7"/>)}</g>)}
   {Array.from({length:units},(_,i)=><circle key={'u'+i} cx={tens*25+18+(i%5)*19} cy={15+Math.floor(i/5)*24} r="8" fill="#F5AF63"/>)}
   {n===0&&<circle cx="120" cy="31" r="25" stroke="#A8B7D7" strokeWidth="5" fill="none"/>}
   </>}
   </g>
   {showLabel&&<text x="160" y="264" textAnchor="middle" fontSize="17" fill="#344A76" fontWeight="700" fontFamily="Arial,sans-serif">{germanNumber(n)}</text>}
 </>:<>
   <IconScene category={category}/>
   {category==='letter'&&<text x="160" y="168" textAnchor="middle" fontSize="67" fontWeight="900" fill="#6056AA" fontFamily="Arial,sans-serif">{String(word).trim().replace(/^(der|die|das)\s+/i,'').slice(0,1).toUpperCase()}</text>}
   {showLabel&&<rect x="22" y="239" width="276" height="31" rx="12" fill="#FFFFFFBD"/>}
   {showLabel&&<text x="160" y="261" textAnchor="middle" fontSize="17" fill="#344A76" fontWeight="700" fontFamily="Arial,sans-serif">{String(word).length>25?String(word).slice(0,24)+'…':String(word)}</text>}
 </>}
 </svg>;
}
