"use client";

import type { RecipeAnalysis } from "@/types/recipe";

import { useEffect, useState } from "react";
import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ErrorMessageCardProps = {
	analysis?: RecipeAnalysis;
	handleRetry: () => void;
};

export default function ErrorMessageCard({ analysis, handleRetry }: ErrorMessageCardProps) {
	const [shortcut, setShortcut] = useState("");

	useEffect(() => {
		const platform = navigator.platform.toLowerCase();
		const isMac = platform.includes("mac");
		if (isMac) {
			setShortcut("⌘ + R");
		} else {
			setShortcut("Ctrl + R");
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			const isMac = platform.includes("mac");
			if ((isMac ? event.metaKey : event.ctrlKey) && event.key === "r") {
				event.preventDefault();
				event.stopPropagation();
				handleRetry();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleRetry]);

	return (
		<Card className="w-full mb-8 border-2 border-destructive bg-destructive/5">
			<CardContent className="pt-6 pb-4 space-y-4">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-full bg-destructive/10">
						<AlertCircleIcon className="h-6 w-6 text-destructive" />
					</div>
					<CardTitle className="text-destructive text-xl">레시피 인식 오류</CardTitle>
				</div>
				<CardDescription className="text-base font-medium text-destructive/90">
					{analysis?.error || "레시피 분석 중 오류가 발생했습니다."}
				</CardDescription>
				<div className="bg-white/50 p-4 rounded-md border border-destructive/20 text-muted-foreground">
					<p className="text-sm">💡 올바른 레시피 예시:</p>
					<ul className="text-sm list-disc list-inside mt-1 ml-2 space-y-1">
						<li>재료와 양을 명확히 포함시켜 주세요 (예: 밀가루 200g, 계란 2개)</li>
						<li>조리 방법도 간단히 포함하면 더 좋습니다</li>
						<li>충분한 길이의 텍스트를 입력해주세요</li>
					</ul>
				</div>
				<TooltipProvider delayDuration={300}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
								onClick={handleRetry}
							>
								다시 시도하기
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" align="end">
							<p>{shortcut}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</CardContent>
		</Card>
	);
}
