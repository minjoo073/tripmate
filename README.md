# TripMate

여행 동행 매칭 모바일 앱. Expo / React Native + Expo Router 기반이고, 동일한 코드베이스가 **iOS / Android / 웹**에서 모두 동작합니다.

> Live demo (GitHub Pages): https://minjoo073.github.io/tripmate/

---

## 무엇을 하는 앱인가

- AI가 여행 일정과 성향을 비교해 **딱 맞는 동행자**를 추천
- 동행 모집 글 / 여행 기록 / 로컬 추천 콘텐츠가 섞인 **커뮤니티 피드**
- 채팅에서 **여행 일정 카드**를 주고받고 동행을 확정하면 매칭 화면으로 연결
- **신뢰 인증**(휴대폰·이메일·신분증·SNS)으로 매칭 우선순위·신뢰도 가시화
- 보드패스 / 여권 스탬프 / 항공권 메타포로 **여행자 정체성을 시각화**

## 빠른 시작

```bash
npm install
npm run web        # 브라우저 (PORT 환경변수로 포트 지정)
npm run ios        # iOS 시뮬레이터 (Xcode 필요)
npm run android    # Android 에뮬레이터
npm start          # Expo Go QR (실기기)
```

## 디렉터리 구조

```
app/                       # Expo Router 화면 (파일 = 라우트)
  (app)/                   # 로그인 이후 메인 그룹
    (tabs)/                # 하단 탭: 홈·탐색·피드·채팅·나
    (auth)/                # 로그인·회원가입
    chat/[id].tsx          # 채팅방
    match/{loading,list,confirmed}.tsx
    post/{new,[id]}.tsx
    explore-*.tsx          # 단계별 동행 검색
    trip-{plan,detail}.tsx # 여행 계획 등록·상세
    profile-setup.tsx, verification.tsx, settings.tsx
  landing.tsx              # 웹 전용 풀스크린 랜딩
  _layout.tsx              # 루트 스택 + 폰트 주입
components/                # 도메인별 UI 컴포넌트
  ui/{Avatar,Button,DateRangePicker,Icon,...}.tsx
  chat/, community/, home/, match/, mate/
context/                   # 전역 상태 + AsyncStorage 영속
  AuthContext         사용자 + updateUser
  ProfileContext      아바타·소개·MBTI·스타일·성향·찜·저장
  PersonalityContext  7개 성향 차원
  TripsContext        upcoming + history (최근 3개 자동 노출)
  VerificationContext 인증 항목별 완료 여부
services/                  # 데이터 접근 (USE_MOCK 폴백 포함)
  authService, chatService, communityService, matchService, api
mock/data.ts               # 시드 데이터 (유저·여행·게시글·채팅 스크립트)
constants/                 # 색·아이콘·프로필 아이콘 인덱스
docs/                      # GitHub Pages용 정적 export (자동 생성)
.github/workflows/         # CI: 소스 푸시 시 docs/ 자동 재빌드
```

## 기술 스택

- **Expo SDK 54** · **React 19** · **React Native 0.81**
- **Expo Router 6** (파일 기반 라우팅, 그룹 라우트로 탭/스택 합성)
- **react-native-reanimated 4**, **react-native-svg 15**
- **AsyncStorage** (네이티브) / localStorage 폴백 (웹)
- **axios** 기반 서비스 레이어 + `EXPO_PUBLIC_API_URL` 미설정 시 **mock 모드** 자동 활성
- 웹은 **react-native-web**으로 동일 컴포넌트가 그대로 렌더

## 코드베이스의 진화 흐름

> 같은 앱이지만 단계마다 큰 방향 전환이 있었습니다. 어떤 식으로 자라왔는지 정리.

### 1. **초기 골격 — 풀 화면 20개의 정적 앱** *(dfd2f23 ~ 5e89abc)*
20개 화면을 모두 구현한 정적 프로토타입. 데이터는 `mock/data.ts`에 박혀 있고, 동작은 거의 화면 전환뿐. 폰 프레임 UI로 웹에서도 모바일처럼 보이도록.

### 2. **GitHub Pages 배포 인프라 정비** *(2de5fd7, 46207d3, 22b73bf, 39b4604, 0cba793, 975928d, d0caad5)*
서브 디렉터리 호스팅 특성에 맞춰:
- `baseUrl: /tripmate` 적용
- `.nojekyll` 추가로 `_expo/` 자산 서빙
- SPA 라우팅 fallback용 `404.html`
- `history.replaceState`로 prefix 제거 → Expo Router init 충돌 회피
- postbuild 스크립트로 자산 경로 패치

### 3. **라우트 그룹 재편 — `(app)` 도입** *(ad18e36)*
로그인 이전(landing)과 이후(탭+스택)를 분리. 웹에서 landing은 풀스크린, 이후 화면은 폰 프레임 안에 렌더되는 dual layout.

### 4. **첫 번째 UX 대수술** *(6a6bdb0, 802dbdc, cdd55b6)*
- 홈/프로필 7가지 UX 개선
- 홈 필터 카테고리마다 전용 페이지 분리
- 이모지 아이콘 → **SVG stroke 아이콘 시스템**으로 통일

### 5. **프리미엄 비주얼 아이덴티티** *(ea3adf7, 21cdd40, cbdac52, b8ffe58)*
"editorial travel mood" 컨셉으로 색·타이포·간격 전면 리디자인. 동행 신청 시트, 보드패스, 글쓰기, 채팅 등이 한 결로 합쳐짐. 이 시점부터 앱이 단순 매칭 도구가 아닌 **여행 정체성을 다루는 무드 보드**로 자리잡음.

### 6. **인터랙션 깊이 추가** *(c6da5d7, e25f4cd)*
- 텍스트 밀도를 낮추고 호흡 추가 — 모든 탭에서 헤더 간격 통일
- 홈에서 동행 매칭 카드가 **슬라이드 업되는 다층 인터랙션** 도입

### 7. **컬러 시스템 전환 — cool palette + 더스티 로즈** *(c07a0ed, de3b33d, 96a42b8)*
브랜드 톤이 따뜻한 베이지에서 cool palette + amber/dusty rose 액센트로 바뀜. 첫 번째 캘린더 피커도 같이 들어옴.

### 8. **지도 + 여행 기록 메타포** *(51254b1, 5c3e206)*
- OSM 타일 기반 지도 카드
- 여행 기록을 "Route Archive 저널" 형태로 표현
- 프로필 아이콘 12종 + 신뢰 인증 센터 추가

### 9. **컴포넌트 공통화** *(724fecb)*
캘린더 피커가 여러 화면에서 중복되던 걸 공통 모듈로 분리. 프로필 아이콘 피커 신설.

### 10. **여행자 정체성 시각화 강화** *(27c9aa7)*
- 홈 hero에 **랜드마크 배경 사진** 자동 노출
- 프로필 보드패스 / 여권 스탬프 UI 정착
- 인앱 날짜 피커 통합

### 11. **채팅 인터랙티브화** *(6077556)*
- 데모 대화가 메시지 단위로 **자동 재생**(한소희 pending, 조승연 accepted)
- 동행 확정 시트·확정 모달 흐름
- 동적 채팅방 생성 + AsyncStorage 영속화

### 12. **데이터 흐름 통합 — 컨텍스트 다층화** *(36d0ad4, 오늘)*
하드코딩되어 있던 통계·여행 기록·저장 글·인증 상태를 모두 **AsyncStorage 영속화**로 전환:
- `ProfileContext`, `TripsContext`, `VerificationContext` 신설
- 프로필 수정·여행 계획·게시글 북마크·인증 완료가 **앱 전체에 즉시 반영**
- 로그아웃 시 모든 컨텍스트 일괄 초기화 (계정 전환 안전성)
- explore 필터(성별·연령·인원·인증)가 매칭 결과에 실제 반영
- 알림 탭하면 해당 화면으로 이동 + 자동 읽음
- 채팅 FlatList 윈도잉 + `ChatBubble` memo
- 트립플랜 뒤로가기가 직전 화면 복귀

### 13. **CI 자동화** *(b5da9b5, 오늘)*
소스를 푸시하면 GitHub Actions가 `npm run build:web`을 돌려 `docs/`를 자동 갱신·커밋. 더 이상 수동으로 빌드 커밋을 만들 필요 없음. `paths-ignore: docs/**` 로 워크플로 자기 자신을 부르지 않게 보호.

---

## 배포

| 타깃 | 진입점 | 설정 |
|---|---|---|
| GitHub Pages | `https://minjoo073.github.io/tripmate/` | `docs/` 폴더, `baseUrl: /tripmate` |
| Vercel | `vercel.json` | 정적 빌드 결과(`docs/`) 서빙 |
| 모바일 | Expo Go / EAS Build | `app.json`의 `com.tripmate.app` |

소스 변경 후 자동 빌드를 위한 1회 GitHub 설정:
- **Settings → Actions → General → Workflow permissions**: Read and write 켜기
- **Settings → Pages → Source**: Deploy from branch / main / `/docs`

---

## 기여 흐름

```bash
# 1) 소스 수정
# 2) main에 푸시
git push origin main

# 3) GitHub Actions가 docs/ 자동 재빌드 (1~3분 소요)
# 4) GitHub Pages가 새 docs/ 서빙 (다시 1~2분)
```

로컬에서 직접 빌드를 확인하려면:
```bash
npm run build:web
```

---

## 알려진 제한

- `services/*.ts`는 `EXPO_PUBLIC_API_URL`이 비어 있으면 **mock 모드**로 동작. 실제 백엔드는 아직 없음.
- 인증 / 매칭 / 채팅 응답은 모두 mock 데이터 또는 시뮬레이션(setTimeout).
- 웹의 `phoneFrame`은 390×844 고정 — 데스크톱 브라우저용. 모바일 브라우저 반응형은 향후 개선.
