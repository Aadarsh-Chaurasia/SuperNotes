import { useTheme } from "@/context/ThemeProvider";
import { profileStyles } from "@/styles/profile.styles";
import {
    themeOptions,
    themePalette,
    type ThemeKey,
} from "@/styles/theme.styles";
import { styled } from "nativewind";
import { Pressable, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import handleLogout from "@/utils/authHandler.util";

const SafeAreaView = styled(RNSafeAreaView);

type ThemeOption = {
  key: ThemeKey;
  label: string;
  description: string;
};

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const currentTheme = themePalette[theme as ThemeKey];

  return (
    <SafeAreaView
      className="profile-screen"
      style={[
        profileStyles.screen,
        { backgroundColor: currentTheme.background },
      ]}
    >
      <View style={profileStyles.page}>
        <Text style={[profileStyles.title, { color: currentTheme.text }]}>
          Profile
        </Text>
        <Text style={[profileStyles.subtitle, { color: currentTheme.text }]}>
          Choose the theme to use across the app.
        </Text>

        <View className="profile-section">
          {themeOptions.map((item: ThemeOption) => {
            const isActive = item.key === theme;
            const optionTheme = themePalette[item.key as ThemeKey];
            return (
              <Pressable
                key={item.key}
                onPress={() => void setTheme(item.key)}
                className="profile-card"
                style={[
                  profileStyles.card,
                  {
                    backgroundColor: optionTheme.surface,
                    borderColor: isActive
                      ? currentTheme.accent
                      : optionTheme.border,
                    shadowColor: isActive ? currentTheme.accent : "#000",
                    shadowOpacity: isActive ? 0.15 : 0,
                    shadowOffset: { width: 0, height: 12 },
                    shadowRadius: 18,
                    elevation: isActive ? 10 : 0,
                  },
                ]}
              >
                <Text
                  style={[profileStyles.cardTitle, { color: optionTheme.text }]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[
                    profileStyles.cardDescription,
                    { color: optionTheme.muted },
                  ]}
                >
                  {item.description}
                </Text>
                {isActive ? (
                  <View
                    style={[
                      profileStyles.selectedBadge,
                      { backgroundColor: currentTheme.accent },
                    ]}
                  >
                    <Text
                      style={[
                        profileStyles.selectedBadgeText,
                        { color: currentTheme.selectedText },
                      ]}
                    >
                      Selected
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        
      </View>
      <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginTop: 30,
            backgroundColor: "red",
            padding: 14,
            borderRadius: 8,
            margin: 24,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Log Out
          </Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}
