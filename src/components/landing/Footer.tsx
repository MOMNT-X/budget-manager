export default function Footer() {
  return (
    <footer className="border-t bg-background/80">
      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
          <p className="mt-3 text-sm text-muted-foreground">Smart financial management made easy.</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#">About</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#security">Security</a></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Security</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Smart Budget. All rights reserved.</div>
    </footer>
  );
}
