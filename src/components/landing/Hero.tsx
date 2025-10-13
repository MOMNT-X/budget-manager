import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gradient-to-tr from-amber-400/20 to-pink-400/20 blur-2xl" />
      </div>

      <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col items-start justify-center gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 text-yellow-500" /> 4.9/5 by 2,000+ users
          </span>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Take Control of Your Money, Spend Smarter.
          </h1>
          <p className="text-pretty text-muted-foreground md:text-lg">
            Track income, budget spending, and make smarter financial decisions—all in one place.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button className="gap-2" onClick={() => navigate("/signup")}>Start for Free <ArrowRight className="h-4 w-4" /></Button>
            <a href="#demo" className="text-sm font-medium text-primary hover:underline">See How It Works</a>
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Bank-grade security • No hidden fees
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-blue-500/20 blur-2xl" />
          <div className="absolute -right-8 bottom-10 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" />
          <div className="relative rounded-2xl border bg-card p-4 shadow-xl backdrop-blur">
            <img src="/image/Screenshot (99).png" alt="Smart Budget dashboard" className="aspect-video w-full rounded-lg object-cover" />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Monthly Spend Estimate</p>
                <p className="mt-1 text-lg font-semibold">₦250,450</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Saved</p>
                <p className="mt-1 text-lg font-semibold text-emerald-600">₦10,050</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Alerts</p>
                <p className="mt-1 text-lg font-semibold text-amber-600">2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
