import test from 'node:test';
import assert from 'node:assert/strict';
import {ROUTES,WORKBOOK_PAGES,pathForRoute,routeFromPath,normalizeRoute} from '../src/appRoutes.js';
import {createNumberRound,makeNumberOptions,optionLabel} from '../src/numberGameLogic.js';
import {germanNumber} from '../src/learningData.js';

test('every app section has a unique shareable path',()=>{
 const paths=Object.values(ROUTES);
 assert.equal(new Set(paths).size,paths.length);
 for(const [route,path] of Object.entries(ROUTES)){
  assert.equal(pathForRoute(route),path);
  assert.equal(routeFromPath(path),route);
  assert.equal(routeFromPath(path+'/'),route);
 }
});
test('all 12 lessons and workbook pages support direct deep links',()=>{
 for(let n=1;n<=12;n++){
  const route='course/'+n;
  assert.equal(pathForRoute(route),'/lessons/'+n);
  assert.equal(routeFromPath('/lessons/'+n),route);
 }
 for(const page of WORKBOOK_PAGES){
  const route='workbook/'+page;
  assert.equal(pathForRoute(route),'/workbook/'+page);
  assert.equal(routeFromPath('/workbook/'+page),route);
 }
 assert.equal(routeFromPath('/lessons/42'),'home');
 assert.equal(routeFromPath('/workbook/unknown'),'home');
 assert.equal(normalizeRoute('course/0'),'course');
 assert.equal(normalizeRoute('course/13'),'course');
 assert.equal(routeFromPath('/not-a-page'),'home');
});
test('multiple-choice number game always has 4 unique valid options, including answer',()=>{
 for(const maximum of [12,20,100]){
  for(let round=0;round<8;round++){
   const game=createNumberRound(maximum,{},()=>Math.random());
   assert.equal(game.length,10);
   assert.equal(new Set(game.map(q=>q.number)).size,10);
   for(const item of game){
    assert.equal(item.options.length,4);
    assert.equal(new Set(item.options).size,4);
    assert.ok(item.options.includes(item.number));
    assert.ok(item.options.every(n=>n>=0&&n<=maximum));
    assert.equal(new Set(item.options.map(n=>germanNumber(n))).size,4);
    assert.equal(optionLabel(item.number,'read'),germanNumber(item.number));
    assert.equal(optionLabel(item.number,'hear'),String(item.number));
   }
  }
 }
});
test('adaptive quizzes reintroduce previously missed numbers without duplicate initial questions',()=>{
 const memory={items:{'number:7':{mastery:0,lastCorrect:false},'number:9':{mastery:0,lastCorrect:false}}};
 const game=createNumberRound(12,memory);
 assert.ok(game.some(q=>q.number===7));
 assert.ok(game.some(q=>q.number===9));
 assert.equal(new Set(game.map(q=>q.number)).size,game.length);
});
test('distractors never include the answer more than once',()=>{
 for(let n=0;n<=12;n++){
  const options=makeNumberOptions(n,12);
  assert.equal(options.filter(x=>x===n).length,1);
 }
});
