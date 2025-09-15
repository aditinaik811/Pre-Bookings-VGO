"use client";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleGoogleLogin = async () => {
		setLoading(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
			},
		});
		if (error) {
			alert("Login failed: " + error.message);
		}
		setLoading(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
				<h1 className="text-2xl font-bold mb-6">Login</h1>
				<button
					onClick={handleGoogleLogin}
					disabled={loading}
					className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
				>
					<svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clipPath="url(#clip0_17_40)">
							<path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h13.02c-.56 3.02-2.24 5.58-4.76 7.3v6.06h7.7c4.5-4.14 7.09-10.24 7.09-17.68z" fill="#4285F4"/>
							<path d="M24.48 48c6.48 0 11.92-2.14 15.89-5.82l-7.7-6.06c-2.14 1.44-4.88 2.3-8.19 2.3-6.3 0-11.64-4.26-13.56-9.98H2.65v6.24C6.6 43.98 14.8 48 24.48 48z" fill="#34A853"/>
							<path d="M10.92 28.44c-.5-1.44-.8-2.98-.8-4.44s.3-3 .8-4.44v-6.24H2.65A23.97 23.97 0 000 24c0 3.98.96 7.76 2.65 11.08l8.27-6.64z" fill="#FBBC05"/>
							<path d="M24.48 9.52c3.54 0 6.68 1.22 9.17 3.62l6.87-6.87C36.4 2.14 30.96 0 24.48 0 14.8 0 6.6 4.02 2.65 10.68l8.27 6.24c1.92-5.72 7.26-9.98 13.56-9.98z" fill="#EA4335"/>
						</g>
						<defs>
							<clipPath id="clip0_17_40">
								<rect width="48" height="48" fill="white"/>
							</clipPath>
						</defs>
					</svg>
					{loading ? "Signing in..." : "Sign in with Google"}
				</button>
			</div>
		</div>
	);
}
