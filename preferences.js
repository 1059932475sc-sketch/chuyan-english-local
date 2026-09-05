export function validSession(x,ids,modes){return !!(x&&Array.isArray(x.ids)&&x.ids.length&&x.ids.length<=ids.length&&x.ids.every(id=>ids.includes(id))&&new Set(x.ids).size===x.ids.length&&Number.isInteger(x.index)&&x.index>=0&&x.index<x.ids.length&&modes.includes(x.mode)&&Number.isFinite(x.elapsed)&&x.elapsed>=0);}
export function safeSettings(raw,defaults){
 const out=structuredClone(defaults);if(!raw||typeof raw!=='object')return out;
 const enums={theme:['dark','light'],voice:['am_michael','af_heart','bf_emma','bm_george'],font:['sans','round','serif','mono'],inputStyle:['line','box'],soundProfile:['wood','mechanical','soft','off'],rate:[.6,.8,1,1.2],loops:[0,1,2,3],successLoops:[0,1,2,3],revealAt:[0,1,2,3]};
 for(const [k,values] of Object.entries(enums))if(values.includes(raw[k]))out[k]=raw[k];
 for(const [k,v] of Object.entries(defaults))if(typeof v==='boolean'&&typeof raw[k]==='boolean')out[k]=raw[k];
 if(Number.isInteger(raw.size)&&raw.size>=24&&raw.size<=56)out.size=raw.size;
 if(Number.isInteger(raw.soundVolume)&&raw.soundVolume>=0&&raw.soundVolume<=100)out.soundVolume=raw.soundVolume;
 if(raw.sound===false&&!Object.hasOwn(raw,'soundProfile')&&Object.hasOwn(out,'soundProfile'))out.soundProfile='off';
 if(raw.keys&&typeof raw.keys==='object'){const seen=new Set();for(const key of Object.keys(out.keys)){const value=raw.keys[key];if(typeof value==='string'&&/^(?:[a-z0-9]|ArrowRight|ArrowLeft|ArrowUp|ArrowDown)$/.test(value)&&!seen.has(value)){out.keys[key]=value;seen.add(value);}else seen.add(out.keys[key]);}}
 return out;
}
