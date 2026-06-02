import {Text} from "react-native";
import { styled } from "nativewind";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { Link } from "expo-router";

const SafeAreaView = styled(RNSafeAreaView);


export default function home(){
    return(
        <SafeAreaView className="flex-1 items-center justify-center bg-slate-950">
             <Text className="text-2xl font-bold text-white">
          Home Screen
          <Link href={{ pathname: "/(tabs)/viewNote/[id]", params: { id: 1 } }} 
          className="text-blue-500">
            Read Note with ID 1
          </Link>

          <Link href={{ pathname: "/(tabs)/viewNote/[id]", params: { id: 2 } }} 
          className="text-blue-500">
            Read Note with ID 2
          </Link>
          
        </Text>
        </SafeAreaView>
    )
}
