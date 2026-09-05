import {env,pipeline} from '@huggingface/transformers';
import {KokoroTTS} from 'kokoro-js';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
env.cacheDir=path.join(path.dirname(fileURLToPath(import.meta.url)),'models');
// Installed editions read only their bundled models and never download at runtime.
if(process.env.FIRST_STEPS_OFFLINE==='1'){
 env.localModelPath=env.cacheDir+path.sep;
 env.allowLocalModels=true;
 env.allowRemoteModels=false;
 env.useFSCache=false;
}
env.backends.onnx.wasm.numThreads=2;
const status={tts:'未加载',asr:'未加载'};
let ttsPromise,asrPromise;
export const voices={am_michael:'美式男声',af_heart:'美式女声',bf_emma:'英式女声',bm_george:'英式男声'};
export function modelStatus(){return {...status,voices};}
export function getTTS(){return ttsPromise??=(async()=>{status.tts='加载中';try{const m=await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX',{dtype:'q8',device:'cpu'});status.tts='就绪';return m;}catch(e){ttsPromise=null;status.tts='加载失败';throw e;}})();}
export function getASR(){return asrPromise??=(async()=>{status.asr='加载中';try{const m=await pipeline('automatic-speech-recognition','Xenova/whisper-tiny.en',{dtype:'q8',device:'cpu'});status.asr='就绪';return m;}catch(e){asrPromise=null;status.asr='加载失败';throw e;}})();}
// Serialize inference to avoid competing native sessions on modest machines.
let queue=Promise.resolve();
function serial(fn){const run=queue.then(fn,fn);queue=run.catch(()=>{});return run;}
export function synthesize(text,voice='am_michael',speed=1){return serial(async()=>{const tts=await getTTS();return (await tts.generate(text,{voice,speed})).toWav();});}
export function transcribe(samples){return serial(async()=>{const asr=await getASR();return asr(samples,{return_timestamps:'word',chunk_length_s:25,stride_length_s:3});});}
