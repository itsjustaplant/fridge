import { useAtom } from "jotai";
import {
	drawerDataAtom,
	drawerKeyAtom,
	drawerVisibilityAtom,
} from "~/atoms/drawerAtom";
import { EDrawerContent, EDrawerMode } from "~/types";
import { CatalogItemDrawer } from "./drawers/catalog-item-drawer";
import { Drawer } from "./ui/drawer";

const getDrawerProperties = (drawerKey?: EDrawerContent) => {
	switch (drawerKey) {
		case EDrawerContent.ADD_CATALOG_ITEM_DRAWER:
			return {
				Content: CatalogItemDrawer,
				mode: EDrawerMode.ADD,
			};
		case EDrawerContent.EDIT_CATALOG_ITEM_DRAWER:
			return {
				Content: CatalogItemDrawer,
				mode: EDrawerMode.EDIT,
			};
		default:
			return {
				Content: CatalogItemDrawer,
				mode: EDrawerMode.EDIT,
			};
	}
};

export function DrawerWrapper() {
	const [drawerKey, setDrawerKey] = useAtom(drawerKeyAtom);
	const [drawerVisibility, setDrawerVisibility] = useAtom(drawerVisibilityAtom);
	const [, setDrawerData] = useAtom(drawerDataAtom);

	const drawer = getDrawerProperties(drawerKey);
	return (
		<Drawer
			open={drawerVisibility}
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
