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
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { useRouter, useLocalSearchParams } from "expo-router";

// import { baseURL, dummyMessages } from "@/constants";

// const AiChat = () => {
//   const router = useRouter();
//   const { date } = useLocalSearchParams(); // Get selected date from query params
//   const [messages, setMessages] = useState(dummyMessages);
//   const [inputText, setInputText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(
//     date ? new Date(date as string) : new Date()
//   );

//   // Function to fetch previous chats based on the selected date
//   const fetchPreviousChats = async (selectedDate: string) => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `${baseURL}/conversations/?date=${selectedDate}`
//       );
//       const data = await response.json();

//       if (data?.conversations) {
//         const formattedMessages = [];

//         data.conversations.forEach((msg) => {
//           formattedMessages.push({
//             id: `${msg._id}-user`,
//             sender: "user",
//             text: msg.user_input,
//           });
//           formattedMessages.push({
//             id: `${msg._id}-bot`,
//             sender: "bot",
//             text: msg.response,
//           });
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

//     const userMessage = {
//       id: Date.now().toString(),
//       sender: "user",
//       text: inputText,
//     };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);

//     try {
//       const response = await fetch(`${baseURL}/chat/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: inputText }),
//       });

//       const data = await response.json();
//       const botMessage = {
//         id: Date.now().toString(),
//         sender: "bot",
//         text: data.response,
//       };

//       setMessages((prevMessages) => [...prevMessages, botMessage]);
//     } catch (error) {
//       console.error("Error fetching AI response:", error);
//     }

//     setInputText("");
//   };

//   // Handle date selection
//   // const handleDateChange = (event, newDate) => {
//   //   setShowCalendar(false);
//   //   if (newDate) {
//   //     setSelectedDate(newDate);
//   //     router.replace(`/chat?date=${newDate.toISOString().split("T")[0]}`);
//   //   }
//   // };

//   // const handleDateChange = (event, newDate) => {
//   //   setShowCalendar(false);
//   //   if (newDate) {
//   //     // Convert to UTC format (YYYY-MM-DD) for API query
//   //     const utcDate = new Date(
//   //       Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
//   //     );

//   //     setSelectedDate(newDate); // Store the raw selected date (not UTC)
//   //     router.replace(`/chat?date=${utcDate.toISOString().split("T")[0]}`);
//   //   }
//   // };
//   const handleDateChange = (event, newDate) => {
//     setShowCalendar(false);
//     if (!newDate) return;

//     // 1) Extract year, month, day from the picker date
//     const localYear = newDate.getFullYear();
//     const localMonth = newDate.getMonth();
//     const localDay = newDate.getDate();

//     // 2) Construct a pure local date at local midnight
//     //    No matter your time zone, the "day" is correct.
//     const localDateObj = new Date(localYear, localMonth, localDay);

//     // 3) Update your local state to this date object
//     setSelectedDate(localDateObj);

//     // 4) Construct a YYYY-MM-DD string for your backend
//     //    (assuming your API expects this format)
//     const dateStr = [
//       localYear.toString().padStart(4, "0"),
//       (localMonth + 1).toString().padStart(2, "0"),
//       localDay.toString().padStart(2, "0"),
//     ].join("-");

//     // 5) Update the route so fetchPreviousChats() can retrieve data
//     router.replace(`/chat?date=${dateStr}`);
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-dark">
//       <StatusBar animated={true} barStyle={"light-content"} />

//       {/* Header with Back and Calendar Buttons */}
//       <View className="flex-row justify-between items-center p-3 bg-dark">
//         <TouchableOpacity
//           onPress={() => router.push("/(root)/(tabs)/home")}
//           className="p-2"
//         >
//           <Ionicons name="arrow-back" size={24} color="#D1EAEC" />
//         </TouchableOpacity>

//         <Text className="text-lg font-JakartaSemiBold text-light">
//           Chat - {selectedDate.toISOString().split("T")[0]}
//         </Text>
//         {/* <Text className="text-lg font-semibold">
//           Chat -{" "}
//           {selectedDate.toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//         </Text> */}

//         <TouchableOpacity className="p-2" onPress={() => setShowCalendar(true)}>
//           <Ionicons name="calendar" size={24} color="#D1EAEC" />
//         </TouchableOpacity>
//       </View>

//       {/* Date Picker */}
//       {showCalendar && (
//         <DateTimePicker
//           value={selectedDate}
//           mode="date"
//           display="calendar"
//           onChange={handleDateChange}
//         />
//       )}

//       {/* Loading Indicator */}
//       {loading && (
//         <ActivityIndicator size="large" color="#007bff" className="mt-4" />
//       )}

//       {/* Chat Messages */}
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View
//             className={`p-3 my-1 rounded-lg  ${
//               item.sender === "user"
//                 ? "bg-medium self-end max-w-[85%]"
//                 : "self-center w-full"
//             }`}
//           >
//             <Text
//               className={`font  text-white  ${
//                 item.sender === "user"
//                   ? "font-JakartaMedium"
//                   : "font-JakartaBold text-left"
//               }`}
//             >
//               {item.text}
//             </Text>
//           </View>
//         )}
//         contentContainerStyle={{ padding: 10 }}
//       />

//       {/* Message Input */}
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="bg-dark p-3 flex-row items-center"
//       >
//         <TextInput
//           className="flex-1 p-3 rounded-full bg-medium"
//           placeholder="Type a message..."
//           placeholderTextColor="#D1EAEC"
//           value={inputText}
//           onChangeText={setInputText}
//         />
//         <TouchableOpacity
//           className="ml-2 bg-light p-3 rounded-full"
//           onPress={sendMessage}
//         >
//           <Ionicons name="send" size={24} color="#fff" />
//         </TouchableOpacity>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default AiChat;

import React, { useState, useEffect, useRef } from "react";
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

import { baseURL, dummyMessages } from "@/constants";

const AiChat = () => {
  const router = useRouter();
  const { date } = useLocalSearchParams(); // Get selected date from query params
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date(date || new Date())
  );

  // For typing animation
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fullMessageRef = useRef("");
  const charIndexRef = useRef(0);
  const flatListRef = useRef();

  useEffect(() => {
    // Function to fetch previous chats based on the selected date
    const fetchPreviousChats = async (selectedDate: string) => {
      try {
        setLoading(true);
        console.log(
          `fetching from: ${baseURL}/conversations/?date=${selectedDate}`
        );
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
    
    fetchPreviousChats(selectedDate.toISOString().split("T")[0]);
  }, [date]);

  // Function to animate typing effect
  const animateTyping = () => {
    if (charIndexRef.current < fullMessageRef.current.length) {
      // Display more characters
      setDisplayText(
        fullMessageRef.current.substring(0, charIndexRef.current + 1)
      );
      charIndexRef.current += 1;

      // Random typing speed between 10ms and 50ms for natural effect
      // const randomDelay = Math.floor(Math.random() * 40) + 10;
      const randomDelay = 0.1;
      setTimeout(animateTyping, randomDelay);
    } else {
      // Animation complete
      setIsTyping(false);
      setTypingMessageId(null);
    }
  };

  // Start the typing animation when a new bot message arrives
  useEffect(() => {
    if (isTyping && typingMessageId) {
      animateTyping();
    }
  }, [isTyping]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, displayText]);

  // Function to send a new message
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText("");

    try {
      // Show temporary placeholder while waiting for response
      const tempBotId = Date.now().toString() + "-bot";
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: tempBotId, sender: "bot", text: "" },
      ]);

      const response = await fetch(`${baseURL}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText }),
      });

      const data = await response.json();

      // Setup typing animation
      // const botMessage = {
      //   id: tempBotId,
      //   sender: "bot",
      //   text: "This is a test response from the bot and will be sent to the server soon in the future",
      // };

      const botMessage = {
        id: tempBotId,
        sender: "bot",
        text: data.response,
      };

      // Update the placeholder message with actual content
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === tempBotId ? botMessage : msg))
      );

      // Start typing animation
      // fullMessageRef.current = "This is a test response from the bot and will be sent to the server soon in the future";
      fullMessageRef.current = data.response;
      charIndexRef.current = 0;
      setDisplayText("");
      setTypingMessageId(tempBotId);
      setIsTyping(true);
    } catch (error) {
      console.error("Error fetching AI response:", error);

      // Remove the placeholder message on error
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== Date.now().toString() + "-bot")
      );
    }
  };

  // Handle date selection
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

  const simulateApiResponse = () => {
    // Simulate sending a message and getting a response
    const userMessage = {
      id: Date.now().toString() + "-user",
      sender: "user",
      text: "Test message",
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate delay for API response
    setTimeout(() => {
      const botId = Date.now().toString() + "-bot";
      const botMessage = {
        id: botId,
        sender: "bot",
        text: "This is a longer response to test the typing animation. It includes multiple sentences to see how the animation handles paragraphs of text.",
      };

      setMessages((prev) => [...prev, botMessage]);

      // Start typing animation
      fullMessageRef.current = botMessage.text;
      charIndexRef.current = 0;
      setDisplayText("");
      setTypingMessageId(botId);
      setIsTyping(true);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <StatusBar animated={true} barStyle={"light-content"} />

      {/* Header with Back and Calendar Buttons */}
      <View className="flex-row justify-between items-center p-3 bg-dark">
        <TouchableOpacity
          onPress={() => router.push("/(root)/(tabs)/home")}
          className="p-2"
        >
          <Ionicons name="arrow-back" size={24} color="#D1EAEC" />
        </TouchableOpacity>

        <Text className="text-lg font-JakartaSemiBold text-light">
          Chat - {selectedDate.toISOString().split("T")[0]}
        </Text>

        <TouchableOpacity className="p-2" onPress={() => setShowCalendar(true)}>
          <Ionicons name="calendar" size={24} color="#D1EAEC" />
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
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className={`p-3 my-1 rounded-3xl ${
              item.sender === "user"
                ? "bg-medium self-end max-w-[85%] mr-3 rounded-es-md"
                : "self-start w-full"
            }`}
          >
            <Text
              className={`font text-white ${
                item.sender === "user"
                  ? "font-JakartaMedium"
                  : "font-JakartaMedium text-left"
              }`}
            >
              {item.id === typingMessageId ? displayText : item.text}
              {item.id === typingMessageId && (
                <Text className="text-light">|</Text>
              )}
            </Text>
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="bg-dark p-3 flex-row items-center"
      >
        <TextInput
          className="flex-1 p-3 rounded-full bg-white text-dark font-JakartaMedium"
          placeholder="Type a message..."
          placeholderTextColor="#253334"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity
          className="ml-2 bg-light p-3 rounded-full"
          onPress={sendMessage}
          disabled={isTyping || inputText.trim() === ""}
        >
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AiChat;
