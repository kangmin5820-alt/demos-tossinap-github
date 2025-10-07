import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, User } from "lucide-react";

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
}: PostCardProps) => {
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

          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
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
        </div>
      </Card>
    </Link>
  );
};

export default PostCard;
