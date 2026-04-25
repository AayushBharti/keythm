"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { WpmSnapshot } from "@/lib/types";

const chartConfig: ChartConfig = {
  wpm: {
    label: "WPM",
    color: "var(--color-primary)",
  },
  raw: {
    label: "Raw",
    color: "hsl(var(--muted-foreground))",
  },
};

export function WpmChart({ history }: { history: WpmSnapshot[] }) {
  const data = useMemo(
    () =>
      history.map((d) => ({
        second: d.second,
        wpm: d.wpm,
        raw: d.raw,
        errors: d.errors > 0 ? d.errors : undefined,
      })),
    [history]
  );

  const maxVal = Math.max(...history.map((d) => d.raw), 10);

  return (
    <ChartContainer className="h-full w-full" config={chartConfig}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid
          stroke="currentColor"
          strokeOpacity={0.06}
          vertical={false}
        />
        <XAxis
          axisLine={false}
          dataKey="second"
          interval="preserveStartEnd"
          tick={{ fontSize: 11, fill: "currentColor", opacity: 0.35 }}
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          domain={[0, Math.ceil(maxVal * 1.2)]}
          tick={{ fontSize: 11, fill: "currentColor", opacity: 0.35 }}
          tickLine={false}
          width={36}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => [
                <span className="font-bold font-mono" key={name}>
                  {value}
                </span>,
                name === "wpm" ? "WPM" : "Raw",
              ]}
            />
          }
          cursor={{
            stroke: "currentColor",
            strokeOpacity: 0.15,
            strokeWidth: 1,
          }}
        />
        <Line
          activeDot={{ r: 3, strokeWidth: 0 }}
          dataKey="raw"
          dot={false}
          isAnimationActive={false}
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={1.5}
          type="monotone"
        />
        <Line
          activeDot={{ r: 5, strokeWidth: 0 }}
          animationDuration={600}
          animationEasing="ease-out"
          dataKey="wpm"
          dot={{ r: 3, fill: "var(--color-primary)", strokeWidth: 0 }}
          stroke="var(--color-primary)"
          strokeWidth={2}
          type="monotone"
        />
      </LineChart>
    </ChartContainer>
  );
}
