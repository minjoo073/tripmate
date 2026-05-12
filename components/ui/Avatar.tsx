import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface AvatarProps {
  uri?: string;
  nickname?: string;
  size?: number;
  emoji?: string;
  variant?: 'default' | 'light';
}

export function Avatar({ uri, nickname, size = 48, emoji, variant = 'default' }: AvatarProps) {
  const initial = nickname ? nickname[0] : '?';
  const isLight = variant === 'light';
  const bgColor = isLight ? 'rgba(255,255,255,0.20)' : Colors.primaryBg;
  const textColor = isLight ? Colors.white : Colors.primary;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.base, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.base,
        styles.placeholder,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor },
      ]}
    >
      <Text style={{ fontSize: size * 0.38, color: textColor, fontWeight: '700' }}>
        {emoji ?? initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    flexShrink: 0,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
