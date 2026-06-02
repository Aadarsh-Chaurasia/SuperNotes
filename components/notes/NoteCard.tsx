import { Pressable, Text } from "react-native";
import { router } from "expo-router";

type NoteCardProps = {
  id: number;
  title: string;
  note: string;
};

function getPreview(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#*_`>-]/g, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function NoteCard({
  id,
  title,
  note,
}: NoteCardProps) {
  const preview = getPreview(note);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(tabs)/viewNote/[id]",
          params: { id },
        })
      }
      className="flex-1 rounded-3xl border border-neutral-200 bg-white p-4"
    >
      <Text
        className="text-lg font-bold text-neutral-900"
        numberOfLines={2}
      >
        {title}
      </Text>

      <Text
        className="mt-3 text-neutral-600"
        numberOfLines={8}
      >
        {preview}
      </Text>
    </Pressable>
  );
}