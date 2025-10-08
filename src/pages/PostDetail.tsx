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
  ThumbsUp,
  MessageCircle,
  Eye,
  Heart,
  Send,
  ChevronLeft,
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

  const handleLikePost = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    if (!post) return;

    try {
      const { error } = await supabase
        .from('posts')
        .update({ likes: post.likes + 1 })
        .eq('id', post.id);

      if (error) throw error;

      setPost({ ...post, likes: post.likes + 1 });
      toast.success('좋아요를 눌렀습니다');
    } catch (error) {
      console.error('Error liking post:', error);
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
              <h1 className="text-2xl font-bold mb-2">{post.title || '제목 없음'}</h1>
              <p className="text-muted-foreground text-sm">
                {getTimeAgo(post.created_at)}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* 게시물 내용 */}
          <div className="prose max-w-none mb-6">
            <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
          </div>

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

          <Separator className="my-4" />

          <Button
            variant="outline"
            onClick={handleLikePost}
            className="w-full gap-2"
          >
            <Heart className="h-4 w-4" />
            좋아요
          </Button>
        </Card>

        {/* 투표 섹션 */}
        {pollOptions.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">이 사안에 대한 당신의 입장은?</h2>
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

        {/* 댓글 섹션 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            댓글 {comments.length}개
          </h2>

          {/* 댓글 작성 */}
          <div className="mb-6">
            <Textarea
              placeholder={user ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!user}
              className="mb-2"
            />
            <Button
              onClick={handleAddComment}
              disabled={!user || !newComment.trim()}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              댓글 작성
            </Button>
          </div>

          <Separator className="my-6" />

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{getTimeAgo(comment.created_at)}</span>
                      <button className="hover:text-foreground flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{comment.likes}</span>
                      </button>
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="hover:text-foreground"
                      >
                        답글
                      </button>
                    </div>

                    {/* 답글 작성 폼 */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 ml-4">
                        <Textarea
                          placeholder="답글을 입력하세요..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAddReply(comment.id)}
                            disabled={!replyContent.trim()}
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
                      <div className="ml-8 mt-3 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-muted rounded-lg p-3">
                                <p className="text-sm">{reply.content}</p>
                              </div>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span>{getTimeAgo(reply.created_at)}</span>
                                <button className="hover:text-foreground flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  <span>{reply.likes}</span>
                                </button>
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

          {comments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              첫 댓글을 작성해보세요!
            </p>
          )}
        </Card>
      </main>
    </div>
  );
};

export default PostDetail;
