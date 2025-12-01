/**
 * Converts a string or Date input to a validated Date object
 * @param input - Date string (ISO format) or Date object
 * @returns Validated Date object
 * @throws Error if the date is invalid
 */
export declare function toDateTime(input: string | Date): Date;
/**
 * Creates a date range object with start and end times for a given date
 * Start is set to beginning of day (00:00:00.000), end to end of day (23:59:59.999)
 * @param dateParam - Date string (YYYY-MM-DD format) or Date object
 * @returns Object with start and end Date objects
 */
export declare function createDateRange(dateParam: string | Date): {
    start: Date;
    end: Date;
};
/**
 * Converts a Date or date string to ISO 8601 format string
 * @param input - Date string or Date object
 * @returns ISO 8601 formatted string
 */
export declare function toISODate(input: string | Date): string;
/**
 * Safely converts optional date input to Date object or null
 * Useful for nullable date fields in database operations
 * @param input - Optional date string or Date object
 * @returns Date object or null
 */
export declare function toOptionalDateTime(input: string | Date | null | undefined): Date | null;
//# sourceMappingURL=dateUtils.d.ts.map