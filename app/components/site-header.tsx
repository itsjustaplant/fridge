import { IconZoomScan } from "@tabler/icons-react";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Button } from "./ui/button";

const ScanButton = () => {
	const handleClick = () => {};
	return (
		<Button
			className="ml-auto bg-gradient-to-b from-[#888] to-[#000]"
			size="sm"
			onClick={handleClick}
		>
			<IconZoomScan />
			Scan
		</Button>
	);
};

export function SiteHeader() {
	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<h1 className="text-base font-medium">Dashboard</h1>
				<ScanButton />
			</div>
		</header>
	);
}
