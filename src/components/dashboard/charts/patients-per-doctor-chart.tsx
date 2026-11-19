"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PatientsPerDoctorMetric } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users2 } from "lucide-react";

interface PatientsPerDoctorChartProps {
  data: PatientsPerDoctorMetric[];
}

export function PatientsPerDoctorChart({ data }: PatientsPerDoctorChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm">Patients per Doctor</CardTitle>
          <CardDescription>Caseload distribution by provider</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-xs text-muted-foreground">
          No doctor caseload data available.
        </CardContent>
      </Card>
    );
  }

  // Abbreviate doctor names for compact Y-axis presentation
  const formattedData = data.slice(0, 6).map((item) => ({
    ...item,
    displayName: item.doctorName.replace("Prof. ", "").replace("Dr. ", ""),
  }));

  return (
    <Card className="col-span-full lg:col-span-1 shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Users2 className="h-4 w-4 text-teal-600" />
          Patients per Doctor
        </CardTitle>
        <CardDescription className="text-xs">
          Top physician caseload distribution
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" stroke="#64748B" fontSize={11} allowDecimals={false} />
              <YAxis
                dataKey="displayName"
                type="category"
                stroke="#64748B"
                fontSize={11}
                width={85}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as PatientsPerDoctorMetric;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-dropdown text-xs">
                        <p className="font-semibold text-slate-900">{item.doctorName}</p>
                        <p className="text-slate-500 text-[11px]">{item.specialization}</p>
                        <p className="text-teal-600 font-bold mt-1">
                          {item.patientCount} Patients Assigned
                        </p>
                        <p className="text-slate-400 text-[10px] mt-0.5">{item.hospital}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="patientCount"
                fill="#0D9488"
                radius={[0, 4, 4, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

