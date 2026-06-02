import { ThemePalette } from "./theme.styles";

export const baseMarkdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 30,
  },

  paragraph: {
    marginBottom: 24,
    lineHeight: 30,
  },

  heading1: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
  },

  heading2: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 18,
  },

  heading3: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 18,
  },

  code_block: {
    padding: 16,
    borderRadius: 12,
  },

  blockquote: {
    borderLeftWidth: 4,
    paddingLeft: 12,
  },
};

export const createMarkdownStyles = (palette: ThemePalette) => ({
  ...baseMarkdownStyles,
  body: {
    ...baseMarkdownStyles.body,
    color: palette.text,
    backgroundColor: "transparent",
  },
  heading1: {
    ...baseMarkdownStyles.heading1,
    color: palette.text,
  },
  heading2: {
    ...baseMarkdownStyles.heading2,
    color: palette.text,
  },
  heading3: {
    ...baseMarkdownStyles.heading3,
    color: palette.text,
  },
  code_block: {
    ...baseMarkdownStyles.code_block,
    backgroundColor: palette.surfaceAlt,
    color: palette.text,
  },
  fence: {
    ...baseMarkdownStyles.code_block,
    backgroundColor: palette.surfaceAlt,
    color: palette.text,
  },
  code_inline: {
    backgroundColor: palette.surfaceAlt,
    color: palette.text,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  pre: {
    ...baseMarkdownStyles.code_block,
    backgroundColor: palette.surfaceAlt,
    color: palette.text,
  },
  blockquote: {
    ...baseMarkdownStyles.blockquote,
    borderLeftColor: palette.border,
    backgroundColor: palette.surfaceAlt,
    color: palette.muted,
  },
});
