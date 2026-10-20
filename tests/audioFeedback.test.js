import test from 'node:test';
import assert from 'node:assert/strict';
import {playWrongBeep} from '../src/audioFeedback.js';

test('the audio feedback gracefully skips browsers without Web Audio',()=>{
  const original=globalThis.window;
  delete globalThis.window;
  try{assert.equal(playWrongBeep(),false);}finally{
    if(original!==undefined)globalThis.window=original;
  }
});

test('wrong-answer feedback schedules a gentle descending tone on a click',()=>{
  const original=globalThis.window;
  const events=[];
  class FakeAudioContext{
    constructor(){this.state='running';this.currentTime=42;this.destination={};}
    createGain(){
      return {
        gain:{setValueAtTime:(value,at)=>events.push(['gainSet',value,at]),
          exponentialRampToValueAtTime:(value,at)=>events.push(['ramp',value,at])},
        connect:()=>events.push(['gainConnect']),disconnect:()=>events.push(['gainDisconnect'])
      };
    }
    createOscillator(){
      return {
        type:'',
        frequency:{setValueAtTime:(value,at)=>events.push(['frequency',value,at])},
        connect:()=>events.push(['oscConnect']),
        start:at=>events.push(['start',at]),stop:at=>events.push(['stop',at]),
        disconnect:()=>events.push(['oscDisconnect']),onended:null
      };
    }
  }
  try{
    globalThis.window={AudioContext:FakeAudioContext};
    assert.equal(playWrongBeep(),true);
    assert.deepEqual(events.filter(([name])=>name==='frequency').map(([name,value])=>value),[390,310]);
    assert.equal(events.filter(([name])=>name==='start').length,1);
    assert.equal(events.filter(([name])=>name==='stop').length,1);
  }finally{
    if(original===undefined)delete globalThis.window;
    else globalThis.window=original;
  }
});
