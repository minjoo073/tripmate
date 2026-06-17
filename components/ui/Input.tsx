import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors, Radius } from '../../constants/colors';
import { EyeIcon, EyeOffIcon } from './Icon';

interface InputProps extends TextInputProps {
  label?: string;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  error?: string;
}

export function Input({ label, isPassword, containerStyle, error, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputWrap,
        focused && styles.focused,
        !!error && styles.inputError,
      ]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textPlaceholder}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword((p) => !p)} style={styles.eyeBtn}>
            {showPassword ? <EyeOffIcon color={Colors.textMuted} size={18} /> : <EyeIcon color={Colors.textMuted} size={18} />}
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.1,
    marginBottom: 8,
  },
  inputWrap: {
    height: 54,
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  focused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.card,
    // soft focus glow
    shadowColor: 'rgba(59, 81, 120, 0.22)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  inputError: { borderColor: Colors.red },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    // remove the default web focus outline (the wrapper shows focus)
    ...(typeof document !== 'undefined' ? { outlineStyle: 'none' as any } : null),
  },
  eyeBtn: { marginLeft: 8, padding: 2 },
  errorText: {
    fontSize: 12,
    color: Colors.red,
    marginTop: 6,
    marginLeft: 4,
  },
});
