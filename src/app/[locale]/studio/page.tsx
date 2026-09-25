import { notFound } from "next/navigation";
import { StudioWorkspace } from "@/components/studio/studio-workspace";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { studioCopy } from "@/lib/studio-copy";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function StudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  return <main className="bg-[#f5f3ee]"><StudioWorkspace locale={locale} copy={studioCopy[locale]} /></main>;
}
