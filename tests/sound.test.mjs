import test from 'node:test';
import assert from 'node:assert/strict';
import {SOUND_PROFILES,SOUND_EVENTS,soundRecipe,safeSoundSettings} from '../sound-engine.js';

test('提供四种音效档位和九类语义反馈',()=>{
 assert.deepEqual(Object.keys(SOUND_PROFILES),['wood','mechanical','soft','off']);
 assert.deepEqual(SOUND_EVENTS,['key','space','delete','word','success','error','pick','unpick','clear']);
});

test('所有声音时长短、响度受限且没有尖锐高频',()=>{
 for(const profile of ['wood','mechanical','soft'])for(const event of SOUND_EVENTS){
  const recipe=soundRecipe(event,profile,'a');
  assert.ok(recipe.duration>0&&recipe.duration<=0.42,`${profile}/${event} duration`);
  assert.ok(recipe.tones.length>0,`${profile}/${event} tones`);
  assert.ok(recipe.tones.every(tone=>tone.frequency>=70&&tone.frequency<=1100),`${profile}/${event} frequency`);
  assert.ok(recipe.tones.every(tone=>tone.gain>0&&tone.gain<=0.22),`${profile}/${event} gain`);
 }
});

test('相同按键音高稳定，不再每次随机跳音',()=>{
 assert.deepEqual(soundRecipe('key','wood','a'),soundRecipe('key','wood','a'));
 assert.notDeepEqual(soundRecipe('key','wood','a').tones,soundRecipe('key','wood','z').tones);
});

test('关闭档不产生声音，错误设置回退到舒缓木质',()=>{
 assert.equal(soundRecipe('key','off','a').tones.length,0);
 assert.deepEqual(safeSoundSettings({soundProfile:'bad',soundVolume:999}),{soundProfile:'wood',soundVolume:90});
 assert.deepEqual(safeSoundSettings({soundProfile:'soft',soundVolume:20}),{soundProfile:'soft',soundVolume:20});
});

test('默认木质按键声具有接近语音播放的明显响度',()=>{
 const recipe=soundRecipe('key','wood','a');
 assert.ok(recipe.tones[0].gain>=0.14,'木质主音增益应足够明显');
 assert.equal(safeSoundSettings({}).soundVolume,90);
});
