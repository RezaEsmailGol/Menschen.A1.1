import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=file=>readFileSync(new URL('../src/'+file,import.meta.url),'utf8');
test('every main question surface uses one closeable, distraction-free full-screen sheet',()=>{
 const workbook=read('WorkbookChallenge.jsx');
 const numbers=read('NumberRecallGame.jsx');
 const pictures=read('PictureGame.jsx');
 const visual=read('VisualLesson.jsx');
 const teacher=read('TeacherWorkbook.jsx');
 const lesson=read('PhaseOne.jsx');
 for(const [name,code] of Object.entries({workbook,numbers,pictures,visual,teacher,lesson})){
  assert.match(code,/<QuizFocusShell[\s>]/,name);
  assert.match(code,/onClose=/,name);
 }
});
test('quiz focus uses mobile dynamic viewport, safe areas and explicit exit',()=>{
 const shell=read('QuizFocusShell.jsx'),css=read('quizFocus.css');
 assert.match(shell,/createPortal/);
 assert.match(shell,/aria-modal="true"/);
 assert.match(shell,/document\.body\.style\.overflow='hidden'/);
 assert.match(shell,/event\.key==='Escape'/);
 assert.match(css,/height:100dvh/);
 assert.match(css,/safe-area-inset-bottom/);
 assert.match(css,/max-height:510px/);
 assert.match(css,/overflow-y:auto/);
});
test('each four-option answer grid is 2 columns even on narrow phones',()=>{
 for(const [file,selector] of [
  ['workbookChallenge.css','.wcOptions'],['numberRecallGame.css','.nrAnswers'],
  ['pictureGame.css','.pgOptions'],['visualLesson.css','.vQuizChoices'],
  ['phaseOne.css','.examOptions'],['teacherWorkbook.css','.wbChoices']
 ]){
  const css=read(file);
  assert.ok(css.includes('.qfOverlay '+selector),file);
  assert.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),file);
 }
});
test('workbook answer button never disappears and big empty read-mode placeholder is removed',()=>{
 const source=read('WorkbookChallenge.jsx');
 assert.match(source,/disabled=\{chosen===null\}/);
 assert.match(source,/current\.display\?<div className="wcDisplay"/);
 assert.doesNotMatch(source,/current\.display\|\|<Sparkles/);
 const numbers=read('NumberRecallGame.jsx');
 assert.match(numbers,/disabled=\{selection===null\}/);
 const pictures=read('PictureGame.jsx');
 assert.match(pictures,/disabled=\{response===null\}/);
 const exam=read('PhaseOne.jsx');
 assert.match(exam,/disabled=\{answer===null\}/);
});
test('focus layout controls remain in lesson without resetting score or modifying spaced repetition',()=>{
 for(const name of ['WorkbookChallenge.jsx','NumberRecallGame.jsx','PictureGame.jsx']){
  const content=read(name);
  assert.match(content,/giveGameFeedback\(/);
  assert.match(content,/onEvent\?\.\(|onPracticeEvent\?\.\(/);
 }
 const oldMemory=read('learningMemory.js');
 assert.match(oldMemory,/export function recordActivity/);
});
