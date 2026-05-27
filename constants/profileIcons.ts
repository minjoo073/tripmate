const PROFILE_ICONS = [
  require('../assets/icons/icon_1.png'),
  require('../assets/icons/icon_2.png'),
  require('../assets/icons/icon_3.png'),
  require('../assets/icons/icon_4.png'),
  require('../assets/icons/icon_5.png'),
  require('../assets/icons/icon_6.png'),
  require('../assets/icons/icon_7.png'),
  require('../assets/icons/icon_8.png'),
  require('../assets/icons/icon_9.png'),
  require('../assets/icons/icon_10.png'),
  require('../assets/icons/icon_11.png'),
  require('../assets/icons/icon_12.png'),
];

export function getProfileIcon(nickname: string) {
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    hash = (hash * 31 + nickname.charCodeAt(i)) % PROFILE_ICONS.length;
  }
  return PROFILE_ICONS[Math.abs(hash) % PROFILE_ICONS.length];
}

export { PROFILE_ICONS };
