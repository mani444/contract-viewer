import React from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right";
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900", className)}>
      <div className="max-w-7xl mx-auto p-4">{children}</div>
    </div>
  );
}

export function TwoColumnLayout({ children, className }: LayoutProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MainContent({ children, className }: MainContentProps) {
  return (
    <main className={cn("order-2 lg:order-1", className)}>{children}</main>
  );
}

export function Sidebar({ children, className, side = "right" }: SidebarProps) {
  const sideClasses =
    side === "right" ? "order-1 lg:order-2" : "order-2 lg:order-1";

  return <aside className={cn(sideClasses, className)}>{children}</aside>;
}
