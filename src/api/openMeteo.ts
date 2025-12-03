import type { CurrentWeather } from "../types/weather";

export async function fetchCurrentWeather(
    lat: number,
    lon: number,
): Promise<CurrentWeather | null> {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", lat.toString());
    url.searchParams.set("longitude", lon.toString());
    url.searchParams.set(
        "current",
        "temperature_2m,wind_speed_10m,wind_direction_10m",
    );

    try {
        const res = await fetch(url.toString());
        if (!res.ok) {
            console.warn("Open-Meteo error", res.status);
            return null;
        }

        const data = await res.json();
        const current = (data as any).current;
        if (!current) return null;

        return {
            temperatureC:
                typeof current.temperature_2m === "number"
                    ? current.temperature_2m
                    : null,
            windSpeedKmh:
                typeof current.wind_direction_10m === "number"
                    ? current.wind_direction_10m
                    : null,
            windDirectionDeg:
                typeof current.wind_direction_10m === "number"
                    ? current.wind_direction_10m
                    : null,
        };
    }   catch (err) {
        console.error("Open-Meteo fetch error", err);
        return null;
    }
}