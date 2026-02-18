import HomeCategoriesClient from "./HomeCategoriesClient";
import { getCatalog } from "../lib/catalog";
import { parseGrasshopperDocsCategory, slugFromTopCategory, TOP_CATEGORY_ORDER } from "../lib/categories";

export default async function HomePage() {
	const items = getCatalog();
	const counts = new Map<string, number>();
	for (const item of items) {
		const top = parseGrasshopperDocsCategory(item.category ?? "").top;
		if (top === "Other") continue;
		counts.set(top, (counts.get(top) ?? 0) + 1);
	}

	const categories = TOP_CATEGORY_ORDER.map((name) => ({
		name,
		slug: slugFromTopCategory(name),
		count: counts.get(name) ?? 0,
	})).filter((entry) => entry.count > 0);

	return <HomeCategoriesClient categories={categories} />;
}
