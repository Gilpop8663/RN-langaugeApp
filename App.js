import React, { useRef, useState } from "react";
import { Animated, PanResponder, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
`;

export default function App() {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // 사용하겠다 true
      onPanResponderMove: (_, { dx }) => {
        // 무브하는 것을 인지,거리 재기
        position.setValue(dx);
      },
      onPanResponderGrant: () => onPressIn(), // 시작하기 전에 실행
      onPanResponderRelease: () => {
        // 끝날 때 맨  마지막에 실행
        Animated.parallel([
          onPressOut,
          Animated.spring(position, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  return (
    <Container>
      <Card
        {...panResponder.panHandlers}
        style={{ transform: [{ scale }, { translateX: position }] }}
      >
        <Ionicons name="pizza" color="#192a56" size={98} />
      </Card>
    </Container>
  );
}
