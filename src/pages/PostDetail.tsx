import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ThumbsUp,
  MessageCircle,
  Eye,
  Send,
  ChevronLeft,
  ChevronDown,
  Lightbulb,
  Target,
  Shield,
  Smile,
  Frown,
  TrendingUp,
  Calculator,
  FileText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Post {
  id: string;
  title?: string;
  content: string;
  category: string;
  created_at: string;
  views: number;
  is_official: boolean;
  likes: number;
  type: "user" | "official";
  user_id?: string;
}

interface PollOption {
  id: string;
  option_text: string;
  votes: number;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  likes: number;
  user_id?: string;
  parent_comment_id?: string;
  replies?: Comment[];
}

interface ExpertOpinion {
  id: string;
  name: string;
  affiliation: string;
  stance: "긍정적" | "부정적" | "중립";
  opinion: string;
  highlight: string;
}

// 샘플 전문가 의견 데이터
const mockExpertOpinions: ExpertOpinion[] = [
  {
    id: "1",
    name: "김정치",
    affiliation: "한국정치학회 교수",
    stance: "긍정적",
    opinion: "이번 정책은 장기적인 관점에서 볼 때 긍정적인 효과를 가져올 것으로 예상됩니다. 특히 젊은 세대의 참여를 독려하는 측면에서 의미가 있습니다.",
    highlight: "젊은 세대의 정치 참여 증가 기대"
  },
  {
    id: "2",
    name: "이경제",
    affiliation: "경제연구소 선임연구원",
    stance: "부정적",
    opinion: "경제적 측면에서 볼 때 예산 낭비의 우려가 있습니다. 실효성 있는 정책 집행을 위한 구체적인 로드맵이 부족합니다.",
    highlight: "예산 효율성 문제 제기"
  },
  {
    id: "3",
    name: "박사회",
    affiliation: "사회복지학과 교수",
    stance: "중립",
    opinion: "정책의 취지는 좋으나 실행 과정에서 발생할 수 있는 부작용에 대한 대비가 필요합니다. 단계적 접근이 바람직합니다.",
    highlight: "단계적 접근 필요성 강조"
  }
];

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showExperts, setShowExperts] = useState(false);
  const [topComments, setTopComments] = useState<Comment[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (id) {
      fetchPostDetail();
    }
  }, [id]);

  const fetchPostDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // 게시물 정보 가져오기
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (postError) throw postError;
      setPost(postData as Post);

      // 조회수 증가
      await supabase
        .from('posts')
        .update({ views: (postData.views || 0) + 1 })
        .eq('id', id);

      // 투표 옵션 가져오기
      const { data: pollData, error: pollError } = await supabase
        .from('poll_options')
        .select('*')
        .eq('post_id', id);

      if (!pollError && pollData) {
        setPollOptions(pollData);
      }

      // 댓글 가져오기
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (!commentsError && commentsData) {
        // 각 댓글의 답글 가져오기
        const commentsWithReplies = await Promise.all(
          commentsData.map(async (comment) => {
            const { data: replies } = await supabase
              .from('comments')
              .select('*')
              .eq('parent_comment_id', comment.id)
              .order('created_at', { ascending: true });

            return {
              ...comment,
              replies: replies || [],
            };
          })
        );
        setComments(commentsWithReplies);
        
        // 대표 의견 (좋아요 많은 순 3개)
        const sortedComments = [...commentsWithReplies].sort((a, b) => b.likes - a.likes);
        setTopComments(sortedComments.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('게시물을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (optionId: string) => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    try {
      const option = pollOptions.find(opt => opt.id === optionId);
      if (!option) return;

      const { error } = await supabase
        .from('poll_options')
        .update({ votes: option.votes + 1 })
        .eq('id', optionId);

      if (error) throw error;

      setSelectedVote(optionId);
      setPollOptions(pollOptions.map(opt =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      ));
      toast.success('투표가 완료되었습니다');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('투표에 실패했습니다');
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    if (!newComment.trim()) {
      toast.error('댓글 내용을 입력해주세요');
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: id,
          content: newComment,
          user_id: user.id,
        });

      if (error) throw error;

      setNewComment('');
      toast.success('댓글이 작성되었습니다');
      fetchPostDetail();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('댓글 작성에 실패했습니다');
    }
  };

  const handleAddReply = async (parentCommentId: string) => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('답글 내용을 입력해주세요');
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: id,
          content: replyContent,
          user_id: user.id,
          parent_comment_id: parentCommentId,
        });

      if (error) throw error;

      setReplyContent('');
      setReplyingTo(null);
      toast.success('답글이 작성되었습니다');
      fetchPostDetail();
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('답글 작성에 실패했습니다');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    try {
      const comment = comments.find(c => c.id === commentId) || 
                      comments.flatMap(c => c.replies || []).find(r => r.id === commentId);
      
      if (!comment) return;

      const { error } = await supabase
        .from('comments')
        .update({ likes: comment.likes + 1 })
        .eq('id', commentId);

      if (error) throw error;

      fetchPostDetail();
      toast.success('좋아요를 눌렀습니다');
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('좋아요에 실패했습니다');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  const getStanceIcon = (stance: string) => {
    switch (stance) {
      case "긍정적":
        return <Smile className="h-4 w-4 text-green-500" />;
      case "부정적":
        return <Frown className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStanceColor = (stance: string) => {
    switch (stance) {
      case "긍정적":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
      case "부정적":
        return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
      default:
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 text-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 text-center">
          <p className="text-muted-foreground">게시물을 찾을 수 없습니다</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const totalVotes = pollOptions.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          목록으로
        </Button>

        {/* DEMOS 제목 섹션 */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">
            DEMOS
          </h1>
          <p className="text-muted-foreground text-sm">
            다양한 관점으로 바라보는 민주주의 플랫폼
          </p>
        </div>

        {/* 게시물 헤더 */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {post.is_official && (
                  <Badge variant="default" className="bg-primary">
                    공식
                  </Badge>
                )}
                <Badge variant="outline">{post.category}</Badge>
              </div>
              <h2 className="text-2xl font-bold mb-2">{post.title || '제목 없음'}</h2>
              <p className="text-muted-foreground text-sm">
                {getTimeAgo(post.created_at)}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* 핵심 요약 섹션 */}
          {post.is_official && (
            <div className="bg-muted/50 p-4 rounded-lg mb-6 border-l-4 border-primary">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">핵심 요약</h3>
                  <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
                </div>
              </div>
            </div>
          )}

          {/* 게시물 내용 (일반 게시물인 경우만) */}
          {!post.is_official && (
            <div className="prose max-w-none mb-6">
              <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
            </div>
          )}

          {/* 통계 */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{comments.length}</span>
            </div>
          </div>
        </Card>

        {/* 다양한 관점의 목소리 */}
        {post.is_official && (
          <Card className="p-6 mb-6">
            <Collapsible open={showExperts} onOpenChange={setShowExperts}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold">다양한 관점의 목소리</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${showExperts ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-4">
                  {mockExpertOpinions.map((expert) => (
                    <Card key={expert.id} className={`p-4 border ${getStanceColor(expert.stance)}`}>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{expert.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{expert.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {expert.stance === "긍정적" ? "찬성 입장" : expert.stance === "부정적" ? "반대 입장" : "중립 입장"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{expert.affiliation}</p>
                          <p className="text-sm mb-2">{expert.opinion}</p>
                          <div className="text-xs text-muted-foreground">핵심: {expert.highlight}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* 정책 영향 계산기 */}
        {post.is_official && (
          <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <Calculator className="h-6 w-6 text-primary flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">정책 영향 계산기</h3>
                <p className="text-sm text-muted-foreground">
                  이 정책이 나에게 미치는 영향을 확인해보세요
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowCalculator(!showCalculator)}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Calculator className="h-4 w-4 mr-2" />
              오랜 계산하기
            </Button>
            {showCalculator && (
              <div className="mt-4 p-4 bg-background rounded-lg border">
                <p className="text-sm text-muted-foreground text-center">
                  계산기 기능은 준비 중입니다
                </p>
              </div>
            )}
          </Card>
        )}

        {/* 투표 섹션 */}
        {pollOptions.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              투표하기
            </h3>
            <div className="space-y-3">
              {pollOptions.map((option) => {
                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                const isSelected = selectedVote === option.id;

                return (
                  <Button
                    key={option.id}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleVote(option.id)}
                    disabled={!!selectedVote}
                    className="w-full h-auto p-4 relative overflow-hidden"
                  >
                    <div
                      className="absolute left-0 top-0 h-full bg-primary/10 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="relative flex items-center justify-between w-full">
                      <span className="font-medium">{option.option_text}</span>
                      <span className="text-sm">
                        {option.votes.toLocaleString()}표 ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </Button>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              총 {totalVotes.toLocaleString()}명 참여
            </p>
          </Card>
        )}

        {/* 의견 섹션 제목 */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            의견 ({comments.length})
          </h3>
        </Card>

        {/* 대표 의견 섹션 */}
        {topComments.length > 0 && (
          <div className="mb-6">
            <div className="space-y-4">
              {topComments.map((comment, index) => {
                // 샘플 정치 성향 배지 (실제로는 사용자 프로필에서 가져와야 함)
                const stances = ["진보적", "보수적", "중도"];
                const stance = stances[index % 3];
                
                return (
                  <Card key={comment.id} className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>익{index + 1}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">익명{index + 1}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              stance === "진보적" ? "border-blue-500 text-blue-500" : 
                              stance === "보수적" ? "border-red-500 text-red-500" : 
                              "border-yellow-500 text-yellow-500"
                            }`}
                          >
                            {stance}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{comment.content}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <button 
                            onClick={() => handleLikeComment(comment.id)}
                            className="hover:text-foreground flex items-center gap-1"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="hover:text-foreground flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            답글
                          </button>
                        </div>
                        
                        {/* 답글 표시 */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 space-y-3">
                            {comment.replies.map((reply, replyIndex) => {
                              const replyStance = stances[(index + replyIndex + 1) % 3];
                              return (
                                <div key={reply.id} className="flex gap-3 ml-8">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>답{replyIndex + 1}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-semibold">익명</span>
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${
                                          replyStance === "진보적" ? "border-blue-500 text-blue-500" : 
                                          replyStance === "보수적" ? "border-red-500 text-red-500" : 
                                          "border-yellow-500 text-yellow-500"
                                        }`}
                                      >
                                        {replyStance}
                                      </Badge>
                                    </div>
                                    <p className="text-sm">{reply.content}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                      <button 
                                        onClick={() => handleLikeComment(reply.id)}
                                        className="hover:text-foreground flex items-center gap-1"
                                      >
                                        <ThumbsUp className="h-3 w-3" />
                                        <span>{reply.likes}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* 전체 댓글 섹션 */}
        {/* 댓글 작성 섹션 */}
        <Card className="p-6">
          <div className="mb-6 flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={user ? "의견을 남겨주세요" : "로그인 후 댓글을 작성할 수 있습니다"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!user}
                className="mb-2 bg-muted border-0"
                rows={1}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  disabled={!user || !newComment.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  의견 작성
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PostDetail;
