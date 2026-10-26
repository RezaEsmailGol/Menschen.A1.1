import test from 'node:test';
import assert from 'node:assert/strict';
import {SPEAKING_KEY,makeSpeakingState,germanSpeechNormalize,scoreSpeechMatch,
 speakingCards,speakingReview,addSpeechReview,speakingStats,speakingStatus} from '../src/speakingEngine.js';
import {activityItemKey} from '../src/learningMemory.js';

test('speech transcript accepts numeric recognizer output and German ß, umlaut spellings',()=>{
 assert.equal(germanSpeechNormalize('17'),'siebzehn');
 assert.equal(germanSpeechNormalize('30'),'dreissig');
 assert.equal(germanSpeechNormalize('Dreißig!'),'dreissig');
 assert.equal(germanSpeechNormalize('FÜNF'),'fuenf');
 assert.equal(germanSpeechNormalize('ein und zwanzig'),'einundzwanzig');
 assert.equal(scoreSpeechMatch('siebzehn','17').score,100);
 assert.equal(scoreSpeechMatch('dreißig','dreissig').score,100);
 assert.equal(scoreSpeechMatch('einundzwanzig','21').score,100);
 assert.equal(scoreSpeechMatch('Ich komme aus dem Iran.','ich komme aus dem iran').score,100);
});
test('missing, extra, and incorrect transcript produce honest lower scores',()=>{
 assert.equal(scoreSpeechMatch('Ich wohne in Qom.','').score,0);
 assert.ok(scoreSpeechMatch('sechzehn','siebzehn').score<100);
 assert.ok(scoreSpeechMatch('Ich komme aus dem Iran.','Ich komme Iran.').score<90);
 assert.ok(scoreSpeechMatch('Ich lerne Deutsch.','Ich lerne Deutsch schnell.').score<100);
 assert.ok(scoreSpeechMatch('Apfel','Buch').score<45);
 assert.ok(scoreSpeechMatch('Wie heißen Sie?','Wie heißen Sie?').exact);
});
test('numbers preserve three stage boundaries in mic coach',()=>{
 for(const [range,min,max] of [['0-12',0,12],['13-20',13,20],['20-30',20,30]]){
  const cards=speakingCards('numbers',{range});
  assert.equal(cards.length,max-min+1);
  assert.deepEqual(cards.map(c=>c.number),Array.from({length:max-min+1},(_,i)=>min+i));
  assert.equal(new Set(cards.map(c=>c.id)).size,cards.length);
 }
});
test('German letters use pronounceable example phrases rather than single isolated sounds',()=>{
 const letters=speakingCards('letters');
 assert.equal(letters.length,30);
 assert.equal(letters[0].text,'A wie Apfel');
 assert.ok(letters.some(c=>c.letter==='ß'&&c.text.includes('Eszett')));
 assert.ok(letters.every(c=>c.text.split(' ').length>=3));
});
test('words and sentences come from current lesson and teacher notes with stable IDs',()=>{
 const words=speakingCards('words',{progress:{1:{started:true}}});
 const sentences=speakingCards('sentences',{progress:{1:{started:true}}});
 assert.ok(words.length>=15);
 assert.ok(sentences.length>=12);
 assert.ok(words.some(c=>c.text.includes('Name')));
 assert.ok(sentences.some(c=>c.text.includes('Iran')));
 assert.ok(words.every(c=>c.category==='words'));
 assert.ok(sentences.every(c=>c.category==='sentences'));
 const extra=speakingCards('sentences',{progress:{1:{started:true},2:{started:true}}});
 assert.ok(extra.length>sentences.length);
});
test('successful speech review records independent skill history without overwriting existing practice memory',()=>{
 const now=new Date('2026-10-26T14:00:00Z').getTime();
 const item=speakingCards('numbers',{range:'13-20'})[3];
 const old=makeSpeakingState();
 const grade=scoreSpeechMatch(item.text,item.text);
 const one=addSpeechReview(old,item,grade,item.text,now);
 assert.equal(one.total,1);
 assert.equal(one.items[item.id].lastScore,100);
 assert.equal(one.items[item.id].attempts,1);
 assert.equal(speakingStats(one).average,100);
 assert.equal(speakingStatus(one.items[item.id],now),'learning');
 const two=addSpeechReview(one,item,grade,item.text,now+24*3600*1000);
 const three=addSpeechReview(two,item,grade,item.text,now+48*3600*1000);
 assert.equal(speakingStatus(three.items[item.id],now+48*3600*1000),'mastered');
 assert.equal(three.history.length,3);
 assert.deepEqual(old.items,{});
 assert.equal(SPEAKING_KEY,'dt_speaking_v1');
});
test('missed speech is prioritized for the next scheduled round',()=>{
 const now=Date.now();
 const cards=speakingCards('numbers',{range:'0-12'});
 const weak=cards[8];
 const stored=addSpeechReview(makeSpeakingState(),weak,scoreSpeechMatch(weak.text,'Buch'),'Buch',now);
 const round=speakingReview(cards,stored,8,()=>.28,now+1000);
 assert.equal(round.length,8);
 assert.ok(round.some(x=>x.id===weak.id));
 assert.equal(speakingStatus(stored.items[weak.id],now+1000),'weak');
});
