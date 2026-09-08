import Link from "next/link";
import { profile } from "@/content/profile";

export function SiteHeader() {
  return (
    <header className="site-header-wrap">
      <div className="site-header">
        <Link className="brand" href="/" aria-label={`${profile.siteName}首页`}>
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>{profile.siteName}</span>
        </Link>
        <nav className="desktop-nav" aria-label="主导航">
          <Link href="/#guide">使用指南</Link>
          <Link href="/works">法务题库</Link>
          <Link href="/about">关于我</Link>
          <Link href="/guestbook">反馈联系</Link>
        </nav>
        <div className="header-actions">
          <a className="header-cta" href={profile.xiaohongshu} target="_blank" rel="noreferrer">
            小红书主页 <span aria-hidden="true">↗</span>
          </a>
          <details className="mobile-menu">
            <summary aria-label="打开导航菜单">菜单</summary>
            <nav aria-label="移动端导航">
              <Link href="/">首页</Link>
              <Link href="/#guide">使用指南</Link>
              <Link href="/works">法务题库</Link>
              <Link href="/about">关于我</Link>
              <Link href="/guestbook">反馈联系</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
