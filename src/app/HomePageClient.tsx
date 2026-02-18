"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { CatalogItem } from "../lib/catalog";

const TITLE = "HopperDeck";

const TOP_CATEGORY_ORDER = [
	"Core",
	"Geometry",
	"Logic",
	"Math",
	"Generation",
	"Animation",
	"Architecture",
	"Electronic",
	"Integration",
] as const;
type TopCategory = (typeof TOP_CATEGORY_ORDER)[number];

function parseGrasshopperDocsCategory(category: string): { top: TopCategory | "Other"; sub: string } {
	const trimmed = category.trim();
	if (!trimmed) return { top: "Other", sub: "Other" };

	const parts = trimmed.split(" - ");
	if (parts.length >= 2) {
		const topCandidate = (parts[0] ?? "").trim();
		const sub = (parts.slice(1).join(" - ") ?? "").trim();
		if ((TOP_CATEGORY_ORDER as readonly string[]).includes(topCandidate)) {
			return { top: topCandidate as TopCategory, sub: sub || topCandidate };
		}
		return { top: "Other", sub: trimmed };
	}

	return { top: "Core", sub: trimmed };
}

export default function HomePageClient({ items }: { items: CatalogItem[] }) {
	const router = useRouter();
	const [isScrolled, setIsScrolled] = useState(false);
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [visibleCount, setVisibleCount] = useState(60);

	const scrollToPlugins = () => {
		const element = document.getElementById("plugins");
		if (!element) return;

		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		element.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
	};

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 80);
			setShowScrollTop(window.scrollY > 420);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const filteredItems = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		const byQuery = query
			? items.filter((item) => {
					const haystack = [item.name, item.authors, item.description, ...(item.tags ?? [])]
						.join(" ")
						.toLowerCase();
					return haystack.includes(query);
			  })
			: items;

		return [...byQuery].sort((a, b) => a.name.localeCompare(b.name));
	}, [items, searchQuery]);

	const visibleItems = useMemo(() => {
		return filteredItems.slice(0, visibleCount);
	}, [filteredItems, visibleCount]);

	const groupedItems = useMemo(() => {
		const byCategory = new Map<TopCategory | "Other", CatalogItem[]>();
		for (const item of visibleItems) {
			const group = parseGrasshopperDocsCategory(item.category ?? "").top;
			const bucket = byCategory.get(group);
			if (bucket) bucket.push(item);
			else byCategory.set(group, [item]);
		}

		const rank = new Map<string, number>(TOP_CATEGORY_ORDER.map((name, index) => [name, index]));
		return [...byCategory.entries()].sort(([a], [b]) => {
			const ra = rank.get(a) ?? 999;
			const rb = rank.get(b) ?? 999;
			if (ra !== rb) return ra - rb;
			return a.localeCompare(b);
		});
	}, [visibleItems]);

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
				<div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6">
					<span
						className={[
							"font-paperlogy text-lg tracking-tight text-emerald-500 transition-all duration-300",
							isScrolled ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
						].join(" ")}
					>
						HopperDeck
					</span>
					<div
						className={[
							"transition-all duration-300 overflow-hidden",
							isScrolled
								? "flex-1 opacity-100 translate-y-0 max-w-none"
								: "opacity-0 -translate-y-2 pointer-events-none max-w-0",
						].join(" ")}
					>
						<input
							type="search"
							placeholder="Search plugins..."
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2.5 text-sm shadow-[0_12px_32px_-26px_rgba(15,23,42,0.6)] outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
						/>
					</div>
					<a
						href="#plugins"
						className={[
							"hidden text-sm font-semibold text-slate-600 transition-opacity sm:inline",
							isScrolled ? "opacity-100" : "opacity-0",
						].join(" ")}
					>
						Explore
					</a>
				</div>
			</nav>

			<section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6 pb-20 pt-28 text-center sm:pt-32">
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
						Browse curated Grasshopper plugins.
					</p>

					<form
						className="w-full max-w-2xl"
						onSubmit={(event) => {
							event.preventDefault();
							scrollToPlugins();
						}}
					>
						<input
							type="search"
							placeholder="Search by name, author, tag..."
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							className="w-full rounded-2xl border border-white/60 bg-white/90 px-5 py-4 text-sm shadow-[0_24px_60px_-32px_rgba(15,23,42,0.45)] outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 sm:text-base"
						/>
					</form>
				</div>

				<a
					href="#plugins"
					className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600"
				>
					Scroll
					<span className="mx-auto mt-3 block h-7 w-4 rounded-full border border-emerald-300/80 p-[2px]">
						<span className="animate-scroll-bounce block h-2 w-2 rounded-full bg-emerald-500" />
					</span>
				</a>
			</section>

			<section id="plugins" className="mx-auto w-full max-w-6xl bg-slate-50 px-6 pb-24 pt-8">
				<div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
					<h2 className="text-2xl font-semibold tracking-tight text-slate-900">Explore Plugins</h2>
				</div>

				<p className="mb-6 text-sm text-slate-500">
					{filteredItems.length} plugins found
					{filteredItems.length > visibleCount ? ` (showing ${visibleCount})` : ""}
				</p>

				<div className="space-y-10">
					{groupedItems.map(([group, groupItems]) => (
						<section key={group} aria-label={group}>
							<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
								<h3 className="text-lg font-semibold tracking-tight text-slate-900">{group}</h3>
								<p className="text-xs text-slate-500">{groupItems.length} items</p>
							</div>

							<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
								{groupItems.map((item) => (
									<article
										key={item.id}
										role="link"
										tabIndex={0}
										aria-label={`${item.name} details`}
										onClick={() => router.push(`/plugins/${encodeURIComponent(item.id)}`)}
										onKeyDown={(event) => {
											if (event.key === "Enter" || event.key === " ") {
												event.preventDefault();
												router.push(`/plugins/${encodeURIComponent(item.id)}`);
											}
										}}
										className="group flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_45px_-38px_rgba(15,23,42,0.95)] outline-none transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_25px_50px_-35px_rgba(16,185,129,0.6)] focus-visible:ring-4 focus-visible:ring-emerald-100"
									>
								<div className="mb-5 flex items-start justify-between gap-3">
									<div>
										<h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-800">
											{item.name}
										</h3>
										<p className="text-xs text-slate-500">by {item.authors}</p>
									</div>
									{(() => {
										const parsed = parseGrasshopperDocsCategory(item.category ?? "");
										return parsed.sub ? (
											<span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
												{parsed.sub}
											</span>
										) : null;
									})()}
								</div>

							<p className="line-clamp-4 min-h-12 text-sm leading-6 text-slate-600">
								{item.description ? item.description : "No description yet."}
							</p>

							<div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
								{item.rating ? (
									<span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
										★ {item.rating}
									</span>
								) : null}
								{item.cost ? (
									<span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
										{item.cost}
									</span>
								) : null}
								{item.license ? (
									<span className="rounded-full bg-white px-2.5 py-1 font-semibold text-slate-600 ring-1 ring-slate-200">
										{item.license}
									</span>
								) : null}
							</div>

								<div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-4">
									<a
										href={item.pluginPageUrl}
										target="_blank"
										rel="noreferrer"
										onClick={(event) => event.stopPropagation()}
										className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700"
									>
										Food4Rhino
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M7 17L17 7" />
											<path d="M10 7h7v7" />
										</svg>
									</a>
								</div>
									</article>
								))}
							</div>
						</section>
					))}
				</div>

				{filteredItems.length === 0 ? (
					<div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
						No plugins match this search.
					</div>
				) : null}

				{filteredItems.length > visibleCount ? (
					<div className="mt-10 flex justify-center">
						<button
							type="button"
							onClick={() => setVisibleCount((count) => count + 60)}
							className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
						>
							Load more
						</button>
					</div>
				) : null}
			</section>

			<button
				type="button"
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				aria-label="맨 위로 이동"
				className={[
					"fixed bottom-6 right-6 z-40 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-24px_rgba(5,150,105,0.95)] transition-all duration-300",
					showScrollTop ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none",
				].join(" ")}
			>
				Top
			</button>

		</div>
	);
}
