export type BalloonPoint = {
    id: string;
    lat: number;
    lon: number;
    timestamp: Date;
};

export type BalloonTrack = {
    id: string;
    points: BalloonPoint[];
    totalDistanceKm: number;
    avgSpeedKmh: number;
    maxSegmentSpeedKmh: number;
    anomalies: string[];
};