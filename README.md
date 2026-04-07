# YouTube Atlas

국가별 YouTube 인기 영상을 탐색하고, 영상을 바로 재생하면서 실시간 채팅과 개인화 기능까지 함께 쓰는 프론트엔드 애플리케이션입니다.

배포 링크: [https://youtube-atlas.vercel.app/](https://youtube-atlas.vercel.app/)

## 프로젝트 소개

이 프로젝트는 단순한 인기 영상 목록 페이지가 아니라, 다음 흐름이 한 화면에서 이어지도록 구성되어 있습니다.

- 국가와 카테고리를 바꿔가며 인기 영상을 탐색
- 선택한 영상을 즉시 재생하고 이전/다음 영상으로 이동
- 같은 영상 시청자와 실시간 채팅
- Google 로그인 후 즐겨찾기, 재생 위치 스크랩, 랭킹 게임 이용

프론트는 `VITE_API_BASE_URL`로 지정한 백엔드 API와 WebSocket 서버에 연결해 카탈로그, 인증, 채팅, 즐겨찾기, 재생 기록, 급상승 신호, 게임 데이터를 받아옵니다.

## 핵심 기능

- 국가별 인기 영상 탐색
- 메인/세부 카테고리 필터와 빠른 전환
- 선택 영상 즉시 재생, 이전/다음 이동, 자동 다음 재생
- 전체 카테고리 기준 `NEW`, 순위 상승, 조회수 증가 배지 표시
- 실시간 급상승 섹션 노출
- Google OAuth 로그인 및 세션 복원
- 채널 즐겨찾기 토글과 즐겨찾기 채널 영상 모아보기
- 재생 위치 스크랩과 마지막 재생 위치 자동 복원
- 영상 랭킹 게임 매수/매도와 보유 포지션 확인
- 매도 예상 정산에 0.3% 수수료 반영
- 영상별 실시간 공개 채팅
- 익명 채팅 및 로그인 프로필 기반 채팅 지원
- 채팅 5초 쿨다운, 중복 메시지 방지
- 라이트/다크 모드, 시네마틱 모드, 반응형 레이아웃
- 국가, 테마, 시네마틱 모드 상태 로컬 저장

## 기술 스택

- React 19
- TypeScript
- Vite 6
- TanStack Query
- STOMP WebSocket
- Google Identity Services
- ESLint
- Vitest
- Testing Library
- Vercel

## 현재 구조

```text
src
├── app
│   ├── App.tsx
│   └── providers.tsx
├── pages
│   └── home
│       ├── HomePage.tsx
│       ├── hooks
│       ├── sections
│       └── utils.ts
├── components
│   ├── CommentSection
│   ├── GoogleLoginButton
│   ├── SearchBar
│   ├── VideoList
│   └── VideoPlayer
├── constants
│   ├── countryCodes.ts
│   └── videoCategories.ts
├── features
│   ├── auth
│   ├── comments
│   ├── favorites
│   ├── game
│   ├── playback
│   ├── trending
│   └── youtube
├── lib
│   ├── api.ts
│   └── supabase.ts
├── styles
│   ├── app.css
│   └── global.css
└── test
    └── setup.ts
```

## 화면 흐름

1. 앱이 저장된 국가/테마/시네마틱 설정과 로그인 세션을 복원합니다.
2. 선택 국가에 맞는 카테고리를 `/api/catalog/regions/:regionCode/categories`에서 받아옵니다.
3. 선택 카테고리의 인기 영상을 `/api/catalog/regions/:regionCode/categories/:categoryId/videos`에서 페이지 단위로 불러옵니다.
4. 전체 카테고리에서는 급상승 배지와 실시간 급상승 섹션을 함께 보여줍니다.
5. 영상을 선택하면 플레이어가 갱신되고, 재생 큐 기준으로 이전/다음 이동이 가능합니다.
6. 로그인 상태라면 마지막 재생 위치를 자동 복원하고, 현재 시점 재생 위치를 수동 스크랩할 수 있습니다.
7. 로그인 상태라면 현재 채널을 즐겨찾기에 추가하고, 전체 카테고리에서 즐겨찾기 채널 영상 묶음을 함께 볼 수 있습니다.
8. 활성 시즌이 있으면 현재 영상을 랭킹 게임 포지션으로 매수하거나 보유 포지션을 매도할 수 있습니다.
9. 채팅은 영상 ID 기준으로 분리되며 WebSocket `/ws` 구독으로 새 메시지를 실시간 반영합니다.

## 환경 변수

`.env.local` 파일을 만들고 아래 값을 설정해 주세요.

```bash
VITE_API_BASE_URL=http://localhost:8080
```

`.env.example`도 같은 값을 기준으로 제공됩니다.

백엔드가 연결되지 않으면 목록/채팅/로그인/즐겨찾기/재생 기록/게임 기능은 동작하지 않습니다.

## 실행 방법

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 스크립트

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm test
```

## 테스트 범위

- 카테고리 정렬 및 메인 카테고리 분리 규칙
- YouTube 카탈로그 API 요청 생성
- 재생 위치 저장 API 요청 생성
- 즐겨찾기 API 요청 생성
- 채팅 스팸 방지와 에러 매핑
- 급상승 Query와 표시 규칙
- Google 로그인 버튼 동작
- 플레이어, 영상 목록, 채팅 UI 동작
- 재생 큐 훅 동작

## 참고 사항

- 프론트는 YouTube API 키를 직접 다루지 않고 백엔드 API만 호출합니다.
- `src/lib/supabase.ts`, `supabase/` 디렉터리는 현재 구조와 별도로 남아 있는 보조 자산입니다.
- 전체 카테고리에서만 급상승 신호와 즐겨찾기 영상 섹션이 활성화됩니다.

## 개선 여지

- 채팅 moderation, 신고, 차단 기능
- 실제 백엔드와 함께 도는 E2E 테스트
- 시즌/거래 이력 중심의 게임 화면 확장
- 운영 모니터링과 에러 추적 강화
