import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking, Animated, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Line, Circle, Path } from 'react-native-svg';
import { Colors, Font } from '../../../constants/colors';
import { Post } from '../../../types';
import { Avatar } from '../../../components/ui/Avatar';
import { getPost } from '../../../services/communityService';
import { startChat } from '../../../services/chatService';
import { MapPinIcon, HeartIcon, MessageIcon, ArrowRightIcon } from '../../../components/ui/Icon';

function CityMapGraphic({ city }: { city: string }) {
  const seed = city.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (n: number) => ((seed * 1103515245 + n * 22695477) & 0x7fff) / 0x7fff;
  const W = 400, H = 200;

  // Lines span 0→W and 0→H so blocks fill the full card
  const hLines = [0, 38, 70, 102, 134, 166, H];
  const vLines = [0, 52, 106, 162, 220, 278, 336, W];
  const mainHIdx = [2, 4];
  const mainVIdx = [2, 5];

  const blockColors = ['#E8E2D9', '#DDD8CF', '#E4DFDA', '#D9D4CB'];
  const parkColor = '#D6E8C8';

  const blocks: { x: number; y: number; w: number; h: number; fill: string }[] = [];
  for (let i = 0; i < hLines.length - 1; i++) {
    for (let j = 0; j < vLines.length - 1; j++) {
      const cx = (vLines[j] + vLines[j + 1]) / 2;
      const cy = (hLines[i] + hLines[i + 1]) / 2;
      const distToCenter = Math.sqrt(Math.pow(cx - W / 2, 2) + Math.pow(cy - H / 2, 2));
      if (distToCenter < 28) continue; // leave space for pin
      const t = Math.floor(r(i * 11 + j) * 4);
      const isParck = t === 3 && r(i * 7 + j) > 0.55;
      const pad = 3;
      blocks.push({
        x: vLines[j] + pad, y: hLines[i] + pad,
        w: vLines[j + 1] - vLines[j] - pad * 2,
        h: hLines[i + 1] - hLines[i] - pad * 2,
        fill: isParck ? parkColor : blockColors[t],
      });
    }
  }

  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <Rect width={W} height={H} fill="#E8E3DB" />
      {blocks.map((b, i) => (
        <Rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.fill} rx={2} />
      ))}
      {hLines.map((y, i) => (
        <Line key={`h${i}`} x1={0} y1={y} x2={W} y2={y}
          stroke={mainHIdx.includes(i) ? '#B8B2A8' : '#CCC7BF'}
          strokeWidth={mainHIdx.includes(i) ? 6 : 2} />
      ))}
      {vLines.map((x, i) => (
        <Line key={`v${i}`} x1={x} y1={0} x2={x} y2={H}
          stroke={mainVIdx.includes(i) ? '#B8B2A8' : '#CCC7BF'}
          strokeWidth={mainVIdx.includes(i) ? 6 : 2} />
      ))}
      {/* Pin */}
      <Circle cx={W / 2} cy={H / 2} r={22} fill="rgba(255,255,255,0.85)" />
      <Circle cx={W / 2} cy={H / 2} r={10} fill={Colors.primary} />
      <Circle cx={W / 2} cy={H / 2} r={5} fill="white" />
      <Circle cx={W / 2} cy={H / 2} r={22} fill="none" stroke={Colors.primary} strokeWidth={1.5} strokeOpacity={0.25} />
    </Svg>
  );
}

const CITY_COORDS: Record<string, string> = {
  '오사카':     '34°N · 135°E',
  '도쿄':       '35°N · 139°E',
  '방콕':       '13°N · 100°E',
  '파리':       '48°N · 002°E',
  '뉴욕':       '40°N · 073°W',
  '바르셀로나': '41°N · 002°E',
  '발리':       '08°S · 115°E',
  '프라하':     '50°N · 014°E',
  '리스본':     '38°N · 009°W',
  '이스탄불':   '41°N · 028°E',
  '다낭':       '16°N · 108°E',
};

const CITY_LATLNG: Record<string, { lat: number; lng: number }> = {
  '오사카':     { lat: 34.6937, lng: 135.5023 },
  '도쿄':       { lat: 35.6762, lng: 139.6503 },
  '방콕':       { lat: 13.7563, lng: 100.5018 },
  '파리':       { lat: 48.8566, lng: 2.3522   },
  '뉴욕':       { lat: 40.7128, lng: -74.0060 },
  '바르셀로나': { lat: 41.3851, lng: 2.1734   },
  '발리':       { lat: -8.3405, lng: 115.0920 },
  '프라하':     { lat: 50.0755, lng: 14.4378  },
  '리스본':     { lat: 38.7223, lng: -9.1393  },
  '이스탄불':   { lat: 41.0082, lng: 28.9784  },
  '다낭':       { lat: 16.0544, lng: 108.2022 },
};

const CATEGORY_META: Record<string, { label: string; subLabel: string; color: string; bg: string }> = {
  mate:   { label: '동행 찾기', subLabel: 'TRAVEL MATE',    color: Colors.primary,  bg: Colors.primaryLight },
  tips:   { label: '여행 기록', subLabel: 'TRAVEL LOG',     color: Colors.accent,   bg: Colors.accentLight  },
  review: { label: '로컬 추천', subLabel: 'LOCAL PICK',     color: Colors.olive,    bg: '#EBF0E6'           },
};

type RichItem = { name: string; desc: string; tip?: string };
type RichSection = { icon: string; title: string; color: string; bg: string; items: RichItem[] };

const RICH_CONTENT: Record<string, { intro: string; sections: RichSection[] }> = {
  p3: {
    intro: '오사카 3번 다녀온 경험을 총정리했어요. 처음 가는 분들이 헷갈려하는 것들 위주로 뽑았어요.',
    sections: [
      {
        icon: '🚃',
        title: '교통패스',
        color: Colors.primary,
        bg: Colors.primaryLight,
        items: [
          { name: 'ICOCA 카드', desc: '도착하자마자 관서공항역에서 구매. 전철·버스·편의점 결제까지 다 돼요.', tip: '보증금 포함 2,000엔' },
          { name: '오사카 주유패스', desc: '텐포잔·나니와 박물관 등 30곳 이상 무료 입장. USJ 안 가는 여행이면 이게 이득이에요.', tip: '1일권 2,800엔' },
          { name: '난카이 라피트', desc: '공항↔난바 직통. 하루카 특급은 더 많은 역에 서니 일정에 맞게 골라요.', tip: '편도 1,450엔' },
        ],
      },
      {
        icon: '🍜',
        title: '맛집',
        color: Colors.accent,
        bg: Colors.accentLight,
        items: [
          { name: '타코야키 도지마', desc: '아메리카무라 근처. 도톤보리보다 줄 짧고 맛이 훨씬 진해요.', tip: '저녁 6시 이후' },
          { name: '킨류 라멘', desc: '신우메다 식당가 지하. 24시간 운영이라 새벽 귀갓길에도 OK.', tip: '신우메다역 도보 3분' },
          { name: '구로몬 시장 스시', desc: '노포 직접 운영. 난바 관광 스시보다 훨씬 저렴하고 신선해요.', tip: '1관 200엔~' },
          { name: '모토마치 케이크', desc: '호리에 인기 디저트 카페. 종류 다 고르려면 오전에 가야 해요.', tip: '오전 11시 전 방문' },
        ],
      },
      {
        icon: '🏨',
        title: '숙소',
        color: Colors.olive,
        bg: '#EBF0E6',
        items: [
          { name: '난바·신사이바시', desc: '관광 중심이라 접근성 최고. 다만 밤에 시끄럽고 가격이 높아요.', tip: '위치 우선이면 추천' },
          { name: '우메다', desc: '교통 허브. 어디든 이동 편하고 가성비 호텔도 많아요.', tip: '2박 이상이면 여기' },
          { name: 'First Cabin', desc: '캡슐호텔인데 비행기 좌석 컨셉으로 프라이버시 있고 깔끔해요.', tip: '1박 3,000~4,000엔' },
          { name: '예약 타이밍', desc: '벚꽃·단풍·골든위크 시즌은 가격이 2~3배 뛰어요. 3개월 전 예약 필수.', tip: '성수기 주의' },
        ],
      },
    ],
  },
};

export default function PostDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [joinSent, setJoinSent] = useState(false);
  const [joinRoom, setJoinRoom] = useState<string | null>(null);

  const sheetSlide = useRef(new Animated.Value(400)).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (id) getPost(id).then(setPost);
  }, [id]);

  const openJoinSheet = () => {
    setShowJoinSheet(true);
    setJoinSent(false);
    setJoinMessage('');
    Animated.parallel([
      Animated.timing(sheetOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(sheetSlide, { toValue: 0, useNativeDriver: true, tension: 70, friction: 11 }),
    ]).start();
  };

  const closeJoinSheet = () => {
    Animated.parallel([
      Animated.timing(sheetOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(sheetSlide, { toValue: 400, duration: 200, useNativeDriver: true }),
    ]).start(() => { setShowJoinSheet(false); setJoinSent(false); });
  };

  const handleSendJoin = async () => {
    if (!post?.author.id) return;
    try {
      const room = await startChat(post.author.id);
      setJoinRoom(room.id);
      setJoinSent(true);
    } catch {
      Alert.alert('오류', '신청을 보낼 수 없어요.');
    }
  };

  const handleChat = async () => {
    if (!post?.author.id) return;
    setChatLoading(true);
    try {
      const room = await startChat(post.author.id);
      router.push(`/chat/${room.id}`);
    } catch {
      Alert.alert('오류', '채팅을 시작할 수 없어요.');
    } finally {
      setChatLoading(false);
    }
  };

  if (!post) return null;

  const date = new Date(post.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const cat = CATEGORY_META[post.category ?? 'mate'] ?? CATEGORY_META['mate'];
  const destination = post.trip?.destination ?? '';
  const coords = CITY_COORDS[destination] ?? null;
  const latlng = CITY_LATLNG[destination] ?? null;
  const mapImageUrl = latlng
    ? `https://maps.wikimedia.org/img/osm-intl,13,${latlng.lat},${latlng.lng},640x220.png@2x`
    : null;
  const mapsUrl = latlng
    ? `https://www.google.com/maps/search/${encodeURIComponent(destination)}`
    : null;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.canGoBack() ? router.back() : router.replace('/(app)/(tabs)/community')} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerLabel}>{cat.subLabel}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero title area */}
        <View style={styles.heroSection}>
          <View style={[styles.catPill, { backgroundColor: cat.bg }]}>
            <Text style={[styles.catPillText, { color: cat.color }]}>{cat.label}</Text>
          </View>
          <Text style={styles.title}>{post.title}</Text>

          {coords && (
            <Text style={styles.coordsText}>{coords}</Text>
          )}
        </View>

        {/* Author row */}
        <View style={styles.authorRow}>
          <Avatar nickname={post.author.nickname} size={38} />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.author.nickname}</Text>
            <Text style={styles.authorDate}>{date}</Text>
          </View>
          <TouchableOpacity style={styles.likeBtn} onPress={() => setLiked(!liked)} activeOpacity={0.7}>
            <HeartIcon color={liked ? Colors.accent : Colors.textMuted} size={14} />
            <Text style={[styles.likeCount, liked && { color: Colors.accent }]}>
              {post.likes + (liked ? 1 : 0)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Trip info card */}
        {post.trip && (
          <View style={styles.tripCard}>
            <View style={styles.tripCardTop}>
              <MapPinIcon color={Colors.primary} size={12} />
              <Text style={styles.tripDest}>{destination}{post.trip.country ? `, ${post.trip.country}` : ''}</Text>
              {coords && <Text style={styles.tripCoords}>{coords}</Text>}
            </View>
            <View style={styles.tripDateRow}>
              <View style={styles.tripDatePill}>
                <Text style={styles.tripDateText}>{post.trip.startDate} – {post.trip.endDate}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Map — tips/review only */}
        {latlng && post.category !== 'mate' && (
          <View style={styles.mapSection}>
            <Text style={styles.sectionLabel}>위치</Text>
            <TouchableOpacity
              style={styles.mapCard}
              activeOpacity={0.88}
              onPress={() => mapsUrl && Linking.openURL(mapsUrl)}
            >
              <View style={styles.mapImage}>
                <CityMapGraphic city={destination} />
              </View>
              <View style={styles.mapOverlay}>
                <View style={styles.mapPill}>
                  <MapPinIcon color={Colors.primary} size={11} />
                  <Text style={styles.mapPillText}>{destination}</Text>
                  {coords && <Text style={styles.mapPillCoords}>{coords}</Text>}
                </View>
                <View style={styles.mapLinkBtn}>
                  <Text style={styles.mapLinkText}>지도에서 보기</Text>
                  <ArrowRightIcon color={Colors.primary} size={11} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Body */}
        {RICH_CONTENT[post.id] ? (
          <View style={styles.richBody}>
            <Text style={styles.introText}>{RICH_CONTENT[post.id].intro}</Text>
            {RICH_CONTENT[post.id].sections.map((sec) => (
              <View key={sec.title} style={styles.sectionCard}>
                <View style={[styles.sectionCardHeader, { backgroundColor: sec.bg }]}>
                  <Text style={styles.sectionCardIcon}>{sec.icon}</Text>
                  <Text style={[styles.sectionCardTitle, { color: sec.color }]}>{sec.title}</Text>
                </View>
                {sec.items.map((item, idx) => (
                  <View
                    key={item.name}
                    style={[styles.richItem, idx < sec.items.length - 1 && styles.richItemBorder]}
                  >
                    <View style={styles.richItemTop}>
                      <Text style={styles.richItemName}>{item.name}</Text>
                      {item.tip && (
                        <View style={[styles.tipBadge, { backgroundColor: sec.bg }]}>
                          <Text style={[styles.tipBadgeText, { color: sec.color }]}>{item.tip}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.richItemDesc}>{item.desc}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.bodyText}>{post.content}</Text>
        )}

        {/* Travel styles */}
        {post.travelStyles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>여행 스타일</Text>
            <View style={styles.tagRow}>
              {post.travelStyles.map((s) => (
                <View key={s} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Schedule */}
        {post.trip?.schedule && post.trip.schedule.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>예상 일정</Text>
            <View style={styles.scheduleCard}>
              {post.trip.schedule.map((s, i) => (
                <View key={s.date} style={[styles.scheduleRow, i < post.trip!.schedule!.length - 1 && styles.scheduleRowBorder]}>
                  <Text style={styles.scheduleDate}>{s.date.slice(5)}</Text>
                  <Text style={styles.scheduleDot}>·</Text>
                  <Text style={styles.scheduleActivities}>{s.activities.join(' · ')}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Comments count */}
        <View style={styles.commentsHeader}>
          <MessageIcon color={Colors.textMuted} size={13} />
          <Text style={styles.commentsLabel}>댓글 {post.comments}개</Text>
        </View>

      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomActions}>
        {post.category === 'mate' && (
          <TouchableOpacity style={styles.secondaryBtn} onPress={openJoinSheet} activeOpacity={0.85}>
            <Text style={styles.secondaryBtnText}>동행 신청</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.primaryBtn, chatLoading && styles.btnDisabled]}
          onPress={handleChat}
          activeOpacity={0.85}
          disabled={chatLoading}
        >
          <Text style={styles.primaryBtnText}>{chatLoading ? '연결 중...' : '여행 이야기 나누기'}</Text>
        </TouchableOpacity>
      </View>

      {/* Join Request Sheet */}
      {showJoinSheet && (
        <Pressable style={styles.sheetBackdrop} onPress={closeJoinSheet}>
          <Animated.View style={[styles.sheetBackdropInner, { opacity: sheetOpacity }]} />
        </Pressable>
      )}
      {showJoinSheet && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrapper}>
          <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetSlide }] }]}>
            <View style={styles.sheetHandle} />

            {!joinSent ? (
              <>
                <Text style={styles.sheetTitle}>동행 신청하기</Text>
                <Text style={styles.sheetSubtitle}>신청 후 상대방이 승인하면 일정을 공유하고 동행이 확정돼요.</Text>

                {post?.trip && (
                  <View style={styles.sheetTripCard}>
                    <View style={styles.sheetTripRow}>
                      <MapPinIcon color={Colors.primary} size={12} />
                      <Text style={styles.sheetTripDest}>{post.trip.destination}{post.trip.country ? `, ${post.trip.country}` : ''}</Text>
                    </View>
                    <Text style={styles.sheetTripDate}>{post.trip.startDate} – {post.trip.endDate}</Text>
                  </View>
                )}

                <Text style={styles.sheetLabel}>짧은 소개 (선택)</Text>
                <TextInput
                  style={styles.sheetInput}
                  placeholder="안녕하세요! 저도 비슷한 일정이에요 😊"
                  placeholderTextColor={Colors.textMuted}
                  value={joinMessage}
                  onChangeText={setJoinMessage}
                  multiline
                  maxLength={150}
                />

                <TouchableOpacity style={styles.sheetSendBtn} onPress={handleSendJoin} activeOpacity={0.85}>
                  <Text style={styles.sheetSendBtnText}>신청 보내기</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.sheetSentIcon}>
                  <Text style={{ fontSize: 36 }}>✈️</Text>
                </View>
                <Text style={styles.sheetTitle}>신청을 보냈어요!</Text>
                <Text style={styles.sheetSubtitle}>상대방이 승인하면 채팅으로 연결돼요.{'\n'}승인 전까지 일정 공유는 대기 중이에요.</Text>

                <View style={styles.sheetSentActions}>
                  <TouchableOpacity
                    style={styles.sheetChatBtn}
                    activeOpacity={0.85}
                    onPress={() => { closeJoinSheet(); if (joinRoom) router.push(`/chat/${joinRoom}`); }}
                  >
                    <Text style={styles.sheetChatBtnText}>채팅 바로가기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sheetCloseBtn} onPress={closeJoinSheet} activeOpacity={0.85}>
                    <Text style={styles.sheetCloseBtnText}>닫기</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <View style={{ height: insets.bottom + 8 }} />
          </Animated.View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontSize: 20, color: Colors.textPrimary },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2.5,
    fontFamily: Font.base,
  },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingBottom: 32, gap: 20 },

  heroSection: { gap: 10, paddingTop: 4 },
  catPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  catPillText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  coordsText: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    fontWeight: '500',
  },

  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  authorDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  likeCount: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },

  divider: { height: 1, backgroundColor: Colors.cardBorder },

  tripCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  tripCardTop: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tripDest: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  tripCoords: { fontSize: 10, color: Colors.textMuted, letterSpacing: 0.8 },
  tripDateRow: { flexDirection: 'row' },
  tripDatePill: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tripDateText: { fontSize: 11, color: Colors.primary, fontWeight: '600', letterSpacing: 0.2 },

  mapSection: { gap: 10 },
  mapCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  mapImage: {
    width: '100%',
    height: 140,
    overflow: 'hidden',
  },
  mapOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  mapPill: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  mapPillText: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  mapPillCoords: { fontSize: 10, color: Colors.textMuted, letterSpacing: 0.5 },
  mapLinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mapLinkText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },

  bodyText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 26,
    fontWeight: '400',
  },

  richBody: { gap: 16 },
  introText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontWeight: '400',
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionCardIcon: { fontSize: 16 },
  sectionCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  richItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 5,
  },
  richItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  richItemTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  richItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  richItemDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: '400',
  },
  tipBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
    maxWidth: 140,
  },
  tipBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  section: { gap: 10 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: Colors.bgDeep,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  scheduleCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  scheduleRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  scheduleDate: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    width: 36,
    paddingTop: 1,
  },
  scheduleDot: { fontSize: 13, color: Colors.textMuted },
  scheduleActivities: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  commentsLabel: { fontSize: 13, color: Colors.textMuted },

  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  secondaryBtn: {
    height: 50,
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  primaryBtn: {
    height: 50,
    flex: 2,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  primaryBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },
  btnDisabled: { opacity: 0.5 },

  sheetBackdrop: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  sheetBackdropInner: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheetWrapper: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 11 },
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
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.cardBorder,
    alignSelf: 'center', marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18, fontWeight: '600', color: Colors.textPrimary,
    letterSpacing: -0.3, marginBottom: 6,
  },
  sheetSubtitle: {
    fontSize: 13, color: Colors.textMuted, lineHeight: 20, marginBottom: 20,
  },
  sheetTripCard: {
    backgroundColor: Colors.card, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.cardBorder,
    padding: 14, marginBottom: 20, gap: 6,
  },
  sheetTripRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sheetTripDest: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  sheetTripDate: { fontSize: 12, color: Colors.textMuted, marginLeft: 18 },
  sheetLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 1.5, marginBottom: 8,
  },
  sheetInput: {
    backgroundColor: Colors.card, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.cardBorder,
    padding: 14, fontSize: 14, color: Colors.textPrimary,
    minHeight: 80, textAlignVertical: 'top', marginBottom: 16,
  },
  sheetSendBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    height: 50, alignItems: 'center', justifyContent: 'center',
  },
  sheetSendBtnText: { fontSize: 15, fontWeight: '600', color: Colors.white },
  sheetSentIcon: { alignItems: 'center', marginVertical: 16 },
  sheetSentActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  sheetChatBtn: {
    flex: 2, backgroundColor: Colors.primary, borderRadius: 14,
    height: 50, alignItems: 'center', justifyContent: 'center',
  },
  sheetChatBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },
  sheetCloseBtn: {
    flex: 1, backgroundColor: Colors.card, borderRadius: 14,
    height: 50, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  sheetCloseBtnText: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
});
