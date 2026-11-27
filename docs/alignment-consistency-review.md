# 아이콘 정렬·목록/상세 일치 검토

확인일: 2026-11-27.

## 수정

- Accordion·Combobox·Select·Filtering의 문자 화살표를 같은 SVG 도형으로 교체했습니다. 컨트롤의 높이 중앙에 배치하고, 긴 제목이 줄바꿈되어도 화살표가 수축하거나 기준선 아래로 처지지 않게 했습니다.
- Disclosure는 기본 브라우저 마커 대신 SVG를 사용하고 펼침 시 회전시킵니다. Bottom Sheet의 오른쪽 화살표와 공유·편집·보관 아이콘, 모달·알림 닫기 아이콘도 SVG와 중앙 정렬을 적용했습니다. 가이드의 선택창 예시에도 같은 화살표를 사용합니다.
- 기본 select를 쓰는 정렬·조회·속도 곡선 컨트롤은 닫힌 필드의 화살표를 SVG 배경으로 중앙 정렬했습니다. Select와 Filtering 체험의 펼친 패널은 기존 커스텀 구현을 유지합니다.
- Modal Dialog의 목록 미리보기를 상세와 같은 ‘작업 공간 설정’ 이름 입력·취소·저장 형태로 수정했습니다. 커진 폼이 카드에서 잘리지 않도록 높이의 절반을 기준으로 중앙에 배치했습니다.
- Accordion의 목록 질문 제목을 상세와 통일했습니다. Bottom Sheet는 목록·React·HTML의 동작 아이콘과 오른쪽 화살표를 통일했습니다.
- Load More의 목록 미리보기에도 ‘더 보기’ 버튼과 대기 상태를 넣었습니다. 상세에서 제목을 눌러도 목록·더 보기·개수를 유지하고 그 아래에 본문을 엽니다. ‘설명 닫기’는 원래 제목으로 초점을 돌리며 이미 불러온 수와 오류를 유지합니다. 모두 불러온 뒤에만 추가 버튼을 없앱니다. React와 독립 HTML 모두 반영했습니다.

## 검토 범위와 근거

등록된 51개 실행 컴포넌트에서 상세의 초기 HTML과 목록 시연의 0·1000·2000·3000ms HTML, 총 204개 미리보기 상태를 생성해 주요 태그·클래스·조건 분기를 비교했습니다. [구조 비교 기록](qa/alignment/markup-comparison.json)은 소스 렌더링 검사이며 모든 상호작용 상태의 브라우저 검증을 뜻하지 않습니다.

| 비교 대상 | 확인한 핵심 구조 |
| --- | --- |
| Modal Dialog, Bottom Sheet | 이름 입력 폼, 하단 패널, 동작 항목 및 아이콘 통일 |
| Accordion, Disclosure | 제목·펼침 컨트롤·본문 구조 및 SVG 방향 표시 |
| Combobox, Select, Filtering | 입력 또는 선택 필드·선택 목록·선택 결과 |
| Skeleton Screen | 로딩 자리와 완료 프로필 구조; 완료 클래스는 상세의 성공 상태에도 존재 |
| Data Grid, Data Table, Sorting | 같은 열·행 데이터 및 편집/조회/정렬 표현 |
| Tooltip, Popover, Toast, Snackbar | 도움말·설정 패널·완료 알림·되돌리기 |
| Tabs, Switch, Checkbox, Radio Group | 같은 항목과 선택/전환 상태 |
| Button, Icon Button, Toggle Button, Segmented Control | 실행·아이콘·눌림 상태·분할 선택 |
| Text Field, Textarea, Search Field, Slider | 입력란·검색 결과·값 조절 |
| Breadcrumb, Pagination, Tree View, Menu Button | 경로·페이지·계층·동작 메뉴 |
| Inline Alert, Empty State, Progress Bar, Loading Spinner | 상태 안내·다음 행동·진행 표시 |
| Floating Action Button, File Upload, Alert Dialog | 추가/삭제·첨부·확인 동작 |
| Date Picker (Single), Date Picker (Range) | 단일 날짜와 한 달력의 시작/마감 범위 표시 |
| Navigation Drawer, Bottom Navigation, Stepper | 탐색 목적지·현재 위치·진행 단계 |
| Card, List, Carousel | 콘텐츠 묶음·행·슬라이드 |
| Load More, Drag and Drop | 목록 추가 버튼·개수 유지, 순서 이동 |
| Responsive Layout, Sticky Header, Easing | 배치 변화·붙는 제목·속도 비교 |

목록은 자동 시연이고 상세는 초기 상태에서 직접 조작하므로 같은 순간의 열린 항목·로딩 결과가 다를 수 있습니다. 목록용 축소 글자·행 간격과 상세의 실패 모의·초기화 제어는 유지했습니다. UI 자체의 필드·주요 버튼·핵심 흐름이 바뀌는 차이는 위와 같이 수정했습니다.

## 브라우저 확인

Aside를 사용했습니다. Accordion·Combobox·Select·Filtering·Disclosure와 모달 닫기·하단 패널을 React/HTML에서 측정했습니다. 기록된 15개 화살표/버튼의 세로 중심 차이는 0~0.5px입니다. Combobox는 모바일 390, Accordion은 320에서도 확인했습니다.

추가로 Icon Button·Floating Action Button·단일/기간 날짜·Menu Button·Tree View·Data Table·Sorting·Easing의 초기 체험을 PC 1440과 모바일 320에서 확인했습니다. 총 18개 화면에서 프레임 가로 넘침과 누락된 실행 컴포넌트가 없었습니다. 목록 카드의 컨테이너도 가로 넘침이 없었습니다. [측정값](qa/alignment/metrics.json).

Load More는 React에서 2→4→6개·실패·재시도, HTML에서 2→4개·취소 후 지연 추가 없음, 양쪽에서 본문과 목록 동시 유지·닫은 뒤 초점 복귀를 확인했습니다. 모바일 320에서도 가로 넘침이 없었습니다.

화면 기록: [목록 첫 행](qa/alignment/list-first-row.png), [모바일 Accordion](qa/alignment/accordion-mobile.png), [모바일 Combobox](qa/alignment/combobox-mobile.png), [Bottom Sheet](qa/alignment/sheet-pc.png), [Load More PC](qa/alignment/load-more-pc.png), [Load More 모바일](qa/alignment/load-more-mobile.png).

최종 프로덕션 빌드와 자동 검사 49개가 통과했습니다. 기존 로컬 DB의 원고·게시본·메타 51건씩, 이력 94건, 설정 10개를 수정 전후 원문으로 비교해 보존했습니다. [데이터 보존 결과](qa/alignment/data-preservation.json). 최신 빌드는 기존 주소 `http://127.0.0.1:3000/`에서 실행합니다.
