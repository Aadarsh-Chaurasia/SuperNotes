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

export async function createNote(title: string, note: string): Promise<Note> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("notes")
        .insert([
            {
                user_id: user.id,
                title,
                note,
            },
        ])
        .select()
        .single();

    if (error) throw error;

    console.log("Note created:", data);
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


export async function updateNote(id: number, updates: { title?: string; note?: string; category?: string }) {
    const { data, error } = await supabase
        .from("notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
}