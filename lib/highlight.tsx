import React from "react";
import { Text } from "react-native";

export function renderHighlightedParts(
  text: string,
  query: string,
  palette: any
) {
  if (!query) return [<Text key="full">{text}</Text>];

  const re = new RegExp(
    query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "gi"
  );

  const parts = [];

  let lastIndex = 0;
  let match;
  let i = 0;

  while ((match = re.exec(text)) !== null) {
    const start = match.index;
    const end = re.lastIndex;

    if (start > lastIndex) {
      parts.push(
        <Text key={`part-${i++}`}>
          {text.slice(lastIndex, start)}
        </Text>
      );
    }

    parts.push(
      <Text
        key={`match-${i++}`}
        style={{
          backgroundColor:
            palette.highlightBackground,
          color: palette.text,
        }}
      >
        {text.slice(start, end)}
      </Text>
    );

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    parts.push(
      <Text key={`part-${i++}`}>
        {text.slice(lastIndex)}
      </Text>
    );
  }

  return parts;
}