import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, TrendingUp, Clock } from "lucide-react";

interface PostCardProps {
  id: number;
  title: string;
  summary: string;
  category: string;
  timestamp: string;
  commentCount: number;
  views: number;
  isOfficial?: boolean;
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
}: PostCardProps) => {
  return (
    <Link to={`/post/${id}`}>
      <Card className="group overflow-hidden bg-gradient-card shadow-card transition-all hover:shadow-card-hover">
        <div className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <Badge variant={isOfficial ? "default" : "secondary"} className="font-medium">
              {isOfficial ? "데모스 공식" : category}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{timestamp}</span>
            </div>
          </div>

          <h3 className="mb-2 text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {summary}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{commentCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{views.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-hero opacity-0 transition-opacity group-hover:opacity-100" />
      </Card>
    </Link>
  );
};

export default PostCard;
