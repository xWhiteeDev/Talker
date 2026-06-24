import type { ISidebar } from "../interfaces/ISidebar";

export default function Sidebar({ children, style, className }: ISidebar) {
  return <div className={className} style={style}>{children}</div>;
}
