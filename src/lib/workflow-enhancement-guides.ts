import type { DetailedGuide } from "./guide-content";
const additions = {
  "data-table": {
    title: "헤더 정렬과 플랜 비교",
    id: "comparison-table",
    label: "정렬·비교 표",
    condition:
      "같은 월의 비용 순서를 바꾸거나 플랜별 제공 기능을 비교해야 할 때",
    body: "비용 읽기 표의 프로젝트·비용 헤더를 누르면 오름차순과 내림차순을 바꿉니다. 정렬된 열에는 aria-sort를 연결하고 같은 값은 원래 순서를 유지합니다. 표 유형을 플랜 비교 표로 바꾸면 개인·팀·비즈니스 기능을 나란히 읽습니다. 미제공은 지원하지 않는다는 뜻이고 확인 필요는 아직 모른다는 뜻이므로 빈칸이나 같은 대시로 합치지 않습니다.",
    practice:
      "비용 헤더를 두 번 눌러 오름/내림을 비교하고 조회 월을 바꾼 뒤 정렬이 유지되는지 확인하세요. 표 유형에서 플랜 비교 표를 선택해 미제공과 확인 필요의 차이를 읽어보세요.",
  },
  sorting: {
    title: "필터를 유지한 채 결과 순서 바꾸기",
    id: "sort-with-filters",
    label: "조건·정렬 결합",
    condition:
      "특정 분류와 내 담당 조건을 함께 적용한 뒤 금액 기준으로 정렬할 때",
    body: "분류와 내 담당 조건으로 대상을 먼저 좁힌 뒤 정렬 기준을 적용합니다. 금액 낮은순·높은순·이름순으로 바꿔도 선택한 필터는 유지합니다. 조건 칩 하나만 해제하면 나머지 조건과 정렬은 그대로이고 조건·정렬 초기화에서만 모두 기본값으로 돌아갑니다. 같은 금액은 원래 순서로 비교합니다.",
    practice:
      "디자인과 내 담당만을 선택하고 금액 높은순으로 바꾸세요. 분류 칩만 제거했을 때 내 담당과 정렬이 유지되는지, 조건·정렬 초기화에서만 모두 해제되는지 확인하세요.",
  },
  filtering: {
    title: "빈 결과와 조회 실패를 분리",
    id: "combined-filter-error",
    label: "필터·정렬·실패",
    condition: "여러 조건을 조합하거나 조회 실패 모의 중 조건을 바꾸려고 할 때",
    body: "분류와 내 담당 조건을 적용하고 결과 정렬을 함께 선택할 수 있습니다. 조건에 맞는 항목이 없으면 0개와 조건 해제 경로를 보여줍니다. 조회 실패 모의를 켠 채 조건·정렬을 바꾸면 이전에 성공한 조건과 결과를 유지하고 실패를 별도로 알립니다. 실패 옵션을 해제하고 다시 선택해 복구하세요. 조건 칩은 해당 조건만 제거합니다.",
    practice:
      "개발과 내 담당만을 조합해 빈 결과를 확인하세요. 조건 초기화 후 실패 모의를 켜고 분류·정렬을 바꿔 기존 결과가 보존되는지 확인한 뒤 실패 모의를 해제하고 재선택하세요.",
  },
  "icon-button": {
    title: "PC 공유 패널과 모바일 시트",
    id: "share-sheet",
    label: "SNS 공유·복사 실패",
    condition: "공유 도구를 누르고 작은 화면에서 서비스 목록을 선택할 때",
    body: "PC에서는 도구 옆 패널, 작은 화면에서는 하단 시트로 카카오톡·페이스북·X·밴드·링크 복사를 보여줍니다. 서비스 선택은 한 번의 행동이므로 선택 색을 영구 유지하지 않습니다. 링크 복사 실패 모의를 켜면 시트를 남기고 실패 옵션 해제 후 재시도 방법을 알립니다. 성공은 체험용 모의 결과이며 실제 게시·전송·클립보드 변경을 하지 않습니다.",
    practice:
      "공유 도구를 열어 SNS 다섯 항목을 확인하고 Esc 후 원래 버튼으로 돌아오는지 보세요. 링크 복사 실패 모의를 켜고 실패를 확인한 뒤 해제해 다시 선택하세요. 작은 폭에서는 하단 시트를 비교하세요.",
  },
  "bottom-sheet": {
    title: "노트 메뉴에서 SNS 공유로 이어가기",
    id: "sns-share",
    label: "시트 안의 SNS 선택",
    condition: "노트 메뉴에서 공유하기를 눌러 공유 서비스를 고를 때",
    body: "공유하기를 누르면 시트를 닫지 않고 같은 시트의 제목과 내용을 SNS 목록으로 바꿉니다. 카카오톡·페이스북·X·밴드·링크 복사는 PC 패널과 같은 공통 목록입니다. 뒤로가기는 노트 메뉴, 닫기와 Esc는 시트를 닫고 시작 버튼으로 복귀합니다. 복사 실패는 내용과 선택 경로를 남기며 일회성 선택을 저장된 상태처럼 강조하지 않습니다.",
    practice:
      "노트 메뉴 열기 → 공유하기 → SNS 선택을 체험하세요. 메뉴로 돌아가기·Esc·명시적 닫기를 비교하고 링크 복사 실패 옵션을 켰다 해제해 재시도하세요. 실제 게시나 외부 전송은 하지 않습니다.",
  },
} as const;
/** Additions only. Stored editorial text and published copies stay intact. */
export function enhanceWorkflowGuide(
  id: string,
  previous: DetailedGuide,
): DetailedGuide {
  const guide: DetailedGuide = JSON.parse(JSON.stringify(previous));
  const addition = additions[id as keyof typeof additions];
  if (!addition) return guide;
  if (!guide.flow.some((p) => p.title === addition.title))
    guide.flow.push({ title: addition.title, body: addition.body });
  if (!guide.examples.some((p) => p.id === addition.id))
    guide.examples.push({
      id: addition.id,
      label: addition.label,
      title: addition.title,
      condition: addition.condition,
      explanation: addition.body,
      screen: {
        title: addition.title,
        body: addition.body,
        action: "같은 실제 체험에서 옵션 비교",
      },
    });
  if (!guide.practice.includes(addition.practice))
    guide.practice += " " + addition.practice;
  const details = {
    기획: "필터·정렬의 적용 범위와 초기화 단위를 구분하고 빈 결과·조회 실패의 문구와 다음 행동을 명세하세요. 공유는 서비스 선택·외부 게시·복사 결과를 다른 단계로 설명하세요.",
    디자인:
      "조건 칩의 개별 제거와 전체 초기화를 구분하고 헤더 정렬 방향·선택 상태·오류를 색과 문구로 함께 표시하세요. PC 패널과 모바일 시트는 같은 서비스 이름과 순서를 유지하세요.",
    프론트엔드:
      "필터 값과 정렬을 독립적으로 관리하고 안정 정렬·aria-sort·초점 복귀를 확인하세요. 공유 실패 때 패널을 남기고 성공이나 Esc 후에는 시작 버튼으로 돌아가며 일회성 선택 강조를 정리하세요.",
    개발: "필터·정렬·페이지 커서의 서버 적용 순서와 지원 범위를 문서화하세요. 알 수 없는 값과 미제공을 다른 데이터로 표현하고 실제 SNS SDK·링크 복사 실패를 모의 예제와 구분하세요.",
  };
  for (const [role, body] of Object.entries(details)) {
    const target = guide.roles[role as keyof typeof guide.roles],
      title = "업무 흐름 보강: " + addition.title;
    if (!target.tasks.some((p) => p.title === title))
      target.tasks.push({ title, body: body + " " + addition.body });
  }
  return guide;
}
