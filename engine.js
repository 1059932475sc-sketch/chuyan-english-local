export function normalize(s){return String(s).toLowerCase().replace(/[‘’]/g,"'").replace(/[.,!?;:，。！？；：]/g,'').replace(/\s+/g,' ').trim();}
export function assess(a,b){return normalize(a)===normalize(b);}
export function schedule(previous,ok,now=Date.now()){
  const streak=ok?(previous?.streak||0)+1:0;
  const days=ok?[1,3,7,14,30][Math.min(streak-1,4)]:0;
  return {streak,due:now+days*86400000,attempts:(previous?.attempts||0)+1,correct:(previous?.correct||0)+(ok?1:0),last:now};
}
export function fresh(){return {version:1,records:{},favorites:[],daily:{},resume:null,settings:{rate:0.8,goal:10},grammarProgress:{},grammarMistakes:{}};}
export function restore(raw){
  const base=fresh();try{
    const x=JSON.parse(raw);if(x?.version!==1)return base;
    if(x.records&&typeof x.records==='object')for(const [id,r] of Object.entries(x.records)){
      if(r&&Number.isFinite(r.due)&&Number.isInteger(r.streak)&&r.streak>=0&&Number.isInteger(r.attempts)&&r.attempts>=0&&Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=r.attempts)base.records[id]=r;
    }
    base.favorites=Array.isArray(x.favorites)?[...new Set(x.favorites.filter(v=>typeof v==='string'))]:[];
    if(x.daily&&typeof x.daily==='object')for(const [k,v] of Object.entries(x.daily))if(/^\d{4}-\d{2}-\d{2}$/.test(k)&&Number.isInteger(v)&&v>=0)base.daily[k]=v;
    if(x.grammarProgress&&typeof x.grammarProgress==='object')for(const [id,v] of Object.entries(x.grammarProgress))if(/^(?:phonics|g\d{2})-\d{2}$/.test(id)&&v&&typeof v.completed==='boolean'&&Number.isInteger(v.score)&&v.score>=0&&v.score<=6&&Number.isInteger(v.attempts)&&v.attempts>=v.score)base.grammarProgress[id]={completed:v.completed,score:v.score,attempts:v.attempts};
    if(x.grammarMistakes&&typeof x.grammarMistakes==='object')for(const [id,v] of Object.entries(x.grammarMistakes))if(/^(?:phonics|g\d{2})-\d{2}-x[1-6]$/.test(id)&&v&&typeof v.lessonId==='string'&&Number.isInteger(v.attempts)&&v.attempts>0&&Number.isFinite(v.last)&&v.last>=0)base.grammarMistakes[id]={lessonId:v.lessonId,attempts:v.attempts,last:v.last};
    if(x.resume&&Array.isArray(x.resume.ids)&&x.resume.ids.every(v=>typeof v==='string')&&Number.isInteger(x.resume.index)&&x.resume.index>=0&&['learn','dictation','puzzle','speak'].includes(x.resume.mode))base.resume=x.resume;
    if([0.6,0.8,1].includes(x.settings?.rate))base.settings.rate=x.settings.rate;
    if([5,10,20].includes(x.settings?.goal))base.settings.goal=x.settings.goal;
  }catch{}return base;
}
