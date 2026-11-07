import {test,expect} from '@playwright/test';
import JSZip from 'jszip';
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
   if(await card.locator('.ldLessonHeader').getAttribute('aria-expanded')!=='true')
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
  const item=lesson.locator('.ldModule[href$="#'+anchor+'"]').first();
  await expect(item).toBeVisible();
  await item.click();
  await expect(page).toHaveURL(new RegExp('/lessons/4#'+anchor+'$'));
  await expect(page.locator('#'+anchor)).toBeAttached();
  // The application schedules hash scrolling after the React commit.
  await expect.poll(()=>page.locator('#'+anchor).evaluate(node=>node.getBoundingClientRect().top),
    {message:'Anchor should scroll into view after navigation',timeout:6000}).toBeLessThan(900);
 }
 await context.close();
});


function littleWav(){
 const samples=800;
 const out=Buffer.alloc(44+samples*2);
 out.write('RIFF',0);out.writeUInt32LE(out.length-8,4);
 out.write('WAVEfmt ',8);out.writeUInt32LE(16,16);
 out.writeUInt16LE(1,20);out.writeUInt16LE(1,22);
 out.writeUInt32LE(8000,24);out.writeUInt32LE(16000,28);
 out.writeUInt16LE(2,32);out.writeUInt16LE(16,34);
 out.write('data',36);out.writeUInt32LE(samples*2,40);
 return out;
}

test('copyright-safe local Kursbuch ZIP import, lesson grouping, playback and exercise attachment',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:375,height:812},isMobile:true,hasTouch:true});
 const page=await context.newPage();
 await page.goto('/lessons/4?section=furniture&question=5#book-practice');
 await expect(page.locator('.bookExercise h5')).toHaveText('نام وسیله خانه را بشنو و بنویس.');
 await expect(page.locator('#lesson-audio')).toBeVisible();
 await expect(page.locator('.baResources a')).toHaveCount(2);

 const zip=new JSZip();
 zip.file('Lektion04_Tisch.wav',littleWav());
 zip.file('Lektion05_Buch.wav',littleWav());
 const file=await zip.generateAsync({type:'nodebuffer'});
 await page.locator('#lesson-audio input[type=file]').setInputFiles({
  name:'menschen-a11-user-owned.zip',mimeType:'application/zip',buffer:file
 });
 await expect(page.locator('.baMessage')).toContainText('قطعه صوتی فقط در همین مرورگر ذخیره شد.');
 await expect(page.locator('.baTrack')).toHaveCount(1);
 await expect(page.locator('.baTrack').first()).toContainText('Lektion04_Tisch.wav');
 await page.locator('.baTrack').first().click();
 await expect(page.locator('.baPlayer audio')).toHaveAttribute('src',/^blob:/);
 await expect(page.locator('.baTaskAttach button')).toContainText('اتصال این قطعه');
 await page.locator('.baTaskAttach button').click();
 await expect(page.locator('.bookOriginalAudioPrompt')).toBeVisible();
 await page.reload();
 await expect(page.locator('.bookOriginalAudioPrompt')).toBeVisible();
 await expect(page.locator('.baPlayer audio')).toHaveAttribute('src',/^blob:/);

 // ZIP's explicit lesson label keeps lesson 5 tracks out of lesson 4.
 await page.goto('/lessons/5');
 await expect(page.locator('.baTrack')).toHaveCount(1);
 await expect(page.locator('.baTrack').first()).toContainText('Lektion05_Buch.wav');

 // Personal local audio is not bundled into production assets and never uploaded.
 const networkRequests=[];
 page.on('request',request=>{if(request.method()==='POST'||request.method()==='PUT')networkRequests.push(request.url());});
 await page.locator('.baTrack').first().click();
 await expect(page.locator('.baPlayer audio')).toHaveAttribute('src',/^blob:/);
 expect(networkRequests).toEqual([]);
 await context.close();
});

test('lesson audio module is linked in all 12 lesson directories',async ({page})=>{
 await page.goto('/lessons');
 for(let n=1;n<=12;n++){
  const card=page.locator('.ldLesson').nth(n-1);
  const header=card.locator('.ldLessonHeader');
  if(await header.getAttribute('aria-expanded')!=='true')await header.click();
  const module=card.locator('.ldModule[href$="#lesson-audio"]');
  await expect(module).toBeVisible();
  await expect(module).toHaveAttribute('href','/lessons/'+n+'#lesson-audio');
 }
});


test('cloud Kursbuch tracks open from lesson 4, and mapping survives reload without S3 credentials in browser',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',
   viewport:{width:375,height:812},isMobile:true,hasTouch:true});
 const page=await context.newPage();
 await page.route('**/api/audio/catalog?**',async route=>{
  const n=Number(new URL(route.request().url()).searchParams.get('lesson'));
  const tracks=n===4?[
   {book:'kursbuch',path:'Lektion 4, 2.mp3',filename:'Lektion 4, 2.mp3',lesson:4,bytes:14333},
   {book:'arbeitsbuch',path:'Lektion 4, 3b.mp3',filename:'Lektion 4, 3b.mp3',lesson:4,bytes:12333}
  ]:[];
  await route.fulfill({status:200,contentType:'application/json',
   body:JSON.stringify({configured:true,lesson:n,tracks,totals:{kursbuch:38,arbeitsbuch:25},uncategorized:0})});
 });
 await page.route('**/api/audio/play?**',async route=>{
  const url=new URL(route.request().url());
  const relative='/api/audio/stream?'+new URLSearchParams({
   book:url.searchParams.get('book'),path:url.searchParams.get('path')
  });
  await route.fulfill({status:200,contentType:'application/json',
    body:JSON.stringify({url:relative,expiresIn:0})});
 });
 await page.route('**/api/audio/stream?**',route=>route.fulfill({
  status:200,contentType:'audio/wav',body:littleWav()
 }));
 await page.goto('/lessons/4?section=furniture&question=5#book-practice');
 await expect(page.locator('.caRoot')).toBeVisible();
 await expect(page.locator('.caEntry')).toHaveCount(1);
 await expect(page.locator('.caEntry')).toContainText('Lektion 4, 2.mp3');
 await page.locator('.caEntry>button').first().click();
 await expect(page.locator('.caPlayer audio')).toHaveAttribute('src',/^\/api\/audio\/stream\?/);
 await page.locator('.caAttach').click();
 await expect(page.locator('.caAttach')).toContainText('متصل');
 await expect(page.locator('.caTaskPlayer button')).toBeVisible();
 await page.reload();
 await expect(page.locator('.caTaskPlayer button')).toBeVisible();
 await page.locator('.caTaskPlayer button').click();
 await expect(page.locator('.caTaskPlayer audio')).toHaveAttribute('src',/^\/api\/audio\/stream\?/);
 const body=await page.content();
 expect(body).not.toContain('MENSCHEN_S3_SECRET_ACCESS_KEY');
 expect(body).not.toContain('s3-pish.runflare.cloud');
 const report=await page.evaluate(viewportAudit);
 expect(report.documentWidth).toBeLessThanOrEqual(377);
 await context.close();
});


test('Persian grammar walkthrough on a narrow phone keeps answers after reload',async ({browser})=>{
 const context=await browser.newContext({viewport:{width:360,height:780}});
 const page=await context.newPage();
 try{
  await page.goto('/lessons/5#lesson-grammar');
  const grammar=page.locator('#lesson-grammar');
  await expect(grammar).toBeVisible();
  await expect(grammar.locator('h3')).toContainText('دستور زبان درس 5');
  await expect(grammar.locator('.pgTable')).toContainText('Nominativ').catch(async ()=>{
   await expect(grammar.locator('.pgTable')).toContainText('kein');
  });
  await expect(grammar.locator('.pgChoices button')).toHaveCount(4);
  await grammar.getByRole('button',{name:'Das',exact:true}).click();
  await expect(grammar.locator('.pgFeedbackCorrect')).toContainText('آفرین');
  await expect(grammar.locator('.pgProgress')).toHaveAttribute('aria-valuenow','1');
  await page.reload();
  await expect(page.locator('#lesson-grammar .pgProgress')).toHaveAttribute('aria-valuenow','1');
  const documentWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
  expect(documentWidth).toBeLessThanOrEqual(364);
 }finally{
  await context.close();
 }
});
