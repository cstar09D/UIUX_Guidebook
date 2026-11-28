import type { DetailedGuide } from "./guide-content";
const additions = {
  "navigation-drawer": {
    title: "고정·축약·보조 패널과 모바일 전환",
    id: "drawer-variants",
    label: "패널 형태 비교",
    condition: "PC에서 탐색을 계속 유지하거나 문서 옆에 보조 정보를 보여줄 때",
    body: "패널 형태에서 모달 탐색·고정 사이드바·아이콘 축약·보조 정보 패널을 비교합니다. 모달만 배경 조작을 제한하고 고정/축약/보조 패널은 문서와 함께 조작합니다. 아이콘에는 접근 가능한 이름과 title을 남깁니다. 작은 체험 폭에서는 모달로 전환하되 현재 선택 문서와 탐색 상태를 유지합니다.",
    practice:
      "저장한 노트를 선택하고 고정·축약·보조 형태를 바꾸세요. 모바일로 전환해 메뉴를 열고 같은 문서가 선택되어 있는지, 닫은 뒤 호출 버튼으로 돌아오는지 확인하세요.",
  },
  "progress-bar": {
    title: "같은 진행값을 선형·원형으로 비교",
    id: "circular-progress",
    label: "원형 진행률",
    condition: "공간에 맞는 진행 표시를 선택해야 하며 전체 양을 알고 있을 때",
    body: "진행률 표현에서 선형·원형·나란히 비교를 선택합니다. 두 표현은 같은 0~100 값을 사용하고 원형의 SVG dashoffset은 100-진행값입니다. 60% 실패와 취소에서도 마지막 진행값을 보존하고 성공 전에는 100%를 표시하지 않습니다. 전체 양을 모르면 가짜 백분율 대신 Spinner를 사용하세요.",
    practice:
      "나란히 비교로 시작해 두 값이 같은지 확인하세요. 60% 실패를 켠 뒤 원형과 선형이 같은 값에서 멈추는지, 재시작과 완료 100%도 같은지 확인하세요.",
  },
  "sticky-header": {
    title: "방향에 따라 숨는 헤더와 초점 복귀",
    id: "directional-header",
    label: "방향 반응 헤더",
    condition:
      "본문을 아래로 읽을 때 공간을 넓히고 위로 돌아오면 탐색을 보여주려 할 때",
    body: "헤더 고정을 켜고 아래로 읽을 때 헤더 숨기기를 선택합니다. 내부 문서를 아래로 40px 이상 읽으면 헤더를 숨기고 위로 이동하거나 맨 위·헤더의 목차 링크에 초점이 들어오면 복귀합니다. 작은 움직임은 방향 전환으로 보지 않도록 5px 차이를 둡니다. 예제 값은 표준 수치가 아니며 고정만 하는 헤더와 비교해 결정하세요.",
    practice:
      "중간으로 이동해 헤더 숨김을 확인하고 조금 위로 스크롤하세요. 헤더 안 목차 링크로 Tab 이동할 때 즉시 보이는지, 고정을 끄면 일반 문서 흐름으로 돌아오는지 확인하세요.",
  },
  particles: {
    title: "지속 부유와 한 번만 축하하기",
    id: "success-confetti",
    label: "성공 Confetti",
    condition: "이미 완료된 작업을 짧은 시각 피드백으로 축하할 때",
    body: "입자 용도에서 기존 지속 부유 배경과 한 번만 축하하기를 비교합니다. 완료 버튼을 누르면 성공 문구와 최대 24개 장식 조각을 표시하고 1.2초 후 조각을 제거합니다. 재생 중 중복 실행은 막고 모션 감소 선호에서는 문구만 남깁니다. 축하 연출은 성공 판정이나 실제 데이터 저장을 대신하지 않습니다.",
    practice:
      "한 번만 축하하기를 선택하고 작업 완료를 누르세요. 조각이 사라진 뒤 성공 문구가 남는지, 다시 실행해도 조각이 누적되지 않는지, 기존 부유 배경으로 돌아갈 수 있는지 확인하세요.",
  },
} as const;
export function enhanceLayoutGuide(
  id: string,
  previous: DetailedGuide,
): DetailedGuide {
  const guide: DetailedGuide = JSON.parse(JSON.stringify(previous));
  const a = additions[id as keyof typeof additions];
  if (!a) return guide;
  if (!guide.flow.some((p) => p.title === a.title))
    guide.flow.push({ title: a.title, body: a.body });
  if (!guide.examples.some((p) => p.id === a.id))
    guide.examples.push({
      id: a.id,
      label: a.label,
      title: a.title,
      condition: a.condition,
      explanation: a.body,
      screen: {
        title: a.title,
        body: a.body,
        action: "직접 체험 내부 옵션에서 비교",
      },
    });
  if (!guide.practice.includes(a.practice)) guide.practice += " " + a.practice;
  const jobs = {
    기획: "변형을 적용할 실제 상황과 완료/취소/대체의 기준을 정하세요. ",
    디자인:
      "같은 정보와 값을 유지한 상태에서 표현 차이와 작은 화면을 비교하세요. ",
    프론트엔드:
      "현재 값·초점·접근 가능한 이름을 표현과 함께 동기화하고 숨긴 요소를 Tab에서 제외하세요. ",
    개발: "표현 상태와 데이터 상태를 분리하고 타이머·프레임·관찰자를 해제하세요. ",
  };
  for (const [name, role] of Object.entries(guide.roles)) {
    const title = "배치·모션 보강: " + a.title;
    if (!role.tasks.some((p) => p.title === title))
      role.tasks.push({
        title,
        body: jobs[name as keyof typeof jobs] + a.body,
      });
  }
  return guide;
}
