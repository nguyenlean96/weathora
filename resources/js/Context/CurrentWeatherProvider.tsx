import { useWeatherData } from '@/Hooks';
import {
    useContext, createContext,
    type PropsWithChildren,
    useMemo
} from 'react';
import { useCity } from './CityProvider';

const CurrentWeatherContext = createContext<any>(null);

export function useCurrentWeather() {
    const value = useContext(CurrentWeatherContext);

    if (!value) {
        throw new Error('useCurrentWeather must be used within a CurrentWeatherProvider');
    }

    return value;
}

export default function CurrentWeatherProvider({ children }: PropsWithChildren) {
    const { location } = useCity();
    const {
        loading,
        timezone_offset: timezone,
        current_weather: data,
        hourly_forecast,
    }: {
        loading: boolean;
        timezone_offset: number;
        current_weather: ICurrentWeather;
        hourly_forecast: Array<IHourlyForecast>;
    } = useWeatherData(location);

    const localTime = useMemo(() => {
        if (loading) {
            return null;
        }

        if (timezone === null) {
            return null;
        }

        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + ((timezone || 0) * 1000));
    }, [data, loading]);

    const sunriseDateTime = useMemo(() => {
        if (loading) {
            return null;
        }

        if (data === null) {
            return null;
        }

        const { sunrise } = data || {};

        if (!sunrise) {
            return null;
        }

        const sunriseData = new Date(sunrise * 1000);
        const sunriseUTC = sunriseData.getTime() + (sunriseData.getTimezoneOffset() * 60000);

        return new Date(sunriseUTC + (timezone * 1000));
    }, [data, loading]);

    const sunsetDateTime = useMemo(() => {
        if (loading) {
            return null;
        }

        if (data === null) {
            return null;
        }

        const { sunset } = data || {};

        if (!sunset) {
            return null;
        }

        const sunsetData = new Date(sunset * 1000);
        const sunsetUTC = sunsetData.getTime() + (sunsetData.getTimezoneOffset() * 60000);

        return new Date(sunsetUTC + (timezone * 1000));
    }, [data, loading]);

    const lightCycle = useMemo(() => {
        if (loading) {
            return 0;
        }

        if (data === null) {
            return 0;
        }

        if (localTime === null || sunriseDateTime === null || sunsetDateTime === null) {
            return 0;
        }

        const sunriseTime = sunriseDateTime.getTime();
        const sunsetTime = sunsetDateTime.getTime();
        const nowTime = (localTime.getTime()) || 0;

        /**
         *        sunriseTime           nowTime           sunsetTime
         *  * |||||||||||||||.............................|||||
         *  * Display time scale
         *  * 100%         51%                            7%  0%
         *  * Actual time scale
         *  *               0%                            100%
         *
         *  - Calculate the equivalent time to 1 percent from 7% to 51%
         *  - Because this is a revert calculation, where 51% is 0% and 7% is 100%
         *  - 100% to 51% is the time before sunrise, which is negative
         *
         */
        const total = sunsetTime - sunriseTime;
        const fromSunrise = nowTime - sunriseTime;
        const fromSunrisePercent = (fromSunrise / total);

        return fromSunrisePercent;
    }, [data, loading]);

    const { temp_min, temp_max } = useMemo(() => {
        if (loading) {
            return { temp_min: 0, temp_max: 0 };
        }

        if (!hourly_forecast) {
            return { temp_min: 0, temp_max: 0 };
        }

        return {
            temp_min: Math.min(...hourly_forecast.map((hour) => hour.temp)),
            temp_max: Math.max(...hourly_forecast.map((hour) => hour.temp)),
        }
    }, [data, loading]);

    return (
        <CurrentWeatherContext.Provider value={{
            loading,
            data,
            temp_min,
            temp_max,
            localTime,
            sunriseDateTime,
            sunsetDateTime,
            lightCycle,
        }}>
            {children}
        </CurrentWeatherContext.Provider>
    );
}
