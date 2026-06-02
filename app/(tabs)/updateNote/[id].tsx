import { useLocalSearchParams, router } from "expo-router";
import { getNoteById, updateNote } from "@/controllers/notes.controller";
import {
    Alert,
    Pressable,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import { useEffect, useRef, useState, useCallback } from "react";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";

const SafeAreaView = styled(RNSafeAreaView);

const UpdateNote = () => {
    const params = useLocalSearchParams<{ id: string }>();

    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [category, setCategory] = useState("");

    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);

    const lastSavedTitle = useRef("");
    const lastSavedNote = useRef("");
    const lastSavedCategory = useRef("");

    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const data = await getNoteById(Number(params.id));

                setTitle(data.title);
                setNote(data.note);
                setCategory(data?.category || "");

                lastSavedTitle.current = data.title;
                lastSavedNote.current = data.note;
                lastSavedCategory.current = data?.category || "";

                setLoaded(true);
            } catch (error) {
                console.error("Error fetching note:", error);

                Alert.alert(
                    "Error",
                    "Failed to load note."
                );
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
                category
            });

            lastSavedTitle.current = title;
            lastSavedNote.current = note;
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }, [loaded, note, title, category,params.id]);

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
    }, [title, note, loaded, saveNote]);

    const handleExit = async () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        await saveNote();

        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F6F7F9]">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* Header */}
                <View className="flex-row items-center justify-between px-5 py-3">
                    <Pressable
                        onPress={handleExit}
                        className="h-10 w-10 items-center justify-center rounded-full bg-white"
                    >
                        <ChevronLeft
                            size={20}
                            color="#111827"
                        />
                    </Pressable>

                    <View className="flex-row items-center gap-4">
                        <Text className="text-sm text-gray-500">
                            {saving ? "Saving..." : "Saved"}
                        </Text>

                        <Pressable
                            onPress={handleExit}
                            className="rounded-full bg-black px-4 py-2"
                        >
                            <Text className="font-semibold text-white">
                                Done
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Editor */}
                <View className="flex-1 px-6">
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Title"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        className="text-[34px] font-bold text-gray-900"
                    />

                    <TextInput
                        value={category}
                        onChangeText={setCategory}
                        placeholder="Category"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        className="text-[34px] font-bold text-gray-900"
                    />

                    <TextInput
                        value={note}
                        onChangeText={setNote}
                        placeholder="Start writing..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                        className="mt-6 flex-1 text-base text-gray-700"
                        style={{
                            lineHeight: 28,
                        }}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default UpdateNote;