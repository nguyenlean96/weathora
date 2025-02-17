import {
    useContext,
    createContext,
    type PropsWithChildren,
    useState,
    useEffect,
    useMemo,
    useReducer,
} from 'react';
import { useGeography } from "@/Hooks/useGeography";
import { useWeatherData } from '@/Hooks';

const CityContext = createContext<any>({
    location: {
        city: null,
        lat: null,
        lon: null,
    },
    location_timezone_offset: 0,
    fetchWeatherData: ({ city, lat, lon }: { city: string; lat: number; lon: number }) => { },
    currentPage: 1,
    totalPages: 1,
    selectedCity: '',
    setSelectedCity: (city: string) => { },
    isLoading: false,
    hasMore: false,
    cities: [],
    fetchData: () => { }
});

export function useCity() {
    const value = useContext(CityContext);

    if (!value) {
        throw new Error('useCity must be used within a CityProvider');
    }

    return value;
}

const BASE_URL = route('api.v1.cities') + '?limit=20';

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

export function CityProvider({ children }: PropsWithChildren) {
    const [city, setCity] = useState<string>('');
    const [location, dispatchLocationResolver] = useReducer(locationResolver, {
        city: null,
        lat: null,
        lon: null,
    });

    const fetchWeatherData = ({ city, lat, lon }: { city: string; lat: number; lon: number }) => {
        dispatchLocationResolver({ type: 'SET_LOCATION', city, lat, lon });
    }

    const cityUrl = useMemo(() => {
        let url = BASE_URL;
        if (city.length > 0) {
            url += `&search=${String(city).trim().toLowerCase().replace(' ', '%20')}`;
        }
        return url;
    }, [city]);

    const {
        currentPage,
        totalPages,
        isLoading,
        data,
        loadMoreCities,
        pendingReset,
        reset,
    } = useGeography(cityUrl);

    const hasMore = useMemo(() => {
        return currentPage < totalPages;
    }, [currentPage, totalPages, isLoading]);

    useEffect(() => {
        reset();
    }, [city])

    return (
        <CityContext.Provider value={{
            location,
            fetchWeatherData,
            currentPage,
            totalPages,
            hasMore,
            isLoading: isLoading || pendingReset,
            city,
            setCity,
            data,
            fetchData: loadMoreCities
        }}>
            {children}
        </CityContext.Provider>
    )
}
