import test from 'node:test';
import assert from 'node:assert/strict';
import {sentences} from '../data.js';
import {sentenceRoles,tokenizeSentence,wordInfo} from '../analysis-data.js';

test('all visible English words have a useful Chinese meaning when clicked',()=>{
  const samples=[
    'Good morning, Professor Austin, how are you doing?',
    "Would you mind telling us about the process, please?",
    "Don't mention it. Hopefully, I will be able to answer your questions!",
    'Welcome home.',
    'Good afternoon.'
  ];
  for(const text of samples){
    for(const token of tokenizeSentence(text)){
      const info=wordInfo(token.word);
      assert.notEqual(info.meaning,'结合句意理解',token.word);
      assert.ok(/[\u4e00-\u9fff]/.test(info.meaning),token.word);
    }
  }
});

test('sentence roles expose subject predicate and object style blocks for later courses',()=>{
  const sentence=sentences.find(item=>item.en==='Welcome home.');
  const roles=sentenceRoles(sentence);
  assert.deepEqual(roles.map(item=>item.role),['主语','谓语','宾语 / 补语']);
  assert.deepEqual(roles.map(item=>item.text),['You','Welcome','home']);
});

test('question sentences still expose the core subject and predicate',()=>{
  const sentence=sentences.find(item=>item.en==='Good morning, Professor Austin, how are you doing?');
  const roles=sentenceRoles(sentence);
  assert.ok(roles.some(item=>item.role==='主语'&&item.text==='you'));
  assert.ok(roles.some(item=>item.role==='谓语'&&item.text==='are doing'));
});
