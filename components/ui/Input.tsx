import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

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
          <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
            <Text style={styles.eye}>{showPassword ? '숨기기' : '보기'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputWrap: {
    height: 48,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  focused: { borderColor: Colors.primary },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  eye: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
});
