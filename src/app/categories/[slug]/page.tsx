import { notFound } from "next/navigation";

import CategoryPageClient from "../CategoryPageClient";
import { getCatalog } from "../../../lib/catalog";
import { parseGrasshopperDocsCategory, slugFromTopCategory, topCategoryFromSlug, TOP_CATEGORY_ORDER } from "../../../lib/categories";

interface CategoryPageProps {
	params: Promise<{ slug: string }>;
	searchParams?: Promise<{ q?: string | string[] }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
	const { slug } = await params;
	const sp = (await searchParams) ?? {};
	const qRaw = sp.q;
	const initialQuery = Array.isArray(qRaw) ? (qRaw[0] ?? "") : (qRaw ?? "");

	const all = getCatalog();
	const isAll = slug.trim().toLowerCase() === "all";
	const category = isAll ? "All" : topCategoryFromSlug(slug);
	if (!category) {
		notFound();
	}
	const items = isAll ? all : all.filter((item) => parseGrasshopperDocsCategory(item.category ?? "").top === category);
	const counts = new Map<string, number>();
	for (const item of all) {
		const top = parseGrasshopperDocsCategory(item.category ?? "").top;
		if (top === "Other") continue;
		counts.set(top, (counts.get(top) ?? 0) + 1);
	}
	const categories = TOP_CATEGORY_ORDER.map((name) => ({
		name,
		slug: slugFromTopCategory(name),
		count: counts.get(name) ?? 0,
	})).filter((entry) => entry.count > 0);

	return (
		<CategoryPageClient category={category} items={items} categories={categories} initialQuery={initialQuery} />
	);
}
