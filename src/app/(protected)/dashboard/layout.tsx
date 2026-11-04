// src/app/dashboard/layout.tsx
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<p className="p-8">Loading…</p>}>{children}</Suspense>;
}