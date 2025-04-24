"use client";

import type { Session } from "next-auth";

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
import OauthLoginButtons from "../sign-in/components/Oauth-login-buttons";

type SaveButtonProps = {
	session: Session | null;
};

export default function SaveButton({ session }: SaveButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleSave = () => {
		startTransition(async () => {
			if (!session) {
				toast.error("로그인 후 이용해주세요.");
				return;
			}
		});
	};
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
						<DialogFooter>
							<Button onClick={() => setIsOpen(false)} variant="outline">
								취소
							</Button>
							<Button disabled={isPending} onClick={handleSave}>
								저장
							</Button>
						</DialogFooter>
					</>
				) : (
					<>
						<DialogHeader>
							<DialogTitle>로그인</DialogTitle>
							<DialogDescription>로그인 후 이용해주세요.</DialogDescription>
						</DialogHeader>
						<OauthLoginButtons />
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
