import NextAuth from "next-auth";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";

import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";

// *DO NOT* create a `Pool` here, outside the request handler.

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
	// Create a `Pool` inside the request handler.
	const pool = new Pool({ connectionString: process.env.DATABASE_URL });

	return {
		adapter: NeonAdapter(pool),
		providers: [Google, Kakao],
		session: {
			strategy: "jwt",
			maxAge: 60 * 60 * 24 * 7,
		},
	};
});
