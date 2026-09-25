"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, ImagePlus, Info, RefreshCw, RotateCcw, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import type { StudioCopy } from "@/lib/studio-copy";

type StudioWorkspaceProps = { locale: Locale; copy: StudioCopy };
type ToggleKey = "preserveLayout" | "preserveOpenings" | "preserveFurniture";

const preparedDemoAfterBySuggestion: Record<string, string> = {
  "japandi-warm": "/demo-room-after.png",
  "scandi-light": "/demo-room-scandi-after.png",
  "modern-warm": "/demo-room-modern-after.png",
};

export function StudioWorkspace({ copy }: StudioWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isExample, setIsExample] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [resultMode, setResultMode] = useState<"demo" | "real" | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ready">("idle");
  const [room, setRoom] = useState(copy.roomTypes[0].id);
  const [style, setStyle] = useState(copy.styles[0].id);
  const [palette, setPalette] = useState(copy.palettes[1].id);
  const [intensity, setIntensity] = useState(copy.intensities[1].id);
  const [elements, setElements] = useState<string[]>(["furniture", "walls", "lighting"]);
  const [preserve, setPreserve] = useState<Record<ToggleKey, boolean>>({ preserveLayout: true, preserveOpenings: true, preserveFurniture: false });
  const [prompt, setPrompt] = useState("");
  const [split, setSplit] = useState(54);
  const [suggestionId, setSuggestionId] = useState<string | null>(copy.suggestions[0]?.id || null);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  function acceptFile(nextFile: File | undefined) {
    if (!nextFile) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(nextFile.type) || nextFile.size > 10 * 1024 * 1024) {
      setError(copy.errors.file);
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setIsExample(nextFile.name === "demo-room.png");
    setSuggestionId(copy.suggestions[0]?.id || null);
    setGeneratedUrl(null);
    setResultMode(null);
    setSuggestionId(null);
    setStatus("idle");
    setError("");
  }

  function clearFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setIsExample(false);
    setGeneratedUrl(null);
    setResultMode(null);
    setStatus("idle");
    setError("");
  }

  function toggleElement(id: string) {
    setElements((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function applySuggestion(suggestion: (typeof copy.suggestions)[number]) {
    setSuggestionId(suggestion.id);
    setStyle(suggestion.style);
    setPalette(suggestion.palette);
    setIntensity(suggestion.intensity);
    setElements(suggestion.elements);
    setPrompt(suggestion.prompt);
    setGeneratedUrl(null);
    setResultMode(null);
    setStatus("idle");
    setError("");
  }

  async function createDemo() {
    if (!file) { setError(copy.errors.required); return; }
    setStatus("submitting");
    setError("");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("settings", JSON.stringify({ roomType: room, style, palette, intensity, changeElements: elements, preserveLayout: preserve.preserveLayout, preserveWindowsAndDoors: preserve.preserveOpenings, preserveFurniture: preserve.preserveFurniture }));
    formData.append("customPrompt", prompt);
    try {
      const response = await fetch("/api/generations", { method: "POST", body: formData });
      const data = await response.json() as { message?: string; imageDataUrl?: string; mode?: "demo" | "real" };
      if (!response.ok) throw new Error(data.message || "Generation request failed");
      setGeneratedUrl(data.imageDataUrl || null);
      setResultMode(data.mode || "demo");
      setStatus("ready");
    } catch (requestError) {
      setStatus("idle");
      setError(requestError instanceof Error ? requestError.message : "Generation request failed");
    }
    setSplit(54);
  }

  function reset() {
    clearFile();
    setRoom(copy.roomTypes[0].id);
    setStyle(copy.styles[0].id);
    setPalette(copy.palettes[1].id);
    setIntensity(copy.intensities[1].id);
    setElements(["furniture", "walls", "lighting"]);
    setPrompt("");
    setSuggestionId(copy.suggestions[0]?.id || null);
  }

  async function useExample() {
    try {
      const response = await fetch("/demo-room.png");
      if (!response.ok) throw new Error("Example image is unavailable");
      const blob = await response.blob();
      acceptFile(new File([blob], "demo-room.png", { type: blob.type || "image/png" }));
    } catch { setError(copy.errors.file); }
  }

  const isLiveResult = resultMode === "real";
  const preparedDemoUrl = isExample && suggestionId ? preparedDemoAfterBySuggestion[suggestionId] || null : null;
  const afterUrl = generatedUrl || preparedDemoUrl;
  const afterLabel = isLiveResult ? copy.liveAfter : copy.after;
  const downloadUrl = afterUrl;

  return <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pt-16">
    <div className="flex flex-col justify-between gap-8 border-b border-line pb-10 md:flex-row md:items-end">
      <div className="max-w-[690px]"><div className="flex flex-wrap items-center gap-3"><p className="section-kicker">{copy.eyebrow}</p><span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">{copy.demoBadge}</span></div><h1 className="font-display mt-5 text-balance text-5xl leading-[0.98] tracking-[-0.06em] sm:text-6xl">{copy.title}</h1><p className="mt-5 max-w-[560px] text-base leading-7 text-muted">{copy.subtitle}</p></div>
      <div className="hidden items-center gap-2 text-xs text-muted md:flex"><span className="h-2 w-2 rounded-full bg-accent" />{copy.mockNotice}</div>
    </div>

    <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(340px,430px)_1fr] xl:items-start">
      <section className="surface-card p-5 sm:p-7" aria-labelledby="studio-settings">
        <div className="flex items-center justify-between"><h2 id="studio-settings" className="font-display text-2xl tracking-[-0.04em]">{copy.settings}</h2><button type="button" onClick={reset} className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink"><RotateCcw size={13} />{copy.reset}</button></div>
        <UploadZone copy={copy} file={file} previewUrl={previewUrl} inputRef={fileInputRef} error={error} onChoose={() => fileInputRef.current?.click()} onUseExample={useExample} onFile={acceptFile} onClear={clearFile} />
        {file && <SuggestionPanel copy={copy} selectedId={suggestionId} onSelect={applySuggestion} />}
        <div className="mt-7 grid gap-6 border-t border-line pt-7">
          <FieldLabel label={copy.room}><select value={room} onChange={(event) => setRoom(event.target.value)} className="studio-select">{copy.roomTypes.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></FieldLabel>
          <FieldLabel label={copy.style}><div className="grid grid-cols-2 gap-2">{copy.styles.map((option) => <button type="button" key={option.id} onClick={() => setStyle(option.id)} className={`studio-choice ${style === option.id ? "studio-choice-active" : ""}`}><span>{option.label}</span><small>{option.description}</small></button>)}</div></FieldLabel>
          <FieldLabel label={copy.palette}><div className="grid grid-cols-4 gap-2">{copy.palettes.map((option) => <button type="button" key={option.id} onClick={() => setPalette(option.id)} className={`palette-choice ${palette === option.id ? "palette-choice-active" : ""}`}><span style={{ backgroundColor: option.color }} /><small>{option.label}</small></button>)}</div></FieldLabel>
          <FieldLabel label={copy.intensity}><div className="flex gap-1 rounded-2xl bg-[#f3f0eb] p-1">{copy.intensities.map((option) => <button type="button" key={option.id} onClick={() => setIntensity(option.id)} className={`flex-1 rounded-xl px-2 py-2 text-xs transition-colors ${intensity === option.id ? "bg-white font-medium text-ink shadow-sm" : "text-muted hover:text-ink"}`}>{option.label}</button>)}</div></FieldLabel>
          <FieldLabel label={copy.elements}><div className="flex flex-wrap gap-2">{copy.elementsList.map((option) => <button type="button" key={option.id} onClick={() => toggleElement(option.id)} className={`rounded-full border px-3 py-2 text-xs transition-colors ${elements.includes(option.id) ? "border-ink bg-ink text-white" : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink"}`}>{elements.includes(option.id) && <Check size={12} className="mr-1 inline" />}{option.label}</button>)}</div></FieldLabel>
          <FieldLabel label={copy.preserve}><div className="grid gap-2">{(["preserveLayout", "preserveOpenings", "preserveFurniture"] as ToggleKey[]).map((key) => <label key={key} className="flex cursor-pointer items-center gap-3 text-sm text-ink"><input type="checkbox" checked={preserve[key]} onChange={() => setPreserve((current) => ({ ...current, [key]: !current[key] }))} className="studio-checkbox" />{copy[key]}</label>)}</div></FieldLabel>
          <FieldLabel label={copy.prompt}><div><textarea value={prompt} maxLength={1000} onChange={(event) => setPrompt(event.target.value)} placeholder={copy.promptPlaceholder} className="studio-textarea" /><div className="mt-1 text-right text-[10px] text-muted">{prompt.length}/1000</div></div></FieldLabel>
        </div>
        <Button type="button" onClick={createDemo} disabled={status === "submitting"} size="lg" className="mt-6 w-full">{status === "submitting" ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}{status === "submitting" ? copy.creating : copy.create}</Button>
      </section>

      <section className="min-w-0" aria-labelledby="studio-preview">
        <div className="mb-4 flex items-center justify-between gap-4"><div><p className="section-kicker">{copy.preview}</p><h2 id="studio-preview" className="font-display mt-2 text-3xl tracking-[-0.05em]">{status === "ready" ? (isLiveResult ? copy.liveReady : copy.demoReady) : copy.previewHint}</h2></div>{status === "ready" && <div className="hidden items-center gap-2 sm:flex">{downloadUrl ? <Button asChild variant="outline" size="sm"><a href={downloadUrl} download="atelier-ai-room.png"><Download size={14} />{isLiveResult ? copy.downloadImage : copy.download}</a></Button> : <Button variant="outline" size="sm" type="button" disabled><Download size={14} />{copy.download}</Button>}<Button size="sm" type="button"><Check size={14} />{copy.save}</Button></div>}</div>
        <div className="surface-card overflow-hidden p-3 sm:p-5">
          {status === "ready" ? <Comparison copy={copy} previewUrl={previewUrl} afterUrl={afterUrl} afterLabel={afterLabel} split={split} onSplit={setSplit} /> : <EmptyPreview copy={copy} previewUrl={previewUrl} />}
        </div>
        {status === "ready" && <div className="mt-4 flex gap-3 rounded-2xl border border-accent/20 bg-accent/10 p-4 text-xs leading-5 text-ink/70"><Info size={16} className="mt-0.5 shrink-0 text-accent" /><div><p className="font-medium text-ink">{isLiveResult ? copy.liveNotice : copy.mockNotice}</p><p>{isLiveResult ? copy.liveNoticeBody : copy.mockNoticeBody}</p></div></div>}
      </section>
    </div>
  </div>;
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) { return <div><label className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.16em] text-ink/60">{label}</label>{children}</div>; }

function SuggestionPanel({ copy, selectedId, onSelect }: { copy: StudioCopy; selectedId: string | null; onSelect: (suggestion: StudioCopy["suggestions"][number]) => void }) {
  return <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{copy.suggestionsTitle}</p><p className="mt-2 text-xs leading-5 text-muted">{copy.suggestionsBody}</p><div className="mt-4 grid gap-2">{copy.suggestions.map((suggestion) => <button key={suggestion.id} type="button" aria-pressed={selectedId === suggestion.id} onClick={() => onSelect(suggestion)} className={`rounded-2xl border p-4 text-left transition-colors ${selectedId === suggestion.id ? "border-ink bg-white shadow-sm" : "border-line/80 bg-white/50 hover:border-ink/30 hover:bg-white"}`}><div className="flex items-start justify-between gap-3"><span className="text-sm font-medium text-ink">{suggestion.title}</span><span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${selectedId === suggestion.id ? "bg-accent" : "bg-line"}`} /></div><p className="mt-1 text-xs leading-5 text-muted">{suggestion.description}</p><span className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">{selectedId === suggestion.id ? copy.suggestionsUse : suggestion.style}</span></button>)}</div></div>;
}

function UploadZone({ copy, file, previewUrl, inputRef, error, onChoose, onUseExample, onFile, onClear }: { copy: StudioCopy; file: File | null; previewUrl: string | null; inputRef: React.RefObject<HTMLInputElement | null>; error: string; onChoose: () => void; onUseExample: () => void; onFile: (file: File | undefined) => void; onClear: () => void }) {
  return <div className="mt-6">{file && previewUrl ? <div className="relative overflow-hidden rounded-2xl border border-line bg-[#eeeae3]"><div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${previewUrl})` }} /><div className="flex items-center justify-between gap-3 bg-white px-4 py-3"><div className="min-w-0"><p className="truncate text-xs font-medium text-ink">{file.name}</p><p className="mt-1 text-[10px] text-muted">{Math.round(file.size / 1024)} KB</p></div><div className="flex shrink-0 gap-1"><button type="button" onClick={onChoose} className="rounded-full p-2 text-muted hover:bg-black/[0.04] hover:text-ink" aria-label={copy.upload.replace}><RefreshCw size={15} /></button><button type="button" onClick={onClear} className="rounded-full p-2 text-muted hover:bg-black/[0.04] hover:text-ink" aria-label={copy.upload.remove}><Trash2 size={15} /></button></div></div></div> : <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); onFile(event.dataTransfer.files[0]); }} className="group w-full rounded-2xl border border-dashed border-[#cfc8be] bg-[#faf9f6] p-6 text-left transition-colors hover:border-accent hover:bg-white"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-accent shadow-sm"><ImagePlus size={19} /></span><p className="mt-5 text-sm font-medium text-ink">{copy.upload.title}</p><p className="mt-1 max-w-[260px] text-xs leading-5 text-muted">{copy.upload.body}</p><div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2"><button type="button" onClick={onChoose} className="inline-flex items-center gap-1.5 text-xs font-medium text-accent"><UploadCloud size={14} />{copy.upload.browse}</button><button type="button" onClick={onUseExample} className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/60 underline decoration-line underline-offset-4 hover:text-ink">{copy.upload.example}</button></div><p className="mt-4 text-[10px] uppercase tracking-[0.12em] text-muted/70">{copy.upload.formats}</p></div>}
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => onFile(event.target.files?.[0])} />
    {error && <p className="mt-2 text-xs text-[#a34f42]" role="alert">{error}</p>}
  </div>;
}

function EmptyPreview({ copy, previewUrl }: { copy: StudioCopy; previewUrl: string | null }) {
  return <div className="relative aspect-[1.34] overflow-hidden rounded-3xl bg-[#e7dfd3]">{previewUrl ? <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${previewUrl})` }} /> : <DemoRoom variant="before" />}<div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/45 via-transparent to-transparent p-6 sm:p-8"><div className="max-w-[350px] text-white"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-sm"><ImagePlus size={17} /></div><h3 className="font-display text-2xl tracking-[-0.04em]">{copy.emptyPreview}</h3><p className="mt-2 text-xs leading-5 text-white/75">{copy.emptyPreviewBody}</p></div></div></div>;
}

function Comparison({ copy, previewUrl, afterUrl, afterLabel, split, onSplit }: { copy: StudioCopy; previewUrl: string | null; afterUrl: string | null; afterLabel: string; split: number; onSplit: (value: number) => void }) {
  return <div><div className="relative aspect-[1.34] overflow-hidden rounded-3xl bg-[#d6c5ae]">{afterUrl ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${afterUrl})` }} /> : <DemoRoom variant="after" />}<div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${split}%` }}><div className="relative h-full" style={{ width: `${100 / (split || 1) * 100}%` }}>{previewUrl ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${previewUrl})` }} /> : <DemoRoom variant="before" />}</div></div><div className="pointer-events-none absolute inset-y-0 w-px bg-white shadow-[0_0_0_1px_rgba(32,32,32,0.12)]" style={{ left: `${split}%` }}><span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-lg"><span className="text-xs">↔</span></span></div><span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">{copy.before}</span><span className="absolute right-4 top-4 rounded-full bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur-sm">{afterLabel}</span></div><label className="mt-4 block"><span className="sr-only">Compare before and after</span><input type="range" min="5" max="95" value={split} onChange={(event) => onSplit(Number(event.target.value))} className="comparison-range" /></label><div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.16em] text-muted"><span>{copy.before}</span><span>{afterLabel}</span></div></div>;
}

function DemoRoom({ variant }: { variant: "before" | "after" }) {
  return <div className={`demo-room demo-room-${variant}`} aria-hidden="true"><div className="demo-window" /><div className="demo-arch" /><div className="demo-sofa" /><div className="demo-chair" /><div className="demo-plant" /><div className="demo-lamp" /><div className="demo-rug" /></div>;
}
