import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { icons } from "@/constants";
import meditate from "@/assets/icons/meditate_icon.png";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View className={`flex flex-row justify-center items-center rounded-full `}>
    <View
      className={`rounded-full w-12 h-12 items-center justify-center`}
    >
      <Ionicons name={source} size={24} color={focused ? "white" : "gray"} />
    </View>
  </View>
);

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#253334",
          overflow: "hidden",
          height: 78,
          paddingBottom: 25,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
          borderTopWidth: 0, // Remove the top border
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
        },
      }}
    >
      {/* <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.chat} focused={focused} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source="home" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              className={`flex flex-row justify-center items-center rounded-full `}
            >
              <View
                className={`rounded-full w-12 h-12 items-center justify-center`}
              >
                <FontAwesome5 name="book" size={24} color={focused ? "white" : "gray"} />
              </View>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="meditate"
        options={{
          title: "Meditate",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              className={`rounded-full w-12 h-12 items-center justify-center`}
            >
              <Image
                source={meditate}
                tintColor={focused ? "white" : "gray"}
                resizeMode="contain"
                className="w-9 h-9"
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
