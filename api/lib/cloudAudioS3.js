import {S3Client,ListObjectsV2Command,GetObjectCommand} from '@aws-sdk/client-s3';
import {AUDIO_S3_BOOKS,audioPrefix,mapS3Objects,safeBook,safeAudioRelativePath} from '../../src/cloudAudioCatalog.js';

const CATALOG_TTL_MS=5*60*1000;
const SIGNED_URL_SECONDS=900;
let cached=null;

export function cloudAudioSettings(env=process.env){
 // Dedicated keys; never inherit a credential with broader Robatina permissions.
 const id=env.MENSCHEN_S3_ACCESS_KEY_ID;
 const secret=env.MENSCHEN_S3_SECRET_ACCESS_KEY;
 if(!id||!secret)return null;
 const endpoint=env.MENSCHEN_S3_ENDPOINT||'https://s3-pish.runflare.cloud';
 const bucket=env.MENSCHEN_S3_BUCKET||'robatina-visual-private';
 const region=env.MENSCHEN_S3_REGION||'us-east-1';
 let url;
 try{url=new URL(endpoint)}catch{return null}
 if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||
    !/^[a-zA-Z0-9.-]+$/.test(bucket)||!/^[a-zA-Z0-9-]+$/.test(region))return null;
 const prefixes=Object.fromEntries(AUDIO_S3_BOOKS.map(book=>[book,audioPrefix(book,env)]));
 if(AUDIO_S3_BOOKS.some(book=>!prefixes[book]))return null;
 if(Object.values(prefixes).some((p,i,arr)=>arr.some((other,j)=>i!==j&&(p===other||p.startsWith(other)||other.startsWith(p)))))return null;
 return {endpoint:url.origin,bucket,region,credentials:{accessKeyId:id,secretAccessKey:secret},prefixes};
}
function s3(settings){
 return new S3Client({
  endpoint:settings.endpoint,
  region:settings.region,
  forcePathStyle:true,
  credentials:settings.credentials,
  maxAttempts:2
 });
}
async function listFolder(client,settings,book){
 const prefix=settings.prefixes[book],objects=[];
 let token;
 do{
  const result=await client.send(new ListObjectsV2Command({
   Bucket:settings.bucket,Prefix:prefix,ContinuationToken:token,MaxKeys:1000
  }));
  for(const item of result.Contents||[])objects.push(item);
  token=result.IsTruncated?result.NextContinuationToken:null;
  if(objects.length>5000)throw new Error('Too many course audio objects');
 }while(token);
 return mapS3Objects(book,prefix,objects);
}
export async function getCloudCatalog(settings){
 if(!settings)return [];
 const cacheKey=JSON.stringify({endpoint:settings.endpoint,bucket:settings.bucket,prefixes:settings.prefixes,credentialId:settings.credentials.accessKeyId});
 if(cached?.key===cacheKey&&Date.now()<cached.expiresAt)return cached.tracks;
 const client=s3(settings);
 try{
  const parts=await Promise.all(AUDIO_S3_BOOKS.map(book=>listFolder(client,settings,book)));
  const tracks=parts.flat().sort((a,b)=>a.book.localeCompare(b.book)||
     (a.lesson??99)-(b.lesson??99)||a.filename.localeCompare(b.filename,'de',{numeric:true}));
  cached={key:cacheKey,expiresAt:Date.now()+CATALOG_TTL_MS,tracks};
  return tracks;
 }finally{client.destroy();}
}

export async function getCloudAudioObject(settings,book,path,range){
 const safe=safeAudioRelativePath(path);
 if(!settings||!safeBook(book)||!safe)throw new Error('Invalid audio object');
 const client=s3(settings);
 // Keep the client alive while Vercel streams the response body.
 const result=await client.send(new GetObjectCommand({
  Bucket:settings.bucket,Key:settings.prefixes[book]+safe,
  ...(range?{Range:range}:{})
 }));
 const body=result.Body?.transformToWebStream?.();
 if(!body)throw new Error('Storage did not return a streaming body');
 return {
  body,
  contentType:result.ContentType||'audio/mpeg',
  contentLength:result.ContentLength,
  contentRange:result.ContentRange||null
 };
}
export const cloudAudioInternals={CATALOG_TTL_MS};
