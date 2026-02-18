import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	variable: "--font-jakarta",
	display: "swap",
});

export const metadata: Metadata = {
	title: "HopperDeck | Grasshopper Plugin Store",
	description: "The modern store for Rhino Grasshopper plugins.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={plusJakartaSans.variable}>
			<body className="min-h-screen flex flex-col">
				<main className="flex-1">{children}</main>
				<footer className="border-t border-slate-200/80 bg-white/80 px-6 py-8">
					<div className="mx-auto flex w-full max-w-6xl flex-col gap-2 text-center text-xs leading-relaxed text-slate-500">
						<p>
							Data source: grasshopper3d/GrasshopperDocsSite JSON feeds. Outbound links point to Food4Rhino.
						</p>
						<p>
							Disclaimer: HopperDeck is an unofficial community project and is not affiliated with McNeel, Food4Rhino, Rhino, or Grasshopper. Information is provided &quot;as is&quot; without warranties of any kind.
						</p>
					</div>
				</footer>
			</body>
		</html>
	);
}
