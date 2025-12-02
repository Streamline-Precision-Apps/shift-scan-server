"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/app/v1/components/ui/dialog";
import { Button } from "@/app/v1/components/ui/button";

import { XIcon } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Checkbox } from "@/app/v1/components/ui/checkbox";
import { useEffect, useMemo, useRef, useState } from "react";

export interface ComboboxOption {
  value: string;
  label: string;
  [key: string]: string | number | boolean | undefined;
}

interface MobileSingleComboboxProps {
  options: ComboboxOption[];
  value: string | string[];
  onChange: (
    value: string | string[],
    option?: ComboboxOption | ComboboxOption[]
  ) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  filterKeys?: string[];
  required?: boolean;
  multiple?: boolean;
}

/**
 * MobileSingleCombobox
 *
 * A mobile-first single-select combobox designed to open a full-screen
 * dialog/modal with a search input so that the mobile keyboard pops up
 * and the user can filter & select an option comfortably.
 */

export function MobileSingleCombobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  disabled = false,
  filterKeys = ["label"],
  required = false,
  multiple = false,
}: MobileSingleComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // For multi-select, track local selection while dialog is open
  const [multiSelected, setMultiSelected] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      if (multiple) {
        setMultiSelected(Array.isArray(value) ? value : value ? [value] : []);
      }
    } else {
      setSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    return options.filter((option) =>
      (filterKeys || ["label"]).some((key) => {
        const valueMatch = key
          .split(".")
          .reduce<unknown>(
            (obj, k) =>
              obj && typeof obj === "object"
                ? (obj as Record<string, unknown>)[k]
                : undefined,
            option
          );
        return (
          (valueMatch ?? "")
            .toString()
            .toLowerCase()
            .indexOf(search.toLowerCase()) !== -1
        );
      })
    );
  }, [options, search, filterKeys]);

  // For single-select, find label; for multi, show count or summary
  const selectedLabel = useMemo(() => {
    if (multiple) {
      if (Array.isArray(value) && value.length > 0) {
        if (value.length === 1) {
          return (
            options.find((o) => o.value === value[0])?.label || placeholder
          );
        }
        return `${value.length} selected`;
      }
      return placeholder;
    }
    return options.find((o) => o.value === value)?.label || placeholder;
  }, [multiple, value, options, placeholder]);

  const showError =
    required &&
    touched &&
    (!value || (Array.isArray(value) && value.length === 0));

  // Handle checkbox toggle for multi-select
  const handleCheckboxChange = (optionValue: string) => {
    setMultiSelected((prev) =>
      prev.includes(optionValue)
        ? prev.filter((v) => v !== optionValue)
        : [...prev, optionValue]
    );
  };

  // Confirm selection for multi-select
  const handleConfirm = () => {
    onChange(
      multiSelected,
      options.filter((o) => multiSelected.includes(o.value))
    );
    setOpen(false);
  };

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-xs font-semibold mb-1`}>{label}</label>
      )}
      <button
        className={`w-full text-left px-3 py-2 rounded border bg-white ${
          showError ? "border-red-500" : "border-input"
        }`}
        type="button"
        disabled={disabled}
        onClick={() => {
          setTouched(true);
          setOpen(true);
        }}
      >
        {selectedLabel}
      </button>

      {/* Dialog used as a full-screen mobile modal */}
      {open && (
        <Dialog open onOpenChange={setOpen}>
          <DialogPortal>
            <DialogOverlay />
            <DialogTitle className="sr-only">{label}</DialogTitle>
            <DialogContent
              className="bg-white-5 w-full h-screen max-w-full rounded-none pt-12 px-0"
              showCloseButton={false}
            >
              <div className="flex flex-col h-full bg-gray-600 rounded-tr-md rounded-tl-md ">
                <div className=" flex items-center gap-2 bg-white  border-b border-gray-300  px-1.5 py-2 rounded-t-md">
                  <input
                    ref={inputRef}
                    className="bg-white flex-1 rounded px-3 py-2 text-sm border"
                    placeholder={`Search ${placeholder}`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      if (multiple) {
                        setSearch("");
                        inputRef.current?.focus();
                      } else {
                        setOpen(false);
                      }
                    }}
                  >
                    <XIcon />
                  </Button>
                </div>
                <div
                  className={`bg-white rounded-md rounded-t-none overflow-auto  h-[calc(96vh-72px)] relative`}
                >
                  {filteredOptions.length === 0 && (
                    <div className="text-sm text-muted-foreground p-2">
                      No options found.
                    </div>
                  )}
                  <ul className="flex flex-col  gap-1 pb-96 p-2 bg-gray-200  ">
                    {filteredOptions.map((option) => (
                      <li key={option.value}>
                        {multiple ? (
                          <label
                            className={`w-full flex items-center gap-2 text-left rounded p-3 bg-white border ${
                              multiSelected.includes(option.value)
                                ? "border-app-green"
                                : "border-slate-200"
                            } hover:bg-muted-foreground/10 cursor-pointer`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleCheckboxChange(option.value);
                            }}
                          >
                            <Checkbox
                              checked={multiSelected.includes(option.value)}
                              color="green"
                              tabIndex={-1}
                              className="mr-2"
                            />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ) : (
                          <button
                            className={`w-full text-left rounded p-3 bg-white border border-slate-200`}
                            onClick={() => {
                              onChange(option.value, option);
                              setOpen(false);
                            }}
                            type="button"
                          >
                            {option.label}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  {/* Confirm button for multi-select - absolute at the bottom */}
                  {multiple && (
                    <div className="sticky bottom-0 left-0 right-0 w-full flex flex-row gap-2 justify-end border-t border-gray-200 bg-white pb-8 pt-4 px-6 z-10">
                      <Button
                        size={"lg"}
                        type="button"
                        variant="outline"
                        className="bg-white border border-gray-200 hover:bg-gray-300 text-gray-800"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size={"lg"}
                        className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                        onClick={handleConfirm}
                        disabled={multiSelected.length === 0 && required}
                      >
                        Confirm
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </div>
  );
}
