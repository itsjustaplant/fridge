import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	type UniqueIdentifier,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	IconDotsVertical,
	IconGlass,
	IconPencil,
	IconToolsKitchen2,
	IconTrashX,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type Row,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { useAtom } from "jotai";
import * as React from "react";
import { useEffect } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import {
	drawerDataAtom,
	drawerKeyAtom,
	drawerVisibilityAtom,
} from "~/atoms/drawerAtom";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { EDrawerContent, EHTTPResponse, type TProductItem } from "~/types";

export const schema = z.object({
	barcode: z.string(),
	name: z.string(),
	manufacturer: z.string(),
	category: z.string(),
	amount: z.number(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
	{
		accessorKey: "barcode",
		header: "Barcode",
		cell: ({ row }) => {
			return <span>{row.original.barcode}</span>;
		},
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			return <span>{row.original.name}</span>;
		},
		enableHiding: false,
	},
	{
		accessorKey: "manufacturer",
		header: "Manufacturer",
		cell: ({ row }) => {
			return <span>{row.original.manufacturer}</span>;
		},
		enableHiding: false,
	},
	{
		accessorKey: "category",
		header: "Category",
		cell: ({ row }) => {
			return <span>{row.original.category}</span>;
		},
		enableHiding: false,
	},
	{
		accessorKey: "amount",
		header: "Count",
		cell: ({ row }) => {
			return <span>{row.original.amount}</span>;
		},
		enableHiding: false,
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row, table }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
						size="icon"
					>
						<IconDotsVertical />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-32">
					<DropdownMenuItem
						onSelect={() => {
							table?.options?.meta?.handleEdit?.(row?.original);
						}}
					>
						{row?.original?.category === "Drink" ? (
							<IconGlass />
						) : (
							<IconToolsKitchen2 />
						)}
						{row?.original?.category === "Drink" ? "Drink" : "Eat"}
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={() => {
							table?.options?.meta?.handleEdit?.(row?.original);
						}}
					>
						<IconPencil />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						onSelect={() =>
							table?.options?.meta?.handleDelete?.(row.original.barcode)
						}
					>
						<IconTrashX />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		id: row.original.barcode,
	});

	return (
		<TableRow
			data-state={row.getIsSelected() && "selected"}
			data-dragging={isDragging}
			ref={setNodeRef}
			className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
			style={{
				transform: CSS.Transform.toString(transform),
				transition: transition,
			}}
		>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}

export function DataTable({
	data: initialData,
}: {
	data: z.infer<typeof schema>[];
}) {
	const [data, setData] = React.useState(() => initialData);
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const sortableId = React.useId();
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {}),
	);
	const fetcher = useFetcher();
	const [, setDrawerKey] = useAtom(drawerKeyAtom);
	const [, setDrawerVisibility] = useAtom(drawerVisibilityAtom);
	const [, setDrawerData] = useAtom(drawerDataAtom);

	const dataIds = React.useMemo<UniqueIdentifier[]>(
		() => data?.map(({ barcode }) => barcode) || [],
		[data],
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
		getRowId: (row) => row.barcode.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		meta: {
			handleDelete: handleDelete,
			handleEdit: handleEdit,
		},
	});

	useEffect(() => {
		setData(initialData);
	}, [initialData]);

	const { data: fetcherResponse, state } = fetcher;

	useEffect(() => {
		if (
			state === "idle" &&
			fetcherResponse &&
			fetcherResponse?.message &&
			fetcherResponse?.status
		) {
			const { message, status } = fetcherResponse;
			if (
				status === EHTTPResponse.BAD_REQUEST ||
				status === EHTTPResponse.NOT_FOUND
			) {
				toast.error(message);
			} else {
				toast.success(message);
			}
		}
	}, [
		fetcherResponse,
		fetcherResponse?.message,
		fetcherResponse?.status,
		state,
	]);

	async function handleDelete(id: string) {
		if (data) {
			await fetcher.submit(
				{ barcode: id },
				{ method: "DELETE", action: "/inventory" },
			);
		}
	}

	function handleEdit(data: TProductItem) {
		setDrawerKey(EDrawerContent.EDIT_CATALOG_ITEM_DRAWER);
		setDrawerVisibility(true);
		setDrawerData(data);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			setData((data) => {
				const oldIndex = dataIds.indexOf(active.id);
				const newIndex = dataIds.indexOf(over.id);
				return arrayMove(data, oldIndex, newIndex);
			});
		}
	}

	return (
		<div className="flex items-center justify-between px-4 log:px-6 w-full">
			<div className="overflow-hidden rounded-lg border w-full">
				<DndContext
					collisionDetection={closestCenter}
					modifiers={[restrictToVerticalAxis]}
					onDragEnd={handleDragEnd}
					sensors={sensors}
					id={sortableId}
				>
					<Table>
						<TableHeader className="bg-muted sticky top-0 z-10">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className="**:data-[slot=table-cell]:first:w-8">
							{table.getRowModel().rows?.length ? (
								<SortableContext
									items={dataIds}
									strategy={verticalListSortingStrategy}
								>
									{table.getRowModel().rows.map((row) => (
										<DraggableRow key={row.id} row={row} />
									))}
								</SortableContext>
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</DndContext>
			</div>
		</div>
	);
}
