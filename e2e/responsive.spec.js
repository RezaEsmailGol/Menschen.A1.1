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
  for(const path of ROUTE_PATHS){
   await page.goto(path,{waitUntil:'domcontentloaded',timeout:25_000});
   await expect(page.locator('.app > main')).toBeVisible();
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
