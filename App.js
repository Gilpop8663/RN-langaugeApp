import React, { useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { ICONS } from './icons';
import CardProject from './src/CardProject';
import DragProject from './src/DragProject';

export default function App() {
  return <DragProject></DragProject>;
}
