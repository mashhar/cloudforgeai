import { CloudCog } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <CloudCog className="h-5 w-5 text-primary" />
          <span>CloudForge AI</span>
        </div>
        <p>AI-generated reference architectures, infrastructure starters, and deployment guidance.</p>
      </div>
    </footer>
  );
}
