import { useEffect, useState } from 'react';

export function useForecastData(city: string) {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(route('api.v1.openweather.current', { location: city }));
            const data = await res.json();
            setData(data);
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

    useEffect(() => {
        fetchData();

        return () => {
            setData(null);
            setError(null);
        }
    }, []);

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
            const res = await fetch(route('api.v1.openweather.current', { location: city }));
            const data = await res.json();
            setData(data);
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

    useEffect(() => {
        fetchData();

        return () => {
            setData(null);
            setError(null);
        }
    }, []);

    return {
        loading,
        data,
        fetcher: fetchData,
    };
}
