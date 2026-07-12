import type { Sidebar } from "./types";

export default function Sidebar({ children, additionalStyle, className }: Sidebar) {
  return <div className={className} style={additionalStyle}>{children}</div>;
}
