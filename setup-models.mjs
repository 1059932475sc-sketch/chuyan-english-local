import {getTTS,getASR,synthesize,modelStatus,voices} from './speech-models.mjs';
console.log('正在准备 Kokoro 和 Whisper 模型，首次运行需要下载。');
await getTTS();console.log('Kokoro 模型已就绪');
for(const voice of Object.keys(voices)){await synthesize('Hello. Let us learn English.',voice);console.log(voices[voice]+' 已就绪');}
await getASR();console.log('Whisper 模型已就绪');console.log(modelStatus());
