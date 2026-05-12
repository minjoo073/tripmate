import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  content: string;
  isMe: boolean;
  time?: string;
}

export function ChatBubble({ content, isMe, time }: Props) {
  return (
    <View style={[styles.wrap, isMe && styles.wrapMe]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <Text style={[styles.text, isMe && styles.textMe]}>{content}</Text>
      </View>
      {time && <Text style={styles.time}>{time}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 10 },
  wrapMe: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '72%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleOther: {
    backgroundColor: Colors.chatBg,
    borderTopLeftRadius: 6,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: 6,
  },
  text: { fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },
  textMe: { color: Colors.white },
  time: { fontSize: 10, color: Colors.textSecondary, marginBottom: 2 },
});
