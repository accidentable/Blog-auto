import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider } from "@/types";

interface AnalysisResult {
  summary: string;
  threadsContent: string;
}

const ANALYSIS_PROMPT = (content: string) => `너는 블록체인 업계에서 10년 넘게 일한 현직자야. 텔레그램 뉴스를 받아서 Threads에 올릴 글을 써야 해.

단순 요약이 아니라, 이 뉴스가 왜 중요한지, 업계에 어떤 영향을 미치는지, 일반인이 모르는 맥락까지 넣어서 풍부하게 써야 해.
웹 검색을 통해 관련 배경 정보, 경쟁사 동향, 시장 상황 등 추가 맥락을 확보한 뒤 글에 녹여내.

## 결과물 2가지

1. summary: 핵심 요약 2-3문장 (팩트 중심)

2. threadsContent: Threads 게시물 (아래 규칙대로)

## Threads 작성 규칙

[절대 금지]
- 이모지 금지
- 해시태그 금지
- 존댓말 금지 ("합니다", "됩니다", "입니다" 등)
- "다음 편에서 알려줄게" 같은 뻔한 클리셰 금지

[톤]
- 반말 구어체 ("이거", "근데", "거든", "~함", "~임")
- 블록체인 현직자가 후배한테 설명해주는 느낌
- 자신감 있고 단정적인 어투

[구조]
훅: 사람들이 스크롤을 멈추게 만드는 한 줄. 도발적 질문, 반직관적 사실, 숫자 활용
(빈 줄)
본문: 이 뉴스의 핵심 + 왜 중요한지 + 남들이 모르는 맥락이나 배경
짧은 문장으로 끊되 정보량은 풍부하게. 구체적 수치, 비교, 인사이트 포함
(빈 줄)
마무리: 뉴스에 대한 본인만의 관점이나 해석 한 줄. 매번 다른 패턴으로 끝내기

[문체]
- 줄바꿈을 적극 활용해서 가독성 높이기
- 한 문장 20자 내외로 짧게 끊기
- 500자 이내

## 참고 예시

예시1:
2년 뒤 주식시장 대호황 예정

이거 그냥 뇌피셜이 아니야
스탠다드차타드 은행이랑
미국 재무부가 같은 그림을 그리고 있어

근데 그 호황의 트리거가
AI도 아니고 반도체도 아니야
스테이블코인이야

예시2:
전쟁 터지면 비트코인 폭락한다고?

맞아. 처음엔 떨어져
근데 진짜 중요한 건 그 다음이거든
매번 반등함

역사가 증명하는 건
공포장에서 산 사람이 결국 이긴다는 거야

예시3:
Aptos가 마스터카드랑 손잡았다고?

그냥 파트너십이 아니야
Crypto Partner Program이면
실결제 인프라에 들어간다는 뜻이거든

Move 체인 중에 전통 금융이랑
이 정도로 붙은 건 Aptos가 처음임
이게 무슨 의미인지 아는 사람은 알 거야

## 원본 뉴스
${content}

다음 JSON 형식으로만 응답 (threadsContent 안의 줄바꿈은 \\n으로):
{"summary": "요약", "threadsContent": "내용"}`;

function parseResult(text: string): AnalysisResult {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}

  return {
    summary: text.slice(0, 500),
    threadsContent: text.slice(0, 500),
  };
}

async function analyzeWithClaude(
  content: string,
  apiKey: string
): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: ANALYSIS_PROMPT(content) }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  return parseResult(text);
}

async function analyzeWithOpenAI(
  content: string,
  apiKey: string
): Promise<AnalysisResult> {
  // Use OpenAI Responses API with web search
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      tools: [{ type: "web_search_preview" }],
      input: ANALYSIS_PROMPT(content),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${err}`);
  }

  const data = await res.json();

  // Extract text from Responses API output
  let text = "";
  for (const item of data.output || []) {
    if (item.type === "message" && item.content) {
      for (const block of item.content) {
        if (block.type === "output_text") {
          text = block.text;
        }
      }
    }
  }

  return parseResult(text);
}

export async function analyzeNews(
  content: string,
  apiKey: string,
  provider: AIProvider = "openai"
): Promise<AnalysisResult> {
  if (provider === "openai") {
    return analyzeWithOpenAI(content, apiKey);
  }
  return analyzeWithClaude(content, apiKey);
}
