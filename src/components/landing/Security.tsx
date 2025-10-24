import { ShieldCheck } from "lucide-react";

export default function Security() {
  return (
    <section id="security" className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">Security you can trust</h2>
          <p className="mt-3 text-muted-foreground">Your data is encrypted with bank-grade security. We never sell your financial data.</p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border p-4">
              <p className="font-medium">Data Encryption</p>
              <p className="text-muted-foreground">AES-256 at rest & TLS in transit</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="font-medium">Compliance</p>
              <p className="text-muted-foreground">GDPR • ISO 27001 • PCI-DSS</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="font-medium">Privacy First</p>
              <p className="text-muted-foreground">No ad tracking or data resale</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="font-medium">Secure Auth</p>
              <p className="text-muted-foreground">2FA & OAuth integrations</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 text-emerald-600">
          <ShieldCheck className="h-12 w-12" />
          <p className="mt-4 text-lg font-semibold">Bank-grade encryption</p>
          <p className="text-sm text-muted-foreground">We protect your information with the same standards used by financial institutions.</p>
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
