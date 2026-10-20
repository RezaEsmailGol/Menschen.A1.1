import test from 'node:test';
import assert from 'node:assert/strict';
import {getScene,scenes,chooseDialogueAnswer} from '../src/dialogueData.js';
import {pathForRoute,routeFromPath} from '../src/appRoutes.js';
import handler,{validateTutorInput,parseTutorResult} from '../api/tutor.js';

test('all five dialogue scenes have reachable endings, valid branching and teacher corrections',()=>{
 assert.equal(scenes.length,5);
 assert.equal(new Set(scenes.map(x=>x.id)).size,scenes.length);
 for(const scene of scenes){
   assert.ok(scene.nodes[scene.first],scene.id);
   assert.ok(scene.title&&scene.intro);
   const reachable=new Set(), pending=[scene.first];let finish=false;
   while(pending.length){
     const id=pending.pop();
     if(reachable.has(id))continue;
     reachable.add(id);
     const node=scene.nodes[id];
     assert.ok(node,scene.id+'/'+id);
     assert.ok(Array.isArray(node.choices)&&node.choices.length>0);
     assert.equal(new Set(node.choices.map(x=>x.id)).size,node.choices.length);
     for(const choice of node.choices){
       const result=chooseDialogueAnswer(scene,id,choice.id);
       assert.equal(result.correct,Boolean(choice.correct));
       if(choice.correct){
         if(choice.next===null)finish=true;
         else{assert.ok(scene.nodes[choice.next],scene.id+'/'+choice.next);pending.push(choice.next)}
       }else{
         assert.ok(choice.explain,scene.id+'/'+choice.id);
         assert.equal(result.next,id);
       }
     }
   }
   assert.ok(finish,scene.id+' has no reachable finale');
   assert.ok(reachable.size>=4,scene.id+' has too little branching content');
 }
});
test('all scene deep links resolve from both directions',()=>{
 for(const scene of scenes){
   const path='/dialogues/'+scene.id;
   assert.equal(pathForRoute('dialogues/'+scene.id),path);
   assert.equal(routeFromPath(path),'dialogues/'+scene.id);
   assert.equal(getScene(scene.id),scene);
 }
 assert.equal(routeFromPath('/dialogues/unlisted'),'home');
 assert.equal(pathForRoute('dialogues'),'\/dialogues');
});
test('model receives only validated known scene/node and short German text',()=>{
 assert.ok(validateTutorInput({sceneId:'greetings',nodeId:'hello',answer:'Ich heiße Reza.'}));
 assert.equal(validateTutorInput({sceneId:'unknown',nodeId:'hello',answer:'Hallo'}),null);
 assert.equal(validateTutorInput({sceneId:'greetings',nodeId:'missing',answer:'Hallo'}),null);
 assert.equal(validateTutorInput({sceneId:'greetings',nodeId:'hello',answer:'x'.repeat(221)}),null);
 assert.equal(validateTutorInput({sceneId:'greetings',nodeId:'hello',answer:'<script>hi</script>'}),null);
});
test('AI replies must parse into bounded, useful schema before display',()=>{
 const valid={correct:true,corrected:'Ich heiße Reza.',correctionFa:'اسم من رضاست.',
 explanation:'جمله صحیح است.',nextQuestion:'Woher kommst du?',nextQuestionFa:'اهل کجایی؟',
 options:[{de:'Ich komme aus dem Iran.',fa:'من از ایران هستم.'},{de:'Ich komme aus Wien.',fa:'من اهل وین هستم.'}]};
 const parsed=parseTutorResult('Here is JSON:\n'+JSON.stringify(valid));
 assert.equal(parsed.correct,true);
 assert.equal(parsed.options.length,2);
 assert.equal(parseTutorResult('no json here'),null);
 assert.equal(parseTutorResult(JSON.stringify({correct:true,options:[]})),null);
});
test('API health reports offline when no gateway key or tutor access is configured',async()=>{
 const originalKey=process.env.AI_GATEWAY_API_KEY;
 const originalCode=process.env.TUTOR_ACCESS_CODE;
 delete process.env.AI_GATEWAY_API_KEY;delete process.env.TUTOR_ACCESS_CODE;
 const headers={};
 const res={
   setHeader:(k,v)=>{headers[k]=v},
   status(code){this.code=code;return this},
   json(payload){this.data=payload;return this}
 };
 try{
   await handler({method:'GET'},res);
   assert.equal(res.code,200);assert.equal(res.data.configured,false);
   await handler({method:'POST'},res);
   assert.equal(res.code,503);assert.equal(res.data.fallback,true);
   assert.equal(headers['Cache-Control'],'no-store');
 }finally{
   if(originalKey!==undefined)process.env.AI_GATEWAY_API_KEY=originalKey;
   if(originalCode!==undefined)process.env.TUTOR_ACCESS_CODE=originalCode;
 }
});
