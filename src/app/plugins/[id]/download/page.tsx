import { notFound, redirect } from "next/navigation";

import { getCatalogItemById } from "../../../../lib/catalog";

interface PluginDownloadPageProps {
	params: Promise<{ id: string }>;
}

export default async function PluginDownloadPage({ params }: PluginDownloadPageProps) {
	const { id } = await params;
	const item = getCatalogItemById(id);

	if (!item) {
		notFound();
	}

	redirect(item.downloadUrl);
}
