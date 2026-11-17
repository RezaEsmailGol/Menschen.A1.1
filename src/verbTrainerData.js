import {pronouns,verbForms} from './courseData.js';

export const verbInfo=Object.freeze({
  sein:{fa:'بودن',source:'مرور درس‌های قبل',example:'Das ist kein Buch.',exampleFa:'این کتاب نیست.'},
  haben:{fa:'داشتن',source:'کتاب · درس ۵ و ۶',example:'Ich habe keinen Drucker.',exampleFa:'من چاپگر ندارم.'},
  finden:{fa:'پیدا کردن / به نظر آمدن',source:'کتاب · درس ۵',example:'Ich finde das Sofa schön.',exampleFa:'من مبل را زیبا می‌دانم.'},
  kosten:{fa:'قیمت داشتن',source:'کتاب · درس ۵',example:'Die Couch kostet 299 Euro.',exampleFa:'کاناپه ۲۹۹ یورو قیمت دارد.'},
  leben:{fa:'زندگی کردن',source:'کتاب · درس ۵',example:'Ich lebe in Deutschland.',exampleFa:'من در آلمان زندگی می‌کنم.'},
  arbeiten:{fa:'کار کردن',source:'کتاب · درس ۶',example:'Ich arbeite im Büro.',exampleFa:'من در دفتر کار می‌کنم.'},
  sehen:{fa:'دیدن',source:'کتاب و تخته کلاس',example:'Ich sehe den Laptop.',exampleFa:'من لپ‌تاپ را می‌بینم.'},
  hören:{fa:'شنیدن',source:'کتاب · درس ۶',example:'Ich höre die Musik.',exampleFa:'من موسیقی را می‌شنوم.'},
  lesen:{fa:'خواندن',source:'کتاب و تخته کلاس',example:'Ich lese ein Buch.',exampleFa:'من یک کتاب می‌خوانم.'},
  brauchen:{fa:'نیاز داشتن',source:'کتاب · درس ۶',example:'Ich brauche einen Laptop.',exampleFa:'من به یک لپ‌تاپ نیاز دارم.'},
  suchen:{fa:'جست‌وجو کردن',source:'کتاب · درس ۶',example:'Ich suche den Kalender.',exampleFa:'من دنبال تقویم می‌گردم.'},
  schreiben:{fa:'نوشتن',source:'کتاب · درس ۶',example:'Ich schreibe eine E-Mail.',exampleFa:'من یک ایمیل می‌نویسم.'},
  möchten:{fa:'مایل بودن / خواستن مؤدبانه',source:'کتاب و تخته کلاس',example:'Ich möchte ins Café gehen.',exampleFa:'من مایلم به کافه بروم.',modal:true,note:'بعد از möchte، فعل اصلی به شکل مصدر در پایان جمله می‌آید.'},
  gehen:{fa:'رفتن پیاده',source:'کتاب · درس ۶',example:'Ich gehe ins Büro.',exampleFa:'من به دفتر کار می‌روم.'},
  fahren:{fa:'راندن / رفتن با وسیله',source:'تخته کلاس',example:'Ich fahre Auto.',exampleFa:'من رانندگی می‌کنم.'},
  treffen:{fa:'ملاقات کردن',source:'تخته کلاس',example:'Ich treffe dich heute.',exampleFa:'من امروز تو را ملاقات می‌کنم.'},
  besuchen:{fa:'دیدار کردن / سر زدن',source:'تخته کلاس',example:'Ich besuche meinen Freund.',exampleFa:'من به دیدن دوستم می‌روم.'},
  können:{fa:'توانستن',source:'تخته کلاس',example:'Ich kann Deutsch sprechen.',exampleFa:'من می‌توانم آلمانی صحبت کنم.',modal:true,note:'بعد از kann، فعل اصلی به شکل مصدر در پایان جمله می‌آید.'},
  wollen:{fa:'خواستن',source:'تخته کلاس',example:'Ich will das Buch lesen.',exampleFa:'من می‌خواهم کتاب را بخوانم.',modal:true,note:'بعد از will، فعل اصلی به شکل مصدر در پایان جمله می‌آید.'},
  müssen:{fa:'باید / مجبور بودن',source:'تمرین تکمیلی کلاس',example:'Ich muss arbeiten.',exampleFa:'من باید کار کنم.',modal:true,note:'شکل ich و er/sie/es برابر muss است؛ فعل اصلی به صورت مصدر در پایان می‌آید.'},
  kommen:{fa:'آمدن',source:'مرور درس‌های قبل',example:'Ich komme aus dem Iran.',exampleFa:'من اهل ایران هستم.'},
  heißen:{fa:'نام داشتن',source:'مرور درس‌های قبل',example:'Ich heiße Reza.',exampleFa:'اسم من رضاست.'},
  sprechen:{fa:'صحبت کردن',source:'مرور درس‌های قبل',example:'Ich spreche Deutsch.',exampleFa:'من آلمانی صحبت می‌کنم.'},
  machen:{fa:'انجام دادن',source:'مرور درس‌های قبل',example:'Was machst du?',exampleFa:'چه کار می‌کنی؟'},
  schicken:{fa:'فرستادن',source:'کتاب · درس ۶',example:'Ich schicke eine E-Mail.',exampleFa:'من یک ایمیل می‌فرستم.'}
});

export const verbGroups=Object.freeze([
 {id:'lesson56',label:'افعال کتاب · درس ۵ و ۶',verbs:['haben','finden','kosten','leben','arbeiten','sehen','hören','lesen','brauchen','suchen','schreiben','möchten','gehen','schicken']},
 {id:'class',label:'افعال تخته کلاس',verbs:['fahren','treffen','besuchen','können','wollen','müssen','lesen','sehen']},
 {id:'review',label:'مرور درس‌های قبل',verbs:['sein','kommen','heißen','sprechen','machen','haben']},
 {id:'all',label:'همه افعال',verbs:Object.keys(verbInfo)}
]);

export {pronouns};
export function getVerbForms(infinitive){
 const forms=verbForms[infinitive];
 if(!forms)return null;
 return Object.fromEntries(pronouns.map((person,index)=>[person,forms[index]]));
}
