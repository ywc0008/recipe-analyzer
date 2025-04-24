"use client";

import type { MacroChartData } from "@/types/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

type CircleChartProps = {
	macroChartData: MacroChartData[];
};

export default function CircleChart({ macroChartData }: CircleChartProps) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<PieChart>
				<Pie
					data={macroChartData}
					cx="50%"
					cy="50%"
					labelLine={false}
					outerRadius={80}
					fill="#8884d8"
					dataKey="value"
					label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(1)}%`}
				>
					{macroChartData.map((entry) => (
						<Cell key={`cell-${entry.name}`} fill={entry.color} />
					))}
				</Pie>
				<Tooltip />
				<Legend />
			</PieChart>
		</ResponsiveContainer>
	);
}
