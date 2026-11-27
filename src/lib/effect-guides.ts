import { simulationRegistry } from '../demos/registry';
const alternativeNotes: Record<string, string[]> = {
  "magnetic-button": [
    "정확하고 빠른 클릭이 중요한 결제·삭제·반복 실행에는 위치가 움직이지 않는 Button을 사용하세요.",
    "버튼 위치를 고정하면서 입력 반응만 주고 싶다면 Ripple로 누른 지점을 짧게 표시하세요.",
  ],
  "image-trail": [
    "작품별 제목과 순서를 확인하며 하나씩 탐색해야 한다면 Carousel로 명확한 이전·다음 조작을 제공하세요.",
    "여러 이미지의 비율과 분위기를 한 번에 비교해야 한다면 Masonry 갤러리에 고정 배치하세요.",
  ],
  "hover-reveal": [
    "사진을 처음부터 보고 비교해야 하는 상품 목록이라면 Card에 이미지·제목·행동을 기본으로 표시하세요.",
    "적은 사진 중 하나를 넓게 보면서 다른 선택지를 남기고 싶다면 Image Accordion을 사용하세요.",
  ],
  "blend-cursor": [
    "반전 장식보다 클릭 행동을 설명하는 것이 목적이라면 Cursor Label과 화면에 남는 행동명을 함께 사용하세요.",
    "이미지의 특정 부분을 조명처럼 강조하고 싶다면 색 반전보다 Spotlight가 의도에 가깝습니다.",
  ],
  spotlight: [
    "제품의 소재·마감 같은 세부를 실제로 크게 봐야 한다면 Image Magnifier로 해당 좌표를 확대하세요.",
    "제목에 대응하는 이미지를 잠깐 보여주는 목적이라면 Hover Reveal로 원본을 가리지 않고 안내하세요.",
  ],
  "tilt-card": [
    "긴 설명이나 많은 항목을 안정적으로 읽고 비교해야 한다면 기울지 않는 Card가 적합합니다.",
    "입체 움직임보다 관련 사진의 발견이 목적이라면 Hover Reveal로 짧은 미리보기를 제공하세요.",
  ],
  "cursor-label": [
    "아이콘의 뜻처럼 짧은 보충 설명이 필요하다면 키보드 초점에서도 나타나는 Tooltip을 사용하세요.",
    "모바일이나 포인터가 없는 환경에서는 Card의 고정된 제목·상세 보기 행동으로 안내하세요.",
  ],
  ripple: [
    "물결이 필요하지 않거나 실행 중·비활성 상태를 더 명확히 전달해야 한다면 Button의 상태를 먼저 설계하세요.",
    "서버 저장이 실제로 성공했다는 결과를 알려야 한다면 입력 물결과 별개로 Toast를 표시하세요.",
  ],
  "cursor-trail": [
    "포인터 궤적에 여러 작품의 분위기를 담는 것이 목적이라면 제한된 수의 Image Trail을 검토하세요.",
    "궤적보다 현재 대상에서 가능한 행동을 알려야 한다면 Cursor Label이 더 직접적입니다.",
  ],
  masonry: [
    "행 단위의 좌우 순서와 같은 높이의 비교가 중요하다면 Responsive Layout의 Grid 배치를 사용하세요.",
    "등록일·우선순위 같은 선형 읽기 순서가 중요하면 List에 사진과 제목을 한 행씩 정리하세요.",
  ],
  lightbox: [
    "이미지를 크게 띄우지 않고 여러 장을 같은 영역에서 순서대로 탐색하려면 Carousel이 적합합니다.",
    "전체 사진의 맥락을 남긴 채 특정 소재나 마감만 확대하려면 Image Magnifier를 함께 제공하세요.",
  ],
  "before-after-slider": [
    "사진 비교가 아닌 한 개의 연속 값 조절이 목적이면 일반 Slider로 값과 단위를 명확히 표시하세요.",
    "두 사진의 위치나 비율이 달라 겹쳐 비교하기 어렵다면 Lightbox에서 각각의 원본을 크게 보여주세요.",
  ],
  "ken-burns": [
    "한 사진 안의 확대보다 여러 장면을 사용자가 직접 선택해야 한다면 Carousel을 사용하세요.",
    "제품 정보를 정확히 읽거나 이미지를 고정해 비교해야 한다면 움직임 없는 Card가 적합합니다.",
  ],
  "image-magnifier": [
    "모바일에서 원하는 부분까지 직접 확대·이동하거나 원본 전체를 확인해야 한다면 Lightbox를 사용하세요.",
    "원본의 세부 확대가 아니라 같은 위치의 변화 비교가 목적이면 Before/After Slider가 적합합니다.",
  ],
  "image-accordion": [
    "장면 수가 많거나 한 번에 충분한 사진 폭을 확보하기 어렵다면 Carousel로 하나씩 보여주세요.",
    "모든 장면의 원본 비율을 한눈에 비교하게 하려면 Masonry 갤러리에 고정 배치하세요.",
  ],
  "image-hotspot": [
    "설명이 특정 이미지 좌표가 아니라 실행 버튼 가까이에 붙는 보조 설정이면 Popover를 사용하세요.",
    "점이 밀집하거나 모바일에서 번호가 겹치면 List에 번호·이름·설명을 순서대로 제공하세요.",
  ],
  halftone: [
    "원본과 가공 결과의 차이를 같은 위치에서 비교하는 것이 목적이면 Before/After Slider를 사용하세요.",
    "사진의 색·소재·제품 정보를 정확히 읽어야 한다면 가공하지 않은 이미지를 담은 Card가 적합합니다.",
  ],
};
import { effectDefinitions, type EffectId } from "./effect-definitions";
import type { DemoId } from "./catalog";
import type { DetailedGuide, GuidePoint, ScreenExample } from "./guide-content";
const point = (title: string, body: string): GuidePoint => ({ title, body });
export const effectGuides = Object.fromEntries(
  effectDefinitions.map((d) => {
    const examples: ScreenExample[] = [
      {
        id: "initial",
        label: "기본 상태",
        title: `${d.korean}의 기본 화면`,
        condition:
          "사용자가 처음 화면에 들어와 아직 아무 항목도 조작하지 않았을 때",
        explanation: `${d.use} 화면 제목·항목·실행 버튼을 먼저 보여주고 효과가 나타나기 전에도 무엇을 할 수 있는지 알 수 있게 합니다.`,
        screen: {
          title: d.korean,
          body: "효과가 시작되기 전에도 내용과 행동을 확인할 수 있어요.",
          items: [d.name, "원본 내용·제목 유지"],
        },
      },
      {
        id: "active",
        label: "동작 중",
        title: "입력 위치와 결과를 함께 보여주기",
        condition:
          "사용자가 마우스·키보드·터치 중 지원되는 방식으로 체험을 시작했을 때",
        explanation: `${d.flow} 움직임이 실행 결과를 대신하지 않도록 현재 선택이나 비율 같은 실제 상태는 텍스트로도 안내합니다.`,
        screen: {
          title: d.name,
          body: d.summary,
          items: [
            "입력 → 현재 위치/선택 → 화면 변화",
            "효과와 실제 처리 결과를 구분",
          ],
        },
      },
      {
        id: "fallback",
        label: "모바일·대안",
        title: "포인터가 없어도 내용에 접근하기",
        condition:
          "마우스가 없는 모바일이거나 움직임 없이 내용을 확인해야 하는 상황일 때",
        explanation: `${d.touch} 핵심 이미지·제목·행동을 남기고 같은 목적을 달성할 수 있는 대안을 화면에 직접 제공해야 합니다.`,
        screen: {
          title: "기본 이미지와 명확한 행동",
          body: d.touch,
          action: d.pointerOnly
            ? "고정 화면으로 내용 보기"
            : "같은 정보를 직접 조작하기",
        },
      },
    ];
    const guide: DetailedGuide = {
      introduction: `${d.name}(${d.pronunciation})은 ${d.summary} ${d.id === "halftone" ? "입력 컴포넌트가 아닌 이미지 표현 기법입니다." : "같은 콘텐츠와 행동에 시각적인 반응을 더하는 패턴입니다."} ${d.flow}`,
      uses: [
        point("실무에서 추천하는 상황", d.use),
        point(
          "우선 정할 판단 기준",
          `${d.touch} 효과 유무가 사용자가 해야 하는 실제 행동이나 핵심 정보의 접근성을 바꾸지 않는지 먼저 확인하세요.`,
        ),
      ],
      flow: [
        point(
          "기본 내용과 진입",
          `${d.use} 처음에는 제목과 원본 내용을 읽을 수 있는 안정적인 상태로 진입하고 실제 조작 대상을 명확히 표시합니다.`,
        ),
        point("조작과 화면 변화", d.flow),
        point("종료·대체 접근", d.touch),
      ],
      examples,
      pitfalls: [
        point("정보와 장식을 구분", d.touch),
        point("성능·좌표·수명 관리", d.engineering),
      ],
      alternatives: d.alternatives.map((id, index) => ({
        title: simulationRegistry.find((v) => v.id === id)!.name,
        body: alternativeNotes[d.id][index],
        targetDemoId: id as DemoId,
      })),
      practice: `${d.flow} PC와 모바일 전환을 비교하고 Tab·Enter 또는 제공된 대체 버튼으로도 내용을 확인하세요. ${d.touch}`,
      roles: {
        기획: {
          goal: "사용 목적과 대안 입력 방식을 함께 정의합니다.",
          tasks: [
            point("적용 위치와 기대 행동", d.use),
            point("모바일과 예외 정책", d.touch),
            point(
              "완료 기준과 전달",
              `효과를 보기 위한 입력과 실제 열기·선택·저장 행동을 분리해 명세합니다. ${d.flow}`,
            ),
          ],
          handoff: `전달 예시: ${d.use} 모바일 정책: ${d.touch}`,
          checks: [
            "효과가 없어도 핵심 내용과 다음 행동을 이해할 수 있나요?",
            "목적에 맞는 대안 UI를 비교하고 적용 범위를 정했나요?",
          ],
        },
        디자인: {
          goal: "원본·동작·대안 상태를 같은 구조로 설계합니다.",
          tasks: [
            point(
              "위계와 대표 장면",
              `${d.use} 원본 정보와 시각 효과가 겹칠 때도 제목·행동명이 가려지지 않는 배치를 만드세요.`,
            ),
            point("움직임과 반응", d.flow),
            point(
              "대안 화면·전달",
              `${d.touch} 기본·활성·초점·좁은 화면을 각각 제시하고 크기·최대 이동량·전환 시간을 수치로 전달하세요.`,
            ),
          ],
          handoff: `전달 예시: 원본 위치와 변화 후 상태를 같은 좌표로 비교합니다. ${d.flow} 대안: ${d.touch}`,
          checks: [
            "움직임 중 제목·버튼·초점이 잘리지 않나요?",
            "모바일 대안과 기본 상태도 완성된 화면으로 제공했나요?",
          ],
        },
        프론트엔드: {
          goal: "시연과 실제 조작의 구조를 일치시키고 입력 접근성을 구현합니다.",
          tasks: [
            point("실행 구조", d.engineering),
            point(
              "입력과 상태 연결",
              `${d.flow} 하나의 상태에서 화면과 접근성 속성을 함께 갱신하고 프리뷰만 가능한 가짜 동작이 되지 않게 합니다.`,
            ),
            point(
              "리사이즈·정리·대안",
              `${d.touch} 리사이즈 후 좌표와 가로 넘침을 확인하고 이벤트·프레임·타이머를 컴포넌트 해제 시 정리합니다.`,
            ),
          ],
          handoff: `전달 예시: ${d.engineering} 검수 시 입력 좌표와 결과·초점 복귀를 함께 확인합니다.`,
          checks: [
            "React와 HTML에서 같은 조작과 결과가 나오나요?",
            "터치·키보드·영역 이탈·크기 변경을 확인했나요?",
          ],
        },
        개발: {
          goal: "실제 데이터·이미지 로딩과 장식 상태를 분리합니다.",
          tasks: [
            point(
              "자료와 계약",
              `이미지 원본·설명·선택 id를 안정적으로 제공하고 이미지 주소 오류·지연 상태를 정의합니다. ${d.use}`,
            ),
            point(
              "권한·결과·복구",
              `${d.flow} 효과가 끝났다는 이유로 API 성공을 판정하지 말고 실제 조회·저장 응답으로 결과를 확정하세요.`,
            ),
            point(
              "배포·성능·접근",
              `${d.engineering} 이미지 캐시·출처·권한·리소스 크기를 검증하고 대체 텍스트와 기본 자료를 함께 제공합니다.`,
            ),
          ],
          handoff: `전달 예시: 원본 자료와 식별자·상태 응답을 제공하고 효과의 실행 시간과 실제 성공을 분리합니다. ${d.engineering}`,
          checks: [
            "자료 로딩에 실패해도 빈 효과만 반복하지 않나요?",
            "출처·원본 크기·캐시 정책과 실제 행동 응답을 확인했나요?",
          ],
        },
      },
    };
    return [d.id, guide];
  }),
) as Record<EffectId, DetailedGuide>;
export const effectAdvice = Object.fromEntries(
  Object.entries(effectGuides).map(([id, g]) => [
    id,
    { uses: g.uses, alternatives: g.alternatives },
  ]),
) as Record<EffectId, { uses: GuidePoint[]; alternatives: GuidePoint[] }>;
