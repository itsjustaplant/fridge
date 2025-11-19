import { data } from "react-router";
import { DataTable } from "~/components/data-table";
import type { TProductCatalog } from "~/types";
import { EHTTPResponse } from "~/types";
import type { Route } from "../+types/root";

// biome-ignore lint/correctness/noEmptyPattern: <shut the fuck up>
export function meta({}: Route.MetaArgs) {
	return [{ title: "Duck Inc." }];
}

export async function loader({ context }: Route.LoaderArgs) {
	try {
		const { results } = await context.cloudflare.env.DB.prepare(
			`SELECT * FROM product_catalog ORDER BY rowid`,
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
		const name = formData.get("name");
		const manufacturer = formData.get("manufacturer");
		const category = formData.get("category");

		const { results } = await context.cloudflare.env.DB.prepare(
			`SELECT * FROM product_catalog WHERE barcode = "${barcode}" LIMIT 1`,
		).all<TProductCatalog>();

		switch (method) {
			case "DELETE": {
				if (!results || !results.length || results?.length === 0) {
					const status = EHTTPResponse.NOT_FOUND;
					return data(
						{ message: `Couldn't find item with barcode: ${barcode}`, status },
						{ status },
					);
				}
				// delete item
				await context.cloudflare.env.DB.prepare(
					`DELETE FROM product_catalog WHERE barcode="${barcode}"`,
				).all<TProductCatalog>();
				const status = EHTTPResponse.OK;
				return data(
					{ message: `Deleted item with barcode: ${barcode}`, status },
					{ status },
				);
			}
			case "POST": {
				if (results?.length && results?.length >= 1) {
					const status = EHTTPResponse.BAD_REQUEST;
					return data(
						{ message: `Item with barcode: ${barcode} already exists`, status },
						{ status },
					);
				}
				// add item
				await context.cloudflare.env.DB.prepare(
					`INSERT INTO product_catalog (barcode, name, manufacturer, category) VALUES ("${barcode}", "${name}", "${manufacturer}", "${category}")`,
				).all();
				const status = EHTTPResponse.OK;
				return data(
					{ message: `Added item with barcode: ${barcode}`, status },
					{ status },
				);
			}
			case "PATCH": {
				if (!results || results?.length !== 1) {
					const status = EHTTPResponse.BAD_REQUEST;
					return data(
						{ message: `Item with barcode: ${barcode} doesn't exists`, status },
						{ status },
					);
				}
				await context.cloudflare.env.DB.prepare(
					`UPDATE product_catalog SET name="${name}", manufacturer="${manufacturer}", category="${category}" where barcode="${barcode}"`,
				).all();
				const status = EHTTPResponse.OK;
				return data(
					{ message: `Update item with barcode: ${barcode}`, status },
					{ status },
				);
			}
			default: {
				const status = EHTTPResponse.BAD_REQUEST;
				return data(
					{ message: `Invalid method: ${method}`, status },
					{ status },
				);
			}
		}
	} catch (_) {
		const status = EHTTPResponse.BAD_REQUEST;
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
