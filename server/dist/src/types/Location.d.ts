export interface Location {
    uid: string;
    ts: Date;
    coords: {
        lat: number;
        lng: number;
        accuracy?: number | null;
        speed?: number | null;
        heading?: number | null;
    };
    device?: {
        platform?: string | null;
    };
}
//# sourceMappingURL=Location.d.ts.map