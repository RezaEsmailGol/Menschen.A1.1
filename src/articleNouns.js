// Original learning bank, based on the learner's list and the lesson 6 topic.
// Article + noun is the canonical unit; plural and object images are independent.
const rows=[
[4,'das','Bett','تخت','Betten','🛏️'],
[4,'das','Bild','تابلو / تصویر','Bilder','🖼️'],
[4,'der','Sessel','مبل تک‌نفره','Sessel','🛋️'],
[4,'die','Lampe','چراغ','Lampen','💡'],
[4,'der','Stuhl','صندلی','Stühle','🪑'],
[4,'das','Sofa','مبل','Sofas','🛋️'],
[4,'die','Couch','کاناپه','Couches','🛋️'],
[4,'der','Tisch','میز','Tische','🪑'],
[4,'der','Schrank','کمد','Schränke','🗄️'],
[4,'der','Teppich','فرش','Teppiche','🧶'],
[5,'der','Bleistift','مداد','Bleistifte','✏️'],
[5,'die','Brille','عینک','Brillen','👓'],
[5,'das','Buch','کتاب','Bücher','📘'],
[5,'die','Flasche','بطری','Flaschen','🍶'],
[5,'das','Feuerzeug','فندک','Feuerzeuge','🔥'],
[5,'der','Fotoapparat','دوربین عکاسی','Fotoapparate','📷'],
[5,'die','Kette','گردنبند','Ketten','📿'],
[5,'der','Kugelschreiber','خودکار','Kugelschreiber','🖊️'],
[5,'der','Schlüssel','کلید','Schlüssel','🔑'],
[5,'die','Tasche','کیف','Taschen','👜'],
[5,'die','Uhr','ساعت','Uhren','⌚'],
[5,'der','Schirm','چتر','Schirme','☂️'],
[5,'die','Geldbörse','کیف پول','Geldbörsen','👛'],
[5,'die','Seife','صابون','Seifen','🧼'],
[6,'der','Laptop','لپ‌تاپ','Laptops','💻'],
[6,'die','E-Mail','ایمیل','E-Mails','📧'],
[6,'das','Handy','موبایل','Handys','📱'],
[6,'das','Telefon','تلفن','Telefone','☎️'],
[6,'das','Formular','فرم','Formulare','📋'],
[6,'der','Drucker','چاپگر','Drucker','🖨️'],
[6,'die','Maus','ماوس رایانه','Mäuse','🖱️'],
[6,'der','Computer','کامپیوتر','Computer','🖥️'],
[6,'der','Stift','قلم','Stifte','🖊️'],
[6,'der','Kalender','تقویم','Kalender','📅'],
[6,'der','Bildschirm','نمایشگر','Bildschirme','🖥️'],
// Further relevant singular nouns. These are optional, not part of the requested 35.
[4,'das','Regal','قفسه','Regale','🗄️'],
[4,'der','Spiegel','آینه','Spiegel','🪞'],
[5,'das','Streichholz','کبریت','Streichhölzer','🔥'],
[6,'das','Büro','دفتر کار','Büros','🏢'],
[6,'die','SMS','پیامک','SMS','💬'],
[6,'die','Rechnung','صورتحساب','Rechnungen','🧾'],
[6,'die','Briefmarke','تمبر','Briefmarken','✉️'],
[6,'das','Notizbuch','دفترچه یادداشت','Notizbücher','📓'],
[6,'der','Termin','قرار ملاقات','Termine','📅'],
[6,'der','Arbeitsplatz','محل کار','Arbeitsplätze','💼']
];
export const articleNouns=Object.freeze(rows.map(([lesson,article,noun,fa,plural,icon],i)=>Object.freeze({lesson,article,noun,fa,plural,icon,core:i<35,word:article+' '+noun})));
export const coreArticleNouns=articleNouns.filter(x=>x.core);
export const CASE_FORMS=Object.freeze({
 der:{def:'den',ind:'einen',neg:'keinen',nomInd:'ein',nomNeg:'kein',datDef:'dem',datInd:'einem',datNeg:'keinem',pronoun:'er'},
 die:{def:'die',ind:'eine',neg:'keine',nomInd:'eine',nomNeg:'keine',datDef:'der',datInd:'einer',datNeg:'keiner',pronoun:'sie'},
 das:{def:'das',ind:'ein',neg:'kein',nomInd:'ein',nomNeg:'kein',datDef:'dem',datInd:'einem',datNeg:'keinem',pronoun:'es'}
});
