import React, { useMemo } from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

let gradSeq = 0;

interface GradientProps {
  // Top→bottom color stops. e.g. ['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']
  colors: readonly string[];
  // Optional explicit stop offsets (0..1), same length as colors.
  locations?: readonly number[];
  // 'vertical' (default, top→bottom) or 'horizontal' (left→right)
  direction?: 'vertical' | 'horizontal';
  style?: ViewStyle;
  pointerEvents?: 'none' | 'auto';
}

/**
 * A lightweight gradient fill backed by react-native-svg (works on web + native,
 * no extra native dependency). Absolutely fills its parent by default — drop it
 * over a photo as a scrim, then layer text on top.
 */
export function Gradient({
  colors,
  locations,
  direction = 'vertical',
  style,
  pointerEvents = 'none',
}: GradientProps) {
  const isV = direction === 'vertical';
  const n = colors.length;
  const id = useMemo(() => `grad${gradSeq++}`, []);
  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents={pointerEvents}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient
            id={id}
            x1="0"
            y1="0"
            x2={isV ? '0' : '1'}
            y2={isV ? '1' : '0'}
          >
            {colors.map((c, i) => (
              <Stop
                key={i}
                offset={locations ? locations[i] : i / (n - 1)}
                stopColor={c}
                stopOpacity={1}
              />
            ))}
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
