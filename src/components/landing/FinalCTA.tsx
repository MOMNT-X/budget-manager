import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-4 py-16 text-center md:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-balance text-3xl font-bold md:text-4xl">Start managing your money the smart way</h2>
        <p className="mt-3 text-muted-foreground">Join thousands who budget with confidence.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => navigate("/signup")}>Get Started Free</Button>
          <Button variant="outline" onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </div>
    </section>
  );
}
