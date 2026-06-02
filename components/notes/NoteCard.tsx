import { useTheme } from "@/context/ThemeProvider";
import { router } from "expo-router";
import { Pressable, Text } from "react-native";

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

export default function NoteCard({ id, title, note }: NoteCardProps) {
  const preview = getPreview(note);

  const { palette } = useTheme();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(tabs)/viewNote/[id]",
          params: { id },
        })
      }
      className="flex-1 rounded-3xl border p-4"
      style={{
        backgroundColor: palette.card,
        borderColor: palette.border,
      }}
    >
      <Text
        className="text-lg font-bold"
        style={{ color: palette.text }}
        numberOfLines={2}
      >
        {title}
      </Text>

      <Text className="mt-3" style={{ color: palette.muted }} numberOfLines={8}>
        {preview}
      </Text>
    </Pressable>
  );
}
