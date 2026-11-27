export const backgroundRegistry = [
  {
    id: "mesh-gradient",
    name: "Mesh Gradient",
    file: "src/demos/backgrounds.tsx",
    component: "MeshGradientScene",
    description: "여러 위치의 색이 부드럽게 섞이며 배경의 분위기를 만들어요.",
    duration: 4000,
    poster: 1700,
    steps: ["기본 장면", "표현 변화", "다른 강도", "부드럽게 반복"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "aurora",
    name: "Aurora",
    file: "src/demos/backgrounds.tsx",
    component: "AuroraScene",
    description: "넓은 빛의 띠가 천천히 휘고 겹치며 움직여요.",
    duration: 4000,
    poster: 1700,
    steps: ["기본 장면", "표현 변화", "다른 강도", "부드럽게 반복"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "grain",
    name: "Grain",
    file: "src/demos/backgrounds.tsx",
    component: "GrainScene",
    description: "배경 위에 고운 노이즈를 얹어 종이 같은 질감을 더해요.",
    duration: 4000,
    poster: 1700,
    steps: ["기본 장면", "표현 변화", "다른 강도", "부드럽게 반복"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence",
  },
  {
    id: "dot-grid",
    name: "Dot Grid",
    file: "src/demos/backgrounds.tsx",
    component: "DotGridScene",
    description: "작은 점을 규칙적으로 배치해 화면의 기준감을 만들어요.",
    duration: 4000,
    poster: 1700,
    steps: ["기본 장면", "표현 변화", "다른 강도", "부드럽게 반복"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "beams",
    name: "Beams",
    file: "src/demos/backgrounds.tsx",
    component: "BeamsScene",
    description: "가느다란 선 위로 짧은 빛줄기가 지나가요.",
    duration: 4000,
    poster: 1700,
    steps: ["기본 장면", "표현 변화", "다른 강도", "부드럽게 반복"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "blob",
    name: "Blob",
    file: "src/demos/backgrounds.tsx",
    component: "BlobScene",
    description: "또렷한 덩어리가 모양을 바꾸며 천천히 움직여요.",
    duration: 4000,
    poster: 1700,
    steps: ["기본 장면", "표현 변화", "다른 강도", "부드럽게 반복"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "glow-orb",
    name: "Glow Orb",
    file: "src/demos/backgrounds.tsx",
    component: "GlowOrbScene",
    description: "흐릿한 빛 덩어리가 경계 없이 섞이며 움직여요.",
    duration: 4000,
    poster: 1700,
    steps: ["기본 장면", "표현 변화", "다른 강도", "부드럽게 반복"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "particles",
    name: "Particles",
    file: "src/demos/backgrounds.tsx",
    component: "ParticlesScene",
    description: "작은 입자들이 서로 다른 위치에서 가볍게 떠다녀요.",
    duration: 4000,
    poster: 1700,
    steps: ["기본 장면", "표현 변화", "다른 강도", "부드럽게 반복"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "starfield",
    name: "Starfield",
    file: "src/demos/backgrounds.tsx",
    component: "StarfieldScene",
    description: "별이 중심에서 바깥으로 커지며 다가와 깊이감을 만들어요.",
    duration: 4000,
    poster: 1700,
    steps: ["기본 장면", "표현 변화", "다른 강도", "부드럽게 반복"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
] as const;
export const effectRegistry = [
  {
    id: "magnetic-button",
    name: "Magnetic Button",
    component: "MagneticButtonScene",
    steps: ["기본 화면", "포인터 접근", "효과 확인", "초기 상태 복귀"],
    source: "https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events",
    description: "버튼이 커서 쪽으로 조금 이동해 주요 행동을 강조해요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "image-trail",
    name: "Image Trail",
    component: "ImageTrailScene",
    steps: ["기본 화면", "포인터 접근", "효과 확인", "초기 상태 복귀"],
    source: "https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events",
    description: "커서가 지나간 자리에 이미지가 잠시 남았다 사라져요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "hover-reveal",
    name: "Hover Reveal",
    component: "HoverRevealScene",
    steps: ["기본 화면", "포인터 접근", "효과 확인", "초기 상태 복귀"],
    source: "https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events",
    description: "제목에 마우스나 초점을 두면 연결된 이미지가 나타나요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "blend-cursor",
    name: "Blend Mode Cursor",
    component: "BlendCursorScene",
    steps: ["기본 화면", "포인터 접근", "효과 확인", "초기 상태 복귀"],
    source: "https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events",
    description: "커서 장식이 겹치는 부분의 배경과 글자 색을 반전해요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "spotlight",
    name: "Spotlight",
    component: "SpotlightScene",
    steps: ["기본 화면", "포인터 접근", "효과 확인", "초기 상태 복귀"],
    source: "https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events",
    description: "어두운 이미지 위에서 포인터 주변을 밝게 비춰요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "tilt-card",
    name: "Tilt Card",
    component: "TiltCardScene",
    steps: ["기본 화면", "포인터 접근", "효과 확인", "초기 상태 복귀"],
    source: "https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events",
    description: "커서 위치에 맞춰 카드가 입체적으로 기울어져요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "cursor-label",
    name: "Cursor Label",
    component: "CursorLabelScene",
    steps: ["기본 화면", "포인터 접근", "효과 확인", "초기 상태 복귀"],
    source: "https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events",
    description: "커서 옆 라벨로 클릭하면 할 수 있는 행동을 알려줘요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "ripple",
    name: "Ripple",
    component: "RippleScene",
    steps: ["기본 화면", "포인터 접근", "효과 확인", "초기 상태 복귀"],
    source: "https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events",
    description: "버튼을 누른 자리에서 물결이 퍼져 입력을 확인시켜요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "cursor-trail",
    name: "Cursor Trail",
    component: "CursorTrailScene",
    steps: ["기본 화면", "포인터 접근", "효과 확인", "초기 상태 복귀"],
    source: "https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events",
    description: "포인터 뒤를 작은 점들이 지연되어 따라와요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "masonry",
    name: "Masonry",
    component: "MasonryScene",
    steps: ["원본 확인", "장면 선택", "변화 비교", "다시 살펴보기"],
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform",
    description: "서로 다른 비율의 이미지를 열마다 쌓아 보여줘요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "lightbox",
    name: "Lightbox",
    component: "LightboxScene",
    steps: ["원본 확인", "장면 선택", "변화 비교", "다시 살펴보기"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
    description: "썸네일을 누르면 배경을 어둡게 하고 크게 보여줘요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "before-after-slider",
    name: "Before/After Slider",
    component: "BeforeAfterScene",
    steps: ["원본 확인", "장면 선택", "변화 비교", "다시 살펴보기"],
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform",
    description: "한 장면 위에서 경계를 움직여 전후 차이를 비교해요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "ken-burns",
    name: "Ken Burns Effect",
    component: "KenBurnsScene",
    steps: ["원본 확인", "장면 선택", "변화 비교", "다시 살펴보기"],
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform",
    description: "정지 사진을 천천히 확대·이동해 장면에 흐름을 더해요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "image-magnifier",
    name: "Image Magnifier",
    component: "MagnifierScene",
    steps: ["원본 확인", "장면 선택", "변화 비교", "다시 살펴보기"],
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform",
    description: "사진 전체를 유지하면서 포인터 주변을 확대해 보여줘요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "image-accordion",
    name: "Image Accordion",
    component: "ImageAccordionScene",
    steps: ["원본 확인", "장면 선택", "변화 비교", "다시 살펴보기"],
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform",
    description: "선택한 사진을 넓히고 다른 사진은 좁게 남겨요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "image-hotspot",
    name: "Image Hotspot",
    component: "ImageHotspotScene",
    steps: ["원본 확인", "장면 선택", "변화 비교", "다시 살펴보기"],
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform",
    description: "사진 위 번호를 눌러 해당 요소의 설명을 확인해요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
  {
    id: "halftone",
    name: "Halftone",
    component: "HalftoneScene",
    steps: ["원본 확인", "장면 선택", "변화 비교", "다시 살펴보기"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas",
    description: "이미지의 명암을 크고 작은 점으로 바꿔 표현해요.",
    file: "src/demos/effects.tsx",
    duration: 4000,
    poster: 1700,
  },
] as const;
const advancedRegistry = [
  {
    id: "tree-view",
    name: "Tree View",
    component: "TreeScene",
    description: "폴더를 펼쳐 계층을 탐색하고 문서를 선택해요.",
    steps: ["닫힌 계층", "폴더 펼침", "하위 문서 탐색", "문서 선택"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/",
  },
  {
    id: "carousel",
    name: "Carousel",
    component: "CarouselScene",
    description: "이전·다음으로 콘텐츠를 넘겨 순서대로 살펴봐요.",
    steps: ["첫 콘텐츠", "다음 콘텐츠", "마지막 콘텐츠", "처음 복귀"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/carousel/",
  },
  {
    id: "data-table",
    name: "Data Table",
    component: "DataTableScene",
    description: "행과 열의 관계로 자료를 읽고 조건별 결과를 확인해요.",
    steps: ["전체 표", "조회 조건", "결과 비교", "조회 완료"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/table/",
  },
  {
    id: "snackbar",
    name: "Snackbar",
    component: "SnackbarScene",
    description: "짧은 작업 결과를 알리고 되돌리기 행동을 제공해요.",
    steps: ["보관 전", "보관 알림", "되돌리기 행동", "복원 결과"],
    source: "https://mui.com/material-ui/react-snackbar/",
  },
  {
    id: "empty-state",
    name: "Empty State",
    component: "EmptyStateScene",
    description: "첫 사용·필터 무결과·조회 실패에 맞는 다음 행동을 안내해요.",
    steps: ["첫 사용", "생성 결과", "조건 무결과", "조회 실패"],
    source:
      "https://www.carbondesignsystem.com/building-blocks/core/patterns/empty-states",
  },
  {
    id: "sorting",
    name: "Sorting",
    component: "SortingScene",
    description: "이름·금액 순으로 같은 항목의 표시 순서를 바꿔요.",
    steps: ["원본 순서", "낮은 금액순", "높은 금액순", "이름순"],
    source:
      "https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/",
  },
  {
    id: "filtering",
    name: "Filtering",
    component: "FilteringScene",
    description: "분류와 담당 조건을 조합해 필요한 항목만 확인해요.",
    steps: ["전체 결과", "분류 조건", "복합 조건", "조건 무결과"],
    source: "https://carbondesignsystem.com/patterns/filtering/",
  },
  {
    id: "load-more",
    name: "Load More",
    component: "LoadMoreScene",
    description: "기존 목록을 유지한 채 다음 항목을 추가로 불러와요.",
    steps: ["첫 목록", "추가 대기", "다음 묶음", "모두 불러옴"],
    source: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html",
  },
  {
    id: "drag-and-drop",
    name: "Drag and Drop",
    component: "DragDropScene",
    description: "항목을 끌거나 이동 버튼으로 원하는 순서를 만들어요.",
    steps: ["기존 순서", "항목 집기", "이동 후보", "순서 변경"],
    source:
      "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html",
  },
  {
    id: "responsive-layout",
    name: "Responsive Layout",
    component: "ResponsiveScene",
    description: "같은 콘텐츠를 실제 사용 가능한 너비에 맞게 재배치해요.",
    steps: ["넓은 영역", "좁은 영역", "세로 재배치", "넓게 복귀"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries",
  },
  {
    id: "sticky-header",
    name: "Sticky Header",
    component: "StickyHeaderScene",
    description: "문서를 스크롤해도 제목이 영역 상단에 남아 있어요.",
    steps: ["문서 상단", "내부 스크롤", "헤더 유지", "맨 위 복귀"],
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/position",
  },
  {
    id: "easing",
    name: "Easing",
    component: "EasingScene",
    description: "같은 거리와 시간에서 움직임의 중간 속도를 비교해요.",
    steps: ["같은 출발점", "다른 중간 속도", "종점 접근", "같은 도착점"],
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function",
  },
].map((demo) => ({
  ...demo,
  file: "src/demos/advanced.tsx",
  duration: 4000,
  poster: 1700,
})) as readonly {
  id:
    | "tree-view"
    | "carousel"
    | "data-table"
    | "snackbar"
    | "empty-state"
    | "sorting"
    | "filtering"
    | "load-more"
    | "drag-and-drop"
    | "responsive-layout"
    | "sticky-header"
    | "easing";
  name: string;
  component: string;
  description: string;
  steps: readonly string[];
  source: string;
  file: string;
  duration: number;
  poster: number;
}[];
const patternRegistry = [
  {
    id: "floating-action-button",
    name: "Floating Action Button",
    component: "FabScene",
    description: "화면의 주요 행동을 떠 있는 버튼으로 빠르게 실행해요.",
    steps: [
      "단일 생성 버튼",
      "작성 창 열기",
      "보조 행동 펼치기",
      "목록에 추가",
    ],
    source: "https://developer.android.com/develop/ui/compose/components/fab",
  },
  {
    id: "date-picker",
    name: "Date Picker (Single)",
    component: "DatePickerScene",
    description: "달력과 직접 입력으로 조건에 맞는 날짜를 골라요.",
    steps: ["달력 열기", "날짜 탐색", "하루 선택", "예약 값 반영"],
    source:
      "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/",
  },
  {
    id: "date-range-picker",
    name: "Date Picker (Range)",
    component: "DateRangePickerScene",
    description: "한 달력에서 시작일과 마감일을 골라 기간을 선택해요.",
    steps: ["기간 선택 전", "시작일 선택", "마감일 선택", "기간 확인"],
    source: "https://react-aria.adobe.com/DateRangePicker",
  },
  {
    id: "file-upload",
    name: "File Upload",
    component: "FileUploadScene",
    description: "자료를 선택하고 형식·용량·전송 상태를 확인해요.",
    steps: ["파일 선택 전", "파일 확인", "전송 중", "첨부 완료"],
    source: "https://design-system.service.gov.uk/components/file-upload/",
  },
  {
    id: "navigation-drawer",
    name: "Navigation Drawer",
    component: "DrawerScene",
    description: "화면 옆에서 탐색 메뉴를 열고 목적지로 이동해요.",
    steps: ["현재 화면", "탐색 메뉴", "목적지 선택", "화면 변경"],
    source:
      "https://developer.android.com/develop/ui/compose/components/drawer",
  },
  {
    id: "bottom-navigation",
    name: "Bottom Navigation",
    component: "BottomNavScene",
    description: "화면 아래에서 주요 목적지를 오가며 맥락을 유지해요.",
    steps: ["홈 화면", "저장한 노트", "내 정보", "홈으로 복귀"],
    source:
      "https://developer.android.com/develop/ui/compose/components/navigation-bar",
  },
  {
    id: "menu-button",
    name: "Menu Button",
    component: "MenuButtonScene",
    description: "버튼 하나로 관련 동작 메뉴를 펼치고 실행해요.",
    steps: ["메뉴 닫힘", "메뉴 열기", "동작 탐색", "동작 적용"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/",
  },
  {
    id: "stepper",
    name: "Stepper",
    component: "StepperScene",
    description: "여러 단계의 현재 위치와 완료 여부를 확인해요.",
    steps: ["기본 정보", "공개 범위", "검토 단계", "작성 완료"],
    source: "https://designsystem.digital.gov/components/step-indicator/",
  },
  {
    id: "card",
    name: "Card",
    component: "CardScene",
    description: "관련 정보와 행동을 하나의 묶음으로 읽고 열어요.",
    steps: ["정보 묶음", "카드 탐색", "노트 저장", "저장 상태"],
    source: "https://designsystem.digital.gov/components/card/",
  },
  {
    id: "list",
    name: "List",
    component: "ListScene",
    description: "반복되는 정보를 행으로 정리하고 개별 항목을 다뤄요.",
    steps: ["검토 대기", "일부 완료", "모두 완료", "완료 숨김"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul",
  },
  {
    id: "alert-dialog",
    name: "Alert Dialog",
    component: "AlertDialogScene",
    description: "중요한 행동의 결과를 설명하고 확실한 응답을 받아요.",
    steps: ["삭제 요청 전", "결과 안내", "삭제 확인", "삭제 결과"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/",
  },
  {
    id: "progress-bar",
    name: "Progress Bar",
    component: "ProgressScene",
    description: "전체 작업 중 완료된 비율을 막대와 숫자로 보여줘요.",
    steps: ["시작 전", "진행 중", "완료 직전", "완료"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress",
  },
  {
    id: "loading-spinner",
    name: "Loading Spinner",
    component: "SpinnerScene",
    description: "완료 비율을 모를 때 작업 중임을 움직임으로 알려줘요.",
    steps: ["조회 전", "처리 중", "계속 대기", "조회 완료"],
    source: "https://carbondesignsystem.com/components/loading/usage/",
  },
].map((demo) => ({
  ...demo,
  file: "src/demos/patterns.tsx",
  duration: 4000,
  poster: 1700,
})) as readonly {
  id:
    | "floating-action-button"
    | "date-picker"
    | "date-range-picker"
    | "file-upload"
    | "navigation-drawer"
    | "bottom-navigation"
    | "menu-button"
    | "stepper"
    | "card"
    | "list"
    | "alert-dialog"
    | "progress-bar"
    | "loading-spinner";
  name: string;
  component: string;
  description: string;
  steps: readonly string[];
  source: string;
  file: string;
  duration: number;
  poster: number;
}[];
/** Stage 2 executable references. Semantic patterns are cited separately from our visual styling. */
const foundationRegistry = [
  {
    id: "button",
    name: "Button",
    component: "ButtonScene",
    description: "실행·중복 차단·저장 성공과 실패",
    steps: ["실행 전", "저장 요청", "결과 확인", "다시 실행"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
  },
  {
    id: "icon-button",
    name: "Icon Button",
    component: "IconButtonScene",
    description: "아이콘 이름·도구 실행·보관 취소",
    steps: ["도구 모음", "복사 도구", "보관 실행", "결과 안내"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
  },
  {
    id: "toggle-button",
    name: "Toggle Button",
    component: "ToggleButtonScene",
    description: "고정 이름·눌림 상태·독립 서식 전환",
    steps: ["기본 서식", "굵게 켜기", "기울임 함께", "서식 해제"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
  },
  {
    id: "segmented-control",
    name: "Segmented Control",
    component: "SegmentedScene",
    description: "분할 선택·라디오 키보드·요금 비교",
    steps: ["월간 선택", "옵션 비교", "연간 선택", "월간 복귀"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/",
  },
  {
    id: "text-field",
    name: "Text Field",
    component: "TextFieldScene",
    description: "라벨·한 줄 입력·길이 오류·저장",
    steps: ["입력 전", "이름 입력", "조건 확인", "저장 완료"],
    source: "https://design-system.service.gov.uk/components/text-input/",
  },
  {
    id: "textarea",
    name: "Textarea",
    component: "TextareaScene",
    description: "여러 줄 입력·문자 수·범위 오류",
    steps: ["입력 전", "의견 작성", "줄바꿈", "작성 완료"],
    source: "https://design-system.service.gov.uk/components/textarea/",
  },
  {
    id: "search-field",
    name: "Search Field",
    component: "SearchFieldScene",
    description: "한글 조합·검색 중·무결과·조회 실패",
    steps: ["검색 전", "검색 요청", "결과 로딩", "결과 확인"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search",
  },
  {
    id: "slider",
    name: "Slider",
    component: "SliderScene",
    description: "범위·단계·방향키·정확한 숫자 입력",
    steps: ["낮은 값", "값 증가", "높은 값", "값 감소"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/slider/",
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    component: "BreadcrumbScene",
    description: "계층 경로·상위 이동·현재 위치",
    steps: ["현재 문서", "상위 프로젝트", "작업 공간", "경로 복귀"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/",
  },
  {
    id: "pagination",
    name: "Pagination",
    component: "PaginationScene",
    description: "페이지 이동·현재 페이지·처음과 끝",
    steps: ["첫 페이지", "다음 결과", "마지막 페이지", "처음 복귀"],
    source: "https://design-system.service.gov.uk/components/pagination/",
  },
  {
    id: "disclosure",
    name: "Disclosure",
    component: "DisclosureScene",
    description: "네이티브 details·Enter·Space·접기",
    steps: ["설명 접힘", "추가 조건 열기", "내용 읽기", "다시 접기"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/",
  },
  {
    id: "inline-alert",
    name: "Inline Alert",
    component: "InlineAlertScene",
    description: "지속 안내·성공·주의·실패·재시도",
    steps: ["일반 안내", "주의 사항", "실패와 복구", "저장 완료"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/alert/",
  },
].map((demo) => ({
  ...demo,
  file: "src/demos/foundations.tsx",
  duration: 4000,
  poster: 1700,
})) as readonly {
  id:
    | "button"
    | "icon-button"
    | "toggle-button"
    | "segmented-control"
    | "text-field"
    | "textarea"
    | "search-field"
    | "slider"
    | "breadcrumb"
    | "pagination"
    | "disclosure"
    | "inline-alert";
  name: string;
  component: string;
  description: string;
  steps: readonly string[];
  source: string;
  file: string;
  duration: number;
  poster: number;
}[];

/** Developer-owned executable demos. Content editors connect to these stable IDs. */
export const simulationRegistry = [
  {
    id: "modal",
    name: "Modal Dialog",
    file: "src/demos/components.tsx",
    component: "ModalScene",
    description: "네이티브 모달·입력·저장·포커스 복귀",
    duration: 3200,
    poster: 1400,
    steps: ["기본 화면", "모달 열기", "선택에 집중", "닫고 돌아가기"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
  },
  {
    id: "bottom-sheet",
    name: "Bottom Sheet",
    file: "src/demos/components.tsx",
    component: "SheetScene",
    description: "하단 패널·행동 선택·드래그 닫기",
    duration: 3800,
    poster: 1600,
    steps: ["기본 화면", "아래에서 진입", "항목 선택", "결과 반영"],
    source:
      "https://developer.android.com/develop/ui/compose/components/bottom-sheets",
  },
  {
    id: "accordion",
    name: "Accordion",
    file: "src/demos/components.tsx",
    component: "AccordionScene",
    description: "단일·복수 펼침과 키보드 조작",
    duration: 3600,
    poster: 2500,
    steps: ["제목 훑어보기", "첫 내용 펼침", "다른 내용으로 이동", "내용 읽기"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/",
  },
  {
    id: "skeleton",
    name: "Skeleton Screen",
    file: "src/demos/components.tsx",
    component: "SkeletonScene",
    description: "로딩·성공·빈 결과·실패",
    duration: 3200,
    poster: 1100,
    steps: ["자리표시", "불러오는 중", "콘텐츠 전환", "읽을 준비 완료"],
    source:
      "https://www.carbondesignsystem.com/building-blocks/core/patterns/loading",
  },
  {
    id: "combobox",
    name: "Combobox",
    file: "src/demos/components.tsx",
    component: "ComboScene",
    description: "한글 입력·후보 탐색·선택 확정",
    duration: 3600,
    poster: 1700,
    steps: ["도시 입력", "추천 목록 열림", "후보 탐색", "선택 확정"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",
  },
  {
    id: "data-grid",
    name: "Data Grid",
    file: "src/demos/components.tsx",
    component: "GridScene",
    description: "셀 탐색·수량 검증·편집·취소",
    duration: 3800,
    poster: 1000,
    steps: ["셀 선택", "키보드로 이동", "값 편집", "변경 확정"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/grid/",
  },
  {
    id: "tooltip",
    name: "Tooltip",
    file: "src/demos/essentials.tsx",
    component: "TooltipScene",
    description: "호버·포커스·Esc와 터치 도움말",
    duration: 4000,
    poster: 1700,
    steps: ["버튼 발견", "설명 나타남", "설명 읽기", "닫고 실행"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/",
  },
  {
    id: "popover",
    name: "Popover",
    file: "src/demos/essentials.tsx",
    component: "PopoverScene",
    description: "비모달 보기 설정·외부 클릭·Esc",
    duration: 4000,
    poster: 1700,
    steps: ["보기 설정", "레이어 열림", "옵션 선택", "적용 후 복귀"],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover",
  },
  {
    id: "toast",
    name: "Toast",
    file: "src/demos/essentials.tsx",
    component: "ToastScene",
    description: "완료 알림·닫기·시간 정지·알림 기록",
    duration: 4000,
    poster: 1700,
    steps: ["저장 실행", "완료 알림", "메시지 읽기", "알림 사라짐"],
    source:
      "https://www.carbondesignsystem.com/building-blocks/core/components/notification/guidelines",
  },
  {
    id: "tabs",
    name: "Tabs",
    file: "src/demos/essentials.tsx",
    component: "TabsScene",
    description: "자동·수동 활성화와 방향키 탐색",
    duration: 4000,
    poster: 1700,
    steps: ["개요 보기", "활동으로 전환", "멤버 보기", "개요로 복귀"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/",
  },
  {
    id: "select",
    name: "Select",
    file: "src/demos/essentials.tsx",
    component: "SelectScene",
    description: "목록과 같은 선택 패널·키보드·필수값 오류·적용",
    duration: 4000,
    poster: 1700,
    steps: ["선택 전", "목록 열기", "옵션 선택", "선택값 적용"],
    source:
      "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/",
  },
  {
    id: "switch",
    name: "Switch",
    file: "src/demos/essentials.tsx",
    component: "SwitchScene",
    description: "설정 전환·저장 대기·실패 원복",
    duration: 4000,
    poster: 1700,
    steps: ["꺼짐", "켜기", "저장 중", "켜짐 반영"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/switch/",
  },
  {
    id: "checkbox",
    name: "Checkbox",
    file: "src/demos/essentials.tsx",
    component: "CheckboxScene",
    description: "다중 선택·전체 선택·부분 선택",
    duration: 4000,
    poster: 1700,
    steps: ["선택 없음", "일부 선택", "모두 선택", "부분 선택"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/",
  },
  {
    id: "radio-group",
    name: "Radio Group",
    file: "src/demos/essentials.tsx",
    component: "RadioScene",
    description: "배타적 선택·필수 오류·선택 초기화",
    duration: 4000,
    poster: 1700,
    steps: ["선택 전", "일반 배송", "빠른 배송", "한 개 선택 유지"],
    source: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/",
  },
  ...foundationRegistry,
  ...patternRegistry,
  ...advancedRegistry,
  ...effectRegistry,
  ...backgroundRegistry,
] as const;
export type SimulationId = (typeof simulationRegistry)[number]["id"];
