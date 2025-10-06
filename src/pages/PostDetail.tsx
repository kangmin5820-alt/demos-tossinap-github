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
  
  // Mock user data (로그인되어 있다고 가정)
  const mockUser = {
    age: 28,
    gender: "여성",
    occupation: "방송PD",
    region: "서울"
  };

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
    },
    {
      id: 3,
      user: "정책전문가",
      avatar: "",
      content: "법적 절차를 투명하게 진행하는 것이 가장 중요합니다. 정치적 해석보다는 법리적 판단이 우선되어야 합니다.",
      logic: 52,
      empathy: 41,
      evidence: 47,
      replies: [
        {
          id: 103,
          user: "미디어연구자",
          avatar: "",
          content: "통계와 연구 결과에 따르면 방송 독립성은 민주주의 지수와 직접적인 상관관계가 있습니다.",
          type: "근거",
          logic: 25,
          empathy: 10,
          evidence: 30
        }
      ]
    }
  ]);

  const togglePerspective = (stance: string) => {
    setOpenPerspectives((prev) =>
      prev.includes(stance) ? prev.filter((s) => s !== stance) : [...prev, stance]
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

  // 댓글을 공감 + 논리력 점수로 정렬
  const sortedComments = [...comments].sort((a, b) => {
    const scoreA = a.logic + a.empathy;
    const scoreB = b.logic + b.empathy;
    return scoreB - scoreA;
  });

  const topComment = sortedComments[0]; // 대표의견

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

          <Card className="mb-8 border border-border/50 bg-card shadow-sm rounded-3xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">나에게 미치는 영향</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mockUser.age}세 · {mockUser.gender} · {mockUser.occupation} · {mockUser.region}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 bg-muted/30 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-500 font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">직접 영향: 매우 높음</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      방송PD로서 방송통신위원회의 정책 결정은 업무 환경과 편집 독립성에 직접적인 영향을 미칩니다. 
                      방송 제작 자율성과 콘텐츠 검열 가능성이 변화할 수 있습니다.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-yellow-500 font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">간접 영향: 중간</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      서울 거주 20대 여성으로서 미디어 접근성과 정보의 다양성에 영향을 받을 수 있습니다.
                    </p>
                  </div>
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

          <Card className="border-none bg-card shadow-sm rounded-3xl">
            <div className="p-6">
              <h3 className="mb-6 text-xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                의견 ({comments.length})
              </h3>

              <div className="space-y-6 mb-6">
                {sortedComments.map((comment) => (
                  <div key={comment.id} className="pb-6 last:pb-0">
                    <div className="flex gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback className="bg-gradient-hero text-white font-semibold">
                          {comment.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground text-[15px]">{comment.user}</p>
                          {comment.id === topComment.id && (
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-2 py-0">
                              대표의견
                            </Badge>
                          )}
                        </div>
                        <p className="text-foreground/90 mt-2 text-[15px] leading-relaxed">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-1 mt-3 -ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentReaction(comment.id, "logic")}
                            className="h-8 rounded-full px-3 hover:bg-transparent group"
                          >
                            <Lightbulb className="h-[17px] w-[17px] mr-1.5 text-blue-500 group-hover:scale-110 transition-transform" />
                            <span className="text-[13px] text-muted-foreground group-hover:text-blue-500 transition-colors font-medium">{comment.logic}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentReaction(comment.id, "empathy")}
                            className="h-8 rounded-full px-3 hover:bg-transparent group"
                          >
                            <Heart className="h-[17px] w-[17px] mr-1.5 text-pink-500 group-hover:scale-110 group-hover:fill-pink-500 transition-all" />
                            <span className="text-[13px] text-muted-foreground group-hover:text-pink-500 transition-colors font-medium">{comment.empathy}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentReaction(comment.id, "evidence")}
                            className="h-8 rounded-full px-3 hover:bg-transparent group"
                          >
                            <Shield className="h-[17px] w-[17px] mr-1.5 text-green-500 group-hover:scale-110 transition-transform" />
                            <span className="text-[13px] text-muted-foreground group-hover:text-green-500 transition-colors font-medium">{comment.evidence}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 hover:bg-transparent group">
                            <MessageCircle className="h-[17px] w-[17px] mr-1.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors">답글</span>
                          </Button>
                        </div>

                        {comment.replies.length > 0 && (
                          <div className="mt-4 space-y-4 pl-3 ml-8 border-l border-border/50">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src={reply.avatar} />
                                  <AvatarFallback className="bg-gradient-hero text-white text-xs font-semibold">
                                    {reply.user.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-foreground text-[14px]">{reply.user}</p>
                                    <Badge
                                      className={`text-[11px] px-2 py-0 ${
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
                                  <p className="text-foreground/90 mt-1.5 text-[14px] leading-relaxed">
                                    {reply.content}
                                  </p>
                                  <div className="flex items-center gap-1 mt-2.5 -ml-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReplyReaction(comment.id, reply.id, "logic")}
                                      className="h-7 rounded-full px-2.5 hover:bg-transparent group"
                                    >
                                      <Lightbulb className="h-[15px] w-[15px] mr-1 text-blue-500 group-hover:scale-110 transition-transform" />
                                      <span className="text-[12px] text-muted-foreground group-hover:text-blue-500 transition-colors">{reply.logic}</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReplyReaction(comment.id, reply.id, "empathy")}
                                      className="h-7 rounded-full px-2.5 hover:bg-transparent group"
                                    >
                                      <Heart className="h-[15px] w-[15px] mr-1 text-pink-500 group-hover:scale-110 group-hover:fill-pink-500 transition-all" />
                                      <span className="text-[12px] text-muted-foreground group-hover:text-pink-500 transition-colors">{reply.empathy}</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReplyReaction(comment.id, reply.id, "evidence")}
                                      className="h-7 rounded-full px-2.5 hover:bg-transparent group"
                                    >
                                      <Shield className="h-[15px] w-[15px] mr-1 text-green-500 group-hover:scale-110 transition-transform" />
                                      <span className="text-[12px] text-muted-foreground group-hover:text-green-500 transition-colors">{reply.evidence}</span>
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

              <div className="flex gap-3 pt-2">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-gradient-hero text-white font-semibold">
                    나
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all"
                    rows={3}
                    placeholder="의견을 남겨주세요..."
                  />
                  <div className="mt-3 flex justify-end">
                    <Button className="rounded-full px-6">의견 작성</Button>
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
