import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 AUDIO_S3_PREFIXES,safeBook,safeAudioRelativePath,
 parseAudioLesson,audioPrefix,mapS3Objects,filterAudioLesson
} from '../src/cloudAudioCatalog.js';
import {cloudAudioSettings} from '../api/lib/cloudAudioS3.js';
import {GET as catalogGET} from '../api/audio/catalog.js';
import {GET as playGET} from '../api/audio/play.js';
import {GET as streamGET} from '../api/audio/stream.js';

test('uploaded audio filename "Lektion 1, 1.mp3" maps to lesson 1; 1–12 work',()=>{
 const cases=[
  ['Lektion 1, 1.mp3',1],['Lektion 1, 2a.mp3',1],['Lektion 2, 3b.mp3',2],
  ['Lektion 4, 4b.mp3',4],['Lektion 12, 8.mp3',12],['Intro.mp3',null],
  ['Track 1.mp3',null],['Lektion 14, 1.mp3',null]
 ];
 for(const [name,expected] of cases)assert.equal(parseAudioLesson(name),expected,name);
});
test('Runflare S3 object paths are allowlisted to Menschen prefixes',()=>{
 assert.equal(AUDIO_S3_PREFIXES.kursbuch,'german/Kursbucha101/');
 assert.equal(AUDIO_S3_PREFIXES.arbeitsbuch,'german/Arbeitsbucha101/');
 for(const invalid of ['../rob.mp3','folder/../../rob.mp3','/rob.mp3',
  'folder//file.mp3','some\\file.mp3','note.html','anything.mp3%2f..%2frob.mp3',
  '', 'x'.repeat(460)+'.mp3'])
  assert.equal(safeAudioRelativePath(invalid),null,invalid);
 assert.equal(safeBook('robatina'),null);
 assert.equal(safeBook('kursbuch'),'kursbuch');
 assert.equal(safeAudioRelativePath('Lektion 4, 2.mp3'),'Lektion 4, 2.mp3');
 const objects=[
  {Key:'german/Kursbucha101/Lektion 4, 2.mp3',Size:4001},
  {Key:'german/Kursbucha101/Intro.mp3',Size:235},
  {Key:'german/Kursbucha101/../../robatina/secret.mp3',Size:90},
  {Key:'robatina/personal/photo.mp3',Size:200},
  {Key:'german/Arbeitsbucha101/Lektion 4, 2.mp3',Size:300},
  {Key:'german/Kursbucha101/note.txt',Size:3}
 ];
 const mapped=mapS3Objects('kursbuch',AUDIO_S3_PREFIXES.kursbuch,objects);
 assert.equal(mapped.length,2);
 assert.equal(filterAudioLesson(mapped,4).length,1);
 assert.equal(filterAudioLesson(mapped,11).length,0);
 assert.equal(filterAudioLesson(mapped,0),null);
 assert.equal(mapped[0].bytes,4001);
});
test('server-only S3 credentials cannot be inherited from Robatina or frontend',()=>{
 assert.equal(cloudAudioSettings({AWS_ACCESS_KEY_ID:'public-risk',AWS_SECRET_ACCESS_KEY:'risk'}),null);
 const input={
  MENSCHEN_S3_ACCESS_KEY_ID:'test-id',MENSCHEN_S3_SECRET_ACCESS_KEY:'test-secret',
  MENSCHEN_S3_ENDPOINT:'https://s3-pish.runflare.cloud',
  MENSCHEN_S3_BUCKET:'robatina-visual-private',
  MENSCHEN_S3_REGION:'us-east-1'
 };
 const config=cloudAudioSettings(input);
 assert.equal(config.bucket,'robatina-visual-private');
 assert.equal(config.prefixes.kursbuch,'german/Kursbucha101/');
 assert.equal(config.credentials.secretAccessKey,'test-secret');
 assert.equal(cloudAudioSettings({...input,MENSCHEN_S3_KURSBUCH_PREFIX:'robatina-private/'}),null);
 assert.equal(cloudAudioSettings({...input,MENSCHEN_S3_KURSBUCH_PREFIX:'german/Arbeitsbucha101/'}),null);
 assert.equal(cloudAudioSettings({...input,MENSCHEN_S3_ENDPOINT:'http://internal-ip'}),null);
 for(const path of ['src/CloudAudioLibrary.jsx','src/BookAudioLibrary.jsx','src/BookLessonPractice.jsx']){
  const source=readFileSync(new URL('../'+path,import.meta.url),'utf8');
  assert.ok(!source.includes('MENSCHEN_S3_ACCESS_KEY_ID'),path);
  assert.ok(!source.includes('MENSCHEN_S3_SECRET_ACCESS_KEY'),path);
  assert.ok(!source.includes('s3-pish.runflare.cloud'),path);
 }
 const proxy=readFileSync(new URL('../api/audio/play.js',import.meta.url),'utf8');
 assert.ok(proxy.includes('/api/audio/stream?'));
 assert.ok(!proxy.includes('getSignedUrl'));
 const streaming=readFileSync(new URL('../api/audio/stream.js',import.meta.url),'utf8');
 assert.ok(streaming.includes("'Accept-Ranges':'bytes'"));
 assert.ok(!streaming.includes('getSignedUrl'));
});
test('APIs reject arbitrary object names before credentials or S3 requests',async()=>{
 for(const [method,url,expected] of [
  [catalogGET,'https://example.test/api/audio/catalog?lesson=13',400],
  [playGET,'https://example.test/api/audio/play?book=robatina&path=photo.mp3',400],
  [playGET,'https://example.test/api/audio/play?book=kursbuch&path=../photo.mp3',400],
  [streamGET,'https://example.test/api/audio/stream?book=kursbuch&path=../photo.mp3',400],
  [streamGET,'https://example.test/api/audio/stream?book=arbeitsbuch&path=picture.jpg',400]
 ]){
  const response=await method(new Request(url));
  assert.equal(response.status,expected,url);
  assert.equal(response.headers.get('cache-control'),'no-store');
 }
 const ranged=await streamGET(new Request('https://example.test/api/audio/stream?book=kursbuch&path=Lektion%204%2C%202.mp3',
   {headers:{Range:'bytes=0-100,300-500'}}));
 assert.equal(ranged.status,416);
});
