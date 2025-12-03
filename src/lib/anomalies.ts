import type { BalloonPoint } from "../types/balloons";
import { MAX_ANOMALY_SPEED_KMH } from "../config/constants";
import { haversineKm } from "./haversine";

export function detectAnomalies(points: BalloonPoint[]): string[] {
    const anomalies: string[] = [];
    if (points.length < 2) return anomalies;

    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];

        const deltaTimeHours =
            (curr.timestamp.getTime() - prev.timestamp.getTime()) /
            (1000 * 60 * 60);
        if (deltaTimeHours <= 0) continue;

        const segmentDistanceKm = haversineKm(
            prev,
            curr,
        );

        const segmentSpeedKmh =
            segmentDistanceKm / deltaTimeHours;
        
        if (segmentSpeedKmh > MAX_ANOMALY_SPEED_KMH) {
            anomalies.push(
                `Unusually high segment speed: ${segmentSpeedKmh.toFixed(
                    1,
                )} km/h`,
            );
        }

        if (segmentDistanceKm < 1 && deltaTimeHours >= 3) {
            anomalies.push("Minimal movement for >= 3 hours");
        }
    }

    return anomalies;
}