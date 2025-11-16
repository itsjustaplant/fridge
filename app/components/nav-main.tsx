import type { Icon } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
	}[];
}) {
	const navigate = useNavigate();

	const handleClick = (url: string) => {
		console.log(url);
		navigate(url);
	};

	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								className={cn("cursor-pointer")}
								tooltip={item.title}
								onClick={() => handleClick(item.url)}
							>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
