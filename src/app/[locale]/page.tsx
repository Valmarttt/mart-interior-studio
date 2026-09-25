import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, MoveUpRight, Play, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dictionaries, isLocale, locales, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const copy = dictionaries[locale];

  return <main>
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10 lg:pt-28">
        <div className="relative z-10 max-w-[600px]">
          <p className="section-kicker flex items-center gap-2"><span className="h-px w-8 bg-accent" />{copy.hero.eyebrow}</p>
          <h1 className="font-display text-balance mt-6 max-w-[650px] text-[clamp(3.5rem,7vw,6.6rem)] leading-[0.94] tracking-[-0.065em] text-ink">{copy.hero.title}</h1>
          <p className="mt-8 max-w-[490px] text-base leading-7 text-muted sm:text-lg">{copy.hero.body}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="lg"><Link href={`/${locale}/studio`}>{copy.hero.primary}<ArrowUpRight size={17} /></Link></Button>
            <Button asChild variant="ghost" size="lg"><a href="#how-it-works">{copy.hero.secondary}<ArrowDown size={16} /></a></Button>
          </div>
          <div className="mt-12 flex items-center gap-3 text-xs text-muted"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white"><Check size={13} className="text-accent" /></span>{copy.hero.note}</div>
        </div>
        <RoomPreview copy={copy} />
      </div>
      <div className="pointer-events-none absolute -right-24 top-20 h-[520px] w-[520px] rounded-full bg-[#e6d7c3]/25 blur-3xl" />
      <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-5 pb-10 text-xs uppercase tracking-[0.18em] text-muted/70 sm:px-8 lg:px-10"><span className="h-px w-10 bg-line" />{copy.hero.trusted}</div>
    </section>

    <section id="how-it-works" className="border-y border-line bg-[#f5f3ee]">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 md:py-28 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24"><div><p className="section-kicker">{copy.how.eyebrow}</p><h2 className="font-display mt-5 max-w-[400px] text-4xl leading-[1.02] tracking-[-0.05em] sm:text-5xl">{copy.how.title}</h2><p className="mt-6 max-w-[350px] text-sm leading-6 text-muted">{copy.how.body}</p></div><div className="grid gap-0 border-t border-line">{copy.how.steps.map((step) => <div key={step.number} className="grid gap-5 border-b border-line py-7 sm:grid-cols-[70px_1fr] sm:gap-8"><span className="font-display text-2xl text-accent/70">{step.number}</span><div><h3 className="text-lg font-medium tracking-[-0.02em]">{step.title}</h3><p className="mt-2 max-w-[420px] text-sm leading-6 text-muted">{step.body}</p></div></div>)}</div></div>
      </div>
    </section>

    <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 md:py-28 lg:px-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="section-kicker">{copy.styles.eyebrow}</p><h2 className="font-display mt-5 max-w-[600px] text-4xl leading-[1.02] tracking-[-0.05em] sm:text-5xl">{copy.styles.title}</h2><p className="mt-5 max-w-[470px] text-sm leading-6 text-muted">{copy.styles.body}</p></div><Link href={`/${locale}/studio`} className="group flex items-center gap-2 text-sm font-medium text-ink">{copy.styles.explore}<span className="flex h-8 w-8 items-center justify-center rounded-full border border-line transition-transform group-hover:translate-x-1"><ArrowRight size={15} /></span></Link></div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{copy.styles.items.map((item, index) => <StyleCard key={item.name} item={item} index={index} />)}</div>
    </section>

    <section className="px-5 pb-20 sm:px-8 md:pb-28 lg:px-10"><div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-4xl bg-ink px-6 py-16 text-white sm:px-12 md:py-20 lg:px-20"><div className="relative z-10 max-w-[650px]"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b58b]">Atelier AI</p><h2 className="font-display mt-5 text-4xl leading-[1.02] tracking-[-0.05em] sm:text-6xl">{copy.bottom.title}</h2><p className="mt-6 text-sm leading-6 text-white/60">{copy.bottom.body}</p><Button asChild variant="outline" size="lg" className="mt-8 border-white/20 bg-white text-ink hover:bg-[#f4eee5]"><Link href={`/${locale}/studio`}>{copy.bottom.cta}<ArrowUpRight size={17} /></Link></Button></div><div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-white/10" /><div className="pointer-events-none absolute -right-4 -top-8 h-56 w-56 rounded-full border border-white/10" /></div></section>

    <section className="border-t border-line bg-[#f5f3ee] px-5 py-16 sm:px-8 lg:px-10"><div className="mx-auto max-w-[760px]"><p className="section-kicker">FAQ</p><h2 className="font-display mt-4 text-4xl tracking-[-0.05em]">A little more clarity.</h2><div className="mt-8 divide-y divide-line border-y border-line">{["Can I start without an account?", "Will the layout of my room stay the same?", "Is this a final design plan?"].map((question) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium"><span>{question}</span><ChevronDown size={17} className="text-muted transition-transform group-open:rotate-180" /></summary><p className="mt-3 max-w-[600px] text-sm leading-6 text-muted">Atelier AI is designed as a visual exploration tool. It helps you consider directions while keeping the original space in view.</p></details>)}</div></div></section>
  </main>;
}

function RoomPreview({ copy }: { copy: (typeof dictionaries)[Locale] }) {
  return <div className="relative mx-auto w-full max-w-[640px] lg:mr-0"><div className="relative aspect-[0.92] overflow-hidden rounded-[32px] bg-[#d6c5ae] shadow-soft sm:rounded-[42px]"><div className="absolute inset-x-0 top-0 h-[58%] bg-[#dcd1c1]" /><div className="absolute bottom-0 h-[44%] w-full origin-bottom -skew-y-[13deg] bg-[#ae8768]" /><div className="absolute left-[13%] top-[13%] h-[37%] w-[29%] rounded-[4px] border-[10px] border-[#c1aa92] bg-[#acbac0] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]"><div className="absolute left-1/2 h-full w-px bg-[#d8e0df]/70" /></div><div className="absolute right-[14%] top-[14%] h-[32%] w-[25%] rounded-t-full bg-[#bfcdc9]/80" /><div className="absolute left-[20%] bottom-[22%] h-[18%] w-[49%] rounded-[24px_24px_8px_8px] bg-[#b4a18c] shadow-[0_14px_0_0_#8d735f]" /><div className="absolute left-[15%] bottom-[31%] h-[14%] w-[15%] rounded-[50%] bg-[#c7d0c4]" /><div className="absolute right-[21%] bottom-[19%] h-[25%] w-[13%] rounded-t-[50%] bg-[#7f7659]" /><div className="absolute right-[20%] bottom-[17%] h-[6%] w-[15%] rounded-full bg-[#d9c8a8] blur-[1px]" /><div className="absolute left-[52%] top-[18%] h-[19%] w-[2px] bg-[#57534d]" /><div className="absolute left-[48.5%] top-[34%] h-3 w-7 rounded-full bg-[#eee4d0] shadow-[0_0_20px_8px_rgba(255,228,179,0.36)]" /><div className="absolute bottom-[16%] left-[12%] h-2 w-[70%] rounded-full bg-[#e0c2a0]/50 blur-sm" /><div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white sm:bottom-7 sm:left-7 sm:right-7"><div><p className="text-[10px] uppercase tracking-[0.2em] text-white/70">{copy.studioPreview.label}</p><p className="font-display mt-1 text-xl tracking-[-0.03em] sm:text-2xl">{copy.studioPreview.title}</p></div><span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm"><Play size={14} fill="currentColor" /></span></div></div><div className="absolute -bottom-5 left-5 flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-[11px] font-medium text-ink shadow-[0_10px_25px_rgba(56,43,29,0.12)] sm:left-8"><span className="h-2 w-2 rounded-full bg-[#9c7455]" />{copy.studioPreview.after}</div><div className="absolute -right-2 top-8 hidden w-[135px] rounded-2xl border border-white/70 bg-white/80 p-3 shadow-[0_12px_30px_rgba(56,43,29,0.1)] backdrop-blur-sm sm:block"><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted"><SunMedium size={13} className="text-accent" />{copy.studioPreview.style}</div><p className="mt-2 text-xs text-ink">{copy.studioPreview.palette}</p><div className="mt-3 flex gap-1.5"><span className="h-4 w-4 rounded-full bg-[#c7b39d]" /><span className="h-4 w-4 rounded-full bg-[#a7947e]" /><span className="h-4 w-4 rounded-full bg-[#e8dfd0]" /></div></div></div>;
}

function StyleCard({ item, index }: { item: (typeof dictionaries)[Locale]["styles"]["items"][number]; index: number }) {
  return <div className="group surface-card overflow-hidden p-3 transition-transform duration-300 hover:-translate-y-1"><div className={`style-tile tone-${item.tone}`}><span className="absolute left-4 top-4 rounded-full bg-white/65 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-ink/70">0{index + 1}</span><span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-ink opacity-0 transition-opacity group-hover:opacity-100"><MoveUpRight size={15} /></span></div><div className="px-2 pb-3 pt-4"><h3 className="text-base font-medium tracking-[-0.02em]">{item.name}</h3><p className="mt-1 text-xs leading-5 text-muted">{item.description}</p></div></div>;
}
