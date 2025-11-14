import type { Icon } from "@tabler/icons-react";
import type { PropsWithChildren } from "react";
import { Button } from "./ui/button";

type TActionButtonProps = {
	onClick: () => void;
	StartIcon?: Icon;
};
export function ActionButton({
	onClick,
	StartIcon,
	children,
}: PropsWithChildren<TActionButtonProps>) {
	return (
		<Button
			className="ml-auto bg-gradient-to-b from-[#888] to-[#000]"
			size="sm"
			onClick={onClick}
		>
			{StartIcon && <StartIcon />}
			{children}
		</Button>
	);
}
