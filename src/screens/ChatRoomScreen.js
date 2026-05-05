import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar } from '../components/common';
import { chatMessages, currentUser } from '../data/mockData';

export default function ChatRoomScreen({ navigation, route }) {
  const mate = route.params?.mate;
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState('');
  const [showCompanionCard, setShowCompanionCard] = useState(false);
  const flatListRef = React.useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { id: `m${Date.now()}`, type: 'me', text: input.trim(), time: '지금' };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  const renderMessage = ({ item }) => {
    if (item.type === 'schedule') {
      return (
        <View style={styles.scheduleCard}>
          <Text style={styles.scheduleTitle}>✈️  {item.title}</Text>
          <Text style={styles.scheduleDest}>{item.destination}</Text>
          <Text style={styles.scheduleDate}>{item.startDate} ~ {item.endDate}</Text>
        </View>
      );
    }
    if (item.type === 'companion_request') {
      return (
        <View style={styles.companionCard}>
          <Text style={styles.companionTitle}>동행 신청이 왔어요!</Text>
          <Text style={styles.companionSub}>{mate?.name} 님이 동행을 요청했어요</Text>
          <View style={styles.companionBtns}>
            <TouchableOpacity
              style={styles.companionDecline}
              onPress={() => setMessages((prev) => prev.filter((m) => m.id !== item.id))}
            >
              <Text style={styles.companionDeclineText}>거절</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.companionAccept}
              onPress={() => navigation.navigate('TripConfirm', { mate })}
            >
              <Text style={styles.companionAcceptText}>수락 ✓</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    const isMe = item.type === 'me';
    return (
      <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
        {!isMe && <Avatar emoji={mate?.avatar || '🐱'} bg={mate?.avatarBg} size={30} />}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{item.text}</Text>
        </View>
        <Text style={styles.msgTime}>{item.time}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          {mate && <Avatar emoji={mate.avatar} bg={mate.avatarBg} size={32} />}
          <View>
            <Text style={styles.headerName}>{mate?.name || '채팅'}</Text>
            <Text style={styles.headerDest}>{mate?.destination}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileDetail', { mate })}>
          <Text style={styles.moreText}>👤</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 14, gap: 10 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={renderMessage}
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.plusBtn}>
            <Text style={styles.plusBtnText}>+</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="메시지 입력..."
            placeholderTextColor={Colors.textHint}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
          >
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
    gap: 10,
  },
  backText: { fontSize: 20, color: Colors.text },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerName: { fontSize: 15, fontWeight: '700', color: Colors.black },
  headerDest: { fontSize: 11, color: Colors.textMute },
  moreText: { fontSize: 18 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 2 },
  msgRowMe: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '65%',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleMe: { backgroundColor: Colors.primary, borderBottomRightRadius: 2 },
  bubbleOther: { backgroundColor: Colors.white, borderBottomLeftRadius: 2, borderWidth: 0.5, borderColor: Colors.border },
  bubbleText: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  bubbleTextMe: { color: Colors.white },
  msgTime: { fontSize: 10, color: Colors.textHint },
  scheduleCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 4,
    alignSelf: 'center',
    width: '80%',
    marginVertical: 4,
  },
  scheduleTitle: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  scheduleDest: { fontSize: 15, fontWeight: '800', color: Colors.black },
  scheduleDate: { fontSize: 12, color: Colors.textMute },
  companionCard: {
    backgroundColor: Colors.tagBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 8,
    alignSelf: 'center',
    width: '90%',
    marginVertical: 4,
  },
  companionTitle: { fontSize: 15, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  companionSub: { fontSize: 13, color: Colors.textSub, textAlign: 'center' },
  companionBtns: { flexDirection: 'row', gap: 8, marginTop: 4 },
  companionDecline: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  companionDeclineText: { fontSize: 14, color: Colors.textSub },
  companionAccept: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  companionAcceptText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  plusBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  plusBtnText: { fontSize: 20, color: Colors.textSub, lineHeight: 26 },
  input: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.bg,
    maxHeight: 80,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.border },
  sendBtnText: { fontSize: 18, color: Colors.white, fontWeight: '700' },
});
