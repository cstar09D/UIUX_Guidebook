import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceLoop, createPlayback } from '../src/lib/playback.mjs';
const definitions = { a: { duration: 1000, poster: 400 }, b: { duration: 1500, poster: 500 }, c: { duration: 1000, poster: 600 } };
test('보이는 모든 카드가 조작 없이 자동 재생된다', () => {
 const p=createPlayback(definitions);for(const id of ['a','b','c'])p.setVisible(id,true);
 assert.equal(['a','b','c'].filter(id=>p.getSnapshot(id).status==='playing').length,3);
 p.tick(200);for(const id of ['a','b','c'])assert.equal(p.getSnapshot(id).time,200);
});
test('한 번 또는 여러 번 종료 지점을 지나도 계속 루프된다',()=>{
 const p=createPlayback(definitions);p.setVisible('a',true);p.tick(900);p.tick(250);
 assert.equal(p.getSnapshot('a').time,150);p.tick(3000);assert.equal(p.getSnapshot('a').time,150);
 assert.equal(p.getSnapshot('a').status,'playing');assert.equal(advanceLoop(900,100,1000),0);assert.equal(advanceLoop(0,100,0),0);
});
test('각 UI의 고유 재생 길이를 유지한다',()=>{
 const p=createPlayback(definitions);p.setVisible('a',true);p.setVisible('b',true);p.tick(1100);
 assert.equal(p.getSnapshot('a').time,100);assert.equal(p.getSnapshot('b').time,1100);
});
test('화면 밖·문서 숨김·상세 진입에서 정지하고 복귀하면 이어진다',()=>{
 const p=createPlayback(definitions);p.setVisible('a',true);p.tick(200);
 for(const reason of ['hidden','blocked']){p.setContext({[reason]:true});p.tick(5000);assert.equal(p.getSnapshot('a').time,200);p.setContext({[reason]:false});}
 p.setVisible('a',false);p.tick(1000);assert.equal(p.getSnapshot('a').time,200);p.setVisible('a',true);p.tick(100);assert.equal(p.getSnapshot('a').time,300);
});
test('같은 데모를 연결한 새 콘텐츠도 독립적으로 루프된다',()=>{
 const p=createPlayback(definitions);p.register('copy',definitions.a);p.setVisible('copy',true);p.tick(1120);
 assert.equal(p.getSnapshot('copy').time,120);assert.equal(p.getSnapshot('a').time,400);
});
