import { supabase } from "@/lib/supabase";

export type Note = {
  id: number;
  title: string;
  note: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  category?: string;
};

export async function createNote(
  title: string,
  note: string,
  category?: string,
  pinned?: boolean,
): Promise<Note> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const payload: any = {
    user_id: user.id,
    title,
    note,
  };

  if (typeof category !== "undefined") payload.category = category;
  if (typeof pinned !== "undefined") payload.pinned = pinned;

  const { data, error } = await supabase
    .from("notes")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;

  // console.log("Note created:", data);
  return data;
}

// data ->  {"created_at": "2026-06-02T11:02:50.122636+00:00", "id": 1, "note": "This is a test note created from the test file.", "title": "Test Note", "user_id": "0e00fe90-a154-475a-b72a-a46d9b6a12cd"}

export async function getNoteById(id: number) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getNotes() {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function updateNote(
  id: number,
  updates: {
    title?: string;
    note?: string;
    category?: string;
    pinned?: boolean;
  },
) {
  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteNote(id: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Attempt delete scoped to the current user when possible (helps with RLS)
  let query = supabase.from("notes").delete().eq("id", id);
  if (user?.id) query = query.eq("user_id", user.id);

  const { data, error } = await query.select().maybeSingle();

  if (error) throw error;

  return data || null;
}
