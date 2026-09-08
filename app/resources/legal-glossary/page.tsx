import type { Metadata } from "next";
import Link from "next/link";
import glossary from "@/content/legal-glossary.json";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "法务实务专业词表｜Patrick的实务学习手册",
  description: "法律基础、数据与AI治理、业务合规、投融资、争议解决与技术工具常用概念速查。",
  alternates: { canonical: "/resources/legal-glossary" },
};

export default function LegalGlossaryPage() {
  const itemCount = glossary.sections.reduce((total, section) => total + section.items.length, 0);
  return (
    <>
      <SiteHeader />
      <main className="page-main glossary-page">
        <nav className="breadcrumbs" aria-label="面包屑"><Link href="/">首页</Link><span>/</span><Link href="/works">法务题库</Link><span>/</span><span>专业词表</span></nav>
        <header className="glossary-hero">
          <p className="eyebrow"><span aria-hidden="true">●</span> 题库外补充</p>
          <h1>{glossary.title}</h1>
          <p>{glossary.description}</p>
          <div className="glossary-stat"><strong>{glossary.sections.length}</strong> 个专题 · <strong>{itemCount}</strong> 个词条</div>
        </header>
        <div className="glossary-grid">
          {glossary.sections.map((section, index) => (
            <section className="glossary-section" key={section.title}>
              <div className="glossary-section-heading"><span>{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2></div>
              <dl>{section.items.map((item) => <div key={item.term}><dt>{item.term}</dt><dd>{item.definition}</dd></div>)}</dl>
            </section>
          ))}
        </div>
        <div className="glossary-back"><Link className="button button-secondary" href="/works">← 返回法务题库</Link></div>
      </main>
      <SiteFooter />
    </>
  );
}
