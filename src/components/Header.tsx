import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import demosLogo from "@/assets/demos-logo.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img src={demosLogo} alt="DEMOS Logo" className="h-10 w-10 rounded-lg" />
          <span className="text-2xl font-bold text-primary">
            DEMOS
          </span>
        </Link>

        <Button
          onClick={() => navigate("/create")}
          size="icon"
          className="rounded-full"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
