import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { BarcodeScanner, type DetectedBarcode } from "react-barcode-scanner";
import { type HTMLFormMethod, useFetcher } from "react-router";
import { toast } from "sonner";
import { drawerDataAtom, drawerVisibilityAtom } from "~/atoms/drawerAtom";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";
import type { TProductCatalog } from "~/types";
import { EDrawerMode, EHTTPResponse } from "~/types";
import { Button } from "../ui/button";
import {
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "../ui/drawer";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const ID_PREFIX = "add-catalog-drawer";

export function CatalogItemDrawer({ mode }: { mode: EDrawerMode }) {
	const isEditMode = mode === EDrawerMode.EDIT;
	console.log(isEditMode);

	const [, setDrawerVisibility] = useAtom(drawerVisibilityAtom);
	const [drawerData] = useAtom(drawerDataAtom);

	const {
		barcode: originalBarcode,
		name: originalName,
		manufacturer: originalManufacturer,
		category: originalCategory,
	} = drawerData as TProductCatalog;

	const [step, setStep] = useState(0);
	const [barcodes, setBarcodes] = useState<DetectedBarcode[]>([]);
	const [name, setName] = useState("");
	const [manufacturer, setManufacturer] = useState("");
	const [category, setCategory] = useState("");
	const fetcher = useFetcher();
	const isMobile = useIsMobile();

	const method = isEditMode ? "patch" : "post";
	const { data: fetcherResponse, state } = fetcher;

	const reset = useCallback(() => {
		setBarcodes([]);
		setStep(0);
	}, []);

	// make them just one state
	useEffect(() => {
		if (isEditMode) {
			setName(originalName);
		}
	}, [isEditMode, originalName]);

	useEffect(() => {
		if (isEditMode) {
			setManufacturer(originalManufacturer);
		}
	}, [isEditMode, originalManufacturer]);

	useEffect(() => {
		if (isEditMode) {
			setCategory(originalCategory);
		}
	}, [isEditMode, originalCategory]);

	useEffect(() => {
		if (step === 0) {
			navigator.mediaDevices
				.enumerateDevices()
				.then((devices) => {
					const hasCamera = devices.some((d) => d.kind === "videoinput");
					if (!hasCamera) {
						setStep(1);
					}
				})
				.catch(() => {
					setStep(1);
				});
		}
	}, [step]);

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
			setDrawerVisibility(false);
		}
	}, [
		fetcherResponse,
		fetcherResponse?.message,
		fetcherResponse?.status,
		state,
	]);

	useEffect(() => {
		if (state === "submitting") {
			reset();
		}
	}, [state, reset]);

	return (
		<DrawerContent>
			<div
				className={cn("max-w-md mx-auto", {
					"overflow-auto": isMobile,
					"h-full": !isMobile,
				})}
			>
				<DrawerHeader className="sticky top-0 bg-background">
					<DrawerTitle>
						{isEditMode ? "Edit Catalog Item" : "Add Catalog Item"}
					</DrawerTitle>
					<DrawerDescription className="text-left">
						{step === 0 && !isEditMode
							? "Scan barcode."
							: isEditMode
								? "Edit name, manufacturer or category to edit this item."
								: "Enter name, manufacturer and category to create new item."}
					</DrawerDescription>
				</DrawerHeader>
				<div className="flex flex-col p-4 pt-0 w-full gap-3 h-full">
					{step === 0 && !isEditMode ? (
						<div className="justify-self-center flex items-center justify-center w-full h-[360px]">
							<BarcodeScanner
								options={{ delay: 1000, formats: ["ean_13", "ean_8"] }}
								onCapture={(barcodes) => {
									setBarcodes(barcodes);
									setStep(1);
								}}
							/>
						</div>
					) : (
						<div>
							<fetcher.Form action="/catalog" method={method as HTMLFormMethod}>
								<FieldSet>
									<FieldGroup className="!gap-4">
										<Field>
											<FieldLabel htmlFor={`${ID_PREFIX}-barcode`}>
												Barcode
											</FieldLabel>
											<Input
												name="barcode"
												id={`${ID_PREFIX}-barcode`}
												placeholder="3073781122596"
												value={
													isEditMode ? originalBarcode : barcodes[0]?.rawValue
												}
												readOnly={isEditMode}
												required
											/>
										</Field>
										<Field>
											<FieldLabel htmlFor={`${ID_PREFIX}-name`}>
												Name
											</FieldLabel>
											<Input
												name="name"
												id={`${ID_PREFIX}-name`}
												placeholder="Cream Cheese"
												value={name}
												onChange={(e) => setName(e?.target?.value)}
												required
											/>
											<FieldDescription>
												Enter generic name for the product.
											</FieldDescription>
										</Field>
										<Field>
											<FieldLabel htmlFor={`${ID_PREFIX}-manufacturer`}>
												Manufacturer
											</FieldLabel>
											<Input
												name="manufacturer"
												id={`${ID_PREFIX}-manufacturer`}
												placeholder="La Vache qui rit"
												value={manufacturer}
												onChange={(e) => setManufacturer(e?.target?.value)}
												required
											/>
										</Field>
										<Field>
											<FieldLabel htmlFor={`${ID_PREFIX}-category`}>
												Category
											</FieldLabel>
											<Select
												required
												name="category"
												value={category}
												onValueChange={(value) => setCategory(value)}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectLabel>Category</SelectLabel>
														<SelectItem value="Drinks">Drinks</SelectItem>
														<SelectItem value="Dairy">Dairy</SelectItem>
														<SelectItem value="Fruits">Fruits</SelectItem>
														<SelectItem value="Meat">Meat</SelectItem>
														<SelectItem value="Snacks">Snacks</SelectItem>
														<SelectItem value="Any">Any</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
										</Field>
										<Field orientation="horizontal">
											<Button type="submit">Submit</Button>
											<DrawerClose asChild>
												<Button
													variant="outline"
													type="button"
													onClick={() => {
														reset();
													}}
												>
													Cancel
												</Button>
											</DrawerClose>
										</Field>
									</FieldGroup>
								</FieldSet>
							</fetcher.Form>
						</div>
					)}
				</div>
			</div>
		</DrawerContent>
	);
}
