import CustomButton from "@/components/CustomButton";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  FlatList,
} from "react-native";

import { onboarding, images } from "@/constants";

const getTimeBasedGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good Morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good Afternoon";
  } else if (currentHour >= 17 && currentHour < 21) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

export default function Page() {
  const { user } = useUser();

  return (
    <SafeAreaView className="bg-dark h-full p-5">
      <SignedIn>
        <Text className="text-white text-2xl mt-10 font-JakartaExtraBold">
          {getTimeBasedGreeting()}, {user?.firstName.split(" ")[0]}!
        </Text>
        <Text className="text-light text-lg my-4 font-JakartaMedium">
          How are you feeling now?
        </Text>

        <View className="flex flex-row justify-between items-center">
          <View>
            <TouchableOpacity className="w-20 h-20 rounded-3xl bg-white m-2 flex justify-center items-center">
              <Image
                source={images.calm}
                resizeMode="contain"
                className="w-10 h-10"
              />
            </TouchableOpacity>
            <Text className="text-center font-JakartaMedium text-[#fff]">
              Calm
            </Text>
          </View>

          <View>
            <TouchableOpacity className="w-20 h-20 rounded-3xl bg-white m-2 flex justify-center items-center">
              <Image
                source={images.focus}
                resizeMode="contain"
                className="w-10 h-10"
              />
            </TouchableOpacity>
            <Text className="text-center font-JakartaMedium text-[#fff]">
              Focused
            </Text>
          </View>

          <View>
            <TouchableOpacity className="w-20 h-20 rounded-3xl bg-white m-2 flex justify-center items-center">
              <Image
                source={images.anxious}
                resizeMode="contain"
                className="w-10 h-10"
              />
            </TouchableOpacity>
            <Text className="text-center font-JakartaMedium text-[#fff]">
              Anxious
            </Text>
          </View>

          <View>
            <TouchableOpacity className="w-20 h-20 rounded-3xl bg-white m-2 flex justify-center items-center">
              <Image
                source={images.sad}
                resizeMode="contain"
                className="w-10 h-10"
              />
            </TouchableOpacity>
            <Text className="text-center font-JakartaMedium text-[#fff]">
              Sad
            </Text>
          </View>
        </View>

        <CustomButton
          title="Open Chat"
          onPress={() => router.replace("/chat")}
          className="mt-10 bg-light self-center rounded-3xl"
        />

        <View className="w-full mt-10">
          <View className="bg-white w-full h-53 mb-6 rounded-3xl p-5">
            <Image
              source={images.journal}
              resizeMode="contain"
              className="absolute right-0 w-[50%]"
            />
            <View className="w-[68%]">
              <Text className="text-2xl font-JakartaBold text-dark">
                Journaling 101
              </Text>
              <Text className="text-lg font-JakartaMedium text-dark">
                Capture your thoughts & transform your perspective.
              </Text>
            </View>
            <TouchableOpacity
              className="bg-dark self-start mt-4 w-30 px-10 py-3 rounded-lg"
              onPress={() => router.replace("/(root)/(tabs)/journal")}
            >
              <Text className="text-white font-JakartaExtraBold">
                Journal Now
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white w-full h-53 mb-6 rounded-3xl p-5">
            <Image
              source={images.meditation}
              resizeMode="contain"
              className="absolute right-0 w-[50%]"
            />
            <View className="w-[68%]">
              <Text className="text-2xl font-JakartaBold text-dark">
                Meditation
              </Text>
              <Text className="text-lg font-JakartaMedium text-dark">
                Find peace within the silent spaces now.
              </Text>
            </View>
            <TouchableOpacity
              className="bg-dark self-start mt-4 w-30 px-8 py-3 rounded-lg"
              onPress={() => router.replace("/(root)/(tabs)/meditate")}
            >
              <Text className="text-white font-JakartaExtraBold">
                Meditate Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SignedIn>

      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </SafeAreaView>
  );
}
