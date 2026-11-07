import {cloudAudioSettings,getCloudCatalog,signCloudTrack} from '../lib/cloudAudioS3.js';
import {safeBook,safeAudioRelativePath} from '../../src/cloudAudioCatalog.js';

export async function GET(request){
 const url=new URL(request.url);
 const book=url.searchParams.get('book');
 const path=url.searchParams.get('path');
 if(!safeBook(book)||!safeAudioRelativePath(path))
  return Response.json({error:'فایل صوتی انتخابی معتبر نیست.'},{status:400,headers:{'Cache-Control':'no-store'}});
 const settings=cloudAudioSettings();
 if(!settings)return Response.json({error:'اتصال امن صوت ابری هنوز فعال نشده است.'},
   {status:503,headers:{'Cache-Control':'no-store'}});
 try{
  const all=await getCloudCatalog(settings);
  if(!all.some(t=>t.book===book&&t.path===path))
   return Response.json({error:'فایل صوتی در کتابخانه دوره پیدا نشد.'},
     {status:404,headers:{'Cache-Control':'no-store'}});
  const signed=await signCloudTrack(settings,book,path,all);
  return Response.json(signed,{headers:{'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
 }catch{
  return Response.json({error:'ساخت لینک موقت پخش صوت انجام نشد.'},
   {status:502,headers:{'Cache-Control':'no-store'}});
 }
}
export default {fetch:GET};
