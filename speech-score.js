import {normalize} from './engine.js';
// Levenshtein alignment measures transcript agreement, NOT phoneme quality.
export function compareSpeech(expected,heard){
 const a=normalize(expected).split(' ').filter(Boolean),b=normalize(heard).split(' ').filter(Boolean);
 const choice=Array.from({length:a.length+1},()=>Array(b.length+1).fill(''));const matchesAt=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
 const d=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
 for(let i=0;i<=a.length;i++)d[i][0]=i;for(let j=0;j<=b.length;j++)d[0][j]=j;
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){const same=a[i-1]===b[j-1];const options=[[d[i-1][j-1]+(same?0:1),matchesAt[i-1][j-1]+(same?1:0),'diagonal'],[d[i-1][j]+1,matchesAt[i-1][j],'delete'],[d[i][j-1]+1,matchesAt[i][j-1],'insert']].sort((x,y)=>x[0]-y[0]||y[1]-x[1]);[d[i][j],matchesAt[i][j],choice[i][j]]=options[0];}
 let i=a.length,j=b.length;const words=[];let matches=0;
 while(i||j){if(i&&j&&choice[i][j]==='diagonal'){const ok=a[i-1]===b[j-1];if(ok)matches++;words.unshift({expected:a[--i],heard:b[--j],status:ok?'match':'changed'});}else if(i&&(!j||choice[i][j]==='delete'))words.unshift({expected:a[--i],heard:'',status:'missing'});else words.unshift({expected:'',heard:b[--j],status:'extra'});}
 return {agreement:Math.round(Math.max(0,1-d[a.length][b.length]/Math.max(1,a.length))*100),coverage:Math.round(matches/Math.max(1,a.length)*100),words};
}
