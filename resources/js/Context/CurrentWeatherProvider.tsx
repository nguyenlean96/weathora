import { useWeatherData } from '@/Hooks/useWeather';
import { useContext, createContext, type PropsWithChildren, useState, useEffect, useMemo } from 'react';
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
    const { city } = useCity();
    const {loading, data, fetcher} = useWeatherData(city);

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
