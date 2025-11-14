import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("routes/inventory.tsx"),
	route("/catalog", "routes/catalog.tsx"),
] satisfies RouteConfig;
