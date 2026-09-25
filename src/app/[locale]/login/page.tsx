import { notFound } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  return <main><AuthForm locale={localeParam as Locale} mode="login" /></main>;
}
