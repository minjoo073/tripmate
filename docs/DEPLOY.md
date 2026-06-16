# TripMate 배포 런북 (웹 데모)

목표: **백엔드(Render) + 프론트 웹(Vercel)** 을 띄워 가입·매칭·채팅이 실제로 도는 라이브 데모.
코드/API는 이미 준비 완료 — 아래는 "계정 만들고 클릭/값 채우기"만 남은 단계다.

구성:
- **프론트(Expo web)** → Vercel (`vercel.json`: `expo export -p web` → `dist/`)
- **백엔드(Express+Prisma)** → Render (`render.yaml` Blueprint)
- **DB** → Render Managed Postgres (Blueprint이 자동 생성)

---

## 1. 백엔드 + DB 배포 (Render)

1. <https://render.com> 가입 → **New ▸ Blueprint** → 이 레포 선택.
2. `render.yaml`을 자동 인식 → `tripmate-db`(Postgres) + `tripmate-api`(web) 생성.
   - `DATABASE_URL`: DB에서 자동 주입
   - `JWT_SECRET`: Render가 강력한 랜덤값 자동 생성
   - `ALLOWED_ORIGINS`: **일단 비워두고 3단계 후 채움**
3. 첫 배포 시 빌드(`npm install --include=dev && npm run build`) → 시작 시 `prisma migrate deploy` 자동 실행(마이그레이션 적용됨).
4. 배포 완료 후 URL 확인 (예: `https://tripmate-api.onrender.com`). 헬스체크:
   ```
   curl https://tripmate-api.onrender.com/health   # {"ok":true,...}
   ```

### 데모 데이터 시드 (최초 1회)
Render ▸ tripmate-api ▸ **Shell** 에서:
```
npm run db:seed
```
→ `alice@tripmate.app` / `password` (게스트 로그인 계정) + 동행 4명 + 여행/게시글 생성.

---

## 2. 프론트 웹 배포 (Vercel)

1. <https://vercel.com> 가입 → 이 레포 Import (`vercel.json` 자동 인식).
2. **Environment Variables** 추가:
   | Key | Value |
   |---|---|
   | `EXPO_PUBLIC_API_URL` | `https://tripmate-api.onrender.com` (1단계 백엔드 URL) |
3. Deploy → 웹 URL 확인 (예: `https://tripmate.vercel.app`).

> `EXPO_PUBLIC_API_URL`이 비면 **mock 모드**(데이터 저장 안 됨)로 뜬다. 실데모는 반드시 값 설정.

---

## 3. CORS 연결 (백엔드 ↔ 프론트)

Render ▸ tripmate-api ▸ **Environment** 에서 `ALLOWED_ORIGINS` 를 Vercel 도메인으로 설정:
```
ALLOWED_ORIGINS=https://tripmate.vercel.app
```
저장하면 자동 재배포. (값이 안 맞으면 브라우저에서 CORS 에러로 API가 전부 막힌다.)

---

## 4. E2E 스모크 체크 (배포 후 1회)

브라우저에서 Vercel URL 열고 순서대로 확인:

- [ ] 랜딩 → **게스트로 둘러보기** → alice로 로그인되고 홈 진입 (401 없음)
- [ ] **회원가입** 새 계정 → 로그인 유지
- [ ] **여행 성향** 설문 저장 → 앱 재진입 후에도 선택 유지 (서버 저장 확인)
- [ ] **메이트 찾기**(매칭) → 결과 리스트 + matchRate 표시
- [ ] **채팅방** 생성 → 메시지 전송/수신
- [ ] **커뮤니티** 글 목록/상세/좋아요

curl로 빠른 인증 확인:
```
curl -s -X POST https://tripmate-api.onrender.com/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"alice@tripmate.app","password":"password"}'
# → { user, token } 반환되면 정상
```

---

## 필수 환경변수 요약

| 위치 | 변수 | 값 |
|---|---|---|
| Render (api) | `DATABASE_URL` | Blueprint 자동 |
| Render (api) | `JWT_SECRET` | Blueprint 자동 생성 (**없으면 서버 부팅 차단**) |
| Render (api) | `ALLOWED_ORIGINS` | Vercel 도메인 (콤마로 다중 가능) |
| Render (api) | `NODE_ENV` | `production` |
| Vercel (web) | `EXPO_PUBLIC_API_URL` | Render 백엔드 URL |

> 대안 호스팅: Railway도 동일하게 동작(레포 연결 → `server/` 루트, 빌드 `npm install --include=dev && npm run build`, 시작 `npx prisma migrate deploy && npm start`, Postgres 플러그인 추가).
