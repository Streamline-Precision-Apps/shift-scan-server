export declare function fetchNotificationServiceByUserId(userId: string, resolvedSince?: string): Promise<{
    notifications: ({
        Reads: {
            userId: string;
        }[];
        Response: ({
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: number;
            userId: string;
            notificationId: number;
            response: string | null;
            respondedAt: Date;
        }) | null;
    } & {
        id: number;
        createdAt: Date;
        topic: string | null;
        title: string;
        body: string | null;
        url: string | null;
        metadata: import("../../generated/prisma/runtime/library.js").JsonValue | null;
        pushedAt: Date | null;
        pushAttempts: number;
        readAt: Date | null;
        referenceId: string | null;
    })[];
    count: number;
    resolved: ({
        Reads: {
            userId: string;
        }[];
        Response: ({
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: number;
            userId: string;
            notificationId: number;
            response: string | null;
            respondedAt: Date;
        }) | null;
    } & {
        id: number;
        createdAt: Date;
        topic: string | null;
        title: string;
        body: string | null;
        url: string | null;
        metadata: import("../../generated/prisma/runtime/library.js").JsonValue | null;
        pushedAt: Date | null;
        pushAttempts: number;
        readAt: Date | null;
        referenceId: string | null;
    })[];
    unreadCount: number;
}>;
export declare function getDashboardData(userId: string): Promise<{
    clockedInUsers: number;
    totalPendingTimesheets: number;
    pendingForms: number;
    equipmentAwaitingApproval: number;
    jobsitesAwaitingApproval: number;
}>;
export declare function getUserTopicPreferences(userId: string): Promise<{
    topic: string;
}[]>;
//# sourceMappingURL=adminBaseService.d.ts.map