import NoteEditor from "@/components/NoteEditor";
import { getNoteById, updateNote } from "@/controllers/notes.controller";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

const UpdateNote = () => {
  const params = useLocalSearchParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const lastSavedTitle = useRef("");
  const lastSavedNote = useRef("");
  const lastSavedCategory = useRef("");
  const lastSavedPinned = useRef(false);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await getNoteById(Number(params.id));

        setTitle(data.title);
        setNote(data.note);
        setCategory(data?.category || "");
        setIsPinned(data.pinned || false);

        lastSavedTitle.current = data.title;
        lastSavedNote.current = data.note;
        lastSavedCategory.current = data?.category || "";
        lastSavedPinned.current = data.pinned || false;

        setLoaded(true);
      } catch (error) {
        console.error("Error fetching note:", error);

        Alert.alert("Error", "Failed to load note.");
      }
    };

    fetchNote();
  }, [params.id]);

  const saveNote = useCallback(async () => {
    if (!loaded) return;

    if (
      title === lastSavedTitle.current &&
      note === lastSavedNote.current &&
      category === lastSavedCategory.current
    ) {
      return;
    }

    try {
      setSaving(true);

      await updateNote(Number(params.id), {
        title,
        note,
        category,
      });

      lastSavedTitle.current = title;
      lastSavedNote.current = note;
      lastSavedCategory.current = category;
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [loaded, note, title, category, params.id]);

  useEffect(() => {
    if (!loaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveNote();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, note, category, loaded, saveNote]);

  const handleExit = async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    await saveNote();

    router.back();
  };

  const handleTogglePin = async () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    lastSavedPinned.current = newPinnedState;

    try {
      await updateNote(Number(params.id), { pinned: newPinnedState });
    } catch (error) {
      console.error("Error updating pin status:", error);
      setIsPinned(!newPinnedState);
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
      onBack={handleExit}
      onSubmit={handleExit}
      rightButtonLabel="Done"
      statusText={saving ? "Saving..." : "Saved"}
      isSaving={saving}
      isPinned={isPinned}
      onTogglePin={handleTogglePin}
    />
  );
};

export default UpdateNote;
