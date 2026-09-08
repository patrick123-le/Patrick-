import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { works } from "@/lib/works";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WorkDetail } from "@/components/WorkDetail";

export function generateStaticParams() { return works.map((work) => ({ slug: work.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const work = works.find((item) => item.slug === slug);
  if (!work) return { title: "题目未找到", robots: { index: false, follow: false } };
  const title = `${work.title}｜Patrick的实务学习手册`;
  const description = work.summary.slice(0, 150);
  const primaryImage = work.mindMaps?.[0];
  const imageUrl = primaryImage ? `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${primaryImage.src}` : null;
  return {
    title,
    description,
    alternates: { canonical: `/works/${work.slug}` },
    openGraph: { title, description, type: "article", images: imageUrl ? [{ url: imageUrl, width: primaryImage!.width, height: primaryImage!.height, alt: primaryImage!.alt }] : [] },
    twitter: { card: imageUrl ? "summary_large_image" : "summary", title, description, images: imageUrl ? [imageUrl] : [] },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = works.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const work = works[index];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: work.title,
    description: work.summary,
    dateModified: work.updatedAt,
    author: { "@type": "Person", name: "Patrick" },
    mainEntityOfPage: `${siteUrl}/works/${work.slug}`,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "法务题库", item: `${siteUrl}/works` },
      { "@type": "ListItem", position: 3, name: work.title, item: `${siteUrl}/works/${work.slug}` },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main className="page-main detail-page">
        <nav className="breadcrumbs" aria-label="面包屑"><Link href="/">首页</Link><span>/</span><Link href="/works">法务题库</Link><span>/</span><span>第 {work.number} 题</span></nav>
        <WorkDetail work={work} previous={works[index - 1]} next={works[index + 1]} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      </main>
      <SiteFooter />
    </>
  );
}
