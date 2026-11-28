import type { DetailedGuide, GuidePoint, ScreenExample } from "./guide-content";
/** Additive editorial update: preserve existing/custom text and published snapshots. */
export function enhanceInputGuide(
  id: string,
  previous: DetailedGuide,
): DetailedGuide {
  const guide: DetailedGuide = JSON.parse(JSON.stringify(previous));
  const extra: Record<
    string,
    { point: GuidePoint; example: ScreenExample; practice: string }
  > = {
    "text-field": {
      point: {
        title: "플로팅 라벨과 필수·선택 비교",
        body: "플로팅 라벨을 켜면 빈 입력에서는 라벨이 입력 안에 보이고, 초점·입력이 생기면 위로 이동합니다. placeholder와 달리 값이 있어도 이름은 남습니다. 필수 입력을 끄면 빈 값을 허용하되 입력한 경우에는 2~30자 규칙을 그대로 적용합니다. 오류 후에도 값·라벨·글자/UTF-8 byte를 유지하세요.",
      },
      example: {
        id: "floating-label",
        label: "라벨·필수 정책",
        title: "값이 있어도 이름이 남는 입력",
        condition:
          "플로팅 라벨을 켠 뒤 이름을 입력하거나 필수 입력을 해제했을 때",
        explanation:
          "초점과 값 유무에 맞춰 라벨 위치만 바꾸고 입력 이름은 항상 제공합니다. 필수 입력을 해제하면 빈 값도 확인할 수 있지만 한 글자만 입력한 경우에는 최소 길이 오류를 안내합니다. 오류는 값을 지우지 않고 2~30자라는 수정 방법과 연결합니다.",
        screen: {
          title: "이름 (선택)",
          body: "플로팅 라벨 · 선택 입력은 비워 둘 수 있어요. 입력 시에는 2~30자를 적용합니다.",
          items: [
            "플로팅 라벨 켜기",
            "필수 입력 끄기",
            "빈 값 확인 또는 이름 입력",
          ],
        },
      },
      practice:
        "플로팅 라벨과 필수 입력을 차례로 전환하세요. 빈 입력·초점·값이 있는 입력에서 라벨이 남는지, 선택 입력을 비워 확인할 수 있는지 비교하세요.",
    },
    textarea: {
      point: {
        title: "필수 라벨·도움말·오류의 관계",
        body: "검토 의견은 필수이며 입력 전에 10~200자·Enter 줄바꿈을 알려줍니다. 확인 전에는 도움말을 보이고, 짧거나 긴 값으로 저장하면 입력 바로 아래에 오류와 수정 방법을 추가합니다. 도움말을 지우지 않아 규칙을 다시 읽을 수 있어야 하며 글자 수와 UTF-8 byte는 다른 기준임을 함께 표시합니다.",
      },
      example: {
        id: "required-help",
        label: "필수·입력 유지",
        title: "입력한 의견을 지우지 않는 오류",
        condition:
          "10자 미만의 의견 또는 200자를 넘는 의견으로 저장을 시도했을 때",
        explanation:
          "검토 의견 라벨에 필수를 표시하고 저장 시 길이를 검증합니다. 오류가 있어도 원문·줄바꿈·커서 위치를 보존하며 10~200자로 수정하라고 안내합니다. 다시 입력하면 이전 오류를 해제하되 기본 조건과 글자/byte 카운터는 계속 남깁니다.",
        screen: {
          title: "검토 의견 (필수)",
          body: "10~200자 · Enter는 줄바꿈입니다. 입력 내용은 유지됩니다.",
          tone: "error",
          action: "의견 수정",
        },
      },
      practice:
        "짧은 의견으로 오류를 만든 뒤 원문을 이어서 수정하세요. Enter가 제출 대신 줄바꿈이고 필수 라벨과 글자/byte가 계속 보이는지 확인하세요.",
    },
    checkbox: {
      point: {
        title: "필수 2개와 선택 1개 동의",
        body: "예제 유형을 필수·선택 동의로 바꾸면 이용약관·개인정보 수집은 필수, 혜택 소식은 선택입니다. 전체 동의는 선택까지 세 항목 모두 포함한다고 표시합니다. 필수 두 개만 동의해도 계속 버튼을 활성화하고, 하나라도 해제하면 비활성화합니다. 선택 동의 거절을 서비스 이용 차단 사유로 만들지 마세요.",
      },
      example: {
        id: "required-consent",
        label: "필수·선택 동의",
        title: "선택 동의 없이도 계속하기",
        condition:
          "필수 동의 두 개는 선택하고 혜택 소식 수신은 선택하지 않았을 때",
        explanation:
          "전체 동의는 부분 선택 표시가 되지만 필수 두 개를 충족했으므로 계속 버튼은 활성화됩니다. 선택 동의는 꺼진 그대로 보존합니다. 전체 동의를 누르면 선택까지 포함하고 다시 해제하면 모두 해제하므로 그 범위를 미리 설명해야 합니다.",
        screen: {
          title: "서비스 이용 동의",
          body: "필수 2개 충족 · 선택 동의 없이도 계속할 수 있어요.",
          items: [
            "이용약관 (필수) ✓",
            "개인정보 수집·이용 (필수) ✓",
            "혜택 소식 수신 (선택) 미동의",
          ],
          action: "동의하고 계속",
        },
      },
      practice:
        "예제 유형에서 필수·선택 동의를 고른 뒤 필수 두 개만 체크하세요. 선택이 꺼져도 계속할 수 있는지, 전체 동의·전체 해제·부분 선택을 비교하세요.",
    },
    "file-upload": {
      point: {
        title: "이미지 미리보기·교체·삭제",
        body: "PNG·JPG를 선택하면 로컬 Object URL로 썸네일을 표시하고 파일 교체·지우기를 제공합니다. 교체 파일이 잘못됐으면 이전 유효 파일을 유지하고 오류를 안내합니다. 이미지 디코딩 실패는 미리보기 오류로 구분하며 PDF는 파일명으로 안내합니다. 교체·삭제·화면 해제 때 Object URL을 반환해 메모리가 쌓이지 않게 하세요.",
      },
      example: {
        id: "image-preview",
        label: "이미지 교체·삭제",
        title: "선택한 이미지를 확인하고 바꾸기",
        condition:
          "2MB 이하 PNG 또는 JPG 이미지를 선택해 전송 전에 내용을 확인할 때",
        explanation:
          "파일명과 썸네일을 함께 보여주고 교체로 다른 파일을 다시 선택할 수 있게 합니다. 같은 파일도 재선택할 수 있도록 input 값은 읽은 뒤 비웁니다. 지우기는 파일·진행률·오류·미리보기를 정리하고, 업로드 중에는 교체를 제한해 처리 중인 파일이 뒤바뀌지 않게 합니다.",
        screen: {
          title: "첨부 이미지 확인",
          body: "파일명과 이미지 미리보기 · 교체 또는 지우기 가능",
          items: [
            "PNG·JPG · 2MB 이하",
            "전송 중에는 교체 제한",
            "실제 외부 전송 없음",
          ],
          action: "파일 교체",
        },
      },
      practice:
        "작은 PNG·JPG를 선택해 미리보기를 보고 같은 파일 재선택·다른 이미지 교체·잘못된 형식 교체·삭제를 비교하세요. 전송 실패 후에도 파일이 유지되는지 확인하세요.",
    },
  };
  const addition = extra[id];
  if (!addition) return guide;
  if (!guide.flow.some((p) => p.title === addition.point.title))
    guide.flow.push(addition.point);
  if (!guide.examples.some((p) => p.id === addition.example.id))
    guide.examples.push(addition.example);
  if (!guide.practice.includes(addition.practice))
    guide.practice += " " + addition.practice;
  const roles = {
    기획: "필수·선택과 허용 조건, 오류 뒤 유지할 값, 계속 또는 전송이 가능한 조건을 상태표로 정리하세요. 이 예제의 동작은 외부 가입·저장이 아닌 체험임을 완료 문구에 포함하세요.",
    디자인:
      "라벨·도움말·오류·선택·비활성을 각각 구분하고 좁은 폭에서 버튼·체크박스의 중심과 줄바꿈을 확인하세요. 미리보기나 선택 동의가 추가되어도 주요 행동 위치를 찾기 쉬워야 합니다.",
    프론트엔드:
      "IME 조합·붙여넣기·키보드 초점을 보존하고 input의 required·aria-invalid·설명 연결을 실제 검증 조건과 맞추세요. 파일 Object URL은 교체·삭제·언마운트 때 정리하고 같은 파일 재선택을 허용하세요.",
    개발: "화면의 필수 조건과 API 검증을 맞추고 선택 동의는 별도 값으로 저장하세요. 첨부 형식·크기 검증은 서버에서 반복하고 화면의 전송 모의 완료를 실제 저장 성공으로 취급하지 마세요.",
  };
  for (const [role, body] of Object.entries(roles)) {
    const target = guide.roles[role as keyof typeof guide.roles];
    const title = `입력 보강 검토: ${addition.point.title}`;
    if (!target.tasks.some((p) => p.title === title))
      target.tasks.push({ title, body: body + " " + addition.point.body });
  }
  return guide;
}
