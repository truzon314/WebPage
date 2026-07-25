"use client";

import { STATS } from "@/lib/constants/stats";
import { useCountUp } from "@/hooks/useCountUp";
import type { StatEntry } from "@/types";

function Stat({ stat }: { stat: StatEntry }) {
  const { ref, display } = useCountUp(stat.value);
  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-[28px] font-bold text-gold-400 sm:text-[34px]">{display}</div>
      <div className="mt-2 text-[11px] tracking-[0.8px] text-[#9aa4c0]">{stat.label}</div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="bg-navy-950 py-12">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-8 px-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0 lg:px-[60px]">
        {STATS.map((stat) => (
          <Stat key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
