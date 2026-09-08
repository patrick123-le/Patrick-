import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "管理端准备中", robots: { index: false, follow: false, nocache: true } };

export default function AdminPage() {
  return <main className="admin-placeholder"><span className="brand-mark">P</span><p className="section-kicker">PRIVATE AREA</p><h1>管理端暂未启用</h1><p>本站已取消留言收集功能，当前页面不提供客户端登录，也不会暴露任何管理数据。</p><Link className="button button-primary" href="/">返回网站</Link></main>;
}
