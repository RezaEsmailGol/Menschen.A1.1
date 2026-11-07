import {
  AUDIO_EXTENSIONS,MAX_AUDIO_FILE_BYTES,MAX_AUDIO_FILES,MAX_ARCHIVE_BYTES,
  validAudioFileName,audioMimeType,trackId,detectAudioLesson,validateAudioImport
} from './bookAudioSources.js';

const DB_NAME='menschen_a11_personal_book_audio';
const DB_VERSION=1;
const STORE='tracks';

function dbOpen(){
 return new Promise((resolve,reject)=>{
  if(typeof indexedDB==='undefined')return reject(new Error('این مرورگر حافظه محلی صوتی IndexedDB ندارد.'));
  const req=indexedDB.open(DB_NAME,DB_VERSION);
  req.onupgradeneeded=()=>{
   const db=req.result;
   if(!db.objectStoreNames.contains(STORE)){
    const store=db.createObjectStore(STORE,{keyPath:'id'});
    store.createIndex('byLesson','lesson',{unique:false});
   }
  };
  req.onerror=()=>reject(req.error||new Error('دسترسی به حافظه صوتی امکان‌پذیر نیست.'));
  req.onsuccess=()=>resolve(req.result);
 });
}
function requestResult(request){
 return new Promise((resolve,reject)=>{
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error||new Error('خطای ذخیره فایل صوتی'));
 });
}
async function transaction(operation,mode='readonly'){
 const db=await dbOpen();
 try{
  const tx=db.transaction(STORE,mode);
  const result=await operation(tx.objectStore(STORE));
  await new Promise((resolve,reject)=>{
   tx.oncomplete=resolve;
   tx.onabort=()=>reject(tx.error||new Error('ذخیره فایل به دلیل کمبود فضا متوقف شد.'));
   tx.onerror=()=>reject(tx.error||new Error('خطا در حافظه صوتی.'));
  });
  return result;
 }finally{db.close();}
}
export function listBookAudio(){
 return transaction(async store=>{
  const records=await requestResult(store.getAll());
  return records.map(({blob,...meta})=>meta).sort((a,b)=>
   a.book.localeCompare(b.book)||a.filename.localeCompare(b.filename,'de',{numeric:true}));
 });
}
export function getBookAudio(id){
 return transaction(store=>requestResult(store.get(String(id))));
}
export async function saveBookAudio({book,path,blob,lesson=null}){
 if(!validAudioFileName(path)||!(blob instanceof Blob))throw new Error('فایل صوتی پشتیبانی نمی‌شود.');
 if(blob.size<=0||blob.size>MAX_AUDIO_FILE_BYTES)throw new Error('هر فایل صوتی باید کمتر از ۳۵ مگابایت باشد.');
 if(lesson!==null&&(!Number.isInteger(lesson)||lesson<1||lesson>12))throw new Error('شماره درس نامعتبر است.');
 const record={
  id:trackId(book,path),filename:path.replace(/\\/g,'/'),book,lesson,
  bytes:blob.size,mime:audioMimeType(path),blob,
  importedAt:Date.now()
 };
 await transaction(store=>requestResult(store.put(record)),'readwrite');
 return {id:record.id,filename:record.filename,book,lesson,bytes:record.bytes};
}
export async function setBookAudioLesson(id,lesson){
 if(lesson!==null&&(!Number.isInteger(lesson)||lesson<1||lesson>12))throw new Error('شماره درس نامعتبر است.');
 return transaction(async store=>{
  const found=await requestResult(store.get(String(id)));
  if(!found)throw new Error('فایل پیدا نشد.');
  await requestResult(store.put({...found,lesson}));
 },'readwrite');
}
export async function removeBookAudio(id){
 return transaction(store=>requestResult(store.delete(String(id))),'readwrite');
}
// Only the user-supplied local file is unpacked, entirely inside their own browser.
// No server-side upload, copyrighted media mirror, telemetry or remote fetch.
export async function importBookAudioFiles(files,{book,lesson=null,onProgress}={}){
 const input=Array.from(files||[]);
 if(!input.length)throw new Error('ابتدا فایل ZIP یا MP3 را انتخاب کن.');
 if(!['kursbuch','arbeitsbuch'].includes(book))throw new Error('نوع کتاب نامعتبر است.');
 const all=[];
 for(const file of input){
  if(/\.zip$/i.test(file.name)){
   validateAudioImport(1,file.size);
   const {default:JSZip}=await import('jszip');
   const zip=await JSZip.loadAsync(file);
   const entries=Object.values(zip.files).filter(entry=>!entry.dir&&validAudioFileName(entry.name));
   if(!entries.length)throw new Error('در ZIP فایل صوتی MP3 یا WAV پیدا نشد.');
   if(entries.length>MAX_AUDIO_FILES)throw new Error('فایل ZIP بیش از ۲۵۰ قطعه دارد.');
   // JSZip uses the central-directory uncompressed size, if available.
   for(const entry of entries){
    const expected=Number(entry?._data?.uncompressedSize||0);
    if(expected>MAX_AUDIO_FILE_BYTES)throw new Error('یکی از قطعه‌ها بیش از ۳۵ مگابایت است.');
    all.push({path:entry.name,load:()=>entry.async('blob')});
   }
  }else if(validAudioFileName(file.name)){
   all.push({path:file.name,load:async()=>file});
  }else{
   throw new Error('فایل نامعتبر است؛ تنها ZIP و MP3/M4A/OGG/WAV مجاز هستند.');
  }
 }
 if(!all.length||all.length>MAX_AUDIO_FILES)throw new Error('تعداد قطعه‌های صوتی خارج از محدوده ۱ تا ۲۵۰ است.');
 let imported=0;
 for(const item of all){
  const blob=await item.load();
  const detected=detectAudioLesson(item.path);
  await saveBookAudio({book,path:item.path,blob,lesson:detected??lesson});
  imported++;
  onProgress?.(imported,all.length);
 }
 return imported;
}
// LocalStorage stores *only* user-to-exercise mapping; never copyrighted bytes.
const TASK_STORE='dt_book_audio_task_map_v1';
export function readAudioTaskMap(){
 try{
  const parsed=JSON.parse(localStorage.getItem(TASK_STORE)||'{}');
  return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};
 }catch{return {};}
}
export function saveAudioTaskMap(map){
 try{localStorage.setItem(TASK_STORE,JSON.stringify(map));return true;}
 catch{return false;}
}
