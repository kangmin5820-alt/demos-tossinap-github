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
  Send,
  ChevronLeft,
} from "lucide-react";
import PolicyCalculator from "@/components/PolicyCalculator";
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
  stance: string;
  opinion: string;
}

// 샘플 전문가 의견 데이터
const mockExpertOpinions: ExpertOpinion[] = [
  {
    id: "1",
    name: "김영수",
    affiliation: "찬성적 입장 전문가",
    stance: "긍정적",
    opinion: "해당 독립운동은 민주주의의 핵심입니다. 미래 사건은 단순히 개인 문제가 아니라 제도적 문제에 관한 공론화입니다."
  },
  {
    id: "2",
    name: "이민주",
    affiliation: "반대 입장",
    stance: "부정적",
    opinion: "정치적 독점을을 가지는 것이 무엇보다 중요합니다. 정권을 구성을 안하며 권론에 합합니다."
  },
  {
    id: "3",
    name: "박지연",
    affiliation: "사회 운동가 (구술회 1989)",
    stance: "중립",
    opinion: "국익의 중 관점의 법윤의 차원는 보호되어야 하는 우리 모두의 문제입니다."
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
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (postError) throw postError;
      setPost(postData as Post);

      await supabase
        .from('posts')
        .update({ views: (postData.views || 0) + 1 })
        .eq('id', id);

      const { data: pollData, error: pollError } = await supabase
        .from('poll_options')
        .select('*')
        .eq('post_id', id);

      if (!pollError && pollData) {
        setPollOptions(pollData);
      }

      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (!commentsError && commentsData) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
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

        {/* 게시물 헤더 */}
        <div className="mb-6">
          {post.is_official && (
            <Badge className="mb-3 bg-yellow-500 hover:bg-yellow-600 text-black">데모스 공식</Badge>
          )}
          <h1 className="text-3xl font-bold mb-3">{post.title || '제목 없음'}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{formatDate(post.created_at)}</span>
            <span>•</span>
            <span>👁 {post.views.toLocaleString()}회 조회</span>
          </div>
        </div>

        {/* 핵심 요약 */}
        <Card className="p-6 mb-6 bg-muted/50 border-0">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📄</div>
            <div className="flex-1">
              <h2 className="font-semibold mb-3">핵심 요약</h2>
              <p className="text-sm leading-relaxed">{post.content}</p>
            </div>
          </div>
        </Card>

        {/* 다양한 관점의 목소리 */}
        {post.is_official && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">✨</span>
              <h2 className="font-semibold text-lg">다양한 관점의 목소리</h2>
            </div>
            
            <div className="space-y-3">
              {mockExpertOpinions.slice(0, showExperts ? mockExpertOpinions.length : 1).map((expert) => (
                <Card key={expert.id} className="p-4 bg-muted/50 border-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{expert.name}</span>
                        <Badge className="text-xs bg-yellow-500 hover:bg-yellow-500 text-black border-0">
                          {expert.affiliation}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2 leading-relaxed">{expert.opinion}</p>
                      <p className="text-xs text-muted-foreground">JTBC 뉴스룸 📺</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {!showExperts && (
              <Button 
                variant="outline" 
                className="w-full mt-3 border-border hover:bg-muted/50"
                onClick={() => setShowExperts(true)}
              >
                더보기 (2개 더) ▼
              </Button>
            )}
          </div>
        )}

        {/* 정책 영향 계산기 */}
        {post.is_official && (
          <Card className="p-6 mb-6 bg-muted/50 border-0">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-2xl">📋</div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg mb-1">정책 영향 계산기</h2>
                <p className="text-sm text-muted-foreground">
                  이 정책이 나에게 미치는 영향을 확인해보세요
                </p>
              </div>
            </div>
            <Button 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black h-12 font-medium border-0"
              onClick={() => setShowCalculator(true)}
            >
              📋 영향 계산하기
            </Button>
          </Card>
        )}

        {/* 투표하기 */}
        {pollOptions.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📊</span>
              <h2 className="font-semibold text-lg">투표하기</h2>
            </div>
            
            <Card className="p-6 bg-muted/50 border-0">
              <p className="text-sm mb-4">이 사안에 대한 당신의 입장은?</p>
              
              <div className="flex gap-3 mb-4">
                {pollOptions.map((option) => {
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                  const isSelected = selectedVote === option.id;

                  return (
                    <Button
                      key={option.id}
                      variant="outline"
                      onClick={() => handleVote(option.id)}
                      disabled={!!selectedVote}
                      className="flex-1 h-auto p-4 bg-background hover:bg-muted border-border"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">😊</span>
                        <span className="font-medium text-sm">{option.option_text}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                총 {totalVotes}명이 투표했습니다
              </p>
            </Card>
          </div>
        )}

        {/* 의견 섹션 */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">💬</span>
            <h2 className="font-semibold text-lg">의견 ({comments.length})</h2>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-4 mb-6">
            {comments.map((comment, index) => {
              const isTopComment = index === 0 && comment.likes > 100;
              const badges = [
                { text: "대표의견", color: "bg-yellow-500 hover:bg-yellow-500 text-black border-0" },
                { text: "포용적", color: "bg-blue-500 hover:bg-blue-500 text-white border-0" },
                { text: "반대", color: "bg-red-500 hover:bg-red-500 text-white border-0" }
              ];
              const badge = isTopComment ? badges[0] : badges[(index % 2) + 1];
              
              return (
                <div key={comment.id} className="space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 bg-yellow-500">
                      <AvatarFallback className="bg-yellow-500 text-black font-medium">
                        {index === 0 ? '김' : index === 1 ? '이' : '정'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm">
                          {index === 0 ? '김정치' : index === 1 ? '이준현' : '정책전문가'}
                        </span>
                        <Badge className={`text-xs ${badge.color}`}>
                          {badge.text}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3 leading-relaxed">{comment.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button 
                          onClick={() => handleLikeComment(comment.id)}
                          className="hover:text-foreground flex items-center gap-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{comment.likes.toLocaleString()}</span>
                        </button>
                        <button 
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="hover:text-foreground flex items-center gap-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>답글</span>
                        </button>
                      </div>

                      {/* 답글 작성 폼 */}
                      {replyingTo === comment.id && (
                        <div className="mt-3">
                          <Textarea
                            placeholder="답글을 입력하세요..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="mb-2 bg-muted border-0"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAddReply(comment.id)}
                              disabled={!replyContent.trim()}
                              className="bg-yellow-500 hover:bg-yellow-600 text-black"
                            >
                              작성
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent('');
                              }}
                            >
                              취소
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* 답글 목록 */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ml-8 space-y-3">
                          {comment.replies.map((reply, replyIndex) => {
                            const replyBadges = [
                              { text: "포용적", color: "bg-blue-500 hover:bg-blue-500 text-white border-0" },
                              { text: "반대", color: "bg-red-500 hover:bg-red-500 text-white border-0" },
                              { text: "중립", color: "bg-green-500 hover:bg-green-500 text-white border-0" }
                            ];
                            const replyBadge = replyBadges[replyIndex % 3];
                            return (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar className="h-8 w-8 bg-yellow-500">
                                  <AvatarFallback className="bg-yellow-500 text-black text-xs font-medium">
                                    {replyIndex === 0 ? '박' : '미'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold">
                                      {replyIndex === 0 ? '박민주' : '미디어연구가'}
                                    </span>
                                    <Badge className={`text-xs ${replyBadge.color}`}>
                                      {replyBadge.text}
                                    </Badge>
                                  </div>
                                  <p className="text-sm mb-2 leading-relaxed">{reply.content}</p>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                </div>
              );
            })}
          </div>

          <Separator className="my-6" />

          {/* 댓글 작성 */}
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 bg-yellow-500">
              <AvatarFallback className="bg-yellow-500 text-black font-medium">U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={user ? "의견을 남겨주세요..." : "로그인 후 댓글을 작성할 수 있습니다"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!user}
                className="mb-2 bg-background border-border"
                rows={2}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  disabled={!user || !newComment.trim()}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  의견 작성
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showCalculator && <PolicyCalculator onClose={() => setShowCalculator(false)} />}
    </div>
  );
};

export default PostDetail;
