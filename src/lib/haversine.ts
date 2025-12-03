import type { BalloonPoint } from "../types/balloons";

const EARTH_RADIUS_KM = 6371;

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function haversineKm(
    startPoint: BalloonPoint,
    endPoint: BalloonPoint,
): number {
    const deltaLatitudeRad = degreesToRadians(
        endPoint.lat - startPoint.lat,
    );

    const deltaLongitudeRad = degreesToRadians(
        endPoint.lon - startPoint.lon,
    );

    const startLatitudeRad = degreesToRadians(startPoint.lat);
    const endLatitudeRad = degreesToRadians(endPoint.lat);

    const haversineValue =
        Math.sin(deltaLatitudeRad / 2)  ** 2 +
        Math.cos(startLatitudeRad) *
            Math.cos(endLatitudeRad) *
            Math.sin(deltaLongitudeRad / 2) ** 2;

    const centralAngleRad =
        2 *
        Math.atan2(
            Math.sqrt(haversineValue),
            Math.sqrt(1 - haversineValue),
        );

    return EARTH_RADIUS_KM * centralAngleRad
}