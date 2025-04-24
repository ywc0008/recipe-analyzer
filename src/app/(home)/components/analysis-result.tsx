import type { Session } from "@/types/session";
import type { MacroChartData } from "@/types/chart";
import type { RecipeAnalysis } from "@/types/recipe";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CircleChart from "@/components/common/circle-chart";

import SaveButton from "./save-button";

type AnalysisResultProps = {
	session: Session;
	analysis: RecipeAnalysis;
	macroChartData: MacroChartData[];
	recipeInput?: string;
};

export function AnalysisResult({ session, analysis, macroChartData, recipeInput }: AnalysisResultProps) {
	return (
		<Card className="w-full mb-4">
			<CardHeader>
				{recipeInput && <SaveButton session={session} analysis={analysis} recipeInput={recipeInput} />}
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
							<CircleChart macroChartData={macroChartData} />
						</div>
					</div>
				</div>

				<div className="mt-6">
					<h3 className="text-lg font-semibold mb-2">재료 영양 분석</h3>
					<div className="overflow-x-auto">
						<Table className="w-full min-w-full">
							<TableHeader>
								<TableRow className="bg-accent/10">
									<TableHead className="p-2 text-center">재료</TableHead>
									<TableHead className="p-2 text-center">양</TableHead>
									<TableHead className="p-2 text-center">칼로리</TableHead>
									<TableHead className="p-2 text-center">단백질</TableHead>
									<TableHead className="p-2 text-center">탄수화물</TableHead>
									<TableHead className="p-2 text-center">지방</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{analysis.ingredients.map((ingredient) => (
									<TableRow key={`ingredient-${ingredient.name}`} className="border-b border-accent/20">
										<TableCell className="p-2 text-center">{ingredient.name}</TableCell>
										<TableCell className="p-2 text-center">{ingredient.quantity}</TableCell>
										<TableCell className="p-2 text-center">{ingredient.calories} kcal</TableCell>
										<TableCell className="p-2 text-center">{ingredient.protein} g</TableCell>
										<TableCell className="p-2 text-center">{ingredient.carbs} g</TableCell>
										<TableCell className="p-2 text-center">{ingredient.fat} g</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function AnalysisResultSkeleton() {
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
