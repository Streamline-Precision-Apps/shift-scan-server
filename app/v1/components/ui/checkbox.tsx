"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/app/lib/utils/utils";

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  color?: "primary" | "green";
};

function Checkbox({ className, color = "primary", ...props }: CheckboxProps) {
  const colorClasses =
    color === "green"
      ? "peer border-input dark:bg-input/30 data-[state=checked]:bg-green-500 dark:data-[state=checked]:bg-green-500 data-[state=checked]:text-black data-[state=checked]:border-green-600 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-sm border shadow-xs transition-all duration-200 data-[state=checked]:scale-95 data-[state=unchecked]:scale-100 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
      : "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-sm border shadow-xs transition-all duration-200 data-[state=checked]:scale-95 data-[state=unchecked]:scale-100 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50";
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn("base classes here", colorClasses, className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center transition-none"
      >
        <CheckIcon
          className="size-5.5"
          color={color === "green" ? "black" : "white"}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
