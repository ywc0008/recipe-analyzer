"use client";

import type { Session } from "@/types/session";
import type { MacroChartData } from "@/types/chart";
import type { RecipeAnalysis } from "@/types/recipe";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import ErrorMessageCard from "./error-message-card";
import { AnalysisResult, AnalysisResultSkeleton } from "./analysis-result";

type RecipeAnalysisChatProps = {
	session: Session;
};

export default function RecipeAnalysisChat({ session }: RecipeAnalysisChatProps) {
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [analysis, setAnalysis] = useState<RecipeAnalysis>();
	const [isAPIError, setIsAPIError] = useState(false);
	const [shortcut, setShortcut] = useState("");

	useEffect(() => {
		const platform = navigator.platform.toLowerCase();
		const isMac = platform.includes("mac");
		if (isMac) {
			setShortcut("⌘ + Enter");
		} else {
			setShortcut("Ctrl + Enter");
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			const isMac = platform.includes("mac");
			if ((isMac ? event.metaKey : event.ctrlKey) && event.key === "Enter") {
				event.preventDefault();
				event.stopPropagation();

				if (input.trim() && !isLoading) {
					setIsAPIError(false);
					callChatAPI();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [input, isLoading]);

	// API 호출 함수
	const callChatAPI = async () => {
		if (!input.trim() || isLoading) return;

		setIsLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [{ role: "user", content: input }],
				}),
			});

			const data = await response.json();

			if (!response.ok || (data.response && data.response.ok === false)) {
				setIsAPIError(true);
				setAnalysis(data);
			} else {
				setAnalysis(data);
			}
		} catch (error) {
			console.error("레시피 분석 오류:", error);
			setIsAPIError(true);
			setAnalysis(undefined);
		} finally {
			setIsLoading(false);
		}
	};

	// API 직접 호출
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsAPIError(false);
		callChatAPI();
	};

	const handleRetry = () => {
		setIsAPIError(false);
		setAnalysis(undefined);
		setInput("");
	};

	// 탄단지 차트 데이터 생성
	const macroChartData: MacroChartData[] = analysis
		? [
				{
					name: "단백질",
					value: analysis.macroRatio.protein,
					color: "#FF8042",
				},
				{
					name: "탄수화물",
					value: analysis.macroRatio.carbs,
					color: "#0088FE",
				},
				{
					name: "지방",
					value: analysis.macroRatio.fat,
					color: "#FFBB28",
				},
			]
		: [];

	return (
		<div className="flex flex-col w-full max-w-4xl mx-auto">
			<Card className="w-full mb-8">
				<CardHeader>
					<CardTitle>레시피 영양 분석기</CardTitle>
					<CardDescription>요리 레시피를 입력하면 재료, 칼로리, 영양소 비율을 분석해 드립니다.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<Textarea
							placeholder="예시: 김치찌개 (재료: 김치 300g, 돼지고기 200g, 두부 1모, 대파 1대, 고춧가루 1큰술, 간장 1큰술, 설탕 1작은술, 물 2컵 / 조리법: 1. 김치를 적당한 크기로 썰어주세요. 2. 냄비에 김치와 돼지고기를 넣고 볶아주세요. 3. 물을 부어 끓인 후 두부와 대파를 넣어주세요. 4. 간장, 고춧가루, 설탕으로 간을 맞춰주세요.)"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							rows={8}
							className="w-full p-4 resize-none overflow-auto max-h-60"
						/>
						<TooltipProvider delayDuration={300}>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button type="submit" disabled={isLoading || !input.trim()} className="w-full">
										{isLoading ? "분석 중..." : "레시피 분석하기"}
									</Button>
								</TooltipTrigger>
								<TooltipContent side="bottom" align="end">
									<p>{shortcut}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</form>
				</CardContent>
			</Card>

			{isAPIError && <ErrorMessageCard analysis={analysis} handleRetry={handleRetry} />}

			{isLoading ? (
				<AnalysisResultSkeleton />
			) : (
				analysis && (
					<AnalysisResult session={session} analysis={analysis} macroChartData={macroChartData} recipeInput={input} />
				)
			)}
		</div>
	);
}
