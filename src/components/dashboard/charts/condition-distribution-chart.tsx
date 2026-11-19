"use client";

import React from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ConditionDistributionMetric } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface ConditionDistributionChartProps {
  data: ConditionDistributionMetric[];
}

export function ConditionDistributionChart({ data }: ConditionDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-full md:col-span-1 shadow-card">
        <CardHeader>
          <CardTitle className="text-sm">Patient Condition Categories</CardTitle>
          <CardDescription>Clinical diagnoses breakdown</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-xs text-muted-foreground">
          No condition categorization data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full md:col-span-1 shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Activity className="h-4 w-4 text-sky-600" />
          Condition Categories
        </CardTitle>
        <CardDescription className="text-xs">
          Patient diagnosis and clinical distribution
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as ConditionDistributionMetric;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-dropdown text-xs">
                        <p className="font-semibold text-slate-900">{item.condition}</p>
                        <p className="text-slate-600 font-medium mt-0.5">
                          {item.count} Patients ({item.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="condition"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#0284C7"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Legend Grid */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 max-h-36 overflow-y-auto">
          {data.map((item) => (
            <div key={item.condition} className="flex items-center gap-2 text-xs">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate text-slate-600 text-[11px] font-medium" title={item.condition}>
                {item.condition}
              </span>
              <span className="ml-auto font-semibold text-slate-800 text-[11px]">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

