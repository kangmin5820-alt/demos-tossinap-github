import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Sparkles, Filter, ExternalLink, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Post {
  id: number;
  title: string;
  summary: string;
  category: string;
  timestamp: string;
  commentCount: number;
  views: number;
  isOfficial: boolean;
  likes?: number;
  type?: "user" | "official";
  attachments?: {
    poll?: { question: string; options: string[] };
    links?: string[];
  };
}

const mockPosts: Post[] = [
  // 데모스 공식 게시물
  {
    id: 1,
    title: "이진숙 체포적부심사에 대한 논쟁",
    summary: "방송통신위원회 이진숙 위원장 후보자에 대한 체포적부심사가 오늘 오후 진행됩니다. 대통령의 예능 프로그램 출연을 둘러싼 논란이 계속되고 있습니다.",
    category: "정치",
    timestamp: "2시간 전",
    commentCount: 234,
    views: 1234,
    isOfficial: true,
    type: "official",
  },
  // 일반인 핫한 게시물
  {
    id: 2,
    title: "의대 증원, 우리 지역 병원은 어떻게 될까요?",
    summary: "의대 정원 증원이 결정되면 우리 지역 의료 환경은 개선될까요? 실제 지역 병원 근무 의사입니다. 현실적인 이야기 나눠요.",
    category: "사회",
    timestamp: "1시간 전",
    commentCount: 892,
    views: 5432,
    isOfficial: false,
    type: "user",
    likes: 1247,
    attachments: {
      poll: {
        question: "의대 증원, 당신의 입장은?",
        options: ["찬성", "반대", "조건부 찬성"]
      }
    }
  },
  {
    id: 3,
    title: "무비자 입국 제도, 관광객 실종 사건의 딜레마",
    summary: "무비자 입국 제도 시행 첫날, 중국인 관광객 6명이 행방불명되어 법무부가 추적에 나섰습니다. 개방과 안전 사이의 균형이 화두입니다.",
    category: "사회",
    timestamp: "4시간 전",
    commentCount: 156,
    views: 892,
    isOfficial: true,
    type: "official",
  },
  // 일반인 핫한 게시물
  {
    id: 4,
    title: "여론조사 회사에서 일합니다. 궁금한 점 물어보세요",
    summary: "여론조사의 신빙성에 대한 의문이 많으시죠? 실제 조사원으로 일하며 느낀 점들을 공유합니다. 표본 추출부터 질문 설계까지.",
    category: "정치",
    timestamp: "3시간 전",
    commentCount: 678,
    views: 4123,
    isOfficial: false,
    type: "user",
    likes: 923,
    attachments: {
      links: [
        "https://n.news.naver.com/mnews/article/079/0004073229"
      ]
    }
  },
  {
    id: 5,
    title: "북핵 불용 원칙, 흔들리는 한반도 안보 정책",
    summary: "북한은 비핵화 대화를 거부하는 가운데, 남한 일각에서는 북핵 인정론이 제기되며 '북핵 불용' 원칙이 흔들리고 있습니다.",
    category: "국제",
    timestamp: "6시간 전",
    commentCount: 342,
    views: 2156,
    isOfficial: true,
    type: "official",
  },
  {
    id: 6,
    title: "여론조사의 신빙성 논란, 과연 믿을 수 있을까",
    summary: "최근 발표된 여론조사 결과를 둘러싼 신뢰성 논란이 가열되고 있습니다. 표본 추출 방법과 질문 설계의 공정성에 대한 의문이 제기됩니다.",
    category: "정치",
    timestamp: "8시간 전",
    commentCount: 189,
    views: 1567,
    isOfficial: true,
    type: "official",
  },
  {
    id: 7,
    title: "의대 증원 정책, 의료계와 정부의 갈등 심화",
    summary: "정부의 의대 정원 증원 방침에 의료계가 강력 반발하며 갈등이 심화되고 있습니다. 의료 수급과 교육 질의 균형이 쟁점입니다.",
    category: "사회",
    timestamp: "12시간 전",
    commentCount: 412,
    views: 3245,
    isOfficial: true,
    type: "official",
  },
];

const Index = () => {
  const [filter, setFilter] = useState<"all" | "official">("all");

  const filteredPosts = filter === "official" 
    ? mockPosts.filter(post => post.type === "official")
    : mockPosts;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-3xl">
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-foreground">
              <Sparkles className="h-7 w-7 text-primary" />
              오늘의 핫이슈
            </h1>
            <p className="text-muted-foreground text-sm">
              데모스가 전하는 주요 뉴스와 각 진영의 목소리를 확인하세요
            </p>
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="rounded-full"
            >
              전체
            </Button>
            <Button
              variant={filter === "official" ? "default" : "outline"}
              onClick={() => setFilter("official")}
              className="rounded-full gap-2"
            >
              <Filter className="h-4 w-4" />
              데모스 공식
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
