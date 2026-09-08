"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RecallToggle } from "./RecallToggle";
import { RichText } from "./RichText";
import type { Work } from "@/lib/types";

export function WorkDetail({ work, previous, next }: { work: Work; previous?: Work; next?: Work }) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sync = (event: Event) => {
      if ((event as CustomEvent<boolean>).detail) { setShowAnalysis(false); setShowAnswer(false); }
    };
    window.addEventListener("recall-mode-change", sync);
    return () => window.removeEventListener("recall-mode-change", sync);
  }, []);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function reset() {
    setShowAnalysis(false);
    setShowAnswer(false);
    document.querySelector(".question-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <div className="detail-toolbar"><RecallToggle /><button className="copy-button" type="button" onClick={copyLink}>{copied ? "链接已复制" : "复制本题链接"}</button></div>
      <article className="question-panel">
        <strong className="detail-question-number">第 {work.number} 题</strong>
        <div className="detail-meta"><span className="category-chip">{work.category}</span>{work.difficulty ? <span>难度 {work.difficulty}/10</span> : <span>综合练习</span>}{work.interviewRound && <span>{work.interviewRound}</span>}</div>
        <h1>{work.title}</h1>
        <div className="tag-list">{work.tags.map((tag) => <Link key={tag} href={`/works?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div>
      </article>

      <section className={`reveal-panel${showAnalysis ? " is-open" : ""}`}>
        <div><span className="step-number">01</span><div><p className="section-kicker">先找切口</p><h2>分析思路</h2></div></div>
        {showAnalysis ? <RichText content={work.analysis || "这道扩展题未单独提供分析思路，可先列出定义、规则、场景与风险四层结构。"} /> : <div className="concealed"><p>先用 2–3 分钟梳理规则依据、业务场景与风险控制路径。</p><button className="button button-primary" type="button" aria-expanded="false" onClick={() => setShowAnalysis(true)}>显示分析思路</button></div>}
      </section>

      <section className={`reveal-panel answer-panel${showAnswer ? " is-open" : ""}`}>
        <div><span className="step-number">02</span><div><p className="section-kicker">再校准表达</p><h2>参考答案</h2></div></div>
        {showAnswer ? <RichText content={work.answer} highlightTransitions /> : <div className="concealed"><p>完成自己的回答后再展开，对照结构而不是背诵句子。</p><button className="button button-primary" type="button" aria-expanded="false" onClick={() => setShowAnswer(true)}>显示参考答案</button></div>}
      </section>

      {work.mindMaps && work.mindMaps.length > 0 && (
        <section className="mindmap-panel" aria-labelledby="mindmap-title">
          <div className="mindmap-heading"><div><p className="section-kicker">图像复盘</p><h2 id="mindmap-title">思维导图</h2></div><p>点击图片可打开原图，查看完整结构与文字细节。</p></div>
          <div className="mindmap-grid">
            {work.mindMaps.map((mindMap, index) => (
              <figure className="mindmap-figure" key={mindMap.src}>
                <a href={mindMap.src} target="_blank" rel="noreferrer" aria-label={`打开第 ${index + 1} 张思维导图原图`}>
                  <Image src={mindMap.src} alt={mindMap.alt} width={mindMap.width} height={mindMap.height} sizes="(max-width: 900px) 100vw, 1080px" />
                </a>
                {work.mindMaps!.length > 1 && <figcaption>思维导图 {index + 1}</figcaption>}
              </figure>
            ))}
          </div>
          {work.mindMapCorrection && <aside className="correction-note"><strong>{work.mindMapCorrection.title}</strong><p>{work.mindMapCorrection.content}</p></aside>}
        </section>
      )}

      {(showAnalysis || showAnswer) && <button className="reset-answer" type="button" onClick={reset}>隐藏答案，重新思考 ↑</button>}
      {(work.pitfall || work.tips) && <section className="tips-grid">{work.pitfall && <div><p className="section-kicker">常见失分点</p><RichText content={work.pitfall} /></div>}{work.tips && <div><p className="section-kicker">加分与避坑</p><RichText content={work.tips} /></div>}</section>}

      {work.supplementalResources?.map((resource) => (
        <section className="study-resource-panel" key={resource.title}>
          <div><p className="section-kicker">补充学习</p><h2>{resource.title}</h2><p>{resource.description}</p></div>
          <div className="source-actions">{resource.url && <a className="button button-primary" href={resource.url} target="_blank" rel="noreferrer">查看图文批注 ↗</a>}{resource.sourceUrl && <a className="button button-secondary" href={resource.sourceUrl} target="_blank" rel="noreferrer">查看官方原文 ↗</a>}</div>
        </section>
      ))}

      <section className="source-panel"><div><p className="section-kicker">继续阅读</p><h2>从题目回到原始内容</h2><p>查看这道题在小红书上的完整记录，或打开速记图文快速复习。</p></div><div className="source-actions">{work.xiaohongshuUrl && <a className="button button-secondary" href={work.xiaohongshuUrl} target="_blank" rel="noreferrer">查看小红书原文 ↗</a>}{work.quickNoteUrl && <a className="button button-secondary" href={work.quickNoteUrl} target="_blank" rel="noreferrer">查看速记图文 ↗</a>}</div></section>
      <nav className="question-pagination" aria-label="题目翻页">{previous ? <Link href={`/works/${previous.slug}`}><small>上一题 · 第 {previous.number} 题</small><strong>{previous.title}</strong></Link> : <span />}{next && <Link href={`/works/${next.slug}`}><small>下一题 · 第 {next.number} 题</small><strong>{next.title}</strong></Link>}</nav>
    </>
  );
}
