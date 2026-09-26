"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({ label }: { label: string }) {
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign("/");
  }

  return <button type="button" onClick={signOut} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"><LogOut size={14} />{label}</button>;
}
