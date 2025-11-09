import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("routes/dashboard.tsx"),
	route("/lifecycle", "routes/lifecycle.tsx"),
] satisfies RouteConfig;
