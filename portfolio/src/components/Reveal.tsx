import type { RevealProps } from "../types";
import { useInView } from "../hooks/useInView";

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`reveal ${inView ? "visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
