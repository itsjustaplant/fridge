import { useAtom } from "jotai";
import {
	drawerDataAtom,
	drawerKeyAtom,
	drawerVisibilityAtom,
} from "~/atoms/drawerAtom";
import { useIsMobile } from "~/hooks/use-mobile";
import { EDrawerContent, EDrawerMode } from "~/types";
import { CatalogDrawer } from "./drawers/catalog-drawer";
import { InventoryDrawer } from "./drawers/inventory-drawer";
import { Drawer } from "./ui/drawer";

const getDrawerProperties = (drawerKey?: EDrawerContent) => {
	switch (drawerKey) {
		case EDrawerContent.ADD_CATALOG_DRAWER:
			return {
				Content: CatalogDrawer,
				mode: EDrawerMode.ADD,
			};
		case EDrawerContent.EDIT_CATALOG_DRAWER:
			return {
				Content: CatalogDrawer,
				mode: EDrawerMode.EDIT,
			};
		case EDrawerContent.ADD_ITEM_DRAWER:
			return {
				Content: InventoryDrawer,
				mode: EDrawerMode.ADD,
			};
		case EDrawerContent.EDIT_ITEM_DRAWER:
			return {
				Content: InventoryDrawer,
				mode: EDrawerMode.EDIT,
			};
		default:
			return {
				Content: CatalogDrawer,
				mode: EDrawerMode.EDIT,
			};
	}
};

export function DrawerWrapper() {
	const [drawerKey, setDrawerKey] = useAtom(drawerKeyAtom);
	const [drawerVisibility, setDrawerVisibility] = useAtom(drawerVisibilityAtom);
	const [, setDrawerData] = useAtom(drawerDataAtom);
	const isMobile = useIsMobile();

	const drawer = getDrawerProperties(drawerKey);
	return (
		<Drawer
			open={drawerVisibility}
			direction={isMobile ? "bottom" : "right"}
			onClose={() => {
				setDrawerVisibility(false);
				setDrawerKey(undefined);
				setDrawerData({});
			}}
		>
			<drawer.Content mode={drawer.mode} />
		</Drawer>
	);
}
