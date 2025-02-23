import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

import { icons } from "@/constants";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View className={`flex flex-row justify-center items-center rounded-full `}>
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${
        focused ? "bg-general-400" : ""
      }`}
    >
      <Ionicons name={source} size={24} color="white" />
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
          backgroundColor: "#333333",
          // borderRadius: 50,
          overflow: "hidden",
          // marginHorizontal: 20,
          // marginBottom: 20,
          height: 78,
          paddingBottom: 25,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
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
            <TabIcon source="journal" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="meditate"
        options={{
          title: "Meditate",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source="journal" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
