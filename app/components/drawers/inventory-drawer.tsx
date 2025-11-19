import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { BarcodeScanner } from "react-barcode-scanner";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { drawerVisibilityAtom } from "~/atoms/drawerAtom";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";
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
import { Separator } from "../ui/separator";

const ID_PREFIX = "add-inventory-drawer";

export function InventoryDrawer({ mode }: { mode: EDrawerMode }) {
	const isEditMode = mode === EDrawerMode.EDIT;

	const [, setDrawerVisibility] = useAtom(drawerVisibilityAtom);

	const [step, setStep] = useState(0);
	const [barcode, setBarcode] = useState("");
	const [name, setName] = useState("");
	const [manufacturer, setManufacturer] = useState("");
	const [category, setCategory] = useState("");
	const [amount, setAmount] = useState(1);
	const fetcher = useFetcher();
	const isMobile = useIsMobile();

	const { data: fetcherResponse, state } = fetcher;

	const reset = useCallback(() => {
		setBarcode("");
		setName("");
		setAmount(1);
		setManufacturer("");
		setCategory("");
		setStep(0);
	}, []);

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
		setDrawerVisibility,
	]);

	useEffect(() => {
		if (state === "submitting") {
			reset();
		}
	}, [state, reset]);

	useEffect(() => {
		if (fetcherResponse?.results && fetcherResponse.results.length > 0) {
			setBarcode(fetcherResponse?.results[0]?.barcode);
			setName(fetcherResponse?.results[0]?.name);
			setManufacturer(fetcherResponse?.results[0]?.manufacturer);
			setCategory(fetcherResponse?.results[0]?.category);
		}
	}, [fetcherResponse]);

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
						{isEditMode ? "Edit Inventory Item" : "Add Inventory Item"}
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
					{step === 0 && !isEditMode && (
						<div className="justify-self-center flex items-center justify-center w-full h-[360px]">
							<BarcodeScanner
								options={{ delay: 1000, formats: ["ean_13", "ean_8"] }}
								onCapture={(barcodes) => {
									setBarcode(barcodes?.[0]?.rawValue);
									setStep(2);
								}}
							/>
						</div>
					)}
					{step === 1 && (
						<div>
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
											value={barcode}
											onChange={(e) => setBarcode(e?.target?.value)}
											required
										/>
									</Field>
									<Field orientation="horizontal">
										<Button
											type="submit"
											disabled={!barcode}
											onClick={() => {
												if (!barcode) return;
												fetcher.load(`/inventory/${barcode}`);
												setStep(2);
											}}
										>
											Submit
										</Button>
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
						</div>
					)}
					{step === 2 && (
						<fetcher.Form action="/inventory" method="post">
							<FieldSet>
								<FieldGroup className="!gap-4">
									<Field>
										<FieldLabel htmlFor={`${ID_PREFIX}-barcode`}>
											Barcode
										</FieldLabel>
										<Input
											name="barcode"
											id={`${ID_PREFIX}-barcode`}
											value={barcode}
											readOnly
											required
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor={`${ID_PREFIX}-name`}>Name</FieldLabel>
										<Input
											name="name"
											id={`${ID_PREFIX}-name`}
											value={name}
											readOnly
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
											value={manufacturer}
											readOnly
											required
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor={`${ID_PREFIX}-category`}>
											Category
										</FieldLabel>
										<Input
											name="category"
											id={`${ID_PREFIX}-category`}
											value={category}
											readOnly
											required
										/>
									</Field>
									<Separator />
									<Field>
										<FieldLabel htmlFor={`${ID_PREFIX}-count`}>
											Count
										</FieldLabel>
										<Input
											name="amount"
											id={`${ID_PREFIX}-count`}
											value={amount}
											onChange={(e) => setAmount(Number(e?.target?.value))}
											type="number"
											required
										/>
									</Field>
									<Field orientation="horizontal">
										<Button disabled={amount <= 0} type="submit">
											Submit
										</Button>
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
					)}
				</div>
			</div>
		</DrawerContent>
	);
}
