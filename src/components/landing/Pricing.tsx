"use client";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Free",
    price: "$0",
    desc: "For getting started",
    features: ["Up to 10 budgets", "Connect 1 bank", "Basic insights", "Email support"],
    cta: "Start Free",
    to: "/signup", // 👈 use 'to' for react-router-dom
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$8/mo",
    desc: "For power users",
    features: ["Unlimited budgets", "Connect multiple banks", "Advanced insights", "Priority support"],
    cta: "Upgrade",
    to: "#", // placeholder for now
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Simple, transparent pricing</h2>
        <p className="mt-3 text-muted-foreground">Cancel anytime. No hidden fees.</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-2xl border bg-card p-6 shadow-sm ${
              t.highlighted ? "ring-2 ring-primary" : ""
            }`}
          >
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-xl font-semibold">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </div>
              <div className="text-3xl font-bold">{t.price}</div>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {t.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>

            {/* 👇 Use Link with 'to' prop instead of 'href' */}
            {t.to ? (
              <Link to={t.to}>
                <Button className="mt-6 w-full">{t.cta}</Button>
              </Link>
            ) : (
              <Button className="mt-6 w-full">{t.cta}</Button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
