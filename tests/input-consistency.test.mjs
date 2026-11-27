import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { buildSync } from 'esbuild';
import { script } from '../src/demos/vanilla.mjs';

const require = createRequire(import.meta.url);
// Exercise the actual component handlers with persistent hook state. Browser QA
// separately checks DOM/focus; these cases cover IME event ordering deterministically.
function component(entry, name, props = {}) {
  const slots = []; let cursor = 0;
  const slot = (create) => { const i = cursor++; if (!(i in slots)) slots[i] = create(); return i; };
  const react = {
    ...require('react'),
    useState(initial) { const i = slot(() => typeof initial === 'function' ? initial() : initial); return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
    useRef(initial) { return slots[slot(() => ({ current: initial }))]; },
    useId() { const i = slot(() => `test-${cursor}`); return slots[i]; },
    useMemo(fn) { return fn(); },
    useEffect() {},
  };
  const result = buildSync({ entryPoints: [entry], bundle: true, platform: 'node', format: 'cjs', packages: 'external', write: false });
  const module = { exports: {} };
  runInNewContext(result.outputFiles[0].text, { module, exports: module.exports, require: id => id === 'react' ? react : require(id) });
  return () => { cursor = 0; return module.exports[name](props); };
}
function all(node, predicate) {
  if (Array.isArray(node)) return node.flatMap(child => all(child, predicate));
  if (!node?.props) return [];
  return [...(predicate(node) ? [node] : []), ...all(node.props.children, predicate)];
}
const one = (tree, predicate) => { const nodes = all(tree, predicate); assert.equal(nodes.length, 1); return nodes[0]; };
const text = node => Array.isArray(node) ? node.map(text).join('') : node?.props ? text(node.props.children) : node == null || typeof node === 'boolean' ? '' : String(node);
const comboInput = tree => one(tree, n => n.props.role === 'combobox');
const options = tree => all(tree, n => n.props.role === 'option').map(n => text(n.props.children[1]));
const change = (value, composing = false) => ({ target: { value }, currentTarget: { value }, nativeEvent: { isComposing: composing } });
function key(key, native = {}) { return { key, nativeEvent: native, prevented: false, preventDefault() { this.prevented = true; }, stopPropagation() {} }; }

test('React 콤보박스는 조합 중 보이는 서울 값과 추천 목록이 즉시 일치한다', () => {
  const render = component('src/demos/components.tsx', 'ComboScene');
  comboInput(render()).props.onFocus();
  comboInput(render()).props.onChange(change('서'));
  assert.deepEqual(options(render()), ['서울', '서귀포', '서산']);
  comboInput(render()).props.onChange(change('서울', true));
  assert.equal(comboInput(render()).props.value, '서울');
  assert.deepEqual(options(render()), ['서울']);
  comboInput(render()).props.onCompositionEnd(change('서울'));
  assert.deepEqual(options(render()), ['서울']);
});

test('React 콤보박스는 전체·단일·무결과·지우기와 조합 확정 Enter를 구분한다', () => {
  const render = component('src/demos/components.tsx', 'ComboScene');
  comboInput(render()).props.onFocus();
  for (const [value, expected] of [['서귀', ['서귀포']], ['부산', ['부산']], ['없는도시', []], ['', ['서울', '서귀포', '서산', '부산', '제주']]]) {
    comboInput(render()).props.onChange(change(value)); assert.deepEqual(options(render()), expected);
  }
  comboInput(render()).props.onChange(change('서울'));
  comboInput(render()).props.onCompositionStart();
  comboInput(render()).props.onKeyDown(key('Enter', { isComposing: false }));
  assert.equal(comboInput(render()).props['aria-expanded'], true);
  comboInput(render()).props.onCompositionEnd(change('서울'));
  comboInput(render()).props.onKeyDown(key('Enter', { keyCode: 229 }));
  assert.equal(comboInput(render()).props['aria-expanded'], true);
  comboInput(render()).props.onKeyDown(key('Enter'));
  assert.equal(comboInput(render()).props['aria-expanded'], false);
});

test('React 콤보박스는 닫힌 목록의 아래/위 방향키에서 첫/마지막 후보로 시작한다', () => {
  for (const [pressed, expected] of [['ArrowDown', '서울'], ['ArrowUp', '제주']]) {
    const render = component('src/demos/components.tsx', 'ComboScene');
    comboInput(render()).props.onKeyDown(key(pressed));
    assert.equal(text(one(render(), n => n.props.role === 'option' && n.props['aria-selected']).props.children[1]), expected);
  }
});

function nativeCombo() {
  const make = () => ({ attrs: {}, children: [], hidden: false, value: '', textContent: '', setAttribute(k, v) { this.attrs[k] = String(v); }, removeAttribute(k) { delete this.attrs[k]; }, replaceChildren() { this.children = []; this.textContent = ''; }, append(child) { this.children.push(child); }, focus() { this.onfocus?.(); }, contains() { return true; } });
  const nodes = Object.fromEntries(['#city', '#cities', '#combo', '#expand', '#status'].map(id => [id, make()]));
  nodes['#cities'].hidden = true;
  runInNewContext(script.combobox, { document: { querySelector: selector => nodes[selector], createElement: make, addEventListener() {} } });
  return { input: nodes['#city'], list: nodes['#cities'], status: nodes['#status'] };
}
test('HTML 콤보박스도 조합 중 서울 한 개만 표시하고 이전 선택 완료 안내를 지운다', () => {
  const { input, list, status } = nativeCombo();
  input.value = '서'; input.oninput();
  assert.deepEqual(list.children.map(n => n.textContent), ['서울', '서귀포', '서산']);
  input.oncompositionstart(); input.value = '서울'; input.oninput();
  assert.deepEqual(list.children.map(n => n.textContent), ['서울']);
  input.oncompositionend();
  list.children[0].onclick(); assert.match(status.textContent, /서울 선택 완료/);
  input.oncompositionstart(); input.value = '부산'; input.oninput();
  assert.deepEqual(list.children.map(n => n.textContent), ['부산']);
  assert.doesNotMatch(status.textContent, /선택 완료/);
  input.onkeydown({ key: 'Enter', isComposing: false, preventDefault() {} });
  assert.equal(list.hidden, false);
  input.oncompositionend();
  input.onkeydown({ key: 'Enter', keyCode: 229, preventDefault() {} });
  assert.equal(list.hidden, false);
  input.onkeydown({ key: 'Enter', preventDefault() {} }); assert.equal(list.hidden, true);
});

test('HTML 콤보박스는 무결과·지우기·닫힌 목록의 방향키 시작 위치가 일치한다', () => {
  const { input, list } = nativeCombo();
  input.onkeydown({ key: 'ArrowDown', preventDefault() {} });
  assert.equal(list.children.find(n => n.attrs['aria-selected'] === 'true').textContent, '서울');
  input.value = '없는도시'; input.oninput(); assert.equal(list.children.length, 0);
  assert.equal(input.attrs['aria-activedescendant'], undefined);
  input.value = ''; input.oninput(); assert.equal(list.children.length, 5);
  input.onkeydown({ key: 'Escape', preventDefault() {} });
  input.onkeydown({ key: 'ArrowUp', preventDefault() {} });
  assert.equal(list.children.find(n => n.attrs['aria-selected'] === 'true').textContent, '제주');
});

const catalogResult = tree => all(tree, n => n.type?.name === 'Preview').map(n => n.props.term.id);
test('사이트 검색은 한글 조합 중에도 입력창과 검색 결과를 같은 값으로 갱신한다', () => {
  const terms = [
    { id: 'seoul', english: 'Seoul', pronunciation: '서울', korean: '서울', aliases: [], keywords: [], order: 0, category: '도시' },
    { id: 'seogwipo', english: 'Seogwipo', pronunciation: '서귀포', korean: '서귀포', aliases: [], keywords: [], order: 1, category: '도시' },
  ];
  const render = component('src/components/Catalog.tsx', 'default', { initialTerms: terms, initialCategories: ['도시'] });
  const input = () => one(render(), n => n.props['aria-label'] === 'UI 용어 검색');
  input().props.onChange(change('서'));
  input().props.onCompositionStart?.();
  input().props.onChange(change('서울', true));
  assert.deepEqual(catalogResult(render()), ['seoul']);
});

test('관리자 검색도 조합 중인 값으로 후보를 좁히고 지우면 전체를 복원한다', () => {
  const terms = ['서울', '서귀포'].map((name, index) => ({ id: `city-${index}`, english: name, pronunciation: name, korean: name, aliases: [], keywords: [], category: '도시', status: 'published', revision: 1, updatedAt: '2026-11-26T00:00:00Z' }));
  const render = component('src/components/Admin.tsx', 'default', { initialState: { terms, taxonomy: { categories: ['도시'], tags: [], revision: 1 }, checkpoints: [] } });
  const input = () => one(render(), n => n.props['aria-label'] === '관리자 용어 검색');
  const listed = () => all(render(), n => n.type === 'button' && n.props['aria-label']?.endsWith(' 편집')).map(n => n.props['aria-label']);
  input().props.onChange(change('서')); assert.deepEqual(listed(), ['서울 편집', '서귀포 편집']);
  input().props.onChange(change('서울', true)); assert.deepEqual(listed(), ['서울 편집']);
  input().props.onChange(change('없는도시')); assert.deepEqual(listed(), []);
  input().props.onChange(change('')); assert.equal(listed().length, 2);
});

test('모달 설정은 저장 뒤 다시 편집하다 취소해도 마지막 저장값을 유지한다', () => {
  const render = component('src/demos/components.tsx', 'ModalScene');
  const button = label => one(render(), n => n.type === 'button' && text(n) === label);
  const input = () => one(render(), n => n.type === 'input');
  input().props.onChange(change('저장한 이름')); button('변경 저장').props.onClick();
  button('설정 열기').props.onClick(); input().props.onChange(change('취소할 이름'));
  button('취소').props.onClick();
  assert.equal(text(one(render(), n => n.type === 'h2' && !n.props.id)), '저장한 이름');
  button('설정 열기').props.onClick(); assert.equal(input().props.value, '저장한 이름');
});

test('커스텀 셀렉트는 후보 탐색·Esc 취소·선택 확정·설정 적용을 분리한다', () => {
  const render = component('src/demos/essentials.tsx', 'SelectScene');
  const picker = () => one(render(), n => n.props.role === 'combobox');
  const list = () => one(render(), n => n.props.role === 'listbox');
  const value = () => one(render(), n => n.type === 'input' && n.props.name === 'digest').props.value;
  const button = title => one(render(), n => n.type === 'button' && text(n) === title);
  picker().props.onClick(); assert.equal(list().props.hidden, false);
  picker().props.onKeyDown(key('ArrowDown')); assert.equal(value(), '');
  picker().props.onKeyDown(key('Escape')); assert.equal(list().props.hidden, true); assert.equal(value(), '');
  picker().props.onKeyDown(key('End')); picker().props.onKeyDown(key('Enter')); assert.equal(value(), 'quarterly');
  assert.equal(list().props.hidden, true); button('설정 적용').props.onClick();
  assert.match(text(render()), /분기별 요약으로 적용했어요/);
  picker().props.onClick(); picker().props.onKeyDown(key('Home')); picker().props.onKeyDown(key('ArrowDown')); picker().props.onKeyDown(key(' '));
  assert.equal(value(), 'monthly'); assert.match(text(render()), /현재 적용: 분기별/);
  button('설정 적용').props.onClick(); assert.match(text(render()), /매월 요약으로 적용했어요/);
  button('초기화').props.onClick(); assert.equal(value(), ''); assert.doesNotMatch(text(render()), /현재 적용:/);
});

test('커스텀 셀렉트는 필수 오류·Tab 확정·문자 탐색·조합 Enter를 처리한다', () => {
  const render = component('src/demos/essentials.tsx', 'SelectScene');
  const picker = () => one(render(), n => n.props.role === 'combobox');
  const value = () => one(render(), n => n.type === 'input' && n.props.name === 'digest').props.value;
  one(render(), n => n.type === 'button' && text(n) === '설정 적용').props.onClick();
  assert.equal(picker().props['aria-invalid'], true);
  picker().props.onKeyDown(key('Enter', { isComposing: true })); assert.equal(picker().props['aria-expanded'], false);
  picker().props.onKeyDown(key('End')); const tab = key('Tab'); picker().props.onKeyDown(tab);
  assert.equal(tab.prevented, false); assert.equal(value(), 'quarterly'); assert.equal(picker().props['aria-invalid'], false);
  picker().props.onKeyDown(key('Home')); picker().props.onKeyDown(key('분'));
  const active = one(render(), n => n.props.role === 'option' && n.props['aria-selected']);
  assert.match(text(active), /분기별/);
  picker().props.onKeyDown(key('Escape')); assert.equal(value(), 'quarterly');
});
