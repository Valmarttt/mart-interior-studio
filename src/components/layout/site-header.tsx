import Link from "next/link";
import { ArrowUpRight, Globe2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Dictionary, type Locale, locales } from "@/lib/i18n";

type SiteHeaderProps = { locale: Locale; copy: Dictionary };

export function SiteHeader({ locale, copy }: SiteHeaderProps) {
  const alternateLocale = locales.find((item) => item !== locale) ?? "en";

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href={`/${locale}`} className="group flex items-center gap-3" aria-label="Atelier AI home">
          <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-ink text-white transition-transform group-hover:rotate-6">
            <Sparkles size={16} strokeWidth={1.8} />
          </span>
          <span className="font-display text-[18px] tracking-[-0.04em] text-ink">Atelier AI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <Link className="nav-link" href={`/${locale}/studio`}>{copy.header.studio}</Link>
          <Link className="nav-link" href={`/${locale}/projects`}>{copy.header.projects}</Link>
          <Link className="nav-link" href={`/${locale}/pricing`}>{copy.header.pricing}</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href={`/${alternateLocale}`} className="hidden items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-black/[0.04] hover:text-ink sm:flex" aria-label={`${copy.header.language}: ${alternateLocale.toUpperCase()}`}>
            <Globe2 size={15} strokeWidth={1.7} />
            {alternateLocale.toUpperCase()}
          </Link>
          <Link className="hidden text-sm font-medium text-muted transition-colors hover:text-ink sm:block" href={`/${locale}/login`}>{copy.header.signIn}</Link>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={`/${locale}/studio`}>{copy.header.cta}<ArrowUpRight size={14} /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="sm:hidden" aria-label={copy.header.cta}>
            <Link href={`/${locale}/studio`}><ArrowUpRight size={18} /></Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
