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
  await expect(page.getByRole('heading',{name:'کدوم مهارت رو تمرین کنیم؟'})).toBeVisible();
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
