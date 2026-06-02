import { ChevronLeft, Pin, Search } from "lucide-react-native";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

type NoteEditorProps = {
  title: string;
  category: string;
  note: string;
  onTitleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onBack: () => void;
  onSubmit?: () => void;
  rightButtonLabel?: string;
  statusText?: string;
  isSaving?: boolean;
  isPinned?: boolean;
  onTogglePin?: () => void;
};

export default function NoteEditor({
  title,
  category,
  note,
  onTitleChange,
  onCategoryChange,
  onNoteChange,
  onBack,
  onSubmit,
  rightButtonLabel = "Done",
  statusText,
  isSaving,
  isPinned,
  onTogglePin,
}: NoteEditorProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
  return (
    <SafeAreaView className="flex-1 bg-[#F6F7F9]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable
            onPress={onBack}
            className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ChevronLeft size={20} color="#111827" />
          </Pressable>

          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => setShowSearch((s) => !s)}
              className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <Search size={18} color="#111827" />
            </Pressable>
            {onTogglePin ? (
              <Pressable
                onPress={onTogglePin}
                className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
              >
                <Pin
                  size={18}
                  color={isPinned ? "#000" : "#9CA3AF"}
                  fill={isPinned ? "#000" : "none"}
                />
              </Pressable>
            ) : null}

            {statusText ? (
              <Text className="text-sm text-gray-500">{statusText}</Text>
            ) : null}

            {onSubmit ? (
              <Pressable
                onPress={onSubmit}
                className="rounded-full bg-black px-4 py-2"
                disabled={isSaving}
              >
                <Text className="font-semibold text-white">
                  {isSaving ? "Saving..." : rightButtonLabel}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <View className="flex-1 px-6">
          {showSearch ? (
            <View className="mb-3 rounded-2xl bg-white px-3 py-2">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search in note..."
                placeholderTextColor="#9CA3AF"
                className="text-sm"
              />
            </View>
          ) : null}
          <TextInput
            value={title}
            onChangeText={onTitleChange}
            placeholder="Title"
            placeholderTextColor="#9CA3AF"
            multiline
            className="text-[34px] font-bold text-gray-900"
          />

          <TextInput
            value={category}
            onChangeText={onCategoryChange}
            placeholder="Category"
            placeholderTextColor="#9CA3AF"
            multiline
            className="text-[16px] font-bold text-gray-500"
          />

          <View className="mt-1 flex-1">
            {searchQuery ? (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 0,
                  paddingHorizontal: 0,
                }}
                pointerEvents="none"
              >
                <Text style={{ lineHeight: 28, color: "#111827" }}>
                  {renderHighlightedParts(note || "", searchQuery)}
                </Text>
              </View>
            ) : null}

            <TextInput
              value={note}
              onChangeText={onNoteChange}
              placeholder="Start writing..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              className="mt-1 flex-1 text-base text-gray-700"
              style={{
                lineHeight: 28,
                backgroundColor: "transparent",
                zIndex: 1,
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
