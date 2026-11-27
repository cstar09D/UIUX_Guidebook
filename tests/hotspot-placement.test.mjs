import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSync} from 'esbuild';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
const module={exports:{}},require=createRequire(import.meta.url);runInNewContext(buildSync({stdin:{contents:"export {hotspotPlacement} from './src/demos/effects';export {upgradeHotspotGuide} from './src/lib/hotspot-guide';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'cjs',packages:'external',write:false}).outputFiles[0].text,{module,exports:module.exports,require});
const {hotspotPlacement}=module.exports;
test('핫스팟 말풍선은 좌우 끝과 작은 이미지에서도 안쪽 8px 여백을 지킨다',()=>{for(const width of [120,204,333,440])for(const height of [107,160,275])for(const [x,y] of [[28,62],[56,72],[71,34],[2,5],[98,95]]){const w=Math.min(185,width-16),h=Math.min(86,height-16),p=hotspotPlacement(width,height,x,y,w,h);assert.ok(p.left>=8);assert.ok(p.top>=8);assert.ok(p.left+w<=width-8+.001);assert.ok(p.top+h<=height-8+.001);}});
test('오른쪽 공간이 부족하면 같은 지점의 왼쪽으로 옮긴다',()=>{const p=hotspotPlacement(440,275,90,50,185,70);assert.ok(p.left+185<440*.9);assert.equal(p.top,102.5);});
