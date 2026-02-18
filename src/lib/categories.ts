export const TOP_CATEGORY_ORDER = [
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

export type TopCategory = (typeof TOP_CATEGORY_ORDER)[number];

export const TOP_CATEGORY_SLUG_BY_NAME: Record<TopCategory, string> = {
	Core: "core",
	Geometry: "geometry",
	Logic: "logic",
	Math: "math",
	Generation: "generation",
	Animation: "animation",
	Architecture: "architecture",
	Electronic: "electronic",
	Integration: "integration",
};

export function topCategoryFromSlug(slug: string): TopCategory | null {
	const normalized = slug.trim().toLowerCase();
	for (const name of TOP_CATEGORY_ORDER) {
		if (TOP_CATEGORY_SLUG_BY_NAME[name] === normalized) return name;
	}
	return null;
}

export function slugFromTopCategory(category: TopCategory): string {
	return TOP_CATEGORY_SLUG_BY_NAME[category];
}

export function parseGrasshopperDocsCategory(category: string): { top: TopCategory | "Other"; sub: string } {
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
