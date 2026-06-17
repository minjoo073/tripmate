import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Elevation, Radius, Space } from '../../constants/colors';
import {
  ArrowLeftIcon, WaveIcon, FireIcon, MoonIcon, SunIcon,
  UsersIcon, ProfileNavIcon, SparkleIcon, ExploreIcon,
  CalendarIcon, MapIcon, HomeIcon, MapPinIcon, StarIcon,
  HeartIcon, BookmarkIcon,
} from '../../components/ui/Icon';
import { usePersonality, Personality } from '../../context/PersonalityContext';

const DIMENSIONS = [
  {
    key: 'pace' as keyof Personality,
    label: '여행 속도',
    options: [
      { value: '느긋한',  desc: '하루에 한두 곳이면 충분',  Icon: WaveIcon    },
      { value: '적당히',  desc: '쉬면서 알차게',            Icon: ExploreIcon },
      { value: '바쁘게',  desc: '빠짐없이 최대한 많이',     Icon: FireIcon    },
    ],
  },
  {
    key: 'time' as keyof Personality,
    label: '활동 시간',
    options: [
      { value: '아침형',   desc: '일찍 출발, 일찍 귀환',    Icon: SunIcon     },
      { value: '저녁형',   desc: '느지막이 시작, 밤까지',   Icon: MoonIcon    },
      { value: '상관없음', desc: '그날그날 달라요',          Icon: SparkleIcon },
    ],
  },
  {
    key: 'companion' as keyof Personality,
    label: '동행 스타일',
    options: [
      { value: '항상 함께',     desc: '같이 다니고 싶어요',   Icon: UsersIcon      },
      { value: '적당히 함께',   desc: '필요할 때 합류해요',   Icon: HeartIcon      },
      { value: '각자 자유롭게', desc: '개인 시간이 중요해요', Icon: ProfileNavIcon },
    ],
  },
  {
    key: 'accommodation' as keyof Personality,
    label: '숙소 스타일',
    options: [
      { value: '호텔',      desc: '깔끔하고 편안하게',         Icon: HomeIcon    },
      { value: '현지 숙소', desc: '에어비앤비·게스트하우스',   Icon: MapPinIcon  },
      { value: '잠만 자면', desc: '위치·가격이 우선',          Icon: BookmarkIcon },
    ],
  },
  {
    key: 'dining' as keyof Personality,
    label: '식사 스타일',
    options: [
      { value: '현지 맛집',  desc: '줄 서서라도 먹어야죠',     Icon: FireIcon    },
      { value: '간편하게',   desc: '편의점·길거리 음식 OK',    Icon: WaveIcon    },
      { value: '특별한 식사', desc: '분위기 좋은 레스토랑',    Icon: StarIcon    },
    ],
  },
  {
    key: 'planning' as keyof Personality,
    label: '계획 스타일',
    options: [
      { value: '꼼꼼한 계획', desc: '시간표대로 움직여요',     Icon: CalendarIcon },
      { value: '큰 틀만',     desc: '숙소만 잡고 떠나요',      Icon: MapIcon      },
      { value: '완전 즉흥',   desc: '현지에서 다 결정해요',    Icon: SparkleIcon  },
    ],
  },
  {
    key: 'budget' as keyof Personality,
    label: '소비 스타일',
    options: [
      { value: '알뜰하게',    desc: '최대한 절약해요',          Icon: BookmarkIcon },
      { value: '가성비',      desc: '적당히 균형있게',          Icon: ExploreIcon  },
      { value: '경험에 투자', desc: '좋은 건 아낌없이',         Icon: HeartIcon    },
    ],
  },
];

export default function TravelPersonalityScreen() {
  const insets = useSafeAreaInsets();
  const { personality, save } = usePersonality();
  const [selected, setSelected] = useState<Personality>({ ...personality });

  function pick(key: keyof Personality, value: string) {
    setSelected((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    await save(selected);
    router.replace('/(tabs)/profile');
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>MY PROFILE</Text>
          <Text style={styles.headerTitle}>여행 성향</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.desc}>나의 여행 스타일을 선택해주세요. 잘 맞는 동행을 찾는 데 활용됩니다.</Text>

        {DIMENSIONS.map((dim) => (
          <View key={dim.key} style={styles.section}>
            <Text style={styles.sectionLabel}>{dim.label}</Text>
            <View style={styles.optionRow}>
              {dim.options.map(({ value, desc, Icon }) => {
                const active = selected[dim.key] === value;
                return (
                  <TouchableOpacity
                    key={value}
                    style={[styles.optionCard, active && styles.optionCardActive]}
                    onPress={() => pick(dim.key, value)}
                    activeOpacity={0.82}
                  >
                    <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                      <Icon color={active ? Colors.primary : Colors.textSecondary} size={20} />
                    </View>
                    <Text style={[styles.optionValue, active && styles.optionValueActive]}>{value}</Text>
                    <Text style={[styles.optionDesc, active && styles.optionDescActive]}>{desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.88}>
          <Text style={styles.saveBtnText}>저장하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Space.xl,
    paddingVertical: Space.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.card,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center', gap: 3 },
  headerLabel: {
    fontSize: 9, fontWeight: '700' as const, color: Colors.textMuted,
    letterSpacing: 2.5, textTransform: 'uppercase' as const,
  },
  headerTitle: { fontSize: 17, fontWeight: '500' as const, color: Colors.textPrimary, letterSpacing: -0.3 },
  headerRight: { width: 36 },

  scroll: { flex: 1 },
  content: { paddingHorizontal: Space.xl, paddingTop: Space.xl, gap: Space.xxl },

  desc: { fontSize: 12, color: Colors.textMuted, lineHeight: 18 },

  section: { gap: Space.sm },
  sectionLabel: {
    fontSize: 10, fontWeight: '700' as const, color: Colors.textMuted,
    letterSpacing: 2, textTransform: 'uppercase' as const,
  },
  optionRow: { flexDirection: 'row', gap: Space.sm },

  optionCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    paddingVertical: Space.md,
    paddingHorizontal: Space.sm,
    alignItems: 'center',
    gap: 6,
    ...Elevation.sm,
  },
  optionCardActive: {
    backgroundColor: Colors.primaryLight,
    // Override shadow with primary-tinted for active state
    shadowColor: 'rgba(59,81,120,0.22)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: 'rgba(59,81,120,0.13)' },

  optionValue: {
    fontSize: 11, fontWeight: '600' as const, color: Colors.textPrimary,
    letterSpacing: -0.2, textAlign: 'center' as const,
  },
  optionValueActive: { color: Colors.primary },

  optionDesc: {
    fontSize: 9, color: Colors.textMuted, textAlign: 'center' as const, lineHeight: 12,
  },
  optionDescActive: { color: Colors.dustBlue },

  footer: {
    paddingHorizontal: Space.xl,
    paddingTop: Space.md,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Space.lg,
    alignItems: 'center',
    ...Elevation.primary,
  },
  saveBtnText: { fontSize: 15, fontWeight: '600' as const, color: Colors.white, letterSpacing: -0.2 },
});
