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

test('lesson 6: office SVG gallery exposes 18 objects and four article grammar modes',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',
  viewport:{width:360,height:800},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/lessons/6');
 await expect(page.locator('.courseIntro')).toBeVisible();
 await expect(page.locator('.lpGame')).toBeVisible();
 await expect(page.locator('.lpCount b')).toHaveText('18');
 await expect(page.locator('.lpGalleryCard svg').first()).toBeVisible();
 await page.locator('.lpMore').click();
 await expect(page.locator('.lpGalleryCard')).toHaveCount(18);
 await expect(page.locator('.lpModeRow button')).toHaveCount(4);
 await page.locator('.lpModeRow button').filter({hasText:'Singular / Plural'}).click();
 await page.locator('.lpStart').click();
 await expect(page.locator('.lpPlay')).toBeVisible();
 await expect(page.locator('.lpQuestionView svg[role="img"]')).toBeVisible();
 await expect(page.locator('.lpChoices button')).toHaveCount(4);
 expect(errors).toEqual([]);
 await context.close();
});

test('Akkusativ quest practices den, einen and keinen on a phone',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:360,height:800},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/articles');
 await expect(page.locator('.atRoot')).toBeVisible();
 await expect(page.locator('.atAkkJourney')).toBeVisible();
 await expect(page.locator('.atAkkStage')).toHaveCount(3);
 const definite=page.locator('.atAkkStage').nth(0);
 const indefinite=page.locator('.atAkkStage').nth(1);
 const negative=page.locator('.atAkkStage').nth(2);
 await expect(definite).toContainText('der Laptop → den Laptop');
 await expect(indefinite).toContainText('ein Laptop → einen Laptop');
 await expect(negative).toContainText('kein Laptop → keinen Laptop');
 await indefinite.click();
 await expect(indefinite).toHaveAttribute('aria-pressed','true');
 await page.locator('.atActions button').first().click();
 await expect(page.locator('.atQuiz')).toBeVisible();
 await expect(page.locator('.atQuiz h2')).toContainText('Akkusativ');
 await expect(page.locator('.atOptions button')).toHaveCount(4);
 await expect(page.locator('.atPronounPanel')).toContainText('dich');
 expect(errors).toEqual([]);
 const audit=await page.evaluate(viewportAudit);
 expect.soft(audit.documentWidth,JSON.stringify(audit)).toBeLessThanOrEqual(362);
 expect.soft(audit.controls,JSON.stringify(audit)).toHaveLength(0);
 await context.close();
});

test('lesson 5 picture game offers a supplemental Akkusativ round',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:360,height:800},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/lessons/5');
 await expect(page.locator('.lpGame')).toBeVisible();
 await expect(page.locator('.lpModeRow button')).toHaveCount(3);
 await page.locator('.lpModeRow button').filter({hasText:'Akkusativ'}).click();
 await page.locator('.lpStart').click();
 await expect(page.locator('.lpPlay')).toBeVisible();
 await expect(page.locator('.lpChoices button')).toHaveCount(4);
 expect(errors).toEqual([]);
 const audit=await page.evaluate(viewportAudit);
 expect.soft(audit.documentWidth,JSON.stringify(audit)).toBeLessThanOrEqual(362);
 expect.soft(audit.controls,JSON.stringify(audit)).toHaveLength(0);
 await context.close();
});

test('verb trainer shows six conjugations and records a classroom verb answer',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:360,height:800},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/verbs');
 await expect(page.locator('.verbTrainer')).toBeVisible();
 await expect(page.locator('.vtConjRow')).toHaveCount(6);
 await page.locator('.vtGroupTabs button').filter({hasText:'افعال تخته کلاس'}).click();
 await expect(page.locator('.vtVerbTitle h2')).toHaveText('fahren');
 await expect(page.locator('.vtConjRow').filter({hasText:'du'})).toContainText('fährst');
 await page.locator('.vtActions button').first().click();
 await expect(page.locator('.vtQuiz')).toBeVisible();
 const prompt=(await page.locator('.vtQuiz h2').innerText()).split('+').map(x=>x.trim());
 const answers={ich:'fahre',du:'fährst','er/sie/es':'fährt',wir:'fahren',ihr:'fahrt','sie/Sie':'fahren'};
 await page.locator('.vtQuiz input').fill(answers[prompt[0]]);
 await page.locator('.vtQuiz form button').click();
 await expect(page.locator('.vtFeedback.right')).toBeVisible();
 expect(errors).toEqual([]);
 const audit=await page.evaluate(viewportAudit);
 expect.soft(audit.documentWidth,JSON.stringify(audit)).toBeLessThanOrEqual(362);
 expect.soft(audit.controls,JSON.stringify(audit)).toHaveLength(0);
 await context.close();
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

test('each of 12 lessons has four exercise sections with inline audio button on phone',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:375,height:812},isMobile:true,hasTouch:true});
 const page=await context.newPage();
 await page.route('**/api/audio/catalog?**',route=>route.fulfill({
  status:200,contentType:'application/json',body:JSON.stringify({configured:false,tracks:[]})
 }));
 for(let lesson=1;lesson<=12;lesson++){
  await page.goto('/lessons/'+lesson);
  await expect(page.locator('.bookLessonRoot')).toBeVisible();
  await expect(page.locator('.bookLessonTabs button')).toHaveCount(5);
  await expect(page.locator('.laExercisePlay')).toHaveCount(1);
  await expect(page.locator('.baRoot,.caRoot,.baUpload')).toHaveCount(0);
  await page.locator('.bookLessonTabs button').nth(3).click();
  await expect(page.locator('.bookExercise h5')).toBeVisible();
  await expect(page.locator('.laExercisePlay')).toBeVisible();
  const width=await page.evaluate(()=>document.documentElement.scrollWidth);
  expect.soft(width,'lesson '+lesson).toBeLessThanOrEqual(377);
 }
 await context.close();
});

test('listening directory shortcuts open the exercise player in all twelve lessons',async ({page})=>{
 await page.goto('/lessons');
 for(let n=1;n<=12;n++){
  const card=page.locator('.ldLesson').nth(n-1);
  const header=card.locator('.ldLessonHeader');
  if(await header.getAttribute('aria-expanded')!=='true')await header.click();
  const module=card.locator('.ldModule[href$="#book-practice"]');
  await expect(module).toBeVisible();
  await expect(module).toHaveAttribute('href','/lessons/'+n+'#book-practice');
  await expect(card.locator('.ldTopics > li')).toHaveCount(4);
 }
});

test('lesson 4 plays a manually linked book MP3 inside its illustrated learning card',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:375,height:812},isMobile:true,hasTouch:true});
 const page=await context.newPage();
 await page.route('**/api/audio/catalog?**',route=>route.fulfill({
  status:200,contentType:'application/json',
  body:JSON.stringify({configured:true,lesson:4,tracks:[
   {book:'kursbuch',path:'Lektion 4, 2.mp3',filename:'Lektion 4, 2.mp3',lesson:4,bytes:4000},
   {book:'arbeitsbuch',path:'Lektion 4, 3b.mp3',filename:'Lektion 4, 3b.mp3',lesson:4,bytes:3000}
  ]})
 }));
 await page.route('**/api/audio/play?**',async route=>{
  const params=new URL(route.request().url()).searchParams;
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
   url:'/api/audio/stream?'+new URLSearchParams({book:params.get('book'),path:params.get('path')})
  })});
 });
 await page.route('**/api/audio/stream?**',route=>route.fulfill({
  status:200,contentType:'audio/wav',body:littleWav()
 }));
 await page.goto('/lessons/4?section=furniture&question=5#book-practice');
 const workbook=page.locator('.laWorkbook');
 await expect(workbook.locator('.laWorkbookPage')).toBeVisible();
 await workbook.locator('.laOriginalToggle').click();
 const selector=workbook.getByRole('combobox',{name:'انتخاب فایل صوتی برای کارت فعلی'});
 await expect(selector.locator('option')).toHaveCount(3);
 await selector.selectOption('kursbuch:Lektion 4, 2.mp3');
 await workbook.getByRole('button',{name:'پخش فایل اصلی'}).click();
 await expect(workbook.locator('.laWorkbookOriginal audio')).toHaveAttribute('src',/\/api\/audio\/stream\?/);
 await expect(workbook.locator('.laWorkbookArt svg')).toBeVisible();
 await expect(workbook.locator('.laWorkbookText')).toBeVisible();
 await expect(page.locator('.laExercisePlay')).toBeVisible();
 await expect(page.locator('.baUpload,.baRoot,.caRoot,.laStrip')).toHaveCount(0);
 await page.reload();
 await workbook.locator('.laOriginalToggle').click();
 await expect(workbook.getByRole('combobox',{name:'انتخاب فایل صوتی برای کارت فعلی'})).toHaveValue('kursbuch:Lektion 4, 2.mp3');
 const visible=await page.locator('.app').innerText();
 expect(visible).not.toMatch(/رانفلر|Runflare|ZIP|آپلود/);
 expect((await page.content())).not.toContain('MENSCHEN_S3_SECRET_ACCESS_KEY');
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
  await expect(grammar.locator('.pgTable')).toContainText('kein');
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

test('Android PWA files are served as real icons and manifest, not SPA HTML',async ({page})=>{
 await page.goto('/lessons/5');
 const manifestResponse=await page.request.get('/manifest.webmanifest');
 expect(manifestResponse.ok()).toBeTruthy();
 const manifest=await manifestResponse.json();
 expect(manifest.display).toBe('standalone');
 expect(manifest.start_url).toBe('/');
 await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href','/manifest.webmanifest');
 for(const size of [192,512]){
  const response=await page.request.get('/icons/icon-'+size+'.png');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toMatch(/image\/png/i);
  const bytes=await response.body();
  expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(bytes.readUInt32BE(16)).toBe(size);
 }
 const maskable=await page.request.get('/icons/icon-maskable-512.png');
 expect(maskable.ok()).toBeTruthy();
 expect((await maskable.body()).readUInt32BE(16)).toBe(512);
 const serviceWorker=await page.request.get('/sw.js');
 expect(serviceWorker.ok()).toBeTruthy();
 expect(await serviceWorker.text()).toContain('CACHE_PREFIX');
});

test('home resume, lesson and practice buttons work on Android-sized screens',async ({browser})=>{
 const context=await browser.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
 await context.addInitScript(()=>{
   localStorage.setItem('dt_current_lesson','5');
   localStorage.setItem('dt_book_lessons_v1',JSON.stringify({5:{answers:{'l5-o01':{correct:true}}}}));
 });
 const page=await context.newPage();
 try{
  await page.goto('/');
  await expect(page.locator('.homeV2Hero')).toBeVisible();
  const resume=page.locator('.homeV2Primary');
  await expect(resume).toContainText('ادامه درس 5');
  await expect(page.locator('.homeV2HeroFoot')).toContainText('از 40 تمرین');
  const exercise=page.locator('.homeV2Secondary');
  await expect(exercise).toHaveAttribute('href',/\/lessons\/5\?section=.+&question=2#book-practice$/);
  await expect(page.locator('.homeV2Destinations a')).toHaveCount(2);
  await page.locator('.homeV2Destinations a[href="/practice"]').click();
  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.getByRole('heading',{name:'تمرین‌های آلمانی'})).toBeVisible();
  await page.getByRole('button',{name:'گفتار و شنیدن'}).click();
  await expect(page.locator('.practiceV2Tiles')).toContainText('مربی تلفظ من');
  await expect(page.locator('.practiceV2Tiles')).not.toContainText('بازی اعداد');
  await page.getByRole('button',{name:'همه تمرین‌ها'}).click();
  await page.getByRole('searchbox',{name:'جست‌وجو در تمرین‌ها'}).fill('بازی اعداد تا');
  await expect(page.locator('.practiceV2Tiles')).toContainText('بازی اعداد');
  await expect(page.locator('.practiceV2Tiles .practiceTile')).toHaveCount(1);
  await page.locator('.bottomNav a[href="/lessons"]').click();
  await expect(page).toHaveURL(/\/lessons$/);
  await expect(page.locator('.ldRoot')).toBeVisible();
  await page.locator('.bottomNav a[href="/"]').click();
  await expect(page).toHaveURL('/');
  await page.locator('.homeV2Primary').click();
  await expect(page).toHaveURL(/\/lessons\/5$/);
 }finally{await context.close();}
});

test('mobile header, dashboard shortcuts and nav never force horizontal page overflow',async ({browser})=>{
 for(const width of [320,360,390]){
  const context=await browser.newContext({viewport:{width,height:780},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  try{
   for(const path of ['/','/practice']){
    await page.goto(path);
    await expect(page.locator('.topbar')).toBeVisible();
    await expect(page.locator('.bottomNav a')).toHaveCount(4);
    const dimensions=await page.evaluate(()=>({
      documentWidth:document.documentElement.scrollWidth,
      viewport:innerWidth,
      headerHeight:document.querySelector('.topbar').getBoundingClientRect().height
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(width+3);
    expect(dimensions.headerHeight).toBeLessThan(135);
   }
  }finally{await context.close();}
 }
});


test('supplemental lesson shows book sound inside the current illustrated exercise',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:360,height:780},isMobile:true,hasTouch:true});
 const page=await context.newPage();
 await page.route('**/api/audio/catalog?**',route=>route.fulfill({
  status:200,contentType:'application/json',body:JSON.stringify({configured:true,tracks:[
   {book:'kursbuch',filename:'Lektion 9, 1.mp3',path:'Lektion 9, 1.mp3',lesson:9,bytes:2200}
  ]})
 }));
 await page.goto('/lessons/9');
 const studio=page.locator('.laWorkbook');
 await expect(studio).toBeVisible();
 await expect(studio.locator('.laWorkbookIndex button')).toHaveCount(6);
 await expect(studio.locator('.laWorkbookPage')).toBeVisible();
 await studio.locator('.laOriginalToggle').click();
 const trackSelect=studio.getByRole('combobox',{name:'انتخاب فایل صوتی برای کارت فعلی'});
 await expect(trackSelect.locator('option')).toHaveCount(2);
 await trackSelect.selectOption('kursbuch:Lektion 9, 1.mp3');
 await expect(studio.getByRole('button',{name:'پخش فایل اصلی'})).toBeEnabled();
 const binding=await page.evaluate(()=>JSON.parse(localStorage.getItem('dt_menschen_audio_card_tracks_v1')));
 expect(binding['9:a9-1']).toEqual({book:'kursbuch',path:'Lektion 9, 1.mp3'});
 await studio.locator('.laWorkbookIndex button').nth(1).click();
 await expect(trackSelect).toHaveValue('');
 await studio.locator('.laWorkbookIndex button').first().click();
 await expect(trackSelect).toHaveValue('kursbuch:Lektion 9, 1.mp3');
 await expect(page.locator('.bookLessonTabs button')).toHaveCount(5);
 await expect(page.locator('.baUpload,.baRoot,.caRoot,.laStrip')).toHaveCount(0);
 await context.close();
});
test('without cloud clips, exercises keep working with their own audio buttons',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:360,height:790},isMobile:true,hasTouch:true});
 const page=await context.newPage();
 await page.route('**/api/audio/catalog?**',route=>route.fulfill({
  status:200,contentType:'application/json',body:JSON.stringify({configured:false,lesson:4,tracks:[]})
 }));
 await page.goto('/lessons/4');
 await expect(page.locator('.laStrip,.baUpload,.caRoot')).toHaveCount(0);
 const play=page.locator('.laExercisePlay');
 await expect(play).toBeVisible();
 await expect(play).toBeEnabled();
 await play.click();
 await expect(page.locator('.bookExercise')).toBeVisible();
 await context.close();
});



test('one illustrated book page integrates pronunciation, dictation and meaning on a narrow phone',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:360,height:820},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 await context.addInitScript(()=>{
  window.SpeechRecognition=class FakeSpeechRecognition{
   start(){setTimeout(()=>{this.onresult?.({results:[[{transcript:'Hallo!'}]]});this.onend?.();},30);}
   abort(){this.onend?.();}
  };
 });
 const page=await context.newPage();
 await page.route('**/api/audio/catalog?**',route=>route.fulfill({
  status:200,contentType:'application/json',body:JSON.stringify({configured:false,tracks:[]})
 }));
 await page.goto('/lessons/1');
 const studio=page.locator('.laWorkbook');
 await expect(studio).toBeVisible();
 await expect(studio.locator('.laWorkbookIndex button')).toHaveCount(6);
 await expect(studio.locator('.laWorkbookPage')).toHaveCount(1);
 await expect(studio.locator('.laWorkbookArt svg')).toBeVisible();
 await expect(studio.locator('.laWorkbookText')).toContainText('Hallo!');
 await expect(studio.locator('.laWorkbookText')).toContainText('سلام!');
 await expect(studio.locator('.laWorkbookOriginalPlay')).toBeDisabled();
 await studio.getByRole('button',{name:'تلفظ',exact:true}).click();
 await studio.getByRole('button',{name:'شروع سنجش تلفظ'}).click();
 await expect(studio.locator('.laWorkbookSpeechScore')).toContainText('100٪');
 await studio.getByRole('button',{name:'دیکته',exact:true}).click();
 await expect(studio.locator('.laWorkbookMasked')).toBeVisible();
 await studio.getByRole('textbox',{name:'متن شنیده‌شده به آلمانی'}).fill('Hallo');
 await studio.getByRole('button',{name:'بررسی'}).click();
 await expect(studio.locator('.laWorkbookFeedback.correct')).toBeVisible();
 await studio.getByRole('button',{name:'معنی',exact:true}).click();
 await expect(studio.locator('.laWorkbookText')).not.toContainText('سلام!');
 await studio.locator('.laWorkbookMeaningChoices button').filter({hasText:'سلام!'}).click();
 await expect(studio.locator('.laWorkbookFeedback.correct')).toBeVisible();
 const width=await page.evaluate(()=>document.documentElement.scrollWidth);
 expect(width).toBeLessThanOrEqual(363);
 await page.reload();
 await expect(page.locator('.laWorkbookProgress')).toHaveAttribute('aria-valuenow','1');
 await expect(page.locator('.laWorkbook')).toBeVisible();
 await expect(page.locator('.baRoot,.caRoot,.baUpload,.laAudioCard,.laStrip')).toHaveCount(0);
 expect(await page.locator('.laWorkbook').innerText()).not.toMatch(/رانفلر|Runflare|آپلود|ZIP/);
 await context.close();
});

test('every illustrated audio lesson displays one card at a time and six selectable pages',async ({page})=>{
 await page.route('**/api/audio/catalog?**',route=>route.fulfill({
  status:200,contentType:'application/json',body:JSON.stringify({configured:false,tracks:[]})
 }));
 for(const id of [2,4,5,6,9,12]){
  await page.goto('/lessons/'+id);
  const studio=page.locator('.laWorkbook');
  await expect(studio.locator('.laWorkbookIndex button')).toHaveCount(6);
  await expect(studio.locator('.laWorkbookPage')).toHaveCount(1);
  await expect(studio.locator('.laWorkbookTabs button')).toHaveCount(4);
  await studio.locator('.laWorkbookPaging button').last().click();
  await expect(studio.locator('.laWorkbookPageTop')).toContainText('SEITE 2 / 6');
 }
});


test('progress achievements show real earned medals, weekly graph, audio and lesson progress on narrow phones',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:360,height:800},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();
 await page.addInitScript(()=>{
  const now=Date.now();
  const today=new Date(now);const day=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
  const memory={
   version:1,items:{'start:vocab':{id:'start:vocab',lesson:1,kind:'vocab',label:'Hallo',mastery:35,correct:1,wrong:0,attempts:1,reviewedDays:1,lastAt:now,nextAt:now+86400000,lastCorrect:true}},
   days:{[day]:{attempts:5,correct:4,xp:42}},history:[{id:'audiotest',kind:'dictation',correct:true,at:now}],
   totalXP:42
  };
  localStorage.setItem('dt_mastery_v1',JSON.stringify(memory));
  localStorage.setItem('dt_book_lessons_v1',JSON.stringify({1:{answers:{'l1-g1':{correct:true,attempts:1}}}}));
  localStorage.setItem('dt_audio_learning_v1',JSON.stringify({completed:{'1:a1-1:dictation':true},
    speech:{'1:a1-1:repeat':{lesson:1,score:90,heard:'Hallo'}},plays:{'1:a1-1:listen':2}}));
 });
 await page.goto('/progress');
 await expect(page.locator('.pgDashboard')).toBeVisible();
 await expect(page.locator('.pgHero')).toContainText('۴۲');
 await expect(page.locator('.pgBadge')).toHaveCount(12);
 await expect(page.locator('.pgBadge.earned')).not.toHaveCount(0);
 await expect(page.locator('.pgMedalArt.locked')).not.toHaveCount(0);
 await expect(page.locator('.pgMission')).toHaveCount(3);
 await expect(page.locator('.pgBarColumn')).toHaveCount(7);
 await expect(page.locator('.pgLesson')).toHaveCount(12);
 await expect(page.locator('.pgMetrics')).toContainText('تمرین صوتی موفق');
 await page.locator('.pgBadge').filter({hasText:'شنونده حرفه‌ای'}).click();
 await expect(page.locator('.pgBadgeDetail')).toContainText('۱۲ تمرین صوتی متفاوت');
 await expect(page.locator('.pgBadgeDetail')).toContainText('تا باز شدن مدال');
 await expect(page.locator('.gameBackup')).toBeVisible();
 const width=await page.evaluate(()=>document.documentElement.scrollWidth);
 expect(width).toBeLessThanOrEqual(362);
 const href=await page.locator('.pgLesson').first().getAttribute('href');
 expect(href).toMatch(/^\/lessons\/1\?section=/);
 await context.close();
});

test('fresh learner progress keeps trophies locked and shows no fabricated speech score',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:320,height:780},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();
 await page.goto('/progress');
 await expect(page.locator('.pgBadge.earned')).toHaveCount(0);
 await expect(page.locator('.pgBadge.unearned')).toHaveCount(12);
 await expect(page.locator('.pgHeroLevel')).toContainText('سطح');
 await expect(page.locator('.pgMetrics')).toContainText('—');
 await expect(page.locator('.pgLesson')).toHaveCount(12);
 await expect(page.locator('.pgBarColumn')).toHaveCount(7);
 const width=await page.evaluate(()=>document.documentElement.scrollWidth);
 expect(width).toBeLessThanOrEqual(322);
 await context.close();
});


test('new practice studio has 400 lesson exercises, four deep-linked skills and usable legacy activities',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',
  viewport:{width:360,height:800},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();
 await page.goto('/practice');
 await expect(page.locator('.pjHero')).toContainText('۴۰۰');
 await expect(page.locator('.pjLessonCard')).toHaveCount(12);
 await expect(page.locator('.pjQuickMode')).toHaveCount(4);
 await expect(page.locator('.pjModeTabs button')).toHaveCount(5);
 await expect(page.locator('.pjCompactLessonGrid')).toBeVisible();
 await expect(page.locator('.pjLessonCard.open .pjSectionLink')).toHaveCount(0);
 await expect(page.locator('.practiceV2FocusLinks a')).toHaveCount(2);
 await expect(page.locator('.practiceV2Catalog')).toContainText('بازی اعداد');
 await expect(page.locator('.practiceV2Catalog')).toContainText('مرور هوشمند');
 await page.locator('.pjSearch input').fill('مبلمان');
 await expect(page.locator('.pjLessonCard')).toHaveCount(1);
 await expect(page.locator('.pjLessonCard h4')).toContainText('مبلمان');
 await page.locator('.pjLessonStart').click();
 await expect(page).toHaveURL(/\/practice\/lesson\/4/);
 await expect(page.locator('.pjDetailSections .pjDetailSection')).toHaveCount(5);
 await page.locator('.pjDetailModeTabs button').filter({hasText:'شنیداری'}).click();
 await expect(page.locator('.pjDetailSections .pjDetailSection')).toHaveCount(2);
 const href=await page.locator('.pjDetailSection').first().getAttribute('href');
 expect(href).toMatch(/^\/lessons\/4\?section=/);
 await page.locator('.pjDetailSection').first().click();
 await expect(page).toHaveURL(/\/lessons\/4\?section=.*#book-practice/);
 await expect(page.locator('.bookLessonRoot')).toBeVisible();
 await context.close();
});

test('intensive number and clock drill pages fit 320px and support writing, audio and flashcards',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',
  viewport:{width:320,height:740},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();
 await page.goto('/number-mastery');
 await expect(page.locator('.ipHeader')).toContainText('اعداد');
 await expect(page.locator('.ipScroll').first().locator('button')).toHaveCount(5);
 await expect(page.locator('.ipRule')).toContainText('۹۰٪');
 await page.getByRole('button',{name:/شروع آزمون/}).click();
 await expect(page.locator('.ipQuestion')).toBeVisible();
 await expect(page.locator('#ip-entry')).toBeVisible();
 const widthNumbers=await page.evaluate(()=>document.documentElement.scrollWidth);
 expect(widthNumbers).toBeLessThanOrEqual(322);
 await page.goto('/clock-mastery');
 await expect(page.locator('.ipHeader')).toContainText('ساعت');
 await page.locator('.ipToggle button').filter({hasText:'محاوره‌ای'}).click();
 await page.getByRole('button',{name:/فلش‌کارت سخت/}).click();
 await page.getByRole('button',{name:/شروع آزمون/}).click();
 await page.getByRole('button',{name:'نمایش پاسخ پشت فلش‌کارت'}).click();
 await expect(page.locator('.ipReveal')).toBeVisible();
 const widthClock=await page.evaluate(()=>document.documentElement.scrollWidth);
 expect(widthClock).toBeLessThanOrEqual(322);
 await context.close();
});

test('practice progress shows saved book answers, audio progress and filters at 320px without overflow',async ({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',
  viewport:{width:320,height:780},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();
 await page.addInitScript(()=>{
  localStorage.setItem('dt_book_lessons_v1',JSON.stringify({4:{answers:{
   'l4-f01':{attempts:1,correct:true},
   'l4-f02':{attempts:2,correct:false}
  }}}));
  localStorage.setItem('dt_audio_learning_v1',JSON.stringify({completed:{'4:a4-1:dictation':true}}));
 });
 await page.goto('/practice');
 await expect(page.locator('.pjLessonCard')).toHaveCount(12);
 await expect(page.locator('.pjHero')).toContainText('تمرین صوتی موفق');
 await expect(page.locator('.pjHero')).toContainText('۱');
 await page.getByLabel('فیلتر وضعیت درس‌ها').selectOption('ongoing');
 await expect(page.locator('.pjLessonCard')).toHaveCount(1);
 await expect(page.locator('.pjLessonCard')).toContainText('مبلمان');
 await page.getByLabel('فیلتر وضعیت درس‌ها').selectOption('done');
 await expect(page.locator('.pjLessonCard')).toHaveCount(0);
 await expect(page.locator('.pjEmpty')).toBeVisible();
 await page.locator('.pjEmpty button').click();
 await expect(page.locator('.pjLessonCard')).toHaveCount(12);
 const audit=await page.evaluate(viewportAudit);
 expect(audit.documentWidth).toBeLessThanOrEqual(322);
 expect(audit.controls).toHaveLength(0);
 await context.close();
});

test('four-form noun challenge corrects each form and persists real XP on mobile',async ({page})=>{
 await page.setViewportSize({width:360,height:800});
 await page.goto('/practice');
 await page.locator('.ffLaunch').click();
 await expect(page).toHaveURL(/\/lessons\/6#four-form/);
 const trainer=page.locator('.ffRoot');
 await expect(trainer).toBeVisible();
 await expect(trainer.locator('.ffWord b')).toHaveText('Laptop');
 await trainer.getByRole('button',{name:'der',exact:true}).click();
 await trainer.getByLabel('جمع',{exact:true}).fill('Laptops');
 await trainer.getByLabel('Akkusativ مثبت',{exact:true}).fill('einen Laptop');
 await trainer.getByLabel('Akkusativ منفی',{exact:true}).fill('kein Laptop');
 await trainer.getByRole('button',{name:'بررسی هر چهار پاسخ'}).click();
 await expect(trainer.locator('.ffResult.ok')).toHaveCount(3);
 await expect(trainer.locator('.ffResult.bad')).toContainText('keinen Laptop');
 await expect(trainer.locator('.ffResults h4')).toContainText('۳۲ XP');
 await trainer.getByRole('button',{name:'واژه بعدی'}).click();
 await expect(trainer.locator('.ffWord b')).toHaveText('Maus');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(362);
 await page.reload();
 await expect(trainer.locator('.ffStats')).toContainText('۳ / ۱۰۰');
});

test('lesson 8 classroom mini-games and expanded questions work on a narrow phone',async ({page})=>{
 await page.setViewportSize({width:360,height:800});
 await page.goto('/lessons/8?section=grammar-practice&question=9#book-practice');
 const lab=page.locator('#lesson8-time-lab');
 await expect(lab).toBeVisible();
 await expect(lab.locator('.l8-modes button')).toHaveCount(6);
 await lab.locator('.l8-modes button').filter({hasText:'ماه‌ها'}).click();
 await expect(lab.locator('.l8-question-top')).toContainText('12');
 await lab.locator('.l8-choice-grid button').filter({hasText:'Januar'}).click();
 await expect(lab.locator('.l8-result')).toContainText('درست بود');
 await lab.locator('.l8-modes button').filter({hasText:'ساعت‌ها'}).click();
 await expect(lab.locator('svg.l8-clock')).toBeVisible();
 await lab.locator('.l8-modes button').filter({hasText:'قرار ملاقات'}).click();
 await lab.locator('.l8-choice-grid').getByRole('button',{name:'Hast du am Freitag um fünf Uhr Zeit?',exact:true}).click();
 await expect(lab.locator('.l8-result')).toContainText('درست بود');
 await lab.locator('.l8-modes button').filter({hasText:'قیدهای تکرار'}).click();
 await lab.locator('.l8-choice-grid').getByRole('button',{name:'immer',exact:true}).click();
 await expect(lab.locator('.l8-result')).toContainText('درست بود');
 await lab.locator('.l8-modes button').filter({hasText:'jeden / jede / jedes'}).click();
 await lab.locator('.l8-choice-grid').getByRole('button',{name:'jeden Tag',exact:true}).click();
 await expect(lab.locator('.l8-result')).toContainText('درست بود');
 const exercise=page.locator('.bookExercise');
 await expect(exercise).toContainText('Ich lerne ___ Tag Deutsch.');
 await exercise.locator('.bookOptions').getByRole('button',{name:'jeden',exact:true}).click();
 await expect(exercise.locator('.bookFeedback')).toContainText('پاسخ درست است');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('dt_book_lessons_v1')||'{}'));
 expect(saved[8].answers['l8-class-g01'].correct).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(362);
});

test('organized practice page resumes selected lesson and opens the correct lesson 8 game directly',async({page})=>{
 await page.setViewportSize({width:360,height:800});
 await page.addInitScript(()=>localStorage.setItem('dt_current_lesson','8'));
 await page.goto('/practice');
 await expect(page.locator('.pjHero .pjMainAction')).toHaveAttribute('href',/\/lessons\/8\?/);
 await expect(page.locator('.practiceV2Header')).toContainText('۴۰۰');
 await expect(page.locator('.pjSpotlightGrid .pjLabLink')).toHaveCount(6);
 await page.locator('.pjSearch input').fill('درس ۸');
 await expect(page.locator('.pjLessonCard')).toHaveCount(1);
 await expect(page.locator('.pjLessonCard h4')).toContainText('ماه');
 await page.locator('.pjSpotlightGrid .pjLabLink').filter({hasText:'ماه‌های سال'}).click();
 await expect(page).toHaveURL(/\/lessons\/8\?lab=months#lesson8-time-lab/);
 await expect(page.locator('.l8-modes button.active')).toContainText('ماه‌ها');
 await expect(page.locator('.l8-question-top')).toContainText('12');
});

test('speech gauge and word memory persist the primary transcript on mobile',async ({page})=>{
 await page.setViewportSize({width:360,height:800});
 await page.addInitScript(()=>{window.SpeechRecognition=class{start(){setTimeout(()=>{this.onresult?.({results:[[{transcript:'Buch'},{transcript:'Hallo!'}]]});this.onend?.()},30)} abort(){} stop(){this.onend?.()}}});
 await page.goto('/lessons/1#lesson-audio');
 const studio=page.locator('.laWorkbook');
 await studio.getByRole('button',{name:'تلفظ',exact:true}).click();
 await expect(studio.locator('.speechGauge')).toContainText('هنوز ارزیابی نشده');
 await studio.getByRole('button',{name:'شروع سنجش تلفظ'}).click();
 await expect(studio.locator('.speechGauge')).toHaveAttribute('aria-valuenow','0');
 await expect(studio.locator('.speechWordRows .missed')).toContainText('Hallo');
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_speaking_v1')||'{}').words?.hallo?.misses)).toBe(1);
 await expect(studio.locator('.speechWeakLink')).toBeVisible();
});

test('audio practice stays compact on small phones and optional book audio does not interrupt speaking',async ({browser})=>{
 for(const colorScheme of ['light','dark']){
  const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width:360,height:720},isMobile:true,hasTouch:true,colorScheme,reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.route('**/api/audio/catalog?**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({configured:false,tracks:[]})}));
  await page.goto('/lessons/2#lesson-audio');
  const studio=page.locator('.laWorkbook');
  await studio.getByRole('button',{name:'تلفظ',exact:true}).click();
  await expect(studio.locator('.laWorkbookOriginal')).not.toHaveAttribute('open','');
  await expect(studio.locator('.laWorkbookOriginal .laWorkbookSelect')).toBeHidden();
  const rect=await studio.evaluate(el=>{
   const bounds=s=>el.querySelector(s).getBoundingClientRect();
   const card=bounds('.laWorkbookPage'),art=bounds('.laWorkbookArt'),word=bounds('.laWorkbookText'),gauge=bounds('.speechGauge'),mic=bounds('.laMicActions'),paging=bounds('.laWorkbookPaging'),original=bounds('.laWorkbookOriginal');
   return {height:card.height,art:art.height,sameRow:Math.abs(art.top-word.top)<40,actionsNear:Math.abs(gauge.top-mic.top)<70,pagingBeforeAudio:paging.bottom<=original.top+2,overflow:document.documentElement.scrollWidth,viewport:innerWidth};
  });
  expect(rect.height).toBeLessThan(480);
  expect(rect.art).toBeLessThanOrEqual(105);
  expect(rect.sameRow).toBeTruthy();
  expect(rect.actionsNear).toBeTruthy();
  expect(rect.pagingBeforeAudio).toBeTruthy();
  expect(rect.overflow).toBeLessThanOrEqual(rect.viewport+2);
  await studio.locator('.laOriginalToggle').click();
  await expect(studio.locator('.laWorkbookSelect')).toBeVisible();
  await studio.locator('.laOriginalToggle').click();
  await studio.locator('.laWorkbookPaging button').last().click();
  await expect(studio.locator('.laWorkbookPageTop')).toContainText('SEITE 2 / 6');
  await expect(studio.getByRole('button',{name:'تلفظ',exact:true})).toHaveAttribute('aria-pressed','true');
  await context.close();
 }
});

test('provisional speech gauge reacts to interim recognition but only final speech persists; retry clears weak word',async ({page})=>{
 await page.setViewportSize({width:360,height:800});
 await page.addInitScript(()=>{
  let tries=0;
  window.SpeechRecognition=class{
   start(){
    const second=++tries===2;
    const partial=Object.assign([{transcript:second?'Hal':'Bu'}],{isFinal:false});
    const final=Object.assign([{transcript:second?'Hallo!':'Buch'}],{isFinal:true});
    setTimeout(()=>this.onresult?.({results:[partial]}),70);
    setTimeout(()=>{this.onresult?.({results:[final]});this.onend?.()},440);
   }
   stop(){this.onend?.()}
   abort(){}
  };
 });
 await page.goto('/lessons/1#lesson-audio');
 const studio=page.locator('.laWorkbook');
 await studio.getByRole('button',{name:'تلفظ',exact:true}).click();
 const mic=studio.getByRole('button',{name:'شروع سنجش تلفظ'});
 await mic.click();
 await expect(studio.locator('.speechGauge.provisional')).toBeVisible();
 await expect(studio.locator('.laInterim')).toHaveText('Bu');
 const during=await page.evaluate(()=>JSON.parse(localStorage.getItem('dt_speaking_v1')||'{}').words||{});
 expect(Object.keys(during)).toHaveLength(0);
 await expect(studio.locator('.speechGauge')).toHaveAttribute('aria-valuenow','0');
 await expect(studio.locator('.speechWeakLink')).toBeVisible();
 await mic.click();
 await expect(studio.locator('.laInterim')).toHaveText('Hal');
 await expect(studio.locator('.speechGauge.provisional')).toBeVisible();
 await expect(studio.locator('.speechGauge')).toHaveAttribute('aria-valuenow','100');
 await expect(studio.locator('.speechWeakLink')).toHaveCount(0);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('dt_speaking_v1')||'{}'));
 expect(saved.words.hallo.lastCorrect).toBe(true);
 expect(saved.words.hallo.attempts).toBe(2);
 expect(saved.words.hallo.misses).toBe(1);
 await page.goto('/speaking?review=words');
 await expect(page.locator('.speechWeakList')).toHaveCount(0);
});

test('speaking coach displays compact result, optional details and disputed recognition without false scores on 360px',async({page})=>{
 await page.setViewportSize({width:360,height:740});
 await page.addInitScript(()=>{
  localStorage.setItem('dt_speaking_v1',JSON.stringify({version:1,total:1,items:{},history:[],words:{
   beruf:{word:'beruf',display:'Beruf',lesson:2,lastCorrect:false,attempts:1,misses:1,lastAt:1,dueAt:20}
  }}));
  window.SpeechRecognition=class{
   start(){setTimeout(()=>{const row=Object.assign([{transcript:'Bilder'}],{isFinal:true});this.onresult?.({results:[row]});this.onend?.()},140)}
   stop(){this.onend?.()}
   abort(){}
  };
 });
 await page.goto('/speaking?review=words');
 await page.getByRole('button',{name:/شروع تمرین تصادفی/}).click();
 await expect(page.locator('.scPrompt h2')).toHaveText('Beruf');
 await page.locator('.scMic').click();
 await expect(page.locator('.scResultCompact')).toBeVisible();
 await expect(page.locator('.scResultOverview')).toContainText('Bilder');
 await expect(page.locator('.scResultDetails .scCompare')).toBeHidden();
 const first=await page.evaluate(()=>JSON.parse(localStorage.getItem('dt_speaking_v1')));
 expect(first.words.beruf.lastCorrect).toBe(false);
 const grade=first.items['review-word:beruf'].lastScore;
 await page.getByRole('button',{name:'اشتباه تشخیص بود'}).click();
 await expect(page.locator('.scDisputed')).toContainText('نمره تغییر نکرد');
 await expect(page.locator('.speechWeakList')).toHaveCount(0);
 const corrected=await page.evaluate(()=>JSON.parse(localStorage.getItem('dt_speaking_v1')));
 expect(corrected.items['review-word:beruf'].lastScore).toBe(grade);
 expect(corrected.items['review-word:beruf'].attempts).toBe(1);
 expect(corrected.words.beruf.misses).toBe(2);
 await page.locator('.scResultDetails summary').click();
 await expect(page.locator('.scResultDetails .scCompare')).toBeVisible();
 await expect(page.locator('.scResultDetails')).toContainText('Beruf');
 await expect(page.locator('.scResultDetails')).toContainText('Bilder');
 await expect(page.locator('.scPrivacy')).not.toHaveAttribute('open','');
 const measures=await page.evaluate(()=>{
  const prompt=document.querySelector('.scPrompt').getBoundingClientRect();
  const result=document.querySelector('.scResultCompact').getBoundingClientRect();
  return {promptHeight:prompt.height,resultHeight:result.height,pageWidth:document.documentElement.scrollWidth,viewport:innerWidth};
 });
 expect(measures.promptHeight).toBeLessThan(180);
 expect(measures.pageWidth).toBeLessThanOrEqual(measures.viewport+2);
});

test('lesson eight has two-person speaking drills with persisting progress on narrow mobile',async({page})=>{
 await page.setViewportSize({width:360,height:780});
 await page.goto('/lessons/8');
 const link=page.getByRole('link',{name:/تمرین دونفره این درس/});
 await expect(link).toHaveAttribute('href','/partner-practice?lesson=8');
 await link.click();
 await expect(page).toHaveURL(/\/partner-practice\?lesson=8/);
 await expect(page.locator('#partner-lesson')).toHaveValue('8');
 await expect(page.locator('.partnerScene')).toHaveCount(2);
 await page.getByRole('button',{name:/قرار جمعه/}).click();
 const stage=page.locator('.partnerStage');
 await expect(stage).toContainText('نقش A');
 await expect(stage.locator('.partnerQuestion strong')).toHaveText('Hast du am Freitag Zeit?');
 await expect(stage.locator('.partnerSample')).toHaveCount(0);
 await stage.getByRole('button',{name:/نمایش راهنمای پاسخ/}).click();
 await expect(stage.locator('.partnerSample')).toContainText('am Freitag');
 await stage.getByRole('button',{name:/گفتیم، بعدی/}).click();
 await expect(stage).toContainText('نقش B');
 await expect(stage.locator('.partnerQuestion strong')).toContainText('Treffen wir uns');
 await stage.getByRole('button',{name:/نیاز به تمرین بیشتر/}).click();
 await stage.getByRole('button',{name:/گفتیم، بعدی/}).click();
 await expect(stage).toContainText('گفت‌وگو را انجام دادید');
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_partner_practice_v1')||'{}')['partner-8-1']?.done)).toBe(3);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('dt_partner_practice_v1')||'{}'));
 expect(saved['partner-8-1'].hard).toBe(1);
 expect(saved['partner-8-1'].completed).toBe(true);
 await page.reload();
 await expect(page.getByRole('button',{name:/قرار جمعه/})).toContainText('تکمیل شده');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(362);
});

test('real-book source exercises cover lesson eight chat and source page 81 bingo without phone overflow',async({page})=>{
 await page.setViewportSize({width:360,height:760});
 await page.goto('/lessons/8');
 const link=page.getByRole('link',{name:/تمرین‌های داخل Kursbuch و Aktionsseiten/});
 await expect(link).toHaveAttribute('href','/book-exercises?lesson=8');
 await link.click();
 await expect(page).toHaveURL(/book-exercises\?lesson=8/);
 const source=page.locator('.kbSourcePage');
 await expect(source.locator('#kb-source-lesson')).toHaveValue('8');
 await expect(source.locator('.kbSourceCards button')).toHaveCount(2);
 await expect(source.locator('.kbSourceQuestion')).toContainText('Hast du');
 await source.getByRole('textbox',{name:'جواب آلمانی جای خالی'}).fill('am');
 await source.getByRole('button',{name:'بررسی جواب'}).click();
 await expect(source.locator('.kbSourceFeedback')).toContainText('درست است');
 await source.getByRole('button',{name:/گفت‌وگوهای کتاب/}).click();
 await expect(source.locator('.kbSourceCards button')).toHaveCount(3);
 await source.getByRole('button',{name:/Verabreden Sie sich im Chat/}).click();
 await expect(source.locator('.kbSourceSpeech strong')).toContainText('Was machst du heute?');
 await expect(source.locator('.kbSourceSample')).toHaveCount(0);
 await source.getByRole('button',{name:/نمایش پاسخ نمونه/}).click();
 await expect(source.locator('.kbSourceSample')).toContainText('Ich habe');
 for(let n=0;n<3;n++)await source.getByRole('button',{name:/نوبت بعد/}).click();
 await expect(source.locator('.kbSourceEnd')).toContainText('تمرین این گفت‌وگو انجام شد');
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_kursbuch_exercises_v1')||'{}')['A87-chat']?.completed)).toBe(true);
 await source.getByRole('checkbox',{name:/نمایش همه فعالیت‌های صفحات ۸۰ تا ۹۰/}).check();
 await source.getByRole('button',{name:/Aktivitäten-Bingo/}).click();
 const boxes=source.locator('.kbBingoGrid button');
 await expect(boxes).toHaveCount(25);
 for(let n=0;n<5;n++)await boxes.nth(n).click();
 await expect(source.locator('.kbSourceFeedback')).toContainText('BINGO');
 await expect(page.locator('html').evaluate(el=>el.scrollWidth)).resolves.toBeLessThanOrEqual(362);
});

test('Arbeitsbuch lesson 8 grades exercises and persists recovery on 360px phone',async({page})=>{
 await page.setViewportSize({width:360,height:740});
 await page.goto('/lessons/8');
 const link=page.getByRole('link',{name:/کتاب کار این درس · Arbeitsbuch/});
 await expect(link).toHaveAttribute('href','/arbeitsbuch?lesson=8');
 await link.click();
 await expect(page).toHaveURL(/\/arbeitsbuch\?lesson=8/);
 const studio=page.locator('.abStudio');
 await expect(studio.locator('.abStudioLessonGrid button')).toHaveCount(12);
 await expect(studio.locator('.abStudioTask')).toHaveCount(7);
 await expect(studio.locator('.abStudioChapterInfo')).toContainText('AB S. 60–65');
 await expect(studio.locator('.abStudioExerciseHead')).toContainText('PDF 55');
 const input=studio.getByRole('textbox',{name:'پاسخ آلمانی'});
 await input.fill('an');
 await studio.getByRole('button',{name:'بررسی پاسخ'}).click();
 await expect(studio.locator('.abStudioFeedback.wrong')).toBeVisible();
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_arbeitsbuch_studio_v1')||'{}')['ab-8-1']?.misses)).toBe(1);
 await studio.getByRole('button',{name:'تلاش دوباره'}).click();
 await input.fill('am');
 await studio.getByRole('button',{name:'بررسی پاسخ'}).click();
 await expect(studio.locator('.abStudioFeedback.correct')).toBeVisible();
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_arbeitsbuch_studio_v1')||'{}')['ab-8-1']?.lastCorrect)).toBe(true);
 await studio.getByRole('button',{name:'نیازمند تکرار'}).click();
 await expect(studio.locator('.abStudioEmpty')).toBeVisible();
 await studio.getByRole('button',{name:'نمایش همه تمرین‌ها'}).click();
 await studio.locator('.abStudioTask').filter({hasText:'ساعت محاوره'}).click();
 await studio.getByRole('button',{name:'08:30'}).click();
 await expect(studio.locator('.abStudioFeedback.correct')).toBeVisible();
 await studio.locator('.abStudioTask').filter({hasText:'پیام برای تغییر قرار'}).click();
 const textarea=studio.getByRole('textbox',{name:'پاسخ نوشتاری آلمانی'});
 await textarea.fill('Am Freitag habe ich keine Zeit. Geht es am Sonntag?');
 await studio.getByRole('button',{name:'ذخیره متن من'}).click();
 await expect(studio.locator('.abStudioModel')).toContainText('نمره خودکار ندارد');
 const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('dt_arbeitsbuch_studio_v1')||'{}')['ab-8-6']);
 expect(draft.submitted).toBe(true);
 expect(draft.lastCorrect).toBeUndefined();
 await page.reload();
 await expect(studio.locator('.abStudioTotal')).toContainText('۳');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(362);
});
test('Arbeitsbuch cards stay within 320px and 390px in dark and light mode',async({browser})=>{
 for(const [width,scheme] of [[320,'dark'],[390,'light']]){
  const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width,height:760},colorScheme:scheme,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.goto('/arbeitsbuch?lesson=8');
  await expect(page.locator('.abStudio')).toBeVisible();
  await expect(page.locator('.abStudioTask')).toHaveCount(7);
  await expect(page.locator('.abStudioLessonGrid button')).toHaveCount(12);
  const widthActual=await page.evaluate(()=>document.documentElement.scrollWidth);
  expect(widthActual).toBeLessThanOrEqual(width+2);
  await context.close();
 }
});

test('Arbeitsbuch media exercise uses own image and clears wrong answer after a correct retry',async({page})=>{
 await page.setViewportSize({width:360,height:760});
 await page.goto('/lessons/8');
 const link=page.getByRole('link',{name:/تصویری و شنیداری کتاب کار/});
 await expect(link).toHaveAttribute('href','/arbeitsbuch-media?lesson=8');
 await link.click();
 const media=page.locator('.abmPage');
 await expect(media).toBeVisible();
 await expect(media.locator('.abmCards button')).toHaveCount(2);
 await expect(media.locator('.abmArtClock')).toBeVisible();
 await expect(media.locator('.abmArtClock')).toHaveAttribute('role','img');
 await media.getByRole('button',{name:'Es ist neun Uhr.'}).click();
 await expect(media.locator('.abmFeedback.wrong')).toBeVisible();
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_arbeitsbuch_media_v1')||'{}')['ab-visual-8-1']?.misses)).toBe(1);
 await media.getByRole('button',{name:'تکرار تمرین'}).click();
 await media.getByRole('button',{name:'Es ist halb neun.'}).click();
 await expect(media.locator('.abmFeedback.correct')).toBeVisible();
 const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('dt_arbeitsbuch_media_v1')||'{}')['ab-visual-8-1']);
 expect(record.attempts).toBe(2);
 expect(record.misses).toBe(1);
 expect(record.lastCorrect).toBe(true);
 await media.getByRole('button',{name:/شنیداری تمرینی/}).click();
 await expect(media.locator('.abmCards button')).toHaveCount(2);
 await expect(media.locator('.abmOptions button').first()).toBeDisabled();
 await media.getByRole('button',{name:'شنیدن جمله آلمانی'}).click();
 await media.getByRole('button',{name:'Freitag, 17:00'}).click();
 await expect(media.locator('.abmFeedback.correct')).toBeVisible();
 await media.locator('.abmFeedback summary').click();
 await expect(media.locator('.abmFeedback details')).toContainText('Treffen wir uns');
 await page.reload();
 await expect(media.locator('.abmHeroStats')).toContainText('۲');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(362);
});
test('original publisher audio activity cannot be completed without a real played track',async({page})=>{
 await page.setViewportSize({width:390,height:780});
 await page.goto('/arbeitsbuch-media?lesson=8');
 const media=page.locator('.abmPage');
 await media.getByRole('button',{name:/صوت اصلی کتاب/}).click();
 await expect(media.locator('.abmCards button')).toHaveCount(1);
 await expect(media.locator('.abmNoTrack')).toBeVisible();
 await expect(media.getByRole('button',{name:'شنیدم، انجام شد'})).toBeDisabled();
 await expect(media.getByRole('button',{name:'شنیدم، نیاز به مرور دارم'})).toBeDisabled();
 expect(await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('dt_arbeitsbuch_media_v1')||'{}')).length)).toBe(0);
 await media.getByRole('button',{name:/فهرست صفحات/}).click();
 await media.getByRole('combobox',{name:'محدوده صفحات کتاب کار'}).selectOption('all');
 await expect(media.locator('.abmPageList button')).toHaveCount(94);
 const missing=media.locator('.abmPageList button').filter({hasText:'۵۶'});
 await expect(missing).toBeDisabled();
 await media.locator('.abmPageList button').filter({hasText:'۶۲'}).click();
 await expect(media.locator('.abmPageDetail')).toContainText('صفحه 57 فایل PDF');
 await media.locator('.abmPageDetail input[type=checkbox]').check();
 await media.getByRole('button',{name:'ثبت انجام صفحه'}).click();
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_arbeitsbuch_page_index_v1')||'{}')['ab-page-62']?.completed)).toBe(true);
});
test('Arbeitsbuch new media cards do not scroll horizontally on small phones',async({browser})=>{
 for(const [width,mode] of [[320,'dark'],[360,'light'],[390,'dark']]){
  const context=await browser.newContext({baseURL:'http://127.0.0.1:5173',viewport:{width,height:740},colorScheme:mode,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.goto('/arbeitsbuch-media?lesson=6');
  await expect(page.locator('.abmArt')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
  await context.close();
 }
});

test('weekday flashbox is short on 360px and learns through card flip, game and exam with recoverable errors',async({page})=>{
 await page.setViewportSize({width:360,height:800});
 await page.goto('/lessons');
 const lesson=page.locator('.ldLesson').nth(7);
 await lesson.locator('.ldLessonHeader').click();
 const box=lesson.locator('.wdBox');
 await expect(box).toBeVisible();
 await expect(box.locator('.wdFlash strong')).toHaveText('Montag');
 const size=await box.evaluate(el=>({width:el.getBoundingClientRect().width,viewport:innerWidth}));
 expect(size.width).toBeLessThanOrEqual(size.viewport);
 await box.getByRole('button',{name:'نمایش معنی فارسی کارت'}).click();
 await expect(box.locator('.wdFlash strong')).toHaveText('دوشنبه');
 await box.getByRole('button',{name:/یاد گرفتم، بعدی/}).click();
 await expect(box.locator('.wdFlash strong')).toHaveText('Dienstag');
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_weekdays_flash_v1')||'{}').Montag?.seen)).toBe(true);
 await box.getByRole('button',{name:'بازی',exact:true}).click();
 await box.locator('.wdOptions').getByRole('button',{name:'Mittwoch'}).click();
 await expect(box.locator('.wdAnswer')).toContainText('پاسخ درست');
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_weekdays_flash_v1')||'{}').Montag?.lastCorrect)).toBe(false);
 await box.getByRole('button',{name:'بازی',exact:true}).click();
 await box.locator('.wdOptions').getByRole('button',{name:'Montag'}).click();
 await expect(box.locator('.wdAnswer')).toContainText('درست گفتی');
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_weekdays_flash_v1')||'{}').Montag?.lastCorrect)).toBe(true);
 await box.getByRole('button',{name:'آزمون',exact:true}).click();
 await expect(box.locator('.wdPlayPrompt')).toHaveText('Montag');
 await box.locator('.wdOptions').getByRole('button',{name:'دوشنبه'}).click();
 await expect(box.locator('.wdAnswer')).toContainText('درست گفتی');
 const topic=lesson.locator('.ldTopics > li').first();
 await topic.locator('.ldTopicSummary').click();
 await expect(topic.locator('.ldExerciseLink')).toHaveCount(3);
 await topic.locator('.ldShowTopicMore').click();
 expect(await topic.locator('.ldExerciseLink').count()).toBeGreaterThan(3);
 await topic.locator('.ldShowTopicMore').click();
 await expect(topic.locator('.ldExerciseLink')).toHaveCount(3);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(362);
 await page.goto('/lessons/8');
 await expect(page.locator('.bookLessonRoot .wdBox')).toBeVisible();
 await expect(page.locator('.bookLessonRoot .bookPictureCard')).toHaveCount(4);
});

test('lesson eight tapped choices and previous-next navigation fit a narrow phone',async({page})=>{
 await page.setViewportSize({width:360,height:780});
 await page.goto('/lessons/8?lab=days#lesson8-time-lab');
 const lab=page.locator('#lesson8-time-lab');
 await lab.locator('.l8-choice-grid').getByRole('button',{name:'Montag',exact:true}).click();
 await expect(lab.locator('.l8-result')).toContainText('Montag');
 await expect(lab.locator('.l8-question-nav button')).toHaveCount(2);
 await expect(lab.locator('.l8-question-nav button').first()).toBeDisabled();
 await lab.locator('.l8-question-nav').getByRole('button',{name:/بعدی/}).click();
 await expect(lab.locator('.l8-question-top')).toContainText('2 از 7');
 await lab.locator('.l8-question-nav').getByRole('button',{name:/قبلی/}).click();
 await expect(lab.locator('.l8-question-top')).toContainText('1 از 7');
 const widths=await lab.locator('.l8-question-nav button').evaluateAll(nodes=>nodes.map(el=>el.getBoundingClientRect().width));
 expect(Math.min(...widths)).toBeGreaterThan(95);
 const box=page.locator('.bookLessonRoot .wdBox');
 await box.getByRole('button',{name:'بازی',exact:true}).click();
 await box.locator('.wdOptions').getByRole('button',{name:'Montag'}).click();
 await expect(box.locator('.wdQuizNav button')).toHaveCount(2);
 await box.locator('.wdQuizNav').getByRole('button',{name:/بعدی/}).click();
 await expect(box.locator('.wdPlayPrompt')).toHaveText('سه‌شنبه');
 await box.locator('.wdQuizNav').getByRole('button',{name:/قبلی/}).click();
 await expect(box.locator('.wdPlayPrompt')).toHaveText('دوشنبه');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(362);
});

test('24 Kursbuch action pages are accessible with compact two-person turns on a narrow phone',async({page})=>{
 await page.setViewportSize({width:360,height:780});
 await page.goto('/action-pages?page=73');
 const section=page.locator('.apPage');
 await expect(section.getByRole('heading',{name:'بازی‌های دوره‌ای کتاب'})).toBeVisible();
 await expect(section.locator('.apItems button')).toHaveCount(8);
 await section.getByRole('button',{name:/صفحه ۱۶ صفحه دیگر|نمایش ۱۶ صفحه دیگر/}).click();
 await expect(section.locator('.apItems button')).toHaveCount(24);
 await section.getByRole('button',{name:/نمایش فقط ۸ صفحه/}).click();
 await expect(section.locator('.apItems button')).toHaveCount(8);
 await expect(section.locator('.apSpeech strong')).toHaveText('Wie heißt du?');
 await section.getByRole('button',{name:'نمایش پاسخ نمونه'}).click();
 await expect(section.locator('.apResponse strong')).toContainText('Ich heiße Anna.');
 await section.getByRole('button',{name:/انجام شد، بعدی/}).click();
 await expect(section.locator('.apSpeech strong')).toHaveText('Wie heißen Sie?');
 await section.locator('.apPaging').getByRole('button',{name:/صفحه بعد/}).click();
 await expect(section.locator('.apStageTop')).toContainText('Internet-Profil');
 const widths=await section.locator('.apPaging button').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().width));
 expect(Math.min(...widths)).toBeGreaterThan(100);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(362);
 await page.goto('/action-pages?page=81');
 await expect(page.locator('.apBingoGrid button')).toHaveCount(25);
 for(let i=0;i<5;i++)await page.locator('.apBingoGrid button').nth(i).click();
 await expect(page.locator('.apBingo .apFeedback')).toContainText('BINGO');
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_aktionsseiten_73_96_v1')||'{}')['action-81']?.completed)).toBe(true);
});
test('essential vocabulary lesson 8 plays and saves mistakes, correct retry clears weak list',async({page})=>{
 await page.setViewportSize({width:360,height:780});
 await page.goto('/essential-words?lesson=8');
 const box=page.locator('.evPage');
 await expect(box.getByRole('heading',{name:'واژگان مهم کتاب'})).toBeVisible();
 await expect(box.locator('.evFlip strong')).toHaveText('das Café');
 await box.getByRole('button',{name:'بازی',exact:true}).click();
 await expect(box.locator('.evOptions button')).toHaveCount(4);
 await box.locator('.evOptions').getByRole('button',{name:'das Museum'}).click();
 await expect(box.locator('.evAnswer')).toContainText('جواب درست');
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_essential_vocab_20261123_v1')||'{}')['essential-8-1']?.lastCorrect)).toBe(false);
 await box.getByRole('button',{name:'بازی',exact:true}).click();
 await box.locator('.evOptions').getByRole('button',{name:'das Café'}).click();
 await expect(box.locator('.evAnswer')).toContainText('درست بود');
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_essential_vocab_20261123_v1')||'{}')['essential-8-1']?.lastCorrect)).toBe(true);
 await box.locator('.evNavigation').getByRole('button',{name:/بعدی/}).click();
 await expect(box.locator('.evPrompt')).toHaveText('کنسرت');
 await box.locator('.evNavigation').getByRole('button',{name:/قبلی/}).click();
 await expect(box.locator('.evPrompt')).toHaveText('کافه');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(362);
});

test('Arbeitsbuch lesson 8 page 61 opens minute-exact clock, weekday and appointment practice on a phone',async({page})=>{
 await page.setViewportSize({width:360,height:780});
 await page.goto('/arbeitsbuch?lesson=8');
 const extra=page.locator('.ab8Extra');
 await expect(extra).toBeVisible();
 await expect(extra).toContainText('ARBEITSBUCH');
 await expect(extra.locator('.mcDigital')).toHaveText('09:55');
 await expect(extra.locator('.mcOptions button')).toHaveCount(4);
 await extra.locator('.mcOptions').getByRole('button',{name:'neun Uhr fünfundfünfzig'}).click();
 await expect(extra.locator('.mcFeedback')).toContainText('دقیق و درست');
 await extra.locator('.mcBank').getByRole('button',{name:/۲۴ ساعت/}).click();
 await expect(extra.locator('.mcDigital')).toHaveText('14:37');
 await extra.locator('.mcModes').getByRole('button',{name:/دیکته دقیقه‌ای/}).click();
 const input=extra.getByRole('textbox',{name:'ساعت شنیده‌شده به شکل HH:MM'});
 await input.fill('۱۴:۳۶');
 await extra.getByRole('button',{name:'بررسی دقیقه'}).click();
 await expect(extra.locator('.mcFeedback')).toContainText('دوباره تمرین کن');
 await extra.getByRole('button',{name:/دوباره همین ساعت/}).click();
 await input.fill('۱۴:۳۷');
 await extra.getByRole('button',{name:'بررسی دقیقه'}).click();
 await expect(extra.locator('.mcFeedback')).toContainText('دقیق و درست');
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_l8_minute_accuracy_v1')||'{}')['l8-time-14:37']?.lastCorrect)).toBe(true);
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dt_l8_minute_accuracy_v1')||'{}')['l8-time-14:37']?.misses)).toBe(1);
 await extra.locator('.ab8Tabs').getByRole('button',{name:'روزهای هفته'}).click();
 await expect(extra.locator('.ab8Prompt strong')).toHaveText('Monday');
 await extra.locator('.ab8Answers').getByRole('button',{name:'Montag'}).click();
 await expect(extra.locator('.ab8Result')).toContainText('درست است');
 await extra.locator('.ab8Navigation').getByRole('button',{name:/بعدی/}).click();
 await expect(extra.locator('.ab8Prompt strong')).toHaveText('Tuesday');
 await extra.locator('.ab8Tabs').getByRole('button',{name:'قرار ملاقات'}).click();
 await expect(extra.locator('.ab8Prompt strong')).toContainText('Hast du am Freitag Zeit?');
 await extra.locator('.ab8Answers').getByRole('button',{name:'Leider kann ich am Freitag nicht.'}).click();
 await expect(extra.locator('.ab8Result')).toContainText('درست است');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(362);
});
test('lesson 8 holds a compact expandable 24-clock precision challenge next to existing time lab',async({page})=>{
 await page.setViewportSize({width:360,height:780});
 await page.goto('/lessons/8');
 const disclosure=page.locator('.bookMinuteDisclosure');
 await expect(disclosure).toBeVisible();
 await expect(disclosure).not.toHaveAttribute('open');
 await disclosure.locator('summary').click();
 await expect(disclosure.locator('.mcLab')).toBeVisible();
 await expect(disclosure.locator('.mcDigital')).toHaveText('14:37');
 await disclosure.locator('.mcModes').getByRole('button',{name:/ساعت محاوره‌ای/}).click();
 await disclosure.locator('.mcOptions').getByRole('button',{name:'zwei Uhr siebenunddreißig'}).click();
 await expect(disclosure.locator('.mcFeedback')).toContainText('دقیق و درست');
 await expect(page.locator('.l8-lab')).toBeVisible();
 const width=await disclosure.locator('.mcNav button').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().width));
 expect(Math.min(...width)).toBeGreaterThan(90);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(362);
});
