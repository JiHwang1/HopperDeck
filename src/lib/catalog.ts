import "server-only";

import { z } from "zod";

import rawCatalog from "../data/plugins.json";

const CatalogItemSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	authors: z.string().min(1),
	description: z.string().optional().default(""),
	thumbnailUrl: z.string().url(),
	pluginPageUrl: z.string().url(),
	downloadUrl: z.string().url(),
	version: z.string().optional().default(""),
	releaseDate: z.string().optional().default(""),
	componentsCount: z.number().int().nonnegative().optional(),
	verified: z.boolean().optional(),
	category: z.string().optional().default(""),
	updatedAt: z.string().optional(),
	downloadCount: z.number().int().nonnegative().optional(),
	rating: z.string().min(1).optional(),
	license: z.string().min(1).optional(),
	cost: z.string().min(1).optional(),
	tags: z.array(z.string().min(1)).default([]),
});

const CatalogSchema = z.array(CatalogItemSchema);

export type CatalogItem = z.infer<typeof CatalogItemSchema>;

let cachedCatalog: CatalogItem[] | null = null;

export function getCatalog(): CatalogItem[] {
	if (cachedCatalog) return cachedCatalog;

	const parsed = CatalogSchema.safeParse(rawCatalog);
	if (!parsed.success) {
		throw new Error("catalog parse failed");
	}

	const ids = new Set<string>();
	for (const item of parsed.data) {
		if (ids.has(item.id)) {
			throw new Error(`catalog duplicate id: ${item.id}`);
		}
		ids.add(item.id);
	}

	cachedCatalog = parsed.data;
	return cachedCatalog;
}

export function getCatalogItemById(id: string): CatalogItem | null {
	const catalog = getCatalog();
	return catalog.find((item) => item.id === id) ?? null;
}
