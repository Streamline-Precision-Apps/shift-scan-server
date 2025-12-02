import { motion, useAnimation } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { Images } from "../(reusable)/images";
import { Buttons } from "../(reusable)/buttons";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

// Define prop types for flexibility
interface SlidingDivProps extends React.PropsWithChildren {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  confirmationMessage?: string;
}

export default function SlidingDiv({
  children,
  onSwipeLeft,
  onSwipeRight,
  confirmationMessage = "Are you sure you want to delete this item?",
}: SlidingDivProps) {
  // Control animation manually
  const controls = useAnimation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const t = useTranslations("Animations");

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  // Handle delete confirmation
  const handleDelete = () => {
    setShowConfirmation(false);
    if (onSwipeLeft) {
      onSwipeLeft();
    }
  };

  // Detect swipe direction on drag end
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } }
  ) => {
    const threshold = containerWidth * 0.5; // 50% of the container width

    // Swipe Left Event
    if (info.offset.x < -threshold) {
      setShowConfirmation(true);
    }

    // Swipe Right Event (Optional)
    if (info.offset.x > 50) {
      if (onSwipeRight) {
        onSwipeRight();
      }
    }

    // Snap back to original position
    controls.start({ x: 0, transition: { duration: 0.3, ease: "easeOut" } });
  };

  return (
    <>
      <div
        className="w-full h-fit mb-2 bg-app-red rounded-[10px] relative overflow-hidden"
        ref={containerRef}
      >
        {/* Image in Background */}
        <Images
          titleImg={"/trash.svg"}
          titleImgAlt="trash-icon"
          className="absolute top-0 right-2 h-full w-10 p-3 "
        />

        {/* Swipable Motion Div */}
        <motion.div
          drag="x"
          dragConstraints={{ left: -350, right: 0 }} // Drag limits
          dragElastic={0} // No bounce back effect
          animate={controls}
          onDragEnd={handleDragEnd}
          className="relative " // Ensure it stays above the background image
        >
          {children}
        </motion.div>
      </div>

      {/* Confirmation AlertDialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="max-w-[450px] rounded-[10px] w-[90%]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-center">
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-center pb-3">
              {confirmationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex flex-row items-center justify-center gap-4">
            <AlertDialogCancel
              asChild
              className="border-gray-200 hover:bg-white rounded-[10px]"
            >
              <Button
                size={"lg"}
                variant="outline"
                className="bg-gray-200 text-black px-6 py-2 rounded-md mt-0 w-24"
                onClick={() => setShowConfirmation(false)}
              >
                {t("cancel")}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction
              asChild
              className=" bg-red-500 hover:bg-red-600 border-none rounded-[10px] w-24"
              onClick={handleDelete}
            >
              <Button
                size={"lg"}
                variant="destructive"
                className="bg-app-red text-white px-6 py-2 rounded-md"
              >
                {t("delete")}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
