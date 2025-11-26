import { WINDBORNE_BASE_URL, HISTORY_HOURS } from "../config/constants";
import type { BalloonPoint } from "../types/balloons";

async function fetchSnapshot(hourIndex: number): Promise<any | null> {
    const hourStr = hourIndex.toString().padStart(2, "0");
    const url = `${WINDBORNE_BASE_URL}/${hourStr}.json`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.warn("Snapshot fetch failed", hourIndex, res.status);
            return null;
        }
        return await res.json();
    }   catch (err) {
        console.error("Snapshot fetch error", hourIndex, err);
        return null;
    }
}

export async function fetchLast24Hours(): Promise<BalloonPoint[]> {
    const now = new Date();

    const snapshots = await Promise.all(
        Array.from({ length: HISTORY_HOURS }, (_, i) => fetchSnapshot(i)),
    );

    const points: BalloonPoint[] = [];

    snapshots.forEach((snapshot, hourIndex) => {
        if (!snapshot) return;

        const timestamp = new Date(now.getTime() - hourIndex * 60 * 60 * 1000);

        const entries = Array.isArray(snapshot)
            ? snapshot 
            : typeof snapshot === "object"
                ? Object.values(snapshot)
                : [];

        for (const raw of entries) {
            try {
                //TODO: adjust these field names after checking 00.json in the browser
                const id =
                    (raw as any).id ??
                    (raw as any).name ??
                    (raw as any).balloon_id ??
                    (raw as any).device_id ??
                    null;
                const lat = Number((raw as any).lat ?? (raw as any).latitude);
                const lon = Number((raw as any).lon ?? (raw as any).longitude);

                if (!id || !Number.isFinite(lat) || !Number.isFinite(lon)) {
                    continue;
                }

                points.push({
                    id: String(id),
                    lat,
                    lon,
                    timestamp
                });
            }   catch {
                continue;
            }
        }
    });

    return points;
}