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
        className="flex-1 justify-center items-center bg-dark/95"
        style={{ zIndex: 10000 }}
      >
        <View className="bg-white p-6 rounded-lg w-3/4">
          <Text className="text-lg mb-2 text-dark text-center font-JakartaExtraBold">How do you feel now?</Text>

          <View className="flex-row flex-wrap justify-center">
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood}
                className={`m-1 px-4 py-2 rounded-full border-2 ${
                  selectedMood === mood
                    ? "bg-light border-light"
                    : "bg-none border-light"
                }`}
                onPress={() => setSelectedMood(mood)}
              >
                <Text
                  className="font-JakartaMedium text-dark text-center"
                >
                  {mood}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row justify-center mt-4">
            {/* <TouchableOpacity
              className="bg-gray-500 p-3 rounded-lg"
              onPress={() => setShowModal(false)}
            >
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              className="bg-dark p-3 rounded-lg w-28"
              onPress={submitResponse}
            >
              <Text className="text-white font-JakartaExtraBold text-center">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MoodModal;
