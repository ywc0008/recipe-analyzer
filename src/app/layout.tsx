import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "레시피 분석기",
	description: "레시피 분석기",
	verification: {
		google: "6BfRNuq58wywWG_D3MDJiHI6xxL57f0dQiDUoJqHzoU",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" />
				<link rel="icon" type="image/png" sizes="48x48" href="/favicon/favicon-48.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16.png" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>

			{process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
			{process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />}
		</html>
	);
}
