# 3단계: 실행·입력·탐색·피드백 12개

2026-11-26. 기존 26개 뒤에 12개를 추가해 총 38개를 구현합니다. 기존 900px 상세와 고정 제목·닫기, 카드 전체 링크, 배지 없는 자동 루프, 부분 코드 기본·전체 실행 예제 선택 정책을 유지합니다. React와 HTML에서 같은 시각 구조와 정상·오류·취소 흐름을 제공합니다.

| UI | 자동 시연(4초 루프) | 직접 체험과 검수 계약 |
|---|---|---|
| Floating Action Button | 버튼 강조 → 작성 창 → 노트 추가 | 화면당 하나의 주요 행동, 접근 가능한 이름·44px 이상, 생성 검증·취소·목록 반영 |
| Date Picker | 달력 → 후보 이동 → 11/18 선택 | 같은 달력 외형, 직접 YYYY-MM-DD 입력·달력 dialog, 2026/11~12 예시 기간·일요일·11/26 예약 불가, 날짜 실재성·키보드·취소·초점 |
| File Upload | 파일 선택 → 진행 → 완료 | 실제 파일 선택·드롭, PDF/PNG/JPG·2MB·빈 파일 검증, 실패·취소·파일 보존·다시 시작. 외부 전송 없음 |
| Navigation Drawer | 메뉴 열기 → 저장한 노트 → 닫기 | modal drawer·nav 링크·현재 위치, 목적지 제목·Esc 취소·초점 복귀 |
| Bottom Navigation | 홈 → 저장 → 내 정보 → 홈 | 주요 목적지 3개·아이콘과 라벨·현재 위치, 홈의 입력값 보존, 실제 라우터는 통합 과제 |
| Menu Button | 열기 → 항목 탐색 → 고정 | 실제 menu/menuitem 키보드·Home/End·Esc·Tab, 사본·고정·보관·되돌리기 |
| Stepper | 기본 정보 → 공개 범위 → 검토 → 완료 | 단계별 검증·이전 값 보존·완료 단계 재편집·미래 단계 건너뛰기 차단·최종 확정 |
| Card | 카드 강조 → 저장 → 상세 맥락 | article·독립된 제목 링크와 저장 버튼, 카드 전체 히트 영역에 중첩 링크 금지·저장과 열기 분리 |
| List | 완료 표시 → 모두 완료 → 빈 목록 | ul/li·제목 링크와 완료 행동 분리, 완료 숨김·전체 복원·개수 일치 |
| Alert Dialog | 삭제 요청 → 취소/삭제 확인 → 결과 | native modal+alertdialog·안전한 취소 첫 초점·삭제 중 중복 방지·실패 시 유지·복원 가능 |
| Progress Bar | 0→중간→100% | 실제 모의 진행값과 native progress, 60% 실패·취소·0부터 재시도, 완료 전 100% 금지 |
| Loading Spinner | 대기→처리 중→결과 | 비율 없는 상태, 지연 안내·취소·성공/빈 결과/오류 구분·다시 조회 |

시연은 시간값으로 결정하고 실제 요청 모의는 화면 표시 여부와 분리합니다. 모의 시간·예시 날짜는 제품의 권장값이 아닙니다. 파일 확장자·MIME 검사는 브라우저의 안내용이며 서비스의 서버 검증을 대신하지 않습니다.

각 UI에 용어·동작 검색어, 정의·사용 상황·흐름·3개 이상의 조건별 화면 예시·처리 방법·주의점·대안, 4개 직무별 목표·구체 업무 3개·협업 전달·검토 질문을 작성합니다. 추가 36개로 화면 예시는 총117개입니다. 시뮬레이션은 `patterns.tsx`/`patterns-vanilla.mjs`, 원고는 `pattern-guides.ts`, 기본 용어는 `pattern-seeds.ts`에서 관리합니다.

신규 id만 끝에 추가하는 `catalog-patterns-v1` 이전(기본 order26~37)을 사용합니다. 기존 id·초안·게시본·휴지통·분류·이력은 덮어쓰지 않고, 이전 전 복구 파일을 만듭니다. 임시 DB와 실제 DB의 원문 비교를 분리합니다.

검수는 등록·독립 코드·게시 가능 원고·검색·중복/한 번만 이전, 두 형식별 실제 정상/오류/취소, 1440px·390px·320px에서 카드·패널·코드 가로 넘침, 자동 루프·모달 높이와 고정 헤더를 포함합니다. OS 파일 선택창·모바일 키보드·실제 IME·VoiceOver/TalkBack은 실기기 후속 검증입니다.

공식 근거: [APG Date Picker](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/), [APG Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/), [APG Alert Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/), [GOV.UK File upload](https://design-system.service.gov.uk/components/file-upload/), [USWDS Step Indicator](https://designsystem.digital.gov/components/step-indicator/), [USWDS Card](https://designsystem.digital.gov/components/card/), [MDN progress](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress). 날짜는 APG의 격자·모달·초점 규칙을 단순한 고정 예약 범위에 적용한 예제이며 완전한 제품용 달력 라이브러리가 아닙니다.

추가 조사: [Android FAB](https://developer.android.com/develop/ui/compose/components/fab), [Drawer](https://developer.android.com/develop/ui/compose/components/drawer), [Navigation Bar](https://developer.android.com/develop/ui/compose/components/navigation-bar)는 목적과 변형의 근거로 확인했으며 웹 코드는 Android API를 사용하는 것이 아닙니다. [MDN ul](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul)은 목록 의미, [Carbon Loading](https://www.carbondesignsystem.com/building-blocks/core/components/loading/guidelines)은 작업 중 피드백과 문구·배치의 참고입니다. 취소 가능한 요청·모의 지연 시간은 이 프로젝트의 체험 계약이며 모든 디자인 시스템의 공통 규칙으로 일반화하지 않습니다.
