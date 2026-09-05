import test from 'node:test';
import assert from 'node:assert/strict';
import {courses,sentences} from '../data.js';
import {grammarTagsForSentence} from '../grammar-links.js';
import {normalize} from '../engine.js';
const newCourses=courses.filter(c=>c.series!=='零基础热身');
test('扩充课程达到可长期练习的规模并覆盖六类生活场景',()=>{
 assert.ok(newCourses.length>=35,`只有 ${newCourses.length} 个新课程`);assert.ok(sentences.length>=700,`只有 ${sentences.length} 个句子`);
 const categories=new Set(newCourses.map(c=>c.category));for(const name of ['问候与社交','餐饮与购物','出行与住宿','居家与健康','学习与工作','兴趣与生活'])assert.ok(categories.has(name),name);
});
test('每个现有口语句子都关联至少一个语法微课',()=>{for(const sentence of sentences){const tags=grammarTagsForSentence(sentence);assert.ok(tags.length>0,sentence.id);assert.ok(tags.every(tag=>/^(?:g\d{2}|phonics)-\d{2}$/.test(tag)),sentence.id);}});
test('所有课程字段、句子中英文和 ID 完整且唯一',()=>{
 const ids=new Set(),english=new Set();
 for(const c of courses){assert.match(c.id,/^[a-z0-9-]+$/);assert.ok(c.title&&c.subtitle&&c.level&&c.category&&c.series);assert.ok(c.source?.title&&c.source?.license);assert.ok(c.items.length);
  for(const s of c.items){assert.match(s.id,/^[a-z0-9-]+$/);assert.ok(!ids.has(s.id),s.id);ids.add(s.id);assert.ok(s.en&&s.zh);assert.ok(s.en.length<=300,s.id);assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffd]/.test(s.en+s.zh),s.id);assert.ok(!/\s{2,}/.test(s.en),s.id);const e=normalize(s.en);assert.ok(!english.has(e),`重复英文：${s.en}`);english.add(e);}
 }
});
test('Tatoeba 精选句保留逐句署名和两个原始句号',()=>{
 const items=newCourses.filter(c=>c.series==='日常口语精选').flatMap(c=>c.items);assert.ok(items.length>=400);
 for(const s of items){assert.match(s.attribution,/CC-BY 2\.0 \(France\) Attribution: tatoeba\.org #\d+ .* #\d+/);assert.match(s.sourceUrl,/^https:\/\/tatoeba\.org\/en\/sentences\/show\/\d+$/);assert.match(s.translationUrl,/^https:\/\/tatoeba\.org\/en\/sentences\/show\/\d+$/);assert.equal(s.translationEdited,true);assert.ok((s.en.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[]).length<=11,s.id);}
 assert.ok(!items.some(s=>/every six hours|no side effects|每六(个)?小时|没有副作用/i.test(s.en+s.zh)));
});
test('官方教材对话有 30 课、人物顺序和公共领域说明',()=>{
 const official=newCourses.filter(c=>c.series==='情景对话教材');assert.equal(official.length,30);assert.ok(official.reduce((n,c)=>n+c.items.length,0)>=150);
 for(const c of official){assert.equal(c.source.license,'Public domain');for(const s of c.items)assert.ok(s.speaker);}
});
