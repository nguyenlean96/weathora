import {
    useState,
    createContext,
    useContext,
    useMemo,
    type PropsWithChildren,
} from 'react';
import { useCity } from './CityProvider';

export const WeatherContext = createContext<any>({
    cityWeather: '',
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
    const {location } = useCity();

    const [isFogEffectForcedOn, setIsFogEffectForcedOn] = useState<boolean>(false);
    const [isSunFlareEffectForcedOn, setIsSunFlareEffectForcedOn] = useState<boolean>(false);
    const [isRainEffectForcedOn, setIsRainEffectForcedOn] = useState<boolean>(false);

    const cityWeather = useMemo(() => {
        if (location.city) {
            return location.city;
        }
        return '';
    }, [location.city]);

    return (
        <WeatherContext.Provider
            value={{
                cityWeather,
                isFogEffectForcedOn,
                isSunFlareEffectForcedOn,
                isRainEffectForcedOn,
            }}
        >
            {children}
        </WeatherContext.Provider>
    );
}
