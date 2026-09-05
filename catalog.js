const clean=value=>String(value??'').toLowerCase().replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();
const rank={'日常口语精选':0,'情景对话教材':1,'零基础热身':2};
export function filterCourses(courses,filters={}){
 const query=clean(filters.query);
 return courses.filter(c=>['category','series','level'].every(k=>!filters[k]||filters[k]==='全部'||c[k]===filters[k])&&
  (!query||clean([c.title,c.subtitle,c.keywords,...c.items.flatMap(s=>[s.en,s.zh])].join(' ')).includes(query)))
  .sort((a,b)=>(rank[a.series]??9)-(rank[b.series]??9));
}
export function searchSentences(courses,filters={}){
 const query=clean(filters.query);if(!query)return [];
 return filterCourses(courses,{...filters,query:''}).flatMap(course=>course.items.map((sentence,index)=>({course,sentence,index})))
  .filter(({sentence})=>clean(sentence.en).includes(query)||clean(sentence.zh).includes(query));
}
export function courseSummary(courses){return {courses:courses.length,sentences:courses.reduce((n,c)=>n+c.items.length,0)};}
