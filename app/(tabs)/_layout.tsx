import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthProvider";
import { View, ActivityIndicator,Image } from "react-native";
import { Tabs } from "expo-router"
import { tabs } from "../../constants/data";
import clsx from "clsx";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { colors, components } from "../../constants/theme";

const tabBar = components.tabBar;

export default function TabLayout() {
  const { session, loading } = useAuth();

  const insets = useSafeAreaInsets();

    const TabIcon = ({focused, icon} : TabIconProps) => {
        // React Component for rendering the tab icon with a pill background when focused
        return (
        <View className="tabs-icon">
            <View className={clsx('tabs-pill', focused && 'tabs-active')}>
                <Image source={icon} resizeMode="contain" className="tabs-glyph" />
            </View>
        </View>
    )
    };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/signin" />;
  }

//   
return (
    <Stack screenOptions={{ headerShown: false }} />
)
}