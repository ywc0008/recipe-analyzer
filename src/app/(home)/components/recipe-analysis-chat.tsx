"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// 분석 결과 타입 정의
interface RecipeAnalysis {
	ingredients: {
		name: string;
		quantity: string;
		calories: number;
		protein: number;
		carbs: number;
		fat: number;
	}[];
	totalCalories: number;
	macroRatio: {
		protein: number;
		carbs: number;
		fat: number;
	};
	servingSuggestion: string;
	nutritionAdvice: string;
}

// 차트 데이터 타입 정의
interface MacroChartData {
	name: string;
	value: number;
	color: string;
}

export default function RecipeAnalysisChat() {
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [analysis, setAnalysis] = useState<RecipeAnalysis | null>(null);

	// API 직접 호출
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		setIsLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [{ role: "user", content: input }],
				}),
			});

			if (!response.ok) {
				throw new Error("API 응답 오류");
			}

			const data = await response.json();
			setAnalysis(data);
		} catch (error) {
			console.error("레시피 분석 오류:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// 탄단지 차트 데이터 생성
	const macroChartData: MacroChartData[] = analysis
		? [
				{
					name: "단백질",
					value: analysis.macroRatio.protein,
					color: "#FF8042",
				},
				{
					name: "탄수화물",
					value: analysis.macroRatio.carbs,
					color: "#0088FE",
				},
				{
					name: "지방",
					value: analysis.macroRatio.fat,
					color: "#FFBB28",
				},
			]
		: [];

	return (
		<div className="flex flex-col w-full max-w-4xl  mx-auto">
			<Card className="w-full mb-8">
				<CardHeader>
					<CardTitle>레시피 영양 분석기</CardTitle>
					<CardDescription>요리 레시피를 입력하면 재료, 칼로리, 영양소 비율을 분석해 드립니다.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<Textarea
							placeholder="레시피를 입력해주세요 (예: 재료, 조리법 등을 포함한 레시피)"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							rows={8}
							className="w-full p-4 resize-none overflow-auto max-h-60"
						/>
						<Button type="submit" disabled={isLoading || !input.trim()} className="w-full">
							{isLoading ? "분석 중..." : "레시피 분석하기"}
						</Button>
					</form>
				</CardContent>
			</Card>

			{isLoading ? <AnalysisSkeleton /> : analysis && <Analysis analysis={analysis} macroChartData={macroChartData} />}
		</div>
	);
}

function Analysis({ analysis, macroChartData }: { analysis: RecipeAnalysis; macroChartData: MacroChartData[] }) {
	return (
		<Card className="w-full mb-4">
			<CardHeader>
				<CardTitle>분석 결과</CardTitle>
				<CardDescription>{analysis.servingSuggestion}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-lg font-semibold mb-2">영양소 정보</h3>
						<div className="flex flex-col space-y-2">
							<div className="flex justify-between">
								<span>총 칼로리:</span>
								<span className="font-bold">{analysis.totalCalories} kcal</span>
							</div>
							<div className="flex justify-between">
								<span>탄수화물:</span>
								<span>{analysis.macroRatio.carbs}%</span>
							</div>
							<div className="flex justify-between">
								<span>단백질:</span>
								<span>{analysis.macroRatio.protein}%</span>
							</div>
							<div className="flex justify-between">
								<span>지방:</span>
								<span>{analysis.macroRatio.fat}%</span>
							</div>
						</div>

						<h3 className="text-lg font-semibold mt-6 mb-2">영양 조언</h3>
						<p className="text-sm">{analysis.nutritionAdvice}</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">영양소 비율</h3>
						<div className="h-64">
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
										label={({ name, percent }: { name: string; percent: number }) =>
											`${name} ${(percent * 100).toFixed(0)}%`
										}
									>
										{macroChartData.map((entry) => (
											<Cell key={`cell-${entry.name}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>

				<div className="mt-6">
					<h3 className="text-lg font-semibold mb-2">재료 영양 분석</h3>
					<div className="overflow-x-auto">
						<table className="w-full min-w-full table-auto border-collapse">
							<thead>
								<tr className="bg-accent/10">
									<th className="p-2 text-left">재료</th>
									<th className="p-2 text-left">양</th>
									<th className="p-2 text-left">칼로리</th>
									<th className="p-2 text-left">단백질</th>
									<th className="p-2 text-left">탄수화물</th>
									<th className="p-2 text-left">지방</th>
								</tr>
							</thead>
							<tbody>
								{analysis.ingredients.map((ingredient) => (
									<tr key={`ingredient-${ingredient.name}`} className="border-b border-accent/20">
										<td className="p-2">{ingredient.name}</td>
										<td className="p-2">{ingredient.quantity}</td>
										<td className="p-2">{ingredient.calories} kcal</td>
										<td className="p-2">{ingredient.protein} g</td>
										<td className="p-2">{ingredient.carbs} g</td>
										<td className="p-2">{ingredient.fat} g</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function AnalysisSkeleton() {
	return (
		<Card className="w-full mb-4">
			<CardHeader>
				<Skeleton className="h-7 w-32" />
				<Skeleton className="h-5 w-48 mt-2" />
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<Skeleton className="h-6 w-28 mb-4" />

						{/* 영양소 정보 스켈레톤 */}
						<div className="flex flex-col space-y-4">
							{[1, 2, 3, 4].map((i) => (
								<div key={`skeleton-info-${i}`} className="flex justify-between">
									<Skeleton className="h-5 w-20" />
									<Skeleton className="h-5 w-16" />
								</div>
							))}
						</div>

						{/* 영양 조언 스켈레톤 */}
						<Skeleton className="h-6 w-28 my-4" />
						<Skeleton className="h-20 w-full" />
					</div>

					<div>
						{/* 차트 영역 스켈레톤 */}
						<Skeleton className="h-6 w-32 mb-4" />
						<div className="h-64 flex items-center justify-center">
							<Skeleton className="h-40 w-40 rounded-full" />
						</div>
					</div>
				</div>

				{/* 재료 영양 분석 테이블 스켈레톤 */}
				<div className="mt-6">
					<Skeleton className="h-6 w-36 mb-4" />
					<div className="overflow-x-auto">
						<table className="w-full min-w-full table-auto border-collapse">
							<thead>
								<tr className="bg-accent/10">
									{["재료", "양", "칼로리", "단백질", "탄수화물", "지방"].map((header) => (
										<th key={`skeleton-header-${header}`} className="p-2 text-left">
											<Skeleton className="h-5 w-16" />
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{[1, 2, 3, 4, 5].map((row) => (
									<tr key={`skeleton-row-${row}`} className="border-b border-accent/20">
										{[1, 2, 3, 4, 5, 6].map((cell) => (
											<td key={`skeleton-cell-${row}-${cell}`} className="p-2">
												<Skeleton className="h-5 w-16" />
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
