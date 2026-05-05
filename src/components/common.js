import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export function Avatar({ emoji, bg, size = 40 }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg || Colors.bgCream }]}>
      <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
    </View>
  );
}

export function Tag({ label, active, gray, green, orange, red, onPress }) {
  let bgColor = Colors.tagBg;
  let textColor = Colors.tagText;
  let borderColor = Colors.tagBorder;

  if (active) { bgColor = Colors.primary; textColor = Colors.white; borderColor = Colors.primary; }
  else if (gray) { bgColor = '#f2f0eb'; textColor = '#888'; borderColor = '#e0ddd6'; }
  else if (green) { bgColor = Colors.greenBg; textColor = Colors.green; borderColor = Colors.greenBorder; }
  else if (orange) { bgColor = Colors.orangeBg; textColor = Colors.orange; borderColor = '#efd3a5'; }
  else if (red) { bgColor = Colors.redBg; textColor = Colors.red; borderColor = '#f1b8b8'; }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tag, { backgroundColor: bgColor, borderColor }]}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={[styles.tagText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Btn({ label, onPress, outline, gray, accent, danger, style }) {
  let bg = Colors.primary;
  let color = Colors.white;
  let borderWidth = 0;
  let borderColor = 'transparent';

  if (outline) { bg = Colors.white; color = Colors.primary; borderWidth = 1; borderColor = Colors.primary; }
  else if (gray) { bg = '#e8e5de'; color = '#666'; }
  else if (accent) { bg = Colors.accent; color = Colors.white; }
  else if (danger) { bg = Colors.red; color = Colors.white; }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, { backgroundColor: bg, borderWidth, borderColor }, style]}
      activeOpacity={0.8}
    >
      <Text style={[styles.btnText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Divider({ style }) {
  return <View style={[styles.divider, style]} />;
}

export function MatchBadge({ pct, size = 'lg' }) {
  const fontSize = size === 'lg' ? 20 : 14;
  const color = pct >= 90 ? Colors.primary : pct >= 80 ? Colors.accent : Colors.textMute;
  return (
    <Text style={{ fontSize, fontWeight: '800', color }}>{pct}%</Text>
  );
}

export function VerifiedBadge({ label }) {
  return (
    <View style={styles.verifiedBadge}>
      <Text style={styles.verifiedText}>✓ {label}</Text>
    </View>
  );
}

export function StarRating({ rating }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <Text style={{ color: Colors.star, fontSize: 12 }}>★</Text>
      <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.text }}>{rating}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#d5d0c5',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: 12,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.borderLight,
    marginVertical: 8,
  },
  verifiedBadge: {
    backgroundColor: Colors.greenBg,
    borderColor: Colors.greenBorder,
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  verifiedText: {
    fontSize: 10,
    color: Colors.green,
    fontWeight: '600',
  },
});
