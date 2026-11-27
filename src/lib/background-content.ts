import type { Term, DemoId } from "./catalog";
import type { DetailedGuide, GuidePoint, RoleName } from "./guide-content";
export const backgroundDefinitions = [
  {
    id: "mesh-gradient",
    name: "Mesh Gradient",
    pronunciation: "메시 그라데이션",
    korean: "여러 방향에서 섞이는 색면",
    component: "MeshGradientScene",
    summary: "여러 위치의 색이 부드럽게 섞이며 배경의 분위기를 만들어요.",
    aliases: ["메쉬 그라디언트", "다중 색상 그라데이션"],
    keywords: ["여러 색 번짐", "색이 섞이는 배경", "메시 배경"],
    category: "배경 효과",
    use: "브랜드 소개나 서비스 첫 화면에서 사진 없이 색의 분위기를 만들 때 적합합니다. 본문 읽기나 데이터 비교 영역에는 밝기가 안정적인 단색 배경을 우선하세요.",
    flow: "radial-gradient 여러 개의 중심을 서로 다르게 놓고 위치를 천천히 이동합니다. 색상 회전 슬라이더는 배경 레이어만 바꾸고 앞의 글자 색은 유지합니다.",
    caution:
      "색이 섞이는 모든 지점에서 제목 대비를 확인하세요. 극단적인 색상 변경을 해도 버튼·본문 색이 같이 회전하지 않게 레이어를 분리합니다.",
    alternatives: [
      [
        "glow-orb",
        "Glow Orb",
        "밝은 빛 덩어리의 존재감을 더 강조하려면 경계가 흐린 Glow Orb를 비교하세요.",
      ],
      [
        "grain",
        "Grain",
        "색의 이동보다 인쇄물 같은 표면 질감이 목적이면 낮은 강도의 Grain을 사용하세요.",
      ],
    ],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "aurora",
    name: "Aurora",
    pronunciation: "오로라",
    korean: "커튼처럼 움직이는 빛의 띠",
    component: "AuroraScene",
    summary: "넓은 빛의 띠가 천천히 휘고 겹치며 움직여요.",
    aliases: ["오로라 배경", "빛 커튼"],
    keywords: ["일렁이는 빛", "빛의 띠", "커튼 같은 배경"],
    category: "배경 효과",
    use: "행사·전시·기술 서비스의 대표 화면에 넓은 빛의 흐름을 더할 때 적합합니다. 긴 글 뒤에서는 움직임을 약하게 하거나 정적인 색면으로 전환하세요.",
    flow: "반투명한 세 개의 긴 색면을 흐리게 만든 뒤 이동·회전·기울기를 조합합니다. 속도는 0.5~2배로 조절하고 제목은 움직이지 않는 앞 레이어에 남깁니다.",
    caution:
      "너무 큰 blur와 밝은 혼합은 화면 전체를 번지게 할 수 있습니다. 레이어 수를 제한하고 화면 밖의 색면이 가로 스크롤을 만들지 않게 프레임에서 자릅니다.",
    alternatives: [
      [
        "mesh-gradient",
        "Mesh Gradient",
        "띠의 방향성보다 넓은 색 혼합만 필요하다면 Mesh Gradient가 차분합니다.",
      ],
      [
        "beams",
        "Beams",
        "넓은 빛 커튼 대신 가느다란 선의 진행 방향을 강조하려면 Beams를 사용하세요.",
      ],
    ],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "grain",
    name: "Grain",
    pronunciation: "그레인",
    korean: "미세한 입자 질감",
    component: "GrainScene",
    summary: "배경 위에 고운 노이즈를 얹어 종이 같은 질감을 더해요.",
    aliases: ["노이즈 텍스처", "필름 그레인"],
    keywords: ["종이 질감", "고운 노이즈", "입자 배경"],
    category: "배경 효과",
    use: "브랜드 포스터·에디토리얼에서 디지털 색면을 조금 덜 매끈하게 보이게 할 때 사용합니다. 작은 본문·아이콘 뒤에는 강도를 낮춰 가장자리를 선명하게 유지하세요.",
    flow: "자체 SVG의 feTurbulence로 반복 가능한 입자 패턴을 만들고 색면 위에 낮은 불투명도로 겹칩니다. 강도 0%에서는 원래 색면, 높은 값에서는 거친 표면을 비교할 수 있습니다.",
    caution:
      "노이즈는 데이터 로딩이나 오류 상태를 뜻하지 않는 장식입니다. 입자 대비·크기를 작게 유지하고 빠른 프레임 변경으로 화면이 깜빡이지 않게 하세요.",
    alternatives: [
      [
        "mesh-gradient",
        "Mesh Gradient",
        "질감보다 색의 흐름으로 분위기를 전달하려면 Mesh Gradient를 사용하세요.",
      ],
      [
        "halftone",
        "Halftone",
        "원본 이미지의 명암을 점의 크기로 표현하려면 단순 노이즈와 다른 Halftone이 적합합니다.",
      ],
    ],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence",
  },
  {
    id: "dot-grid",
    name: "Dot Grid",
    pronunciation: "도트 그리드",
    korean: "일정한 간격의 점 배경",
    component: "DotGridScene",
    summary: "작은 점을 규칙적으로 배치해 화면의 기준감을 만들어요.",
    aliases: ["점 격자", "도트 패턴"],
    keywords: ["규칙적인 점", "모눈 점", "점 배경"],
    category: "배경 효과",
    use: "캔버스·다이어그램 도구나 기술 소개 화면에 간격의 기준감을 줄 때 적합합니다. 이 예제는 실제 드래그 격자나 스냅 기능 없이 배경 표현만 제공합니다.",
    flow: "작은 원형 radial-gradient를 일정 크기의 타일로 반복합니다. 점 간격을 12~40px로 바꾸어 밀도를 비교하고 콘텐츠의 위치나 크기는 바꾸지 않습니다.",
    caution:
      "점 배경이 보인다는 이유로 요소가 자동 정렬되거나 좌표가 저장되는 것은 아닙니다. 스냅이 필요하면 실제 데이터 좌표와 별도 규칙으로 구현해야 합니다.",
    alternatives: [
      [
        "responsive-layout",
        "Responsive Layout",
        "콘텐츠의 열과 간격을 실제로 재배치해야 한다면 시각 패턴과 별개로 Responsive Layout을 구현하세요.",
      ],
      [
        "particles",
        "Particles",
        "규칙보다 자유롭게 떠다니는 분위기가 목적이면 Particles와 비교하세요.",
      ],
    ],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "beams",
    name: "Beams",
    pronunciation: "빔",
    korean: "선을 따라 흐르는 빛줄기",
    component: "BeamsScene",
    summary: "가느다란 선 위로 짧은 빛줄기가 지나가요.",
    aliases: ["라이트 빔", "빛줄기 배경"],
    keywords: ["빛 선 이동", "선 따라 흐르는 빛", "레이저 배경"],
    category: "배경 효과",
    use: "네트워크·속도·연결의 분위기를 표현하는 기술 소개 화면에 적합합니다. 실제 전송 진행률처럼 오해될 위치에서는 별도의 상태 이름과 결과를 제공하세요.",
    flow: "고정된 가는 선과 그 위를 지나가는 밝은 조각을 분리합니다. 밝은 조각은 선마다 다른 시점에서 반복 이동하며 속도 슬라이더로 흐름을 비교합니다.",
    caution:
      "선의 개수와 광도·속도를 제한하고 짧은 빛이 자주 깜빡이지 않게 하세요. 배경의 빛이 실제 업로드 성공·대기 상태로 해석되지 않게 합니다.",
    alternatives: [
      [
        "aurora",
        "Aurora",
        "얇은 선보다 넓고 부드러운 빛 흐름을 원하면 Aurora가 적합합니다.",
      ],
      [
        "progress-bar",
        "Progress Bar",
        "실제 작업량이나 전송 비율을 전달하려면 장식 빛 대신 Progress Bar를 사용하세요.",
      ],
    ],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "blob",
    name: "Blob",
    pronunciation: "블롭",
    korean: "윤곽이 변하는 유기적 덩어리",
    component: "BlobScene",
    summary: "또렷한 덩어리가 모양을 바꾸며 천천히 움직여요.",
    aliases: ["유기적 도형", "모핑 블롭"],
    keywords: ["덩어리 모양 변화", "유기적 배경", "도형 모핑"],
    category: "배경 효과",
    use: "친근한 브랜드 소개나 일러스트 뒤의 보조 색면에 적합합니다. 제품·정보의 정확한 경계가 중요하다면 도형을 콘텐츠 밖에 두고 겹침을 줄이세요.",
    flow: "두 색 덩어리의 border-radius와 transform을 함께 바꿉니다. 흐린 빛과 달리 윤곽을 남겨 모양의 변화가 보이게 하며 속도 조절로 느린 변형과 빠른 변형을 비교합니다.",
    caution:
      "도형의 이동이 실제 콘텐츠 레이아웃을 밀지 않게 절대 배치합니다. 형태 변화가 버튼이나 제목을 덮지 않는지 모든 중간 장면을 확인하세요.",
    alternatives: [
      [
        "glow-orb",
        "Glow Orb",
        "덩어리의 윤곽이 필요 없고 흐린 빛처럼 번지기를 원하면 Glow Orb를 사용하세요.",
      ],
      [
        "mesh-gradient",
        "Mesh Gradient",
        "뚜렷한 덩어리보다 넓은 색면의 혼합이 목적이면 Mesh Gradient가 적합합니다.",
      ],
    ],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "glow-orb",
    name: "Glow Orb",
    pronunciation: "글로우 오브",
    korean: "경계 없이 번지는 빛의 구",
    component: "GlowOrbScene",
    summary: "흐릿한 빛 덩어리가 경계 없이 섞이며 움직여요.",
    aliases: ["발광 구체", "글로우 배경"],
    keywords: ["흐린 빛 구", "빛이 번지는 배경", "발광 덩어리"],
    category: "배경 효과",
    use: "어두운 브랜드·음악·이벤트 대표 화면에서 조명 같은 깊이감을 만들 때 적합합니다. 텍스트 뒤의 밝기가 바뀌므로 제목을 위한 안정적인 어두운 오버레이를 함께 두세요.",
    flow: "큰 원을 흐리게 만들고 위치·크기를 천천히 바꿉니다. 빛의 강도를 20~100%로 조절해 겹친 지점의 광도와 배경 대비를 비교합니다.",
    caution:
      "블롭처럼 윤곽이 선명한 도형과 구분합니다. 큰 blur 영역과 혼합 레이어가 늘수록 합성 비용이 커지므로 원 수와 화면 크기를 제한하세요.",
    alternatives: [
      [
        "blob",
        "Blob",
        "또렷한 실루엣과 모양 변형이 필요하다면 Blob과 비교하세요.",
      ],
      [
        "aurora",
        "Aurora",
        "둥근 빛 덩어리가 아니라 긴 빛의 띠를 표현하려면 Aurora가 적합합니다.",
      ],
    ],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "particles",
    name: "Particles",
    pronunciation: "파티클",
    korean: "자유롭게 떠다니는 입자",
    component: "ParticlesScene",
    summary: "작은 입자들이 서로 다른 위치에서 가볍게 떠다녀요.",
    aliases: ["입자 효과", "플로팅 파티클"],
    keywords: ["떠다니는 점", "작은 입자 이동", "공중 먼지"],
    category: "배경 효과",
    use: "공기·공간·가벼움을 표현하는 행사나 브랜드 배경에 사용합니다. 클릭 가능한 점이 아니라면 포인터 입력과 초점을 받지 않게 하고 필수 내용을 입자에만 담지 마세요.",
    flow: "일정한 시드로 정한 입자의 위치·크기를 기준으로 작은 이동을 더합니다. 입자 수를 8~48개로 조절해 밀도 차이를 비교하며 매 프레임 DOM을 새로 만들지 않습니다.",
    caution:
      "입자 수를 무제한 늘리거나 화면 밖의 요소를 계속 추가하지 마세요. 움직이는 점이 알림 배지·지도 마커·핫스팟으로 오해되지 않는 스타일을 선택합니다.",
    alternatives: [
      [
        "dot-grid",
        "Dot Grid",
        "공간의 규칙과 간격을 강조하려면 무작위 입자 대신 Dot Grid를 사용하세요.",
      ],
      [
        "starfield",
        "Starfield",
        "평면의 부유보다 앞으로 이동하는 깊이감을 원하면 Starfield와 비교하세요.",
      ],
    ],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
  {
    id: "starfield",
    name: "Starfield",
    pronunciation: "스타필드",
    korean: "앞으로 다가오는 별 배경",
    component: "StarfieldScene",
    summary: "별이 중심에서 바깥으로 커지며 다가와 깊이감을 만들어요.",
    aliases: ["별밭", "우주 비행 배경"],
    keywords: ["우주를 나는 효과", "별 앞으로 다가옴", "별 배경"],
    category: "배경 효과",
    use: "우주·탐험·몰입형 캠페인의 짧은 인트로에 적합합니다. 시야 전체의 전진감이 부담스러울 수 있으므로 긴 읽기 화면에서는 정적인 별 배경을 대안으로 제공하세요.",
    flow: "별마다 깊이 값을 두고 중심에서 바깥으로 이동할수록 크기와 밝기를 키웁니다. 경계를 지난 별은 먼 위치로 되돌리며 전진 속도를 0.5~2배로 조절합니다.",
    caution:
      "큰 고속 별이나 급격한 밝기 변화를 줄이고 사용 가능한 영역에만 효과를 제한하세요. 별의 움직임을 실제 로딩이나 탐색 진행률로 사용하지 않습니다.",
    alternatives: [
      [
        "particles",
        "Particles",
        "전진감 없이 작은 입자가 떠다니는 분위기가 필요하면 Particles가 적합합니다.",
      ],
      [
        "glow-orb",
        "Glow Orb",
        "많은 점의 이동 대신 느리고 부드러운 조명 배경을 원하면 Glow Orb를 사용하세요.",
      ],
    ],
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient",
  },
] as const;
export const backgroundSeeds: Term[] = backgroundDefinitions.map((d, i) => ({
  id: d.id,
  demoId: d.id,
  english: d.name,
  pronunciation: d.pronunciation,
  korean: d.korean,
  category: d.category,
  summary: d.summary,
  aliases: [...d.aliases],
  keywords: [...d.keywords],
  hidden: false,
  order: 68 + i,
  revision: 1,
}));
const p = (title: string, body: string): GuidePoint => ({ title, body });
export const backgroundGuides = Object.fromEntries(
  backgroundDefinitions.map((d) => {
    const mobile =
      "모바일에서는 입자·레이어 수와 흐림 반경을 줄이고 정적인 색면도 완성된 화면으로 제공하세요. 배경이 없어도 제목·설명·버튼을 읽고 같은 행동을 실행할 수 있어야 합니다.";
    const roles = Object.fromEntries(
      (["기획", "디자인", "프론트엔드", "개발"] as RoleName[]).map((name) => [
        name,
        {
          goal: `${d.name}의 목적·내용 접근·표현 비용을 함께 검토합니다.`,
          tasks:
            name === "기획"
              ? [
                  p("사용 상황과 적용 범위", d.use),
                  p(
                    "장식과 실제 상태 구분",
                    `${d.caution} 어떤 정보를 강조하는지, 효과를 끈 상태에서 가능한 행동은 무엇인지 먼저 결정하세요.`,
                  ),
                  p("모바일과 완료 기준", mobile),
                ]
              : name === "디자인"
                ? [
                    p(
                      "위계와 대표 장면",
                      `${d.use} 가장 밝고 어두운 중간 장면에서도 제목과 버튼의 대비를 확인하고 기준 색·밀도·이동량을 전달하세요.`,
                    ),
                    p("형태·속도·질감의 차이", d.flow),
                    p("작은 화면과 원본 상태", mobile),
                  ]
                : name === "프론트엔드"
                  ? [
                      p(
                        "레이어와 조작 분리",
                        `${d.flow} 장식 레이어는 aria-hidden과 pointer-events:none으로 처리하고 실제 콘텐츠의 DOM 순서와 초점을 유지합니다.`,
                      ),
                      p(
                        "프레임·리사이즈·정리",
                        `${d.caution} requestAnimationFrame은 보이는 동안만 사용하고 해제 시 취소합니다. 레이아웃 측정과 스타일 갱신을 분리하세요.`,
                      ),
                      p("접근성과 대안 상태", mobile),
                    ]
                  : [
                      p(
                        "리소스와 상태 계약",
                        `${d.use} 이 예제는 네트워크 요청 없는 배경이며 실제 서비스의 로딩·오류·권한 상태는 별도로 제공해야 합니다.`,
                      ),
                      p(
                        "성능과 렌더링 비용",
                        `${d.caution} 저성능 기기에서 프레임 지연·메모리·합성 비용을 측정하고 값의 상한과 정적인 대안을 정의합니다.`,
                      ),
                      p(
                        "외부 자원과 실패",
                        `${mobile} 외부 텍스처를 적용할 경우 출처·캐시·실패 시 기본 색을 명시하고 콘텐츠가 사라지지 않게 하세요.`,
                      ),
                    ],
          handoff: `전달 예시: ${d.flow} 배경의 표현과 실제 서비스 상태는 분리합니다. ${mobile}`,
          checks: [
            "배경의 가장 밝은 장면에서도 내용과 행동을 읽을 수 있나요?",
            "영역 밖 잘림·작은 화면·보이지 않는 탭의 재생 정리를 확인했나요?",
          ],
        },
      ]),
    ) as DetailedGuide["roles"];
    const guide: DetailedGuide = {
      introduction: `${d.name}(${d.pronunciation})은 ${d.summary} 입력 컴포넌트가 아닌 시각적 배경 표현입니다. ${d.flow}`,
      uses: [p("실무 적용 상황", d.use), p("정적인 화면도 함께 설계", mobile)],
      flow: [
        p(
          "기본 내용 먼저",
          `${d.use} 제목·본문·주요 행동은 장식 배경과 별도 레이어에 배치합니다.`,
        ),
        p("체험과 조절", d.flow),
        p(
          "작은 화면과 종료",
          `${mobile} 화면이 숨겨지거나 체험을 닫으면 재생 자원을 정리합니다.`,
        ),
      ],
      examples: [
        {
          id: "initial",
          label: "기본 배경",
          title: d.korean,
          condition:
            "사용자가 대표 화면에 처음 들어와 제목과 주요 행동을 확인할 때",
          explanation: `${d.use} 배경의 색이나 움직임보다 핵심 내용이 먼저 읽혀야 하므로 글자와 버튼을 위한 안정적인 영역을 확보합니다.`,
          screen: {
            title: d.name,
            body: d.summary,
            items: ["제목·설명·버튼은 고정 레이어"],
          },
        },
        {
          id: "active",
          label: "표현 조절",
          title: "원리를 이해하며 강도 비교",
          condition:
            "제공된 슬라이더로 속도·색상·간격·입자 수 중 해당 값을 바꿨을 때",
          explanation: `${d.flow} 슬라이더 값은 앞의 콘텐츠 구조를 바꾸지 않고 해당 배경 속성에만 적용해 변화 원인을 이해할 수 있게 합니다.`,
          screen: { title: d.name, body: d.flow },
        },
        {
          id: "fallback",
          label: "정적 대안",
          title: "배경을 약하게 해도 내용 유지",
          condition:
            "작은 화면이나 성능이 제한된 기기에서 기본 내용을 우선 전달해야 할 때",
          explanation: `${mobile} 움직임이 실제 처리 상태나 실행 가능 여부로 해석되지 않게 하고 같은 제목과 행동을 유지해야 합니다.`,
          screen: {
            title: "정적인 색면과 선명한 제목",
            body: mobile,
            action: "내용 살펴보기",
          },
        },
      ],
      pitfalls: [
        p("표현의 한계와 혼동", d.caution),
        p("내용 접근과 성능", mobile),
      ],
      alternatives: d.alternatives.map(([targetDemoId, title, body]) => ({
        targetDemoId: targetDemoId as DemoId,
        title,
        body,
      })),
      practice: `${d.flow} 목록의 자동 시연과 같은 형태인지 비교하고 모바일 폭에서 제목·컨트롤·배경이 가로로 넘치지 않는지 확인하세요. ${d.caution}`,
      roles,
    };
    return [d.id, guide];
  }),
) as Record<(typeof backgroundDefinitions)[number]["id"], DetailedGuide>;
export const backgroundAdvice = Object.fromEntries(
  Object.entries(backgroundGuides).map(([id, g]) => [
    id,
    { uses: g.uses, alternatives: g.alternatives },
  ]),
) as Record<
  keyof typeof backgroundGuides,
  { uses: GuidePoint[]; alternatives: GuidePoint[] }
>;
