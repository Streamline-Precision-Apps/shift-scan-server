import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { getApiUrl } from "../utils/api-Utils";

export type PayPeriodTimesheets = {
  startTime: Date;
  endTime: Date;
};

export const usePayPeriodData = (
  setPayPeriodTimeSheets: (
    payPeriodTimeSheets: PayPeriodTimesheets[] | null
  ) => void
) => {
  const user = useUserStore((state) => state.user);
  const userId = user?.id;
  const [payPeriodSheets, setPayPeriodSheets] = useState<PayPeriodTimesheets[]>(
    []
  );
  const storeSetPayPeriodTimeSheets = useUserStore(
    (state) => state.setPayPeriodTimeSheets
  );
  const setSheets = setPayPeriodTimeSheets || storeSetPayPeriodTimeSheets;
  const [pageView, setPageView] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate total pay period hours
  const totalHours = payPeriodSheets.length
    ? payPeriodSheets
        .filter((sheet) => sheet.startTime !== null)
        .reduce(
          (total, sheet) =>
            total +
            (new Date(sheet.endTime).getTime() -
              new Date(sheet.startTime).getTime()) /
              (1000 * 60 * 60),
          0
        )
    : 0;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setPayPeriodSheets([]);
        setSheets([]);
        setPageView(""); // Set to empty string when no user
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const url = getApiUrl();
        // Fetch pay period timesheets with userId in POST body

        const payPeriodResponse = await fetch(
          `${url}/api/v1/pay-period-timesheets`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );
        // Check for valid token (assume 401 or 403 means not authenticated)
        if (
          payPeriodResponse.status === 401 ||
          payPeriodResponse.status === 403
        ) {
          // Not authenticated, silently return
          return;
        }
        const data = await payPeriodResponse.json();
        // Assume data is an array of objects with startTime and endTime as strings
        const transformedData = Array.isArray(data)
          ? data.map((item) => ({
              ...item,
              startTime: new Date(item.startTime),
              endTime: new Date(item.endTime),
            }))
          : [];
        setPayPeriodSheets(transformedData);
        setSheets(transformedData);

        // Fetch page view cookie value (RESTful API)

        const pageViewResponse = await fetch(
          `${url}/api/cookies?name=currentPageView`,
          {
            method: "GET",
            credentials: "include", // <--- this is required!
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (
          pageViewResponse.status === 401 ||
          pageViewResponse.status === 403
        ) {
          return;
        }
        if (pageViewResponse.status === 404) {
          setPageView("");
        } else {
          const pageViewData = await pageViewResponse.json();

          setPageView(pageViewData.value || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setPayPeriodTimeSheets, userId]);

  return { payPeriodSheets, pageView, setPageView, loading, totalHours };
};
