// Original interactive adaptations of Menschen A1.1 Kursbuch Aktionsseiten,
// printed pages 73–96. These are not scans/transcriptions of the pages.
export const ACTION_KEY='dt_aktionsseiten_73_96_v1';
const talk=(page,lesson,title,topic,turns,extra={})=>({
 id:'action-'+page,page,lesson,title,topic,kind:'dialogue',
 turns:turns.map(([ask,fa,reply,replyFa])=>({ask,fa,reply,replyFa})),...extra
});
const questions=(page,lesson,title,topic,items)=>({
 id:'action-'+page,page,lesson,title,topic,kind:'quiz',
 items:items.map(([text,correct,note])=>({text,correct,note}))
});
const compose=(page,lesson,title,topic,guide,sample)=>({
 id:'action-'+page,page,lesson,title,topic,kind:'writing',guide,sample
});
const order=(page,lesson,title,topic,items)=>({
 id:'action-'+page,page,lesson,title,topic,kind:'order',
 items:items.map(([words,answer,fa])=>({words,answer,fa}))
});
const bingo=(page,lesson,title,topic,items,starter)=>({
 id:'action-'+page,page,lesson,title,topic,kind:'bingo',items,starter
});
export const actionStations=Object.freeze([
 talk(73,1,'du oder Sie?','رسمی و غیررسمی؛ احوال‌پرسی و اعداد',[
  ['Wie heißt du?','اسمت چیست؟','Ich heiße Anna.','اسمم آناست.'],
  ['Wie heißen Sie?','نام شما چیست؟','Mein Name ist Herr Müller.','نامم آقای مولر است.'],
  ['Wie geht es Ihnen?','حال شما چطور است؟','Danke, gut. Und Ihnen?','خوبم، ممنون. شما چطور؟']
 ]),
 compose(74,2,'Internet-Profil','با پارتنر اطلاعات شغلی و تحصیلی را بپرس و یک معرفی کوتاه بساز.','Schreibe ein kurzes Profil: Name, Wohnort, Beruf und Ausbildung.','Ich heiße Mina. Ich wohne in Berlin und arbeite als Designerin.'),
 talk(75,1,'Bekannte Persönlichkeiten · A','پرسیدن نام و زادگاه افراد شناخته‌شده، نقش A',[
  ['Wer ist das?','این چه کسی است؟','Das ist eine bekannte Person.','این یک شخص شناخته‌شده است.'],
  ['Woher kommt er?','اهل کجا است؟','Er kommt aus Deutschland.','او اهل آلمان است.'],
  ['Und was macht er beruflich?','شغلش چیست؟','Er ist Schriftsteller.','او نویسنده است.']
 ],{sourceNote:'شناسایی چهره‌های همان جدول، به تصاویر صفحه کتاب نیاز دارد.'}),
 talk(76,3,'Ja, Nein oder Doch?','معرفی خانواده و اصلاح اطلاعات اشتباه',[
  ['Ist dein Bruder verheiratet?','برادرت متأهل است؟','Ja, er ist verheiratet.','بله، متأهل است.'],
  ['Deine Schwester ist nicht verheiratet, oder?','خواهرت متأهل نیست، درست است؟','Doch, sie ist verheiratet.','چرا، او متأهل است.'],
  ['Wo wohnt deine Familie?','خانواده‌ات کجا زندگی می‌کنند؟','Sie wohnt in Wien.','در وین زندگی می‌کند.']
 ]),
 talk(77,1,'Bekannte Persönlichkeiten · B','پرسش‌وپاسخ جدول افراد شناخته‌شده؛ نقش B',[
  ['Wer ist diese Frau?','این خانم کیست؟','Das ist eine berühmte Frau.','او زنی مشهور است.'],
  ['Woher kommt sie?','اهل کجا است؟','Sie kommt aus Österreich.','او اهل اتریش است.'],
  ['Kommt sie aus Spanien?','اهل اسپانیاست؟','Nein, sie kommt nicht aus Spanien.','خیر، اهل اسپانیا نیست.']
 ],{sourceNote:'برای کامل‌کردن نام افراد، جدول تصویری صفحه ۷۷ را ببین.'}),
 questions(78,3,'Stellen Sie andere Personen vor · A','درک اطلاعات خانوادگی؛ صحیح یا غلط',[
  ['Sonja Wilkens ist 32 Jahre alt.',true,'سونیا ۳۲ ساله است.'],
  ['Sonja Wilkens hat zwei Kinder.',false,'در متن فقط یک فرزند دارد.'],
  ['Bo Martinson kommt aus Schweden.',true,'بو اهل سوئد است.'],
  ['Bo Martinson arbeitet als Journalist.',false,'او مهندس است.'],
  ['Peter und Franziska wohnen in Wolfsburg.',true,'هر دو در ولفسبورگ هستند.']
 ]),
 talk(79,4,'Nach Preisen fragen','قیمت مبلمان را بپرس و پیشنهاد قیمت بده',[
  ['Was kostet der Tisch?','میز چقدر است؟','Der Tisch kostet achtzig Euro.','میز هشتاد یوروست.'],
  ['Ist das ein Sonderangebot?','این تخفیف ویژه است؟','Ja, der Preis ist günstig.','بله، قیمت مناسب است.'],
  ['Und was kostet die Lampe?','لامپ چقدر است؟','Die Lampe kostet zwanzig Euro.','لامپ بیست یوروست.']
 ]),
 talk(80,8,'Etwas bewerten / Uhrzeiten','اتاق را توصیف کن و یک ساعت را بخوان',[
  ['Wie findest du das Zimmer?','اتاق را چطور می‌بینی؟','Ich finde das Zimmer schön.','به‌نظرم اتاق زیباست.'],
  ['Ist der Schrank praktisch?','کمد کاربردی است؟','Nein, er ist zu groß.','نه، خیلی بزرگ است.'],
  ['Wie spät ist es?','ساعت چند است؟','Es ist halb sechs.','پنج و نیم است.']
 ],{sourceNote:'مقایسه دو اتاق تصویری به شکل‌های صفحه ۸۰ کتاب وابسته است.'}),
 bingo(81,7,'Aktivitäten-Bingo','از پارتنر بپرس هر فعالیت را چند وقت یک بار انجام می‌دهد؛ پنج خانه در یک ردیف را کامل کن.',[
  'schwimmen','tanzen','lesen','Ski fahren','singen',
  'Fußball spielen','E-Mails schreiben','kochen','Musik hören','Auto fahren',
  'Freunde treffen','spazieren gehen','fotografieren','malen','rauchen',
  'Rad fahren','Musik machen','Ausflüge machen','Gitarre spielen','im Internet surfen',
  'Tennis spielen','telefonieren','Schach spielen','Freunde besuchen','Radio hören'
 ],'Wie oft ...?'),
 questions(82,3,'Stellen Sie andere Personen vor · B','طبق متن دو نفره، درست و غلط را تشخیص بده',[
  ['Sonja Wilkens ist Krankenschwester.',true,'در متن پرستار است.'],
  ['Sonja Wilkens ist 33 Jahre alt.',false,'سونیا ۳۲ ساله است.'],
  ['Sonja Wilkens ist verheiratet.',false,'ازدواج نکرده است.'],
  ['Bo Martinson kommt aus Norwegen.',false,'اهل سوئد است.'],
  ['Bo Martinson wohnt in Essen.',true,'در Essen زندگی می‌کند.'],
  ['Peter und Franziska arbeiten bei VW.',true,'هر دو در VW کار می‌کنند.']
 ]),
 talk(83,6,'Unterschiede & Können','تفاوت دو تصویر و توانایی افراد را توصیف کن',[
  ['Wie viele Stühle siehst du?','چند صندلی می‌بینی؟','Ich sehe drei Stühle.','سه صندلی می‌بینم.'],
  ['Kann Felix gut kochen?','فلیکس خوب آشپزی می‌کند؟','Ja, er kann sehr gut kochen.','بله، خیلی خوب آشپزی می‌کند.'],
  ['Kannst du Gitarre spielen?','می‌توانی گیتار بزنی؟','Ja, ein bisschen.','بله، کمی.']
 ],{sourceNote:'بخش «تفاوت دو تصویر» و جدول توانایی‌ها به تصویر صفحه کتاب نیاز دارد.'}),
 compose(84,5,'Kurs-Auktion','یک کالا را از نظر رنگ، جنس و قیمت آغازین معرفی کن.','Schreibe eine kurze Auktionsanzeige: Produkt, Farbe, Material, Preis.','Eine rote Tasche aus Plastik. Sie ist groß. Startpreis: zwei Euro.'),
 talk(85,5,'Nach Wörtern fragen','نام وسیله را بپرس و از پارتنر بخواه هجی کند',[
  ['Wie heißt das auf Deutsch?','این به آلمانی چه می‌شود؟','Das ist ein Ring.','این انگشتر است.'],
  ['Wie bitte? Noch einmal, bitte.','ببخشید؟ دوباره لطفاً.','Ein Ring.','یک انگشتر.'],
  ['Wie schreibt man das?','چطور نوشته می‌شود؟','R-I-N-G.','R-I-N-G.']
 ]),
 talk(86,7,'Wer kann was? · Partner B','در مورد توانایی‌ها سؤال کن و جدول پارتنرت را تکمیل کن',[
  ['Kann Leo kochen?','لئو می‌تواند آشپزی کند؟','Nein, nicht so gut.','نه، نه خیلی خوب.'],
  ['Kannst du schwimmen?','می‌توانی شنا کنی؟','Ja, ich kann gut schwimmen.','بله، خوب شنا می‌کنم.'],
  ['Kannst du singen?','می‌توانی آواز بخوانی؟','Nur ein bisschen.','فقط کمی.']
 ],{sourceNote:'برای بازی دقیقِ جای خالی جدول، صفحه ۸۶ را کنار دست داشته باش.'}),
 compose(87,8,'Verabreden im Chat','دو نفره یک گفت‌وگوی چتی برای قرار سینما یا کافه بنویس.','Schreibe einen kurzen Chat: Frage nach Zeit, Vorschlag, Antwort.','Hast du am Freitag Zeit? — Ja! Gehen wir ins Kino? — Gern, um sieben Uhr.'),
 order(88,10,'Wann kommst du an? · A','کلمات جمله‌های مربوط به رسیدن، تماس و سوارشدن را مرتب کن.',[
  [['du','Wann','an','kommst','?'],'Wann kommst du an?','کی می‌رسی؟'],
  [['ich','auf Gleis zehn','steige','ein','.'],'Ich steige auf Gleis zehn ein.','در سکوی ده سوار می‌شوم.'],
  [['wir','Wo','aus','steigen','?'],'Wo steigen wir aus?','کجا پیاده می‌شویم؟']
 ]),
 talk(89,8,'Sich verabreden · Partner A','برای یک زمان مشترک در برنامه هفتگی توافق کنید.',[
  ['Hast du am Dienstag Zeit?','سه‌شنبه وقت داری؟','Am Dienstag habe ich leider keine Zeit.','متأسفانه سه‌شنبه وقت ندارم.'],
  ['Und am Mittwoch um fünf?','چهارشنبه ساعت پنج چطور؟','Ja, das geht.','بله، می‌شود.'],
  ['Gehen wir ins Café?','برویم کافه؟','Gern. Bis Mittwoch!','حتماً، تا چهارشنبه!']
 ],{sourceNote:'برای تطبیق قرار با جدول زمانی A، به تقویم چاپی صفحه ۸۹ رجوع کن.'}),
 talk(90,9,'Möchten Sie noch etwas?','بازی نقش میزبان و مهمان هنگام غذا و پذیرایی',[
  ['Guten Appetit!','نوش جان!','Danke, gleichfalls!','ممنون، همچنین!'],
  ['Möchten Sie noch etwas?','چیز دیگری میل دارید؟','Ja, ein bisschen Kuchen, bitte.','بله، کمی کیک لطفاً.'],
  ['Möchten Sie einen Kaffee?','قهوه می‌خواهید؟','Nein, danke.','نه، ممنون.']
 ]),
 talk(91,12,'Marc feiert gern! / Würfelspiel','کارهای گذشته مارک را با Perfekt بپرس و جواب بده',[
  ['Was hat Marc am Montag gemacht?','مارک دوشنبه چه کرده؟','Er hat eine Party gefeiert.','او مهمانی گرفته است.'],
  ['Wie ist er nach Köln gekommen?','چطور به کلن رفته؟','Er ist mit dem Taxi gefahren.','با تاکسی رفته است.'],
  ['Bringst du Schokolade mit?','شکلات همراه می‌آوری؟','Ja, ich bringe Schokolade mit.','بله، شکلات می‌آورم.']
 ],{sourceNote:'برای تطبیق دقیق اطلاعات مارک، جدول پارتنری صفحه ۹۱ را ببین.'}),
 bingo(92,11,'Aktivitäten-Bingo · Perfekt','از دیگران بپرس در هفته قبل چه کرده‌اند و خانه‌های پنج‌تایی بساز.',[
  'lange frühstücken','Fußball spielen','lange schlafen','nicht arbeiten','E-Mails schreiben',
  'bei Freunden essen','aufräumen','Frühstück machen','Mittagspause machen','Zeitung lesen',
  'Mittagessen kochen','einen Film sehen','Hausaufgaben machen','fernsehen','Kuchen essen',
  'Musik hören','keinen Kaffee trinken','eine Freundin anrufen','einkaufen','Deutsch lernen',
  'im Internet surfen','ein Buch lesen','ein Geschenk kaufen','einladen','früh aufstehen'
 ],'Hast du ... gemacht?'),
 talk(93,8,'Sich verabreden · Partner B','با برنامه هفتگی B برای یک ساعت زمان مشترک پیدا کنید.',[
  ['Hast du am Montag um neunzehn Uhr Zeit?','دوشنبه ساعت ۱۹ وقت داری؟','Nein, da bin ich im Kino.','نه، آن موقع سینما هستم.'],
  ['Wie ist es am Donnerstag?','پنج‌شنبه چطور؟','Ja, am Abend habe ich Zeit.','بله، عصر وقت دارم.'],
  ['Wann treffen wir uns?','کی همدیگر را ببینیم؟','Um achtzehn Uhr.','ساعت هجده.']
 ],{sourceNote:'قرار واقعی دو نفر باید با جدول چاپی صفحه ۹۳ هماهنگ شود.'}),
 order(94,10,'Wann kommst du an? · B','ترتیب فعل‌های جداشدنی برای حرکت، تماس و خرید',[
  [['Wann','der Zug','kommt','an','?'],'Wann kommt der Zug an?','قطار چه موقع می‌رسد؟'],
  [['ich','rufe','dich','heute Abend','an','.'],'Ich rufe dich heute Abend an.','امشب به تو زنگ می‌زنم.'],
  [['wir','Brot und Butter','kaufen','ein','.'],'Wir kaufen Brot und Butter ein.','نان و کره می‌خریم.']
 ]),
 talk(95,12,'Hast du schon einmal ...?','با Perfekt درباره تجربه‌های ویژه سؤال کن',[
  ['Bist du schon einmal nach Australien geflogen?','تا حالا به استرالیا پرواز کرده‌ای؟','Nein, noch nie.','نه، هرگز.'],
  ['Hast du schon einmal Karneval gefeiert?','تا حالا کارناوال جشن گرفته‌ای؟','Ja, einmal.','بله، یک بار.'],
  ['Bist du schon einmal im Meer geschwommen?','تا حالا در دریا شنا کرده‌ای؟','Ja, letztes Jahr.','بله، سال گذشته.']
 ]),
 compose(96,11,'Eine E-Mail schreiben','با برنامه زمانی دیوید، نامه کوتاهی درباره روز گذشته بنویس.','Schreibe eine E-Mail: Was hast du gestern gemacht? Benutze Perfekt.','Liebe Sara, gestern habe ich gearbeitet und danach eingekauft. Am Abend habe ich Fußball gespielt. Viele Grüße!')
]);
export const actionByPage=page=>actionStations.find(x=>x.page===Number(page));
export const actionsForLesson=lesson=>actionStations.filter(x=>x.lesson===Number(lesson));
export const actionKinds=Object.freeze({dialogue:'گفت‌وگوی A/B',quiz:'درست یا غلط',order:'مرتب‌سازی جمله',writing:'نوشتن',bingo:'بینگوی گروهی'});
export const actionDefaultLesson=8;
export function actionBingoWon(cells){
 if(!Array.isArray(cells)||cells.length!==25)return false;
 for(let i=0;i<5;i++){
  if([0,1,2,3,4].every(j=>cells[i*5+j]))return true;
  if([0,1,2,3,4].every(j=>cells[j*5+i]))return true;
 }
 return [0,6,12,18,24].every(i=>cells[i])||[4,8,12,16,20].every(i=>cells[i]);
}
export function actionNormalize(text){
 return String(text??'').toLocaleLowerCase('de-DE').replace(/\s+/g,' ').replace(/\s+([!?.])/g,'$1').trim();
}
export function actionTrack(old={},id,update={},now=Date.now()){
 if(!actionStations.some(x=>x.id===id))throw new Error('Unknown action page');
 const previous=old[id]||{};
 return {...old,[id]:{...previous,...update,lastAt:now,attempts:(previous.attempts||0)+1}};
}
