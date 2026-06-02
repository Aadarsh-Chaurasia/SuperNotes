import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  page: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    marginTop: 40,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  footer: {
    marginTop: 40,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    opacity: 0.8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  cardDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  footerText: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  selectedBadge: {
    marginTop: 16,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  selectedBadgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
