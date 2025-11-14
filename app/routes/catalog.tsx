import { DataTable } from "~/tables/catalog-table";
import type { Route } from "../+types/root";

export async function loader({ context }: Route.LoaderArgs) {
	try {
		const { results } = await context.cloudflare.env.DB.prepare(
			`SELECT * FROM product_catalog ORDER BY rowid DESC LIMIT 7`,
		).all();
		console.log(results);
		return { results };
	} catch (e) {
		console.log(e);
	}
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const { results = [] } = loaderData || {};
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					{Array.isArray(results) && <DataTable data={results} />}
				</div>
			</div>
		</div>
	);
}
