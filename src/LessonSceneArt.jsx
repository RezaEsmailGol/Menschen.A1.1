import React,{useId} from 'react';

// Purpose-drawn SVG scenes, with no remote images or external assets.
export const SCENE_WORDS=Object.freeze({
 journalist:'job-journalist',journalistin:'job-journalist',
 lehrer:'job-teacher',lehrerin:'job-teacher',
 arzt:'job-doctor','ärztin':'job-doctor',
 ingenieur:'job-engineer',ingenieurin:'job-engineer',
 softwareentwickler:'job-developer',softwareentwicklerin:'job-developer',
 entwickler:'job-developer',entwicklerin:'job-developer',
 'verkäufer':'job-seller','verkäuferin':'job-seller',
 student:'job-student',studentin:'job-student',
 musiker:'job-musician',musikerin:'job-musician',
 mutter:'family-mother',vater:'family-father',schwester:'family-sister',
 bruder:'family-brother',oma:'family-grandma',opa:'family-grandpa',
 'großmutter':'family-grandma','großvater':'family-grandpa',
 sohn:'family-brother',tochter:'family-sister',eltern:'family-parents',
 'großeltern':'family-parents',familie:'family-parents',kind:'family-child',
 tisch:'furniture-table',stuhl:'furniture-chair',lampe:'furniture-lamp',
 sofa:'furniture-sofa',couch:'furniture-sofa',bett:'furniture-bed',
 schrank:'furniture-wardrobe',regal:'furniture-shelf',
 teppich:'furniture-rug',sessel:'furniture-armchair',
 spiegel:'furniture-mirror',bild:'furniture-painting',
 'schlüssel':'object-key',kugelschreiber:'object-pen',bleistift:'object-pencil',
 flasche:'object-bottle',brille:'object-glasses',tasche:'object-bag',
 fotoapparat:'object-camera',kamera:'object-camera',
 feuerzeug:'object-lighter',kette:'object-necklace',buch:'object-book',uhr:'object-watch'
});
const COLORS={der:'#4a84bb',die:'#d26a9d',das:'#58a584'};
function wordKey(word=''){
 return String(word).normalize('NFC').toLocaleLowerCase('de').split(/\s+\/\s+/)[0]
  .replace(/^(der|die|das|ein|eine|kein|keine|mein|meine|dein|deine)\s+/,'')
  .replace(/[.!?,]/g,'').trim();
}
export function sceneForWord(word=''){return SCENE_WORDS[wordKey(word)]||null;}
export function hasLessonScene(word=''){return Boolean(sceneForWord(word));}
function Human({x=160,y=65,scale=1,female=false,senior=false,color='#729cc0'}){
 return <g transform={'translate('+x+' '+y+') scale('+scale+')'}>
  {female&&<ellipse cy="-3" ry="35" rx="29" fill={senior?'#b5b8c5':'#6b637e'}/>}
  <circle r="22" fill="#efc1a2"/>
  <path d="M-21 -9 Q-17 -34 0 -27 Q22 -26 23 -6 L10 -17 L-10 -15Z" fill={senior?'#c5cad2':'#55536f'}/>
  <circle cx="-8" cy="3" r="2.5" fill="#695b65"/><circle cx="9" cy="3" r="2.5" fill="#695b65"/>
  <path d="M-6 13 Q0 18 7 13" fill="none" stroke="#bb857d" strokeWidth="2"/>
  <path d="M-32 37 Q-31 18 0 20 Q31 18 32 37 L32 95 H-32Z" fill={color}/>
  {senior&&<path d="M-19 -22 Q0 -37 18 -22" fill="none" stroke="#fff" strokeWidth="5"/>}
 </g>;
}
function Jobs({kind,female}){
 const human=<Human x={98} y={87} scale={.88} female={female} color={female?'#b791ba':'#82a8ce'}/>;
 const props={
  'job-journalist':<><rect x="158" y="73" width="107" height="143" rx="8" fill="#fff" stroke="#99adc5" strokeWidth="6"/><path d="M174 109 H247 M174 132 H247 M174 156 H241 M174 181 H232" stroke="#8cacc5" strokeWidth="6"/><rect x="175" y="85" width="41" height="12" rx="3" fill="#edb49f"/></>,
  'job-teacher':<><rect x="158" y="61" width="125" height="121" rx="8" fill="#8cbdaf" stroke="#568f86" strokeWidth="8"/><path d="M177 96 H267 M177 121 H245" stroke="#f6fff5" strokeWidth="6"/><path d="M120 140 L176 108" stroke="#c09370" strokeWidth="6"/></>,
  'job-doctor':<><rect x="171" y="82" width="92" height="117" rx="11" fill="#ecf8fc" stroke="#8fbbcd" strokeWidth="5"/><path d="M216 103 V164 M187 135 H245" stroke="#de7785" strokeWidth="13"/><path d="M91 132 Q146 142 130 177" fill="none" stroke="#7babb4" strokeWidth="5"/><circle cx="129" cy="178" r="12" fill="#e9f5fc" stroke="#6d9da9" strokeWidth="5"/></>,
  'job-engineer':<><path d="M74 64 Q98 28 124 64Z" fill="#f2c66f"/><rect x="155" y="84" width="105" height="130" rx="9" fill="#fff" stroke="#a0b6ca" strokeWidth="5"/><path d="M170 177 L190 134 L207 153 L244 108 M170 190 H246" fill="none" stroke="#77a0c5" strokeWidth="6"/></>,
  'job-developer':<><rect x="156" y="83" width="130" height="105" rx="10" fill="#466484"/><rect x="169" y="96" width="104" height="77" rx="4" fill="#b3e4da"/><path d="M207 117 L188 135 L207 154 M238 117 L257 135 L238 154 M231 109 L214 163" stroke="#528f98" strokeWidth="5" fill="none"/><path d="M147 194 H294 L280 205 H160Z" fill="#92adc4"/></>,
  'job-seller':<><rect x="151" y="88" width="133" height="120" rx="10" fill="#b9dfd3"/><path d="M141 88 L165 55 H276 L292 88Z" fill="#f0a1a6"/><path d="M147 95 Q170 110 189 92 Q209 109 229 92 Q249 110 276 92" fill="none" stroke="#fff4f0" strokeWidth="8"/><rect x="184" y="149" width="62" height="40" rx="5" fill="#f3c47d"/></>,
  'job-musician':<><path d="M209 66 V185 M209 66 L266 53 V169" stroke="#8b7bcb" strokeWidth="10" fill="none"/><ellipse cx="192" cy="187" rx="23" ry="16" fill="#9c8cda"/><ellipse cx="253" cy="172" rx="23" ry="16" fill="#9c8cda"/></>,
  'job-student':<><rect x="159" y="91" width="114" height="115" rx="10" fill="#fff5df"/><path d="M176 119 H248 M176 144 H241 M176 168 H232" stroke="#a9b5c1" strokeWidth="6"/></>
 };
 return <>{human}{props[kind]||props['job-student']}</>;
}
function Furniture({kind}){
 switch(kind){
 case 'furniture-table':return <><ellipse cx="160" cy="116" rx="112" ry="35" fill="#c99d76"/><path d="M67 124 V216 M250 124 V216 M115 137 V203 M204 137 V203" stroke="#916a4d" strokeWidth="12" strokeLinecap="round"/></>;
 case 'furniture-chair':return <><rect x="108" y="49" width="111" height="126" rx="14" fill="#bc916e"/><rect x="122" y="66" width="84" height="78" rx="8" fill="#e2b993"/><rect x="89" y="149" width="152" height="25" rx="9" fill="#a7795e"/><path d="M107 172 V226 M226 172 V226" stroke="#8d624a" strokeWidth="13" strokeLinecap="round"/></>;
 case 'furniture-sofa':return <><rect x="66" y="81" width="188" height="116" rx="31" fill="#95b7d6"/><rect x="71" y="130" width="178" height="62" rx="16" fill="#b3cee4"/><rect x="49" y="127" width="44" height="80" rx="19" fill="#7096be"/><rect x="226" y="127" width="44" height="80" rx="19" fill="#7096be"/><path d="M91 196 V219 M238 196 V219" stroke="#798da4" strokeWidth="13"/><path d="M160 137 V189" stroke="#e1edf5" strokeWidth="5"/></>;
 case 'furniture-lamp':return <><path d="M119 73 H201 L246 148 H74Z" fill="#f1bf74"/><path d="M160 148 V221 M111 225 H211" stroke="#8985ac" strokeWidth="13" strokeLinecap="round"/><path d="M87 150 H236" stroke="#db9b58" strokeWidth="5"/></>;
 case 'furniture-bed':return <><rect x="46" y="92" width="230" height="120" rx="14" fill="#9c9bd0"/><rect x="60" y="104" width="202" height="78" rx="18" fill="#eff2f8"/><rect x="73" y="108" width="76" height="37" rx="14" fill="#cad8ec"/><path d="M51 206 V229 M271 206 V229" stroke="#777b9c" strokeWidth="12"/></>;
 case 'furniture-wardrobe':return <><rect x="87" y="43" width="150" height="184" rx="8" fill="#bc9979" stroke="#967258" strokeWidth="8"/><path d="M162 47 V222" stroke="#92694e" strokeWidth="6"/><circle cx="147" cy="139" r="5" fill="#f9dc9d"/><circle cx="177" cy="139" r="5" fill="#f9dc9d"/></>;
 case 'furniture-shelf':return <><rect x="89" y="41" width="144" height="193" rx="7" fill="#b8896e"/>{[0,1,2].map(i=><g key={i}><path d={'M99 '+(101+i*58)+' H223'} stroke="#825b48" strokeWidth="9"/><rect x={114+i*8} y={56+i*56} width="29" height="37" rx="4" fill="#7b9fca"/><rect x={160+i*4} y={63+i*56} width="23" height="31" rx="3" fill="#e7b48e"/><rect x="198" y={68+i*56} width="18" height="24" rx="3" fill="#9cc8ad"/></g>)}</>;
 case 'furniture-rug':return <><path d="M58 100 L235 78 L265 205 L87 227Z" fill="#dba59e" stroke="#bd8485" strokeWidth="9"/><path d="M107 130 L218 113 L235 179 L123 198Z" fill="#ffefdf" stroke="#c58b8e" strokeWidth="7"/></>;
 case 'furniture-armchair':return <><rect x="105" y="59" width="120" height="151" rx="29" fill="#aa9bd0"/><rect x="83" y="129" width="159" height="69" rx="18" fill="#c8bee2"/><rect x="64" y="127" width="43" height="81" rx="17" fill="#9d89c6"/><rect x="219" y="127" width="43" height="81" rx="17" fill="#9d89c6"/><path d="M94 201 V224 M238 201 V224" stroke="#837999" strokeWidth="12"/></>;
 case 'furniture-mirror':return <><rect x="106" y="35" width="113" height="179" rx="55" fill="#c2a17c"/><rect x="118" y="49" width="89" height="146" rx="44" fill="#a4d9e9"/><path d="M133 167 L195 72" stroke="#e0f8fc" strokeWidth="13"/><path d="M161 217 V233 M128 236 H194" stroke="#916f55" strokeWidth="9"/></>;
 default:return <><rect x="81" y="45" width="159" height="173" rx="9" fill="#bc9b79"/><rect x="95" y="58" width="130" height="146" rx="5" fill="#c2e2e4"/><path d="M95 176 L150 108 L180 148 L220 104 V204 H95Z" fill="#96bc9f"/><circle cx="154" cy="100" r="20" fill="#f7d086"/></>;
 }
}
function ObjectArt({kind}){
 switch(kind){
 case 'object-key':return <><circle cx="112" cy="96" r="42" fill="none" stroke="#95a7be" strokeWidth="16"/><path d="M145 123 L230 212 M197 184 L217 164 M212 200 L231 181" stroke="#879bb5" strokeWidth="16" fill="none" strokeLinecap="round"/></>;
 case 'object-pen':case 'object-pencil':return <g transform="rotate(35 160 140)"><rect x="140" y="60" width="41" height="152" rx="8" fill={kind==='object-pen'?'#538fca':'#f0bb62'}/><path d="M140 212 L160 247 L181 212Z" fill="#deba94"/><path d="M151 231 L160 247 L169 231Z" fill="#455368"/><path d="M150 72 V202" stroke="#ffedd4" strokeWidth="5"/>{kind==='object-pen'&&<path d="M183 86 H192 V155" stroke="#7395bf" strokeWidth="6" fill="none"/>}</g>;
 case 'object-bottle':return <><rect x="139" y="40" width="43" height="37" rx="5" fill="#8cb9cd"/><path d="M135 75 L112 107 V208 Q112 231 137 231 H185 Q208 231 208 208 V107 L184 75Z" fill="#b3e0e8" stroke="#83bdcf" strokeWidth="5"/><path d="M113 147 Q158 136 207 147 V194 Q156 206 113 194Z" fill="#71b9d4" opacity=".7"/><rect x="133" y="110" width="55" height="24" rx="6" fill="#fafcff"/></>;
 case 'object-glasses':return <><path d="M40 110 H91 M228 110 H282 M156 120 Q160 91 187 112" stroke="#7882a2" strokeWidth="11" fill="none"/><circle cx="107" cy="150" r="50" fill="#addde8" fillOpacity=".6" stroke="#7683a2" strokeWidth="11"/><circle cx="212" cy="150" r="50" fill="#addde8" fillOpacity=".6" stroke="#7683a2" strokeWidth="11"/></>;
 case 'object-bag':return <><path d="M73 96 H248 L268 218 Q159 239 52 218Z" fill="#b48b7a"/><path d="M116 98 V75 Q116 40 160 40 Q207 40 207 75 V98" fill="none" stroke="#8f7065" strokeWidth="14"/><path d="M68 139 H252" stroke="#d6b19b" strokeWidth="7"/><circle cx="160" cy="163" r="11" fill="#f8d99d"/></>;
 case 'object-camera':return <><rect x="44" y="91" width="237" height="143" rx="20" fill="#738cae"/><path d="M98 91 L114 62 H191 L207 91" fill="#667fa3"/><circle cx="160" cy="160" r="53" fill="#c5dbe6" stroke="#4c6a90" strokeWidth="14"/><circle cx="160" cy="160" r="25" fill="#84bfd0"/><circle cx="244" cy="119" r="8" fill="#ffe1af"/></>;
 case 'object-necklace':return <><path d="M77 68 Q60 161 159 218 Q254 165 242 68" fill="none" stroke="#c4a76c" strokeWidth="11"/><path d="M160 169 L191 209 L160 247 L130 209Z" fill="#86b6c9"/></>;
 case 'object-lighter':return <><rect x="112" y="106" width="96" height="129" rx="16" fill="#df8f92"/><rect x="125" y="76" width="70" height="38" rx="8" fill="#9fb3c5"/><path d="M159 72 Q128 47 160 15 Q189 50 159 72Z" fill="#f0c06c"/></>;
 case 'object-book':return <><path d="M56 74 Q106 59 160 90 Q216 57 265 74 V225 Q216 207 160 238 Q107 208 56 225Z" fill="#fffcf7" stroke="#8995bb" strokeWidth="8"/><path d="M160 91 V238 M77 126 H135 M77 157 H135 M185 126 H242 M185 157 H242" stroke="#a4b0d0" strokeWidth="6"/></>;
 default:return <><circle cx="160" cy="133" r="88" fill="#f5f6fa" stroke="#a0afc7" strokeWidth="14"/><path d="M160 77 V136 L204 165" stroke="#839ab7" strokeWidth="12" strokeLinecap="round" fill="none"/></>;
 }
}
function Family({kind}){
 if(kind==='family-parents')return <><Human x={111} y={82} scale={.85}/><Human x={211} y={82} scale={.85} female color="#bd91b6"/></>;
 const female=['family-mother','family-sister','family-grandma'].includes(kind);
 const senior=['family-grandma','family-grandpa'].includes(kind);
 const small=['family-child','family-brother','family-sister'].includes(kind);
 return <Human x={160} y={84} scale={small?.8:1} senior={senior} female={female} color={female?'#b88faa':'#7e9fc9'}/>;
}
export default function LessonSceneArt({word='',scene:explicitScene=null,size=280,showArticle=true}){
 const scene=explicitScene||sceneForWord(word);
 const uid=useId().replace(/:/g,'');
 if(!scene)return null;
 const isJob=scene.startsWith('job-'),isFamily=scene.startsWith('family-'),isFurniture=scene.startsWith('furniture-');
 const female=isJob&&(/^(die|eine|meine|deine)\s/i.test(word)||/in$/i.test(wordKey(word)));
 const article=String(word).match(/^(der|die|das)\s/i)?.[1]?.toLocaleLowerCase('de');
 const palette=isJob?['#eaf4fb','#d7e6f4']:isFamily?['#fff0ec','#f6e3e1']:isFurniture?['#fbf3e8','#ecdfcf']:['#eef4ff','#dce7f7'];
 return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 260" role="img" aria-label={'تصویر آموزشی '+word}
   style={{width:'100%',height:'auto',maxWidth:size,display:'block',margin:'auto'}}>
   <defs><linearGradient id={uid} x1="0" x2="1" y1="0" y2="1"><stop stopColor={palette[0]}/><stop offset="1" stopColor={palette[1]}/></linearGradient></defs>
   <rect width="320" height="260" rx="24" fill={'url(#'+uid+')'}/><circle cx="272" cy="29" r="61" fill="#fff" opacity=".48"/>
   <ellipse cx="160" cy="239" rx="116" ry="11" fill="#8293ab" opacity=".15"/>
   {isJob?<Jobs kind={scene} female={female}/>:isFamily?<Family kind={scene}/>:isFurniture?<Furniture kind={scene}/>:<ObjectArt kind={scene}/>}
   {showArticle&&article&&<><rect x="12" y="12" width="53" height="30" rx="11" fill={COLORS[article]}/><text x="38" y="33" fontSize="15" textAnchor="middle" fontWeight="bold" fill="#fff">{article}</text></>}
 </svg>;
}
