import { useWeatherData } from '@/Hooks/useWeather';
import { useContext, createContext, type PropsWithChildren, useState, useEffect, useMemo } from 'react';
import { useCity } from './CityProvider';
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

    return (
        <CurrentWeatherContext.Provider value={{
            loading,
            data,
            fetcher
        }}>
            {children}
        </CurrentWeatherContext.Provider>
    );
}
