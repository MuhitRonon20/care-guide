import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MotionCardHover } from "@/components/shared/motion-wrapper";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  accentColor?: "blue" | "teal" | "amber" | "indigo" | "rose";
}

const colorMap = {
  blue: {
    iconBg: "bg-sky-50 text-sky-600 border-sky-100",
    border: "hover:border-sky-300",
  },
  teal: {
    iconBg: "bg-teal-50 text-teal-600 border-teal-100",
    border: "hover:border-teal-300",
  },
  amber: {
    iconBg: "bg-amber-50 text-amber-600 border-amber-100",
    border: "hover:border-amber-300",
  },
  indigo: {
    iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
    border: "hover:border-indigo-300",
  },
  rose: {
    iconBg: "bg-rose-50 text-rose-600 border-rose-100",
    border: "hover:border-rose-300",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  accentColor = "blue",
}: StatCardProps) {
  const colors = colorMap[accentColor];

  return (
    <MotionCardHover>
      <Card className={cn("overflow-hidden transition-all duration-200 border-slate-200/90 hover:shadow-card-hover", colors.border)}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {title}
            </span>
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border p-2", colors.iconBg)}>
              <Icon className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {value}
            </span>
            {trend && (
              <span
                className={cn(
                  "text-[11px] font-semibold px-1.5 py-0.5 rounded",
                  trend.isPositive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                )}
              >
                {trend.value}
              </span>
            )}
          </div>

          {description && (
            <p className="mt-1 text-xs text-muted-foreground truncate">{description}</p>
          )}
        </CardContent>
      </Card>
    </MotionCardHover>
  );
}

