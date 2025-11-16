"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";

export function BarcodeScanner({
	onDetected,
}: {
	onDetected?: (code: string) => void;
}) {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [scanning, setScanning] = useState(false);

	useEffect(() => {
		const reader = new BrowserMultiFormatReader();

		async function startScanner() {
			try {
				setScanning(true);
				const videoInputDevices =
					await BrowserMultiFormatReader.listVideoInputDevices();

				if (videoInputDevices.length === 0) {
					setError("No camera found.");
					return;
				}

				await reader.decodeFromVideoDevice(
					videoInputDevices[0].deviceId,
					videoRef.current!,
					(result, err) => {
						if (result) {
							onDetected?.(result.getText());
						}
						if (err) {
							console.error(err);
						}
					},
				);
			} catch (e: any) {
				setError(e.message || "Failed to start scanner.");
			}
		}

		startScanner();

		return () => {};
	}, [onDetected]);

	return (
		<div className="flex flex-col items-center gap-2">
			{error && <p className="text-red-500">{error}</p>}
			<video
				ref={videoRef}
				className="w-full max-w-sm rounded border border-border"
				autoPlay
			/>
			{scanning ? (
				<p className="text-sm text-muted-foreground">Scanning…</p>
			) : (
				<p className="text-sm text-muted-foreground">Starting camera…</p>
			)}
		</div>
	);
}
