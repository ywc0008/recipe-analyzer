export interface RecipeAnalysis {
	ingredients: {
		name: string;
		quantity: string;
		calories?: number;
		protein?: number;
		carbs?: number;
		fat?: number;
	}[];
	totalCalories: number;
	macroRatio: {
		protein: number; // 단백질 비율 (%)
		carbs: number; // 탄수화물 비율 (%)
		fat: number; // 지방 비율 (%)
	};
	servingSuggestion: string;
	nutritionAdvice: string;
	error?: string;
}

export interface Recipe extends RecipeAnalysis {
	id: number;
	title: string;
	description: string | null;
	instructions: string;
	createdAt: Date;
	updatedAt: Date;
	userId: number;
	nutritionAnalysis?: {
		id: number;
		recipeId: number;
		totalCalories: number;
		totalProtein: number;
		totalCarbs: number;
		totalFat: number;
		proteinRatio: number;
		carbsRatio: number;
		fatRatio: number;
		servings: number;
		servingSuggestion: string | null;
		nutritionAdvice: string | null;
		aiGeneratedAdvice: string | null;
		createdAt: Date;
		updatedAt: Date;
	} | null;
	recipeIngredients?: {
		id: number;
		recipeId: number;
		ingredientId: number;
		quantity: number;
		ingredient: {
			id: number;
			name: string;
			caloriesPer100g: number | null;
			proteinPer100g: number | null;
			carbsPer100g: number | null;
			fatPer100g: number | null;
			unitOfMeasurement: string | null;
		};
	}[];
}
