import Link from "next/link";

export default function PluginNotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-20">
			<div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_28px_70px_-46px_rgba(15,23,42,0.7)]">
				<h1 className="mb-3 text-2xl font-bold text-slate-900">Plugin not found</h1>
				<p className="mb-6 text-sm leading-6 text-slate-600">
					The plugin you are looking for does not exist or is no longer available.
				</p>
				<Link
					href="/"
					className="inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
				>
					Go back home
				</Link>
			</div>
		</div>
	);
}
