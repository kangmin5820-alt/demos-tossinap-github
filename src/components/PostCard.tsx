import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, User, Share2 } from "lucide-react";
import { toast } from "sonner";

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
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: summary,
        url: window.location.origin + `/post/${id}`
      }).catch(() => {
        // 공유 취소 시 무시
      });
    } else {
      // 폴백: URL 복사
      navigator.clipboard.writeText(window.location.origin + `/post/${id}`);
      toast.success("링크가 복사되었습니다");
    }
  };

  return (
    <Link to={`/post/${id}`}>
      <Card className="group border border-border bg-card hover:bg-card/80 transition-all rounded-2xl overflow-hidden">
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
                {attachments.poll.options.map((option, idx) => {
                  const percentage = ((option.votes / attachments.poll!.totalVotes) * 100).toFixed(0);
                  return (
                    <div
                      key={idx}
                      className="relative overflow-hidden rounded-lg border border-border bg-background p-3"
                    >
                      <div
                        className="absolute left-0 top-0 h-full bg-primary/10 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{option.text}</span>
                        <span className="text-sm font-bold text-primary">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                {attachments.poll.totalVotes.toLocaleString()}명 참여
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />
                <span>{commentCount}</span>
              </div>
              {type === "user" && likes && (
                <div className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4" />
                  <span>{likes.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span>{views.toLocaleString()} views</span>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg"
              aria-label="공유하기"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PostCard;
