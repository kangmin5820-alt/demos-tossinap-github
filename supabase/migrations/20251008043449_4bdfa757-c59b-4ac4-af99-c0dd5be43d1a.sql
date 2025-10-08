
-- 공식 게시물 샘플 데이터 추가
INSERT INTO public.posts (content, type, is_official, category, views, likes, created_at) VALUES
('DEMOS 플랫폼에 오신 것을 환영합니다! 우리는 민주적인 의사결정을 위한 공간입니다.', 'official', true, '공지', 150, 45, NOW() - INTERVAL '2 days'),
('이번 주 주요 안건에 대한 투표가 진행중입니다. 많은 참여 부탁드립니다!', 'official', true, '공지', 89, 23, NOW() - INTERVAL '1 day');

-- 일반 사용자 게시물 샘플 데이터 추가  
INSERT INTO public.posts (content, type, category, views, likes, created_at) VALUES
('새로운 정책 제안: 커뮤니티 가이드라인 개선에 대해 논의하고 싶습니다.', 'user', '제안', 67, 12, NOW() - INTERVAL '5 hours'),
('지난 투표 결과에 대한 의견을 나누고 싶어요. 여러분은 어떻게 생각하시나요?', 'user', '토론', 42, 8, NOW() - INTERVAL '3 hours'),
('DEMOS 사용 후기: 정말 투명하고 민주적인 플랫폼인 것 같아요!', 'user', '일반', 38, 15, NOW() - INTERVAL '1 hour');
