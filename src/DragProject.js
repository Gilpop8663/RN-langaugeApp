import React, { useRef, useState } from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { Animated, Easing, PanResponder, View } from 'react-native';
import { ICONS } from '../icons';

const BLACK_COLOR = '#1e272e';
const GREY = '#485460';
const GREEN = '#2ecc71';
const RED = '#e74c3c';

const Container = styled.View`
  flex: 3;
  background-color: ${BLACK_COLOR};
`;

const Edge = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const WrodWrapper = styled(Animated.createAnimatedComponent(View))`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: ${GREY};
  justify-content: center;
  align-items: center;
`;

const Word = styled.Text`
  font-weight: 500;
  color: ${({ color }) => color};
`;

const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 10;
  position: absolute;
`;

export default function DragProject() {
  //Values
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleOne = position.y.interpolate({
    inputRange: [-250, -80],
    outputRange: [2, 1],
    extrapolate: 'clamp',
  });
  const scaleTwo = position.y.interpolate({
    inputRange: [80, 250],
    outputRange: [1, 2],
    extrapolate: 'clamp',
  });
  //Animated
  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });

  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const goHome = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const onDropScale = Animated.timing(scale, {
    toValue: 0,
    duration: 50,
    easing: Easing.linear,
    useNativeDriver: true,
  });
  const onDropOpacity = Animated.timing(opacity, {
    toValue: 0,
    duration: 50,
    easing: Easing.linear,
    useNativeDriver: true,
  });

  //state
  const [index, setIndex] = useState(0);
  const nextIcon = () => {
    setIndex((prev) => prev + 1);
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  //PanHandler

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx, dy }) => {
        position.setValue({ x: dx, y: dy });
      },
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy > 250 || dy < -250) {
          Animated.sequence([
            Animated.parallel([onDropScale, onDropOpacity]),
            Animated.timing(position, {
              toValue: 0,
              duration: 50,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]).start(nextIcon);
        } else {
          Animated.parallel([onPressOut, goHome]).start();
        }
      },
    })
  ).current;

  return (
    <Container>
      <Edge>
        <WrodWrapper style={{ transform: [{ scale: scaleOne }] }}>
          <Word color={GREEN}>알아</Word>
        </WrodWrapper>
      </Edge>
      <Center>
        <IconCard
          {...panResponder.panHandlers}
          style={{
            transform: [...position.getTranslateTransform(), { scale }],
          }}
        >
          <Ionicons name={ICONS[index]} size={66} color={GREY} />
        </IconCard>
      </Center>
      <Edge>
        <WrodWrapper style={{ transform: [{ scale: scaleTwo }] }}>
          <Word color={RED}>몰라</Word>
        </WrodWrapper>
      </Edge>
    </Container>
  );
}
