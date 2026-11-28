# 시뮬레이션 등록 절차

시뮬레이션은 개발자가 구현·검토한 코드로 등록합니다. 관리자에서는 등록된 동작을 선택하고 상세 콘텐츠를 편집합니다. 임의 HTML이나 JavaScript 파일을 관리자에 업로드해 실행하는 방식은 제공하지 않습니다.

## 원본과 연결 위치

| 파일 | 등록할 내용 |
| --- | --- |
| `src/demos/registry.ts` | 고유 id, 이름, 설명, React 컴포넌트 이름·원본 file 경로, 자동 시연 주기, 대표 장면 시점, 4개 단계 설명, 공식 출처 |
| `src/demos/components.tsx`, `essentials.tsx`, `foundations.tsx` | React 실제 체험, `preview/time`을 받는 결정 가능한 시연 |
| `src/demos/scenes.tsx` | 모든 React 구현의 `sceneMap` 연결 |
| `src/demos/vanilla.mjs`, `essentials-vanilla.mjs`, `foundations-vanilla.mjs` | 같은 UI의 `markup[id]`, `script[id]` 구현 |
| `src/demos/scene.css` | UI별 네임스페이스를 사용하는 스타일 |
| `src/lib/guide-content.ts`, `essentials-guides.ts`, `foundation-guides.ts` | 기본 가이드·화면 예시·4개 직무 안내 |

id는 게시된 콘텐츠와 백업에서 사용하므로 등록 이후 바꾸거나 재사용하지 않습니다. 사용 중인 동작을 제거하려면 연결된 초안·게시본과 복구할 백업을 먼저 이전합니다.

## 구현 계약

React 컴포넌트는 `SceneProps`의 `preview`, `time`, `reduced`, `paused`를 필요한 만큼 사용합니다. 시연 모드는 사용자 입력·실제 네트워크 요청 없이 `time`으로 재현 가능해야 합니다. 체험 모드는 시연과 분리하고 키보드·터치·실패와 복구 동작을 제공합니다.

`registry.file`은 해당 함수가 선언된 소스 경로, `registry.component`는 export한 함수 이름과 일치시킵니다. `sceneMap` 키와 `markup`·`script` 키는 registry의 id와 같아야 합니다. `poster`는 0 이상이고 `duration`보다 작게, 단계 설명은 4개로 작성합니다.

React 부분 코드는 등록된 컴포넌트와 참조하는 최상위 보조 선언에서 자동으로 추출합니다. 외부 로컬 파일 의존성을 추가한다면 빌드 추출 규칙도 함께 확장하고 복사 예제의 독립 실행을 검증하세요. CSS는 클래스 사용을 기준으로 추출하므로 런타임에 조합하는 클래스 이름도 생성 결과에서 확인합니다.

## 등록 후 검증

```sh
npm run demos
npm test
npm run build
npm start
```

빌드는 React·HTML 구현, 등록 연결과 시연 메타데이터를 검사합니다. 예제 테스트는 부분 코드에 전체 HTML 문서나 다른 UI 구현이 섞이지 않는지, 분리한 React 코드가 타입 검사되는지 확인합니다.

브라우저에서는 다음을 확인합니다.

- 목록 자동 반복과 상세 자동 반복, 카드 전체 링크
- 실제 조작·키보드 이동·취소·실패와 재시도
- PC·모바일 폭, 가상 키보드와 실제 터치가 필요한 경우 실기기
- HTML·React 체험과 부분 코드/전체 예제의 동일한 동작
- 새 용어에서 시뮬레이션 선택 → 기본 가이드 불러오기 → 초안 미리보기 → 게시

관리자의 ‘시뮬레이션’ 메뉴는 등록된 항목과 연결 수를 표시합니다. 코드 수정은 서버 재빌드·재시작 후 반영되고, 관리자에서 작성한 상세 콘텐츠는 DB에 저장되므로 재빌드로 덮어쓰지 않습니다.

## 3단계 모듈

`patterns.tsx`의 실행 컴포넌트와 `patterns-vanilla.mjs`의 components 대응표를 연결합니다. 이 모듈은 빌드 시 React 초기 트리를 정적 HTML로 변환하고, patternScript의 독립 실행 함수를 붙여 목록·React·HTML의 구조 차이를 줄입니다. 실행 함수는 React 상태에 접근하지 않고 DOM 이벤트로 동일한 계약을 구현해야 합니다. 생성한 부분·전체 HTML은 React 없이 실행됩니다. 날짜·파일 검증이나 흐름을 바꾸면 두 실행 형식과 자동 회귀 검사를 함께 갱신하세요.

## 커서·이미지 효과 모듈

`effects.tsx`는 17개의 독립 실행 컴포넌트와 자체 SVG 장면을 제공합니다. `registry.ts`의 `effectRegistry`, `scenes.tsx` 연결, `effects-vanilla.mjs`의 실행 함수, `effect-definitions.ts`의 원고·검색어·입력 정책을 함께 갱신합니다. 기본 가이드는 `effect-guides.ts`, 새 항목은 `effect-seeds.ts`에서 연결합니다. `catalog-effects-v1`은 기존 원고를 덮지 않고 새 항목만 한 번 추가합니다. 예제 코드는 각 실행 컴포넌트가 실제 사용하는 보조 선언만 추출하므로 다른 효과의 export 함수를 참조하지 마세요.

배경 9종은 `backgrounds.tsx`·`backgrounds-vanilla.mjs`, `registry.ts`의 `backgroundRegistry`, `background-content.ts`의 원고·검색어·가이드·시드로 연결합니다. `catalog-backgrounds-v1`은 새 항목만 추가합니다. 핫스팟은 동일한 컴포넌트 안의 두 모드이며 `hotspotPlacement`는 좌표 배치만 계산합니다. `hotspot-guide.ts`와 `hotspot-popover-v1`은 기존 원고를 보존하면서 새 사용 흐름과 예시를 덧붙입니다.

## 확장 A1·A2·A3·A4의 공통 실행·상태 계약

`expansion.tsx`는 UI별 attach 함수와 React 트리를 제공하고, `expansion-vanilla.mjs`는 같은 트리와 함수를 독립 HTML로 생성합니다. `expansion-registry.mjs`는 Node 빌드에서도 직접 읽는 고정 메타데이터이며 TS의 확장자 없는 런타임 import에 의존하지 않습니다. 명칭·원고·시드는 `expansion-content.ts`에서 관리합니다.

`scenario-contract.mjs`의 키와 원고의 `guide.examples[].id`가 일치해야 합니다. 임의 설명을 실행 상태로 추측하지 않습니다. `createScenarioController`는 상태 적용·중복 피드백 방지·타이머 정리와 nonce/source 검증을 담당합니다. 새 상태를 추가할 때는 Scene의 preset, 계약 키, 기본 원고, HTML/React 검증을 함께 변경하세요. 관리자에서는 등록된 상태를 선택해 설명만 편집합니다.

공통 설명 영역으로 iframe의 높이가 바뀔 수 있으므로 resize에서 상태를 무조건 기본으로 돌리지 마세요. 메뉴는 열린 상태를 유지하고 위치를 다시 계산합니다. 데이터 추가는 Turso에 명시적인 초안 추가 작업으로 수행하며 코드 배포보다 먼저 게시하지 않습니다.

A2 입력 UI는 같은 `expansion.tsx`·`expansion-vanilla.mjs`를 사용한다. 원고는 `input-expansion-content.ts`, 기존 입력 가이드의 추가 설명은 `input-enhancement-guides.ts`에서 관리한다. 기존 4개 초안에 설명을 추가하는 `scripts/refresh-input-guides.mjs`는 기본 미리보기이며 `--apply`에서도 게시본은 변경하지 않는다.

A3 업무 흐름 UI도 같은 Scene·attach 함수로 생성한다. `workflow-expansion-content.ts`가 신규 6개 원고, `workflow-enhancement-guides.ts`가 기존 표·정렬·필터·공유 5개의 추가 설명을 관리한다. `scripts/refresh-workflow-guides.mjs`는 기본 미리보기이며 `--apply`에서도 기존 사용자 원고·게시본을 보존하고 추가 설명만 초안에 반영한다. 현재 실제 상태 계약은 신규 18개에 적용하며 기존 77개 상태 선택은 설명용 화면이다.

포인터 캡처·IntersectionObserver·타이머는 컨트롤러 해제 시 정리한다. 터치 이동을 취소하는 리스너는 `on`의 옵션에 `passive: false`를 명시하고 같은 옵션으로 제거한다. 추가 정리 작업은 컨트롤러의 `cleanup`에 등록한다. `flow-demo-scene [hidden]` 규칙을 유지해 flex/grid 스타일이 숨긴 상태를 다시 표시하지 않도록 한다.

SNS 서비스 목록은 `share-services.mjs`를 공통으로 사용한다. 독립 React 예제에는 빌드 시 해당 메타데이터를 포함하여 저장소 상대 import 없이 실행하게 한다. SNS 게시와 링크 복사는 모의 동작이며 실패·복구·닫기·호출 버튼 초점 복귀를 두 형식에서 검수한다.

A4는 `layout-expansion-content.ts`의 신규 6개 원고와 `layout-enhancement-guides.ts`의 기존 4개 추가 설명을 사용한다. 실제 상태 계약 대상은 신규 24개다. 기존 77개의 상태 선택은 설명용 화면이며 변형은 직접 체험 내부 옵션에서 비교한다. `scripts/refresh-layout-guides.mjs`는 기본 미리보기, `--apply`는 기존 사용자 원고를 보존하는 Turso 초안 추가 작업이다.

분할 비율은 `clampSplit`으로 25~75%를 제한한다. `expansion-vanilla.mjs`는 이 순수 함수를 독립 HTML에 함께 포함한다. ResizeObserver는 입력값을 초기화하지 않고 모바일 탭을 전환한다. 스크롤 리빌은 JS 설치 전 기본 노출, 키보드 초점 진입 즉시 노출을 유지한다. 스크롤 스냅의 가로 overflow는 내부 영역의 의도된 동작이며 사이트 전체의 가로 넘침과 구분한다.

통합 검수 보정: iframe nonce는 브라우저 마운트 뒤에 생성하고 서버 초기 HTML은 준비 안내로 고정한다. demo:ready에서는 명시적 프리셋만 복원하며 새 프레임의 기본 초기화를 중복 실행하지 않는다. 부모는 현재 존재하는 example ID를 기준으로 전달해 관리자에서 선택한 예시를 삭제한 경우 기본 체험으로 돌아간다. Scroll Reveal의 명시적 프리셋은 관찰자의 늦은 콜백에 덮이지 않으며 사용자 스크롤 후 관찰로 전환한다.
