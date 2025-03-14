// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   SafeAreaView,
// //   TouchableOpacity,
// //   TextInput,
// //   FlatList,
// //   KeyboardAvoidingView,
// //   StatusBar,
// //   Platform,
// // } from "react-native";
// // import Ionicons from "@expo/vector-icons/Ionicons";
// // import { useRouter } from "expo-router";

// // import { baseURL } from "@/constants";

// // const AiChat = () => {
// //   const router = useRouter();
// //   const [messages, setMessages] = useState([
// //     { id: "1", sender: "bot", text: "Hello! How can I assist you today?" },
// //   ]);
// //   const [inputText, setInputText] = useState("");

// //   const sendMessage = async () => {
// //     if (!inputText.trim()) return;

// //     const userMessage = { id: Date.now().toString(), sender: "user", text: inputText };
// //     setMessages((prevMessages) => [...prevMessages, userMessage]);

// //     try {
// //       const response = await fetch(`${baseURL}/chat/`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ prompt: inputText }),
// //       });

// //       const data = await response.json();
// //       console.log(data)
// //       const botMessage = { id: Date.now().toString(), sender: "bot", text: data.response };

// //       setMessages((prevMessages) => [...prevMessages, botMessage]);
// //     } catch (error) {
// //       console.error("Error fetching AI response:", error);
// //     }

// //     setInputText("");
// //   };

// //   return (
// //     <SafeAreaView className="flex-1 bg-gray-100">
// //       <StatusBar animated={true} barStyle={"dark-content"} />

// //       {/* Chat Messages */}
// //       <FlatList
// //         data={messages}
// //         keyExtractor={(item) => item.id}
// //         renderItem={({ item }) => (
// //           <View className={`p-3 my-1 rounded-lg max-w-[80%] ${item.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-300 self-start"}`}>
// //             <Text className={`${item.sender === "user" ? "text-white" : "text-black"}`}>{item.text}</Text>
// //           </View>
// //         )}
// //         contentContainerStyle={{ padding: 10 }}
// //       />

// //       {/* Message Input */}
// //       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="border-t bg-white p-3 flex-row items-center">
// //         <TextInput
// //           className="flex-1 p-2 border rounded-lg bg-gray-100"
// //           placeholder="Type a message..."
// //           value={inputText}
// //           onChangeText={setInputText}
// //         />
// //         <TouchableOpacity className="ml-2 bg-blue-500 p-2 rounded-lg" onPress={sendMessage}>
// //           <Ionicons name="send" size={24} color="white" />
// //         </TouchableOpacity>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // };

// // export default AiChat;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
//   KeyboardAvoidingView,
//   StatusBar,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { useRouter, useLocalSearchParams } from "expo-router";

// import { baseURL } from "@/constants";

// const AiChat = () => {
//   const router = useRouter();
//   const { date } = useLocalSearchParams(); // Get selected date from query params
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Function to fetch previous chats based on the selected date
//   const fetchPreviousChats = async (selectedDate: string) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${baseURL}/conversations/?date=${selectedDate}`);
//       const data = await response.json();

//       if (data?.conversations) {
//         const formattedMessages = [];

//         data.conversations.forEach((msg) => {
//           formattedMessages.push({ id: `${msg._id}-user`, sender: "user", text: msg.user_input });
//           formattedMessages.push({ id: `${msg._id}-bot`, sender: "bot", text: msg.response });
//         });

//         setMessages(formattedMessages);
//       }
//     } catch (error) {
//       console.error("Error fetching previous chats:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (date) {
//       fetchPreviousChats(date as string);
//     }
//   }, [date]);

//   // Function to send a new message
//   const sendMessage = async () => {
//     if (!inputText.trim()) return;

//     const userMessage = { id: Date.now().toString(), sender: "user", text: inputText };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);

//     try {
//       const response = await fetch(`${baseURL}/chat/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: inputText }),
//       });

//       const data = await response.json();
//       const botMessage = { id: Date.now().toString(), sender: "bot", text: data.response };

//       setMessages((prevMessages) => [...prevMessages, botMessage]);
//     } catch (error) {
//       console.error("Error fetching AI response:", error);
//     }

//     setInputText("");
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-100">
//       <StatusBar animated={true} barStyle={"dark-content"} />

//       {/* Loading Indicator */}
//       {loading && <ActivityIndicator size="large" color="#007bff" className="mt-4" />}

//       {/* Chat Messages */}
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View className={`p-3 my-1 rounded-lg max-w-[80%] ${item.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-300 self-start"}`}>
//             <Text className={`${item.sender === "user" ? "text-white" : "text-black"}`}>{item.text}</Text>
//           </View>
//         )}
//         contentContainerStyle={{ padding: 10 }}
//       />

//       {/* Message Input */}
//       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="border-t bg-white p-3 flex-row items-center">
//         <TextInput
//           className="flex-1 p-2 border rounded-lg bg-gray-100"
//           placeholder="Type a message..."
//           value={inputText}
//           onChangeText={setInputText}
//         />
//         <TouchableOpacity className="ml-2 bg-blue-500 p-2 rounded-lg" onPress={sendMessage}>
//           <Ionicons name="send" size={24} color="white" />
//         </TouchableOpacity>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default AiChat;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter, useLocalSearchParams } from "expo-router";

import { baseURL } from "@/constants";

const AiChat = () => {
  const router = useRouter();
  const { date } = useLocalSearchParams(); // Get selected date from query params
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    date ? new Date(date as string) : new Date()
  );

  // Function to fetch previous chats based on the selected date
  const fetchPreviousChats = async (selectedDate: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseURL}/conversations/?date=${selectedDate}`
      );
      const data = await response.json();

      if (data?.conversations) {
        const formattedMessages = [];

        data.conversations.forEach((msg) => {
          formattedMessages.push({
            id: `${msg._id}-user`,
            sender: "user",
            text: msg.user_input,
          });
          formattedMessages.push({
            id: `${msg._id}-bot`,
            sender: "bot",
            text: msg.response,
          });
        });

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching previous chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      fetchPreviousChats(date as string);
    }
  }, [date]);

  // Function to send a new message
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch(`${baseURL}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText }),
      });

      const data = await response.json();
      const botMessage = {
        id: Date.now().toString(),
        sender: "bot",
        text: data.response,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }

    setInputText("");
  };

  // Handle date selection
  // const handleDateChange = (event, newDate) => {
  //   setShowCalendar(false);
  //   if (newDate) {
  //     setSelectedDate(newDate);
  //     router.replace(`/chat?date=${newDate.toISOString().split("T")[0]}`);
  //   }
  // };

  // const handleDateChange = (event, newDate) => {
  //   setShowCalendar(false);
  //   if (newDate) {
  //     // Convert to UTC format (YYYY-MM-DD) for API query
  //     const utcDate = new Date(
  //       Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
  //     );
  
  //     setSelectedDate(newDate); // Store the raw selected date (not UTC)
  //     router.replace(`/chat?date=${utcDate.toISOString().split("T")[0]}`);
  //   }
  // };
  const handleDateChange = (event, newDate) => {
    setShowCalendar(false);
    if (!newDate) return;
  
    // 1) Extract year, month, day from the picker date
    const localYear = newDate.getFullYear();
    const localMonth = newDate.getMonth();
    const localDay = newDate.getDate();
  
    // 2) Construct a pure local date at local midnight
    //    No matter your time zone, the "day" is correct.
    const localDateObj = new Date(localYear, localMonth, localDay);
  
    // 3) Update your local state to this date object
    setSelectedDate(localDateObj);
  
    // 4) Construct a YYYY-MM-DD string for your backend
    //    (assuming your API expects this format)
    const dateStr = [
      localYear.toString().padStart(4, "0"),
      (localMonth + 1).toString().padStart(2, "0"),
      localDay.toString().padStart(2, "0"),
    ].join("-");
  
    // 5) Update the route so fetchPreviousChats() can retrieve data
    router.replace(`/chat?date=${dateStr}`);
  };
  
  
  

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar animated={true} barStyle={"dark-content"} />

      {/* Header with Back and Calendar Buttons */}
      <View className="flex-row justify-between items-center p-3 bg-white border-b">
        <TouchableOpacity
          onPress={() => router.push("/(root)/(tabs)/home")}
          className="p-2"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold">
          Chat - {selectedDate.toISOString().split("T")[0]}
        </Text>
        {/* <Text className="text-lg font-semibold">
          Chat -{" "}
          {selectedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text> */}

        <TouchableOpacity className="p-2" onPress={() => setShowCalendar(true)}>
          <Ionicons name="calendar" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {showCalendar && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator size="large" color="#007bff" className="mt-4" />
      )}

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className={`p-3 my-1 rounded-lg max-w-[80%] ${
              item.sender === "user"
                ? "bg-blue-500 self-end"
                : "bg-gray-300 self-start"
            }`}
          >
            <Text
              className={`${
                item.sender === "user" ? "text-white" : "text-black"
              }`}
            >
              {item.text}
            </Text>
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="border-t bg-white p-3 flex-row items-center"
      >
        <TextInput
          className="flex-1 p-2 border rounded-lg bg-gray-100"
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity
          className="ml-2 bg-blue-500 p-2 rounded-lg"
          onPress={sendMessage}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AiChat;
