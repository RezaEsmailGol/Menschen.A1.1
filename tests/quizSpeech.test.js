import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {germanNumber} from '../src/learningData.js';

const src=name=>readFileSync(new URL('../src/'+name,import.meta.url),'utf8');
test('German choice playback respects letters, numbers, phrases and avoids Farsi narration',async()=>{
 const {germanChoiceAudio}=await import('../src/useQuizQuestionAudio.js');
 assert.equal(germanChoiceAudio('Stadt'),'Stadt');
 assert.equal(germanChoiceAudio('Ich komme aus dem Iran.'),'Ich komme aus dem Iran.');
 assert.equal(germanChoiceAudio('ß'),'Eszett');
 for(const n of [0,1,10,12,20,99,100]){
  assert.equal(germanChoiceAudio(String(n)),germanNumber(n));
 }
 for(const value of ['',null,undefined,'سلام','۳','101','100000']){
  assert.equal(germanChoiceAudio(value),null);
 }
});
test('all primary listening exams contain a keyed automatic-speech hook and manual replay',()=>{
 for(const file of ['WorkbookChallenge.jsx','NumberRecallGame.jsx','TeacherWorkbook.jsx','PhaseOne.jsx']){
  const content=src(file);
  assert.match(content,/useQuizQuestionAudio\(/,file);
  assert.match(content,/playUpcoming\(/,file);
 }
 assert.match(src('WorkbookChallenge.jsx'),/onClick=\{\(\)=>audio\.replay\(\)\}/);
 assert.match(src('NumberRecallGame.jsx'),/onClick=\{\(\)=>audio\.replay\(\)\}/);
});
test('each German multiple-choice exercise pronounces selected choice including wrong answers',()=>{
 const items=[
  ['WorkbookChallenge.jsx','audio.playChoice(value)'],
  ['NumberRecallGame.jsx','audio.playChoice(current.options.find'],
  ['PictureGame.jsx','germanChoiceAudio(text)'],
  ['VisualLesson.jsx','speak(choice.de)'],
  ['TeacherWorkbook.jsx','quizAudio.playChoice(value)'],
  ['PhaseOne.jsx','questionSound.playChoice(choice)']
 ];
 for(const [file,needle] of items)assert.ok(src(file).includes(needle),file);
});
test('existing per-answer XP and optional feedback preferences are retained',()=>{
 for(const file of ['WorkbookChallenge.jsx','NumberRecallGame.jsx']){
  const s=src(file);
  assert.match(s,/giveGameFeedback\(correct\?'correct':'wrong'|giveGameFeedback\(ok\?'correct':'wrong'/);
  assert.match(s,/feedbackHandled:true/);
  assert.match(s,/\.sound/);
 }
});
