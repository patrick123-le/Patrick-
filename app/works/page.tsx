import type { Metadata } from "next";
import { works } from "@/lib/works";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WorksExplorer } from "@/components/WorksExplorer";

export const metadata: Metadata = {
  title: "法务题库｜Patrick的实务学习手册",
  description: "浏览 54 道合同、数据合规、知识产权、争议解决等法务面试与实务练习题。",
  alternates: { canonical: "/works" },
};

export default async function WorksPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const value = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  const requestedSort = value("sort");
  const initialSort = requestedSort === "updated" || requestedSort === "difficulty" ? requestedSort : "number";
  return (
    <>
      <SiteHeader />
      <main className="page-main library-page">
        <section className="page-hero compact-hero"><p className="eyebrow"><span aria-hidden="true">●</span> 法务题库</p><h1>先思考，<br /><em>再看答案。</em></h1><p>54 道来自真实准备过程的实务题。按方向筛选，用回想模式练习，把“看懂了”变成“说得出”。</p></section>
        <WorksExplorer works={works} initialQuery={value("q")} initialCategory={value("category") || "全部"} initialTag={value("tag")} initialSort={initialSort} />
      </main>
      <SiteFooter />
    </>
  );
}
