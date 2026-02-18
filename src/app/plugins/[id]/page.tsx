import Link from "next/link";
import { notFound } from "next/navigation";

import { getCatalogItemById } from "../../../lib/catalog";

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

interface PluginDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function PluginDetailPage({ params }: PluginDetailPageProps) {
	const { id } = await params;
	const item = getCatalogItemById(id);

	if (!item) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-slate-50 px-4 pb-20 pt-14 text-slate-900 sm:px-6">
			<main className="mx-auto w-full max-w-4xl">
				<nav className="mb-6 text-sm text-slate-500">
					<Link href="/" className="hover:text-emerald-700">
						Home
					</Link>
					<span className="mx-2">/</span>
					<span className="text-slate-700">{item.name}</span>
				</nav>

				<div className="mb-4">
					<Link
						href="/"
						className="inline-flex rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
					>
						Back to list
					</Link>
				</div>

				<header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.7)] sm:p-8">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div>
							<h1 className="mb-3 break-words text-3xl font-bold tracking-tight text-emerald-800 sm:text-4xl">
								<span className="inline-flex flex-wrap items-center gap-3">
									{item.verified ? (
										<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
											<svg
												width="16"
												height="16"
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
							</h1>
							<p className="text-sm text-slate-500">by {item.authors}</p>
							{typeof item.componentsCount === "number" ? (
								<p className="mt-1 text-sm text-slate-500">{item.componentsCount} components</p>
							) : null}
						</div>
						<div className="flex flex-wrap items-center gap-3 sm:justify-end">
							{formatDateYmd(item.releaseDate ?? "") ? (
								<span className="text-sm font-semibold text-slate-500">
									{formatDateYmd(item.releaseDate ?? "")}
								</span>
							) : null}
							<a
								href={item.pluginPageUrl}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
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
					<p className="text-base leading-7 text-slate-700">
						{item.description ? item.description : "No description yet."}
					</p>

					<div className="mt-5 flex flex-wrap gap-2 text-xs">
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
				</header>

				<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Tags</h2>
					{item.tags?.length ? (
						<div className="flex flex-wrap gap-2">
							{item.tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
								>
									{tag}
								</span>
							))}
						</div>
					) : (
						<p className="text-sm text-slate-500">No tags</p>
					)}
				</section>

			</main>
		</div>
	);
}
