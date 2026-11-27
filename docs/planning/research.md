# UI 컴포넌트 조사 기록

확인일: 2026-11-26. 공식 표준·제작사 디자인 시스템·기술 문서를 우선 확인했다. 아래의 분류 체계와 구현 선택은 출처를 참고한 프로젝트 제안이다.

## 조사 범위

웹에서 시각화·조작할 수 있는 UI 컴포넌트, 상호작용 패턴, 레이아웃, 모션을 조사했다. 페르소나·사용자 여정 등 UX 조사 방법론은 이번 1차 목록에서 제외했다. Android 문서는 용어와 사용 맥락의 근거이며 제공할 웹 코드의 직접 구현 명세와 구분한다.

목록 문서는 후보 발굴과 범위 확인, 개별 패턴 문서는 이름 혼동·입력 방식·상태·접근성 검토에 사용했다. 카탈로그의 근거 표시는 모든 항목의 상세 원고 검수가 끝났다는 뜻이 아니다. 제작 전 각 용어의 개별 사용 지침과 브라우저 조건을 추가 확인한다.

## 확인한 근거

| ID | 문서 | 확인한 내용과 적용 범위 |
| --- | --- | --- |
| R01 | [W3C APG Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) | 버튼·입력·내비게이션·레이어·데이터 위젯의 패턴 목록과 개념. 후보 분리 기준 |
| R02 | [Material Components](https://developer.android.com/design/ui/mobile/guides/components/material-overview) | 실행·정보 전달·컨테이너·탐색·선택·입력이라는 목적별 구분, 모바일 컴포넌트 맥락 |
| R03 | [Carbon Components Overview](https://www.carbondesignsystem.com/building-blocks/core/components/overview/components) | 실무형 폼·데이터·피드백 UI의 목록. 60개 후보의 범위 교차 확인 |
| R04 | [GOV.UK Components](https://design-system.service.gov.uk/components/) | 컴포넌트별 사용 지침과 코드 예제 제공 방식, 입력·오류·탐색 항목의 범위 |
| R05 | [W3C Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | 배경 비활성, 내부 초점, Tab·Esc·닫은 후 포커스 복원 |
| R06 | [W3C Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) | hover·focus로 나타나는 설명, 툴팁 자체는 포커스를 받지 않음. 해당 APG 페이지는 작업 중이라는 상태도 명시함 |
| R07 | [W3C Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) | 편집 가능·선택 전용 유형과 팝업. 콤보박스를 검색 가능한 셀렉트 하나로 축소하지 않을 근거 |
| R08 | [W3C Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | 버튼과 펼쳐지는 콘텐츠의 관계, expanded 상태. 아코디언과 관련되지만 설명 범위를 구분 |
| R09 | [W3C Alert Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/) | 중요한 메시지에 대한 응답을 요구하는 모달의 특수 사례 |
| R10 | [W3C Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/) | 표 자체와 내부의 조작 요소 구분, 정렬 가능한 표와 grid의 차이 |
| R11 | [W3C Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) | 복합 위젯의 방향키 이동과 포커스 관리. CSS Grid 레이아웃과 데이터 그리드를 구분 |
| R12 | [W3C Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) | 회전 제어, 이전·다음, 초점 진입 시 자동 재생 중지 |
| R13 | [W3C Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) | 일반·토글·메뉴 버튼, 동작과 링크 이동의 의미 차이 |
| R14 | [Carbon Notification](https://www.carbondesignsystem.com/building-blocks/core/components/notification/guidelines) | 인라인·토스트·행동 가능 알림 등 시스템별 구분. 토스트와 스낵바를 무조건 동의어로 보지 않을 근거 |
| R15 | [Carbon Loading](https://www.carbondesignsystem.com/building-blocks/core/patterns/loading) | 스켈레톤·로딩 표시·진행 상황·더 보기의 구분과 사용 맥락 |
| R16 | [Carbon Empty States](https://www.carbondesignsystem.com/building-blocks/core/patterns/empty-states) | 표시할 데이터가 없는 상태의 설명과 다음 행동 안내 |
| R17 | [Android Snackbar](https://developer.android.com/develop/ui/compose/components/snackbar) | 짧은 피드백과 선택적인 행동·Undo의 예시. Android 플랫폼 문맥 |
| R18 | [Android Bottom Sheets](https://developer.android.com/develop/ui/compose/components/bottom-sheets) | ModalBottomSheet API, 열림 상태 제어. 일반적 포함 맥락은 R02와 함께 사용 |
| R19 | [MDN hover](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/hover) | 주 입력 장치의 호버 가능 여부. PC·모바일 단정 대신 입력 능력을 기록 |
| R20 | [MDN prefers reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | 사용자 모션 감소 설정 감지와 비필수 움직임 줄이기 |
| R21 | [WCAG Pause Stop Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | 자동·5초 초과·다른 콘텐츠와 병행하는 움직임의 제어 조건. 제품 정책은 이보다 보수적으로 제안 |
| R22 | [WCAG Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) | 드래그의 단일 포인터 비드래그 대안. 키보드 접근성과 별도 조건 |
| R23 | [MDN CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations/Using) | 키프레임·재생 구성. 페이드·슬라이드·스케일의 구현 기반 |
| R24 | [MDN CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transitions/Using) | 속성 변화와 duration·delay·timing function |
| R25 | [MDN Easing Function](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function) | 값이 변하는 비율, 시간에 따른 속도 변화 |
| R26 | [MDN position](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position) | sticky와 fixed의 차이, 스크롤 컨테이너·offset 관계 |
| R27 | [MDN Popover](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover) | top layer, 기본 숨김, auto popover의 light dismiss. 의미·포커스 설계가 별도로 필요 |
| R28 | [MDN Responsive Web Design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) | 다양한 화면에 대응하는 접근법, 유연한 레이아웃과 미디어 쿼리 |
| R29 | [W3C Feed](https://www.w3.org/WAI/ARIA/apg/patterns/feed/) | 스크롤에 따른 추가 로딩, 보조기술과의 읽기·포커스 계약. 모든 무한 목록에 무조건 feed role을 붙이는 의미는 아님 |
| R30 | [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) | 서버 요청 처리 구성 가능 여부. 로컬 기술안의 근거 |
| R31 | [Next.js Authentication](https://nextjs.org/docs/app/guides/authentication) | 인증·세션·권한 구분. 향후 공개 시 서버 측 권한 검증 검토 근거 |
| R32 | [SQLite Backup](https://www.sqlite.org/backup.html) | 실행 중 DB 일관성 백업과 VACUUM INTO 선택지 |
| R33 | [우디디자인랩 UI 미니 사전](https://woodydesignlab.com/ui/dict) | 사용자 지정 시각 참고. 밝은 배경·흰색 둥근 카드·파란 강조·추천 검색·가로 카테고리·애니메이션 미리보기 관찰. 디자인과 동작 확인 범위는 [디자인 적용안](design-reference.md)에 기록 |
| R34 | [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) | DOM 표시 변화와 타이밍 모델. 자동 시연의 공통 시간·재생 제어 설계 근거 |
| R35 | [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) | 화면 영역과 카드의 교차 감지. 목록 재생 후보 결정 근거 |
| R36 | [MDN Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) | 문서 표시·숨김 상태와 이벤트. 백그라운드 시연 정지 근거 |
| R37 | [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) | 필요한 프레임 갱신과 타임스탬프 기반 처리. 고정 프레임 수로 시간 계산하지 않을 근거 |
| R38 | [MDN iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe) | 별도 문서와 sandbox 제약. 상세 체험 격리 설계 근거 |

## 조사에서 도출한 기획 결정

### 주제와 종류를 분리한다

R01·R02·R03·R04의 항목과 목적별 조직 방식을 참고했다. 버튼·모달은 컴포넌트, 더 보기·정렬은 패턴, 반응형은 레이아웃 접근, 페이드는 모션으로 구분한다. 8개 주제는 이 프로젝트의 탐색 편의를 위한 편집 분류이며 국제 표준 카테고리라고 주장하지 않는다.

### 이름보다 동작을 먼저 떠올리는 검색을 지원한다

자료의 명칭만 색인하면 사용자가 기억하는 움직임을 찾기 어렵다. 카탈로그 작성 시 동작 표현을 별도로 기록하고, 실제 검색 사례를 검토 계획에 넣는다. 이는 프로젝트의 검색 설계 제안이며 출처들이 자연어 검색 품질을 보장한다는 의미가 아니다.

### 비슷한 이름은 관계를 설명한다

R05·R09에 따라 모달과 경고 대화상자를 일반·특수 관계로, R10·R11에 따라 테이블과 그리드를 다른 상호작용 모델로 다룬다. R07에 따라 콤보박스의 유형을 명시한다. R14·R17에 따라 알림 이름의 정의는 시스템에 따라 달라질 수 있음을 기록한다. 넓은 통칭인 팝업·드롭다운·토글은 특정 컴포넌트의 유일한 공식 동의어로 취급하지 않는다.

### 동작 재생과 실제 조작을 나눈다

목록의 짧은 시나리오는 알아보기를, 상세의 체험은 상태와 동작 규칙 이해를 돕는다. R12·R20·R21을 참고해 사용자 재생 제어·모션 감소·화면 밖 정지를 설계한다. 제안한 2~4초·최대 2개 재생 수치는 제품 설계값이며 표준의 의무 수치가 아니다.

### 입력 방식과 과업을 기준으로 대안을 연결한다

R19·R22·R28을 근거로 화면 폭·입력 방식을 함께 기록한다. 모바일에서 흔한 컴포넌트를 모바일 전용으로 단정하지 않는다. 기획안의 테이블·분할 보기·툴팁 대안은 과업별 설계 제안이며 실사용 검증 전의 보편적 정답이 아니다.

## 확인 한계와 후속 조사

- Material 3 웹사이트의 바텀시트·스낵바 페이지는 JavaScript 필요 화면만 반환되어 본문 근거로 사용하지 않았다. 읽을 수 있는 Android 공식 문서 R02·R17·R18을 사용했다.
- Apple HIG layout은 JavaScript 안내만 확인되어 세부 주장에 사용하지 않았다. 네이티브 플랫폼 용어·규칙 비교가 필요해지면 접근 가능한 공식 원문으로 추가 검토한다.
- Split View, Swipe Actions, Pull to Refresh의 개별 상세 사용 지침은 아직 별도 검토가 필요하다. R28·R22는 대응 레이아웃·대체 조작의 근거이며 이 용어의 모든 정의를 증명하는 출처가 아니다.
- 60개는 1차 후보와 데모 기획이다. 최종 공개용 정의·역할별 원고·브라우저 지원·발음 표기의 개별 검수를 완료한 상태가 아니다.
- APG는 패턴별 구현 지침이다. 참고했다고 해서 사이트의 접근성 기준 준수 또는 인증을 자동으로 충족하지 않는다.

컴포넌트 조사에서는 Aside 프로필이 daemon에 연결되지 않아 기본 웹 도구를 사용했다. 이후 R33 디자인 참고는 같은 연결 문제로 in-app 브라우저를 사용해 렌더링 화면·검색·카테고리 전환을 직접 확인했다. 이 확인은 참고 사이트 분석이며 아직 구현되지 않은 프로젝트의 브라우저 검증 결과가 아니다.
