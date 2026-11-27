# UI Notes

UI 용어의 모양·움직임·실제 조작을 함께 제공하는 사이트입니다. 기본 유형 50개·기간 선택 형태 1개·커서/이미지 효과 17개·배경 효과 9개, 총 77개 UI와 콘텐츠 관리 구조를 구현했습니다.

## 실행

Node.js 22가 필요합니다. 로컬 실행과 운영 사이트 모두 Turso DB 서버를 사용합니다. `.env.local`에 `.env.example`의 연결 정보와 관리자 로그인 설정을 넣은 뒤 실행하세요.

```sh
npm install
npm run dev
```

- 사이트: http://127.0.0.1:3000
- 다크 관리자: http://127.0.0.1:3000/admin
- 저장된 초안 미리보기: http://127.0.0.1:3000/admin/preview

macOS에서는 `start-prototype.command`로 실행할 수 있습니다. 개발 서버는 127.0.0.1에만 바인딩합니다. 관리자 로그인 후 편집·게시한 콘텐츠는 Turso에 저장되며, 로컬과 운영 사이트가 같은 DB를 사용하면 함께 반영됩니다. DB 연결 정보가 없을 때 로컬 SQLite로 자동 전환하지 않습니다.

## 구현 내용

- 밝은 배경·둥근 카드·파란 강조·카테고리 필터. 넓은 PC 4열, 중간 폭 3열, 모바일 2열.
- 이름·발음·한국어 표현·별칭·움직임 검색어·공용 태그 검색.
- 목록과 상세의 자동 반복 시연, 카드 전체 링크, 직접 조작하는 React·HTML 체험.
- 기존 14개: 모달, 바텀시트, 아코디언, 스켈레톤, 콤보박스, 데이터 그리드, 툴팁, 팝오버, 토스트, 탭, 셀렉트, 스위치, 체크박스, 라디오 그룹.
- 2단계 12개: 버튼, 아이콘 버튼, 토글 버튼, 세그먼트 컨트롤, 텍스트 필드, 텍스트에어리어, 검색 입력, 슬라이더, 브레드크럼, 페이지네이션, 디스클로저, 인라인 알림.
- 3단계 12개: 플로팅 액션 버튼, 날짜 선택기, 파일 업로드, 내비게이션 드로어, 하단 내비게이션, 메뉴 버튼, 스테퍼, 카드, 리스트, 경고 대화상자, 진행 막대, 로딩 스피너.
- 4단계 12개: 트리 뷰, 캐러셀, 데이터 테이블, 스낵바, 빈 상태, 정렬, 필터, 더 보기, 드래그 앤 드롭, 반응형 배치, 스티키 헤더, 이징.
- 상세 사용 흐름·주의점·대안, 238개 상태별 화면 예시, 4개 직무의 목표·작업·전달 예시·검토 질문.
- 상세 높이 900px(작은 화면은 가용 높이로 제한), 제목·닫기는 고정하고 본문만 스크롤. 작은 화면에서 시연 재배치와 코드 줄바꿈.
- 목록부터 분리한 단일·기간 날짜 선택기. 기간은 한 달력에서 시작일·마감일을 선택합니다. 단일·펼침 액션 버튼과 항목별 삭제·마지막 삭제 복원도 제공합니다.
- 전체 77개 실무 사용 상황·대안 비교와 대안 UI 상세 바로 이동. 대안 연결은 관리자에서 편집합니다.
- UI 부분 코드가 기본. React 컴포넌트/CSS, HTML/CSS/JavaScript를 분리해 복사·저장하며 전체 실행 예제는 선택 시 표시.
- 관리자에서 기본정보·가이드·화면 예시·직무별 안내·지원 환경·출처·별칭·검색어·태그·시뮬레이션 연결 편집.
- 초안과 게시본 분리, 저장된 초안 미리보기, 게시·게시 취소, 숨김·순서·휴지통·복원.
- 카테고리·태그 추가·이름 변경·순서 변경·삭제. 사용 중 카테고리는 다른 분류로 이동 후 삭제.
- 변경 이력 열람·새 초안으로 복원, 오래된 창의 저장·순서·복원 충돌 차단.
- 전체 콘텐츠 JSON 백업·가져오기 검토·병합·전체 교체·적용 전 자동 복구 지점. 이전 version 1 파일 변환.
- 개발자용 시뮬레이션 등록부와 등록·예제 생성 검사.

폭 전환은 레이아웃 미리보기입니다. OS 가상 키보드·실제 터치·화면 읽기 프로그램의 실기기 검증은 별도로 필요합니다. 예제의 서버 실패 등은 설명용 또는 모의 상태로 표시합니다.

## 관리자 작업

상세 절차는 [관리자 사용 안내](docs/admin-guide.md)에 있습니다.

초안 저장은 사이트에 반영되지 않습니다. 게시 시점의 스냅샷만 목록·검색·상세에 표시합니다. 숨김·휴지통·순서는 즉시 반영하고, 이력 복원은 현재 게시본을 유지한 채 새 초안을 만듭니다.

기존 SQLite 파일은 이전 자료로 보관합니다. SQLite는 테스트·명시적인 이전 작업에서만 `UI_NOTES_DB_PATH`를 지정해 사용하며, 서버 DB 연결 정보가 없을 때의 대체 저장소로 사용하지 않습니다. 기존 SQLite 데이터의 이전 로직은 명칭·요약·검색어·숨김·휴지통·순서를 보존합니다. 1단계 8개·2단계 12개·3단계 12개·4단계 12개와 별도 기간 선택 형태는 각각 기존 id를 덮어쓰지 않는 일회성 확장으로 추가하며 초안·게시본·휴지통을 보존합니다. 운영 중 가져오기 전 복구 지점은 Turso의 `checkpoints` 테이블에 저장합니다. `data/backups/`는 이전 SQLite 작업의 백업 보관 경로입니다. 재실행·빌드로 사용자 데이터를 초기화하지 않습니다.

## 구조

| 위치 | 책임 |
| --- | --- |
| `src/components/Catalog.tsx` | 공개 목록·상세·저장된 초안 미리보기 |
| `src/components/Admin.tsx` | 관리 목록·필터·상태·순서 |
| `src/components/ContentEditor.tsx` | 상세 콘텐츠·화면 예시·직무별 안내·이력 편집 |
| `src/components/StudioPanels.tsx` | 카테고리·태그·백업·시뮬레이션 등록부 |
| `src/lib/content.ts` | 콘텐츠 스키마·검증·게시 완성도 검사 |
| `src/lib/db.ts` | Turso·SQLite 트랜잭션·초안/게시·이력·백업 |
| `src/lib/guide-content.ts`, `essentials-guides.ts`, `foundation-guides.ts`, `pattern-guides.ts`, `advanced-guides.ts` | 최초 이전·새 작성에 사용하는 기본 가이드 |
| `src/demos/registry.ts` | 개발자가 등록하는 실행 동작의 메타데이터 |
| `src/demos/components.tsx`, `essentials.tsx`, `foundations.tsx`, `patterns.tsx`, `advanced.tsx`, `scenes.tsx` | React 체험·결정 가능한 자동 시연·연결 |
| `src/demos/vanilla.mjs`, `essentials-vanilla.mjs`, `foundations-vanilla.mjs`, `patterns-vanilla.mjs`, `advanced-vanilla.mjs` | 대응하는 HTML·JavaScript 체험 |
| `src/demos/scene.css` | UI별 시각 스타일 |
| `scripts/build-demos.mjs` | 등록 연결 검사·체험 번들·UI별 복사 코드 생성 |
| `app/api/` | 인증된 관리 API와 게시 콘텐츠 조회 |
| `data/ui-notes.sqlite` | 이전 SQLite 데이터 보관, 일반 실행에서 사용하지 않음 |
| `docs/planning/` | 조사·분류·디자인·모션·검토 계획 |

새 동작 등록은 [시뮬레이션 등록 절차](docs/simulation-registration.md)를 따릅니다. 실행 코드와 기본 가이드는 개발자가 추가하고, 관리자에서 실제 콘텐츠를 연결·편집합니다.

## 검사와 빌드

```sh
npm run demos
npm run typecheck
npm test
npm run build
npm start
```

`dev`와 `build`는 코드 예제를 먼저 생성합니다. 생성 파일은 소스 저장소에서 제외합니다. 저장소 테스트는 별도 임시 DB에서 수행합니다.

검증 내용은 [기존 검증 기록](docs/prototype-review.md), [1단계 검수](docs/essentials-review.md), [2단계 검수](docs/foundations-review.md), [입력·검색 오류 후속 검토](docs/input-consistency-review.md)에 정리합니다. [출시 50개 계획](docs/planning/release-50.md)과 [2단계 명세](docs/planning/foundations-spec.md)에 범위·상태·순서를 기록했습니다. 후속 단계는 전체 사용성·실기기 검증입니다.

3단계의 범위와 상태별 검수 계약은 [3단계 명세](docs/planning/patterns-spec.md), 결과는 [3단계 검수](docs/patterns-review.md)에 정리합니다. `patterns-vanilla.mjs`는 빌드 때 React 초기 트리에서 동일한 HTML을 생성하고 독립 JavaScript를 연결합니다. 내보낸 HTML에는 React 런타임 의존성이 없습니다.

최근 수정 검증: [기간 선택·펼침 버튼·실무 가이드](docs/usability-refinements.md).

최신 화면·기간 선택 분리 검증: [모달 체험·대안 카드·날짜 형태 분리](docs/modal-date-split-review.md).

4단계 구현 계약은 [4단계 명세](docs/planning/advanced-spec.md), 검증 결과는 [4단계 검수](docs/advanced-review.md)에 정리합니다.

필터 선택창·더 보기 후속 수정: [정렬·선택 패널·본문 및 요청 상태](docs/filter-load-refinement.md).

화살표 정렬과 목록·상세 형태 점검: [51개 UI 구조 비교와 후속 수정](docs/alignment-consistency-review.md).

추가 커서·이미지 효과: [참고 18개 중 기존 Carousel을 제외한 17개 구현·검수](docs/effects-review.md).

배경 효과 9종·카테고리 줄바꿈·핫스팟 말풍선: [추가 형태와 데이터 보존 검수](docs/backgrounds-hotspot-review.md).
