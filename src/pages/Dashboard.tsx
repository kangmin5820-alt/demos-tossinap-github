import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MediaOutlet {
  name: string;
  rating: number;
  bias: "progressive" | "conservative" | "neutral";
  sponsors: string[];
  methodology: string;
}

const mediaOutlets: MediaOutlet[] = [
  {
    name: "한겨레",
    rating: 7.5,
    bias: "progressive",
    sponsors: ["한겨레신문사", "독자"],
    methodology: "진보 성향의 보도, 시민 참여 중심",
  },
  {
    name: "조선일보",
    rating: 7.2,
    bias: "conservative",
    sponsors: ["조선일보사"],
    methodology: "보수 성향의 보도, 전통적 가치 중심",
  },
  {
    name: "중앙일보",
    rating: 7.8,
    bias: "neutral",
    sponsors: ["중앙일보사", "삼성"],
    methodology: "중도 보도, 균형있는 시각",
  },
  {
    name: "경향신문",
    rating: 7.3,
    bias: "progressive",
    sponsors: ["경향신문사", "독자"],
    methodology: "진보 성향의 보도, 사회적 이슈 중심",
  },
];

const getBiasColor = (bias: string) => {
  switch (bias) {
    case "progressive":
      return "bg-demos-blue/10 text-demos-blue border-demos-blue/20";
    case "conservative":
      return "bg-demos-red/10 text-demos-red border-demos-red/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getBiasLabel = (bias: string) => {
  switch (bias) {
    case "progressive":
      return "진보";
    case "conservative":
      return "보수";
    default:
      return "중립";
  }
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">미디어 대시보드</h1>
          <p className="text-muted-foreground">
            각 언론사의 성향, 후원 관계, 평가 방법론을 투명하게 공개합니다
          </p>
        </div>

        <Card className="mb-8 bg-gradient-card p-6 shadow-card">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary" />
            <div>
              <h3 className="mb-1 font-semibold text-foreground">평가 방법론</h3>
              <p className="text-sm text-muted-foreground">
                미디어 레이팅은 사실 정확성, 객관성, 투명성, 독립성 등을 종합적으로 평가합니다.
                후원 관계는 언론사의 재정적 독립성을 판단하는 중요한 지표입니다.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {mediaOutlets.map((outlet) => (
            <Card key={outlet.name} className="bg-gradient-card p-6 shadow-card transition-all hover:shadow-card-hover">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="mb-2 text-2xl font-bold text-foreground">{outlet.name}</h3>
                  <Badge variant="outline" className={getBiasColor(outlet.bias)}>
                    {getBiasLabel(outlet.bias)}
                  </Badge>
                </div>
                <div className="flex flex-col items-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">평점</span>
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-hero">
                            <span className="text-lg font-bold text-white">{outlet.rating}</span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>10점 만점 기준</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="mb-2 text-sm font-semibold text-foreground">주요 후원사</h4>
                <div className="flex flex-wrap gap-2">
                  {outlet.sponsors.map((sponsor) => (
                    <Badge key={sponsor} variant="secondary">
                      {sponsor}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">보도 특징</h4>
                <p className="text-sm text-muted-foreground">{outlet.methodology}</p>
              </div>

              <div className="mt-4 flex justify-end">
                <button className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80">
                  자세히 보기
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
