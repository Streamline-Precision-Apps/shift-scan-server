import type { Location } from "../types/Location.js";
export declare function fetchLatestLocation(userId: string): Promise<Location | null>;
export declare function fetchLocationHistory(userId: string): Promise<Location[]>;
export declare function fetchAllUsersLatestLocations(): Promise<Array<{
    userId: string;
    location: Location;
    userName?: string;
}>>;
export declare function validateLocationPayload(payload: Partial<Location>): string | null;
export declare function saveUserLocation(userId: string, sessionId: number, coords: Location["coords"], device?: Location["device"]): Promise<boolean>;
//# sourceMappingURL=locationService.d.ts.map