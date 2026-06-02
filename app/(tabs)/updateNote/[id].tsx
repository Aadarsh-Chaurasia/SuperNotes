import { useLocalSearchParams } from "expo-router";
import {getNoteById} from "@/controllers/notes.controller";
import {Text} from "react-native";
import { useEffect, useState } from "react";
import { styled } from "nativewind";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const UpdateNote = () => {
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
            <Text>{note}</Text>
        </SafeAreaView>
    );
}

export default UpdateNote;
