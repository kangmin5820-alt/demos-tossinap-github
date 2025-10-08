import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Home } from "lucide-react";
import demosLogo from "@/assets/demos-logo.png";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img src={demosLogo} alt="DEMOS Logo" className="h-10 w-10 rounded-lg" />
          <span className="text-2xl font-bold text-primary">
            DEMOS
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">홈</span>
            </Link>
          </Button>
          <Button
            variant={isActive("/dashboard") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">대시보드</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
