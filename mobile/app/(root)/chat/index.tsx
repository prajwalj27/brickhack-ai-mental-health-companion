import React, { useState } from "react";
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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const AiChat = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: "1", sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now().toString(), sender: "user", text: inputText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      });

      const data = await response.json();
      const botMessage = { id: Date.now().toString(), sender: "bot", text: data.reply };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }

    setInputText("");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar animated={true} barStyle={"dark-content"} />

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className={`p-3 my-1 rounded-lg max-w-[80%] ${item.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-300 self-start"}`}>
            <Text className={`${item.sender === "user" ? "text-white" : "text-black"}`}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* Message Input */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="border-t bg-white p-3 flex-row items-center">
        <TextInput
          className="flex-1 p-2 border rounded-lg bg-gray-100"
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity className="ml-2 bg-blue-500 p-2 rounded-lg" onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AiChat;
