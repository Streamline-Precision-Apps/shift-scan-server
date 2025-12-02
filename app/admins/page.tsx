"use client";
import React, { useEffect, useState, useCallback } from "react";
import { PageHeaderContainer } from "./_pages/PageHeaderContainer";
import { NotificationTable } from "./_components/NotificationTable";
import { useUserStore } from "../lib/store/userStore";
import NotificationActionsList from "./_components/NotificationAction";
import { apiRequest } from "../lib/utils/api-Utils";

export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

export type AdminNotification = {
    body: string | null;
    title: string;
    metadata: JsonValue;
    id: number;
    url: string | null;
    createdAt: string;
    topic: string | null;
    pushedAt: string | null;
    pushAttempts: number;
    readAt: string | null;
    referenceId: string | null;
    Response: {
        id: number;
        notificationId: number;
        userId: string;
        response: string | null;
        respondedAt: string;
        user: {
            firstName: string;
            lastName: string;
        };
    } | null;
    Reads: Array<{
        userId: string;
    }>;
};

export type ResolvedNotification = {
    id: number;
    topic: string | null;
    title: string;
    body: string | null;
    url: string | null;
    metadata: JsonValue | null;
    createdAt: string;
    pushedAt: string | null;
    pushAttempts: number;
    readAt: string | null;
    Response: {
        id: number;
        notificationId: number;
        userId: string;
        response: string | null;
        respondedAt: string;
        user: {
            firstName: string;
            lastName: string;
        };
    } | null;
    Reads: Array<{
        userId: string;
    }>;
};

interface FetchNotificationsResponse {
    notifications: AdminNotification[];
    count: number;
    resolved: ResolvedNotification[];
    unreadCount: number;
}

export default function Admins() {
    const [data, setData] = useState<AdminNotification[] | undefined>();
    const [totalCount, setTotalCount] = useState(0);
    const [resolved, setResolved] = useState<
        ResolvedNotification[] | undefined
    >();
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination states for notifications
    const [notificationsPage, setNotificationsPage] = useState(1);
    const [notificationsPageSize, setNotificationsPageSize] = useState(25);

    // Pagination states for resolved
    const [resolvedPage, setResolvedPage] = useState(1);
    const [resolvedPageSize, setResolvedPageSize] = useState(25);
    const { user } = useUserStore();
    const currentUserId = user?.id || "";

    const fetchData = useCallback(async () => {
        // Validate userId before making request
        if (!currentUserId) {
            setError("User ID not available");
            setIsLoading(false);
            return;
        }

        try {
            setError(null);
            setIsRefreshing(true);

            // Calculate date 14 days ago
            const fourteenDaysAgo = new Date();
            fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
            const dateFilter = fourteenDaysAgo.toISOString();

            const res = await apiRequest(
                `/api/v1/admins/notification-center?userId=${currentUserId}&resolvedSince=${dateFilter}`,
                "GET"
            );

            // Type-safe response validation
            const response = res as FetchNotificationsResponse;
            setData(response.notifications || []);
            setTotalCount(response.count || 0);
            setResolved(response.resolved || []);
            setUnreadCount(response.unreadCount || 0);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch notifications";
            console.error("❌ Error refreshing data:", error);
            setError(errorMessage);
            setData([]);
            setResolved([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [currentUserId]);

    // Fetch data when userId is available
    useEffect(() => {
        if (currentUserId) {
            fetchData();
        }
    }, [currentUserId, fetchData]);

    return (
        <div className="flex flex-col h-screen w-full p-4  ">
            {/* Main content goes here */}
            <div className="flex flex-col h-[5vh] w-full">
                <PageHeaderContainer
                    loading={isRefreshing}
                    headerText="Admin Dashboard"
                    descriptionText="Track important updates and manage pending actions in one place."
                    refetch={() => {
                        fetchData();
                    }}
                />
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="flex flex-row h-[90vh] w-full gap-x-4 pt-4 ">
                <NotificationTable
                    userId={currentUserId}
                    data={data || []}
                    setData={setData}
                    totalCount={totalCount}
                    loading={isLoading || isRefreshing}
                    page={notificationsPage}
                    setPage={setNotificationsPage}
                    pageSize={notificationsPageSize}
                    setPageSize={setNotificationsPageSize}
                />
                <NotificationActionsList
                    resolved={resolved}
                    currentUserId={currentUserId}
                    unreadCount={unreadCount}
                    page={resolvedPage}
                    setPage={setResolvedPage}
                    pageSize={resolvedPageSize}
                    setPageSize={setResolvedPageSize}
                />
            </div>
        </div>
    );
}
