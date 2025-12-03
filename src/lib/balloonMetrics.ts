import type { BalloonPoint, BalloonTrack } from "../types/balloons";
import { haversineKm } from "./haversine";
import { detectAnomalies } from "./anomalies";

export function buildTracks(
    allPoints: BalloonPoint[],
): BalloonTrack[] {
    const pointsGroupedByBalloonId = 
        new Map<string, BalloonPoint[]>();
    
    for (const point of allPoints) {
        if (!pointsGroupedByBalloonId.has(point.id)) {
            pointsGroupedByBalloonId.set(point.id, []);
        }

        pointsGroupedByBalloonId
            .get(point.id)!
            .push(point);
    }

    const tracks: BalloonTrack[] = [];

    for (const [balloonId, balloonPoints] of pointsGroupedByBalloonId) {
        if (balloonPoints.length < 2) continue;
        
        balloonPoints.sort(
            (a, b) =>
                a.timestamp.getTime() -
                b.timestamp.getTime(),
        );

        let totalDistanceKm = 0;
        let maxSegmentSpeedKmh = 0;

        for (
            let index = 1;
            index < balloonPoints.length;
            index++
        ) {
            const previousPoint = balloonPoints[index - 1];
            const currentPoint = balloonPoints[index];

            const deltaTimeHours = 
                (currentPoint.timestamp.getTime() - 
                  previousPoint.timestamp.getTime()) /
                (1000 * 60 * 60);

            if (deltaTimeHours <= 0) continue;

            const segmentDistanceKm = haversineKm(
                previousPoint,
                currentPoint,
            );

            const segmentSpeedKmh = 
                segmentDistanceKm / deltaTimeHours;

            totalDistanceKm += segmentDistanceKm;

            if (segmentSpeedKmh > maxSegmentSpeedKmh) {
                maxSegmentSpeedKmh = segmentSpeedKmh
            }
        }

        const totalTrackDurationHours = 
            (balloonPoints[
                balloonPoints.length - 1
            ].timestamp.getTime() - 
             balloonPoints[0].timestamp.getTime()) /
            (1000 * 60 * 60);

        const averageSpeedKmh = 
            totalTrackDurationHours > 0
                ? totalDistanceKm /
                    totalTrackDurationHours
                : 0;

            const anomalies = 
                detectAnomalies(balloonPoints);

            tracks.push({
                id: balloonId,
                points: balloonPoints,
                totalDistanceKm,
                avgSpeedKmh: averageSpeedKmh,
                maxSegmentSpeedKmh,
                anomalies,
            });
    }
    
    return tracks.sort(
        (a, b) => 
            b.totalDistanceKm - a.totalDistanceKm,
    );
}