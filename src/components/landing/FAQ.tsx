type QA = { q: string; a: string };

const faqs: QA[] = [
  { q: "Is Smart Budget free to use?", a: "Yes. Start with the Free plan and upgrade anytime." },
  { q: "Can I connect my bank accounts?", a: "Yes. We support secure connections to major banks via trusted providers." },
  { q: "What happens if I go over budget?", a: "You'll get alerts and suggestions to adjust your plan and get back on track." },
  { q: "How secure is my financial data?", a: "We use industry-standard encryption and never sell your data." },
];

export default function FAQ() {
  return (
    <section id="faq" className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
        <p className="mt-2 text-muted-foreground">Everything you need to know before getting started.</p>
      </div>
      <div className="mx-auto mt-8 max-w-3xl divide-y rounded-xl border bg-card">
        {faqs.map((f) => (
          <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-2 text-left text-sm font-medium">
              {f.q}
              <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
