// Pure lesson illustration semantic mapping, usable by Node tests and client UI.
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
function wordKey(word=''){
 return String(word).normalize('NFC').toLocaleLowerCase('de').split(/\s+\/\s+/)[0]
  .replace(/^(der|die|das|ein|eine|kein|keine|mein|meine|dein|deine)\s+/,'')
  .replace(/[.!?,]/g,'').trim();
}
export function sceneForWord(word=''){return SCENE_WORDS[wordKey(word)]||null;}
export function hasLessonScene(word=''){return Boolean(sceneForWord(word));}
