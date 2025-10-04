import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { TrendingUp, Sparkles } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    title: "이진숙 체포적부심사...대통령 예능 출연 공방",
    summary: "방송통신위원회 이진숙 위원장 후보자에 대한 체포적부심사가 오늘 오후 진행됩니다. 대통령의 예능 프로그램 출연을 둘러싼 논란이 계속되고 있습니다.",
    category: "정치",
    timestamp: "2시간 전",
    commentCount: 234,
    views: 1234,
    isOfficial: true,
  },
  {
    id: 2,
    title: "무비자 입국 첫날 중국인 관광객 6명 사라졌다",
    summary: "무비자 입국 제도 시행 첫날, 중국인 관광객 6명이 행방불명되어 법무부가 추적에 나섰습니다.",
    category: "사회",
    timestamp: "4시간 전",
    commentCount: 156,
    views: 892,
    isOfficial: true,
  },
  {
    id: 3,
    title: "비핵화 대화 없다는 北, 북핵 인정하자는 南",
    summary: "북한은 비핵화 대화를 거부하는 가운데, 남한 일각에서는 북핵 인정론이 제기되며 '북핵 불용' 원칙이 흔들리고 있습니다.",
    category: "국제",
    timestamp: "6시간 전",
    commentCount: 342,
    views: 2156,
    isOfficial: true,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold text-foreground">
                <Sparkles className="h-8 w-8 text-primary" />
                오늘의 핫이슈
              </h1>
              <p className="text-muted-foreground">
                데모스가 전하는 주요 뉴스와 각 진영의 목소리를 확인하세요
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              인기순
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {mockPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
