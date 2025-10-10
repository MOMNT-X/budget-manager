import { ArrowRight } from "lucide-react";

const sections = [
  {
    title: "Budget Control Dashboard",
    desc: "Get an instant overview of income vs expenses with clear insights.",
    image: "/image/View%20of%20a%20mountain%20lake%20with%20a%20full%20moon%20in%20the%20sky.jpg",
  },
  {
    title: "Expense Categorization",
    desc: "Real-time analytics with category-level spending trends.",
    image: "/image/View%20of%20a%20mountain%20lake%20with%20a%20full%20moon%20in%20the%20sky.jpg",
  },
  {
    title: "Goal Tracking",
    desc: "Create saving goals, visualize milestones, and automate contributions.",
    image: "/image/View%20of%20a%20mountain%20lake%20with%20a%20full%20moon%20in%20the%20sky.jpg",
  },
  {
    title: "Smart Alerts & Notifications",
    desc: "Stay proactive with reminders and intelligent alerts.",
    image: "/image/View%20of%20a%20mountain%20lake%20with%20a%20full%20moon%20in%20the%20sky.jpg",
  },
];

export default function DeepDives() {
  return (
    <section className="container mx-auto space-y-16 px-4 py-16 md:py-24">
      {sections.map((s, idx) => (
        <div key={s.title} className={`grid items-center gap-10 md:grid-cols-2 ${idx % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}>
          <div>
            <h3 className="text-2xl font-semibold md:text-3xl">{s.title}</h3>
            <p className="mt-3 text-muted-foreground">{s.desc}</p>
            <a href="#demo" className="mt-5 inline-flex items-center text-sm font-medium text-primary hover:underline">See it in action <ArrowRight className="ml-1 h-4 w-4" /></a>
          </div>
          <div>
            <img src={s.image} alt={s.title} className="rounded-xl border shadow-sm" />
          </div>
        </div>
      ))}
    </section>
  );
}
