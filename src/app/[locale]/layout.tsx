import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { dictionaries, isLocale, locales, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { default: "Atelier AI — Interior ideas with intention", template: "%s | Atelier AI" },
  description: "Explore a more considered version of your room with Atelier AI.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const copy = dictionaries[locale];

  return <><SiteHeader locale={locale} copy={copy} />{children}<SiteFooter locale={locale} copy={copy} /></>;
}
