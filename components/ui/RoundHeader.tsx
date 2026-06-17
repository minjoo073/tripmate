import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font } from '../../constants/colors';

interface RoundHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  /** Render the title in the editorial serif face (Cormorant on web). */
  editorial?: boolean;
}

export function RoundHeader({ title, subtitle, children, style, editorial = false }: RoundHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 20 }, style]}>
      <Text style={[styles.title, editorial && styles.titleEditorial]}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  titleEditorial: {
    fontSize: 30,
    fontWeight: '300',
    letterSpacing: -0.5,
    ...Platform.select({ web: { fontFamily: Font.serif }, default: {} }),
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
});
