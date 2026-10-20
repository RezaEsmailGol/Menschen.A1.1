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
test('API health reports Groq disabled if GROQ_API_KEY is missing, even if old Gateway key remains',async()=>{
 const old={groq:process.env.GROQ_API_KEY,gateway:process.env.AI_GATEWAY_API_KEY,access:process.env.TUTOR_ACCESS_CODE};
 delete process.env.GROQ_API_KEY;
 process.env.AI_GATEWAY_API_KEY='legacy-but-unused';
 process.env.TUTOR_ACCESS_CODE='local-test-password';
 const res=mockResponse();
 try{
   await handler({method:'GET'},res);
   assert.equal(res.code,200);
   assert.equal(res.data.provider,'GroqCloud');
   assert.equal(res.data.configured,false);
   await handler({method:'POST'},res);
   assert.equal(res.code,503);
   assert.equal(res.data.fallback,true);
 }finally{
   restoreEnv('GROQ_API_KEY',old.groq);
   restoreEnv('AI_GATEWAY_API_KEY',old.gateway);
   restoreEnv('TUTOR_ACCESS_CODE',old.access);
 }
});
function mockResponse(){
 return {headers:{},setHeader(k,v){this.headers[k]=v},status(code){this.code=code;return this},json(body){this.data=body;return this}};
}
function restoreEnv(key,val){if(val===undefined)delete process.env[key];else process.env[key]=val;}
function baseRequest(ip='test-groq-request'){
 return {method:'POST',headers:{'x-tutor-access-code':'local-test-password','x-forwarded-for':ip},
   body:{sceneId:'greetings',nodeId:'hello',answer:'Gut, danke! Und dir?'}};
}
test('Groq rejects unauthorized clients without calling the provider',async()=>{
 const old={groq:process.env.GROQ_API_KEY,code:process.env.TUTOR_ACCESS_CODE};
 const fetchBefore=globalThis.fetch;
 process.env.GROQ_API_KEY='private-testing-groq-key';process.env.TUTOR_ACCESS_CODE='local-test-password';
 let called=false;
 globalThis.fetch=async()=>{called=true;throw Error('Should not call provider')};
 try{
   const res=mockResponse(),req=baseRequest('groq-unauthorized');
   req.headers['x-tutor-access-code']='wrong';
   await handler(req,res);
   assert.equal(res.code,401);assert.equal(called,false);
 }finally{
   globalThis.fetch=fetchBefore;restoreEnv('GROQ_API_KEY',old.groq);restoreEnv('TUTOR_ACCESS_CODE',old.code);
 }
});
test('Groq response is parsed into a German-Persian tutoring turn',async()=>{
 const old={groq:process.env.GROQ_API_KEY,code:process.env.TUTOR_ACCESS_CODE};
 const fetchBefore=globalThis.fetch;
 process.env.GROQ_API_KEY='private-testing-groq-key';process.env.TUTOR_ACCESS_CODE='local-test-password';
 const payload={correct:true,corrected:'Gut, danke!',correctionFa:'خوبم، ممنون!',
   explanation:'درست است.',nextQuestion:'Woher kommst du?',nextQuestionFa:'اهل کجایی؟',
   options:[{de:'Ich komme aus dem Iran.',fa:'من اهل ایران هستم.'},{de:'Ich komme aus Wien.',fa:'من اهل وین هستم.'}]};
 let fetched;
 globalThis.fetch=async(url,opts)=>{
   fetched={url,opts};
   return {ok:true,status:200,json:async()=>({choices:[{message:{content:JSON.stringify(payload)}}]})};
 };
 try{
   const res=mockResponse();
   await handler(baseRequest('groq-success'),res);
   assert.equal(res.code,200);
   assert.equal(res.data.provider,'GroqCloud');
   assert.equal(res.data.nextQuestion,payload.nextQuestion);
   assert.equal(fetched.url,'https://api.groq.com/openai/v1/chat/completions');
   const body=JSON.parse(fetched.opts.body);
   assert.equal(body.model,'openai/gpt-oss-20b');
   assert.equal(body.response_format.type,'json_object');
   assert.equal(fetched.opts.headers.Authorization,'Bearer private-testing-groq-key');
 }finally{
   globalThis.fetch=fetchBefore;restoreEnv('GROQ_API_KEY',old.groq);restoreEnv('TUTOR_ACCESS_CODE',old.code);
 }
});
test('Groq free-tier 429, restricted 403 and invalid key errors are safe',async()=>{
 const old={groq:process.env.GROQ_API_KEY,code:process.env.TUTOR_ACCESS_CODE};
 const fetchBefore=globalThis.fetch;
 process.env.GROQ_API_KEY='dummy-secret';process.env.TUTOR_ACCESS_CODE='local-test-password';
 try{
   for(const [providerStatus,expectedStatus,expectedError] of [
     [429,429,'provider_rate_limited'],
     [403,403,'provider_access_restricted'],
     [401,502,'provider_auth_failed']
   ]){
     globalThis.fetch=async()=>({ok:false,status:providerStatus,headers:{get:()=>null}});
     const res=mockResponse();
     await handler(baseRequest('groq-error-'+providerStatus),res);
     assert.equal(res.code,expectedStatus);
     assert.equal(res.data.error,expectedError);
     assert.equal(res.data.fallback,true);
     assert.ok(!JSON.stringify(res.data).includes('dummy-secret'));
   }
 }finally{
   globalThis.fetch=fetchBefore;restoreEnv('GROQ_API_KEY',old.groq);restoreEnv('TUTOR_ACCESS_CODE',old.code);
 }
});
