"use client";
import MotionPreview from "./MotionPreview";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Monitor,
  Smartphone,
} from "lucide-react";
import type { Content } from "@/lib/content";
import {
  type DetailedGuide,
  type GuidePoint,
  type RoleName,
} from "@/lib/guide-content";

function Points({
  items,
  ordered = false,
  terms = [],
  onNavigate,
}: {
  items: GuidePoint[];
  ordered?: boolean;
  terms?: Content[];
  onNavigate?: (term: Content) => void;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`guide-points ${ordered ? "ordered" : ""}`}>
      {items.map((item, index) => (
        <li key={index}>
          <strong>{item.title}</strong>
          <p>{item.body}</p>
          {item.targetDemoId &&
            (() => {
              const target =
                terms.find((t) => t.id === item.targetDemoId) ||
                terms.find((t) => t.demoId === item.targetDemoId);
              return target ? (
                <a
                  className="alternative-link"
                  href={`?term=${encodeURIComponent(target.id)}`}
                  onClick={(e) => {
                    if (
                      !onNavigate ||
                      e.button !== 0 ||
                      e.metaKey ||
                      e.ctrlKey ||
                      e.shiftKey ||
                      e.altKey
                    )
                      return;
                    e.preventDefault();
                    onNavigate(target);
                  }}
                >
                  <MotionPreview key={target.demoId} id={target.demoId} />
                  <span className="alternative-card-caption">
                    <strong>{target.english}</strong>
                    <span className="alternative-card-action">
                      바로가기 <ArrowRight size={14} aria-hidden="true" />
                    </span>
                    <span>{target.korean}</span>
                  </span>
                </a>
              ) : (
                <span className="alternative-unavailable">
                  현재 공개된 대안 상세가 없습니다.
                </span>
              );
            })()}
        </li>
      ))}
    </Tag>
  );
}
export function GuideContent({
  content,
  terms = [],
  onNavigate,
}: {
  content: Content;
  terms?: Content[];
  onNavigate?: (term: Content) => void;
}) {
  const { guide } = content;
  return (
    <div className="detailed-guide">
      <h3>어떤 UI인가요?</h3>
      <p>{guide.introduction}</p>
      <h3>이럴 때 사용해요</h3>
      <Points items={guide.uses} />
      <h3>이럴 땐 다른 UI를 추천해요</h3>
      <Points
        items={guide.alternatives}
        terms={terms}
        onNavigate={onNavigate}
      />

      <h3>사용 흐름과 처리 방법</h3>
      <Points items={guide.flow} ordered />
      <div className="practice-note">
        <BookOpen size={18} />
        <div>
          <strong>직접 확인해 보세요</strong>
          <p>{guide.practice}</p>
        </div>
      </div>
      <h3>실수하기 쉬운 부분</h3>
      <Points items={guide.pitfalls} />
      <div className="detail-device">
        {content.devices.platforms.includes("PC") && <Monitor size={15} />}{" "}
        {content.devices.platforms.includes("모바일") && (
          <Smartphone size={14} />
        )}
        <strong>{content.devices.platforms.join(" · ")}</strong>
        <span>{content.devices.inputs.join(" · ")}</span>
      </div>
      {content.sourceUrl && (
        <a
          className="source-link"
          href={content.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          공식 문서 확인
          <ExternalLink size={13} />
        </a>
      )}
    </div>
  );
}
export function RoleContent({
  guide: details,
  role,
}: {
  guide: DetailedGuide;
  role: RoleName;
}) {
  const guide = details.roles[role];
  return (
    <div className="role-detail">
      <div className="role-goal">
        <span>{role}의 목표</span>
        <h4>{guide.goal}</h4>
      </div>
      <h3>구체적으로 해야 할 일</h3>
      <Points items={guide.tasks} ordered />
      <div className="handoff-note">
        <strong>정책·협업 전달 예시</strong>
        <p>{guide.handoff}</p>
      </div>
      <h3>완료 전 확인하세요</h3>
      <ul className="role-checks">
        {guide.checks.map((check, index) => (
          <li key={index}>
            <CheckCircle2 size={16} />
            <span>{check}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
