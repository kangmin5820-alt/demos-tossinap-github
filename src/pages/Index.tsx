import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  poll_options?: Array<{
    id: string;
    option_text: string;
    votes: number;
  }>;
  comments_count?: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "official">("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          poll_options (
            id,
            option_text,
            votes
          )
        `)
        .order('created_at', { ascending: false });

      if (filter === "official") {
        query = query.eq('type', 'official');
      }

      const { data, error } = await query;

      if (error) throw error;

      // 각 게시물의 댓글 수 가져오기
      const postsWithCounts = await Promise.all(
        (data || []).map(async (post) => {
          const { count } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          return {
            ...post,
            comments_count: count || 0,
          };
        })
      );

      setPosts(postsWithCounts as any);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-3xl">
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-foreground">
              <Sparkles className="h-7 w-7 text-primary" />
              오늘의 핫이슈
            </h1>
            <p className="text-muted-foreground text-sm">
              데모스가 전하는 주요 뉴스와 각 진영의 목소리를 확인하세요
            </p>
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="rounded-full"
            >
              전체
            </Button>
            <Button
              variant={filter === "official" ? "default" : "outline"}
              onClick={() => setFilter("official")}
              className="rounded-full gap-2"
            >
              <Filter className="h-4 w-4" />
              데모스 공식
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">게시물이 없습니다.</p>
            <p className="text-sm text-muted-foreground mt-2">첫 게시물을 작성해보세요!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const totalVotes = post.poll_options?.reduce((sum, opt) => sum + opt.votes, 0) || 0;
              
              return (
                <div
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <PostCard
                    id={Number(post.id.split('-').join('').substring(0, 8))}
                    title={post.title || ''}
                    summary={post.content}
                    category={post.category}
                    timestamp={getTimeAgo(post.created_at)}
                    commentCount={post.comments_count || 0}
                    views={post.views}
                    isOfficial={post.is_official}
                    likes={post.likes}
                    type={post.type}
                    attachments={post.poll_options && post.poll_options.length > 0 ? {
                      poll: {
                        question: "이 사안에 대한 당신의 입장은?",
                        options: post.poll_options.map(opt => ({
                          text: opt.option_text,
                          votes: opt.votes,
                        })),
                        totalVotes,
                      }
                    } : undefined}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
