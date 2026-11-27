# 1단계: 필수 선택·도움말 8개

공식 문서 확인일: 2026-11-26. 기존 시각 스타일·900px 고정 상세 모달(작은 화면은 가용 높이 제한)·헤더 유지·기본 부분 코드/선택 전체 코드 정책을 유지합니다. 모든 그림은 HTML/CSS이며 별도 비트맵·영상 자산 없이 설명과 실제 동작을 함께 관리합니다. React와 순수 HTML/JS 체험은 같은 정책을 따릅니다.

## 시연·체험·검수 조건

공통 목록·관찰 루프는 4초, 대표 포스터는 1.7초입니다. 목록은 작은 320×200 논리 캔버스를 비율에 맞게 축소합니다. 직접 체험은 시간으로 상태를 바꾸지 않고 실제 입력으로만 동작합니다. 토스트 자동 닫힘과 스위치 저장 지연은 해당 UI의 동작 규칙입니다.

| UI | 루프 타임라인 | 실제 체험 | 화면 예시·검수 기준 |
|---|---|---|---|
| Tooltip | 0~0.7초 닫힘 → 0.7~2.6초 설명 → 닫힘·결과 | hover/focus, 설명으로 포인터 이동, Esc 닫기, 원래 버튼 실행, 터치용 도움말 펼침 | 설명 내부에는 포커스 가능한 요소 없음. Esc는 초점을 유지하고 설명만 닫음. 재진입하면 다시 열림. 필수 정보는 툴팁만으로 제공하지 않음 |
| Popover | 0.65초 열림 → 1.6초 임시 간격 선택 → 2.9초 적용·닫힘 | native auto popover, 임시 라디오 선택, 적용/닫기/바깥 클릭/Esc | 적용값과 임시값 분리. 취소 후 다시 열면 적용값 복원. 배경 비차단. 버튼·제목 연결. 뷰포트 경계 위치 보정 |
| Toast | 0.65초 성공 표시 → 2.9초 닫힘 | 5초 자동 닫힘, hover/focus/문서 비활성 중 남은 시간 정지, 수동 닫기, 최신 5개 기록, 지속 오류·재시도 | 초점 강제 이동 없음. 기존 live 영역 갱신. 연속 알림은 최신 1개로 교체·5초 재시작. 실패는 성공 알림 대신 인라인 오류 유지 |
| Tabs | 0~1초 개요 → 1~2.2초 활동 → 2.2~3.4초 멤버 → 개요 | 클릭, 좌우/Home/End, 자동·수동 활성화, Enter/Space | tab/panel 연결, 선택 1개, roving tabIndex, 비활성 hidden. 수동형 화살표는 초점만 이동. 위아래는 가로 탭에서 가로채지 않음 |
| Select | 0.8초 설명용 목록 열림 → 1.5초 첫 항목 강조 → 2.3초 닫힘 → 적용 표시 | 목록과 같은 선택 전용 패널·적용·초기화·필수 오류 | 보이는 라벨·combobox/listbox·활성 후보·확정값 분리. 방향키·Home/End·Enter/Space·Esc/Tab·바깥 클릭. 화면 경계에 따라 위로 열기·내부 스크롤 |
| Switch | 1초 켜짐·저장 중 → 2초 저장 완료 | native checkbox+switch 역할, Space, 700ms 저장 모의, 실패 시 이전값 복원 | 라벨 고정. checked/저장값/pending 분리. 저장 중 재실행 차단. 오류 후 실제 상태와 문구 일치 |
| Checkbox | 0~0.7초 0개 → 0.7~1.7초 1개 → 1.7~2.9초 모두 → 일부 | 개별·전체 선택, native indeterminate, Space | 전체 해제/부분/모두 구분. 부분 상태에서 전체 누르면 모두, 다시 누르면 해제. 저장은 선택 id로 표현 |
| Radio Group | 0~0.7초 미선택 → 0.7~2.1초 일반 → 빠른 배송 | native 동일 name 그룹, 화살표/Space, 미선택 확인 오류·초기화 | 한 그룹 하나 선택. 다른 그룹 name 충돌 없음. 선택과 주문 실행 분리. 그룹 오류와 추가 비용 설명 |

## 모바일·대안

- Tooltip은 호버에 의존하지 않고 별도 이름 있는 도움말 펼침을 제공합니다. 보관 버튼의 첫 탭은 원래 실행을 유지합니다.
- Popover는 짧은 폼이 들어갈 공간을 확인합니다. 복잡하면 인라인 설정·바텀시트·전용 화면으로 전환합니다. 이 데모는 auto API만 사용하며 CSS Anchor Positioning에 의존하지 않습니다.
- Toast는 좁은 화면에서 줄바꿈하며 하단 행동·키보드·안전 영역과의 충돌은 실제 통합 화면에서 재검토합니다. 데모 iframe 확인을 모든 OS 실기기 검수로 취급하지 않습니다.
- Tabs는 현재 3개의 짧은 이름을 사용합니다. 많고 긴 탭을 무작정 축소하지 않고 정보 구조·가로 스크롤·대체 선택을 검토합니다.
- Select는 사용자 요청에 따라 목록과 상세의 외형을 일치시키는 커스텀 선택 패널을 사용합니다. 특별한 외형 요구가 없다면 네이티브 select, 소수의 비교형 선택은 Radio, 검색이 필요하면 입력형 Combobox가 대안입니다.
- Switch·Checkbox·Radio는 동일 의미로 PC·모바일을 지원합니다. 라벨 영역을 누를 수 있고 긴 문구는 줄바꿈하며 의미를 색만으로 전달하지 않습니다.

## 콘텐츠와 관리

각 항목에 정의, 용도 2개 이상, 상태 화면 3개, 순차 흐름 3단계, 주의·대안, 실제 체험 방법을 작성합니다. 직무별 안내는 목표·업무 3개·협업 전달 예·확인 2개 이상입니다. 관리자는 모든 원고·예시·분류·검색어·노출·게시·이력을 기존 편집기에서 관리합니다. 실행 코드 등록은 개발자 담당입니다.

기존 데이터는 `catalog-essentials-v1` 이전으로 신규 id만 추가합니다. 동일 id의 사용자 편집·초안·게시본·숨김·휴지통·순서·이력은 보존합니다. 필요한 새 카테고리만 끝에 추가하고 적용 전 복구 JSON을 남깁니다. 이전 마커가 있으면 삭제된 항목을 재생성하지 않습니다. 백업 전체 교체도 기존 정책을 따릅니다.

## 개별 근거

- [WAI-ARIA APG Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/): 이중·부분 선택, Space, 그룹 의미.
- [WAI-ARIA APG Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/): 배타적 선택·화살표·Space. 최초 미선택의 네이티브 진입 차이와 툴바 문맥 예외를 구분.
- [WAI-ARIA APG Switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/): 고정 라벨·켜짐/꺼짐·Space. 이 데모의 지연·롤백은 서비스 설계 예시.
- [WAI-ARIA APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/): 자동·수동 활성화, 즉시 전환 조건, 연결 의미와 키보드.
- [WAI-ARIA APG Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/): hover/focus·Esc·비조작 설명. 해당 APG 패턴은 작업 중이며 합의 완료 패턴으로 소개하지 않음.
- [GOV.UK Select](https://design-system.service.gov.uk/components/select/): 네이티브 선택, 선택 전 안내와 오류. 선택지 축소·라디오 대안 우선 검토. “항목이 많으면 무조건 Select”로 일반화하지 않음.
- [MDN popover 전역 속성](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover): auto top layer·light dismiss·비모달. 내용 역할·초점 설계는 별도 책임.
- [Carbon Notification 지침](https://www.carbondesignsystem.com/building-blocks/core/components/notification/guidelines): 비차단 일시 알림과 지속 인라인 상태의 구분. 5초는 이 데모 정책이며 보편 의무 시간이 아님. Toast와 Snackbar의 명칭 차이를 위치나 Undo 하나로 단정하지 않음.

후속 외형 통일(2026-11-26)의 키보드 근거는 [W3C APG Select-Only Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/)입니다. 방향키 탐색과 선택값 확정을 분리하며 Enter·Space·Tab으로 선택, Esc로 취소합니다.
