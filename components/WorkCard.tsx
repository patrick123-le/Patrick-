import Link from "next/link";
import type { Work } from "@/lib/types";

export function WorkCard({ work, compact = false }: { work: Work; compact?: boolean }) {
  return (
    <article className={`work-card${compact ? " work-card-compact" : ""}`}>
      <strong className="work-number">第 {work.number} 题</strong>
      <div className="card-meta">
        <span className="category-chip">{work.category}</span>
        {work.difficulty ? <span>难度 {work.difficulty}/10</span> : <span>综合练习</span>}
      </div>
      <h3><Link href={`/works/${work.slug}`}>{work.title}</Link></h3>
      {!compact && <p>{work.summary}</p>}
      <div className="tag-list" aria-label="标签">
        {work.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}
      </div>
      <div className="card-bottom">
        <span className="source-flags">
          {work.xiaohongshuUrl && <span title="包含小红书原文">原文</span>}
          {work.quickNoteUrl && <span title="包含速记图文">速记图</span>}
        </span>
        <Link className="text-link" href={`/works/${work.slug}`}>开始思考 <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
