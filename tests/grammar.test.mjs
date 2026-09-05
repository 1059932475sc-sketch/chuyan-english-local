import test from 'node:test';
import assert from 'node:assert/strict';
import {learningUnits,learningLessons,learningExercises} from '../grammar-data.js';
import {validateLearningPath,gradeExercise,unitProgress,nextLessonId} from '../grammar-engine.js';

test('学习路径包含17单元、90微课和至少540道练习',()=>{
  assert.equal(learningUnits.length,17);
  assert.equal(learningLessons.length,90);
  assert.ok(learningExercises.length>=540);
  assert.deepEqual(validateLearningPath(),{valid:true,errors:[]});
});

test('自然拼读从零起步并含10个微课',()=>{
  const phonics=learningUnits.find(unit=>unit.kind==='phonics');
  assert.ok(phonics);
  const lessons=learningLessons.filter(lesson=>lesson.unitId===phonics.id);
  assert.equal(lessons.length,10);
  assert.equal(lessons[0].level,'启蒙');
  assert.ok(lessons.some(lesson=>lesson.focus.includes('CVC')));
  assert.ok(lessons.some(lesson=>lesson.focus.includes('音节')));
  for(const lesson of lessons){const scene=learningExercises.find(item=>item.lessonId===lesson.id&&item.mode==='scene');assert.equal(new Set(scene.options).size,3,lesson.id);assert.equal(scene.options.filter(option=>option===scene.answer).length,1,lesson.id);}
  assert.equal(lessons.at(-1).formula.includes('ba-NA-na'),true);
});

test('每个微课都有六类练法和完整答案',()=>{
  const modes=['scene','build','transform','fix','translate','speak'];
  for(const lesson of learningLessons){
    const exercises=learningExercises.filter(item=>item.lessonId===lesson.id);
    assert.deepEqual(exercises.map(item=>item.mode),modes,lesson.id);
    for(const item of exercises){
      assert.ok(item.prompt?.trim(),item.id);
      assert.ok(item.answer?.trim(),item.id);
    }
  }
});

test('课程和练习ID唯一且顺序完整',()=>{
  for(const list of [learningUnits,learningLessons,learningExercises]){
    assert.equal(new Set(list.map(item=>item.id)).size,list.length);
  }
  learningUnits.forEach((unit,index)=>assert.equal(unit.order,index+1));
  learningLessons.forEach(lesson=>assert.ok(learningUnits.some(unit=>unit.id===lesson.unitId)));
});

test('判题忽略大小写与句末标点，但不接受错词',()=>{
  assert.equal(gradeExercise('I AM READY!','I am ready.'),true);
  assert.equal(gradeExercise('I is ready.','I am ready.'),false);
});

test('进度和续学位置可从安全状态计算',()=>{
  const first=learningUnits[0];
  const ids=learningLessons.filter(item=>item.unitId===first.id).map(item=>item.id);
  assert.deepEqual(unitProgress(first.id,{[ids[0]]:{completed:true}}),{completed:1,total:10,percent:10});
  assert.equal(nextLessonId({[ids[0]]:{completed:true}}),ids[1]);
  assert.equal(nextLessonId(null),learningLessons[0].id);
});
