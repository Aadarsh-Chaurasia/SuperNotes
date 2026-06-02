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

  return (
  <Tabs 
            screenOptions={{
                headerShown: false, // Hide the header
                tabBarShowLabel: false, // Hide the name on icon
                tabBarStyle: { // Custom styles for the tab bar
                    position: 'absolute',
                    bottom: Math.max(insets.bottom, tabBar.horizontalInset), // Ensure the tab bar is above the safe area
                    height: tabBar.height,
                    marginHorizontal: tabBar.horizontalInset,
                    borderRadius: tabBar.radius,
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarItemStyle: { // Custom styles for the tab bar items
                    paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6, // Center the icon vertically
                },
                tabBarIconStyle: { // Custom styles for the tab bar icons
                    width: tabBar.iconFrame,
                    height: tabBar.iconFrame,
                    alignItems: 'center',
                },
            }}
        >
            {tabs.map((tab) => (
            <Tabs.Screen 
                key={tab.name} 
                name={tab.name} 
                options={{
                    title: tab.title,
                    tabBarIcon: ({focused}) => 
                        <TabIcon focused={focused} icon={tab.icon} />
                }} />
            ))}
        </Tabs>
  );
}