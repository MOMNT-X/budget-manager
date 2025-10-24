import { Wallet, BarChart3, BellRing, Target } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Smart Budgeting",
    desc: "Automatically track spending and allocate funds to categories.",
  },
  {
    icon: BarChart3,
    title: "Financial Insights",
    desc: "Real-time analytics and spending trends to guide decisions.",
  },
  {
    icon: BellRing,
    title: "Smart Notifications",
    desc: "Get alerts before overspending and stay on track.",
  },
  {
    icon: Target,
    title: "Automated Saving Goals",
    desc: "Watch your savings grow on autopilot with smart rules.",
  },
];

export default function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Powerful features, simple experience</h2>
        <p className="mt-3 text-muted-foreground">Everything you need to plan, track, and grow your money.</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
