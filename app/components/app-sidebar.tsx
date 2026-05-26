import {
	IconFridge,
	IconHomeSpark,
	IconListDetails,
} from "@tabler/icons-react";
import type * as React from "react";
import { NavMain } from "~/components/nav-main";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";

export const NAV_MAIN = [
	{
		title: "Dashboard",
		url: "/",
		icon: IconHomeSpark,
	},
	{
		title: "Catalog",
		url: "/catalog",
		icon: IconListDetails,
	},
	{
		title: "Inventory",
		url: "/inventory",
		icon: IconFridge,
	},
];

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
	},
	navMain: NAV_MAIN,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5 overflow-visible hover:!bg-sidebar"
						>
							<div>
								<div className="size-7 flex items-center content-center bg-primary rounded-md p-0.5 shadow-[0_0_70px_14px_rgba(255,212,93,0.9)]">
									<img src="the-duck.png" alt="the duck" />
								</div>
								<span className="text-xl font-semibold font-playfair-800">
									Duck Inc.
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
		</Sidebar>
	);
}
