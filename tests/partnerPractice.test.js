import test from 'node:test';
import assert from 'node:assert/strict';
import {partnerScenarios,partnerForLesson,advancePartnerProgress,partnerProgress,PARTNER_STORE} from '../src/partnerPracticeData.js';
import {lessons} from '../src/courseData.js';
import {ROUTES,pathForRoute,routeFromPath} from '../src/appRoutes.js';
test('each of the twelve current lessons has two original partner dialogues with three turns',()=>{
 assert.equal(partnerScenarios.length,24);
 assert.equal(new Set(partnerScenarios.map(x=>x.id)).size,24);
 for(const lesson of lessons){
  const scenes=partnerForLesson(lesson.id);
  assert.equal(scenes.length,2);
  for(const scene of scenes){
   assert.equal(scene.lesson,lesson.id);
   assert.equal(scene.turns.length,3);
   assert.ok(scene.title&&scene.goal);
   for(const [i,turn] of scene.turns.entries()){
    assert.equal(turn.asker,i%2?'B':'A');
    for(const key of ['ask','askFa','answer','answerFa','tip'])assert.ok(turn[key]?.trim(),key);
   }
  }
 }
});
test('partner progress stores completion and self-reported difficulties independently of historic data',()=>{
 const scene=partnerForLesson(8)[0],legacy={old:{completed:true}};
 const one=advancePartnerProgress(legacy,scene,0,false,100);
 const two=advancePartnerProgress(one,scene,1,true,200);
 const three=advancePartnerProgress(two,scene,2,false,300);
 assert.equal(one[scene.id].next,1);
 assert.equal(two[scene.id].hard,1);
 assert.equal(three[scene.id].completed,true);
 assert.equal(three[scene.id].next,0);
 assert.equal(three[scene.id].done,3);
 assert.deepEqual(three.old,legacy.old);
 assert.deepEqual(legacy,{old:{completed:true}});
 assert.throws(()=>advancePartnerProgress({},scene,3,false));
 assert.equal(partnerProgress({},scene.id).completed,false);
 assert.equal(PARTNER_STORE,'dt_partner_practice_v1');
});
test('partner page has its own direct link without changing older dialogue routes',()=>{
 assert.equal(ROUTES.partner,'/partner-practice');
 assert.equal(pathForRoute('partner'),'/partner-practice');
 assert.equal(routeFromPath('/partner-practice'),'partner');
 assert.equal(ROUTES.dialogues,'/dialogues');
});
