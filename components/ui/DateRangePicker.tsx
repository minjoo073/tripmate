import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { ArrowLeftIcon, ArrowRightIcon } from './Icon';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function formatMD(d: Date) {
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function formatYMD(d: Date) {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function RangeCalendar({
  month, rangeStart, rangeEnd, onSelect, onMonthChange,
}: {
  month: Date;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onSelect: (d: Date) => void;
  onMonthChange: (delta: number) => void;
}) {
  const today = startOfDay(new Date());
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstWeekday = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, m, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const inRange = (d: Date) =>
    rangeStart && rangeEnd && d > rangeStart && d < rangeEnd;

  return (
    <View style={calStyles.wrap}>
      <View style={calStyles.head}>
        <TouchableOpacity style={calStyles.navBtn} onPress={() => onMonthChange(-1)} activeOpacity={0.7}>
          <ArrowLeftIcon color={Colors.textSecondary} size={16} />
        </TouchableOpacity>
        <Text style={calStyles.headText}>{year}년 {m + 1}월</Text>
        <TouchableOpacity style={calStyles.navBtn} onPress={() => onMonthChange(1)} activeOpacity={0.7}>
          <ArrowRightIcon color={Colors.textSecondary} size={16} />
        </TouchableOpacity>
      </View>

      <View style={calStyles.weekRow}>
        {WEEKDAYS.map((w, i) => (
          <Text key={w} style={[calStyles.weekday, i === 0 && calStyles.sun, i === 6 && calStyles.sat]}>{w}</Text>
        ))}
      </View>

      <View style={calStyles.grid}>
        {cells.map((cell, idx) => {
          if (!cell) return <View key={`e${idx}`} style={calStyles.cell} />;
          const past = cell < today;
          const isStart = rangeStart && isSameDay(cell, rangeStart);
          const isEnd = rangeEnd && isSameDay(cell, rangeEnd);
          const isEdge = isStart || isEnd;
          const within = inRange(cell);
          return (
            <TouchableOpacity
              key={cell.toISOString()}
              style={calStyles.cell}
              disabled={past}
              onPress={() => onSelect(cell)}
              activeOpacity={0.7}
            >
              {within && <View style={calStyles.rangeBg} />}
              {isStart && rangeEnd && <View style={[calStyles.rangeBg, calStyles.rangeBgRight]} />}
              {isEnd && rangeStart && <View style={[calStyles.rangeBg, calStyles.rangeBgLeft]} />}
              <View style={[calStyles.dayInner, isEdge && calStyles.dayEdge]}>
                <Text style={[
                  calStyles.dayText,
                  cell.getDay() === 0 && !isEdge && !past && calStyles.sun,
                  cell.getDay() === 6 && !isEdge && !past && calStyles.sat,
                  past && calStyles.dayPast,
                  isEdge && calStyles.dayEdgeText,
                ]}>
                  {cell.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

interface DateRangePickerProps {
  visible: boolean;
  start: Date | null;
  end: Date | null;
  initialMode?: 'start' | 'end';
  onChange: (start: Date | null, end: Date | null) => void;
  onClose: () => void;
}

export function DateRangePicker({
  visible, start, end, initialMode = 'start', onChange, onClose,
}: DateRangePickerProps) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'start' | 'end'>(initialMode);
  const [month, setMonth] = useState(() => startOfDay(new Date()));

  useEffect(() => {
    if (!visible) return;
    const resolved = initialMode === 'end' && !start ? 'start' : initialMode;
    setMode(resolved);
    const ref = resolved === 'start' ? start : (end ?? start);
    setMonth(startOfDay(ref ?? new Date()));
  }, [visible]);

  const startLabel = start ? formatMD(start) : '';
  const endLabel = end ? formatMD(end) : '';

  const handleSelect = (day: Date) => {
    if (mode === 'start') {
      onChange(day, end && day > end ? null : end);
      setMode('end');
    } else {
      if (!start || day < start) {
        onChange(day, null);
        setMode('end');
        return;
      }
      onChange(start, day);
      onClose();
    }
  };

  const changeMonth = (delta: number) =>
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, mode === 'start' && styles.tabActive]}
              onPress={() => setMode('start')}
              activeOpacity={0.8}
            >
              <Text style={styles.tabLabel}>출발</Text>
              <Text style={[styles.tabValue, !startLabel && styles.placeholder]}>
                {startLabel || '날짜 선택'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'end' && styles.tabActive]}
              onPress={() => setMode(start ? 'end' : 'start')}
              activeOpacity={0.8}
            >
              <Text style={styles.tabLabel}>귀국</Text>
              <Text style={[styles.tabValue, !endLabel && styles.placeholder]}>
                {endLabel || '날짜 선택'}
              </Text>
            </TouchableOpacity>
          </View>
          <RangeCalendar
            month={month}
            rangeStart={start}
            rangeEnd={end}
            onSelect={handleSelect}
            onMonthChange={changeMonth}
          />
          <TouchableOpacity style={styles.done} onPress={onClose} activeOpacity={0.88}>
            <Text style={styles.doneText}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const calStyles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 8,
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  navBtn: { padding: 6 },
  headText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  weekRow: { flexDirection: 'row' },
  weekday: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600', color: Colors.textMuted },
  sun: { color: '#C05050' },
  sat: { color: Colors.dustBlue },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rangeBg: {
    position: 'absolute',
    top: 4, bottom: 4, left: 0, right: 0,
    backgroundColor: Colors.accentLight,
  },
  rangeBgLeft: { right: '50%' },
  rangeBgRight: { left: '50%' },
  dayInner: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  dayEdge: { backgroundColor: Colors.accent },
  dayText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '400' },
  dayPast: { color: Colors.cardBorder },
  dayEdgeText: { color: Colors.white, fontWeight: '700' },
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  backdrop: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(28,43,58,0.45)',
  },
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 10,
    gap: 16,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.cardBorder,
    alignSelf: 'center',
  },
  tabs: { flexDirection: 'row', gap: 10 },
  tab: {
    flex: 1, gap: 4,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.cardBorder,
    backgroundColor: Colors.bg,
  },
  tabActive: { borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  tabLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.5 },
  tabValue: { fontSize: 16, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.3 },
  placeholder: { color: Colors.textMuted },
  done: {
    backgroundColor: Colors.primary, borderRadius: 12,
    height: 48, alignItems: 'center', justifyContent: 'center',
  },
  doneText: { fontSize: 15, fontWeight: '600', color: Colors.white },
});
