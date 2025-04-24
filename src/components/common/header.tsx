import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/actions";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { CircleUserRound, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default async function Header() {
	const session = await auth();

	return (
		<header className="sticky top-0 z-50 w-full flex items-center justify-center py-4 px-6 md:px-12 border-b bg-white">
			<div className="container flex items-center justify-between">
				{/* Logo */}
				<div className="z-10">
					<Link href="/" className="flex items-center gap-2">
						<Image src="/logo.png" alt="logo" width={50} height={50} />
						<h1 className="text-xl md:text-3xl font-extrabold">레시피 분석기</h1>
					</Link>
				</div>

				{/* User */}
				<div className="flex items-center gap-2 z-10">
					{session?.user ? (
						<div className="flex items-center gap-3">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="flex items-center px-3">
										<Avatar>
											<AvatarImage src={session.user.image as string} alt={session.user.name as string} />
											<AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel className="flex flex-col">
										<span>로그인 계정</span>
										<span className="text-xs font-normal text-muted-foreground">{session.user.email}</span>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem asChild>
											<Link href="/my" className="flex items-center cursor-pointer">
												<CircleUserRound className="mr-2 h-4 w-4" />
												<span>마이페이지</span>
											</Link>
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuItem asChild className="text-red-500 focus:text-red-600 cursor-pointer">
										<form action={signOutAction} className="w-full">
											<button type="submit" className="flex gap-2 w-full items-center">
												<LogOut className="mr-2 h-4 w-4 text-red-500" />
												<span>로그아웃</span>
											</button>
										</form>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : (
						<Button asChild variant="outline">
							<Link href="/sign-in">로그인</Link>
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
