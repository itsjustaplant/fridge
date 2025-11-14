import { data } from "react-router";
import { DataTable } from "~/tables/catalog-table";
import type { TProductCatalog } from "~/types";
import { EHTTP_RESPONSES } from "~/types";
import type { Route } from "../+types/root";

export async function loader({ context }: Route.LoaderArgs) {
	try {
		const { results } = await context.cloudflare.env.DB.prepare(
			`SELECT * FROM product_catalog ORDER BY rowid DESC LIMIT 7`,
		).all();
		return { results };
	} catch (e) {
		console.log(`Cannot get product catalog due to: ${e}`);
	}
}

export async function action({ request, context }: Route.ActionArgs) {
	const method = request?.method;

	try {
		const formData = await request.formData();
		const barcode = formData.get("barcode");

		switch (method) {
			case "DELETE": {
				// get item
				const { results } = await context.cloudflare.env.DB.prepare(
					`SELECT * FROM product_catalog WHERE barcode = "${barcode}" LIMIT 1`,
				).all<TProductCatalog>();
				if (!results || !results.length || results?.length === 0) {
					const status = EHTTP_RESPONSES.NOT_FOUND;
					return data(
						{ message: `Couldn't find item with barcode: ${barcode}`, status },
						{ status },
					);
				}

				// delete item
				await context.cloudflare.env.DB.prepare(
					`DELETE FROM product_catalog WHERE barcode = "${barcode}"`,
				).all<TProductCatalog>();
				const status = EHTTP_RESPONSES.OK;
				return data(
					{ message: `Deleted item with barcode: ${barcode}`, status },
					{ status },
				);
			}
			default: {
				const status = EHTTP_RESPONSES.BAD_REQUEST;
				return data(
					{ message: `Invalid method: ${method}`, status },
					{ status },
				);
			}
		}
	} catch (e) {
		const status = EHTTP_RESPONSES.BAD_REQUEST;
		console.log(`Cannot delete product catalog due to: ${e}`);
		return data(
			{
				message: `There was an error while processing your ${method} request`,
				status,
			},
			{ status },
		);
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
