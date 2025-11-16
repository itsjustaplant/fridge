import { useEffect, useState } from "react";
import { BarcodeScanner, type DetectedBarcode } from "react-barcode-scanner";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { EHTTP_RESPONSES } from "~/types";
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

export function AddCatalogItemDrawer() {
	const [step, setStep] = useState(0);
	const [barcodes, setBarcodes] = useState<DetectedBarcode[]>([]);
	const fetcher = useFetcher();
	const { data: fetcherResponse, state } = fetcher;

	const reset = () => {
		setBarcodes([]);
		setStep(0);
	};

	useEffect(() => {
		if (step === 0) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then()
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
				status === EHTTP_RESPONSES.BAD_REQUEST ||
				status === EHTTP_RESPONSES.NOT_FOUND
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

	useEffect(() => {
		if (state === "submitting") {
			reset();
		}
	}, [state]);

	return (
		<DrawerContent>
			<div className="max-w-md mx-auto overflow-auto">
				<DrawerHeader className="sticky top-0 bg-background">
					<DrawerTitle>Add Catalog Item</DrawerTitle>
					<DrawerDescription className="text-left">
						{step === 0
							? "Scan barcode."
							: "Enter name, manufacturer and category to create new item."}
					</DrawerDescription>
				</DrawerHeader>
				<div className="flex flex-col p-4 pt-0 w-full gap-3 h-full">
					{step === 0 ? (
						<div className="justify-self-center flex items-center justify-center w-full h-[360px]">
							<BarcodeScanner
								options={{ delay: 1000, formats: ["ean_13", "ean_8"] }}
								onCapture={(barcodes) => {
									console.log("hmmm");
									setBarcodes(barcodes);
									setStep(1);
								}}
							/>
						</div>
					) : (
						<fetcher.Form action="/catalog" method="POST">
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
											value={barcodes[0]?.rawValue}
											required
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor={`${ID_PREFIX}-name`}>Name</FieldLabel>
										<Input
											name="name"
											id={`${ID_PREFIX}-name`}
											placeholder="Cream Cheese"
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
											required
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor={`${ID_PREFIX}-category`}>
											Category
										</FieldLabel>
										<Select required name="category">
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
										<DrawerClose asChild>
											<Button type="submit">Submit</Button>
										</DrawerClose>
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
