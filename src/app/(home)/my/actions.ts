import type { Recipe } from "@/types/recipe";
import type { Session } from "@/types/session";

import { prisma } from "@/prisma";

export async function getUserRecipesAction(session: Session): Promise<{ success: boolean; recipes: Recipe[] }> {
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

		// 사용자의 모든 레시피 가져오기 (영양 분석 정보 포함)
		const recipes = await prisma.recipes.findMany({
			where: {
				userId: user.id,
			},
			include: {
				nutritionAnalysis: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return { success: true, recipes: recipes as unknown as Recipe[] };
	} catch (error) {
		console.error("레시피 조회 오류:", error);
		throw new Error("레시피 조회 중 오류가 발생했습니다");
	}
}
