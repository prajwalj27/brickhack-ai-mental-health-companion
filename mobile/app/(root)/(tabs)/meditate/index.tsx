import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
} from "react-native";
import { Portal, Modal as PaperModal } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Audio } from "expo-av";

import AnimatedBackground from "@/components/AnimatedBackground";
import { baseURL } from "@/constants";
import MoodModal from "@/components/MoodModal";

// Constants
const AUDIO_OPTIONS = [
  { name: "Beach", file: require("@/assets/audio/beach.mp3") },
  { name: "Serene", file: require("@/assets/audio/meditate-under-tree.mp3") },
  { name: "River", file: require("@/assets/audio/river.mp3") },
  { name: "Forest", file: require("@/assets/audio/trees.mp3") },
  { name: "Waterfall", file: require("@/assets/audio/waterfall.mp3") },
  { name: "Stars", file: require("@/assets/audio/yosemite-stars.mp3") },
];
const moods = ["Happy", "Sad", "Neutral", "Calm", "Anxious"];
const Meditate = () => {
  // State hooks
  const [selectedTime, setSelectedTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 10,
  });
  const [countdown, setCountdown] = useState(10); // Initialize with 10 seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(true);

  // Refs
  const soundRef = useRef(null);
  const timerRef = useRef(null);

  // Calculate total seconds from h:m:s
  const calculateTotalSeconds = useCallback(() => {
    return (
      selectedTime.hours * 3600 +
      selectedTime.minutes * 60 +
      selectedTime.seconds
    );
  }, [selectedTime]);

  // Update countdown when selectedTime changes
  useEffect(() => {
    if (sessionEnded) {
      setCountdown(calculateTotalSeconds());
    }
  }, [selectedTime, sessionEnded, calculateTotalSeconds]);

  // Audio fade functions
  const fadeAudio = useCallback(
    async (sound, startVolume, endVolume, steps = 10) => {
      const stepSize = (endVolume - startVolume) / steps;
      const stepDuration = 300; // ms

      for (let i = 0; i <= steps; i++) {
        const volume = startVolume + stepSize * i;
        await sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
      }
    },
    []
  );

  // Cleanup effect for audio
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      clearInterval(timerRef.current);
    };
  }, []);

  // Countdown timer logic
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
  }, [isRunning, isPaused]);

  // Start meditation handler
  const startMeditation = useCallback(async () => {
    if (!selectedAudio) {
      Alert.alert("Select Audio", "Please select a meditation sound.");
      return;
    }

    setCountdown(calculateTotalSeconds());
    setIsRunning(true);
    setIsPaused(false);
    setSessionEnded(false);

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
      await fadeAudio(sound, 0, 1);
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Audio Error", "Failed to play meditation sound.");
    }
  }, [selectedAudio, calculateTotalSeconds, fadeAudio]);

  // Toggle pause handler
  const togglePause = useCallback(async () => {
    if (!soundRef.current) return;

    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      await soundRef.current.playAsync();
    } else {
      setIsPaused(true);
      setIsRunning(false);
      await soundRef.current.pauseAsync();
    }
  }, [isPaused]);

  // Stop meditation handler
  const stopMeditation = useCallback(async () => {
    setIsRunning(false);
    setIsPaused(false);

    if (soundRef.current) {
      try {
        await fadeAudio(soundRef.current, 1, 0);
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      } catch (error) {
        console.error("Error stopping audio:", error);
      }
    }

    setSessionEnded(true);
    setCountdown(calculateTotalSeconds());
    setShowMoodModal(true);
  }, [calculateTotalSeconds, fadeAudio]);

  // Submit mood handler
  const submitMoodResponse = useCallback(async () => {
    console.log(selectedMood);
    if (!selectedMood) {
      Alert.alert("Select Mood", "Please select your mood before submitting.");
      return;
    }

    setShowMoodModal(false);

    try {
      const response = await fetch(`${baseURL}/meditate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood }),
      });

      if (response.ok) {
        Alert.alert("Success", "Your meditation session has been recorded.");
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting mood:", error);
      Alert.alert("Error", "Failed to record your meditation session.");
    }

    setSelectedMood("");
  }, [selectedMood]);

  // Handle timer picker changes
  const handleTimeChange = useCallback((event, date) => {
    setShowTimerPicker(false);
    if (date) {
      const newTime = {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
      };
      setSelectedTime(newTime);
    }
  }, []);

  // Format time for display
  const formatTime = useCallback((seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center justify-center p-4">
      {!showMoodModal && <AnimatedBackground isModalVisible={showMoodModal} />}

      {/* Timer Display */}
      <View className="bg-white p-6 rounded-full shadow-md mb-4">
        <Text className="text-4xl font-bold text-center">
          {formatTime(countdown)}
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
          onChange={handleTimeChange}
        />
      )}

      {/* Audio Selection */}
      <Text className="text-lg font-bold mb-2 text-dark">
        Select Background Audio:
      </Text>
      <View className="w-full flex justify-center flex-row flex-wrap">
        {AUDIO_OPTIONS.map((audio) => (
          <TouchableOpacity
            key={audio.name}
            className={`p-2 w-[27%] rounded-full m-2 border-2 border-white ${
              selectedAudio?.name === audio.name ? "bg-white" : "bg-transparent"
            } ${!sessionEnded ? "opacity-50" : ""}`}
            onPress={() => sessionEnded && setSelectedAudio(audio)}
            disabled={!sessionEnded}
          >
            <Text
              className={`text-center ${
                selectedAudio?.name === audio.name
                  ? "text-dark font-bold"
                  : "text-white"
              }`}
            >
              {audio.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Control Buttons */}
      <View className="flex-row space-x-4 mt-4 w-full justify-center">
        <TouchableOpacity
          className="bg-light px-4 py-3 rounded-lg m-2"
          onPress={startMeditation}
          disabled={isRunning || !sessionEnded}
        >
          <Text
            className={`text-dark text-lg font-bold text-center w-24 ${
              !sessionEnded ? "opacity-50" : ""
            }`}
          >
            Start
          </Text>
        </TouchableOpacity>

        {(isRunning || isPaused) && (
          <TouchableOpacity
            className="bg-yellow-500 px-4 py-3 rounded-lg m-2"
            onPress={togglePause}
          >
            <Text className="text-white font-bold text-lg w-24 text-center">
              {isPaused ? "Resume" : "Pause"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mood Modal */}
      {/* <Modal
        visible={showMoodModal}
        transparent
        animationType="slide"
        style={{ zIndex: 10000 }}
      >
        <View
          className="flex-1 justify-center items-center bg-black bg-opacity-50"
          style={{ zIndex: 10000 }}
        >
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
                onPress={() => setShowMoodModal(false)}
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded-lg"
                onPress={submitMoodResponse}
              >
                <Text className="text-white">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
      <MoodModal
        showModal={showMoodModal}
        setShowModal={setShowMoodModal}
        submitResponse={submitMoodResponse}
        moods={moods}
        selectedMood={selectedMood}
        setSelectedMood={setSelectedMood}
      />
    </SafeAreaView>
  );
};

export default Meditate;
