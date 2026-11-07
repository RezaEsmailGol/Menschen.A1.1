import {cloudAudioSettings,getCloudCatalog,getCloudAudioObject} from '../lib/cloudAudioS3.js';
import {safeBook,safeAudioRelativePath} from '../../src/cloudAudioCatalog.js';
import {audioMimeType} from '../../src/bookAudioSources.js';

export async function GET(request){
 const url=new URL(request.url);
 const book=url.searchParams.get('book');
 const path=url.searchParams.get('path');
 const jsonHeaders={'Cache-Control':'no-store'};
 if(!safeBook(book)||!safeAudioRelativePath(path))
  return Response.json({error:'فایل صوتی معتبر نیست.'},{status:400,headers:jsonHeaders});
 const range=request.headers.get('range');
 if(range&&!/^bytes=(?:\d+-\d*|-\d+)$/.test(range))
  return Response.json({error:'بازه صوتی معتبر نیست.'},{status:416,headers:jsonHeaders});
 const settings=cloudAudioSettings();
 if(!settings)return Response.json({error:'اتصال فضای ابری فعال نیست.'},{status:503,headers:jsonHeaders});
 try{
  const catalog=await getCloudCatalog(settings);
  if(!catalog.some(track=>track.book===book&&track.path===path))
   return Response.json({error:'قطعه صوتی در دوره پیدا نشد.'},{status:404,headers:jsonHeaders});
  const object=await getCloudAudioObject(settings,book,path,range);
  const headers=new Headers({
   'Content-Type':audioMimeType(path)||object.contentType,
   'Accept-Ranges':'bytes',
   'Cache-Control':'private,max-age=0,no-store',
   'Content-Disposition':'inline',
   'X-Content-Type-Options':'nosniff',
   'Referrer-Policy':'no-referrer'
  });
  if(Number.isFinite(object.contentLength))headers.set('Content-Length',String(object.contentLength));
  if(object.contentRange)headers.set('Content-Range',object.contentRange);
  return new Response(object.body,{status:object.contentRange?206:200,headers});
 }catch{
  return Response.json({error:'پخش صوت از فضای ابری امکان‌پذیر نشد.'},
    {status:502,headers:jsonHeaders});
 }
}
export default {fetch:GET};
