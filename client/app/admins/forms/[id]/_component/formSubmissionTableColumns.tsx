import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { highlight } from "../../../_pages/highlight";
import { Check, UserCheck, UserRoundX, X } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/app/v1/components/ui/tooltip";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/app/v1/components/ui/popover";
import { Button } from "@/app/v1/components/ui/button";
import { Submission } from "./hooks/types";

export type Field = {
    id: string;
    label: string;
    type: string;
    order: number;
};

interface GetColumnsArgs {
    fields: Field[];
    isSignatureRequired?: boolean;
    searchTerm?: string;
    setShowFormSubmission: (show: boolean) => void;
    setSelectedSubmissionId: (id: number | null) => void;
    openHandleDeleteSubmission: (id: number) => void;
    showPendingOnly: boolean;
    onApprovalAction: (id: number, action: "APPROVED" | "REJECTED") => void;
}

export const getFormSubmissionTableColumns = ({
    fields,
    isSignatureRequired,
    searchTerm = "",
    setShowFormSubmission,
    setSelectedSubmissionId,
    openHandleDeleteSubmission,
    showPendingOnly,
    onApprovalAction,
}: GetColumnsArgs): ColumnDef<Submission>[] => {
    // helper to render a popover
    const popoverRenderObj = (val: any) => {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="bg-blue-50 rounded-lg px-2 py-1 border border-blue-200 text-xs text-blue-700 cursor-pointer min-w-12"
                    >
                        {val.length} items
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 max-h-64 flex flex-col justify-center items-center overflow-y-auto border border-slate-200">
                    <div className="flex flex-wrap gap-2 ">
                        {(val as { id: string; name: string }[]).map(
                            (item, idx) => (
                                <div
                                    key={item.id || idx}
                                    className="bg-blue-50 rounded-lg text-blue-600 text-xs px-2 py-1 inline-block border border-blue-200 mb-1"
                                >
                                    {highlight(
                                        item.name || "",
                                        searchTerm || ""
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        );
    };
    const popoverRenderArray = (val: any[]) => {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="bg-blue-50 rounded-lg px-2 py-1 border border-blue-200 text-xs text-blue-700 cursor-pointer min-w-12"
                    >
                        {val.length} items
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 max-h-64 flex flex-col justify-center items-center overflow-y-auto border border-slate-200">
                    <div className="flex flex-wrap gap-2 ">
                        {val.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-blue-50 rounded-lg text-xs text-blue-600 px-2 py-1 inline-block border border-blue-200 mb-1"
                            >
                                {highlight(
                                    item?.toString?.() ?? "",
                                    searchTerm || ""
                                )}
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        );
    };

    // Helper to render a field value
    const renderFieldValue = (val: any, field: Field) => {
        let display: string | number | undefined = val as
            | string
            | number
            | undefined;
        let isArrayOfObjects = false;
        if (val && (field.type === "DATE" || field.type === "TIME")) {
            try {
                if (
                    typeof val === "string" ||
                    typeof val === "number" ||
                    val instanceof Date
                ) {
                    const dateObj = new Date(val);
                    if (!isNaN(dateObj.getTime())) {
                        display = format(dateObj, "P");
                    } else {
                        display = String(val);
                    }
                } else {
                    display = String(val);
                }
            } catch {
                display = String(val);
            }
        } else if (val && field.type === "CHECKBOX") {
            display = val ? "Yes" : "No";
        } else if (Array.isArray(val)) {
            if (
                val.length > 0 &&
                typeof val[0] === "object" &&
                val[0] !== null &&
                "name" in val[0]
            ) {
                isArrayOfObjects = true;
            } else {
                return popoverRenderArray(val);
            }
        } else if (
            val &&
            typeof val === "object" &&
            val !== null &&
            "name" in val
        ) {
            display = (val as { name?: string }).name || "";
        }
        if (isArrayOfObjects && Array.isArray(val)) {
            return popoverRenderObj(val);
        }
        return highlight(display?.toString?.() ?? "", searchTerm || "");
    };

    const baseColumns: ColumnDef<Submission>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => {
                const submission = row.original;
                return (
                    <div className="text-xs text-center">
                        {highlight(submission.id.toString(), searchTerm || "")}
                    </div>
                );
            },
        },

        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => {
                const submission = row.original;
                return (
                    <div className="text-xs text-center">
                        {submission.createdAt
                            ? format(new Date(submission.createdAt), "PPp")
                            : "-"}
                    </div>
                );
            },
        },

        {
            accessorKey: "submittedAt",
            header: "Submitted At",
            cell: ({ row }) => {
                const submission = row.original;
                return (
                    <div className="text-xs text-center">
                        {submission.submittedAt
                            ? format(new Date(submission.submittedAt), "PPp")
                            : "-"}
                    </div>
                );
            },
        },
        {
            accessorKey: "submissionDetails",
            header: "Submitted By",
            cell: ({ row }) => {
                const submission = row.original;
                return (
                    <div className="flex">
                        <div className="text-xs">
                            {highlight(
                                `${submission.User.firstName} ${submission.User.lastName}`,
                                searchTerm || ""
                            )}
                        </div>
                    </div>
                );
            },
        },
    ];

    // Dynamically generate a column for each form field
    const fieldColumns: ColumnDef<Submission>[] = fields.map((field) => ({
        id: `field-${field.id}`,
        header: field.label,
        cell: ({ row }) => {
            const submission = row.original;
            const val =
                submission.data?.[field.id] ?? submission.data?.[field.label];
            return (
                <div className="text-xs text-center">
                    {renderFieldValue(val, field)}
                </div>
            );
        },
    }));

    const restColumns: ColumnDef<Submission>[] = [
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                return (
                    <div className=" text-xs text-center min-w-[50px]">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                {row.original.status === "PENDING" ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-300 rounded-full cursor-pointer font-semibold">
                                        P
                                    </span>
                                ) : row.original.status === "DRAFT" ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-sky-200 rounded-full cursor-pointer font-semibold">
                                        P
                                    </span>
                                ) : row.original.status === "APPROVED" ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-300 rounded-full cursor-pointer font-semibold">
                                        A
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-red-300 rounded-full cursor-pointer font-semibold">
                                        R
                                    </span>
                                )}
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                align="center"
                                className="w-[120px] justify-center"
                            >
                                <div className="text-xs text-center">
                                    {row.original.status === "PENDING"
                                        ? "Pending"
                                        : row.original.status === "DRAFT"
                                        ? "In Progress"
                                        : row.original.status === "APPROVED"
                                        ? "Approved"
                                        : "Rejected"}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            accessorKey: "signature",
            header: "Signature",
            cell: ({ row }) => {
                const submission = row.original;
                const hasSignature =
                    submission.data?.signature || submission.data?.Signature;
                return (
                    <div className="flex justify-center text-xs text-center items-center">
                        {hasSignature ? (
                            // <span className="text-emerald-600 font-bold">Signed</span>
                            <UserCheck className="h-4 w-4 text-emerald-600 " />
                        ) : (
                            <UserRoundX className="h-4 w-4 text-red-600 " />
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const submission = row.original;
                return (
                    <div className="flex flex-row justify-center">
                        {showPendingOnly && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size={"icon"}
                                        variant={"link"}
                                        aria-label="Approve Timesheet"
                                        onClick={() =>
                                            onApprovalAction?.(
                                                submission.id,
                                                "APPROVED"
                                            )
                                        }
                                    >
                                        <Check
                                            className="h-4 w-4 "
                                            color="green"
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    Approve
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {showPendingOnly && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size={"icon"}
                                        variant={"link"}
                                        aria-label="Deny Timesheet"
                                        onClick={() =>
                                            onApprovalAction?.(
                                                submission.id,
                                                "REJECTED"
                                            )
                                        }
                                    >
                                        <X className="h-4 w-4 " color="red" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Deny</TooltipContent>
                            </Tooltip>
                        )}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size={"icon"}
                                    onClick={() => {
                                        setShowFormSubmission(true);
                                        setSelectedSubmissionId(submission.id);
                                    }}
                                >
                                    <img
                                        src="/formEdit.svg"
                                        alt="Edit Form"
                                        className="h-4 w-4 cursor-pointer"
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit Submission</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size={"icon"}
                                    onClick={() => {
                                        openHandleDeleteSubmission(
                                            submission.id
                                        );
                                    }}
                                >
                                    <img
                                        src="/trash-red.svg"
                                        alt="Delete Form"
                                        className="h-4 w-4 cursor-pointer"
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete Submission</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return [...baseColumns, ...fieldColumns, ...restColumns];
};
