import React, { useRef, useState } from 'react';
import { View, Animated, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Scrim, Radius as R } from '../../constants/colors';
import { getDestinationImage, getDestinationAccent } from '../../constants/destinationImages';
import { Gradient } from './Gradient';

type ScrimKind = 'bottom' | 'even' | 'top' | 'none';

interface DestImageProps {
  /** Destination label — resolves to a real city photo. */
  dest?: string;
  /** Explicit image URL (overrides `dest` lookup). */
  uri?: string;
  /** Requested render width in px (sharper on retina). Default 800. */
  width?: number;
  /** Scrim gradient for text legibility. Default 'bottom'. */
  scrim?: ScrimKind;
  /** Corner radius. Default Radius.lg (20). */
  radius?: number;
  /** Overlay content rendered above the photo + scrim. */
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Where overlay children align. Default flex-end (bottom). */
  align?: ViewStyle['justifyContent'];
}

const SCRIMS: Record<Exclude<ScrimKind, 'none'>, readonly string[]> = {
  bottom: Scrim.bottom,
  even: Scrim.even,
  top: Scrim.top,
};

/**
 * Full-bleed destination photo with an accent-tinted placeholder, gentle
 * fade-in, and a legibility scrim. Layer text/badges via `children`.
 */
export function DestImage({
  dest,
  uri,
  width = 800,
  scrim = 'bottom',
  radius = R.lg,
  children,
  style,
  align = 'flex-end',
}: DestImageProps) {
  const src = uri ?? getDestinationImage(dest, width);
  const accent = getDestinationAccent(dest);
  const [loaded, setLoaded] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  const onLoad = () => {
    setLoaded(true);
    Animated.timing(fade, { toValue: 1, duration: 240, useNativeDriver: true }).start();
  };

  return (
    <View style={[styles.wrap, { borderRadius: radius }, style]}>
      {/* Placeholder tint while the photo streams in */}
      {!loaded && <View style={[StyleSheet.absoluteFill, { backgroundColor: accent.bg }]} />}
      <Animated.Image
        source={{ uri: src }}
        style={[StyleSheet.absoluteFill, { opacity: fade }]}
        resizeMode="cover"
        onLoad={onLoad}
      />
      {scrim !== 'none' && <Gradient colors={SCRIMS[scrim]} />}
      {children != null && (
        <View style={[styles.overlay, { justifyContent: align }]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', backgroundColor: '#E2E4EA' },
  overlay: { ...StyleSheet.absoluteFillObject, padding: 16 },
});
