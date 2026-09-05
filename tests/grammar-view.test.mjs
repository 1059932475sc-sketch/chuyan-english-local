import test from 'node:test';
import assert from 'node:assert/strict';
import {learningLessons} from '../grammar-data.js';
import {learningPathModel,lessonStageLabel} from '../grammar-view.js';

test('学习路径模型汇总总进度并找到续学课程',()=>{
 const first=learningLessons[0].id,second=learningLessons[1].id;
 const model=learningPathModel({[first]:{completed:true,score:6}});
 assert.equal(model.totalLessons,90);
 assert.equal(model.completedLessons,1);
 assert.equal(model.nextLessonId,second);
 assert.equal(model.units[0].completed,1);
});

test('六个阶段都使用中国学习者易懂的名称',()=>{
 assert.deepEqual(['scene','build','transform','fix','translate','speak'].map(lessonStageLabel),['场景开门','搭骨架','变形术','抓虫找茬','中文秒转','张嘴就说']);
});
