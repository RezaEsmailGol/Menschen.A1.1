// Shared pure validation. This file is safe to import by Vite and by Vercel Functions.
// Only the explicit German course prefixes may be addressed; Robatina keys remain unreachable.
export const AUDIO_S3_PREFIXES=Object.freeze({
 kursbuch:'german/Kursbucha101/',
 arbeitsbuch:'german/Arbeitsbucha101/'
});
export const AUDIO_S3_BOOKS=Object.freeze(Object.keys(AUDIO_S3_PREFIXES));
export const AUDIO_FILE_EXT=/\.(?:mp3|m4a|aac|ogg|wav|opus)$/i;
const DANGEROUS_ENCODED=/%(?:2e|2f|5c|00)/i;

export function safeAudioRelativePath(input){
 if(typeof input!=='string'||input.length<1||input.length>450)return null;
 if(input.includes('\\')||input.startsWith('/')||input.includes('\0')||DANGEROUS_ENCODED.test(input))return null;
 const parts=input.split('/');
 if(parts.some(p=>!p||p==='.'||p==='..'||p.length>240||/[\r\n\0]/.test(p)))return null;
 return AUDIO_FILE_EXT.test(parts.at(-1))?input:null;
}
export function safeBook(value){
 return AUDIO_S3_BOOKS.includes(value)?value:null;
}
export function parseAudioLesson(value){
 // The real user files are named "Lektion 1, 1.mp3", "Lektion 2, 3b.mp3"...
 const s=String(value||'').normalize('NFKC');
 const m=s.match(/(?:^|[\/_\s.-])(?:lektion|lesson|درس)[\s._,-]*0?([1-9]|1[0-2])(?=$|[\/_\s.,-])/i);
 return m?Number(m[1]):null;
}
export function audioTrackPublic(book,relativePath,bytes=0){
 if(!safeBook(book)||!safeAudioRelativePath(relativePath))return null;
 const filename=relativePath.split('/').at(-1);
 return {book,path:relativePath,filename,lesson:parseAudioLesson(relativePath),bytes:Number(bytes)||0};
}
export function audioPrefix(book,env={}){
 if(!safeBook(book))return null;
 const override=book==='kursbuch'?env.MENSCHEN_S3_KURSBUCH_PREFIX:env.MENSCHEN_S3_ARBEITSBUCH_PREFIX;
 const prefix=override||AUDIO_S3_PREFIXES[book];
 // Config may only address German lessons, never another application path in the shared bucket.
 if(!/^german\/[a-zA-Z0-9 _-]+(?:\/[a-zA-Z0-9 _-]+)*\/$/.test(prefix)||prefix.includes('..'))return null;
 return prefix;
}
export function mapS3Objects(book,prefix,objects=[]){
 const result=[];
 for(const item of objects){
  if(!item?.Key?.startsWith(prefix))continue;
  const path=item.Key.slice(prefix.length);
  const track=audioTrackPublic(book,path,item.Size);
  if(track)result.push(track);
 }
 return result;
}
export function filterAudioLesson(tracks,lesson){
 const n=Number(lesson);
 if(!Number.isInteger(n)||n<1||n>12)return null;
 return tracks.filter(t=>t.lesson===n);
}
export function readCloudTaskMap(){
 if(typeof localStorage==='undefined')return {};
 try{
  const value=JSON.parse(localStorage.getItem('dt_menschen_cloud_audio_tasks_v1')||'{}');
  return value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 }catch{return {};}
}
export function writeCloudTaskMap(map){
 if(typeof localStorage==='undefined')return false;
 try{localStorage.setItem('dt_menschen_cloud_audio_tasks_v1',JSON.stringify(map));return true;}catch{return false;}
}
