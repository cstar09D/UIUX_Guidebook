import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSync} from 'esbuild';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
const require=createRequire(import.meta.url);
function compiled(entry){return buildSync({entryPoints:[entry],bundle:true,platform:'node',format:'cjs',packages:'external',write:false}).outputFiles[0].text;}
function exported(entry,globals={}){const module={exports:{}};runInNewContext(compiled(entry),{module,exports:module.exports,require,...globals});return module.exports;}
const gestures=exported('src/demos/expansion.tsx');
test('스와이프는 방향 의도를 판별하고 행 변위와 당기기 저항을 경계 안에 둔다',()=>{
 const {gestureIntent,swipeOffset,pullDistance}=gestures;
 assert.equal(gestureIntent(3,4),'pending');assert.equal(gestureIntent(-50,5),'horizontal');assert.equal(gestureIntent(5,50),'vertical');assert.equal(gestureIntent(15,15),'pending');
 assert.equal(swipeOffset(40),0);assert.equal(swipeOffset(-60),-60);assert.equal(swipeOffset(-1000),-136);
 assert.equal(pullDistance(-10),0);assert.equal(pullDistance(80),40);assert.equal(pullDistance(112),56);assert.equal(pullDistance(1000),96);
});
test('필터와 정렬을 결합해도 원본·동률 순서·나머지 조건은 유지한다',()=>{
 const {sortRows,filterRows}=exported('src/demos/advanced.tsx');
 const rows=[{id:'a',name:'가',kind:'디자인',owner:'나',cost:9},{id:'b',name:'나',kind:'디자인',owner:'민지',cost:3},{id:'c',name:'다',kind:'기획',owner:'나',cost:9}];
 assert.deepEqual(Array.from(sortRows(filterRows(rows,'all',true),'high'),x=>x.id),['a','c']);
 assert.deepEqual(Array.from(sortRows(filterRows(rows,'디자인',false),'low'),x=>x.id),['b','a']);
 assert.deepEqual(Array.from(sortRows(rows,'name-desc'),x=>x.id),['c','b','a']);
 assert.deepEqual(rows.map(x=>x.id),['a','b','c']);
});
test('공통 컨트롤러는 명시한 리스너 옵션과 관찰자 정리를 수명에 연결한다',()=>{
 const recorded=[],cleaned=[],listeners=[];
 const window={addEventListener(){},removeEventListener(){}};
 const {createScenarioController}=exported('src/demos/expansion.tsx',{window,parent:{},setTimeout,clearTimeout});
 const c=createScenarioController({dataset:{expansion:'pull-to-refresh'}},{default(){}});
 const target={addEventListener:(...args)=>recorded.push(args),removeEventListener:(...args)=>cleaned.push(args)};
 const options={passive:false},handler=()=>{};
 c.on(target,'touchmove',handler,options);c.cleanup(()=>listeners.push('observer disconnected'));c.destroy();
 assert.equal(recorded[0][2],options);assert.equal(cleaned[0][2],options);assert.deepEqual(listeners,['observer disconnected']);
});
const repositoryCode=buildSync({entryPoints:['src/lib/db.ts'],bundle:true,platform:'node',format:'esm',write:false,banner:{js:'import {createRequire} from "node:module";const require=createRequire(process.cwd()+"/package.json");'}}).outputFiles[0].text;
const addedIds=['notification-center','hover-card','inline-edit','infinite-scroll','swipe-actions','pull-to-refresh'];
test('A3 추가는 앞선 95개와 게시·이력을 보존하고 새 6개만 초안으로 추가한다',async()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'ui-a3-')),previous=process.env.UI_NOTES_DB_PATH;process.env.UI_NOTES_DB_PATH=path.join(dir,'test.sqlite');
 try{const file=path.join(dir,'repo.mjs');writeFileSync(file,repositoryCode);const r=await import(pathToFileURL(file));await r.listTerms();const sql=new DatabaseSync(process.env.UI_NOTES_DB_PATH);for(const id of addedIds){for(const table of ['terms','published_terms'])sql.prepare(`DELETE FROM ${table} WHERE id=?`).run(id);for(const table of ['content_meta','term_versions'])sql.prepare(`DELETE FROM ${table} WHERE term_id=?`).run(id);}sql.close();
 const before=await r.exportBackup();assert.equal(before.terms.length,95);const preview=await r.addExpansionDrafts();assert.deepEqual([...preview.added].sort(),[...addedIds].sort());assert.deepEqual((await r.exportBackup()).terms,before.terms);
 const result=await r.addExpansionDrafts(true);assert.ok(result.checkpoint);assert.equal((await r.listTerms()).length,95);const after=await r.exportBackup();assert.equal(after.terms.length,101);for(const old of before.terms)assert.deepEqual(after.terms.find(t=>t.document.id===old.document.id),old);for(const old of before.history)assert.deepEqual(after.history.find(t=>t.id===old.id),old);for(const term of (await r.listTerms(true)).filter(t=>addedIds.includes(t.demoId)))assert.equal(term.status,'draft');assert.equal((await r.addExpansionDrafts(true)).added.length,0);
 }finally{if(previous===undefined)delete process.env.UI_NOTES_DB_PATH;else process.env.UI_NOTES_DB_PATH=previous;rmSync(dir,{recursive:true,force:true});}
});
test('표·필터·공유 설명 보강은 사용자 원고와 게시본을 보존하고 중복하지 않는다',async()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'ui-a3-guides-')),previous=process.env.UI_NOTES_DB_PATH;process.env.UI_NOTES_DB_PATH=path.join(dir,'test.sqlite');
 try{const file=path.join(dir,'repo.mjs');writeFileSync(file,repositoryCode);const r=await import(pathToFileURL(file));const original=(await r.listTerms(true)).find(t=>t.demoId==='icon-button'),guide=structuredClone(original.guide);guide.introduction='사용자가 작성한 공유 도입 원고';guide.examples=guide.examples.filter(x=>x.id!=='share-sheet');guide.flow=guide.flow.filter(x=>x.title!=='PC 공유 패널과 모바일 시트');guide.practice='사용자가 정의한 공유 체험';for(const role of Object.values(guide.roles))role.tasks=role.tasks.filter(t=>!t.title.startsWith('업무 흐름 보강:'));await r.saveContent({...original,guide},'save');const before=await r.exportBackup();assert.deepEqual((await r.addWorkflowEnhancementDrafts()).updated,[original.id]);const result=await r.addWorkflowEnhancementDrafts(true);assert.ok(result.checkpoint);const after=await r.exportBackup(),updated=after.terms.find(t=>t.document.id===original.id),old=before.terms.find(t=>t.document.id===original.id);assert.deepEqual(updated.published,old.published);assert.equal(updated.document.guide.introduction,guide.introduction);assert.ok(updated.document.guide.practice.startsWith(guide.practice));for(const other of before.terms.filter(t=>t.document.id!==original.id))assert.deepEqual(after.terms.find(t=>t.document.id===other.document.id),other);assert.equal((await r.addWorkflowEnhancementDrafts(true)).updated.length,0);
 }finally{if(previous===undefined)delete process.env.UI_NOTES_DB_PATH;else process.env.UI_NOTES_DB_PATH=previous;rmSync(dir,{recursive:true,force:true});}
});
