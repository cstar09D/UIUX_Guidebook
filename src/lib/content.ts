import { scenarioIds } from "../demos/scenario-contract.mjs";
import { guides, seeds, type DemoId, type Term } from "./catalog";
import { pointerOnlyEffects } from "./effect-seeds";
import {
  detailedGuides,
  roleNames,
  type DetailedGuide,
  type GuidePoint,
  type ScreenExample,
} from "./guide-content";

export type Content = Term & {
  guide: DetailedGuide;
  tags: string[];
  sourceUrl: string;
  devices: { platforms: ("PC" | "모바일")[]; inputs: string[] };
};
export type ManagedTerm = Content & {
  status: "draft" | "published";
  updatedAt: string;
  publishedAt: string | null;
  publishedRevision: number | null;
  hasUnpublishedChanges: boolean;
};
export type Taxonomy = {
  revision: number;
  categories: string[];
  tags: string[];
};
export type ContentVersion = {
  id: number;
  termId: string;
  revision: number;
  action: string;
  createdAt: string;
  document: Content;
};
export type Checkpoint = { id: string; createdAt: string; reason: string };
export type AdminState = {
  terms: ManagedTerm[];
  taxonomy: Taxonomy;
  checkpoints: Checkpoint[];
};
export type Backup = {
  format: "ui-notes-backup";
  version: 2;
  exportedAt: string;
  taxonomy: Taxonomy;
  terms: {
    document: Content;
    published: { document: Content; publishedAt: string } | null;
    updatedAt: string;
  }[];
  history: ContentVersion[];
};
export type ImportPreview = {
  token: string;
  mode: "merge" | "replace";
  added: string[];
  updated: string[];
  removed: string[];
  published: number;
  drafts: number;
  history: number;
  categories: number;
  tags: number;
  legacy: boolean;
};
export const actionLabels: Record<string, string> = {
  migration: "기존 콘텐츠 이전",
  catalog: "기본 콘텐츠 추가",
  "guide-update": "실무 가이드 개선",
  create: "새 초안",
  save: "초안 저장",
  publish: "게시",
  unpublish: "게시 취소",
  hide: "숨김",
  show: "노출",
  trash: "휴지통 이동",
  restore: "휴지통 복원",
  history: "이력 복원",
  order: "순서 변경",
  taxonomy: "분류 변경",
  import: "백업 가져오기",
};
export function normalizeLegacy(term: Term): Content {
  return {
    ...term,
    deleted: !!term.deleted,
    tags: [],
    guide: structuredClone(detailedGuides[term.demoId]),
    sourceUrl: guides[term.demoId].source,
    devices: pointerOnlyEffects.some((id) => id === term.demoId)
      ? {
          platforms: ["PC"],
          inputs: ["마우스", "키보드(대체 체험)"],
        }
      : {
          platforms: ["PC", "모바일"],
          inputs: ["마우스", "키보드", "터치"],
        },
  };
}
export function blankGuide(): DetailedGuide {
  return {
    introduction: "",
    uses: [],
    flow: [],
    examples: [],
    pitfalls: [],
    alternatives: [],
    practice: "",
    roles: {
      기획: { goal: "", tasks: [], handoff: "", checks: [] },
      디자인: { goal: "", tasks: [], handoff: "", checks: [] },
      프론트엔드: { goal: "", tasks: [], handoff: "", checks: [] },
      개발: { goal: "", tasks: [], handoff: "", checks: [] },
    },
  };
}
export function newContent(
  category: string,
  demoId: DemoId = "modal",
): Content {
  return {
    ...seeds[0],
    id: "",
    demoId,
    english: "",
    pronunciation: "",
    korean: "",
    summary: "",
    category,
    aliases: [],
    keywords: [],
    tags: [],
    guide: blankGuide(),
    sourceUrl: "",
    devices: {
      platforms: ["PC", "모바일"],
      inputs: ["마우스", "키보드", "터치"],
    },
    hidden: false,
    deleted: false,
    order: 0,
    revision: 0,
  };
}
export function publicationIssues(value: Content): string[] {
  const issues: string[] = [];
  for (const [key, label] of [
    ["english", "영문 이름"],
    ["pronunciation", "한국어 발음"],
    ["korean", "한국어 표현"],
    ["summary", "간단한 설명"],
  ] as const)
    if (!value[key].trim()) issues.push(label);
  const g = value.guide;
  const requiredStates = scenarioIds[value.demoId];
  if (
    requiredStates &&
    (g.examples.some((e) => !requiredStates.includes(e.id)) ||
      requiredStates.some((key) => !g.examples.some((e) => e.id === key)))
  )
    issues.push("등록된 실제 시뮬레이션 상태");
  if (!g.introduction.trim()) issues.push("UI 정의");
  for (const [key, label] of [
    ["uses", "사용 상황"],
    ["flow", "사용 흐름"],
    ["pitfalls", "주의점"],
    ["alternatives", "화면별 대안"],
  ] as const)
    if (!g[key].length || g[key].some((p) => !p.title.trim() || !p.body.trim()))
      issues.push(label);
  if (
    !g.examples.length ||
    g.examples.some(
      (e) =>
        ![
          e.label,
          e.title,
          e.condition,
          e.explanation,
          e.screen.title,
          e.screen.body,
        ].every((v) => v.trim()),
    )
  )
    issues.push("시뮬레이션 상태");
  if (!g.practice.trim()) issues.push("체험 방법");
  for (const role of roleNames) {
    const r = g.roles[role];
    if (
      !r.goal.trim() ||
      !r.tasks.length ||
      r.tasks.some((p) => !p.title.trim() || !p.body.trim()) ||
      !r.handoff.trim() ||
      !r.checks.some((c) => c.trim())
    )
      issues.push(`${role} 안내`);
  }
  if (!value.sourceUrl) issues.push("공식 출처");
  if (
    !value.devices.platforms.length ||
    !value.devices.inputs.some((input) => input.trim())
  )
    issues.push("지원 환경");
  return issues;
}

export class ContentError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
function obj(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new ContentError(`${path}: 객체 형식이 필요합니다.`);
  return value as Record<string, unknown>;
}
function text(value: unknown, path: string, max = 12000): string {
  if (typeof value !== "string" || value.length > max)
    throw new ContentError(`${path}: ${max}자 이내의 문자를 입력하세요.`);
  return value.trim();
}
function array(value: unknown, path: string, max = 80): unknown[] {
  if (!Array.isArray(value) || value.length > max)
    throw new ContentError(`${path}: 항목 수를 확인하세요.`);
  return value;
}
function texts(
  value: unknown,
  path: string,
  max = 80,
  itemMax = 200,
): string[] {
  return array(value, path, max).map((v, i) =>
    text(v, `${path}[${i}]`, itemMax),
  );
}
function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
function integer(value: unknown, path: string, min = 0): number {
  if (!Number.isSafeInteger(value) || Number(value) < min)
    throw new ContentError(`${path}: 올바른 정수가 필요합니다.`);
  return Number(value);
}
function points(value: unknown, path: string): GuidePoint[] {
  return array(value, path, 30).map((v, i) => {
    const p = obj(v, `${path}[${i}]`);
    if (
      p.targetDemoId !== undefined &&
      !Object.hasOwn(guides, String(p.targetDemoId))
    )
      throw new ContentError("대안 UI의 등록 id를 확인하세요.");
    return {
      ...(p.targetDemoId !== undefined
        ? { targetDemoId: p.targetDemoId as DemoId }
        : {}),
      title: text(p.title, `${path} 제목`, 200),
      body: text(p.body, `${path} 설명`),
    };
  });
}
export function validateGuide(value: unknown): DetailedGuide {
  const g = obj(value, "가이드"),
    roles = obj(g.roles, "직무별 안내");
  const examples: ScreenExample[] = array(
    g.examples,
    "시뮬레이션 상태",
    30,
  ).map((v, i) => {
    const e = obj(v, `시뮬레이션 상태 ${i + 1}`),
      s = obj(e.screen, "예시 화면");
    const tone = s.tone;
    if (
      tone !== undefined &&
      !["error", "success", "loading"].includes(String(tone))
    )
      throw new ContentError("예시 화면의 상태를 확인하세요.");
    const id = text(e.id, "시뮬레이션 상태 id", 80);
    if (!/^[a-zA-Z0-9_-]+$/.test(id))
      throw new ContentError(
        "시뮬레이션 상태 id는 영문·숫자·하이픈으로 입력하세요.",
      );
    return {
      id,
      label: text(e.label, "예시 이름", 100),
      title: text(e.title, "예시 제목", 200),
      condition: text(e.condition, "발생 조건"),
      explanation: text(e.explanation, "처리 방법"),
      screen: {
        title: text(s.title, "화면 제목", 200),
        body: text(s.body, "화면 문구", 2000),
        ...(s.action !== undefined
          ? { action: text(s.action, "행동 문구", 100) }
          : {}),
        ...(s.items !== undefined
          ? { items: texts(s.items, "화면 항목", 30, 1000).filter(Boolean) }
          : {}),
        ...(tone ? { tone: tone as ScreenExample["screen"]["tone"] } : {}),
      },
    };
  });
  if (new Set(examples.map((e) => e.id)).size !== examples.length)
    throw new ContentError("시뮬레이션 상태 id가 중복됩니다.");
  return {
    introduction: text(g.introduction, "UI 정의"),
    uses: points(g.uses, "사용 상황"),
    flow: points(g.flow, "사용 흐름"),
    examples,
    pitfalls: points(g.pitfalls, "주의점"),
    alternatives: points(g.alternatives, "대안"),
    practice: text(g.practice, "체험 방법"),
    roles: Object.fromEntries(
      roleNames.map((role) => {
        const r = obj(roles[role], `${role} 안내`);
        return [
          role,
          {
            goal: text(r.goal, `${role} 목표`, 2000),
            tasks: points(r.tasks, `${role} 작업`),
            handoff: text(r.handoff, `${role} 전달 예시`),
            checks: texts(r.checks, `${role} 검토 질문`, 30, 2000).filter(
              Boolean,
            ),
          },
        ];
      }),
    ) as DetailedGuide["roles"],
  };
}
export function validateTaxonomy(value: unknown): Taxonomy {
  const t = obj(value, "분류");
  const categories = unique(texts(t.categories, "카테고리", 100, 80)),
    tags = unique(texts(t.tags, "태그", 300, 80));
  if (!categories.length || categories.includes("전체"))
    throw new ContentError(
      "카테고리는 1개 이상 필요하며 “전체”는 사용할 수 없습니다.",
    );
  return { revision: integer(t.revision, "분류 버전", 1), categories, tags };
}
export function validateContent(value: unknown, taxonomy: Taxonomy): Content {
  const v = obj(value, "콘텐츠");
  const demoId = text(v.demoId, "시뮬레이션 id", 100) as DemoId;
  if (!Object.hasOwn(guides, demoId))
    throw new ContentError(`등록되지 않은 시뮬레이션: ${demoId}`);
  const category = text(v.category, "카테고리", 80);
  if (!taxonomy.categories.includes(category))
    throw new ContentError("존재하는 카테고리를 선택하세요.");
  const tags = unique(texts(v.tags, "태그", 40, 80));
  if (tags.some((t) => !taxonomy.tags.includes(t)))
    throw new ContentError("태그 관리에서 먼저 태그를 등록해 주세요.");
  const sourceUrl = text(v.sourceUrl, "출처 URL", 2000);
  if (sourceUrl) {
    try {
      if (!["http:", "https:"].includes(new URL(sourceUrl).protocol))
        throw Error();
    } catch {
      throw new ContentError("출처는 http 또는 https URL을 입력하세요.");
    }
  }
  const d = obj(v.devices, "지원 환경");
  const platforms = unique(texts(d.platforms, "지원 기기", 2, 20));
  if (platforms.some((p) => !["PC", "모바일"].includes(p)))
    throw new ContentError("지원 기기를 확인하세요.");
  if (typeof v.hidden !== "boolean" || typeof v.deleted !== "boolean")
    throw new ContentError("숨김·휴지통 상태를 확인하세요.");
  const id = text(v.id, "id", 100);
  if (id && !/^[a-zA-Z0-9_-]+$/.test(id))
    throw new ContentError("올바르지 않은 콘텐츠 id입니다.");
  const english = text(v.english, "영문 이름", 150);
  if (!english) throw new ContentError("영문 이름을 입력하세요.");
  return {
    id,
    demoId,
    category,
    english,
    pronunciation: text(v.pronunciation, "발음", 150),
    korean: text(v.korean, "한국어 표현", 150),
    summary: text(v.summary, "간단한 설명", 1000),
    aliases: unique(texts(v.aliases, "별칭", 40, 80)),
    keywords: unique(texts(v.keywords, "검색어", 80, 200)),
    tags,
    sourceUrl,
    guide: validateGuide(v.guide),
    devices: {
      platforms: platforms as Content["devices"]["platforms"],
      inputs: unique(texts(d.inputs, "입력 방식", 10, 80)),
    },
    hidden: v.hidden,
    deleted: v.deleted,
    order: integer(v.order, "순서"),
    revision: integer(v.revision, "콘텐츠 버전"),
  };
}
