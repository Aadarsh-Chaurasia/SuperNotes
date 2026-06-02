import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { Plus, Search, Settings } from "lucide-react-native";

import { getNotes } from "@/controllers/notes.controller";
import NoteCard from "@/components/notes/NoteCard";

const SafeAreaView = styled(RNSafeAreaView);

type Note = {
  id: number;
  title: string;
  note: string;
  pinned: boolean;
  category: string | null;
  created_at: string;
  updated_at: string | null;
  user_id: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await getNotes();

      console.log("Fetched Notes:", data);

      if (Array.isArray(data)) {
        setNotes(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) =>
      `${note.title} ${note.note}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [notes, search]);

  const pinnedNotes = filteredNotes.filter(
    (note) => note.pinned
  );

  const otherNotes = filteredNotes.filter(
    (note) => !note.pinned
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FC]">
      {/* Header */}
      <View className="px-5 pt-4">
        <View className="flex-row items-center">
          <Text className="text-4xl font-bold text-black">Notes</Text>

          <View className="ml-4 flex-1 flex-row items-center rounded-2xl bg-white px-4 py-3">
            <Search size={18} color="#737373" />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search notes..."
              className="ml-3 flex-1"
            />

            <Pressable
              onPress={() =>
                router.push({ pathname: "/(tabs)/profile" })
              }
              className="ml-3 rounded-full p-2"
            >
              <Settings size={20} color="#737373" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Pinned */}
      {pinnedNotes.length > 0 && (
        <>
          <Text className="px-5 pt-6 pb-3 text-xl font-bold">
            Pinned
          </Text>

          <FlatList
            data={pinnedNotes}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={{
              gap: 12,
              paddingHorizontal: 16,
              marginBottom: 12,
            }}
            renderItem={({ item }) => (
              <View style={{ flex: 1 }}>
                <NoteCard
                  id={item.id}
                  title={item.title}
                  note={item.note}
                />
              </View>
            )}
          />
        </>
      )}

      {/* Other */}
      <Text className="px-5 pt-4 pb-3 text-xl font-bold">
        Other
      </Text>

      <FlatList
        data={otherNotes}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{
          gap: 12,
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <NoteCard
              id={item.id}
              title={item.title}
              note={item.note}
            />
          </View>
        )}
      />

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/create")}
        className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-black"
      >
        <Plus
          size={28}
          color="white"
        />
      </Pressable>
    </SafeAreaView>
  );
}