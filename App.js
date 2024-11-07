import { StyleSheet, View, Image } from "react-native";
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

  const ITEM_HEIGHT = 220; // 200 height + 20 vertical margin

  // Shared value to keep track of the order of items
  const order = useSharedValue(images.map((item) => item.id));

  const handleReorder = (newOrder) => {
    const newImages = newOrder.map((id) =>
      images.find((item) => item.id === id)
    );
    setImages(newImages);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { height: ITEM_HEIGHT * images.length }]}>
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image.imgUrl}
            imageId={image.id}
            order={order}
            imagesCount={images.length}
            ITEM_HEIGHT={ITEM_HEIGHT}
            onReorder={handleReorder}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

const ImageCard = ({
  image,
  imageId,
  order,
  imagesCount,
  ITEM_HEIGHT,
  onReorder,
}) => {
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const initialIndex = useSharedValue(
    order.value.findIndex((id) => id === imageId)
  );
  const currentIndex = useSharedValue(initialIndex.value);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
      // Update initialIndex in case the order has changed
      initialIndex.value = order.value.findIndex((id) => id === imageId);
      currentIndex.value = initialIndex.value;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;

      // Calculate the new index based on the drag position
      const newPosition = initialIndex.value * ITEM_HEIGHT + translateY.value;
      const newIndex = Math.floor(newPosition / ITEM_HEIGHT + 0.5);

      const clampedIndex = Math.max(0, Math.min(imagesCount - 1, newIndex));

      if (clampedIndex !== currentIndex.value) {
        currentIndex.value = clampedIndex;
      }
    })
    .onEnd(() => {
      // Update the order when the drag ends
      const newOrder = [...order.value];
      newOrder.splice(initialIndex.value, 1);
      newOrder.splice(currentIndex.value, 0, imageId);
      order.value = newOrder;

      // Reset the states
      translateY.value = withSpring(0);
      isDragging.value = false;

      // Update the images in the main state
      runOnJS(onReorder)(order.value);
    });

  const animatedStyle = useAnimatedStyle(() => {
    const index = order.value.findIndex((id) => id === imageId);
    let position = index * ITEM_HEIGHT;

    if (isDragging.value) {
      if (imageId === order.value[initialIndex.value]) {
        // The item being dragged
        position = initialIndex.value * ITEM_HEIGHT + translateY.value;
      } else {
        // Other items adjust position if necessary
        if (
          initialIndex.value < currentIndex.value &&
          index > initialIndex.value &&
          index <= currentIndex.value
        ) {
          // Items move up
          position = index * ITEM_HEIGHT - ITEM_HEIGHT;
        } else if (
          initialIndex.value > currentIndex.value &&
          index >= currentIndex.value &&
          index < initialIndex.value
        ) {
          // Items move down
          position = index * ITEM_HEIGHT + ITEM_HEIGHT;
        }
      }
    }

    return {
      position: "absolute",
      top: withSpring(position),
      zIndex:
        isDragging.value && imageId === order.value[initialIndex.value] ? 1 : 0,
      opacity:
        isDragging.value && imageId === order.value[initialIndex.value]
          ? 0.9
          : 1,
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
    backgroundColor: "#fff",
    width: "100%",
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
});
