"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, LoaderCircle, Mail, LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n";

type AuthFormProps = { locale: Locale; mode: "login" | "signup" };

export function AuthForm({ locale, mode }: AuthFormProps) {
  const isRussian = locale === "ru";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const copy = isRussian ? {
    title: mode === "login" ? "С возвращением." : "Создайте своё пространство.",
    body: mode === "login" ? "Войдите, чтобы вернуться к сохранённым проектам." : "Сохраните варианты интерьера и возвращайтесь к ним в любое время.",
    email: "Электронная почта", password: "Пароль", submit: mode === "login" ? "Войти" : "Создать аккаунт", switchText: mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?", switchLabel: mode === "login" ? "Зарегистрироваться" : "Войти", success: "Проверьте почту, чтобы завершить регистрацию.", config: "Supabase пока не настроен. Добавьте переменные окружения из .env.example.", error: "Не удалось выполнить запрос. Проверьте данные и попробуйте ещё раз.",
  } : {
    title: mode === "login" ? "Welcome back." : "Make a space of your own.",
    body: mode === "login" ? "Sign in to return to your saved projects." : "Save interior directions and return to them whenever you like.",
    email: "Email address", password: "Password", submit: mode === "login" ? "Sign in" : "Create account", switchText: mode === "login" ? "New here?" : "Already have an account?", switchLabel: mode === "login" ? "Create an account" : "Sign in", success: "Check your email to finish creating your account.", config: "Supabase is not configured yet. Add the environment variables from .env.example.", error: "The request could not be completed. Check your details and try again.",
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setMessage("");
    try {
      const supabase = createClient();
      const result = mode === "login" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (result.error) throw result.error;
      if (mode === "login") window.location.assign(`/${locale}/projects`);
      else setMessage(copy.success);
    } catch (error) {
      setMessage(error instanceof Error && error.message === "SUPABASE_ENV_MISSING" ? copy.config : copy.error);
    } finally { setLoading(false); }
  }

  return <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-[1240px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10"><div className="hidden rounded-4xl bg-ink p-10 text-white lg:block"><span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/10"><Sparkles size={18} /></span><p className="mt-24 max-w-[380px] font-display text-5xl leading-[0.98] tracking-[-0.06em]">{isRussian ? "Дом начинается с ощущения." : "A home begins with a feeling."}</p><p className="mt-6 max-w-[300px] text-sm leading-6 text-white/55">{isRussian ? "Atelier AI помогает превратить идею пространства в ясное направление." : "Atelier AI helps turn a feeling for space into a clear direction."}</p></div><div className="mx-auto w-full max-w-[430px]"><p className="section-kicker">Atelier AI</p><h1 className="font-display mt-5 text-5xl leading-[0.98] tracking-[-0.06em]">{copy.title}</h1><p className="mt-5 text-sm leading-6 text-muted">{copy.body}</p><form onSubmit={submit} className="mt-9 grid gap-5"><label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink/60">{copy.email}<span className="relative"><Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="studio-select pl-11" autoComplete="email" /></span></label><label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink/60">{copy.password}<span className="relative"><LockKeyhole size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="studio-select pl-11" autoComplete={mode === "login" ? "current-password" : "new-password"} /></span></label>{message && <p className="rounded-2xl bg-accent/10 p-3 text-xs leading-5 text-ink/70" role="status">{message}</p>}<Button type="submit" size="lg" disabled={loading}>{loading ? <LoaderCircle size={17} className="animate-spin" /> : <>{copy.submit}<ArrowRight size={16} /></>}</Button></form><p className="mt-6 text-center text-sm text-muted">{copy.switchText} <Link className="font-medium text-ink underline decoration-line underline-offset-4" href={`/${locale}/${mode === "login" ? "signup" : "login"}`}>{copy.switchLabel}</Link></p></div></div>;
}
