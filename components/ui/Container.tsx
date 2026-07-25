import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

const MAX_WIDTH = {
  wide: "max-w-[1400px]",
  default: "max-w-[1200px]",
  narrow: "max-w-[820px]",
} as const;

interface ContainerProps {
  as?: ElementType;
  size?: keyof typeof MAX_WIDTH;
  /** Set false when the parent element already provides horizontal padding. */
  padded?: boolean;
  className?: string;
  children: ReactNode;
}

export function Container({ as: Tag = "div", size = "default", padded = true, className, children }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full", padded && "px-6 sm:px-10 lg:px-[60px]", MAX_WIDTH[size], className)}>
      {children}
    </Tag>
  );
}
