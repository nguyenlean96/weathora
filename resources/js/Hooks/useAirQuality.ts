import { useState, useEffect } from 'react';

export function useAirQuality(location: { city: string; lat: number; lon: number; }) {
    const { lat, lon } = location;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>();
    const [error, setError] = useState<any>();

    async function fetchData() {
        if (!location) return;
        setLoading(true);
        await fetch(route('api.v1.openweather.air-pollution') + `?lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then((data) => setData(data.data?.list[0]))
            .catch(setError)
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchData();
    }, [lat, lon]);

    return { loading, data, error };
}
