import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-full max-w-3xl px-4">
      <div className="flex items-center justify-between gap-3 rounded-2xl border bg-background/80 p-3 shadow-lg backdrop-blur">
        <p className="text-sm">Try Smart Budget now – Free forever</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/login")}>Sign In</Button>
          <Button size="sm" onClick={() => navigate("/signup")}>Get Started</Button>
        </div>
      </div>
    </div>
  );
}
