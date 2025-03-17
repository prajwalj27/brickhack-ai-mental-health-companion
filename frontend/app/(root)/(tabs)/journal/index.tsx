import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";

import MoodModal from "@/components/MoodModal";
import { baseURL, dummyJournalEntries } from "@/constants";

const moods = ["Happy", "Sad", "Neutral", "Calm", "Anxious"]; // Predefined mood options

const Journal = () => {
  const { date } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState(
    new Date(date || new Date())
  );
  const [journalEntries, setJournalEntries] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("");

  // Fetch journal entries for the selected date
  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        console.log(
          `fetching from: ${baseURL}/journal?date=${
            selectedDate.toISOString().split("T")[0]
          }`
        );
        const response = await fetch(
          `${baseURL}/journal?date=${selectedDate.toISOString().split("T")[0]}`
        );
        const data = await response.json();
        setJournalEntries(data.journals); // Ensure it matches the API response format
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      }
    };

    fetchJournalEntries();
  }, [selectedDate]);

  // const sendMessage = async () => {
  //   if (!inputText.trim()) return;

  //   const userMessage = {
  //     id: Date.now().toString(),
  //     sender: "user",
  //     text: inputText,
  //   };

  //   try {
  //     const response = await fetch(`${baseURL}/chat/`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ prompt: `I journalled and now i am feeling ${selectedMood}` }),
  //     });

  //     const data = await response.json();

  //   } catch (error) {
  //     console.error("Error fetching AI response:", error);
  //   }
  // };

  // Handle time formatting
  const formatTime12Hour = (timestamp) => {
    if (!timestamp) return "";

    // Convert the string timestamp to a Date object
    const date = new Date(timestamp);

    // Format the date to EST/EDT (Eastern Time)
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York", // Converts UTC to EST/EDT
      hour: "numeric",
      minute: "numeric",
      hour12: true, // Ensures 12-hour format
    }).format(date);
  };

  // Handle journal entry submission
  const submitJournalEntry = async () => {
    if (!newEntryTitle.trim() || !newEntryContent.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setShowModal(true);
  };

  // Submit journal and mood to database
  const submitJournalWithMood = async () => {
    if (!selectedMood) {
      Alert.alert("Error", "Please select a mood before submitting.");
      return;
    }
    setShowModal(false);

    try {
      const response = await fetch(`${baseURL}/journal/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEntryTitle,
          entry: newEntryContent,
          // timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Your journal entry has been saved.");
        setNewEntryTitle("");
        setNewEntryContent("");
        setSelectedMood("");

        // **Trigger re-fetching by updating selectedDate**
        setSelectedDate(new Date(selectedDate)); // Force useEffect to run again
      }
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView keyboardShouldPersistTaps="handled" className="p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center bg-dark p-4 shadow">
            <Text className="text-lg font-JakartaBold text-white">
              Your Journal
            </Text>
            {/* Calendar Button */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar" size={25} color="#D1EAEC" />
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date);
              }}
            />
          )}

          {/* Selected Date Display */}
          <View className="p-3 bg-dark">
            <Text className="text-center text-medium font-JakartaBold">
              Showing Entries for:{" "}
              {selectedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          {/* Journal Entries List */}
          {journalEntries.length > 0 ? (
            journalEntries.map((item) => (
              <View
                key={item._id}
                className="p-3 bg-medium shadow rounded-lg my-2"
              >
                <Text className="text-lg text-[#fff] font-JakartaExtraBold">
                  {item.title}
                </Text>
                <Text className="text-white font-JakartaMedium">
                  {item.entry}
                </Text>
                <Text className="text-white mt-2 font-JakartaLight">
                  Time: {formatTime12Hour(item.timestamp)}{" "}
                  {/* Convert timestamp */}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-center text-medium font-JakartaMedium my-4">
              No journal entries for this date.
            </Text>
          )}

          {/* New Journal Entry Form */}
          {/* <View className="p-4 bg-white shadow rounded-lg mt-4">
            <Text className="text-lg font-bold mb-2">New Journal Entry</Text>
            <TextInput
              className="border p-2 rounded-lg mb-2"
              placeholder="Title"
              value={newEntryTitle}
              onChangeText={setNewEntryTitle}
            />
            <TextInput
              className="border p-2 rounded-lg mb-2 h-20"
              placeholder="Write your thoughts..."
              value={newEntryContent}
              onChangeText={setNewEntryContent}
              multiline
            />
            <TouchableOpacity
              className="bg-blue-500 p-3 rounded-lg mt-2"
              onPress={submitJournalEntry}
            >
              <Text className="text-white text-center">
                Submit Journal Entry
              </Text>
            </TouchableOpacity>
          </View> */}
        </ScrollView>

        {/* New Journal Entry Form */}
        <View className="p-4 bg-dark shadow shadow-black/30 rounded-lg mb-20">
          <Text className="text-lg font-JakartaBold mb-2 text-white">
            New Journal Entry
          </Text>
          <TextInput
            className="p-2 rounded-lg mb-2 bg-white font-JakartaMedium text-dark"
            placeholder="Title"
            placeholderTextColor="#253334"
            value={newEntryTitle}
            onChangeText={setNewEntryTitle}
          />
          <TextInput
            className="p-2 rounded-lg mb-2 h-20 bg-white font-JakartaMedium text-dark"
            placeholder="Write your thoughts..."
            placeholderTextColor="#253334"
            value={newEntryContent}
            onChangeText={setNewEntryContent}
            multiline
          />
          <TouchableOpacity
            className="bg-light p-3 rounded-lg mt-2 self-center w-1/2"
            onPress={submitJournalEntry}
          >
            <Text className="text-[#fff] text-center font-JakartaExtraBold">
              Submit Entry
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Mood Modal */}
      {/* <Modal visible={showModal} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-lg font-bold mb-2">How do you feel now?</Text>

            <View className="flex-row flex-wrap justify-center">
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood}
                  className={`m-1 px-4 py-2 rounded-lg border ${
                    selectedMood === mood
                      ? "bg-blue-500 border-blue-500"
                      : "bg-gray-200 border-gray-300"
                  }`}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Text
                    className={`${
                      selectedMood === mood ? "text-white" : "text-black"
                    } text-center`}
                  >
                    {mood}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="bg-gray-500 p-3 rounded-lg"
                onPress={() => setShowModal(false)}
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded-lg"
                onPress={submitJournalWithMood}
              >
                <Text className="text-white">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
      <MoodModal
        showModal={showModal}
        setShowModal={setShowModal}
        submitResponse={submitJournalWithMood}
        moods={moods}
        selectedMood={selectedMood}
        setSelectedMood={setSelectedMood}
      />
    </SafeAreaView>
  );
};

export default Journal;
