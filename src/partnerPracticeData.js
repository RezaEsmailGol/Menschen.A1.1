// Original practice dialogues aligned to themes currently present in this app.
// They are NOT transcriptions of Menschen A1.1 printed exercises (including pp. 80–90).
const exercises=[
 [ // 1
  {title:'آشنایی در کلاس',goal:'نام، احوال‌پرسی، کشور',turns:[
   ['Hallo! Wie heißt du?','سلام! اسمت چیست؟','Ich heiße Sara. Und du?','اسمم ساراست. تو چطور؟','heißen / ich heiße'],
   ['Woher kommst du?','اهل کجا هستی؟','Ich komme aus dem Iran.','من اهل ایران هستم.','kommen aus'],
   ['Wie geht es dir?','حالت چطور است؟','Gut, danke. Und dir?','خوبم، ممنون. تو چطور؟','du / dir']
  ]},
  {title:'معرفی رسمی',goal:'تفاوت du و Sie',turns:[
   ['Guten Tag! Wie heißen Sie?','روز بخیر! نام شما چیست؟','Mein Name ist Nima.','نام من نیماست.','Wie heißen Sie?'],
   ['Woher kommen Sie?','اهل کجا هستید؟','Ich komme aus Österreich.','من اهل اتریش هستم.','kommen Sie'],
   ['Auf Wiedersehen!','خدانگهدار!','Auf Wiedersehen!','خدانگهدار!','رسمی']
  ]}
 ],
 [ //2
  {title:'شغل شما چیست؟',goal:'نام شغل و محل کار',turns:[
   ['Was bist du von Beruf?','شغلت چیست؟','Ich bin Softwareentwickler.','من توسعه‌دهنده نرم‌افزار هستم.','Ich bin ...'],
   ['Wo arbeitest du?','کجا کار می‌کنی؟','Ich arbeite in einem Büro.','در یک دفتر کار می‌کنم.','arbeiten'],
   ['Arbeitest du heute?','امروز کار می‌کنی؟','Ja, ich arbeite heute.','بله، امروز کار می‌کنم.','Ja / Nein']
  ]},
  {title:'شماره تلفن',goal:'پرسیدن و گفتن اعداد',turns:[
   ['Wie ist deine Telefonnummer?','شماره تلفنت چیست؟','Meine Nummer ist eins, zwei, drei, vier.','شماره‌ام یک، دو، سه، چهار است.','عددها را واضح بگو'],
   ['Kannst du das bitte wiederholen?','می‌توانی لطفاً تکرار کنی؟','Ja: eins, zwei, drei, vier.','بله: یک، دو، سه، چهار.','wiederholen'],
   ['Danke schön!','خیلی ممنون!','Bitte schön!','خواهش می‌کنم!','پاسخ مؤدبانه']
  ]}
 ],
 [ //3
  {title:'خانواده من',goal:'معرفی افراد خانواده',turns:[
   ['Wer ist das?','این کیست؟','Das ist meine Mutter.','این مادرم است.','meine'],
   ['Hast du Geschwister?','خواهر و برادر داری؟','Ja, ich habe einen Bruder.','بله، یک برادر دارم.','haben'],
   ['Spricht dein Bruder Deutsch?','برادرت آلمانی صحبت می‌کند؟','Nein, er spricht Englisch.','نه، او انگلیسی صحبت می‌کند.','er spricht']
  ]},
  {title:'سؤال و جواب Ja / Nein / Doch',goal:'سؤالات مثبت و منفی',turns:[
   ['Ist das dein Vater?','این پدرت است؟','Ja, das ist mein Vater.','بله، این پدرم است.','mein Vater'],
   ['Ist das nicht deine Schwester?','این خواهرت نیست؟','Doch, das ist meine Schwester.','چرا، این خواهرم است.','Doch برای اصلاح پرسش منفی'],
   ['Wie heißt sie?','نام او چیست؟','Sie heißt Mina.','اسمش میناست.','sie heißt']
  ]}
 ],
 [ //4
  {title:'وسایل خانه',goal:'آرتیکل وسایل و توصیف',turns:[
   ['Was ist das?','این چیست؟','Das ist ein Tisch.','این یک میز است.','der Tisch'],
   ['Ist der Tisch schön?','میز زیباست؟','Ja, er ist sehr schön.','بله، خیلی زیباست.','er برای Tisch'],
   ['Wo ist die Lampe?','لامپ کجاست؟','Die Lampe ist hier.','لامپ اینجاست.','die Lampe']
  ]},
  {title:'قیمت مبلمان',goal:'قیمت پرسیدن',turns:[
   ['Wie viel kostet der Stuhl?','صندلی چند قیمت دارد؟','Der Stuhl kostet fünfzig Euro.','صندلی پنجاه یورو است.','kosten'],
   ['Ist das teuer?','این گران است؟','Nein, das ist günstig.','نه، ارزان است.','teuer / günstig'],
   ['Und wie findest du das Sofa?','نظرت درباره مبل چیست؟','Das Sofa ist sehr bequem.','مبل خیلی راحت است.','das Sofa']
  ]}
 ],
 [ //5
  {title:'وسایل شخصی',goal:'ein / eine و kein / keine',turns:[
   ['Hast du eine Brille?','عینک داری؟','Nein, ich habe keine Brille.','نه، عینک ندارم.','die Brille → keine'],
   ['Ist das ein Buch?','این کتاب است؟','Ja, das ist ein Buch.','بله، کتاب است.','das Buch → ein'],
   ['Was ist das?','این چیست؟','Das ist eine Flasche.','این بطری است.','die Flasche → eine']
  ]},
  {title:'جنس وسایل',goal:'توصیف جنس و رنگ',turns:[
   ['Ist der Tisch aus Holz?','میز چوبی است؟','Ja, der Tisch ist aus Holz.','بله، میز از چوب است.','aus Holz'],
   ['Welche Farbe hat die Tasche?','کیف چه رنگی است؟','Die Tasche ist blau.','کیف آبی است.','Farbe'],
   ['Gefällt dir die Tasche?','از کیف خوشت می‌آید؟','Ja, sie ist schön.','بله، زیباست.','sie برای Tasche']
  ]}
 ],
 [ //6
  {title:'وسایل دفتر',goal:'Akkusativ مثبت و منفی',turns:[
   ['Brauchst du einen Laptop?','لپ‌تاپ لازم داری؟','Ja, ich brauche einen Laptop.','بله، یک لپ‌تاپ لازم دارم.','der → einen'],
   ['Hast du einen Drucker?','پرینتر داری؟','Nein, ich habe keinen Drucker.','نه، پرینتر ندارم.','der → keinen'],
   ['Hast du eine Maus?','ماوس داری؟','Ja, ich habe eine Maus.','بله، ماوس دارم.','die → eine']
  ]},
  {title:'درخواست در دفتر کار',goal:'درخواست مؤدبانه و پاسخ',turns:[
   ['Hast du einen Stift für mich?','یک خودکار برایم داری؟','Ja, hier ist ein Stift.','بله، این یک خودکار است.','einen Stift'],
   ['Kann ich dein Buch haben?','می‌توانم کتابت را بگیرم؟','Ja, natürlich.','بله، البته.','können'],
   ['Vielen Dank!','خیلی ممنون!','Gern geschehen!','خواهش می‌کنم!','پایان مکالمه']
  ]}
 ],
 [ //7
  {title:'خرید از فروشگاه',goal:'درخواست و قیمت',turns:[
   ['Guten Tag! Was möchten Sie?','روز بخیر! چه می‌خواهید؟','Ich möchte Brot, bitte.','نان می‌خواهم، لطفاً.','möchte'],
   ['Wie viel möchten Sie?','چه مقدار می‌خواهید؟','Zwei Stück, bitte.','دو عدد، لطفاً.','Zwei Stück'],
   ['Sonst noch etwas?','چیز دیگری؟','Nein, danke.','نه، ممنون.','Nein, danke']
  ]},
  {title:'قیمت و پرداخت',goal:'Preis و خرید',turns:[
   ['Wie viel kostet das?','این چند قیمت دارد؟','Das kostet zehn Euro.','ده یورو قیمت دارد.','kosten'],
   ['Ist das alles?','همین‌هاست؟','Ja, das ist alles.','بله، همین‌هاست.','das ist alles'],
   ['Möchten Sie eine Tasche?','کیف می‌خواهید؟','Nein, danke.','نه، ممنون.','eine Tasche']
  ]}
 ],
 [ //8
  {title:'قرار جمعه',goal:'am + روز و um + ساعت',turns:[
   ['Hast du am Freitag Zeit?','جمعه وقت داری؟','Ja, am Freitag habe ich Zeit.','بله، جمعه وقت دارم.','am Freitag'],
   ['Treffen wir uns um fünf Uhr?','ساعت پنج همدیگر را ببینیم؟','Ja, um fünf Uhr passt es.','بله، ساعت پنج خوب است.','um fünf Uhr'],
   ['Gehen wir ins Kino?','برویم سینما؟','Ja, gern!','بله، با کمال میل!','پیشنهاد و قبول']
  ]},
  {title:'تغییر زمان قرار',goal:'رد مؤدبانه و پیشنهاد جدید',turns:[
   ['Hast du am Montag Zeit?','دوشنبه وقت داری؟','Nein, leider habe ich keine Zeit.','نه، متأسفانه وقت ندارم.','leider / keine Zeit'],
   ['Geht es am Dienstag?','سه‌شنبه می‌شود؟','Ja, Dienstag ist gut.','بله، سه‌شنبه خوب است.','Geht es ...?'],
   ['Um wie viel Uhr?','ساعت چند؟','Um halb neun.','هشت و نیم.','halb neun = ۸:۳۰']
  ]}
 ],
 [ //9
  {title:'در شهر',goal:'وسیله رفت‌وآمد',turns:[
   ['Wie fährst du zur Arbeit?','چطور سر کار می‌روی؟','Ich fahre mit dem Bus.','با اتوبوس می‌روم.','mit dem Bus'],
   ['Fährst du jeden Tag?','هر روز می‌روی؟','Ja, jeden Tag.','بله، هر روز.','jeden Tag'],
   ['Wann fährst du los?','کی حرکت می‌کنی؟','Um acht Uhr.','ساعت هشت.','um acht Uhr']
  ]},
  {title:'پرسیدن مسیر',goal:'سؤال درباره مقصد',turns:[
   ['Entschuldigung, wo ist der Bahnhof?','ببخشید، ایستگاه قطار کجاست؟','Der Bahnhof ist dort.','ایستگاه آنجاست.','wo ist ...'],
   ['Ist das weit?','دور است؟','Nein, es ist nicht weit.','نه، دور نیست.','nicht weit'],
   ['Kann ich zu Fuß gehen?','می‌توانم پیاده بروم؟','Ja, natürlich.','بله، البته.','zu Fuß']
  ]}
 ],
 [ //10
  {title:'حال بیمار',goal:'مشکل ساده و نیاز به پزشک',turns:[
   ['Wie geht es dir heute?','امروز حالت چطور است؟','Mir geht es nicht gut.','حالم خوب نیست.','mir geht es'],
   ['Was ist los?','چه شده؟','Ich habe Kopfschmerzen.','سردرد دارم.','Kopfschmerzen'],
   ['Musst du zum Arzt?','باید دکتر بروی؟','Ja, ich muss zum Arzt.','بله، باید دکتر بروم.','müssen']
  ]},
  {title:'وقت دکتر',goal:'درخواست وقت',turns:[
   ['Guten Tag! Brauchen Sie einen Termin?','روز بخیر، وقت ملاقات می‌خواهید؟','Ja, bitte.','بله، لطفاً.','einen Termin'],
   ['Haben Sie am Dienstag Zeit?','سه‌شنبه وقت دارید؟','Ja, am Dienstag kann ich kommen.','بله، سه‌شنبه می‌توانم بیایم.','können'],
   ['Um neun Uhr?','ساعت نه؟','Ja, das passt.','بله، خوب است.','um neun Uhr']
  ]}
 ],
 [ //11
  {title:'کمک در دفتر',goal:'درخواست رسمی',turns:[
   ['Können Sie mir bitte helfen?','می‌توانید لطفاً کمکم کنید؟','Ja, natürlich.','بله، البته.','Können Sie ...?'],
   ['Haben Sie meine E-Mail?','ایمیلم را دارید؟','Ja, ich habe Ihre E-Mail.','بله، ایمیلتان را دارم.','Ihre E-Mail'],
   ['Vielen Dank für Ihre Hilfe.','ممنون از کمکتان.','Gern geschehen.','خواهش می‌کنم.','حالت رسمی']
  ]},
  {title:'هماهنگی ایمیل',goal:'پیام و ساعت',turns:[
   ['Können Sie mir eine E-Mail schicken?','می‌توانید برایم ایمیل بفرستید؟','Ja, ich schicke Ihnen eine E-Mail.','بله، برایتان ایمیل می‌فرستم.','eine E-Mail'],
   ['Wann können Sie das machen?','کی می‌توانید این کار را بکنید؟','Heute Nachmittag.','امروز بعدازظهر.','زمان'],
   ['Danke, bis später!','ممنون، تا بعد!','Bis später!','تا بعد!','پایان']
  ]}
 ],
 [ //12
  {title:'گفت‌وگوی شغلی',goal:'معرفی شغل و مهارت',turns:[
   ['Was machen Sie beruflich?','از نظر شغلی چه می‌کنید؟','Ich bin Softwareentwickler.','توسعه‌دهنده نرم‌افزار هستم.','Ich bin ...'],
   ['Welche Sprachen sprechen Sie?','به چه زبان‌هایی صحبت می‌کنید؟','Ich spreche Persisch, Englisch und ein bisschen Deutsch.','فارسی، انگلیسی و کمی آلمانی صحبت می‌کنم.','ein bisschen'],
   ['Wo möchten Sie arbeiten?','کجا می‌خواهید کار کنید؟','Ich möchte in Österreich arbeiten.','می‌خواهم در اتریش کار کنم.','möchte']
  ]},
  {title:'مهارت‌های کاری',goal:'können و پرسش رسمی',turns:[
   ['Können Sie programmieren?','برنامه‌نویسی بلد هستید؟','Ja, ich kann programmieren.','بله، بلدم برنامه‌نویسی کنم.','kann'],
   ['Arbeiten Sie mit Python?','با پایتون کار می‌کنید؟','Ja, ich arbeite mit Python.','بله، با پایتون کار می‌کنم.','arbeiten mit'],
   ['Haben Sie Fragen?','سؤالی دارید؟','Ja, wie sind die Arbeitszeiten?','بله، ساعت‌های کاری چگونه‌اند؟','Fragen']
  ]}
 ]
];
export const PARTNER_STORE='dt_partner_practice_v1';
export const partnerScenarios=Object.freeze(exercises.flatMap((group,index)=>group.map((scene,i)=>({
 ...scene,lesson:index+1,id:'partner-'+(index+1)+'-'+(i+1),
 turns:scene.turns.map(([ask,askFa,answer,answerFa,tip],j)=>({
  id:'turn-'+(j+1),ask,askFa,answer,answerFa,tip,asker:j%2===0?'A':'B'
 }))
}))));
export const partnerForLesson=id=>partnerScenarios.filter(x=>x.lesson===Number(id));
export const partnerProgress=(state={},scenarioId)=>state?.[scenarioId]||{done:0,hard:0,completed:false,next:0};
export function advancePartnerProgress(state={},scenario,turnIndex,hard=false,now=Date.now()){
 if(!scenario?.id||!Number.isInteger(turnIndex)||turnIndex<0||turnIndex>=scenario.turns.length)throw new Error('Invalid partner turn');
 const old=partnerProgress(state,scenario.id);
 const next=turnIndex+1;
 return {...state,[scenario.id]:{
  ...old,done:(old.done||0)+1,hard:(old.hard||0)+Number(hard),
  completed:next>=scenario.turns.length,next:next>=scenario.turns.length?0:next,
  lastAt:now
 }};
}
