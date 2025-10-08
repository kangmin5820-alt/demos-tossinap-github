-- search_path를 설정하여 보안 경고 수정
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;