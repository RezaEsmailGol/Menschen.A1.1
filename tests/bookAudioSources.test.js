import test from 'node:test';
import assert from 'node:assert/strict';
import {
 BOOK_AUDIO_REFERENCES,AUDIO_BOOKS,MAX_ARCHIVE_BYTES,
 validAudioFileName,audioFileDisplayName,audioMimeType,
 detectAudioLesson,trackId,validateAudioImport
} from '../src/bookAudioSources.js';
import {courseLessonOutlines} from '../src/lessonOutline.js';
import {lessonModuleHref} from '../src/lessonExerciseLinks.js';

test('Menschen A1.1 audio source URLs are external and provenance is preserved',()=>{
 assert.equal(BOOK_AUDIO_REFERENCES.length,2);
 assert.deepEqual(AUDIO_BOOKS.map(b=>b.id),['kursbuch','arbeitsbuch']);
 for(const source of BOOK_AUDIO_REFERENCES){
  assert.equal(new URL(source.url).protocol,'https:');
  assert.ok(source.name.length>8);
  assert.ok(!source.url.includes('vercel.app'));
 }
 assert.equal(BOOK_AUDIO_REFERENCES[0].url,'https://www.hueber.de/reihe/menschen/lernen');
 assert.equal(BOOK_AUDIO_REFERENCES[1].url,'https://pouriyakhani.com/menschen-book/');
});

test('only recognized audio entries are imported; zip-slip names are rejected',()=>{
 for(const name of ['Track_01.mp3','Lektion04_Tisch.wav','Kursbuch/Lektion04_Moebel.m4a','Arbeitsbuch/03.ogg','sieben.opus','foo.aac'])
  assert.equal(validAudioFileName(name),true,name);
 for(const name of ['/../../../track.mp3','../track.mp3','folder/../track.mp3','track.exe','something.mp3.exe','../a.wav','folder//track.mp3']){
  assert.equal(validAudioFileName(name),false,name);
 }
 assert.equal(audioMimeType('test.MP3'),'audio/mpeg');
 assert.equal(audioMimeType('foo.wav'),'audio/wav');
 assert.equal(audioFileDisplayName('Lesson04/Track 01.mp3'),'Track 01.mp3');
 assert.equal(trackId('kursbuch','Lesson04/Track 01.MP3'),'kursbuch:lesson04/track 01.mp3');
 assert.throws(()=>trackId('invalid','Lesson04/track.mp3'),/Invalid/);
 assert.throws(()=>trackId('kursbuch','../track.mp3'),/Invalid/);
});

test('detect known lesson naming and never guess from the generic track number',()=>{
 for(const [name,lesson] of [
   ['lektion4_tisch.mp3',4],
   ['lektion04_tisch.mp3',4],
   ['LEKTION-05-Buch.wav',5],
   ['course/lektion1/track01.mp3',1],
   ['lesson_12_unit.mp3',12],
   ['02_track.mp3',null],
   ['track_12.wav',null],
   ['Lektion13_foo.mp3',null],
   ['lesson14_track.mp3',null],
   ['lektion0_foo.mp3',null],
   ['einfach.mp3',null]
 ])assert.equal(detectAudioLesson(name),lesson,name);
});

test('imports are limited and cannot allocate huge zip bomb or massive audio',()=>{
 assert.equal(validateAudioImport(25,67800000),true);
 assert.throws(()=>validateAudioImport(0,100),/تعداد/);
 assert.throws(()=>validateAudioImport(251,100),/تعداد/);
 assert.throws(()=>validateAudioImport(3,MAX_ARCHIVE_BYTES+1),/ZIP/);
 assert.throws(()=>validateAudioImport(3,-1),/ZIP/);
});

test('all 12 lessons link to the library, without claiming they ship licensed audio',()=>{
 for(const lesson of courseLessonOutlines){
  const audio=lesson.modules.find(m=>m.kind==='audio');
  assert.ok(audio,'missing audio module on lesson '+lesson.id);
  assert.equal(audio.available,true);
  assert.equal(lessonModuleHref(lesson.id,'audio'),'/lessons/'+lesson.id+'#lesson-audio');
  assert.match(audio.description,/ZIP یا MP3/);
 }
});
