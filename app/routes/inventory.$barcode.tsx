import type { Route } from "../+types/root";

export async function loader({ params, context }: Route.ActionArgs) {
	try {
		const { barcode } = params;
		const { results } = await context.cloudflare.env.DB.prepare(
			`SELECT * FROM product_catalog WHERE barcode="${barcode}" ORDER BY rowid DESC LIMIT 1`,
		).all();
		return { results };
	} catch (e) {
		console.log(`Cannot get fridge items due to: ${e}`);
	}
}
