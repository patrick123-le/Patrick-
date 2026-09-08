import Link from "next/link";
import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark" aria-hidden="true">P</span>
            <span>{profile.siteName}</span>
          </Link>
          <p>把实习、面试和阅读中的零散经验，整理成可以反复练习的路径。</p>
        </div>
        <div className="footer-links">
          <div><strong>内容</strong><Link href="/works">法务题库</Link><Link href="/about">关于 Patrick</Link></div>
          <div><strong>联系</strong><a href={`mailto:${profile.email}`}>邮件联系</a><a href={profile.xiaohongshu} target="_blank" rel="noreferrer">小红书主页 ↗</a></div>
          <div><strong>网站</strong><Link href="/guestbook">反馈联系</Link><Link href="/privacy">隐私说明</Link></div>
        </div>
      </div>
      <div className="legal-note">
        <p>本站内容仅用于个人经验分享、学习和交流，不构成针对具体事项的法律意见。法律规定、司法实践及企业要求可能发生变化，请结合最新有效规则及具体情况独立判断。</p>
        <span>© 2026 Patrick</span>
      </div>
    </footer>
  );
}
