"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Users,
  Rss,
  BarChart3,
  Lightbulb,
  Anchor,
  FileText,
  LayoutDashboard,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Meu Perfil", icon: User },
  { href: "/competitors", label: "Concorrentes", icon: Users },
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/analysis", label: "Análises", icon: BarChart3 },
  { href: "/suggestions", label: "Sugestões", icon: Lightbulb },
  { href: "/publicacoes", label: "Publicações", icon: Send },
  { href: "/hooks", label: "Hook Lab", icon: Anchor },
  { href: "/digest", label: "Digest", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-lg font-semibold text-sidebar-foreground">
          Inteligência Competitiva
        </h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border px-6 py-4">
        <p className="text-xs text-muted-foreground">Squad Conteúdo v1.0</p>
      </div>
    </aside>
  );
}
