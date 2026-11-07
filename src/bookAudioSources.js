// References to the user's resource page and the publisher's media service.
// Audio recordings are copyrighted: the app never bundles, proxies, or rehosts them.
export const BOOK_AUDIO_REFERENCES=Object.freeze([
  {id:'hueber',name:'Hueber · منبع رسمی ناشر',
    url:'https://www.hueber.de/reihe/menschen/lernen',
    details:'Hueber Media و منابع آموزشی رسمی Menschen A1.1'},
  {id:'pouriyakhani',name:'صفحه منابع Menschen · پوریا خانی',
    url:'https://pouriyakhani.com/menschen-book/',
    details:'لینک دریافت بسته صوتی Kursbuch و Arbeitsbuch A1.1؛ حقوق ناشر محفوظ'}
]);
export const AUDIO_BOOKS=Object.freeze([
 {id:'kursbuch',name:'Kursbuch',fa:'کتاب اصلی'},
 {id:'arbeitsbuch',name:'Arbeitsbuch',fa:'کتاب کار'}
]);
export const MAX_AUDIO_FILES=250;
export const MAX_AUDIO_FILE_BYTES=35*1024*1024;
export const MAX_ARCHIVE_BYTES=125*1024*1024;
export const AUDIO_EXTENSIONS=/\.(?:mp3|m4a|aac|ogg|wav|opus)$/i;

export function validAudioFileName(path=''){
  const p=String(path).replace(/\\/g,'/');
  return AUDIO_EXTENSIONS.test(p)&&!p.split('/').some(seg=>seg==='..'||!seg);
}
export function audioFileDisplayName(path=''){
  return String(path).replace(/\\/g,'/').split('/').pop()||'Audio';
}
export function audioMimeType(path=''){
  const extension=String(path).split('.').pop().toLowerCase();
  return {mp3:'audio/mpeg',m4a:'audio/mp4',aac:'audio/aac',ogg:'audio/ogg',wav:'audio/wav',opus:'audio/opus'}[extension]||'';
}
// Be conservative: track "02" does not necessarily mean lesson 2.
// Only confidently named lessons become auto-associated; other tracks stay in "unassigned".
export function detectAudioLesson(path=''){
  const normalized=String(path).replace(/\\/g,'/');
  const match=normalized.match(/(?:^|[\/_\s.-])(?:lektion|lesson|lekti[oó]n|le[cç]on|درس)[\s._-]*0?([1-9]|1[0-2])(?=$|[\/_\s.-])/i);
  if(!match)return null;
  const lesson=Number(match[1]);
  return lesson>=1&&lesson<=12?lesson:null;
}
export function trackId(book,path){
 if(!AUDIO_BOOKS.some(b=>b.id===book)||!validAudioFileName(path))throw new Error('Invalid audio track');
 return book+':'+String(path).replace(/\\/g,'/').toLowerCase();
}
export function validateAudioImport(fileCount,archiveSize){
 if(!Number.isSafeInteger(fileCount)||fileCount<=0||fileCount>MAX_AUDIO_FILES)throw new Error('تعداد فایل‌های صوتی باید بین ۱ تا ۲۵۰ باشد.');
 if(!Number.isFinite(archiveSize)||archiveSize<=0||archiveSize>MAX_ARCHIVE_BYTES)throw new Error('حجم فایل ZIP از سقف مجاز ۱۲۵ مگابایت بیشتر است.');
 return true;
}
