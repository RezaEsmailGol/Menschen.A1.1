import test from 'node:test';
import assert from 'node:assert/strict';
import {verbForms,lessons} from '../src/courseData.js';
import {getVerbForms,verbGroups,verbInfo,pronouns} from '../src/verbTrainerData.js';
import {pathForRoute,routeFromPath} from '../src/appRoutes.js';

test('classroom verbs have correct six-person present-tense conjugations',()=>{
 const expected={
  fahren:['fahre','fährst','fährt','fahren','fahrt','fahren'],
  sehen:['sehe','siehst','sieht','sehen','seht','sehen'],
  hören:['höre','hörst','hört','hören','hört','hören'],
  wollen:['will','willst','will','wollen','wollt','wollen'],
  müssen:['muss','musst','muss','müssen','müsst','müssen'],
  können:['kann','kannst','kann','können','könnt','können'],
  treffen:['treffe','triffst','trifft','treffen','trefft','treffen'],
  besuchen:['besuche','besuchst','besucht','besuchen','besucht','besuchen'],
  lesen:['lese','liest','liest','lesen','lest','lesen']
 };
 for(const [verb,forms] of Object.entries(expected)){
  assert.deepEqual(verbForms[verb],forms,verb);
  assert.deepEqual(Object.values(getVerbForms(verb)),forms,verb);
 }
 assert.deepEqual(pronouns,['ich','du','er/sie/es','wir','ihr','sie/Sie']);
});

test('verb trainer groups match lesson 5–6 book and classroom notes',()=>{
 const book=verbGroups.find(x=>x.id==='lesson56').verbs;
 const board=verbGroups.find(x=>x.id==='class').verbs;
 for(const verb of ['finden','kosten','leben','arbeiten','sehen','hören','lesen','brauchen','suchen','schreiben','möchten'])assert.ok(book.includes(verb),verb);
 for(const verb of ['fahren','treffen','besuchen','können','wollen','müssen'])assert.ok(board.includes(verb),verb);
 for(const group of verbGroups)for(const verb of group.verbs)assert.ok(getVerbForms(verb),verb);
 assert.ok(lessons[4].verbs.includes('finden'));
 for(const verb of ['fahren','sehen','hören','wollen','müssen'])assert.ok(lessons[5].verbs.includes(verb),verb);
});

test('modal verb cards explain infinitive-final word order',()=>{
 for(const verb of ['können','wollen','müssen','möchten']){
  assert.equal(verbInfo[verb].modal,true);
  assert.ok(verbInfo[verb].note.includes('مصدر'));
  assert.ok(verbInfo[verb].example);
 }
 assert.equal(getVerbForms('müssen').ich,'muss');
 assert.equal(getVerbForms('wollen').du,'willst');
});

test('the dedicated verb trainer remains directly reachable',()=>{
 assert.equal(pathForRoute('verbs'),'/verbs');
 assert.equal(routeFromPath('/verbs'),'verbs');
});
