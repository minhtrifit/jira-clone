"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", completed: 186, overdue: 80 },
  { month: "February", completed: 305, overdue: 200 },
  { month: "March", completed: 237, overdue: 120 },
  { month: "April", completed: 73, overdue: 190 },
  { month: "May", completed: 209, overdue: 130 },
  { month: "June", completed: 214, overdue: 140 },
];

const chartConfig = {
  completed: {
    label: "Completed Tasks",
    color: "hsl(var(--chart-2))",
  },
  overdue: {
    label: "Overdue Tasks",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const TasksLineChart = () => {
  return (
    <Card className="basis-full rounded-sm">
      <CardHeader>
        <CardTitle>Completion Ability</CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="completed"
              type="monotone"
              stroke="var(--color-completed)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="overdue"
              type="monotone"
              stroke="var(--color-overdue)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default TasksLineChart;
