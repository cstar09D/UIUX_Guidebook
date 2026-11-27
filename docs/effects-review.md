# 커서·이미지 효과 확장

확인일: 2026-11-27.

## 참고와 범위

사용자가 지정한 [마우스 커서 효과 9가지](https://orrd.co.kr/archive-view?id=6b051c993479272a42e98c15), [이미지 효과 9가지](https://orrd.co.kr/archive-view?id=6b06bfed3479272a42e98e3c)의 제목·동작 설명·화면을 Aside에서 확인했습니다. 기존 Carousel은 유지하고 나머지 17개를 별도 용어로 추가했습니다. 일부는 입력 컴포넌트가 아닌 장식·이미지 표현 기법이므로 모든 업무 화면에 권장하는 패턴으로 설명하지 않습니다.

| 분류 | 추가 항목 |
| --- | --- |
| 커서와 인터랙션 · 9개 | Magnetic Button, Image Trail, Hover Reveal, Blend Mode Cursor, Spotlight, Tilt Card, Cursor Label, Ripple, Cursor Trail |
| 이미지와 갤러리 · 8개 | Masonry, Lightbox, Before/After Slider, Ken Burns Effect, Image Magnifier, Image Accordion, Image Hotspot, Halftone |

기존 51개와 합쳐 68개입니다. 기본 출시 50개와 기간 선택 변형의 기록은 유지하고 [release-50.json](planning/release-50.json)의 `additions`로 이번 확장을 구분했습니다. Carousel의 기존 분류와 콘텐츠는 변경하지 않았습니다.

## 구현 계약

- 목록·자동 관찰·상세 체험은 `effects.tsx`의 같은 실행 컴포넌트를 사용합니다. 목록은 4초 주기의 결정 가능한 시간값으로 반복하고, 체험은 실제 사용자 입력을 받습니다.
- 참고 사이트의 이미지·코드는 가져오지 않았습니다. 자체 작성한 SVG 장면 3개를 모든 이미지 효과에서 함께 사용해 외부 이미지 서버 없이 실행됩니다. 하프톤은 이 원본의 밝기를 Canvas에서 읽고 점 크기로 재구성합니다.
- Magnetic은 고정된 감지 영역 기준 이동, Image Trail은 거리 임계값·최대 8개·수명 제한, Cursor Trail은 최대 8개와 프레임 정리, Tilt는 제한된 회전과 저장 상태를 제공합니다. 원래 시스템 커서를 유지합니다.
- Lightbox는 모달 dialog·이전/다음·방향키·Esc·원래 썸네일 초점 복귀를 제공합니다. Before/After는 동일 좌표 이미지와 range 입력, Hotspot은 번호 버튼과 화면 아래 설명, Magnifier는 실제 표시 크기와 배율을 기준으로 렌즈 위치를 계산합니다.
- Masonry는 CSS columns로 구현해 현재 브라우저의 실험적 masonry 지원을 요구하지 않습니다. 열을 따라 읽는 순서를 가이드에 명시합니다. 좁은 목록 캔버스에서는 서로 다른 높이의 작은 썸네일로 모두 보이게 합니다.
- 커서 효과 중 Ripple을 제외한 8개는 PC 중심 효과로 표시하고 모바일의 고정 버튼·카드·갤러리 등 대안을 설명합니다. 직접 체험에는 키보드로 실행할 수 있는 예시 위치·트레일 버튼도 제공합니다. 이미지 효과와 Ripple은 PC·모바일 모두 표시합니다.
- HTML은 React 초기 트리를 정적 HTML로 변환하고 UI별 독립 DOM 이벤트를 연결합니다. 복사 코드에 다른 효과의 실행 컴포넌트가 섞이지 않으며 기본 부분 코드·선택형 전체 예제를 유지합니다.
- 새 가이드에는 적용 상황·동작·모바일 대안·구현 주의·4개 직무의 작업과 전달 기준·상태별 예시 3개씩을 추가했습니다. 가이드 그림도 실제 컴포넌트를 고정 시점에 렌더링합니다. 대안은 구체적인 선택 이유와 해당 UI의 애니메이션·상세 링크를 제공합니다.
- 정확한 동작 검색어의 일치를 일반 키워드 부분 포함보다 우선하도록 보완했습니다. ‘호버 가로 확장’ 검색에서 Image Accordion이 일반적인 호버 관련 항목보다 먼저 나옵니다.

## 확인 결과

프로덕션 빌드와 자동 검사 51개가 통과했습니다. 68개 등록·중복 방지·출시 명세 연결·209개 상태 예시·직무 가이드·대안 id·검색을 검증합니다. 독립 React 부분/전체 코드 136개의 타입과 HTML·JavaScript·CSS 구문 검사를 포함합니다. 추가 이전은 임시 DB에서 기존 51개 콘텐츠·게시본·이력·분류와 재시작 중복 방지를 확인했습니다.

Aside 브라우저에서 17개 효과 각각을 React/HTML과 PC 1440/모바일 320 폭으로 확인한 68개 측정값에 가로 넘침·실행 컴포넌트 누락·이미지 로딩 누락이 없었습니다. [측정값](qa/effects/metrics.json). 터치 전용 실기기 검증은 포함하지 않습니다.

| UI | 조작 확인 |
| --- | --- |
| Magnetic, Blend, Spotlight, Tilt, Cursor Label | 예시 위치 입력에 따른 이동·반전 원·그라디언트·회전·라벨 표시; Magnetic은 실제 포인터 좌표 반응도 확인 |
| Image Trail, Cursor Trail | 잔상 생성과 제한된 노드 수, 예시 경로·위치 입력 |
| Hover Reveal | 두 번째 행 선택·이미지 한 장 표시 |
| Ripple | Enter 실행·입력 횟수 안내 |
| Masonry | 열 수 전환·항목 선택 |
| Before/After | Home·End에서 0/100% 경계·상태 동기화 |
| Lightbox | 두 번째 사진 확대·다음 이동·Esc·원래 썸네일 초점 복귀 |
| Ken Burns | 정지·이어가기와 확대/이동 transform |
| Magnifier | 중앙 렌즈와 배율 2→4, 실제 표시 크기 기반 배경 크기 |
| Image Accordion | 세 번째 장면 선택·선택 패널/설명 동기화 |
| Hotspot | 테이블 설명·닫기, 최종 React에서도 닫기 후 번호 초점 복귀 |
| Halftone | React/HTML의 불투명 Canvas와 실제 명암 픽셀, 원본 전환·점 간격 변경 |

최종 목록 필터 9개/8개, 자동 관찰, 코드 형식 전환, 관리자 API의 68개 등록도 확인했습니다. 짧은 체험의 불필요한 내부 스크롤을 줄이도록 효과 영역 높이를 프레임 높이에 맞춥니다.

기존 실제 DB의 원고·게시본·메타 51건씩과 이력 94건은 원문 그대로 보존했습니다. 새 항목만 추가해 각각 68건·이력 111건이 됐으며 새 분류 2개와 일회성 추가 표시만 설정에 반영했습니다. [보존 결과](qa/effects/data-preservation.json). 추가 전 전체 내보내기는 기존 DB 절차에 따라 `data/backups/`에 자동 저장됩니다.

화면: [커서 목록](qa/effects/cursor-list.png), [이미지 목록](qa/effects/image-list.png), [Magnetic 체험](qa/effects/magnetic-desktop.png).
