# 참고 사이트 추가 현황 재점검

확인일: 2026-11-28 · 기준: [참고 사이트](https://ui-terms-cheatsheet.pages.dev/) 277개 카드와 Turso 읽기 전용 조회. 참고 사이트의 항목명 277개는 기존 조사와 동일하다.

## 현재 공개·구현 범위

- 공개 목록: **77개**. 초안 포함 등록: **101개**. 신규 24개는 구현되어 있지만 아직 초안이다.
- 1차 신규 24개 및 기존 보강 12개 묶음은 A1~A4 검수 문서에 기록되어 있다. GitHub PUSH는 소스 전송이며 DB 초안을 게시하지 않는다.
- 2차 신규 24개는 아직 미구현이다. 이후 신규 동작 48개, 스타일·기초 비교 학습 83개, 보류 2개가 남아 있다.
- 참고 사이트 277개와 우리 목록 101개는 항목을 나누는 기준이 달라 단순 뺄셈으로 누락 수를 계산하면 안 된다.
- 아래 “기존 통합·확장 대상” 46개는 기존 UI에 대응 대상을 지정한 조사 분류다. 대상 ID 존재 여부만으로 해당 변형의 전 범위 구현 완료를 주장하지 않는다. 기존 보강 12개 범위 밖의 변형은 후속 검수가 필요하다.

## 참고 항목 기준 집계

| 상태 | 항목 수 |
| --- | ---: |
| 2차 미구현 | 24 |
| 기존 대응 | 50 |
| 기존 통합·확장 대상 | 46 |
| 구현·초안 | 24 |
| 후속 미구현 | 48 |
| 스타일·기초 후속 | 83 |
| 보류 | 2 |

## 2차 미구현 24개

| UI | 예정 ID |
| --- | --- |
| Hero Section | `hero-section` |
| Bento Grid | `bento-grid` |
| Navbar / GNB | `navigation-bar` |
| List-Detail Layout | `list-detail` |
| Table of Contents | `table-of-contents` |
| Sticky Sidebar | `sticky-sidebar` |
| Horizontal Scroll | `horizontal-scroll` |
| Feature Section | `feature-section` |
| Pricing Table | `pricing-table` |
| CTA Section | `cta-section` |
| Kanban Board | `kanban-board` |
| Coachmark / Product Tour | `product-tour` |
| Back to Top Button | `back-to-top` |
| Code Block + Copy Button | `code-block` |
| Status Indicator | `status-indicator` |
| Image Gallery | `image-gallery` |
| Input Mask | `input-mask` |
| Color Picker | `color-picker` |
| Autosave Indicator | `autosave` |
| Login / Sign-up Form | `auth-form` |
| Marquee / Logo Slider | `marquee` |
| Optimistic UI | `optimistic-ui` |
| Scroll Progress | `scroll-progress` |
| Page / View Transition | `view-transition` |

## 전체 277개 대조

| 참고 UI | 분류 | 현재 판정 | 우리 UI ID |
| --- | --- | --- | --- |
| Hero Section | 레이아웃 | 2차 미구현 | `hero-section` |
| Responsive Layout | 레이아웃 | 기존 대응 | `responsive-layout` |
| Card Layout | 레이아웃 | 기존 통합·확장 대상 | `responsive-layout`, `card` |
| Bento Grid | 레이아웃 | 2차 미구현 | `bento-grid` |
| Sidebar Layout | 레이아웃 | 기존 통합·확장 대상 | `navigation-drawer`, `responsive-layout` |
| Sticky Header | 레이아웃 | 기존 대응 | `sticky-header` |
| Split Layout | 레이아웃 | 구현·초안 | `split-view` |
| Navbar / GNB | 레이아웃 | 2차 미구현 | `navigation-bar` |
| Footer | 레이아웃 | 후속 미구현 | `footer` |
| Masonry Layout | 레이아웃 | 기존 대응 | `masonry` |
| Grid System (12-column) | 레이아웃 | 스타일·기초 후속 | `grid-system` |
| Container / Max-width | 레이아웃 | 스타일·기초 후속 | `container-width` |
| Above the Fold | 레이아웃 | 스타일·기초 후속 | `above-the-fold` |
| Dashboard Layout | 레이아웃 | 후속 미구현 | `dashboard-layout` |
| List-Detail Layout | 레이아웃 | 2차 미구현 | `list-detail` |
| Mega Menu | 레이아웃 | 구현·초안 | `mega-menu` |
| Table of Contents | 레이아웃 | 2차 미구현 | `table-of-contents` |
| F / Z Pattern | 레이아웃 | 스타일·기초 후속 | `reading-patterns` |
| Zigzag Layout | 레이아웃 | 스타일·기초 후속 | `zigzag-layout` |
| Sticky Sidebar | 레이아웃 | 2차 미구현 | `sticky-sidebar` |
| Centered Layout | 레이아웃 | 기존 통합·확장 대상 | `responsive-layout` |
| Full-screen Section | 레이아웃 | 기존 통합·확장 대상 | `responsive-layout` |
| Horizontal Scroll | 레이아웃 | 2차 미구현 | `horizontal-scroll` |
| Collapsible Sidebar | 레이아웃 | 기존 통합·확장 대상 | `navigation-drawer` |
| Feature Section | 랜딩 섹션 | 2차 미구현 | `feature-section` |
| Pricing Table | 랜딩 섹션 | 2차 미구현 | `pricing-table` |
| Pricing Toggle | 랜딩 섹션 | 기존 통합·확장 대상 | `segmented-control` |
| Testimonial | 랜딩 섹션 | 후속 미구현 | `testimonial` |
| FAQ Section | 랜딩 섹션 | 기존 통합·확장 대상 | `accordion` |
| Logo Cloud | 랜딩 섹션 | 후속 미구현 | `logo-cloud` |
| Stats Section | 랜딩 섹션 | 후속 미구현 | `stats-section` |
| CTA Section | 랜딩 섹션 | 2차 미구현 | `cta-section` |
| Comparison Table | 랜딩 섹션 | 기존 통합·확장 대상 | `data-table` |
| How It Works | 랜딩 섹션 | 기존 통합·확장 대상 | `stepper` |
| Newsletter / Waitlist Form | 랜딩 섹션 | 후속 미구현 | `newsletter-form` |
| Contact Section | 랜딩 섹션 | 후속 미구현 | `contact-form` |
| Trust Badges | 랜딩 섹션 | 스타일·기초 후속 | `trust-signals` |
| App Store Badges | 랜딩 섹션 | 보류 | `app-store-badges` |
| Tabs | 컴포넌트 | 기존 대응 | `tabs` |
| Accordion | 컴포넌트 | 기존 대응 | `accordion` |
| Modal / Dialog | 컴포넌트 | 기존 대응 | `modal` |
| Drawer | 컴포넌트 | 기존 통합·확장 대상 | `navigation-drawer` |
| Dropdown | 컴포넌트 | 기존 통합·확장 대상 | `select`, `menu-button`, `combobox` |
| Tooltip | 컴포넌트 | 기존 대응 | `tooltip` |
| Toast / Snackbar | 컴포넌트 | 기존 대응 | `toast`, `snackbar` |
| Carousel | 컴포넌트 | 기존 대응 | `carousel` |
| Skeleton Loading | 컴포넌트 | 기존 대응 | `skeleton` |
| Popover | 컴포넌트 | 기존 대응 | `popover` |
| Bottom Sheet | 컴포넌트 | 기존 대응 | `bottom-sheet` |
| Hamburger Menu | 컴포넌트 | 기존 통합·확장 대상 | `navigation-drawer`, `menu-button` |
| Breadcrumb | 컴포넌트 | 기존 대응 | `breadcrumb` |
| Pagination | 컴포넌트 | 기존 대응 | `pagination` |
| Badge | 컴포넌트 | 구현·초안 | `badge` |
| Chip / Tag | 컴포넌트 | 구현·초안 | `chip-tag` |
| Avatar | 컴포넌트 | 구현·초안 | `avatar` |
| Toggle Switch | 컴포넌트 | 기존 대응 | `switch` |
| Stepper | 컴포넌트 | 기존 대응 | `stepper` |
| Progress Bar | 컴포넌트 | 기존 대응 | `progress-bar` |
| Spinner / Loader | 컴포넌트 | 기존 대응 | `loading-spinner` |
| Command Palette | 컴포넌트 | 구현·초안 | `command-palette` |
| Segmented Control | 컴포넌트 | 기존 대응 | `segmented-control` |
| Data Table | 컴포넌트 | 기존 통합·확장 대상 | `data-table`, `sorting` |
| Floating Action Button | 컴포넌트 | 기존 대응 | `floating-action-button` |
| Empty State | 컴포넌트 | 기존 대응 | `empty-state` |
| Alert / Banner | 컴포넌트 | 기존 통합·확장 대상 | `inline-alert` |
| Bottom Navigation | 컴포넌트 | 기존 대응 | `bottom-navigation` |
| Kebab / Meatball Menu | 컴포넌트 | 기존 통합·확장 대상 | `menu-button`, `icon-button` |
| Context Menu | 컴포넌트 | 구현·초안 | `context-menu` |
| Split Button | 컴포넌트 | 구현·초안 | `split-button` |
| Lightbox | 컴포넌트 | 기존 대응 | `lightbox` |
| Timeline | 컴포넌트 | 후속 미구현 | `timeline` |
| Kanban Board | 컴포넌트 | 2차 미구현 | `kanban-board` |
| Tree View | 컴포넌트 | 기존 대응 | `tree-view` |
| Stat / KPI Card | 컴포넌트 | 기존 통합·확장 대상 | `card`, `progress-bar` |
| Coachmark / Product Tour | 컴포넌트 | 2차 미구현 | `product-tour` |
| Cookie Consent Bar | 컴포넌트 | 후속 미구현 | `consent-banner` |
| Back to Top Button | 컴포넌트 | 2차 미구현 | `back-to-top` |
| Code Block + Copy Button | 컴포넌트 | 2차 미구현 | `code-block` |
| Chat Bubble | 컴포넌트 | 후속 미구현 | `chat-thread` |
| Info Button / Toggletip | 컴포넌트 | 기존 통합·확장 대상 | `popover`, `tooltip` |
| Callout / Info Box | 컴포넌트 | 기존 통합·확장 대상 | `inline-alert` |
| Confirm Dialog | 컴포넌트 | 기존 대응 | `alert-dialog` |
| Action Sheet | 컴포넌트 | 기존 통합·확장 대상 | `bottom-sheet`, `menu-button` |
| Share Sheet | 컴포넌트 | 기존 통합·확장 대상 | `icon-button`, `bottom-sheet` |
| Notification Center | 컴포넌트 | 구현·초안 | `notification-center` |
| Profile Menu | 컴포넌트 | 기존 통합·확장 대상 | `menu-button` |
| Hover Card | 컴포넌트 | 구현·초안 | `hover-card` |
| Promo Popup | 컴포넌트 | 기존 통합·확장 대상 | `modal` |
| Chat Widget | 컴포넌트 | 후속 미구현 | `chat-widget` |
| Sticky Bottom Bar | 컴포넌트 | 후속 미구현 | `sticky-bottom-bar` |
| Top App Bar | 컴포넌트 | 후속 미구현 | `top-app-bar` |
| Divider | 컴포넌트 | 스타일·기초 후속 | `divider` |
| Status Indicator | 컴포넌트 | 2차 미구현 | `status-indicator` |
| Countdown Timer | 컴포넌트 | 후속 미구현 | `countdown` |
| Chart (Bar / Line / Donut) | 컴포넌트 | 후속 미구현 | `charts` |
| Progress Ring | 컴포넌트 | 기존 통합·확장 대상 | `progress-bar` |
| Video Player | 컴포넌트 | 후속 미구현 | `video-player` |
| Product Card | 컴포넌트 | 기존 통합·확장 대상 | `card`, `toggle-button` |
| Image Gallery | 컴포넌트 | 2차 미구현 | `image-gallery` |
| Comment Thread | 컴포넌트 | 후속 미구현 | `comment-thread` |
| Filter & Sort | 컴포넌트 | 기존 통합·확장 대상 | `filtering`, `sorting` |
| Calendar View | 컴포넌트 | 후속 미구현 | `calendar-view` |
| Show More / Read More | 컴포넌트 | 기존 통합·확장 대상 | `disclosure`, `load-more` |
| Icon Button | 컴포넌트 | 기존 대응 | `icon-button` |
| 404 / Error Page | 컴포넌트 | 후속 미구현 | `error-page` |
| Onboarding Screens | 컴포넌트 | 후속 미구현 | `onboarding` |
| Before / After Slider | 컴포넌트 | 기존 대응 | `before-after-slider` |
| Input / Text Field | 입력·폼 | 기존 대응 | `text-field` |
| Floating Label | 입력·폼 | 기존 통합·확장 대상 | `text-field` |
| Checkbox | 입력·폼 | 기존 대응 | `checkbox` |
| Radio Button | 입력·폼 | 기존 대응 | `radio-group` |
| Autocomplete / Combobox | 입력·폼 | 기존 대응 | `combobox` |
| Range Slider | 입력·폼 | 기존 대응 | `slider` |
| Search Bar | 입력·폼 | 기존 대응 | `search-field` |
| Validation / Error State | 입력·폼 | 기존 통합·확장 대상 | `text-field`, `textarea` |
| Disabled State | 입력·폼 | 기존 통합·확장 대상 | `button`, `text-field` |
| Focus State / Focus Ring | 입력·폼 | 기존 통합·확장 대상 | `button`, `text-field` |
| Date Picker | 입력·폼 | 기존 대응 | `date-picker` |
| File Upload / Dropzone | 입력·폼 | 기존 대응 | `file-upload` |
| Select | 입력·폼 | 기존 대응 | `select` |
| Textarea | 입력·폼 | 기존 대응 | `textarea` |
| Password Field | 입력·폼 | 구현·초안 | `password-field` |
| OTP / PIN Input | 입력·폼 | 구현·초안 | `otp-input` |
| Tag Input / Multi-select | 입력·폼 | 구현·초안 | `multi-select` |
| Number Stepper | 입력·폼 | 구현·초안 | `number-stepper` |
| Date Range Picker | 입력·폼 | 기존 대응 | `date-range-picker` |
| Time Picker | 입력·폼 | 구현·초안 | `time-picker` |
| Input Mask | 입력·폼 | 2차 미구현 | `input-mask` |
| Character Counter | 입력·폼 | 기존 대응 | `text-field`, `textarea` |
| Helper Text | 입력·폼 | 기존 통합·확장 대상 | `text-field`, `textarea` |
| Required Indicator | 입력·폼 | 기존 통합·확장 대상 | `text-field`, `radio-group` |
| Rich Text Editor | 입력·폼 | 후속 미구현 | `rich-text-editor` |
| Social Login Button | 입력·폼 | 후속 미구현 | `social-login` |
| Rating | 입력·폼 | 구현·초안 | `rating` |
| Agree to All | 입력·폼 | 기존 통합·확장 대상 | `checkbox` |
| Color Picker | 입력·폼 | 2차 미구현 | `color-picker` |
| Image Upload Preview | 입력·폼 | 기존 통합·확장 대상 | `file-upload` |
| Autosave Indicator | 입력·폼 | 2차 미구현 | `autosave` |
| Inline Edit | 입력·폼 | 구현·초안 | `inline-edit` |
| Address Search | 입력·폼 | 후속 미구현 | `address-search` |
| Login / Sign-up Form | 입력·폼 | 2차 미구현 | `auth-form` |
| Hover Effect | 효과 | 기존 통합·확장 대상 | `button`, `card`, `hover-reveal` |
| Scroll Reveal | 효과 | 구현·초안 | `scroll-reveal` |
| Stagger Animation | 효과 | 구현·초안 | `stagger-animation` |
| Smooth Transition | 효과 | 기존 통합·확장 대상 | `easing` |
| Glassmorphism | 효과 | 스타일·기초 후속 | `glassmorphism` |
| Parallax Scrolling | 효과 | 구현·초안 | `parallax-scroll` |
| Scroll Snap | 효과 | 구현·초안 | `scroll-snap` |
| Micro-interaction | 효과 | 스타일·기초 후속 | `micro-interaction` |
| Fade In / Out | 효과 | 후속 미구현 | `fade-transition` |
| Ripple Effect | 효과 | 기존 대응 | `ripple` |
| Marquee / Logo Slider | 효과 | 2차 미구현 | `marquee` |
| Typewriter Effect | 효과 | 후속 미구현 | `typewriter` |
| Count-up / Number Ticker | 효과 | 후속 미구현 | `count-up` |
| Infinite Scroll | 효과 | 구현·초안 | `infinite-scroll` |
| Easing | 효과 | 기존 대응 | `easing` |
| Animated Gradient | 효과 | 기존 통합·확장 대상 | `mesh-gradient`, `aurora` |
| Spotlight / Cursor Glow | 효과 | 기존 대응 | `spotlight` |
| Drag & Drop Reorder | 효과 | 기존 대응 | `drag-and-drop` |
| Swipe Action | 효과 | 구현·초안 | `swipe-actions` |
| Pull to Refresh | 효과 | 구현·초안 | `pull-to-refresh` |
| Shake Animation | 효과 | 기존 통합·확장 대상 | `text-field` |
| Lazy Loading | 효과 | 후속 미구현 | `lazy-loading` |
| Optimistic UI | 효과 | 2차 미구현 | `optimistic-ui` |
| Hide-on-Scroll Header | 효과 | 기존 통합·확장 대상 | `sticky-header` |
| Image Zoom | 효과 | 기존 통합·확장 대상 | `image-magnifier`, `lightbox`, `hover-reveal` |
| Smooth Scroll | 효과 | 후속 미구현 | `smooth-scroll` |
| Ping / Pulse Dot | 효과 | 기존 통합·확장 대상 | `status-indicator` |
| Neumorphism | 스타일 | 스타일·기초 후속 | `neumorphism` |
| Claymorphism | 스타일 | 스타일·기초 후속 | `claymorphism` |
| Flat Design | 스타일 | 스타일·기초 후속 | `flat-design` |
| Minimalism | 스타일 | 스타일·기초 후속 | `minimalism` |
| Neo-brutalism | 스타일 | 스타일·기초 후속 | `neo-brutalism` |
| Gradient | 스타일 | 스타일·기초 후속 | `gradient` |
| Mesh / Aurora Gradient | 스타일 | 기존 대응 | `mesh-gradient`, `aurora` |
| Dark Mode | 스타일 | 스타일·기초 후속 | `dark-mode` |
| Glow / Neon | 스타일 | 스타일·기초 후속 | `glow-neon` |
| Drop Shadow / Elevation | 스타일 | 스타일·기초 후속 | `elevation` |
| Border Radius | 스타일 | 스타일·기초 후속 | `border-radius` |
| Button Variants | 스타일 | 기존 통합·확장 대상 | `button` |
| Color Palette | 스타일 | 스타일·기초 후속 | `color-palette` |
| Liquid Glass | 스타일 | 스타일·기초 후속 | `liquid-glass` |
| Grain / Noise Texture | 스타일 | 기존 대응 | `grain` |
| Y2K / Chrome | 스타일 | 스타일·기초 후속 | `y2k-chrome` |
| Frutiger Aero | 스타일 | 스타일·기초 후속 | `frutiger-aero` |
| Synthwave / Retro Grid | 스타일 | 스타일·기초 후속 | `synthwave` |
| Cyberpunk | 스타일 | 스타일·기초 후속 | `cyberpunk` |
| Holographic / Iridescent | 스타일 | 스타일·기초 후속 | `iridescence` |
| Duotone | 스타일 | 스타일·기초 후속 | `duotone` |
| Halftone / Risograph | 스타일 | 기존 통합·확장 대상 | `halftone` |
| Pixel Art / 8-bit | 스타일 | 스타일·기초 후속 | `pixel-art` |
| Dithering | 스타일 | 스타일·기초 후속 | `dithering` |
| ASCII / Terminal | 스타일 | 스타일·기초 후속 | `terminal-style` |
| Bauhaus / Geometric | 스타일 | 스타일·기초 후속 | `bauhaus` |
| Swiss Style | 스타일 | 스타일·기초 후속 | `swiss-style` |
| Memphis Design | 스타일 | 스타일·기초 후속 | `memphis` |
| Hand-drawn / Doodle | 스타일 | 스타일·기초 후속 | `hand-drawn` |
| Torn Paper / Collage | 스타일 | 스타일·기초 후속 | `collage` |
| Isometric | 스타일 | 스타일·기초 후속 | `isometric` |
| Skeuomorphism | 스타일 | 스타일·기초 후속 | `skeuomorphism` |
| Editorial / Magazine | 스타일 | 스타일·기초 후속 | `editorial` |
| Oversized Typography | 스타일 | 스타일·기초 후속 | `oversized-type` |
| Inflated / Puffy 3D | 스타일 | 스타일·기초 후속 | `puffy-3d` |
| Wireframe / Blueprint | 스타일 | 스타일·기초 후속 | `blueprint` |
| Dot / Grid Pattern | 스타일 | 기존 대응 | `dot-grid` |
| Progressive Blur | 스타일 | 스타일·기초 후속 | `progressive-blur` |
| Light Rays / God Rays | 스타일 | 기존 통합·확장 대상 | `beams` |
| Sticker Style | 스타일 | 스타일·기초 후속 | `sticker-style` |
| Material Design | 스타일 | 스타일·기초 후속 | `material-design` |
| iOS Style | 스타일 | 스타일·기초 후속 | `ios-guidelines` |
| Icon Style | 스타일 | 스타일·기초 후속 | `icon-style` |
| Toss-like Clean UI | 스타일 | 보류 | `clean-financial-ui` |
| Section Divider (Wave / Slant) | 스타일 | 스타일·기초 후속 | `section-divider` |
| Text Highlight | 스타일 | 스타일·기초 후속 | `text-highlight` |
| Card Style | 스타일 | 기존 통합·확장 대상 | `card` |
| Kinetic Typography | 모션 | 후속 미구현 | `kinetic-typography` |
| Text Scramble / Decode | 모션 | 후속 미구현 | `text-scramble` |
| Word Rotate | 모션 | 후속 미구현 | `word-rotate` |
| Text Reveal / Mask Reveal | 모션 | 후속 미구현 | `text-reveal` |
| Shiny Text / Shimmer | 모션 | 후속 미구현 | `shimmer` |
| Blur Fade / Blur-in | 모션 | 후속 미구현 | `blur-fade` |
| Shape Morphing / Blob | 모션 | 기존 대응 | `blob` |
| Gooey / Metaball | 모션 | 후속 미구현 | `gooey` |
| Particles / Confetti | 모션 | 기존 통합·확장 대상 | `particles` |
| Meteors / Shooting Stars | 모션 | 후속 미구현 | `meteors` |
| Border Beam | 모션 | 후속 미구현 | `border-beam` |
| Animated Beam | 모션 | 후속 미구현 | `animated-beam` |
| Orbiting Circles | 모션 | 후속 미구현 | `orbiting-elements` |
| 3D Tilt Card | 모션 | 기존 대응 | `tilt-card` |
| Card Flip | 모션 | 후속 미구현 | `card-flip` |
| Magnetic Button | 모션 | 기존 대응 | `magnetic-button` |
| Glitch Effect | 모션 | 후속 미구현 | `glitch` |
| Dispersion / Pixel Dissolve | 모션 | 후속 미구현 | `pixel-dissolve` |
| Scroll Progress | 모션 | 2차 미구현 | `scroll-progress` |
| Scrollytelling / Sticky Scroll | 모션 | 후속 미구현 | `scrollytelling` |
| Dock Magnification | 모션 | 후속 미구현 | `dock-magnification` |
| Line Drawing (SVG Path) | 모션 | 후속 미구현 | `svg-line-drawing` |
| Ken Burns Effect | 모션 | 기존 대응 | `ken-burns` |
| Squash & Stretch | 모션 | 후속 미구현 | `squash-stretch` |
| Page / View Transition | 모션 | 2차 미구현 | `view-transition` |
| Liquid Fill / Wave | 모션 | 후속 미구현 | `liquid-fill` |
| Lottie Animation | 모션 | 후속 미구현 | `lottie-animation` |
| Padding / Margin / Gap | 디자인 기본 | 스타일·기초 후속 | `spacing` |
| Whitespace | 디자인 기본 | 스타일·기초 후속 | `whitespace` |
| Typography | 디자인 기본 | 스타일·기초 후속 | `typography` |
| Line Height / Letter Spacing | 디자인 기본 | 스타일·기초 후속 | `type-spacing` |
| Visual Hierarchy | 디자인 기본 | 스타일·기초 후속 | `visual-hierarchy` |
| Contrast | 디자인 기본 | 스타일·기초 후속 | `contrast` |
| Alignment | 디자인 기본 | 스타일·기초 후속 | `alignment` |
| CTA (Call to Action) | 디자인 기본 | 스타일·기초 후속 | `call-to-action` |
| Viewport (vh / vw) | 디자인 기본 | 스타일·기초 후속 | `viewport-units` |
| Breakpoint | 디자인 기본 | 스타일·기초 후속 | `breakpoints` |
| Flexbox / CSS Grid | 디자인 기본 | 스타일·기초 후속 | `flex-grid` |
| Z-index / Layer | 디자인 기본 | 스타일·기초 후속 | `stacking` |
| Aspect Ratio | 디자인 기본 | 스타일·기초 후속 | `aspect-ratio` |
| Favicon | 디자인 기본 | 스타일·기초 후속 | `favicon` |
| OG Image (Open Graph) | 디자인 기본 | 스타일·기초 후속 | `open-graph` |
| Design System / Tokens | 디자인 기본 | 스타일·기초 후속 | `design-tokens` |
| Spacing Scale (8pt Grid) | 디자인 기본 | 스타일·기초 후속 | `spacing-scale` |
| UI States | 디자인 기본 | 스타일·기초 후속 | `ui-states` |
| Truncate / Line Clamp | 디자인 기본 | 스타일·기초 후속 | `text-truncation` |
| Touch Target Size | 디자인 기본 | 스타일·기초 후속 | `target-size` |
| Safe Area | 디자인 기본 | 스타일·기초 후속 | `safe-area` |
| Accessibility (a11y) | 디자인 기본 | 스타일·기초 후속 | `accessibility` |
| Wireframe → Mockup → Prototype | 디자인 기본 | 스타일·기초 후속 | `design-deliverables` |
| Microcopy | 디자인 기본 | 스타일·기초 후속 | `microcopy` |
| Overlay / Backdrop | 디자인 기본 | 스타일·기초 후속 | `overlay-backdrop` |
| Position (fixed / sticky / absolute) | 디자인 기본 | 스타일·기초 후속 | `positioning` |
| Overflow | 디자인 기본 | 스타일·기초 후속 | `overflow` |
| Units (px / rem / % / vh) | 디자인 기본 | 스타일·기초 후속 | `css-units` |
| Semantic Colors | 디자인 기본 | 스타일·기초 후속 | `semantic-colors` |
| Font Weight | 디자인 기본 | 스타일·기초 후속 | `font-weight` |
| Size Variants (sm / md / lg) | 디자인 기본 | 스타일·기초 후속 | `size-variants` |
| Mobile First | 디자인 기본 | 스타일·기초 후속 | `mobile-first` |
| Color Code (HEX / RGB) | 디자인 기본 | 스타일·기초 후속 | `color-formats` |
| Layout Shift | 디자인 기본 | 스타일·기초 후속 | `layout-shift` |
| Word Break (keep-all) | 디자인 기본 | 스타일·기초 후속 | `word-break` |

## 이번 수정 검증

- 알림함 필터와 모두 읽음 버튼을 같은 y=248.1953125, 높이 40px로 정렬했다.
- 정렬 UI의 분류 선택과 내 담당만 체크박스도 y=111.8984375, 높이 40px로 맞췄다. 필드 라벨 아래의 기존 margin-bottom 12px이 기준선을 밀어내던 원인을 제거했다.
- 네이티브 셀렉트가 남은 17개 UI의 21개 필드를 공통 선택창으로 교체했다. React/HTML 총 34개 경로, 42개 필드에서 키보드 End→Enter 선택 후 표시 문구와 실제 값 일치·닫힘을 확인했다. 표 유형 변경으로 사라지는 보조 선택창은 보조 필드부터 검사했다.
- React뿐 아니라 HTML에서 실행 시 생성하는 동의 예제 셀렉트도 같은 방식으로 처리했다. 초기 마크업에 select가 없는 경우도 생성 스크립트에서 감지한다.
- 목록 정렬, 모달 상태, 관리자 체험 미리보기의 형식 선택에도 공통 선택창을 사용한다. 기존 직접 제작된 Select·Combobox·복수 선택 UI는 각자의 동작 모델을 유지한다.
- 팝업은 알림함의 바깥 클릭 판정과 충돌하지 않도록 해당 Scene 안에 두고, 모달 바깥 선택창은 native dialog 안에 띄운다. iframe/패널 경계에서 잘리지 않도록 고정 좌표와 위/아래 배치를 계산한다.
- 390px 모바일 알림함의 팝업은 iframe 너비 333px 안에서 x=52~202, y=278.3984375~361.3984375로 표시됐다. 실제 iOS/Android 기기는 별도로 검증하지 않았다.
- 정렬 조건 칩 해제 후 분류 선택창으로 초점이 돌아오는 것을 확인했다. 기존 select 참조와 폼 값은 보존한다.
- 테스트 88개 통과. 모든 UI의 독립 React 부분/전체 예제 타입 검사가 포함된다. 프로덕션 빌드 통과.
- [34개 경로·42개 필드 검수](qa/catalog-consistency/select-matrix.json), [알림함 정렬](qa/catalog-consistency/notification-aligned.png), [정렬 필드/체크박스](qa/catalog-consistency/sorting-aligned.png), [모바일 선택창](qa/catalog-consistency/notification-mobile-select.png).

- [현재 DB 항목](qa/catalog-consistency/inventory.json)
- [실제 참고 사이트 항목](qa/catalog-consistency/reference-inventory.json)
- [기계 판독용 대조 결과](qa/catalog-consistency/comparison-status.json)

이번 점검은 콘텐츠 DB를 변경하거나 초안을 게시하지 않는다.

실제 화면 → Turso 조회 → 초안/공개 구분 → 목록·상세 체험을 함께 확인했다. 코드 수정으로 서버 원고·명칭·게시 상태를 덮어쓰지 않는다.
