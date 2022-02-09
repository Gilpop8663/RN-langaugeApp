import React, { useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { ICONS } from '../icons';

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
  flex: 1;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  position: absolute;
`;

const CardContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 3;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

const Button = styled.TouchableOpacity`
  margin: 0px 10px;
`;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

export default function CardProject() {
  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    scale.setValue(1);
    position.setValue(0);
    // Animated.timing(position, { toValue: 0, useNativeDriver: true }).start();
    setIndex((prev) => prev + 1);
  };

  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ['-15deg', '15deg'],
  });
  const secondScale = position.interpolate({
    inputRange: [-250, 0, 250],
    outputRange: [1, 0.7, 1],
    extrapolate: 'clamp',
  });
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

  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });

  const goLeft = Animated.spring(position, {
    toValue: -SCREEN_WIDTH,
    tension: 5,
    useNativeDriver: true,
    restDisplacementThreshold: 100,
    restSpeedThreshold: 100,
  });

  const goRight = Animated.spring(position, {
    toValue: SCREEN_WIDTH,
    tension: 5,
    useNativeDriver: true,
    restDisplacementThreshold: 100,
    restSpeedThreshold: 100,
  });

  const closePress = () => {
    goLeft.start(onDismiss);
  };

  const checkPress = () => {
    goRight.start(onDismiss);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // 사용하겠다 true
      onPanResponderMove: (_, { dx }) => {
        // 무브하는 것을 인지,거리 재기
        position.setValue(dx);
      },
      onPanResponderGrant: () => onPressIn(), // 시작하기 전에 실행
      onPanResponderRelease: (_, { dx }) => {
        //console.log(dx);
        // 끝날 때 맨  마지막에 실행
        if (dx < -150) {
          closePress();
        } else if (dx > 150) {
          checkPress();
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;
  return (
    <Container>
      <CardContainer>
        <Card
          style={{
            transform: [{ scale: secondScale }],
          }}
        >
          <Ionicons name={ICONS[index + 1]} color="#192a56" size={98} />
        </Card>
        <Card
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale },
              { translateX: position },
              { rotateZ: rotation },
            ],
          }}
        >
          <Ionicons name={ICONS[index]} color="#192a56" size={98} />
        </Card>
      </CardContainer>
      <ButtonContainer>
        <Button onPress={closePress}>
          <Ionicons name="close-circle" color="white" size={58} />
        </Button>
        <Button onPress={checkPress}>
          <Ionicons name="checkmark-circle" color="white" size={58} />
        </Button>
      </ButtonContainer>
    </Container>
  );
}
