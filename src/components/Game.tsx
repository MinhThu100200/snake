import * as React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { Colors } from "../styles/colors";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Coordinate, Direction, GestureEventType } from "../types/types";
import Snake from "./Snake";

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = { xMin: 0, xMax: 35, yMin: 0, yMax: 63 };
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

export default function Game(): JSX.Element {
  const [direction, setDirection] = React.useState<Direction>(Direction.Right);
  const [snake, setSnake] = React.useState<Coordinate[]>(
    SNAKE_INITIAL_POSITION
  );
  const [food, setFood] = React.useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
  const handleGesture = (event: GestureEventType) => {
    console.log(event);
    const { translationX, translationY } = event.nativeEvent;
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        //move right
        setDirection(Direction.Right);
      } else {
        //move left
        setDirection(Direction.Left);
      }
    } else {
      if (translationY > 0) {
        //go down
        setDirection(Direction.Down);
      } else {
        //go up
        setDirection(Direction.Up);
      }
    }
  };
  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <SafeAreaView style={styles.container}>
        <View style={styles.spaces}>
          <Snake snake={snake} />
        </View>
      </SafeAreaView>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  spaces: {
    flex: 1,
    borderColor: Colors.primary,
    borderWidth: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: Colors.background,
  },
});
