export const AUDIO_SAMPLE_RATE=16000;
export const MIN_RECORDING_SECONDS=0.35;
export const MIN_ASR_SAMPLES=Math.ceil(AUDIO_SAMPLE_RATE*MIN_RECORDING_SECONDS);

export function isRecordingLongEnough(sampleCount){
 return Number.isInteger(sampleCount)&&sampleCount>=MIN_ASR_SAMPLES;
}
