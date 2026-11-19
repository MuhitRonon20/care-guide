"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SpecializationMetric } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital } from "lucide-react";

interface SpecializationBreakdownChartProps {
  data: SpecializationMetric[];
}

export function SpecializationBreakdownChart({ data }: SpecializationBreakdownChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <Card className="col-span-full md:col-span-1 shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Hospital className="h-4 w-4 text-indigo-600" />
          Specialty Staffing vs. Patient Volume
        </CardTitle>
        <CardDescription className="text-xs">
          Cross-department provider allocation and clinical demand
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="specialization"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={50}
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
                    const item = payload[0].payload as SpecializationMetric;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-dropdown text-xs">
                        <p className="font-semibold text-slate-900">{item.specialization}</p>
                        <p className="text-indigo-600 font-medium mt-0.5">
                          Doctors: {item.doctorCount}
                        </p>
                        <p className="text-teal-600 font-medium">
                          Patients: {item.patientCount}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: 11, paddingBottom: 10 }}
              />
              <Bar
                name="Doctors"
                dataKey="doctorCount"
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
              <Bar
                name="Patients"
                dataKey="patientCount"
                fill="#0D9488"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

