import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Audio } from "expo-av";
import { baseURL } from "@/constants";

const moods = ["Relaxed", "Happy", "Focused", "Anxious", "Neutral"];

const Meditate = () => {
  const [selectedTime, setSelectedTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 10,
  });
  const [countdown, setCountdown] = useState(
    selectedTime.hours * 3600 + selectedTime.minutes * 60 + selectedTime.seconds
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(true); // Controls audio selection availability

  const soundRef = useRef(null);
  const timerRef = useRef(null);

  const audioOptions = [
    { name: "Beach", file: require("@/assets/audio/beach.mp3") },
    {
      name: "Under a Tree",
      file: require("@/assets/audio/meditate-under-tree.mp3"),
    },
    { name: "River", file: require("@/assets/audio/river.mp3") },
    { name: "Forest", file: require("@/assets/audio/trees.mp3") },
    { name: "Waterfall", file: require("@/assets/audio/waterfall.mp3") },
    { name: "Stars", file: require("@/assets/audio/yosemite-stars.mp3") },
  ];

  // 🔹 Fade In Audio Function
  const fadeInAudio = async (sound) => {
    for (let volume = 0; volume <= 1; volume += 0.1) {
      await sound.setVolumeAsync(volume);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  // 🔹 Fade Out Audio Function
  const fadeOutAudio = async (sound) => {
    for (let volume = 1; volume >= 0; volume -= 0.1) {
      await sound.setVolumeAsync(volume);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  // Start Meditation
  const startMeditation = async () => {
    if (!selectedAudio) {
      Alert.alert("Select Audio", "Please select a meditation sound.");
      return;
    }

    setCountdown(
      selectedTime.hours * 3600 +
        selectedTime.minutes * 60 +
        selectedTime.seconds
    );
    setIsRunning(true);
    setIsPaused(false);
    setSessionEnded(false); // Disable audio selection

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(selectedAudio.file, {
        shouldPlay: true,
        isLooping: true,
        volume: 0,
      });
      soundRef.current = sound;
      await sound.playAsync();
      await fadeInAudio(sound);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Pause or Resume Meditation
  const togglePause = async () => {
    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      if (soundRef.current) await soundRef.current.playAsync();
    } else {
      setIsPaused(true);
      setIsRunning(false);
      if (soundRef.current) await soundRef.current.pauseAsync();
    }
  };

  // Countdown Timer Logic
  useEffect(() => {
    if (isRunning && countdown > 0 && !isPaused) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            clearInterval(timerRef.current);
            stopMeditation();
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, countdown, isPaused]);

  // Stop Meditation
  const stopMeditation = async () => {
    setIsRunning(false);
    setIsPaused(false);
    setSessionEnded(true); // Re-enable audio selection
    setCountdown(
      selectedTime.hours * 3600 +
        selectedTime.minutes * 60 +
        selectedTime.seconds
    );

    if (soundRef.current) {
      await fadeOutAudio(soundRef.current);
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    setShowMoodModal(true);
  };

  // Submit Mood to Database
  const submitMoodResponse = async () => {
    if (!selectedMood) {
      Alert.alert("Select Mood", "Please select your mood before submitting.");
      return;
    }
    setShowMoodModal(false);
    setSelectedMood(""); // Reset mood selection

    try {
      const response = await fetch(`${baseURL}/meditate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood }),
      });
      if (response.ok) {
        Alert.alert("Success", "Your meditation session has been recorded.");
      }
    } catch (error) {
      console.error("Error submitting mood:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center p-4">
      {/* Timer Display */}
      <View className="bg-white p-6 rounded-lg shadow-md mb-4">
        <Text className="text-4xl font-bold text-center">
          {String(Math.floor(countdown / 3600)).padStart(2, "0")}:
          {String(Math.floor((countdown % 3600) / 60)).padStart(2, "0")}:
          {String(countdown % 60).padStart(2, "0")}
        </Text>
      </View>

      {/* Timer Picker */}
      <TouchableOpacity
        className="bg-blue-500 px-4 py-3 rounded-lg mb-4"
        onPress={() => setShowTimerPicker(true)}
        disabled={isRunning}
      >
        <Text
          className={`text-lg ${isRunning ? "text-gray-400" : "text-white"}`}
        >
          Set Timer
        </Text>
      </TouchableOpacity>

      {showTimerPicker && (
        <DateTimePicker
          value={
            new Date(
              0,
              0,
              0,
              selectedTime.hours,
              selectedTime.minutes,
              selectedTime.seconds
            )
          }
          mode="time"
          display="spinner"
          onChange={(event, date) => {
            setShowTimerPicker(false);
            if (date) {
              setSelectedTime({
                hours: date.getHours(),
                minutes: date.getMinutes(),
                seconds: date.getSeconds(),
              });
              setCountdown(
                date.getHours() * 3600 +
                  date.getMinutes() * 60 +
                  date.getSeconds()
              );
            }
          }}
        />
      )}

      {/* Audio Selection (Disabled when session is running or paused) */}
      <Text className="text-lg font-bold mb-2">Select Background Audio:</Text>
      {audioOptions.map((audio) => (
        <TouchableOpacity
          key={audio.name}
          className={`p-3 w-3/4 rounded-lg mb-2 ${
            selectedAudio?.name === audio.name ? "bg-blue-500" : "bg-gray-300"
          } ${!sessionEnded ? "opacity-50" : ""}`}
          onPress={() => {
            if (sessionEnded) setSelectedAudio(audio);
          }}
          disabled={!sessionEnded}
        >
          <Text
            className={`text-center ${
              selectedAudio?.name === audio.name ? "text-white" : "text-black"
            }`}
          >
            {audio.name}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Control Buttons */}
      <View className="flex-row space-x-4 mt-4">
        <TouchableOpacity
          className="bg-green-500 px-4 py-3 rounded-lg"
          onPress={startMeditation}
          disabled={isRunning}
        >
          <Text className="text-white text-lg">Start</Text>
        </TouchableOpacity>

        {isRunning || isPaused ? (
          <TouchableOpacity
            className="bg-yellow-500 px-4 py-3 rounded-lg"
            onPress={togglePause}
          >
            <Text className="text-white text-lg">
              {isPaused ? "Resume" : "Pause"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Mood Modal */}
      <Modal visible={showMoodModal} transparent animationType="slide">
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black bg-opacity-50"
          activeOpacity={1}
        >
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-lg font-bold mb-2">How do you feel now?</Text>
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
            <TouchableOpacity
              className="bg-blue-500 p-3 rounded-lg mt-4"
              onPress={submitMoodResponse}
            >
              <Text className="text-white text-center">Submit</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Meditate;
