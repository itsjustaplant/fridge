import type { SVGAttributes } from "react";

export type TIconProps = Partial<SVGAttributes<SVGElement>> & {
	ariaLabel: string;
};
