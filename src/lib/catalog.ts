import { advancedSeeds } from "./advanced-seeds";
import { effectSeeds } from "./effect-seeds";
import { backgroundSeeds } from "./background-content";
import { patternSeeds } from "./pattern-seeds";
import { foundationSeeds } from "./foundation-seeds";
import { simulationRegistry, type SimulationId } from "../demos/registry";
export const DEMO_IDS = simulationRegistry.map((demo) => demo.id);
export type DemoId = SimulationId;
export type Term = {
  id: string;
  demoId: DemoId;
  english: string;
  pronunciation: string;
  korean: string;
  category: string;
  summary: string;
  aliases: string[];
  keywords: string[];
  hidden: boolean;
  deleted?: boolean;
  order: number;
  revision: number;
};
export const categories = [
  "레이어와 도움말",
  "정보 구조와 콘텐츠",
  "입력과 검색",
  "피드백과 상태",
  "조작과 데이터 탐색",
  "실행과 선택",
  "탐색과 이동",
  "레이아웃과 모션",
  "커서와 인터랙션",
  "이미지와 갤러리",
  "배경 효과",
];
export const seeds: Term[] = [
  {
    id: "modal",
    demoId: "modal",
    english: "Modal Dialog",
    pronunciation: "모달 다이얼로그",
    korean: "모달 대화상자",
    category: categories[0],
    summary: "하던 일을 잠시 멈추고, 중요한 선택에 집중하게 해요.",
    aliases: ["모달", "레이어 팝업"],
    keywords: ["가운데 뜨는 창", "배경을 막는 창", "확인창", "팝업"],
    hidden: false,
    order: 0,
    revision: 1,
  },
  {
    id: "bottom-sheet",
    demoId: "bottom-sheet",
    english: "Bottom Sheet",
    pronunciation: "바텀시트",
    korean: "하단 펼침 패널",
    category: categories[0],
    summary: "화면 아래에서 올라와 선택지나 보조 정보를 보여줘요.",
    aliases: ["하단 패널", "바텀 시트"],
    keywords: [
      "아래에서 올라오는 창",
      "하단에서 올라옴",
      "슬라이드",
      "끌어서 닫기",
      "팝업",
    ],
    hidden: false,
    order: 1,
    revision: 1,
  },
  {
    id: "accordion",
    demoId: "accordion",
    english: "Accordion",
    pronunciation: "아코디언",
    korean: "접이식 섹션",
    category: categories[1],
    summary: "필요한 내용만 펼쳐서 긴 정보를 정리해요.",
    aliases: ["접이식 목록", "FAQ"],
    keywords: ["접었다 펴는 목록", "접기", "펼치기", "늘어나는 목록"],
    hidden: false,
    order: 2,
    revision: 1,
  },
  {
    id: "skeleton",
    demoId: "skeleton",
    english: "Skeleton Screen",
    pronunciation: "스켈레톤 스크린",
    korean: "자리표시 로딩",
    category: categories[3],
    summary: "콘텐츠가 도착하기 전에 화면의 구조를 먼저 알려줘요.",
    aliases: ["스켈레톤 UI", "플레이스홀더"],
    keywords: [
      "회색 박스",
      "회색 뼈대",
      "반짝이는 로딩",
      "로딩 화면",
      "shimmer",
    ],
    hidden: false,
    order: 3,
    revision: 1,
  },
  {
    id: "combobox",
    demoId: "combobox",
    english: "Combobox",
    pronunciation: "콤보박스",
    korean: "추천 목록 입력",
    category: categories[2],
    summary: "입력과 선택을 함께 제공해 원하는 값을 빠르게 찾아요.",
    aliases: ["자동완성", "검색형 선택"],
    keywords: [
      "검색 가능한 선택",
      "드롭다운",
      "입력하면 나오는 목록",
      "추천 검색",
    ],
    hidden: false,
    order: 4,
    revision: 1,
  },
  {
    id: "data-grid",
    demoId: "data-grid",
    english: "Data Grid",
    pronunciation: "데이터 그리드",
    korean: "편집 가능한 데이터 격자",
    category: categories[4],
    summary: "행과 열로 된 데이터를 키보드로 탐색하고 수정해요.",
    aliases: ["편집 표", "인터랙티브 그리드"],
    keywords: ["엑셀 같은 표", "수정하는 표", "표 편집", "셀 선택", "grid"],
    hidden: false,
    order: 5,
    revision: 1,
  },
  {
    id: "tooltip",
    demoId: "tooltip",
    english: "Tooltip",
    pronunciation: "툴팁",
    korean: "짧은 보충 설명",
    category: "레이어와 도움말",
    summary: "마우스나 키보드 초점으로 짧은 보충 설명을 읽어요.",
    aliases: ["도움말 풍선", "호버 설명"],
    keywords: ["마우스 올리면 뜨는 설명", "호버", "말풍선", "focus"],
    hidden: false,
    order: 6,
    revision: 1,
  },
  {
    id: "popover",
    demoId: "popover",
    english: "Popover",
    pronunciation: "팝오버",
    korean: "보조 정보 패널",
    category: "레이어와 도움말",
    summary: "버튼 가까이에서 짧은 설정이나 보조 작업을 처리해요.",
    aliases: ["보조 패널", "앵커 패널"],
    keywords: [
      "버튼 옆에 뜨는 창",
      "바깥 클릭으로 닫힘",
      "간단한 설정",
      "비모달",
    ],
    hidden: false,
    order: 7,
    revision: 1,
  },
  {
    id: "toast",
    demoId: "toast",
    english: "Toast",
    pronunciation: "토스트",
    korean: "일시적 결과 알림",
    category: "피드백과 상태",
    summary: "작업을 방해하지 않고 짧은 완료 소식을 알려줘요.",
    aliases: ["토스트 알림", "플로팅 알림"],
    keywords: [
      "잠깐 떴다 사라지는 알림",
      "저장 완료",
      "자동 닫힘",
      "알림 메시지",
    ],
    hidden: false,
    order: 8,
    revision: 1,
  },
  {
    id: "tabs",
    demoId: "tabs",
    english: "Tabs",
    pronunciation: "탭스",
    korean: "탭 패널 전환",
    category: "탐색과 이동",
    summary: "관련된 콘텐츠를 같은 자리에서 바꿔 보여줘요.",
    aliases: ["탭", "탭 패널"],
    keywords: ["밑줄 이동", "패널 바뀜", "가로 메뉴", "방향키"],
    hidden: false,
    order: 9,
    revision: 1,
  },
  {
    id: "select",
    demoId: "select",
    english: "Select",
    pronunciation: "셀렉트",
    korean: "단일 선택 목록",
    category: "입력과 검색",
    summary: "정해진 선택지에서 한 가지 값을 골라요.",
    aliases: ["선택 상자", "드롭다운 선택"],
    keywords: ["펼쳐서 선택", "드롭다운", "네이티브 선택", "옵션 목록"],
    hidden: false,
    order: 10,
    revision: 1,
  },
  {
    id: "switch",
    demoId: "switch",
    english: "Switch",
    pronunciation: "스위치",
    korean: "켜기·끄기 설정",
    category: "실행과 선택",
    summary: "설정을 켜거나 끄고 저장 결과를 확인해요.",
    aliases: ["토글 스위치", "온오프"],
    keywords: ["좌우로 움직이는 스위치", "켜짐", "꺼짐", "설정 전환"],
    hidden: false,
    order: 11,
    revision: 1,
  },
  {
    id: "checkbox",
    demoId: "checkbox",
    english: "Checkbox",
    pronunciation: "체크박스",
    korean: "복수 선택 입력",
    category: "실행과 선택",
    summary: "여러 항목을 고르고 전체·부분 선택을 구분해요.",
    aliases: ["체크 상자", "다중 선택"],
    keywords: ["체크 표시", "전체 선택", "부분 선택", "indeterminate"],
    hidden: false,
    order: 12,
    revision: 1,
  },
  {
    id: "radio-group",
    demoId: "radio-group",
    english: "Radio Group",
    pronunciation: "라디오 그룹",
    korean: "단일 선택 묶음",
    category: "실행과 선택",
    summary: "함께 비교할 선택지에서 하나만 골라요.",
    aliases: ["라디오 버튼", "옵션 버튼"],
    keywords: ["동그란 선택", "하나만 선택", "배타적 선택", "배송 선택"],
    hidden: false,
    order: 13,
    revision: 1,
  },
  ...foundationSeeds,
  ...patternSeeds,
  ...advancedSeeds,
  ...effectSeeds,
  ...backgroundSeeds,
];
// Executable metadata has one source of truth in the developer registry.
export type Guide = {
  steps: readonly string[];
  source: string;
  duration: number;
  poster: number;
};
export const guides = Object.fromEntries(
  simulationRegistry.map((demo) => [demo.id, demo]),
) as unknown as Record<DemoId, Guide>;
