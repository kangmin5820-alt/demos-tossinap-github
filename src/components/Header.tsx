import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import demosLogo from "@/assets/demos-logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("로그아웃되었습니다");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img src={demosLogo} alt="DEMOS Logo" className="h-10 w-10 rounded-lg" />
          <span className="text-2xl font-bold text-primary">
            DEMOS
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                onClick={() => navigate("/create")}
                size="icon"
                className="rounded-full"
                title="글쓰기"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="icon"
                className="rounded-full"
                title="로그아웃"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              size="sm"
              className="rounded-full gap-2"
            >
              <LogIn className="h-4 w-4" />
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
