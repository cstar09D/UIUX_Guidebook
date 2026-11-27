# 첫 출시 50개 콘텐츠 제작 계획

확인일: 2026-11-27. [60개 조사 후보](catalog.md)에서 실무 활용도·패턴 간 차이·체험 가능성을 기준으로 50개를 선정했습니다. 기본 유형 50개를 모두 구현했습니다. 기계 판독용 원본은 [release-50.json](release-50.json)입니다.

사용자 요청으로 Date Picker (Range)를 기본 50개 외 별도 형태로 분리했습니다. 추가 형태는 JSON의 `variants`에서 관리합니다. 이후 지정된 참고 페이지의 커서·이미지 효과 17개와 배경 효과 9개를 `additions`에 추가했으며 현재 목록·등록부는 총 77개입니다. [커서·이미지 검수](../effects-review.md), [배경·핫스팟 검수](../backgrounds-hotspot-review.md).

## 카테고리와 제작 순서

| 주제 | 수 |
|---|---:|
| 실행과 선택 | 8 |
| 입력과 검색 | 8 |
| 탐색과 이동 | 8 |
| 정보 구조와 콘텐츠 | 6 |
| 레이어와 도움말 | 5 |
| 피드백과 상태 | 7 |
| 조작과 데이터 탐색 | 5 |
| 레이아웃과 모션 | 3 |

| 단계 | 수 | 범위 | 상태 |
|---|---:|---|---|
| 0 | 6 | Modal Dialog · Bottom Sheet · Accordion · Skeleton Screen · Combobox · Data Grid | 구현 |
| 1 | 8 | Tooltip · Popover · Toast Notification · Tabs · Select · Switch · Checkbox · Radio Group | 구현 |
| 2 | 12 | Button · Icon Button · Toggle Button · Segmented Control · Text Field · Textarea · Search Field · Slider · Breadcrumb · Pagination · Disclosure · Inline Alert | 구현 |
| 3 | 12 | Floating Action Button · Date Picker · File Upload · Navigation Drawer · Bottom Navigation · Menu Button · Stepper · Card · List · Alert Dialog · Progress Bar · Loading Spinner | 구현 |
| 4 | 12 | Tree View · Carousel · Data Table · Snackbar · Empty State · Sorting · Filtering · Load More · Drag and Drop · Responsive Layout · Sticky Header · Easing | 구현 |

0단계는 기존 6개, 1단계는 필수 선택·도움말 8개, 2단계는 실행·입력·탐색 12개입니다. 3단계는 입력·탐색·정보·상태 12개이며 4단계는 계층 탐색·상태·데이터 조작·레이아웃 12개이며 2026-11-27에 개별 공식 문서와 동작 계약을 확인했습니다. 단계 수는 일정 약속이 아닌 검토 가능한 제작 묶음입니다.

## 이번에 보류한 10개

C32 비모달 대화상자, C40 알림 배너, C41 배지, C49 무한 스크롤, C52 스와이프 행동, C53 당겨서 새로고침, C56 분할 보기, C57 Fade, C58 Slide, C59 Scale은 후속 확장으로 보류합니다. 서로 같은 UI라는 뜻은 아닙니다. 초기에는 중복되는 기초 구조의 설명을 줄이고, 터치 제스처·대규모 탐색은 실기기와 복구 검증 시간을 확보한 뒤 제작합니다. Fade·Slide·Scale의 동작 설명은 해당 컴포넌트의 관찰 예시에서 먼저 제공합니다. Toast와 Snackbar는 서로 다른 디자인 시스템 맥락을 비교하는 별도 항목으로 유지합니다.

## 항목별 완료 기준

- 영문·한국어 발음·한국어 표현, 정의·용도·관련 용어·동작 검색어를 작성합니다. 검색어와 정식 동의어를 혼동하지 않습니다.
- 정적 이미지 대신 HTML/CSS/React로 UI를 그립니다. 목록과 동작 관찰은 자동 루프, 상세 체험은 실제 입력으로 조작합니다. OS 네이티브 UI의 그림은 설명용임을 명시합니다.
- 정상·오류·비어 있음·취소 등 필요한 상태를 실제 체험 또는 명시적인 화면 예시로 구분합니다. 예시는 발생 조건과 처리 방법을 함께 적습니다.
- 4개 직무별 목표·구체 업무·전달 계약·확인 항목을 제공합니다. 복사 코드는 해당 UI만 기본 표시하고 전체 실행 예제는 선택 시 제공합니다.
- PC·모바일과 마우스·키보드·터치를 따로 검토하고 좁은 화면 대안을 적습니다. 브라우저 폭 전환을 실기기 검증으로 기록하지 않습니다.
- 등록·코드 조각 타입 검사·게시 검증·검색·데이터 보존과 React/HTML 양쪽 체험을 확인합니다. 출처·한계·남은 검증은 검수 기록에 남깁니다.

세부 구현·검수 조건은 [1단계 명세](essentials-spec.md)·[2단계 명세](foundations-spec.md)·[3단계 명세](patterns-spec.md)·[4단계 명세](advanced-spec.md)를 따릅니다.
