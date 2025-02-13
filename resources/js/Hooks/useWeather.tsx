import { useEffect, useState } from 'react';

export function useForecastData(city: string) {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        if (loading) {
            return;
        }

        if (city.length === 0) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(route('api.v1.openweather.forecast') + `?location=${city}`);
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
    }, [city]);

    return {
        loading,
        data,
        fetcher: fetchData,
    };
}

export function useWeatherData(city: string) {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            console.log(route('api.v1.openweather.current') + `?location=${city}`);
            const res = await fetch(route('api.v1.openweather.current') + `?location=${city}`);
            const data = await res.json();
            setData(data.data);
        } catch (error) {
            console.error(error);
            setError(error);
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
    }, [city]);

    return {
        loading,
        data,
        fetcher: fetchData,
    };
}
