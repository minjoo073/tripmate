import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface ToggleProps {
  value: boolean;
  onValueChange: (v: boolean) => void;
}

export function Toggle({ value, onValueChange }: ToggleProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: value ? 1 : 0, duration: 150, useNativeDriver: false }).start();
  }, [value]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });
  const bg = anim.interpolate({ inputRange: [0, 1], outputRange: ['#D1D5DB', Colors.primary] });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, { backgroundColor: bg }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
