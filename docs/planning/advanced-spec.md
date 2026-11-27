# 4단계 탐색·상태·조작·레이아웃 명세

작성일: 2026-11-27. 기존 39개를 보존하고 기본 유형의 남은 12개를 추가해 총 51개로 확장합니다. 목록·관찰은 자동 4초 반복, 상세는 실제 조작, HTML·CSS·JavaScript와 독립 React·TypeScript 코드를 제공합니다. 모달 900px과 가용 높이 상한, 고정 제목·닫기, 확장된 체험 프레임을 유지합니다.

| UI | 실제 체험과 주요 상태 | 관찰 4단계 |
|---|---|---|
| Tree View | 폴더 펼침·접기, 단일 선택, 방향키·Home/End, 초점과 선택 구분 | 닫힌 계층 → 하위 목록 → 깊은 계층 → 문서 선택 |
| Carousel | 이전·다음·위치 버튼, 끝에서 순환, 위치 안내. 상세의 자동 회전은 없음 | 1번 → 2번 → 3번 → 1번 |
| Data Table | caption·행/열 머리글의 읽기용 표, 조회 조건, 빈 결과·조회 실패와 기존 표 보존 | 전체 표 → 월 선택 → 결과 표 → 다른 결과 |
| Snackbar | 노트 보관·되돌리기·닫기, 6초 후 사라짐, hover·focus 동안 시간 정지, 별도 영구 복원 경로 | 보관 전 → 알림과 행동 → 보관 상태 → 되돌림 |
| Empty State | 첫 사용·필터 무결과·실패 구분, 첫 항목 만들기·필터 해제·재시도와 재실패 | 첫 사용 → 생성 결과 → 조건 무결과 → 조회 실패 |
| Sorting | 원본·이름·금액 오름/내림, 동일 값의 원래 순서 유지, 원본 배열 불변 | 원본 → 오름차순 → 내림차순 → 이름순 |
| Filtering | 분류·내 담당의 AND 조건, 적용 조건 표시·개별 해제·전체 초기화, 0건 | 전체 → 분류 → 복합 조건 → 무결과 |
| Load More | 2개씩 추가, 기존 항목 유지, 중복 방지·실패·재시도·취소·끝 상태, 새 항목 초점 | 2개 → 추가 대기 → 4개 → 전체 6개 |
| Drag and Drop | 핸들을 끌어 순서 변경, 놓기 전 후보 표시, Esc·pointercancel 취소, 위·아래 버튼 대안 | 원래 순서 → 집기 → 놓을 위치 → 변경된 순서 |
| Responsive Layout | 컨테이너 폭에 따라 1열·3열 변경. 넓게 선택해도 실제 공간이 좁으면 1열 | 넓은 배치 → 좁은 배치 → 재배치 → 넓은 배치 |
| Sticky Header | 내부 문서 스크롤, 고정 켜기·끄기, 중간·맨 위 이동, 헤더의 영역 제한 | 문서 위 → 스크롤 → 고정 유지 → 맨 위 |
| Easing | linear·ease-in·ease-out·ease-in-out, 동일 1200ms·거리의 두 궤적 비교, 실행·초기화·완료 | 시작 → 속도 차이 → 종점 접근 → 같은 종점 |

정식 대체 관계와 실무 선택 기준은 사용 가이드에서 연결하며 공식 출처 설명을 추천 상황에 섞지 않습니다. Data Table/Sorting/Filtering/Load More는 행 수·순서·추가 방식이 각각 다른 목적임을 설명합니다. Toast/Snackbar는 명칭이 디자인 시스템마다 겹칠 수 있으므로 유일한 보편 규칙이라고 단정하지 않습니다.

모든 항목은 3개 이상의 발생 조건·처리 방법·화면 예시, 4개 직무의 구체 작업 3개·전달 계약·확인 질문을 제공합니다. 드래그 실기기·터치와 스크린 리더는 데스크톱 폭 전환으로 검증했다고 기록하지 않습니다.

공식 자료: [Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/), [Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/), [Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/), [정렬 가능한 표](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/), [Snackbar](https://mui.com/material-ui/react-snackbar/), [Carbon Empty States](https://carbondesignsystem.com/patterns/empty-states-pattern/), [Carbon Filtering](https://carbondesignsystem.com/patterns/filtering/), [WCAG Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html), [MDN Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries), [MDN position](https://developer.mozilla.org/en-US/docs/Web/CSS/position), [MDN easing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function), [WAI 상태 메시지](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).

검토: 임시 DB의 이전 검사 → 빌드·독립 코드 타입·구문·가이드·검색·순수 로직 검사 → React/HTML 양쪽 정상·오류·취소 → PC·모바일·코드 줄바꿈·자동 반복 → 실제 DB 추가 및 기존 원문·이력 보존 비교. 새 12개만 1회 추가하고 기존 초안·게시본·휴지통·순서·분류·이력을 덮어쓰지 않습니다.
