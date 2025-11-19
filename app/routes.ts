import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/catalog", "routes/catalog.tsx"),
	route("/inventory", "routes/inventory.tsx"),
	route("/inventory/:barcode", "routes/inventory.$barcode.tsx"),
] satisfies RouteConfig;
