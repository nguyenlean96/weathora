import {
    useState,
    createContext,
    useContext,
    type PropsWithChildren,
} from 'react';

export const WeatherContext = createContext<any>({
    fetchWeatherData: (city: string) => { },
    isFogEffectForcedOn: false,
    isSunFlareEffectForcedOn: false,
    isRainEffectForcedOn: false,
});

// export useWeatherContext
export function useWeatherContext() {
    const context = useContext(WeatherContext);
    if (context === undefined) {
        throw new Error('useWeatherContext must be used within a WeatherProvider');
    }
    return context;
};

export default function WeatherProvider({ children }: PropsWithChildren) {
    const [cityWeather, setCityWeather] = useState<string>('');

    const [isFogEffectForcedOn, setIsFogEffectForcedOn] = useState<boolean>(false);
    const [isSunFlareEffectForcedOn, setIsSunFlareEffectForcedOn] = useState<boolean>(false);
    const [isRainEffectForcedOn, setIsRainEffectForcedOn] = useState<boolean>(false);

    const fetchWeatherData = (city: string) => {
        setCityWeather((_: string) => city);
    }

    return (
        <WeatherContext.Provider
            value={{
                cityWeather,
                fetchWeatherData,
                isFogEffectForcedOn,
                isSunFlareEffectForcedOn,
                isRainEffectForcedOn,
            }}
        >
            {children}
        </WeatherContext.Provider>
    );
}
