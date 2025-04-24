"use client";

import type { Session } from "next-auth";
import type { RecipeAnalysis } from "@/types/recipe";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2Icon, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import OauthLoginButtons from "../sign-in/components/Oauth-login-buttons";
import { saveRecipeAction } from "../actions";

type SaveButtonProps = {
	session: Session | null;
	analysis?: RecipeAnalysis;
	recipeInput?: string;
};

export default function SaveButton({ session, analysis, recipeInput }: SaveButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	console.log(session);

	const handleSave = () => {
		if (!analysis) {
			toast.error("분석 데이터가 없습니다.");
			return;
		}

		if (!title.trim()) {
			toast.error("레시피 제목을 입력해주세요.");
			return;
		}

		startTransition(async () => {
			if (!session) {
				toast.error("로그인 후 이용해주세요.");
				return;
			}

			try {
				// 레시피 저장 액션 호출
				const result = await saveRecipeAction({
					session,
					title: title.trim(),
					description: description.trim() || undefined,
					instructions: recipeInput || analysis.ingredients.map((ing) => `${ing.name}: ${ing.quantity}`).join("\n"),
					analysis,
				});

				if (result.success) {
					toast.success("레시피가 성공적으로 저장되었습니다.");
					setIsOpen(false);
					setTitle("");
					setDescription("");
				}
			} catch (error) {
				console.error("저장 오류:", error);
				toast.error("레시피 저장 중 오류가 발생했습니다.");
			}
		});
	};

	if (!analysis) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button disabled={isPending} className="ml-auto">
					{isPending ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <SaveIcon />}
					저장하기
				</Button>
			</DialogTrigger>
			<DialogContent>
				{session ? (
					<>
						<DialogHeader>
							<DialogTitle>이 레시피의 영양 정보를 저장하시겠습니까?</DialogTitle>
							<DialogDescription>저장 후 언제든 조회할 수 있습니다.</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="title">레시피 제목</Label>
								<Input
									id="title"
									placeholder="레시피 제목을 입력해주세요"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="description">설명 (선택사항)</Label>
								<Textarea
									id="description"
									placeholder="레시피에 대한 간단한 설명을 입력해주세요"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									rows={3}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button onClick={() => setIsOpen(false)} variant="outline">
								취소
							</Button>
							<Button disabled={isPending} onClick={handleSave}>
								{isPending ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : null}
								저장
							</Button>
						</DialogFooter>
					</>
				) : (
					<>
						<DialogHeader className="flex flex-col items-center">
							<DialogTitle>로그인</DialogTitle>
							<DialogDescription>로그인하면 저장 기능을 이용할 수 있습니다.</DialogDescription>
						</DialogHeader>
						<OauthLoginButtons />
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
