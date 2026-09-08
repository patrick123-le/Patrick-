import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import { lastDayIntroduction, lastDaySections } from "@/content/last-day";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ResumeTree } from "@/components/ResumeTree";
import { siteAssetPath } from "@/lib/site-path";

export const metadata: Metadata = {
  title: "关于 Patrick｜Patrick的实务学习手册",
  description: "Patrick 的教育、法务实习、学习分享与个人文字。",
  alternates: { canonical: "/about" },
};

const principles = [
  { number: "01", title: "多元视角", body: "律所、企业法务、海外业务、隐私合规与合同商务，让同一个问题拥有不止一种解法。", label: "Practice" },
  { number: "02", title: "实践复盘", body: "不制造标准答案，只整理真实做过的事、踩过的坑，以及仍在验证的方法。", label: "Review", featured: true },
  { number: "03", title: "持续输出", body: "把检索、阅读和工作思考沉淀成可以反复查阅、共同修订的实务学习手册。", label: "Share" },
];

export default function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const personJsonLd = { "@context": "https://schema.org", "@type": "Person", name: profile.name, url: `${siteUrl}/about`, email: profile.email, jobTitle: profile.role, knowsAbout: profile.focus };

  return (
    <>
      <SiteHeader />
      <main className="page-main about-page-redesign">
        <section className="about-editorial-hero">
          <div className="about-editorial-copy">
            <p className="about-overline"><span aria-hidden="true" />Patrick · About</p>
            <h1>经历不必雷同，<br /><em>方法值得共享。</em></h1>
            <p className="about-lede">{profile.intro}</p>
            <div className="about-contact-row">
              <a className="button about-button-light" href={`mailto:${profile.email}`}>商务邮箱联系</a>
              <a className="about-inline-link" href={profile.xiaohongshu} target="_blank" rel="noreferrer">小红书主页 <span aria-hidden="true">↗</span></a>
            </div>
            <a className="about-email" href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
          <figure className="about-hero-photo">
            <Image src={siteAssetPath("/about/patrick-mountain.jpg")} width="1706" height="1279" alt="Patrick 在雪山前的照片" priority />
            <figcaption><span>BEIJING · CHINA</span><strong>{profile.role}</strong></figcaption>
          </figure>
          <div className="about-hero-footer" aria-label="个人关注方向">
            <span>FOCUS</span>
            {profile.focus.map((item) => <strong key={item}>{item}</strong>)}
          </div>
        </section>

        <section className="about-principles" aria-labelledby="principles-title">
          <header className="about-section-intro">
            <p>WHY THIS SITE</p>
            <h2 id="principles-title">期待知识库可以实现的目的</h2>
            <span>这里的内容来自实践、学习和复盘。它们未必完美，但希望足够坦诚，也足够有用。</span>
          </header>
          <div className="principle-grid">
            {principles.map((item) => (
              <article className={`principle-card${item.featured ? " is-featured" : ""}`} key={item.number}>
                <div><span>{item.number}</span><small>{item.label}</small></div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <strong aria-hidden="true">≈</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="resume-showcase" aria-labelledby="resume-title">
          <header className="resume-showcase-heading">
            <div><p>EXPERIENCE MAP · 2023—NOW</p><h2 id="resume-title">履历树，一些过往<br />工作的总结</h2></div>
            <p>不完全的经历总结，主要列举了研究生阶段待过的部分岗位。很感谢过去每段实习遇到的带教和朋友，他们教会我很多学校里接触不到的实务视角。</p>
          </header>
          <ResumeTree />
        </section>

        <section className="essay-feature" aria-labelledby="last-day-title">
          <p className="essay-feature-intro">{lastDayIntroduction}</p>
          <div className="essay-feature-copy">
            <p>PERSONAL NOTE · 2026</p>
            <h2 id="last-day-title">Last Day</h2>
            <h3>一个法学生的疯言疯语</h3>
            <p>以下内容写于我今年结束字节实习之时，是当时留下的一篇 Last Day 记录。</p>
          </div>
          <figure className="essay-feature-image">
            <Image src={siteAssetPath("/about/last-day-ferris-wheel.jpg")} width="3000" height="1708" alt="《Last Day》原文中的蓝天摩天轮照片" />
            <figcaption>把离开写成一次新的出发</figcaption>
          </figure>
        </section>

        <section className="essay-reading" aria-label="Last Day 原文节选">
          <aside className="essay-index">
            <p>CONTENTS</p>
            <h2>关于工作、选择、自由和创造力。</h2>
            <nav aria-label="文章目录">
              {lastDaySections.map((section) => <a href={`#last-day-${section.number}`} key={section.number}><span>{section.number}</span>{section.title}</a>)}
            </nav>
            <div className="essay-source-note"><span aria-hidden="true">✦</span><p>整理自原始文档，保留原有叙述语气，仅对网页排版、明显错字与个人隐私作必要处理。</p></div>
          </aside>

          <div className="essay-reader">
            {lastDaySections.map((section, index) => (
              <article className="essay-chapter" id={`last-day-${section.number}`} key={section.number}>
                <header><span>{section.number}</span><div><small>{section.kicker}</small><h3>{section.title}</h3></div></header>
                <div className="essay-chapter-copy">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                <blockquote>{section.highlight}</blockquote>
                {index === 0 && <figure className="essay-memory-image"><Image src={siteAssetPath("/about/last-day-law-stall.png")} width="600" height="575" alt="《Last Day》原文中的法律主题趣味摊位照片" /><figcaption>理想与现实之间，也可以留一点幽默。</figcaption></figure>}
              </article>
            ))}
            <div className="essay-closing"><span aria-hidden="true">≈</span><p>自由不是没有方向，创造力也不只属于某一种职业。它们更像一条始终在场的线，把每一次选择连接起来。</p></div>
          </div>
        </section>

        <section className="about-contact-cta">
          <div><p>STAY CURIOUS</p><h2>一起交流实务，<br />也交换一点不确定。</h2><span>欢迎分享建议、纠错和你正在准备的问题。</span></div>
          <Link className="about-cta-arrow" href="/guestbook" aria-label="前往反馈与联系页"><span>反馈联系</span><strong aria-hidden="true">↗</strong></Link>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }} />
      </main>
      <SiteFooter />
    </>
  );
}
