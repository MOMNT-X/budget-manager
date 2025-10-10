export default function Demo() {
  return (
    <section id="demo" className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">See Smart Budget in action</h2>
          <p className="mt-3 text-muted-foreground">A quick look at how you track income, categorize expenses, and stay on target with savings goals.</p>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li>• Connect accounts and auto-sync transactions</li>
            <li>• Build budgets in minutes with smart suggestions</li>
            <li>• Get proactive alerts before overspending</li>
            <li>• Visualize trends and progress over time</li>
          </ul>
        </div>
        <div className="relative">
          <div className="aspect-video w-full overflow-hidden rounded-xl border bg-black/90 shadow-xl">
            <video className="h-full w-full" autoPlay muted loop playsInline>
              <source src="" type="video/mp4" />
            </video>
            <div className="absolute inset-0 grid place-items-center text-sm text-white/70">Demo video placeholder</div>
          </div>
        </div>
      </div>
    </section>
  );
}
