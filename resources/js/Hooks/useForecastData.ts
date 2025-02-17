import { useEffect, useState } from 'react';

export function useForecastData(location: { city: string; lat: number; lon: number }) {
    const { city, lat, lon } = location;
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        if (loading) {
            return;
        }

        if (city === null || lat === null || lon === null) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(route('api.v1.openweather.forecast') + `?lat=${lat}&lon=${lon}`);
            const data = await res.json();
            setData(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();

        return () => {
            setData(null);
            setError(null);
        }
    }, [city, lat, lon]);

    return {
        loading,
        data,
        fetcher: fetchData,
    };
}
