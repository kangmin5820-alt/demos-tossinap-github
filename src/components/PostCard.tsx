import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Heart, User, ThumbsUp, Send } from "lucide-react";
import { useState } from "react";

interface PostCardProps {
  id: number;
  title: string;
  summary: string;
  category: string;
  timestamp: string;
  commentCount: number;
  views: number;
  isOfficial?: boolean;
  likes?: number;
  type?: "user" | "official";
  attachments?: {
    poll?: {
      question: string;
      options: Array<{
        text: string;
        votes: number;
        image?: string;
      }>;
      totalVotes: number;
    };
    links?: string[];
  };
}

const PostCard = ({
  id,
  title,
  summary,
  category,
  timestamp,
  commentCount,
  views,
  isOfficial = true,
  likes,
  type = "official",
  attachments,
}: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [pollVotes, setPollVotes] = useState(
    attachments?.poll?.options.reduce((acc, option, idx) => {
      acc[idx] = option.votes;
      return acc;
    }, {} as Record<number, number>) || {}
  );
  const [postLikes, setPostLikes] = useState(likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [comments, setComments] = useState<Array<{
    id: number;
    user: string;
    content: string;
    likes: number;
    replies: Array<{
      id: number;
      user: string;
      content: string;
      likes: number;
    }>;
  }>>([
    { 
      id: 1, 
      user: "김민수", 
      content: "좋은 의견 감사합니다!", 
      likes: 12,
      replies: [
        { id: 101, user: "박지영", content: "저도 동감합니다!", likes: 3 }
      ]
    },
    { 
      id: 2, 
      user: "이지은", 
      content: "저도 같은 생각입니다.", 
      likes: 8,
      replies: []
    },
  ]);

  const handlePollVote = (optionIndex: number) => {
    if (userVote !== null) return;
    setPollVotes(prev => ({
      ...prev,
      [optionIndex]: (prev[optionIndex] || 0) + 1
    }));
    setUserVote(optionIndex);
  };

  const handleLike = () => {
    if (hasLiked) {
      setPostLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setPostLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newCommentObj = {
      id: Date.now(),
      user: "나",
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
      content: replyContent,
      likes: 0
    };
    
    setComments(prev => prev.map(comment => 
      comment.id === commentId
        ? { ...comment, replies: [...comment.replies, newReply] }
        : comment
    ));
    setReplyContent("");
    setReplyTo(null);
  };

  const handleCommentLike = (commentId: number) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const handleReplyLike = (commentId: number, replyId: number) => {
    setComments(prev => prev.map(comment =>
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
    ));
  };

  const totalPollVotes = Object.values(pollVotes).reduce((sum, votes) => sum + votes, 0);
  const getPercentage = (optionIndex: number) => {
    const votes = pollVotes[optionIndex] || 0;
    return totalPollVotes > 0 ? ((votes / totalPollVotes) * 100).toFixed(0) : "0";
  };

  const CardContent = (
    <div className="p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold">
          {type === "official" ? "D" : <User className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-foreground text-sm">
              {type === "official" ? "데모스" : "일반 사용자"}
            </p>
            {type === "official" && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-2 py-0">
                공식
              </Badge>
            )}
            <span className="text-muted-foreground text-xs">· {timestamp}</span>
          </div>
        </div>
      </div>

      {type === "user" ? (
        <>
          <p className="mb-4 text-base text-foreground leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>

          {attachments?.poll && (
            <div className="mb-4 bg-background/50 rounded-2xl p-5 border border-border">
              <div className="space-y-3">
                {attachments.poll.options.map((option, idx) => {
                  const percentage = getPercentage(idx);
                  const isVoted = userVote !== null;
                  const isSelected = userVote === idx;
                  
                  return (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePollVote(idx);
                      }}
                      disabled={isVoted}
                      className={`w-full relative overflow-hidden rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : isVoted
                          ? "border-border bg-card/50 cursor-not-allowed"
                          : "border-border bg-card hover:border-primary/50 hover:bg-card/80 cursor-pointer"
                      }`}
                    >
                      {isVoted && (
                        <div
                          className="absolute left-0 top-0 h-full bg-primary/5 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      )}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className={`text-base font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {option.text}
                        </span>
                        {isVoted && (
                          <span className={`text-base font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                            {percentage}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                {totalPollVotes.toLocaleString()}명 참여
              </p>
            </div>
          )}

          {isExpanded && (
            <>
              <Separator className="my-6" />
              
              {/* 투표 섹션 (공식 게시물용) */}
              {type !== "user" && attachments?.poll && (
                <div className="mb-6">
                  <h3 className="mb-4 text-lg font-bold text-foreground">📊 투표하기</h3>
                  <p className="mb-4 text-sm text-foreground">{attachments.poll.question}</p>
                  <div className="flex gap-0 rounded-full overflow-hidden h-14 border-2 border-border mb-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePollVote(0);
                      }}
                      disabled={userVote !== null}
                      className={`flex-1 flex items-center justify-center gap-2 font-bold transition-all ${
                        userVote === 0
                          ? "bg-[hsl(var(--demos-positive))] text-white" 
                          : "bg-card hover:bg-secondary text-foreground"
                      } ${userVote !== null ? "cursor-not-allowed" : "cursor-pointer"}`}
                      style={
                        userVote !== null 
                          ? { width: `${getPercentage(0)}%` }
                          : undefined
                      }
                    >
                      <span className="text-xl">😊</span>
                      <div className="flex flex-col items-center">
                        <span className="text-sm">긍정적</span>
                        {userVote !== null && (
                          <span className="text-xs opacity-90">{getPercentage(0)}%</span>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePollVote(1);
                      }}
                      disabled={userVote !== null}
                      className={`flex-1 flex items-center justify-center gap-2 font-bold transition-all ${
                        userVote === 1
                          ? "bg-[hsl(var(--demos-negative))] text-white" 
                          : "bg-card hover:bg-secondary text-foreground"
                      } ${userVote !== null ? "cursor-not-allowed" : "cursor-pointer"}`}
                      style={
                        userVote !== null 
                          ? { width: `${getPercentage(1)}%` }
                          : undefined
                      }
                    >
                      <span className="text-xl">😞</span>
                      <div className="flex flex-col items-center">
                        <span className="text-sm">부정적</span>
                        {userVote !== null && (
                          <span className="text-xs opacity-90">{getPercentage(1)}%</span>
                        )}
                      </div>
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    총 {totalPollVotes.toLocaleString()}명이 투표했습니다
                  </p>
                </div>
              )}
              
              {/* 댓글 섹션 (일반인 게시물만) */}
              {type === "user" && (
                <div className="mb-6">
                  <h3 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    스레드 ({comments.length})
                  </h3>
                
                  <div className="space-y-4 mb-4">
                    {comments.map((comment) => (
                      <div key={comment.id}>
                        <div className="flex gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-gradient-hero text-white text-sm">
                              {comment.user.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground text-sm">{comment.user}</p>
                            <p className="text-foreground/90 text-sm mt-1">{comment.content}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentLike(comment.id);
                                }}
                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                              >
                                <ThumbsUp className="h-3 w-3" />
                                {comment.likes}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReplyTo(replyTo === comment.id ? null : comment.id);
                                  setReplyContent("");
                                }}
                                className="text-xs text-muted-foreground hover:text-primary"
                              >
                                답글
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 대댓글 목록 */}
                        {comment.replies.length > 0 && (
                          <div className="ml-12 mt-3 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-gradient-hero text-white text-xs">
                                    {reply.user.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="font-semibold text-foreground text-sm">{reply.user}</p>
                                  <p className="text-foreground/90 text-sm mt-1">{reply.content}</p>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReplyLike(comment.id, reply.id);
                                    }}
                                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                    {reply.likes}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 대댓글 작성 */}
                        {replyTo === comment.id && (
                          <div className="ml-12 mt-3 flex gap-2">
                            <Textarea
                              placeholder="답글을 작성해주세요..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="flex-1 min-h-[60px] resize-none text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex flex-col gap-2">
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAddReply(comment.id);
                                }}
                                size="sm"
                                className="h-[60px] w-[60px]"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      placeholder="댓글을 작성해주세요..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 min-h-[80px] resize-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddComment();
                      }}
                      size="icon"
                      className="h-[80px] w-[80px]"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <h3 className="mb-2 text-lg font-bold leading-snug text-foreground">
            {title}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {summary}
          </p>

          {attachments?.poll && (
            <div className="mb-4 bg-muted/20 rounded-xl p-4 border border-border/50">
              <p className="text-sm font-medium text-foreground mb-3">{attachments.poll.question}</p>
              <div className="space-y-2">
                {attachments.poll.options.map((option, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-lg border border-border bg-background p-3"
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{option.text}</span>
                      <span className="text-sm font-bold text-muted-foreground">?</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                투표하고 결과를 확인하세요
              </p>
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{type === "user" ? comments.length : commentCount}</span>
          </button>
          {type === "user" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLike();
              }}
              className={`flex items-center gap-1.5 transition-colors ${
                hasLiked ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
              <span>{postLikes.toLocaleString()}</span>
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <span>{views.toLocaleString()} views</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card 
      className="group border border-border bg-card hover:bg-card/80 transition-all rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {CardContent}
    </Card>
  );
};

export default PostCard;
