import { auth } from "@/auth";

import RecipeAnalysisChat from "./components/recipe-analysis-chat";

export default async function HomePage() {
	const session = await auth();

	return (
		<main className="flex w-full flex-col items-center justify-center p-4 md:p-8">
			<section className="container mx-auto flex max-w-4xl flex-col items-center justify-center text-center ">
				<RecipeAnalysisChat session={session} />
			</section>
		</main>
	);
}
