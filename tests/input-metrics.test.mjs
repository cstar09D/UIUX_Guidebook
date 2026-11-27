import test from 'node:test';
import assert from 'node:assert/strict';
import {measureText,formatTextMetrics,limitText} from '../src/demos/input-metrics.mjs';
test('입력량은 한글·영문·줄바꿈·이모지의 눈에 보이는 글자 수와 UTF-8 byte를 구분한다',()=>{
 for(const [value,count] of [['',0],['abc',3],['한글',2],['한A🙂',3],['e\u0301',1],['👨‍👩‍👧‍👦',1],['🇰🇷',1],['a\nb',3]]) {
  const result=measureText(value);assert.equal(result.characters,count);assert.equal(result.bytes,new TextEncoder().encode(value).length);
 }
 assert.equal(formatTextMetrics('한A🙂',30),'3 / 30자 · 8 byte (UTF-8)');
});
test('길이 제한은 한글 조합과 여러 코드 포인트로 이뤄진 이모지를 자르지 않는다',()=>{
 const emoji='👨‍👩‍👧‍👦';assert.equal(limitText(emoji.repeat(31),30),emoji.repeat(30));assert.equal(measureText(limitText('e\u0301'.repeat(31),30)).characters,30);
});
