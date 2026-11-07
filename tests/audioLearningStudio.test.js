import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessons} from '../src/courseData.js';
import {lessonAudioCards,soundMeaningOptions,verifyAudioDictation,parseAudioLearningStats,audioLearningSummary,audioLearningItemKey,AUDIO_LEARNING_MODES} from '../src/audioLearningData.js';
import {scoreSpeechMatch} from '../src/speakingEngine.js';

test('all twelve lessons have unique illustrated prompts with valid German and Persian text',()=>{
 let all=0;
 for(const lesson of lessons){
  const cards=lessonAudioCards(lesson.id);
  assert.equal(cards.length,6,'lesson '+lesson.id);
  assert.equal(new Set(cards.map(c=>c.id)).size,cards.length);
  assert.equal(new Set(cards.map(c=>c.text)).size,cards.length);
  assert.ok(cards.every(c=>c.meaning&&c.scene&&c.lesson===lesson.id));
  assert.equal(soundMeaningOptions(cards,0).length,4);
  for(let index=0;index<cards.length;index++){
   const options=soundMeaningOptions(cards,index);
   assert.equal(options.length,4);
   assert.equal(new Set(options).size,4);
   assert.equal(options.filter(x=>x===cards[index].meaning).length,1);
  }
  all+=cards.length;
 }
 assert.equal(all,72);
 assert.deepEqual(lessonAudioCards(13),[]);
 const first=lessonAudioCards(1);
 assert.deepEqual(first.slice(0,4).map(c=>c.text),['Hallo!','Guten Morgen','Tschüs','Wie heißt du?']);
 assert.equal(first[0].scene,'greeting');
 assert.equal(first[1].scene,'sunrise');
});

test('dictation answer checks normalize punctuation and capitalization without leaking its target',()=>{
 assert.equal(verifyAudioDictation('Wie heißt du?','wie heißt du'),true);
 assert.equal(verifyAudioDictation('Guten Morgen','  GUTEN   MORGEN!  '),true);
 assert.equal(verifyAudioDictation('Tschüs','Tschüss'),false);
 assert.equal(verifyAudioDictation('Guten Morgen','Guten Abend'),false);
 assert.equal(verifyAudioDictation('Hallo!',''),false);
 assert.deepEqual(AUDIO_LEARNING_MODES.map(x=>x.id),['dictation','repeat','meaning']);
});

test('pronunciation scores are recognition transcript similarity, never predetermined mock data',()=>{
 assert.equal(scoreSpeechMatch('Guten Morgen','Guten Morgen','sentences').score,100);
 const poor=scoreSpeechMatch('Guten Morgen','Auf Wiedersehen','sentences').score;
 assert.ok(poor<80,poor);
 assert.notEqual(scoreSpeechMatch('Wie heißt du?','Wie heißt er?','sentences').score,100);
 const key=audioLearningItemKey(4,'a4-1','repeat');
 const stats=parseAudioLearningStats({
  completed:{[key]:true,'4:a4-1:dictation':true},
  speech:{[key]:{lesson:4,score:82,heard:'Hallo',at:123}},
  plays:{'4:a4-1:listen':3,'3:a3-1:listen':10}
 });
 assert.deepEqual(audioLearningSummary(stats,4),{completed:2,attempts:1,bestScore:82,plays:3});
 assert.deepEqual(audioLearningSummary(stats,3),{completed:0,attempts:0,bestScore:null,plays:10});
 assert.deepEqual(parseAudioLearningStats('{invalid'),{completed:{},speech:{},plays:{}});
});

test('lesson audio UI uses authored SVG, accessible microphone and quiz controls without uploads or host branding',()=>{
 const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
 const jsx=read('src/LessonAudioButtons.jsx');
 const art=read('src/AudioLessonArt.jsx');
 const styles=read('src/lessonAudioButtons.css');
 const wrapper=read('src/BookLessonPractice.jsx');
 assert.match(jsx,/getRecognizer/);
 assert.match(jsx,/scoreSpeechMatch/);
 assert.match(jsx,/onresult/);
 assert.match(jsx,/لازم نیست|تشخیص گفتار/);
 assert.match(jsx,/role="group" aria-label="انتخاب نوع تمرین صوتی"/);
 assert.match(jsx,/laAudioCard/);
 assert.match(jsx,/laQuizFeedback/);
 assert.match(jsx,/className="laExercisePlay"/);
 assert.match(jsx,/startsWith\('\/api\/audio\/stream\?'\)/);
 assert.match(wrapper,/LessonAudioButtons lessonId=\{lessonId\} speak=\{speak\} onPracticeEvent=\{onPracticeEvent\}/);
 for(const type of ['greeting','sunrise','goodbye','question','family','house','travel','shopping'])
  assert.match(art,new RegExp("kind==='"+type+"'"));
 assert.match(styles,/@media\(max-width:620px\)/);
 assert.match(styles,/prefers-reduced-motion:reduce/);
 assert.doesNotMatch(jsx,/Runflare|رانفلر|ZIP|آپلود|@aws|SECRET_ACCESS_KEY/);
});
