"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/app/v1/components/ui/input";
import { Label } from "@/app/v1/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/v1/components/ui/popover";
import { format } from "date-fns";

export default function RenderTimeField({
  field,
  value,
  handleFieldChange,
  handleFieldTouch,
  touchedFields,
  error,
}: {
  field: {
    id: string;
    label: string;
    required: boolean;
  };
  value: Date | string | null;
  handleFieldChange: (id: string, value: string | Date | null) => void;
  handleFieldTouch: (id: string) => void;
  touchedFields: Record<string, boolean>;
  error: string | null;
}) {
  // We'll keep local date/time strings and ensure we always have a date portion
  const [dateStr, setDateStr] = React.useState<string>(() => {
    if (!value) return format(new Date(), "yyyy-MM-dd");
    try {
      if (typeof value === "string") {
        // If value contains a date portion (ISO), return that
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
          return value.substring(0, 10);
        }
        // No date, fallback to today
        return format(new Date(), "yyyy-MM-dd");
      }
      return format(value as Date, "yyyy-MM-dd");
    } catch {
      return format(new Date(), "yyyy-MM-dd");
    }
  });

  const [timeStr, setTimeStr] = React.useState<string>(() => {
    if (!value) return "";
    try {
      if (typeof value === "string") {
        // If it's a time string (HH:mm) or includes time after date
        const tMatch = value.match(/(\d{2}:\d{2})/);
        return tMatch ? tMatch[0] : "";
      }
      return format(value as Date, "HH:mm");
    } catch {
      return "";
    }
  });

  // Keep local state in sync when value prop changes
  useEffect(() => {
    if (!value) {
      setDateStr(format(new Date(), "yyyy-MM-dd"));
      setTimeStr("");
      return;
    }
    try {
      if (typeof value === "string") {
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
          setDateStr(value.substring(0, 10));
        } else {
          setDateStr(format(new Date(), "yyyy-MM-dd"));
        }
        const tMatch = value.match(/(\d{2}:\d{2})/);
        setTimeStr(tMatch ? tMatch[0] : "");
      } else {
        setDateStr(format(value as Date, "yyyy-MM-dd"));
        setTimeStr(format(value as Date, "HH:mm"));
      }
    } catch (err) {
      setDateStr(format(new Date(), "yyyy-MM-dd"));
      setTimeStr("");
    }
  }, [value]);

  function combineAndEmit(newDateStr: string, newTimeStr: string) {
    // Ensure we always have a date when emitting
    const datePortion = newDateStr || format(new Date(), "yyyy-MM-dd");
    const timePortion = newTimeStr || "00:00";
    const combined = new Date(`${datePortion}T${timePortion}:00`);
    if (isNaN(combined.getTime())) {
      // If parsing fails, pass null to keep the system stable
      handleFieldChange(field.id, null);
      return;
    }
    handleFieldChange(field.id, combined);
  }

  return (
    <div key={field.id} className="flex flex-col">
      <Label htmlFor={field.id} className="text-sm font-medium mb-1">
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </Label>

      <div className="flex gap-2 items-center">
        <Input
          type="date"
          id={`${field.id}-date`}
          value={dateStr}
          className={`border rounded px-2 py-1 bg-white ${
            error && touchedFields[field.id] ? "border-red-500" : ""
          }`}
          onChange={(e) => {
            const newDate = e.target.value;
            setDateStr(newDate);
            combineAndEmit(newDate, timeStr);
          }}
          onBlur={() => handleFieldTouch(field.id)}
          required={field.required}
        />

        <Input
          type="time"
          id={`${field.id}-time`}
          value={timeStr}
          placeholder="Select time"
          className={`border rounded px-2 py-1 bg-white ${
            error && touchedFields[field.id] ? "border-red-500" : ""
          }`}
          onChange={(e) => {
            const newTime = e.target.value;
            setTimeStr(newTime);
            combineAndEmit(dateStr, newTime);
          }}
          onBlur={() => handleFieldTouch(field.id)}
          required={field.required}
        />
      </div>

      {error && touchedFields[field.id] && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
