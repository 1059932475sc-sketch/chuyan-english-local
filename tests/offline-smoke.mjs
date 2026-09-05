// A real model check. Run separately because CPU inference takes several seconds.
import assert from 'node:assert/strict';
process.env.FIRST_STEPS_OFFLINE='1';
globalThis.fetch=()=>{throw new Error('Offline test attempted a network request');};
const {synthesize,transcribe,modelStatus}=await import('../speech-models.mjs');
const sentence='I want to learn English.';
const wav=Buffer.from(await synthesize(sentence,'am_michael',1));
assert.equal(wav.toString('ascii',0,4),'RIFF');
let format,channels,rate,bits,audio;
for(let offset=12;offset+8<=wav.length;){
 const id=wav.toString('ascii',offset,offset+4),size=wav.readUInt32LE(offset+4),start=offset+8;
 if(id==='fmt '){format=wav.readUInt16LE(start);channels=wav.readUInt16LE(start+2);rate=wav.readUInt32LE(start+4);bits=wav.readUInt16LE(start+14);}
 if(id==='data')audio=wav.subarray(start,start+size);
 offset=start+size+(size%2);
}
assert.equal(channels,1);assert.ok(audio);assert.ok(rate>=16000);
const width=bits/8,raw=new Float32Array(audio.length/width);
for(let i=0;i<raw.length;i++){
 if(format===3&&bits===32)raw[i]=audio.readFloatLE(i*width);
 else if(format===1&&bits===16)raw[i]=audio.readInt16LE(i*width)/32768;
 else throw Error(`Unsupported WAV format ${format}/${bits}`);
}
const samples=new Float32Array(Math.floor(raw.length*16000/rate));
for(let i=0;i<samples.length;i++){
 const position=i*rate/16000,lo=Math.floor(position),fraction=position-lo;
 samples[i]=raw[lo]*(1-fraction)+raw[Math.min(lo+1,raw.length-1)]*fraction;
}
const result=await transcribe(samples);
assert.equal(result.text.toLowerCase().replace(/[^a-z ]/g,'').trim(),sentence.toLowerCase().replace(/[^a-z ]/g,''));
assert.ok(result.chunks.length>=5);
assert.equal(modelStatus().tts,'就绪');assert.equal(modelStatus().asr,'就绪');
console.log(JSON.stringify({offline:true,wavBytes:wav.length,recognized:result.text,wordChunks:result.chunks.length}));
