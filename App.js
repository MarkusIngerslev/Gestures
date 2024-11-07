import { StyleSheet, View, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useDerivedValue,
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

  const handleReorder = (draggedIndex, targetIndex) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      const [removedImage] = newImages.splice(draggedIndex, 1);
      newImages.splice(targetIndex, 0, removedImage);
      return newImages;
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image.imgUrl}
            index={index}
            onReorder={handleReorder}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

const ImageCard = ({ image, index, onReorder }) => {
  const translateY = useSharedValue(0);
  const opacity = useDerivedValue(() => {
    return withSpring(translateY.value === 0 ? 1 : 0.5);
  });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      "worklet";
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      "worklet";
      if (Math.abs(translateY.value) > 100) {
        const direction = translateY.value > 0 ? 1 : -1;
        runOnJS(onReorder)(index, index + direction);
      }
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle, styles.imageContainer]}>
        <Image source={image} style={styles.image} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  imageContainer: {
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
});
