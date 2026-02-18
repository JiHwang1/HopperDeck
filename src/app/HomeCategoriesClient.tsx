"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { TopCategory } from "../lib/categories";

const TITLE = "HopperDeck";

export default function HomeCategoriesClient({
	categories,
}: {
	categories: Array<{ name: TopCategory; slug: string; count: number }>;
}) {
	const router = useRouter();
	const [isScrolled, setIsScrolled] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const normalizedQuery = searchQuery.trim().toLowerCase();
	const allCount = categories.reduce((sum, c) => sum + c.count, 0);
	const showAllCard = normalizedQuery.length === 0 || "all".includes(normalizedQuery) || normalizedQuery.includes("all");
	const visibleCategories = categories.filter((category) => category.name.toLowerCase().includes(normalizedQuery));

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 80);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="bg-slate-50 text-slate-900">
			<nav
				className={[
					"fixed inset-x-0 top-0 z-50 transition-all duration-500",
					isScrolled
						? "border-b border-slate-200/70 bg-white/85 py-3 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.65)] backdrop-blur-xl"
						: "bg-transparent py-6",
				].join(" ")}
			>
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
					<span
						className={[
							"font-paperlogy text-lg tracking-tight text-emerald-500 transition-all duration-300",
							isScrolled ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
						].join(" ")}
					>
						HopperDeck
					</span>
					<a
						href="#categories"
						className={[
							"text-sm font-semibold text-slate-600 transition-opacity",
							isScrolled ? "opacity-100" : "opacity-0 pointer-events-none",
						].join(" ")}
					>
						Categories
					</a>
				</div>
			</nav>

			<section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-slate-50 px-4 pb-16 pt-28 text-center sm:px-6 sm:pt-32">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.16),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(249,115,22,0.14),transparent_45%)]" />
				<div className="animate-float-soft pointer-events-none absolute left-1/2 top-1/2 h-[58vw] w-[58vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/25 blur-[120px]" />
				<div className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent" />

				<div className="relative mx-auto flex w-full max-w-4xl flex-col items-center">
					<h1 className="mb-6 flex flex-wrap items-center justify-center gap-[0.03em] text-[clamp(3rem,12vw,7rem)] font-extrabold leading-none tracking-[-0.06em]">
						{TITLE.split("").map((letter, index) => (
							<span
								key={`${letter}-${index}`}
								className="animate-hopper-jump-once inline-block text-emerald-800 font-paperlogy"
								style={{ animationDelay: `${index * 70}ms` }}
							>
								{letter}
							</span>
						))}
					</h1>

					<p className="mb-10 max-w-2xl text-balance text-base text-slate-600 sm:text-lg">
						Grasshopper plugins, grouped like GrasshopperDocs.
					</p>
					<form
						className="w-full max-w-2xl"
						onSubmit={(event) => {
							event.preventDefault();
							const q = searchQuery.trim();
							const url = q.length > 0 ? `/categories/all?q=${encodeURIComponent(q)}` : "/categories/all";
							router.push(url);
						}}
					>
						<input
							type="search"
							placeholder="Search categories..."
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							className="w-full rounded-2xl border border-white/60 bg-white/90 px-5 py-4 text-sm shadow-[0_24px_60px_-32px_rgba(15,23,42,0.45)] outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 sm:text-base"
						/>
					</form>
				</div>
			</section>

			<section id="categories" className="mx-auto w-full max-w-6xl bg-slate-50 px-4 pb-24 pt-8 sm:px-6">
				<div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-5">
					<h2 className="text-2xl font-semibold tracking-tight text-slate-900">Categories</h2>
					<p className="text-xs text-slate-500">{categories.reduce((sum, c) => sum + c.count, 0)} plugins</p>
				</div>

				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{showAllCard ? (
						<Link
							href="/categories/all"
							className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_45px_-38px_rgba(15,23,42,0.95)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_25px_50px_-35px_rgba(16,185,129,0.6)]"
						>
							<div className="mb-3 flex items-start justify-between gap-3">
								<h3 className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-emerald-800">
									All
								</h3>
								<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
									{allCount}
								</span>
							</div>
						</Link>
					) : null}
					{visibleCategories.map((category) => (
						<Link
							key={category.slug}
							href={`/categories/${category.slug}`}
							className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_45px_-38px_rgba(15,23,42,0.95)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_25px_50px_-35px_rgba(16,185,129,0.6)]"
						>
							<div className="mb-3 flex items-start justify-between gap-3">
								<h3 className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-emerald-800">
									{category.name}
								</h3>
								<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
									{category.count}
								</span>
							</div>
						</Link>
					))}
				</div>

				<section aria-labelledby="about" className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
					<h2 id="about" className="text-xl font-semibold tracking-tight text-slate-900">
						About
					</h2>
					<p className="mt-3 text-sm leading-7 text-slate-600">
						HopperDeck is a lightweight directory to browse Grasshopper plugins by category and jump to their Food4Rhino pages.
					</p>
					<div className="mt-6 grid gap-6 sm:grid-cols-2">
						<div>
							<h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Purpose</h3>
							<ul className="mt-3 space-y-2 text-sm text-slate-700">
								<li>Browse plugins by category</li>
								<li>Fast search across names, authors, tags, versions, and dates</li>
								<li>Quick access to Food4Rhino listings</li>
							</ul>
						</div>
						<div>
							<h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Credits</h3>
							<ul className="mt-3 space-y-2 text-sm text-slate-700">
								<li>Data: grasshopper3d/GrasshopperDocsSite JSON feeds</li>
								<li>Food4Rhino: plugin listing source for external links</li>
								<li>Thanks to the Grasshopper community and contributors</li>
							</ul>
						</div>
					</div>
				</section>

			</section>
		</div>
	);
}
