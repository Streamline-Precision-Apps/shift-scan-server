"use client";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import QrScanner from "qr-scanner";
import { Capacitor } from "@capacitor/core";
import { CapacitorBarcodeScanner } from "@capacitor/barcode-scanner";

export default function SimpleQr({
  setScannedId,
  setScanned,
  onScanComplete,
  resetOnMount = false,
}: {
  setScanned: Dispatch<SetStateAction<boolean>>;
  setScannedId: Dispatch<SetStateAction<string | null>>;
  onScanComplete?: (scannedId: string) => Promise<void>;
  resetOnMount?: boolean;
}) {
  const native = Capacitor.isNativePlatform();
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const hasScanned = useRef(false);

  // Function to reset the scanner state
  const resetScanner = useCallback(() => {
    hasScanned.current = false;
    if (qrScannerRef.current) {
      qrScannerRef.current
        .start()
        .catch((err) => console.error("Error restarting scanner:", err));
    }
  }, []);

  // Handle scan completion (shared between native and web)
  const handleScanCompletion = useCallback(
    async (data: string) => {
      if (data && !hasScanned.current) {
        hasScanned.current = true;
        setScannedId(data);
        setScanned(true);

        if (onScanComplete && hasScanned.current) {
          await onScanComplete(data);
        }

        // Stop the scanner immediately after a successful scan
        qrScannerRef.current?.stop();
      }
    },
    [setScanned, setScannedId, onScanComplete]
  );

  // Native barcode scanner
  const startNativeScanner = useCallback(async () => {
    try {
      // Start the native barcode scanner (QR code only)
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: 0, // QR_CODE
      });

      if (result.ScanResult) {
        await handleScanCompletion(result.ScanResult);
      }
    } catch (error) {
      console.error("Native scanner error:", error);
      hasScanned.current = false; // Reset on error
    }
  }, [handleScanCompletion]);

  const handleScanSuccess = useCallback(
    async (result: QrScanner.ScanResult) => {
      try {
        const { data } = result;
        await handleScanCompletion(data);
      } catch (error) {
        console.error("Error processing scanned data:", error);
        hasScanned.current = false; // Reset on error
      }
    },
    [handleScanCompletion]
  );

  useEffect(() => {
    if (native) {
      // Use native barcode scanner
      startNativeScanner();
    } else {
      // Use web-based QR scanner
      if (videoRef.current) {
        const videoElement = videoRef.current;

        // Initialize the QR scanner with a callback that saves scanned data
        const scanner = new QrScanner(videoElement, handleScanSuccess, {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true,
          preferredCamera: "environment",
          calculateScanRegion: (video) => {
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            const regionWidth = videoWidth * 0.3; // 80% of the video width
            const regionHeight = videoHeight * 0.5; // 80% of the video height
            const x = (videoWidth - regionWidth) / 2; // Center the region horizontally
            const y = (videoHeight - regionHeight) / 2; // Center the region vertically
            return {
              x,
              y,
              width: regionWidth,
              height: regionHeight,
              downScaledWidth: 400,
              downScaledHeight: 400,
            };
          },
        });

        qrScannerRef.current = scanner;

        // Check for camera availability before starting
        QrScanner.hasCamera().then((hasCamera) => {
          if (hasCamera) {
            scanner.start().catch((err) => {
              if (err.name !== "AbortError") {
                console.error("Error starting scanner:", err);
              }
            });
          } else {
            console.error("No camera found");
          }
        });

        // Clean up: stop the scanner when the component unmounts
        return () => {
          try {
            qrScannerRef.current?.stop();
          } catch (err) {
            if (err instanceof Error && err.name !== "AbortError") {
              console.error("Error stopping scanner:", err);
            }
          }
        };
      }
    }
  }, [native, handleScanSuccess, startNativeScanner]);

  // Reset scanner on component mount if resetOnMount is true
  useEffect(() => {
    if (resetOnMount) {
      resetScanner();
    }
  }, [resetOnMount, resetScanner]);

  return (
    <>
      {native ? (
        <div className="w-full h-full rounded-[10px] border-[3px] border-black bg-black bg-opacity-85 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-lg font-semibold">
              Scanning with native camera...
            </p>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full rounded-[10px] border-[3px] border-black bg-black bg-opacity-85  object-cover"
          aria-label="QR scanner video stream"
        >
          Video stream not available. Please enable your camera.
        </video>
      )}
    </>
  );
}
