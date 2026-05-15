import { User, MatchResult, ChatRoom, Message, Post, Trip } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    nickname: '한소희',
    age: 26,
    gender: 'female',
    location: '서울',
    mbti: 'ENFP',
    bio: '오사카 현지 맛집을 직접 찾아다니는 걸 좋아해요. 구글 맵핑한 리스트 300개 보유중 😎',
    travelStyles: ['카페', '사진', '힐링'],
    travelCount: 15,
    rating: 4.9,
    followers: 234,
    isVerified: true,
    reviews: [
      {
        id: 'r1',
        reviewer: { id: '3', nickname: '이수아', age: 25, gender: 'female', location: '인천', travelStyles: [], travelCount: 5, rating: 4.5, followers: 50, isVerified: false },
        rating: 5,
        content: '처음 만나는 사이였지만 정말 잘 맞았어요! 다음에도 같이 여행하고 싶어요 ✈️',
        createdAt: '2024-03-15',
      },
      {
        id: 'r2',
        reviewer: { id: '4', nickname: '장기은', age: 25, gender: 'female', location: '대구', travelStyles: [], travelCount: 6, rating: 4.6, followers: 89, isVerified: false },
        rating: 5,
        content: '카페 추천 리스트가 진짜 최고였어요. 혼자였으면 절대 못 찾았을 곳만 데려가줬어요 ☕',
        createdAt: '2024-01-08',
      },
      {
        id: 'r3',
        reviewer: { id: '5', nickname: '정다은', age: 29, gender: 'female', location: '서울', travelStyles: [], travelCount: 20, rating: 4.9, followers: 310, isVerified: true },
        rating: 5,
        content: '사진도 잘 찍어주고 분위기도 좋아서 여행이 두 배로 즐거웠어요. 또 같이 가고 싶어요!',
        createdAt: '2023-11-22',
      },
      {
        id: 'r4',
        reviewer: { id: '2', nickname: '조승연', age: 27, gender: 'male', location: '서울', travelStyles: [], travelCount: 12, rating: 4.8, followers: 189, isVerified: true },
        rating: 4,
        content: '취향이 잘 맞아서 편하게 다닐 수 있었어요. 일정 조율도 유연하게 해줘서 좋았습니다.',
        createdAt: '2023-09-05',
      },
    ],
  },
  {
    id: '2',
    nickname: '조승연',
    age: 27,
    gender: 'male',
    location: '서울',
    mbti: 'ENTP',
    bio: '현지 시장과 골목 투어를 좋아합니다. 같이 맛집 탐방해요!',
    travelStyles: ['피식', '현지시장', '사진'],
    travelCount: 12,
    rating: 4.8,
    followers: 189,
    isVerified: true,
    reviews: [
      {
        id: 'r2-1',
        reviewer: { id: '1', nickname: '한소희', age: 26, gender: 'female', location: '서울', travelStyles: [], travelCount: 15, rating: 4.9, followers: 234, isVerified: true },
        rating: 5,
        content: '현지 시장 골목골목을 너무 잘 알아서 따라다니기만 해도 신기했어요. 혼자였으면 몰랐을 맛집만 데려가줬어요!',
        createdAt: '2024-04-02',
      },
      {
        id: 'r2-2',
        reviewer: { id: '3', nickname: '양세은', age: 28, gender: 'female', location: '부산', travelStyles: [], travelCount: 8, rating: 4.7, followers: 120, isVerified: true },
        rating: 5,
        content: '유머 감각도 넘치고 여행 내내 웃음이 끊이지 않았어요. 재동행 100% 확정!',
        createdAt: '2024-02-14',
      },
      {
        id: 'r2-3',
        reviewer: { id: '5', nickname: '정다은', age: 29, gender: 'female', location: '서울', travelStyles: [], travelCount: 20, rating: 4.9, followers: 310, isVerified: true },
        rating: 4,
        content: '즉흥적인 부분이 있어서 처음엔 당황했지만 오히려 그게 더 재밌는 여행이 됐어요.',
        createdAt: '2023-12-20',
      },
    ],
  },
  {
    id: '3',
    nickname: '양세은',
    age: 28,
    gender: 'female',
    location: '부산',
    mbti: 'INFJ',
    bio: '조용하게 힐링 여행 선호합니다. 카페 투어 고수 ☕',
    travelStyles: ['카페', '힐링', '관광'],
    travelCount: 8,
    rating: 4.7,
    followers: 120,
    isVerified: true,
  },
  {
    id: '4',
    nickname: '장기은',
    age: 25,
    gender: 'female',
    location: '대구',
    mbti: 'ESFP',
    bio: '액티비티 좋아하고 밤문화도 즐겨요!',
    travelStyles: ['액티비티', '쇼핑', '나이트라이프'],
    travelCount: 6,
    rating: 4.6,
    followers: 89,
    isVerified: false,
  },
  {
    id: '5',
    nickname: '정다은',
    age: 29,
    gender: 'female',
    location: '서울',
    mbti: 'ISTJ',
    bio: '꼼꼼한 일정 계획파! 미리 준비하는 걸 좋아해요.',
    travelStyles: ['관광', '역사/문화', '사진'],
    travelCount: 20,
    rating: 4.9,
    followers: 310,
    isVerified: true,
  },
];

export const mockTrips: Trip[] = [
  {
    id: 't1',
    destination: '오사카',
    country: '일본',
    startDate: '2025-06-15',
    endDate: '2025-06-19',
    travelStyles: ['카페', '사진', '맛집'],
    schedule: [
      { date: '6/15', activities: ['도착', '숙소 체크인', '도톤보리 저녁'] },
      { date: '6/16', activities: ['오사카성', '난바 쇼핑', '야경'] },
      { date: '6/17', activities: ['나라 당일치기', '사슴 공원'] },
      { date: '6/18', activities: ['우메다', '공중정원', '귀국'] },
    ],
  },
  {
    id: 't2',
    destination: '도쿄',
    country: '일본',
    startDate: '2025-07-05',
    endDate: '2025-07-10',
    travelStyles: ['관광', '쇼핑', '애니'],
    schedule: [],
  },
];

// User's own trip to share in chat
export const mockMyTrip: Trip = {
  id: 'my-t1',
  destination: '오사카',
  country: '일본',
  startDate: '2025-06-15',
  endDate: '2025-06-19',
  travelStyles: ['카페', '사진', '맛집'],
  schedule: [
    { date: '6/15', activities: ['간사이 공항 도착', '숙소 체크인', '신사이바시 저녁'] },
    { date: '6/16', activities: ['도톤보리 카페 투어', '구로몬 시장'] },
    { date: '6/17', activities: ['나라 당일치기', '사슴 공원'] },
    { date: '6/18', activities: ['우메다 쇼핑', '공중정원 야경', '귀국'] },
  ],
};

// 한소희's trip (starts a day earlier)
export const mockHanTrip: Trip = {
  id: 'han-t1',
  destination: '오사카',
  country: '일본',
  startDate: '2025-06-14',
  endDate: '2025-06-19',
  travelStyles: ['카페', '맛집', '사진'],
  schedule: [
    { date: '6/14', activities: ['도착', '호텔 체크인', '도톤보리'] },
    { date: '6/15', activities: ['카페 투어', '구로몬 시장'] },
    { date: '6/16', activities: ['나라 당일치기', '사슴 공원'] },
    { date: '6/17', activities: ['우메다', '헵파이브 쇼핑'] },
    { date: '6/18', activities: ['아메리카무라', '귀국'] },
  ],
};

export const mockMatchResults: MatchResult[] = [
  { user: mockUsers[0], matchRate: 97, trip: mockTrips[0] },
  { user: mockUsers[1], matchRate: 94, trip: { ...mockTrips[0], startDate: '2025-06-18', endDate: '2025-06-22' } },
  { user: mockUsers[2], matchRate: 91, trip: mockTrips[0] },
  { user: mockUsers[3], matchRate: 88, trip: { ...mockTrips[0], destination: '나고야', startDate: '2025-06-20' } },
  { user: mockUsers[4], matchRate: 82, trip: mockTrips[1] },
];

export const mockChatRooms: ChatRoom[] = [
  {
    id: 'c1',
    partner: mockUsers[1],
    lastMessage: '그럼 같이 가요~',
    lastMessageAt: '2025-06-01T10:30:00',
    unreadCount: 2,
    trip: mockTrips[0],
    status: 'accepted',
  },
  {
    id: 'c2',
    partner: mockUsers[0],
    lastMessage: '취향도 비슷한 것 같아요! 동행 어떠세요? 🤝',
    lastMessageAt: '2025-06-01T09:00:00',
    unreadCount: 1,
    trip: mockTrips[0],
    status: 'pending',
  },
];

export const mockMessages: Message[] = [
  { id: 'm1', senderId: '2', content: '안녕하세요! 오사카 여행이요?', createdAt: '2025-06-01T09:00:00', type: 'text' },
  { id: 'm2', senderId: 'me', content: '네 맞아요! 일정 비슷하네요', createdAt: '2025-06-01T09:01:00', type: 'text' },
  { id: 'm3', senderId: '2', content: '저도 6월 15일부터에요 ㅎㅎ', createdAt: '2025-06-01T09:02:00', type: 'text' },
  { id: 'm4', senderId: '2', content: '', createdAt: '2025-06-01T09:03:00', type: 'trip_share', tripData: mockTrips[0] },
  { id: 'm5', senderId: 'me', content: '감사해요, 저도 비슷해요 😊', createdAt: '2025-06-01T09:04:00', type: 'text' },
  { id: 'm6', senderId: '2', content: '그럼 같이 가요~', createdAt: '2025-06-01T09:05:00', type: 'text' },
];

// c1 - 조승연 (accepted) - full chat history, both shared trips
export const mockMessagesC1: Message[] = [
  { id: 'c1m1', senderId: '2', content: '안녕하세요! 오사카 여행이요?', createdAt: '2025-06-01T09:00:00', type: 'text' },
  { id: 'c1m2', senderId: 'me', content: '네 맞아요! 일정이 비슷하네요 ㅎㅎ', createdAt: '2025-06-01T09:01:00', type: 'text' },
  { id: 'c1m3', senderId: '2', content: '저도 6월 15일부터에요! 먼저 일정 보내드릴게요', createdAt: '2025-06-01T09:02:00', type: 'text' },
  { id: 'c1m4', senderId: '2', content: '', createdAt: '2025-06-01T09:03:00', type: 'trip_share', tripData: mockTrips[0] },
  { id: 'c1m5', senderId: 'me', content: '오 저도 비슷해요! 저도 일정 공유할게요 😊', createdAt: '2025-06-01T09:04:00', type: 'text' },
  { id: 'c1m6', senderId: 'me', content: '', createdAt: '2025-06-01T09:05:00', type: 'trip_share', tripData: mockMyTrip },
  { id: 'c1m7', senderId: '2', content: '일정이 거의 똑같네요! 취향도 잘 맞을 것 같아요 ㅎㅎ', createdAt: '2025-06-01T09:06:00', type: 'text' },
  { id: 'c1m8', senderId: '2', content: '그럼 같이 가요~', createdAt: '2025-06-01T09:07:00', type: 'text' },
  { id: 'c1m9', senderId: 'me', content: '좋아요! 기대돼요 😊', createdAt: '2025-06-01T09:08:00', type: 'text' },
];

// c2 - 한소희 (pending) - both shared trips, waiting for decision
export const mockMessagesC2: Message[] = [
  { id: 'c2m1', senderId: '1', content: '안녕하세요! 오사카 6월에 가시나요?', createdAt: '2025-06-01T08:50:00', type: 'text' },
  { id: 'c2m2', senderId: 'me', content: '네! 6월 15일부터요. 혹시 일정 비슷하신가요?', createdAt: '2025-06-01T08:51:00', type: 'text' },
  { id: 'c2m3', senderId: '1', content: '저도 6월 14일부터예요! 거의 겹치네요 😊', createdAt: '2025-06-01T08:52:00', type: 'text' },
  { id: 'c2m4', senderId: '1', content: '먼저 제 일정 공유해드릴게요!', createdAt: '2025-06-01T08:53:00', type: 'text' },
  { id: 'c2m5', senderId: '1', content: '', createdAt: '2025-06-01T08:54:00', type: 'trip_share', tripData: mockHanTrip },
  { id: 'c2m6', senderId: 'me', content: '와, 일정이 많이 겹치네요! 저도 공유할게요', createdAt: '2025-06-01T08:55:00', type: 'text' },
  { id: 'c2m7', senderId: 'me', content: '', createdAt: '2025-06-01T08:56:00', type: 'trip_share', tripData: mockMyTrip },
  { id: 'c2m8', senderId: '1', content: '취향도 비슷한 것 같아요! 동행 어떠세요? 🤝', createdAt: '2025-06-01T08:57:00', type: 'text' },
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    author: mockUsers[2],
    title: '도쿄 7월 초 같이 가실 분 구해요 🗼',
    content: '도쿄 첫 방문이라 같이 다닐 분 찾아요! 7/5~7/7 일정이고 합리적인 가격의 숙소 근처 관광 위주로 다닐 예정이에요.',
    category: 'mate',
    travelStyles: ['관광', '사진'],
    trip: mockTrips[1],
    likes: 12,
    comments: 5,
    createdAt: '2025-05-20T10:00:00',
  },
  {
    id: 'p2',
    author: mockUsers[0],
    title: '방콕 5박 6일 + 동행 1명 모집 🌴',
    content: '방콕 왓포, 카오산로드, 짜뚜짝 시장 등 알차게 다닐 예정! 맛집, 사원, 쇼핑 모두 좋아하는 분 환영해요.',
    category: 'mate',
    travelStyles: ['맛집', '관광', '쇼핑'],
    likes: 28,
    comments: 7,
    createdAt: '2025-05-19T15:00:00',
  },
  {
    id: 'p3',
    author: mockUsers[4],
    title: '오사카 여행 팁 총정리 ✈️',
    content: '오사카 3번 다녀온 경험 공유해요. 교통패스, 맛집, 숙소 추천까지!',
    category: 'tips',
    travelStyles: ['맛집', '관광'],
    likes: 89,
    comments: 23,
    createdAt: '2025-05-18T08:00:00',
  },
  {
    id: 'p4',
    author: mockUsers[3],
    title: '베트남 다낭 6월 말 동행 구합니다 🏖️',
    content: '다낭 미케 비치, 바나힐, 호이안 3박 4일 계획 중이에요. 편하게 다닐 수 있는 분 찾아요!',
    category: 'mate',
    travelStyles: ['힐링', '액티비티'],
    likes: 19,
    comments: 8,
    createdAt: '2025-05-17T12:00:00',
  },
  { id: 'p5', author: mockUsers[2], title: '오사카 6월 말 동행 구해요 🌸', content: '오사카 6월 27일~7월 1일 4박 5일 일정이에요. 카페 투어와 구로몬 시장, 우메다 위주로 다닐 예정이에요. 편하게 힐링하며 다닐 분이면 좋겠어요!', category: 'mate', travelStyles: ['카페', '힐링', '현지시장'], trip: { id: 'trip-p5', destination: '오사카', country: '일본', startDate: '2025-06-27', endDate: '2025-07-01', travelStyles: ['카페', '힐링'] }, likes: 9, comments: 3, createdAt: '2025-05-16T11:00:00' },
  { id: 'p6', author: mockUsers[4], title: '오사카 3번 다녀온 내가 추천하는 숨은 카페 리스트 ☕', content: '도톤보리 관광지 말고, 진짜 현지인들이 가는 카페를 소개해요. 특히 아메리카무라 골목 안쪽의 작은 핸드드립 카페는 꼭 가보세요.', category: 'tips', travelStyles: ['카페', '사진', '로컬'], trip: { id: 'trip-p6', destination: '오사카', country: '일본', startDate: '2025-05-01', endDate: '2025-05-05', travelStyles: ['카페'] }, likes: 83, comments: 21, createdAt: '2025-05-14T09:00:00' },
  { id: 'p7', author: mockUsers[3], title: '도쿄 7월 중순 액티비티 같이 하실 분 🎢', content: '도쿄 디즈니랜드, 팀랩, 오다이바 위주로 다닐 예정이에요. 에너지 넘치고 사진 많이 찍는 걸 좋아하는 분 환영해요!', category: 'mate', travelStyles: ['액티비티', '사진', '쇼핑'], trip: { id: 'trip-p7', destination: '도쿄', country: '일본', startDate: '2025-07-14', endDate: '2025-07-18', travelStyles: ['액티비티'] }, likes: 14, comments: 6, createdAt: '2025-05-15T14:00:00' },
  { id: 'p8', author: mockUsers[1], title: '도쿄 야시장과 이자카야, 밤이 더 아름다운 도시 🌙', content: '신주쿠 골든가이, 시모기타자와 라이브바, 그리고 롯폰기의 루프탑까지. 도쿄의 밤을 제대로 즐기는 방법을 공유해요.', category: 'tips', travelStyles: ['나이트라이프', '맛집', '현지시장'], trip: { id: 'trip-p8', destination: '도쿄', country: '일본', startDate: '2025-04-20', endDate: '2025-04-25', travelStyles: ['나이트라이프'] }, likes: 56, comments: 14, createdAt: '2025-05-12T20:00:00' },
  { id: 'p9', author: mockUsers[0], title: '방콕 8월 초 카페&맛집 투어 동행 구해요 🌶️', content: '짜뚜짝 야시장, 팟퐁, 아리 카페거리 위주로 다닐 예정이에요. 한국어 메뉴판 없는 로컬 식당도 과감하게 도전하실 분 환영해요.', category: 'mate', travelStyles: ['맛집', '카페', '현지시장'], trip: { id: 'trip-p9', destination: '방콕', country: '태국', startDate: '2025-08-03', endDate: '2025-08-08', travelStyles: ['맛집', '카페'] }, likes: 18, comments: 7, createdAt: '2025-05-13T10:00:00' },
  { id: 'p10', author: mockUsers[2], title: '방콕 왓포 새벽 5시, 혼자 걷는 사원의 고요함 🛕', content: '관광객 없는 시간에 방문한 왓포는 완전히 다른 공간이었어요. 이른 새벽의 빛과 냄새, 그리고 혼자만의 조용한 시간을 기록합니다.', category: 'tips', travelStyles: ['역사/문화', '사진', '힐링'], trip: { id: 'trip-p10', destination: '방콕', country: '태국', startDate: '2025-03-10', endDate: '2025-03-15', travelStyles: ['역사/문화'] }, likes: 71, comments: 19, createdAt: '2025-05-10T07:00:00' },
  { id: 'p11', author: mockUsers[4], title: '파리 9월 꽃시장·마르셰 투어 동행 🌹', content: '관광 명소보다는 파리 로컬 마켓, 꽃시장, 골목 카페를 위주로 다니고 싶어요. 9월 10일~17일, 함께 걸을 분 찾아요.', category: 'mate', travelStyles: ['카페', '관광', '사진'], trip: { id: 'trip-p11', destination: '파리', country: '프랑스', startDate: '2025-09-10', endDate: '2025-09-17', travelStyles: ['카페', '관광'] }, likes: 22, comments: 9, createdAt: '2025-05-11T15:00:00' },
  { id: 'p12', author: mockUsers[1], title: '파리에서 필름카메라로 담은 7일 🎞️', content: '루브르보다 생루이섬, 에펠탑보다 비르아켐 다리. 관광지 말고 파리다운 파리를 35mm 필름에 담아왔어요.', category: 'tips', travelStyles: ['사진', '힐링', '관광'], trip: { id: 'trip-p12', destination: '파리', country: '프랑스', startDate: '2025-04-05', endDate: '2025-04-12', travelStyles: ['사진'] }, likes: 94, comments: 28, createdAt: '2025-05-09T12:00:00' },
];

export const TRAVEL_STYLES = [
  '피식', '액티비티', '사진', '관광', '힐링', '카페', '배낭', '쇼핑', '맛집', '역사/문화', '나이트라이프', '현지시장',
];
