import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface TagProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  color?: string;
}

export function Tag({ label, selected = false, onPress, style, color }: TagProps) {
  const bgColor = color ?? (selected ? Colors.primary : Colors.card);
  const textColor = selected ? Colors.white : Colors.textSecondary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.tag, { backgroundColor: bgColor }, !selected && styles.border, style]}
    >
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  border: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
});
