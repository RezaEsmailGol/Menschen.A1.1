// Source index prepared from user-supplied "Menschen A1.1 Kursbuch OCR neu.pdf".
// Printed Kursbuch pages 9–68 (lesson exercises) and 80–90 (Aktionsseiten).
// Interactive wording is an independent adaptation, not an exact facsimile of the workbook.
// Images, audio track IDs, and passages that require the original page are not fabricated.
export const KURSBUCH_SOURCE='Menschen A1.1 · Kursbuch';
export const KURSBUCH_SOURCE_NOTE='تمرین بازطراحی‌شده بر اساس فعالیت کتاب؛ تصویر و صوت اصلی کتاب بازنشر نشده‌اند.';
const chapters=[
 [1,'Hallo! Ich bin Nicole ...',9,12,[
  ['L1-10-a',10,'Woher kommst du?','Woher ___ du?','kommst','صرف kommen برای du','از کجا می‌آیی؟'],
  ['L1-12-b',12,'Das Alphabet','Ich ___ meinen Namen.','buchstabiere','هجی کردن نام','من نامم را هجی می‌کنم.']]],
 [2,'Ich bin Journalistin.',13,16,[
  ['L2-14-a',14,'Berufe','Ich arbeite ___ Journalistin.','als','معرفی شغل با als','من به‌عنوان خبرنگار کار می‌کنم.'],
  ['L2-16-b',16,'Steckbrief','Ich ___ aus dem Iran.','komme','نوشتن متن کوتاه شخصی','من اهل ایران هستم.']]],
 [3,'Das ist meine Mutter.',17,20,[
  ['L3-18-a',18,'Familie','Das ist ___ Mutter.','meine','mein / meine','این مادر من است.'],
  ['L3-18-b',18,'Ja, nein, doch','Das ist nicht deine Mutter! — ___!','Doch','پاسخ مثبت به سؤال منفی','چرا، مادرم است!']]],
 [4,'Der Tisch ist schön!',25,28,[
  ['L4-26-a',26,'Möbel','Das ist ___ Bett.','ein','das Bett → ein','این یک تخت است.'],
  ['L4-27-b',27,'Preise','Was kostet ___ Tisch?','der','آرتیکل der Tisch','میز چقدر است؟']]],
 [5,'Was ist das? – Das ist ein F.',29,32,[
  ['L5-30-a',30,'Gegenstände','Das ist ___ Bleistift.','ein','der Bleistift → ein','این یک مداد است.'],
  ['L5-31-b',31,'Material','Die Brille ist ___ Plastik.','aus','ساخته‌شده از','عینک از پلاستیک است.']]],
 [6,'Ich brauche kein Büro.',33,36,[
  ['L6-34-a',34,'Büro','Ich ___ keinen Drucker.','habe','kein در Akkusativ','من پرینتر ندارم.'],
  ['L6-35-b',35,'Im Büro','Ich brauche ___ Laptop.','einen','der → einen','یک لپ‌تاپ لازم دارم.']]],
 [7,'Du kannst wirklich toll ...',41,44,[
  ['L7-42-a',42,'Hobbys','Wie ___ spielst du Fußball?','oft','Wie oft?','چند وقت یک‌بار فوتبال بازی می‌کنی؟'],
  ['L7-43-b',43,'Komplimente','Du ___ wirklich toll kochen!','kannst','Modalverb können','تو واقعاً عالی آشپزی می‌کنی!']]],
 [8,'Kein Problem. Ich habe Zeit!',45,48,[
  ['L8-46-a',46,'Tage und Termine','Hast du ___ Freitag Zeit?','am','am + Wochentag','جمعه وقت داری؟'],
  ['L8-47-b',47,'Uhrzeiten','Wir treffen uns ___ fünf Uhr.','um','um + Uhrzeit','ساعت پنج یکدیگر را می‌بینیم.']]],
 [9,'Ich möchte was essen, Onkel Harry.',49,52,[
  ['L9-50-a',50,'Essen und Trinken','Ich ___ einen Kaffee, bitte.','möchte','درخواست مؤدبانه','یک قهوه می‌خواهم، لطفاً.'],
  ['L9-52-b',52,'Speisekarte','Ich ___ gern Reis.','esse','درباره غذا حرف زدن','برنج را دوست دارم بخورم.']]],
 [10,'Ich steige jetzt in die U-Bahn ein.',57,60,[
  ['L10-58-a',58,'Unterwegs','Ich steige in die U-Bahn ___.','ein','فعل جداشدنی einsteigen','سوار مترو می‌شوم.'],
  ['L10-59-b',59,'Ankunft','Ich ___ um zwölf Uhr an.','komme','ankommen','ساعت دوازده می‌رسم.']]],
 [11,'Was hast du heute gemacht?',61,64,[
  ['L11-62-a',62,'Tagesablauf','Ich ___ gerade.','frühstücke','فعالیت روزانه','الان صبحانه می‌خورم.'],
  ['L11-64-b',64,'Perfekt mit haben','Ich ___ gestern gearbeitet.','habe','Perfekt','من دیروز کار کردم.']]],
 [12,'Was ist denn hier passiert?',65,68,[
  ['L12-66-a',66,'Monate und Jahreszeiten','___ Oktober ist das Wetter kühl.','Im','im + Monat','در اکتبر هوا خنک است.'],
  ['L12-67-b',67,'Perfekt mit sein','Er ___ nach München geflogen.','ist','sein + Partizip II','او به مونیخ پرواز کرده است.']]]
];
export const kursbuchChapters=Object.freeze(chapters.map(([lesson,title,from,to,rows])=>({
 lesson,title,from,to,exercises:rows.map(([id,page,topic,prompt,answer,tip,fa])=>({id,page,topic,prompt,answer,tip,fa,kind:'fill'}))
})));
const dialogue=(id,page,lesson,ref,title,goal,turns,extra={})=>({
 id,page,lesson,ref,title,goal,kind:'dialogue',turns:turns.map(([de,fa,reply,replyFa])=>({de,fa,reply,replyFa})),...extra
});
export const kursbuchActions=Object.freeze([
 dialogue('A80-room',80,4,'L4 · Aktionsseite 80','Etwas bewerten','اتاق‌های A و B را با صفات توصیف کن و درباره نظر پارتنر سؤال کن.',[
  ['Wie findest du Zimmer A?','به‌نظرت اتاق A چطور است؟','Ich finde Zimmer A schön.','به‌نظرم اتاق A زیباست.'],
  ['Ist das Zimmer praktisch?','آیا اتاق کاربردی است؟','Ja, aber der Schrank ist zu groß.','بله، اما کمد بیش از حد بزرگ است.']
 ],{imageDependent:true}),
 {id:'A80-clock',page:80,lesson:8,ref:'L8 · Aktionsseite 80',title:'Uhrzeiten',goal:'پنج ساعت بکشید؛ بپرسید و پاسخ بدهید. نمونه‌های کتاب: halb sechs و Viertel vor drei.',kind:'clock',items:[
  {time:'17:30',question:'17:30',options:['Es ist halb sechs.','Es ist Viertel nach fünf.','Es ist sechs Uhr.'],answer:'Es ist halb sechs.'},
  {time:'14:45',question:'14:45',options:['Es ist Viertel nach zwei.','Es ist Viertel vor drei.','Es ist halb drei.'],answer:'Es ist Viertel vor drei.'},
  {time:'09:00',question:'09:00',options:['Es ist neun Uhr.','Es ist zehn Uhr.','Es ist halb neun.'],answer:'Es ist neun Uhr.'}
 ]},
 {id:'A81-bingo',page:81,lesson:7,ref:'L7 · Aktionsseite 81',title:'Aktivitäten-Bingo',goal:'از پارتنر بپرس: Wie oft ...? خانه‌ها را پس از مکالمه علامت بزن؛ پنج خانه در یک ردیف برنده است.',kind:'bingo',items:[
  'schwimmen','tanzen','lesen','Ski fahren','singen',
  'Fußball spielen','E-Mails schreiben','kochen','Musik hören','Auto fahren',
  'Freunde treffen','spazieren gehen','fotografieren','malen','rauchen',
  'Rad fahren','Musik machen','Ausflüge machen','Gitarre spielen','im Internet surfen',
  'Tennis spielen','telefonieren','Schach spielen','Freunde besuchen','Radio hören'
 ]},
 {id:'A82-facts',page:82,lesson:2,ref:'L2 · Aktionsseite 82 (Partner B; Gegenseite S. 78)',title:'Stellen Sie andere Personen vor',goal:'همراهت متن صفحه ۷۸ را می‌خواند؛ درست یا غلط بودن مشخصات افراد صفحه ۸۲ را بررسی کن.',kind:'truefalse',items:[
  ['Sonja Wilkens ist Krankenschwester.',true,'Sonja پرستار است.'],
  ['Sonja Wilkens ist 33 Jahre alt.',false,'او ۳۲ ساله است.'],
  ['Sonja ist verheiratet.',false,'او ازدواج نکرده است.'],
  ['Sonja wohnt in Leipzig.',true,'او در لایپزیگ زندگی می‌کند.'],
  ['Bo Martinson kommt aus Norwegen.',false,'Bo از سوئد می‌آید.'],
  ['Bo wohnt in Essen.',true,'او در اِسِن زندگی می‌کند.'],
  ['Bo arbeitet als Journalist.',false,'او مهندس است.'],
  ['Peter und Franziska wohnen in Wolfsburg.',true,'آنها در ولفسبورگ زندگی می‌کنند.'],
  ['Peter und Franziska arbeiten bei VW.',true,'آنها در VW کار می‌کنند.']
 ]},
 dialogue('A83-rooms',83,6,'L6 · Aktionsseite 83','der Stuhl – die Stühle','تفاوت دو تصویر A و B را پیدا کن؛ تصاویر و جزئیات اضافی در صفحه خود کتاب است.',[
  ['Wie viele Stühle sind auf Bild A?','در تصویر A چند صندلی است؟','Auf Bild A sind drei Stühle.','در تصویر A سه صندلی است.'],
  ['Und auf Bild B?','در تصویر B چطور؟','Auf Bild B sind nur zwei Stühle.','در تصویر B فقط دو صندلی است.']
 ],{imageDependent:true}),
 dialogue('A83-ability',83,7,'L7 · Aktionsseite 83 (Partner A)','Wer kann was? · Partner A','با اطلاعات جدول Partner A صفحه ۸۳ درباره توانایی‌ها سؤال کن.',[
  ['Können Felix und Katja kochen?','فلیکس و کاتیا می‌توانند آشپزی کنند؟','Ja, Felix und Katja können super kochen.','بله، آن‌ها عالی آشپزی می‌کنند.'],
  ['Kann Leo kochen?','لئو می‌تواند آشپزی کند؟','Nein, Leo kann nicht so gut kochen.','نه، لئو خیلی خوب آشپزی نمی‌کند.']
 ],{imageDependent:true}),
 dialogue('A84-auction',84,5,'L5 · Aktionsseite 84','Kurs-Auktion','کالا، جنس، رنگ و قیمت اولیه را معرفی کن؛ نفر دوم قیمت بالاتر پیشنهاد بدهد.',[
  ['Hier ist eine super Tasche!','این یک کیف عالی است!','Sie ist aus Plastik und rot.','از پلاستیک است و قرمز است.'],
  ['Der Startpreis ist ein Euro.','قیمت آغازین یک یورو است.','Ich biete drei Euro!','سه یورو پیشنهاد می‌دهم!']
 ]),
 dialogue('A85-spell',85,6,'L6 · Aktionsseite 85','Nach Wörtern fragen','یک شیء را نشان بده؛ درباره نام آلمانی و هجی آن بپرس، سپس نقش‌ها را عوض کن.',[
  ['Wie heißt das auf Deutsch?','به آلمانی اسم این چیست؟','Das ist ein Ring.','این یک انگشتر است.'],
  ['Wie schreibt man Ring?','Ring چطور نوشته می‌شود؟','R-I-N-G.','ر، ای، اِن، گِه.']
 ]),
 dialogue('A86-ability',86,7,'L7 · Aktionsseite 86 (Partner B)','Wer kann was? · Partner B','نقش B: جدول صفحه ۸۶ را با جواب‌های همکلاسی تکمیل کن.',[
  ['Kann Leo kochen?','آیا لئو می‌تواند آشپزی کند؟','Nein, Leo kann nicht so gut kochen.','نه، لئو خیلی خوب آشپزی نمی‌کند.'],
  ['Kannst du Gitarre spielen?','می‌توانی گیتار بزنی؟','Ja, ich kann ein bisschen Gitarre spielen.','بله، کمی می‌توانم گیتار بزنم.']
 ],{imageDependent:true}),
 dialogue('A87-chat',87,8,'L8 · Aktionsseite 87','Verabreden Sie sich im Chat','با پارتنر یک مکالمه چتی برای قرار گذاشتن بنویس؛ نام پروفایل و زمان را مشخص کن.',[
  ['Was machst du heute?','امروز چه کار می‌کنی؟','Ich habe noch nichts vor.','هنوز برنامه‌ای ندارم.'],
  ['Lust auf Kino?','دوست داری برویم سینما؟','Ja, gern! Wann?','بله، حتماً! کی؟'],
  ['Um sieben Uhr?','ساعت هفت؟','Okay, dann bis sieben!','باشه، پس تا ساعت هفت!']
 ]),
 dialogue('A88-arrival',88,10,'L10 · Aktionsseite 88 (Partner A)','Wann kommst du an?','سؤالات زمان رسیدن، سکو، تماس و پیاده‌شدن را با ترتیب درست کلمات بساز.',[
  ['Wann kommst du an?','کی می‌رسی؟','Ich komme um zwölf Uhr fünfundvierzig an.','ساعت دوازده و چهل و پنج دقیقه می‌رسم.'],
  ['Wo steigst du ein?','کجا سوار می‌شوی؟','Ich steige auf Gleis zehn ein.','در سکوی ده سوار می‌شوم.']
 ]),
 dialogue('A88-marc',88,12,'L12 · Aktionsseite 88 (Partner A; Gegenseite S. 91)','Marc feiert gern!','از رویدادهای هفته گذشته Marc سؤال کن و از Perfekt استفاده کن.',[
  ['Was hat Marc am Montag gemacht?','مارک دوشنبه چه کار کرده؟','Er hat Geburtstag gefeiert.','او جشن تولد گرفته است.'],
  ['Wie ist Marc nach Köln gekommen?','چطور به کلن رفته؟','Er ist Taxi gefahren.','او با تاکسی رفته است.']
 ],{imageDependent:true}),
 dialogue('A89-meeting',89,8,'L8 · Aktionsseite 89 (Partner A)','Sich verabreden','با جدول هفته کتاب، برای یک ساعت زمان مشترک پیدا کنید و درباره فعالیت توافق کنید.',[
  ['Hast du am Dienstag Zeit?','سه‌شنبه وقت داری؟','Ja, am Nachmittag habe ich Zeit.','بله، بعدازظهر وقت دارم.'],
  ['Treffen wir uns um fünf Uhr?','ساعت پنج همدیگر را ببینیم؟','Ja, das ist eine gute Idee!','بله، فکر خوبی است!'],
  ['Was wollen wir machen?','می‌خواهیم چه کار کنیم؟','Wir gehen ins Café.','به کافه می‌رویم.']
 ],{imageDependent:true}),
 dialogue('A90-guests',90,9,'L9 · Aktionsseite 90','Möchten Sie noch etwas ...?','با هم یک دعوت طراحی کنید: میزبان/مهمان، غذا، هدیه و پذیرایی؛ نقش‌ها را جابه‌جا کنید.',[
  ['Bitte sehr!','بفرمایید!','Vielen Dank! Was ist das?','خیلی ممنون! این چیست؟'],
  ['Mögen Sie Schokolade?','شکلات دوست دارید؟','Ja, sehr gern!','بله، خیلی زیاد!'],
  ['Möchten Sie noch etwas?','باز هم چیزی میل دارید؟','Nein, danke.','نه، ممنون.']
 ])
]);
export const kursbuchChapter=id=>kursbuchChapters.find(x=>x.lesson===Number(id));
export const kursbuchActionByLesson=id=>kursbuchActions.filter(x=>x.lesson===Number(id));
export const kursbuchExerciseCount=kursbuchChapters.reduce((n,x)=>n+x.exercises.length,0)+kursbuchActions.length;
export function bookBingoWon(cells=[]){
 if(!Array.isArray(cells)||cells.length!==25)return false;
 for(let i=0;i<5;i++)if([0,1,2,3,4].every(j=>cells[i*5+j])||[0,1,2,3,4].every(j=>cells[j*5+i]))return true;
 return [0,6,12,18,24].every(j=>cells[j])||[4,8,12,16,20].every(j=>cells[j]);
}
export function normalizeBookFill(s){return String(s??'').trim().normalize('NFC').toLowerCase().replace(/\s+/g,' ').replace(/[.!?،]/g,'');}
