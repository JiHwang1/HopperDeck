export interface YakPackageSummary {
	authors: string;
	download_count: number;
	name: string;
	updated_at: string;
	url: string;
	version: string;
}

export type YakPackageDetail = YakPackageSummary;

const YAK_BASE_URL = "https://yak.rhino3d.com";

export async function fetchYakPackages(): Promise<YakPackageSummary[]> {
	const response = await fetch(`${YAK_BASE_URL}/packages`, {
		next: { revalidate: 60 * 60 * 12 },
	});

	if (!response.ok) {
		throw new Error(`Yak packages fetch failed: ${response.status}`);
	}

	return response.json();
}

export async function fetchYakPackage(name: string): Promise<YakPackageDetail | null> {
	const response = await fetch(`${YAK_BASE_URL}/packages/${encodeURIComponent(name)}`, {
		next: { revalidate: 60 * 60 * 12 },
	});

	if (response.status === 404) {
		return null;
	}

	if (!response.ok) {
		throw new Error(`Yak package fetch failed: ${response.status}`);
	}

	return response.json();
}

export async function fetchYakSearch(query: string): Promise<YakPackageSummary[]> {
	const trimmed = query.trim();
	if (!trimmed) return [];

	const response = await fetch(`${YAK_BASE_URL}/search?q=${encodeURIComponent(trimmed)}`, {
		next: { revalidate: 60 * 60 * 12 },
	});

	if (!response.ok) {
		throw new Error(`Yak search fetch failed: ${response.status}`);
	}

	return response.json();
}
