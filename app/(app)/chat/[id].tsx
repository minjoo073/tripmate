import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SendIcon } from '../../../components/ui/Icon';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Message, ChatRoom } from '../../../types';
import { ChatBubble } from '../../../components/chat/ChatBubble';
import { TripCard } from '../../../components/chat/TripCard';
import { Avatar } from '../../../components/ui/Avatar';
import { getMessages, sendMessage, acceptCompanion, rejectCompanion, getChatRooms } from '../../../services/chatService';
import { mockChatRooms } from '../../../mock/data';

export default function ChatRoomScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [text, setText] = useState('');
  const [accepted, setAccepted] = useState(false);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    const found = mockChatRooms.find((r) => r.id === id) ?? mockChatRooms[0];
    setRoom(found);
    setAccepted(found.status === 'accepted');
    if (id) getMessages(id).then(setMessages);
  }, [id]);

  const handleSend = async () => {
    if (!text.trim() || !id) return;
    const msg = await sendMessage(id, text.trim());
    setMessages((prev) => [...prev, msg]);
    setText('');
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleAccept = async () => {
    if (!id) return;
    await acceptCompanion(id);
    setAccepted(true);
    router.push({ pathname: '/match/confirmed', params: { partnerId: room?.partner.id, tripId: room?.trip?.id } });
  };

  const handleReject = async () => {
    if (!id) return;
    Alert.alert('거절하기', '동행을 거절하시겠어요?', [
      { text: '취소', style: 'cancel' },
      { text: '거절', style: 'destructive', onPress: async () => { await rejectCompanion(id); router.back(); } },
    ]);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Avatar nickname={room?.partner.nickname} size={36} />
        <Text style={styles.partnerName} numberOfLines={1}>{room?.partner.nickname ?? '...'}</Text>
        <TouchableOpacity
          style={styles.profileLink}
          onPress={() => room?.partner.id && router.push(`/mate/${room.partner.id}`)}
        >
          <Text style={styles.profileLinkText}>프로필</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const isMe = item.senderId === 'me';
          if (item.type === 'trip_share' && item.tripData) {
            return (
              <TripCard
                trip={item.tripData}
                showActions={!isMe && !accepted}
                accepted={accepted}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            );
          }
          return <ChatBubble content={item.content} isMe={isMe} time={formatTime(item.createdAt)} />;
        }}
      />

      {/* Confirmed banner */}
      {accepted && (
        <TouchableOpacity
          style={styles.confirmedBanner}
          onPress={() => router.push({ pathname: '/match/confirmed', params: { partnerId: room?.partner.id, tripId: room?.trip?.id } })}
        >
          <Text style={styles.confirmedText}>🎉 동행이 확정되었어요 · 확인하기 →</Text>
        </TouchableOpacity>
      )}

      {/* Input */}
      <View style={[styles.inputWrap, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="메시지 입력"
          placeholderTextColor={Colors.textPlaceholder}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          multiline={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          activeOpacity={0.8}
          disabled={!text.trim()}
        >
          <SendIcon color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    gap: 10,
  },
  headerBtn: { padding: 4 },
  back: { fontSize: 22, color: Colors.textPrimary },
  partnerName: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  profileLink: {
    backgroundColor: Colors.bg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  profileLinkText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  confirmedBanner: {
    backgroundColor: Colors.primaryBg,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  confirmedText: { fontSize: 13, color: Colors.primary, fontWeight: '600', textAlign: 'center' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    backgroundColor: Colors.white,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.bg,
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.cardBorder },
  sendIcon: { fontSize: 18, color: Colors.white, fontWeight: '700' },
});
