import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonAudioCards,verifyAudioDictation,soundMeaningOptions} from '../src/audioLearningData.js';
import {AUDIO_CARD_TRACK_KEY,cardBindingKey,normalizeAudioCardBindings,getAudioCardBinding,withAudioCardBinding,audioCardTrackLabel,completedAudioCards} from '../src/audioWorkbookData.js';

test('all twelve lessons offer unique illustrated cards with German text and Persian meaning',()=>{
 for(let lesson=1;lesson<=12;lesson++){
  const cards=lessonAudioCards(lesson);
  assert.ok(cards.length>=4,'missing cards for lesson '+lesson);
  assert.equal(new Set(cards.map(x=>x.id)).size,cards.length);
  for(const card of cards){
   assert.equal(card.lesson,lesson);
   assert.ok(card.text&&card.meaning&&card.scene);
   assert.match(card.text,/[A-Za-zÄÖÜäöüß]/);
   assert.match(card.meaning,/[\u0600-\u06FF]/);
   assert.equal(cardBindingKey(lesson,card.id),lesson+':'+card.id);
  }
 }
});

test('real book audio is never guessed from a text card; explicit secure associations persist independently',()=>{
 assert.equal(AUDIO_CARD_TRACK_KEY,'dt_menschen_audio_card_tracks_v1');
 const track={book:'kursbuch',path:'Lektion 5, 1a.mp3'};
 assert.equal(getAudioCardBinding({},5,'a5-1'),null);
 const saved=withAudioCardBinding({},5,'a5-1',track);
 assert.deepEqual(saved['5:a5-1'],track);
 assert.equal(getAudioCardBinding(saved,5,'a5-2'),null);
 assert.deepEqual(getAudioCardBinding(saved,5,'a5-1'),track);
 const another=withAudioCardBinding(saved,5,'a5-2',{book:'arbeitsbuch',path:'Lektion 5, 2.mp3'});
 assert.equal(Object.keys(another).length,2);
 assert.equal(audioCardTrackLabel(another['5:a5-2']),'کتاب کار');
 assert.equal(audioCardTrackLabel(saved['5:a5-1']),'کتاب اصلی');
 assert.equal(Object.keys(withAudioCardBinding(another,5,'a5-1',null)).length,1);
 assert.throws(()=>withAudioCardBinding(saved,5,'a5-1',{book:'other',path:track.path}));
 assert.throws(()=>withAudioCardBinding(saved,5,'a5-1',{book:'kursbuch',path:'../private.mp3'}));
 assert.throws(()=>cardBindingKey(13,'a13-1'));
});

test('malformed saved binding JSON is safely dropped instead of leaking private paths',()=>{
 assert.deepEqual(normalizeAudioCardBindings('{oops'),{});
 assert.deepEqual(normalizeAudioCardBindings([]),{});
 assert.deepEqual(normalizeAudioCardBindings({'5:a5-1':{book:'kursbuch',path:'%2e%2e/secret.mp3'}}),{});
 assert.deepEqual(normalizeAudioCardBindings({'5:a5-1':{book:'kursbuch',path:'Lektion 5, 1.mp3'},'garbage':{book:'kursbuch',path:'x.mp3'}}),{'5:a5-1':{book:'kursbuch',path:'Lektion 5, 1.mp3'}});
});

test('study/meaning/dictation/repeat reuse existing learning progress and meaningful quizzes',()=>{
 const cards=lessonAudioCards(5);
 const answer=cards[0];
 const options=soundMeaningOptions(cards,0);
 assert.ok(options.includes(answer.meaning));
 assert.equal(new Set(options).size,options.length);
 assert.equal(verifyAudioDictation(answer.text,answer.text),true);
 assert.equal(verifyAudioDictation(answer.text,'غلط'),false);
 const stats={completed:{['5:'+answer.id+':meaning']:true,['5:'+cards[1].id+':dictation']:true,['5:'+cards[2].id+':repeat']:true}};
 assert.equal(completedAudioCards(cards,stats,5),3);
 assert.equal(completedAudioCards(cards,stats,4),0);
 assert.equal(completedAudioCards(cards,{completed:{}},5),0);
});
