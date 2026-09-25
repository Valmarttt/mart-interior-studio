import Link from "next/link";
import { ArrowUpRight, FolderOpen, LogIn, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { notFound } from "next/navigation";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

type Project = { id: string; title: string; room_type: string; updated_at: string };

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const russian = locale === "ru";
  let projects: Project[] = [];
  let signedIn = false;
  const configReady = hasSupabaseEnv();
  if (configReady) {
    const supabase = await createClient();
    const { data: claims } = await supabase.auth.getClaims();
    signedIn = Boolean(claims?.claims?.sub);
    if (signedIn) {
      const result = await supabase.from("projects").select("id,title,room_type,updated_at").order("updated_at", { ascending: false });
      projects = (result.data ?? []) as Project[];
    }
  }

  return <main className="min-h-[calc(100vh-76px)] bg-[#f5f3ee]"><div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:px-10 lg:py-24"><div className="flex flex-col justify-between gap-6 border-b border-line pb-10 sm:flex-row sm:items-end"><div><p className="section-kicker">{russian ? "Личное пространство" : "Your space"}</p><h1 className="font-display mt-4 text-5xl tracking-[-0.06em]">{russian ? "Ваши проекты." : "Your projects."}</h1><p className="mt-4 max-w-[440px] text-sm leading-6 text-muted">{russian ? "Сохраняйте направления и возвращайтесь к ним, когда будете готовы." : "Save directions and return to them whenever you are ready."}</p></div>{signedIn && <Button asChild><Link href={`/${locale}/studio`}><Plus size={16} />{russian ? "Новый проект" : "New project"}</Link></Button>}</div>{!configReady ? <ProjectNotice icon={<FolderOpen size={18} />} title={russian ? "Подключение ещё не настроено" : "Connection is not configured yet"} body={russian ? "Страница готова к Supabase. Добавьте переменные окружения и примените миграцию из папки supabase/migrations." : "This page is ready for Supabase. Add the environment variables and apply the migration from supabase/migrations."} /> : !signedIn ? <ProjectNotice icon={<LogIn size={18} />} title={russian ? "Войдите, чтобы увидеть проекты" : "Sign in to see your projects"} body={russian ? "Проекты принадлежат только их владельцу и не показываются гостям." : "Projects belong to their owner and are never shown to guests."} action={<Button asChild variant="outline"><Link href={`/${locale}/login`}>{russian ? "Войти" : "Sign in"}<ArrowUpRight size={15} /></Link></Button>} /> : projects.length === 0 ? <ProjectNotice icon={<FolderOpen size={18} />} title={russian ? "Пока здесь пусто" : "Nothing here yet"} body={russian ? "Создайте первый вариант в студии, чтобы он появился в вашей истории." : "Create your first direction in the studio and it will appear in your history."} action={<Button asChild><Link href={`/${locale}/studio`}>{russian ? "Открыть студию" : "Open studio"}<ArrowUpRight size={15} /></Link></Button>} /> : <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <Link key={project.id} href={`/${locale}/projects/${project.id}`} className="surface-card group p-5 transition-transform hover:-translate-y-1"><div className="flex aspect-[1.35] items-end rounded-3xl bg-[#ddd0c0] p-4"><span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-ink/70">{project.room_type}</span></div><h2 className="mt-4 text-base font-medium group-hover:text-accent">{project.title}</h2><p className="mt-1 text-xs text-muted">{new Date(project.updated_at).toLocaleDateString(russian ? "ru-RU" : "en-US")}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent">{russian ? "Открыть проект" : "Open project"}<ArrowUpRight size={13} /></span></Link>)}</div>}</div></main>;
}

function ProjectNotice({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action?: React.ReactNode }) {
  return <div className="mx-auto mt-16 flex max-w-[620px] flex-col items-center rounded-4xl border border-line bg-white px-6 py-14 text-center shadow-soft"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3efe8] text-accent">{icon}</span><h2 className="font-display mt-5 text-3xl tracking-[-0.04em]">{title}</h2><p className="mt-3 max-w-[430px] text-sm leading-6 text-muted">{body}</p>{action && <div className="mt-6">{action}</div>}</div>;
}
