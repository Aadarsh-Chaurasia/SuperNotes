import { View, Text } from "react-native";
import { Link } from "expo-router";
import { styled } from "nativewind";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);


export default function Index() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-950">
      <View className="rounded-3xl bg-blue-500 px-8 py-6 shadow-lg">
        <Text className="text-2xl font-bold text-white">
          NativeWind v5 Works 🚀
        </Text>
      </View>
      <Link href="/(auth)/signin" className="text-white">
        Sign In
      </Link>
      <Link href="/(auth)/signup" className="text-white">
        Sign Up
      </Link>
    </SafeAreaView>
  );
}