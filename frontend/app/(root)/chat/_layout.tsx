// import { Stack, useRouter } from "expo-router";
// import { TouchableOpacity, Alert, Text, View } from "react-native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { useState } from "react";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import * as Calendar from "expo-calendar";

// const Layout = () => {
//   const router = useRouter();
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   // Request calendar permissions
//   const requestCalendarPermissions = async () => {
//     const { status } = await Calendar.requestCalendarPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(
//         "Permission Denied",
//         "Calendar access is required to fetch events."
//       );
//       return;
//     }
//   };

//   // Handle date selection
//   const handleDateChange = (event, date) => {
//     setShowCalendar(false);
//     if (date) {
//       setSelectedDate(date);
//       router.replace(`/chat?date=${date.toISOString().split("T")[0]}`);
//     }
//   };

//   // Navigate back with delay to prevent multiple taps
//   const handleBackPress = () => {
//     setTimeout(() => {
//       router.push("/(root)/(tabs)/home");
//     }, 100); // Small delay to prevent UI lag
//   };

//   return (
//     <View className="flex-1">
//       <Stack>
//         <Stack.Screen
//           name="index"
//           options={{
//             headerStyle: {},
//             headerShadowVisible: true,
//             headerTitle: () => (
//               <View className="flex-row items-center">
//                 <Text className="text-lg font-semibold">
//                   Chat - {selectedDate.toISOString().split("T")[0]}
//                 </Text>
//               </View>
//             ),
//             headerLeft: () => (
//               <TouchableOpacity
//                 onPress={handleBackPress}
//                 style={{ paddingRight: 10 }}
//               >
//                 <Ionicons name="arrow-back" color="black" size={25} />
//               </TouchableOpacity>
//             ),
//             // headerRight: () => (
//             //   <TouchableOpacity
//             //     className="ml-3"
//             //     onPress={() => setShowCalendar(true)}
//             //   >
//             //     <Ionicons name="calendar" size={25} color="black" />
//             //   </TouchableOpacity>
//             // ),
//           }}
//         />
//       </Stack>

//       {/* Move DateTimePicker outside header */}
//       {showCalendar && (
//         <DateTimePicker
//           value={selectedDate}
//           mode="date"
//           display="calendar"
//           onChange={handleDateChange}
//         />
//       )}
//     </View>
//   );
// };

// export default Layout;

import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Hide header since we now handle it inside `index.tsx`
        }}
      />
    </Stack>
  );
};

export default Layout;
