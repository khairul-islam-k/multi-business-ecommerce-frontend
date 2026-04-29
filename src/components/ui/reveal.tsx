"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

export type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "blur-in"
  | "tilt-in"
  | "rotate-in"
  | "skew-in"
  | "flip-up"
  | "swing-in"
  | "rise-bounce"
  | "clip-reveal";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: RevealVariant;
  /** Re-trigger every time the section enters the viewport */
  once?: boolean;
  threshold?: number;
  /** Stagger direct children (in ms). When set, children animate one after another. */
  stagger?: number;
};

const variants: Record<
  RevealVariant,
  { hidden: string; shown: string; easing?: string }
> = {
  "fade-up": {
    hidden: "opacity-0 translate-y-10",
    shown: "opacity-100 translate-y-0",
  },
  "fade-down": {
    hidden: "opacity-0 -translate-y-10",
    shown: "opacity-100 translate-y-0",
  },
  "fade-left": {
    hidden: "opacity-0 -translate-x-12",
    shown: "opacity-100 translate-x-0",
  },
  "fade-right": {
    hidden: "opacity-0 translate-x-12",
    shown: "opacity-100 translate-x-0",
  },
  "zoom-in": { hidden: "opacity-0 scale-90", shown: "opacity-100 scale-100" },
  "zoom-out": { hidden: "opacity-0 scale-110", shown: "opacity-100 scale-100" },
  "blur-in": {
    hidden: "opacity-0 blur-md scale-[0.98]",
    shown: "opacity-100 blur-0 scale-100",
  },
  "tilt-in": {
    hidden: "opacity-0 -rotate-3 translate-y-8 scale-95",
    shown: "opacity-100 rotate-0 translate-y-0 scale-100",
  },
  "rotate-in": {
    hidden: "opacity-0 rotate-6 scale-95",
    shown: "opacity-100 rotate-0 scale-100",
  },
  "skew-in": {
    hidden: "opacity-0 -skew-y-3 translate-y-8",
    shown: "opacity-100 skew-y-0 translate-y-0",
  },
  "flip-up": {
    hidden:
      "opacity-0 [transform:perspective(900px)_rotateX(35deg)_translateY(40px)]",
    shown:
      "opacity-100 [transform:perspective(900px)_rotateX(0)_translateY(0)]",
  },
  "swing-in": {
    hidden: "opacity-0 origin-top -rotate-6 translate-y-4",
    shown: "opacity-100 rotate-0 translate-y-0",
    easing: "cubic-bezier(.34,1.56,.64,1)",
  },
  "rise-bounce": {
    hidden: "opacity-0 translate-y-12 scale-95",
    shown: "opacity-100 translate-y-0 scale-100",
    easing: "cubic-bezier(.34,1.56,.64,1)",
  },
  "clip-reveal": {
    hidden: "opacity-0 [clip-path:inset(0_0_100%_0)] translate-y-4",
    shown: "opacity-100 [clip-path:inset(0_0_0_0)] translate-y-0",
  },
};

export const Reveal = ({
  children,
  as,
  className = "",
  delay = 0,
  duration = 800,
  variant = "fade-up",
  once = false,
  threshold = 0.12,
  stagger,
}: RevealProps) => {
  const Tag = (as || "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduce(true);
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            // Reset only when fully out, so it replays next time
            setShown(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const v = variants[variant];
  const easing = v.easing || "cubic-bezier(.22,1,.36,1)";

  // Staggered children mode
  if (stagger && !reduce) {
    const arr = Array.isArray(children) ? children : [children];
    return (
      <Tag ref={ref as never} className={className}>
        {arr.map((child, i) => (
          <div
            key={i}
            style={{
              transitionDelay: shown ? `${delay + i * stagger}ms` : "0ms",
              transitionDuration: `${duration}ms`,
              transitionTimingFunction: easing,
              transitionProperty: "transform, opacity, filter, clip-path",
            }}
            className={`will-change-transform ${shown ? v.shown : v.hidden}`}
          >
            {child}
          </div>
        ))}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as never}
      style={{
        transitionDelay: shown ? `${delay}ms` : "0ms",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: easing,
        transitionProperty: "transform, opacity, filter, clip-path",
      }}
      className={`will-change-transform ${shown ? v.shown : v.hidden} ${className}`}
    >
      {children}
    </Tag>
  );
};
