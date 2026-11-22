import test from 'node:test';
import assert from 'node:assert/strict';
import {alignSpeechWords,recordSpeechWords,weakSpeechWords,recognitionTranscript,liveSpeechTranscript} from '../src/speechWordMemory.js';
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

test('one correct retry immediately clears the weak list without losing failure history',()=>{
 const one=recordSpeechWords({},[{word:'beruf',display:'Beruf',heard:'buch',correct:false}],2,1000);
 assert.deepEqual(weakSpeechWords(one,1001).map(w=>w.word),['beruf']);
 const two=recordSpeechWords(one,[{word:'beruf',display:'Beruf',heard:'beruf',correct:true}],2,2000);
 assert.equal(two.words.beruf.misses,1);assert.equal(two.words.beruf.streak,1);
 assert.deepEqual(weakSpeechWords(two,2001),[]);
 assert.deepEqual(weakSpeechWords({words:{beruf:{...two.words.beruf,misses:99,dueAt:0}}},300000),[]);
 const three=recordSpeechWords(two,[{word:'beruf',correct:false}],2,3000);
 assert.deepEqual(weakSpeechWords(three,3001).map(w=>w.word),['beruf']);
});
test('interim preview does not get mistaken for final transcript',()=>{
 const partial=Object.assign([{transcript:'der Ber'}],{isFinal:false});
 const final=Object.assign([{transcript:'der Beruf'}],{isFinal:true});
 assert.equal(liveSpeechTranscript({results:[partial]}),'der Ber');
 assert.equal(recognitionTranscript({results:[partial]}),'');
 assert.equal(recognitionTranscript({results:[final]}),'der Beruf');
});
