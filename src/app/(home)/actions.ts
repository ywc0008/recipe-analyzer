"use server";

import type { Session } from "@/types/session";
import type { RecipeAnalysis } from "@/types/recipe";

import { prisma } from "@/prisma";

type SaveRecipeProps = {
	session: Session;
	title: string;
	description?: string;
	instructions: string;
	analysis: RecipeAnalysis;
};

export async function saveRecipeAction({ session, title, description, instructions, analysis }: SaveRecipeProps) {
	if (!session || !session.user?.email) {
		throw new Error("로그인이 필요합니다");
	}

	try {
		// 사용자 찾기
		const user = await prisma.users.findUnique({
			where: {
				email: session.user.email,
			},
		});

		if (!user) {
			throw new Error("사용자를 찾을 수 없습니다");
		}

		// 레시피 생성
		const recipe = await prisma.recipes.create({
			data: {
				title,
				description,
				instructions,
				userId: user.id,
			},
		});

		// 영양 분석 정보 저장
		await prisma.nutritionAnalysis.create({
			data: {
				recipeId: recipe.id,
				totalCalories: analysis.totalCalories,
				totalProtein: analysis.ingredients.reduce((sum, ingredient) => sum + (ingredient.protein || 0), 0),
				totalCarbs: analysis.ingredients.reduce((sum, ingredient) => sum + (ingredient.carbs || 0), 0),
				totalFat: analysis.ingredients.reduce((sum, ingredient) => sum + (ingredient.fat || 0), 0),
				proteinRatio: analysis.macroRatio.protein,
				carbsRatio: analysis.macroRatio.carbs,
				fatRatio: analysis.macroRatio.fat,
				servingSuggestion: analysis.servingSuggestion,
				nutritionAdvice: analysis.nutritionAdvice,
			},
		});

		// 재료 정보 저장
		for (const ingredient of analysis.ingredients) {
			// 기존 재료 확인 또는 생성
			let ingredientRecord = await prisma.ingredients.findUnique({
				where: {
					name: ingredient.name,
				},
			});

			if (!ingredientRecord) {
				ingredientRecord = await prisma.ingredients.create({
					data: {
						name: ingredient.name,
						caloriesPer100g: ingredient.calories,
						proteinPer100g: ingredient.protein,
						carbsPer100g: ingredient.carbs,
						fatPer100g: ingredient.fat,
					},
				});
			}

			// 레시피-재료 관계 생성
			await prisma.recipeIngredients.create({
				data: {
					recipeId: recipe.id,
					ingredientId: ingredientRecord.id,
					quantity: Number.parseFloat(ingredient.quantity) || 0,
				},
			});
		}

		return { success: true, recipeId: recipe.id };
	} catch (error) {
		console.error("레시피 저장 오류:", error);
		throw new Error("레시피 저장 중 오류가 발생했습니다");
	}
}
