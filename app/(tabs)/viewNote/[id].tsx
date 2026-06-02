import { useLocalSearchParams } from "expo-router";
import {getNoteById} from "@/controllers/notes.controller";
import {Text} from "react-native";
import { useEffect, useState } from "react";
import { styled } from "nativewind";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";

const SafeAreaView = styled(RNSafeAreaView);

const markdownStyles = {
  body: { color: "#111827", fontSize: 14 }, // text-gray-900
  heading1: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  heading2: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  paragraph: { marginBottom: 10, lineHeight: 20 },
  link: { color: "#2563eb" }, // blue-600
  list_item: { marginBottom: 4 },
  code_block: {
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 6,
    fontFamily: "monospace",
  },
};

const ViewNote = () => {
    const params = useLocalSearchParams<{id:string}>()
    const [note, setNote] = useState("");
    console.log("Received ID:", params);
    console.log("Received ID (parsed):", typeof(Number(params.id)));

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const note = await getNoteById(Number(params.id));
                console.log("Fetched Note:", note);
                setNote(note.note);
            } catch (error) {
                console.error("Error fetching note:", error);
            }
        };

        fetchNote();
    }, [params.id]);

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Markdown style={markdownStyles}>
                {note}
            </Markdown>
        </SafeAreaView>
    );
}

export default ViewNote;
