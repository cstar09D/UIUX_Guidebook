# 참고 사이트 비교와 UI 확장 조사

조사일: 2026-11-28 · 상태: **기획안 / 구현·DB 수정·배포 없음**

사용자 확정 범위: **실무 UI를 우선 추가하고 스타일·디자인 기초는 후속으로 기획한다.** 신규 제작의 상세 계약은 [확장 명세](ui-expansion-spec-2026-11-28.md), 기계적으로 추적할 전체 목록은 [기획 JSON](ui-expansion-backlog-2026-11-28.json)에 있다.

## 결론

참고 사이트의 277개는 UI 컴포넌트뿐 아니라 랜딩 구성·모션·스타일·기초 원리를 포함한다. 현재 서비스는 Turso에서 읽은 공개 77개와 소스의 77개 실행 데모를 기준으로 비교했다. 분모가 다르므로 “277 - 77 = 없는 UI”로 계산하지 않는다. 아래 수는 모두 **참고 사이트의 항목 수 기준**이며, 하나가 기존 여러 데모에 대응할 수 있다.

| 판정 | 참고 항목 수 | 처리 |
| --- | --- | --- |
| 기존 대응 | 50 | 현재 시뮬레이션 또는 그 안의 실제 기능으로 대응. 명칭·검색어 연결 검토 |
| 통합·확장 | 46 | 기존/동일 주제 안에 부족한 형태를 추가. 첫 작업은 12개 묶음으로 선정 |
| 신규 UI | 96 | 새 동작·구성에 대한 독립 시뮬레이션 후보. 24 + 24 + 후속 48개 |
| 후속 비교 학습 | 83 | 같은 콘텐츠의 전후 비교·값 조절로 가르칠 학습 콘텐츠. 이번 제작 우선순위에서 분리 |
| 보류 | 2 | 독립 학습 가치·브랜드/목적지 등 범위 재정의 후 판단 |

1차는 **신규 24개 + 기존 보강 12개 작업 묶음**을 제안한다. 24개를 독립 등록하면 등록 UI는 77→101개가 된다. 보강 12개는 데모를 중복 등록하는 수가 아니다. 2차 신규 24개까지 끝내면 125개다. 이는 선정 제안이며 실제 제작 완료 수가 아니다.

## 비교 기준과 확인 범위

- 참고 페이지에서 렌더링된 article 277개의 제목·분류·실제 data-id를 직접 수집했다. 상세는 카드 설명과 AI 요청문 중심이며 그 문장이나 미리보기 코드를 가져오지 않는다.
- 현재 서비스의 `/api/terms`는 77건이다. 로컬 `src/generated/sources.json`의 등록 데모 키도 77개로 대조했다. 현재 화면에 우연히 있는 코드 탭·배지·로그인 화면은 독립 용어가 등록되어 있다는 뜻으로 세지 않았다.
- Character Counter처럼 기존 시뮬레이션 자체에 충분히 들어 있는 기능은 대응으로 판정했다. 앱 외곽에서만 보이는 기능과 구분했다.
- UI 이름이 같은 경우에도 동작 범위가 다르면 통합·확장 또는 신규로 판정했다. 판정은 프로젝트의 편집·제작 판단이며 참고 사이트가 정한 표준 분류가 아니다.
- 이번 작업에서는 비교·기획 파일만 작성했다. Turso/로컬 SQLite/초안/게시본/관리자 설정은 수정하지 않았다.

## 참고 분류별 비교

| 참고 분류 | 전체 | 기존 대응 | 통합·확장 | 신규 UI | 후속 학습 | 보류 |
| --- | --- | --- | --- | --- | --- | --- |
| 레이아웃 | 24 | 3 | 5 | 11 | 5 | 0 |
| 랜딩 섹션 | 14 | 0 | 4 | 8 | 1 | 1 |
| 컴포넌트 | 69 | 24 | 17 | 27 | 1 | 0 |
| 입력·폼 | 34 | 12 | 8 | 14 | 0 | 0 |
| 효과 | 27 | 4 | 7 | 14 | 2 | 0 |
| 스타일 | 47 | 3 | 4 | 0 | 39 | 1 |
| 모션 | 27 | 4 | 1 | 22 | 0 | 0 |
| 디자인 기본 | 35 | 0 | 0 | 0 | 35 | 0 |

## 이름만 비교하면 틀리기 쉬운 항목

| 참고 명칭 | 현재 구현과의 관계 | 추가 방향 |
| --- | --- | --- |
| Dropdown | Select / Combobox / Menu Button은 서로 다른 과업 | 통칭은 별칭으로 검색하고 상세에서 목적별 대안을 연결 |
| Number Stepper | 현재 Stepper는 단계 진행 표시 | 숫자 입력용 number-stepper를 별도 신규 등록 |
| Infinite Scroll | 현재 Load More는 버튼으로 다음 내용을 조회 | 경계 감지·중복 요청·끝남·조회 실패를 가진 새 데모 |
| Date Range Picker | 단일 날짜와 분리된 date-range-picker가 이미 존재 | 중복 추가하지 않음 |
| Tag Input / Multi-select | 단일 Combobox와 복수 Checkbox만으로는 대응 불가 | 검색 + 칩 + 복수 ID 모델의 새 데모 |
| Share Sheet | SNS 목록이 Icon Button에 이미 존재 | 모바일 시트·같은 콘텐츠 재사용을 보강 |
| Character Counter | 텍스트 입력 8곳에 글자/UTF-8 byte 표시 존재 | 기존 공통 기능을 유지·연결 |
| Agree to All | Checkbox에 전체/부분 선택이 존재 | 필수/선택 동의와 제출 조건을 추가 |
| Data Table | 읽기 표, Sorting, 편집 Data Grid가 분리되어 있음 | 표 헤더 정렬 보강. Grid와 접근성 모델 혼동 금지 |
| Particles / Confetti | 부유 입자는 있지만 성공 시 분사되는 모션은 다름 | 트리거·수명·cleanup을 가진 Confetti 변형 추가 |
| Light Rays / God Rays | 기존 Beams는 움직이는 선형 빛줄기 | 원점에서 퍼지는 광선은 추후 변형으로 별도 검수 |
| Halftone / Risograph | 망점과 색 잉크 겹침 인쇄 질감은 동일하지 않음 | 기존 Halftone에 명칭 설명과 비교 추가 |
| Card / Card Layout / Product Card | 단일 정보 카드와 그리드 구성·상품 정보는 범위가 다름 | 기존 Card·Responsive Layout 재사용과 형태 보강 |
| Drawer | 현재는 탐색 목적의 Navigation Drawer | 보조 정보·편집·모달/비모달 차이를 기존 형태로 보강 |

## 1차 신규 24개

| 순서 | 영문 / 한국어 | 현 카테고리 | 기존 UI와의 차이 |
| --- | --- | --- | --- |
| 1 | Badge / 숫자·상태 표시 | 피드백과 상태 | 서비스 내부 상태 배지는 있으나 숫자 초과·미확인·0개를 체험할 독립 데모가 없다. |
| 2 | Chip / Tag / 선택·제거 가능한 작은 항목 | 실행과 선택 | 정적 분류 라벨과 선택·삭제 가능한 칩을 구분해 체험해야 한다. |
| 3 | Avatar / 사용자 식별 이미지 | 정보 구조와 콘텐츠 | 이미지 실패·이니셜·그룹 초과 인원 등 독립 상태가 필요하다. |
| 4 | Command Palette / 검색으로 실행하는 명령창 | 탐색과 이동 | 검색 입력과 명령 실행·단축키·키보드 선택을 결합한 새 패턴이다. |
| 5 | Context Menu / 대상에 맞춰 여는 작업 메뉴 | 레이어와 도움말 | 우클릭·길게 누르기·키보드 메뉴 열기와 화면 경계 보정이 필요하다. |
| 6 | Split Button / 기본 실행과 추가 옵션을 나눈 버튼 | 실행과 선택 | 기본 실행과 추가 메뉴를 서로 다른 초점 대상으로 분리한다. |
| 7 | Password Field / 보기·숨기기가 있는 비밀번호 입력 | 입력과 검색 | 보기/숨기기·조건·붙여넣기·오류 안내가 필요한 전용 입력이다. |
| 8 | OTP / PIN Input / 인증번호 입력 | 입력과 검색 | 전체 붙여넣기·삭제·입력 모드·만료/재전송 상태가 필요하다. |
| 9 | Multi-select / Tag Input / 여러 값을 고르는 검색 입력 | 입력과 검색 | 단일 Combobox와 달리 복수 선택·칩 삭제·중복 방지·자유 입력 정책을 다룬다. |
| 10 | Number Stepper / Spinbutton / 증감 버튼이 있는 숫자 입력 | 입력과 검색 | 단계 진행기 Stepper와 다른 숫자 증감 입력이다. 최소·최대·단위가 필요하다. |
| 11 | Time Picker / 시각 선택기 | 입력과 검색 | 날짜 선택기와 별개로 시각·간격·사용 불가 시간·범위를 입력한다. |
| 12 | Rating / 별점 입력과 평점 표시 | 입력과 검색 | 입력용 별점과 읽기 전용 평점은 역할·키보드 동작이 다르다. |
| 13 | Notification Center / 알림 목록 패널 | 피드백과 상태 | 미확인 개수·읽음·모두 읽음·빈 목록·재시도 상태를 다룬다. |
| 14 | Hover Card / 대상의 상세 미리보기 카드 | 레이어와 도움말 | 짧은 Tooltip과 달리 구조화된 사용자/링크 미리보기를 제공한다. |
| 15 | Inline Edit / 화면 안에서 바로 수정 | 입력과 검색 | 읽기→편집→저장/취소와 실패 시 입력 보존을 제자리에서 체험한다. |
| 16 | Infinite Scroll / 스크롤로 이어서 불러오기 | 조작과 데이터 탐색 | Load More와 달리 스크롤 경계로 다음 데이터를 가져오는 패턴이다. |
| 17 | Swipe Actions / 행을 밀어 실행 버튼 드러내기 | 조작과 데이터 탐색 | 스크롤과 가로 제스처 판별·행동 노출·실행 취소가 필요하다. |
| 18 | Pull to Refresh / 당겨서 새로고침 | 조작과 데이터 탐색 | 맨 위에서 당기는 거리·임계값·조회·복구가 필요한 터치 패턴이다. |
| 19 | Split View / Resizable Panels / 폭을 조절하는 분할 화면 | 레이아웃과 모션 | 단순 반응형 배치와 구분해 두 패널 폭 조절과 접힘을 체험한다. |
| 20 | Mega Menu / 여러 그룹으로 펼치는 큰 탐색 메뉴 | 탐색과 이동 | 일반 Menu Button과 다른 다열 탐색·그룹·모바일 접힘을 다룬다. |
| 21 | Scroll Reveal / 스크롤 진입 시 나타나는 콘텐츠 | 레이아웃과 모션 | 뷰포트 진입 여부로 등장 시점을 결정하는 스크롤 패턴이다. |
| 22 | Stagger Animation / 항목이 차례로 움직이는 효과 | 레이아웃과 모션 | 여러 항목의 시작 시점을 순차 지연하는 모션을 비교한다. |
| 23 | Scroll Snap / 스크롤이 지정 지점에 정착하는 영역 | 레이아웃과 모션 | 자유 스크롤과 지정 지점 정착을 비교하며 과도한 스크롤 제어를 피한다. |
| 24 | Parallax Scrolling / 스크롤 속도 차이로 만드는 깊이감 | 레이아웃과 모션 | 포인터 기울기와 달리 스크롤 진행에 따른 여러 레이어의 이동량 차이를 다룬다. |

## 기존 보강 12개 묶음

| 작업 | 대상 | 보강 내용 | 완료 확인 |
| --- | --- | --- | --- |
| E01 Dropdown의 용도 구분과 별칭 정리 | select, combobox, menu-button | 값 선택·검색형 값 선택·행동 실행의 세 카드를 비교 연결한다. Dropdown 하나를 중복 컴포넌트로 만들지 않는다. | 검색어 Dropdown에서 세 용도 설명과 대안 바로가기 확인 |
| E02 Drawer의 탐색·보조 내용·축약 형태 | navigation-drawer | 현재 탐색 드로어에 고정 사이드바·아이콘 축약·보조 정보 패널을 추가한다. 모달/비모달 여부와 초점 정책을 형태별로 명시한다. | PC 축약과 모바일 열기·닫기 후 현재 항목/내용 유지 |
| E03 버튼 표현과 비활성·초점 상태 | button | Primary/Secondary/Outline/Ghost/위험 행동·진행 중·비활성을 비교한다. 일회성 복사/저장은 성공 색상이 계속 남지 않으며 토글은 선택 강조를 유지한다. | 모든 변형의 아이콘 중심·라벨 정렬·키보드 초점·중복 실행 차단 |
| E04 입력 라벨·검증·필수·도움말 | text-field, textarea | Floating Label, 필수/선택 표시, 도움말→오류 전환과 선택적 오류 모션을 비교한다. 기존 글자/UTF-8 byte 카운터는 공통으로 유지한다. | IME·붙여넣기·오류 후 입력 유지·라벨이 placeholder처럼 사라지지 않음 |
| E05 전체 동의와 필수/선택 분리 | checkbox | 현재 전체·부분 선택에 필수 2개·선택 1개 예제를 추가한다. 선택 동의까지 전체 동의에 포함하는 정책을 명확히 표시한다. | 부분 선택·필수 충족·선택 거부·전체 해제·버튼 활성 조건 |
| E06 이미지 첨부 미리보기와 교체 | file-upload | 기존 파일 크기/형식 검증에 썸네일·교체·삭제를 추가한다. Object URL 수명과 같은 파일 재선택을 처리한다. | 이미지 오류·동일 파일 재선택·삭제 후 URL 해제·화면 폭 축소 |
| E07 표 헤더 정렬과 플랜 비교 | data-table, sorting | 읽기 표에 열 정렬을 결합하고 Comparison Table을 표현 형태로 추가한다. 편집 가능한 Data Grid와 다른 키보드 모델을 유지한다. | 오름/내림·같은 값 안정 정렬·aria-sort·미제공과 모르는 값 구분 |
| E08 필터·정렬·적용 칩 결합 | filtering, sorting | 조건과 정렬을 동시 적용하고 개별 조건 제거·초기화·빈 결과를 보여준다. 기존 목록의 카테고리 다중 선택 규칙을 보존한다. | 복수 조건 조합·칩 하나 제거·정렬 후 선택값 유지·빈 결과와 조회 실패 분리 |
| E09 SNS 공유의 PC 패널·모바일 시트 | icon-button, bottom-sheet | 현재 SNS 목록을 공통 콘텐츠로 사용해 작은 화면의 시트 형태를 추가한다. 외부 게시 없이 서비스 선택·복사 성공/실패를 체험한다. | 카카오/페이스북/X/밴드/링크 항목·Esc·초점 복귀·일회성 선택 강조 해제 |
| E10 진행률의 원형 표현 | progress-bar | 같은 0~100 값을 선형/원형으로 보여준다. 남은 양을 모르는 Spinner와 의미를 구분한다. | 0/100 경계·정확한 숫자와 SVG arc·실패·완료·모든 형식에서 동일한 값 |
| E11 스크롤 방향에 따라 숨는 헤더 | sticky-header | 아래로 읽을 때 숨기고 위로 이동하거나 헤더에 초점이 들어오면 복귀한다. 단순 position:sticky와 동작 차이를 비교한다. | 짧은 문서·빠른 방향 전환·Tab 초점 가림 없음·모바일 safe area |
| E12 부유 입자와 성공 Confetti 구분 | particles | 지속적으로 떠다니는 기존 입자와 한 번 분사되는 성공 모션을 나눈다. 성공 버튼으로 발생시키고 입자 수명·반복·정리를 제한한다. | 중복 트리거·재생 후 입자 제거·색/모션 없이도 성공 문구 제공·화면 밖 정지 |

## 2차 신규 24개와 나머지 후보

| 후속 단계 | 규모 | 목적 |
| --- | --- | --- |
| 2차 | 신규 24개 | 사이트 구성·복합 업무 흐름·이어지는 모션. 후보 목록은 다음 표 |
| 잔여 UI 백로그 | 신규 48개 | 채팅·차트·동영상·고급 텍스트 모션 등을 개별 조사 후 선정 |
| 비교 학습 백로그 | 83개 | 스타일·디자인 원리는 전용 비교 도구로 후속 기획 |
| 보류 | 2개 | App Store Badges, 특정 브랜드 유사 스타일은 범위를 다시 정의 |

| 후보 ID | 참고 명칭 | 제작 목적 |
| --- | --- | --- |
| navigation-bar | Navbar / GNB | 여러 목적지·현재 위치·모바일 메뉴 전환을 다루는 독립 상단 탐색이 필요하다. |
| hero-section | Hero Section | 현재 페이지에 히어로는 있지만 용어로 등록된 독립 데모는 없다. |
| bento-grid | Bento Grid | Masonry의 빈틈 채우기와 달리 정해진 격자에서 카드가 여러 칸을 차지한다. |
| list-detail | List-Detail Layout | 목록 선택과 상세 내용의 동기화·뒤로 가기를 체험할 독립 패턴이 필요하다. |
| table-of-contents | Table of Contents | 문서 항목으로 이동하고 현재 읽는 절을 표시하는 기능을 추가한다. |
| sticky-sidebar | Sticky Sidebar | 헤더와 달리 본문 옆 요약·구매 영역의 높이와 부모 경계를 다룬다. |
| horizontal-scroll | Horizontal Scroll | Carousel과 달리 콘텐츠를 연속적으로 옆으로 탐색하는 스크롤 영역이다. |
| pricing-table | Pricing Table | 플랜·기능·가격·선택 상태를 비교할 독립 구성이다. |
| feature-section | Feature Section | 기능을 이미지·설명으로 묶는 랜딩 섹션 데모가 없다. |
| cta-section | CTA Section | 행동 버튼만 있는 Button과 달리 설명·보조 행동을 포함한 섹션을 다룬다. |
| input-mask | Input Mask | 표시용 구분자와 실제 저장값, 붙여넣기/커서 위치의 관계를 체험한다. |
| color-picker | Color Picker | 색상 선택과 코드 직접 입력·형식 변환·잘못된 값 복구를 다룬다. |
| autosave | Autosave Indicator | 입력 대기·저장 중·완료·오프라인·실패·다시 저장을 구분한다. |
| auth-form | Login / Sign-up Form | 여러 입력과 폼 단위 오류·진행·완료를 묶는 로그인/가입 패턴이다. |
| kanban-board | Kanban Board | 현재 한 목록의 정렬과 달리 열 사이 이동·빈 열·이동 취소가 필요하다. |
| product-tour | Coachmark / Product Tour | 단계별 대상 강조·다음·이전·건너뛰기·완료가 필요한 안내 패턴이다. |
| back-to-top | Back to Top Button | 기존 헤더 데모의 상단 이동과 구분해 스크롤 임계점에 따라 표시되는 버튼을 다룬다. |
| code-block | Code Block + Copy Button | 사이트 자체 코드 탭과 별개로 코드 줄바꿈·복사 성공/실패를 가르치는 독립 데모는 없다. |
| status-indicator | Status Indicator | 색깔 점에 상태 텍스트·변경 안내를 함께 제공하는 작은 독립 예제다. |
| optimistic-ui | Optimistic UI | 먼저 반영→성공 유지/실패 롤백·재시도의 비동기 상태 패턴이다. |
| image-gallery | Image Gallery | Masonry/Lightbox와 달리 큰 이미지와 썸네일의 선택을 동기화한다. |
| scroll-progress | Scroll Progress | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| view-transition | Page / View Transition | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| marquee | Marquee / Logo Slider | 끊김 없이 흐르는 텍스트/로고와 정지·정적 목록 대안을 다룬다. |

## 전체 277개 대조표

‘후속’은 누락이 아니라 이번 1차 구현에서 의도적으로 분리한 항목이다. targetIds는 기존 등록 ID 또는 제안한 신규 ID다. 후속 학습용 ID는 구현/DB에 등록하지 않았다. 같은 상호작용은 새 용어로 중복 구현하지 않는다.

### 레이아웃

| # | 참고 용어 | 판정 / 단계 | 연결·제안 ID | 판정 근거 |
| --- | --- | --- | --- | --- |
| 1 | [Hero Section](https://ui-terms-cheatsheet.pages.dev/#hero) | 신규 UI / P2 | hero-section | 현재 페이지에 히어로는 있지만 용어로 등록된 독립 데모는 없다. |
| 2 | [Responsive Layout](https://ui-terms-cheatsheet.pages.dev/#responsive) | 기존 대응 / existing | responsive-layout | 화면 폭에 따른 배치 전환을 기존 데모에서 체험할 수 있다. |
| 3 | [Card Layout](https://ui-terms-cheatsheet.pages.dev/#card) | 통합·확장 / P3 | responsive-layout, card | 단일 Card와 반응형 데모에 균일 카드 그리드·목록 전환 비교를 추가한다. |
| 4 | [Bento Grid](https://ui-terms-cheatsheet.pages.dev/#bento) | 신규 UI / P2 | bento-grid | Masonry의 빈틈 채우기와 달리 정해진 격자에서 카드가 여러 칸을 차지한다. |
| 5 | [Sidebar Layout](https://ui-terms-cheatsheet.pages.dev/#sidebar) | 통합·확장 / P1 | navigation-drawer, responsive-layout | 기존 드로어에 넓은 화면 고정 사이드바와 콘텐츠 폭 변화를 비교한다. |
| 6 | [Sticky Header](https://ui-terms-cheatsheet.pages.dev/#sticky) | 기존 대응 / existing | sticky-header | 스크롤 영역에 붙는 헤더와 고정 해제 기능이 있다. |
| 7 | [Split Layout](https://ui-terms-cheatsheet.pages.dev/#split) | 신규 UI / P1 | split-view | 단순 반응형 배치와 구분해 두 패널 폭 조절과 접힘을 체험한다. |
| 8 | [Navbar / GNB](https://ui-terms-cheatsheet.pages.dev/#navbar) | 신규 UI / P2 | navigation-bar | 여러 목적지·현재 위치·모바일 메뉴 전환을 다루는 독립 상단 탐색이 필요하다. |
| 9 | [Footer](https://ui-terms-cheatsheet.pages.dev/#footer) | 신규 UI / P3 | footer | 사이트 공통 하단 정보는 앱에 존재하지만 콘텐츠용 독립 데모는 없다. |
| 10 | [Masonry Layout](https://ui-terms-cheatsheet.pages.dev/#masonry) | 기존 대응 / existing | masonry | 높이가 다른 이미지의 격자 배치가 등록되어 있다. |
| 11 | [Grid System (12-column)](https://ui-terms-cheatsheet.pages.dev/#grid12) | 후속 비교 학습 / later-learning | grid-system | 열 수·거터·영역 span을 조절하는 배치 비교 학습으로 설계한다. |
| 12 | [Container / Max-width](https://ui-terms-cheatsheet.pages.dev/#container) | 후속 비교 학습 / later-learning | container-width | 최대 너비·좌우 여백·유동 폭 비교를 같은 화면으로 보여준다. |
| 13 | [Above the Fold](https://ui-terms-cheatsheet.pages.dev/#fold) | 후속 비교 학습 / later-learning | above-the-fold | 기기 높이에 따라 첫 화면 범위가 달라지는 개념이며 컴포넌트가 아니다. |
| 14 | [Dashboard Layout](https://ui-terms-cheatsheet.pages.dev/#dashboard) | 신규 UI / P3 | dashboard-layout | 사이드바·KPI·표·빈 상태를 결합한 대시보드 구성 데모가 없다. |
| 15 | [List-Detail Layout](https://ui-terms-cheatsheet.pages.dev/#listdetail) | 신규 UI / P2 | list-detail | 목록 선택과 상세 내용의 동기화·뒤로 가기를 체험할 독립 패턴이 필요하다. |
| 16 | [Mega Menu](https://ui-terms-cheatsheet.pages.dev/#megamenu) | 신규 UI / P1 | mega-menu | 일반 Menu Button과 다른 다열 탐색·그룹·모바일 접힘을 다룬다. |
| 17 | [Table of Contents](https://ui-terms-cheatsheet.pages.dev/#toc) | 신규 UI / P2 | table-of-contents | 문서 항목으로 이동하고 현재 읽는 절을 표시하는 기능을 추가한다. |
| 18 | [F / Z Pattern](https://ui-terms-cheatsheet.pages.dev/#fzpattern) | 후속 비교 학습 / later-learning | reading-patterns | F/Z는 모든 화면의 필수 규칙으로 단정하지 않고 읽기 흐름 비교로 다룬다. |
| 19 | [Zigzag Layout](https://ui-terms-cheatsheet.pages.dev/#zigzag) | 후속 비교 학습 / later-learning | zigzag-layout | 이미지·문구 배치와 모바일 읽기 순서를 비교하는 구성 학습으로 다룬다. |
| 20 | [Sticky Sidebar](https://ui-terms-cheatsheet.pages.dev/#stickysidebar) | 신규 UI / P2 | sticky-sidebar | 헤더와 달리 본문 옆 요약·구매 영역의 높이와 부모 경계를 다룬다. |
| 21 | [Centered Layout](https://ui-terms-cheatsheet.pages.dev/#centered) | 통합·확장 / P3 | responsive-layout | 기존 반응형 데모에 세로·가로 가운데 배치와 긴 내용 예외를 추가한다. |
| 22 | [Full-screen Section](https://ui-terms-cheatsheet.pages.dev/#fullscreen) | 통합·확장 / P3 | responsive-layout | 전체 높이 화면과 작은 기기·주소창·키보드 영향 비교를 추가한다. |
| 23 | [Horizontal Scroll](https://ui-terms-cheatsheet.pages.dev/#hscroll) | 신규 UI / P2 | horizontal-scroll | Carousel과 달리 콘텐츠를 연속적으로 옆으로 탐색하는 스크롤 영역이다. |
| 24 | [Collapsible Sidebar](https://ui-terms-cheatsheet.pages.dev/#minisidebar) | 통합·확장 / P1 | navigation-drawer | 사이드바의 아이콘 축약·라벨 복귀·현재 위치 유지 형태를 추가한다. |

### 랜딩 섹션

| # | 참고 용어 | 판정 / 단계 | 연결·제안 ID | 판정 근거 |
| --- | --- | --- | --- | --- |
| 25 | [Feature Section](https://ui-terms-cheatsheet.pages.dev/#feature) | 신규 UI / P2 | feature-section | 기능을 이미지·설명으로 묶는 랜딩 섹션 데모가 없다. |
| 26 | [Pricing Table](https://ui-terms-cheatsheet.pages.dev/#pricing) | 신규 UI / P2 | pricing-table | 플랜·기능·가격·선택 상태를 비교할 독립 구성이다. |
| 27 | [Pricing Toggle](https://ui-terms-cheatsheet.pages.dev/#pricetoggle) | 통합·확장 / P3 | segmented-control | 월간/연간 선택과 금액·청구 단위 동기화 예제를 추가한다. |
| 28 | [Testimonial](https://ui-terms-cheatsheet.pages.dev/#testimonial) | 신규 UI / P3 | testimonial | 후기 카드·작성자·출처·길이 차이를 비교하는 구성이다. |
| 29 | [FAQ Section](https://ui-terms-cheatsheet.pages.dev/#faq) | 통합·확장 / P3 | accordion | FAQ는 기존 아코디언을 목적별 예제로 확장하면 충분하다. |
| 30 | [Logo Cloud](https://ui-terms-cheatsheet.pages.dev/#logocloud) | 신규 UI / P3 | logo-cloud | 정적 로고 묶음과 작은 화면 줄바꿈을 다룬다. 무한 이동은 Marquee에 연결한다. |
| 31 | [Stats Section](https://ui-terms-cheatsheet.pages.dev/#stats) | 신규 UI / P3 | stats-section | 여러 수치의 단위·기준 시점·변화 방향을 묶는 독립 구성이다. |
| 32 | [CTA Section](https://ui-terms-cheatsheet.pages.dev/#ctasection) | 신규 UI / P2 | cta-section | 행동 버튼만 있는 Button과 달리 설명·보조 행동을 포함한 섹션을 다룬다. |
| 33 | [Comparison Table](https://ui-terms-cheatsheet.pages.dev/#comparison) | 통합·확장 / P1 | data-table | 테이블에 플랜별 기능 비교·제공/미제공/불명 구분 형태를 추가한다. |
| 34 | [How It Works](https://ui-terms-cheatsheet.pages.dev/#howitworks) | 통합·확장 / P3 | stepper | 정적인 이용 안내와 입력 단계 진행기의 차이를 기존 Stepper에서 비교한다. |
| 35 | [Newsletter / Waitlist Form](https://ui-terms-cheatsheet.pages.dev/#newsletter) | 신규 UI / P3 | newsletter-form | 이메일 입력만이 아니라 제출·중복·실패·완료 피드백의 조합이다. |
| 36 | [Contact Section](https://ui-terms-cheatsheet.pages.dev/#contact) | 신규 UI / P3 | contact-form | 문의를 보내는 복합 폼과 오류 요약·입력 보존을 다루는 새 예제다. |
| 37 | [Trust Badges](https://ui-terms-cheatsheet.pages.dev/#trustbadge) | 후속 비교 학습 / later-learning | trust-signals | 보증·후기·운영 정보의 역할을 비교하며 실제로 없는 인증을 표기하지 않는다. |
| 38 | [App Store Badges](https://ui-terms-cheatsheet.pages.dev/#appbadge) | 보류 / hold | app-store-badges | 독립 상호작용 가치가 낮다. 실제 앱 목적지와 공식 배지 자산 사용 범위 결정 후 다룬다. |

### 컴포넌트

| # | 참고 용어 | 판정 / 단계 | 연결·제안 ID | 판정 근거 |
| --- | --- | --- | --- | --- |
| 39 | [Tabs](https://ui-terms-cheatsheet.pages.dev/#tabs) | 기존 대응 / existing | tabs | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 40 | [Accordion](https://ui-terms-cheatsheet.pages.dev/#accordion) | 기존 대응 / existing | accordion | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 41 | [Modal / Dialog](https://ui-terms-cheatsheet.pages.dev/#modal) | 기존 대응 / existing | modal | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 44 | [Tooltip](https://ui-terms-cheatsheet.pages.dev/#tooltip) | 기존 대응 / existing | tooltip | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 45 | [Toast / Snackbar](https://ui-terms-cheatsheet.pages.dev/#toast) | 기존 대응 / existing | toast, snackbar | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 46 | [Carousel](https://ui-terms-cheatsheet.pages.dev/#carousel) | 기존 대응 / existing | carousel | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 47 | [Skeleton Loading](https://ui-terms-cheatsheet.pages.dev/#skeleton) | 기존 대응 / existing | skeleton | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 48 | [Popover](https://ui-terms-cheatsheet.pages.dev/#popover) | 기존 대응 / existing | popover | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 49 | [Bottom Sheet](https://ui-terms-cheatsheet.pages.dev/#bottomsheet) | 기존 대응 / existing | bottom-sheet | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 51 | [Breadcrumb](https://ui-terms-cheatsheet.pages.dev/#breadcrumb) | 기존 대응 / existing | breadcrumb | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 52 | [Pagination](https://ui-terms-cheatsheet.pages.dev/#pagination) | 기존 대응 / existing | pagination | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 56 | [Toggle Switch](https://ui-terms-cheatsheet.pages.dev/#toggle) | 기존 대응 / existing | switch | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 57 | [Stepper](https://ui-terms-cheatsheet.pages.dev/#stepper) | 기존 대응 / existing | stepper | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 58 | [Progress Bar](https://ui-terms-cheatsheet.pages.dev/#progress) | 기존 대응 / existing | progress-bar | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 59 | [Spinner / Loader](https://ui-terms-cheatsheet.pages.dev/#spinner) | 기존 대응 / existing | loading-spinner | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 61 | [Segmented Control](https://ui-terms-cheatsheet.pages.dev/#segmented) | 기존 대응 / existing | segmented-control | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 63 | [Floating Action Button](https://ui-terms-cheatsheet.pages.dev/#fab) | 기존 대응 / existing | floating-action-button | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 64 | [Empty State](https://ui-terms-cheatsheet.pages.dev/#empty) | 기존 대응 / existing | empty-state | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 66 | [Bottom Navigation](https://ui-terms-cheatsheet.pages.dev/#bottomnav) | 기존 대응 / existing | bottom-navigation | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 70 | [Lightbox](https://ui-terms-cheatsheet.pages.dev/#lightbox) | 기존 대응 / existing | lightbox | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 73 | [Tree View](https://ui-terms-cheatsheet.pages.dev/#treeview) | 기존 대응 / existing | tree-view | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 82 | [Confirm Dialog](https://ui-terms-cheatsheet.pages.dev/#confirm) | 기존 대응 / existing | alert-dialog | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 104 | [Icon Button](https://ui-terms-cheatsheet.pages.dev/#iconbutton) | 기존 대응 / existing | icon-button | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 107 | [Before / After Slider](https://ui-terms-cheatsheet.pages.dev/#beforeafter) | 기존 대응 / existing | before-after-slider | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 42 | [Drawer](https://ui-terms-cheatsheet.pages.dev/#drawer) | 통합·확장 / P1 | navigation-drawer | 탐색 메뉴 구현은 있다. 보조 내용·편집 패널과 모달/비모달 차이는 추가해야 한다. |
| 43 | [Dropdown](https://ui-terms-cheatsheet.pages.dev/#dropdown) | 통합·확장 / P1 | select, menu-button, combobox | Dropdown은 통칭이다. 값 선택·행동 메뉴·검색형 선택으로 나눠 연결한다. |
| 50 | [Hamburger Menu](https://ui-terms-cheatsheet.pages.dev/#hamburger) | 통합·확장 / P1 | navigation-drawer, menu-button | 햄버거는 메뉴를 여는 아이콘 형태다. 아이콘·라벨·확장 상태를 기존 데모에 추가한다. |
| 53 | [Badge](https://ui-terms-cheatsheet.pages.dev/#badge) | 신규 UI / P1 | badge | 서비스 내부 상태 배지는 있으나 숫자 초과·미확인·0개를 체험할 독립 데모가 없다. |
| 54 | [Chip / Tag](https://ui-terms-cheatsheet.pages.dev/#chip) | 신규 UI / P1 | chip-tag | 정적 분류 라벨과 선택·삭제 가능한 칩을 구분해 체험해야 한다. |
| 55 | [Avatar](https://ui-terms-cheatsheet.pages.dev/#avatar) | 신규 UI / P1 | avatar | 이미지 실패·이니셜·그룹 초과 인원 등 독립 상태가 필요하다. |
| 60 | [Command Palette](https://ui-terms-cheatsheet.pages.dev/#command) | 신규 UI / P1 | command-palette | 검색 입력과 명령 실행·단축키·키보드 선택을 결합한 새 패턴이다. |
| 62 | [Data Table](https://ui-terms-cheatsheet.pages.dev/#datatable) | 통합·확장 / P1 | data-table, sorting | 현재 읽기 표와 별도 정렬을 표 헤더 정렬·현재 정렬 안내로 결합한다. |
| 65 | [Alert / Banner](https://ui-terms-cheatsheet.pages.dev/#banner) | 통합·확장 / P3 | inline-alert | 인라인 오류와 페이지 전체 공지 띠는 범위가 다르므로 배너 형태·닫기 규칙을 추가한다. |
| 67 | [Kebab / Meatball Menu](https://ui-terms-cheatsheet.pages.dev/#kebab) | 통합·확장 / P3 | menu-button, icon-button | 가로/세로 점 아이콘을 누르는 기존 동작 메뉴의 파생 형태로 관리한다. |
| 68 | [Context Menu](https://ui-terms-cheatsheet.pages.dev/#contextmenu) | 신규 UI / P1 | context-menu | 우클릭·길게 누르기·키보드 메뉴 열기와 화면 경계 보정이 필요하다. |
| 69 | [Split Button](https://ui-terms-cheatsheet.pages.dev/#splitbutton) | 신규 UI / P1 | split-button | 기본 실행과 추가 메뉴를 서로 다른 초점 대상으로 분리한다. |
| 71 | [Timeline](https://ui-terms-cheatsheet.pages.dev/#timeline) | 신규 UI / P3 | timeline | 시간순 기록과 단계 진행 표시기는 의미가 다르다. |
| 72 | [Kanban Board](https://ui-terms-cheatsheet.pages.dev/#kanban) | 신규 UI / P2 | kanban-board | 현재 한 목록의 정렬과 달리 열 사이 이동·빈 열·이동 취소가 필요하다. |
| 74 | [Stat / KPI Card](https://ui-terms-cheatsheet.pages.dev/#statcard) | 통합·확장 / P3 | card, progress-bar | 일반 카드에 지표의 단위·기준·증감 표기를 추가한다. 차트 전체 구현과 구분한다. |
| 75 | [Coachmark / Product Tour](https://ui-terms-cheatsheet.pages.dev/#coachmark) | 신규 UI / P2 | product-tour | 단계별 대상 강조·다음·이전·건너뛰기·완료가 필요한 안내 패턴이다. |
| 76 | [Cookie Consent Bar](https://ui-terms-cheatsheet.pages.dev/#cookie) | 신규 UI / P3 | consent-banner | 동의·거부·세부 설정을 비교하는 모의 설정 UI로 설계한다. 실제 추적 도구 연동은 별도다. |
| 77 | [Back to Top Button](https://ui-terms-cheatsheet.pages.dev/#backtotop) | 신규 UI / P2 | back-to-top | 기존 헤더 데모의 상단 이동과 구분해 스크롤 임계점에 따라 표시되는 버튼을 다룬다. |
| 78 | [Code Block + Copy Button](https://ui-terms-cheatsheet.pages.dev/#codeblock) | 신규 UI / P2 | code-block | 사이트 자체 코드 탭과 별개로 코드 줄바꿈·복사 성공/실패를 가르치는 독립 데모는 없다. |
| 79 | [Chat Bubble](https://ui-terms-cheatsheet.pages.dev/#chatbubble) | 신규 UI / P3 | chat-thread | 말풍선·전송 중·실패·재전송·시간 순서를 다루는 독립 대화 UI다. |
| 80 | [Info Button / Toggletip](https://ui-terms-cheatsheet.pages.dev/#infobutton) | 통합·확장 / P3 | popover, tooltip | 클릭해서 유지되는 설명은 Tooltip과 달라 Popover의 설명형 변형으로 연결한다. |
| 81 | [Callout / Info Box](https://ui-terms-cheatsheet.pages.dev/#callout) | 통합·확장 / P3 | inline-alert | 행동 없는 보충 설명 상자와 긴급 상태 알림의 차이를 기존 안내 예제로 비교한다. |
| 83 | [Action Sheet](https://ui-terms-cheatsheet.pages.dev/#actionsheet) | 통합·확장 / P3 | bottom-sheet, menu-button | 하단 패널에 단일 행동 목록·취소·위험 행동 구분을 추가한다. |
| 84 | [Share Sheet](https://ui-terms-cheatsheet.pages.dev/#sharesheet) | 통합·확장 / P1 | icon-button, bottom-sheet | SNS 선택 목록은 이미 Icon Button 안에 있다. 독립 중복 구현 대신 모바일 시트 형태와 연결을 보강한다. |
| 85 | [Notification Center](https://ui-terms-cheatsheet.pages.dev/#notifcenter) | 신규 UI / P1 | notification-center | 미확인 개수·읽음·모두 읽음·빈 목록·재시도 상태를 다룬다. |
| 86 | [Profile Menu](https://ui-terms-cheatsheet.pages.dev/#profilemenu) | 통합·확장 / P3 | menu-button | 프로필·설정·계정 전환·로그아웃 예제를 기존 메뉴에 추가한다. |
| 87 | [Hover Card](https://ui-terms-cheatsheet.pages.dev/#hovercard) | 신규 UI / P1 | hover-card | 짧은 Tooltip과 달리 구조화된 사용자/링크 미리보기를 제공한다. |
| 88 | [Promo Popup](https://ui-terms-cheatsheet.pages.dev/#promopopup) | 통합·확장 / P3 | modal | 이벤트 모달은 노출 조건·다시 보지 않기·닫기 상태를 기존 모달에 추가한다. |
| 89 | [Chat Widget](https://ui-terms-cheatsheet.pages.dev/#chatwidget) | 신규 UI / P3 | chat-widget | 구석 실행 버튼과 상담창 열기·최소화·미확인 수를 결합한다. |
| 90 | [Sticky Bottom Bar](https://ui-terms-cheatsheet.pages.dev/#stickybar) | 신규 UI / P3 | sticky-bottom-bar | FAB와 달리 가격·선택 요약·주요 행동이 함께 붙는 영역이다. |
| 91 | [Top App Bar](https://ui-terms-cheatsheet.pages.dev/#appbar) | 신규 UI / P3 | top-app-bar | 뒤로 가기·문맥 제목·보조 행동과 화면 내비게이션을 다룬다. |
| 92 | [Divider](https://ui-terms-cheatsheet.pages.dev/#divider) | 후속 비교 학습 / later-learning | divider | 장식 구분선·의미 있는 구분·텍스트 구분자를 비교한다. |
| 93 | [Status Indicator](https://ui-terms-cheatsheet.pages.dev/#statusdot) | 신규 UI / P2 | status-indicator | 색깔 점에 상태 텍스트·변경 안내를 함께 제공하는 작은 독립 예제다. |
| 94 | [Countdown Timer](https://ui-terms-cheatsheet.pages.dev/#countdown) | 신규 UI / P3 | countdown | 남은 시간·만료·일시 정지·기준 시각을 다루는 타이머 UI다. |
| 95 | [Chart (Bar / Line / Donut)](https://ui-terms-cheatsheet.pages.dev/#chart) | 신규 UI / P3 | charts | 막대·선·도넛의 질문 차이와 데이터 표 대안을 함께 제공한다. |
| 96 | [Progress Ring](https://ui-terms-cheatsheet.pages.dev/#progressring) | 통합·확장 / P1 | progress-bar | 선형·원형 표현은 같은 진행값을 공유하는 비교 형태로 확장한다. |
| 97 | [Video Player](https://ui-terms-cheatsheet.pages.dev/#videoplayer) | 신규 UI / P3 | video-player | 재생·탐색·음량·자막·포스터·재생 실패를 다루는 독립 플레이어다. |
| 98 | [Product Card](https://ui-terms-cheatsheet.pages.dev/#productcard) | 통합·확장 / P3 | card, toggle-button | 상품 카드에 가격·할인·찜·품절 등 의미가 다른 요소를 추가한다. |
| 99 | [Image Gallery](https://ui-terms-cheatsheet.pages.dev/#imggallery) | 신규 UI / P2 | image-gallery | Masonry/Lightbox와 달리 큰 이미지와 썸네일의 선택을 동기화한다. |
| 100 | [Comment Thread](https://ui-terms-cheatsheet.pages.dev/#comment) | 신규 UI / P3 | comment-thread | 대댓글 깊이·접힘·작성·삭제·실패를 다루는 독립 패턴이다. |
| 101 | [Filter & Sort](https://ui-terms-cheatsheet.pages.dev/#filterbar) | 통합·확장 / P1 | filtering, sorting | 조건과 정렬을 함께 적용하고 칩 제거·전체 초기화·URL 상태 예제를 결합한다. |
| 102 | [Calendar View](https://ui-terms-cheatsheet.pages.dev/#calendarview) | 신규 UI / P3 | calendar-view | 날짜 값을 고르는 Date Picker와 달리 일정 정보를 월·주·목록으로 탐색한다. |
| 103 | [Show More / Read More](https://ui-terms-cheatsheet.pages.dev/#readmore) | 통합·확장 / P3 | disclosure, load-more | 기존 내용 펼치기와 새 데이터 추가 조회를 구분하고 별칭으로 연결한다. |
| 105 | [404 / Error Page](https://ui-terms-cheatsheet.pages.dev/#errorpage) | 신규 UI / P3 | error-page | 404·권한 거부·서버 오류를 다른 원인/행동으로 보여주는 페이지 패턴이다. |
| 106 | [Onboarding Screens](https://ui-terms-cheatsheet.pages.dev/#onboarding) | 신규 UI / P3 | onboarding | 처음 실행 소개·건너뛰기·완료·다시 보기를 다루는 흐름이다. |

### 입력·폼

| # | 참고 용어 | 판정 / 단계 | 연결·제안 ID | 판정 근거 |
| --- | --- | --- | --- | --- |
| 108 | [Input / Text Field](https://ui-terms-cheatsheet.pages.dev/#textfield) | 기존 대응 / existing | text-field | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 110 | [Checkbox](https://ui-terms-cheatsheet.pages.dev/#checkbox) | 기존 대응 / existing | checkbox | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 111 | [Radio Button](https://ui-terms-cheatsheet.pages.dev/#radio) | 기존 대응 / existing | radio-group | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 112 | [Autocomplete / Combobox](https://ui-terms-cheatsheet.pages.dev/#combobox) | 기존 대응 / existing | combobox | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 113 | [Range Slider](https://ui-terms-cheatsheet.pages.dev/#slider) | 기존 대응 / existing | slider | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 114 | [Search Bar](https://ui-terms-cheatsheet.pages.dev/#search) | 기존 대응 / existing | search-field | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 118 | [Date Picker](https://ui-terms-cheatsheet.pages.dev/#datepicker) | 기존 대응 / existing | date-picker | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 119 | [File Upload / Dropzone](https://ui-terms-cheatsheet.pages.dev/#dropzone) | 기존 대응 / existing | file-upload | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 120 | [Select](https://ui-terms-cheatsheet.pages.dev/#select) | 기존 대응 / existing | select | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 121 | [Textarea](https://ui-terms-cheatsheet.pages.dev/#textarea) | 기존 대응 / existing | textarea | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 126 | [Date Range Picker](https://ui-terms-cheatsheet.pages.dev/#daterange) | 기존 대응 / existing | date-range-picker | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 109 | [Floating Label](https://ui-terms-cheatsheet.pages.dev/#floating) | 통합·확장 / P1 | text-field | placeholder 대신 보이는 라벨을 유지하는 Floating Label 형태를 추가한다. |
| 115 | [Validation / Error State](https://ui-terms-cheatsheet.pages.dev/#validation) | 통합·확장 / P1 | text-field, textarea | 필드 오류·오류 요약·성공 피드백은 기존 폼 체험의 확장이다. |
| 116 | [Disabled State](https://ui-terms-cheatsheet.pages.dev/#disabled) | 통합·확장 / P1 | button, text-field | 비활성 이유·진행 중·읽기 전용을 기존 예제에서 나눠 설명한다. |
| 117 | [Focus State / Focus Ring](https://ui-terms-cheatsheet.pages.dev/#focus) | 통합·확장 / P1 | button, text-field | 포커스 링은 이미 있으나 클릭/키보드 초점 차이·고대비 비교 설명을 보강한다. |
| 122 | [Password Field](https://ui-terms-cheatsheet.pages.dev/#password) | 신규 UI / P1 | password-field | 보기/숨기기·조건·붙여넣기·오류 안내가 필요한 전용 입력이다. |
| 123 | [OTP / PIN Input](https://ui-terms-cheatsheet.pages.dev/#otp) | 신규 UI / P1 | otp-input | 전체 붙여넣기·삭제·입력 모드·만료/재전송 상태가 필요하다. |
| 124 | [Tag Input / Multi-select](https://ui-terms-cheatsheet.pages.dev/#taginput) | 신규 UI / P1 | multi-select | 단일 Combobox와 달리 복수 선택·칩 삭제·중복 방지·자유 입력 정책을 다룬다. |
| 125 | [Number Stepper](https://ui-terms-cheatsheet.pages.dev/#numberstepper) | 신규 UI / P1 | number-stepper | 단계 진행기 Stepper와 다른 숫자 증감 입력이다. 최소·최대·단위가 필요하다. |
| 127 | [Time Picker](https://ui-terms-cheatsheet.pages.dev/#timepicker) | 신규 UI / P1 | time-picker | 날짜 선택기와 별개로 시각·간격·사용 불가 시간·범위를 입력한다. |
| 128 | [Input Mask](https://ui-terms-cheatsheet.pages.dev/#inputmask) | 신규 UI / P2 | input-mask | 표시용 구분자와 실제 저장값, 붙여넣기/커서 위치의 관계를 체험한다. |
| 129 | [Character Counter](https://ui-terms-cheatsheet.pages.dev/#charcount) | 기존 대응 / existing | text-field, textarea | 8개 텍스트 입력에 글자 수와 UTF-8 byte 표시가 이미 적용되어 있다. |
| 130 | [Helper Text](https://ui-terms-cheatsheet.pages.dev/#helpertext) | 통합·확장 / P1 | text-field, textarea | 도움말·오류·카운터를 필드와 연결하는 설명을 기존 예제에서 보강한다. |
| 131 | [Required Indicator](https://ui-terms-cheatsheet.pages.dev/#required) | 통합·확장 / P1 | text-field, radio-group | 별표만 사용하는 경우와 필수/선택 텍스트를 함께 쓰는 경우를 비교한다. |
| 132 | [Rich Text Editor](https://ui-terms-cheatsheet.pages.dev/#richtext) | 신규 UI / P3 | rich-text-editor | 일반 Textarea와 다른 서식·선택 영역·실행 취소·정리된 출력이 필요하다. |
| 133 | [Social Login Button](https://ui-terms-cheatsheet.pages.dev/#sociallogin) | 신규 UI / P3 | social-login | 제공자 버튼·처리 중·취소·실패를 모의 체험한다. 실제 OAuth 연결은 범위 밖이다. |
| 134 | [Rating](https://ui-terms-cheatsheet.pages.dev/#rating) | 신규 UI / P1 | rating | 입력용 별점과 읽기 전용 평점은 역할·키보드 동작이 다르다. |
| 135 | [Agree to All](https://ui-terms-cheatsheet.pages.dev/#agreeall) | 통합·확장 / P1 | checkbox | 이미 전체 선택/부분 선택이 있다. 필수·선택 동의와 제출 조건 예제를 추가한다. |
| 136 | [Color Picker](https://ui-terms-cheatsheet.pages.dev/#colorpicker) | 신규 UI / P2 | color-picker | 색상 선택과 코드 직접 입력·형식 변환·잘못된 값 복구를 다룬다. |
| 137 | [Image Upload Preview](https://ui-terms-cheatsheet.pages.dev/#imgupload) | 통합·확장 / P1 | file-upload | 기존 파일 검증에 실제 이미지 미리보기·교체·삭제·URL 해제를 추가한다. |
| 138 | [Autosave Indicator](https://ui-terms-cheatsheet.pages.dev/#autosave) | 신규 UI / P2 | autosave | 입력 대기·저장 중·완료·오프라인·실패·다시 저장을 구분한다. |
| 139 | [Inline Edit](https://ui-terms-cheatsheet.pages.dev/#inlineedit) | 신규 UI / P1 | inline-edit | 읽기→편집→저장/취소와 실패 시 입력 보존을 제자리에서 체험한다. |
| 140 | [Address Search](https://ui-terms-cheatsheet.pages.dev/#address) | 신규 UI / P3 | address-search | 주소 후보·빈 결과·선택·상세 주소를 로컬 예제 데이터로 체험한다. |
| 141 | [Login / Sign-up Form](https://ui-terms-cheatsheet.pages.dev/#authform) | 신규 UI / P2 | auth-form | 여러 입력과 폼 단위 오류·진행·완료를 묶는 로그인/가입 패턴이다. |

### 효과

| # | 참고 용어 | 판정 / 단계 | 연결·제안 ID | 판정 근거 |
| --- | --- | --- | --- | --- |
| 151 | [Ripple Effect](https://ui-terms-cheatsheet.pages.dev/#ripple) | 기존 대응 / existing | ripple | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 156 | [Easing](https://ui-terms-cheatsheet.pages.dev/#easing) | 기존 대응 / existing | easing | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 158 | [Spotlight / Cursor Glow](https://ui-terms-cheatsheet.pages.dev/#spotlight) | 기존 대응 / existing | spotlight | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 159 | [Drag & Drop Reorder](https://ui-terms-cheatsheet.pages.dev/#dragdrop) | 기존 대응 / existing | drag-and-drop | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 142 | [Hover Effect](https://ui-terms-cheatsheet.pages.dev/#hover) | 통합·확장 / P3 | button, card, hover-reveal | Hover는 통칭이므로 기존 hover·focus·tap 예제들을 묶어 검색한다. |
| 143 | [Scroll Reveal](https://ui-terms-cheatsheet.pages.dev/#reveal) | 신규 UI / P1 | scroll-reveal | 뷰포트 진입 여부로 등장 시점을 결정하는 스크롤 패턴이다. |
| 144 | [Stagger Animation](https://ui-terms-cheatsheet.pages.dev/#stagger) | 신규 UI / P1 | stagger-animation | 여러 항목의 시작 시점을 순차 지연하는 모션을 비교한다. |
| 145 | [Smooth Transition](https://ui-terms-cheatsheet.pages.dev/#smooth) | 통합·확장 / P3 | easing | 속도 곡선뿐 아니라 속성·지속 시간·중간 취소를 비교하도록 확장한다. |
| 146 | [Glassmorphism](https://ui-terms-cheatsheet.pages.dev/#glass) | 후속 비교 학습 / later-learning | glassmorphism | 흐린 배경·불투명도·텍스트 대비를 조절하는 시각 비교다. |
| 147 | [Parallax Scrolling](https://ui-terms-cheatsheet.pages.dev/#parallax) | 신규 UI / P1 | parallax-scroll | 포인터 기울기와 달리 스크롤 진행에 따른 여러 레이어의 이동량 차이를 다룬다. |
| 148 | [Scroll Snap](https://ui-terms-cheatsheet.pages.dev/#snap) | 신규 UI / P1 | scroll-snap | 자유 스크롤과 지정 지점 정착을 비교하며 과도한 스크롤 제어를 피한다. |
| 149 | [Micro-interaction](https://ui-terms-cheatsheet.pages.dev/#micro) | 후속 비교 학습 / later-learning | micro-interaction | 기존 선택·실행 피드백을 묶는 상위 개념이며 새 버튼 하나로 정의하지 않는다. |
| 150 | [Fade In / Out](https://ui-terms-cheatsheet.pages.dev/#fade) | 신규 UI / P3 | fade-transition | 투명도 전환과 DOM 제거/초점 처리의 차이를 조작한다. |
| 152 | [Marquee / Logo Slider](https://ui-terms-cheatsheet.pages.dev/#marquee) | 신규 UI / P2 | marquee | 끊김 없이 흐르는 텍스트/로고와 정지·정적 목록 대안을 다룬다. |
| 153 | [Typewriter Effect](https://ui-terms-cheatsheet.pages.dev/#typewriter) | 신규 UI / P3 | typewriter | 타이핑·삭제·반복과 읽기 가능한 전체 문장 제공을 다룬다. |
| 154 | [Count-up / Number Ticker](https://ui-terms-cheatsheet.pages.dev/#countup) | 신규 UI / P3 | count-up | 0부터 목표값 증가, 재시작, 단위와 최종값의 즉시 읽기를 제공한다. |
| 155 | [Infinite Scroll](https://ui-terms-cheatsheet.pages.dev/#infinite) | 신규 UI / P1 | infinite-scroll | Load More와 달리 스크롤 경계로 다음 데이터를 가져오는 패턴이다. |
| 157 | [Animated Gradient](https://ui-terms-cheatsheet.pages.dev/#gradanim) | 통합·확장 / P3 | mesh-gradient, aurora | 기존 색면·빛띠 애니메이션에 선형 그라디언트 이동을 비교 형태로 추가한다. |
| 160 | [Swipe Action](https://ui-terms-cheatsheet.pages.dev/#swipe) | 신규 UI / P1 | swipe-actions | 스크롤과 가로 제스처 판별·행동 노출·실행 취소가 필요하다. |
| 161 | [Pull to Refresh](https://ui-terms-cheatsheet.pages.dev/#pullrefresh) | 신규 UI / P1 | pull-to-refresh | 맨 위에서 당기는 거리·임계값·조회·복구가 필요한 터치 패턴이다. |
| 162 | [Shake Animation](https://ui-terms-cheatsheet.pages.dev/#shake) | 통합·확장 / P1 | text-field | 오류 강조의 보조 효과로 진동을 추가하되 오류 텍스트/초점 이동을 대신하지 않는다. |
| 163 | [Lazy Loading](https://ui-terms-cheatsheet.pages.dev/#lazyload) | 신규 UI / P3 | lazy-loading | 스크롤 진입 시 자원 로드·자리 확보·실패 대체를 비교한다. |
| 164 | [Optimistic UI](https://ui-terms-cheatsheet.pages.dev/#optimistic) | 신규 UI / P2 | optimistic-ui | 먼저 반영→성공 유지/실패 롤백·재시도의 비동기 상태 패턴이다. |
| 165 | [Hide-on-Scroll Header](https://ui-terms-cheatsheet.pages.dev/#hideonscroll) | 통합·확장 / P1 | sticky-header | 고정 헤더에 아래로 스크롤 시 숨김·위로 이동/초점 진입 시 복귀를 추가한다. |
| 166 | [Image Zoom](https://ui-terms-cheatsheet.pages.dev/#imagezoom) | 통합·확장 / P3 | image-magnifier, lightbox, hover-reveal | 전체 확대·부분 돋보기·호버 확대를 기존 이미지 데모의 변형으로 구분한다. |
| 167 | [Smooth Scroll](https://ui-terms-cheatsheet.pages.dev/#smoothscroll) | 신규 UI / P3 | smooth-scroll | 위치 즉시 이동과 부드러운 이동·중단·초점 복귀를 비교한다. |
| 168 | [Ping / Pulse Dot](https://ui-terms-cheatsheet.pages.dev/#ping) | 통합·확장 / P3 | status-indicator | 계속 맥동하는 점은 새 상태 점의 표현 옵션으로 추가한다. 상태를 색/모션에만 의존하지 않는다. |

### 스타일

| # | 참고 용어 | 판정 / 단계 | 연결·제안 ID | 판정 근거 |
| --- | --- | --- | --- | --- |
| 175 | [Mesh / Aurora Gradient](https://ui-terms-cheatsheet.pages.dev/#aurora) | 기존 대응 / existing | mesh-gradient, aurora | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 183 | [Grain / Noise Texture](https://ui-terms-cheatsheet.pages.dev/#grain) | 기존 대응 / existing | grain | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 205 | [Dot / Grid Pattern](https://ui-terms-cheatsheet.pages.dev/#pattern) | 기존 대응 / existing | dot-grid | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 169 | [Neumorphism](https://ui-terms-cheatsheet.pages.dev/#neumorphism) | 후속 비교 학습 / later-learning | neumorphism | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 170 | [Claymorphism](https://ui-terms-cheatsheet.pages.dev/#claymorphism) | 후속 비교 학습 / later-learning | claymorphism | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 171 | [Flat Design](https://ui-terms-cheatsheet.pages.dev/#flat) | 후속 비교 학습 / later-learning | flat-design | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 172 | [Minimalism](https://ui-terms-cheatsheet.pages.dev/#minimal) | 후속 비교 학습 / later-learning | minimalism | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 173 | [Neo-brutalism](https://ui-terms-cheatsheet.pages.dev/#brutalism) | 후속 비교 학습 / later-learning | neo-brutalism | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 174 | [Gradient](https://ui-terms-cheatsheet.pages.dev/#gradient) | 후속 비교 학습 / later-learning | gradient | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 176 | [Dark Mode](https://ui-terms-cheatsheet.pages.dev/#darkmode) | 후속 비교 학습 / later-learning | dark-mode | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 177 | [Glow / Neon](https://ui-terms-cheatsheet.pages.dev/#neon) | 후속 비교 학습 / later-learning | glow-neon | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 178 | [Drop Shadow / Elevation](https://ui-terms-cheatsheet.pages.dev/#shadow) | 후속 비교 학습 / later-learning | elevation | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 179 | [Border Radius](https://ui-terms-cheatsheet.pages.dev/#radius) | 후속 비교 학습 / later-learning | border-radius | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 181 | [Color Palette](https://ui-terms-cheatsheet.pages.dev/#palette) | 후속 비교 학습 / later-learning | color-palette | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 182 | [Liquid Glass](https://ui-terms-cheatsheet.pages.dev/#liquidglass) | 후속 비교 학습 / later-learning | liquid-glass | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 184 | [Y2K / Chrome](https://ui-terms-cheatsheet.pages.dev/#y2k) | 후속 비교 학습 / later-learning | y2k-chrome | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 185 | [Frutiger Aero](https://ui-terms-cheatsheet.pages.dev/#aero) | 후속 비교 학습 / later-learning | frutiger-aero | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 186 | [Synthwave / Retro Grid](https://ui-terms-cheatsheet.pages.dev/#synthwave) | 후속 비교 학습 / later-learning | synthwave | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 187 | [Cyberpunk](https://ui-terms-cheatsheet.pages.dev/#cyberpunk) | 후속 비교 학습 / later-learning | cyberpunk | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 188 | [Holographic / Iridescent](https://ui-terms-cheatsheet.pages.dev/#holo) | 후속 비교 학습 / later-learning | iridescence | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 189 | [Duotone](https://ui-terms-cheatsheet.pages.dev/#duotone) | 후속 비교 학습 / later-learning | duotone | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 191 | [Pixel Art / 8-bit](https://ui-terms-cheatsheet.pages.dev/#pixel) | 후속 비교 학습 / later-learning | pixel-art | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 192 | [Dithering](https://ui-terms-cheatsheet.pages.dev/#dither) | 후속 비교 학습 / later-learning | dithering | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 193 | [ASCII / Terminal](https://ui-terms-cheatsheet.pages.dev/#ascii) | 후속 비교 학습 / later-learning | terminal-style | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 194 | [Bauhaus / Geometric](https://ui-terms-cheatsheet.pages.dev/#bauhaus) | 후속 비교 학습 / later-learning | bauhaus | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 195 | [Swiss Style](https://ui-terms-cheatsheet.pages.dev/#swiss) | 후속 비교 학습 / later-learning | swiss-style | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 196 | [Memphis Design](https://ui-terms-cheatsheet.pages.dev/#memphis) | 후속 비교 학습 / later-learning | memphis | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 197 | [Hand-drawn / Doodle](https://ui-terms-cheatsheet.pages.dev/#handdrawn) | 후속 비교 학습 / later-learning | hand-drawn | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 198 | [Torn Paper / Collage](https://ui-terms-cheatsheet.pages.dev/#collage) | 후속 비교 학습 / later-learning | collage | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 199 | [Isometric](https://ui-terms-cheatsheet.pages.dev/#isometric) | 후속 비교 학습 / later-learning | isometric | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 200 | [Skeuomorphism](https://ui-terms-cheatsheet.pages.dev/#skeuo) | 후속 비교 학습 / later-learning | skeuomorphism | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 201 | [Editorial / Magazine](https://ui-terms-cheatsheet.pages.dev/#editorial) | 후속 비교 학습 / later-learning | editorial | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 202 | [Oversized Typography](https://ui-terms-cheatsheet.pages.dev/#bigtype) | 후속 비교 학습 / later-learning | oversized-type | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 203 | [Inflated / Puffy 3D](https://ui-terms-cheatsheet.pages.dev/#inflated) | 후속 비교 학습 / later-learning | puffy-3d | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 204 | [Wireframe / Blueprint](https://ui-terms-cheatsheet.pages.dev/#blueprint) | 후속 비교 학습 / later-learning | blueprint | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 206 | [Progressive Blur](https://ui-terms-cheatsheet.pages.dev/#progblur) | 후속 비교 학습 / later-learning | progressive-blur | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 208 | [Sticker Style](https://ui-terms-cheatsheet.pages.dev/#sticker) | 후속 비교 학습 / later-learning | sticker-style | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 209 | [Material Design](https://ui-terms-cheatsheet.pages.dev/#material) | 후속 비교 학습 / later-learning | material-design | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 210 | [iOS Style](https://ui-terms-cheatsheet.pages.dev/#cupertino) | 후속 비교 학습 / later-learning | ios-guidelines | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 211 | [Icon Style](https://ui-terms-cheatsheet.pages.dev/#iconstyle) | 후속 비교 학습 / later-learning | icon-style | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 213 | [Section Divider (Wave / Slant)](https://ui-terms-cheatsheet.pages.dev/#sectiondivider) | 후속 비교 학습 / later-learning | section-divider | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 214 | [Text Highlight](https://ui-terms-cheatsheet.pages.dev/#texthighlight) | 후속 비교 학습 / later-learning | text-highlight | 동일 콘텐츠에서 시각 속성을 바꾸는 비교 학습으로 설계한다. 스타일 명칭을 공식 컴포넌트 규격으로 단정하지 않는다. |
| 180 | [Button Variants](https://ui-terms-cheatsheet.pages.dev/#buttons) | 통합·확장 / P1 | button | Primary/Secondary/Outline/Ghost/Destructive 표현과 역할 구분을 기존 버튼에 추가한다. |
| 190 | [Halftone / Risograph](https://ui-terms-cheatsheet.pages.dev/#halftone) | 통합·확장 / P3 | halftone | 망점은 구현되어 있다. Risograph의 잉크 겹침/인쇄 질감은 같은 것으로 단정하지 않고 추가 비교한다. |
| 207 | [Light Rays / God Rays](https://ui-terms-cheatsheet.pages.dev/#lightrays) | 통합·확장 / P3 | beams | 현재 움직이는 선형 빛줄기와 원점에서 퍼지는 광선을 구분해 변형을 추가한다. |
| 212 | [Toss-like Clean UI](https://ui-terms-cheatsheet.pages.dev/#tossstyle) | 보류 / hold | clean-financial-ui | 특정 브랜드 닮기를 공식 용어로 등록하지 않는다. 간결한 정보 위계·여백·명확한 피드백 원칙으로 재정의 후 검토한다. |
| 215 | [Card Style](https://ui-terms-cheatsheet.pages.dev/#cardstyle) | 통합·확장 / P3 | card | 테두리·그림자·이미지·클릭 영역 변형을 기존 카드의 표현 비교로 관리한다. |

### 모션

| # | 참고 용어 | 판정 / 단계 | 연결·제안 ID | 판정 근거 |
| --- | --- | --- | --- | --- |
| 222 | [Shape Morphing / Blob](https://ui-terms-cheatsheet.pages.dev/#morph) | 기존 대응 / existing | blob | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 229 | [3D Tilt Card](https://ui-terms-cheatsheet.pages.dev/#tilt) | 기존 대응 / existing | tilt-card | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 231 | [Magnetic Button](https://ui-terms-cheatsheet.pages.dev/#magnetic) | 기존 대응 / existing | magnetic-button | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 238 | [Ken Burns Effect](https://ui-terms-cheatsheet.pages.dev/#kenburns) | 기존 대응 / existing | ken-burns | 동일한 핵심 동작의 등록된 시뮬레이션이 있다. 별칭과 검색어만 검토한다. |
| 216 | [Kinetic Typography](https://ui-terms-cheatsheet.pages.dev/#kinetic) | 신규 UI / P3 | kinetic-typography | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 217 | [Text Scramble / Decode](https://ui-terms-cheatsheet.pages.dev/#scramble) | 신규 UI / P3 | text-scramble | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 218 | [Word Rotate](https://ui-terms-cheatsheet.pages.dev/#wordrotate) | 신규 UI / P3 | word-rotate | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 219 | [Text Reveal / Mask Reveal](https://ui-terms-cheatsheet.pages.dev/#textreveal) | 신규 UI / P3 | text-reveal | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 220 | [Shiny Text / Shimmer](https://ui-terms-cheatsheet.pages.dev/#shinytext) | 신규 UI / P3 | shimmer | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 221 | [Blur Fade / Blur-in](https://ui-terms-cheatsheet.pages.dev/#blurfade) | 신규 UI / P3 | blur-fade | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 223 | [Gooey / Metaball](https://ui-terms-cheatsheet.pages.dev/#gooey) | 신규 UI / P3 | gooey | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 225 | [Meteors / Shooting Stars](https://ui-terms-cheatsheet.pages.dev/#meteors) | 신규 UI / P3 | meteors | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 226 | [Border Beam](https://ui-terms-cheatsheet.pages.dev/#borderbeam) | 신규 UI / P3 | border-beam | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 227 | [Animated Beam](https://ui-terms-cheatsheet.pages.dev/#beam) | 신규 UI / P3 | animated-beam | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 228 | [Orbiting Circles](https://ui-terms-cheatsheet.pages.dev/#orbit) | 신규 UI / P3 | orbiting-elements | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 230 | [Card Flip](https://ui-terms-cheatsheet.pages.dev/#flip) | 신규 UI / P3 | card-flip | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 232 | [Glitch Effect](https://ui-terms-cheatsheet.pages.dev/#glitch) | 신규 UI / P3 | glitch | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 233 | [Dispersion / Pixel Dissolve](https://ui-terms-cheatsheet.pages.dev/#dispersion) | 신규 UI / P3 | pixel-dissolve | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 234 | [Scroll Progress](https://ui-terms-cheatsheet.pages.dev/#scrollprogress) | 신규 UI / P2 | scroll-progress | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 235 | [Scrollytelling / Sticky Scroll](https://ui-terms-cheatsheet.pages.dev/#scrollytelling) | 신규 UI / P3 | scrollytelling | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 236 | [Dock Magnification](https://ui-terms-cheatsheet.pages.dev/#dock) | 신규 UI / P3 | dock-magnification | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 237 | [Line Drawing (SVG Path)](https://ui-terms-cheatsheet.pages.dev/#linedraw) | 신규 UI / P3 | svg-line-drawing | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 239 | [Squash & Stretch](https://ui-terms-cheatsheet.pages.dev/#squash) | 신규 UI / P3 | squash-stretch | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 240 | [Page / View Transition](https://ui-terms-cheatsheet.pages.dev/#viewtransition) | 신규 UI / P2 | view-transition | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 241 | [Liquid Fill / Wave](https://ui-terms-cheatsheet.pages.dev/#liquidfill) | 신규 UI / P3 | liquid-fill | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 242 | [Lottie Animation](https://ui-terms-cheatsheet.pages.dev/#lottie) | 신규 UI / P3 | lottie-animation | 기존 데모와 작동 조건·표현 대상이 달라 별도 모션 시뮬레이션 후보로 관리한다. |
| 224 | [Particles / Confetti](https://ui-terms-cheatsheet.pages.dev/#confetti) | 통합·확장 / P1 | particles | 기존 부유 입자와 성공 시 한 번 터지는 Confetti는 다르다. 트리거·수명·정리를 가진 형태를 추가한다. |

### 디자인 기본

| # | 참고 용어 | 판정 / 단계 | 연결·제안 ID | 판정 근거 |
| --- | --- | --- | --- | --- |
| 243 | [Padding / Margin / Gap](https://ui-terms-cheatsheet.pages.dev/#spacing) | 후속 비교 학습 / later-learning | spacing | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 244 | [Whitespace](https://ui-terms-cheatsheet.pages.dev/#whitespace) | 후속 비교 학습 / later-learning | whitespace | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 245 | [Typography](https://ui-terms-cheatsheet.pages.dev/#typography) | 후속 비교 학습 / later-learning | typography | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 246 | [Line Height / Letter Spacing](https://ui-terms-cheatsheet.pages.dev/#lineheight) | 후속 비교 학습 / later-learning | type-spacing | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 247 | [Visual Hierarchy](https://ui-terms-cheatsheet.pages.dev/#hierarchy) | 후속 비교 학습 / later-learning | visual-hierarchy | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 248 | [Contrast](https://ui-terms-cheatsheet.pages.dev/#contrast) | 후속 비교 학습 / later-learning | contrast | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 249 | [Alignment](https://ui-terms-cheatsheet.pages.dev/#alignment) | 후속 비교 학습 / later-learning | alignment | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 250 | [CTA (Call to Action)](https://ui-terms-cheatsheet.pages.dev/#cta) | 후속 비교 학습 / later-learning | call-to-action | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 251 | [Viewport (vh / vw)](https://ui-terms-cheatsheet.pages.dev/#viewport) | 후속 비교 학습 / later-learning | viewport-units | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 252 | [Breakpoint](https://ui-terms-cheatsheet.pages.dev/#breakpoint) | 후속 비교 학습 / later-learning | breakpoints | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 253 | [Flexbox / CSS Grid](https://ui-terms-cheatsheet.pages.dev/#flexgrid) | 후속 비교 학습 / later-learning | flex-grid | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 254 | [Z-index / Layer](https://ui-terms-cheatsheet.pages.dev/#zindex) | 후속 비교 학습 / later-learning | stacking | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 255 | [Aspect Ratio](https://ui-terms-cheatsheet.pages.dev/#ratio) | 후속 비교 학습 / later-learning | aspect-ratio | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 256 | [Favicon](https://ui-terms-cheatsheet.pages.dev/#favicon) | 후속 비교 학습 / later-learning | favicon | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 257 | [OG Image (Open Graph)](https://ui-terms-cheatsheet.pages.dev/#og) | 후속 비교 학습 / later-learning | open-graph | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 258 | [Design System / Tokens](https://ui-terms-cheatsheet.pages.dev/#designsystem) | 후속 비교 학습 / later-learning | design-tokens | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 259 | [Spacing Scale (8pt Grid)](https://ui-terms-cheatsheet.pages.dev/#spacingscale) | 후속 비교 학습 / later-learning | spacing-scale | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 260 | [UI States](https://ui-terms-cheatsheet.pages.dev/#uistates) | 후속 비교 학습 / later-learning | ui-states | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 261 | [Truncate / Line Clamp](https://ui-terms-cheatsheet.pages.dev/#truncate) | 후속 비교 학습 / later-learning | text-truncation | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 262 | [Touch Target Size](https://ui-terms-cheatsheet.pages.dev/#touchtarget) | 후속 비교 학습 / later-learning | target-size | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 263 | [Safe Area](https://ui-terms-cheatsheet.pages.dev/#safearea) | 후속 비교 학습 / later-learning | safe-area | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 264 | [Accessibility (a11y)](https://ui-terms-cheatsheet.pages.dev/#a11y) | 후속 비교 학습 / later-learning | accessibility | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 265 | [Wireframe → Mockup → Prototype](https://ui-terms-cheatsheet.pages.dev/#wireframe) | 후속 비교 학습 / later-learning | design-deliverables | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 266 | [Microcopy](https://ui-terms-cheatsheet.pages.dev/#microcopy) | 후속 비교 학습 / later-learning | microcopy | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 267 | [Overlay / Backdrop](https://ui-terms-cheatsheet.pages.dev/#overlay) | 후속 비교 학습 / later-learning | overlay-backdrop | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 268 | [Position (fixed / sticky / absolute)](https://ui-terms-cheatsheet.pages.dev/#position) | 후속 비교 학습 / later-learning | positioning | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 269 | [Overflow](https://ui-terms-cheatsheet.pages.dev/#overflow) | 후속 비교 학습 / later-learning | overflow | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 270 | [Units (px / rem / % / vh)](https://ui-terms-cheatsheet.pages.dev/#units) | 후속 비교 학습 / later-learning | css-units | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 271 | [Semantic Colors](https://ui-terms-cheatsheet.pages.dev/#semantic) | 후속 비교 학습 / later-learning | semantic-colors | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 272 | [Font Weight](https://ui-terms-cheatsheet.pages.dev/#fontweight) | 후속 비교 학습 / later-learning | font-weight | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 273 | [Size Variants (sm / md / lg)](https://ui-terms-cheatsheet.pages.dev/#sizes) | 후속 비교 학습 / later-learning | size-variants | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 274 | [Mobile First](https://ui-terms-cheatsheet.pages.dev/#mobilefirst) | 후속 비교 학습 / later-learning | mobile-first | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 275 | [Color Code (HEX / RGB)](https://ui-terms-cheatsheet.pages.dev/#colorcode) | 후속 비교 학습 / later-learning | color-formats | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 276 | [Layout Shift](https://ui-terms-cheatsheet.pages.dev/#layoutshift) | 후속 비교 학습 / later-learning | layout-shift | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |
| 277 | [Word Break (keep-all)](https://ui-terms-cheatsheet.pages.dev/#wordbreak) | 후속 비교 학습 / later-learning | word-break | 개념 설명과 값 조절/전후 비교로 이해하는 학습 콘텐츠다. 관련 기존 UI와 연결한다. |

## 현재 프로젝트 고유 항목도 유지

대응·확장 매핑에 직접 연결되지 않은 기존 10개는 다음과 같다. 참고 사이트를 따라 없애거나 다른 용어로 강제 통합하지 않는다.

Data Grid, List, Image Trail, Blend Mode Cursor, Cursor Label, Cursor Trail, Image Accordion, Image Hotspot, Glow Orb, Starfield.

## 조사 출처

- R01 [UI Terms Cheat Sheet](https://ui-terms-cheatsheet.pages.dev/) — 실제 화면 확인. 277개 명칭·8개 분류·카드와 상세 구조. 원문의 설명·AI 요청 문장은 복제하지 않음.
- R02 [現在の公開DB一覧](https://uiux-guidebook.vercel.app/api/terms) — API 확인. Turso의 공개 77개 콘텐츠. 로컬에 등록된 데모 ID와 대조.
- R03 [W3C APG Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) — 본문 확인. 위젯의 의미와 키보드 모델을 검토하는 공식 기준. Command Palette 자체의 단일 공식 규격으로 주장하지 않음.
- R04 [W3C Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) — 본문 확인. 분할선의 값·separator·키 조작. 이 페이지는 예제 완성 전 검토 중이라는 주의를 포함하므로 완성 구현의 보증으로 사용하지 않음.
- R05 [WCAG 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) — 본문 확인. 드래그를 쓰는 기능에는 드래그 없는 단일 포인터 대안을 함께 제공. 키보드 지원만으로 이 요구를 충족했다고 단정하지 않음.
- R06 [MDN CSS scroll snap](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap) — 본문 확인. 스크롤 컨테이너와 자식 항목의 정착 위치 설계.
- R07 [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) — 본문 확인. 비동기 교차 감지. Scroll Reveal·Infinite Scroll·Lazy Loading은 목적과 상태 처리가 다른 패턴임.

APG는 개별 패턴 지침이며 전체 사이트 준수 인증이 아니다. 4.8초 루프·코드 수·1차 24개·세부 제스처 수치는 이 프로젝트의 설계안이다. 참고 사이트의 공식 정의나 표준 필수 수치로 인용하지 않는다.
