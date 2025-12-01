
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="23dfd3f2-092d-58f2-b403-b2f8281098e8")}catch(e){}}();
import { isValid, parseISO, startOfDay, endOfDay, formatISO } from "date-fns";
/**
 * Converts a string or Date input to a validated Date object
 * @param input - Date string (ISO format) or Date object
 * @returns Validated Date object
 * @throws Error if the date is invalid
 */
export function toDateTime(input) {
    if (input instanceof Date) {
        if (!isValid(input)) {
            throw new Error(`Invalid date object: ${input}`);
        }
        return input;
    }
    const date = parseISO(input);
    if (!isValid(date)) {
        throw new Error(`Invalid date format: ${input}`);
    }
    return date;
}
/**
 * Creates a date range object with start and end times for a given date
 * Start is set to beginning of day (00:00:00.000), end to end of day (23:59:59.999)
 * @param dateParam - Date string (YYYY-MM-DD format) or Date object
 * @returns Object with start and end Date objects
 */
export function createDateRange(dateParam) {
    const date = toDateTime(dateParam);
    return {
        start: startOfDay(date),
        end: endOfDay(date),
    };
}
/**
 * Converts a Date or date string to ISO 8601 format string
 * @param input - Date string or Date object
 * @returns ISO 8601 formatted string
 */
export function toISODate(input) {
    return formatISO(toDateTime(input));
}
/**
 * Safely converts optional date input to Date object or null
 * Useful for nullable date fields in database operations
 * @param input - Optional date string or Date object
 * @returns Date object or null
 */
export function toOptionalDateTime(input) {
    if (input === null || input === undefined) {
        return null;
    }
    return toDateTime(input);
}
//# sourceMappingURL=dateUtils.js.map
//# debugId=23dfd3f2-092d-58f2-b403-b2f8281098e8
