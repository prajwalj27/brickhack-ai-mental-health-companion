import CustomButton from "@/components/CustomButton";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { Text, TouchableOpacity, View, SafeAreaView } from "react-native";

export default function Page() {
  const { user } = useUser();

  return (
    <SafeAreaView className="bg-dark h-full">
      <SignedIn>
        <Text className="text-white">Hello {user?.firstName}</Text>

        <CustomButton
          title="Open Chat"
          onPress={() => router.replace("/chat")}
        />
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