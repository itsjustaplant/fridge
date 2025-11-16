import { useState } from "react";
import { BarcodeScanner, type DetectedBarcode } from "react-barcode-scanner";
import { Button } from "../ui/button";
import {
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
	const [step, newStep] = useState(0);
	const [barcodes, setBarcodes] = useState<DetectedBarcode[]>([]);
	return (
		<DrawerContent>
			<div className="max-w-md mx-auto overflow-auto">
				<DrawerHeader className="sticky top-0 bg-background">
					<DrawerTitle>Add Catalog Item</DrawerTitle>
					<DrawerDescription className="text-left">
						Enter barcode, name, manufacturer and category to create new item.
						{barcodes?.map((barcode) => (
							<span key={barcode?.rawValue}>{barcode?.rawValue}</span>
						))}
					</DrawerDescription>
				</DrawerHeader>
				<div className="flex flex-col p-4 pt-0 w-full gap-3 h-full">
					{step === 0 ? (
						<BarcodeScanner
							options={{ delay: 1000, formats: ["ean_13", "ean_8"] }}
							onCapture={(barcodes) => setBarcodes(barcodes)}
						/>
					) : (
						<form>
							<FieldSet>
								<FieldGroup className="!gap-4">
									<Field>
										<FieldLabel htmlFor={`${ID_PREFIX}-barcode`}>
											Barcode
										</FieldLabel>
										<Input
											id={`${ID_PREFIX}-barcode`}
											placeholder="3073781122596"
											required
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor={`${ID_PREFIX}-name`}>Name</FieldLabel>
										<Input
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
											id={`${ID_PREFIX}-manufacturer`}
											placeholder="La Vache qui rit"
											required
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor={`${ID_PREFIX}-category`}>
											Category
										</FieldLabel>
										<Select required>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Category</SelectLabel>
													<SelectItem value="Dairy">Dairy</SelectItem>
													<SelectItem value="fruits">Fruits</SelectItem>
													<SelectItem value="meat">Meat</SelectItem>
													<SelectItem value="snacks">Snacks</SelectItem>
													<SelectItem value="any">Any</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</Field>
									<Field orientation="horizontal">
										<Button type="submit">Submit</Button>
										<Button variant="outline" type="button">
											Cancel
										</Button>
									</Field>
								</FieldGroup>
							</FieldSet>
						</form>
					)}
				</div>
			</div>
		</DrawerContent>
	);
}
