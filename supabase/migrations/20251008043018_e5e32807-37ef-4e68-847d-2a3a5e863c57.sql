-- 게시물 테이블 생성
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT '일반',
  is_official BOOLEAN DEFAULT false,
  type TEXT NOT NULL DEFAULT 'user' CHECK (type IN ('user', 'official')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0
);

-- 투표 옵션 테이블
CREATE TABLE public.poll_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 댓글 테이블
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Posts 정책
CREATE POLICY "모든 사람이 게시물을 볼 수 있음"
ON public.posts FOR SELECT
TO public
USING (true);

CREATE POLICY "로그인한 사용자가 게시물 작성 가능"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "작성자가 자신의 게시물 수정 가능"
ON public.posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "작성자가 자신의 게시물 삭제 가능"
ON public.posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Poll options 정책
CREATE POLICY "모든 사람이 투표 옵션을 볼 수 있음"
ON public.poll_options FOR SELECT
TO public
USING (true);

CREATE POLICY "로그인한 사용자가 투표 옵션 작성 가능"
ON public.poll_options FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE id = post_id AND user_id = auth.uid()
  )
);

CREATE POLICY "게시물 작성자가 투표 옵션 업데이트 가능"
ON public.poll_options FOR UPDATE
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE id = post_id
  )
);

-- Comments 정책
CREATE POLICY "모든 사람이 댓글을 볼 수 있음"
ON public.comments FOR SELECT
TO public
USING (true);

CREATE POLICY "로그인한 사용자가 댓글 작성 가능"
ON public.comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "작성자가 자신의 댓글 수정 가능"
ON public.comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "작성자가 자신의 댓글 삭제 가능"
ON public.comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 업데이트 시간 자동 갱신 트리거 함수
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();