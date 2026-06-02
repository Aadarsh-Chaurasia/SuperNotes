export function stripMarkdown(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#_*`>-]/g, "")
    .replace(/\n+/g, "\n")
    .trim();
}

export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}