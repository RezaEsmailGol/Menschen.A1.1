import test from 'node:test';
import assert from 'node:assert/strict';
import {GAME_SOUND_KEY,GAME_HAPTIC_KEY,HAPTIC_PATTERNS,readGameFeedbackPreferences,
 saveGameFeedbackPreference,vibrateGame,playGameSound,giveGameFeedback} from '../src/gameEffects.js';

test('correct, wrong and finish have distinct, modest vibration patterns',()=>{
 for(const kind of ['correct','wrong','finish']){
  assert.ok(HAPTIC_PATTERNS[kind].length>=1);
  assert.ok(HAPTIC_PATTERNS[kind].every(n=>Number.isInteger(n)&&n>0&&n<=115));
 }
 assert.notDeepEqual(HAPTIC_PATTERNS.correct,HAPTIC_PATTERNS.wrong);
 assert.notDeepEqual(HAPTIC_PATTERNS.finish,HAPTIC_PATTERNS.correct);
});
test('feedback preferences are opt-out, securely persisted and have safe fallback',()=>{
 const old=globalThis.localStorage;
 let values=new Map();
 globalThis.localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 try{
  assert.deepEqual(readGameFeedbackPreferences(),{sound:true,haptics:true});
  assert.equal(saveGameFeedbackPreference(GAME_SOUND_KEY,false),true);
  assert.equal(saveGameFeedbackPreference(GAME_HAPTIC_KEY,false),true);
  assert.deepEqual(readGameFeedbackPreferences(),{sound:false,haptics:false});
  assert.equal(saveGameFeedbackPreference('unknown',false),false);
  assert.equal(values.has('unknown'),false);
 }finally{
  if(old===undefined)delete globalThis.localStorage;
  else globalThis.localStorage=old;
 }
});
test('no device vibration is attempted if opted out or browser unsupported',()=>{
 const previous=Object.getOwnPropertyDescriptor(globalThis,'navigator');
 const calls=[];
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{vibrate:pattern=>{calls.push(pattern);return true}}});
 try{
  assert.equal(vibrateGame('wrong',false),false);
  assert.equal(calls.length,0);
  assert.equal(vibrateGame('wrong',true),true);
  assert.deepEqual(calls[0],HAPTIC_PATTERNS.wrong);
  assert.equal(vibrateGame('finish',true),true);
  assert.deepEqual(calls[1],HAPTIC_PATTERNS.finish);
  assert.equal(vibrateGame('not-a-signal',true),false);
  assert.equal(calls.length,2);
  assert.equal(playGameSound('correct',false),false);
  assert.deepEqual(giveGameFeedback('correct',{sound:false,haptics:false}),{sound:false,haptic:false});
  assert.equal(calls.length,2);
 }finally{
  if(previous)Object.defineProperty(globalThis,'navigator',previous);
  else delete globalThis.navigator;
 }
});
