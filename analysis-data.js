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
const nouns='hello name friend monday book bag pen cup door room key desk water apple soup rice spoon bread face school home lunch noon time bed night park bus hat help english';
const adjectives='nice blue small fresh hot soft good green happy tired open';
for(const [w,v] of Object.entries(dictionary))v.pos ||= nouns.split(' ').includes(w)?'名词 / 常用词':adjectives.split(' ').includes(w)?'形容词':'常用词';
export function wordInfo(word){return dictionary[clean(word)]||{ipa:'',meaning:'结合句意理解',pos:'词语'};}

for(const word of 'see meet have need eat wash walk work read turn take want try thank help feel swim speak understand learn practice get go let'.split(' '))if(dictionary[word])dictionary[word].pos='动词';
for(const word of 'my your'.split(' '))if(dictionary[word])dictionary[word].pos='限定词';
for(const word of 'you it this that me'.split(' '))if(dictionary[word])dictionary[word].pos='代词';
for(const word of 'very well together slowly here ahead'.split(' '))if(dictionary[word])dictionary[word].pos='副词';
for(const word of 'on near after'.split(' '))if(dictionary[word])dictionary[word].pos='介词';
for(const word of 'can may would'.split(' '))if(dictionary[word])dictionary[word].pos='情态动词';
dictionary.hello.pos='感叹词';dictionary.yes.pos='应答词';dictionary.two.pos='数词';dictionary.seven.pos='数词';
