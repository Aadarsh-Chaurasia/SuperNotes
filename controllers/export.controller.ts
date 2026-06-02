import { exportMarkdownNote } from "@/services/export.service";

export async function exportNote(
  title: string,
  note: string
) {
  return exportMarkdownNote(title, note);
}