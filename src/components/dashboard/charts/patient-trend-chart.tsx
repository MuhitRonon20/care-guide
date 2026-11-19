"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PatientTrendPoint } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface PatientTrendChartProps {
  data: PatientTrendPoint[];
}

export function PatientTrendChart({ data }: PatientTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm">Patient Registration Trend</CardTitle>
          <CardDescription>Timeline of new clinical admissions</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-xs text-muted-foreground">
          No registration history recorded yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2 shadow-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Patient Registration Timeline
          </CardTitle>
          <CardDescription className="text-xs">
            Cumulative patient enrollment progression across hospital departments
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="patientTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="formattedDate"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as PatientTrendPoint;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-dropdown text-xs">
                        <p className="font-semibold text-slate-900">{item.formattedDate}</p>
                        <p className="text-sky-600 font-medium mt-0.5">
                          New Patients: {item.newPatients}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          Total Cumulative: {item.cumulativeTotal}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulativeTotal"
                name="Cumulative Patients"
                stroke="#0284C7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#patientTrendGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

