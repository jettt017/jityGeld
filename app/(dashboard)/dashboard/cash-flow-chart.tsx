"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { MonthlyData } from "@/types";

interface CashFlowChartProps {
  data: MonthlyData[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Monthly Cash Flow</CardTitle>
        <CardDescription>Income vs Expense over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            No transaction data yet
          </div>
        ) : (
          <div style={{ width: "100%", height: 300, minWidth: 0, minHeight: 300 }}>
            {isMounted ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      new Intl.NumberFormat("id-ID", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(v)
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    formatter={(value: unknown) =>
                      new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(value))
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="hsl(160, 60%, 45%)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="hsl(0, 65%, 55%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-[300px] bg-muted/10 animate-pulse rounded-2xl" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
