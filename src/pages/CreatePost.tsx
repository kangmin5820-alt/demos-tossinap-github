import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

const CreatePost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [hasPoll, setHasPoll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("내용을 입력해주세요");
      return;
    }

    if (hasPoll) {
      const validOptions = pollOptions.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        toast.error("투표 옵션을 최소 2개 이상 입력해주세요");
        return;
      }
    }

    setLoading(true);

    try {
      // 게시물 생성
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          content,
          user_id: user?.id,
          type: 'user',
        })
        .select()
        .single();

      if (postError) throw postError;

      // 투표 옵션이 있으면 추가
      if (hasPoll && post) {
        const validOptions = pollOptions.filter(opt => opt.trim());
        const { error: pollError } = await supabase
          .from('poll_options')
          .insert(
            validOptions.map(opt => ({
              post_id: post.id,
              option_text: opt.trim(),
            }))
          );

        if (pollError) throw pollError;
      }

      toast.success("게시물이 작성되었습니다");
      navigate("/");
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(error.message || "게시물 작성에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">새 게시물 작성</h1>
          <p className="text-muted-foreground">커뮤니티에 의견을 공유해보세요</p>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="content" className="text-base font-semibold mb-2 block">
                내용
              </Label>
              <Textarea
                id="content"
                placeholder="무슨 생각을 하고 계신가요?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold">투표 추가 (선택사항)</Label>
                <Button
                  variant={hasPoll ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => {
                    setHasPoll(!hasPoll);
                    if (!hasPoll) {
                      setPollOptions(["", ""]);
                    }
                  }}
                >
                  {hasPoll ? "투표 제거" : "투표 추가"}
                </Button>
              </div>

              {hasPoll && (
                <div className="space-y-3">
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`옵션 ${index + 1}`}
                        value={option}
                        onChange={(e) => handlePollOptionChange(index, e.target.value)}
                        className="flex-1"
                      />
                      {pollOptions.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePollOption(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 5 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddPollOption}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      옵션 추가
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex-1"
              disabled={loading}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={loading}
            >
              {loading ? "게시중..." : "게시하기"}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CreatePost;
