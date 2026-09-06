export const AUDIO_SAMPLE_RATE=16000;
export const MIN_RECORDING_SECONDS=0.35;
export const MIN_ASR_SAMPLES=Math.ceil(AUDIO_SAMPLE_RATE*MIN_RECORDING_SECONDS);

export function isRecordingLongEnough(sampleCount){
 return Number.isInteger(sampleCount)&&sampleCount>=MIN_ASR_SAMPLES;
}

export function sanitizeAudioSamples(samples){
 let peak=0;
 for(const sample of samples){
  if(!Number.isFinite(sample)||Math.abs(sample)>4)return null;
  peak=Math.max(peak,Math.abs(sample));
 }
 if(peak<=1)return samples;
 const normalized=new Float32Array(samples.length),scale=0.99/peak;
 for(let i=0;i<samples.length;i++)normalized[i]=samples[i]*scale;
 return normalized;
}
