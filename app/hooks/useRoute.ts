import { useLocation } from "react-router";
import { EPage } from "~/types";

export function useRoute() {
	const location = useLocation();
	switch (location.pathname) {
		case "/catalog":
			return EPage.CATALOG;
		case "/inventory":
			return EPage.INVENTORY;
		default:
			return EPage.DASHBOARD;
	}
}
