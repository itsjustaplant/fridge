import type { RowData } from "@tanstack/react-table";
import type { SVGAttributes } from "react";

export type TIconProps = Partial<SVGAttributes<SVGElement>> & {
	ariaLabel: string;
};

export type TProductCatalog = {
	barcode: string;
	name: string;
	manufacturer: string;
	category: string;
};

declare module "@tanstack/table-core" {
	interface TableMeta<TData extends RowData> {
		handleDelete: (id: string) => void;
		handleEdit: (data: TProductCatalog) => void;
	}
}

export enum EHTTPResponse {
	OK = 200,
	BAD_REQUEST = 400,
	NOT_FOUND = 404,
}

export enum EDrawerContent {
	ADD_CATALOG_ITEM_DRAWER,
	EDIT_CATALOG_ITEM_DRAWER,
	ADD_ITEM_DRAWER,
	EDIT_ITEM_DRAWER,
}

export enum EDrawerMode {
	EDIT,
	ADD,
}
