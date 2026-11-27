import type { DetailedGuide, RoleName } from "./guide-content";
export function upgradeHotspotGuide(previous: DetailedGuide): DetailedGuide {
  const guide: DetailedGuide = JSON.parse(JSON.stringify(previous));
  if (!guide.flow.some((p) => p.title === "지점 옆 말풍선"))
    guide.flow.push({
      title: "지점 옆 말풍선",
      body: "‘지점 옆 말풍선’을 선택하면 점 위에 마우스나 Tab 초점을 둘 때 이미지 안에서 이름과 짧은 설명이 나타납니다. 클릭·터치는 말풍선을 고정하고 같은 점을 다시 누르거나 닫기·Esc·바깥 클릭으로 닫습니다. 닫기와 Esc 뒤에는 원래 점으로 초점을 돌립니다.",
    });
  if (!guide.pitfalls.some((p) => p.title === "말풍선의 가장자리 처리"))
    guide.pitfalls.push({
      title: "말풍선의 가장자리 처리",
      body: "말풍선의 실제 너비·높이를 재어 오른쪽에 자리가 없으면 왼쪽으로, 양옆이 좁으면 위·아래로 옮깁니다. 이미지 안쪽 8px 여백을 남기고 화면 크기가 바뀌면 다시 배치합니다. 긴 설명은 기존 하단 패널을 사용하세요.",
    });
  const examples = [
    {
      id: "hotspot-bubble",
      label: "지점 옆 설명",
      title: "사진 안에서 바로 확인하는 말풍선",
      condition:
        "지점 옆 말풍선 방식에서 점에 포인터·초점을 두거나 터치해 고정했을 때",
      explanation:
        "점 가까이에 흰 말풍선으로 이름과 짧은 설명을 보여줍니다. 포인터만 올린 상태는 영역을 벗어나면 닫고 클릭·터치로 고정한 상태는 다시 누르기·닫기·Esc·바깥 클릭으로 해제합니다. 번호 아래에 내용을 길게 표시하는 기존 하단 설명 방식도 함께 유지합니다.",
      screen: {
        title: "사이드 테이블",
        body: "원목 사이드 테이블 · 지름 48cm",
        action: "말풍선 닫기",
      },
    },
    {
      id: "hotspot-edge",
      label: "가장자리·모바일",
      title: "말풍선을 화면 안으로 옮기기",
      condition:
        "이미지 오른쪽 끝의 점을 누르거나 모바일에서 이미지 폭이 좁아졌을 때",
      explanation:
        "말풍선을 점의 오른쪽에 고정하지 않고 실제 남은 공간을 재서 왼쪽 또는 위·아래로 옮깁니다. 화면 밖으로 잘리는 긴 문장은 하단 설명으로 전환해 읽게 하며 닫기 버튼과 원래 점의 초점은 유지합니다.",
      screen: {
        title: "아치형 창",
        body: "곡선 창과 자연 채광 · 남향",
        items: ["이미지 안쪽 여백 유지", "좌우 부족하면 위·아래로 배치"],
      },
    },
  ];
  for (const example of examples)
    if (!guide.examples.some((e) => e.id === example.id))
      guide.examples.push(example);
  const jobs: Record<RoleName, string> = {
    기획: "짧은 이름·사양은 지점 옆 말풍선, 긴 설명과 여러 행동은 하단 패널로 구분합니다. 마우스의 임시 표시와 클릭·터치의 고정 표시, 다시 누르기·Esc·바깥 클릭의 닫힘을 각각 명세하세요.",
    디자인:
      "점과 말풍선 사이의 간격·최대 폭·그림자·닫기 버튼을 설계하고 이미지의 좌우·상하 가장자리 배치를 함께 제시합니다. 좁은 화면에서 말풍선이 사진 전체를 가리지 않는지 확인하세요.",
    프론트엔드:
      "활성 지점·고정 지점·표시 방식을 분리하고 ResizeObserver로 이미지와 말풍선을 측정합니다. hover·focus와 클릭을 함께 처리할 때 첫 클릭이 즉시 닫히지 않게 하며 Esc는 상위 모달로 전달하지 않고 닫은 지점으로 초점을 돌립니다.",
    개발: "지점 id·백분율 좌표·짧은 이름·상세 설명을 별도로 제공합니다. 사용자 입력 텍스트를 HTML로 삽입하지 말고 긴 설명은 하단 패널로 안내하며 두 표시 방식에서 동일한 제품 정보와 권한을 사용하세요.",
  };
  for (const [name, role] of Object.entries(guide.roles))
    if (!role.tasks.some((p) => p.title === "하단 패널과 지점 옆 말풍선"))
      role.tasks.push({
        title: "하단 패널과 지점 옆 말풍선",
        body: jobs[name as RoleName],
      });
  return guide;
}
