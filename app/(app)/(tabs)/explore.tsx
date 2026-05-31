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
import { DateRangePicker, formatMD } from '../../../components/ui/DateRangePicker';

const POPULAR_CITIES = ['오사카', '도쿄', '방콕', '파리', '발리', '뉴욕'];

const STYLE_ICON: Record<string, (color: string) => React.ReactNode> = {
  '피식':      (c) => <SmileIcon color={c} size={17} />,
  '액티비티':  (c) => <ZapIcon color={c} size={17} />,
  '사진':      (c) => <CameraIcon color={c} size={17} />,
  '관광':      (c) => <MapIcon color={c} size={17} />,
  '힐링':      (c) => <LeafIcon color={c} size={17} />,
  '카페':      (c) => <CoffeeIcon color={c} size={17} />,
  '배낭':      (c) => <BackpackIcon color={c} size={17} />,
  '쇼핑':      (c) => <ShoppingBagIcon color={c} size={17} />,
  '맛집':      (c) => <UtensilsIcon color={c} size={17} />,
  '역사/문화': (c) => <LandmarkIcon color={c} size={17} />,
  '나이트라이프': (c) => <MoonIcon color={c} size={17} />,
  '현지시장':  (c) => <StoreIcon color={c} size={17} />,
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
    <View style={segStyles.wrap}>
      <Text style={segStyles.label}>{label}</Text>
      <View style={segStyles.seg}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[segStyles.segBtn, value === opt && segStyles.segBtnActive]}
            onPress={() => onChange(opt)}
            activeOpacity={0.75}
          >
            <Text style={[segStyles.segText, value === opt && segStyles.segTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const segStyles = StyleSheet.create({
  wrap: { gap: 8 },
  label: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  seg: {
    flexDirection: 'row',
    backgroundColor: Colors.bgDeep,
    borderRadius: 12,
    overflow: 'hidden',
  },
  segBtn: {
    flex: 1, paddingVertical: 8, alignItems: 'center',
  },
  segBtnActive: { backgroundColor: Colors.accent, borderRadius: 10 },
  segText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '400' },
  segTextActive: { color: Colors.white, fontWeight: '600' },
});

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [destination, setDestination] = useState('');
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerInitialMode, setPickerInitialMode] = useState<'start' | 'end'>('start');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const startDate = rangeStart ? formatMD(rangeStart) : '';
  const endDate = rangeEnd ? formatMD(rangeEnd) : '';

  const openPicker = (mode: 'start' | 'end') => {
    setPickerInitialMode(mode);
    setPickerOpen(true);
  };

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

  const handleSearch = () => {
    const filter: FindMateFilter = {
      destination, startDate, endDate,
      travelStyles: selectedStyles,
      anyGender: gender === '무관',
      gender,
      ageGroup,
      companionCount,
      scheduleOverlap,
      verifiedOnly,
      noSmoking,
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
      {/* Header */}
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
        {/* ── 목적지 ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>어디로 떠나요?</Text>
          <View style={styles.inputWrap}>
            <MapPinIcon color={Colors.textMuted} size={15} />
            <TextInput
              style={styles.input}
              value={destination}
              onChangeText={setDestination}
              placeholder="도시 또는 국가"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          <View style={styles.chipRow}>
            {POPULAR_CITIES.map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.chip, destination === city && styles.chipActive]}
                onPress={() => setDestination(destination === city ? '' : city)}
                activeOpacity={0.75}
              >
                <Text style={[styles.chipText, destination === city && styles.chipTextActive]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── 날짜 ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>언제 떠나요?</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={[styles.dateSide, pickerOpen && pickerInitialMode === 'start' && styles.dateSideActive]}
              onPress={() => openPicker('start')}
              activeOpacity={0.7}
            >
              <Text style={styles.dateLabel}>출발</Text>
              <Text style={[styles.dateValue, !startDate && styles.datePlaceholder]}>
                {startDate || 'MM.DD'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.dateArrow}>—</Text>
            <TouchableOpacity
              style={[styles.dateSide, pickerOpen && pickerInitialMode === 'end' && styles.dateSideActive]}
              onPress={() => openPicker('end')}
              activeOpacity={0.7}
            >
              <Text style={styles.dateLabel}>귀국</Text>
              <Text style={[styles.dateValue, !endDate && styles.datePlaceholder]}>
                {endDate || 'MM.DD'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── 여행 스타일 ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>어떤 여행을 즐기나요?</Text>
            {selectedStyles.length > 0 && (
              <Text style={styles.selectedCount}>{selectedStyles.length}개 선택됨</Text>
            )}
          </View>
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
                    {(STYLE_ICON[style] ?? ((c: string) => <CompassIcon color={c} size={17} />))(active ? Colors.accent : Colors.textMuted)}
                  </View>
                  <Text style={[styles.styleText, active && styles.styleTextActive]}>{style}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── 추가 조건 ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추가 조건</Text>

          <View style={styles.filterStack}>
            <SegmentRow label="성별" options={GENDER_OPTIONS} value={gender} onChange={setGender} />
            <View style={styles.filterDivider} />
            <SegmentRow label="나이대" options={AGE_OPTIONS} value={ageGroup} onChange={setAgeGroup} />
            <View style={styles.filterDivider} />
            <SegmentRow label="동행 인원" options={COMPANION_OPTIONS} value={companionCount} onChange={setCompanionCount} />
            <View style={styles.filterDivider} />

            <Text style={styles.toggleGroupLabel}>기타 옵션</Text>
            <View style={styles.toggleChips}>
              {([
                { label: '일정 겹침', renderIcon: (c: string) => <CalendarIcon color={c} size={14} />, value: scheduleOverlap, setter: setScheduleOverlap },
                { label: '인증 완료', renderIcon: (c: string) => <VerifiedIcon color={c} size={14} />, value: verifiedOnly, setter: setVerifiedOnly },
                { label: '비흡연자',  renderIcon: (c: string) => <LeafIcon color={c} size={14} />,     value: noSmoking, setter: setNoSmoking },
              ] as const).map(({ label, renderIcon, value, setter }) => (
                <TouchableOpacity
                  key={label}
                  style={[styles.toggleChip, value && styles.toggleChipActive]}
                  onPress={() => (setter as (v: boolean) => void)(!value)}
                  activeOpacity={0.75}
                >
                  {renderIcon(value ? Colors.accent : Colors.textSecondary)}
                  <Text style={[styles.toggleChipText, value && styles.toggleChipTextActive]}>{label}</Text>
                </TouchableOpacity>
              ))}
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

      {/* 날짜 선택 팝업 */}
      <DateRangePicker
        visible={pickerOpen}
        start={rangeStart}
        end={rangeEnd}
        initialMode={pickerInitialMode}
        onChange={(s, e) => { setRangeStart(s); setRangeEnd(e); }}
        onClose={() => setPickerOpen(false)}
      />
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
    paddingTop: 44,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.card,
  },
  backBtn: { padding: 4, marginTop: 16 },
  headerText: { flex: 1 },
  headerLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 2.5, marginBottom: 8,
  },
  title: {
    fontSize: 26, fontWeight: '300', color: Colors.textPrimary, letterSpacing: -0.5,
  },

  scroll: { flex: 1 },
  content: { paddingTop: 4 },

  section: {
    paddingHorizontal: 22,
    paddingVertical: 24,
    gap: 14,
    backgroundColor: Colors.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  selectedCount: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
  },
  divider: {
    height: 8,
    backgroundColor: Colors.bgDeep,
  },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.bg, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: {
    paddingHorizontal: 13, paddingVertical: 6,
    borderRadius: 999, borderWidth: 1, borderColor: Colors.cardBorder,
    backgroundColor: Colors.bg,
  },
  chipActive: { backgroundColor: Colors.accentLight, borderColor: Colors.accent },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '400' },
  chipTextActive: { color: Colors.accent, fontWeight: '600' },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.bg,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  dateSide: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 6, borderRadius: 10 },
  dateSideActive: { backgroundColor: Colors.accentLight },
  dateLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.5 },
  dateValue: {
    fontSize: 20, fontWeight: '300', color: Colors.textPrimary,
    letterSpacing: -0.5, textAlign: 'center', minWidth: 70,
  },
  datePlaceholder: { color: Colors.textMuted },
  dateArrow: { fontSize: 16, color: Colors.textMuted },

  styleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  styleCell: {
    width: '30%', flexGrow: 1,
    paddingVertical: 11, borderRadius: 12,
    alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: Colors.cardBorder,
    backgroundColor: Colors.bg,
  },
  styleCellActive: { backgroundColor: Colors.accentLight, borderColor: Colors.accent },
  styleIconWrap: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  styleText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '400' },
  styleTextActive: { color: Colors.accent, fontWeight: '600' },

  filterStack: { gap: 14 },
  filterDivider: { height: 1, backgroundColor: Colors.bgDeep },
  toggleGroupLabel: {
    fontSize: 12, fontWeight: '600', color: Colors.textSecondary,
  },
  toggleChips: { flexDirection: 'row', gap: 8 },
  toggleChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 9,
    borderRadius: 10, borderWidth: 1, borderColor: Colors.cardBorder,
    backgroundColor: Colors.bg,
  },
  toggleChipActive: { backgroundColor: Colors.accentLight, borderColor: Colors.accent },
  toggleChipText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '400' },
  toggleChipTextActive: { color: Colors.accent, fontWeight: '600' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.card,
    paddingHorizontal: 20, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.cardBorder,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 6,
  },
  bottomHint: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', fontWeight: '400' },
  searchBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    height: 48, alignItems: 'center', justifyContent: 'center',
  },
  searchBtnText: { fontSize: 15, fontWeight: '600', color: Colors.white, letterSpacing: -0.2 },
});
