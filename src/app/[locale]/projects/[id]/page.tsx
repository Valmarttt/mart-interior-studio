import Link from "next/link";
import { ArrowLeft, Check, FolderOpen, Image as ImageIcon, LogIn } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() { return locales.flatMap((locale) => [{ locale, id: "placeholder" }]); }

type Generation = {
  id: string;
  status: string;
  style_id: string;
  settings: unknown;
  result_image_path: string | null;
  created_at: string;
  completed_at: string | null;
};

type Project = {
  id: string;
  title: string;
  room_type: string;
  original_image_path: string | null;
  created_at: string;
  updated_at: string;
  generations: Generation[];
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const russian = locale === "ru";

  if (!hasSupabaseEnv()) {
    return <ProjectShell><ProjectNotice icon={<FolderOpen size={18} />} title={russian ? "Подключение ещё не настроено" : "Connection is not configured yet"} body={russian ? "Добавьте переменные окружения Supabase и примените миграцию, чтобы открывать сохранённые проекты." : "Add the Supabase environment variables and apply the migration to open saved projects."} /></ProjectShell>;
  }

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    return <ProjectShell><ProjectNotice icon={<LogIn size={18} />} title={russian ? "Войдите, чтобы открыть проект" : "Sign in to open this project"} body={russian ? "Сохранённые комнаты доступны только их владельцу." : "Saved rooms are available only to their owner."} action={<Button asChild variant="outline"><Link href={`/${locale}/login`}>{russian ? "Войти" : "Sign in"}</Link></Button>} /></ProjectShell>;
  }

  const { data: rawProject, error } = await supabase.from("projects").select("id,title,room_type,original_image_path,created_at,updated_at,generations(id,status,style_id,settings,result_image_path,created_at,completed_at)").eq("id", id).maybeSingle();
  if (error || !rawProject) notFound();
  const project = rawProject as unknown as Project;
  let originalImageUrl: string | null = null;
  if (project.original_image_path) {
    const signed = await supabase.storage.from("project-images").createSignedUrl(project.original_image_path, 60 * 60);
    originalImageUrl = signed.data?.signedUrl ?? null;
  }
  const generationImageUrls = new Map<string, string>();
  await Promise.all(project.generations.map(async (generation) => {
    if (!generation.result_image_path) return;
    const signed = await supabase.storage.from("project-images").createSignedUrl(generation.result_image_path, 60 * 60);
    if (signed.data?.signedUrl) generationImageUrls.set(generation.id, signed.data.signedUrl);
  }));

  return <ProjectShell><div className="flex flex-col justify-between gap-6 border-b border-line pb-10 sm:flex-row sm:items-end"><div><Link href={`/${locale}/projects`} className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-ink"><ArrowLeft size={14} />{russian ? "Назад к проектам" : "Back to projects"}</Link><p className="section-kicker mt-8">{russian ? "Сохранённый проект" : "Saved project"}</p><h1 className="font-display mt-4 text-5xl tracking-[-0.06em]">{project.title}</h1><p className="mt-4 text-sm text-muted">{project.room_type} · {new Date(project.updated_at).toLocaleDateString(russian ? "ru-RU" : "en-US")}</p></div><Button asChild><Link href={`/${locale}/studio`}>{russian ? "Новый проект" : "New project"}</Link></Button></div><div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]"><section className="surface-card overflow-hidden p-3 sm:p-5"><div className="relative aspect-[1.34] overflow-hidden rounded-3xl bg-[#ddd0c0]">{originalImageUrl ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${originalImageUrl})` }} /> : <div className="flex h-full flex-col items-center justify-center gap-3 text-muted"><ImageIcon size={28} /><p className="text-sm">{russian ? "Исходное фото недоступно" : "Original photo unavailable"}</p></div>}</div><p className="mt-4 text-xs leading-5 text-muted">{russian ? "Фото хранится в приватном хранилище и доступно только владельцу проекта." : "The photo is stored privately and is available only to the project owner."}</p></section><aside className="surface-card p-6"><p className="section-kicker">{russian ? "История" : "History"}</p><h2 className="font-display mt-3 text-3xl tracking-[-0.04em]">{russian ? "Направления" : "Directions"}</h2>{project.generations.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-line p-5"><p className="text-sm text-muted">{russian ? "Варианты появятся здесь после подключения сохранения генераций." : "Directions will appear here once generation history is connected."}</p></div> : <div className="mt-6 grid gap-3">{project.generations.map((generation) => { const resultImageUrl = generationImageUrls.get(generation.id); const mode = getGenerationMode(generation.settings); return <div key={generation.id} className="rounded-2xl border border-line p-4">{resultImageUrl && <div className="mb-4 aspect-[1.34] overflow-hidden rounded-2xl bg-[#ddd0c0]" style={{ backgroundImage: `url(${resultImageUrl})`, backgroundPosition: "center", backgroundSize: "cover" }} />}<div className="flex items-center gap-2 text-xs font-medium"><Check size={14} className="text-accent" />{generation.style_id}<span className="ml-auto rounded-full bg-[#f3efe8] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-muted">{mode}</span></div><p className="mt-2 text-xs text-muted">{generation.status} · {new Date(generation.created_at).toLocaleDateString(russian ? "ru-RU" : "en-US")}</p>{resultImageUrl && <a href={`/api/generations/${generation.id}/download`} className="mt-3 inline-flex text-xs font-medium text-accent hover:text-ink">{russian ? "Скачать результат" : "Download result"}</a>}</div>; })}</div>}</aside></div></ProjectShell>;
}

function getGenerationMode(settings: unknown) {
  if (typeof settings === "object" && settings !== null && "mode" in settings && typeof settings.mode === "string") return settings.mode === "real" ? "Live" : "Demo";
  return "Saved";
}

function ProjectShell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-[calc(100vh-76px)] bg-[#f5f3ee]"><div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">{children}</div></main>;
}

function ProjectNotice({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action?: React.ReactNode }) {
  return <div className="mx-auto mt-16 flex max-w-[620px] flex-col items-center rounded-4xl border border-line bg-white px-6 py-14 text-center shadow-soft"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3efe8] text-accent">{icon}</span><h2 className="font-display mt-5 text-3xl tracking-[-0.04em]">{title}</h2><p className="mt-3 max-w-[430px] text-sm leading-6 text-muted">{body}</p>{action && <div className="mt-6">{action}</div>}</div>;
}
