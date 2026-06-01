// Minimal seed: 1 hero user (alice@tripmate.app / password) + 4 demo mates
// + active trips + a couple of posts. Lets the app boot with real data
// immediately after a fresh DB migration.

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password', 10);

  await prisma.user.deleteMany({});

  const me = await prisma.user.create({
    data: {
      email: 'alice@tripmate.app',
      passwordHash: password,
      nickname: '김지은',
      age: 27,
      gender: 'female',
      location: '서울',
      bio: '카페와 골목 산책을 좋아해요. 오사카·교토 단골.',
      travelStyles: ['카페', '사진', '맛집'],
      travelCount: 8,
      rating: 4.8,
      isVerified: true,
      trustScore: 85,
    },
  });

  const others = await Promise.all(
    [
      {
        email: 'hansohee@tripmate.app',
        nickname: '한소희',
        age: 26,
        gender: 'female' as const,
        location: '서울',
        bio: '카페 투어 & 야경 산책 좋아해요.',
        travelStyles: ['카페', '사진', '야경 산책'],
        travelCount: 12,
        rating: 4.9,
        isVerified: true,
        trustScore: 88,
      },
      {
        email: 'choseung@tripmate.app',
        nickname: '조승연',
        age: 29,
        gender: 'female' as const,
        location: '부산',
        bio: '현지 맛집 + 로컬 시장 탐험가.',
        travelStyles: ['맛집', '현지시장', '로컬'],
        travelCount: 15,
        rating: 4.7,
        isVerified: true,
        trustScore: 80,
      },
      {
        email: 'yangsean@tripmate.app',
        nickname: '양세은',
        age: 24,
        gender: 'female' as const,
        location: '경기',
        bio: '힐링 위주 슬로우 여행자.',
        travelStyles: ['힐링', '카페'],
        travelCount: 6,
        rating: 4.6,
        isVerified: false,
        trustScore: 62,
      },
      {
        email: 'parkmj@tripmate.app',
        nickname: '박민준',
        age: 30,
        gender: 'male' as const,
        location: '서울',
        bio: '액티비티/관광 좋아하고 사진 찍어드려요.',
        travelStyles: ['액티비티', '관광', '사진'],
        travelCount: 10,
        rating: 4.5,
        isVerified: true,
        trustScore: 74,
      },
    ].map((u) => prisma.user.create({ data: { ...u, passwordHash: password } })),
  );

  // Active trips for the same dates so schedule overlap > 0 with `me`.
  const start = new Date('2026-06-15T00:00:00.000Z');
  const end = new Date('2026-06-19T23:59:59.000Z');

  await prisma.trip.create({
    data: {
      userId: me.id,
      destination: '오사카',
      country: '일본',
      startDate: start,
      endDate: end,
      travelStyles: ['카페', '사진', '맛집'],
    },
  });

  await Promise.all(
    others.map((u, i) =>
      prisma.trip.create({
        data: {
          userId: u.id,
          destination: i < 3 ? '오사카' : '도쿄',
          country: '일본',
          startDate: new Date(start.getTime() + i * 24 * 60 * 60 * 1000),
          endDate: new Date(end.getTime() + i * 24 * 60 * 60 * 1000),
          travelStyles: u.travelStyles,
        },
      }),
    ),
  );

  // A couple of community posts so the feed isn't empty on first login.
  const author = others[0]!;
  await prisma.post.createMany({
    data: [
      {
        authorId: author.id,
        title: '6/15-19 오사카 같이 가실 분 🙌',
        content: '도톤보리·우메다 위주로 천천히 다닐 동행 구해요.',
        category: 'mate',
        travelStyles: ['카페', '맛집'],
      },
      {
        authorId: me.id,
        title: '오사카 카페 5곳 후기',
        content: '실제 다녀본 카페 5곳 정리했어요. 사진은 댓글로!',
        category: 'tips',
        travelStyles: ['카페', '사진'],
      },
    ],
  });

  console.log('Seeded:', { me: me.email, others: others.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
