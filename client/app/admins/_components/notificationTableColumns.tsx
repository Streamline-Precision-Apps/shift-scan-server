import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/app/v1/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/v1/components/ui/tooltip";
import { Check, FileSymlink } from "lucide-react";
import { markBrokenEquipmentNotificationsAsRead } from "@/app/lib/actions/NotificationActions";
import type { AdminNotification } from "@/app/admins/page";

export const notificationTableColumns = (
  setData: React.Dispatch<
    React.SetStateAction<AdminNotification[] | undefined>
  >,
  userId: string
): ColumnDef<AdminNotification>[] => [
  {
    accessorKey: "createdAt",
    header: "Received",
    cell: ({ row }) => (
      <div className="text-xs text-center">
        {row.original.createdAt
          ? format(new Date(row.original.createdAt), "Pp")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "topic",
    header: "Request Type",
    cell: ({ row }) => (
      <div className="text-xs text-center bg-blue-100 text-blue-700 py-1 px-2 rounded-full inline-block min-w-[60px]">
        {row.original.topic === "timecards-changes"
          ? "Modification"
          : row.original.topic === "timecard-submission"
          ? "Approval"
          : row.original.topic === "form-submissions"
          ? "Approval"
          : row.original.topic === "items"
          ? "New Item"
          : row.original.topic === "equipment-break"
          ? "Repair"
          : row.original.topic || "-"}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="truncate max-w-[200px]">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "body",
    header: "Message",
    cell: ({ row }) => (
      <div className="text-xs text-gray-600 truncate max-w-[320px]">
        {row.original.body || "-"}
      </div>
    ),
  },

  {
    accessorKey: "actions",
    header: "Available Actions",
    cell: ({ row }) =>
      row.original.url ? (
        <>
          {row.original.topic === "equipment-break" ? (
            <div className="flex flex-row justify-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={"icon"}
                    onClick={async () => {
                      await markBrokenEquipmentNotificationsAsRead({
                        notificationId: row.original.id,
                        userId,
                      });
                      setData((prev) =>
                        prev?.filter((n) => n.id !== row.original.id)
                      );
                    }}
                  >
                    <Check className="h-4 w-4 cursor-pointer" strokeWidth={2} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Completed Task</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="flex flex-row justify-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size={"icon"} asChild>
                    <Link href={row.original.url}>
                      <FileSymlink
                        className="h-4 w-4 cursor-pointer"
                        strokeWidth={2}
                      />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Start Task</TooltipContent>
              </Tooltip>
            </div>
          )}
        </>
      ) : (
        <span className="text-xs text-gray-400"></span>
      ),
  },
];
