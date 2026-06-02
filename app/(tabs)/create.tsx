import {Text, Pressable} from 'react-native'
import React, {useState} from "react";
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import {createNote} from "@/controllers/notes.controller";



const SafeAreaView = styled(RNSafeAreaView);

const Index = () => {
  const [loading, setLoading] = useState(false);
  const handleNoteCreation = async () => {
      setLoading(true);
      const data = await createNote("Test Note", "This is a test note created from the test file. \n # This is a heading \n ## This is a subheading \n - This is a list item \n **This text is bold** \n _This text is italic_ \n `This is inline code` \n ```\n This is a code block \n```");
      console.log("Created Note:", data);
      setLoading(false);
  }
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>index</Text>
       <Pressable
              onPress={handleNoteCreation}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#999" : "#000",
                padding: 20,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>
                {loading ? "Saving note..." : "Save"}
              </Text>
            </Pressable>
    </SafeAreaView>
  )
}

export default Index