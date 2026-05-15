import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

const SW = 2; // strokeWidth
const SLC = 'round' as const;
const SLJ = 'round' as const;

type P = { color?: string; size?: number; filled?: boolean };

function base(color: string) {
  return { stroke: color, strokeWidth: SW, strokeLinecap: SLC, strokeLinejoin: SLJ, fill: 'none' } as const;
}

// ── Bottom nav ──────────────────────────────────────────────────────────────

export function HomeIcon({ color = '#1E2430', size = 22, filled = false }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 9.5L12 3L21 9.5V21C21 21.5523 20.5523 22 20 22H15V16H9V22H4C3.44772 22 3 21.5523 3 21V9.5Z"
        {...base(color)}
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

export function ExploreIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="9" {...base(color)} />
      <Path
        d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z"
        {...base(color)}
      />
    </Svg>
  );
}

export function CommunityIcon({ color = '#1E2430', size = 22, filled = false }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="3" y="3" width="7.5" height="7.5" rx="1.5" {...base(color)} fill={filled ? color : 'none'} />
      <Rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" {...base(color)} fill={filled ? color : 'none'} />
      <Rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" {...base(color)} fill={filled ? color : 'none'} />
      <Rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" {...base(color)} fill={filled ? color : 'none'} />
    </Svg>
  );
}

export function ChatNavIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21 15C21 16.1046 20.1046 17 19 17H7L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z"
        {...base(color)}
      />
      <Circle cx="8" cy="10" r="1" fill={color} stroke="none" />
      <Circle cx="12" cy="10" r="1" fill={color} stroke="none" />
      <Circle cx="16" cy="10" r="1" fill={color} stroke="none" />
    </Svg>
  );
}

export function ProfileNavIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="8" r="4" {...base(color)} />
      <Path
        d="M4 20C4 17.3333 7.58172 15 12 15C16.4183 15 20 17.3333 20 20"
        {...base(color)}
      />
    </Svg>
  );
}

// ── UI / action icons ───────────────────────────────────────────────────────

export function BellIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        {...base(color)}
      />
      <Path
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        {...base(color)}
      />
    </Svg>
  );
}

export function SearchIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="11" cy="11" r="7.5" {...base(color)} />
      <Path d="M20.5 20.5L16.5 16.5" {...base(color)} />
    </Svg>
  );
}

export function SendIcon({ color = '#FFFFFF', size = 20 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M22 2L11 13" {...base(color)} />
      <Path d="M22 2L15 22L11 13L2 9L22 2Z" {...base(color)} />
    </Svg>
  );
}

export function SettingsIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="3" {...base(color)} />
      <Path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        {...base(color)}
      />
    </Svg>
  );
}

export function HeartIcon({ color = '#1E2430', size = 22, filled = false }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        {...base(color)}
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

export function BookmarkIcon({ color = '#1E2430', size = 22, filled = false }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z"
        {...base(color)}
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

export function MapPinIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
        {...base(color)}
      />
      <Circle cx="12" cy="10" r="3" {...base(color)} />
    </Svg>
  );
}

export function CalendarIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="3" y="4" width="18" height="18" rx="2" {...base(color)} />
      <Path d="M16 2V6" {...base(color)} />
      <Path d="M8 2V6" {...base(color)} />
      <Path d="M3 10H21" {...base(color)} />
    </Svg>
  );
}

export function StarIcon({ color = '#1E2430', size = 22, filled = false }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        {...base(color)}
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

export function EditIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
        {...base(color)}
      />
      <Path
        d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
        {...base(color)}
      />
    </Svg>
  );
}

export function FireIcon({ color = '#1E2430', size = 20 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3C8.928 6.857 9.776 4.946 12 3c.5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
        {...base(color)}
      />
    </Svg>
  );
}

export function SparkleIcon({ color = '#1E2430', size = 20 }: P) {
  // Line-based 8-point starburst — no closed polygons, no fill issues
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2V7" {...base(color)} />
      <Path d="M12 17V22" {...base(color)} />
      <Path d="M2 12H7" {...base(color)} />
      <Path d="M17 12H22" {...base(color)} />
      <Path d="M5.64 5.64L8.83 8.83" {...base(color)} />
      <Path d="M15.17 15.17L18.36 18.36" {...base(color)} />
      <Path d="M18.36 5.64L15.17 8.83" {...base(color)} />
      <Path d="M8.83 15.17L5.64 18.36" {...base(color)} />
    </Svg>
  );
}

export function WaveIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M8 13V8" {...base(color)} />
      <Path d="M11 13V5" {...base(color)} />
      <Path d="M14 13V5" {...base(color)} />
      <Path d="M17 13V8" {...base(color)} />
      <Path d="M6 13C6 17.42 8.69 21 12.5 21C16.09 21 19 17.42 19 13" {...base(color)} />
    </Svg>
  );
}

export function ArrowRightIcon({ color = '#1E2430', size = 20 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M5 12H19" {...base(color)} />
      <Path d="M12 5L19 12L12 19" {...base(color)} />
    </Svg>
  );
}

export function ArrowLeftIcon({ color = '#1E2430', size = 24 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M19 12H5" {...base(color)} />
      <Path d="M12 19L5 12L12 5" {...base(color)} />
    </Svg>
  );
}

export function ChevronRightIcon({ color = '#9CA3AF', size = 20 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M9 18L15 12L9 6" {...base(color)} />
    </Svg>
  );
}

export function MessageIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21 15C21 16.1046 20.1046 17 19 17H7L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z"
        {...base(color)}
      />
    </Svg>
  );
}

export function UsersIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
        {...base(color)}
      />
      <Circle cx="9" cy="7" r="4" {...base(color)} />
      <Path
        d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
        {...base(color)}
      />
      <Path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" {...base(color)} />
    </Svg>
  );
}

export function PlaneTakeoffIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M2.5 19H21.5"
        {...base(color)}
      />
      <Path
        d="M6.29 17.51L3 13.5L4.5 13L8 15.51L13 14L5.5 6.5L7.5 6L17.5 11.5L20.5 10.5C21.05 10.33 21.64 10.46 22.06 10.85C22.48 11.24 22.66 11.82 22.53 12.37L22.46 12.62C22.31 13.21 21.84 13.66 21.24 13.8L6.29 17.51Z"
        {...base(color)}
      />
    </Svg>
  );
}

export function VerifiedIcon({ color = '#1E2430', size = 18 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" {...base(color)} />
      <Path d="M22 4L12 14.01L9 11.01" {...base(color)} />
    </Svg>
  );
}

export function MapIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M1 6V22L8 18L16 22L23 18V2L16 6L8 2L1 6Z" {...base(color)} />
      <Path d="M8 2V18" {...base(color)} />
      <Path d="M16 6V22" {...base(color)} />
    </Svg>
  );
}

export function MoonIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        {...base(color)}
      />
    </Svg>
  );
}

export function SunIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="4" {...base(color)} />
      <Path d="M12 2V4" {...base(color)} />
      <Path d="M12 20V22" {...base(color)} />
      <Path d="M4.22 4.22L5.64 5.64" {...base(color)} />
      <Path d="M18.36 18.36L19.78 19.78" {...base(color)} />
      <Path d="M2 12H4" {...base(color)} />
      <Path d="M20 12H22" {...base(color)} />
      <Path d="M4.22 19.78L5.64 18.36" {...base(color)} />
      <Path d="M18.36 5.64L19.78 4.22" {...base(color)} />
    </Svg>
  );
}

export function ShareIcon({ color = '#1E2430', size = 22 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="18" cy="5" r="3" {...base(color)} />
      <Circle cx="6" cy="12" r="3" {...base(color)} />
      <Circle cx="18" cy="19" r="3" {...base(color)} />
      <Path d="M8.59 13.51L15.42 17.49" {...base(color)} />
      <Path d="M15.41 6.51L8.59 10.49" {...base(color)} />
    </Svg>
  );
}
