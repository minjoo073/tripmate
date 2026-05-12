import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'text';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({ label, onPress, variant = 'primary', disabled, loading, style, textStyle, fullWidth = true }: ButtonProps) {
  const variantStyle = variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : styles.textBtn;
  const variantTextStyle = variant === 'primary' ? styles.primaryText : variant === 'secondary' ? styles.secondaryText : styles.textBtnText;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      style={[styles.base, variantStyle, fullWidth && styles.full, (disabled || loading) && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : Colors.primary} size="small" />
      ) : (
        <Text style={[styles.baseText, variantTextStyle, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  full: { width: '100%' },
  primary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.shadowButton,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  secondary: {
    backgroundColor: Colors.primaryBg,
  },
  textBtn: {
    backgroundColor: 'transparent',
    height: 40,
  },
  disabled: { opacity: 0.45 },
  baseText: { fontSize: 16, fontWeight: '600' },
  primaryText: { color: Colors.white },
  secondaryText: { color: Colors.primary },
  textBtnText: { color: Colors.textSecondary },
});
