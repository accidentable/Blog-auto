# Blog Auto - Telegram to Threads 자동 콘텐츠 시스템

텔레그램 채널/그룹의 블록체인 뉴스를 AI로 분석하고, Threads에 최적화된 콘텐츠를 자동 생성하는 시스템.

> **Live Demo:** [blog-auto-wheat.vercel.app](https://blog-auto-wheat.vercel.app)

## Features

- **Telegram 웹훅 연동** - 채널/그룹 메시지 실시간 수신
- **AI 뉴스 분석** - OpenAI (gpt-4o-mini + 웹 검색) 또는 Claude (Sonnet) 선택 가능
- **Threads 콘텐츠 생성** - 블록체인 현직자 톤의 한국어 콘텐츠 자동 생성
- **Threads 게시** - Meta Threads API OAuth 연동 및 원클릭 게시
- **토큰 사용량 추적** - AI API 호출 비용 실시간 모니터링
- **모바일 최적화 UI** - 모바일 퍼스트 반응형 디자인

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 5 |
| AI | OpenAI Responses API / Claude API |
| Messaging | Telegram Bot API (Webhook) |
| Social | Meta Threads API |
| Data Fetching | SWR |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/
│   ├── dashboard/       # 대시보드 - 통계, 토큰 사용량, 활동 로그
│   ├── feed/            # 뉴스 피드 - 텔레그램 수신 목록
│   ├── post/            # 게시 히스토리 및 콘텐츠 편집
│   ├── settings/        # API 키, 텔레그램, Threads 설정
│   └── api/
│       ├── telegram/    # 웹훅 수신 & 설정
│       ├── analyze/     # AI 분석 트리거
│       ├── threads/     # Threads OAuth & 게시
│       ├── news/        # 뉴스 CRUD
│       ├── stats/       # 대시보드 통계
│       ├── settings/    # 설정 관리
│       ├── token-usage/ # 토큰 사용량 조회
│       └── automation/  # 자동화 토글
├── components/
│   ├── layout/          # BottomNav, PageHeader, MobileContainer
│   ├── dashboard/       # StatsCards, ActivityTimeline, TokenUsageCard
│   ├── feed/            # NewsCard, NewsList, StatusBadge
│   ├── post/            # ContentEditor, ThreadsPreview, PublishButton
│   ├── settings/        # ApiKeyForm, TelegramConfig, ThreadsConnection
│   └── ui/              # Button, Card, Input, Toggle, Modal, Toast
├── lib/
│   ├── claude.ts        # AI 분석 (OpenAI + Claude)
│   ├── telegram.ts      # Telegram API 유틸
│   ├── threads.ts       # Threads 게시 API
│   ├── threads-auth.ts  # Threads OAuth
│   └── db.ts            # Prisma 클라이언트
├── hooks/               # useNews, useStats, useSettings
└── types/               # TypeScript 타입 정의
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (또는 [Supabase](https://supabase.com) 무료 티어)
- Telegram Bot Token ([BotFather](https://t.me/BotFather))
- OpenAI API Key 또는 Claude API Key
- (선택) Meta Developer App for Threads API

### Installation

```bash
git clone https://github.com/accidentable/Blog-auto.git
cd Blog-auto
npm install
```

### Environment Setup

`.env.local` 파일 생성:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Telegram
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_WEBHOOK_SECRET="your-webhook-secret"

# AI (하나 이상 필수)
OPENAI_API_KEY="sk-..."
CLAUDE_API_KEY="sk-ant-..."

# Threads (선택)
THREADS_APP_ID="your-app-id"
THREADS_APP_SECRET="your-app-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database Setup

```bash
npx prisma db push
npx prisma generate
```

### Run

```bash
npm run dev
```

`http://localhost:3000`에서 확인.

### Telegram Webhook 설정

로컬 개발 시 [ngrok](https://ngrok.com)으로 터널링:

```bash
ngrok http 3000
```

Settings 페이지에서 봇 토큰과 웹훅 URL 등록, 또는:

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=<NGROK_URL>/api/telegram/webhook&secret_token=<SECRET>"
```

## Deployment

### Vercel + Supabase

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. Session Pooler URL을 `DATABASE_URL`로 사용 (IPv4 호환)
3. [Vercel](https://vercel.com)에 배포 후 환경변수 설정
4. Telegram Webhook URL을 Vercel 도메인으로 변경

## Workflow

```
Telegram Channel/Group
        ↓ webhook
    뉴스 수신 & DB 저장
        ↓ auto/manual
    AI 분석 (OpenAI/Claude)
    → 요약 + Threads 콘텐츠 생성
        ↓ review
    사용자 검토 & 편집
        ↓ publish
    Threads 게시
```

## AI Prompt

블록체인 업계 10년차 현직자 페르소나로 콘텐츠 생성:
- 반말 구어체, 자신감 있는 어투
- 훅(도발적 질문/숫자) → 본문(맥락+인사이트) → 마무리(관점)
- 이모지/해시태그/존댓말 금지
- OpenAI 사용 시 웹 검색으로 추가 맥락 확보

## License

MIT
