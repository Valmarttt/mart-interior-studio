import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { type Dictionary, type Locale } from "@/lib/i18n";

type SiteFooterProps = { locale: Locale; copy: Dictionary };

export function SiteFooter({ locale, copy }: SiteFooterProps) {
  return (
    <footer className="border-t border-line bg-[#f5f3ee]">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-10 lg:py-20">
        <div>
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-ink text-white"><Sparkles size={16} strokeWidth={1.8} /></span>
            <span className="font-display text-[18px] tracking-[-0.04em] text-ink">Atelier AI</span>
          </Link>
          <p className="mt-5 max-w-[230px] text-sm leading-6 text-muted">{copy.footer.tagline}</p>
        </div>
        <FooterColumn title={copy.footer.product} links={[{ label: copy.header.studio, href: `/${locale}/studio` }, { label: copy.header.projects, href: `/${locale}/projects` }, { label: copy.header.pricing, href: `/${locale}/pricing` }]} />
        <FooterColumn title={copy.footer.company} links={[{ label: "About", href: "#about" }, { label: "Contact", href: `/${locale}/contact` }, { label: "Journal", href: "#journal" }]} />
        <FooterColumn title={copy.footer.legal} links={[{ label: "Privacy", href: `/${locale}/privacy` }, { label: "Terms", href: `/${locale}/terms` }]} />
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-3 border-t border-line px-5 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <span>{copy.footer.rights}</span>
        <span className="flex items-center gap-1">Designed with intention <ArrowUpRight size={12} /></span>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">{title}</p><div className="grid gap-3">{links.map((link) => <Link key={link.label} className="w-fit text-sm text-muted transition-colors hover:text-ink" href={link.href}>{link.label}</Link>)}</div></div>;
}
