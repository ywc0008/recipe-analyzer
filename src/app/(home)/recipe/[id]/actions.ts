"use server";

import type { Session } from "@/types/session";

import { prisma } from "@/prisma";

export async function getRecipeDetailAction(recipeId: number, session: Session | null) {
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

		// 레시피 상세 정보 가져오기
		const recipe = await prisma.recipes.findUnique({
			where: {
				id: recipeId,
				userId: user.id, // 사용자의 레시피만 가져오도록 제한
			},
			include: {
				nutritionAnalysis: true,
				recipeIngredients: {
					include: {
						ingredient: true,
					},
				},
			},
		});

		if (!recipe) {
			throw new Error("레시피를 찾을 수 없습니다");
		}

		return { success: true, recipe };
	} catch (error) {
		console.error("레시피 상세 조회 오류:", error);
		throw new Error("레시피 상세 조회 중 오류가 발생했습니다");
	}
}
