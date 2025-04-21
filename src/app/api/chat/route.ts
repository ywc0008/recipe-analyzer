import { openai } from "@ai-sdk/openai";
import { generateObject, streamObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 300;

interface RecipeAnalysis {
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
}

export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = streamObject({
		model: openai("gpt-4o"),
		schema: z.object({
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
		}),
		prompt: messages[0].content,
	});

	return result.toTextStreamResponse();
}
