import { useParams, useNavigate } from "react-router-dom";
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
import { useState, useEffect } from "react";
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
  Smile,
  Frown,
  User,
  Sparkles,
  Send,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Post {
  id: number;
  title: string;
  summary: string;
  category: string;
  timestamp: string;
  commentCount: number;
  views: number;
  isOfficial: boolean;
  type: "user" | "official";
  attachments?: {
    poll?: {
      question: string;
      options: Array<{
        text: string;
        votes: number;
      }>;
      totalVotes: number;
    };
  };
}

const mockPosts: Post[] = [
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
    attachments: {
      poll: {
        question: "이 사안에 대한 당신의 입장은?",
        options: [
          { text: "긍정적", votes: 523 },
          { text: "부정적", votes: 412 }
        ],
        totalVotes: 935
      }
    }
  },
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
    attachments: {
      poll: {
        question: "의대 증원 정책, 지역 의료가 개선될까요?",
        options: [
          { text: "개선된다", votes: 1823 },
          { text: "악화된다", votes: 3421 }
        ],
        totalVotes: 5244
      }
    }
  },
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
    attachments: {
      poll: {
        question: "여론조사 결과를 신뢰하시나요?",
        options: [
          { text: "신뢰한다", votes: 487 },
          { text: "신뢰하지 않는다", votes: 2341 }
        ],
        totalVotes: 2828
      }
    }
  }
];

interface ExpertOpinion {
  name: string;
  role: string;
  opinion: string;
  source: string;
  url: string;
}

const mockExpertOpinions: ExpertOpinion[] = [
  {
    name: "김영수",
    role: "미디어 법률 전문가",
    opinion: "방송 독립성은 민주주의의 핵심입니다. 이번 사안은 단순한 개인 문제가 아니라 제도적 문제로 접근해야 합니다.",
    source: "JTBC 뉴스룸",
    url: "#"
  },
  {
    name: "이민호",
    role: "정치 평론가",
    opinion: "정치적 중립성을 지키는 것이 무엇보다 중요합니다. 양측의 주장을 면밀히 검토해야 합니다.",
    source: "MBC 100분토론",
    url: "#"
  },
  {
    name: "박지연",
    role: "시사 유튜버 (구독자 120만)",
    opinion: "국민의 알 권리와 방송의 자유는 보장되어야 합니다. 이는 우리 모두의 문제입니다.",
    source: "YouTube @박지연의정치이야기",
    url: "#"
  },
  {
    name: "최태영",
    role: "전 국회의원",
    opinion: "법적 절차를 존중하되, 정치적 맥락을 무시할 수 없습니다. 신중한 접근이 필요합니다.",
    source: "조선일보 칼럼",
    url: "#"
  },
  {
    name: "정수민",
    role: "언론학 교수",
    opinion: "역사적으로 방송 장악 시도는 언론 자유를 심각하게 훼손했습니다. 경계가 필요합니다.",
    source: "한겨레 기고문",
    url: "#"
  },
  {
    name: "강민수",
    role: "방송인",
    opinion: "현장에서 일하는 사람으로서 방송 독립성은 절대 타협할 수 없는 가치입니다.",
    source: "KBS 시사기획창",
    url: "#"
  }
];

interface Comment {
  id: number;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  replies: Array<{
    id: number;
    user: string;
    avatar: string;
    content: string;
    type: "반론" | "뒷받침" | "근거";
    likes: number;
  }>;
}

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAllOpinions, setShowAllOpinions] = useState(false);
  const [showImpactCalculator, setShowImpactCalculator] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const currentPost = mockPosts.find(post => post.id === Number(id));
  
  useEffect(() => {
    if (!currentPost) {
      navigate("/");
    }
  }, [currentPost, navigate]);

  if (!currentPost) {
    return null;
  }

  const isUserPost = currentPost.type === "user";
  
  // Mock user data (로그인되어 있다고 가정)
  const mockUser = {
    age: 28,
    gender: "여성",
    occupation: "방송PD",
    region: "서울"
  };

  const [pollVotes, setPollVotes] = useState({
    positive: currentPost.attachments?.poll?.options[0]?.votes || 523,
    negative: currentPost.attachments?.poll?.options[1]?.votes || 412
  });

  const [userVote, setUserVote] = useState<"positive" | "negative" | null>(null);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: "김정치",
      avatar: "",
      content: "이 사안은 단순히 개인의 문제가 아니라 방송 독립성 전체와 관련된 구조적 문제입니다. 역사적으로 방송 장악 시도는 민주주의를 후퇴시켰습니다.",
      likes: 1247,
      replies: [
        {
          id: 101,
          user: "박민주",
          avatar: "",
          content: "동의합니다. 과거 사례를 보면 방송 독립성이 침해될 때마다 언론의 자유가 위축되었죠.",
          type: "뒷받침",
          likes: 234
        },
        {
          id: 102,
          user: "최보수",
          avatar: "",
          content: "하지만 현재 상황은 과거와 다릅니다. 법적 절차를 따르는 것과 방송 장악은 별개 문제입니다.",
          type: "반론",
          likes: 156
        }
      ]
    },
    {
      id: 2,
      user: "이중립",
      avatar: "",
      content: "양측 모두 감정적 대응보다는 객관적 증거에 기반한 논의가 필요합니다. 법원의 판단을 기다려야 합니다.",
      likes: 892,
      replies: []
    },
    {
      id: 3,
      user: "정책전문가",
      avatar: "",
      content: "법적 절차를 투명하게 진행하는 것이 가장 중요합니다. 정치적 해석보다는 법리적 판단이 우선되어야 합니다.",
      likes: 534,
      replies: [
        {
          id: 103,
          user: "미디어연구자",
          avatar: "",
          content: "통계와 연구 결과에 따르면 방송 독립성은 민주주의 지수와 직접적인 상관관계가 있습니다.",
          type: "근거",
          likes: 421
        }
      ]
    }
  ]);

  const handlePollVote = (option: "positive" | "negative") => {
    if (userVote) return; // 이미 투표함
    setPollVotes(prev => ({
      ...prev,
      [option]: prev[option] + 1
    }));
    setUserVote(option);
  };

  const totalPollVotes = pollVotes.positive + pollVotes.negative;
  const positivePercent = ((pollVotes.positive / totalPollVotes) * 100).toFixed(1);
  const negativePercent = ((pollVotes.negative / totalPollVotes) * 100).toFixed(1);

  const displayedOpinions = showAllOpinions ? mockExpertOpinions : mockExpertOpinions.slice(0, 3);

  const handleCommentLike = (commentId: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const handleReplyLike = (commentId: number, replyId: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              )
            }
          : comment
      )
    );
  };

  // 댓글을 좋아요 순으로 정렬
  const sortedComments = [...comments].sort((a, b) => b.likes - a.likes);

  const topComment = sortedComments[0]; // 대표의견

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: Date.now(),
      user: "나",
      avatar: "",
      content: newComment,
      likes: 0,
      replies: []
    };
    
    setComments(prev => [newCommentObj, ...prev]);
    setNewComment("");
  };

  const handleAddReply = (commentId: number) => {
    if (!replyContent.trim()) return;
    
    const newReply = {
      id: Date.now(),
      user: "나",
      avatar: "",
      content: replyContent,
      type: "뒷받침" as const,
      likes: 0
    };
    
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    );
    setReplyContent("");
    setReplyTo(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <article className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Badge className="mb-4">{isUserPost ? "일반 사용자" : "데모스 공식"}</Badge>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-foreground">
              {currentPost.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{currentPost.timestamp}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>{currentPost.views.toLocaleString()}회 조회</span>
              </div>
            </div>
          </div>

          <Card className="mb-8 border-none bg-card shadow-sm rounded-2xl">
            <div className="p-6">
              <h2 className="mb-3 text-xl font-bold text-foreground">📋 {isUserPost ? "내용" : "핵심 요약"}</h2>
              <p className="leading-relaxed text-foreground">
                {currentPost.summary}
              </p>
            </div>
          </Card>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                다양한 관점의 목소리
              </h2>
            </div>
            <div className="space-y-3">
              {displayedOpinions.map((expert, idx) => (
                <Card key={idx} className="border-none bg-card shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-foreground text-[15px]">{expert.name}</h4>
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0">
                            {expert.role}
                          </Badge>
                        </div>
                        <p className="text-foreground/90 text-[14px] leading-relaxed mb-3">
                          "{expert.opinion}"
                        </p>
                        <a 
                          href={expert.url}
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group"
                        >
                          <span>{expert.source}</span>
                          <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {mockExpertOpinions.length > 3 && (
                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => setShowAllOpinions(!showAllOpinions)}
                >
                  {showAllOpinions ? "접기" : `더보기 (${mockExpertOpinions.length - 3}개 더)`}
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAllOpinions ? "rotate-180" : ""}`} />
                </Button>
              )}
            </div>
          </div>

          <Card className="mb-8 border border-border bg-card shadow-sm rounded-3xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">정책 영향 계산기</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    이 정책이 나에게 미치는 영향을 확인해보세요
                  </p>
                </div>
              </div>
              
              {!showImpactCalculator ? (
                <Button
                  onClick={() => setShowImpactCalculator(true)}
                  className="w-full rounded-xl h-12 text-base"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  영향 계산해보기
                </Button>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-muted/30 rounded-xl">
                    <p className="text-sm text-muted-foreground">
                      {mockUser.age}세 · {mockUser.gender} · {mockUser.occupation} · {mockUser.region}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                          <span className="text-red-500 font-bold text-lg">!</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-foreground">직접 영향도</h4>
                            <Badge className="bg-red-500 text-white">매우 높음</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            방송PD로서 방송통신위원회의 정책 결정은 업무 환경과 편집 독립성에 직접적인 영향을 미칩니다.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">편집 자율성</span>
                              <span className="font-semibold text-red-500">-35%</span>
                            </div>
                            <div className="h-2 bg-background rounded-full overflow-hidden">
                              <div className="h-full bg-red-500 w-[35%]"></div>
                            </div>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">콘텐츠 검열 가능성</span>
                              <span className="font-semibold text-red-500">+42%</span>
                            </div>
                            <div className="h-2 bg-background rounded-full overflow-hidden">
                              <div className="h-full bg-red-500 w-[42%]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <span className="text-yellow-500 font-bold text-lg">!</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-foreground">간접 영향도</h4>
                            <Badge className="bg-yellow-500 text-white">중간</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            서울 거주 20대 여성으로서 미디어 접근성과 정보의 다양성에 영향을 받을 수 있습니다.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">정보 다양성</span>
                              <span className="font-semibold text-yellow-500">-18%</span>
                            </div>
                            <div className="h-2 bg-background rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-500 w-[18%]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-500 font-bold text-lg">i</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground mb-2">장기적 영향</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            향후 5년간 미디어 산업 전반의 구조 변화가 예상됩니다. 
                            방송 제작 환경과 콘텐츠 규제 기준이 재편될 가능성이 높습니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Separator className="my-8" />

          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-bold text-foreground">📊 투표하기</h2>
            <Card className="border-none bg-card shadow-sm rounded-2xl overflow-hidden">
              <div className="p-6">
                <p className="mb-6 text-lg text-foreground">이 사안에 대한 당신의 입장은?</p>
                <div className="flex gap-0 rounded-full overflow-hidden h-16 border-2 border-border mb-4">
                  <button
                    onClick={() => handlePollVote("positive")}
                    disabled={userVote !== null}
                    className={`flex-1 flex items-center justify-center gap-2 font-bold transition-all ${
                      userVote === "positive" 
                        ? "bg-[hsl(var(--demos-positive))] text-white" 
                        : "bg-card hover:bg-secondary text-foreground"
                    } ${userVote ? "cursor-not-allowed" : "cursor-pointer"}`}
                    style={
                      userVote !== null 
                        ? { width: `${positivePercent}%` }
                        : undefined
                    }
                  >
                    <span className="text-2xl">😊</span>
                    <div className="flex flex-col items-center">
                      <span className="text-base">긍정적</span>
                      {userVote && (
                        <span className="text-sm opacity-90">{positivePercent}%</span>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => handlePollVote("negative")}
                    disabled={userVote !== null}
                    className={`flex-1 flex items-center justify-center gap-2 font-bold transition-all ${
                      userVote === "negative" 
                        ? "bg-[hsl(var(--demos-negative))] text-white" 
                        : "bg-card hover:bg-secondary text-foreground"
                    } ${userVote ? "cursor-not-allowed" : "cursor-pointer"}`}
                    style={
                      userVote !== null 
                        ? { width: `${negativePercent}%` }
                        : undefined
                    }
                  >
                    <span className="text-2xl">😞</span>
                    <div className="flex flex-col items-center">
                      <span className="text-base">부정적</span>
                      {userVote && (
                        <span className="text-sm opacity-90">{negativePercent}%</span>
                      )}
                    </div>
                  </button>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-3">
                  총 {totalPollVotes.toLocaleString()}명이 투표했습니다
                </p>
              </div>
            </Card>
          </div>

          <Separator className="my-8" />

          <Card className="border-none bg-card shadow-sm rounded-3xl">
            <div className="p-6">
              <h3 className="mb-6 text-xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {isUserPost ? "스레드" : "의견"} ({comments.length})
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
                          {!isUserPost && comment.id === topComment.id && (
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-2 py-0">
                              대표의견
                            </Badge>
                          )}
                        </div>
                        <p className="text-foreground/90 mt-2 text-[15px] leading-relaxed">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentLike(comment.id)}
                            className="h-8 rounded-full px-3 hover:bg-muted/50 group -ml-2"
                          >
                            <Heart className="h-[17px] w-[17px] mr-1.5 text-muted-foreground group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                            <span className="text-[13px] text-muted-foreground group-hover:text-red-500 transition-colors font-medium">{comment.likes.toLocaleString()}</span>
                          </Button>
                          {isUserPost && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 rounded-full px-3 hover:bg-muted/50 group"
                              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                            >
                              <MessageCircle className="h-[17px] w-[17px] mr-1.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                              <span className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors">답글</span>
                            </Button>
                          )}
                        </div>

                        {replyTo === comment.id && isUserPost && (
                          <div className="mt-4 ml-8 flex gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-gradient-hero text-white text-xs font-semibold">
                                나
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="resize-none rounded-xl text-sm"
                                rows={2}
                                placeholder="답글을 입력하세요..."
                              />
                              <div className="mt-2 flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="rounded-full"
                                  onClick={() => {
                                    setReplyTo(null);
                                    setReplyContent("");
                                  }}
                                >
                                  취소
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="rounded-full"
                                  onClick={() => handleAddReply(comment.id)}
                                  disabled={!replyContent.trim()}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  작성
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

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
                                    {!isUserPost && (
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
                                    )}
                                  </div>
                                   <p className="text-foreground/90 mt-1.5 text-[14px] leading-relaxed">
                                    {reply.content}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2.5">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReplyLike(comment.id, reply.id)}
                                      className="h-7 rounded-full px-2.5 hover:bg-muted/50 group -ml-2"
                                    >
                                      <Heart className="h-[15px] w-[15px] mr-1 text-muted-foreground group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                                      <span className="text-[12px] text-muted-foreground group-hover:text-red-500 transition-colors">{reply.likes.toLocaleString()}</span>
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
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none rounded-2xl"
                    rows={3}
                    placeholder={isUserPost ? "스레드에 참여하세요..." : "의견을 남겨주세요..."}
                  />
                  <div className="mt-3 flex justify-end">
                    <Button 
                      className="rounded-full px-6"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isUserPost ? "스레드 작성" : "의견 작성"}
                    </Button>
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
