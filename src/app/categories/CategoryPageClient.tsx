"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { CatalogItem } from "../../lib/catalog";
import type { TopCategory } from "../../lib/categories";
import { parseGrasshopperDocsCategory } from "../../lib/categories";

const SORT_OPTIONS = ["A-Z", "New", "Updated", "Components", "Verified"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

function compareMaybeDateDesc(a: string, b: string) {
	const da = Date.parse(a);
	const db = Date.parse(b);
	if (Number.isNaN(da) && Number.isNaN(db)) return 0;
	if (Number.isNaN(da)) return 1;
	if (Number.isNaN(db)) return -1;
	return db - da;
}

function compareVersionDesc(a: string, b: string) {
	const pa = a
		.split(/[^0-9]+/g)
		.filter(Boolean)
		.map((v) => Number.parseInt(v, 10));
	const pb = b
		.split(/[^0-9]+/g)
		.filter(Boolean)
		.map((v) => Number.parseInt(v, 10));

	const len = Math.max(pa.length, pb.length);
	for (let i = 0; i < len; i += 1) {
		const av = pa[i] ?? 0;
		const bv = pb[i] ?? 0;
		if (av !== bv) return bv - av;
	}

	return b.localeCompare(a);
}

function normalize(text: string) {
	return text.trim().toLowerCase();
}

function tokenize(query: string): string[] {
	return normalize(query)
		.split(/\s+/g)
		.map((token) => token.trim())
		.filter(Boolean);
}

function itemMatchesTokens(item: CatalogItem, tokens: string[]): boolean {
	if (tokens.length === 0) return true;
	const parsed = parseGrasshopperDocsCategory(item.category ?? "");
	const haystack = normalize(
		[
			item.name,
			item.authors,
			item.description,
			item.category,
			parsed.sub,
			item.version,
			item.releaseDate,
			String(item.componentsCount ?? ""),
			...(item.tags ?? []),
		]
			.filter(Boolean)
			.join(" "),
	);

	return tokens.every((token) => haystack.includes(token));
}

function formatDateYmd(date: string): string {
	const trimmed = date.trim();
	if (!trimmed || trimmed === "Unknown") return "";

	const match = /^\d{4}-\d{2}-\d{2}$/.exec(trimmed);
	if (match) return trimmed.replaceAll("-", " ");

	const parsed = Date.parse(trimmed);
	if (Number.isNaN(parsed)) return "";
	const d = new Date(parsed);
	const yyyy = d.getUTCFullYear();
	const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
	const dd = String(d.getUTCDate()).padStart(2, "0");
	return `${yyyy} ${mm} ${dd}`;
}

export default function CategoryPageClient({
	category,
	items,
	categories,
	initialQuery = "",
}: {
	category: string;
	items: CatalogItem[];
	categories: Array<{ name: TopCategory; slug: string; count: number }>;
	initialQuery?: string;
}) {
	const router = useRouter();
	const [isScrolled, setIsScrolled] = useState(false);
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const [sort, setSort] = useState<SortOption>("A-Z");
	const [visibleCount, setVisibleCount] = useState(60);

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
		const tokens = tokenize(searchQuery);
		const byQuery = items.filter((item) => itemMatchesTokens(item, tokens));

		return [...byQuery].sort((a, b) => {
			if (sort === "New") {
				return compareMaybeDateDesc(a.releaseDate ?? "", b.releaseDate ?? "");
			}
			if (sort === "Updated") {
				return compareVersionDesc(a.version ?? "", b.version ?? "");
			}
			if (sort === "Components") {
				return (b.componentsCount ?? 0) - (a.componentsCount ?? 0);
			}
			if (sort === "Verified") {
				const av = a.verified === true ? 1 : 0;
				const bv = b.verified === true ? 1 : 0;
				if (av !== bv) return bv - av;
				return a.name.localeCompare(b.name);
			}
			return a.name.localeCompare(b.name);
		});
	}, [items, searchQuery, sort]);

	const visibleItems = useMemo(() => {
		return filteredItems.slice(0, visibleCount);
	}, [filteredItems, visibleCount]);

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
					<div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
					<Link
						href="/"
						className={[
							"font-paperlogy text-lg tracking-tight text-emerald-500 transition-all duration-300",
							isScrolled ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
						].join(" ")}
					>
						HopperDeck
					</Link>
					<div className="flex-1 min-w-0">
						<input
							type="search"
							placeholder={`Search in ${category}...`}
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							className="min-w-0 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2.5 text-sm shadow-[0_12px_32px_-26px_rgba(15,23,42,0.6)] outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
						/>
					</div>
					<Link
						href="/"
						className={[
							"hidden text-sm font-semibold text-slate-600 transition-opacity sm:inline",
							isScrolled ? "opacity-100" : "opacity-0",
						].join(" ")}
					>
						Categories
					</Link>
				</div>
			</nav>

			<section className="mx-auto w-full max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
				<div className="mb-8 flex flex-col gap-2 border-b border-slate-200 pb-5">
					<p className="text-sm text-slate-500">
						<Link href="/" className="hover:text-emerald-700">
							Categories
						</Link>
						<span className="mx-2">/</span>
						<span className="text-slate-700">{category}</span>
					</p>
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">{category}</h1>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
							<p className="text-sm text-slate-500">{filteredItems.length} plugins</p>
							<label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
								<span className="sr-only">Category</span>
							<select
								value={category}
								onChange={(event) => {
									const value = event.target.value;
									if (value === "All") {
										router.push("/categories/all");
										return;
									}
									const slug = categories.find((c) => c.name === value)?.slug;
									if (!slug) return;
									router.push(`/categories/${slug}`);
								}}
								className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
							>
								<option value="All">All</option>
								{categories.map((c) => (
									<option key={c.slug} value={c.name}>
										{c.name}
									</option>
								))}
							</select>
							</label>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<div className="inline-flex w-fit gap-1 rounded-xl bg-slate-200/70 p-1">
								{SORT_OPTIONS.map((option) => (
									<button
										key={option}
										type="button"
										className={[
											"rounded-lg px-3 py-2 text-xs font-semibold transition",
											sort === option ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-800",
										].join(" ")}
									onClick={() => setSort((value) => (value === option ? "A-Z" : option))}
								>
									{option}
								</button>
							))}
							</div>
						</div>
					</div>
				</div>

				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{visibleItems.map((item) => (
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
								<div className="min-w-0">
									<h3 className="break-words text-base font-semibold text-slate-900 group-hover:text-emerald-800">
										<span className="inline-flex flex-wrap items-center gap-2">
											{item.verified ? (
												<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
													<svg
														width="14"
														height="14"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="3"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path d="M20 6L9 17l-5-5" />
													</svg>
												</span>
											) : null}
											{item.name}
										</span>
									</h3>
									<p className="text-xs text-slate-500">by {item.authors}</p>
									{typeof item.componentsCount === "number" ? (
										<p className="mt-1 text-xs text-slate-500">{item.componentsCount} components</p>
									) : null}
								</div>
								{(() => {
									const parsed = parseGrasshopperDocsCategory(item.category ?? "");
									return parsed.sub ? (
										<span className="max-w-[45%] truncate rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
											{parsed.sub}
										</span>
									) : null;
								})()}
							</div>

							<p className="line-clamp-4 min-h-12 flex-1 text-sm leading-6 text-slate-600">
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
								{item.version ? (
									<span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
										v{item.version.replace(/^v/i, "")}
									</span>
								) : null}
							</div>

							<div className="mt-auto flex items-center justify-end border-t border-slate-100 pt-4">
								<div className="flex items-center gap-3">
									{formatDateYmd(item.releaseDate ?? "") ? (
										<span className="text-xs font-semibold text-slate-500">
											{formatDateYmd(item.releaseDate ?? "")}
										</span>
									) : null}
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
							</div>
						</article>
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
