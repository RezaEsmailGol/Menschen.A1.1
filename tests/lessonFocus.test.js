import test from 'node:test';
import assert from 'node:assert/strict';
import {
 CURRENT_LESSON_KEY,LESSON_FOCUS_KEY,validLessonId,readLessonFocus,
 writeLessonFocus,lessonFromSearch,scopedLessonLinks,replaceLessonQuery
} from '../src/lessonFocus.js';

function makeStore(initial={}){
 const entries=new Map(Object.entries(initial));
 return {
  getItem:key=>entries.get(key)||null,
  setItem:(key,value)=>entries.set(key,String(value)),
  entries
 };
}
test('lesson focus validates lesson numbers safely',()=>{
 assert.equal(validLessonId(1),1);
 assert.equal(validLessonId('08'),8);
 for(const value of [null,undefined,'',0,13,1.5,'8abc',{},'NaN'])assert.equal(validLessonId(value),null);
});
test('selecting a course lesson persists one shared focus across every practice tool',()=>{
 const storage=makeStore();
 assert.deepEqual(readLessonFocus(storage),{lessonId:1,enabled:false});
 assert.equal(writeLessonFocus(storage,6,true),true);
 assert.deepEqual(readLessonFocus(storage),{lessonId:6,enabled:true});
 assert.equal(storage.getItem(CURRENT_LESSON_KEY),'6');
 assert.equal(lessonFromSearch('',storage),6);
 assert.equal(lessonFromSearch('?lesson=8',storage),8);
 assert.equal(lessonFromSearch('?lesson=13',storage),6);
 assert.equal(lessonFromSearch('?lesson=6abc',storage),6);
 assert.equal(lessonFromSearch('?lesson=۰۸',storage),6);
 assert.equal(writeLessonFocus(storage,8,false),true);
 assert.deepEqual(readLessonFocus(storage),{lessonId:8,enabled:false});
 assert.equal(lessonFromSearch('',storage),8);
});
test('legacy current-lesson selection automatically activates focus',()=>{
 const storage=makeStore({[CURRENT_LESSON_KEY]:'7'});
 assert.deepEqual(readLessonFocus(storage),{lessonId:7,enabled:true});
});
test('invalid lesson writes never overwrite current lesson',()=>{
 const storage=makeStore({[CURRENT_LESSON_KEY]:'6'});
 assert.equal(writeLessonFocus(storage,17,true),false);
 assert.equal(storage.getItem(CURRENT_LESSON_KEY),'6');
});
test('book links keep the same lesson and no global fallback',()=>{
 const links=scopedLessonLinks(8);
 assert.deepEqual(links,{
  focus:'/practice/lesson/8',course:'/lessons/8',
  kursbuch:'/book-exercises?lesson=8',
  arbeitsbuch:'/arbeitsbuch?lesson=8',
  media:'/arbeitsbuch-media?lesson=8',
  partner:'/partner-practice?lesson=8',
  action:'/action-pages?lesson=8',
  vocabulary:'/essential-words?lesson=8'
 });
 assert.throws(()=>scopedLessonLinks(0));
});
test('malformed localStorage or denied storage cannot crash focus',()=>{
 const storage=makeStore({[LESSON_FOCUS_KEY]:'not-json'});
 assert.deepEqual(readLessonFocus(storage),{lessonId:1,enabled:false});
 const denied={getItem(){throw Error('denied')},setItem(){throw Error('denied')}};
 assert.deepEqual(readLessonFocus(denied),{lessonId:1,enabled:false});
 assert.equal(writeLessonFocus(denied,8),false);
});

test('changing lesson rewrites its direct URL without reloading or dropping unrelated filters',()=>{
 let replaced='';
 const loc={href:'https://example.test/arbeitsbuch?lesson=6&mode=weak#question'};
 const history={state:{foo:1},replaceState(state,title,url){replaced=url;this.state=state;}};
 assert.equal(replaceLessonQuery(8,loc,history),true);
 assert.equal(replaced,'/arbeitsbuch?lesson=8&mode=weak#question');
 assert.equal(history.state.foo,1);
 const page={href:'https://example.test/action-pages?page=80&lesson=8'};
 assert.equal(replaceLessonQuery(6,page,history),true);
 assert.equal(replaced,'/action-pages?lesson=6');
 assert.equal(replaceLessonQuery(null,loc,history),true);
 assert.equal(replaced,'/arbeitsbuch?mode=weak#question');
 assert.equal(replaceLessonQuery(6,{},history),false);
});
