import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Elevation, Radius, Space } from '../../constants/colors';

interface Props {
  content: string;
  isMe: boolean;
  time?: string;
}

function ChatBubbleInner({ content, isMe, time }: Props) {
  return (
    <View style={[styles.wrap, isMe && styles.wrapMe]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <Text style={[styles.text, isMe && styles.textMe]}>{content}</Text>
      </View>
      {time && <Text style={styles.time}>{time}</Text>}
    </View>
  );
}

export const ChatBubble = React.memo(ChatBubbleInner);

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', gap: Space.sm, marginBottom: Space.md },
  wrapMe: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '76%',
    paddingHorizontal: Space.lg,
    paddingVertical: Space.md,
    borderRadius: Radius.lg,
  },
  bubbleOther: {
    backgroundColor: Colors.chatBg,
    borderTopLeftRadius: 4,
    ...Elevation.sm,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: 4,
    ...Elevation.primary,
  },
  text: { fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },
  textMe: { color: Colors.white },
  time: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
});
