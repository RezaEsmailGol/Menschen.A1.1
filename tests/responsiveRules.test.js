import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ROUTES,WORKBOOK_PAGES,DIALOGUE_IDS} from '../src/appRoutes.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const css=read('src/responsive.css');
const main=read('src/main.jsx');
const html=read('index.html');

test('responsive stylesheet is installed at app root after base styles',()=>{
 assert.match(main,/import ['"]\.\/responsive\.css['"]/);
 assert.ok(main.indexOf("import './responsive.css'")>main.indexOf("import './routeLinks.css'"));
 assert.match(html,/name="viewport" content="width=device-width, initial-scale=1\.0"/);
 assert.match(css,/\.app main\{/);
 assert.match(css,/\.bottomNav\{/);
 assert.match(css,/safe-area-inset-bottom/);
});

test('mobile breakpoints and narrow-phone lesson 4 safeguards exist',()=>{
 for(const breakpoint of [1050,820,620,400,340])
  assert.ok(css.includes('@media(max-width:'+breakpoint+'px)'),breakpoint);
 for(const selector of ['.courseSplit','.courseSyllabus','.courseLessonBody','.bookLessonRoot',
   '.bookPictureGrid','.bookLessonTabs','.bookPictureSvg','.lpGame','.lpGallery',
   '.lpChoices','.numberStageGrid','.numberExploreControls','.qfOverlay']){
  assert.ok(css.includes(selector+'{')||css.includes(selector+','),selector);
 }
 assert.match(css,/\.bookLessonTabs\{[^}]*overflow-x:auto/);
 assert.match(css,/\.courseSplit,\.reviewLayout\{grid-template-columns:minmax\(0,1fr\)/);
 assert.match(css,/\.bookPictureGrid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(css,/\.lpChoices\{grid-template-columns:minmax\(0,1fr\)/);
});

test('styles touch every major route family, including workbook and SVG memory',()=>{
 const families=['.ldLesson','.vmPage','.visualLesson','.dialoguesPage','.scPage','.cnRoot',
   '.wbRoot','.nrGame','.wcGame','.pgPage','.nightPage','.dcPage','.phasePage',
   '.vocabGrid','.numberDuoHero','.hero','.progressColumns','.gameHome'];
 for(const selector of families)assert.ok(css.includes(selector),selector);
 assert.equal(Object.keys(ROUTES).length,23);
 assert.equal(WORKBOOK_PAGES.length,7);
 assert.equal(DIALOGUE_IDS.length,5);
});

test('responsive CSS has balanced declarations and preserved focus visibility',()=>{
 const clean=css.replace(/\/\*[\s\S]*?\*\//g,'');
 assert.equal((clean.match(/\{/g)||[]).length,(clean.match(/\}/g)||[]).length);
 assert.ok(clean.includes(':focus-visible'));
 assert.ok(clean.includes('overflow-x:auto'));
 assert.ok(clean.includes('overflow-x:clip'));
 assert.ok(clean.includes('max-width:100%'));
});

test('Chromium viewport suite covers all published dynamic lesson and workbook routes',()=>{
 const browserTests=read('e2e/responsive.spec.js');
 for(const width of [320,360,375,390,414,768,1024,1440])assert.ok(browserTests.includes(String(width)));
 assert.match(browserTests,/Array\.from\(\{length:12\}/);
 assert.match(browserTests,/WORKBOOK_PAGES\.map/);
 assert.match(browserTests,/DIALOGUE_IDS\.map/);
 assert.match(browserTests,/viewportAudit/);
 assert.match(browserTests,/documentWidth/);
 assert.match(browserTests,/lesson 4: SVG gallery/);
 assert.match(browserTests,/number explorer accepts 100 million/);
});
