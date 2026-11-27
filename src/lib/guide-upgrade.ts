import type { DemoId } from "./catalog";
import type { DetailedGuide, ScreenExample } from "./guide-content";
import { practicalGuides } from "./practical-guides";
import { upgradeHotspotGuide } from "./hotspot-guide";
export function upgradeGuide(
  id: DemoId,
  previous: DetailedGuide,
): DetailedGuide {
  const guide: DetailedGuide = JSON.parse(JSON.stringify(previous));
  Object.assign(guide, JSON.parse(JSON.stringify(practicalGuides[id])));
  const add = (example: ScreenExample) => {
    guide.examples = guide.examples.filter((e) => e.id !== example.id);
    guide.examples.push(example);
  };
  if (id === "date-picker") {
    guide.introduction = guide.introduction.replace(
      " 하루 선택과 여행 기간 선택을 전환해 비교할 수 있습니다. 여행 모드는 시작일과 종료일을 차례로 고르며 최소 1박, 주말도 허용하는 별도 예시 정책입니다.",
      "",
    );
    guide.flow = guide.flow.filter((p) => p.title !== "기간 선택과 취소");
    guide.examples = guide.examples.filter(
      (e) => !["range", "range-error"].includes(e.id),
    );
    guide.practice =
      "예약 날짜를 직접 입력하거나 달력에서 하루를 고르세요. 2026-11-31의 실제 날짜 오류와 11월 26일의 예약 불가를 비교하세요. 키보드 방향키로 탐색하고 Esc로 취소한 뒤 11월 18일을 선택·적용하세요. 시작일·마감일이 필요한 경우 별도 Date Picker (Range)를 확인하세요.";
    for (const role of Object.values(guide.roles))
      role.tasks = role.tasks.filter(
        (p) => p.title !== "확장 형태의 상태 계약",
      );
  }
  if (id === "floating-action-button") {
    guide.practice =
      "단일 버튼으로 노트를 추가한 뒤 항목 오른쪽 휴지통을 눌러 삭제하고 삭제 되돌리기로 복원하세요. 펼침 버튼으로 전환해 새 노트·새 체크리스트를 비교하고, 다시 누르기·Esc로 접히는지 확인하세요. 보조 행동을 선택하면 입력창이 열리며 취소하면 항목이 늘어나지 않습니다.";
    guide.flow = guide.flow.filter(
      (p) => !["보조 행동 펼치기", "항목 삭제와 복원"].includes(p.title),
    );
    guide.flow.push(
      {
        title: "보조 행동 펼치기",
        body: "관련 생성 행동이 여러 개면 플러스 버튼으로 보조 버튼을 펼치고 닫기 아이콘으로 바꿉니다. 각 행동에는 이름을 함께 붙이고 보조 행동 선택·다시 누르기·Esc로 접습니다. 숨긴 버튼은 Tab 순서에서 제외하고 닫힌 뒤 주 버튼으로 초점을 돌립니다.",
      },
      {
        title: "항목 삭제와 복원",
        body: "새로 만든 항목은 그 항목 오른쪽의 휴지통으로 삭제합니다. 삭제 후 개수와 빈 목록을 갱신하고 복원 가능한 항목을 기억합니다. 삭제 되돌리기는 마지막 삭제를 원래 위치에 복원합니다. 플로팅 버튼 자체의 의미를 갑자기 삭제 행동으로 바꾸지 않습니다.",
      },
    );
    add({
      id: "speed-dial",
      label: "보조 버튼",
      title: "관련된 생성 행동만 짧게 펼치기",
      condition: "사용자가 새 노트와 새 체크리스트 중 하나를 만들고 싶을 때",
      explanation:
        "주 플러스 버튼을 누르면 이름이 붙은 두 보조 버튼이 펼쳐집니다. 한 행동을 고르면 보조 버튼을 접고 해당 입력창을 엽니다. 화면 전체 명령을 모두 넣지 말고 같은 생성 목적의 소수 행동으로 제한하세요.",
      screen: {
        title: "새 항목 만들기",
        body: "새 노트 또는 새 체크리스트를 선택하세요.",
        items: ["새 노트", "새 체크리스트"],
        action: "추가 메뉴 닫기",
      },
    });
    add({
      id: "deleted-item",
      label: "삭제·복원",
      title: "생성 행동과 항목별 삭제를 구분",
      condition: "사용자가 이미 추가한 아이디어를 목록에서 지우고 싶을 때",
      explanation:
        "해당 행 오른쪽의 휴지통으로 항목 하나만 삭제합니다. 목록 개수와 빈 상태를 갱신하고 마지막 삭제 항목을 원래 위치로 복원할 수 있게 합니다. 손실이 큰 영구 삭제라면 별도 확인 절차를 검토하세요.",
      screen: {
        title: "아이디어 목록",
        body: "항목을 삭제했어요. 마지막 삭제를 되돌릴 수 있습니다.",
        action: "삭제 되돌리기",
        tone: "success",
      },
    });
  }
  if (id === "floating-action-button") {
    const body =
      "단일 생성과 보조 행동 펼침을 구분하고 삭제·복원·빈 목록의 초점 복귀를 확인합니다.";
    const details: Record<string, string> = {
      기획: "단일 생성 행동과 펼칠 수 있는 관련 생성 행동의 범위를 정합니다. 항목 삭제는 별도 도구로 제공하고 마지막 삭제만 되돌릴지, 복구 기간과 영구 삭제 정책이 필요한지 명세합니다.",
      디자인:
        "펼친 보조 행동에 익숙한 아이콘과 이름을 붙이고 플러스·닫기 상태를 구분합니다. 생성 버튼과 행별 휴지통이 겹치지 않게 하고 삭제 뒤 빈 목록·개수·복원 행동을 설계합니다.",
      프론트엔드:
        "펼침 상태를 aria-expanded에 연결하고 숨긴 버튼을 Tab 순서에서 뺍니다. Esc·닫기·입력 취소의 초점을 처리하고 안정적인 항목 id로 삭제하며 원래 위치 복원과 빈 목록을 확인합니다.",
      개발: "항목별 생성·삭제 권한과 중복 요청을 검증합니다. 실제 삭제는 서버 성공 후 반영하거나 실패 시 복원하며, 되돌리기가 필요하면 논리 삭제·복구 API와 복구 가능 시간을 명시합니다.",
    };
    for (const [name, role] of Object.entries(guide.roles)) {
      role.tasks = role.tasks.filter(
        (p) => p.title !== "확장 형태의 상태 계약",
      );
      role.tasks.push({
        title: "확장 형태의 상태 계약",
        body: details[name] || body,
      });
    }
  }
  return id === "image-hotspot" ? upgradeHotspotGuide(guide) : guide;
}
