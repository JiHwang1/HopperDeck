import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { z } from "zod";

const AddonSchema = z.object({
	name: z.string().min(1),
	authorName: z.string().min(1),
	description: z.string().optional().default(""),
	downloadLink: z.string().min(1),
	helpLink: z.string().min(1),
	category: z.string().optional().default(""),
	version: z.string().optional().default(""),
	releaseDate: z.string().optional().default(""),
	components: z.union([z.array(z.string()), z.number().int().nonnegative()]).optional().default([]),
	isSystem: z.boolean().optional().default(false),
});

const AddonsFeedSchema = z.object({
	index: z.array(AddonSchema),
});

const Food4RhinoEntrySchema = z.object({
	id: z.string().min(1),
	link: z.string().min(1),
	verified: z.boolean().optional(),
});

const Food4RhinoFeedSchema = z.object({
	index: z.array(Food4RhinoEntrySchema),
});

const OverridesSchema = z.record(
	z.string().min(1),
	z
		.object({
			name: z.string().min(1).optional(),
			authors: z.string().min(1).optional(),
			description: z.string().optional(),
			thumbnailUrl: z.string().url().optional(),
			pluginPageUrl: z.string().url().optional(),
			downloadUrl: z.string().url().optional(),
			rating: z.string().min(1).optional(),
			license: z.string().min(1).optional(),
			cost: z.string().min(1).optional(),
			verified: z.boolean().optional(),
			updatedAt: z.string().min(1).optional(),
			downloadCount: z.number().int().nonnegative().optional(),
			tags: z.array(z.string().min(1)).optional(),
		})
		.strict(),
);

type Overrides = z.infer<typeof OverridesSchema>;

function addonIdFromHelpLink(helpLink: string): string {
	try {
		const url = new URL(helpLink);
		const file = url.pathname.split("/").pop() ?? "";
		if (!file) return "";
		return decodeURIComponent(file).replace(/\.html$/i, "");
	} catch {
		return "";
	}
}

function tagsFromCategory(category: string): string[] {
	const normalized = category
		.toLowerCase()
		.replace(/&/g, " ")
		.replace(/\//g, " ")
		.replace(/\s*-\s*/g, " ")
		.replace(/[^a-z0-9\s]/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (!normalized) return [];
	return normalized.split(" ").filter(Boolean);
}

async function readJsonFile(filePath: string): Promise<unknown> {
	const raw = await readFile(filePath, "utf8");
	return JSON.parse(raw);
}

async function fetchAddonsFeed(): Promise<z.infer<typeof AddonsFeedSchema>> {
	const response = await fetch(
		"https://raw.githubusercontent.com/grasshopper3d/GrasshopperDocsSite/master/feeds/addons.json",
	);
	if (!response.ok) {
		throw new Error(`fetch failed: ${response.status}`);
	}

	const data: unknown = await response.json();
	return AddonsFeedSchema.parse(data);
}

async function fetchFood4RhinoFeed(): Promise<z.infer<typeof Food4RhinoFeedSchema>> {
	const response = await fetch(
		"https://raw.githubusercontent.com/grasshopper3d/GrasshopperDocsSite/master/feeds/food4rhino.json",
	);
	if (!response.ok) {
		throw new Error(`food4rhino feed fetch failed: ${response.status}`);
	}

	const data: unknown = await response.json();
	return Food4RhinoFeedSchema.parse(data);
}

function getFood4RhinoSearchUrl(name: string): string {
	return `https://www.food4rhino.com/en/search?search_api_fulltext=${encodeURIComponent(name)}`;
}

function getFood4RhinoAppUrl(slug: string): string {
	return `https://www.food4rhino.com/en/app/${encodeURIComponent(slug)}`;
}

async function main() {
	const root = resolve(__dirname, "..");
	const targetPath = resolve(root, "src", "data", "plugins.json");
	const backupPath = resolve(root, "src", "data", "plugins.manual.backup.json");
	const overridesPath = resolve(root, "src", "data", "plugins.overrides.json");

	let overrides: Overrides = {};
	try {
		overrides = OverridesSchema.parse(await readJsonFile(overridesPath));
	} catch {
		overrides = {};
	}

	const feed = await fetchAddonsFeed();
	const food4RhinoFeed = await fetchFood4RhinoFeed();
	const food4RhinoByHelpLink = new Map(
		food4RhinoFeed.index.map((entry) => [entry.link, entry.id] as const),
	);
	const food4RhinoVerifiedById = new Map(
		food4RhinoFeed.index.map((entry) => [entry.id, entry.verified === true] as const),
	);
	const placeholderThumbnail = "https://grasshopperdocs.com/images/search.png";

	const base = feed.index
		.filter((addon) => !addon.isSystem)
		.map((addon) => {
			const id = addonIdFromHelpLink(addon.helpLink);
			if (!id) {
				throw new Error(`failed to derive id from helpLink: ${addon.helpLink}`);
			}

			const mappedSlug = food4RhinoByHelpLink.get(addon.helpLink);
			const fallbackFood4Rhino = getFood4RhinoSearchUrl(addon.name);
			const food4RhinoUrl = mappedSlug ? getFood4RhinoAppUrl(mappedSlug) : fallbackFood4Rhino;
			const verified = mappedSlug ? (food4RhinoVerifiedById.get(mappedSlug) ?? false) : false;
			const componentsCount =
				typeof addon.components === "number" ? addon.components : Array.isArray(addon.components) ? addon.components.length : 0;

			return {
				id,
				name: addon.name,
				authors: addon.authorName,
				description: addon.description ?? "",
				thumbnailUrl: placeholderThumbnail,
				pluginPageUrl: food4RhinoUrl,
				downloadUrl: food4RhinoUrl,
				category: addon.category,
				version: addon.version,
				releaseDate: addon.releaseDate,
				componentsCount,
				verified,
				tags: tagsFromCategory(addon.category),
			};
		})
		.map((item) => {
			const override = overrides[item.id];
			if (!override) return item;
			return {
				...item,
				...override,
				id: item.id,
			};
		})
		.sort((a, b) => a.name.localeCompare(b.name));

	try {
		await readFile(backupPath, "utf8");
	} catch {
		try {
			const current = await readFile(targetPath, "utf8");
			await writeFile(backupPath, current, "utf8");
		} catch {
			
		}
	}

	await writeFile(targetPath, JSON.stringify(base, null, 2) + "\n", "utf8");
	process.stdout.write(`Wrote ${base.length} entries to ${targetPath}\n`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
