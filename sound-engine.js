export const SOUND_PROFILES={
 wood:{label:'舒缓木质',base:148,wave:'sine',gain:.165,filter:1250,noise:.025},
 mechanical:{label:'清脆机械',base:218,wave:'triangle',gain:.15,filter:2100,noise:.032},
 soft:{label:'安静轻触',base:124,wave:'sine',gain:.095,filter:900,noise:.012},
 off:{label:'关闭',base:0,wave:'sine',gain:0,filter:0,noise:0}
};
export const SOUND_EVENTS=['key','space','delete','word','success','error','pick','unpick','clear'];
const patterns={
 key:{duration:.072,notes:[[0,1,0]]},space:{duration:.09,notes:[[-5,.9,0]]},delete:{duration:.06,notes:[[-8,.8,0]]},
 word:{duration:.18,notes:[[0,.8,0],[4,.72,.075]]},success:{duration:.38,notes:[[0,.9,0],[4,.82,.09],[7,.76,.18]]},
 error:{duration:.25,notes:[[-3,.84,0],[-8,.72,.115]]},pick:{duration:.11,notes:[[2,.75,0]]},unpick:{duration:.11,notes:[[-3,.7,0]]},clear:{duration:.21,notes:[[0,.65,0],[-5,.58,.085]]}
};
const keyShift=key=>{const value=String(key||'a').toLowerCase().codePointAt(0)||97;return (value%7)-3;};
const pitch=(frequency,semitones)=>Math.round(frequency*2**(semitones/12)*100)/100;

export function safeSoundSettings(raw={}){
 const soundProfile=Object.hasOwn(SOUND_PROFILES,raw.soundProfile)?raw.soundProfile:'wood';
 const soundVolume=Number.isInteger(raw.soundVolume)&&raw.soundVolume>=0&&raw.soundVolume<=100?raw.soundVolume:90;
 return {soundProfile,soundVolume};
}

export function soundRecipe(event='key',profile='wood',key='a'){
 const style=SOUND_PROFILES[profile]||SOUND_PROFILES.wood;
 if(profile==='off'||style.gain===0)return {event,profile:'off',duration:0,filter:0,noiseGain:0,tones:[]};
 const shape=patterns[event]||patterns.key,variation=event==='key'?keyShift(key):0;
 const tones=shape.notes.flatMap(([semitones,level,start])=>[
  {frequency:pitch(style.base,semitones+variation),gain:Number((style.gain*level).toFixed(4)),start,wave:style.wave},
  {frequency:pitch(style.base*2.05,semitones+variation),gain:Number((style.gain*level*.24).toFixed(4)),start,wave:'sine'}
 ]);
 return {event,profile:Object.hasOwn(SOUND_PROFILES,profile)?profile:'wood',duration:shape.duration,filter:style.filter,noiseGain:style.noise,tones};
}

export function createSoundEngine({getProfile=()=> 'wood',getVolume=()=>90}={}){
 let context=null,noiseBuffer=null;
 const ensure=()=>{if(context)return context;const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return null;context=new Audio();return context;};
 function noise(ctx){
  if(noiseBuffer&&noiseBuffer.sampleRate===ctx.sampleRate)return noiseBuffer;
  noiseBuffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.045),ctx.sampleRate);const channel=noiseBuffer.getChannelData(0);
  let seed=731;for(let i=0;i<channel.length;i++){seed=(seed*16807)%2147483647;channel[i]=(seed/2147483647*2-1)*(1-i/channel.length);}
  return noiseBuffer;
 }
 function play(event='key',key='a'){
  const recipe=soundRecipe(event,getProfile(),key),ctx=ensure(),volume=Math.max(0,Math.min(1,Number(getVolume())/100));
  if(!ctx||!recipe.tones.length||volume===0)return recipe;
  ctx.resume?.();const now=ctx.currentTime,filter=ctx.createBiquadFilter(),compressor=ctx.createDynamicsCompressor(),master=ctx.createGain();filter.type='lowpass';filter.frequency.value=recipe.filter;compressor.threshold.value=-16;compressor.knee.value=8;compressor.ratio.value=5;compressor.attack.value=.003;compressor.release.value=.09;master.gain.value=volume;filter.connect(compressor);compressor.connect(master);master.connect(ctx.destination);
  for(const tone of recipe.tones){const osc=ctx.createOscillator(),gain=ctx.createGain(),start=now+tone.start,end=now+recipe.duration;osc.type=tone.wave;osc.frequency.value=tone.frequency;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,tone.gain),start+.006);gain.gain.exponentialRampToValueAtTime(.0001,end);osc.connect(gain);gain.connect(filter);osc.start(start);osc.stop(end+.01);}
  if(recipe.noiseGain){const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=noise(ctx);gain.gain.setValueAtTime(recipe.noiseGain,now);gain.gain.exponentialRampToValueAtTime(.0001,now+.038);source.connect(gain);gain.connect(filter);source.start(now);}
  return recipe;
 }
 return {play,resume:()=>ensure()?.resume?.(),recipe:(event,key)=>soundRecipe(event,getProfile(),key)};
}
