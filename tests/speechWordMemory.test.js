import test from 'node:test';
import assert from 'node:assert/strict';
import {alignSpeechWords,recordSpeechWords,weakSpeechWords,recognitionTranscript} from '../src/speechWordMemory.js';
import {scoreSpeechMatch} from '../src/speakingEngine.js';
test('recognition uses primary final transcript, not reference-biased alternatives',()=>{
 assert.equal(recognitionTranscript({results:[[{transcript:'Buch'},{transcript:'Hallo'}]]}),'Buch');
 assert.equal(recognitionTranscript({results:[Object.assign([{transcript:'Hallo'}],{isFinal:false})]}),'');
});
test('sequence alignment finds missing and substituted words',()=>{
 const rows=alignSpeechWords('ich lerne deutsch','ich liebe deutsch');
 assert.deepEqual(rows.map(x=>x.correct),[true,false,true]);
 assert.equal(rows[1].word,'lerne');
 assert.equal(alignSpeechWords('ich lerne deutsch','ich deutsch')[1].correct,false);
});
test('word memory retains prior state, tracks repeated misses and schedules recovery',()=>{
 const result=scoreSpeechMatch('Ich lerne Deutsch','Ich liebe Deutsch');
 let state=recordSpeechWords({total:3},result.wordRows,8,1000);
 assert.equal(state.total,3);assert.equal(state.words.lerne.misses,1);
 assert.equal(weakSpeechWords(state,1001)[0].word,'lerne');
 for(let i=0;i<3;i++)state=recordSpeechWords(state,[{word:'lerne',correct:true}],8,2000+i);
 assert.equal(state.words.lerne.streak,3);assert.equal(weakSpeechWords(state,2003).length,0);
});

test('repeated word counts only once in each attempt',()=>{
 const state=recordSpeechWords({},[{word:'ich',correct:true},{word:'ich',correct:false},{word:'ich',correct:true}],8,1000);
 assert.equal(state.words.ich.attempts,1);assert.equal(state.words.ich.misses,1);assert.equal(state.words.ich.lastCorrect,false);
});
