import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    deleteNote,
    getNoteById,
    updateNote,
} from "@/controllers/notes.controller";
import { markdownStyles } from "@/styles/note.styles";

import { ChevronLeft, Edit3, Pin, Search, Trash2 } from "lucide-react-native";

const ViewNote = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const isFocused = useIsFocused();

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function renderHighlightedParts(text: string, query: string) {
    if (!query) return [<Text key="full">{text}</Text>];
    const parts: any[] = [];
    const re = new RegExp(escapeRegExp(query), "gi");
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let i = 0;
    while ((match = re.exec(text)) !== null) {
      const start = match.index;
      const end = re.lastIndex;
      if (start > lastIndex) {
        parts.push(
          <Text key={`part-${i++}`}>{text.slice(lastIndex, start)}</Text>,
        );
      }
      parts.push(
        <Text key={`match-${i++}`} style={{ backgroundColor: "#fff59d" }}>
          {text.slice(start, end)}
        </Text>,
      );
      lastIndex = end;
    }
    if (lastIndex < text.length) {
      parts.push(<Text key={`part-${i++}`}>{text.slice(lastIndex)}</Text>);
    }
    return parts;
  }

  function stripMarkdown(md: string) {
    return md
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[#_*`>-]/g, "")
      .replace(/\n+/g, "\n")
      .trim();
  }

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await getNoteById(Number(params.id));

        setTitle(data.title);
        setNote(data.note);
        setCategory(data?.category || "");
        setUpdatedAt(data.updatedAt);
        setIsPinned(data.pinned || false);
      } catch (err) {
        console.error(err);
      }
    };
    if (!params.id) return;
    // fetch on mount and whenever the screen is focused
    if (isFocused) fetchNote();
  }, [params.id, isFocused]);

  const handleTogglePin = async () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);

    try {
      await updateNote(Number(params.id), { pinned: newPinnedState });
    } catch (error) {
      console.error("Error updating pin status:", error);
      setIsPinned(!newPinnedState);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    const id = Number(params.id);
    if (!id) {
      Alert.alert("Error", "Invalid note id");
      return;
    }

    Alert.alert("Delete note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setIsDeleting(true);
          deleteNote(id)
            .then(() => {
              router.replace("/(tabs)/home");
            })
            .catch((err) => {
              console.error("Error deleting note:", err);
              Alert.alert("Error", "Failed to delete note.");
            })
            .finally(() => setIsDeleting(false));
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EEF0F6]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity
          className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
          onPress={() => router.back()}
        >
          <ChevronLeft size={20} color="#111827" />
        </TouchableOpacity>

        <View className="flex-row gap-3">
          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
            onPress={() => setShowSearch((s) => !s)}
          >
            <Search size={18} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
            onPress={handleTogglePin}
          >
            <Pin
              size={18}
              color={isPinned ? "#000" : "#9CA3AF"}
              fill={isPinned ? "#000" : "none"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 size={18} color="#e11d48" />
          </TouchableOpacity>

          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/updateNote/[id]",
                params: { id: params.id },
              })
            }
          >
            <Edit3 size={18} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>
      {showSearch ? (
        <View className="px-5 mt-3">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search in note..."
            placeholderTextColor="#9CA3AF"
            className="rounded-2xl bg-white px-4 py-2"
          />
        </View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 80,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          className="overflow-hidden rounded-[40px] bg-white px-6 py-8 shadow-sm"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/updateNote/[id]",
              params: { id: params.id },
            })
          }
        >
          <View className="flex-row items-center justify-between gap-3">
            {category ? (
              <View className="rounded-full bg-emerald-700 px-4 py-2">
                <Text className="text-xs font-semibold text-white">
                  {category}
                </Text>
              </View>
            ) : (
              <View className="h-6" />
            )}

            <Text className="text-sm font-medium text-gray-500">
              {updatedAt}
            </Text>
          </View>

          <Text className="mt-6 text-4xl font-bold leading-tight text-[#111827]">
            {title}
          </Text>

          <View className="mt-8 space-y-5">
            {searchQuery ? (
              <Text style={{ color: "#111827", lineHeight: 24 }}>
                {renderHighlightedParts(stripMarkdown(note || ""), searchQuery)}
              </Text>
            ) : (
              <Markdown style={markdownStyles}>{note}</Markdown>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewNote;
