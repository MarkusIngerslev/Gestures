import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

export default function App() {
  function onGestureEvent(event) {
    const { translationX, translationY } = event.nativeEvent;
    console.log("X: ", translationX);
    console.log("Y: ", translationY);
  }

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <View style={styles.container}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Text>Drag and watch console log</Text>
        </PanGestureHandler>
        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
