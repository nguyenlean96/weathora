import { useEffect, useMemo, useState } from 'react';

export function useWeatherData(location: { city: string; lat: number; lon: number }) {
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
            const res = await fetch(route('api.v1.openweather.onecall') + `?lat=${lat}&lon=${lon}`);
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
    }, [city, lat, lon]);

    const {
        timezone,
        timezone_offset,
        current,
        minutely,
        hourly,
        daily,
    }: {
        timezone: string;
        timezone_offset: number;
        current: ICurrentWeather;
        minutely: Array<IMinuteForecast>;
        hourly: Array<IHourlyForecast>;
        daily: Array<IDailyForecast>;
    } = useMemo(() => {
        if (!data || loading) {
            return {
                timezone: '',
                timezone_offset: 0,
                current: null,
                minutely: [],
                hourly: [],
                daily: [],
            };
        }

        console.log(data);
        const {
            timezone,
            timezone_offset,
            current,
            minutely,
            hourly,
            daily,
        } = data;

        return {
            timezone,
            timezone_offset,
            current,
            minutely,
            hourly,
            daily,
        };
    }, [data]);

    return {
        loading,
        timezone,
        timezone_offset,
        current_weather: current,
        minutely_forecast: minutely,
        hourly_forecast: hourly,
        daily_forecast: daily,
        fetcher: fetchData,
    };

}
