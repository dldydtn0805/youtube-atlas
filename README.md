# YouTube Atlas

국가별 YouTube 인기 영상을 탐색하고, 선택한 영상에 대해 실시간 익명 채팅을 할 수 있는 웹 애플리케이션입니다.

배포 링크: [https://youtube-atlas.vercel.app/](https://youtube-atlas.vercel.app/)

## 프로젝트 소개

YouTube Data API로 국가별 인기 영상을 불러오고, Supabase Realtime을 이용해 영상별 공개 채팅방을 구현했습니다.  
한 화면에서 국가 선택, 인기 영상 탐색, 영상 재생, 실시간 대화까지 이어서 사용할 수 있도록 구성했습니다.

## 주요 기능

- 국가별 YouTube 인기 영상 조회
- 선택한 영상 즉시 재생
- 영상별 공개 실시간 익명 채팅
- 마지막 선택 국가 `localStorage` 저장
- 반응형 UI

## 기술 스택

- React 19
- TypeScript
- Vite
- TanStack Query
- Supabase
- YouTube Data API v3
- ESLint
- Vercel

## 구현 포인트

- React Query로 YouTube API 요청의 로딩, 에러 처리, 캐싱을 관리했습니다.
- Supabase Realtime 구독을 사용해 WebSocket 기반 실시간 채팅을 구현했습니다.
- 메시지 버블 UI, Enter 전송, 자동 스크롤을 적용해 댓글형이 아니라 채팅형 UX로 전환했습니다.
- 환경변수를 분리해 로컬 개발 환경과 배포 환경에서 API 키를 분리 관리했습니다.

## 프로젝트 구조

```text
src
├── app
│   ├── App.tsx              # 전체 화면 레이아웃 및 상태 관리
│   └── providers.tsx        # 앱 전역 provider 설정
├── components
│   ├── CommentSection       # 영상별 실시간 채팅 UI
│   ├── SearchBar            # 국가 선택 UI
│   ├── VideoList            # 인기 영상 목록 UI
│   └── VideoPlayer          # 선택한 영상 재생 iframe
├── constants
│   └── countryCodes.ts      # 지원 국가 코드 목록
├── features
│   ├── comments
│   │   ├── api.ts           # 채팅 메시지 CRUD
│   │   ├── queries.ts       # 메시지 조회 및 실시간 구독
│   │   └── types.ts         # 메시지 타입 정의
│   └── youtube
│       ├── api.ts           # YouTube API 호출
│       ├── queries.ts       # React Query 훅
│       └── types.ts         # API 응답 타입 정의
├── lib
│   └── supabase.ts          # Supabase client 초기화
├── supabase
│   └── comments.sql         # 채팅 테이블 및 정책 설정
├── styles
│   ├── app.css              # 앱 레이아웃 스타일
│   └── global.css           # 전역 스타일
├── main.tsx                 # 앱 엔트리 포인트
└── vite-env.d.ts
```

## 동작 방식

1. 사용자가 국가를 선택합니다.
2. `usePopularVideos(regionCode)`가 해당 국가의 인기 영상을 요청합니다.
3. 목록에서 영상을 선택하면 재생 영역이 갱신됩니다.
4. 선택한 영상마다 독립된 공개 채팅방이 열립니다.
5. 새 메시지는 Supabase Realtime을 통해 실시간으로 반영됩니다.
6. 마지막으로 선택한 국가는 브라우저 저장소에 유지됩니다.

## 환경 변수

프로젝트 실행 전 `.env.local` 또는 Vercel 환경 변수에 아래 값을 설정해야 합니다.

```bash
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Supabase SQL Editor에서 [`supabase/comments.sql`](/Users/yongsoolee/Documents/GitHub/World-Best-YouTube/supabase/comments.sql)을 실행해야 채팅 테이블, 권한, Realtime publication 설정이 함께 적용됩니다.

## 실행 방법

```bash
npm install
npm run dev
```

## 스크립트

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## 아쉬운 점

- 채팅 moderation 기능이 없습니다.
- 인증, 신고, 차단 기능이 없습니다.
- rate limit과 스팸 방지 로직이 없습니다.
- 테스트 코드가 아직 없습니다.

## 개선 예정

- Presence 기반 접속자 수 표시
- 채팅 삭제 및 신고 기능
- 스팸 방지 및 rate limit
- 메시지 도메인 네이밍 정리
