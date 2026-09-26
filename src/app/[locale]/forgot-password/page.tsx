import { notFound } from "next/navigation";
import { PasswordForm } from "@/components/auth/password-form";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  return <main><PasswordForm locale={localeParam as Locale} mode="request" /></main>;
}
