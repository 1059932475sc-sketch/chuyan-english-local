const rules=[
 ['g15-01',/\bif\b/i],['g15-02',/\b(?:is|are|was|were|be|been)\s+\w+(?:ed|en)\b/i],['g15-03',/\b(?:who|which|that)\b/i],['g15-04',/\b(?:think|know|hope|wonder)\b/i],['g15-05',/\b(?:because|although|while|when)\b/i],
 ['g16-01',/\b(?:yes|no),?\s+(?:i|you|he|she|we|they)\s+(?:do|does|did|am|is|are|can|will)\b/i],['g16-02',/\bright\??$/i],['g16-03',/\b(?:i think|maybe|perhaps)\b/i],['g16-04',/\b(?:excuse me|would you mind|could you)\b/i],['g16-05',/\b(?:one|ones|too|either|so)\b/i],
 ['g14-01',/\b(?:want|need|plan|hope|decide)\s+to\b/i],['g14-02',/\b(?:enjoy|finish|keep|avoid)\s+\w+ing\b/i],['g14-03',/\b(?:make|let)\s+\w+\s+\w+/i],['g14-04',/\b(?:see|hear|watch|feel)\s+\w+\s+\w+ing\b/i],['g14-05',/\b(?:turn|pick|put|take|get|look|check|come|go)\s+(?:on|off|up|down|out|in|back|for|after)\b/i],
 ['g13-01',/\bcan(?:not|'t)?\b/i],['g13-02',/\bcould\b/i],['g13-03',/\b(?:may|might)\b/i],['g13-04',/\bmust\b/i],['g13-05',/\b(?:should|have to|has to)\b/i],
 ['g12-01',/\b(?:at|on|in)\s+(?:\d|one|two|three|four|five|six|seven|eight|nine|ten|monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|afternoon|evening|night|january|february|march|april|may|june|july|august|september|october|november|december)\b/i],['g12-02',/\b(?:at|on|in|under|above|behind|inside|outside)\s+(?:the|a|my|your|this|that)\b/i],['g12-03',/\b(?:from|to|toward|into|out of)\b/i],['g12-04',/\b(?:next to|across from|between|near|beside)\b/i],['g12-05',/\b(?:for|since)\s+(?:\d|a|an|one|two|three|four|five|six|seven|eight|nine|ten)\b/i],
 ['g11-02',/\b\w+ly\b/i],['g11-03',/\b(?:better|worse|more|less|\w+er)\s+than\b/i],['g11-04',/\bthe\s+(?:best|worst|most|least|\w+est)\b/i],['g11-05',/\b(?:too|very|enough|quite|really)\b/i],
 ['g10-02',/\b(?:me|him|her|us|them)\b/i],['g10-03',/\b(?:mine|yours|his|hers|ours|theirs)\b/i],['g10-04',/\b(?:myself|yourself|himself|herself|ourselves|themselves)\b/i],['g10-05',/\b(?:someone|anyone|everyone|no one|nothing|anything)\b/i],
 ['g09-01',/\b(?:a|an)\s+\w+/i],['g09-02',/\bthe\s+\w+/i],['g09-04',/\b(?:this|that|these|those)\b/i],['g09-05',/\b(?:some|any)\b/i],
 ['g08-01',/\b(?:two|three|four|five|six|seven|eight|nine|ten|many|few)\s+\w+s\b/i],['g08-02',/\b(?:water|coffee|tea|rice|information|money|advice|bread)\b/i],['g08-03',/\bhow\s+(?:many|much)\b/i],['g08-04',/\b(?:cup|glass|piece|bottle|slice)\s+of\b/i],['g08-05',/\b\w+[’']s\s+\w+/i],
 ['g07-01',/\b(?:am|is|are)\s+\w+ing\b/i],['g07-02',/\b(?:have|has)\s+\w+(?:ed|en)\b/i],['g07-03',/\b(?:for|since)\b/i],['g07-04',/\b(?:have|has)\s+(?:been|gone)\b/i],
 ['g06-01',/\bwill\b/i],['g06-02',/\bgoing to\b/i],['g06-03',/\b(?:tomorrow|tonight|next week|next month)\b/i],['g06-04',/\bwon't|will not\b/i],
 ['g05-02',/\bdid not|didn't\b/i],['g05-03',/^did\b/i],['g05-04',/\b(?:was|were)\s+\w+ing\b/i],['g05-05',/\bused to\b/i],['g05-01',/\b(?:yesterday|last night|last week|ago|\w+ed)\b/i],
 ['g04-02',/^(?:who|what|where|when|why|how)\b/i],['g04-03',/\bor\b/i],['g04-04',/^how\s+(?:much|many|long|often|far)\b/i],
 ['g03-03',/\b(?:do|does) not\b|\bdon't|doesn't\b/i],['g03-04',/^(?:do|does)\b/i],['g03-05',/\b(?:always|usually|often|sometimes|never|every day)\b/i],
 ['g02-03',/\b(?:am|is|are) not\b|\bisn't|aren't\b/i],['g02-04',/^(?:am|is|are)\b/i],['g02-05',/\b(?:am|is|are)\s+(?:at|in|on|near|here|there)\b/i],['g02-02',/\b(?:he|she|it) is\b|\b(?:you|we|they) are\b/i],['g02-01',/\bi am\b/i]
];
export function grammarTagsForSentence(sentence){
 const text=String(sentence?.en||'').trim(),tags=[];
 for(const [tag,pattern] of rules)if(pattern.test(text)&&!tags.includes(tag))tags.push(tag);
 if(!tags.length)tags.push(/\b\w+s\b/i.test(text)?'g03-02':'g01-01');
 return tags.slice(0,4);
}
