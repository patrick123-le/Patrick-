import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = { title: "反馈与联系｜Patrick的实务学习手册", description: "通过小红书反馈板或商务邮箱联系 Patrick。", alternates: { canonical: "/guestbook" } };

const feedbackUrl = "https://www.xiaohongshu.com/explore/6a9fc73c000000002b01fe11?xsec_token=AB9ciX0rWqo2Ob9OiIvPZpgn7_SwrWDlTBdcxAG-W21yw=&xsec_source=pc_user";

export default function GuestbookPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-main feedback-page">
        <section className="feedback-hero">
          <p className="eyebrow"><span aria-hidden="true">●</span> 反馈与联系</p>
          <h1>把建议留在<br /><em>更轻的地方。</em></h1>
          <p>为了减少网站数据库管理负担，Patrick 没有设计专门的留言区给大家填写反馈。欢迎朋友们将任何好评或修复意见转移到小红书反馈板反映，或者通过邮箱 <a href="mailto:patricklee2026@163.com">patricklee2026@163.com</a> 联系我。</p>
        </section>

        <section className="feedback-panel" aria-labelledby="feedback-title">
          <header><p className="section-kicker">选择联系渠道</p><h2 id="feedback-title">你的每条建议，都会帮助知识库继续变好。</h2></header>
          <div className="feedback-option-grid">
            <a className="feedback-option is-primary" href={feedbackUrl} target="_blank" rel="noreferrer">
              <span>01 · 推荐</span><h3>小红书反馈板</h3><p>适合提交内容纠错、使用体验、选题建议，或告诉我哪一部分真正帮助到了你。</p><strong>前往反馈板 ↗</strong>
            </a>
            <a className="feedback-option" href="mailto:patricklee2026@163.com">
              <span>02 · 邮件</span><h3>直接邮件联系</h3><p>适合需要详细说明的问题。请勿发送身份证号、完整案件材料等敏感信息。</p><strong>发送邮件 ↗</strong>
            </a>
          </div>
          <aside className="feedback-privacy-note"><span aria-hidden="true">✦</span><p>本站不再提供留言表单，也不会收集或保存访客的昵称、邮箱、评分和留言内容。</p></aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
