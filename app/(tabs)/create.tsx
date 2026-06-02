import NoteEditor from "@/components/NoteEditor";
import { createNote, updateNote } from "@/controllers/notes.controller";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [noteId, setNoteId] = useState<number | null>(null);

  const lastSavedTitle = useRef("");
  const lastSavedNote = useRef("");
  const lastSavedCategory = useRef("");

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      // if no note created yet, create one
      try {
        setSaving(true);

        if (!noteId) {
          const created = await createNote(title, note, category, isPinned);
          setNoteId(created.id);

          lastSavedTitle.current = created.title || title;
          lastSavedNote.current = created.note || note;
          lastSavedCategory.current = created.category || category;
        } else {
          // only send updates if changed
          if (
            title !== lastSavedTitle.current ||
            note !== lastSavedNote.current ||
            category !== lastSavedCategory.current
          ) {
            await updateNote(noteId, { title, note, category });
            lastSavedTitle.current = title;
            lastSavedNote.current = note;
            lastSavedCategory.current = category;
          }
        }
      } catch (err) {
        console.error("Autosave error:", err);
      } finally {
        setSaving(false);
      }
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [title, note, category, isPinned, noteId]);

  const handleCreate = async () => {
    // ensure saved then navigate home
    setSaving(true);
    try {
      if (!noteId) {
        const created = await createNote(title, note, category, isPinned);
        setNoteId(created.id);
      } else {
        await updateNote(noteId, { title, note, category, pinned: isPinned });
      }

      router.push("/(tabs)/home");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePin = async () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);

    if (noteId) {
      try {
        await updateNote(noteId, { pinned: newPinned });
      } catch (err) {
        console.error("Error toggling pin:", err);
        setIsPinned(!newPinned);
      }
    }
  };

  return (
    <NoteEditor
      title={title}
      category={category}
      note={note}
      onTitleChange={setTitle}
      onCategoryChange={setCategory}
      onNoteChange={setNote}
      onBack={() => router.back()}
      onSubmit={handleCreate}
      rightButtonLabel="Save"
      statusText={saving ? "Saving..." : undefined}
      isSaving={saving}
      isPinned={isPinned}
      onTogglePin={handleTogglePin}
    />
  );
};

export default CreateNote;
