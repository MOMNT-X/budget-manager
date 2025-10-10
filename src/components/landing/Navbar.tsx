import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const shouldDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(shouldDark);
    document.documentElement.classList.toggle("dark", shouldDark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
          <span className="text-lg font-semibold">Smart Budget</span>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
          <Link to="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link to="#security" className="text-sm text-muted-foreground hover:text-foreground">Security</Link>
          <Link to="#faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link>
          <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="outline" onClick={() => navigate("/login")}>Sign In</Button>
          <Button onClick={() => navigate("/signup")}>Get Started</Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button size="sm" onClick={() => navigate("/signup")}>Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
