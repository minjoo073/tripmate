import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { FindMateFilter } from '../../../types';
import { TRAVEL_STYLES } from '../../../mock/data';
import {
  ArrowLeftIcon, MapPinIcon, MapIcon, MoonIcon, CalendarIcon, VerifiedIcon, CompassIcon,
  SmileIcon, ZapIcon, CameraIcon, CoffeeIcon, UtensilsIcon,
  BackpackIcon, ShoppingBagIcon, LandmarkIcon, StoreIcon, LeafIcon,
} from '../../../components/ui/Icon';

const POPULAR_CITIES = ['오사카', '도쿄', '방콕', '파리', '발리', '뉴욕'];

const STYLE_ICON: Record<string, (color: string) => React.ReactNode> = {
  '피식':      (c) => <SmileIcon color={c} size={22} />,
  '액티비티':  (c) => <ZapIcon color={c} size={22} />,
  '사진':      (c) => <CameraIcon color={c} size={22} />,
  '관광':      (c) => <MapIcon color={c} size={22} />,
  '힐링':      (c) => <LeafIcon color={c} size={22} />,
  '카페':      (c) => <CoffeeIcon color={c} size={22} />,
  '배낭':      (c) => <BackpackIcon color={c} size={22} />,
  '쇼핑':      (c) => <ShoppingBagIcon color={c} size={22} />,
  '맛집':      (c) => <UtensilsIcon color={c} size={22} />,
  '역사/문화': (c) => <LandmarkIcon color={c} size={22} />,
  '나이트라이프': (c) => <MoonIcon color={c} size={22} />,
  '현지시장':  (c) => <StoreIcon color={c} size={22} />,
};

const GENDER_OPTIONS = ['무관', '여성', '남성'] as const;
type GenderOption = typeof GENDER_OPTIONS[number];

const AGE_OPTIONS = ['무관', '20대', '30대', '40대+'] as const;
type AgeOption = typeof AGE_OPTIONS[number];

const COMPANION_OPTIONS = ['무관', '1명', '2명', '3명+'] as const;
type CompanionOption = typeof COMPANION_OPTIONS[number];

function SegmentRow<T extends string>({
  label, options, value, onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={filterRowStyles.wrap}>
      <Text style={filterRowStyles.label}>{label}</Text>
      <View style={filterRowStyles.seg}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[filterRowStyles.segBtn, value === opt && filterRowStyles.segBtnActive]}
            onPress={() => onChange(opt)}
            activeOpacity={0.75}
          >
            <Text style={[filterRowStyles.segText, value === opt && filterRowStyles.segTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const filterRowStyles = StyleSheet.create({
  wrap: { gap: 8 },
  label: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  seg: {
    flexDirection: 'row',
    backgroundColor: Colors.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  segBtn: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
  },
  segBtnActive: { backgroundColor: Colors.primary },
  segText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '400' },
  segTextActive: { color: Colors.white, fontWeight: '600' },
});

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  // Filters
  const [gender, setGender] = useState<GenderOption>('무관');
  const [ageGroup, setAgeGroup] = useState<AgeOption>('무관');
  const [companionCount, setCompanionCount] = useState<CompanionOption>('무관');
  const [scheduleOverlap, setScheduleOverlap] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [noSmoking, setNoSmoking] = useState(false);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  const toggleChip = (setter: (v: boolean) => void, current: boolean) => setter(!current);

  const handleSearch = () => {
    const filter: FindMateFilter = {
      destination, startDate, endDate,
      travelStyles: selectedStyles,
      anyGender: gender === '무관',
      scheduleOverlap,
      verifiedOnly,
    };
    router.push({ pathname: '/match/loading', params: { filter: JSON.stringify(filter) } });
  };

  const filledCount = [
    destination,
    startDate,
    endDate,
    selectedStyles.length > 0 ? 'styles' : '',
  ].filter(Boolean).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon color={Colors.textPrimary} size={20} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>EXPLORE</Text>
          <Text style={styles.title}>동행 찾기</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 어디로? */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DESTINATION</Text>
          <Text style={styles.cardTitle}>어디로 떠나요?</Text>
          <View style={styles.destInputWrap}>
            <MapPinIcon color={Colors.textMuted} size={16} />
            <TextInput
              style={styles.destInput}
              value={destination}
              onChangeText={setDestination}
              placeholder="도시 또는 국가"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          <View style={styles.cityRow}>
            {POPULAR_CITIES.map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.cityChip, destination === city && styles.cityChipActive]}
                onPress={() => setDestination(destination === city ? '' : city)}
                activeOpacity={0.75}
              >
                <Text style={[styles.cityChipText, destination === city && styles.cityChipTextActive]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 언제? */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DATES</Text>
          <Text style={styles.cardTitle}>언제 떠나요?</Text>
          <View style={styles.dateCard}>
            <View style={styles.dateSide}>
              <Text style={styles.dateRole}>출발</Text>
              <TextInput
                style={styles.dateInput}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="MM.DD"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={styles.dateArrow}>
              <Text style={styles.dateArrowLine}>—</Text>
            </View>
            <View style={styles.dateSide}>
              <Text style={styles.dateRole}>귀국</Text>
              <TextInput
                style={styles.dateInput}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="MM.DD"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </View>
        </View>

        {/* 여행 스타일 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TRAVEL STYLE</Text>
          <Text style={styles.cardTitle}>어떤 여행을 즐기나요?</Text>
          <Text style={styles.cardSub}>여러 개 선택할 수 있어요</Text>
          <View style={styles.styleGrid}>
            {TRAVEL_STYLES.map((style) => {
              const active = selectedStyles.includes(style);
              return (
                <TouchableOpacity
                  key={style}
                  style={[styles.styleCell, active && styles.styleCellActive]}
                  onPress={() => toggleStyle(style)}
                  activeOpacity={0.75}
                >
                  <View style={styles.styleIconWrap}>
                    {(STYLE_ICON[style] ?? ((c: string) => <CompassIcon color={c} size={22} />))(active ? Colors.primary : Colors.textMuted)}
                  </View>
                  <Text style={[styles.styleText, active && styles.styleTextActive]}>{style}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 추가 조건 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>FILTERS</Text>
          <Text style={styles.cardTitle}>추가 조건</Text>

          <View style={styles.filterStack}>
            {/* 성별 */}
            <SegmentRow
              label="성별"
              options={GENDER_OPTIONS}
              value={gender}
              onChange={setGender}
            />

            <View style={styles.divider} />

            {/* 나이대 */}
            <SegmentRow
              label="나이대"
              options={AGE_OPTIONS}
              value={ageGroup}
              onChange={setAgeGroup}
            />

            <View style={styles.divider} />

            {/* 동행 인원 */}
            <SegmentRow
              label="동행 인원"
              options={COMPANION_OPTIONS}
              value={companionCount}
              onChange={setCompanionCount}
            />

            <View style={styles.divider} />

            {/* 토글 칩 옵션들 */}
            <Text style={styles.toggleGroupLabel}>기타 옵션</Text>
            <View style={styles.toggleChips}>
              {([
                { label: '일정 겹침', renderIcon: (c: string) => <CalendarIcon color={c} size={14} />, value: scheduleOverlap, setter: setScheduleOverlap },
                { label: '인증 완료', renderIcon: (c: string) => <VerifiedIcon color={c} size={14} />, value: verifiedOnly, setter: setVerifiedOnly },
                { label: '비흡연자',  renderIcon: (c: string) => <LeafIcon color={c} size={14} />,     value: noSmoking, setter: setNoSmoking },
              ] as const).map(({ label, renderIcon, value, setter }) => {
                const iconColor = value ? Colors.primary : Colors.textSecondary;
                return (
                  <TouchableOpacity
                    key={label}
                    style={[styles.toggleChip, value && styles.toggleChipActive]}
                    onPress={() => toggleChip(setter as (v: boolean) => void, value)}
                    activeOpacity={0.75}
                  >
                    {renderIcon(iconColor)}
                    <Text style={[styles.toggleChipText, value && styles.toggleChipTextActive]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 고정 CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        {filledCount > 0 && (
          <Text style={styles.bottomHint}>
            {destination || '목적지'}{startDate ? ` · ${startDate}` : ''}{selectedStyles.length > 0 ? ` · ${selectedStyles[0]}${selectedStyles.length > 1 ? ` 외 ${selectedStyles.length - 1}` : ''}` : ''}
          </Text>
        )}
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.88}>
          <Text style={styles.searchBtnText}>여행자 찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  backBtn: { padding: 4, marginTop: 16 },
  headerText: { flex: 1 },
  headerLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 2.5, marginBottom: 4,
  },
  title: {
    fontSize: 26, fontWeight: '300', color: Colors.textPrimary, letterSpacing: -0.5,
  },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  cardLabel: {
    fontSize: 9, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 2.5, marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17, fontWeight: '500', color: Colors.textPrimary,
    letterSpacing: -0.2, marginBottom: 16,
  },
  cardSub: {
    fontSize: 11, color: Colors.textMuted, marginTop: -10, marginBottom: 16,
  },

  // Destination
  destInputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.bg, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1.5, borderColor: Colors.cardBorder,
    marginBottom: 16,
  },
  destInput: { flex: 1, fontSize: 16, color: Colors.textPrimary, fontWeight: '400' },
  cityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cityChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 999, borderWidth: 1, borderColor: Colors.cardBorder,
    backgroundColor: Colors.bg,
  },
  cityChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  cityChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '400' },
  cityChipTextActive: { color: Colors.primary, fontWeight: '600' },

  // Dates
  dateCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bg, borderRadius: 16,
    padding: 20, borderWidth: 1, borderColor: Colors.cardBorder,
  },
  dateSide: { flex: 1, alignItems: 'center', gap: 8 },
  dateRole: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.5 },
  dateInput: {
    fontSize: 22, fontWeight: '300', color: Colors.textPrimary,
    letterSpacing: -0.5, textAlign: 'center', minWidth: 80,
  },
  dateArrow: { paddingHorizontal: 12, alignItems: 'center' },
  dateArrowLine: { fontSize: 16, color: Colors.textMuted },

  // Style grid
  styleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  styleCell: {
    width: '30%', flexGrow: 1,
    paddingVertical: 14, borderRadius: 14,
    alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: Colors.cardBorder,
    backgroundColor: Colors.bg,
  },
  styleCellActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  styleIconWrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  styleText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '400' },
  styleTextActive: { color: Colors.primary, fontWeight: '600' },

  // Filter stack
  filterStack: { gap: 18 },
  divider: { height: 1, backgroundColor: Colors.cardBorder },
  toggleGroupLabel: {
    fontSize: 12, fontWeight: '600', color: Colors.textSecondary,
  },
  toggleChips: { flexDirection: 'row', gap: 10 },
  toggleChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 12,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.cardBorder,
    backgroundColor: Colors.bg,
  },
  toggleChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  toggleChipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '400' },
  toggleChipTextActive: { color: Colors.primary, fontWeight: '600' },

  // Bottom CTA
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 20, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: Colors.cardBorder,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomHint: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', fontWeight: '400' },
  searchBtn: {
    backgroundColor: Colors.primary, borderRadius: 16,
    height: 52, alignItems: 'center', justifyContent: 'center',
  },
  searchBtnText: { fontSize: 16, fontWeight: '600', color: Colors.white, letterSpacing: -0.2 },
});
