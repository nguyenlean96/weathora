import {
    useState,
    createContext,
    useContext,
    useReducer,
    type PropsWithChildren,
} from 'react';

export const WeatherContext = createContext<any>({
    location: {
        city: null,
        lat: null,
        lon: null,
    },
    fetchWeatherData: ({ city, lat, lon }: { city: string; lat: number; lon: number }) => { },
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

const locationResolver = (state: any, action: any) => {
    switch (action.type) {
        case 'SET_LOCATION':
            return {
                ...state,
                city: action.city,
                lat: action.lat,
                lon: action.lon,
            };
        case 'SET_LAT':
            return {
                ...state,
                lat: action.lat,
            };

        case 'SET_LON':
            return {
                ...state,
                lon: action.lon,
            };
        case 'SET_CITY':
            return {
                ...state,
                city: action.city,
            };
        case 'RESET_LOCATION':
            return {
                city: null,
                lat: null,
                lon: null,
            };
        default:
            return state;
    }
}

export default function WeatherProvider({ children }: PropsWithChildren) {
    const [location, dispatchLocationResolver] = useReducer(locationResolver, {
        city: null,
        lat: null,
        lon: null,
    });

    const [isFogEffectForcedOn, setIsFogEffectForcedOn] = useState<boolean>(false);
    const [isSunFlareEffectForcedOn, setIsSunFlareEffectForcedOn] = useState<boolean>(false);
    const [isRainEffectForcedOn, setIsRainEffectForcedOn] = useState<boolean>(false);

    const fetchWeatherData = ({ city, lat, lon }: { city: string; lat: number; lon: number }) => {
        dispatchLocationResolver({ type: 'SET_LOCATION', lat, lon });
    }

    return (
        <WeatherContext.Provider
            value={{
                location,
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
