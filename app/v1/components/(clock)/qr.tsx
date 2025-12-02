"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import QrScanner from "qr-scanner";
import { useRouter } from "next/navigation";
import { useProfitStore } from "@/app/lib/store/profitStore";
import { useEQScanData } from "@/app/lib/context/equipmentContext";
import { Capacitor } from "@capacitor/core";
import { CapacitorBarcodeScanner } from "@capacitor/barcode-scanner";

type Option = {
  id: string;
  label: string;
  code: string;
};

type QrReaderProps = {
  handleScanJobsite?: (type: string) => void;
  url: string;
  clockInRole: string | undefined;
  type: string;
  handleNextStep: () => void;
  startCamera: boolean;
  setStartCamera: React.Dispatch<React.SetStateAction<boolean>>;
  setFailedToScan: React.Dispatch<React.SetStateAction<boolean>>;
  setJobsite: React.Dispatch<React.SetStateAction<Option>>;
};

export default function QR({
  handleScanJobsite,
  url,
  clockInRole,
  type,
  handleNextStep,
  startCamera,
  setStartCamera,
  setFailedToScan,
  setJobsite,
}: QrReaderProps) {
  const native = Capacitor.isNativePlatform();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const router = useRouter();

  // Custom hooks
  const { jobsites: jobsiteResults } = useProfitStore();

  const { setscanEQResult } = useEQScanData();

  // Performance patch: Override getContext to add willReadFrequently for 2d contexts
  useEffect(() => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      options?: CanvasRenderingContext2DSettings
    ) {
      if (type === "2d") {
        options = { ...options, willReadFrequently: true };
      }
      return originalGetContext.call(this, type, options);
    } as typeof originalGetContext;
    return () => {
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    };
  }, []);

  // Constants
  const SCAN_THRESHOLD = 200;

  // Helper function to process scan data (shared between native and web)
  const processScanData = useCallback(
    (data: string) => {
      if (!data || typeof data !== "string" || data.trim() === "") {
        return;
      }

      // Validate QR code against jobsite results
      const matchedJobsite = jobsiteResults?.find(
        (j) => j.qrId.toLowerCase() === data.toLowerCase()
      );

      if (!matchedJobsite) {
        console.error("Error: QR code not found in jobsiteResults", data);
        throw new Error("Invalid QR code Scanned!");
      }

      if (type === "equipment") {
        setscanEQResult({ data });
        qrScannerRef.current?.stop();
        handleNextStep();
        handleNextStep();
      } else {
        setJobsite({
          id: matchedJobsite.id,
          label: matchedJobsite.name,
          code: matchedJobsite.qrId,
        });
        qrScannerRef.current?.stop();
        if (handleScanJobsite) {
          handleScanJobsite(clockInRole || "");
        }
      }
    },
    [
      jobsiteResults,
      type,
      setscanEQResult,
      handleNextStep,
      setJobsite,
      handleScanJobsite,
      clockInRole,
    ]
  );

  // Native barcode scanner
  const startNativeScanner = useCallback(async () => {
    try {
      // Start the native barcode scanner (QR code only)
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: 0, // QR_CODE
      });

      if (result.ScanResult) {
        processScanData(result.ScanResult);
      }
    } catch (error) {
      // Handle Promise rejection - empty error object means user cancelled
      if (!error || Object.keys(error as object).length === 0) {
        // Silently handle user cancellation (empty error object)
        setStartCamera(false);
        return;
      }

      // Check if the error is due to user cancellation
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isCancelled =
        errorMessage.includes("cancelled") ||
        errorMessage.includes("Cancelled") ||
        errorMessage.includes("User cancelled") ||
        (error as any)?.message?.includes("cancelled");

      // Only show error UI if it's not a user cancellation
      if (!isCancelled) {
        console.error("Native scanner error:", errorMessage);
        setFailedToScan(true);
      }

      // Always stop the camera on any exception
      setStartCamera(false);
    }
  }, [processScanData, setStartCamera, setFailedToScan]);

  // ------------------- Different scan processes below ----------------------------
  const processEquipmentScan = useCallback(
    (data: string) => {
      setscanEQResult({ data });
      qrScannerRef.current?.stop();
      handleNextStep();
    },
    [setscanEQResult, handleNextStep]
  );

  // In your QR component (qr-handler.tsx), update the processGeneralScan function:
  const processGeneralScan = useCallback(
    (data: string) => {
      // Find the matching jobsite from the jobsiteResults (case-insensitive)
      const matchedJobsite = jobsiteResults?.find(
        (j) => j.qrId.toLowerCase() === data.toLowerCase()
      );
      if (matchedJobsite) {
        setJobsite({
          id: matchedJobsite.id, // Add the id
          label: matchedJobsite.name, // Add the label
          code: matchedJobsite.qrId, // Add the code (id)
        });
        qrScannerRef.current?.stop();
        if (handleScanJobsite) {
          handleScanJobsite(clockInRole || "");
        }
      } else {
        console.error("Error: Invalid QR code Scanned!", data);
        throw new Error("Invalid QR code Scanned!");
      }
    },
    [jobsiteResults, handleScanJobsite, clockInRole]
  );

  // ----------------------- End of scan processes -------------------------

  const handleScanSuccess = useCallback(
    (result: QrScanner.ScanResult) => {
      try {
        const { data } = result;
        processScanData(data);
      } catch (error) {
        // Check if this is a validation error (invalid QR code) vs actual error
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const isValidationError = errorMessage.includes("Invalid QR code");

        if (errorMessage.trim() !== "" && errorMessage !== "{}") {
          console.error("QR Code Processing Error:", errorMessage);
        }
        qrScannerRef.current?.stop();
        setStartCamera(false);

        // Only show the failed scan UI for validation errors
        if (isValidationError) {
          setFailedToScan(true);
        }
      }
    },
    [processScanData, setStartCamera, setFailedToScan]
  );

  const handleScanFail = useCallback(() => {
    setScanCount((prev) => prev + 1);
  }, []);

  // Effect to handle native scanner on native platforms
  useEffect(() => {
    if (!startCamera) return;

    if (native) {
      // Use native barcode scanner
      startNativeScanner();
    } else {
      // Use web-based QR scanner (existing implementation)
      if (!videoRef.current) return;

      const scanner = new QrScanner(videoRef.current, handleScanSuccess, {
        onDecodeError: handleScanFail,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
        preferredCamera: "environment",
        calculateScanRegion: (video) => {
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
          const squareSize = Math.min(videoWidth, videoHeight) * 0.5;
          const x = (videoWidth - squareSize) / 2;
          const y = (videoHeight - squareSize) / 2;
          return {
            x,
            y,
            width: squareSize,
            height: squareSize,
            downScaledWidth: 400,
            downScaledHeight: 400,
          };
        },
      });

      qrScannerRef.current = scanner;

      QrScanner.hasCamera().then((hasCamera) => {
        if (hasCamera) {
          scanner.start().catch((err) => {
            // Ignore AbortError, which happens when play() is interrupted
            if (err.name === "AbortError") return;
            console.error("Scanner Start Error:", err);
          });
        } else {
          console.error("No camera found");
        }
      });
    }

    return () => {
      qrScannerRef.current?.stop();
    };
  }, [
    native,
    startCamera,
    handleScanSuccess,
    handleScanFail,
    startNativeScanner,
  ]);

  useEffect(() => {
    if (scanCount >= SCAN_THRESHOLD) {
      qrScannerRef.current?.stop();
      setStartCamera(false);
    }
  }, [scanCount, router, setStartCamera]);

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
          className="w-full h-full rounded-[10px] border-[3px] border-black bg-black bg-opacity-85 object-cover"
          aria-label="QR scanner video stream"
        >
          Video stream not available. Please enable your camera.
        </video>
      )}
    </>
  );
}
