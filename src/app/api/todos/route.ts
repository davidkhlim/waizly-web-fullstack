import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const { data } = await supabase.from("todos").select().order("updated_at", {
    ascending: false,
  });
  return Response.json({ data });
}

export async function DELETE(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const id = request.nextUrl.searchParams.get("id");
  const { data } = await supabase.from("todos").delete().eq("id", id);
  return Response.json({ data });
}
export async function POST(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const body = await request.json();

  const { data } = await supabase.from("todos").insert({
    title: body.title,
    description: body.description,
    priority: body.priority,
    due_date: new Date(body.dueDatetime),
    updated_at: new Date(),
  });
  return Response.json({ data });
}

export async function PUT(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const body = await request.json();
  const id = request.nextUrl.searchParams.get("id");
  const { data, error } = await supabase
    .from("todos")
    .update({
      title: body.title,
      description: body.description,
      priority: body.priority,
      due_date: new Date(body.due_date),
      is_done: body.is_done,
      updated_at: new Date(),
    })
    .eq("id", id);

  return Response.json({ data });
}
