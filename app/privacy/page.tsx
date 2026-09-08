import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = { title: "隐私说明｜Patrick的实务学习手册", description: "本站对访问统计与本地偏好信息的处理原则。", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <><SiteHeader /><main className="page-main prose-page"><p className="eyebrow"><span aria-hidden="true">●</span> 隐私说明</p><h1>只收集完成体验所必需的信息。</h1><p className="updated">更新于 2026 年 9 月 8 日</p><section><h2>访问数据</h2><p>当前本地版本不接入第三方统计服务。正式上线后如启用匿名统计，只记录页面路径、来源渠道、设备大类及功能使用次数，不长期保存原始 IP、完整浏览器指纹、精确位置或站外浏览历史。</p></section><section><h2>反馈信息</h2><p>本站不设置留言表单，不接收或存储昵称、邮箱、评分及留言内容。点击小红书反馈板或邮件联系后，相关信息将由对应平台按照其隐私规则处理。</p></section><section><h2>本地偏好</h2><p>回想模式状态保存在你的浏览器本地，用于刷新页面后维持选择；它不会用于跨站追踪。</p></section><section><h2>联系</h2><p>如对本站隐私处理有疑问，请通过 <a href="mailto:patricklee2026@163.com">patricklee2026@163.com</a> 联系 Patrick。</p></section></main><SiteFooter /></>;
}
