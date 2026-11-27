# 2단계: 실행·입력·탐색 UI 12개

공식 문서 확인일: 2026-11-26. 대상은 [첫 출시 50개](release-50.md)의 C01·02·03·08·09·10·11·15·18·19·28·39입니다. 구현 후 총 26개이며 남은 24개는 3·4단계입니다. 기존 밝은 카드 스타일, 900px 고정 상세 모달(화면 높이 제한), 고정 제목·닫기, 자동 루프·실제 체험 분리, 부분 코드 기본·전체 예제 선택 정책을 유지합니다.

## 실행과 시연 계약

모든 시연은 320×200 논리 캔버스와 4초 주기를 사용하며 1.7초를 대표 장면으로 등록합니다. 실제 체험은 사용자 입력으로 동작하고 서버 요청·공유·기기 음량을 변경하지 않습니다. 모의 처리 시간은 제품 권장 시간이 아닙니다.

| UI | 시연 | 실제 체험·핵심 상태 |
|---|---|---|
| Button | 0.7초 실행 → 2.1초 완료 → 3.3초 초기 | native button, Enter/Space, 650ms 저장 모의·중복 차단·성공 횟수·실패 재시도 |
| Icon Button | 0.7초 복사 도구 강조 → 2.3초 보관 결과 | 이름 있는 아이콘 버튼, 복사·공유 모의, 보관·취소·비활성·초점 복귀 |
| Toggle Button | 0.8초 굵게 → 1.9초 기울임 함께 → 3.2초 해제 | 고정 이름·aria-pressed, 독립 true/false, 실제 샘플 서식 동기화. mixed는 화면 예시로 설명 |
| Segmented Control | 월간 → 1.5초 연간 → 3.3초 월간 | 라디오 단일 선택·화살표, 월/연 요금과 기간 변경. 탭 의미나 결제 실행으로 취급하지 않음 |
| Text Field | 빈 값 → 0.7초 일부 입력 → 1.8초 완성 → 저장 안내 | 보이는 label·도움말, trim 후 2~30자, 초과값 보존·제출 오류·입력 초점·Enter 제출 |
| Textarea | 0.4초부터 문장 작성·줄바꿈 → 저장 안내 | Enter 줄바꿈, 원문 기준 최대200·trim 기준 최소10, 초과값 보존·카운트·오류·수정 |
| Search Field | 빈 값 → 0.65초 모달 조회 → 1.7초 결과 | 제출형 검색·IME Enter 가드, 400ms 모의·검색 중 차단, 1건·0건·실패·초기화. 실시간 응답 취소는 통합 시 별도 |
| Slider | 25 → 0.9초 60 → 2초 80 → 3.1초 40 | native range 0~100/step5, 방향키/Home/End, 숫자 draft·적용, 범위/단계 오류는 기존 유효값 유지 |
| Breadcrumb | 문서 → 1.2초 프로젝트 → 2.5초 작업 공간 → 복원 | nav/ol·상위 href·현재 aria-current, 로컬 목적지/제목 전환·초점. 서비스 라우터·URL 이력은 통합 시 구현 |
| Pagination | 1 → 1.1초 2 → 2.4초 3 → 복귀 | 9개를 3개씩, 이전/다음/번호·현재 페이지·경계 비활성·결과 제목 초점. 실제 서버 페이지 API는 별도 |
| Disclosure | 0.7초 열기 → 3초 접기 | native details/summary, Enter/Space, 기본 열림 의미 유지·숨김 본문. 필수 요금은 기본 노출 대안 |
| Inline Alert | 정보 → 0.9초 주의 → 1.8초 실패 → 2.9초 완료 | 지속 메시지 4종, 중요도별 status/alert, 650ms 재시도·진행·재실패·성공과 사라지는 행동의 초점 복구 |

## 콘텐츠와 코드

각 항목에 정의·용도 2개 이상·흐름 3단계·상태 화면 3개·발생 조건과 처리 방법·주의·대안·직접 체험 안내를 작성합니다. 직무별로 목표·작업 3개·전달 예·확인 항목을 제공합니다. 12개 추가로 화면 예시는 45개에서 81개가 됩니다. 정적 상태 예시는 설명용이며 실제 조작 화면과 구분합니다.

React 실제 구현·preview/time 시연은 `src/demos/foundations.tsx`, HTML 구현은 `foundations-vanilla.mjs`, 기본 원고는 `src/lib/foundation-guides.ts`, 기본 용어는 `foundation-seeds.ts`에서 관리합니다. registry와 sceneMap을 연결하고 빌더가 해당 UI의 보조 선언·CSS·실행 코드를 추출합니다. 복사 예제에는 외부 데모 소스 의존성을 남기지 않습니다.

## 데이터 보존

`catalog-foundations-v1` 이전은 신규 12개 id만 기존 목록 끝에 추가합니다. 동일 id의 사용자 콘텐츠·초안·게시본·휴지통·순서·이력은 덮어쓰지 않습니다. 이전 전 복구 JSON을 저장하고 마커로 재실행·백업 교체 뒤 자동 재생성을 막습니다. 기존 1단계 이전은 seed order 6~13, 2단계는 14~25로 범위를 분리합니다.

## 조사 근거와 해석

- [W3C APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/): 실행과 링크 구분, Enter/Space, 접근 가능한 이름, 고정 라벨의 aria-pressed. 일반·아이콘·토글의 공통 의미 근거입니다.
- [W3C APG Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/): 세그먼트 예제의 단일 값 선택과 키보드 근거입니다. Segmented Control의 모든 시스템별 용례가 라디오라는 뜻은 아닙니다.
- [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/), [Textarea](https://design-system.service.gov.uk/components/textarea/): 보이는 라벨·도움말·수정 가능한 오류, 붙여넣기·초과 원문 보존. maxlength로 조용히 자르지 않는 설계에 반영했습니다.
- [MDN input search](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search): 검색용 입력과 검색 landmark·라벨의 의미. type=search가 검색 로직을 제공하는 것은 아닙니다.
- [W3C APG Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/): 범위·단위·방향키·Home/End, 터치 보조기기 검증 필요성. 숫자 대안은 작업 완료 경로로 함께 제공합니다.
- [W3C APG Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/): 계층 링크·이름 있는 nav·현재 위치. 방문 이력과 구분합니다.
- [GOV.UK Pagination](https://design-system.service.gov.uk/components/pagination/): 전체 결과 페이지·번호·처음/끝·필터/정렬 관계. 단계형 입력 흐름에 사용하지 않습니다. 이 데모의 비활성 경계 텍스트는 실행 가능한 링크가 아닙니다.
- [W3C APG Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): 펼침 제어와 연결 본문·Enter/Space. native details 사용에서는 의미를 중복 덧붙이지 않습니다.
- [W3C APG Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/): 중요한 동적 안내와 초점 유지·자동 소멸 주의. 모든 상태를 긴급 alert로 처리하지 않으며 명시적 재시도 뒤 제거되는 버튼의 초점만 복구합니다.

## 검토 항목

등록·코드 구문·독립 타입 검사·81개 예시 및 원고 게시 검증, 새 id 중복/기존 14개 보존/한 번만 이전, React·HTML 각각의 정상·오류·키보드·복구, 1440px·390px·320px 가로 넘침·관찰·기본 부분 코드·900px 모달 유지·복사·다운로드를 확인합니다. 한글 실제 조합·OS 키보드·VoiceOver/TalkBack·실제 터치 검수는 브라우저 폭 전환과 별도로 기록합니다.
