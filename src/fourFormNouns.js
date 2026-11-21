import {activityItemKey} from './learningMemory.js';

// Lesson 6, Arbeitsbuch p.42: office vocabulary and supplementary review.
const make=(rows,group)=>rows.map(([word,article,plural,fa])=>({word,article,plural,fa,group}));
export const FOUR_FORM_NOUNS=Object.freeze([
 ...make([
 ['Laptop','der','Laptops','لپ‌تاپ'],['Maus','die','Mäuse','ماوس'],['Handy','das','Handys','موبایل'],
 ['Bildschirm','der','Bildschirme','نمایشگر'],['Notizbuch','das','Notizbücher','دفتر یادداشت'],
 ['Rechnung','die','Rechnungen','فاکتور'],['Drucker','der','Drucker','چاپگر'],
 ['Briefmarke','die','Briefmarken','تمبر'],['Kalender','der','Kalender','تقویم'],
 ['Telefon','das','Telefone','تلفن'],['E-Mail','die','E-Mails','ایمیل'],
 ['Computer','der','Computer','کامپیوتر'],['Stift','der','Stifte','قلم'],
 ['Bleistift','der','Bleistifte','مداد'],['Feuerzeug','das','Feuerzeuge','فندک']
 ],'office'),
 ...make([
 ['Tisch','der','Tische','میز'],['Stuhl','der','Stühle','صندلی'],['Lampe','die','Lampen','چراغ'],
 ['Bett','das','Betten','تخت'],['Buch','das','Bücher','کتاب'],['Tasche','die','Taschen','کیف'],
 ['Schlüssel','der','Schlüssel','کلید'],['Flasche','die','Flaschen','بطری'],
 ['Kind','das','Kinder','کودک'],['Mann','der','Männer','مرد']
 ],'review')
]);
export const FOUR_FORM_MODES=['article','plural','positive','negative'];
export const FOUR_FORM_LABELS={article:'آرتیکل مفرد',plural:'جمع',positive:'Akkusativ مثبت',negative:'Akkusativ منفی'};
export function fourFormAnswers(noun){
 const positive={der:'einen',die:'eine',das:'ein'}[noun.article];
 const negative={der:'keinen',die:'keine',das:'kein'}[noun.article];
 return {article:noun.article,plural:noun.plural,positive:positive+' '+noun.word,negative:negative+' '+noun.word};
}
const clean=value=>String(value??'').normalize('NFC').trim().replace(/\s+/g,' ');
export function gradeFourForms(noun,answers={}){
 const expected=fourFormAnswers(noun);
 return FOUR_FORM_MODES.map(mode=>({mode,expected:expected[mode],correct:clean(answers[mode])===expected[mode]}));
}
export const fourFormKey=(noun,mode)=>activityItemKey('four-form',noun.word,mode);
export function fourFormEvents(noun,answers){
 return gradeFourForms(noun,answers).map(result=>({
  id:fourFormKey(noun,result.mode),lesson:6,kind:result.mode==='article'?'article':result.mode==='plural'?'vocab':'grammar',
  label:result.mode==='article'?noun.article+' '+noun.word:result.mode==='plural'?'die '+noun.plural:result.expected,
  correct:result.correct,quiet:true
 }));
}
export function fourFormProgress(memory={},nouns=FOUR_FORM_NOUNS){
 const counts=Object.fromEntries(FOUR_FORM_MODES.map(mode=>[mode,nouns.filter(noun=>memory.items?.[fourFormKey(noun,mode)]?.lastCorrect===true).length]));
 return {counts,total:nouns.length*4,correct:Object.values(counts).reduce((a,b)=>a+b,0),
  allCorrect:nouns.filter(noun=>FOUR_FORM_MODES.every(mode=>memory.items?.[fourFormKey(noun,mode)]?.lastCorrect===true)).length};
}
