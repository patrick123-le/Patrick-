import Link from "next/link";
import Image from "next/image";
import { profile } from "@/content/profile";
import { works } from "@/lib/works";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WorkCard } from "@/components/WorkCard";
const featured = works.filter((work) => work.featured).slice(0, 6);

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span aria-hidden="true">●</span> 写给正在准备法务面试的你</p>
            <h1>把法务面试经验，<br /><em>整理成真正能练习的知识库。</em></h1>
            <p className="hero-lede">从问题拆解到参考答案，用回想模式先独立思考，再带着线索复盘。这里也记录一名法学生走向实务的成长与见闻。</p>
            <div className="hero-actions"><Link className="button button-primary" href="/works">开始刷题 <span aria-hidden="true">→</span></Link><Link className="button button-secondary" href="/about">了解 Patrick</Link></div>
            <p className="hero-note">54 道实务题 · 8 个方向 · 持续更新</p>
          </div>
          <div className="hero-visual" aria-label="回想模式题目卡片示意">
            <div className="glow glow-one" /><div className="glow glow-two" />
            <article className="practice-card">
              <div className="practice-topline"><span className="mini-brand">P</span><span>今日一题</span><span className="difficulty">难度 7/10</span></div>
              <span className="category-chip">数据与隐私</span>
              <h2>某 APP 读取用户通讯录，法务应如何设计合规流程？</h2>
              <p>先别急着看答案。试着从告知、同意、最小必要和撤回机制四个角度组织回答。</p>
              <div className="answer-lock"><span aria-hidden="true">✦</span><div><strong>回想模式已开启</strong><small>答案将在你主动操作后显示</small></div><span className="round-arrow" aria-hidden="true">→</span></div>
            </article>
            <div className="float-tag tag-a">个人信息保护法</div><div className="float-tag tag-b">实务拆解</div>
          </div>
        </section>

        <section className="section-shell guide-section" id="guide">
          <div className="section-heading"><p className="section-kicker">如何使用</p><h2>不是读答案，<br />而是练习组织答案。</h2><p>每道题都按“题目—思路—答案”分层呈现。给自己几分钟，再打开下一层。</p></div>
          <div className="guide-grid">
            <article><span>01</span><div className="guide-icon" aria-hidden="true">⌕</div><h3>找到题目</h3><p>按关键词、方向和标签检索，把零散复习变成清晰路径。</p></article>
            <article><span>02</span><div className="guide-icon" aria-hidden="true">◐</div><h3>先自己回答</h3><p>开启回想模式，隐藏分析和答案，先说出自己的框架。</p></article>
            <article><span>03</span><div className="guide-icon" aria-hidden="true">✦</div><h3>再对照复盘</h3><p>逐层查看考察重点、思路和参考答案，补齐遗漏的判断。</p></article>
            <article className="guide-tutorial-card"><span>04</span><div className="guide-icon" aria-hidden="true">↗</div><h3><a href={profile.xiaohongshu} target="_blank" rel="noreferrer">查看详细教程</a></h3><p>如需详细版使用教程，请打开 Patrick 小红书主页，观看置顶 🔝 视频。</p><strong>打开置顶视频 ↗</strong></article>
          </div>
        </section>

        <section className="section-shell featured-section">
          <div className="section-heading inline-heading"><div><p className="section-kicker">精选练习</p><h2>从一道真实问题开始</h2></div><Link className="button button-secondary" href="/works">查看全部 54 道题 <span aria-hidden="true">→</span></Link></div>
          <div className="work-grid home-work-grid">{featured.map((work) => <WorkCard key={work.id} work={work} />)}</div>
        </section>

        <section className="about-preview">
          <div className="about-photo"><div className="photo-frame photo-frame-landscape"><Image src="/about/patrick-mountain.jpg" alt="Patrick 在雪山前的旅行照片" width="1706" height="1279" /></div><span className="photo-note">北京 · 法学硕士在读</span></div>
          <div className="about-copy"><p className="section-kicker">关于 Patrick</p><h2>{profile.tagline}</h2><p>{profile.intro}</p><div className="focus-list">{profile.focus.map((item) => <span key={item}>{item}</span>)}</div><Link className="text-link large-link" href="/about">看看我的实务路径 <span aria-hidden="true">→</span></Link></div>
        </section>

        <section className="guestbook-cta"><div><p className="section-kicker">一起把内容做得更好</p><h2>有纠错、建议或想看的题目？</h2><p>欢迎前往小红书反馈板，或通过邮件直接联系 Patrick。</p></div><Link className="button button-primary" href="/guestbook">反馈与联系 <span aria-hidden="true">→</span></Link></section>
      </main>
      <SiteFooter />
    </>
  );
}
