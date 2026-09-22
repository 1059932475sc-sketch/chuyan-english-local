import {sentences} from './data.js';
// 独立编写的语法分组。每组对应原句中的连续词块。
const patterns=[
 [['问候语','Hello,'],['主语','I'],['系动词','am'],['表语','Mia.']],
 [['表语','What'],['系动词','is'],['主语','your name?']],
 [['主语','My name'],['系动词','is'],['表语','Leo.']],
 [['形式主语','It'],['系动词','is'],['表语','nice'],['真正主语','to meet you.']],
 [['表语','How'],['系动词','are'],['主语','you'],['时间状语','today?']],
 [['主语','I'],['系动词','am'],['表语','very well.']],
 [['主语','You'],['系动词','are'],['表语','my friend.']],
 [['谓语','See'],['宾语','you'],['时间状语','on Monday.']],
 [['主语','This'],['系动词','is'],['表语','a book.']],
 [['主语','That'],['系动词','is'],['表语','my bag.']],
 [['主语','The pen'],['系动词','is'],['表语','blue.']],
 [['主语','I'],['谓语','have'],['宾语','two cups.']],
 [['主语','The door'],['系动词','is'],['表语','open.']],
 [['主语','My room'],['系动词','is'],['表语','small.']],
 [['疑问地点','Where'],['系动词','is'],['主语','the key?']],
 [['主语','It'],['系动词','is'],['表语','on the desk.']],
 [['主语','I'],['谓语','would like'],['宾语','some water.']],
 [['主语','I'],['谓语','like'],['宾语','fresh apples.']],
 [['主语','This soup'],['系动词','is'],['表语','hot.']],
 [['助动词','Do'],['主语','you'],['谓语','like'],['宾语','rice?']],
 [['回答','Yes,'],['主语','I'],['谓语','like'],['宾语','it.']],
 [['主语','I'],['谓语','need'],['宾语','a spoon.']],
 [['主语','The bread'],['系动词','is'],['表语','soft.']],
 [['谓语','Let'],['宾语','us'],['宾语补足语','eat'],['方式状语','together.']],
 [['主语','I'],['谓语','get up'],['时间状语','at seven.']],
 [['主语','I'],['谓语','wash'],['宾语','my face.']],
 [['主语','I'],['谓语','walk'],['方向状语','to school.']],
 [['主语','I'],['谓语','work'],['地点状语','at home.']],
 [['主语','We'],['谓语','eat'],['宾语','lunch'],['时间状语','at noon.']],
 [['主语','I'],['谓语','read'],['时间状语','after dinner.']],
 [['主语','It'],['系动词','is'],['表语','time for bed.']],
 [['谓语','Have'],['宾语','a good night.']],
 [['主语','The park'],['系动词','is'],['表语','near here.']],
 [['礼貌语','Please'],['谓语','turn'],['方向状语','left.']],
 [['谓语','Go'],['方向状语','straight ahead.']],
 [['主语','I'],['谓语','take'],['宾语','the bus.']],
 [['疑问价格','How much'],['系动词','is'],['主语','this hat?']],
 [['主语','I'],['谓语','want'],['宾语','the green one.']],
 [['情态动词','May'],['主语','I'],['谓语','try'],['宾语','it'],['副词小品词','on?']],
 [['谓语','Thank'],['宾语','you'],['原因状语','for your help.']],
 [['主语','I'],['系动词','feel'],['表语','happy'],['时间状语','today.']],
 [['主语','I'],['系动词','am'],['表语','a little tired.']],
 [['情态动词','Can'],['主语','you'],['谓语','help'],['宾语','me?']],
 [['主语','I'],['谓语','can swim.']],
 [['礼貌语','Please'],['谓语','speak'],['方式状语','slowly.']],
 [['主语','I'],['助动词与否定','do not'],['谓语','understand.']],
 [['主语','I'],['谓语','want'],['宾语','to learn English.']],
 [['主语','I'],['谓语','practice'],['时间状语','every day.']]
];
export const detailedSentenceIds=new Set(sentences.slice(0,patterns.length).map(s=>s.id));
export const structures=Object.fromEntries(sentences.map((s,i)=>[s.id,patterns[i]||[['完整表达',s.en]]]));
const clean=s=>s.toLowerCase().replace(/[^a-z']/g,'');
export const dictionary={};
for(const s of sentences)for(const match of String(s.words||'').matchAll(/([A-Za-z]+) \/([^/]+)\/ ([^；]+)/g))dictionary[clean(match[1])]={ipa:match[2],meaning:match[3]};
const basics=[['i','aɪ','我','代词'],['am','æm','是','be 动词'],['are','ɑːr','是','be 动词'],['is','ɪz','是','be 动词'],['a','ə','一个（泛指）','冠词'],['the','ðə','特指已知的人或物','冠词'],['to','tuː','到；不定式标记','介词 / 标记'],['at','æt','在','介词'],['for','fɔːr','为了；对于','介词'],['of','əv','……的','介词'],['do','duː','构成疑问或否定','助动词'],['not','nɒt','不','副词'],['have','hæv','有；吃；度过','动词'],['your','jɔːr','你的','限定词'],['we','wiː','我们','代词'],['us','ʌs','我们（宾格）','代词'],['would','wʊd','用于委婉表达','情态动词'],['let','let','让','动词'],['get','ɡet','得到；进入某状态','动词'],['up','ʌp','向上','副词'],['dinner','ˈdɪnər','晚饭','名词'],['go','ɡəʊ','去','动词'],['here','hɪər','这里','副词'],['please','pliːz','请','礼貌用语'],['one','wʌn','一个；代指事物','代词'],['day','deɪ','天','名词'],['mia','ˈmiːə','米娅（人名）','专有名词'],['leo','ˈliːəʊ','利奥（人名）','专有名词'],['cups','kʌps','杯子（复数）','名词'],['apples','ˈæpəlz','苹果（复数）','名词']];
for(const [word,ipa,meaning,pos] of basics)dictionary[word]={ipa,meaning,pos};
const commonGlossary=[
 ['good','好的；令人愉快的','形容词'],['morning','早上；上午','名词'],['afternoon','下午','名词'],['evening','晚上','名词'],['welcome','欢迎','动词 / 感叹词'],['back','回来；向后','副词'],['home','家；回家','名词 / 副词'],
 ['professor','教授','名词'],['austin','奥斯汀（人名）','专有名词'],['james','詹姆斯（人名）','专有名词'],['emma','艾玛（人名）','专有名词'],['she','她','代词'],['he','他','代词'],['they','他们；她们；它们','代词'],['them','他们；她们；它们（宾格）','代词'],['her','她的；她（宾格）','代词 / 限定词'],['his','他的','限定词'],
 ['doing','做；进行','动词 -ing'],['great','很棒的；很好的','形容词'],['thank','感谢','动词'],['thanks','谢谢','名词 / 感叹词'],['thinking','考虑；思考','动词 -ing'],['about','关于；大约','介词'],['applying','申请','动词 -ing'],['college','大学；学院','名词'],['has','有；拥有','动词'],['few','几个；少数','限定词'],['questions','问题（复数）','名词'],['question','问题','名词'],['mind','介意；头脑','动词 / 名词'],['telling','告诉；讲述','动词 -ing'],['process','过程；流程','名词'],['pleasure','高兴；荣幸','名词'],['more','更多；更加','副词 / 限定词'],['than','比；超过','连词'],['happy','开心的；乐意的','形容词'],['with','和；带有','介词'],['stop','停下；顺路拜访','动词'],['by','在旁边；通过','介词'],['office','办公室','名词'],['next','下一个；接下来的','形容词'],['week','周；星期','名词'],['so','所以；如此','副词 / 连词'],['much','许多；非常','副词 / 限定词'],['helping','帮助','动词 -ing'],['mention','提到','动词'],['hopefully','希望如此；有希望地','副词'],['will','将会','助动词'],['be','是；成为','动词'],['able','能够的','形容词'],['answer','回答；答案','动词 / 名词'],
 ['hi','嗨','感叹词'],['how','怎样；如何','疑问词'],['going','进行；去','动词 -ing'],['fine','好的；不错','形容词'],['just','刚刚；只是','副词'],['off','离开；停止','副词'],['library','图书馆','名词'],['got','得到；有','动词'],['history','历史','名词'],['exam','考试','名词'],['start','开始','动词'],['studying','学习','动词 -ing'],['oh','哦','感叹词'],['no','不；没有','副词 / 感叹词'],['later','稍后；以后','副词'],['then','然后；那么','副词'],['luck','好运','名词'],
 ['mr','先生','称呼'],['mrs','夫人','称呼'],['ms','女士','称呼'],['dr','博士；医生','称呼'],['smith','史密斯（姓氏）','专有名词'],['too','也；太','副词'],['an','一个（元音前）','冠词'],['economist','经济学家','名词'],['finished','完成了','动词过去式'],['writing','写作；正在写','动词 -ing'],['international','国际的','形容词'],['trade','贸易','名词'],['field','领域；田地','名词'],['united','联合的','形容词'],['nations','国家（复数）','名词'],['in','在……里','介词'],['development','发展','名词'],['program','项目；节目','名词'],['any','任何；一些','限定词'],['chance','机会','名词'],['did','做；助动词过去式','助动词'],['guess','猜；认为','动词'],['articles','文章（复数）','名词'],['technical','技术的；专业的','形容词'],['assistance','帮助；援助','名词'],['excellent','优秀的','形容词'],['who','谁','疑问词'],['woman','女人；女士','名词'],['man','男人；男士','名词'],['girl','女孩','名词'],['boy','男孩','名词'],['people','人们','名词'],['person','人','名词'],
 ['what','什么','疑问词'],['where','哪里','疑问词'],['when','什么时候','疑问词'],['why','为什么','疑问词'],['which','哪一个','疑问词'],['could','可以；能够','情态动词'],['should','应该','情态动词'],['must','必须','情态动词'],['might','可能','情态动词'],['shall','将；要不要','情态动词'],['don','不（用于 don’t）','助动词'],['does','做；助动词','助动词'],['doesn','不（用于 doesn’t）','助动词'],['didn','不（用于 didn’t）','助动词'],['can','能；可以','情态动词'],['may','可以；可能','情态动词'],
 ['and','和；并且','连词'],['or','或者','连词'],['but','但是','连词'],['because','因为','连词'],['if','如果','连词'],['as','作为；当……时','连词 / 介词'],['from','从；来自','介词'],['into','进入','介词'],['over','在……上方；超过','介词'],['under','在……下面','介词'],['before','在……之前','介词 / 连词'],['after','在……之后','介词 / 连词'],['around','在周围；大约','介词 / 副词'],['through','穿过；通过','介词'],['between','在两者之间','介词'],['without','没有','介词'],
 ['this','这；这个','代词 / 限定词'],['that','那；那个','代词 / 限定词'],['these','这些','代词 / 限定词'],['those','那些','代词 / 限定词'],['there','那里；有','副词'],['their','他们的','限定词'],['our','我们的','限定词'],['its','它的','限定词'],['all','全部；所有','限定词'],['some','一些','限定词'],['many','许多','限定词'],['every','每个','限定词'],['each','每个','限定词'],['another','另一个','限定词'],['other','其他的','形容词'],
 ['want','想要','动词'],['need','需要','动词'],['like','喜欢；像','动词 / 介词'],['love','爱；喜欢','动词'],['know','知道；认识','动词'],['think','想；认为','动词'],['say','说','动词'],['tell','告诉','动词'],['ask','问；请求','动词'],['speak','说话','动词'],['talk','交谈','动词'],['call','打电话；称呼','动词'],['meet','见面；认识','动词'],['see','看见；明白','动词'],['look','看','动词'],['come','来','动词'],['leave','离开','动词'],['take','拿；乘坐；花费','动词'],['give','给','动词'],['make','制作；使得','动词'],['put','放','动词'],['use','使用','动词'],['find','找到','动词'],['work','工作','动词 / 名词'],['study','学习','动词 / 名词'],['learn','学习','动词'],['practice','练习','动词 / 名词'],['try','尝试','动词'],['bring','带来','动词'],['buy','买','动词'],['pay','付款','动词'],['open','打开；开着的','动词 / 形容词'],['close','关闭；近的','动词 / 形容词'],['wait','等待','动词'],['help','帮助','动词 / 名词'],['feel','感觉','动词'],
 ['time','时间','名词'],['today','今天','名词 / 副词'],['tomorrow','明天','名词 / 副词'],['yesterday','昨天','名词 / 副词'],['minute','分钟','名词'],['hour','小时','名词'],['year','年','名词'],['month','月','名词'],['monday','星期一','名词'],['tuesday','星期二','名词'],['wednesday','星期三','名词'],['thursday','星期四','名词'],['friday','星期五','名词'],['saturday','星期六','名词'],['sunday','星期日','名词'],
 ['water','水','名词'],['coffee','咖啡','名词'],['tea','茶','名词'],['food','食物','名词'],['breakfast','早餐','名词'],['lunch','午餐','名词'],['dinner','晚餐','名词'],['restaurant','餐馆','名词'],['store','商店','名词'],['market','市场','名词'],['money','钱','名词'],['price','价格','名词'],['ticket','票','名词'],['bus','公交车','名词'],['train','火车','名词'],['car','汽车','名词'],['taxi','出租车','名词'],['street','街道','名词'],['hotel','旅馆','名词'],['room','房间','名词'],['phone','电话','名词'],['email','电子邮件','名词'],['address','地址','名词'],['weather','天气','名词'],['report','报告；报道','名词'],
 ['big','大的','形容词'],['small','小的','形容词'],['new','新的','形容词'],['old','旧的；年老的','形容词'],['right','正确的；右边的','形容词 / 名词'],['left','左边的','形容词 / 名词'],['hot','热的','形容词'],['cold','冷的','形容词'],['warm','温暖的','形容词'],['freezing','极冷的','形容词'],['easy','容易的','形容词'],['hard','困难的；硬的','形容词'],['busy','忙的','形容词'],['ready','准备好的','形容词'],['sure','确定的','形容词'],['sorry','抱歉的','形容词'],['late','迟的；晚的','形容词'],['early','早的','形容词']
];
for(const [word,meaning,pos] of commonGlossary)dictionary[word]??={ipa:'',meaning,pos};
const nouns='hello name friend monday book bag pen cup door room key desk water apple soup rice spoon bread face school home lunch noon time bed night park bus hat help english';
const adjectives='nice blue small fresh hot soft good green happy tired open';
for(const [w,v] of Object.entries(dictionary))v.pos ||= nouns.split(' ').includes(w)?'名词 / 常用词':adjectives.split(' ').includes(w)?'形容词':'常用词';
export function wordInfo(word){
 const key=clean(word);
 if(dictionary[key])return dictionary[key];
 if(key.endsWith("n't"))return {ipa:'',meaning:'不；否定',pos:'缩写'};
 if(key.endsWith("'m"))return {ipa:'',meaning:'am 的缩写：是',pos:'缩写'};
 if(key.endsWith("'re"))return {ipa:'',meaning:'are 的缩写：是',pos:'缩写'};
 if(key.endsWith("'s"))return {ipa:'',meaning:'is / has / 所属 的缩写',pos:'缩写'};
 if(key.endsWith("'ll"))return {ipa:'',meaning:'will 的缩写：将会',pos:'缩写'};
 if(key.endsWith("'ve"))return {ipa:'',meaning:'have 的缩写：已经；有',pos:'缩写'};
 if(key.endsWith("'d"))return {ipa:'',meaning:'would / had 的缩写',pos:'缩写'};
 if(/[A-Z]/.test(String(word)[0]||''))return {ipa:'',meaning:'专有名词：人名、地名或称呼',pos:'专有名词'};
 if(key.endsWith('ing')&&key.length>5)return {ipa:'',meaning:'正在做某事；动词 -ing 形式',pos:'动词 -ing'};
 if(key.endsWith('ed')&&key.length>4)return {ipa:'',meaning:'已经做过；动词过去式 / 过去分词',pos:'动词过去式'};
 if(key.endsWith('s')&&key.length>3)return {ipa:'',meaning:'复数或第三人称单数形式',pos:'词形变化'};
 return {ipa:'',meaning:'常用口语词；结合本句中文理解',pos:'词语'};
}

export function tokenizeSentence(text){
 return [...String(text).matchAll(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)].map(match=>({word:match[0].replace('’',"'"),index:match.index}));
}

function normalizeToken(word){return clean(word.replace('’',"'"));}

const beWords=new Set(['am','are','is','was','were','be','been']);
const auxWords=new Set(['do','does','did','can','could','may','might','must','should','would','will','shall','have','has','had']);
const subjectWords=new Set(['i','you','he','she','it','we','they','this','that','these','those','there']);
const prepWords=new Set(['to','for','with','about','at','in','on','by','from','of','after','before','around','near','under','over','through','between','without','into']);
const verbWords=new Set('am are is was were be been have has had do does did can could may might must should would will shall want need like love know think say tell ask speak talk call meet see look come go leave take give make put use find work study learn practice try bring buy pay open close wait help feel get eat drink read write walk turn stop answer mention welcome'.split(' '));

function roleFromPatterns(sentence){
 const groups=structures[sentence.id]||[];
 if(groups.length===1&&groups[0][0]==='完整表达')return null;
 const picked=[];
 const add=(role,text)=>{if(text&&!picked.some(item=>item.role===role))picked.push({role,text});};
 for(const [role,text] of groups){
  if(role.includes('主语'))add('主语',text.replace(/[?.!,]+$/,''));
  else if(role.includes('谓语')||role.includes('系动词'))add('谓语',text.replace(/[?.!,]+$/,''));
  else if(role.includes('宾语')||role.includes('表语'))add('宾语 / 补语',text.replace(/[?.!,]+$/,''));
 }
 return picked.length?picked:null;
}

export function sentenceRoles(sentence){
 const exact=roleFromPatterns(sentence);
 if(exact)return exact;
 const tokens=tokenizeSentence(sentence.en).map(token=>({raw:token.word,key:normalizeToken(token.word)})).filter(token=>token.key);
 if(!tokens.length)return [];
 const lower=tokens.map(token=>token.key);
 const questionSubject=lower.findIndex(word=>subjectWords.has(word)&&lower.slice(0,lower.indexOf(word)).some(item=>beWords.has(item)||auxWords.has(item)));
 if(questionSubject>=0){
  const before=lower.slice(0,questionSubject).filter(item=>beWords.has(item)||auxWords.has(item)).at(-1);
  const afterVerb=lower.slice(questionSubject+1).findIndex(item=>verbWords.has(item)||item.endsWith('ing')||item.endsWith('ed'));
  const verb=[before,afterVerb>=0?tokens[questionSubject+1+afterVerb].raw:null].filter(Boolean).join(' ');
  const objectStart=afterVerb>=0?questionSubject+2+afterVerb:questionSubject+1;
  return [{role:'主语',text:tokens[questionSubject].raw},{role:'谓语',text:verb||tokens[Math.max(0,questionSubject-1)].raw},{role:'宾语 / 补语',text:tokens.slice(objectStart).map(item=>item.raw).join(' ')}].filter(item=>item.text);
 }
 let subjectEnd=lower.findIndex((word,index)=>index>0&&(verbWords.has(word)||word.endsWith('ing')||word.endsWith('ed')));
 if(subjectEnd<0){
  const first=lower[0];
  if(verbWords.has(first)||first.endsWith('ing'))return [{role:'主语',text:'You'},{role:'谓语',text:tokens[0].raw},{role:'宾语 / 补语',text:tokens.slice(1).map(item=>item.raw).join(' ')}].filter(item=>item.text);
  subjectEnd=Math.min(1,tokens.length);
 }
 let verbEnd=subjectEnd+1;
 while(verbEnd<tokens.length&&(auxWords.has(lower[verbEnd-1])||beWords.has(lower[verbEnd-1])||lower[verbEnd].endsWith('ing')||verbWords.has(lower[verbEnd])))verbEnd++;
 const object=tokens.slice(verbEnd).map(item=>item.raw).join(' ');
 return [{role:'主语',text:tokens.slice(0,subjectEnd).map(item=>item.raw).join(' ')},{role:'谓语',text:tokens.slice(subjectEnd,verbEnd).map(item=>item.raw).join(' ')},{role:'宾语 / 补语',text:object}].filter(item=>item.text&&!prepWords.has(normalizeToken(item.text)));
}

for(const word of 'see meet have need eat wash walk work read turn take want try thank help feel swim speak understand learn practice get go let'.split(' '))if(dictionary[word])dictionary[word].pos='动词';
for(const word of 'my your'.split(' '))if(dictionary[word])dictionary[word].pos='限定词';
for(const word of 'you it this that me'.split(' '))if(dictionary[word])dictionary[word].pos='代词';
for(const word of 'very well together slowly here ahead'.split(' '))if(dictionary[word])dictionary[word].pos='副词';
for(const word of 'on near after'.split(' '))if(dictionary[word])dictionary[word].pos='介词';
for(const word of 'can may would'.split(' '))if(dictionary[word])dictionary[word].pos='情态动词';
dictionary.hello.pos='感叹词';dictionary.yes.pos='应答词';dictionary.two.pos='数词';dictionary.seven.pos='数词';
