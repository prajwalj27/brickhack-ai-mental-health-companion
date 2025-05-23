import { useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  withDelay,
  useAnimatedStyle,
} from "react-native-reanimated";

const AnimatedBackground = ({ isTimerRunning }) => {
  const { height } = useWindowDimensions();
  const top1 = useSharedValue(0.3 * height);
  const top2 = useSharedValue(0.5 * height);
  const top3 = useSharedValue(0.7 * height);

  useEffect(() => {
    if (isTimerRunning) {
      const options = {
        duration: 4000,
        easing: Easing.bezier(0.5, 0, 0.5, 1),
      };
      top1.value = withRepeat(withTiming(0.2 * height, options), -1, true);
      top2.value = withDelay(
        1000,
        withRepeat(withTiming(0.4 * height, options), -1, true)
      );
      top3.value = withDelay(
        2000,
        withRepeat(withTiming(0.6 * height, options), -1, true)
      );
    } else {
      return;
    }
  }, [height, top1, top2, top3, isTimerRunning]);

  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 bg-white items-center">
      <Animated.View
        className="absolute w-[400%] aspect-square rounded-full bg-light top-[30%]"
        style={{ top: top1 }}
      />
      <Animated.View
        className="absolute w-[400%] aspect-square rounded-full bg-medium top-[50%]"
        style={{ top: top2 }}
      />
      <Animated.View
        className="absolute w-[400%] aspect-square rounded-full bg-dark top-[70%]"
        style={{ top: top3 }}
      />
    </View>
  );
};

export default AnimatedBackground;
