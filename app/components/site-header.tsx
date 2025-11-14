import { type Icon, IconZoomScan } from "@tabler/icons-react";
import { useLocation } from "react-router";
import { ActionButton } from "~/components/action-button";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";

type TPath = string;
type TActionButtonProperty = {
	text: string;
	Icon: Icon;
};
const ACTION_BUTTON_PROPERTIES_MAP: Record<TPath, TActionButtonProperty> = {
	"/": {
		text: "Scan Product",
		Icon: IconZoomScan,
	},
	"/catalog": {
		text: "Add Barcode",
		Icon: IconZoomScan,
	},
};

const PAGE_TITLE_MAP: Record<TPath, string> = {
	"/": "Inventory",
	"/catalog": "Catalog",
};

export function SiteHeader() {
	const { pathname } = useLocation();
	const { text, Icon } = ACTION_BUTTON_PROPERTIES_MAP[pathname as TPath] || {
		text: "Scan Product",
		Icon: IconZoomScan,
	};
	const pageTitle = PAGE_TITLE_MAP[pathname as TPath];
	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<h1 className="text-base font-medium">{pageTitle}</h1>
				<ActionButton StartIcon={Icon} onClick={() => {}}>
					{text}
				</ActionButton>
			</div>
		</header>
	);
}
