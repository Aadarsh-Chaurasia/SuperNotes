import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { useTheme } from "@/context/ThemeProvider";
import {
    deleteNote,
    getNoteById,
    updateNote,
} from "@/controllers/notes.controller";
import { createMarkdownStyles } from "@/styles/note.styles";

import { ChevronLeft, Download, Edit3, Pin, Search, Trash2 } from "lucide-react-native";

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
  const [toastMessage, setToastMessage] = useState("");
  const { palette } = useTheme();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

const handleExport = async () => {
  try {
    if (!title) {
      Alert.alert("Error", "Note title is required to export.");
      return;
    }

    const cleanTitle =
      title.replace(/[/\\?%*:|"<>]/g, "-") || "note";

    const fileName = `${cleanTitle}.md`;

    // Preserve markdown exactly for Obsidian
    const markdownContent = `# ${title}\n\n${note}`;

    const file = new File(Paths.cache, fileName);

    await file.write(markdownContent);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri);
      showToast(`Exported successfully`);
    } else {
      Alert.alert(
        "Error",
        "Sharing is not available on this device."
      );
    }
  } catch (err) {
    console.error("Export error:", err);
    Alert.alert("Error", "Failed to export note.");
  }
};

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
        <Text
          key={`match-${i++}`}
          style={{
            backgroundColor: palette.highlightBackground,
            color: palette.text,
          }}
        >
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background }}
    >
      {toastMessage ? (
        <View
          style={{
            position: "absolute",
            bottom: 40,
            left: 20,
            right: 20,
            backgroundColor: palette.accentStrong,
            padding: 16,
            borderRadius: 16,
            zIndex: 9999,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text style={{ color: palette.selectedText, fontWeight: "600" }}>
            {toastMessage}
          </Text>
        </View>
      ) : null}

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity
          className="h-11 w-11 items-center justify-center rounded-full shadow-sm"
          onPress={() => router.back()}
          style={{ backgroundColor: palette.surface }}
        >
          <ChevronLeft size={20} color={palette.icon} />
        </TouchableOpacity>

        <View className="flex-row gap-3">
          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full shadow-sm"
            onPress={() => setShowSearch((s) => !s)}
            style={{ backgroundColor: palette.surface }}
          >
            <Search size={18} color={palette.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full shadow-sm"
            onPress={handleTogglePin}
            style={{ backgroundColor: palette.surface }}
          >
            <Pin
              size={18}
              color={isPinned ? palette.accentStrong : palette.placeholder}
              fill={isPinned ? palette.accentStrong : "none"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full shadow-sm"
            onPress={handleDelete}
            disabled={isDeleting}
            style={{ backgroundColor: palette.surface }}
          >
            <Trash2 size={18} color={palette.accentStrong} />
          </TouchableOpacity>

          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full shadow-sm"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/updateNote/[id]",
                params: { id: params.id },
              })
            }
            style={{ backgroundColor: palette.surface }}
          >
            <Edit3 size={18} color={palette.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full shadow-sm"
            onPress={handleExport}
            style={{ backgroundColor: palette.surface }}
          >
            <Download size={18} color={palette.icon} />
          </TouchableOpacity>
        </View>
      </View>
      {showSearch ? (
        <View className="px-5 mt-3">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search in note..."
            placeholderTextColor={palette.placeholder}
            className="rounded-2xl px-4 py-2"
            style={{ backgroundColor: palette.surface, color: palette.text }}
          />
        </View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: palette.background }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 80,
          backgroundColor: palette.background,
          flexGrow: 1,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          className="overflow-hidden rounded-[40px] px-6 py-8 shadow-sm"
          style={{ backgroundColor: palette.surface }}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/updateNote/[id]",
              params: { id: params.id },
            })
          }
        >
          <View className="flex-row items-center justify-between gap-3">
            {category ? (
              <View
                className="rounded-full px-4 py-2"
                style={{ backgroundColor: palette.accent }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: palette.selectedText }}
                >
                  {category}
                </Text>
              </View>
            ) : (
              <View className="h-6" />
            )}

            <Text
              className="text-sm font-medium"
              style={{ color: palette.muted }}
            >
              {updatedAt}
            </Text>
          </View>

          <Text
            className="mt-6 text-4xl font-bold leading-tight"
            style={{ color: palette.text }}
          >
            {title}
          </Text>

          <View className="mt-8 space-y-5">
            {searchQuery ? (
              <Text style={{ color: palette.text, lineHeight: 24 }}>
                {renderHighlightedParts(stripMarkdown(note || ""), searchQuery)}
              </Text>
            ) : (
              <Markdown style={createMarkdownStyles(palette)}>{note}</Markdown>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewNote;
