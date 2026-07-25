"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  gold: "bg-gold-400 text-navy-900 hover:bg-gold-500 hover:shadow-[0_8px_20px_rgba(212,165,55,0.35)]",
  "outline-light": "bg-transparent border-[1.5px] border-white/55 text-white hover:border-white hover:bg-white/10",
  dark: "bg-navy-900 text-white hover:bg-[#26304f]",
  "outline-dark": "border-[1.5px] border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white",
} as const;

type Variant = keyof typeof VARIANTS;

/** Event handlers framer-motion re-types with its own signature; drop the DOM versions to avoid overload conflicts. */
type MotionConflicts = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

interface LinkButtonProps
  extends CommonProps,
    Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children" | MotionConflicts> {
  href: string;
}

interface NativeButtonProps
  extends CommonProps,
    Omit<ComponentPropsWithoutRef<"button">, "className" | "children" | MotionConflicts> {
  href?: undefined;
}

type ButtonProps = LinkButtonProps | NativeButtonProps;

const MotionLink = motion.create(Link);

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-[4px] px-7 py-4 text-[13px] font-bold tracking-[0.5px] transition-colors cursor-pointer";

export function Button(props: ButtonProps) {
  const { variant = "gold", className, children, ...rest } = props;
  const classes = cn(baseClasses, VARIANTS[variant], className);

  if (props.href) {
    const { href, ...anchorRest } = rest as Omit<LinkButtonProps, keyof CommonProps>;
    return (
      <MotionLink
        href={href}
        className={classes}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        transition={{ duration: 0.2 }}
        {...anchorRest}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.2 }}
      {...(rest as Omit<NativeButtonProps, keyof CommonProps>)}
    >
      {children}
    </motion.button>
  );
}
