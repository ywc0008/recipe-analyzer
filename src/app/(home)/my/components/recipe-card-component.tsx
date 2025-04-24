import Link from "next/link";
import { CalendarIcon, ArrowRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recipe } from "@/types/recipe";

type RecipeCardComponentProps = {
	recipe: Recipe;
};

export default function RecipeCardComponent({ recipe }: RecipeCardComponentProps) {
	return (
		<Link key={recipe.id} href={`/recipe/${recipe.id}`} className="block transition-all hover:scale-[1.02]">
			<Card className="h-full flex flex-col">
				<CardHeader>
					<CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
					<CardDescription className="flex items-center gap-1 text-xs">
						<CalendarIcon className="h-3 w-3" />
						{new Date(recipe.createdAt).toLocaleDateString("ko-KR")}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex-1">
					{recipe.description && (
						<p className="text-sm text-muted-foreground line-clamp-2 mb-4">{recipe.description}</p>
					)}

					{recipe.nutritionAnalysis && (
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<span className="text-sm">총 칼로리:</span>
								<Badge variant="outline">{recipe.nutritionAnalysis.totalCalories} kcal</Badge>
							</div>
							<div className="flex justify-between">
								<span className="text-sm">영양소 비율:</span>
								<div className="flex gap-1">
									<Badge variant="secondary" className="text-xs">
										탄수화물 {recipe.nutritionAnalysis.carbsRatio}%
									</Badge>
									<Badge variant="secondary" className="text-xs">
										단백질 {recipe.nutritionAnalysis.proteinRatio}%
									</Badge>
									<Badge variant="secondary" className="text-xs">
										지방 {recipe.nutritionAnalysis.fatRatio}%
									</Badge>
								</div>
							</div>
						</div>
					)}
				</CardContent>
				<CardFooter className="pt-2 border-t">
					<Button variant="ghost" size="sm" className="ml-auto gap-1">
						자세히 보기 <ArrowRightIcon className="h-4 w-4" />
					</Button>
				</CardFooter>
			</Card>
		</Link>
	);
}
