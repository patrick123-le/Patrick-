import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span className="brand-mark">P</span><p className="section-kicker">404</p><h1>这一页还没有整理进手册。</h1><p>回到题库继续练习，或者换个关键词找找。</p><div className="hero-actions"><Link className="button button-primary" href="/works">回到题库</Link><Link className="button button-secondary" href="/">返回首页</Link></div></main>;
}
