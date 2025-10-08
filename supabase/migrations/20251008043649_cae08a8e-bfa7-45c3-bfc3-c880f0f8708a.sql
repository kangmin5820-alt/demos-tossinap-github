
-- 기존 샘플 데이터 삭제
DELETE FROM public.poll_options;
DELETE FROM public.posts;

-- 공식 게시물 1: 어린숙 체포적법심사에 대한 논쟁
INSERT INTO public.posts (content, type, is_official, category, views, likes, created_at) 
VALUES (
  '방송문화협회의 어린숙 회장을 체포치에 대한 체포적법심사가 오늘 오후 진행됩니다. 대통령의 예문과 그랑 충돌은 줄어낙 손익니다.',
  'official',
  true,
  '공식',
  1234,
  234,
  NOW() - INTERVAL '2 hours'
) RETURNING id;

-- 위 게시물의 투표 옵션 추가 (id를 직접 사용하기 위해 별도 쿼리)
WITH latest_post AS (
  SELECT id FROM public.posts WHERE content LIKE '%방송문화협회%' ORDER BY created_at DESC LIMIT 1
)
INSERT INTO public.poll_options (post_id, option_text, votes)
SELECT id, '긍정적', 873 FROM latest_post
UNION ALL
SELECT id, '부정적', 361 FROM latest_post;

-- 일반 사용자 게시물: 의대 정원 증원
INSERT INTO public.posts (content, type, is_official, category, views, likes, created_at)
VALUES (
  '의대 정원 증원이 결정되면 우리 지역 의료 환경은 개선될까요? 실제 지역 병원 근무 의사입니다. 현실적인 이야기 나눠요.',
  'user',
  false,
  '일반',
  5432,
  1247,
  NOW() - INTERVAL '1 hour'
);

-- 위 게시물의 투표 옵션 추가
WITH latest_post AS (
  SELECT id FROM public.posts WHERE content LIKE '%의대 정원%' ORDER BY created_at DESC LIMIT 1
)
INSERT INTO public.poll_options (post_id, option_text, votes)
SELECT id, '개선된다', 2145 FROM latest_post
UNION ALL
SELECT id, '악화된다', 3287 FROM latest_post;

-- 공식 게시물 2: 모바일 한국 제도
INSERT INTO public.posts (content, type, is_official, category, views, likes, created_at)
VALUES (
  '모바일 한국 제도, 과정과 실증 사건의 다리에 대한 공식 발표입니다.',
  'official',
  true,
  '공식',
  892,
  156,
  NOW() - INTERVAL '4 hours'
);

-- 추가 일반 게시물들
INSERT INTO public.posts (content, type, is_official, category, views, likes, created_at)
VALUES 
(
  '지역 교통 개선 프로젝트에 대한 의견을 나누고 싶습니다. 여러분의 생각은 어떠신가요?',
  'user',
  false,
  '토론',
  423,
  89,
  NOW() - INTERVAL '30 minutes'
),
(
  '환경 보호를 위한 새로운 정책이 필요합니다. 함께 논의해요!',
  'user',
  false,
  '제안',
  567,
  132,
  NOW() - INTERVAL '45 minutes'
);
