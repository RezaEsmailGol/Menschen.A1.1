import {cloudAudioSettings,getCloudCatalog} from '../lib/cloudAudioS3.js';
import {filterAudioLesson} from '../../src/cloudAudioCatalog.js';

export async function GET(request){
 const url=new URL(request.url);
 const lesson=url.searchParams.get('lesson');
 if(lesson!=='all'&&!/^(?:[1-9]|1[0-2])$/.test(String(lesson)))
  return Response.json({error:'شماره درس باید بین ۱ تا ۱۲ باشد.'},{status:400,headers:{'Cache-Control':'no-store'}});
 const settings=cloudAudioSettings();
 if(!settings)return Response.json({
  configured:false,tracks:[],lesson:lesson==='all'?'all':Number(lesson),
  message:'اتصال فضای ابری هنوز در تنظیمات امن سرور فعال نشده است.'
 },{headers:{'Cache-Control':'no-store'}});
 try{
  const all=await getCloudCatalog(settings);
  const tracks=lesson==='all'?all:filterAudioLesson(all,lesson);
  // Counts inform the user if wrong folder prefix was configured.
  return Response.json({configured:true,tracks,lesson:lesson==='all'?'all':Number(lesson),
   totals:{kursbuch:all.filter(t=>t.book==='kursbuch').length,
     arbeitsbuch:all.filter(t=>t.book==='arbeitsbuch').length},
   uncategorized:all.filter(t=>t.lesson===null).length
  },{headers:{'Cache-Control':'public,max-age=30,s-maxage=120'}});
 }catch{
  return Response.json({configured:true,tracks:[],error:'دریافت فهرست صوتی از سرور ابری انجام نشد.'},
   {status:502,headers:{'Cache-Control':'no-store'}});
 }
}
export default {fetch:GET};
