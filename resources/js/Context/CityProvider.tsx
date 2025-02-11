import {
    useContext,
    createContext,
    type PropsWithChildren,
    useState, useEffect, useMemo
} from 'react';
import { useGeography } from "@/Hooks/useGeography";

const CityContext = createContext<any>({
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

export function CityProvider({ children }: PropsWithChildren) {
    const [city, setCity] = useState<string>('');
    const cityUrl = useMemo(() => {
        let url = BASE_URL;
        if (city.length > 0) {
            url += `&search=${city}`;
        }
        return url;
    }, [city]);

    const {
        currentPage,
        totalPages,
        isLoading,
        data,
        loadMoreCities,
        fetchData,
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
