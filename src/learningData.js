// Independent learning notes inspired by the student's first pronunciation class.
// No copyrighted textbook pages or recordings are included.
export const pronunciationGroups = [
  { id: 'all', label: 'همه قوانین' },
  { id: 'consonants', label: 'صامت‌ها' },
  { id: 'vowels', label: 'مصوت‌ها' },
  { id: 'exceptions', label: 'استثناها' },
];

export const pronunciationRules = [
  { id:'s', group:'consonants', symbol:'S / s', sound:'/z/ یا /s/', title:'S همیشه «س» نیست', word:'Sonne', meaning:'خورشید', ipa:'/ˈzɔnə/', note:'S در آغاز کلمه پیش از مصوت، اغلب مثل «ز» است.', contrast:'Haus', contrastIpa:'/haʊ̯s/', exception:'در انتهای کلمه مثل Haus معمولاً صدای «س» می‌دهد.' },
  { id:'sp', group:'consonants', symbol:'sp', sound:'/ʃp/', title:'sp در ابتدای واژه', word:'Sport', meaning:'ورزش', ipa:'/ʃpɔʁt/', note:'در ابتدای واژه/هجا معمولاً ش + پ شنیده می‌شود.', contrast:'Wespe', contrastIpa:'/ˈvɛspə/', exception:'در وسط واژه‌هایی مثل Wespe، «سپ» است؛ نه «شپ».' },
  { id:'st', group:'consonants', symbol:'st', sound:'/ʃt/', title:'st در ابتدای واژه', word:'Straße', meaning:'خیابان', ipa:'/ˈʃtʁaːsə/', note:'در ابتدای واژه/هجا معمولاً ش + ت شنیده می‌شود.', contrast:'Westen', contrastIpa:'/ˈvɛstn̩/', exception:'در Westen ترکیب st در وسط واژه صدای «ست» دارد.' },
  { id:'sz', group:'consonants', symbol:'ß / ss', sound:'/s/', title:'حرف ویژه ß', word:'heißen', meaning:'نام داشتن', ipa:'/ˈhaɪ̯sn̩/', note:'ß مانند «س» بی‌صداست؛ ss هم همین صدا را دارد.', contrast:'Fluss', contrastIpa:'/flʊs/', exception:'ß و ss از نظر نوشتار و قواعد املایی یکی نیستند؛ با هم جابه‌جا نکن.' },
  { id:'v', group:'exceptions', symbol:'V / v', sound:'/f/ یا /v/', title:'دو صدای متفاوت V', word:'Vater', meaning:'پدر', ipa:'/ˈfaːtɐ/', note:'در بسیاری از کلمات قدیمی آلمانی v شبیه «ف» خوانده می‌شود.', contrast:'Verb', contrastIpa:'/vɛʁp/', exception:'در وام‌واژه‌هایی مثل Verb صدای «و/ڤ» /v/ دارد؛ هر کلمه را جدا یاد بگیر.' },
  { id:'w', group:'consonants', symbol:'W / w', sound:'/v/', title:'W انگلیسی نیست', word:'Wasser', meaning:'آب', ipa:'/ˈvasɐ/', note:'W در آلمانی شبیه صدای /v/ است، نه W انگلیسی.', contrast:'Vater', contrastIpa:'/ˈfaːtɐ/', exception:'V در Vater شبیه /f/ است؛ ظاهر دو حرف ممکن است گمراه‌کننده باشد.' },
  { id:'j', group:'consonants', symbol:'J / j', sound:'/j/', title:'J مانند «ی»', word:'Jahr', meaning:'سال', ipa:'/jaːɐ̯/', note:'در واژه‌های معمول آلمانی J مانند Y در yes است.', contrast:'Job', contrastIpa:'/dʒɔp/', exception:'در وام‌واژه Job، تلفظ J شبیه «ج» انگلیسی است.' },
  { id:'z', group:'consonants', symbol:'Z / z', sound:'/ts/', title:'Z دو صدا پشت سرهم', word:'Zeit', meaning:'زمان', ipa:'/tsaɪ̯t/', note:'Z آلمانی معمولاً «تس» است.', contrast:'zwei', contrastIpa:'/tsvaɪ̯/', exception:'حواست باشد صدای «ز» فارسی یا Z انگلیسی نیست.' },
  { id:'ch-soft', group:'consonants', symbol:'ch', sound:'/ç/', title:'ch نرم (Ich-Laut)', word:'ich', meaning:'من', ipa:'/ɪç/', note:'پس از i، e، ä، ö، ü و بعضی صامت‌ها معمولاً صدایی نرم و سایشی دارد.', contrast:'Milch', contrastIpa:'/mɪlç/', exception:'این صدا دقیقاً «ش» فارسی نیست؛ زبان به سقف دهان نزدیک می‌شود.' },
  { id:'ch-hard', group:'consonants', symbol:'ch', sound:'/x/', title:'ch خشن (Ach-Laut)', word:'Bach', meaning:'جویبار', ipa:'/bax/', note:'پس از a، o، u و au معمولاً شبیه «خ» شنیده می‌شود.', contrast:'Buch', contrastIpa:'/buːx/', exception:'ch در ich به‌طور معمول همین صدای خشن Bach را ندارد.' },
  { id:'chs', group:'exceptions', symbol:'chs', sound:'/ks/', title:'استثنای chs', word:'sechs', meaning:'شش', ipa:'/zɛks/', note:'ترکیب chs در این واژه /ks/ است.', contrast:'wachsen', contrastIpa:'/ˈvaksn̩/', exception:'اینجا نباید «خس» تلفظ کنی؛ sechs شبیه «زِکس» است.' },
  { id:'sch', group:'consonants', symbol:'sch', sound:'/ʃ/', title:'سه حرف، یک صدا', word:'Schule', meaning:'مدرسه', ipa:'/ˈʃuːlə/', note:'sch معمولاً «ش» است.', contrast:'schön', contrastIpa:'/ʃøːn/', exception:'با ch نرم در ich اشتباه نکن؛ این‌ها دو آوای متفاوت‌اند.' },
  { id:'tsch', group:'consonants', symbol:'tsch', sound:'/tʃ/', title:'صدای «چ»', word:'Deutsch', meaning:'آلمانی', ipa:'/dɔɪ̯tʃ/', note:'tsch یک صدای «چ» می‌سازد.', contrast:'Tschüss', contrastIpa:'/tʃʏs/', exception:'sch فقط «ش» است، اما tsch شامل «ت» آغازین هم می‌شود.' },
  { id:'ph', group:'consonants', symbol:'ph', sound:'/f/', title:'ph = f', word:'Physik', meaning:'فیزیک', ipa:'/fyˈziːk/', note:'ph در واژه‌های یونانی‌ریشه غالباً «ف» است.', contrast:'Foto', contrastIpa:'/ˈfoːto/', exception:'در Physik صدای y را با «ای» انگلیسی اشتباه نکن؛ آوای گرد /y/ است.' },
  { id:'tion', group:'consonants', symbol:'-tion', sound:'/tsi̯oːn/', title:'پایان -tion', word:'Nation', meaning:'ملت', ipa:'/naˈtsioːn/', note:'در کلماتی مانند Nation اغلب به شکل «تسیون» است.', contrast:'Information', contrastIpa:'/ɪnfɔʁmaˈtsioːn/', exception:'tion را به سبک انگلیسی «شِن» نخوان.' },
  { id:'ei', group:'vowels', symbol:'ei / ai', sound:'/aɪ̯/', title:'ei = آی', word:'mein', meaning:'مال من', ipa:'/maɪ̯n/', note:'ei و ai معمولاً یک واکه مرکب شبیه «آی» دارند.', contrast:'Mai', contrastIpa:'/maɪ̯/', exception:'ترتیب ie متفاوت است: Liebe را «لایبه» نخوان.' },
  { id:'ie', group:'vowels', symbol:'ie', sound:'/iː/', title:'ie = ای کشیده', word:'Liebe', meaning:'عشق', ipa:'/ˈliːbə/', note:'ie در بسیاری از واژه‌ها صدای «ای» کشیده دارد.', contrast:'sieben', contrastIpa:'/ˈziːbn̩/', exception:'ie معمولاً «آی» نیست؛ با ei در mein مقایسه کن.' },
  { id:'au', group:'vowels', symbol:'au', sound:'/aʊ̯/', title:'au = آو', word:'Haus', meaning:'خانه', ipa:'/haʊ̯s/', note:'au مثل صدای مرکب «آو» است.', contrast:'auch', contrastIpa:'/aʊ̯x/', exception:'äu صدای دیگری دارد؛ Häuser را مثل Haus نخوان.' },
  { id:'eu', group:'vowels', symbol:'eu / äu', sound:'/ɔɪ̯/', title:'eu و äu = اُی', word:'heute', meaning:'امروز', ipa:'/ˈhɔɪ̯tə/', note:'eu و äu معمولاً صدای مرکب شبیه «اُی» دارند.', contrast:'Häuser', contrastIpa:'/ˈhɔɪ̯zɐ/', exception:'با au در Haus اشتباه نکن.' },
  { id:'umlaut', group:'vowels', symbol:'ä ö ü', sound:'واکه‌های گرد', title:'نقطه‌ها فقط تزیین نیستند', word:'fünf', meaning:'پنج', ipa:'/fʏnf/', note:'ä، ö و ü می‌توانند صدای مصوت را تغییر دهند. لب‌های خود را هنگام ö و ü گرد کن.', contrast:'schön', contrastIpa:'/ʃøːn/', exception:'حذف نقطه‌ها غلط املایی می‌سازد؛ نوشتن funf به‌جای fünf درست نیست.' },
  { id:'g-final', group:'exceptions', symbol:'g آخر واژه', sound:'/k/', title:'بی‌صدایی صامت پایانی', word:'Tag', meaning:'روز', ipa:'/taːk/', note:'در پایان واژه g معمولاً مثل k شنیده می‌شود.', contrast:'gut', contrastIpa:'/ɡuːt/', exception:'در آغاز gut، حرف g صدای /g/ دارد.' },
  { id:'ig', group:'exceptions', symbol:'-ig', sound:'/ɪç/ یا /ɪk/', title:'پایان -ig و تفاوت منطقه‌ای', word:'wichtig', meaning:'مهم', ipa:'/ˈvɪçtɪç/', note:'در بسیاری از تلفظ‌های معیار آلمان، پایان -ig صدای نرم /ɪç/ دارد.', contrast:'König', contrastIpa:'/ˈkøːnɪç/', exception:'در اتریش و برخی گویش‌ها پایان -ig بیشتر به /ɪk/ نزدیک می‌شود؛ هر دو را ممکن است بشنوی.' },
  { id:'h', group:'exceptions', symbol:'H / h', sound:'/h/ یا بی‌صدا', title:'H گاهی تلفظ نمی‌شود', word:'Haus', meaning:'خانه', ipa:'/haʊ̯s/', note:'در آغاز هجا مانند Haus صدای ه دارد.', contrast:'sehen', contrastIpa:'/ˈzeːən/', exception:'در sehen، h پس از مصوت صدا ندارد و بیشتر نشانه کشیدگی است.' },
  { id:'n', group:'exceptions', symbol:'-en / -n', sound:'پایان مصدر', title:'پایان فعل‌ها', word:'kommen', meaning:'آمدن', ipa:'/ˈkɔmən/', note:'بسیاری از مصدرها با -en تمام می‌شوند.', contrast:'sammeln', contrastIpa:'/ˈzaml̩n/', exception:'برخی مصدرها مثل sammeln به -n ختم می‌شوند؛ این بخشی از شکل فعل است.' },
];

const baseNumbers = ['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn','zwanzig'];
const tens = { 20:'zwanzig', 30:'dreißig', 40:'vierzig', 50:'fünfzig', 60:'sechzig', 70:'siebzig', 80:'achtzig', 90:'neunzig' };

export function germanNumber(number) {
  const n = Number(number);
  if (!Number.isInteger(n) || n < 0 || n > 100) return '';
  if (n <= 20) return baseNumbers[n];
  if (n === 100) return 'hundert';
  const ten = Math.floor(n / 10) * 10;
  const unit = n % 10;
  if (!unit) return tens[ten];
  return (unit === 1 ? 'ein' : baseNumbers[unit]) + 'und' + tens[ten];
}

export function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
