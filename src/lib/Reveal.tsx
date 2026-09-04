import type { ReactNode } from "react";

/* Seit dem Design-Audit vom 04.09.2026 bewegt sich auf der Seite nichts
   mehr: Inhalte stehen sofort da. Die Hülle bleibt, damit ältere
   Aufrufer weiter kompilieren — sie rendert nur noch ein <div>. */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
