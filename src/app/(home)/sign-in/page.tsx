import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import OauthLoginButtons from "./components/Oauth-login-buttons";

export default async function SignInPage() {
	return (
		<div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
					<CardDescription className="text-center">소셜 계정으로 간편하게 시작하세요</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<OauthLoginButtons />
				</CardContent>
			</Card>
		</div>
	);
}
