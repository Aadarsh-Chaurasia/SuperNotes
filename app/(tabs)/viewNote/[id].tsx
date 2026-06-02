import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";

import { getNoteById } from "@/controllers/notes.controller";
import { markdownStyles } from "@/styles/note.styles";

import {
    ChevronLeft,
    Ellipsis,
    Search,
} from "lucide-react-native";

const ViewNote = () => {
    const params = useLocalSearchParams<{ id: string }>();

    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [category, setCategory] = useState("");
    const [updatedAt, setUpdatedAt] = useState("");

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const data = await getNoteById(Number(params.id));

                setTitle(data.title);
                setNote(data.note);
                setCategory(data?.category || "");
                setUpdatedAt(data.updatedAt);
            } catch (err) {
                console.error(err);
            }
        };

        fetchNote();
    }, [params.id]);

    return (
        <SafeAreaView className="flex-1 bg-[#F6F7F9]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-3">
                <TouchableOpacity
                    className="h-10 w-10 items-center justify-center rounded-full bg-white"
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={20} color="#111827" />
                </TouchableOpacity>

                <View className="flex-row gap-2">
                    <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white">
                        <Search size={18} color="#111827" />
                    </TouchableOpacity>

                    <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white">
                        <Ellipsis size={18} color="#111827" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: 80,
                }}
            >
                {/* Category Tag */}
                <View className="self-start rounded-xl bg-teal-700 px-3 py-1">
                    <Text className="text-xs font-medium text-white">
                        {category}
                    </Text>
                </View>

                {/* Date */}
                <Text className="mt-4 text-sm text-gray-500">
                    {updatedAt}
                </Text>

                {/* Title */}
                <Text className="mt-3 text-[36px] font-bold leading-10.5 text-gray-900">
                    {title}
                </Text>

                {/* Content */}
                <View className="mt-8">
                    <Markdown style={markdownStyles}>
                        {note}
                    </Markdown>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewNote;