import { StyleSheet, Text, View, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useState } from "react";

export default function App() {
  const [images, setImages] = useState([
    { id: 1, imgUrl: require("./assets/cat_blush.png") },
    { id: 2, imgUrl: require("./assets/cat_nerd.jpg") },
    { id: 3, imgUrl: require("./assets/YIPPIES.jpg") },
  ]);

  function handleSwipeOff(cardId) {
    setImages((prevCards) => prevCards.filter((card) => card.id !== cardId));
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {images.map((image) => (
        <MyCard
          key={image.id}
          image={image.imgUrl}
          onSwipeOff={() => handleSwipeOff(image.id)}
        />
      ))}
    </GestureHandlerRootView>
  );
}

const MyCard = ({ image, onSwipeOff }) => {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      "worklet";
      translateX.value = event.translationX;
      rotate.value = (translateX.value / 250) * -10;
    })
    .onEnd(() => {
      "worklet";
      if (Math.abs(translateX.value) > 150) {
        translateX.value = translateX.value > 0 ? 500 : -500;
        runOnJS(onSwipeOff)(image.id);
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle, styles.container]}>
        <Image source={image} style={styles.imgStyle} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  imgStyle: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
