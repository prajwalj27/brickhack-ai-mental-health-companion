import { View, Text, Modal, TouchableOpacity } from "react-native";
import { useState } from "react";

const MoodModal = ({ showModal, setShowModal, submitResponse, moods, selectedMood, setSelectedMood }) => {
  return (
    <Modal
      visible={showModal}
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
              onPress={() => setShowModal(false)}
            >
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-500 p-3 rounded-lg"
              onPress={submitResponse}
            >
              <Text className="text-white">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MoodModal;
