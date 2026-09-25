import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";

const projectSchema = z.object({ title: z.string().trim().min(1).max(120), roomType: z.string().trim().min(1).max(80) });

export async function GET() {
  if (!hasSupabaseEnv()) return NextResponse.json({ code: "SUPABASE_NOT_CONFIGURED", message: "Supabase is not configured." }, { status: 503 });
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ code: "UNAUTHENTICATED", message: "Sign in is required." }, { status: 401 });
  const { data, error } = await supabase.from("projects").select("id,title,room_type,original_image_path,created_at,updated_at").order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ code: "PROJECTS_READ_FAILED", message: "Projects could not be loaded." }, { status: 500 });
  return NextResponse.json({ projects: data });
}

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) return NextResponse.json({ code: "SUPABASE_NOT_CONFIGURED", message: "Supabase is not configured." }, { status: 503 });
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return NextResponse.json({ code: "UNAUTHENTICATED", message: "Sign in is required." }, { status: 401 });
  const parsed = projectSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ code: "INVALID_PROJECT", message: "A title and room type are required." }, { status: 400 });
  const { data, error } = await supabase.from("projects").insert({ user_id: userId, title: parsed.data.title, room_type: parsed.data.roomType }).select("id,title,room_type,created_at,updated_at").single();
  if (error) return NextResponse.json({ code: "PROJECT_CREATE_FAILED", message: "The project could not be created." }, { status: 500 });
  return NextResponse.json({ project: data }, { status: 201 });
}
