import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Elevation, Radius } from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  dark?: boolean;
  /** Shadow depth. Default 'sm' (resting). Use 'md'/'lg' for featured cards. */
  elevation?: keyof typeof Elevation;
  /** Drop the hairline border (useful when relying on shadow alone). */
  borderless?: boolean;
}

export function Card({ children, style, dark = false, elevation = 'sm', borderless = false }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        Elevation[elevation],
        borderless && styles.borderless,
        dark && styles.dark,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  borderless: { borderWidth: 0 },
  dark: {
    backgroundColor: Colors.cardDark,
    borderColor: 'transparent',
  },
});
