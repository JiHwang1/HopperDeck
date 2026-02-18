export interface Plugin {
	id: string;
	name: string;
	author: string;
	description: string;
	downloads: string;
	version: string;
	food4rhinoUrl: string;
	releaseDate: string;
	updatedDate: string;
	downloadCount: number;
	featuredScore: number;
	tags: string[];
	longDescription: string;
}

function createFood4RhinoSearchUrl(name: string): string {
	return `https://www.food4rhino.com/en/search?search_api_fulltext=${encodeURIComponent(name)}`;
}

export const plugins: Plugin[] = [
	{
		id: "pufferfish",
		name: "Pufferfish",
		author: "Michael Pryor",
		description: "The premier shape manipulation tool for Grasshopper.",
		downloads: "2.1k",
		version: "v3.0",
		food4rhinoUrl: createFood4RhinoSearchUrl("Pufferfish"),
		releaseDate: "2025-11-08",
		updatedDate: "2026-01-16",
		downloadCount: 2100,
		featuredScore: 94,
		tags: ["geometry", "deform", "transform"],
		longDescription:
			"Pufferfish provides advanced geometric transformations, morphing utilities, and workflow shortcuts for shape-heavy Grasshopper definitions.",
	},
	{
		id: "kangaroo",
		name: "Kangaroo",
		author: "Daniel Piker",
		description: "Interactive physics engine for form-finding and simulation.",
		downloads: "5.4k",
		version: "v2.5",
		food4rhinoUrl: createFood4RhinoSearchUrl("Kangaroo"),
		releaseDate: "2025-02-02",
		updatedDate: "2026-02-04",
		downloadCount: 5400,
		featuredScore: 99,
		tags: ["physics", "simulation", "form-finding"],
		longDescription:
			"Kangaroo is a live physical solver for interactive simulation workflows including relaxation, spring systems, and form-finding studies.",
	},
	{
		id: "karamba3d",
		name: "Karamba3D",
		author: "Bollinger + Grohmann",
		description: "Parametric structural engineering tool.",
		downloads: "1.8k",
		version: "v1.3",
		food4rhinoUrl: createFood4RhinoSearchUrl("Karamba3D"),
		releaseDate: "2025-10-22",
		updatedDate: "2026-01-28",
		downloadCount: 1800,
		featuredScore: 92,
		tags: ["structure", "analysis", "engineering"],
		longDescription:
			"Karamba3D enables structural analysis directly in Grasshopper with support for member sizing, utilization checks, and iterative optimization.",
	},
	{
		id: "ladybug",
		name: "Ladybug",
		author: "Mostapha Sadeghipour",
		description: "Environmental analysis for building performance.",
		downloads: "3.2k",
		version: "v1.6",
		food4rhinoUrl: createFood4RhinoSearchUrl("Ladybug"),
		releaseDate: "2025-08-13",
		updatedDate: "2026-01-30",
		downloadCount: 3200,
		featuredScore: 97,
		tags: ["climate", "energy", "analysis"],
		longDescription:
			"Ladybug adds climate-driven analysis for daylight, solar exposure, and environmental performance to support better design decisions.",
	},
	{
		id: "weaverbird",
		name: "Weaverbird",
		author: "Giulio Piacentino",
		description: "Topological mesh editing for subdivision.",
		downloads: "4.1k",
		version: "v0.9",
		food4rhinoUrl: createFood4RhinoSearchUrl("Weaverbird"),
		releaseDate: "2025-03-12",
		updatedDate: "2026-02-10",
		downloadCount: 4100,
		featuredScore: 95,
		tags: ["mesh", "subdivision", "topology"],
		longDescription:
			"Weaverbird offers robust mesh subdivision and topology editing operations for smooth, fabrication-ready geometric models.",
	},
	{
		id: "lunchbox",
		name: "LunchBox",
		author: "Nathan Miller",
		description: "Data management and machine learning tools.",
		downloads: "1.5k",
		version: "v2.0",
		food4rhinoUrl: createFood4RhinoSearchUrl("LunchBox"),
		releaseDate: "2025-12-18",
		updatedDate: "2026-01-20",
		downloadCount: 1500,
		featuredScore: 90,
		tags: ["data", "automation", "ml"],
		longDescription:
			"LunchBox provides data utility nodes and productivity helpers for paneling, spreadsheet interop, and workflow automation.",
	},
];

export function getPluginById(id: string): Plugin | undefined {
	return plugins.find((plugin) => plugin.id === id);
}
