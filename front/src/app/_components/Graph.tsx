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

// ---- モックデータ生成 ----
// 直近1週間の日付配列
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }
  return days;
}

const labels: string[] = getLast7Days();

// 積読総量（例：累積していくイメージ）
const tsundokuTotal = labels.map((label, i) => ({
  date: label,
  value: 30 + i * 2, // モック値
}));

// 新規購入冊数（毎日変動するイメージ）
const purchasedBooks = labels.map((label) => ({
  date: label,
  value: Math.floor(Math.random() * 4),
}));

// 読了冊数（毎日変動）
const readBooks = labels.map((label) => ({
  date: label,
  value: Math.floor(Math.random() * 3),
}));

// ---- グラフコンポーネント ----
function ChartBase({ data, color }: { data: { date: string; value: number }[], color: string }) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const yMax = Math.ceil(maxValue / 10) * 10;

  return (
    <div className="w-full h-72 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, yMax]} allowDecimals={false} tickCount={6}/>
          <Tooltip />
          <Bar dataKey="value" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---- メインコンポーネント ----
export default function WeekGraph() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h1 className="text-4xl font-bold mb-6 text-center">現在の積読量</h1>
      <h1 className="text-9xl font-bold mb-6 text-center text-red-600">{tsundokuTotal[tsundokuTotal.length-1].value}冊</h1>
      <h1 className="text-2xl font-bold mb-6 text-left">積読グラフ</h1>

      <Tabs defaultValue="total" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="total">積読総量</TabsTrigger>
          <TabsTrigger value="purchased">購入冊数</TabsTrigger>
          <TabsTrigger value="read">読了冊数</TabsTrigger>
        </TabsList>

        <TabsContent value="total">
          <ChartBase data={tsundokuTotal} color="red" />
        </TabsContent>

        <TabsContent value="purchased">
          <ChartBase data={purchasedBooks} color="orange" />
        </TabsContent>

        <TabsContent value="read">
          <ChartBase data={readBooks} color="blue" />
        </TabsContent>
      </Tabs>
    </div>
  );
}