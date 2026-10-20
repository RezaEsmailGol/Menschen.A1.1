import test from 'node:test';
import assert from 'node:assert/strict';
import {
  workbookSections,workbookAlphabet,workbookSounds,workbookNumbers,workbookPronouns,
  workbookDialog,workbookFillSentences,cleanWorkbookAnswer,shuffleWorkbook,makeWorkbookExam
} from '../src/teacherLessonData.js';

test('first-session workbook has seven distinct ordered pages',()=>{
  assert.deepEqual(workbookSections.map(x=>x.id),['start','alphabet','sounds','numbers','verbs','dialog','checkpoint']);
});
test('alphabet includes 26 letters and four special characters with speakable examples',()=>{
  assert.equal(workbookAlphabet.length,30);
  const letters=workbookAlphabet.map(x=>x.letter);
  assert.equal(new Set(letters).size,30);
  for(const special of ['Ä','Ö','Ü','ß'])assert.ok(letters.includes(special));
  assert.ok(workbookAlphabet.every(x=>x.word && x.translation));
});
test('sounds cover actual teacher notes and carry audible comparisons',()=>{
  for(const key of ['s','sp','st','v','j','h','z','ch','chs','sch','ph','tion','ei','au','eu','ig','en']){
    assert.ok(workbookSounds.some(x=>x.id===key),key+' is missing');
  }
  assert.ok(workbookSounds.every(x=>x.word && x.contrast && x.note));
});
test('numbers preserve German spelling from zero to twelve',()=>{
  assert.equal(workbookNumbers.length,13);
  assert.equal(workbookNumbers[0].word,'null');
  assert.equal(workbookNumbers[6].word,'sechs');
  assert.equal(workbookNumbers[12].word,'zwölf');
});
test('pronouns have correct kommen and sammeln conjugation',()=>{
  assert.equal(workbookPronouns.length,6);
  assert.deepEqual(workbookPronouns.map(x=>x.kommen),['komme','kommst','kommt','kommen','kommt','kommen']);
  assert.deepEqual(workbookPronouns.map(x=>x.sammeln),['sammle','sammelst','sammelt','sammeln','sammelt','sammeln']);
});
test('quiz has twelve self-contained questions with one valid answer',()=>{
  for(let trial=0;trial<25;trial++){
    const questions=makeWorkbookExam();
    assert.equal(questions.length,12);
    assert.equal(new Set(questions.map(q=>q.id)).size,12);
    assert.equal(questions.filter(q=>q.kind==='number').length,4);
    assert.equal(questions.filter(q=>q.kind==='grammar').length,3);
    assert.equal(questions.filter(q=>q.kind==='pronunciation').length,3);
    assert.equal(questions.filter(q=>q.kind==='sentence').length,2);
    for(const q of questions){
      assert.ok(q.answer && q.question);
      if(q.type==='choice'){
        assert.equal(q.choices.length,4);
        assert.equal(new Set(q.choices).size,4);
        assert.equal(q.choices.filter(x=>x===q.answer).length,1);
      }
      if(q.type==='arrange')assert.ok(q.answer.split(' ').length>=3);
    }
  }
});
test('spelling validation ignores harmless punctuation but not German umlauts',()=>{
  assert.equal(cleanWorkbookAnswer(' Ich  komme. '),cleanWorkbookAnswer('ich komme'));
  assert.notEqual(cleanWorkbookAnswer('zwolf'),cleanWorkbookAnswer('zwölf'));
  assert.notEqual(cleanWorkbookAnswer('fünf'),cleanWorkbookAnswer('funf'));
});
