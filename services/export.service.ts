import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

export async function exportMarkdownNote(
  title: string,
  content: string
) {
  const cleanTitle =
    title.replace(/[/\\?%*:|"<>]/g, "-") || "note";

  const fileName = `${cleanTitle}.md`;

  const markdownContent = `# ${title}\n\n${content}`;

  const file = new File(Paths.cache, fileName);

  await file.write(markdownContent);

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Sharing is not available");
  }

  await Sharing.shareAsync(file.uri);

  return fileName;
}