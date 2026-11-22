import test from 'node:test';
import assert from 'node:assert/strict';
import {
 AB_MEDIA_KEY,AB_PAGE_PROGRESS_KEY,AB_MEDIA_NOTE,arbeitsbuchMediaTasks,
 arbeitsbuchVisualTasks,arbeitsbuchListeningTasks,arbeitsbuchOriginalTasks,
 arbeitsbuchPageIndex,arbeitsbuchMediaForLesson,arbeitsbuchMediaById,
 arbeitsbuchMediaCounts,mediaCorrect,saveMediaResult,saveOriginalAudioPractice,
 mediaNeedsReview,savePageProgress
} from '../src/arbeitsbuchMediaData.js';
import {printedArbeitsbuchToPdfPage} from '../src/arbeitsbuchSourceData.js';
import {ROUTES,pathForRoute,routeFromPath} from '../src/appRoutes.js';

test('the source-indexed media extension covers every lesson with drawings and synthetic listening',()=>{
 assert.equal(arbeitsbuchVisualTasks.length,24);
 assert.equal(arbeitsbuchListeningTasks.length,24);
 assert.equal(arbeitsbuchOriginalTasks.length,11);
 assert.equal(arbeitsbuchMediaCounts.total,59);
 assert.equal(arbeitsbuchMediaTasks.length,59);
 assert.equal(AB_MEDIA_KEY,'dt_arbeitsbuch_media_v1');
 assert.equal(AB_PAGE_PROGRESS_KEY,'dt_arbeitsbuch_page_index_v1');
 assert.match(AB_MEDIA_NOTE,/تألیفی/);
 assert.equal(new Set(arbeitsbuchMediaTasks.map(x=>x.id)).size,59);
 for(let lesson=1;lesson<=12;lesson++){
  const list=arbeitsbuchMediaForLesson(lesson);
  assert.equal(list.filter(t=>t.kind==='visual').length,2);
  assert.equal(list.filter(t=>t.kind==='listeningPractice').length,2);
  assert.equal(list.filter(t=>t.kind==='originalAudio').length,lesson===11?0:1);
  for(const task of list){
   assert.equal(task.lesson,lesson);
   assert.ok(task.page>0&&task.page<100);
   assert.equal(task.pdfPage,printedArbeitsbuchToPdfPage(task.page));
   assert.equal(arbeitsbuchMediaById(task.id),task);
   if(task.kind==='originalAudio'){
    assert.equal(task.requiresTrack,true);
    assert.equal(mediaCorrect(task,'yes'),null);
   }else{
    assert.ok(task.options.includes(task.answer));
    assert.equal(mediaCorrect(task,task.answer),true);
    assert.equal(mediaCorrect(task,'wrong answer'),false);
    if(task.kind==='visual')assert.ok(task.art);
    if(task.kind==='listeningPractice'){
     assert.ok(task.script.length>=20);
     assert.equal(task.originalAudio,false);
    }
   }
  }
 }
});
test('correct answer immediately resolves visual and listening review without erasing mistake history',()=>{
 const item=arbeitsbuchMediaForLesson(8).find(x=>x.kind==='visual');
 const wrong=saveMediaResult({},item,false,1000);
 assert.equal(wrong[item.id].misses,1);
 assert.deepEqual(mediaNeedsReview(wrong,[item]).map(x=>x.id),[item.id]);
 const good=saveMediaResult(wrong,item,true,2000);
 assert.equal(good[item.id].attempts,2);
 assert.equal(good[item.id].misses,1);
 assert.equal(good[item.id].lastCorrect,true);
 assert.equal(good[item.id].completed,true);
 assert.deepEqual(mediaNeedsReview(good,[item]),[]);
 assert.throws(()=>saveMediaResult({},item,null));
});
test('publisher recording cannot be auto-scored; self-review requires a playable real track',()=>{
 const original=arbeitsbuchOriginalTasks[0];
 assert.throws(()=>saveOriginalAudioPractice({},original,false,false));
 assert.throws(()=>saveMediaResult({},original,true));
 const x=saveOriginalAudioPractice({},original,true,true,1000);
 assert.equal(x[original.id].completed,false);
 assert.equal(x[original.id].selfAssessed,true);
 assert.equal(x[original.id].needsReview,true);
 assert.equal(x[original.id].lastCorrect,undefined);
 const y=saveOriginalAudioPractice(x,original,true,false,2000);
 assert.equal(y[original.id].attempts,2);
 assert.equal(y[original.id].completed,true);
 assert.equal(y[original.id].needsReview,false);
 assert.deepEqual(mediaNeedsReview(y,[original]),[]);
});
test('the printed page index includes all pages, identifying actual missing scans and review stations',()=>{
 assert.equal(arbeitsbuchPageIndex.length,94);
 assert.equal(arbeitsbuchPageIndex[0].page,6);
 assert.equal(arbeitsbuchPageIndex.at(-1).page,99);
 assert.equal(arbeitsbuchPageIndex.filter(x=>!x.available).length,2);
 assert.deepEqual(arbeitsbuchPageIndex.filter(x=>!x.available).map(x=>x.page),[56,87]);
 assert.equal(arbeitsbuchPageIndex.find(x=>x.page===60).pdfPage,55);
 assert.equal(arbeitsbuchPageIndex.find(x=>x.page===88).pdfPage,82);
 assert.equal(arbeitsbuchPageIndex.filter(x=>x.lesson===8).length,6);
 assert.equal(arbeitsbuchPageIndex.find(x=>x.page===73).lesson,null);
 assert.equal(arbeitsbuchPageIndex.find(x=>x.page===62).mediaIds.length>=1,true);
});
test('page self-assessment is a distinct record and rejects pages missing in source',()=>{
 const page=arbeitsbuchPageIndex.find(x=>x.page===62);
 const wrong=savePageProgress({},page,true,1000);
 assert.equal(wrong[page.id].completed,false);
 assert.equal(wrong[page.id].needsReview,true);
 const good=savePageProgress(wrong,page,false,2000);
 assert.equal(good[page.id].completed,true);
 assert.equal(good[page.id].needsReview,false);
 assert.throws(()=>savePageProgress({},arbeitsbuchPageIndex.find(x=>x.page===56),false));
 assert.equal(ROUTES.arbeitsbuchMedia,'/arbeitsbuch-media');
 assert.equal(pathForRoute('arbeitsbuchMedia'),'/arbeitsbuch-media');
 assert.equal(routeFromPath('/arbeitsbuch-media'),'arbeitsbuchMedia');
});
