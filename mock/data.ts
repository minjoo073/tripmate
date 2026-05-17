import { User, MatchResult, ChatRoom, Message, Post, Trip } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    nickname: '한소희',
    age: 26,
    gender: 'female',
    location: '서울',
    mbti: 'ENFP',
    bio: '오사카 현지 맛집을 직접 찾아다니는 걸 좋아해요.\n\n구글 맵핑한 리스트 300개 보유중 😎',
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
  {
    id: 'c3',
    partner: mockUsers[4],
    lastMessage: '아메리카무라 쪽 카페가 정말 좋아요 ☕',
    lastMessageAt: '2025-05-14T11:20:00',
    unreadCount: 0,
    status: 'tips',
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

// c3 - 정다은 (tips) - cafe recommendation conversation
export const mockMessagesC3: Message[] = [
  { id: 'c3m1', senderId: 'me', content: '글 잘 읽었어요! 오사카 카페 글 정말 도움이 됐어요 ☕', createdAt: '2025-05-14T10:30:00', type: 'text' },
  { id: 'c3m2', senderId: '5', content: '어머, 감사해요 😊 오사카 가실 예정인가요?', createdAt: '2025-05-14T10:31:00', type: 'text' },
  { id: 'c3m3', senderId: 'me', content: '네! 6월 중순쯤 갈 것 같아요. 아메리카무라 꼭 가보려고요', createdAt: '2025-05-14T10:32:00', type: 'text' },
  { id: 'c3m4', senderId: '5', content: '아메리카무라 쪽 카페가 정말 좋아요 ☕ 거기서 골목 안쪽으로 들어가면 진짜 숨은 카페들 있어요', createdAt: '2025-05-14T10:33:00', type: 'text' },
  { id: 'c3m5', senderId: '5', content: '특히 "Coffee Libre" 라는 곳이랑 그 옆 작은 핸드드립 카페 꼭 가보세요. 오전에 가야 자리 있어요!', createdAt: '2025-05-14T10:34:00', type: 'text' },
  { id: 'c3m6', senderId: 'me', content: '오 구체적으로 알려주셔서 감사해요! 혹시 도톤보리 근처도 추천해 주실 수 있나요?', createdAt: '2025-05-14T10:40:00', type: 'text' },
  { id: 'c3m7', senderId: '5', content: '도톤보리는 관광객이 많아서 저는 뒷골목 위주로 다녔어요. 구글맵에 "堀江" 검색하면 힙한 카페들 쭉 나와요 🗺️', createdAt: '2025-05-14T10:42:00', type: 'text' },
  { id: 'c3m8', senderId: 'me', content: '호리에요! 기억해뒀다가 꼭 가볼게요. 진짜 도움 많이 됐어요 😊', createdAt: '2025-05-14T11:18:00', type: 'text' },
  { id: 'c3m9', senderId: '5', content: '즐거운 여행 되세요! 궁금한 거 있으면 또 물어보세요 ✈️', createdAt: '2025-05-14T11:20:00', type: 'text' },
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
    trip: { id: 'trip-p2', destination: '방콕', country: '태국', startDate: '2025-08-10', endDate: '2025-08-15', travelStyles: ['맛집', '관광', '쇼핑'] },
    likes: 28,
    comments: 7,
    createdAt: '2025-05-19T15:00:00',
  },
  {
    id: 'p3',
    author: mockUsers[4],
    title: '오사카 여행 팁 총정리 ✈️',
    content: "오사카 3번 다녀온 경험을 총정리했어요. 처음 가는 분들이 헷갈려하는 것들 위주로요.\n\n【 교통패스 】\n이코카 카드(ICOCA)는 무조건 도착하자마자 관서공항역에서 구매하세요. 보증금 500엔 포함 2000엔이면 시작 가능하고, 전철·버스·편의점 결제까지 다 돼요.\n\n오사카 주유패스는 1일권 2800엔인데, 유니버설 스튜디오 안 가는 여행이라면 이게 훨씬 이득이에요. 텐포잔, 나니와 박물관 등 30곳 이상 무료 입장 포함이거든요.\n\n난카이 라피트(공항↔난바)는 편도 1450엔인데 하루카 특급이 더 다양한 역에 서니 일정에 맞게 선택하세요.\n\n【 맛집 】\n타코야키: 도톤보리 쿠쿠루보다 아메리카무라 근처 타코야키 도지마가 줄도 짧고 맛도 진해요. 저녁 6시 이후 방문 추천.\n\n라멘: 신우메다 식당가 지하 킨류 라멘은 24시간 운영이에요. 새벽에 먹는 국물이 진짜 별미입니다.\n\n스시: 난바 우마이몬 도리보다 구로몬 시장 안 노포들이 훨씬 저렴하고 신선해요. 1관 200엔짜리도 있어요.\n\n디저트: 호리에 쪽 모토마치 케이크는 오전 11시 전에 가야 원하는 거 고를 수 있어요.\n\n【 숙소 】\n난바·신사이바시: 관광 중심이지만 밤에 시끄럽고 가격이 비싸요. 처음 방문이면 위치 때문에 감수할 만해요.\n\n우메다: 교통 허브라 어디든 이동이 편해요. 가성비 호텔도 많고 편의점·마트 접근성이 최고예요.\n\n추천 숙소 유형: 캡슐호텔은 1박 3000~4000엔대, 게스트하우스 도미토리는 2500엔부터 시작이에요. 혼자 여행이면 First Cabin 시리즈 강추합니다. 비행기 좌석 컨셉인데 프라이버시도 있고 깔끔해요.\n\n예약 팁: 성수기(3~4월 벚꽃, 10~11월 단풍, 골든위크)는 3개월 전 예약 필수예요. 늦으면 가격이 2~3배 뜁니다.",
    category: 'tips',
    travelStyles: ['맛집', '관광', '교통'],
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
    trip: { id: 'trip-p4', destination: '다낭', country: '베트남', startDate: '2025-06-27', endDate: '2025-06-30', travelStyles: ['힐링', '액티비티'] },
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
  { id: 'p13', author: mockUsers[0], title: '바르셀로나 가우디 투어, 이렇게 하면 줄 안 서요 🏛️', content: '사그라다 파밀리아는 무조건 오전 9시 전에 온라인 예약 필수예요. 구엘 공원은 이른 아침 방문 추천 — 빛이 달라요. 보케리아 시장은 뒷골목 타파스 바랑 같이 돌면 완벽한 반나절 코스입니다.', category: 'tips', travelStyles: ['역사/문화', '사진', '관광'], trip: { id: 'trip-p13', destination: '바르셀로나', country: '스페인', startDate: '2025-03-20', endDate: '2025-03-27', travelStyles: ['역사/문화', '사진'] }, likes: 118, comments: 31, createdAt: '2025-05-16T10:00:00' },
  { id: 'p14', author: mockUsers[2], title: '발리 우붓, 라이스테라스와 카페로 채운 5일 🌿', content: '떼갈랄랑 라이스테라스는 오전 7시에 가야 안개랑 빛이 아름다워요. 우붓 시장 근처 카페들은 한 블록만 들어가면 반값에 훨씬 분위기 좋아요. 스쿠터 하루 7만 루피아로 렌트해서 자유롭게 다녔어요.', category: 'tips', travelStyles: ['힐링', '사진', '카페'], trip: { id: 'trip-p14', destination: '발리', country: '인도네시아', startDate: '2025-04-01', endDate: '2025-04-06', travelStyles: ['힐링', '카페'] }, likes: 97, comments: 26, createdAt: '2025-05-13T08:00:00' },
  { id: 'p15', author: mockUsers[3], title: '뉴욕 브루클린 — 현지인처럼 보내는 주말 🗽', content: 'DUMBO에서 맨해튼 뷰 보고, 스모가스버그 야외 푸드마켓에서 브런치. 윌리엄스버그 빈티지샵 구경하다 루프탑 바로 마무리. 관광지 한 곳 안 가도 최고의 하루였어요.', category: 'tips', travelStyles: ['맛집', '쇼핑', '로컬'], trip: { id: 'trip-p15', destination: '뉴욕', country: '미국', startDate: '2025-02-15', endDate: '2025-02-22', travelStyles: ['맛집', '로컬'] }, likes: 134, comments: 42, createdAt: '2025-05-11T11:00:00' },
  { id: 'p16', author: mockUsers[1], title: '프라하 구시가지 골목, 혼자 걷기 가장 좋은 도시 🏰', content: '카를교 위에서 새벽 6시, 관광객 없는 고요함. 구시가지 광장 주변 골목마다 카페와 빈티지 서점이 넘쳐요. 체코 흑맥주 0.5L가 1유로 — 물보다 싸고 맛있어요. 유럽 여행 중 가장 동화 같은 도시였어요.', category: 'tips', travelStyles: ['역사/문화', '힐링', '카페'], trip: { id: 'trip-p16', destination: '프라하', country: '체코', startDate: '2025-03-05', endDate: '2025-03-10', travelStyles: ['역사/문화', '힐링'] }, likes: 86, comments: 24, createdAt: '2025-05-08T09:00:00' },
  { id: 'p17', author: mockUsers[4], title: '리스본 파두의 밤, 포르투갈 와인과 함께 🎶', content: '알파마 지구 파두 바에서 생라이브 공연 들으며 포르투갈 와인 한 잔. 10유로짜리 코스 메뉴인데 공연 포함이에요. 28번 트램 타고 언덕 오르내리는 것도 리스본 필수 체험이에요.', category: 'tips', travelStyles: ['역사/문화', '맛집', '나이트라이프'], trip: { id: 'trip-p17', destination: '리스본', country: '포르투갈', startDate: '2025-04-15', endDate: '2025-04-21', travelStyles: ['역사/문화', '맛집'] }, likes: 109, comments: 33, createdAt: '2025-05-07T14:00:00' },
  { id: 'p18', author: mockUsers[0], title: '이스탄불 그랜드 바자르, 흥정 없이 쇼핑하는 법 🪔', content: '바자르 안에서 가격 흥정은 필수지만, 첫 가격의 40%를 부르면 보통 60~70%에 타결돼요. 차이(터키차)는 무조건 빨간 튤립 잔으로 받아야 제맛. 갈라타 다리 아래 생선 샌드위치는 1.5유로 최고의 간식이에요.', category: 'review', travelStyles: ['현지시장', '관광', '맛집'], trip: { id: 'trip-p18', destination: '이스탄불', country: '튀르키예', startDate: '2025-02-20', endDate: '2025-02-27', travelStyles: ['현지시장', '관광'] }, likes: 143, comments: 48, createdAt: '2025-05-06T10:00:00' },

  // 로컬 추천 (review)
  { id: 'r1', author: mockUsers[0], title: '도쿄 1박에 3만원대 게스트하우스 찾았어요 🏠', content: '신주쿠역 도보 8분. 청결하고 직원도 친절해요. 조식 포함에 로커까지 — 혼자 여행자한테는 최고의 가성비입니다. 예약은 Booking.com에서 3개월 전에 해야 빈방 있어요.', category: 'review', travelStyles: ['배낭', '힐링'], trip: { id: 'trip-r1', destination: '도쿄', country: '일본', startDate: '2025-04-10', endDate: '2025-04-14', travelStyles: ['배낭'] }, likes: 112, comments: 34, createdAt: '2025-05-15T09:00:00' },
  { id: 'r2', author: mockUsers[4], title: '오사카 현지인만 아는 타코야키 골목 🐙', content: '도톤보리 말고 난바 뒷골목 "타코야키 요코초" 가보셨어요? 관광객 없고 1개 100엔짜리 포장마차들이 줄지어 있어요. 저녁 6시 이후 문 열어요.', category: 'review', travelStyles: ['맛집', '로컬', '현지시장'], trip: { id: 'trip-r2', destination: '오사카', country: '일본', startDate: '2025-05-01', endDate: '2025-05-05', travelStyles: ['맛집'] }, likes: 87, comments: 19, createdAt: '2025-05-14T18:00:00' },
  { id: 'r3', author: mockUsers[2], title: '방콕 교통 완전 정복 — BTS vs 툭툭 vs 그랩 비교 🛺', content: 'BTS(전철): 관광지 이동 가성비 최고. 툭툭: 짧은 거리 흥정 필수, 바가지 주의. 그랩: 야간 이동 시 제일 안전하고 예측 가능. 숙소 픽업은 그랩 추천합니다.', category: 'review', travelStyles: ['관광', '배낭'], trip: { id: 'trip-r3', destination: '방콕', country: '태국', startDate: '2025-03-15', endDate: '2025-03-20', travelStyles: ['관광'] }, likes: 203, comments: 45, createdAt: '2025-05-12T10:00:00' },
  { id: 'r4', author: mockUsers[1], title: '파리 슈퍼마켓 장보기 가이드 🧀', content: 'Monoprix, Carrefour City, Franprix 세 곳 중에 가격 대비 가장 좋은 건 Monoprix. 와인 €4~6면 충분히 맛있어요. 숙소에서 샤퀴테리 플레이트 만들어 먹는 게 파리 최고의 저녁입니다.', category: 'review', travelStyles: ['맛집', '힐링', '로컬'], trip: { id: 'trip-r4', destination: '파리', country: '프랑스', startDate: '2025-04-05', endDate: '2025-04-12', travelStyles: ['맛집'] }, likes: 76, comments: 22, createdAt: '2025-05-11T14:00:00' },
  { id: 'r5', author: mockUsers[3], title: '도쿄 편의점 이것만은 꼭 먹어봐 🍙', content: '세븐일레븐: 연어 계란 샌드위치 / 로손: 카라아게 쿤 / 패밀리마트: 크림 찹쌀빵. 아침마다 편의점 투어하는 게 여행 하이라이트였어요. 각 지점마다 살짝씩 다른 한정 상품도 체크해보세요.', category: 'review', travelStyles: ['맛집', '카페'], trip: { id: 'trip-r5', destination: '도쿄', country: '일본', startDate: '2025-04-10', endDate: '2025-04-14', travelStyles: ['맛집'] }, likes: 154, comments: 38, createdAt: '2025-05-10T08:00:00' },
  { id: 'r6', author: mockUsers[0], title: '방콕 마사지샵 — 바가지 없는 진짜 로컬 찾는 법 💆', content: '관광지 근처 네온사인 샵 말고 골목 안쪽을 찾아야 해요. 구글맵에서 별점 4.5 이상 + 리뷰 100개 이상인 곳 위주로 예약하면 실패 없어요. 타이 마사지 2시간 200밧(약 8천원)이 적정가입니다.', category: 'review', travelStyles: ['힐링', '로컬'], trip: { id: 'trip-r6', destination: '방콕', country: '태국', startDate: '2025-03-15', endDate: '2025-03-20', travelStyles: ['힐링'] }, likes: 91, comments: 27, createdAt: '2025-05-08T16:00:00' },
  { id: 'r7', author: mockUsers[2], title: '바르셀로나 타파스 바 — 관광지 말고 여기 가세요 🥘', content: '람블라스 거리 타파스 바는 거의 다 바가지예요. 그라시아 지구나 포블레 섹 골목 안쪽을 찾아보세요. 핀초스 1개 1.5유로, 상그리아 피처 8유로가 적정가입니다.', category: 'review', travelStyles: ['맛집', '로컬', '현지시장'], trip: { id: 'trip-r7', destination: '바르셀로나', country: '스페인', startDate: '2025-03-20', endDate: '2025-03-27', travelStyles: ['맛집'] }, likes: 98, comments: 29, createdAt: '2025-05-05T12:00:00' },
  { id: 'r8', author: mockUsers[3], title: '발리 스쿠터 렌트 완전 정복 🛵', content: '우붓 기준 하루 7만~10만 루피아(약 6천원). 국제면허 없어도 잘 안 잡히지만 경찰 검문 대비해서 여권 복사본은 꼭 챙기세요. 기름은 페르타막스(파란색) 가득 넣어도 4만 루피아예요.', category: 'review', travelStyles: ['액티비티', '배낭', '로컬'], trip: { id: 'trip-r8', destination: '발리', country: '인도네시아', startDate: '2025-04-01', endDate: '2025-04-06', travelStyles: ['액티비티'] }, likes: 167, comments: 52, createdAt: '2025-05-04T09:00:00' },
  { id: 'r9', author: mockUsers[1], title: '뉴욕 지하철 완전 정복 — 초보자 생존 가이드 🚇', content: '메트로카드 대신 OMNY(탭) 결제가 훨씬 편해요. A/C/E/B/D/F/M 라인만 알면 맨해튼 거의 다 갈 수 있어요. 심야 지하철은 가운데 칸 이용하고, 사람 많은 칸 타는 게 안전해요.', category: 'review', travelStyles: ['배낭', '관광'], trip: { id: 'trip-r9', destination: '뉴욕', country: '미국', startDate: '2025-02-15', endDate: '2025-02-22', travelStyles: ['배낭'] }, likes: 221, comments: 67, createdAt: '2025-05-03T10:00:00' },
];

export const TRAVEL_STYLES = [
  '피식', '액티비티', '사진', '관광', '힐링', '카페', '배낭', '쇼핑', '맛집', '역사/문화', '나이트라이프', '현지시장',
];
