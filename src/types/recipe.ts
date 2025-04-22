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
