import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import {router} from 'expo-router'
import Ionicons from "@expo/vector-icons/Ionicons";


const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {},
          headerShadowVisible: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace("/(root)/(tabs)/home")}
            >
              <Ionicons name="arrow-back" color="black" size={25} />
            </TouchableOpacity>
          ),
          // headerRight: () => (
          //   <TouchableOpacity style={{ paddingRight: 10 }}>
          //     <SettingsIcon color="white" name="settings" size={25} />
          //   </TouchableOpacity>
          // ),
        }}
      />
    </Stack>
  );
};
export default Layout;
