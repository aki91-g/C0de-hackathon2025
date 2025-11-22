"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ---- グラフコンポーネント ----
function ChartBase({
  data,
  color,
}: {
  data: { date: string; value: number }[];
  color: string;
}) {
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;
  const yMax = maxValue > 0 ? Math.ceil(maxValue / 10) * 10 : 10;

  return (
    <div className="w-full h-72 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, yMax]} allowDecimals={false} tickCount={6} />
          <Tooltip />
          <Bar dataKey="value" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type GraphProps = {
  values1: { date: string; value: number }[];
  values2: { date: string; value: number }[];
  values3: { date: string; value: number }[];
  cost: number;
  reads: number;
};

// ---- メインコンポーネント ----
export default function WeekGraph({
  values1,
  values2,
  values3,
  cost,
  reads,
}: GraphProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
        <div>
          <h1 className="text-4xl font-bold mb-6 text-center">現在の積読量</h1>
          <h1 className="text-8xl font-bold mb-6 text-center text-red-600">
            {values1.length > 0 ? values1[values1.length - 1].value : 0}冊
          </h1>
        </div>
        <div className="py-4">
          <h1 className="text-4xl font-bold mb-6 text-center">
            現在の積読総額
          </h1>
          <h1 className="text-7xl font-bold mb-6 text-center text-red-600">
            {cost}円
          </h1>
        </div>
        <div className="py-4">
          <h1 className="text-4xl font-bold mb-6 text-center">読了本</h1>
          <h1 className="text-8xl font-bold mb-6 text-center text-blue-700">
            {reads}冊
          </h1>
        </div>
      <h1 className="text-2xl font-bold mb-6 text-left">積読グラフ</h1>

      <Tabs defaultValue="total" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="total">積読総量</TabsTrigger>
          <TabsTrigger value="purchased">購入冊数</TabsTrigger>
          <TabsTrigger value="read">読了冊数</TabsTrigger>
        </TabsList>

        <TabsContent value="total">
          <ChartBase data={values1} color="red" />
        </TabsContent>

        <TabsContent value="purchased">
          <ChartBase data={values2} color="orange" />
        </TabsContent>

        <TabsContent value="read">
          <ChartBase data={values3} color="blue" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
