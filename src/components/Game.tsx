import * as React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { Colors } from "../styles/colors";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Coordinate, Direction, GestureEventType } from "../types/types";
import Snake from "./Snake";
import Food from "./Food";
import Header from "./Header";
import Score from "./Score";
import { checkGameOver } from "../utils/checkGameOver";
import { checkEatFoods } from "../utils/checkEatFoods";
import { randomFoodPosition } from "../utils/randomFoodPosition";

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
  const [score, setScore] = React.useState<number>(0);
  React.useEffect(() => {
    if (!isGameOver) {
      const intervalId = setInterval(() => {
        !isPaused && moveSnake();
      }, MOVE_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [snake, isGameOver, isPaused]);

  const moveSnake = () => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead };
    if (checkGameOver(newHead, GAME_BOUNDS)) {
      setIsGameOver((prevState) => !prevState);
      return;
    }
    switch (direction) {
      case Direction.Up:
        newHead.y = newHead.y - 1;
        break;
      case Direction.Down:
        newHead.y = newHead.y + 1;
        break;
      case Direction.Left:
        newHead.x = newHead.x - 1;
        break;
      case Direction.Right:
        newHead.x = newHead.x + 1;
        break;
      default:
        break;
    }
    if (checkEatFoods(newHead, food, 2)) {
      setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
      setSnake([newHead, ...snake]);
      setScore(score + SCORE_INCREMENT);
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  };
  const handleGesture = (event: GestureEventType) => {
    const { translationX, translationY } = event.nativeEvent;
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        console.log(event);
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
  const reloadGame = () => {
    setSnake(SNAKE_INITIAL_POSITION);
    setFood(FOOD_INITIAL_POSITION);
    setIsGameOver(false);
    setScore(0);
    setDirection(Direction.Right);
    setIsPaused(false);
  };
  const pauseGame = () => {
    if (!isGameOver) setIsPaused((prevState) => !prevState);
  };
  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <SafeAreaView style={styles.container}>
        <Header
          pauseGame={pauseGame}
          reloadGame={reloadGame}
          isPaused={isPaused}
          isGameOver={isGameOver}
        >
          <Score score={score} />
        </Header>
        <View style={styles.spaces}>
          <Snake snake={snake} />
          <Food x={food.x} y={food.y} />
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
