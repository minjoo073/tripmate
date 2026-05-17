import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  TextInput, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { MapPinIcon } from '../ui/Icon';
import { startChat } from '../../services/chatService';

interface Props {
  visible: boolean;
  onClose: () => void;
  userId: string;
  nickname: string;
  destination?: string;
  dates?: string;
}

export function JoinSheet({ visible, onClose, userId, nickname, destination, dates }: Props) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(500)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setSent(false);
      setMessage('');
      setRoomId(null);
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 70, friction: 11 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 500, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleSend = async () => {
    try {
      const room = await startChat(userId);
      setRoomId(room.id);
      setSent(true);
    } catch {}
  };

  const handleGoChat = () => {
    onClose();
    if (roomId) router.push(`/chat/${roomId}`);
  };

  if (!visible) return null;

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View style={[styles.backdropInner, { opacity: opacityAnim }]} />
      </Pressable>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrapper}>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.handle} />

          {!sent ? (
            <>
              <Text style={styles.title}>동행 신청하기</Text>
              <Text style={styles.subtitle}>신청 후 상대방이 승인하면 일정을 공유하고 동행이 확정돼요.</Text>

              {(destination || dates) && (
                <View style={styles.tripCard}>
                  {destination && (
                    <View style={styles.tripRow}>
                      <MapPinIcon color={Colors.primary} size={12} />
                      <Text style={styles.tripDest}>{destination}</Text>
                    </View>
                  )}
                  {dates && <Text style={styles.tripDates}>{dates}</Text>}
                </View>
              )}

              <Text style={styles.label}>짧은 소개 (선택)</Text>
              <TextInput
                style={styles.input}
                placeholder={`안녕하세요! ${nickname}님의 여행에 함께하고 싶어요 😊`}
                placeholderTextColor={Colors.textMuted}
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={150}
              />

              <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.85}>
                <Text style={styles.sendBtnText}>신청 보내기</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.sentIconWrap}>
                <Text style={{ fontSize: 36 }}>✈️</Text>
              </View>
              <Text style={styles.title}>신청을 보냈어요!</Text>
              <Text style={styles.subtitle}>
                {nickname}님이 승인하면 채팅으로 연결돼요.{'\n'}승인 전까지 일정 공유는 대기 중이에요.
              </Text>
              <View style={styles.sentActions}>
                <TouchableOpacity style={styles.chatBtn} onPress={handleGoChat} activeOpacity={0.85}>
                  <Text style={styles.chatBtnText}>채팅 바로가기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.85}>
                  <Text style={styles.closeBtnText}>닫기</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={{ height: insets.bottom + 8 }} />
        </Animated.View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  backdropInner: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  wrapper: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 11 },
  sheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.cardBorder,
    alignSelf: 'center', marginBottom: 20,
  },
  title: {
    fontSize: 18, fontWeight: '600', color: Colors.textPrimary,
    letterSpacing: -0.3, marginBottom: 6,
  },
  subtitle: {
    fontSize: 13, color: Colors.textMuted, lineHeight: 20, marginBottom: 20,
  },
  tripCard: {
    backgroundColor: Colors.card, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.cardBorder,
    padding: 14, marginBottom: 20, gap: 6,
  },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tripDest: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  tripDates: { fontSize: 12, color: Colors.textMuted, marginLeft: 18 },
  label: {
    fontSize: 11, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 1.5, marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.cardBorder,
    padding: 14, fontSize: 14, color: Colors.textPrimary,
    minHeight: 80, textAlignVertical: 'top', marginBottom: 16,
  },
  sendBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    height: 50, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnText: { fontSize: 15, fontWeight: '600', color: Colors.white },
  sentIconWrap: { alignItems: 'center', marginVertical: 16 },
  sentActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  chatBtn: {
    flex: 2, backgroundColor: Colors.primary, borderRadius: 14,
    height: 50, alignItems: 'center', justifyContent: 'center',
  },
  chatBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },
  closeBtn: {
    flex: 1, backgroundColor: Colors.card, borderRadius: 14,
    height: 50, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  closeBtnText: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
});
