import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  const next = requestUrl.searchParams.get("next");
  const destination = next === "/en/reset-password" || next === "/ru/reset-password" ? next : "/en/projects";
  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}
