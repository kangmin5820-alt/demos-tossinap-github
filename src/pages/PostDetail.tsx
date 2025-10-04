import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Calculator,
} from "lucide-react";

interface Perspective {
  stance: "progressive" | "conservative" | "neutral";
  title: string;
  summary: string;
  articles: Array<{ title: string; source: string; url: string }>;
}

const mockPerspectives: Perspective[] = [
  {
    stance: "progressive",
    title: "진보 진영 목소리",
    summary: "방송통신위원회의 독립성과 공정성을 강조하며, 이진숙 후보자의 체포영장 청구가 정당한 절차라고 주장합니다.",
    articles: [
      { title: "체포영장 청구, 공정한 수사의 시작", source: "한겨레", url: "#" },
      { title: "방송 장악 시도에 제동", source: "경향신문", url: "#" },
    ],
  },
  {
    stance: "conservative",
    title: "보수 진영 목소리",
    summary: "정치적 표적 수사라고 비판하며, 야당의 과도한 압박이 문제라고 지적합니다.",
    articles: [
      { title: "정치 검찰의 표적 수사", source: "조선일보", url: "#" },
      { title: "야당의 무리한 압박", source: "동아일보", url: "#" },
    ],
  },
  {
    stance: "neutral",
    title: "중립 관점",
    summary: "법적 절차에 따라 진행되는 사안으로, 양측의 주장을 균형있게 전달합니다.",
    articles: [
      { title: "체포영장 심사 절차 분석", source: "중앙일보", url: "#" },
    ],
  },
];

const getStanceColor = (stance: string) => {
  switch (stance) {
    case "progressive":
      return "bg-demos-blue text-white";
    case "conservative":
      return "bg-demos-red text-white";
    default:
      return "bg-demos-neutral text-white";
  }
};

const PostDetail = () => {
  const { id } = useParams();
  const [openPerspectives, setOpenPerspectives] = useState<string[]>(["progressive"]);

  const togglePerspective = (stance: string) => {
    setOpenPerspectives((prev) =>
      prev.includes(stance) ? prev.filter((s) => s !== stance) : [...prev, stance]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <article className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Badge className="mb-4">데모스 공식</Badge>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-foreground">
              이진숙 체포적부심사...대통령 예능 출연 공방
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>2024년 3월 15일</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>1,234회 조회</span>
              </div>
            </div>
          </div>

          <Card className="mb-8 bg-gradient-card p-6 shadow-card">
            <h2 className="mb-3 text-xl font-bold text-foreground">📋 핵심 요약</h2>
            <p className="leading-relaxed text-foreground">
              방송통신위원회 이진숙 위원장 후보자에 대한 체포적부심사가 오늘 오후 진행됩니다.
              이번 사건은 방송 장악 의혹과 대통령의 예능 프로그램 출연을 둘러싼
              정치적 논란이 맞물려 있습니다. 진보와 보수 진영은 각각 다른 관점에서
              이 사안을 바라보고 있으며, 향후 방송 정책에 미칠 영향이 주목됩니다.
            </p>
          </Card>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-foreground">🎯 각 진영별 목소리</h2>
            <div className="space-y-4">
              {mockPerspectives.map((perspective) => (
                <Collapsible
                  key={perspective.stance}
                  open={openPerspectives.includes(perspective.stance)}
                  onOpenChange={() => togglePerspective(perspective.stance)}
                >
                  <Card className="overflow-hidden bg-gradient-card shadow-card">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Badge className={getStanceColor(perspective.stance)}>
                            {perspective.title}
                          </Badge>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-muted-foreground transition-transform ${
                            openPerspectives.includes(perspective.stance) ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t p-4">
                        <p className="mb-4 text-foreground">{perspective.summary}</p>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground">대표 기사</h4>
                          {perspective.articles.map((article, idx) => (
                            <a
                              key={idx}
                              href={article.url}
                              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                            >
                              <div>
                                <p className="font-medium text-foreground">{article.title}</p>
                                <p className="text-sm text-muted-foreground">{article.source}</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>

          <Card className="mb-8 bg-gradient-hero p-6 shadow-card">
            <div className="flex items-start gap-3 text-white">
              <Calculator className="h-6 w-6 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold">영향 계산기</h3>
                <p className="mb-4 opacity-90">
                  이 정책이 당신에게 미칠 영향을 확인해보세요
                </p>
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  영향 계산하기
                </Button>
              </div>
            </div>
          </Card>

          <Separator className="my-8" />

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-foreground">💡 대표 의견</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-gradient-card p-4 shadow-card">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-foreground">사용자{i}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="ml-1">24</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-foreground">
                    이 사안은 방송의 독립성과 관련된 중요한 문제입니다.
                    양측의 주장을 모두 들어볼 필요가 있다고 생각합니다.
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-gradient-card p-6 shadow-card">
            <h3 className="mb-4 text-xl font-bold text-foreground">
              <MessageCircle className="mb-1 mr-2 inline h-5 w-5" />
              댓글
            </h3>
            <div className="rounded-lg border p-4">
              <textarea
                className="w-full resize-none border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                rows={3}
                placeholder="의견을 남겨주세요..."
              />
              <div className="mt-3 flex justify-end">
                <Button>댓글 작성</Button>
              </div>
            </div>
          </Card>
        </article>
      </main>
    </div>
  );
};

export default PostDetail;
