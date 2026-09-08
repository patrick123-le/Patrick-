import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Patrick的实务学习手册", template: "%s" },
  description: "面向法学生与初级法务从业者的法务面试练习知识库。",
  applicationName: "Patrick的实务学习手册",
  authors: [{ name: "Patrick" }],
  keywords: ["法务面试", "法学生", "数据合规", "合同审查", "企业法务"],
  alternates: { canonical: "/" },
  openGraph: { title: "Patrick的实务学习手册", description: "把法务面试经验整理成真正能练习的知识库。", type: "website", locale: "zh_CN", siteName: "Patrick的实务学习手册", images: [{ url: "/patrick-study-og.png", width: 1732, height: 909, alt: "Patrick的实务学习手册品牌封面" }] },
  twitter: { card: "summary_large_image", title: "Patrick的实务学习手册", description: "把法务面试经验整理成真正能练习的知识库。", images: ["/patrick-study-og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <div className="site-watermark" role="note">网页信息来源于小红书ID：5082698158，仅供学习参考使用，请勿侵权。</div>
      </body>
    </html>
  );
}
