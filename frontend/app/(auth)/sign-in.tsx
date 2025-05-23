import { Link, router, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/clerk-expo";
import { icons, images } from "@/constants";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  // Handle the submission of the sign-in form
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, form.email, form.password]);

  return (
    <ScrollView className="flex-1 bg-dark">
      <Image
        source={images.leaves}
        resizeMode="contain"
        className="absolute w-full right-0 top-0"
      />
      <View className="flex-1">
        <View className="relative w-full h-[250px]">
          {/* <Image source="" className="z-0 w-full h-[250px]" /> */}
          <Text className="text-2xl text-[#fff] font-JakartaExtraBold absolute bottom-5 left-5">
            Welcome
          </Text>
        </View>

        <View className="px-5">
          <Text className="text-white font-JakartaMedium mb-5">
            Good to see you again. Let's start meditating!
          </Text>
          <InputField
            label="Email"
            placeholder="Email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Log In"
            onPress={onSignInPress}
            className="mt-10 bg-light self-center"
          />

          <Link
            href="/sign-up"
            className="text-lg text-medium mt-4 text-center"
          >
            Don't have an account? <Text className="text-white">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
