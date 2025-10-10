import { MessageCircle } from "lucide-react";

export default function SupportWidget() {
  return (
    <a href="#" className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105">
      <MessageCircle className="h-5 w-5" />
    </a>
  );
}
