import { AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider, useTheme } from "@/context/ThemeProvider";
import "@/global.css";
import { themePalette } from "@/styles/theme.styles";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootContent() {
  const { theme } = useTheme();
  const palette = themePalette[theme];

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </SafeAreaProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootContent />
    </ThemeProvider>
  );
}
