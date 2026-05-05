import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  dark?: boolean;
}

export function Card({ children, style, dark = false }: CardProps) {
  return (
    <View style={[styles.card, dark && styles.dark, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  dark: {
    backgroundColor: Colors.cardDark,
    borderColor: 'transparent',
  },
});
