"use client";

import { useState } from "react";

import OauthLoginButton from "./Oauth-login-button";

export default function OauthLoginButtons() {
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [activeProvider, setActiveProvider] = useState<string | null>(null);

	const handleLoginStart = (provider: string) => {
		setIsLoggingIn(true);
		setActiveProvider(provider);
	};

	return (
		<>
			<OauthLoginButton provider="Google" isDisabled={isLoggingIn} onLoginStart={() => handleLoginStart("Google")} />
			<OauthLoginButton provider="Kakao" isDisabled={isLoggingIn} onLoginStart={() => handleLoginStart("Kakao")} />

			{isLoggingIn && <p className="text-sm text-center mt-2">{activeProvider} Signing in...</p>}
		</>
	);
}
