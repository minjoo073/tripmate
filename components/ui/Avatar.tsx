import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { getProfileIcon } from '../../constants/profileIcons';

interface AvatarProps {
  uri?: string;
  nickname?: string;
  size?: number;
  emoji?: string;
  variant?: 'default' | 'light';
}

export function Avatar({ uri, nickname, size = 48 }: AvatarProps) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.base, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  const icon: ImageSourcePropType = getProfileIcon(nickname ?? '?');

  return (
    <View
      style={[
        styles.base,
        styles.placeholder,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Image
        source={icon}
        style={{ width: size * 0.75, height: size * 0.75 }}
        resizeMode="contain"
      />
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
    backgroundColor: '#F0EDE8',
  },
});
