import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, Animated, Pressable,
} from 'react-native';
import { SendIcon } from '../../../components/ui/Icon';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Message, ChatRoom } from '../../../types';
import { ChatBubble } from '../../../components/chat/ChatBubble';
import { TripCard } from '../../../components/chat/TripCard';
import { Avatar } from '../../../components/ui/Avatar';
import { getMessages, sendMessage, sendTripCard, acceptCompanion, rejectCompanion, getDynamicRoom } from '../../../services/chatService';
import { mockChatRooms, mockMyTrip } from '../../../mock/data';

export default function ChatRoomScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [text, setText] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [showConfirmedModal, setShowConfirmedModal] = useState(false);
  const [myTripShared, setMyTripShared] = useState(false);
  const flatRef = useRef<FlatList>(null);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(320)).current;

  useEffect(() => {
    const found = mockChatRooms.find((r) => r.id === id) ?? getDynamicRoom(id) ?? mockChatRooms[0];
    setRoom(found);
    setAccepted(found.status === 'accepted');
    if (id) getMessages(id).then((msgs) => {
      setMessages(msgs);
      setMyTripShared(msgs.some((m) => m.senderId === 'me' && m.type === 'trip_share'));
      // Auto-open proposal sheet if pending
      if (found.status === 'pending') {
        setTimeout(() => openModal(setShowCompanionModal, true), 400);
      }
    });
  }, [id]);

  const openModal = (setter: (v: boolean) => void, isSheet = false) => {
    setter(true);
    if (isSheet) {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 70, friction: 10 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  };

  const closeModal = (setter: (v: boolean) => void, cb?: () => void, isSheet = false) => {
    if (isSheet) {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 320, duration: 220, useNativeDriver: true }),
      ]).start(() => {
        setter(false);
        opacityAnim.setValue(0);
        slideAnim.setValue(320);
        cb?.();
      });
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 0.92, duration: 140, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 140, useNativeDriver: true }),
      ]).start(() => {
        setter(false);
        scaleAnim.setValue(0.9);
        opacityAnim.setValue(0);
        cb?.();
      });
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !id) return;
    const msg = await sendMessage(id, text.trim());
    setMessages((prev) => [...prev, msg]);
    setText('');
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleShareTrip = async () => {
    if (!id || myTripShared) return;
    const msg = await sendTripCard(id, mockMyTrip);
    setMessages((prev) => [...prev, msg]);
    setMyTripShared(true);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleDecide = () => {
    openModal(setShowCompanionModal, true);
  };

  const handleCompanionConfirm = async () => {
    if (!id) return;
    await acceptCompanion(id);
    setAccepted(true);
    closeModal(setShowCompanionModal, () => {
      setTimeout(() => openModal(setShowConfirmedModal), 100);
    }, true);
  };

  const handleConfirmedDone = () => {
    closeModal(setShowConfirmedModal, () => {
      router.push({ pathname: '/match/confirmed', params: { partnerId: room?.partner.id, tripId: room?.trip?.id } });
    });
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

  // Find index of last trip_share from partner to show action buttons only there
  const lastPartnerTripIdx = messages.reduce((last, msg, i) =>
    (msg.senderId !== 'me' && msg.type === 'trip_share') ? i : last, -1);

  const isPending = room?.status === 'pending' && !accepted;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/mates')}
          style={styles.headerBtn}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Avatar nickname={room?.partner.nickname} size={36} />
        <View style={styles.headerInfo}>
          <Text style={styles.partnerName} numberOfLines={1}>{room?.partner.nickname ?? '...'}</Text>
          {isPending && <Text style={styles.pendingBadge}>동행 제안 받음</Text>}
          {accepted && <Text style={styles.acceptedBadge}>✓ 동행 확정</Text>}
        </View>
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
                showActions={false}
                accepted={!isMe && accepted}
                isOwn={isMe}
              />
            );
          }
          return <ChatBubble content={item.content} isMe={isMe} time={formatTime(item.createdAt)} />;
        }}
      />

      {/* Pending decision banner */}
      {isPending && (
        <TouchableOpacity style={styles.pendingBanner} onPress={handleDecide} activeOpacity={0.88}>
          <Text style={styles.pendingBannerText}>🤝 {room?.partner.nickname}님과 동행할까요?</Text>
          <Text style={styles.pendingBannerCta}>결정하기 →</Text>
        </TouchableOpacity>
      )}

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
        {/* Trip share button */}
        <TouchableOpacity
          style={[styles.tripShareBtn, myTripShared && styles.tripShareBtnDone]}
          onPress={handleShareTrip}
          disabled={myTripShared}
          activeOpacity={0.75}
        >
          <Text style={styles.tripShareIcon}>{myTripShared ? '✓' : '🗓'}</Text>
        </TouchableOpacity>
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

      {/* 동행 제안 바텀 시트 — 채팅창 전체를 덮는 절대 위치 */}
      {showCompanionModal && (
        <Animated.View style={[styles.sheetOverlay, { opacity: opacityAnim }]}>
          <Pressable style={styles.sheetDismiss} onPress={() => closeModal(setShowCompanionModal, undefined, true)} />
          <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Avatar nickname={room?.partner.nickname} size={48} />
              <View style={styles.sheetHeaderInfo}>
                <Text style={styles.sheetPartnerName}>{room?.partner.nickname}</Text>
                <Text style={styles.sheetPartnerSub}>동행을 제안했어요</Text>
              </View>
              <View style={styles.sheetBadge}>
                <Text style={styles.sheetBadgeText}>미확정</Text>
              </View>
            </View>

            <View style={styles.sheetTripBox}>
              <Text style={styles.sheetTripDest}>📍 {room?.trip?.destination ?? mockMyTrip.destination}</Text>
              <Text style={styles.sheetTripDate}>
                {room?.trip?.startDate ?? mockMyTrip.startDate} – {room?.trip?.endDate ?? mockMyTrip.endDate}
              </Text>
            </View>

            <Text style={styles.sheetHint}>지금 바로 결정하지 않아도 돼요. 대화를 더 나눠보세요.</Text>

            <View style={styles.sheetActions}>
              <TouchableOpacity
                style={styles.sheetRejectBtn}
                onPress={() => closeModal(setShowCompanionModal, () => handleReject(), true)}
                activeOpacity={0.8}
              >
                <Text style={styles.sheetRejectText}>거절하기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetConfirmBtn} onPress={handleCompanionConfirm} activeOpacity={0.85}>
                <Text style={styles.sheetConfirmText}>동행하기 🤝</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      )}

      {/* 확정 모달 — 앱 프레임 내 절대 위치 */}
      {showConfirmedModal && (
        <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
          <Animated.View style={[styles.modalBox, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.confirmedIcon}>
              <Text style={styles.confirmedIconText}>🎉</Text>
            </View>
            <Text style={styles.modalTitle}>동행이 확정되었어요!</Text>
            <Text style={styles.modalSub}>
              {room?.partner.nickname}님과 함께하는{'\n'}
              {room?.trip?.destination ?? mockMyTrip.destination} 여행이 시작돼요
            </Text>
            <TouchableOpacity style={styles.confirmedDoneBtn} onPress={handleConfirmedDone} activeOpacity={0.85}>
              <Text style={styles.confirmedDoneText}>확인하기</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
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
  headerInfo: { flex: 1, gap: 2 },
  partnerName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  pendingBadge: { fontSize: 10, color: Colors.accent, fontWeight: '600' },
  acceptedBadge: { fontSize: 10, color: Colors.green, fontWeight: '600' },
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

  pendingBanner: {
    backgroundColor: Colors.accentLight,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#EDD9C6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingBannerText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  pendingBannerCta: { fontSize: 13, color: Colors.accent, fontWeight: '700' },

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
    gap: 8,
  },
  tripShareBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tripShareBtnDone: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  tripShareIcon: { fontSize: 16 },
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

  // Bottom sheet
  sheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20,16,12,0.55)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  sheetDismiss: { flex: 1 },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 16,
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.cardBorder,
    alignSelf: 'center',
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sheetHeaderInfo: { flex: 1, gap: 3 },
  sheetPartnerName: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.3 },
  sheetPartnerSub: { fontSize: 12, color: Colors.textMuted },
  sheetBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(192,135,70,0.25)',
  },
  sheetBadgeText: { fontSize: 10, fontWeight: '600', color: Colors.accent },
  sheetTripBox: {
    backgroundColor: Colors.bg,
    borderRadius: 14,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sheetTripDest: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  sheetTripDate: { fontSize: 12, color: Colors.textMuted },
  sheetHint: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
  sheetActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  sheetRejectBtn: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.bgDeep,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sheetRejectText: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  sheetConfirmBtn: {
    flex: 2,
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetConfirmText: { fontSize: 15, fontWeight: '600', color: Colors.white },

  // Centered modals (confirmed)
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(28, 30, 34, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    zIndex: 200,
  },
  modalBox: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  modalEmoji: { fontSize: 36, marginBottom: 4 },
  modalTitle: {
    fontSize: 20, fontWeight: '700', color: Colors.textPrimary,
    letterSpacing: -0.3, marginBottom: 4,
  },
  modalSub: {
    fontSize: 14, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22, marginBottom: 4,
  },
  partnerPreview: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.bg, borderRadius: 14, padding: 14,
    width: '100%', marginTop: 4, marginBottom: 8,
  },
  partnerPreviewInfo: { flex: 1, gap: 3 },
  partnerPreviewName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  partnerPreviewSub: { fontSize: 12, color: Colors.textMuted },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8, width: '100%' },
  modalRejectBtn: {
    flex: 1, height: 48, backgroundColor: 'rgba(192, 80, 80, 0.07)',
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(192, 80, 80, 0.2)',
  },
  modalRejectText: { fontSize: 15, fontWeight: '500', color: Colors.red },
  modalConfirmBtn: {
    flex: 2, height: 48, backgroundColor: Colors.primary,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  modalConfirmText: { fontSize: 15, fontWeight: '700', color: Colors.white },

  confirmedIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  confirmedIconText: { fontSize: 30 },
  confirmedDoneBtn: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  confirmedDoneText: { fontSize: 16, fontWeight: '700', color: Colors.white, letterSpacing: -0.2 },
});
