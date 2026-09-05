import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {modelStatus,getTTS,getASR,synthesize,transcribe,voices} from './speech-models.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));const port=Number(process.env.PORT||4173);
const files=new Set(['index.html','style.css','app.js','data.js','engine.js','analysis-data.js','speech-score.js','preferences.js','catalog.js','daily-data.js','textbook-data.js','grammar-data.js','grammar-engine.js','grammar-view.js','grammar-links.js','sound-engine.js']);
const origins=new Set([`http://localhost:${port}`,`http://127.0.0.1:${port}`]);
const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
async function body(req,max=2048){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>max)throw Error('请求内容过大');chunks.push(chunk);}return Buffer.concat(chunks);}
const server=http.createServer(async(req,res)=>{try{
 if(![`localhost:${port}`,`127.0.0.1:${port}`].includes(req.headers.host)){json(res,403,{error:'仅允许本机访问'});return;}
 if(req.headers.origin&&!origins.has(req.headers.origin)){json(res,403,{error:'来源不允许'});return;}
 const name=new URL(req.url,`http://localhost:${port}`).pathname;
 if(name==='/api/health'&&req.method==='GET'){json(res,200,{app:'first-steps-english',version:'4.0.1',instance:process.env.FIRST_STEPS_INSTANCE||'project',offline:process.env.FIRST_STEPS_OFFLINE==='1',models:modelStatus(),learning:{units:17,lessons:90,exercises:540}});return;}
 if(name==='/api/status'&&req.method==='GET'){json(res,200,modelStatus());return;}
 if(name==='/api/tts'&&req.method==='POST'){
  if(!req.headers['content-type']?.startsWith('application/json')){json(res,415,{error:'需要 JSON'});return;}
  const x=JSON.parse((await body(req)).toString());
  if(typeof x.text!=='string'||!x.text.trim()||x.text.length>300||!Object.hasOwn(voices,x.voice)||!Number.isFinite(x.speed)||x.speed<0.5||x.speed>1.5){json(res,400,{error:'朗读参数无效'});return;}
  const wav=await synthesize(x.text,x.voice,x.speed);res.writeHead(200,{'Content-Type':'audio/wav','Cache-Control':'no-store'});res.end(Buffer.from(wav));return;
 }
 if(name==='/api/asr'&&req.method==='POST'){
  if(req.headers['content-type']!=='application/octet-stream'){json(res,415,{error:'需要 16kHz Float32 单声道音频'});return;}
  const b=await body(req,16000*4*61);if(b.length%4||b.length<64000){json(res,400,{error:'请录制至少一秒的语音'});return;}
  const samples=new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));
  if(samples.some(n=>!Number.isFinite(n)||Math.abs(n)>1.01)){json(res,400,{error:'音频格式无效'});return;}
  let energy=0;for(const n of samples)energy+=n*n;
  if(Math.sqrt(energy/samples.length)<0.003){json(res,200,{text:'',chunks:[],silence:true});return;}
  json(res,200,await transcribe(samples));return;
 }
 if(req.method!=='GET'||!files.has(name.slice(1)||'index.html')){json(res,404,{error:'未找到'});return;}
 const file=name.slice(1)||'index.html',data=await readFile(path.join(root,file));
 res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Permissions-Policy':'microphone=(self)'});res.end(data);
}catch(e){console.error(e.message);json(res,500,{error:'语音服务暂不可用，请检查模型是否已下载或稍后重试。'});}});
server.listen(port,'127.0.0.1',()=>{console.log(`初言新版：http://localhost:${port}`);getTTS().then(()=>getASR()).then(()=>console.log('本地朗读与识别模型全部就绪')).catch(e=>console.error('模型加载失败：',e.message));});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?`端口 ${port} 已占用，请关闭旧服务再启动。`:e.message);process.exitCode=1;});
