import {test,expect} from '@playwright/test';
import {ROUTES,DIALOGUE_IDS,WORKBOOK_PAGES} from '../src/appRoutes.js';

const ROUTE_PATHS=[...new Set([
  ...Object.values(ROUTES),
  ...Array.from({length:12},(_,i)=>'/lessons/'+(i+1)),
  ...WORKBOOK_PAGES.map(id=>'/workbook/'+id),
  ...DIALOGUE_IDS.map(id=>'/dialogues/'+id)
])];
// Cover all app routes at mobile, tablet and desktop viewport widths.
const widths=[320,360,375,390,414,768,1024,1440];

function viewportAudit(){
 const pageWidth=window.innerWidth;
 const html=document.documentElement;
 const main=document.querySelector('.app > main');
 const root=document.querySelector('#root');
 const isScrollableAncestor=element=>{
  for(let p=element.parentElement;p&&p!==document.body;p=p.parentElement){
   const style=getComputedStyle(p);
   if((['auto','scroll'].includes(style.overflowX))&&p.scrollWidth>p.clientWidth+2)return true;
  }
  return false;
 };
 const overflowControls=[];
 for(const element of main?.querySelectorAll('button,a,input,select,textarea')||[]){
  if(element.getClientRects().length===0)continue;
  const box=element.getBoundingClientRect();
  if(box.width<=0||box.height<=0)continue;
  if(getComputedStyle(element).visibility==='hidden')continue;
  // Deliberately scrollable tab bars keep offscreen options within the bar.
  if(isScrollableAncestor(element))continue;
  // An animation/slideshow can intentionally have items beyond the edge.
  if(element.closest('[aria-hidden="true"],.gcCelebration,.nightStars'))continue;
  if(box.right>pageWidth+4||box.left<-4)
   overflowControls.push({
     tag:element.tagName,css:element.className?.toString().slice(0,75),
     left:Math.round(box.left),right:Math.round(box.right),
     text:(element.textContent||'').trim().slice(0,44)
   });
 }
 return {
   viewport:pageWidth,
   documentWidth:html.scrollWidth,
   bodyWidth:document.body.scrollWidth,
   rootWidth:root?.getBoundingClientRect().width,
   mainWidth:main?.getBoundingClientRect().width,
   mainRight:main?.getBoundingClientRect().right,
   controls:overflowControls.slice(0,8)
 };
}

for(const width of widths){
 test('all routes fit '+width+'px viewport without horizontal document scroll',async ({browser})=>{
  const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',
    viewport:{width,height:width<=414?812:width===768?1024:900},
    deviceScaleFactor:width<=414?2:1,
    isMobile:width<=414,
    hasTouch:width<=414,
    reducedMotion:'reduce'
  });
  const page=await context.newPage();
  const browserErrors=[];
  page.on('pageerror',error=>browserErrors.push(String(error)));
  for(const path of ROUTE_PATHS){
   browserErrors.length=0;
   await page.goto(path,{waitUntil:'domcontentloaded',timeout:25_000});
   const main=page.locator('.app > main');
   if(!await main.isVisible()){
     const content=(await page.locator('body').innerText()).slice(0,1000);
     console.log('QA_ROUTE_FAILURE',JSON.stringify({width,path,content,errors:browserErrors}));
     expect.soft(false,JSON.stringify({width,path,content,errors:browserErrors})).toBe(true);
     continue;
   }
   await expect(page.locator('.bottomNav')).toBeVisible();
   const report=await page.evaluate(viewportAudit);
   expect.soft(report.documentWidth,JSON.stringify({path,report})).toBeLessThanOrEqual(width+2);
   expect.soft(report.bodyWidth,JSON.stringify({path,report})).toBeLessThanOrEqual(width+2);
   expect.soft(report.mainRight,JSON.stringify({path,report})).toBeLessThanOrEqual(width+2);
   expect.soft(report.controls,JSON.stringify({path,report})).toHaveLength(0);
  }
  await context.close();
 });
}

test('lesson 4: SVG gallery, mobile tabs and game buttons remain usable',async ({browser})=>{
 for(const width of [320,375,390,768]){
  const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width,height:850},isMobile:width<600,hasTouch:width<600,reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.goto('/lessons/4');
  await expect(page.locator('.courseIntro')).toBeVisible();
  await expect(page.locator('.courseIntro > p')).toContainText('Der Tisch ist schön!');
  await expect(page.locator('.lpGalleryCard svg').first()).toBeVisible();
  await page.locator('.bookLessonTabs button').filter({hasText:'Artikel'}).click();
  await expect(page.locator('.bookSectionInfo')).toContainText('Artikel');
  await page.locator('.bookPictureCard').first().click();
  const audit=await page.evaluate(viewportAudit);
  expect.soft(audit.documentWidth,JSON.stringify(audit)).toBeLessThanOrEqual(width+2);
  expect.soft(audit.controls,JSON.stringify(audit)).toHaveLength(0);
  await context.close();
 }
});

test('responsive lesson index opens nested modules and lesson details',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:360,height:800},isMobile:true,hasTouch:true});
 const page=await context.newPage();
 await page.goto('/lessons');
 await expect(page.locator('.ldLesson')).toHaveCount(12);
 const fourth=page.locator('.ldLesson').nth(3);
 await fourth.locator('.ldLessonHeader').click();
 await expect(fourth.locator('.ldTopics li')).toHaveCount(4);
 await expect(fourth.locator('.ldModules')).toBeVisible();
 await fourth.locator('.ldEnter').click();
 await expect(page).toHaveURL(/\/lessons\/4$/);
 await expect(page.locator('.bookLessonRoot')).toBeVisible();
 await context.close();
});

test('number explorer accepts 100 million on a narrow phone',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:360,height:800},isMobile:true,hasTouch:true});
 const page=await context.newPage();
 await page.goto('/numbers');
 const field=page.locator('#number-explore');
 await expect(field).toBeVisible();
 await field.fill('100000000');
 await expect(page.locator('.numberExploreResult')).toContainText('hundert Millionen');
 await expect(page.locator('.numberExploreControls button')).toBeEnabled();
 const audit=await page.evaluate(viewportAudit);
 expect(audit.documentWidth,JSON.stringify(audit)).toBeLessThanOrEqual(362);
 await context.close();
});


test('lesson 2 SVG occupations render without any React runtime error',async ({browser})=>{
 for(const width of [320,390,768]){
  const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',
   viewport:{width,height:850},isMobile:width<600,hasTouch:width<600});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('/lessons/2');
  await expect(page.locator('.courseIntro')).toBeVisible();
  await expect(page.locator('.lpGalleryCard svg').first()).toBeVisible();
  await expect(page.locator('.lpGalleryCard')).toHaveCount(8);
  expect(errors).toEqual([]);
  const audit=await page.evaluate(viewportAudit);
  expect(audit.documentWidth).toBeLessThanOrEqual(width+2);
  await context.close();
 }
});


test('course lesson topics expand and open the exact chosen question',async ({browser})=>{
 for(const width of [360,768]){
  const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',
    viewport:{width,height:850},isMobile:width<600,hasTouch:width<600});
  const page=await context.newPage();
  for(const lesson of [1,2,3,4,5]){
   await page.goto('/lessons');
   const card=page.locator('.ldLesson').nth(lesson-1);
   await card.locator('.ldLessonHeader').click();
   await expect(card.locator('.ldTopics > li')).toHaveCount(4);
   const topic=card.locator('.ldTopics > li').nth(2);
   await topic.locator('.ldTopicSummary').click();
   await expect(topic.locator('.ldExerciseLink').first()).toBeVisible();
   const links=topic.locator('.ldExerciseLink');
   const chosen=links.nth(Math.min(2,(await links.count())-1));
   const title=(await chosen.locator('.ldExerciseTitle').innerText()).trim();
   const href=await chosen.getAttribute('href');
   await chosen.click();
   await expect(page).toHaveURL(new RegExp('/lessons/'+lesson+'\\?section=.+&question=\\d+#book-practice'));
   await expect(page.locator('.bookLessonRoot')).toBeVisible();
   await expect(page.locator('.bookExercise h5')).toHaveText(title);
   const selectedSection=page.locator('.bookLessonTabs button.active');
   await expect(selectedSection).toBeVisible();
   expect(href).toContain('#book-practice');
   const audit=await page.evaluate(viewportAudit);
   expect.soft(audit.documentWidth,JSON.stringify({lesson,width,audit})).toBeLessThanOrEqual(width+2);
  }
  await context.close();
 }
});

test('lesson module links navigate to actual lesson anchors on mobile',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',
   viewport:{width:375,height:812},isMobile:true,hasTouch:true});
 const page=await context.newPage();
 for(const [kind,anchor] of [
   ['grammar','lesson-grammar'],
   ['vocabulary','lesson-vocabulary'],
   ['sentence','lesson-sentences'],
   ['picture','lesson-picture'],
   ['exam','lesson-actions']
 ]){
  await page.goto('/lessons');
  const lesson=page.locator('.ldLesson').nth(3);
  await lesson.locator('.ldLessonHeader').click();
  const item=lesson.locator('.ldModule[href$="#'+anchor+'"]');
  await expect(item).toBeVisible();
  await item.click();
  await expect(page).toHaveURL(new RegExp('/lessons/4#'+anchor+'$'));
  await expect(page.locator('#'+anchor)).toBeAttached();
  const target=await page.locator('#'+anchor).evaluate(node=>node.getBoundingClientRect().top);
  expect(target).toBeLessThan(900);
 }
 await context.close();
});
