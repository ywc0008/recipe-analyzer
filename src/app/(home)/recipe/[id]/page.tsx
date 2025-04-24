import type { MacroChartData } from "@/types/chart";

import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { getRecipeDetailAction } from "./actions";
import { AnalysisResult } from "@/app/(home)/components/analysis-result";

type RecipeDetailPageProps = {
	params: Promise<{ id: string }>;
};

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
	const session = await auth();

	if (!session) {
		redirect("/");
	}

	const { id } = await params;

	const recipeId = Number(id);

	try {
		const { recipe } = await getRecipeDetailAction(recipeId, session);

		if (!recipe) {
			redirect("/my");
		}

		// 매크로 차트 데이터 생성
		const macroChartData: MacroChartData[] = [
			{
				name: "단백질",
				value: recipe.nutritionAnalysis?.proteinRatio || 0,
				color: "#FF8042",
			},
			{
				name: "탄수화물",
				value: recipe.nutritionAnalysis?.carbsRatio || 0,
				color: "#0088FE",
			},
			{
				name: "지방",
				value: recipe.nutritionAnalysis?.fatRatio || 0,
				color: "#FFBB28",
			},
		];

		// RecipeAnalysis로 변환
		const analysisData = {
			ingredients:
				recipe.recipeIngredients?.map((item) => ({
					name: item.ingredient.name,
					quantity: `${item.quantity}g`,
					calories: item.ingredient.caloriesPer100g ? (item.ingredient.caloriesPer100g * item.quantity) / 100 : 0,
					protein: item.ingredient.proteinPer100g ? (item.ingredient.proteinPer100g * item.quantity) / 100 : 0,
					carbs: item.ingredient.carbsPer100g ? (item.ingredient.carbsPer100g * item.quantity) / 100 : 0,
					fat: item.ingredient.fatPer100g ? (item.ingredient.fatPer100g * item.quantity) / 100 : 0,
				})) || [],
			totalCalories: recipe.nutritionAnalysis?.totalCalories || 0,
			macroRatio: {
				protein: recipe.nutritionAnalysis?.proteinRatio || 0,
				carbs: recipe.nutritionAnalysis?.carbsRatio || 0,
				fat: recipe.nutritionAnalysis?.fatRatio || 0,
			},
			servingSuggestion: recipe.nutritionAnalysis?.servingSuggestion || "",
			nutritionAdvice: recipe.nutritionAnalysis?.nutritionAdvice || "",
		};

		return (
			<div className="container py-10 mx-auto">
				<div className="flex items-center mb-6">
					<Button variant="ghost" size="sm" asChild className="gap-1">
						<Link href="/my">
							<ArrowLeftIcon className="h-4 w-4" />
							마이페이지로 돌아가기
						</Link>
					</Button>
				</div>
				<div className="mb-6">
					<h1 className="text-3xl font-bold">{recipe.title}</h1>
					{recipe.description && <p className="text-muted-foreground mt-2">{recipe.description}</p>}
					<div className="flex items-center gap-2 mt-2">
						<Badge variant="outline">{new Date(recipe.createdAt).toLocaleDateString("ko-KR")}</Badge>
					</div>
				</div>

				<AnalysisResult session={session} analysis={analysisData} macroChartData={macroChartData} />
			</div>
		);
	} catch (error) {
		console.error("레시피 상세 정보 조회 중 오류 발생:", error);
		redirect("/my");
	}
}
