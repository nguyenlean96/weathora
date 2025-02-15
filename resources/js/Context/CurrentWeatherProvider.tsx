import { useWeatherData } from '@/Hooks/useWeather';
import {
    useContext, createContext,
    type PropsWithChildren,
    useMemo
} from 'react';
import { useWeatherContext } from './WeatherDataProvider';

const CurrentWeatherContext = createContext<any>(null);

export function useCurrentWeather() {
    const value = useContext(CurrentWeatherContext);

    if (!value) {
        throw new Error('useCurrentWeather must be used within a CurrentWeatherProvider');
    }

    return value;
}

export default function CurrentWeatherProvider({ children }: PropsWithChildren) {
    const { cityWeather } = useWeatherContext();
    const { loading, data, fetcher } = useWeatherData(cityWeather);

    const localTime = useMemo(() => {
        if (loading) {
            return null;
        }

        const { timezone } = data || {};

        if (!timezone) {
            return null;
        }

        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + (timezone * 1000));
    }, [data, loading]);

    const sunriseDateTime = useMemo(() => {
        if (loading) {
            return null;
        }

        if (!data) {
            return null;
        }

        if (!data?.sys) {
            return null;
        }

        const { sunrise } = data?.sys || {};
        const { timezone } = data || {};

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

        if (!data) {
            return null;
        }

        if (!data?.sys) {
            return null;
        }

        const { sunset } = data?.sys || {};
        const { timezone } = data || {};

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

        if (!data) {
            return 0;
        }

        if (!data?.sys) {
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

    return (
        <CurrentWeatherContext.Provider value={{
            loading,
            data,
            localTime,
            sunriseDateTime,
            sunsetDateTime,
            lightCycle,
            fetcher
        }}>
            {children}
        </CurrentWeatherContext.Provider>
    );
}
