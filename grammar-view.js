import {learningUnits,learningLessons} from './grammar-data.js';
import {unitProgress,nextLessonId} from './grammar-engine.js';

const labels={scene:'场景开门',build:'搭骨架',transform:'变形术',fix:'抓虫找茬',translate:'中文秒转',speak:'张嘴就说'};
export const lessonStageLabel=mode=>labels[mode]||mode;
export function learningPathModel(progress={}){
 const completedLessons=learningLessons.filter(lesson=>progress?.[lesson.id]?.completed===true).length;
 return {totalLessons:learningLessons.length,completedLessons,percent:Math.round(completedLessons/learningLessons.length*100),nextLessonId:nextLessonId(progress),units:learningUnits.map(unit=>({...unit,...unitProgress(unit.id,progress),lessons:learningLessons.filter(lesson=>lesson.unitId===unit.id)}))};
}
