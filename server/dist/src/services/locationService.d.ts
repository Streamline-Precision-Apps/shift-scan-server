import type { Location } from "../types/Location.js";
export declare function fetchLatestLocation(userId: string, date?: Date): Promise<Location | null>;
export declare function fetchLocationHistory(userId: string, date?: Date): Promise<Location[]>;
export declare function fetchAllUsersLatestLocations(date?: Date): Promise<Array<{
    userId: string;
    location: Location;
    userName?: string;
    profilePicture?: string | undefined;
    phoneNumber?: string | undefined;
    startTime?: string;
    endTime?: string;
}>>;
export declare function validateLocationPayload(payload: Partial<Location>): string | null;
export declare function saveUserClockInLocation(userId: string, sessionId: number, coords: Location["coords"], device?: Location["device"]): Promise<boolean>;
export declare function saveUserClockOutLocation(userId: string, sessionId: number, coords?: Location["coords"], device?: Location["device"]): Promise<boolean>;
//# sourceMappingURL=locationService.d.ts.map