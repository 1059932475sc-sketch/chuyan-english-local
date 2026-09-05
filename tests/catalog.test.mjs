import test from 'node:test';
import assert from 'node:assert/strict';
import {filterCourses,searchSentences,courseSummary} from '../catalog.js';
const courses=[
 {id:'a',title:'咖啡店点单',keywords:'coffee cafe',category:'餐饮与购物',series:'日常口语精选',level:'入门',items:[{id:'a1',en:'A coffee, please.',zh:'请给我一杯咖啡。'},{id:'a2',en:'Can I pay by card?',zh:'可以刷卡吗？'}]},
 {id:'b',title:'机场出行',category:'出行与住宿',series:'情景对话教材',level:'基础',items:[{id:'b1',en:'Where is the gate?',zh:'登机口在哪里？'}]}
];
test('课程搜索同时匹配英文、中文和句子，筛选条件取交集',()=>{
 assert.deepEqual(filterCourses(courses,{query:'  PAY BY CARD  '}).map(c=>c.id),['a']);
 assert.deepEqual(filterCourses(courses,{query:'登机口',category:'出行与住宿'}).map(c=>c.id),['b']);
 assert.equal(filterCourses(courses,{query:'咖啡',level:'基础'}).length,0);
});
test('句子搜索保留课程和原始句序，可准确跳转口语练习',()=>{
 const found=searchSentences(courses,{query:'刷卡'});
 assert.equal(found.length,1);assert.equal(found[0].index,1);assert.equal(found[0].course.id,'a');
 assert.equal(searchSentences(courses,{query:''}).length,0);
});
test('课程与句数由数据统计，不假定每课固定八句',()=>{
 assert.deepEqual(courseSummary(courses),{courses:2,sentences:3});
});
