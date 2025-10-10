const people = [
  { name: "Aisha O.", quote: "I saved 40% more monthly using Smart Budget!", role: "Product Manager" },
  { name: "Marcus L.", quote: "The alerts saved me from overspending many times.", role: "Freelancer" },
  { name: "Sophia K.", quote: "Beautiful insights that finally make sense.", role: "Designer" },
];

export default function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Loved by smart savers</h2>
        <p className="mt-2 text-muted-foreground">4.9/5 average rating from 2,000+ users</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {people.map((p) => (
          <figure key={p.name} className="rounded-2xl border bg-card p-6 shadow-sm">
            <blockquote className="text-sm text-muted-foreground">“{p.quote}”</blockquote>
            <figcaption className="mt-4 text-sm font-medium">{p.name} <span className="text-muted-foreground">• {p.role}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
