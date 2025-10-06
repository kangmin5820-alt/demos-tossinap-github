import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Heart,
  Lightbulb,
  Target,
  Shield,
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

interface Opinion {
  id: number;
  user: string;
  avatar: string;
  content: string;
  votes: number;
}

interface Comment {
  id: number;
  user: string;
  avatar: string;
  content: string;
  logic: number;
  empathy: number;
  evidence: number;
  replies: Array<{
    id: number;
    user: string;
    avatar: string;
    content: string;
    type: "반론" | "뒷받침" | "근거";
    logic: number;
    empathy: number;
    evidence: number;
  }>;
}

const PostDetail = () => {
  const { id } = useParams();
  const [openPerspectives, setOpenPerspectives] = useState<string[]>(["progressive"]);
  const [opinions, setOpinions] = useState<Opinion[]>([
    {
      id: 1,
      user: "민주시민",
      avatar: "",
      content: "이 사안은 방송의 독립성과 관련된 중요한 문제입니다. 양측의 주장을 모두 들어볼 필요가 있다고 생각합니다.",
      votes: 142
    },
    {
      id: 2,
      user: "정책전문가",
      avatar: "",
      content: "법적 절차를 투명하게 진행하는 것이 가장 중요합니다. 정치적 해석보다는 법리적 판단이 우선되어야 합니다.",
      votes: 89
    },
    {
      id: 3,
      user: "일반시민",
      avatar: "",
      content: "복잡한 문제지만 국민의 알 권리가 보장되는 방향으로 해결되길 바랍니다.",
      votes: 56
    }
  ]);

  const [pollVotes, setPollVotes] = useState({
    support: 342,
    oppose: 289,
    neutral: 156
  });

  const [userVote, setUserVote] = useState<"support" | "oppose" | "neutral" | null>(null);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: "김정치",
      avatar: "",
      content: "이 사안은 단순히 개인의 문제가 아니라 방송 독립성 전체와 관련된 구조적 문제입니다. 역사적으로 방송 장악 시도는 민주주의를 후퇴시켰습니다.",
      logic: 45,
      empathy: 32,
      evidence: 38,
      replies: [
        {
          id: 101,
          user: "박민주",
          avatar: "",
          content: "동의합니다. 과거 사례를 보면 방송 독립성이 침해될 때마다 언론의 자유가 위축되었죠.",
          type: "뒷받침",
          logic: 12,
          empathy: 8,
          evidence: 15
        },
        {
          id: 102,
          user: "최보수",
          avatar: "",
          content: "하지만 현재 상황은 과거와 다릅니다. 법적 절차를 따르는 것과 방송 장악은 별개 문제입니다.",
          type: "반론",
          logic: 18,
          empathy: 5,
          evidence: 10
        }
      ]
    },
    {
      id: 2,
      user: "이중립",
      avatar: "",
      content: "양측 모두 감정적 대응보다는 객관적 증거에 기반한 논의가 필요합니다. 법원의 판단을 기다려야 합니다.",
      logic: 38,
      empathy: 28,
      evidence: 31,
      replies: []
    }
  ]);

  const togglePerspective = (stance: string) => {
    setOpenPerspectives((prev) =>
      prev.includes(stance) ? prev.filter((s) => s !== stance) : [...prev, stance]
    );
  };

  const handleVote = (opinionId: number) => {
    setOpinions(prev => 
      prev.map(opinion => 
        opinion.id === opinionId 
          ? { ...opinion, votes: opinion.votes + 1 }
          : opinion
      ).sort((a, b) => b.votes - a.votes)
    );
  };

  const handlePollVote = (option: "support" | "oppose" | "neutral") => {
    if (userVote) return; // 이미 투표함
    setPollVotes(prev => ({
      ...prev,
      [option]: prev[option] + 1
    }));
    setUserVote(option);
  };

  const totalPollVotes = pollVotes.support + pollVotes.oppose + pollVotes.neutral;
  const supportPercent = ((pollVotes.support / totalPollVotes) * 100).toFixed(1);
  const opposePercent = ((pollVotes.oppose / totalPollVotes) * 100).toFixed(1);
  const neutralPercent = ((pollVotes.neutral / totalPollVotes) * 100).toFixed(1);

  const handleCommentReaction = (commentId: number, type: "logic" | "empathy" | "evidence") => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, [type]: comment[type] + 1 }
          : comment
      )
    );
  };

  const handleReplyReaction = (commentId: number, replyId: number, type: "logic" | "empathy" | "evidence") => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, [type]: reply[type] + 1 }
                  : reply
              )
            }
          : comment
      )
    );
  };

  const sortedOpinions = [...opinions].sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <article className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Badge className="mb-4">데모스 공식</Badge>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-foreground">
              이진숙 체포적부심사에 대한 논쟁
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

          <Card className="mb-8 border-none bg-card shadow-sm rounded-2xl">
            <div className="p-6">
              <h2 className="mb-3 text-xl font-bold text-foreground">📋 핵심 요약</h2>
              <p className="leading-relaxed text-foreground">
                방송통신위원회 이진숙 위원장 후보자에 대한 체포적부심사가 오늘 오후 진행됩니다.
                이번 사건은 방송 장악 의혹과 대통령의 예능 프로그램 출연을 둘러싼
                정치적 논란이 맞물려 있습니다. 진보와 보수 진영은 각각 다른 관점에서
                이 사안을 바라보고 있으며, 향후 방송 정책에 미칠 영향이 주목됩니다.
              </p>
            </div>
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
                  <Card className="overflow-hidden border-none bg-card shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStanceColor(perspective.stance)} rounded-full px-4 py-1`}>
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
                        <p className="mb-4 text-foreground leading-relaxed">{perspective.summary}</p>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground">대표 기사</h4>
                          {perspective.articles.map((article, idx) => (
                            <a
                              key={idx}
                              href={article.url}
                              className="flex items-center justify-between rounded-xl border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:shadow-sm"
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

          <Card className="mb-8 border-none bg-gradient-hero shadow-md rounded-2xl">
            <div className="p-6">
              <div className="flex items-start gap-3 text-white">
                <Calculator className="h-6 w-6 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold">영향 계산기</h3>
                  <p className="mb-4 opacity-90">
                    이 정책이 당신에게 미칠 영향을 확인해보세요
                  </p>
                  <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 rounded-full">
                    영향 계산하기
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Separator className="my-8" />

          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-bold text-foreground">📊 투표하기</h2>
            <Card className="border-none bg-card shadow-sm rounded-2xl overflow-hidden">
              <div className="p-6">
                <p className="mb-6 text-lg text-foreground">이 사안에 대한 당신의 입장은?</p>
                <div className="grid gap-3 mb-6">
                  <button
                    onClick={() => handlePollVote("support")}
                    disabled={userVote !== null}
                    className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
                      userVote === "support"
                        ? "border-demos-blue bg-demos-blue/10"
                        : userVote
                        ? "border-muted opacity-50"
                        : "border-muted hover:border-demos-blue hover:bg-demos-blue/5"
                    } ${userVote ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="relative z-10">
                      <p className="font-semibold text-foreground">찬성</p>
                      {userVote && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {pollVotes.support}표 ({supportPercent}%)
                        </p>
                      )}
                    </div>
                    {userVote && (
                      <div
                        className="absolute left-0 top-0 h-full bg-demos-blue/20 transition-all"
                        style={{ width: `${supportPercent}%` }}
                      />
                    )}
                  </button>

                  <button
                    onClick={() => handlePollVote("oppose")}
                    disabled={userVote !== null}
                    className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
                      userVote === "oppose"
                        ? "border-demos-red bg-demos-red/10"
                        : userVote
                        ? "border-muted opacity-50"
                        : "border-muted hover:border-demos-red hover:bg-demos-red/5"
                    } ${userVote ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="relative z-10">
                      <p className="font-semibold text-foreground">반대</p>
                      {userVote && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {pollVotes.oppose}표 ({opposePercent}%)
                        </p>
                      )}
                    </div>
                    {userVote && (
                      <div
                        className="absolute left-0 top-0 h-full bg-demos-red/20 transition-all"
                        style={{ width: `${opposePercent}%` }}
                      />
                    )}
                  </button>

                  <button
                    onClick={() => handlePollVote("neutral")}
                    disabled={userVote !== null}
                    className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
                      userVote === "neutral"
                        ? "border-demos-neutral bg-demos-neutral/10"
                        : userVote
                        ? "border-muted opacity-50"
                        : "border-muted hover:border-demos-neutral hover:bg-demos-neutral/5"
                    } ${userVote ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="relative z-10">
                      <p className="font-semibold text-foreground">중립</p>
                      {userVote && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {pollVotes.neutral}표 ({neutralPercent}%)
                        </p>
                      )}
                    </div>
                    {userVote && (
                      <div
                        className="absolute left-0 top-0 h-full bg-demos-neutral/20 transition-all"
                        style={{ width: `${neutralPercent}%` }}
                      />
                    )}
                  </button>
                </div>
                {userVote && (
                  <p className="text-sm text-muted-foreground text-center">
                    총 {totalPollVotes}명이 투표했습니다
                  </p>
                )}
              </div>
            </Card>
          </div>

          <Separator className="my-8" />

          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-bold text-foreground">💡 대표 의견</h2>
            <div className="space-y-3">
              {sortedOpinions.map((opinion) => (
                <Card key={opinion.id} className="overflow-hidden border-none bg-card shadow-sm hover:shadow-md transition-shadow rounded-3xl">
                  <div className="p-5">
                    <div className="mb-4 flex items-start gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={opinion.avatar} />
                        <AvatarFallback className="bg-gradient-hero text-white font-semibold">
                          {opinion.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-[15px]">{opinion.user}</p>
                        <p className="text-foreground/90 mt-2 text-[15px] leading-relaxed">
                          {opinion.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pl-14">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleVote(opinion.id)}
                        className="group h-8 hover:bg-transparent rounded-full px-2 -ml-2"
                      >
                        <Heart className="h-[18px] w-[18px] mr-1 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                        <span className="font-medium text-sm group-hover:text-red-500 transition-colors">{opinion.votes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 hover:bg-transparent rounded-full px-2">
                        <MessageCircle className="h-[18px] w-[18px] mr-1" />
                        <span className="text-sm">답글</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="border-none bg-card shadow-sm rounded-2xl">
            <div className="p-6">
              <h3 className="mb-6 text-xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                댓글 ({comments.length})
              </h3>

              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback className="bg-gradient-hero text-white">
                          {comment.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">{comment.user}</p>
                        <p className="text-foreground/90 mt-2 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentReaction(comment.id, "logic")}
                            className="h-7 rounded-full px-2 hover:bg-blue-500/10"
                          >
                            <Lightbulb className="h-4 w-4 mr-1 text-blue-500" />
                            <span className="text-xs">논리 {comment.logic}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentReaction(comment.id, "empathy")}
                            className="h-7 rounded-full px-2 hover:bg-pink-500/10"
                          >
                            <Heart className="h-4 w-4 mr-1 text-pink-500" />
                            <span className="text-xs">공감 {comment.empathy}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentReaction(comment.id, "evidence")}
                            className="h-7 rounded-full px-2 hover:bg-green-500/10"
                          >
                            <Shield className="h-4 w-4 mr-1 text-green-500" />
                            <span className="text-xs">근거 {comment.evidence}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 rounded-full px-2 ml-2">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">답글</span>
                          </Button>
                        </div>

                        {comment.replies.length > 0 && (
                          <div className="mt-4 space-y-3 pl-4 border-l-2 border-muted">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={reply.avatar} />
                                  <AvatarFallback className="bg-gradient-hero text-white text-xs">
                                    {reply.user.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-foreground text-sm">{reply.user}</p>
                                    <Badge
                                      className={`text-xs px-2 py-0 ${
                                        reply.type === "반론"
                                          ? "bg-red-500/20 text-red-500 border-red-500/30"
                                          : reply.type === "뒷받침"
                                          ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                                          : "bg-green-500/20 text-green-500 border-green-500/30"
                                      }`}
                                    >
                                      {reply.type}
                                    </Badge>
                                  </div>
                                  <p className="text-foreground/90 mt-1 text-sm leading-relaxed">
                                    {reply.content}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReplyReaction(comment.id, reply.id, "logic")}
                                      className="h-6 rounded-full px-2 hover:bg-blue-500/10"
                                    >
                                      <Lightbulb className="h-3 w-3 mr-1 text-blue-500" />
                                      <span className="text-xs">{reply.logic}</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReplyReaction(comment.id, reply.id, "empathy")}
                                      className="h-6 rounded-full px-2 hover:bg-pink-500/10"
                                    >
                                      <Heart className="h-3 w-3 mr-1 text-pink-500" />
                                      <span className="text-xs">{reply.empathy}</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReplyReaction(comment.id, reply.id, "evidence")}
                                      className="h-6 rounded-full px-2 hover:bg-green-500/10"
                                    >
                                      <Shield className="h-3 w-3 mr-1 text-green-500" />
                                      <span className="text-xs">{reply.evidence}</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-hero text-white">
                    나
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    className="w-full resize-none rounded-2xl border bg-muted/30 p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    rows={3}
                    placeholder="의견을 남겨주세요..."
                  />
                  <div className="mt-3 flex justify-end">
                    <Button className="rounded-full">댓글 작성</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </article>
      </main>
    </div>
  );
};

export default PostDetail;
