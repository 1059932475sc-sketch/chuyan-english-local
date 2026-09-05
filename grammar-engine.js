import {learningUnits,learningLessons,learningExercises} from './grammar-data.js';

export function normalizedAnswer(value){return String(value??'').toLowerCase().replace(/[‘’]/g,"'").replace(/[.,!?;:，。！？；：]/g,'').replace(/\s+/g,' ').trim();}
export function gradeExercise(value,answer){return normalizedAnswer(value)===normalizedAnswer(answer);}
export function unitProgress(unitId,progress={}){
 const lessons=learningLessons.filter(lesson=>lesson.unitId===unitId);
 const completed=lessons.filter(lesson=>progress?.[lesson.id]?.completed===true).length;
 return {completed,total:lessons.length,percent:lessons.length?Math.round(completed/lessons.length*100):0};
}
export function nextLessonId(progress={}){return learningLessons.find(lesson=>progress?.[lesson.id]?.completed!==true)?.id||learningLessons.at(-1)?.id||null;}
export function lessonExercises(lessonId){return learningExercises.filter(exercise=>exercise.lessonId===lessonId).sort((a,b)=>a.order-b.order);}
export function validateLearningPath(){
 const errors=[];
 if(learningUnits.length!==17)errors.push('单元数必须为17');
 if(learningLessons.length!==90)errors.push('微课数必须为90');
 if(learningExercises.length<540)errors.push('练习数不得少于540');
 for(const [name,list] of [['单元',learningUnits],['微课',learningLessons],['练习',learningExercises]])if(new Set(list.map(item=>item.id)).size!==list.length)errors.push(`${name}ID重复`);
 const modes=['scene','build','transform','fix','translate','speak'];
 for(const lesson of learningLessons){
  const exercises=lessonExercises(lesson.id);
  if(exercises.length!==6||exercises.some((exercise,index)=>exercise.mode!==modes[index]||!exercise.prompt||!exercise.answer))errors.push(`${lesson.id}练习不完整`);
 }
 return {valid:errors.length===0,errors};
}
