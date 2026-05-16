import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { EyeIcon, EyeOffIcon } from './Icon';

interface InputProps extends TextInputProps {
  label?: string;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export function Input({ label, isPassword, containerStyle, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrap, focused && styles.focused]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrap: {
    height: 50,
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  focused: { borderColor: Colors.primary },
  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  eyeBtn: { marginLeft: 8, padding: 2 },
});
