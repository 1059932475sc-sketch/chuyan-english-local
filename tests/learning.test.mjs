import test from 'node:test';
import assert from 'node:assert/strict';
import {normalize, assess, schedule, restore} from '../engine.js';
test('大小写、标点与多余空格不影响听写判定',()=>assert.equal(assess('  I AM happy! ', 'I am happy.'),true));
test('错误单词和漏词不能通过',()=>{assert.equal(assess('I happy','I am happy.'),false);assert.equal(assess('I am hungry','I am happy.'),false);});
test('保留缩写语义，统一弯引号',()=>{assert.equal(normalize('I’m here.'),"i'm here");assert.equal(assess('Im here',"I'm here."),false);});
test('答错立即进入复习，连续答对延长间隔',()=>{const a=schedule(null,false,1000);assert.equal(a.due,1000);assert.equal(a.streak,0);const b=schedule(a,true,1000);assert.equal(b.due,86401000);const c=schedule(b,true,1000);assert.equal(c.due,259201000);});
test('损坏存档回退，合法存档恢复',()=>{assert.equal(restore('{oops').version,1);assert.deepEqual(restore(JSON.stringify({version:1,records:{a:{streak:1,due:1000,attempts:1,correct:1}},favorites:['a']})).favorites,['a']);assert.equal(restore('{"version":99}').version,1);});
test('旧存档自动补齐语法进度，新语法记录安全恢复',()=>{const old=restore(JSON.stringify({version:1,records:{},favorites:[]}));assert.deepEqual(old.grammarProgress,{});assert.deepEqual(old.grammarMistakes,{});const restored=restore(JSON.stringify({version:1,grammarProgress:{'g01-01':{completed:true,score:6,attempts:7}},grammarMistakes:{'g01-01-x4':{lessonId:'g01-01',attempts:2,last:123}}}));assert.deepEqual(restored.grammarProgress['g01-01'],{completed:true,score:6,attempts:7});assert.deepEqual(restored.grammarMistakes['g01-01-x4'],{lessonId:'g01-01',attempts:2,last:123});});
