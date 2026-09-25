import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";

const projectIdSchema = z.string().uuid();
const updateProjectSchema = z.object({ title: z.string().trim().min(1).max(120) });

type ProjectRouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: ProjectRouteContext) {
  const projectId = await getProjectId(params);
  if (!projectId) return errorResponse("INVALID_PROJECT_ID", "The project id is invalid.", 400);

  const supabase = await getAuthenticatedClient();
  if (!supabase) return errorResponse("UNAUTHENTICATED", "Sign in is required.", 401);

  const { data, error } = await supabase
    .from("projects")
    .select("id,title,room_type,original_image_path,created_at,updated_at,generations(id,status,style_id,settings,result_image_path,error_code,created_at,completed_at)")
    .eq("id", projectId)
    .maybeSingle();

  if (error) return errorResponse("PROJECT_READ_FAILED", "The project could not be loaded.", 500);
  if (!data) return errorResponse("PROJECT_NOT_FOUND", "The project was not found.", 404);
  return NextResponse.json({ project: data });
}

export async function PATCH(request: Request, { params }: ProjectRouteContext) {
  const projectId = await getProjectId(params);
  if (!projectId) return errorResponse("INVALID_PROJECT_ID", "The project id is invalid.", 400);

  const supabase = await getAuthenticatedClient();
  if (!supabase) return errorResponse("UNAUTHENTICATED", "Sign in is required.", 401);

  const parsed = updateProjectSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse("INVALID_PROJECT", "A project title is required.", 400);

  const { data, error } = await supabase
    .from("projects")
    .update({ title: parsed.data.title, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select("id,title,room_type,original_image_path,created_at,updated_at")
    .maybeSingle();

  if (error) return errorResponse("PROJECT_UPDATE_FAILED", "The project could not be updated.", 500);
  if (!data) return errorResponse("PROJECT_NOT_FOUND", "The project was not found.", 404);
  return NextResponse.json({ project: data });
}

export async function DELETE(_request: Request, { params }: ProjectRouteContext) {
  const projectId = await getProjectId(params);
  if (!projectId) return errorResponse("INVALID_PROJECT_ID", "The project id is invalid.", 400);

  const supabase = await getAuthenticatedClient();
  if (!supabase) return errorResponse("UNAUTHENTICATED", "Sign in is required.", 401);

  const { data, error } = await supabase.from("projects").delete().eq("id", projectId).select("id").maybeSingle();
  if (error) return errorResponse("PROJECT_DELETE_FAILED", "The project could not be deleted.", 500);
  if (!data) return errorResponse("PROJECT_NOT_FOUND", "The project was not found.", 404);
  return new NextResponse(null, { status: 204 });
}

async function getProjectId(params: ProjectRouteContext["params"]) {
  const { id } = await params;
  const parsed = projectIdSchema.safeParse(id);
  return parsed.success ? parsed.data : null;
}

async function getAuthenticatedClient() {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  return claims?.claims?.sub ? supabase : null;
}

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ code, message, requestId: crypto.randomUUID() }, { status });
}
