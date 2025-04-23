import { z } from "zod";
import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

const RecipeAnalysisSchema = z.object({
	ingredients: z.array(
		z.object({
			name: z.string(),
			quantity: z.string(),
			calories: z.number(),
			protein: z.number(),
			carbs: z.number(),
			fat: z.number(),
		}),
	),
	totalCalories: z.number(),
	macroRatio: z.object({
		protein: z.number(),
		carbs: z.number(),
		fat: z.number(),
	}),
	servingSuggestion: z.string(),
	nutritionAdvice: z.string(),
	isRecipe: z.boolean().default(true),
	errorMessage: z.string().optional(),
});

type RecipeAnalysis = z.infer<typeof RecipeAnalysisSchema>;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// 레시피 검증
async function isRecipeMessage(message: string) {
	if (message.length < 20) {
		return false;
	}
	return true;
}

export async function POST(req: Request): Promise<Response> {
	const { messages } = await req.json();

	const isRecipe = await isRecipeMessage(messages[0].content);

	// 레시피가 아닌 경우
	if (!isRecipe)
		return NextResponse.json({
			error: "레시피가 아닌 거 같습니다.",
			response: { ok: false, message: "레시피 형식이 아닙니다. 음식 레시피를 입력해주세요." },
			status: 400,
			isRecipe: false,
			macroRatio: {
				protein: 0,
				carbs: 0,
				fat: 0,
			},
			totalCalories: 0,
			ingredients: [],
			servingSuggestion: "",
			nutritionAdvice: "레시피를 다시 입력해주세요.",
		});

	// 레시피인 경우
	const result = streamObject<RecipeAnalysis>({
		model: openai("gpt-4o"),
		schema: RecipeAnalysisSchema,
		system:
			"You are a helpful assistant that analyzes recipes and provides nutritional information." +
			"your response should be in korean." +
			"너가 탄수화물, 단백질, 지방의 칼로리 비율을 계산할 때 합계가 100%가 되도록 계산해야 한다." +
			"퍼센트는 소수점 첫째자리까지 계산해야 한다.",
		prompt: messages[0].content,
	});

	return result.toTextStreamResponse();
}
