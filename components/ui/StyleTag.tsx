import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStyleColor } from '../../constants/styleColors';

interface Props {
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StyleTag({ label, size = 'md' }: Props) {
  const { bg, text } = getStyleColor(label);
  return (
    <View style={[styles.tag, size === 'sm' && styles.tagSm, size === 'lg' && styles.tagLg, { backgroundColor: bg }]}>
      <Text style={[styles.text, size === 'sm' && styles.textSm, size === 'lg' && styles.textLg, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagLg: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
  },
  textSm: {
    fontSize: 10,
  },
  textLg: {
    fontSize: 13,
    fontWeight: '500',
  },
});
