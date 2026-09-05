import {textbookCourses} from './textbook-data.js';
import {dailyCourses} from './daily-data.js';
// 原有 48 句保留原 ID，新课程分别保留教材出处与逐句署名。
const content=[
 ['初次见面','从一句问候开始','hello · name · friend',[
  ['Hello, I am Mia.','你好，我是米娅。','I am + 名字，用来介绍自己。','hello /həˈləʊ/ 你好；I /aɪ/ 我'],
  ['What is your name?','你叫什么名字？','What is…? 用来询问“……是什么”。','what /wɒt/ 什么；name /neɪm/ 名字'],
  ['My name is Leo.','我的名字是利奥。','my 表示“我的”，your 表示“你的”。','my /maɪ/ 我的；is /ɪz/ 是'],
  ['It is nice to meet you.','很高兴认识你。','to meet you 表示“认识你”。','nice /naɪs/ 美好的；meet /miːt/ 见面'],
  ['How are you today?','你今天怎么样？','How are you? 是常见的问候方式。','how /haʊ/ 怎样；today /təˈdeɪ/ 今天'],
  ['I am very well.','我很好。','very 放在 well 前面，表示程度。','very /ˈveri/ 很；well /wel/ 好'],
  ['You are my friend.','你是我的朋友。','I 搭配 am；you 搭配 are。','you /juː/ 你；friend /frend/ 朋友'],
  ['See you on Monday.','星期一见。','on + 星期，表示在某一天。','see /siː/ 见到；Monday /ˈmʌndeɪ/ 星期一']
 ]],
 ['认识身边','用英语描述小世界','book · bag · blue',[
  ['This is a book.','这是一本书。','This is… 用来介绍近处的人或物。','this /ðɪs/ 这；book /bʊk/ 书'],
  ['That is my bag.','那是我的包。','that 指较远的物体；this 指较近的物体。','that /ðæt/ 那；bag /bæɡ/ 包'],
  ['The pen is blue.','这支笔是蓝色的。','颜色放在 is 后面，描述物体。','pen /pen/ 笔；blue /bluː/ 蓝色的'],
  ['I have two cups.','我有两个杯子。','两个及以上，名词通常加 s。','two /tuː/ 二；cup /kʌp/ 杯子'],
  ['The door is open.','门开着。','open 可以表示“开着的”状态。','door /dɔːr/ 门；open /ˈəʊpən/ 开着的'],
  ['My room is small.','我的房间很小。','my + 名词，表示所属关系。','room /ruːm/ 房间；small /smɔːl/ 小的'],
  ['Where is the key?','钥匙在哪里？','Where is…? 询问单个人或物的位置。','where /weər/ 哪里；key /kiː/ 钥匙'],
  ['It is on the desk.','它在书桌上。','on 表示在物体表面上。','on /ɒn/ 在……上；desk /desk/ 书桌']
 ]],
 ['吃喝日常','表达喜欢与需要','water · rice · like',[
  ['I would like some water.','我想要一些水。','would like 是礼貌表达“想要”的方式。','water /ˈwɔːtər/ 水；some /sʌm/ 一些'],
  ['I like fresh apples.','我喜欢新鲜的苹果。','like + 事物，表达喜好。','fresh /freʃ/ 新鲜的；apple /ˈæpəl/ 苹果'],
  ['This soup is hot.','这碗汤很烫。','hot 可描述温度高。','soup /suːp/ 汤；hot /hɒt/ 热的'],
  ['Do you like rice?','你喜欢米饭吗？','Do you like…? 询问对方是否喜欢。','rice /raɪs/ 米饭；like /laɪk/ 喜欢'],
  ['Yes, I like it.','是的，我喜欢。','it 可以代替前面提到的事物。','yes /jes/ 是的；it /ɪt/ 它'],
  ['I need a spoon.','我需要一把勺子。','need + 名词，表示需要某物。','need /niːd/ 需要；spoon /spuːn/ 勺子'],
  ['The bread is soft.','面包很软。','bread 通常作为不可数名词使用。','bread /bred/ 面包；soft /sɒft/ 软的'],
  ['Let us eat together.','我们一起吃吧。','Let us… 可以提出一起做某事的建议。','eat /iːt/ 吃；together /təˈɡeðər/ 一起']
 ]],
 ['我的一天','说说每天的小事','get up · work · sleep',[
  ['I get up at seven.','我七点起床。','at + 具体时间。','get up 起床；seven /ˈsevən/ 七'],
  ['I wash my face.','我洗脸。','用一般现在时描述日常习惯。','wash /wɒʃ/ 洗；face /feɪs/ 脸'],
  ['I walk to school.','我步行去学校。','walk to + 地点，表示走路去。','walk /wɔːk/ 步行；school /skuːl/ 学校'],
  ['I work at home.','我在家工作。','at home 是“在家”的常见搭配。','work /wɜːrk/ 工作；home /həʊm/ 家'],
  ['We eat lunch at noon.','我们中午吃午饭。','we 表示“我们”。','lunch /lʌntʃ/ 午饭；noon /nuːn/ 中午'],
  ['I read after dinner.','晚饭后我读书。','after 表示“在……之后”。','read /riːd/ 读；after /ˈɑːftər/ 之后'],
  ['It is time for bed.','该睡觉了。','It is time for… 表示到了做某事的时间。','time /taɪm/ 时间；bed /bed/ 床'],
  ['Have a good night.','祝你度过一个美好的夜晚。','Have a good… 可以表达祝愿。','good /ɡʊd/ 好的；night /naɪt/ 夜晚']
 ]],
 ['出门走走','问路与简单购物','left · bus · much',[
  ['The park is near here.','公园离这里很近。','near 表示距离近。','park /pɑːrk/ 公园；near /nɪər/ 附近'],
  ['Please turn left.','请向左转。','Please + 动词，让请求更礼貌。','turn /tɜːrn/ 转向；left /left/ 左边'],
  ['Go straight ahead.','一直向前走。','Go + 方向，用来指路。','straight /streɪt/ 笔直地；ahead /əˈhed/ 向前'],
  ['I take the bus.','我乘公共汽车。','take the bus 是乘公共汽车的常见表达。','take /teɪk/ 乘坐；bus /bʌs/ 公共汽车'],
  ['How much is this hat?','这顶帽子多少钱？','How much is…? 用来询问价格。','much /mʌtʃ/ 多少；hat /hæt/ 帽子'],
  ['I want the green one.','我想要绿色的那个。','one 可以代替前文提到的单个物品。','want /wɒnt/ 想要；green /ɡriːn/ 绿色的'],
  ['May I try it on?','我可以试穿一下吗？','try…on 表示试穿衣物。','may /meɪ/ 可以；try /traɪ/ 尝试'],
  ['Thank you for your help.','谢谢你的帮助。','Thank you for + 名词，说明感谢的原因。','thank /θæŋk/ 感谢；help /help/ 帮助']
 ]],
 ['表达自己','感受、能力与愿望','happy · can · learn',[
  ['I feel happy today.','我今天感到开心。','feel + 形容词，表达感受。','feel /fiːl/ 感到；happy /ˈhæpi/ 开心的'],
  ['I am a little tired.','我有一点累。','a little 表示“一点”。','little /ˈlɪtəl/ 少量的；tired /ˈtaɪərd/ 累的'],
  ['Can you help me?','你能帮帮我吗？','Can you…? 用来请求帮助。','can /kæn/ 能；me /miː/ 我（宾格）'],
  ['I can swim.','我会游泳。','can 后接动词原形，表达能力。','swim /swɪm/ 游泳'],
  ['Please speak slowly.','请说慢一点。','slowly 修饰 speak，说明说话的方式。','speak /spiːk/ 说话；slowly /ˈsləʊli/ 慢慢地'],
  ['I do not understand.','我不明白。','do not + 动词原形，构成否定。','understand /ˌʌndərˈstænd/ 明白'],
  ['I want to learn English.','我想学习英语。','want to + 动词，表达想做的事情。','learn /lɜːrn/ 学习；English /ˈɪŋɡlɪʃ/ 英语'],
  ['I practice every day.','我每天练习。','every day 表示每天。','practice /ˈpræktɪs/ 练习；every /ˈevri/ 每个']
 ]]
];
export const legacyCourses=content.map(([title,subtitle,keywords,rows],i)=>({id:'unit'+(i+1),title,subtitle,keywords,series:'零基础热身',category:['问候与社交','居家与健康','餐饮与购物','兴趣与生活','出行与住宿','学习与工作'][i],level:'入门',source:{title:'初言原创入门练习',license:'原创内容，可在本地使用与修改'},items:rows.map(([en,zh,note,words],j)=>({id:`u${i+1}s${j+1}`,en,zh,note,words}))}));
const seenEnglish=new Set();
export const courses=[...legacyCourses,...textbookCourses,...dailyCourses].map(c=>({...c,items:c.items.filter(s=>{const key=String(s.en).toLowerCase().replace(/[‘’]/g,"'").replace(/[.,!?;:，。！？；：]/g,'').replace(/\s+/g,' ').trim();if(seenEnglish.has(key))return false;seenEnglish.add(key);return true;})})).filter(c=>c.items.length);
export const sentences=courses.flatMap(c=>c.items.map(s=>({...s,course:c.id})));
