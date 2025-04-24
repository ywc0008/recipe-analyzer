import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";

import { getUserRecipesAction } from "./actions";
import RecipeCardComponent from "./components/recipe-card-component";

export default async function MyPage() {
	const session = await auth();

	if (!session) {
		redirect("/");
	}

	const { recipes } = await getUserRecipesAction(session);

	return (
		<div className="container py-10 mx-auto">
			<h1 className="text-3xl font-bold mb-6">마이페이지</h1>
			<h2 className="text-2xl font-semibold mb-4">내 저장 레시피</h2>

			{recipes.length === 0 ? (
				<div className="bg-muted/30 rounded-lg p-10 text-center">
					<p className="text-muted-foreground mb-4">저장된 레시피가 없습니다.</p>
					<Button asChild>
						<Link href="/">레시피 분석하러 가기</Link>
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{recipes.map((recipe) => (
						<RecipeCardComponent key={recipe.id} recipe={recipe} />
					))}
				</div>
			)}
		</div>
	);
}
