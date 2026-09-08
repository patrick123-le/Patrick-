"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WorkCard } from "./WorkCard";
import { RecallToggle } from "./RecallToggle";
import type { Work } from "@/lib/types";

type SortKey = "number" | "updated" | "difficulty";

export function WorksExplorer({ works, initialQuery = "", initialCategory = "全部", initialTag = "", initialSort = "number" }: { works: Work[]; initialQuery?: string; initialCategory?: string; initialTag?: string; initialSort?: SortKey }) {
  const categories = ["全部", ...Array.from(new Set(works.map((work) => work.category)))];
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [tag, setTag] = useState(initialTag);
  const [sort, setSort] = useState<SortKey>(initialSort);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "全部") params.set("category", category);
    if (tag) params.set("tag", tag);
    if (sort !== "number") params.set("sort", sort);
    const next = params.size ? `${window.location.pathname}?${params}` : window.location.pathname;
    window.history.replaceState({}, "", next);
  }, [query, category, tag, sort]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return works
      .filter((work) => category === "全部" || work.category === category)
      .filter((work) => !tag || work.tags.includes(tag))
      .filter((work) => !needle || `${work.title} ${work.summary} ${work.tags.join(" ")}`.toLowerCase().includes(needle))
      .sort((a, b) => sort === "difficulty" ? (b.difficulty || 0) - (a.difficulty || 0) : sort === "updated" ? b.updatedAt.localeCompare(a.updatedAt) : a.number - b.number);
  }, [works, query, category, tag, sort]);

  const activeTags = Array.from(new Set(works.filter((work) => category === "全部" || work.category === category).flatMap((work) => work.tags))).slice(0, 14);
  const hasFilters = Boolean(query || tag || category !== "全部" || sort !== "number");
  const clear = () => { setQuery(""); setCategory("全部"); setTag(""); setSort("number"); };

  return (
    <>
      <section className="library-tools" aria-label="题库搜索和筛选">
        <div className="search-row">
          <label className="search-field">
            <span className="sr-only">搜索题目</span>
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索题目、法条或关键词" />
          </label>
          <label className="sort-field">
            <span>排序</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
              <option value="number">内容顺序</option>
              <option value="difficulty">难度从高到低</option>
              <option value="updated">最近更新</option>
            </select>
          </label>
          <RecallToggle />
        </div>
        <div className="filter-row" aria-label="分类筛选">
          {categories.map((item) => <button key={item} className={category === item ? "active" : ""} type="button" onClick={() => { setCategory(item); setTag(""); }}>{item}</button>)}
        </div>
        <div className="tag-filter" aria-label="标签筛选">
          <span>热门标签</span>
          {activeTags.map((item) => <button key={item} className={tag === item ? "active" : ""} type="button" onClick={() => setTag(tag === item ? "" : item)}>#{item}</button>)}
        </div>
      </section>

      <aside className="library-resource-card">
        <div><p className="section-kicker">题库外补充</p><h2>法务实务专业词表</h2><p>集中查阅材料中的法律基础、数据与AI治理、业务合规、投融资、争议解决及技术工具概念。</p></div>
        <Link className="button button-primary" href="/resources/legal-glossary">打开专业词表 →</Link>
      </aside>

      <div className="results-line"><p>找到 <strong>{filtered.length}</strong> 道题</p>{hasFilters && <button type="button" onClick={clear}>清除全部筛选</button>}</div>
      {filtered.length ? (
        <section className="work-grid" aria-label="题目列表">{filtered.map((work) => <WorkCard key={work.id} work={work} />)}</section>
      ) : (
        <section className="empty-state"><span aria-hidden="true">⌕</span><h2>没有找到匹配题目</h2><p>换个关键词或清除筛选后再试试。</p><button className="button button-primary" type="button" onClick={clear}>清除筛选</button></section>
      )}
    </>
  );
}
